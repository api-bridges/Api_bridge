/**
 * yarou v9 — Expectation Engine
 *
 * Core innovation: allows frontend to declare expected response format.
 * The engine extracts the "expect" schema, serializes it to a request header,
 * and on response auto-aligns backend data with frontend expectations.
 *
 * Usage:
 *   client.get("/user", {
 *     expect: {
 *       userName: "string",
 *       userEmail: "string",
 *       accountBalance: "number"
 *     }
 *   });
 *
 * The engine:
 *   1. Extracts "expect" from the request config
 *   2. Serializes it as "x-api-bridge-expect" header (Base64 JSON)
 *   3. Removes "expect" from payload
 *   4. On response, aligns backend data to match the expected format
 */

'use strict';

const MAX_EXPECT_KEYS = 200;
const MAX_EXPECT_DEPTH = 10;
const DANGEROUS_KEYS = new Set(['__proto__', 'constructor', 'prototype']);
const HEADER_NAME = 'x-api-bridge-expect';

/**
 * Validate an expect schema for safety and sanity.
 * Prevents prototype pollution, excessive depth, and oversized schemas.
 *
 * @param {object} schema — The expect schema
 * @param {number} [depth=0] — Current recursion depth
 * @returns {{ valid: boolean, error?: string }}
 */
function validateExpect(schema, depth = 0) {
  if (schema === null || schema === undefined) {
    return { valid: false, error: 'Expect schema is null or undefined' };
  }
  if (typeof schema !== 'object' || Array.isArray(schema)) {
    return { valid: false, error: 'Expect schema must be a plain object' };
  }
  if (depth > MAX_EXPECT_DEPTH) {
    return { valid: false, error: `Expect schema exceeds max depth of ${MAX_EXPECT_DEPTH}` };
  }

  // Use getOwnPropertyNames to catch __proto__ even in literal objects
  const keys = Object.getOwnPropertyNames(schema);
  if (keys.length > MAX_EXPECT_KEYS) {
    return { valid: false, error: `Expect schema exceeds max keys of ${MAX_EXPECT_KEYS}` };
  }

  for (const key of keys) {
    if (DANGEROUS_KEYS.has(key)) {
      return { valid: false, error: `Expect schema contains dangerous key: ${key}` };
    }
    const val = schema[key];
    if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
      const nested = validateExpect(val, depth + 1);
      if (!nested.valid) return nested;
    } else if (typeof val === 'string') {
      const allowed = new Set(['string', 'number', 'boolean', 'date', 'object', 'array', 'any']);
      if (!allowed.has(val.toLowerCase())) {
        return { valid: false, error: `Unknown expect type "${val}" for key "${key}"` };
      }
    } else if (typeof val !== 'function') {
      return { valid: false, error: `Invalid expect value for key "${key}": must be a type string or nested object` };
    }
  }

  return { valid: true };
}

/**
 * Serialize expect schema to a header-safe string (Base64 JSON).
 *
 * @param {object} schema
 * @returns {string}
 */
function serializeExpect(schema) {
  const json = JSON.stringify(schema);
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(json, 'utf8').toString('base64');
  }
  // Browser fallback
  return btoa(unescape(encodeURIComponent(json)));
}

/**
 * Deserialize a base64-encoded expect header back to an object.
 *
 * @param {string} encoded
 * @returns {object|null}
 */
function deserializeExpect(encoded) {
  try {
    let json;
    if (typeof Buffer !== 'undefined') {
      json = Buffer.from(encoded, 'base64').toString('utf8');
    } else {
      json = decodeURIComponent(escape(atob(encoded)));
    }
    return JSON.parse(json);
  } catch {
    return null;
  }
}

/**
 * Extract the "expect" property from a request config.
 * Returns the cleaned config and the extracted expect schema.
 *
 * @param {object} config — Request config (may contain `expect`)
 * @returns {{ config: object, expect: object|null, error?: string }}
 */
function extractExpect(config) {
  if (!config || typeof config !== 'object' || !config.expect) {
    return { config: config || {}, expect: null };
  }

  const expect = config.expect;
  const validation = validateExpect(expect);
  if (!validation.valid) {
    return { config, expect: null, error: validation.error };
  }

  // Clone config without expect
  const cleaned = {};
  for (const key of Object.keys(config)) {
    if (key !== 'expect') {
      cleaned[key] = config[key];
    }
  }

  return { config: cleaned, expect };
}

/**
 * Inject the expect schema into request headers.
 *
 * @param {object} headers — Existing headers object
 * @param {object} expect — Validated expect schema
 * @returns {object} Headers with x-api-bridge-expect added
 */
function injectExpectHeader(headers, expect) {
  if (!expect) return headers || {};
  const result = Object.assign({}, headers || {});
  result[HEADER_NAME] = serializeExpect(expect);
  return result;
}

/**
 * Get the flat type map from a (possibly nested) expect schema.
 * Used by the alignment engine to know what types are expected.
 *
 * @param {object} schema — The expect schema
 * @param {string} [prefix=''] — Dot-separated prefix for nested keys
 * @returns {Map<string, string>} Map of field name → expected type
 */
function flattenExpect(schema, prefix = '') {
  const result = new Map();
  if (!schema || typeof schema !== 'object') return result;

  for (const [key, val] of Object.entries(schema)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof val === 'string') {
      result.set(fullKey, val.toLowerCase());
    } else if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
      result.set(fullKey, 'object');
      const nested = flattenExpect(val, fullKey);
      for (const [nk, nv] of nested) {
        result.set(nk, nv);
      }
    }
  }
  return result;
}

module.exports = {
  validateExpect,
  serializeExpect,
  deserializeExpect,
  extractExpect,
  injectExpectHeader,
  flattenExpect,
  HEADER_NAME,
  MAX_EXPECT_KEYS,
  MAX_EXPECT_DEPTH,
};
