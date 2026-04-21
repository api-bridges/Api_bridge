/**
 * yarou v5 — Response Streamer
 *
 * Streaming/chunked JSON response transformer:
 *  - Process large JSON responses in chunks
 *  - Key transformation on-the-fly
 *  - Configurable chunk sizes
 *  - Field filtering during streaming
 *  - Progress callbacks
 *  - Accumulator mode for building results incrementally
 *  - Statistics tracking
 */

// ─── CONVENTIONS ──────────────────────────────────────────────────────────────

/**
 * Tokenize any key into lowercase word segments.
 * @param {string} key
 * @returns {string[]}
 */
function tokenize(key) {
  return key
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .toLowerCase()
    .replace(/[-.\s]+/g, '_')
    .replace(/[^a-z0-9_]/g, '')
    .split('_')
    .filter(Boolean);
}

/**
 * Convert tokens to the target naming convention.
 * @param {string[]} tokens
 * @param {string} convention
 * @returns {string}
 */
function toConvention(tokens, convention) {
  if (tokens.length === 0) return '';
  switch (convention) {
    case 'camelCase':
      return tokens.map((t, i) => (i === 0 ? t : t[0].toUpperCase() + t.slice(1))).join('');
    case 'snake_case':
      return tokens.join('_');
    case 'PascalCase':
      return tokens.map(t => t[0].toUpperCase() + t.slice(1)).join('');
    case 'kebab-case':
      return tokens.join('-');
    case 'SCREAMING_SNAKE':
      return tokens.map(t => t.toUpperCase()).join('_');
    default:
      return tokens.join('_');
  }
}

/**
 * Convert a key to the target convention.
 * @param {string} key
 * @param {string} convention
 * @returns {string}
 */
function convertKey(key, convention) {
  const tokens = tokenize(key);
  return tokens.length > 0 ? toConvention(tokens, convention) : key;
}

// ─── RESPONSE STREAMER ───────────────────────────────────────────────────────

class ResponseStreamer {
  /**
   * @param {object}   options
   * @param {string}   options.convention      Target naming convention (default 'camelCase')
   * @param {number}   options.chunkSize       Number of top-level keys per chunk (default 50)
   * @param {Array<string>} options.includeFields  Only include these fields (whitelist)
   * @param {Array<string>} options.excludeFields  Exclude these fields (blacklist)
   * @param {Function} options.onChunk         Callback for each processed chunk: (chunk, index) => void
   * @param {Function} options.onProgress      Progress callback: ({ processed, total, percent }) => void
   */
  constructor(options = {}) {
    this.convention = options.convention || 'camelCase';
    this.chunkSize = options.chunkSize || 50;
    this.includeFields = options.includeFields ? new Set(options.includeFields) : null;
    this.excludeFields = options.excludeFields ? new Set(options.excludeFields) : null;
    this.onChunk = options.onChunk || null;
    this.onProgress = options.onProgress || null;

    this._stats = {
      chunksProcessed: 0,
      keysTransformed: 0,
      totalBytesProcessed: 0,
      streamsCompleted: 0,
    };
  }

  /**
   * Process an object by splitting its top-level keys into chunks,
   * transforming each chunk, and returning the merged result.
   *
   * @param {object} data  The object to process
   * @returns {object} Fully transformed object
   */
  process(data) {
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
      return this._transformValue(data);
    }

    const keys = Object.keys(data);
    const total = keys.length;
    const result = {};
    let processed = 0;

    for (let i = 0; i < total; i += this.chunkSize) {
      const chunkKeys = keys.slice(i, i + this.chunkSize);
      const chunk = {};

      for (const key of chunkKeys) {
        // Field filtering
        if (this.includeFields && !this.includeFields.has(key)) continue;
        if (this.excludeFields && this.excludeFields.has(key)) continue;

        const newKey = convertKey(key, this.convention);
        chunk[newKey] = this._transformValue(data[key]);
        this._stats.keysTransformed++;
      }

      // Merge chunk into result
      Object.assign(result, chunk);
      processed += chunkKeys.length;
      this._stats.chunksProcessed++;

      // Invoke chunk callback
      if (typeof this.onChunk === 'function') {
        this.onChunk(chunk, Math.floor(i / this.chunkSize));
      }

      // Invoke progress callback
      if (typeof this.onProgress === 'function') {
        this.onProgress({
          processed,
          total,
          percent: Math.round((processed / total) * 100),
        });
      }
    }

    this._stats.totalBytesProcessed += JSON.stringify(data).length;
    this._stats.streamsCompleted++;

    return result;
  }

  /**
   * Process an array of objects, transforming each item.
   *
   * @param {Array<object>} items  Array of objects to process
   * @returns {Array<object>} Transformed array
   */
  processArray(items) {
    if (!Array.isArray(items)) return items;

    const results = [];
    const total = items.length;

    for (let i = 0; i < total; i++) {
      const transformed = this.process(items[i]);
      results.push(transformed);

      if (typeof this.onProgress === 'function') {
        this.onProgress({
          processed: i + 1,
          total,
          percent: Math.round(((i + 1) / total) * 100),
        });
      }
    }

    return results;
  }

  /**
   * Create an accumulator that builds results incrementally.
   * Useful for processing data in stages.
   *
   * @returns {{ add: Function, getResult: Function, reset: Function }}
   */
  createAccumulator() {
    const accumulated = {};
    const self = this;

    return {
      /**
       * Add data to the accumulator.
       * @param {object} data
       */
      add(data) {
        if (!data || typeof data !== 'object') return;
        const transformed = self.process(data);
        Object.assign(accumulated, transformed);
      },

      /**
       * Get the accumulated result.
       * @returns {object}
       */
      getResult() {
        return { ...accumulated };
      },

      /**
       * Reset the accumulator.
       */
      reset() {
        for (const key of Object.keys(accumulated)) {
          delete accumulated[key];
        }
      },
    };
  }

  /**
   * Get streamer statistics.
   * @returns {object}
   */
  getStats() {
    return { ...this._stats };
  }

  /**
   * Reset statistics.
   */
  reset() {
    this._stats = {
      chunksProcessed: 0,
      keysTransformed: 0,
      totalBytesProcessed: 0,
      streamsCompleted: 0,
    };
  }

  // ─── INTERNAL ─────────────────────────────────────────────────────

  /**
   * Recursively transform a value, converting object keys.
   * @param {*} value
   * @returns {*}
   */
  _transformValue(value) {
    if (value === null || value === undefined) return value;

    if (Array.isArray(value)) {
      return value.map(item => this._transformValue(item));
    }

    if (typeof value === 'object' && !(value instanceof Date)) {
      const result = {};
      for (const [key, val] of Object.entries(value)) {
        const newKey = convertKey(key, this.convention);
        result[newKey] = this._transformValue(val);
        this._stats.keysTransformed++;
      }
      return result;
    }

    return value;
  }
}

module.exports = { ResponseStreamer };
