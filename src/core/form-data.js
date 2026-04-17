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

/**
 * Convert an object to URL-encoded form data string.
 *
 * @param {object} data
 * @returns {URLSearchParams}
 */
function toURLEncodedForm(data) {
  if (isURLSearchParams(data)) return data;

  const params = new URLSearchParams();
  if (!data || typeof data !== 'object') return params;

  const entries = Array.isArray(data)
    ? data.map((val, idx) => [idx, val])
    : Object.entries(data);

  for (const [key, value] of entries) {
    if (DANGEROUS_KEYS.has(String(key))) continue;

    if (value === null || value === undefined) {
      params.append(String(key), '');
    } else if (Array.isArray(value)) {
      for (const item of value) {
        params.append(`${key}[]`, String(item));
      }
    } else if (typeof value === 'object' && !(value instanceof Date)) {
      params.append(String(key), JSON.stringify(value));
    } else if (value instanceof Date) {
      params.append(String(key), value.toISOString());
    } else {
      params.append(String(key), String(value));
    }
  }

  return params;
}

/**
 * Convert FormData entries back to a plain JSON object.
 * Handles bracket notation (e.g., user[name]) for nested objects.
 *
 * @param {FormData} formData
 * @returns {object}
 */
function formToJSON(formData) {
  if (!formData || typeof formData.entries !== 'function') {
    return {};
  }

  const result = {};

  for (const [key, value] of formData.entries()) {
    const keys = key.replace(/\]/g, '').split('[');
    let current = result;

    for (let i = 0; i < keys.length; i++) {
      const k = keys[i];
      if (i === keys.length - 1) {
        if (current[k] !== undefined) {
          if (!Array.isArray(current[k])) {
            current[k] = [current[k]];
          }
          current[k].push(value);
        } else {
          current[k] = value;
        }
      } else {
        if (current[k] === undefined || typeof current[k] !== 'object') {
          current[k] = isNaN(keys[i + 1]) ? {} : [];
        }
        current = current[k];
      }
    }
  }

  return result;
}

/**
 * Check if a value is a typed array (Uint8Array, etc.).
 * @param {*} val
 * @returns {boolean}
 */
function isTypedArray(val) {
  return typeof ArrayBuffer !== 'undefined' && ArrayBuffer.isView(val) && !(val instanceof DataView);
}

/**
 * Check if a value is a FileList.
 * @param {*} val
 * @returns {boolean}
 */
function isFileList(val) {
  return typeof FileList !== 'undefined' && val instanceof FileList;
}

module.exports = {
  toFormData,
  toURLEncodedForm,
  formToJSON,
  isFormData,
  isBlob,
  isFile,
  isBuffer,
  isStream,
  isArrayBufferView,
  isURLSearchParams,
  isTypedArray,
  isFileList,
};
