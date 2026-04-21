/**
 * awsibnj v15 — AxiosHeaders-compatible Header Management
 *
 * A normalized header class that provides case-insensitive header access,
 * similar to Axios's AxiosHeaders class.
 *
 * Features:
 *   - Case-insensitive get/set/has/delete
 *   - Normalize header names
 *   - Merge headers
 *   - Iterate with forEach
 *   - Serialize to plain object
 *   - fromEntries / from / concat
 *
 * v15 Enhancements:
 *   - Raw header string parsing via AxiosHeaders.fromString()
 *   - toJSON filter support (boolean, array of names, or RegExp)
 *   - Additional pre-defined accessors (User-Agent, Content-Encoding, Content-Disposition)
 *
 * Usage:
 *   const headers = new AxiosHeaders({ 'Content-Type': 'application/json' });
 *   headers.set('authorization', 'Bearer token');
 *   headers.get('Authorization'); // 'Bearer token'
 *   headers.has('content-type'); // true
 *   const h = AxiosHeaders.fromString('Content-Type: text/html\r\nAccept: text/html');
 */

'use strict';

const DANGEROUS_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

/**
 * Normalize a header name to a canonical form.
 * Converts to Title-Case-Dashes format (e.g., 'content-type' → 'Content-Type').
 *
 * @param {string} name
 * @returns {string}
 */
function normalizeHeaderName(name) {
  if (!name || typeof name !== 'string') return '';
  return name
    .toLowerCase()
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('-');
}

class AxiosHeaders {
  /**
   * @param {object|AxiosHeaders|Array} [init] — Initial headers
   */
  constructor(init) {
    this._headers = new Map();

    if (init) {
      if (init instanceof AxiosHeaders) {
        init.forEach((value, key) => {
          this.set(key, value);
        });
      } else if (Array.isArray(init)) {
        for (const [key, value] of init) {
          if (!DANGEROUS_KEYS.has(String(key))) {
            this.set(key, value);
          }
        }
      } else if (typeof init === 'object' && init !== null) {
        for (const [key, value] of Object.entries(init)) {
          if (!DANGEROUS_KEYS.has(key)) {
            this.set(key, value);
          }
        }
      }
    }
  }

  /**
   * Set a header value.
   * @param {string} name
   * @param {string|string[]} value
   * @param {boolean} [rewrite=true] — If false, don't overwrite existing
   * @returns {AxiosHeaders} this
   */
  set(name, value, rewrite = true) {
    if (!name || typeof name !== 'string') return this;
    if (DANGEROUS_KEYS.has(name)) return this;

    const normalized = normalizeHeaderName(name);
    const key = normalized.toLowerCase();

    if (!rewrite && this._headers.has(key)) {
      return this;
    }

    if (value === null || value === undefined) {
      this._headers.delete(key);
    } else {
      this._headers.set(key, {
        name: normalized,
        value: Array.isArray(value) ? value.join(', ') : String(value),
      });
    }

    return this;
  }

  /**
   * Get a header value.
   * @param {string} name
   * @param {boolean} [asParsed=false] — If true, attempt to parse JSON
   * @returns {string|null}
   */
  get(name, asParsed = false) {
    if (!name || typeof name !== 'string') return null;
    const key = name.toLowerCase();
    const entry = this._headers.get(key);
    if (!entry) return null;

    if (asParsed) {
      try {
        return JSON.parse(entry.value);
      } catch {
        return entry.value;
      }
    }

    return entry.value;
  }

  /**
   * Check if a header exists.
   * @param {string} name
   * @returns {boolean}
   */
  has(name) {
    if (!name || typeof name !== 'string') return false;
    return this._headers.has(name.toLowerCase());
  }

  /**
   * Delete a header.
   * @param {string} name
   * @returns {boolean}
   */
  delete(name) {
    if (!name || typeof name !== 'string') return false;
    return this._headers.delete(name.toLowerCase());
  }

  /**
   * Clear all headers.
   * @returns {AxiosHeaders} this
   */
  clear() {
    this._headers.clear();
    return this;
  }

  /**
   * Iterate over headers.
   * @param {Function} callback — (value, name, headers)
   * @param {*} [thisArg]
   */
  forEach(callback, thisArg) {
    for (const [, entry] of this._headers) {
      callback.call(thisArg, entry.value, entry.name, this);
    }
  }

  /**
   * Get all header names.
   * @returns {string[]}
   */
  keys() {
    const result = [];
    for (const [, entry] of this._headers) {
      result.push(entry.name);
    }
    return result;
  }

  /**
   * Get all header values.
   * @returns {string[]}
   */
  values() {
    const result = [];
    for (const [, entry] of this._headers) {
      result.push(entry.value);
    }
    return result;
  }

  /**
   * Get all entries as [name, value] pairs.
   * @returns {Array<[string, string]>}
   */
  entries() {
    const result = [];
    for (const [, entry] of this._headers) {
      result.push([entry.name, entry.value]);
    }
    return result;
  }

  /**
   * Number of headers.
   * @returns {number}
   */
  get size() {
    return this._headers.size;
  }

  /**
   * Normalize all header names to a specific format.
   * @param {boolean} [asFormat=true] — If true, normalize names
   * @returns {AxiosHeaders} this
   */
  normalize(asFormat = true) {
    if (!asFormat) return this;
    // Already normalized on set, but re-normalize for safety
    const entries = [...this._headers.entries()];
    this._headers.clear();
    for (const [, entry] of entries) {
      const normalized = normalizeHeaderName(entry.name);
      this._headers.set(normalized.toLowerCase(), {
        name: normalized,
        value: entry.value,
      });
    }
    return this;
  }

  /**
   * Merge another headers object into this one.
   * @param {object|AxiosHeaders} other
   * @param {boolean} [rewrite=true]
   * @returns {AxiosHeaders} this
   */
  merge(other, rewrite = true) {
    if (!other) return this;

    if (other instanceof AxiosHeaders) {
      other.forEach((value, name) => {
        this.set(name, value, rewrite);
      });
    } else if (typeof other === 'object') {
      for (const [key, value] of Object.entries(other)) {
        if (!DANGEROUS_KEYS.has(key)) {
          this.set(key, value, rewrite);
        }
      }
    }

    return this;
  }

  /**
   * Convert to a plain object.
   *
   * @param {boolean|string[]|RegExp} [asStrings=true] — Filter parameter:
   *   - boolean (legacy): if true, use normalized names; if false, use lowercase names
   *   - string[]: only include headers whose names are in this array (case-insensitive)
   *   - RegExp: only include headers whose names match this pattern
   * @returns {object}
   */
  toJSON(asStrings = true) {
    const result = {};

    if (Array.isArray(asStrings)) {
      const allowed = new Set(asStrings.map(n => n.toLowerCase()));
      for (const [, entry] of this._headers) {
        if (allowed.has(entry.name.toLowerCase())) {
          result[entry.name] = entry.value;
        }
      }
    } else if (asStrings instanceof RegExp) {
      for (const [, entry] of this._headers) {
        if (asStrings.test(entry.name)) {
          result[entry.name] = entry.value;
        }
      }
    } else {
      const normalize = asStrings !== false;
      for (const [, entry] of this._headers) {
        result[normalize ? entry.name : entry.name.toLowerCase()] = entry.value;
      }
    }

    return result;
  }

  /**
   * Convert to a string representation.
   * @returns {string}
   */
  toString() {
    const lines = [];
    for (const [, entry] of this._headers) {
      lines.push(`${entry.name}: ${entry.value}`);
    }
    return lines.join('\r\n');
  }

  /**
   * Make iterable.
   */
  [Symbol.iterator]() {
    return this.entries()[Symbol.iterator]();
  }

  /**
   * Create from an entries iterable.
   * @param {Iterable} entries
   * @returns {AxiosHeaders}
   */
  static from(entries) {
    if (entries instanceof AxiosHeaders) {
      return new AxiosHeaders(entries);
    }
    return new AxiosHeaders(entries);
  }

  /**
   * Parse a raw HTTP header string into an AxiosHeaders instance.
   * Lines are split on "\r\n" or "\n". Each line should be "Name: Value".
   *
   * @param {string} headerStr — Raw header string
   * @returns {AxiosHeaders}
   */
  static fromString(headerStr) {
    const instance = new AxiosHeaders();
    if (!headerStr || typeof headerStr !== 'string') return instance;

    const lines = headerStr.split(/\r?\n/);
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      const colonIdx = trimmed.indexOf(':');
      if (colonIdx === -1) continue;
      const name = trimmed.slice(0, colonIdx).trim();
      const value = trimmed.slice(colonIdx + 1).trim();
      if (name && !DANGEROUS_KEYS.has(name)) {
        instance.set(name, value);
      }
    }
    return instance;
  }

  /**
   * Concatenate multiple header sources.
   * @param {...(object|AxiosHeaders)} sources
   * @returns {AxiosHeaders}
   */
  static concat(...sources) {
    const result = new AxiosHeaders();
    for (const source of sources) {
      result.merge(source);
    }
    return result;
  }

  /**
   * Create an accessor that adds get/set/has methods for a specific header.
   * @param {string} name — Header name
   * @returns {AxiosHeaders} The class (for chaining)
   */
  static accessor(name) {
    const normalized = normalizeHeaderName(name);
    const propName = normalized.replace(/-/g, '');

    Object.defineProperties(AxiosHeaders.prototype, {
      [`get${propName}`]: {
        value: function () {
          return this.get(name);
        },
        configurable: true,
      },
      [`set${propName}`]: {
        value: function (value, rewrite) {
          this.set(name, value, rewrite);
          return this;
        },
        configurable: true,
      },
      [`has${propName}`]: {
        value: function () {
          return this.has(name);
        },
        configurable: true,
      },
    });

    return AxiosHeaders;
  }
}

// Pre-define common header accessors
AxiosHeaders.accessor('Content-Type');
AxiosHeaders.accessor('Content-Length');
AxiosHeaders.accessor('Accept');
AxiosHeaders.accessor('Authorization');
AxiosHeaders.accessor('User-Agent');
AxiosHeaders.accessor('Content-Encoding');
AxiosHeaders.accessor('Content-Disposition');

module.exports = { AxiosHeaders, normalizeHeaderName };
