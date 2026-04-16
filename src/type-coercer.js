/**
 * APIBridge AI v6 — Schema-Based Type Coercer
 *
 * Automatic type detection and coercion for type conflicts:
 *  - String ↔ Boolean ("1", "true", "yes" ↔ true/false)
 *  - String → Number ("42" → 42, "3.14" → 3.14)
 *  - String → Date (ISO 8601, common date formats)
 *  - Number ↔ Boolean (1/0 ↔ true/false)
 *  - JSON string → Object/Array
 *  - Automatic type inference from values
 *  - Schema-driven coercion with conflict reporting
 *  - Batch coercion for entire objects
 *
 * When a schema is provided, performs automatic coercion.
 * When no schema is given, infers and reports type conflicts.
 */

// ─── TYPE DETECTION ──────────────────────────────────────────────────────────

// Maximum string length to consider as a parseable integer (avoids precision loss for very large numbers)
const MAX_SAFE_INTEGER_STRING_LENGTH = 16;

/**
 * Infer the most specific type from a value.
 */
function inferType(value) {
  if (value === null || value === undefined) return 'null';
  if (typeof value === 'boolean') return 'boolean';
  if (typeof value === 'number') return Number.isInteger(value) ? 'integer' : 'float';
  if (value instanceof Date) return 'date';
  if (Array.isArray(value)) return 'array';
  if (typeof value === 'object') return 'object';

  if (typeof value === 'string') {
    // Boolean strings
    if (value === 'true' || value === 'false') return 'boolean_string';
    if (value === '1' || value === '0') return 'numeric_boolean';
    if (value === 'yes' || value === 'no') return 'boolean_string';

    // Date strings (ISO 8601 and common formats)
    if (/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2})?/.test(value)) {
      const d = new Date(value);
      if (!isNaN(d.getTime())) return 'date_string';
    }

    // Integer strings
    if (/^-?\d+$/.test(value) && value.length < MAX_SAFE_INTEGER_STRING_LENGTH) return 'integer_string';

    // Float strings
    if (/^-?\d+\.\d+$/.test(value)) return 'float_string';

    // JSON strings
    if ((value.startsWith('{') && value.endsWith('}')) ||
        (value.startsWith('[') && value.endsWith(']'))) {
      try {
        JSON.parse(value);
        return 'json_string';
      } catch {
        // Not valid JSON
      }
    }

    return 'string';
  }

  return 'unknown';
}

/**
 * Check if a type is a "string representation" of another type.
 */
function isTypeConflict(actualType, schemaType) {
  const conflictMap = {
    boolean_string: ['boolean'],
    numeric_boolean: ['boolean', 'integer', 'number'],
    date_string: ['date'],
    integer_string: ['integer', 'number'],
    float_string: ['float', 'number'],
    json_string: ['object', 'array', 'json'],
    string: ['boolean', 'integer', 'float', 'number', 'date'],
  };

  const possibleTargets = conflictMap[actualType] || [];
  return possibleTargets.includes(schemaType);
}

// ─── COERCION FUNCTIONS ──────────────────────────────────────────────────────

const COERCIONS = {
  boolean: (value) => {
    if (typeof value === 'boolean') return { value, coerced: false };
    if (value === 1 || value === '1' || value === 'true' || value === 'yes') {
      return { value: true, coerced: true };
    }
    if (value === 0 || value === '0' || value === 'false' || value === 'no') {
      return { value: false, coerced: true };
    }
    return { value: Boolean(value), coerced: true };
  },

  integer: (value) => {
    if (typeof value === 'number' && Number.isInteger(value)) return { value, coerced: false };
    const n = parseInt(String(value), 10);
    if (isNaN(n)) return { value, coerced: false, failed: true };
    return { value: n, coerced: true };
  },

  float: (value) => {
    if (typeof value === 'number') return { value, coerced: false };
    const n = parseFloat(String(value));
    if (isNaN(n)) return { value, coerced: false, failed: true };
    return { value: n, coerced: true };
  },

  number: (value) => {
    if (typeof value === 'number') return { value, coerced: false };
    const n = Number(value);
    if (isNaN(n)) return { value, coerced: false, failed: true };
    return { value: n, coerced: true };
  },

  date: (value) => {
    if (value instanceof Date) return { value, coerced: false };
    const d = new Date(value);
    if (isNaN(d.getTime())) return { value, coerced: false, failed: true };
    return { value: d, coerced: true };
  },

  string: (value) => {
    if (typeof value === 'string') return { value, coerced: false };
    return { value: String(value), coerced: true };
  },

  array: (value) => {
    if (Array.isArray(value)) return { value, coerced: false };
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) return { value: parsed, coerced: true };
      } catch { /* not valid JSON */ }
      return { value: [value], coerced: true };
    }
    return { value: [value], coerced: true };
  },

  object: (value) => {
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      return { value, coerced: false };
    }
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        if (typeof parsed === 'object' && parsed !== null) return { value: parsed, coerced: true };
      } catch { /* not valid JSON */ }
    }
    return { value, coerced: false, failed: true };
  },

  json: (value) => {
    if (typeof value === 'object') return { value, coerced: false };
    if (typeof value === 'string') {
      try { return { value: JSON.parse(value), coerced: true }; } catch { /* not valid JSON */ }
    }
    return { value, coerced: false, failed: true };
  },
};

// ─── TYPE COERCER CLASS ──────────────────────────────────────────────────────

class TypeCoercer {
  /**
   * @param {object} options
   * @param {boolean} options.autoCoerce         Automatically coerce values (default true)
   * @param {boolean} options.reportConflicts     Report type conflicts (default true)
   * @param {boolean} options.strictDates         Only accept ISO 8601 dates (default false)
   */
  constructor(options = {}) {
    this.autoCoerce = options.autoCoerce !== false;
    this.reportConflicts = options.reportConflicts !== false;
    this.strictDates = options.strictDates || false;
    this.conflicts = [];
  }

  /**
   * Coerce a single value to the specified target type.
   *
   * @param {any}    value       The value to coerce
   * @param {string} targetType  The target type name
   * @param {string} fieldName   Optional field name for reporting
   * @returns {{ value: any, coerced: boolean, conflict: object|null }}
   */
  coerceValue(value, targetType, fieldName) {
    if (value === null || value === undefined) {
      return { value, coerced: false, conflict: null };
    }

    const actualType = inferType(value);
    const coerceFn = COERCIONS[targetType];

    if (!coerceFn) {
      return { value, coerced: false, conflict: null };
    }

    const hasConflict = isTypeConflict(actualType, targetType);
    const result = coerceFn(value);

    let conflict = null;
    if (hasConflict && this.reportConflicts) {
      conflict = {
        field: fieldName || 'unknown',
        sourceType: actualType,
        targetType,
        originalValue: value,
        coercedValue: result.value,
        coerced: result.coerced && !result.failed,
        failed: !!result.failed,
        timestamp: new Date().toISOString(),
      };
      this.conflicts.push(conflict);
    }

    if (this.autoCoerce && result.coerced && !result.failed) {
      return { value: result.value, coerced: true, conflict };
    }

    return { value: result.failed ? value : result.value, coerced: result.coerced && !result.failed, conflict };
  }

  /**
   * Coerce all fields in an object according to a schema.
   *
   * @param {object} data    The data object
   * @param {object} schema  Schema with field definitions: { fieldName: { type: 'string' }, ... }
   * @returns {{ data: object, coerced: string[], conflicts: object[] }}
   */
  coerceObject(data, schema) {
    if (!data || typeof data !== 'object' || !schema) {
      return { data, coerced: [], conflicts: [] };
    }

    const result = { ...data };
    const coercedFields = [];
    const fieldConflicts = [];

    for (const [field, spec] of Object.entries(schema)) {
      if (!Object.prototype.hasOwnProperty.call(result, field)) continue;
      if (!spec || !spec.type || spec.type === 'any') continue;

      const coercion = this.coerceValue(result[field], spec.type, field);
      if (coercion.coerced) {
        result[field] = coercion.value;
        coercedFields.push(field);
      }
      if (coercion.conflict) {
        fieldConflicts.push(coercion.conflict);
      }
    }

    return { data: result, coerced: coercedFields, conflicts: fieldConflicts };
  }

  /**
   * Detect type conflicts in data vs. schema without coercing.
   *
   * @param {object} data
   * @param {object} schema
   * @returns {object[]}  List of conflict descriptors
   */
  detectConflicts(data, schema) {
    if (!data || typeof data !== 'object' || !schema) return [];

    const conflicts = [];

    for (const [field, spec] of Object.entries(schema)) {
      if (!Object.prototype.hasOwnProperty.call(data, field)) continue;
      if (!spec || !spec.type || spec.type === 'any') continue;

      const actualType = inferType(data[field]);
      if (isTypeConflict(actualType, spec.type)) {
        conflicts.push({
          field,
          sourceType: actualType,
          targetType: spec.type,
          value: data[field],
          canCoerce: COERCIONS[spec.type] !== undefined,
        });
      }
    }

    return conflicts;
  }

  /**
   * Get all recorded conflicts.
   */
  getConflicts() {
    return [...this.conflicts];
  }

  /**
   * Clear recorded conflicts.
   */
  clearConflicts() {
    this.conflicts = [];
  }

  /**
   * Get stats about coercion activity.
   */
  getStats() {
    return {
      totalConflicts: this.conflicts.length,
      coerced: this.conflicts.filter(c => c.coerced).length,
      failed: this.conflicts.filter(c => c.failed).length,
      byType: this._groupByType(),
    };
  }

  _groupByType() {
    const groups = {};
    for (const c of this.conflicts) {
      const key = `${c.sourceType}_to_${c.targetType}`;
      groups[key] = (groups[key] || 0) + 1;
    }
    return groups;
  }
}

module.exports = {
  TypeCoercer,
  inferType,
  isTypeConflict,
  COERCIONS,
};
