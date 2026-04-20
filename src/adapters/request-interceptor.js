/**
 * nopes v8 — Request Interceptor Chain
 *
 * Priority-ordered interceptor chain for modifying requests and responses.
 * More powerful than middleware — supports priority ordering, async interceptors,
 * short-circuiting, request/response pairs, and per-interceptor error handling.
 *
 * Features:
 *  - Priority-ordered interceptor execution
 *  - Separate request and response interceptor chains
 *  - Short-circuit capability (stop chain and return early)
 *  - Async interceptor support
 *  - Per-interceptor error handling
 *  - Interceptor groups (enable/disable groups)
 *  - Execution timing and stats
 *  - Interceptor bypass for specific requests
 */

class RequestInterceptor {
  /**
   * @param {object} options
   * @param {boolean} options.trackTiming    Track interceptor execution timing (default true)
   * @param {boolean} options.continueOnError Continue chain on interceptor errors (default true)
   */
  constructor(options = {}) {
    this.trackTiming = options.trackTiming !== false;
    this.continueOnError = options.continueOnError !== false;

    this._requestInterceptors = [];
    this._responseInterceptors = [];
    this._groups = new Map(); // groupName → enabled boolean

    this._stats = {
      requestInterceptions: 0,
      responseInterceptions: 0,
      shortCircuits: 0,
      errors: 0,
      timing: {},
    };
  }

  /**
   * Add a request interceptor.
   *
   * @param {string}   name        Interceptor name
   * @param {Function} handler     Handler: (context) => context | Promise<context>
   * @param {object}   options
   * @param {number}   options.priority  Execution priority (higher = earlier, default 0)
   * @param {string}   options.group     Group name for batch enable/disable
   * @param {Function} options.onError   Error handler: (error, context) => context
   * @returns {RequestInterceptor} this
   */
  useRequest(name, handler, options = {}) {
    this._requestInterceptors.push({
      name,
      handler,
      priority: options.priority || 0,
      group: options.group || null,
      onError: options.onError || null,
      enabled: true,
    });

    this._requestInterceptors.sort((a, b) => b.priority - a.priority);

    if (options.group) {
      if (!this._groups.has(options.group)) {
        this._groups.set(options.group, true);
      }
    }

    return this;
  }

  /**
   * Add a response interceptor.
   *
   * @param {string}   name        Interceptor name
   * @param {Function} handler     Handler: (context) => context | Promise<context>
   * @param {object}   options     Same as useRequest options
   * @returns {RequestInterceptor} this
   */
  useResponse(name, handler, options = {}) {
    this._responseInterceptors.push({
      name,
      handler,
      priority: options.priority || 0,
      group: options.group || null,
      onError: options.onError || null,
      enabled: true,
    });

    this._responseInterceptors.sort((a, b) => b.priority - a.priority);

    if (options.group) {
      if (!this._groups.has(options.group)) {
        this._groups.set(options.group, true);
      }
    }

    return this;
  }

  /**
   * Run the request interceptor chain.
   *
   * @param {object} context  The request context { url, method, headers, body, meta, ... }
   * @returns {Promise<{ context: object, shortCircuited: boolean, executedInterceptors: string[] }>}
   */
  async interceptRequest(context) {
    return this._runChain(this._requestInterceptors, context, 'request');
  }

  /**
   * Run the response interceptor chain.
   *
   * @param {object} context  The response context { status, data, headers, meta, ... }
   * @returns {Promise<{ context: object, shortCircuited: boolean, executedInterceptors: string[] }>}
   */
  async interceptResponse(context) {
    return this._runChain(this._responseInterceptors, context, 'response');
  }

  /**
   * Enable/disable an interceptor group.
   *
   * @param {string}  groupName  Group name
   * @param {boolean} enabled    Enable or disable
   */
  setGroupEnabled(groupName, enabled) {
    this._groups.set(groupName, enabled);
  }

  /**
   * Enable/disable a specific interceptor by name.
   *
   * @param {string}  name     Interceptor name
   * @param {boolean} enabled  Enable or disable
   */
  setEnabled(name, enabled) {
    for (const interceptor of [...this._requestInterceptors, ...this._responseInterceptors]) {
      if (interceptor.name === name) {
        interceptor.enabled = enabled;
      }
    }
  }

  /**
   * Remove an interceptor by name.
   */
  remove(name) {
    this._requestInterceptors = this._requestInterceptors.filter(i => i.name !== name);
    this._responseInterceptors = this._responseInterceptors.filter(i => i.name !== name);
  }

  /**
   * List all registered interceptors.
   */
  list() {
    return {
      request: this._requestInterceptors.map(i => ({
        name: i.name, priority: i.priority, group: i.group, enabled: i.enabled,
      })),
      response: this._responseInterceptors.map(i => ({
        name: i.name, priority: i.priority, group: i.group, enabled: i.enabled,
      })),
    };
  }

  /**
   * Get execution statistics.
   */
  getStats() {
    return { ...this._stats };
  }

  /**
   * Clear all interceptors and stats.
   */
  clear() {
    this._requestInterceptors = [];
    this._responseInterceptors = [];
    this._groups.clear();
    this._stats = {
      requestInterceptions: 0, responseInterceptions: 0,
      shortCircuits: 0, errors: 0, timing: {},
    };
  }

  // ─── INTERNAL ──────────────────────────────────────────────────────────

  async _runChain(interceptors, context, type) {
    const executed = [];
    let current = { ...context };
    let shortCircuited = false;

    if (type === 'request') this._stats.requestInterceptions++;
    else this._stats.responseInterceptions++;

    for (const interceptor of interceptors) {
      // Check if enabled
      if (!interceptor.enabled) continue;

      // Check group enabled
      if (interceptor.group && !this._groups.get(interceptor.group)) continue;

      // Check if bypass flag is set for this interceptor
      if (current._bypass && current._bypass.includes(interceptor.name)) continue;

      const startTime = this.trackTiming ? Date.now() : 0;

      try {
        const result = await interceptor.handler(current);

        if (this.trackTiming) {
          const duration = Date.now() - startTime;
          this._stats.timing[interceptor.name] = this._stats.timing[interceptor.name] || [];
          this._stats.timing[interceptor.name].push(duration);
          if (this._stats.timing[interceptor.name].length > 100) {
            this._stats.timing[interceptor.name] = this._stats.timing[interceptor.name].slice(-100);
          }
        }

        executed.push(interceptor.name);

        if (result === null || result === undefined) continue; // Handler chose not to modify

        // Check for short-circuit signal
        if (result._shortCircuit) {
          shortCircuited = true;
          this._stats.shortCircuits++;
          current = result;
          delete current._shortCircuit;
          break;
        }

        current = result;
      } catch (err) {
        this._stats.errors++;

        if (interceptor.onError) {
          try {
            current = interceptor.onError(err, current) || current;
            executed.push(interceptor.name + '(error-handled)');
          } catch {
            // Error handler failed too
          }
        } else if (!this.continueOnError) {
          throw err;
        }
      }
    }

    return { context: current, shortCircuited, executedInterceptors: executed };
  }
}

module.exports = { RequestInterceptor };
