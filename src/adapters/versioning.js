/**
 * awsibnj v4 — API Versioning
 *
 * Version-specific transform strategies with:
 *  - Per-version schema and transform registration
 *  - Directional transforms (request / response)
 *  - Deprecation tracking with successor chains
 *  - Migration across version chains (v1 → v2 → v3)
 *  - Strict mode for unknown-version rejection
 *  - Statistics tracking
 */

class APIVersionManager {
  /**
   * @param {object} options
   * @param {string}  options.defaultVersion  Default API version (default 'v1')
   * @param {boolean} options.strict          Throw on unknown versions (default false)
   */
  constructor(options = {}) {
    this.defaultVersion = options.defaultVersion || 'v1';
    this.strict = options.strict || false;

    /** @type {Map<string, object>} */
    this._versions = new Map();

    this._transformCounts = new Map();
    this._migrationCount = 0;
  }

  /**
   * Register a version configuration.
   * @param {string} version   Version identifier (e.g. 'v1', 'v2')
   * @param {object} config
   * @param {object}  [config.schema]       Schema definition for this version
   * @param {object}  [config.transforms]   { request(data), response(data) }
   * @param {boolean} [config.deprecated]   Whether this version is deprecated
   * @param {string}  [config.successor]    Successor version for migration
   * @param {string}  [config.convention]   Naming convention used by this version
   */
  register(version, config = {}) {
    this._versions.set(version, {
      schema: config.schema || null,
      transforms: config.transforms || {},
      deprecated: config.deprecated || false,
      successor: config.successor || null,
      convention: config.convention || null,
    });

    if (!this._transformCounts.has(version)) {
      this._transformCounts.set(version, 0);
    }
  }

  /**
   * Remove a version configuration.
   * @param {string} version  Version to unregister
   */
  unregister(version) {
    this._versions.delete(version);
    this._transformCounts.delete(version);
  }

  /**
   * Transform data using version-specific configuration.
   * Falls back to the default version when the requested version has no
   * transform for the given direction.
   * @param {*}      data       Data to transform
   * @param {string} version    Target API version
   * @param {string} direction  'request' or 'response'
   * @returns {*} Transformed data
   */
  transform(data, version, direction) {
    if (this.strict && !this._versions.has(version)) {
      throw new Error(`Unknown API version: ${version}`);
    }

    const config = this._versions.get(version);

    if (config && config.transforms && typeof config.transforms[direction] === 'function') {
      this._incrementCount(version);
      return config.transforms[direction](data);
    }

    // Fall back to default version
    const defaultConfig = this._versions.get(this.defaultVersion);
    if (defaultConfig && defaultConfig.transforms && typeof defaultConfig.transforms[direction] === 'function') {
      this._incrementCount(this.defaultVersion);
      return defaultConfig.transforms[direction](data);
    }

    return data;
  }

  /**
   * Check whether a version is deprecated.
   * @param {string} version
   * @returns {boolean}
   */
  isDeprecated(version) {
    const config = this._versions.get(version);
    return config ? !!config.deprecated : false;
  }

  /**
   * Get the successor version for a deprecated version.
   * @param {string} version
   * @returns {string|null}
   */
  getSuccessor(version) {
    const config = this._versions.get(version);
    return config ? config.successor : null;
  }

  /**
   * Migrate data from one version to another by chaining response transforms
   * through the successor chain.
   * @param {*}      data         Data to migrate
   * @param {string} fromVersion  Source version
   * @param {string} toVersion    Target version
   * @returns {*} Migrated data
   */
  migrate(data, fromVersion, toVersion) {
    if (this.strict && !this._versions.has(fromVersion)) {
      throw new Error(`Unknown API version: ${fromVersion}`);
    }
    if (this.strict && !this._versions.has(toVersion)) {
      throw new Error(`Unknown API version: ${toVersion}`);
    }

    let current = fromVersion;
    let result = data;

    while (current && current !== toVersion) {
      const config = this._versions.get(current);
      if (!config || !config.successor) {
        break;
      }

      const next = config.successor;
      const nextConfig = this._versions.get(next);

      if (nextConfig && nextConfig.transforms && typeof nextConfig.transforms.request === 'function') {
        result = nextConfig.transforms.request(result);
        this._incrementCount(next);
      }

      current = next;
    }

    this._migrationCount++;
    return result;
  }

  /**
   * List all registered versions with metadata.
   * @returns {Array<object>}
   */
  list() {
    const entries = [];
    for (const [version, config] of this._versions) {
      entries.push({
        version,
        deprecated: config.deprecated,
        successor: config.successor,
        convention: config.convention,
        hasTransforms: !!(config.transforms && (config.transforms.request || config.transforms.response)),
        hasSchema: config.schema !== null,
      });
    }
    return entries;
  }

  /**
   * Check whether a version is registered.
   * @param {string} version
   * @returns {boolean}
   */
  has(version) {
    return this._versions.has(version);
  }

  /**
   * Get the schema for a version.
   * @param {string} version
   * @returns {object|null}
   */
  getSchema(version) {
    const config = this._versions.get(version);
    return config ? config.schema : null;
  }

  /**
   * Get aggregate statistics.
   * @returns {object}
   */
  getStats() {
    let totalTransforms = 0;
    for (const count of this._transformCounts.values()) {
      totalTransforms += count;
    }

    let deprecatedVersions = 0;
    for (const config of this._versions.values()) {
      if (config.deprecated) deprecatedVersions++;
    }

    return {
      versionsRegistered: this._versions.size,
      totalTransforms,
      deprecatedVersions,
      migrations: this._migrationCount,
    };
  }

  /**
   * Clear all version registrations and reset state.
   */
  reset() {
    this._versions.clear();
    this._transformCounts.clear();
    this._migrationCount = 0;
  }

  /**
   * Increment the transform count for a version.
   * @param {string} version
   */
  _incrementCount(version) {
    this._transformCounts.set(version, (this._transformCounts.get(version) || 0) + 1);
  }
}

module.exports = { APIVersionManager };
