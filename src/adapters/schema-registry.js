/**
 * yarou v5 — Schema Registry
 *
 * Centralized, versioned schema storage and retrieval:
 *  - Register schemas with version tags
 *  - Retrieve latest or specific versions
 *  - Schema compatibility checking (forward, backward)
 *  - Schema evolution tracking
 *  - Namespace support for multi-service environments
 *  - Schema search by field name
 *  - Import/export for persistence
 *  - Statistics tracking
 */

const { SchemaRegistryError } = require('../core/errors');

class SchemaRegistry {
  /**
   * @param {object}  options
   * @param {boolean} options.strict             Throw on unknown schema lookups (default false)
   * @param {boolean} options.requireCompatible  Require backward compatibility on registration (default false)
   */
  constructor(options = {}) {
    this.strict = options.strict || false;
    this.requireCompatible = options.requireCompatible || false;

    /**
     * Map<namespace:name, Array<{ version: number, schema: object, createdAt: string, metadata: object }>>
     */
    this._schemas = new Map();

    this._stats = {
      totalRegistrations: 0,
      totalLookups: 0,
      namespacesUsed: new Set(),
    };
  }

  /**
   * Register a schema with an optional namespace and version.
   *
   * @param {string} name       Schema name (e.g. 'User', 'Order')
   * @param {object} schema     The schema definition
   * @param {object} [options]
   * @param {string} [options.namespace]  Namespace for multi-service (default 'default')
   * @param {number} [options.version]    Explicit version number. Auto-increments if omitted.
   * @param {object} [options.metadata]   Additional metadata (author, description, etc.)
   * @returns {{ name: string, namespace: string, version: number }}
   */
  register(name, schema, options = {}) {
    if (!name || typeof name !== 'string') {
      throw new SchemaRegistryError('Schema name must be a non-empty string', name, 'invalid_name');
    }
    if (!schema || typeof schema !== 'object') {
      throw new SchemaRegistryError('Schema must be a non-null object', name, 'invalid_schema');
    }

    const namespace = options.namespace || 'default';
    const key = `${namespace}:${name}`;
    const metadata = options.metadata || {};

    if (!this._schemas.has(key)) {
      this._schemas.set(key, []);
    }

    const versions = this._schemas.get(key);
    const nextVersion = options.version != null ? options.version : versions.length + 1;

    // Backward compatibility check
    if (this.requireCompatible && versions.length > 0) {
      const latest = versions[versions.length - 1].schema;
      const compat = this.checkCompatibility(latest, schema);
      if (!compat.backward) {
        throw new SchemaRegistryError(
          `Schema "${name}" v${nextVersion} is not backward compatible: ${compat.breakingChanges.join(', ')}`,
          name,
          'incompatible',
        );
      }
    }

    versions.push({
      version: nextVersion,
      schema: this._clone(schema),
      createdAt: new Date().toISOString(),
      metadata: { ...metadata },
    });

    this._stats.totalRegistrations++;
    this._stats.namespacesUsed.add(namespace);

    return { name, namespace, version: nextVersion };
  }

  /**
   * Get the latest version of a schema.
   * @param {string} name
   * @param {object} [options]
   * @param {string} [options.namespace]  Namespace (default 'default')
   * @returns {object|null} The schema object, or null if not found
   */
  get(name, options = {}) {
    const namespace = options.namespace || 'default';
    const key = `${namespace}:${name}`;
    this._stats.totalLookups++;

    const versions = this._schemas.get(key);
    if (!versions || versions.length === 0) {
      if (this.strict) {
        throw new SchemaRegistryError(`Schema "${name}" not found in namespace "${namespace}"`, name, 'not_found');
      }
      return null;
    }

    return this._clone(versions[versions.length - 1].schema);
  }

  /**
   * Get a specific version of a schema.
   * @param {string} name
   * @param {number} version
   * @param {object} [options]
   * @param {string} [options.namespace]
   * @returns {object|null}
   */
  getVersion(name, version, options = {}) {
    const namespace = options.namespace || 'default';
    const key = `${namespace}:${name}`;
    this._stats.totalLookups++;

    const versions = this._schemas.get(key);
    if (!versions) {
      if (this.strict) {
        throw new SchemaRegistryError(`Schema "${name}" not found`, name, 'not_found');
      }
      return null;
    }

    const entry = versions.find(v => v.version === version);
    if (!entry) {
      if (this.strict) {
        throw new SchemaRegistryError(`Schema "${name}" version ${version} not found`, name, 'version_not_found');
      }
      return null;
    }

    return this._clone(entry.schema);
  }

  /**
   * List all versions of a schema.
   * @param {string} name
   * @param {object} [options]
   * @param {string} [options.namespace]
   * @returns {Array<{ version: number, createdAt: string, metadata: object }>}
   */
  listVersions(name, options = {}) {
    const namespace = options.namespace || 'default';
    const key = `${namespace}:${name}`;

    const versions = this._schemas.get(key);
    if (!versions) return [];

    return versions.map(v => ({
      version: v.version,
      createdAt: v.createdAt,
      metadata: { ...v.metadata },
    }));
  }

  /**
   * List all registered schema names.
   * @param {object} [options]
   * @param {string} [options.namespace]  Filter by namespace
   * @returns {Array<{ name: string, namespace: string, latestVersion: number }>}
   */
  list(options = {}) {
    const result = [];
    for (const [key, versions] of this._schemas) {
      const [namespace, name] = key.split(':');
      if (options.namespace && namespace !== options.namespace) continue;
      result.push({
        name,
        namespace,
        latestVersion: versions.length > 0 ? versions[versions.length - 1].version : 0,
      });
    }
    return result;
  }

  /**
   * Check compatibility between two schemas.
   * @param {object} oldSchema  Previous schema version
   * @param {object} newSchema  New schema version
   * @returns {{ backward: boolean, forward: boolean, breakingChanges: string[], additions: string[] }}
   */
  checkCompatibility(oldSchema, newSchema) {
    const oldFields = Object.keys(oldSchema || {});
    const newFields = Object.keys(newSchema || {});
    const oldSet = new Set(oldFields);
    const newSet = new Set(newFields);

    const breakingChanges = [];
    const additions = [];

    // Check removed fields (breaking for backward compat)
    for (const field of oldFields) {
      if (!newSet.has(field)) {
        breakingChanges.push(`removed field "${field}"`);
      }
    }

    // Check type changes
    for (const field of oldFields) {
      if (newSet.has(field)) {
        const oldType = oldSchema[field] && oldSchema[field].type;
        const newType = newSchema[field] && newSchema[field].type;
        if (oldType && newType && oldType !== newType) {
          breakingChanges.push(`changed type of "${field}" from "${oldType}" to "${newType}"`);
        }
      }
    }

    // Check added fields
    for (const field of newFields) {
      if (!oldSet.has(field)) {
        additions.push(field);
      }
    }

    // Backward: existing consumers still work (no removed fields, no type changes)
    const backward = breakingChanges.length === 0;

    // Forward: new consumers can read old data (new fields must have defaults or be optional)
    const forward = additions.every(field => {
      const def = newSchema[field];
      return def && (!def.required || def.default !== undefined);
    });

    return { backward, forward, breakingChanges, additions };
  }

  /**
   * Search schemas for fields matching a query string.
   * @param {string} fieldQuery  Field name to search for
   * @param {object} [options]
   * @param {string} [options.namespace]
   * @returns {Array<{ name: string, namespace: string, version: number, field: string }>}
   */
  search(fieldQuery, options = {}) {
    const results = [];
    const query = fieldQuery.toLowerCase();

    for (const [key, versions] of this._schemas) {
      const [namespace, name] = key.split(':');
      if (options.namespace && namespace !== options.namespace) continue;

      if (versions.length === 0) continue;
      const latest = versions[versions.length - 1];
      const fields = Object.keys(latest.schema || {});

      for (const field of fields) {
        if (field.toLowerCase().includes(query)) {
          results.push({
            name,
            namespace,
            version: latest.version,
            field,
          });
        }
      }
    }

    return results;
  }

  /**
   * Remove a schema and all its versions.
   * @param {string} name
   * @param {object} [options]
   * @param {string} [options.namespace]
   * @returns {boolean} Whether the schema was found and removed
   */
  remove(name, options = {}) {
    const namespace = options.namespace || 'default';
    const key = `${namespace}:${name}`;
    return this._schemas.delete(key);
  }

  /**
   * Export all schemas for persistence.
   * @returns {object} Serializable snapshot
   */
  export() {
    const data = {};
    for (const [key, versions] of this._schemas) {
      data[key] = versions.map(v => ({
        version: v.version,
        schema: v.schema,
        createdAt: v.createdAt,
        metadata: v.metadata,
      }));
    }
    return data;
  }

  /**
   * Import schemas from a previously exported snapshot.
   * @param {object} data  Exported snapshot
   */
  import(data) {
    if (!data || typeof data !== 'object') return;
    for (const [key, versions] of Object.entries(data)) {
      if (Array.isArray(versions)) {
        this._schemas.set(key, versions.map(v => ({
          version: v.version,
          schema: this._clone(v.schema),
          createdAt: v.createdAt,
          metadata: v.metadata || {},
        })));
      }
    }
  }

  /**
   * Check if a schema exists.
   * @param {string} name
   * @param {object} [options]
   * @param {string} [options.namespace]
   * @returns {boolean}
   */
  has(name, options = {}) {
    const namespace = options.namespace || 'default';
    const key = `${namespace}:${name}`;
    const versions = this._schemas.get(key);
    return !!(versions && versions.length > 0);
  }

  /**
   * Get registry statistics.
   * @returns {object}
   */
  getStats() {
    return {
      totalRegistrations: this._stats.totalRegistrations,
      totalLookups: this._stats.totalLookups,
      totalSchemas: this._schemas.size,
      namespaces: [...this._stats.namespacesUsed],
    };
  }

  /**
   * Clear all schemas and reset statistics.
   */
  reset() {
    this._schemas.clear();
    this._stats = {
      totalRegistrations: 0,
      totalLookups: 0,
      namespacesUsed: new Set(),
    };
  }

  // ─── INTERNAL ─────────────────────────────────────────────────────

  /**
   * Deep clone a value.
   * @param {*} value
   * @returns {*}
   */
  _clone(value) {
    if (value === null || typeof value !== 'object') return value;
    if (Array.isArray(value)) return value.map(v => this._clone(v));
    const result = {};
    for (const key of Object.keys(value)) {
      result[key] = this._clone(value[key]);
    }
    return result;
  }
}

module.exports = { SchemaRegistry };
