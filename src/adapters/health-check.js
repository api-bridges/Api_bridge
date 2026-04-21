/**
 * awsibnj v5 — Health Check Monitor
 *
 * Endpoint health monitoring with:
 *  - Configurable health check probes (custom check functions)
 *  - Endpoint registration with intervals
 *  - Health status aggregation (healthy, degraded, unhealthy)
 *  - Alert callbacks on status transitions
 *  - Consecutive failure/success thresholds
 *  - History tracking for each endpoint
 *  - Manual check triggering
 *  - Statistics
 */

const { HealthCheckError } = require('../core/errors');

// ─── HEALTH STATES ───────────────────────────────────────────────────────────

const HEALTH_STATES = {
  HEALTHY: 'HEALTHY',
  DEGRADED: 'DEGRADED',
  UNHEALTHY: 'UNHEALTHY',
  UNKNOWN: 'UNKNOWN',
};

class HealthCheck {
  /**
   * @param {object}   options
   * @param {number}   options.failureThreshold      Consecutive failures before UNHEALTHY (default 3)
   * @param {number}   options.successThreshold       Consecutive successes to recover (default 2)
   * @param {number}   options.degradedThreshold       Consecutive failures before DEGRADED (default 1)
   * @param {number}   options.historySize            Max check results to keep per endpoint (default 50)
   * @param {Function} options.onStatusChange          Callback: (endpoint, prevStatus, newStatus) => void
   * @param {number}   options.defaultTimeout         Default check timeout in ms (default 5000)
   */
  constructor(options = {}) {
    this.failureThreshold = options.failureThreshold || 3;
    this.successThreshold = options.successThreshold || 2;
    this.degradedThreshold = options.degradedThreshold || 1;
    this.historySize = options.historySize || 50;
    this.onStatusChange = options.onStatusChange || null;
    this.defaultTimeout = options.defaultTimeout || 5000;

    /**
     * Map<name, { checkFn, interval, timeout, status, consecutiveFailures, consecutiveSuccesses, history, timer }>
     */
    this._endpoints = new Map();

    this._stats = {
      totalChecks: 0,
      totalFailures: 0,
      totalSuccesses: 0,
    };
  }

  /**
   * Register an endpoint for health monitoring.
   *
   * @param {string}   name     Endpoint name
   * @param {Function} checkFn  Async function that returns true (healthy) or throws/returns false (unhealthy)
   * @param {object}   [options]
   * @param {number}   [options.interval]   Check interval in ms (0 = manual only, default 0)
   * @param {number}   [options.timeout]    Check timeout in ms
   * @returns {HealthCheck} this
   */
  register(name, checkFn, options = {}) {
    if (!name || typeof name !== 'string') {
      throw new HealthCheckError('Endpoint name must be a non-empty string', name, 'invalid_name');
    }
    if (typeof checkFn !== 'function') {
      throw new HealthCheckError(`Check function for "${name}" must be a function`, name, 'invalid_check');
    }

    const endpoint = {
      checkFn,
      interval: options.interval || 0,
      timeout: options.timeout || this.defaultTimeout,
      status: HEALTH_STATES.UNKNOWN,
      consecutiveFailures: 0,
      consecutiveSuccesses: 0,
      history: [],
      timer: null,
      lastCheck: null,
    };

    this._endpoints.set(name, endpoint);

    // Start automatic checking if interval > 0
    if (endpoint.interval > 0) {
      this._startInterval(name, endpoint);
    }

    return this;
  }

  /**
   * Unregister an endpoint and stop its monitor.
   * @param {string} name
   * @returns {boolean}
   */
  unregister(name) {
    const endpoint = this._endpoints.get(name);
    if (endpoint) {
      if (endpoint.timer) {
        clearInterval(endpoint.timer);
      }
      this._endpoints.delete(name);
      return true;
    }
    return false;
  }

  /**
   * Manually trigger a health check for a specific endpoint.
   * @param {string} name
   * @returns {Promise<{ status: string, duration: number, error: string|null }>}
   */
  async check(name) {
    const endpoint = this._endpoints.get(name);
    if (!endpoint) {
      throw new HealthCheckError(`Unknown endpoint: "${name}"`, name, 'not_found');
    }

    return this._performCheck(name, endpoint);
  }

  /**
   * Run health checks for all registered endpoints.
   * @returns {Promise<object>} Map of endpoint names to check results
   */
  async checkAll() {
    const results = {};
    const promises = [];

    for (const [name, endpoint] of this._endpoints) {
      promises.push(
        this._performCheck(name, endpoint).then(result => {
          results[name] = result;
        })
      );
    }

    await Promise.all(promises);
    return results;
  }

  /**
   * Get the current health status of an endpoint.
   * @param {string} name
   * @returns {string} One of HEALTHY, DEGRADED, UNHEALTHY, UNKNOWN
   */
  getStatus(name) {
    const endpoint = this._endpoints.get(name);
    return endpoint ? endpoint.status : HEALTH_STATES.UNKNOWN;
  }

  /**
   * Get aggregated health status across all endpoints.
   * @returns {{ status: string, endpoints: object }}
   */
  getOverallStatus() {
    const statuses = {};
    let hasUnhealthy = false;
    let hasDegraded = false;

    for (const [name, endpoint] of this._endpoints) {
      statuses[name] = endpoint.status;
      if (endpoint.status === HEALTH_STATES.UNHEALTHY) hasUnhealthy = true;
      if (endpoint.status === HEALTH_STATES.DEGRADED) hasDegraded = true;
    }

    let overall = HEALTH_STATES.HEALTHY;
    if (hasUnhealthy) overall = HEALTH_STATES.UNHEALTHY;
    else if (hasDegraded) overall = HEALTH_STATES.DEGRADED;
    else if (this._endpoints.size === 0) overall = HEALTH_STATES.UNKNOWN;

    return { status: overall, endpoints: statuses };
  }

  /**
   * Get check history for an endpoint.
   * @param {string} name
   * @returns {Array<{ success: boolean, duration: number, timestamp: string, error: string|null }>}
   */
  getHistory(name) {
    const endpoint = this._endpoints.get(name);
    return endpoint ? [...endpoint.history] : [];
  }

  /**
   * List all registered endpoints.
   * @returns {Array<{ name: string, status: string, lastCheck: string|null }>}
   */
  list() {
    const result = [];
    for (const [name, endpoint] of this._endpoints) {
      result.push({
        name,
        status: endpoint.status,
        lastCheck: endpoint.lastCheck,
      });
    }
    return result;
  }

  /**
   * Check if an endpoint is healthy.
   * @param {string} name
   * @returns {boolean}
   */
  isHealthy(name) {
    const endpoint = this._endpoints.get(name);
    return endpoint ? endpoint.status === HEALTH_STATES.HEALTHY : false;
  }

  /**
   * Get statistics.
   * @returns {object}
   */
  getStats() {
    return {
      ...this._stats,
      endpointsRegistered: this._endpoints.size,
    };
  }

  /**
   * Stop all interval monitors and clear state.
   */
  reset() {
    for (const endpoint of this._endpoints.values()) {
      if (endpoint.timer) {
        clearInterval(endpoint.timer);
      }
    }
    this._endpoints.clear();
    this._stats = {
      totalChecks: 0,
      totalFailures: 0,
      totalSuccesses: 0,
    };
  }

  /**
   * Stop all interval monitors without clearing registrations.
   */
  stop() {
    for (const endpoint of this._endpoints.values()) {
      if (endpoint.timer) {
        clearInterval(endpoint.timer);
        endpoint.timer = null;
      }
    }
  }

  // ─── INTERNAL ─────────────────────────────────────────────────────

  /**
   * Perform a single health check.
   * @param {string} name
   * @param {object} endpoint
   * @returns {Promise<{ status: string, duration: number, error: string|null }>}
   */
  async _performCheck(name, endpoint) {
    const startTime = Date.now();
    this._stats.totalChecks++;
    let success = false;
    let error = null;

    try {
      const result = await this._withTimeout(endpoint.checkFn(), endpoint.timeout, name);
      success = result !== false;
    } catch (err) {
      error = err.message;
    }

    const duration = Date.now() - startTime;
    const prevStatus = endpoint.status;

    if (success) {
      this._stats.totalSuccesses++;
      endpoint.consecutiveFailures = 0;
      endpoint.consecutiveSuccesses++;

      if (endpoint.consecutiveSuccesses >= this.successThreshold) {
        endpoint.status = HEALTH_STATES.HEALTHY;
      }
    } else {
      this._stats.totalFailures++;
      endpoint.consecutiveSuccesses = 0;
      endpoint.consecutiveFailures++;

      if (endpoint.consecutiveFailures >= this.failureThreshold) {
        endpoint.status = HEALTH_STATES.UNHEALTHY;
      } else if (endpoint.consecutiveFailures >= this.degradedThreshold) {
        endpoint.status = HEALTH_STATES.DEGRADED;
      }
    }

    endpoint.lastCheck = new Date().toISOString();

    // Record history
    endpoint.history.push({
      success,
      duration,
      timestamp: endpoint.lastCheck,
      error,
    });
    if (endpoint.history.length > this.historySize) {
      endpoint.history.shift();
    }

    // Status change callback
    if (prevStatus !== endpoint.status && typeof this.onStatusChange === 'function') {
      this.onStatusChange(name, prevStatus, endpoint.status);
    }

    return { status: endpoint.status, duration, error };
  }

  /**
   * Start automatic interval checking.
   * @param {string} name
   * @param {object} endpoint
   */
  _startInterval(name, endpoint) {
    endpoint.timer = setInterval(() => {
      this._performCheck(name, endpoint).catch(() => {});
    }, endpoint.interval);

    if (endpoint.timer && typeof endpoint.timer.unref === 'function') {
      endpoint.timer.unref();
    }
  }

  /**
   * Race a promise against a timeout.
   * @param {Promise} promise
   * @param {number} ms
   * @param {string} name
   * @returns {Promise<*>}
   */
  _withTimeout(promise, ms, name) {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error(`Health check "${name}" timed out after ${ms}ms`));
      }, ms);
      if (typeof timer.unref === 'function') timer.unref();

      Promise.resolve(promise).then(
        (val) => { clearTimeout(timer); resolve(val); },
        (err) => { clearTimeout(timer); reject(err); },
      );
    });
  }
}

module.exports = { HealthCheck, HEALTH_STATES };
