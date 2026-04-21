/**
 * awsibnj v8 — Deep Merge Engine
 *
 * Intelligently deep-merge API responses with configurable conflict resolution.
 * When combining data from multiple API sources, handles nested objects, arrays,
 * and value conflicts with customizable strategies.
 *
 * Features:
 *  - Deep recursive merging of objects
 *  - Array merge strategies (concat, union, replace, interleave)
 *  - Conflict resolution strategies (latest, priority, custom)
 *  - Null/undefined handling options
 *  - Merge path tracking (know which source contributed each field)
 *  - Prototype pollution protection
 *  - Circular reference detection
 *  - Merge statistics
 */

const DANGEROUS_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

class DeepMerge {
  /**
   * @param {object} options
   * @param {string}   options.arrayStrategy    'concat' | 'union' | 'replace' | 'interleave' (default 'concat')
   * @param {string}   options.conflictStrategy 'latest' | 'first' | 'custom' (default 'latest')
   * @param {Function} options.conflictResolver Custom conflict resolver: (key, a, b) => resolvedValue
   * @param {boolean}  options.skipNull         Skip null values when merging (default false)
   * @param {boolean}  options.skipUndefined    Skip undefined values when merging (default true)
   * @param {boolean}  options.trackSources     Track which source contributed each field (default false)
   * @param {number}   options.maxDepth         Maximum merge depth (default 50)
   */
  constructor(options = {}) {
    this.arrayStrategy = options.arrayStrategy || 'concat';
    this.conflictStrategy = options.conflictStrategy || 'latest';
    this.conflictResolver = options.conflictResolver || null;
    this.skipNull = options.skipNull || false;
    this.skipUndefined = options.skipUndefined !== false;
    this.trackSources = options.trackSources || false;
    this.maxDepth = options.maxDepth || 50;

    this._stats = {
      totalMerges: 0,
      conflicts: 0,
      fieldsProcessed: 0,
    };
    this._sources = {};
  }

  /**
   * Deep merge two or more objects.
   *
   * @param {...object} sources  Objects to merge (later objects take priority)
   * @returns {object} Merged result
   */
  merge(...sources) {
    if (sources.length === 0) return {};
    if (sources.length === 1) return this._clone(sources[0]);

    this._stats.totalMerges++;
    const seen = new WeakSet();

    let result = {};
    for (let i = 0; i < sources.length; i++) {
      if (sources[i] && typeof sources[i] === 'object' && !Array.isArray(sources[i])) {
        result = this._mergeTwo(result, sources[i], `source_${i}`, '', 0, seen);
      }
    }

    return result;
  }

  /**
   * Merge with explicit source labels for tracking.
   *
   * @param {object[]} labeledSources  Array of { label, data } objects
   * @returns {{ result: object, sources: object }}
   */
  mergeLabeled(labeledSources) {
    if (!labeledSources || labeledSources.length === 0) return { result: {}, sources: {} };

    this._stats.totalMerges++;
    this._sources = {};
    const seen = new WeakSet();

    let result = {};
    for (const { label, data } of labeledSources) {
      if (data && typeof data === 'object' && !Array.isArray(data)) {
        result = this._mergeTwo(result, data, label, '', 0, seen);
      }
    }

    return { result, sources: { ...this._sources } };
  }

  /**
   * Get merge statistics.
   */
  getStats() {
    return { ...this._stats };
  }

  /**
   * Reset statistics.
   */
  resetStats() {
    this._stats = { totalMerges: 0, conflicts: 0, fieldsProcessed: 0 };
    this._sources = {};
  }

  // ─── INTERNAL ──────────────────────────────────────────────────────────

  _mergeTwo(target, source, sourceLabel, path, depth, seen) {
    if (depth > this.maxDepth) return target;

    // Circular reference protection
    if (typeof source === 'object' && source !== null) {
      if (seen.has(source)) return target;
      seen.add(source);
    }

    const result = { ...target };

    for (const key of Object.keys(source)) {
      // Prototype pollution protection
      if (DANGEROUS_KEYS.has(key)) continue;

      const fullPath = path ? `${path}.${key}` : key;
      this._stats.fieldsProcessed++;

      const sourceVal = source[key];
      const targetVal = target[key];

      // Skip null/undefined as configured
      if (sourceVal === null && this.skipNull) continue;
      if (sourceVal === undefined && this.skipUndefined) continue;

      // Track sources
      if (this.trackSources) {
        this._sources[fullPath] = sourceLabel;
      }

      // No conflict - field doesn't exist in target
      if (!(key in target)) {
        result[key] = this._clone(sourceVal);
        continue;
      }

      // Both are arrays
      if (Array.isArray(targetVal) && Array.isArray(sourceVal)) {
        result[key] = this._mergeArrays(targetVal, sourceVal);
        continue;
      }

      // Both are plain objects — recursive merge
      if (this._isPlainObject(targetVal) && this._isPlainObject(sourceVal)) {
        result[key] = this._mergeTwo(targetVal, sourceVal, sourceLabel, fullPath, depth + 1, seen);
        continue;
      }

      // Value conflict
      this._stats.conflicts++;
      result[key] = this._resolveConflict(key, targetVal, sourceVal);
    }

    return result;
  }

  _mergeArrays(a, b) {
    switch (this.arrayStrategy) {
      case 'concat':
        return [...a, ...b];
      case 'union': {
        const set = new Set([...a.map(v => JSON.stringify(v)), ...b.map(v => JSON.stringify(v))]);
        return [...set].map(v => JSON.parse(v));
      }
      case 'replace':
        return [...b];
      case 'interleave': {
        const result = [];
        const maxLen = Math.max(a.length, b.length);
        for (let i = 0; i < maxLen; i++) {
          if (i < a.length) result.push(a[i]);
          if (i < b.length) result.push(b[i]);
        }
        return result;
      }
      default:
        return [...a, ...b];
    }
  }

  _resolveConflict(key, a, b) {
    switch (this.conflictStrategy) {
      case 'first':
        return a;
      case 'latest':
        return b;
      case 'custom':
        if (this.conflictResolver) {
          return this.conflictResolver(key, a, b);
        }
        return b;
      default:
        return b;
    }
  }

  _isPlainObject(val) {
    return val !== null && typeof val === 'object' && !Array.isArray(val) && !(val instanceof Date);
  }

  _clone(val) {
    if (val === null || val === undefined) return val;
    if (typeof val !== 'object') return val;
    if (val instanceof Date) return new Date(val.getTime());
    if (Array.isArray(val)) return val.map(v => this._clone(v));
    const result = {};
    for (const key of Object.keys(val)) {
      if (DANGEROUS_KEYS.has(key)) continue;
      result[key] = this._clone(val[key]);
    }
    return result;
  }
}

module.exports = { DeepMerge };
