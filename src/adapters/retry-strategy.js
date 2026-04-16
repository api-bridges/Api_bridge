/**
 * APIBridge AI v5 — Advanced Retry Strategy
 *
 * Pluggable retry strategies for resilient API calls:
 *  - Linear backoff
 *  - Exponential backoff with optional jitter
 *  - Custom backoff function
 *  - Per-status-code retry rules
 *  - Abort signal support
 *  - Retry budget (max retries within a time window)
 *  - Detailed retry statistics
 */

const { RetryError } = require('../core/errors');

// ─── BUILT-IN STRATEGIES ──────────────────────────────────────────────────────

const STRATEGIES = {
  /**
   * Linear: delay = baseDelay * attempt
   */
  linear(attempt, baseDelay) {
    return baseDelay * attempt;
  },

  /**
   * Exponential: delay = baseDelay * 2^(attempt - 1)
   */
  exponential(attempt, baseDelay) {
    return baseDelay * Math.pow(2, attempt - 1);
  },

  /**
   * Exponential with full jitter: delay = random(0, baseDelay * 2^(attempt - 1))
   */
  exponentialJitter(attempt, baseDelay) {
    const max = baseDelay * Math.pow(2, attempt - 1);
    return Math.floor(Math.random() * max);
  },

  /**
   * Constant: same delay every attempt.
   */
  constant(_attempt, baseDelay) {
    return baseDelay;
  },
};

// ─── DEFAULT RETRYABLE STATUS CODES ───────────────────────────────────────────

const DEFAULT_RETRYABLE_STATUS = new Set([408, 429, 500, 502, 503, 504]);

// ─── RETRY STRATEGY ──────────────────────────────────────────────────────────

class RetryStrategy {
  /**
   * @param {object}   options
   * @param {string}   options.strategy        Strategy name: 'linear' | 'exponential' | 'exponentialJitter' | 'constant' (default 'exponential')
   * @param {Function} options.backoffFn       Custom backoff function (attempt, baseDelay) => ms. Overrides strategy.
   * @param {number}   options.maxRetries      Maximum retry attempts (default 3)
   * @param {number}   options.baseDelay       Base delay in ms (default 1000)
   * @param {number}   options.maxDelay        Maximum delay cap in ms (default 30000)
   * @param {Set|Array} options.retryableStatuses  HTTP status codes to retry (default 408,429,500,502,503,504)
   * @param {Function} options.shouldRetry     Custom predicate: (error, attempt) => boolean
   * @param {number}   options.budgetWindow    Time window in ms for retry budget (default 60000)
   * @param {number}   options.budgetMax       Max retries within the budget window (default Infinity)
   * @param {Function} options.onRetry         Callback invoked before each retry: (attempt, delay, error) => void
   */
  constructor(options = {}) {
    this.strategyName = options.strategy || 'exponential';
    this.backoffFn = options.backoffFn || STRATEGIES[this.strategyName] || STRATEGIES.exponential;
    this.maxRetries = options.maxRetries != null ? options.maxRetries : 3;
    this.baseDelay = options.baseDelay || 1000;
    this.maxDelay = options.maxDelay || 30000;
    this.shouldRetry = options.shouldRetry || null;
    this.onRetry = options.onRetry || null;

    this.retryableStatuses = options.retryableStatuses
      ? new Set(options.retryableStatuses)
      : new Set(DEFAULT_RETRYABLE_STATUS);

    // Retry budget
    this.budgetWindow = options.budgetWindow || 60000;
    this.budgetMax = options.budgetMax != null ? options.budgetMax : Infinity;
    this._budgetTimestamps = [];

    this._stats = {
      totalExecutions: 0,
      totalRetries: 0,
      totalSuccesses: 0,
      totalFailures: 0,
      lastError: null,
    };
  }

  /**
   * Execute a function with retry logic.
   *
   * @param {Function} fn       Async function to execute. Receives (attempt) as argument.
   * @param {object}   [options]
   * @param {AbortSignal} [options.signal]  Abort signal to cancel retries
   * @returns {Promise<*>} Result of the executed function
   */
  async execute(fn, options = {}) {
    this._stats.totalExecutions++;
    let lastError;

    for (let attempt = 1; attempt <= this.maxRetries + 1; attempt++) {
      // Check abort signal
      if (options.signal && options.signal.aborted) {
        throw new RetryError(
          'Retry aborted by signal',
          attempt - 1,
          this.maxRetries,
          'aborted',
        );
      }

      try {
        const result = await fn(attempt);
        this._stats.totalSuccesses++;
        return result;
      } catch (error) {
        lastError = error;
        this._stats.lastError = error.message;

        // Check if we should retry
        if (attempt > this.maxRetries) break;

        if (!this._shouldRetryError(error, attempt)) break;

        // Check retry budget
        if (!this._checkBudget()) {
          throw new RetryError(
            `Retry budget exhausted (${this.budgetMax} retries in ${this.budgetWindow}ms window)`,
            attempt,
            this.maxRetries,
            'budget_exhausted',
          );
        }

        // Calculate delay
        const rawDelay = this.backoffFn(attempt, this.baseDelay);
        const delay = Math.min(rawDelay, this.maxDelay);

        // Invoke onRetry callback
        if (typeof this.onRetry === 'function') {
          this.onRetry(attempt, delay, error);
        }

        this._stats.totalRetries++;
        this._budgetTimestamps.push(Date.now());

        // Check abort signal before sleeping
        if (options.signal && options.signal.aborted) {
          throw new RetryError(
            'Retry aborted by signal',
            attempt,
            this.maxRetries,
            'aborted',
          );
        }

        await this._delay(delay);
      }
    }

    this._stats.totalFailures++;
    throw new RetryError(
      `All ${this.maxRetries + 1} attempts failed: ${lastError.message}`,
      this.maxRetries + 1,
      this.maxRetries,
      'max_retries_exceeded',
    );
  }

  /**
   * Calculate the delay for a given attempt (without executing).
   * @param {number} attempt  Attempt number (1-based)
   * @returns {number} Delay in ms
   */
  getDelay(attempt) {
    const rawDelay = this.backoffFn(attempt, this.baseDelay);
    return Math.min(rawDelay, this.maxDelay);
  }

  /**
   * Check if a status code is retryable.
   * @param {number} statusCode
   * @returns {boolean}
   */
  isRetryable(statusCode) {
    return this.retryableStatuses.has(statusCode);
  }

  /**
   * Get retry statistics.
   * @returns {object}
   */
  getStats() {
    return { ...this._stats };
  }

  /**
   * Reset statistics and budget.
   */
  reset() {
    this._stats = {
      totalExecutions: 0,
      totalRetries: 0,
      totalSuccesses: 0,
      totalFailures: 0,
      lastError: null,
    };
    this._budgetTimestamps = [];
  }

  // ─── INTERNAL HELPERS ─────────────────────────────────────────────

  /**
   * Determine whether an error should be retried.
   * @param {Error} error
   * @param {number} attempt
   * @returns {boolean}
   */
  _shouldRetryError(error, attempt) {
    if (typeof this.shouldRetry === 'function') {
      return this.shouldRetry(error, attempt);
    }

    // Retry on network errors
    if (error.code === 'ECONNRESET' || error.code === 'ENOTFOUND' || error.code === 'ETIMEDOUT') {
      return true;
    }

    // Retry on retryable status codes
    if (error.status && this.retryableStatuses.has(error.status)) {
      return true;
    }
    if (error.statusCode && this.retryableStatuses.has(error.statusCode)) {
      return true;
    }

    // Default: retry all errors
    return true;
  }

  /**
   * Check if the retry budget allows another retry.
   * @returns {boolean}
   */
  _checkBudget() {
    if (this.budgetMax === Infinity) return true;

    const now = Date.now();
    const windowStart = now - this.budgetWindow;
    this._budgetTimestamps = this._budgetTimestamps.filter(t => t > windowStart);
    return this._budgetTimestamps.length < this.budgetMax;
  }

  /**
   * Simple delay helper.
   * @param {number} ms
   * @returns {Promise<void>}
   */
  _delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = { RetryStrategy, STRATEGIES };
