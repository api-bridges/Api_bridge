/**
 * yarou v4 — Request Deduplicator
 *
 * Coalesces concurrent identical requests so only one actual
 * execution happens. All callers with the same key receive
 * the same promise result.
 *
 * Features:
 *  - In-flight request deduplication
 *  - Custom hash function support
 *  - TTL-based auto-cleanup
 *  - Max-size enforcement
 *  - Statistics tracking
 */

class RequestDeduplicator {
  /**
   * @param {object} options
   * @param {function} options.hashFn   Custom hash function (data) => string (default JSON.stringify)
   * @param {number}  options.ttl       Max time in ms to keep a pending entry (default 5000)
   * @param {number}  options.maxSize   Max concurrent dedup entries (default 1000)
   */
  constructor(options = {}) {
    /** @type {function} Hash function used to derive keys from arbitrary data */
    this.hashFn = options.hashFn || JSON.stringify;
    this.ttl = options.ttl || 5000;
    this.maxSize = options.maxSize || 1000;

    /** @type {Map<string, {promise: Promise, createdAt: number, timer: ReturnType<typeof setTimeout>}>} */
    this._pending = new Map();

    this.stats = {
      totalRequests: 0,
      deduped: 0,
      executed: 0,
    };
  }

  /**
   * Deduplicate a request by key. If a request with the same key is
   * already in-flight, return its promise. Otherwise execute fn() and
   * share the result with all waiters.
   *
   * The key can be any value — it is passed through `hashFn` to produce
   * a string used for dedup lookups.
   *
   * @param {*} key       Deduplication key (hashed via hashFn)
   * @param {function} fn Async function to execute if no in-flight request exists
   * @returns {Promise<any>}
   */
  async dedupe(key, fn) {
    const hashedKey = this.hashFn(key);
    this.stats.totalRequests++;

    // Return existing in-flight promise
    if (this._pending.has(hashedKey)) {
      this.stats.deduped++;
      return this._pending.get(hashedKey).promise;
    }

    // Reject if at capacity
    if (this._pending.size >= this.maxSize) {
      throw new Error(
        `Request deduplicator at capacity (${this.maxSize}). Request rejected.`
      );
    }

    this.stats.executed++;

    // Execute and store the promise
    const promise = fn().finally(() => {
      this._remove(hashedKey);
    });

    // Auto-cleanup after TTL
    const timer = setTimeout(() => {
      this._remove(hashedKey);
    }, this.ttl);

    this._pending.set(hashedKey, { promise, createdAt: Date.now(), timer });

    return promise;
  }

  /**
   * Check if a key is currently in-flight.
   * @param {*} key
   * @returns {boolean}
   */
  has(key) {
    return this._pending.has(this.hashFn(key));
  }

  /**
   * Number of in-flight entries.
   * @returns {number}
   */
  size() {
    return this._pending.size;
  }

  /**
   * Clear all pending entries and their timers.
   */
  clear() {
    for (const entry of this._pending.values()) {
      clearTimeout(entry.timer);
    }
    this._pending.clear();
  }

  /**
   * Get deduplicator statistics.
   * @returns {{totalRequests: number, deduped: number, executed: number, pending: number}}
   */
  getStats() {
    return {
      ...this.stats,
      pending: this._pending.size,
    };
  }

  /**
   * Remove a pending entry and clear its TTL timer.
   * @param {string} key
   */
  _remove(key) {
    const entry = this._pending.get(key);
    if (entry) {
      clearTimeout(entry.timer);
      this._pending.delete(key);
    }
  }
}

module.exports = { RequestDeduplicator };
