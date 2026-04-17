/**
 * APIBridge AI v10 — FormData Utilities
 *
 * Helpers for converting objects to FormData and detecting multipart content.
 *
 * Usage:
 *   const fd = toFormData({ name: 'John', avatar: file });
 *   api.post('/upload', fd);
 */

'use strict';

/**
 * Check if a value is a FormData instance.
 * Works in Node.js ≥18 and browsers.
 *
 * @param {*} value
 * @returns {boolean}
 */
function isFormData(value) {
  return (
    value !== null &&
    typeof value === 'object' &&
    typeof value.append === 'function' &&
    (
      (typeof FormData !== 'undefined' && value instanceof FormData) ||
      value.constructor?.name === 'FormData' ||
      (typeof value.toString === 'function' && value.toString() === '[object FormData]')
    )
  );
}

/**
 * Check if a value is a Blob-like object.
 * @param {*} value
 * @returns {boolean}
 */
function isBlob(value) {
  return typeof Blob !== 'undefined' && value instanceof Blob;
}

/**
 * Check if a value is a File-like object.
 * @param {*} value
 * @returns {boolean}
 */
function isFile(value) {
  return typeof File !== 'undefined' && value instanceof File;
}

/**
 * Check if a value is a Buffer.
 * @param {*} value
 * @returns {boolean}
 */
function isBuffer(value) {
  return typeof Buffer !== 'undefined' && Buffer.isBuffer(value);
}

/**
 * Check if a value is a Stream.
 * @param {*} value
 * @returns {boolean}
 */
function isStream(value) {
  return value !== null && typeof value === 'object' && typeof value.pipe === 'function';
}

/**
 * Check if a value is an ArrayBuffer or typed array.
 * @param {*} value
 * @returns {boolean}
 */
function isArrayBufferView(value) {
  return (
    (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) ||
    (typeof value === 'object' && value !== null && value.buffer instanceof ArrayBuffer)
  );
}

/**
 * Check if a value is a URLSearchParams instance.
 * @param {*} value
 * @returns {boolean}
 */
function isURLSearchParams(value) {
  return typeof URLSearchParams !== 'undefined' && value instanceof URLSearchParams;
}

const DANGEROUS_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

/**
 * Convert a plain object to FormData.
 *
 * Supports:
 *   - Scalar values (string, number, boolean)
 *   - Nested objects (serialized with bracket notation: parent[child])
 *   - Arrays (serialized as key[0], key[1], ...)
 *   - File/Blob values (appended directly)
 *   - Date values (converted to ISO string)
 *
 * @param {object} obj — Plain object to convert
 * @param {FormData} [formData] — Existing FormData to append to
 * @param {string} [parentKey] — Parent key for nested objects
 * @returns {FormData}
 */
function toFormData(obj, formData, parentKey) {
  if (typeof FormData === 'undefined') {
    throw new Error('FormData is not available in this environment');
  }

  const fd = formData || new FormData();

  if (obj === null || obj === undefined) {
    return fd;
  }

  if (typeof obj !== 'object' || isFormData(obj)) {
    return fd;
  }

  const entries = Array.isArray(obj)
    ? obj.map((val, idx) => [idx, val])
    : Object.entries(obj);

  for (const [key, value] of entries) {
    if (DANGEROUS_KEYS.has(String(key))) continue;

    const fullKey = parentKey ? `${parentKey}[${key}]` : String(key);

    if (value === null || value === undefined) {
      fd.append(fullKey, '');
    } else if (isFile(value) || isBlob(value)) {
      fd.append(fullKey, value);
    } else if (isBuffer(value)) {
      fd.append(fullKey, new Blob([value]));
    } else if (value instanceof Date) {
      fd.append(fullKey, value.toISOString());
    } else if (Array.isArray(value)) {
      toFormData(value, fd, fullKey);
    } else if (typeof value === 'object') {
      toFormData(value, fd, fullKey);
    } else {
      fd.append(fullKey, String(value));
    }
  }

  return fd;
}

module.exports = {
  toFormData,
  isFormData,
  isBlob,
  isFile,
  isBuffer,
  isStream,
  isArrayBufferView,
  isURLSearchParams,
};
