/**
 * nopes v4 — JSON Patch Generator
 *
 * Generates and applies RFC 6902 JSON Patch operations:
 *  - Generate diffs between two objects as patch arrays
 *  - Apply patches to documents
 *  - Validate patch arrays
 *  - Test individual patch operations
 *  - Revert patches (generate inverse operations)
 *  - Merge patch arrays with deduplication
 *
 * Path format follows RFC 6902 JSON Pointer (e.g., '/foo/bar/0').
 */

const VALID_OPS = new Set(['add', 'remove', 'replace', 'move', 'copy', 'test']);

const POISON_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

class JSONPatchGenerator {
  /**
   * @param {object} options
   * @param {boolean} options.deepClone  Deep clone documents before applying patches (default true)
   * @param {boolean} options.strict     Strict mode throws on invalid paths (default false)
   */
  constructor(options = {}) {
    this.deepClone = options.deepClone !== false;
    this.strict = options.strict || false;
    this._stats = {
      patchesGenerated: 0,
      patchesApplied: 0,
      operationCounts: { add: 0, remove: 0, replace: 0, move: 0, copy: 0 },
    };
  }

  /**
   * Compare source and target objects and generate an array of JSON Patch operations.
   * @param {object} source  The original object
   * @param {object} target  The desired object
   * @returns {Array<{op: string, path: string, value?: *, from?: string}>}
   */
  generate(source, target) {
    const patches = [];
    this._diffRecursive(source, target, '', patches);
    this._stats.patchesGenerated += patches.length;
    for (const p of patches) {
      if (this._stats.operationCounts[p.op] !== undefined) {
        this._stats.operationCounts[p.op]++;
      }
    }
    return patches;
  }

  /**
   * Apply an array of JSON Patch operations to a document.
   * Validates operations before applying.
   * @param {object} document  The document to patch
   * @param {Array<{op: string, path: string, value?: *, from?: string}>} patches
   * @returns {object} The patched document
   */
  apply(document, patches) {
    const validation = this.validate(patches);
    if (!validation.valid) {
      throw new Error(`Invalid patches: ${validation.errors.map(e => e.message).join('; ')}`);
    }

    let doc = this.deepClone ? this._clone(document) : document;

    for (const patch of patches) {
      doc = this._applyOne(doc, patch);
      this._stats.patchesApplied++;
    }

    return doc;
  }

  /**
   * Validate an array of patches.
   * Checks: op is valid, path is a string starting with '/', value present for add/replace/copy.
   * @param {Array} patches
   * @returns {{ valid: boolean, errors: Array<{ index: number, message: string }> }}
   */
  validate(patches) {
    const errors = [];

    if (!Array.isArray(patches)) {
      return { valid: false, errors: [{ index: -1, message: 'Patches must be an array' }] };
    }

    for (let i = 0; i < patches.length; i++) {
      const p = patches[i];

      if (!p || typeof p !== 'object') {
        errors.push({ index: i, message: 'Patch must be an object' });
        continue;
      }

      if (!VALID_OPS.has(p.op)) {
        errors.push({ index: i, message: `Invalid op: '${p.op}'` });
      }

      if (typeof p.path !== 'string' || (p.path !== '' && !p.path.startsWith('/'))) {
        errors.push({ index: i, message: `Path must be a string starting with '/'` });
      }

      if (['add', 'replace', 'copy'].includes(p.op) && p.value === undefined) {
        errors.push({ index: i, message: `Operation '${p.op}' requires a value` });
      }

      if (['move', 'copy'].includes(p.op)) {
        if (typeof p.from !== 'string' || (p.from !== '' && !p.from.startsWith('/'))) {
          errors.push({ index: i, message: `Operation '${p.op}' requires a valid 'from' path` });
        }
      }

      if (typeof p.path === 'string') {
        const segments = this._parsePointer(p.path);
        if (segments.some(s => POISON_KEYS.has(s))) {
          errors.push({ index: i, message: 'Path contains forbidden key' });
        }
      }

      if (typeof p.from === 'string') {
        const segments = this._parsePointer(p.from);
        if (segments.some(s => POISON_KEYS.has(s))) {
          errors.push({ index: i, message: 'From path contains forbidden key' });
        }
      }
    }

    return { valid: errors.length === 0, errors };
  }

  /**
   * Execute a JSON Patch 'test' operation.
   * Returns true if the value at the path matches the patch value.
   * @param {object} document  The document to test against
   * @param {{ op: string, path: string, value: * }} patch  A test patch operation
   * @returns {boolean}
   */
  test(document, patch) {
    if (!patch || patch.op !== 'test') {
      return false;
    }
    try {
      const actual = this._getValueAtPath(document, patch.path);
      return this._deepEqual(actual, patch.value);
    } catch {
      return false;
    }
  }

  /**
   * Generate reverse patches that would undo the given patches.
   * @param {object} document  The original document (before patches were applied)
   * @param {Array<{op: string, path: string, value?: *, from?: string}>} patches
   * @returns {Array<{op: string, path: string, value?: *, from?: string}>}
   */
  revert(document, patches) {
    const reversed = [];
    let doc = this.deepClone ? this._clone(document) : document;

    const snapshots = [this._clone(doc)];
    for (const patch of patches) {
      doc = this._applyOne(doc, patch);
      snapshots.push(this._clone(doc));
    }

    for (let i = patches.length - 1; i >= 0; i--) {
      const patch = patches[i];
      const before = snapshots[i];

      switch (patch.op) {
        case 'add': {
          reversed.push({ op: 'remove', path: patch.path });
          break;
        }
        case 'remove': {
          const oldValue = this._getValueAtPath(before, patch.path);
          reversed.push({ op: 'add', path: patch.path, value: this._clone(oldValue) });
          break;
        }
        case 'replace': {
          const oldValue = this._getValueAtPath(before, patch.path);
          reversed.push({ op: 'replace', path: patch.path, value: this._clone(oldValue) });
          break;
        }
        case 'move': {
          reversed.push({ op: 'move', path: patch.from, from: patch.path });
          break;
        }
        case 'copy': {
          reversed.push({ op: 'remove', path: patch.path });
          break;
        }
        default:
          break;
      }
    }

    return reversed;
  }

  /**
   * Merge two patch arrays, deduplicating conflicting operations (last wins).
   * @param {Array<{op: string, path: string, value?: *, from?: string}>} patchesA
   * @param {Array<{op: string, path: string, value?: *, from?: string}>} patchesB
   * @returns {Array<{op: string, path: string, value?: *, from?: string}>}
   */
  merge(patchesA, patchesB) {
    const merged = new Map();

    for (const p of patchesA) {
      merged.set(p.path, { ...p });
    }

    for (const p of patchesB) {
      merged.set(p.path, { ...p });
    }

    return Array.from(merged.values());
  }

  /**
   * Get generation and application statistics.
   * @returns {{ patchesGenerated: number, patchesApplied: number, operationCounts: object }}
   */
  getStats() {
    return {
      patchesGenerated: this._stats.patchesGenerated,
      patchesApplied: this._stats.patchesApplied,
      operationCounts: { ...this._stats.operationCounts },
    };
  }

  /**
   * Reset all statistics to zero.
   */
  reset() {
    this._stats.patchesGenerated = 0;
    this._stats.patchesApplied = 0;
    this._stats.operationCounts = { add: 0, remove: 0, replace: 0, move: 0, copy: 0 };
  }

  // ── Private helpers ──────────────────────────────────────────────────

  /**
   * Recursively diff two values and emit patch operations.
   * @param {*} source
   * @param {*} target
   * @param {string} path  Current JSON Pointer path
   * @param {Array} patches  Accumulator
   */
  _diffRecursive(source, target, path, patches) {
    if (this._deepEqual(source, target)) return;

    if (
      source === null || target === null ||
      typeof source !== 'object' || typeof target !== 'object' ||
      Array.isArray(source) !== Array.isArray(target)
    ) {
      patches.push({ op: 'replace', path: path || '/', value: this._clone(target) });
      return;
    }

    if (Array.isArray(source) && Array.isArray(target)) {
      this._diffArrays(source, target, path, patches);
      return;
    }

    const sourceKeys = Object.keys(source);
    const targetKeys = Object.keys(target);
    const targetKeySet = new Set(targetKeys);

    // Detect removed keys
    for (const key of sourceKeys) {
      if (!targetKeySet.has(key)) {
        patches.push({ op: 'remove', path: `${path}/${this._escapePointer(key)}` });
      }
    }

    // Detect added and changed keys
    for (const key of targetKeys) {
      const childPath = `${path}/${this._escapePointer(key)}`;
      if (!Object.prototype.hasOwnProperty.call(source, key)) {
        patches.push({ op: 'add', path: childPath, value: this._clone(target[key]) });
      } else {
        this._diffRecursive(source[key], target[key], childPath, patches);
      }
    }
  }

  /**
   * Diff two arrays and produce add/remove/replace operations by index.
   * @param {Array} source
   * @param {Array} target
   * @param {string} path
   * @param {Array} patches
   */
  _diffArrays(source, target, path, patches) {
    const maxLen = Math.max(source.length, target.length);

    for (let i = 0; i < maxLen; i++) {
      const childPath = `${path}/${i}`;

      if (i >= source.length) {
        patches.push({ op: 'add', path: childPath, value: this._clone(target[i]) });
      } else if (i >= target.length) {
        // Remove from the end to avoid index shifting
        patches.push({ op: 'remove', path: `${path}/${target.length}` });
      } else {
        this._diffRecursive(source[i], target[i], childPath, patches);
      }
    }
  }

  /**
   * Apply a single patch operation to a document.
   * @param {*} doc
   * @param {{ op: string, path: string, value?: *, from?: string }} patch
   * @returns {*}
   */
  _applyOne(doc, patch) {
    switch (patch.op) {
      case 'add':
        this._setValueAtPath(doc, patch.path, this._clone(patch.value), false);
        return doc;

      case 'remove':
        this._removeAtPath(doc, patch.path);
        return doc;

      case 'replace':
        this._setValueAtPath(doc, patch.path, this._clone(patch.value), true);
        return doc;

      case 'move': {
        const value = this._getValueAtPath(doc, patch.from);
        this._removeAtPath(doc, patch.from);
        this._setValueAtPath(doc, patch.path, value);
        return doc;
      }

      case 'copy': {
        const value = this._getValueAtPath(doc, patch.from);
        this._setValueAtPath(doc, patch.path, this._clone(value));
        return doc;
      }

      case 'test': {
        const actual = this._getValueAtPath(doc, patch.path);
        if (!this._deepEqual(actual, patch.value)) {
          throw new Error(`Test failed: value at '${patch.path}' does not match`);
        }
        return doc;
      }

      default:
        throw new Error(`Unknown op: '${patch.op}'`);
    }
  }

  /**
   * Get the value at a JSON Pointer path within an object.
   * @param {*} obj  Root object
   * @param {string} path  JSON Pointer string
   * @returns {*}
   */
  _getValueAtPath(obj, path) {
    if (path === '' || path === '/') return obj;

    const segments = this._parsePointer(path);
    let current = obj;

    for (const segment of segments) {
      if (POISON_KEYS.has(segment)) {
        throw new Error(`Forbidden path segment: '${segment}'`);
      }
      if (current === null || current === undefined || typeof current !== 'object') {
        if (this.strict) throw new Error(`Cannot traverse path '${path}': not an object`);
        return undefined;
      }
      if (Array.isArray(current)) {
        const idx = Number(segment);
        if (Number.isNaN(idx)) {
          if (this.strict) throw new Error(`Invalid array index: '${segment}'`);
          return undefined;
        }
        current = current[idx];
      } else {
        current = current[segment];
      }
    }

    return current;
  }

  /**
   * Set a value at a JSON Pointer path within an object.
   * @param {*} obj  Root object
   * @param {string} path  JSON Pointer string
   * @param {*} value  Value to set
   * @param {boolean} replace  If true, overwrite array elements instead of inserting
   */
  _setValueAtPath(obj, path, value, replace) {
    if (path === '' || path === '/') {
      throw new Error('Cannot replace root document via _setValueAtPath');
    }

    const segments = this._parsePointer(path);
    let current = obj;

    for (let i = 0; i < segments.length - 1; i++) {
      const segment = segments[i];
      if (POISON_KEYS.has(segment)) {
        throw new Error(`Forbidden path segment: '${segment}'`);
      }
      if (Array.isArray(current)) {
        current = current[Number(segment)];
      } else {
        if (current[segment] === undefined || current[segment] === null) {
          // Auto-create containers
          const nextSegment = segments[i + 1];
          current[segment] = /^\d+$/.test(nextSegment) ? [] : {};
        }
        current = current[segment];
      }
    }

    const lastSegment = segments[segments.length - 1];
    if (POISON_KEYS.has(lastSegment)) {
      throw new Error(`Forbidden path segment: '${lastSegment}'`);
    }

    if (Array.isArray(current)) {
      const idx = lastSegment === '-' ? current.length : Number(lastSegment);
      if (replace) {
        current[idx] = value;
      } else {
        current.splice(idx, 0, value);
      }
    } else {
      current[lastSegment] = value;
    }
  }

  /**
   * Remove the value at a JSON Pointer path within an object.
   * @param {*} obj  Root object
   * @param {string} path  JSON Pointer string
   */
  _removeAtPath(obj, path) {
    if (path === '' || path === '/') {
      throw new Error('Cannot remove root document');
    }

    const segments = this._parsePointer(path);
    let current = obj;

    for (let i = 0; i < segments.length - 1; i++) {
      const segment = segments[i];
      if (POISON_KEYS.has(segment)) {
        throw new Error(`Forbidden path segment: '${segment}'`);
      }
      if (Array.isArray(current)) {
        current = current[Number(segment)];
      } else {
        current = current[segment];
      }
      if (current === null || current === undefined) {
        if (this.strict) throw new Error(`Path not found: '${path}'`);
        return;
      }
    }

    const lastSegment = segments[segments.length - 1];
    if (POISON_KEYS.has(lastSegment)) {
      throw new Error(`Forbidden path segment: '${lastSegment}'`);
    }

    if (Array.isArray(current)) {
      const idx = Number(lastSegment);
      if (idx >= 0 && idx < current.length) {
        current.splice(idx, 1);
      }
    } else {
      delete current[lastSegment];
    }
  }

  /**
   * Parse a JSON Pointer string into path segments.
   * Unescapes '~1' → '/' and '~0' → '~' per RFC 6901.
   * @param {string} pointer
   * @returns {string[]}
   */
  _parsePointer(pointer) {
    if (pointer === '' || pointer === '/') return [];
    return pointer.substring(1).split('/').map(s =>
      s.replace(/~1/g, '/').replace(/~0/g, '~')
    );
  }

  /**
   * Escape a key for use in a JSON Pointer path.
   * Escapes '~' → '~0' and '/' → '~1' per RFC 6901.
   * @param {string} key
   * @returns {string}
   */
  _escapePointer(key) {
    return key.replace(/~/g, '~0').replace(/\//g, '~1');
  }

  /**
   * Deep equality check.
   * @param {*} a
   * @param {*} b
   * @returns {boolean}
   */
  _deepEqual(a, b) {
    if (a === b) return true;
    if (a === null || b === null) return false;
    if (typeof a !== typeof b) return false;

    if (typeof a !== 'object') return false;

    if (Array.isArray(a) !== Array.isArray(b)) return false;

    if (Array.isArray(a)) {
      if (a.length !== b.length) return false;
      for (let i = 0; i < a.length; i++) {
        if (!this._deepEqual(a[i], b[i])) return false;
      }
      return true;
    }

    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;

    for (const key of keysA) {
      if (!Object.prototype.hasOwnProperty.call(b, key)) return false;
      if (!this._deepEqual(a[key], b[key])) return false;
    }

    return true;
  }

  /**
   * Deep clone a value using structured clone-like recursion.
   * @param {*} value
   * @returns {*}
   */
  _clone(value) {
    if (value === null || typeof value !== 'object') return value;
    if (Array.isArray(value)) return value.map(v => this._clone(v));
    const result = {};
    for (const key of Object.keys(value)) {
      result[key] = this._clone(value[key]);
    }
    return result;
  }
}

module.exports = { JSONPatchGenerator };
