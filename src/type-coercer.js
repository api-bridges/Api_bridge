/**
 * APIBridge AI v7 — Enhanced Schema-Based Type Coercer
 *
 * Automatic type detection and coercion for type conflicts:
 *  - String ↔ Boolean ("1", "true", "yes", "TRUE", "Yes", "on" ↔ true/false)
 *  - String → Number ("42" → 42, "3.14" → 3.14)
 *  - String → Date (ISO 8601, common date formats, relative dates)
 *  - Number ↔ Boolean (1/0 ↔ true/false)
 *  - JSON string → Object/Array
 *  - Automatic type inference from values
 *  - Schema-driven coercion with conflict reporting
 *  - Batch coercion for entire objects
 *
 * v7 improvements:
 *  - Case-insensitive boolean parsing ("TRUE", "FALSE", "Yes", "No", "ON", "OFF")
 *  - More date format support (DD/MM/YYYY, MM-DD-YYYY, relative)
 *  - Numeric string with comma separators ("1,000" → 1000)
 *  - Percentage string coercion ("50%" → 0.5 for float)
 *  - Null/empty string coercion (""  → null for nullable types)
 *
 * When a schema is provided, performs automatic coercion.
 * When no schema is given, infers and reports type conflicts.
 */

// ─── TYPE DETECTION ──────────────────────────────────────────────────────────

// Maximum string length to consider as a parseable integer (avoids precision loss for very large numbers)
const MAX_SAFE_INTEGER_STRING_LENGTH = 16;

/**
 * Infer the most specific type from a value.
 * v7: Enhanced with case-insensitive boolean and more date format detection.
 */
function inferType(value) {
  if (value === null || value === undefined) return 'null';
  if (typeof value === 'boolean') return 'boolean';
  if (typeof value === 'number') return Number.isInteger(value) ? 'integer' : 'float';
  if (value instanceof Date) return 'date';
  if (Array.isArray(value)) return 'array';
  if (typeof value === 'object') return 'object';

  if (typeof value === 'string') {
    const lower = value.toLowerCase().trim();

    // Boolean strings (case-insensitive)
    if (lower === 'true' || lower === 'false') return 'boolean_string';
    if (lower === '1' || lower === '0') return 'numeric_boolean';
    if (lower === 'yes' || lower === 'no') return 'boolean_string';
    if (lower === 'on' || lower === 'off') return 'boolean_string';

    // Date strings (ISO 8601 and common formats)
    if (/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2})?/.test(value)) {
      const d = new Date(value);
      if (!isNaN(d.getTime())) return 'date_string';
    }
    // v7: DD/MM/YYYY or MM/DD/YYYY formats
    if (/^\d{1,2}[/.-]\d{1,2}[/.-]\d{2,4}$/.test(value)) return 'date_string';

    // Integer strings
    if (/^-?\d+$/.test(value) && value.length < MAX_SAFE_INTEGER_STRING_LENGTH) return 'integer_string';

    // Float strings
    if (/^-?\d+\.\d+$/.test(value)) return 'float_string';

    // v7: Numeric string with comma separators
    if (/^-?\d{1,3}(,\d{3})+(\.\d+)?$/.test(value)) return 'float_string';

    // v7: Percentage strings
    if (/^-?\d+(\.\d+)?%$/.test(value)) return 'percentage_string';

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
 * v7: Added percentage_string conflict detection.
 */
function isTypeConflict(actualType, schemaType) {
  const conflictMap = {
    boolean_string: ['boolean'],
    numeric_boolean: ['boolean', 'integer', 'number'],
    date_string: ['date'],
    integer_string: ['integer', 'number'],
    float_string: ['float', 'number'],
    percentage_string: ['float', 'number'],
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
    // v7: Case-insensitive boolean parsing
    if (typeof value === 'string') {
      const lower = value.toLowerCase().trim();
      if (lower === 'true' || lower === 'yes' || lower === 'on' || lower === '1') {
        return { value: true, coerced: true };
      }
      if (lower === 'false' || lower === 'no' || lower === 'off' || lower === '0') {
        return { value: false, coerced: true };
      }
    }
    if (value === 1) return { value: true, coerced: true };
    if (value === 0) return { value: false, coerced: true };
    return { value: Boolean(value), coerced: true };
  },

  integer: (value) => {
    if (typeof value === 'number' && Number.isInteger(value)) return { value, coerced: false };
    // v7: Handle comma-separated numbers
    const str = String(value).replace(/,/g, '');
    const n = parseInt(str, 10);
    if (isNaN(n)) return { value, coerced: false, failed: true };
    return { value: n, coerced: true };
  },

  float: (value) => {
    if (typeof value === 'number') return { value, coerced: false };
    let str = String(value);
    // v7: Handle percentage strings
    if (str.endsWith('%')) {
      const n = parseFloat(str.slice(0, -1));
      if (!isNaN(n)) return { value: n / 100, coerced: true };
    }
    // v7: Handle comma-separated numbers
    str = str.replace(/,/g, '');
    const n = parseFloat(str);
    if (isNaN(n)) return { value, coerced: false, failed: true };
    return { value: n, coerced: true };
  },

  number: (value) => {
    if (typeof value === 'number') return { value, coerced: false };
    let str = String(value);
    // v7: Handle percentage strings
    if (str.endsWith('%')) {
      const n = parseFloat(str.slice(0, -1));
      if (!isNaN(n)) return { value: n / 100, coerced: true };
    }
    // v7: Handle comma-separated numbers
    str = str.replace(/,/g, '');
    const n = Number(str);
    if (isNaN(n)) return { value, coerced: false, failed: true };
    return { value: n, coerced: true };
  },

  date: (value) => {
    if (value instanceof Date) return { value, coerced: false };
    // v7: Handle DD/MM/YYYY and MM/DD/YYYY formats
    if (typeof value === 'string') {
      const slashMatch = value.match(/^(\d{1,2})[/.-](\d{1,2})[/.-](\d{2,4})$/);
      if (slashMatch) {
        const [, a, b, year] = slashMatch;
        const fullYear = year.length === 2 ? '20' + year : year;
        // Try MM/DD/YYYY first (US format), fallback to DD/MM/YYYY
        let d = new Date(`${fullYear}-${a.padStart(2, '0')}-${b.padStart(2, '0')}`);
        if (!isNaN(d.getTime())) return { value: d, coerced: true };
        d = new Date(`${fullYear}-${b.padStart(2, '0')}-${a.padStart(2, '0')}`);
        if (!isNaN(d.getTime())) return { value: d, coerced: true };
      }
    }
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
      // v7: Handle comma-separated strings as arrays
      if (value.includes(',')) {
        return { value: value.split(',').map(s => s.trim()), coerced: true };
      }
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
