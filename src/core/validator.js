/**
 * awsibnj v3 — Schema Validator
 *
 * Validates data against a user-defined schema.
 * Reports missing fields, extra fields, type mismatches.
 *
 * Schema format:
 *   {
 *     fieldName: { type: 'string', required: true, default: '' },
 *     age:       { type: 'number', required: false },
 *     isActive:  { type: 'boolean', required: true, default: false },
 *   }
 */

const { ValidationError } = require('./errors');

const VALID_TYPES = new Set([
  'string', 'number', 'boolean', 'date', 'array', 'json', 'object', 'any',
]);

class SchemaValidator {
  /**
   * @param {object} options
   * @param {boolean} options.strict      Fail on extra fields not in schema (default false)
   * @param {boolean} options.coerce      Auto-fill defaults for missing fields (default true)
   * @param {boolean} options.throwOnError Throw instead of returning error list (default false)
   */
  constructor(options = {}) {
    this.strict = options.strict || false;
    this.coerce = options.coerce !== false;
    this.throwOnError = options.throwOnError || false;
  }

  /**
   * Validate data against a schema.
   * @returns {{ valid: boolean, errors: Array, data: object }}
   */
  validate(data, schema) {
    if (!schema || typeof schema !== 'object') {
      return { valid: true, errors: [], data };
    }
    if (data === null || data === undefined || typeof data !== 'object') {
      return { valid: true, errors: [], data };
    }

    const errors = [];
    const result = { ...data };

    // Check required fields and types
    for (const [field, spec] of Object.entries(schema)) {
      const hasField = Object.prototype.hasOwnProperty.call(result, field);

      // Missing required field
      if (!hasField && spec.required) {
        if (this.coerce && spec.default !== undefined) {
          result[field] = spec.default;
        } else {
          errors.push({
            field,
            rule: 'required',
            message: `Missing required field "${field}"`,
            expected: spec.type || 'any',
            received: 'undefined',
          });
        }
        continue;
      }

      if (!hasField) continue;

      // Type check
      if (spec.type && spec.type !== 'any') {
        const typeOk = this._checkType(result[field], spec.type);
        if (!typeOk) {
          errors.push({
            field,
            rule: 'type',
            message: `Field "${field}" expected type "${spec.type}" but got "${typeof result[field]}"`,
            expected: spec.type,
            received: typeof result[field],
          });
        }
      }
    }

    // Strict mode: reject extra fields
    if (this.strict) {
      for (const key of Object.keys(result)) {
        if (!schema[key]) {
          errors.push({
            field: key,
            rule: 'extra',
            message: `Unexpected field "${key}" not defined in schema`,
            expected: 'none',
            received: typeof result[key],
          });
        }
      }
    }

    if (this.throwOnError && errors.length > 0) {
      throw new ValidationError(
        `Schema validation failed with ${errors.length} error(s): ${errors.map(e => e.message).join('; ')}`,
        errors[0].field,
        errors[0].expected,
        errors[0].received,
      );
    }

    return { valid: errors.length === 0, errors, data: result };
  }

  _checkType(value, expectedType) {
    if (value === null || value === undefined) return false;
    switch (expectedType) {
      case 'string':  return typeof value === 'string';
      case 'number':  return typeof value === 'number' && !isNaN(value);
      case 'boolean': return typeof value === 'boolean';
      case 'date':    return value instanceof Date || (typeof value === 'string' && !isNaN(Date.parse(value)));
      case 'array':   return Array.isArray(value);
      case 'json':
      case 'object':  return typeof value === 'object' && !Array.isArray(value);
      default:        return true;
    }
  }
}

module.exports = { SchemaValidator, VALID_TYPES };
