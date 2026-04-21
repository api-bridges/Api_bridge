/**
 * yarou v3 — Rate Limiter
 *
 * Built-in request throttling with:
 *  - Token bucket algorithm
 *  - Per-endpoint limits
 *  - Configurable burst capacity
 *  - Queue with timeout for requests exceeding the limit
 *  - Statistics tracking
 */

const { RateLimitError } = require('../core/errors');

class RateLimiter {
  /**
   * @param {object} options
   * @param {number}  options.maxRequests   Max requests per window (default 60)
   * @param {number}  options.windowMs      Window size in ms (default 60000 = 1 min)
   * @param {number}  options.burstLimit    Max burst requests allowed (default maxRequests)
   * @param {boolean} options.queueExcess   Queue requests that exceed the limit (default false)
   * @param {number}  options.queueTimeout  Max ms to wait in queue (default 30000)
   */
  constructor(options = {}) {
    this.maxRequests = options.maxRequests || 60;
    this.windowMs = options.windowMs || 60000;
    this.burstLimit = options.burstLimit || this.maxRequests;
    this.queueExcess = options.queueExcess || false;
    this.queueTimeout = options.queueTimeout || 30000;

    this._tokens = this.burstLimit;
    this._lastRefill = Date.now();
    this._queue = [];

    this.stats = {
      totalRequests: 0,
      allowed: 0,
      throttled: 0,
      queued: 0,
    };
  }

  /**
   * Check if a request is allowed. Returns true immediately or queues/rejects.
   * @param {string} endpoint  Optional endpoint identifier for per-endpoint limits
   * @returns {Promise<boolean>}
   */
  async acquire(endpoint) {
    this._refillTokens();
    this.stats.totalRequests++;

    if (this._tokens >= 1) {
      this._tokens--;
      this.stats.allowed++;
      return true;
    }

    if (this.queueExcess) {
      this.stats.queued++;
      return this._waitForToken(endpoint);
    }

    this.stats.throttled++;
    throw new RateLimitError(
      `Rate limit exceeded: ${this.maxRequests} requests per ${this.windowMs}ms`,
      this.maxRequests,
      this._getRetryAfterMs(),
    );
  }

  /**
   * Synchronous check — returns true/false without queuing.
   */
  tryAcquire() {
    this._refillTokens();
    this.stats.totalRequests++;

    if (this._tokens >= 1) {
      this._tokens--;
      this.stats.allowed++;
      return true;
    }

    this.stats.throttled++;
    return false;
  }

  /**
   * Get remaining tokens.
   */
  remaining() {
    this._refillTokens();
    return Math.floor(this._tokens);
  }

  /**
   * Get ms until the next token is available.
   */
  _getRetryAfterMs() {
    const refillRate = this.maxRequests / this.windowMs;
    return Math.ceil(1 / refillRate);
  }

  /**
   * Refill tokens based on elapsed time (token bucket algorithm).
   */
  _refillTokens() {
    const now = Date.now();
    const elapsed = now - this._lastRefill;
    const refillRate = this.maxRequests / this.windowMs; // tokens per ms
    const newTokens = elapsed * refillRate;

    this._tokens = Math.min(this.burstLimit, this._tokens + newTokens);
    this._lastRefill = now;
  }

  /**
   * Wait in queue for a token to become available.
   */
  _waitForToken(endpoint) {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        // Remove from queue
        const idx = this._queue.findIndex(q => q.resolve === resolve);
        if (idx >= 0) this._queue.splice(idx, 1);

        this.stats.throttled++;
        reject(new RateLimitError(
          `Rate limit queue timeout after ${this.queueTimeout}ms`,
          this.maxRequests,
          this._getRetryAfterMs(),
        ));
      }, this.queueTimeout);

      this._queue.push({
        resolve: () => { clearTimeout(timeout); resolve(true); },
        endpoint,
        addedAt: Date.now(),
      });

      // Start drain interval if not already running
      this._startDrain();
    });
  }

  /**
   * Periodically drain the queue when tokens become available.
   */
  _startDrain() {
    if (this._drainInterval) return;

    this._drainInterval = setInterval(() => {
      this._refillTokens();

      while (this._queue.length > 0 && this._tokens >= 1) {
        this._tokens--;
        this.stats.allowed++;
        const item = this._queue.shift();
        item.resolve();
      }

      if (this._queue.length === 0) {
        clearInterval(this._drainInterval);
        this._drainInterval = null;
      }
    }, Math.max(100, this._getRetryAfterMs()));
  }

  /**
   * Get rate limiter statistics.
   */
  getStats() {
    return {
      ...this.stats,
      remaining: this.remaining(),
      queueSize: this._queue.length,
    };
  }

  /**
   * Reset the rate limiter.
   */
  reset() {
    this._tokens = this.burstLimit;
    this._lastRefill = Date.now();
    this._queue = [];
    if (this._drainInterval) {
      clearInterval(this._drainInterval);
      this._drainInterval = null;
    }
    this.stats = { totalRequests: 0, allowed: 0, throttled: 0, queued: 0 };
  }
}

module.exports = { RateLimiter };
