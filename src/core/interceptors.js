/**
 * APIBridge AI v15 — Interceptor Manager
 *
 * Axios-compatible interceptor system with improvements:
 *   - Request interceptors
 *   - Response interceptors
 *   - Error interceptors
 *   - Async execution support
 *   - Chaining
 *   - Ejection by ID
 *
 * v15 enhancements:
 *   - `options.synchronous` (boolean) — run interceptor synchronously (no await)
 *   - `options.runWhen` (function|null) — predicate `(config) => boolean`;
 *     if provided and returns false the interceptor is skipped
 *
 * Usage:
 *   client.interceptors.request.use(onFulfilled, onRejected);
 *   client.interceptors.request.use(onFulfilled, onRejected, { synchronous: true });
 *   client.interceptors.request.use(onFulfilled, null, { runWhen: (cfg) => cfg.needsAuth });
 *   client.interceptors.response.use(onFulfilled, onRejected);
 *   client.interceptors.request.eject(id);
 */

'use strict';

/**
 * An individual interceptor chain (request or response).
 * Each interceptor is { id, fulfilled, rejected, synchronous, runWhen }.
 */
class InterceptorChain {
  constructor() {
    this._handlers = [];
    this._nextId = 0;
  }

  /**
   * Register an interceptor.
   * @param {Function} fulfilled — Called on success
   * @param {Function} [rejected] — Called on error
   * @param {object}   [options]
   * @param {boolean}  [options.synchronous=false] — Run synchronously (no await)
   * @param {Function|null} [options.runWhen] — Predicate; return false to skip
   * @returns {number} Interceptor ID (used to eject)
   */
  use(fulfilled, rejected, options) {
    if (typeof fulfilled !== 'function') {
      throw new TypeError('Interceptor fulfilled handler must be a function');
    }
    const opts = options || {};
    const id = this._nextId++;
    this._handlers.push({
      id,
      fulfilled,
      rejected: rejected || null,
      synchronous: opts.synchronous === true,
      runWhen: typeof opts.runWhen === 'function' ? opts.runWhen : null,
    });
    return id;
  }

  /**
   * Remove an interceptor by ID.
   * @param {number} id
   * @returns {boolean} true if removed
   */
  eject(id) {
    const idx = this._handlers.findIndex(h => h.id === id);
    if (idx !== -1) {
      this._handlers.splice(idx, 1);
      return true;
    }
    return false;
  }

  /**
   * Get all active handlers (internal).
   * @returns {Array<{id: number, fulfilled: Function, rejected: Function|null, synchronous: boolean, runWhen: Function|null}>}
   */
  handlers() {
    return this._handlers.slice();
  }

  /**
   * Clear all interceptors.
   */
  clear() {
    this._handlers = [];
  }

  /**
   * Number of registered interceptors.
   */
  get size() {
    return this._handlers.length;
  }

  /**
   * Iterate over all registered interceptors (Axios-compatible).
   * @param {Function} fn — Called with each handler { fulfilled, rejected }
   */
  forEach(fn) {
    if (typeof fn !== 'function') return;
    for (const handler of this._handlers) {
      fn(handler);
    }
  }
}

/**
 * Manages request and response interceptor chains.
 * Executes them as an async promise chain (like Axios).
 */
class InterceptorManager {
  constructor() {
    this.request = new InterceptorChain();
    this.response = new InterceptorChain();
  }

  /**
   * Run request interceptors on a config object.
   * Each interceptor receives the config and must return it (or a promise resolving to it).
   *
   * @param {object} config — The request configuration
   * @returns {Promise<object>} The (possibly modified) config
   */
  async runRequest(config) {
    let result = config;
    for (const handler of this.request.handlers()) {
      if (handler.runWhen && !handler.runWhen(result)) {
        continue;
      }
      try {
        result = handler.synchronous
          ? handler.fulfilled(result)
          : await handler.fulfilled(result);
      } catch (err) {
        if (handler.rejected) {
          result = handler.synchronous
            ? handler.rejected(err)
            : await handler.rejected(err);
        } else {
          throw err;
        }
      }
    }
    return result;
  }

  /**
   * Run response interceptors on a response object.
   *
   * @param {object} response — The response object
   * @returns {Promise<object>} The (possibly modified) response
   */
  async runResponse(response) {
    let result = response;
    for (const handler of this.response.handlers()) {
      if (handler.runWhen && !handler.runWhen(result)) {
        continue;
      }
      try {
        result = handler.synchronous
          ? handler.fulfilled(result)
          : await handler.fulfilled(result);
      } catch (err) {
        if (handler.rejected) {
          result = handler.synchronous
            ? handler.rejected(err)
            : await handler.rejected(err);
        } else {
          throw err;
        }
      }
    }
    return result;
  }

  /**
   * Run error interceptors (response chain rejected handlers).
   *
   * @param {Error} error — The error object
   * @returns {Promise<object>} Possibly recovered response
   */
  async runError(error) {
    let result = error;
    const handlers = this.response.handlers();
    for (const handler of handlers) {
      if (handler.rejected) {
        try {
          result = await handler.rejected(result);
          // If rejected handler returns a non-error, treat as recovery
          if (!(result instanceof Error)) {
            return result;
          }
        } catch (err) {
          result = err;
        }
      }
    }
    // If still an error, throw it
    if (result instanceof Error) {
      throw result;
    }
    return result;
  }

  /**
   * Clear all interceptors.
   */
  clear() {
    this.request.clear();
    this.response.clear();
  }
}

module.exports = { InterceptorManager, InterceptorChain };
