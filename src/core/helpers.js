/**
 * awsibnj v11 — Type Detection & Utility Helpers
 *
 * Comprehensive set of type-checking and utility functions,
 * matching Axios's utils module for complete drop-in compatibility.
 *
 * Usage:
 *   const { isPlainObject, isFunction, isString } = require('awsibnj');
 */

'use strict';

const toString = Object.prototype.toString;

/**
 * Get the type tag of a value.
 * @param {*} thing
 * @returns {string}
 */
function kindOf(thing) {
  if (thing === null) return 'null';
  if (thing === undefined) return 'undefined';
  const str = toString.call(thing);
  return str.slice(8, -1).toLowerCase();
}

/**
 * Determine if a value is a plain object (created by {} or Object.create(null)).
 * @param {*} val
 * @returns {boolean}
 */
function isPlainObject(val) {
  if (kindOf(val) !== 'object') return false;
  const proto = Object.getPrototypeOf(val);
  return proto === null || proto === Object.prototype;
}

/**
 * Determine if a value is an object (not null).
 * @param {*} thing
 * @returns {boolean}
 */
function isObject(thing) {
  return thing !== null && typeof thing === 'object';
}

/**
 * Determine if a value is a function.
 * @param {*} val
 * @returns {boolean}
 */
function isFunction(val) {
  return typeof val === 'function';
}

/**
 * Determine if a value is a string.
 * @param {*} val
 * @returns {boolean}
 */
function isString(val) {
  return typeof val === 'string';
}

/**
 * Determine if a value is a number.
 * @param {*} val
 * @returns {boolean}
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Determine if a value is a boolean.
 * @param {*} val
 * @returns {boolean}
 */
function isBoolean(val) {
  return typeof val === 'boolean';
}

/**
 * Determine if a value is undefined.
 * @param {*} val
 * @returns {boolean}
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * Determine if a value is a Date.
 * @param {*} val
 * @returns {boolean}
 */
function isDate(val) {
  return kindOf(val) === 'date';
}

/**
 * Determine if a value is a RegExp.
 * @param {*} val
 * @returns {boolean}
 */
function isRegExp(val) {
  return kindOf(val) === 'regexp';
}

/**
 * Determine if a value is a typed array (Uint8Array, Int32Array, etc.).
 * @param {*} val
 * @returns {boolean}
 */
function isTypedArray(val) {
  return typeof ArrayBuffer !== 'undefined' && ArrayBuffer.isView(val) && !(val instanceof DataView);
}

/**
 * Determine if a value is a FileList.
 * @param {*} val
 * @returns {boolean}
 */
function isFileList(val) {
  return typeof FileList !== 'undefined' && val instanceof FileList;
}

/**
 * Determine if a value is an HTMLFormElement.
 * @param {*} val
 * @returns {boolean}
 */
function isHTMLForm(val) {
  return typeof HTMLFormElement !== 'undefined' && val instanceof HTMLFormElement;
}

/**
 * Determine if a value is an ArrayBuffer.
 * @param {*} val
 * @returns {boolean}
 */
function isArrayBuffer(val) {
  return typeof ArrayBuffer !== 'undefined' && val instanceof ArrayBuffer;
}

/**
 * Check if a value is iterable with a Symbol.iterator.
 * @param {*} thing
 * @returns {boolean}
 */
function isSpecCompliantForm(thing) {
  return !!(thing && isFunction(thing.append) && kindOf(thing) === 'formdata');
}

/**
 * Iterate over an array or object.
 * @param {Array|Object} obj
 * @param {Function} fn — Callback (value, key, obj)
 * @param {boolean} [allOwnKeys=false]
 */
function forEach(obj, fn, allOwnKeys) {
  if (obj === null || typeof obj === 'undefined') return;

  if (typeof obj !== 'object') {
    obj = [obj];
  }

  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    const keys = allOwnKeys ? Object.getOwnPropertyNames(obj) : Object.keys(obj);
    for (const key of keys) {
      fn.call(null, obj[key], key, obj);
    }
  }
}

/**
 * Merge objects together, with later objects overriding earlier ones.
 * @param {...object} args
 * @returns {object}
 */
function merge(...args) {
  const result = {};

  const assignValue = (val, key) => {
    if (isPlainObject(result[key]) && isPlainObject(val)) {
      result[key] = merge(result[key], val);
    } else if (isPlainObject(val)) {
      result[key] = merge({}, val);
    } else if (Array.isArray(val)) {
      result[key] = val.slice();
    } else {
      result[key] = val;
    }
  };

  for (const obj of args) {
    forEach(obj, assignValue);
  }

  return result;
}

/**
 * Extend one object with properties of another, optionally binding methods.
 * @param {object} a — Object to extend
 * @param {object} b — Source object
 * @param {*} [thisArg] — Context to bind functions to
 * @param {boolean} [allOwnKeys=false]
 * @returns {object} The extended object
 */
function extend(a, b, thisArg, allOwnKeys) {
  forEach(b, (val, key) => {
    if (thisArg && isFunction(val)) {
      a[key] = val.bind(thisArg);
    } else {
      a[key] = val;
    }
  }, allOwnKeys);
  return a;
}

/**
 * Remove byte order mark from string.
 * @param {string} content
 * @returns {string}
 */
function stripBOM(content) {
  if (content.charCodeAt(0) === 0xFEFF) {
    return content.slice(1);
  }
  return content;
}

/**
 * Get a property from an object, case-insensitive.
 * @param {object} obj
 * @param {string} key
 * @returns {*}
 */
function findKey(obj, key) {
  if (!obj) return undefined;
  const lowerKey = key.toLowerCase();
  const keys = Object.keys(obj);
  for (const k of keys) {
    if (k.toLowerCase() === lowerKey) {
      return k;
    }
  }
  return undefined;
}

/**
 * Check if we're in a browser environment.
 * @returns {boolean}
 */
function isBrowser() {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

/**
 * Check if we're in a Node.js environment.
 * @returns {boolean}
 */
function isNode() {
  return typeof process !== 'undefined' && process.versions != null && process.versions.node != null;
}

/**
 * Freeze an object and all nested objects.
 * @param {object} obj
 * @returns {object}
 */
function freezeDeep(obj) {
  if (!obj || typeof obj !== 'object' || Object.isFrozen(obj)) return obj;
  Object.freeze(obj);
  for (const key of Object.keys(obj)) {
    freezeDeep(obj[key]);
  }
  return obj;
}

/**
 * Convert FormData entries to a JSON object.
 * @param {FormData} formData
 * @returns {object}
 */
function formToJSON(formData) {
  if (!formData || typeof formData.entries !== 'function') {
    return {};
  }

  const result = {};

  for (const [key, value] of formData.entries()) {
    // Handle bracket notation: name[field] → nested object
    const keys = key.replace(/\]/g, '').split('[');
    let current = result;

    for (let i = 0; i < keys.length; i++) {
      const k = keys[i];
      if (i === keys.length - 1) {
        // Last key — set value
        if (current[k] !== undefined) {
          // Already exists — make array
          if (!Array.isArray(current[k])) {
            current[k] = [current[k]];
          }
          current[k].push(value);
        } else {
          current[k] = value;
        }
      } else {
        // Intermediate key
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
 * Generate a unique ID.
 * @param {number} [size=21]
 * @returns {string}
 */
function generateUID(size = 21) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < size; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

module.exports = {
  kindOf,
  isPlainObject,
  isObject,
  isFunction,
  isString,
  isNumber,
  isBoolean,
  isUndefined,
  isDate,
  isRegExp,
  isTypedArray,
  isFileList,
  isHTMLForm,
  isArrayBuffer,
  isSpecCompliantForm,
  forEach,
  merge,
  extend,
  stripBOM,
  findKey,
  isBrowser,
  isNode,
  freezeDeep,
  formToJSON,
  generateUID,
};
