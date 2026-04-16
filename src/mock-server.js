/**
 * APIBridge AI v5 — Mock Server
 *
 * Built-in mock server for testing with recorded responses:
 *  - Register mock endpoints with method + path matching
 *  - Pattern matching for URL paths (exact and wildcard)
 *  - Request recording and playback
 *  - Configurable response delays
 *  - Request assertion helpers
 *  - Sequence support (different responses per call)
 *  - Auto-reset capabilities
 *  - Statistics tracking
 */

const { MockServerError } = require('./errors');

class MockServer {
  /**
   * @param {object}  options
   * @param {number}  options.defaultDelay     Default response delay in ms (default 0)
   * @param {number}  options.defaultStatus    Default HTTP status code (default 200)
   * @param {boolean} options.recordRequests   Record all incoming requests (default true)
   * @param {boolean} options.strict           Throw on unmatched requests (default false)
   */
  constructor(options = {}) {
    this.defaultDelay = options.defaultDelay || 0;
    this.defaultStatus = options.defaultStatus || 200;
    this.recordRequests = options.recordRequests !== false;
    this.strict = options.strict || false;

    /** @type {Array<{ method: string, pattern: string|RegExp, handler: object }>} */
    this._routes = [];

    /** @type {Array<object>} */
    this._requests = [];

    this._stats = {
      totalRequests: 0,
      matchedRequests: 0,
      unmatchedRequests: 0,
    };
  }

  /**
   * Register a mock endpoint.
   *
   * @param {string}   method   HTTP method (GET, POST, etc.)
   * @param {string}   pattern  URL path pattern. Use '*' for wildcard segments.
   * @param {object}   response
   * @param {number}   [response.status]   HTTP status code
   * @param {*}        [response.body]     Response body
   * @param {object}   [response.headers]  Response headers
   * @param {number}   [response.delay]    Response delay in ms
   * @param {Function} [response.handler]  Dynamic handler: (req) => { status, body, headers }
   * @returns {MockServer} this
   */
  register(method, pattern, response = {}) {
    if (!method || !pattern) {
      throw new MockServerError('Method and pattern are required', 'register', 'invalid_args');
    }

    this._routes.push({
      method: method.toUpperCase(),
      pattern,
      handler: {
        status: response.status || this.defaultStatus,
        body: response.body !== undefined ? response.body : null,
        headers: response.headers || {},
        delay: response.delay != null ? response.delay : this.defaultDelay,
        fn: response.handler || null,
        sequence: null,
        callCount: 0,
      },
    });

    return this;
  }

  /**
   * Register a sequence of responses for the same endpoint.
   * Each call returns the next response in the sequence; the last one repeats.
   *
   * @param {string}   method     HTTP method
   * @param {string}   pattern    URL path pattern
   * @param {Array<object>} responses  Array of response objects
   * @returns {MockServer} this
   */
  registerSequence(method, pattern, responses) {
    if (!Array.isArray(responses) || responses.length === 0) {
      throw new MockServerError('Responses must be a non-empty array', 'registerSequence', 'invalid_args');
    }

    this._routes.push({
      method: method.toUpperCase(),
      pattern,
      handler: {
        status: this.defaultStatus,
        body: null,
        headers: {},
        delay: this.defaultDelay,
        fn: null,
        sequence: responses.map(r => ({
          status: r.status || this.defaultStatus,
          body: r.body !== undefined ? r.body : null,
          headers: r.headers || {},
          delay: r.delay != null ? r.delay : this.defaultDelay,
        })),
        callCount: 0,
      },
    });

    return this;
  }

  /**
   * Handle a request against registered mock routes.
   *
   * @param {string} method   HTTP method
   * @param {string} url      Request URL or path
   * @param {object} [options]
   * @param {*}      [options.body]     Request body
   * @param {object} [options.headers]  Request headers
   * @returns {Promise<{ status: number, body: *, headers: object }>}
   */
  async handle(method, url, options = {}) {
    this._stats.totalRequests++;

    const request = {
      method: method.toUpperCase(),
      url,
      body: options.body || null,
      headers: options.headers || {},
      timestamp: new Date().toISOString(),
    };

    if (this.recordRequests) {
      this._requests.push(request);
    }

    // Find matching route
    const route = this._findRoute(request.method, url);

    if (!route) {
      this._stats.unmatchedRequests++;
      if (this.strict) {
        throw new MockServerError(
          `No mock registered for ${request.method} ${url}`,
          'handle',
          'no_match',
        );
      }
      return { status: 404, body: { error: 'Not Found' }, headers: {} };
    }

    this._stats.matchedRequests++;
    route.handler.callCount++;

    let response;

    // Sequence response
    if (route.handler.sequence) {
      const idx = Math.min(route.handler.callCount - 1, route.handler.sequence.length - 1);
      const seqResponse = route.handler.sequence[idx];
      response = {
        status: seqResponse.status,
        body: seqResponse.body,
        headers: { ...seqResponse.headers },
      };
      if (seqResponse.delay > 0) {
        await this._delay(seqResponse.delay);
      }
    }
    // Dynamic handler
    else if (typeof route.handler.fn === 'function') {
      response = await route.handler.fn(request);
      if (!response) response = { status: 200, body: null, headers: {} };
      if (route.handler.delay > 0) {
        await this._delay(route.handler.delay);
      }
    }
    // Static response
    else {
      if (route.handler.delay > 0) {
        await this._delay(route.handler.delay);
      }
      response = {
        status: route.handler.status,
        body: route.handler.body,
        headers: { ...route.handler.headers },
      };
    }

    return response;
  }

  /**
   * Get all recorded requests.
   * @param {object} [filter]
   * @param {string} [filter.method]   Filter by HTTP method
   * @param {string} [filter.url]      Filter by URL (exact match)
   * @returns {Array<object>}
   */
  getRequests(filter = {}) {
    let requests = [...this._requests];
    if (filter.method) {
      requests = requests.filter(r => r.method === filter.method.toUpperCase());
    }
    if (filter.url) {
      requests = requests.filter(r => r.url === filter.url);
    }
    return requests;
  }

  /**
   * Assert that a specific request was made.
   * @param {string} method   HTTP method
   * @param {string} url      Request URL
   * @param {object} [options]
   * @param {number} [options.times]  Expected number of calls
   * @returns {{ called: boolean, count: number, requests: Array<object> }}
   */
  assertCalled(method, url, options = {}) {
    const matching = this._requests.filter(
      r => r.method === method.toUpperCase() && r.url === url
    );

    const called = matching.length > 0;
    const count = matching.length;

    if (options.times !== undefined && count !== options.times) {
      return {
        called,
        count,
        requests: matching,
        expected: options.times,
        passed: false,
      };
    }

    return {
      called,
      count,
      requests: matching,
      passed: options.times !== undefined ? count === options.times : called,
    };
  }

  /**
   * Remove a registered route.
   * @param {string} method
   * @param {string} pattern
   * @returns {MockServer} this
   */
  unregister(method, pattern) {
    this._routes = this._routes.filter(
      r => !(r.method === method.toUpperCase() && r.pattern === pattern)
    );
    return this;
  }

  /**
   * List all registered routes.
   * @returns {Array<{ method: string, pattern: string, callCount: number }>}
   */
  list() {
    return this._routes.map(r => ({
      method: r.method,
      pattern: r.pattern,
      callCount: r.handler.callCount,
    }));
  }

  /**
   * Clear all recorded requests.
   */
  clearRequests() {
    this._requests = [];
  }

  /**
   * Clear all registered routes.
   */
  clearRoutes() {
    this._routes = [];
  }

  /**
   * Get mock server statistics.
   * @returns {object}
   */
  getStats() {
    return {
      ...this._stats,
      routesRegistered: this._routes.length,
      requestsRecorded: this._requests.length,
    };
  }

  /**
   * Reset everything (routes, requests, stats).
   */
  reset() {
    this._routes = [];
    this._requests = [];
    this._stats = {
      totalRequests: 0,
      matchedRequests: 0,
      unmatchedRequests: 0,
    };
  }

  // ─── INTERNAL ─────────────────────────────────────────────────────

  /**
   * Find a matching route for the given method and URL.
   * @param {string} method
   * @param {string} url
   * @returns {object|null}
   */
  _findRoute(method, url) {
    for (const route of this._routes) {
      if (route.method !== method) continue;

      if (route.pattern instanceof RegExp) {
        if (route.pattern.test(url)) return route;
      } else if (route.pattern.includes('*')) {
        // Wildcard matching — escape regex metacharacters first, then replace * with [^/]+
        const escaped = route.pattern
          .replace(/[\\^$+?.()|[\]{}]/g, '\\$&')
          .replace(/\*/g, '[^/]+');
        const regex = new RegExp('^' + escaped + '$');
        if (regex.test(url)) return route;
      } else {
        if (route.pattern === url) return route;
      }
    }
    return null;
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

module.exports = { MockServer };
