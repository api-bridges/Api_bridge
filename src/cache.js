/**
 * APIBridge AI v3 — Response Cache
 *
 * In-memory LRU cache with TTL support.
 * Prevents redundant transformations of identical payloads.
 *
 * Features:
 *  - TTL-based expiry
 *  - Max-size eviction (LRU)
 *  - Cache statistics
 *  - Pattern-based invalidation
 */

const crypto = require('crypto');

class ResponseCache {
  /**
   * @param {object} options
   * @param {number} options.maxSize    Maximum entries (default 500)
   * @param {number} options.ttl        Time-to-live in ms (default 5 min)
   * @param {boolean} options.enabled   Whether caching is active (default true)
   */
  constructor(options = {}) {
    this.maxSize = options.maxSize || 500;
    this.ttl = options.ttl || 5 * 60 * 1000; // 5 minutes
    this.enabled = options.enabled !== false;

    /** @type {Map<string, {value: any, expiresAt: number, accessedAt: number}>} */
    this._store = new Map();

    this.stats = { hits: 0, misses: 0, evictions: 0, sets: 0 };
  }

  /**
   * Generate a deterministic cache key from data and options.
   */
  _key(data, options) {
    const raw = JSON.stringify({ d: data, o: options });
    return crypto.createHash('md5').update(raw).digest('hex');
  }

  /**
   * Get a cached result. Returns undefined on miss.
   */
  get(data, options) {
    if (!this.enabled) return undefined;

    const key = this._key(data, options);
    const entry = this._store.get(key);

    if (!entry) {
      this.stats.misses++;
      return undefined;
    }

    if (Date.now() > entry.expiresAt) {
      this._store.delete(key);
      this.stats.misses++;
      return undefined;
    }

    entry.accessedAt = Date.now();
    this.stats.hits++;
    return entry.value;
  }

  /**
   * Store a transformed result.
   */
  set(data, options, value) {
    if (!this.enabled) return;

    const key = this._key(data, options);

    // Evict oldest if at capacity
    if (this._store.size >= this.maxSize && !this._store.has(key)) {
      this._evictLRU();
    }

    this._store.set(key, {
      value,
      expiresAt: Date.now() + this.ttl,
      accessedAt: Date.now(),
    });
    this.stats.sets++;
  }

  /**
   * Invalidate cache entries whose keys match a pattern string.
   */
  invalidate(pattern) {
    if (!pattern) {
      this._store.clear();
      return;
    }
    for (const key of this._store.keys()) {
      if (key.includes(pattern)) {
        this._store.delete(key);
      }
    }
  }

  /** Evict the least-recently-accessed entry. */
  _evictLRU() {
    let oldestKey = null;
    let oldestTime = Infinity;

    for (const [key, entry] of this._store) {
      if (entry.accessedAt < oldestTime) {
        oldestTime = entry.accessedAt;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this._store.delete(oldestKey);
      this.stats.evictions++;
    }
  }

  /** Number of live entries. */
  size() {
    return this._store.size;
  }

  /** Get cache statistics. */
  getStats() {
    const total = this.stats.hits + this.stats.misses;
    return {
      ...this.stats,
      size: this._store.size,
      hitRate: total > 0
        ? Math.round((this.stats.hits / total) * 100) + '%'
        : '0%',
    };
  }

  /** Clear all entries and reset stats. */
  clear() {
    this._store.clear();
    this.stats = { hits: 0, misses: 0, evictions: 0, sets: 0 };
  }
}

module.exports = { ResponseCache };
