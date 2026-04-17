/**
 * APIBridge AI v9 — HTTP Client Engine
 *
 * A next-generation API client that replaces Axios and provides intelligent
 * data alignment, schema awareness, and enhanced performance/security.
 *
 * Features:
 *   - Built on native fetch
 *   - GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS
 *   - Headers, params, body
 *   - Timeouts via AbortController
 *   - Retries with exponential backoff
 *   - Interceptor system (Axios-compatible)
 *   - Expectation-aware system
 *   - Auto data alignment (snake_case → camelCase, fuzzy matching, etc.)
 *   - Type coercion
 *   - Smart Proxy mode
 *   - Auto-learning engine
 *   - Schema-aware mode
 *   - Debug mode
 *
 * Usage:
 *   const api = createClient({ baseURL: "/api" });
 *   const res = await api.get("/user", { expect: { userName: "string" } });
 */

'use strict';

const { APIBridgeTransformer } = require('./transformer');
const { LearningEngine } = require('./learning');
const { FuzzyMatcher } = require('./fuzzy-matcher');
const { TypeCoercer } = require('./type-coercer');
const { InterceptorManager } = require('./interceptors');
const {
  extractExpect,
  injectExpectHeader,
  validateExpect,
  flattenExpect,
  HEADER_NAME,
} = require('./expectation');
const { smartProxy } = require('./proxy');
const { ApiBridgeError, NetworkError, ValidationError } = require('./errors');

// ─── Standardized Error ─────────────────────────────────────────────────────

/**
 * Standardized error object for the client.
 */
class ClientError extends ApiBridgeError {
  /**
   * @param {string} message
   * @param {object} [details={}]
   * @param {number} [details.status]
   * @param {string} [details.code]
   * @param {*}      [details.details]
   */
  constructor(message, details = {}) {
    super(message);
    this.name = 'ClientError';
    this.status = details.status || null;
    this.code = details.code || 'ERR_CLIENT';
    this.details = details.details || null;
  }

  toJSON() {
    return {
      message: this.message,
      status: this.status,
      code: this.code,
      details: this.details,
    };
  }
}

// ─── Helpers ────────────────────────────────────────────────────────────────

/**
 * Build a full URL from base + path + params.
 */
function buildURL(baseURL, path, params) {
  let url = baseURL || '';
  if (path) {
    // Remove double slashes between base and path
    if (url.endsWith('/') && path.startsWith('/')) {
      url += path.slice(1);
    } else if (!url.endsWith('/') && !path.startsWith('/') && url) {
      url += '/' + path;
    } else {
      url += path;
    }
  }

  if (params && typeof params === 'object') {
    const entries = Object.entries(params).filter(([, v]) => v !== undefined && v !== null);
    if (entries.length > 0) {
      const queryString = entries
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
        .join('&');
      url += (url.includes('?') ? '&' : '?') + queryString;
    }
  }

  return url;
}

/**
 * Create a timeout AbortController.
 */
function createTimeoutController(timeoutMs, existingSignal) {
  const controller = new AbortController();

  const timer = setTimeout(() => {
    controller.abort(new ClientError('Request timeout', {
      code: 'ERR_TIMEOUT',
      details: { timeout: timeoutMs },
    }));
  }, timeoutMs);

  // If user provided an abort signal, link them
  if (existingSignal) {
    if (existingSignal.aborted) {
      clearTimeout(timer);
      controller.abort(existingSignal.reason);
    } else {
      const onAbort = () => {
        clearTimeout(timer);
        controller.abort(existingSignal.reason);
      };
      existingSignal.addEventListener('abort', onAbort, { once: true });
    }
  }

  return { controller, timer };
}

// ─── APIBridgeClient ────────────────────────────────────────────────────────

class APIBridgeClient {
  /**
   * @param {object} [options={}]
   * @param {string} [options.baseURL=''] — Base URL for all requests
   * @param {object} [options.headers={}] — Default headers
   * @param {number} [options.timeout=0] — Default timeout in ms (0 = no timeout)
   * @param {number} [options.retries=0] — Max retries for failed requests
   * @param {number} [options.retryDelay=1000] — Base delay in ms
   * @param {object} [options.schema=null] — Default expectation schema
   * @param {boolean} [options.proxyMode=false] — Wrap responses in Smart Proxy
   * @param {boolean} [options.autoAlign=true] — Auto data alignment
   * @param {boolean} [options.autoCoerce=true] — Auto type coercion
   * @param {boolean} [options.debug=false] — Debug mode
   * @param {Set<number>} [options.retryableStatuses] — Status codes to retry
   */
  constructor(options = {}) {
    this.baseURL = options.baseURL || '';
    this.defaultHeaders = Object.assign({}, options.headers || {});
    this.timeout = options.timeout || 0;
    this.retries = options.retries || 0;
    this.retryDelay = options.retryDelay || 1000;
    this.proxyMode = options.proxyMode || false;
    this.autoAlign = options.autoAlign !== false;
    this.autoCoerce = options.autoCoerce !== false;
    this._debug = options.debug || false;
    this._schema = options.schema || null;
    this.retryableStatuses = options.retryableStatuses ||
      new Set([408, 429, 500, 502, 503, 504]);

    // Core engines
    this.transformer = new APIBridgeTransformer(options);
    this.learning = this.transformer.learning;
    this.fuzzyMatcher = new FuzzyMatcher(options.fuzzyMatcher || {});
    this.typeCoercer = new TypeCoercer({
      autoCoerce: this.autoCoerce,
      ...(options.typeCoercer || {}),
    });

    // Interceptor system (Axios-compatible)
    this.interceptors = new InterceptorManager();

    // Endpoint mapping cache (endpoint → field mappings)
    this._endpointCache = new Map();

    // Stats
    this._stats = {
      requests: 0,
      successes: 0,
      failures: 0,
      retries: 0,
      cacheHits: 0,
    };
  }

  /**
   * Set a schema for improved mapping accuracy.
   * @param {object} schema
   */
  setSchema(schema) {
    const validation = validateExpect(schema);
    if (!validation.valid) {
      throw new ValidationError(validation.error);
    }
    this._schema = schema;
  }

  /**
   * Enable or disable debug mode.
   * @param {boolean} enabled
   */
  enableDebug(enabled) {
    this._debug = !!enabled;
  }

  /**
   * Enable or disable proxy mode.
   * @param {boolean} enabled
   */
  enableProxy(enabled) {
    this.proxyMode = !!enabled;
  }

  // ─── HTTP Methods ───────────────────────────────────────────────────────

  /**
   * @param {string} url
   * @param {object} [config={}]
   * @returns {Promise<object>}
   */
  get(url, config) {
    return this.request('GET', url, undefined, config);
  }

  /**
   * @param {string} url
   * @param {*} [body]
   * @param {object} [config={}]
   * @returns {Promise<object>}
   */
  post(url, body, config) {
    return this.request('POST', url, body, config);
  }

  /**
   * @param {string} url
   * @param {*} [body]
   * @param {object} [config={}]
   * @returns {Promise<object>}
   */
  put(url, body, config) {
    return this.request('PUT', url, body, config);
  }

  /**
   * @param {string} url
   * @param {*} [body]
   * @param {object} [config={}]
   * @returns {Promise<object>}
   */
  patch(url, body, config) {
    return this.request('PATCH', url, body, config);
  }

  /**
   * @param {string} url
   * @param {object} [config={}]
   * @returns {Promise<object>}
   */
  delete(url, config) {
    return this.request('DELETE', url, undefined, config);
  }

  /**
   * @param {string} url
   * @param {object} [config={}]
   * @returns {Promise<object>}
   */
  head(url, config) {
    return this.request('HEAD', url, undefined, config);
  }

  /**
   * @param {string} url
   * @param {object} [config={}]
   * @returns {Promise<object>}
   */
  options(url, config) {
    return this.request('OPTIONS', url, undefined, config);
  }

  // ─── Core Request ───────────────────────────────────────────────────────

  /**
   * Execute an HTTP request with full pipeline.
   *
   * @param {string} method — HTTP method
   * @param {string} url — URL path (relative to baseURL or absolute)
   * @param {*} [body] — Request body
   * @param {object} [config={}] — Request config (headers, params, expect, timeout, signal, etc.)
   * @returns {Promise<{data: *, status: number, headers: object, raw?: *}>}
   */
  async request(method, url, body, config = {}) {
    this._stats.requests++;

    // 1. Extract expect schema from config
    const { config: cleanConfig, expect: expectSchema, error: expectError } = extractExpect(config);
    if (expectError && this._debug) {
      console.warn('[api-bridge] Expect schema warning:', expectError);
    }

    // Use per-request expect, or fall back to global schema
    const activeExpect = expectSchema || this._schema;
    const expectMap = activeExpect ? flattenExpect(activeExpect) : null;

    // 2. Build request config
    let reqConfig = {
      method: method.toUpperCase(),
      url,
      body,
      headers: Object.assign({}, this.defaultHeaders, cleanConfig.headers || {}),
      params: cleanConfig.params || undefined,
      timeout: cleanConfig.timeout !== undefined ? cleanConfig.timeout : this.timeout,
      signal: cleanConfig.signal || undefined,
      retries: cleanConfig.retries !== undefined ? cleanConfig.retries : this.retries,
    };

    // Inject expect header
    if (activeExpect) {
      reqConfig.headers = injectExpectHeader(reqConfig.headers, activeExpect);
    }

    // 3. Run request interceptors
    try {
      reqConfig = await this.interceptors.runRequest(reqConfig);
    } catch (err) {
      this._stats.failures++;
      throw this._wrapError(err, reqConfig);
    }

    // 4. Transform outgoing body if needed
    if (reqConfig.body && typeof reqConfig.body === 'object' && this.autoAlign) {
      reqConfig.body = this.transformer.transform(
        reqConfig.body,
        this._schema,
        'toBackend',
      );
    }

    // 5. Execute with retry
    const maxRetries = reqConfig.retries || 0;
    let lastError;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const response = await this._executeRequest(reqConfig);

        // 6. Transform + align response
        let responseData = response.data;

        if (this._debug) {
          console.log('[api-bridge] Raw response:', JSON.stringify(responseData, null, 2));
          if (activeExpect) {
            console.log('[api-bridge] Expected schema:', JSON.stringify(activeExpect, null, 2));
          }
        }

        // Auto-align response data
        if (responseData && typeof responseData === 'object' && this.autoAlign) {
          // Check endpoint cache for pre-learned mappings
          const endpointKey = `${reqConfig.method}:${reqConfig.url}`;
          const cachedMapping = this._endpointCache.get(endpointKey);

          responseData = this.transformer.transform(
            responseData,
            activeExpect || this._schema,
            'toFrontend',
          );

          // Type coercion based on expect schema
          if (this.autoCoerce && expectMap) {
            responseData = this._coerceToExpect(responseData, expectMap);
          }

          // Cache the mapping for this endpoint
          if (!cachedMapping) {
            this._endpointCache.set(endpointKey, true);
            this._stats.cacheHits = 0;
          } else {
            this._stats.cacheHits++;
          }
        }

        // Smart Proxy mode
        if (this.proxyMode && responseData && typeof responseData === 'object') {
          responseData = smartProxy(responseData, {
            learningEngine: this.learning,
            fuzzyMatcher: this.fuzzyMatcher,
          });
        }

        if (this._debug) {
          console.log('[api-bridge] Transformed output:', JSON.stringify(responseData, null, 2));
        }

        // Build response object
        let result = {
          data: responseData,
          status: response.status,
          headers: response.headers,
        };

        if (this._debug) {
          result.raw = response.rawData;
        }

        // 7. Run response interceptors
        try {
          result = await this.interceptors.runResponse(result);
        } catch (err) {
          this._stats.failures++;
          throw this._wrapError(err, reqConfig);
        }

        this._stats.successes++;
        return result;
      } catch (err) {
        lastError = err;

        // Don't retry client errors (4xx except 408/429) or aborted requests
        if (err instanceof ClientError && err.code === 'ERR_ABORTED') {
          break;
        }
        if (err.status && err.status >= 400 && err.status < 500 &&
            !this.retryableStatuses.has(err.status)) {
          break;
        }
        // Don't retry if we've exhausted attempts
        if (attempt >= maxRetries) {
          break;
        }

        this._stats.retries++;
        const delay = this.retryDelay * Math.pow(2, attempt);
        const jitter = delay * 0.1 * Math.random();
        await new Promise(resolve => setTimeout(resolve, delay + jitter));
      }
    }

    this._stats.failures++;

    // Try error interceptors
    try {
      const recovered = await this.interceptors.runError(lastError);
      this._stats.successes++;
      return recovered;
    } catch {
      // Error interceptors didn't recover
    }

    throw this._wrapError(lastError, reqConfig);
  }

  // ─── Internal: Execute a single request ─────────────────────────────────

  async _executeRequest(reqConfig) {
    const fullURL = buildURL(this.baseURL, reqConfig.url, reqConfig.params);

    const fetchOptions = {
      method: reqConfig.method,
    };

    // Headers
    const headers = Object.assign({}, reqConfig.headers);

    // Body
    if (reqConfig.body !== undefined && reqConfig.method !== 'GET' && reqConfig.method !== 'HEAD') {
      if (typeof reqConfig.body === 'object') {
        headers['Content-Type'] = headers['Content-Type'] || 'application/json';
        fetchOptions.body = JSON.stringify(reqConfig.body);
      } else {
        fetchOptions.body = String(reqConfig.body);
      }
    }

    fetchOptions.headers = headers;

    // Timeout + AbortController
    let timeoutTimer = null;
    if (reqConfig.timeout > 0 || reqConfig.signal) {
      const { controller, timer } = createTimeoutController(
        reqConfig.timeout || 0,
        reqConfig.signal,
      );

      if (reqConfig.timeout > 0) {
        fetchOptions.signal = controller.signal;
        timeoutTimer = timer;
      } else if (reqConfig.signal) {
        fetchOptions.signal = reqConfig.signal;
      }
    }

    try {
      const res = await fetch(fullURL, fetchOptions);

      if (timeoutTimer) clearTimeout(timeoutTimer);

      // Parse response
      const contentType = res.headers.get('content-type') || '';
      let data;
      if (contentType.includes('application/json')) {
        data = await res.json();
      } else {
        const text = await res.text();
        try {
          data = JSON.parse(text);
        } catch {
          data = text;
        }
      }

      // Non-2xx → throw
      if (!res.ok) {
        throw new ClientError(
          `Request failed with status ${res.status}`,
          {
            status: res.status,
            code: `ERR_HTTP_${res.status}`,
            details: data,
          },
        );
      }

      // Collect response headers
      const resHeaders = {};
      res.headers.forEach((value, key) => {
        resHeaders[key] = value;
      });

      return {
        data,
        rawData: data,
        status: res.status,
        headers: resHeaders,
      };
    } catch (err) {
      if (timeoutTimer) clearTimeout(timeoutTimer);

      // Already a ClientError
      if (err instanceof ClientError) throw err;

      // Abort error
      if (err.name === 'AbortError') {
        throw new ClientError('Request aborted', {
          code: 'ERR_ABORTED',
          details: { url: fullURL },
        });
      }

      // Network error
      throw new ClientError(
        `Network error: ${err.message}`,
        {
          code: 'ERR_NETWORK',
          details: { url: fullURL, originalError: err.message },
        },
      );
    }
  }

  // ─── Type Coercion based on expect schema ───────────────────────────────

  _coerceToExpect(data, expectMap) {
    if (!data || typeof data !== 'object') return data;

    if (Array.isArray(data)) {
      return data.map(item => this._coerceToExpect(item, expectMap));
    }

    const result = {};
    for (const [key, value] of Object.entries(data)) {
      const expectedType = expectMap.get(key);
      if (expectedType && value !== null && value !== undefined) {
        result[key] = this._coerceValue(value, expectedType);
      } else if (typeof value === 'object' && value !== null) {
        result[key] = this._coerceToExpect(value, expectMap);
      } else {
        result[key] = value;
      }
    }
    return result;
  }

  _coerceValue(value, targetType) {
    switch (targetType) {
      case 'number': {
        if (typeof value === 'number') return value;
        const num = Number(value);
        return isNaN(num) ? value : num;
      }
      case 'string':
        return typeof value === 'string' ? value : String(value);
      case 'boolean': {
        if (typeof value === 'boolean') return value;
        if (typeof value === 'string') {
          const lower = value.toLowerCase();
          if (lower === 'true' || lower === '1' || lower === 'yes') return true;
          if (lower === 'false' || lower === '0' || lower === 'no') return false;
        }
        return Boolean(value);
      }
      case 'date': {
        if (value instanceof Date) return value;
        const d = new Date(value);
        return isNaN(d.getTime()) ? value : d;
      }
      default:
        return value;
    }
  }

  // ─── Error wrapping ─────────────────────────────────────────────────────

  _wrapError(err, reqConfig) {
    if (err instanceof ClientError) return err;
    return new ClientError(err.message || 'Unknown error', {
      status: err.status || null,
      code: err.code || 'ERR_UNKNOWN',
      details: {
        method: reqConfig ? reqConfig.method : undefined,
        url: reqConfig ? reqConfig.url : undefined,
      },
    });
  }

  // ─── Utilities ──────────────────────────────────────────────────────────

  /**
   * Get client statistics.
   */
  getStats() {
    return {
      ...this._stats,
      transformer: this.transformer.getStats(),
      learning: this.learning.getStats(),
    };
  }

  /**
   * Clear endpoint mapping cache.
   */
  clearCache() {
    this._endpointCache.clear();
    this._stats.cacheHits = 0;
  }

  /**
   * Reset client state.
   */
  reset() {
    this.clearCache();
    this.interceptors.clear();
    this.transformer.resetSession();
    this._stats = { requests: 0, successes: 0, failures: 0, retries: 0, cacheHits: 0 };
  }
}

// ─── Factory Function ───────────────────────────────────────────────────────

/**
 * Create a new API client instance.
 *
 * @param {object} [options={}] — Client options (see APIBridgeClient constructor)
 * @returns {APIBridgeClient}
 *
 * @example
 *   const api = createClient({ baseURL: "/api" });
 *   const res = await api.get("/user", { expect: { userName: "string" } });
 */
function createClient(options = {}) {
  return new APIBridgeClient(options);
}

module.exports = { APIBridgeClient, ClientError, createClient, buildURL };
