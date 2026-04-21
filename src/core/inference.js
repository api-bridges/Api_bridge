/**
 * awsibnj v3 — Schema Inference Engine
 *
 * Automatically generates schemas from API response data.
 * Analyzes one or more sample payloads and infers:
 *  - Field types (string, number, boolean, date, array, object)
 *  - Required vs optional fields
 *  - Nullable fields
 *  - Nested object schemas
 *  - Common patterns (email, URL, UUID, ISO date)
 */

const { InferenceError } = require('./errors');

const PATTERN_DETECTORS = {
  email:    /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  url:      /^https?:\/\/.+/,
  uuid:     /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
  iso_date: /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2})?/,
  ipv4:     /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,
  phone:    /^\+?[\d\s()-]{7,20}$/,
};

class SchemaInference {
  /**
   * @param {object} options
   * @param {number}  options.requiredThreshold  Fraction of samples a field must appear in to be required (default 1.0)
   * @param {boolean} options.detectPatterns     Detect common string patterns (default true)
   * @param {number}  options.maxSamples         Max samples to analyze (default 100)
   */
  constructor(options = {}) {
    this.requiredThreshold = options.requiredThreshold ?? 1.0;
    this.detectPatterns = options.detectPatterns !== false;
    this.maxSamples = options.maxSamples || 100;
  }

  /**
   * Infer schema from one or more data samples.
   * @param {object|object[]} samples  Single object or array of objects
   * @returns {object} Inferred schema
   */
  infer(samples) {
    const items = Array.isArray(samples) ? samples : [samples];
    if (items.length === 0) {
      throw new InferenceError('Cannot infer schema from empty data', 'empty_input');
    }

    const limited = items.slice(0, this.maxSamples);
    const totalSamples = limited.length;
    const fieldStats = new Map();

    for (const item of limited) {
      if (item === null || item === undefined || typeof item !== 'object' || Array.isArray(item)) {
        continue;
      }
      this._collectFieldStats(item, fieldStats, '');
    }

    return this._buildSchema(fieldStats, totalSamples);
  }

  /**
   * Merge multiple inferred schemas into one.
   * Useful when inferring from different API endpoints.
   */
  merge(schemas) {
    if (!Array.isArray(schemas) || schemas.length === 0) {
      return {};
    }
    if (schemas.length === 1) return schemas[0];

    const merged = {};
    for (const schema of schemas) {
      for (const [field, spec] of Object.entries(schema)) {
        if (!merged[field]) {
          merged[field] = { ...spec };
        } else {
          // Widen type if different
          if (merged[field].type !== spec.type) {
            merged[field].type = 'any';
          }
          // Field is required only if required in all schemas
          if (!spec.required) {
            merged[field].required = false;
          }
          // Nullable if nullable in any
          if (spec.nullable) {
            merged[field].nullable = true;
          }
          // Merge patterns
          if (spec.pattern && merged[field].pattern !== spec.pattern) {
            delete merged[field].pattern;
          }
        }
      }
    }
    return merged;
  }

  _collectFieldStats(obj, stats, prefix) {
    for (const [key, value] of Object.entries(obj)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;

      if (!stats.has(fullKey)) {
        stats.set(fullKey, {
          appearances: 0,
          types: new Map(),
          nullable: false,
          patterns: new Map(),
          sampleValues: [],
          isNested: false,
        });
      }

      const stat = stats.get(fullKey);
      stat.appearances++;

      if (value === null || value === undefined) {
        stat.nullable = true;
        return;
      }

      const type = this._detectType(value);
      stat.types.set(type, (stat.types.get(type) || 0) + 1);

      // Detect patterns for strings
      if (this.detectPatterns && typeof value === 'string') {
        for (const [patternName, regex] of Object.entries(PATTERN_DETECTORS)) {
          if (regex.test(value)) {
            stat.patterns.set(patternName, (stat.patterns.get(patternName) || 0) + 1);
          }
        }
      }

      // Store sample values (limited)
      if (stat.sampleValues.length < 3) {
        stat.sampleValues.push(value);
      }

      // Recurse into nested objects
      if (typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
        stat.isNested = true;
        this._collectFieldStats(value, stats, fullKey);
      }
    }
  }

  _buildSchema(fieldStats, totalSamples) {
    const schema = {};

    for (const [field, stat] of fieldStats) {
      // Skip nested intermediate paths (e.g., "address" when we have "address.city")
      if (stat.isNested) continue;

      // Determine dominant type
      let dominantType = 'any';
      let maxCount = 0;
      for (const [type, count] of stat.types) {
        if (count > maxCount) {
          maxCount = count;
          dominantType = type;
        }
      }

      // Determine required status
      const required = (stat.appearances / totalSamples) >= this.requiredThreshold;

      // Determine pattern
      let pattern = null;
      if (this.detectPatterns && stat.patterns.size > 0) {
        let bestPattern = null;
        let bestCount = 0;
        for (const [p, count] of stat.patterns) {
          if (count > bestCount) {
            bestCount = count;
            bestPattern = p;
          }
        }
        // Pattern must appear in most occurrences
        if (bestCount >= stat.appearances * 0.8) {
          pattern = bestPattern;
        }
      }

      const spec = {
        type: dominantType,
        required,
      };

      if (stat.nullable) spec.nullable = true;
      if (pattern) spec.pattern = pattern;

      schema[field] = spec;
    }

    return schema;
  }

  _detectType(value) {
    if (value === null || value === undefined) return 'any';
    if (typeof value === 'boolean') return 'boolean';
    if (typeof value === 'number') return Number.isInteger(value) ? 'integer' : 'number';
    if (value instanceof Date) return 'date';
    if (Array.isArray(value)) return 'array';
    if (typeof value === 'object') return 'object';
    if (typeof value === 'string') {
      if (PATTERN_DETECTORS.iso_date.test(value)) return 'date';
      return 'string';
    }
    return 'any';
  }
}

module.exports = { SchemaInference, PATTERN_DETECTORS };
