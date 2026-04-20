/**
 * nopes v3 — Field Projection Engine
 *
 * Select, omit, rename, and reshape fields from API responses.
 * Like SQL SELECT or MongoDB projection — pick only what you need.
 *
 * Supports:
 *  - pick(data, ['field1', 'field2'])           — select only these fields
 *  - omit(data, ['secret', 'internal'])         — exclude these fields
 *  - rename(data, { oldName: 'newName' })       — rename fields
 *  - reshape(data, { output: 'input.nested' })  — deep path mapping
 *  - flatten(data)                              — flatten nested objects
 *  - compact(data)                              — remove null/undefined fields
 */

class FieldProjection {
  /**
   * Pick only specified fields from data.
   * Supports dot notation for nested fields.
   * @param {object} data
   * @param {string[]} fields
   * @returns {object}
   */
  pick(data, fields) {
    if (!data || typeof data !== 'object') return data;
    if (Array.isArray(data)) return data.map(item => this.pick(item, fields));

    const result = {};
    for (const field of fields) {
      const value = this._getNestedValue(data, field);
      if (value !== undefined) {
        this._setNestedValue(result, field, value);
      }
    }
    return result;
  }

  /**
   * Exclude specified fields from data.
   * @param {object} data
   * @param {string[]} fields
   * @returns {object}
   */
  omit(data, fields) {
    if (!data || typeof data !== 'object') return data;
    if (Array.isArray(data)) return data.map(item => this.omit(item, fields));

    const fieldSet = new Set(fields);
    const result = {};

    for (const [key, value] of Object.entries(data)) {
      if (!fieldSet.has(key)) {
        result[key] = value;
      }
    }
    return result;
  }

  /**
   * Rename fields in data.
   * @param {object} data
   * @param {object} mapping  { currentName: 'newName' }
   * @returns {object}
   */
  rename(data, mapping) {
    if (!data || typeof data !== 'object') return data;
    if (Array.isArray(data)) return data.map(item => this.rename(item, mapping));

    const result = {};
    for (const [key, value] of Object.entries(data)) {
      const newKey = mapping[key] || key;
      result[newKey] = value;
    }
    return result;
  }

  /**
   * Reshape data using dot-notation path mappings.
   * @param {object} data
   * @param {object} mapping  { outputField: 'input.path.to.value' }
   * @returns {object}
   */
  reshape(data, mapping) {
    if (!data || typeof data !== 'object') return data;
    if (Array.isArray(data)) return data.map(item => this.reshape(item, mapping));

    const result = {};
    for (const [outputField, inputPath] of Object.entries(mapping)) {
      const value = this._getNestedValue(data, inputPath);
      if (value !== undefined) {
        result[outputField] = value;
      }
    }
    return result;
  }

  /**
   * Flatten nested objects to dot-notation keys.
   * @param {object} data
   * @param {string} prefix
   * @returns {object}
   */
  flatten(data, prefix = '') {
    if (!data || typeof data !== 'object' || Array.isArray(data)) return data;

    const result = {};
    for (const [key, value] of Object.entries(data)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      if (value !== null && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
        Object.assign(result, this.flatten(value, fullKey));
      } else {
        result[fullKey] = value;
      }
    }
    return result;
  }

  /**
   * Remove null, undefined, and empty string fields.
   * @param {object} data
   * @param {object} options
   * @param {boolean} options.removeEmpty  Remove empty strings (default false)
   * @returns {object}
   */
  compact(data, options = {}) {
    if (!data || typeof data !== 'object') return data;
    if (Array.isArray(data)) return data.filter(item => item !== null && item !== undefined);

    const result = {};
    for (const [key, value] of Object.entries(data)) {
      if (value === null || value === undefined) continue;
      if (options.removeEmpty && value === '') continue;
      if (typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
        result[key] = this.compact(value, options);
      } else {
        result[key] = value;
      }
    }
    return result;
  }

  /**
   * Get a value at a dot-notation path.
   */
  _getNestedValue(obj, path) {
    const keys = path.split('.');
    let current = obj;
    for (const key of keys) {
      if (current === null || current === undefined || typeof current !== 'object') {
        return undefined;
      }
      current = current[key];
    }
    return current;
  }

  /**
   * Set a value at a dot-notation path.
   */
  _setNestedValue(obj, path, value) {
    const keys = path.split('.');
    let current = obj;
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      // Guard against prototype pollution
      if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
        return;
      }
      if (!current[key] || typeof current[key] !== 'object') {
        current[key] = {};
      }
      current = current[key];
    }
    const finalKey = keys[keys.length - 1];
    // Guard against prototype pollution
    if (finalKey === '__proto__' || finalKey === 'constructor' || finalKey === 'prototype') {
      return;
    }
    current[finalKey] = value;
  }
}

module.exports = { FieldProjection };
