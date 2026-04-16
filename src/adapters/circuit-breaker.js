/**
 * APIBridge AI v4 — Circuit Breaker
 *
 * Standard circuit breaker pattern for fault-tolerant API calls:
 *  - CLOSED  — requests flow normally, failures are tracked
 *  - OPEN    — requests are rejected immediately
 *  - HALF_OPEN — limited probe requests to test recovery
 *
 * Features:
 *  - Configurable failure threshold and reset timeout
 *  - Automatic OPEN → HALF_OPEN transition after cooldown
 *  - State-change callback for monitoring
 *  - Optional health-check monitor interval
 *  - Force-open / force-close for manual control
 */

const { CircuitBreakerError } = require('../core/errors');

const STATES = {
  CLOSED: 'CLOSED',
  OPEN: 'OPEN',
  HALF_OPEN: 'HALF_OPEN',
};

class CircuitBreaker {
  /**
   * @param {object} options
   * @param {number}   options.failureThreshold  Failures before opening (default 5)
   * @param {number}   options.resetTimeout       Ms before OPEN → HALF_OPEN (default 30000)
   * @param {number}   options.halfOpenMax         Max probe requests in HALF_OPEN (default 1)
   * @param {number}   options.monitorInterval     Health-check interval in ms, 0 = disabled (default 0)
   * @param {function} options.onStateChange       Callback invoked on state transitions
   */
  constructor(options = {}) {
    this.failureThreshold = options.failureThreshold || 5;
    this.resetTimeout = options.resetTimeout || 30000;
    this.halfOpenMax = options.halfOpenMax || 1;
    this.monitorInterval = options.monitorInterval || 0;
    this.onStateChange = options.onStateChange || null;

    this._state = STATES.CLOSED;
    this._failures = 0;
    this._successes = 0;
    this._totalRequests = 0;
    this._consecutiveSuccesses = 0;
    this._lastFailureTime = null;
    this._halfOpenRequests = 0;
    this._resetTimer = null;
    this._monitorTimer = null;

    if (this.monitorInterval > 0) {
      this._startMonitor();
    }
  }

  /**
   * Execute a function through the circuit breaker.
   *
   * - CLOSED: execute normally, track failures.
   * - OPEN: reject immediately with CircuitBreakerError.
   * - HALF_OPEN: allow up to halfOpenMax probe requests.
   *
   * @param {function} fn  Async function to execute
   * @returns {Promise<*>} Result of the executed function
   */
  async execute(fn) {
    this._totalRequests++;

    if (this._state === STATES.OPEN) {
      throw new CircuitBreakerError(
        'Circuit breaker is OPEN — request rejected',
        this._state,
        this._failures,
      );
    }

    if (this._state === STATES.HALF_OPEN && this._halfOpenRequests >= this.halfOpenMax) {
      throw new CircuitBreakerError(
        'Circuit breaker HALF_OPEN limit reached — request rejected',
        this._state,
        this._failures,
      );
    }

    if (this._state === STATES.HALF_OPEN) {
      this._halfOpenRequests++;
    }

    try {
      const result = await fn();
      this._onSuccess();
      return result;
    } catch (error) {
      this._onFailure();
      throw error;
    }
  }

  /**
   * Get the current circuit breaker state.
   * @returns {string} One of 'CLOSED', 'OPEN', or 'HALF_OPEN'
   */
  getState() {
    return this._state;
  }

  /**
   * Get circuit breaker statistics.
   * @returns {object} Stats snapshot
   */
  getStats() {
    return {
      state: this._state,
      failures: this._failures,
      successes: this._successes,
      totalRequests: this._totalRequests,
      lastFailureTime: this._lastFailureTime,
      consecutiveSuccesses: this._consecutiveSuccesses,
    };
  }

  /**
   * Reset the circuit breaker to CLOSED state, clearing all counters.
   */
  reset() {
    const prev = this._state;
    this._state = STATES.CLOSED;
    this._failures = 0;
    this._successes = 0;
    this._totalRequests = 0;
    this._consecutiveSuccesses = 0;
    this._lastFailureTime = null;
    this._halfOpenRequests = 0;
    this._clearResetTimer();

    if (prev !== STATES.CLOSED) {
      this._emitStateChange(prev, STATES.CLOSED);
    }
  }

  /**
   * Force the circuit breaker into OPEN state.
   */
  forceOpen() {
    const prev = this._state;
    this._state = STATES.OPEN;
    this._clearResetTimer();
    this._scheduleHalfOpen();

    if (prev !== STATES.OPEN) {
      this._emitStateChange(prev, STATES.OPEN);
    }
  }

  /**
   * Force the circuit breaker into CLOSED state.
   */
  forceClose() {
    const prev = this._state;
    this._state = STATES.CLOSED;
    this._failures = 0;
    this._consecutiveSuccesses = 0;
    this._halfOpenRequests = 0;
    this._clearResetTimer();

    if (prev !== STATES.CLOSED) {
      this._emitStateChange(prev, STATES.CLOSED);
    }
  }

  /**
   * Check if the circuit breaker is healthy (CLOSED state).
   * @returns {boolean}
   */
  isHealthy() {
    return this._state === STATES.CLOSED;
  }

  /**
   * Clean up timers. Call when the circuit breaker is no longer needed.
   */
  destroy() {
    this._clearResetTimer();
    if (this._monitorTimer) {
      clearInterval(this._monitorTimer);
      this._monitorTimer = null;
    }
  }

  // ─── Internal helpers ──────────────────────────────────────────────

  /**
   * Handle a successful execution.
   */
  _onSuccess() {
    this._successes++;
    this._consecutiveSuccesses++;

    if (this._state === STATES.HALF_OPEN) {
      if (this._consecutiveSuccesses >= this.halfOpenMax) {
        const prev = this._state;
        this._state = STATES.CLOSED;
        this._failures = 0;
        this._consecutiveSuccesses = 0;
        this._halfOpenRequests = 0;
        this._clearResetTimer();
        this._emitStateChange(prev, STATES.CLOSED);
      }
    } else if (this._state === STATES.CLOSED) {
      // Reset consecutive failure tracking on success in CLOSED state
      this._failures = 0;
    }
  }

  /**
   * Handle a failed execution.
   */
  _onFailure() {
    this._failures++;
    this._consecutiveSuccesses = 0;
    this._lastFailureTime = Date.now();

    if (this._state === STATES.HALF_OPEN) {
      const prev = this._state;
      this._state = STATES.OPEN;
      this._halfOpenRequests = 0;
      this._scheduleHalfOpen();
      this._emitStateChange(prev, STATES.OPEN);
    } else if (this._state === STATES.CLOSED && this._failures >= this.failureThreshold) {
      const prev = this._state;
      this._state = STATES.OPEN;
      this._scheduleHalfOpen();
      this._emitStateChange(prev, STATES.OPEN);
    }
  }

  /**
   * Schedule automatic transition from OPEN to HALF_OPEN after resetTimeout.
   */
  _scheduleHalfOpen() {
    this._clearResetTimer();
    this._resetTimer = setTimeout(() => {
      if (this._state === STATES.OPEN) {
        const prev = this._state;
        this._state = STATES.HALF_OPEN;
        this._halfOpenRequests = 0;
        this._consecutiveSuccesses = 0;
        this._emitStateChange(prev, STATES.HALF_OPEN);
      }
    }, this.resetTimeout);

    // Allow Node.js to exit even if the timer is pending
    if (this._resetTimer && typeof this._resetTimer.unref === 'function') {
      this._resetTimer.unref();
    }
  }

  /**
   * Clear the pending reset timer.
   */
  _clearResetTimer() {
    if (this._resetTimer) {
      clearTimeout(this._resetTimer);
      this._resetTimer = null;
    }
  }

  /**
   * Emit a state-change event via the callback.
   */
  _emitStateChange(from, to) {
    if (typeof this.onStateChange === 'function') {
      this.onStateChange({ from, to, timestamp: Date.now() });
    }
  }

  /**
   * Start a periodic health-check monitor.
   */
  _startMonitor() {
    this._monitorTimer = setInterval(() => {
      // Auto-transition: if OPEN and cooldown has elapsed, move to HALF_OPEN
      if (
        this._state === STATES.OPEN &&
        this._lastFailureTime &&
        Date.now() - this._lastFailureTime >= this.resetTimeout
      ) {
        this._clearResetTimer();
        const prev = this._state;
        this._state = STATES.HALF_OPEN;
        this._halfOpenRequests = 0;
        this._consecutiveSuccesses = 0;
        this._emitStateChange(prev, STATES.HALF_OPEN);
      }
    }, this.monitorInterval);

    if (this._monitorTimer && typeof this._monitorTimer.unref === 'function') {
      this._monitorTimer.unref();
    }
  }
}

module.exports = { CircuitBreaker };
