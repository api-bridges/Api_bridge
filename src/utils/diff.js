/**
 * nopes v3 — Schema Diff Engine
 *
 * Compare two API responses or schemas to detect:
 *  - Added fields
 *  - Removed fields
 *  - Type changes
 *  - Renamed fields (using semantic similarity)
 *  - Structural changes (nested ↔ flat)
 *
 * Useful for detecting API schema drift and breaking changes.
 */

class SchemaDiff {
  /**
   * @param {object} options
   * @param {number} options.renameThreshold  Minimum similarity to consider a rename (default 0.8)
   */
  constructor(options = {}) {
    this.renameThreshold = options.renameThreshold || 0.8;
  }

  /**
   * Compare two data objects and return a diff report.
   * @param {object} before  Previous/expected data shape
   * @param {object} after   New/actual data shape
   * @returns {object} Diff report
   */
  diff(before, after) {
    const beforeFields = this._extractFields(before, '');
    const afterFields = this._extractFields(after, '');

    const beforeKeys = new Set(beforeFields.keys());
    const afterKeys = new Set(afterFields.keys());

    const added = [];
    const removed = [];
    const typeChanged = [];
    const unchanged = [];
    const renamed = [];

    // Detect removed and changed fields
    for (const [key, beforeType] of beforeFields) {
      if (afterKeys.has(key)) {
        const afterType = afterFields.get(key);
        if (beforeType === afterType) {
          unchanged.push({ field: key, type: beforeType });
        } else {
          typeChanged.push({ field: key, before: beforeType, after: afterType });
        }
        afterKeys.delete(key);
        beforeKeys.delete(key);
      }
    }

    // Remaining beforeKeys are potentially removed, afterKeys are potentially added
    // Try to detect renames
    const usedAfterKeys = new Set();
    for (const bKey of beforeKeys) {
      let bestMatch = null;
      let bestScore = 0;

      for (const aKey of afterKeys) {
        if (usedAfterKeys.has(aKey)) continue;
        const score = this._fieldSimilarity(bKey, aKey);
        if (score > bestScore && score >= this.renameThreshold) {
          bestScore = score;
          bestMatch = aKey;
        }
      }

      if (bestMatch) {
        renamed.push({
          before: bKey,
          after: bestMatch,
          similarity: Math.round(bestScore * 100),
          typeChanged: beforeFields.get(bKey) !== afterFields.get(bestMatch),
          beforeType: beforeFields.get(bKey),
          afterType: afterFields.get(bestMatch),
        });
        usedAfterKeys.add(bestMatch);
      } else {
        removed.push({ field: bKey, type: beforeFields.get(bKey) });
      }
    }

    // Remaining afterKeys that weren't matched as renames are added
    for (const aKey of afterKeys) {
      if (!usedAfterKeys.has(aKey)) {
        added.push({ field: aKey, type: afterFields.get(aKey) });
      }
    }

    const hasBreakingChanges = removed.length > 0 || typeChanged.length > 0;

    return {
      summary: {
        totalBefore: beforeFields.size,
        totalAfter: afterFields.size,
        added: added.length,
        removed: removed.length,
        typeChanged: typeChanged.length,
        renamed: renamed.length,
        unchanged: unchanged.length,
        hasBreakingChanges,
      },
      added,
      removed,
      typeChanged,
      renamed,
      unchanged,
    };
  }

  /**
   * Compare two schemas (from SchemaInference or user-defined).
   */
  diffSchemas(before, after) {
    const added = [];
    const removed = [];
    const changed = [];
    const unchanged = [];

    const beforeKeys = new Set(Object.keys(before));
    const afterKeys = new Set(Object.keys(after));

    for (const key of beforeKeys) {
      if (afterKeys.has(key)) {
        const bSpec = before[key];
        const aSpec = after[key];
        const changes = [];

        if (bSpec.type !== aSpec.type) changes.push({ prop: 'type', before: bSpec.type, after: aSpec.type });
        if (bSpec.required !== aSpec.required) changes.push({ prop: 'required', before: bSpec.required, after: aSpec.required });
        if (bSpec.nullable !== aSpec.nullable) changes.push({ prop: 'nullable', before: bSpec.nullable, after: aSpec.nullable });

        if (changes.length > 0) {
          changed.push({ field: key, changes });
        } else {
          unchanged.push(key);
        }
        afterKeys.delete(key);
      } else {
        removed.push(key);
      }
    }

    for (const key of afterKeys) {
      added.push(key);
    }

    return {
      added,
      removed,
      changed,
      unchanged,
      hasBreakingChanges: removed.length > 0 || changed.some(c => c.changes.some(ch => ch.prop === 'type')),
    };
  }

  /**
   * Extract flat field → type map from a data object.
   */
  _extractFields(obj, prefix) {
    const fields = new Map();
    if (obj === null || obj === undefined || typeof obj !== 'object') return fields;

    for (const [key, value] of Object.entries(obj)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      const type = this._getType(value);
      fields.set(fullKey, type);

      if (value !== null && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
        const nested = this._extractFields(value, fullKey);
        for (const [nKey, nType] of nested) {
          fields.set(nKey, nType);
        }
      }
    }

    return fields;
  }

  _getType(value) {
    if (value === null) return 'null';
    if (value === undefined) return 'undefined';
    if (Array.isArray(value)) return 'array';
    if (value instanceof Date) return 'date';
    return typeof value;
  }

  /**
   * Simple field name similarity based on token overlap.
   */
  _fieldSimilarity(a, b) {
    const tokensA = this._tokenize(a);
    const tokensB = this._tokenize(b);
    if (tokensA.length === 0 || tokensB.length === 0) return 0;

    let matches = 0;
    for (const tA of tokensA) {
      for (const tB of tokensB) {
        if (tA === tB) {
          matches++;
          break;
        }
      }
    }

    return matches / Math.max(tokensA.length, tokensB.length);
  }

  _tokenize(key) {
    return key
      .replace(/([A-Z])([A-Z][a-z])/g, '$1_$2')
      .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
      .toLowerCase()
      .replace(/[-.\s]+/g, '_')
      .split(/[._]/)
      .filter(Boolean);
  }
}

module.exports = { SchemaDiff };
