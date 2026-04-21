/**
 * awsibnj v8 — Multi-Alias Field Resolution
 *
 * Enables mapping a single canonical field name to multiple aliases across different APIs.
 * When different backends use different names for the same concept (e.g., "user_id", "userId",
 * "uid", "member_id"), the aliaser resolves any of them to the canonical name.
 *
 * Features:
 *  - Register multiple aliases for a canonical field name
 *  - Bidirectional resolution (alias → canonical, canonical → alias for a given API)
 *  - API-specific alias sets (different aliases per API/service)
 *  - Wildcard/pattern-based alias matching
 *  - Alias priority ordering
 *  - Bulk import/export of alias definitions
 *  - Conflict detection when aliases overlap
 *  - Statistics and reporting
 */

class FieldAliaser {
  /**
   * @param {object} options
   * @param {boolean} options.caseSensitive    Whether alias matching is case-sensitive (default false)
   * @param {boolean} options.allowOverlap     Whether to allow the same alias in multiple groups (default false)
   * @param {boolean} options.usePatterns      Whether to support glob-like patterns in aliases (default true)
   */
  constructor(options = {}) {
    this.caseSensitive = options.caseSensitive || false;
    this.allowOverlap = options.allowOverlap || false;
    this.usePatterns = options.usePatterns !== false;

    // canonical → { aliases: string[], apiAliases: Map<apiName, string[]>, priority: number }
    this._groups = new Map();
    // alias → canonical (reverse lookup)
    this._reverseLookup = new Map();
    // API-specific reverse lookups: apiName → Map<alias, canonical>
    this._apiReverseLookups = new Map();

    this._stats = {
      totalGroups: 0,
      totalAliases: 0,
      lookups: 0,
      hits: 0,
      misses: 0,
    };
  }

  /**
   * Register aliases for a canonical field name.
   *
   * @param {string}   canonical  The canonical field name
   * @param {string[]} aliases    List of alias names
   * @param {object}   options    Optional settings
   * @param {string}   options.api      API/service name for API-specific aliases
   * @param {number}   options.priority Priority for conflict resolution (higher wins)
   * @returns {FieldAliaser} this (for chaining)
   */
  register(canonical, aliases, options = {}) {
    const normalizedCanonical = this._normalize(canonical);
    const apiName = options.api || null;
    const priority = options.priority || 0;

    if (!this._groups.has(normalizedCanonical)) {
      this._groups.set(normalizedCanonical, {
        canonical,
        aliases: [],
        apiAliases: new Map(),
        priority,
      });
      this._stats.totalGroups++;
    }

    const group = this._groups.get(normalizedCanonical);

    for (const alias of aliases) {
      const normalizedAlias = this._normalize(alias);

      // Check for conflicts
      if (!this.allowOverlap && this._reverseLookup.has(normalizedAlias)) {
        const existingCanonical = this._reverseLookup.get(normalizedAlias);
        if (existingCanonical !== normalizedCanonical) {
          const existingGroup = this._groups.get(existingCanonical);
          if (existingGroup && existingGroup.priority >= priority) {
            continue; // Existing higher-priority group wins
          }
          // New higher-priority group takes over
          this._reverseLookup.set(normalizedAlias, normalizedCanonical);
        }
      }

      if (apiName) {
        if (!group.apiAliases.has(apiName)) {
          group.apiAliases.set(apiName, []);
        }
        const apiAliases = group.apiAliases.get(apiName);
        if (!apiAliases.includes(normalizedAlias)) {
          apiAliases.push(normalizedAlias);
        }

        // API-specific reverse lookup
        if (!this._apiReverseLookups.has(apiName)) {
          this._apiReverseLookups.set(apiName, new Map());
        }
        this._apiReverseLookups.get(apiName).set(normalizedAlias, normalizedCanonical);
      } else {
        if (!group.aliases.includes(normalizedAlias)) {
          group.aliases.push(normalizedAlias);
          this._stats.totalAliases++;
        }
        this._reverseLookup.set(normalizedAlias, normalizedCanonical);
      }
    }

    return this;
  }

  /**
   * Resolve a field name to its canonical name.
   *
   * @param {string} fieldName  The field name to resolve
   * @param {string} apiName    Optional API name for API-specific lookup
   * @returns {{ canonical: string|null, matched: boolean, source: string }}
   */
  resolve(fieldName, apiName = null) {
    this._stats.lookups++;
    const normalized = this._normalize(fieldName);

    // Check if it's already a canonical name
    if (this._groups.has(normalized)) {
      this._stats.hits++;
      return { canonical: this._groups.get(normalized).canonical, matched: true, source: 'canonical' };
    }

    // API-specific lookup first (higher priority)
    if (apiName && this._apiReverseLookups.has(apiName)) {
      const apiLookup = this._apiReverseLookups.get(apiName);
      if (apiLookup.has(normalized)) {
        this._stats.hits++;
        const canonicalNorm = apiLookup.get(normalized);
        return { canonical: this._groups.get(canonicalNorm).canonical, matched: true, source: `api:${apiName}` };
      }
    }

    // Global reverse lookup
    if (this._reverseLookup.has(normalized)) {
      this._stats.hits++;
      const canonicalNorm = this._reverseLookup.get(normalized);
      return { canonical: this._groups.get(canonicalNorm).canonical, matched: true, source: 'alias' };
    }

    // Pattern matching
    if (this.usePatterns) {
      for (const [canonicalNorm, group] of this._groups) {
        for (const alias of group.aliases) {
          if (this._patternMatch(alias, normalized)) {
            this._stats.hits++;
            return { canonical: group.canonical, matched: true, source: 'pattern' };
          }
        }
      }
    }

    this._stats.misses++;
    return { canonical: null, matched: false, source: 'none' };
  }

  /**
   * Get the preferred alias for a canonical name for a specific API.
   *
   * @param {string} canonical  The canonical field name
   * @param {string} apiName    The target API name
   * @returns {string|null} The preferred alias, or null if not found
   */
  getAliasFor(canonical, apiName) {
    const normalized = this._normalize(canonical);
    const group = this._groups.get(normalized);
    if (!group) return null;

    if (apiName && group.apiAliases.has(apiName)) {
      const apiAliases = group.apiAliases.get(apiName);
      return apiAliases.length > 0 ? apiAliases[0] : null;
    }

    return group.aliases.length > 0 ? group.aliases[0] : canonical;
  }

  /**
   * Get all aliases for a canonical field name.
   *
   * @param {string} canonical  The canonical field name
   * @returns {{ global: string[], apis: object }}
   */
  getAliases(canonical) {
    const normalized = this._normalize(canonical);
    const group = this._groups.get(normalized);
    if (!group) return { global: [], apis: {} };

    const apis = {};
    for (const [apiName, aliases] of group.apiAliases) {
      apis[apiName] = [...aliases];
    }

    return { global: [...group.aliases], apis };
  }

  /**
   * Check if a field name has any registered aliases.
   */
  hasAliases(fieldName) {
    const normalized = this._normalize(fieldName);
    return this._groups.has(normalized) || this._reverseLookup.has(normalized);
  }

  /**
   * Detect alias conflicts (same alias in multiple groups).
   *
   * @returns {object[]} List of conflict descriptions
   */
  detectConflicts() {
    const aliasToGroups = new Map();
    const conflicts = [];

    for (const [canonicalNorm, group] of this._groups) {
      for (const alias of group.aliases) {
        if (!aliasToGroups.has(alias)) {
          aliasToGroups.set(alias, []);
        }
        aliasToGroups.get(alias).push(group.canonical);
      }
    }

    for (const [alias, canonicals] of aliasToGroups) {
      if (canonicals.length > 1) {
        conflicts.push({ alias, canonicals: [...canonicals] });
      }
    }

    return conflicts;
  }

  /**
   * Bulk import alias definitions.
   *
   * @param {object} definitions  { canonical: [alias1, alias2, ...], ... }
   */
  bulkImport(definitions) {
    for (const [canonical, aliases] of Object.entries(definitions)) {
      this.register(canonical, Array.isArray(aliases) ? aliases : [aliases]);
    }
  }

  /**
   * Bulk export all alias definitions.
   *
   * @returns {object} { canonical: { global: [...], apis: {...} }, ... }
   */
  bulkExport() {
    const result = {};
    for (const [, group] of this._groups) {
      result[group.canonical] = this.getAliases(group.canonical);
    }
    return result;
  }

  /**
   * Remove a canonical group and all its aliases.
   */
  unregister(canonical) {
    const normalized = this._normalize(canonical);
    const group = this._groups.get(normalized);
    if (!group) return false;

    for (const alias of group.aliases) {
      this._reverseLookup.delete(alias);
      this._stats.totalAliases--;
    }

    for (const [apiName, aliases] of group.apiAliases) {
      const apiLookup = this._apiReverseLookups.get(apiName);
      if (apiLookup) {
        for (const alias of aliases) {
          apiLookup.delete(alias);
        }
      }
    }

    this._groups.delete(normalized);
    this._stats.totalGroups--;
    return true;
  }

  /**
   * Get statistics.
   */
  getStats() {
    return {
      ...this._stats,
      hitRate: this._stats.lookups > 0
        ? Math.round((this._stats.hits / this._stats.lookups) * 100) + '%'
        : '0%',
    };
  }

  /**
   * Clear all alias definitions.
   */
  clear() {
    this._groups.clear();
    this._reverseLookup.clear();
    this._apiReverseLookups.clear();
    this._stats = { totalGroups: 0, totalAliases: 0, lookups: 0, hits: 0, misses: 0 };
  }

  // ─── INTERNAL ──────────────────────────────────────────────────────────

  _normalize(str) {
    return this.caseSensitive ? str : str.toLowerCase();
  }

  _patternMatch(pattern, value) {
    if (!pattern.includes('*')) return false;
    const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
    return regex.test(value);
  }
}

module.exports = { FieldAliaser };
