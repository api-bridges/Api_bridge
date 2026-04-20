/**
 * nopes v8 — Schema Migration Engine
 *
 * Manages schema evolution over time by defining migration rules between versions.
 * When your API's field names, types, or structure change across versions, the migrator
 * applies transformation rules to upgrade or downgrade data automatically.
 *
 * Features:
 *  - Version-to-version migration definitions
 *  - Forward (upgrade) and backward (downgrade) migration
 *  - Field rename, add, remove, transform rules
 *  - Migration chain resolution (v1 → v2 → v3 in one step)
 *  - Dry-run mode to preview migration effects
 *  - Migration history tracking
 *  - Rollback support
 *  - Schema version detection
 */

class SchemaMigrator {
  /**
   * @param {object} options
   * @param {boolean} options.strictMode    Fail on missing migration paths (default false)
   * @param {boolean} options.trackHistory  Track migration history (default true)
   * @param {number}  options.maxChainLength Maximum migration chain steps (default 20)
   */
  constructor(options = {}) {
    this.strictMode = options.strictMode || false;
    this.trackHistory = options.trackHistory !== false;
    this.maxChainLength = options.maxChainLength || 20;

    // version → { up: { target, rules }, down: { target, rules } }
    this._migrations = new Map();
    this._history = [];
    this._versionDetectors = [];
  }

  /**
   * Define a migration from one version to another.
   *
   * @param {string} fromVersion  Source version
   * @param {string} toVersion    Target version
   * @param {object} rules        Migration rules
   * @param {object}   rules.rename   Field renames: { oldName: newName, ... }
   * @param {object}   rules.add      Fields to add: { fieldName: defaultValue, ... }
   * @param {string[]} rules.remove   Fields to remove
   * @param {object}   rules.transform  Field transformers: { fieldName: (value, data) => newValue, ... }
   * @param {Function} rules.custom    Custom migration function: (data) => migratedData
   * @returns {SchemaMigrator} this (for chaining)
   */
  define(fromVersion, toVersion, rules) {
    const key = String(fromVersion);

    if (!this._migrations.has(key)) {
      this._migrations.set(key, { up: null, down: null });
    }

    this._migrations.get(key).up = {
      target: String(toVersion),
      rules: { ...rules },
    };

    // Register reverse path
    const reverseKey = String(toVersion);
    if (!this._migrations.has(reverseKey)) {
      this._migrations.set(reverseKey, { up: null, down: null });
    }

    this._migrations.get(reverseKey).down = {
      target: key,
      rules: this._invertRules(rules),
    };

    return this;
  }

  /**
   * Register a version detector function.
   *
   * @param {Function} detector  (data) => versionString|null
   * @returns {SchemaMigrator} this
   */
  registerDetector(detector) {
    this._versionDetectors.push(detector);
    return this;
  }

  /**
   * Detect the version of data using registered detectors.
   *
   * @param {object} data  The data to detect version for
   * @returns {string|null} Detected version or null
   */
  detectVersion(data) {
    for (const detector of this._versionDetectors) {
      const version = detector(data);
      if (version !== null && version !== undefined) {
        return String(version);
      }
    }
    return null;
  }

  /**
   * Migrate data from one version to another.
   *
   * @param {object} data         The data to migrate
   * @param {string} fromVersion  Current version
   * @param {string} toVersion    Target version
   * @returns {{ data: object, steps: string[], success: boolean }}
   */
  migrate(data, fromVersion, toVersion) {
    const from = String(fromVersion);
    const to = String(toVersion);

    if (from === to) {
      return { data: { ...data }, steps: [], success: true };
    }

    // Find migration path
    const path = this._findPath(from, to);
    if (!path) {
      if (this.strictMode) {
        throw new Error(`No migration path from ${from} to ${to}`);
      }
      return { data: { ...data }, steps: [], success: false };
    }

    // Apply migrations
    let current = { ...data };
    const steps = [];

    for (const step of path) {
      current = this._applyRules(current, step.rules);
      steps.push(`${step.from} → ${step.to}`);
    }

    if (this.trackHistory) {
      this._history.push({
        from,
        to,
        steps,
        timestamp: new Date().toISOString(),
        fieldCount: Object.keys(data).length,
      });
    }

    return { data: current, steps, success: true };
  }

  /**
   * Dry-run a migration to see what would change.
   *
   * @param {object} data         The data to preview migration for
   * @param {string} fromVersion  Current version
   * @param {string} toVersion    Target version
   * @returns {{ changes: object[], path: string[], possible: boolean }}
   */
  dryRun(data, fromVersion, toVersion) {
    const from = String(fromVersion);
    const to = String(toVersion);
    const path = this._findPath(from, to);

    if (!path) {
      return { changes: [], path: [], possible: false };
    }

    const changes = [];
    let current = { ...data };

    for (const step of path) {
      const before = { ...current };
      current = this._applyRules(current, step.rules);

      // Detect changes
      const allKeys = new Set([...Object.keys(before), ...Object.keys(current)]);
      for (const key of allKeys) {
        if (!(key in before) && key in current) {
          changes.push({ type: 'added', field: key, value: current[key], step: `${step.from} → ${step.to}` });
        } else if (key in before && !(key in current)) {
          changes.push({ type: 'removed', field: key, value: before[key], step: `${step.from} → ${step.to}` });
        } else if (before[key] !== current[key]) {
          changes.push({ type: 'modified', field: key, from: before[key], to: current[key], step: `${step.from} → ${step.to}` });
        }
      }
    }

    return {
      changes,
      path: path.map(s => `${s.from} → ${s.to}`),
      possible: true,
    };
  }

  /**
   * Rollback the last migration.
   *
   * @param {object} data  The data to rollback
   * @returns {{ data: object, success: boolean }}
   */
  rollback(data) {
    if (this._history.length === 0) {
      return { data: { ...data }, success: false };
    }

    const lastMigration = this._history[this._history.length - 1];
    const result = this.migrate(data, lastMigration.to, lastMigration.from);

    if (result.success) {
      this._history.pop(); // Remove the original migration entry
    }

    return result;
  }

  /**
   * Get all registered migration versions.
   */
  getVersions() {
    const versions = new Set();
    for (const [from, migration] of this._migrations) {
      versions.add(from);
      if (migration.up) versions.add(migration.up.target);
      if (migration.down) versions.add(migration.down.target);
    }
    return [...versions].sort();
  }

  /**
   * Get migration history.
   */
  getHistory() {
    return [...this._history];
  }

  /**
   * Get statistics.
   */
  getStats() {
    return {
      totalMigrations: this._migrations.size,
      historyLength: this._history.length,
      versions: this.getVersions(),
    };
  }

  /**
   * Clear all migration definitions and history.
   */
  clear() {
    this._migrations.clear();
    this._history = [];
    this._versionDetectors = [];
  }

  // ─── INTERNAL ──────────────────────────────────────────────────────────

  _findPath(from, to) {
    // BFS to find shortest migration path
    const queue = [{ version: from, path: [] }];
    const visited = new Set([from]);

    while (queue.length > 0) {
      const { version, path } = queue.shift();

      if (path.length >= this.maxChainLength) continue;

      const migration = this._migrations.get(version);
      if (!migration) continue;

      // Try forward migration
      if (migration.up) {
        const nextVersion = migration.up.target;
        const newPath = [...path, { from: version, to: nextVersion, rules: migration.up.rules }];

        if (nextVersion === to) return newPath;

        if (!visited.has(nextVersion)) {
          visited.add(nextVersion);
          queue.push({ version: nextVersion, path: newPath });
        }
      }

      // Try backward migration
      if (migration.down) {
        const prevVersion = migration.down.target;
        const newPath = [...path, { from: version, to: prevVersion, rules: migration.down.rules }];

        if (prevVersion === to) return newPath;

        if (!visited.has(prevVersion)) {
          visited.add(prevVersion);
          queue.push({ version: prevVersion, path: newPath });
        }
      }
    }

    return null;
  }

  _applyRules(data, rules) {
    let result = { ...data };

    // Apply renames
    if (rules.rename) {
      for (const [oldName, newName] of Object.entries(rules.rename)) {
        if (Object.prototype.hasOwnProperty.call(result, oldName)) {
          result[newName] = result[oldName];
          delete result[oldName];
        }
      }
    }

    // Apply additions
    if (rules.add) {
      for (const [field, defaultValue] of Object.entries(rules.add)) {
        if (!Object.prototype.hasOwnProperty.call(result, field)) {
          result[field] = typeof defaultValue === 'function' ? defaultValue(result) : defaultValue;
        }
      }
    }

    // Apply removals
    if (rules.remove) {
      for (const field of rules.remove) {
        delete result[field];
      }
    }

    // Apply transforms
    if (rules.transform) {
      for (const [field, fn] of Object.entries(rules.transform)) {
        if (Object.prototype.hasOwnProperty.call(result, field) && typeof fn === 'function') {
          result[field] = fn(result[field], result);
        }
      }
    }

    // Apply custom migration
    if (typeof rules.custom === 'function') {
      result = rules.custom(result);
    }

    return result;
  }

  _invertRules(rules) {
    const inverted = {};

    // Invert renames
    if (rules.rename) {
      inverted.rename = {};
      for (const [oldName, newName] of Object.entries(rules.rename)) {
        inverted.rename[newName] = oldName;
      }
    }

    // Fields that were added become removed in reverse
    if (rules.add) {
      inverted.remove = Object.keys(rules.add);
    }

    // Fields that were removed get added back with null defaults in reverse
    if (rules.remove) {
      inverted.add = {};
      for (const field of rules.remove) {
        inverted.add[field] = null;
      }
    }

    return inverted;
  }
}

module.exports = { SchemaMigrator };
