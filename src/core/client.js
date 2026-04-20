/**
 * APIBridge AI v15 — HTTP Client Engine (Full Axios Replacement + All APIBridge Features)
 *
 * A next-generation API client that fully replaces Axios with intelligent
 * data alignment, schema awareness, and enhanced performance/security.
 *
 * Features:
 *   - Built on native fetch (zero dependencies) with pluggable adapter system
 *   - Full Axios API compatibility (drop-in replacement)
 *   - GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS + postForm/putForm/patchForm
 *   - Headers, params, body (JSON, FormData, URLSearchParams, text, Buffer)
 *   - Timeouts via AbortController
 *   - CancelToken support (Axios-compatible) + AbortController
 *   - Retries with exponential backoff + jitter
 *   - Interceptor system (Axios-compatible) with runWhen + synchronous options
 *   - Per-request transformRequest / transformResponse with defaults
 *   - Basic auth support ({ username, password })
 *   - Custom responseType ('json', 'text', 'blob', 'arraybuffer', 'stream')
 *   - Custom validateStatus function
 *   - Custom paramsSerializer function (function or { encode, serialize } object)
 *   - maxContentLength / maxBodyLength enforcement
 *   - onDownloadProgress / onUploadProgress callbacks
 *   - getUri() method
 *   - Mutable defaults
 *   - Pluggable adapter system (fetch, xhr, custom)
 *   - Proxy configuration support
 *   - httpAgent / httpsAgent support
 *   - socketPath support
 *   - formSerializer options
 *   - env.FormData configuration
 *   - AxiosHeaders integration (with fromString, toJSON filters, convenience accessors)
 *   - Error response/request properties (full Axios error shape)
 *   - Default transform chains (JSON stringify/parse)
 *   - Auto Content-Type serialization (auto-convert body based on Content-Type)
 *   - beforeRedirect callback
 *   - Request correlation IDs (x-request-id)
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
 *
 *   // Axios-compatible:
 *   const api = createClient({ baseURL: "/api" });
 *   api.defaults.headers.common['Authorization'] = 'Bearer token';
 *   const res = await api.request({ method: 'get', url: '/user' });
 *
 *   // Form submissions:
 *   await api.postForm('/upload', { file: myFile, name: 'doc' });
 *
 *   // Adapter selection:
 *   const api = createClient({ adapter: 'xhr' });
 *
 *   // v15: Auto Content-Type serialization:
 *   api.post('/data', myObj, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
 *   // body is auto-converted to URLSearchParams
 *
 *   // v15: Enhanced paramsSerializer:
 *   const api = createClient({ paramsSerializer: { encode: encodeURIComponent, serialize: (params, opts) => qs.stringify(params) } });
 *
 *   // v15: beforeRedirect:
 *   api.get('/redirect', { beforeRedirect: (options, { headers }) => { options.headers['x-forwarded'] = 'true'; } });
 *
 *   // v15: Request correlation:
 *   const api = createClient({ requestId: true });
 *   // Every request gets an x-request-id header
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
const { isCancel } = require('./cancel');
const { isFormData, isURLSearchParams, isStream, isBuffer, isArrayBufferView, toFormData } = require('./form-data');
const { getAdapter } = require('./adapters');
const { isAbsoluteURL, combineURLs } = require('./url-utils');
const { AxiosHeaders } = require('./headers');
const { generateUID, isPlainObject } = require('./helpers');

/**
 * Library version.
 * @type {string}
 */
const VERSION = '15.0.0';

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
   * @param {object} [details.config]
   * @param {object} [details.response]
   * @param {object} [details.request]
   */
  constructor(message, details = {}) {
    super(message);
    this.name = 'ClientError';
    this.status = details.status || null;
    this.code = details.code || 'ERR_CLIENT';
    this.details = details.details || null;
    this.config = details.config || null;
    this.response = details.response || null;
    this.request = details.request || null;
    this.isApiBridgeError = true;
    this.isAxiosError = true;
  }

  toJSON() {
    return {
      message: this.message,
      name: this.name,
      status: this.status,
      code: this.code,
      details: this.details,
      config: this.config ? {
        method: this.config.method,
        url: this.config.url,
        baseURL: this.config.baseURL,
      } : null,
    };
  }
}

// ─── Standard Error Code Constants (Axios-compatible) ─────────────────────
ClientError.ERR_FR_TOO_MANY_REDIRECTS = 'ERR_FR_TOO_MANY_REDIRECTS';
ClientError.ERR_BAD_OPTION_VALUE = 'ERR_BAD_OPTION_VALUE';
ClientError.ERR_BAD_OPTION = 'ERR_BAD_OPTION';
ClientError.ERR_NETWORK = 'ERR_NETWORK';
ClientError.ERR_DEPRECATED = 'ERR_DEPRECATED';
ClientError.ERR_BAD_RESPONSE = 'ERR_BAD_RESPONSE';
ClientError.ERR_BAD_REQUEST = 'ERR_BAD_REQUEST';
ClientError.ERR_CANCELED = 'ERR_CANCELED';
ClientError.ERR_NOT_SUPPORT = 'ERR_NOT_SUPPORT';
ClientError.ERR_INVALID_URL = 'ERR_INVALID_URL';
ClientError.ECONNABORTED = 'ECONNABORTED';
ClientError.ETIMEDOUT = 'ETIMEDOUT';
ClientError.ERR_TIMEOUT = 'ERR_TIMEOUT';
ClientError.ERR_MAX_BODY_LENGTH_EXCEEDED = 'ERR_MAX_BODY_LENGTH_EXCEEDED';
ClientError.ERR_MAX_CONTENT_LENGTH_EXCEEDED = 'ERR_MAX_CONTENT_LENGTH_EXCEEDED';
ClientError.ERR_ABORTED = 'ERR_ABORTED';

/**
 * Create a ClientError with full context (like AxiosError.from).
 *
 * @param {Error} error — Source error
 * @param {string} [code] — Error code
 * @param {object} [config] — Request config
 * @param {object} [request] — Request object
 * @param {object} [response] — Response object
 * @returns {ClientError}
 */
ClientError.from = function from(error, code, config, request, response) {
  const err = new ClientError(
    error.message,
    {
      status: response ? response.status : null,
      code: code || error.code || 'ERR_CLIENT',
      details: response ? response.data : null,
      config,
      request,
      response,
    },
  );
  err.cause = error;
  return err;
};

// ─── Helpers ────────────────────────────────────────────────────────────────

/**
 * Default params serializer.
 * @param {object} params
 * @param {object} [options] — Optional encode/serialize options (v15)
 * @returns {string}
 */
function defaultParamsSerializer(params, options) {
  if (!params || typeof params !== 'object') return '';
  if (isURLSearchParams(params)) return params.toString();

  const encode = (options && typeof options.encode === 'function')
    ? options.encode
    : encodeURIComponent;

  const entries = Object.entries(params).filter(([, v]) => v !== undefined && v !== null);
  if (entries.length === 0) return '';
  return entries
    .map(([k, v]) => {
      if (Array.isArray(v)) {
        return v
          .map(item => `${encode(k)}=${encode(String(item))}`)
          .join('&');
      }
      return `${encode(k)}=${encode(String(v))}`;
    })
    .join('&');
}

/**
 * Resolve a paramsSerializer config into a serializer function.
 * Supports:
 *   - Function (legacy Axios): (params) => string
 *   - Object with { serialize, encode } (newer Axios): { serialize: (params, options) => string, encode: fn }
 *
 * @param {Function|object|null} serializer
 * @returns {Function|null}
 */
function resolveParamsSerializer(serializer) {
  if (!serializer) return null;
  if (typeof serializer === 'function') return serializer;
  if (typeof serializer === 'object') {
    if (typeof serializer.serialize === 'function') {
      return (params) => serializer.serialize(params, serializer);
    }
    // Object with only `encode` — use default serializer with custom encode
    if (typeof serializer.encode === 'function') {
      return (params) => defaultParamsSerializer(params, { encode: serializer.encode });
    }
  }
  return null;
}

/**
 * Build a full URL from base + path + params.
 *
 * @param {string} baseURL
 * @param {string} path
 * @param {object} [params]
 * @param {Function} [paramsSerializer] — Custom params serializer
 * @returns {string}
 */
function buildURL(baseURL, path, params, paramsSerializer) {
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
    const resolved = resolveParamsSerializer(paramsSerializer);
    const serializer = resolved || defaultParamsSerializer;
    const queryString = serializer(params);
    if (queryString) {
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

// ─── Merge Utility ──────────────────────────────────────────────────────────

/**
 * Deep merge two config objects (like Axios mergeConfig).
 * Later values override earlier ones. Arrays are replaced, not merged.
 *
 * @param {object} target
 * @param {object} source
 * @returns {object}
 */
function mergeConfig(target, source) {
  const result = {};
  const allKeys = new Set([...Object.keys(target || {}), ...Object.keys(source || {})]);

  for (const key of allKeys) {
    const tVal = target ? target[key] : undefined;
    const sVal = source ? source[key] : undefined;

    if (sVal === undefined) {
      result[key] = tVal;
    } else if (tVal === undefined) {
      result[key] = sVal;
    } else if (
      typeof tVal === 'object' && tVal !== null && !Array.isArray(tVal) &&
      typeof sVal === 'object' && sVal !== null && !Array.isArray(sVal)
    ) {
      result[key] = mergeConfig(tVal, sVal);
    } else {
      result[key] = sVal;
    }
  }
  return result;
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
   * @param {object} [options.auth] — Basic auth { username, password }
   * @param {string} [options.responseType='json'] — Default response type ('json','text','blob','arraybuffer','stream')
   * @param {Function} [options.validateStatus] — Custom status validation function
   * @param {Function} [options.paramsSerializer] — Custom params serializer
   * @param {number} [options.maxContentLength=-1] — Max response content length (-1 = unlimited)
   * @param {number} [options.maxBodyLength=-1] — Max request body length (-1 = unlimited)
   * @param {Array<Function>} [options.transformRequest] — Default request transform chain
   * @param {Array<Function>} [options.transformResponse] — Default response transform chain
   * @param {string} [options.responseEncoding='utf8'] — Response encoding
   * @param {number} [options.maxRedirects=5] — Max redirects (for reference, fetch handles this natively)
   * @param {boolean} [options.decompress=true] — Auto decompress response
   * @param {string} [options.xsrfCookieName='XSRF-TOKEN'] — XSRF cookie name
   * @param {string} [options.xsrfHeaderName='X-XSRF-TOKEN'] — XSRF header name
   * @param {boolean} [options.withCredentials=false] — Include credentials
   * @param {string|Function|string[]} [options.adapter] — Adapter to use ('fetch', 'xhr', custom fn, or priority list)
   * @param {object} [options.proxy] — Proxy configuration { host, port, auth, protocol }
   * @param {*} [options.httpAgent] — Custom HTTP agent (for Node.js)
   * @param {*} [options.httpsAgent] — Custom HTTPS agent (for Node.js)
   * @param {string} [options.socketPath] — Unix domain socket path
   * @param {object} [options.formSerializer] — Custom form serialization options
   * @param {object} [options.env] — Environment configuration { FormData }
   * @param {string} [options.signal] — AbortSignal
   * @param {boolean|string} [options.requestId=false] — Auto-generate x-request-id headers (v15)
   * @param {Function} [options.beforeRedirect] — Callback before redirect (v15)
   * @param {boolean} [options.autoContentType=true] — Auto Content-Type body serialization (v15)
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

    // ─── v10: Axios-compatible options ─────────────────────────────
    this.auth = options.auth || null;
    this.responseType = options.responseType || 'json';
    this.validateStatus = options.validateStatus || ((status) => status >= 200 && status < 300);
    this.paramsSerializer = options.paramsSerializer || null;
    this.maxContentLength = typeof options.maxContentLength === 'number' ? options.maxContentLength : -1;
    this.maxBodyLength = typeof options.maxBodyLength === 'number' ? options.maxBodyLength : -1;
    this.transformRequest = options.transformRequest || [
      function defaultTransformRequest(data, headers) {
        if (data === null || data === undefined) return data;
        if (isFormData(data) || isURLSearchParams(data) || isStream(data) ||
            isBuffer(data) || isArrayBufferView(data) || typeof data === 'string') {
          return data;
        }
        if (typeof data === 'object') {
          if (headers && !headers['Content-Type'] && !headers['content-type']) {
            headers['Content-Type'] = 'application/json';
          }
          return JSON.stringify(data);
        }
        return data;
      },
    ];
    this.transformResponse = options.transformResponse || [
      function defaultTransformResponse(data) {
        if (typeof data === 'string') {
          try {
            return JSON.parse(data);
          } catch {
            return data;
          }
        }
        return data;
      },
    ];
    this.responseEncoding = options.responseEncoding || 'utf8';
    this.maxRedirects = typeof options.maxRedirects === 'number' ? options.maxRedirects : 5;
    this.decompress = options.decompress !== false;
    this.xsrfCookieName = options.xsrfCookieName || 'XSRF-TOKEN';
    this.xsrfHeaderName = options.xsrfHeaderName || 'X-XSRF-TOKEN';
    this.withCredentials = options.withCredentials || false;

    // ─── v11: New Axios-compatible options ─────────────────────────
    this.adapter = options.adapter || null;
    this.proxy = options.proxy || null;
    this.httpAgent = options.httpAgent || null;
    this.httpsAgent = options.httpsAgent || null;
    this.socketPath = options.socketPath || null;
    this.formSerializer = options.formSerializer || null;
    this.env = options.env || { FormData: typeof FormData !== 'undefined' ? FormData : undefined };
    this.signal = options.signal || null;

    // ─── v12: Transitional behavior options ───────────────────────
    this.transitional = options.transitional || {
      silentJSONParsing: true,
      forcedJSONParsing: true,
      clarifyTimeoutError: false,
    };

    // ─── v13: New Axios-compatible options ─────────────────────────
    this.maxRate = options.maxRate || null;
    this.lookup = options.lookup || null;

    // ─── v14: Auto-Retry Engine, Caching, Dedup, Token Refresh, Timing, Hooks ──
    this.retryConfig = options.retryConfig || null;
    this.cache = options.cache || null;
    this.dedupe = options.dedupe || null;
    this.tokenRefresh = options.tokenRefresh || null;
    this.timing = options.timing !== undefined ? options.timing : false;
    this.hooks = options.hooks || null;

    // ─── v15: Full Axios Replacement — new options ────────────────
    this.requestId = options.requestId !== undefined ? options.requestId : false;
    this.beforeRedirect = options.beforeRedirect || null;
    this.autoContentType = options.autoContentType !== false; // default true

    // v14: Internal state for caching, dedup, and token refresh
    this._responseCache = new Map();
    this._inflightRequests = new Map();
    this._isRefreshing = false;
    this._refreshQueue = [];

    // ─── Mutable defaults object (Axios-compatible) ───────────────
    this.defaults = {
      baseURL: this.baseURL,
      timeout: this.timeout,
      headers: {
        common: Object.assign({}, this.defaultHeaders),
        get: {},
        post: { 'Content-Type': 'application/json' },
        put: { 'Content-Type': 'application/json' },
        patch: { 'Content-Type': 'application/json' },
        delete: {},
        head: {},
        options: {},
      },
      responseType: this.responseType,
      validateStatus: this.validateStatus,
      paramsSerializer: this.paramsSerializer,
      maxContentLength: this.maxContentLength,
      maxBodyLength: this.maxBodyLength,
      transformRequest: this.transformRequest,
      transformResponse: this.transformResponse,
      xsrfCookieName: this.xsrfCookieName,
      xsrfHeaderName: this.xsrfHeaderName,
      withCredentials: this.withCredentials,
      auth: this.auth,
      // v11: New defaults
      adapter: this.adapter,
      proxy: this.proxy,
      httpAgent: this.httpAgent,
      httpsAgent: this.httpsAgent,
      socketPath: this.socketPath,
      formSerializer: this.formSerializer,
      env: this.env,
      maxRedirects: this.maxRedirects,
      decompress: this.decompress,
      responseEncoding: this.responseEncoding,
      // v12: Transitional + signal
      transitional: this.transitional,
      signal: this.signal,
      // v13: New defaults
      maxRate: this.maxRate,
      lookup: this.lookup,
      // v14: New defaults
      retryConfig: this.retryConfig,
      cache: this.cache,
      dedupe: this.dedupe,
      tokenRefresh: this.tokenRefresh,
      timing: this.timing,
      hooks: this.hooks,
      // v15: New defaults
      requestId: this.requestId,
      beforeRedirect: this.beforeRedirect,
      autoContentType: this.autoContentType,
    };

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
   * Axios-compatible request method. Accepts either:
   *   - request(config) — config object with method, url, data, etc.
   *   - request(method, url, body, config) — positional args (v9 compat)
   *
   * @param {string|object} methodOrConfig — HTTP method string or config object
   * @param {string} [url] — URL path
   * @param {*} [body] — Request body
   * @param {object} [config={}] — Request config
   * @returns {Promise<{data: *, status: number, statusText: string, headers: object, config: object, raw?: *}>}
   */
  request(methodOrConfig, url, body, config) {
    // Support axios-style: request({ method, url, data, ... })
    if (typeof methodOrConfig === 'object' && methodOrConfig !== null) {
      const cfg = methodOrConfig;
      return this._doRequest(
        (cfg.method || 'GET').toUpperCase(),
        cfg.url || '',
        cfg.data !== undefined ? cfg.data : cfg.body,
        cfg,
      );
    }
    // Support axios-style: request(url, config)
    if (typeof methodOrConfig === 'string' && (url === undefined || (typeof url === 'object' && url !== null))) {
      const cfg = url || {};
      if (!cfg.method) {
        // It's request(url, config) pattern
        return this._doRequest(
          (cfg.method || 'GET').toUpperCase(),
          methodOrConfig,
          cfg.data !== undefined ? cfg.data : cfg.body,
          cfg,
        );
      }
    }
    // Original v9 positional args: request(method, url, body, config)
    return this._doRequest(
      (methodOrConfig || 'GET').toUpperCase(),
      url || '',
      body,
      config || {},
    );
  }

  /**
   * @param {string} url
   * @param {object} [config={}]
   * @returns {Promise<object>}
   */
  get(url, config) {
    return this._doRequest('GET', url, undefined, config);
  }

  /**
   * @param {string} url
   * @param {*} [body]
   * @param {object} [config={}]
   * @returns {Promise<object>}
   */
  post(url, body, config) {
    return this._doRequest('POST', url, body, config);
  }

  /**
   * @param {string} url
   * @param {*} [body]
   * @param {object} [config={}]
   * @returns {Promise<object>}
   */
  put(url, body, config) {
    return this._doRequest('PUT', url, body, config);
  }

  /**
   * @param {string} url
   * @param {*} [body]
   * @param {object} [config={}]
   * @returns {Promise<object>}
   */
  patch(url, body, config) {
    return this._doRequest('PATCH', url, body, config);
  }

  /**
   * @param {string} url
   * @param {object} [config={}]
   * @returns {Promise<object>}
   */
  delete(url, config) {
    // Axios-compatible: delete(url, { data: body }) sends a body
    const body = config && config.data !== undefined ? config.data : undefined;
    return this._doRequest('DELETE', url, body, config);
  }

  /**
   * @param {string} url
   * @param {object} [config={}]
   * @returns {Promise<object>}
   */
  head(url, config) {
    return this._doRequest('HEAD', url, undefined, config);
  }

  /**
   * @param {string} url
   * @param {object} [config={}]
   * @returns {Promise<object>}
   */
  options(url, config) {
    return this._doRequest('OPTIONS', url, undefined, config);
  }

  // ─── Form Submission Methods (v11) ────────────────────────────────────

  /**
   * POST with FormData (like axios.postForm).
   * Auto-converts plain objects to FormData.
   *
   * @param {string} url
   * @param {*} [data]
   * @param {object} [config={}]
   * @returns {Promise<object>}
   */
  postForm(url, data, config) {
    return this._doRequest('POST', url, data, {
      ...config,
      headers: {
        ...(config && config.headers),
        'Content-Type': 'multipart/form-data',
      },
      _formSubmission: true,
    });
  }

  /**
   * PUT with FormData (like axios.putForm).
   *
   * @param {string} url
   * @param {*} [data]
   * @param {object} [config={}]
   * @returns {Promise<object>}
   */
  putForm(url, data, config) {
    return this._doRequest('PUT', url, data, {
      ...config,
      headers: {
        ...(config && config.headers),
        'Content-Type': 'multipart/form-data',
      },
      _formSubmission: true,
    });
  }

  /**
   * PATCH with FormData (like axios.patchForm).
   *
   * @param {string} url
   * @param {*} [data]
   * @param {object} [config={}]
   * @returns {Promise<object>}
   */
  patchForm(url, data, config) {
    return this._doRequest('PATCH', url, data, {
      ...config,
      headers: {
        ...(config && config.headers),
        'Content-Type': 'multipart/form-data',
      },
      _formSubmission: true,
    });
  }

  // ─── getUri — Build URL without making a request ────────────────────────

  /**
   * Build and return the URL that would be used for the given config,
   * without actually making a request.
   *
   * @param {object} [config={}]
   * @returns {string}
   */
  getUri(config = {}) {
    const base = config.baseURL || this.defaults.baseURL || this.baseURL;
    const url = config.url || '';
    const params = config.params || undefined;
    const serializer = config.paramsSerializer || this.defaults.paramsSerializer || this.paramsSerializer;
    return buildURL(base, url, params, serializer);
  }

  // ─── v14: Response Cache Management ──────────────────────────────────────

  /**
   * Clear the response cache.
   */
  clearResponseCache() {
    this._responseCache.clear();
  }

  // ─── v14: Internal Helpers ──────────────────────────────────────────────

  /**
   * Fire lifecycle hooks (fire-and-forget, errors are swallowed).
   * @param {string} hookName
   * @param  {...any} args
   */
  _fireHooks(hookName, ...args) {
    const hooks = this.hooks || this.defaults.hooks;
    if (!hooks || !hooks[hookName]) return;
    const fns = Array.isArray(hooks[hookName]) ? hooks[hookName] : [hooks[hookName]];
    for (const fn of fns) {
      if (typeof fn === 'function') {
        try { fn(...args); } catch (_) { /* hooks are fire-and-forget */ }
      }
    }
  }

  /**
   * Generate a cache key for a request config.
   * @param {object} reqConfig
   * @param {object} cacheConfig
   * @returns {string}
   */
  _generateCacheKey(reqConfig, cacheConfig) {
    if (cacheConfig.keyGenerator && typeof cacheConfig.keyGenerator === 'function') {
      return cacheConfig.keyGenerator(reqConfig);
    }
    const params = reqConfig.params ? JSON.stringify(reqConfig.params) : '';
    return `${reqConfig.method}:${reqConfig.url}:${params}`;
  }

  /**
   * Generate a dedup key for a request config.
   * @param {object} reqConfig
   * @param {object} dedupeConfig
   * @returns {string}
   */
  _generateDedupKey(reqConfig, dedupeConfig) {
    if (dedupeConfig.keyGenerator && typeof dedupeConfig.keyGenerator === 'function') {
      return dedupeConfig.keyGenerator(reqConfig);
    }
    const params = reqConfig.params ? JSON.stringify(reqConfig.params) : '';
    return `${reqConfig.method}:${reqConfig.url}:${params}`;
  }

  /**
   * Check if a URL matches any exclusion patterns.
   * @param {string} url
   * @param {string[]} excludePatterns
   * @returns {boolean}
   */
  _isExcludedFromCache(url, excludePatterns) {
    if (!excludePatterns || excludePatterns.length === 0) return false;
    for (const pattern of excludePatterns) {
      if (url.includes(pattern)) return true;
    }
    return false;
  }

  /**
   * Evict oldest cache entry if maxSize is exceeded.
   * @param {number} maxSize
   */
  _evictCacheIfNeeded(maxSize) {
    if (maxSize > 0 && this._responseCache.size >= maxSize) {
      const oldestKey = this._responseCache.keys().next().value;
      this._responseCache.delete(oldestKey);
    }
  }

  // ─── Core Request ───────────────────────────────────────────────────────

  /**
   * Execute an HTTP request with full pipeline.
   *
   * @param {string} method — HTTP method
   * @param {string} url — URL path (relative to baseURL or absolute)
   * @param {*} [body] — Request body
   * @param {object} [config={}] — Request config (headers, params, expect, timeout, signal, auth, responseType, etc.)
   * @returns {Promise<{data: *, status: number, statusText: string, headers: object, config: object, raw?: *}>}
   */
  async _doRequest(method, url, body, config = {}) {
    this._stats.requests++;

    // 1. Extract expect schema from config
    const { config: cleanConfig, expect: expectSchema, error: expectError } = extractExpect(config);
    if (expectError && this._debug) {
      console.warn('[api-bridge] Expect schema warning:', expectError);
    }

    // Use per-request expect, or fall back to global schema
    const activeExpect = expectSchema || this._schema;
    const expectMap = activeExpect ? flattenExpect(activeExpect) : null;

    // 2. Build request config — merge defaults + instance + per-request
    const methodLower = method.toLowerCase();
    const methodHeaders = this.defaults.headers[methodLower] || {};
    const commonHeaders = this.defaults.headers.common || {};
    const mergedHeaders = Object.assign(
      {},
      commonHeaders,
      methodHeaders,
      this.defaultHeaders,
      cleanConfig.headers || {},
    );

    let reqConfig = {
      method: method.toUpperCase(),
      url,
      body: body !== undefined ? body : (cleanConfig.data !== undefined ? cleanConfig.data : undefined),
      headers: mergedHeaders,
      params: cleanConfig.params || undefined,
      timeout: cleanConfig.timeout !== undefined ? cleanConfig.timeout : this.defaults.timeout || this.timeout,
      signal: cleanConfig.signal || undefined,
      retries: cleanConfig.retries !== undefined ? cleanConfig.retries : this.retries,
      // v10: New options
      auth: cleanConfig.auth || this.defaults.auth || this.auth,
      responseType: cleanConfig.responseType || this.defaults.responseType || this.responseType || 'json',
      validateStatus: cleanConfig.validateStatus || this.defaults.validateStatus || this.validateStatus,
      paramsSerializer: cleanConfig.paramsSerializer || this.defaults.paramsSerializer || this.paramsSerializer,
      maxContentLength: cleanConfig.maxContentLength !== undefined ? cleanConfig.maxContentLength : this.defaults.maxContentLength,
      maxBodyLength: cleanConfig.maxBodyLength !== undefined ? cleanConfig.maxBodyLength : this.defaults.maxBodyLength,
      transformRequest: cleanConfig.transformRequest || this.defaults.transformRequest || this.transformRequest,
      transformResponse: cleanConfig.transformResponse || this.defaults.transformResponse || this.transformResponse,
      cancelToken: cleanConfig.cancelToken || undefined,
      onDownloadProgress: cleanConfig.onDownloadProgress || undefined,
      onUploadProgress: cleanConfig.onUploadProgress || undefined,
      withCredentials: cleanConfig.withCredentials !== undefined ? cleanConfig.withCredentials : this.defaults.withCredentials,
      baseURL: cleanConfig.baseURL || this.defaults.baseURL || this.baseURL,
      // v11: New options
      adapter: cleanConfig.adapter || this.defaults.adapter || this.adapter,
      proxy: cleanConfig.proxy || this.defaults.proxy || this.proxy,
      httpAgent: cleanConfig.httpAgent || this.defaults.httpAgent || this.httpAgent,
      httpsAgent: cleanConfig.httpsAgent || this.defaults.httpsAgent || this.httpsAgent,
      socketPath: cleanConfig.socketPath || this.defaults.socketPath || this.socketPath,
      formSerializer: cleanConfig.formSerializer || this.defaults.formSerializer || this.formSerializer,
      env: cleanConfig.env || this.defaults.env || this.env,
      _formSubmission: cleanConfig._formSubmission || false,
      // v14: Per-request retryConfig
      retryConfig: cleanConfig.retryConfig || this.defaults.retryConfig || this.retryConfig,
      // v15: Per-request options
      beforeRedirect: cleanConfig.beforeRedirect || this.defaults.beforeRedirect || this.beforeRedirect,
    };

    // v15: Inject request correlation ID
    const requestIdSetting = cleanConfig.requestId !== undefined
      ? cleanConfig.requestId
      : (this.defaults.requestId !== undefined ? this.defaults.requestId : this.requestId);
    if (requestIdSetting) {
      const headerName = typeof requestIdSetting === 'string' ? requestIdSetting : 'x-request-id';
      if (!reqConfig.headers[headerName] && !reqConfig.headers[headerName.toLowerCase()]) {
        reqConfig.headers[headerName] = generateUID(16);
      }
    }

    // Inject expect header
    if (activeExpect) {
      reqConfig.headers = injectExpectHeader(reqConfig.headers, activeExpect);
    }

    // Inject Basic Auth header
    if (reqConfig.auth && reqConfig.auth.username) {
      const username = reqConfig.auth.username || '';
      const password = reqConfig.auth.password || '';
      const encoded = typeof Buffer !== 'undefined'
        ? Buffer.from(`${username}:${password}`, 'utf8').toString('base64')
        : btoa(`${username}:${password}`);
      reqConfig.headers['Authorization'] = `Basic ${encoded}`;
    }

    // 3. Run request interceptors
    try {
      reqConfig = await this.interceptors.runRequest(reqConfig);
    } catch (err) {
      this._stats.failures++;
      throw this._wrapError(err, reqConfig);
    }

    // 3.5. Form submission: convert plain object to FormData (v11)
    if (reqConfig._formSubmission && reqConfig.body && typeof reqConfig.body === 'object' &&
        !isFormData(reqConfig.body) && !isURLSearchParams(reqConfig.body)) {
      try {
        reqConfig.body = toFormData(reqConfig.body);
      } catch {
        // FormData not available — leave as-is
      }
    }

    // 3.6 v15: Auto Content-Type serialization
    // When body is a plain object, auto-serialize based on Content-Type header
    const autoContentTypeSetting = this.autoContentType !== false && this.defaults.autoContentType !== false;
    if (autoContentTypeSetting && reqConfig.body && typeof reqConfig.body === 'object' &&
        !isFormData(reqConfig.body) && !isURLSearchParams(reqConfig.body) &&
        !isBuffer(reqConfig.body) && !isArrayBufferView(reqConfig.body) &&
        !isStream(reqConfig.body) && !reqConfig._formSubmission) {
      const ct = (reqConfig.headers && (
        reqConfig.headers['Content-Type'] || reqConfig.headers['content-type'] || ''
      )) || '';
      const ctLower = ct.toLowerCase();
      if (ctLower.includes('application/x-www-form-urlencoded')) {
        // Auto-convert plain object to URLSearchParams
        if (isPlainObject(reqConfig.body)) {
          const encoded = new URLSearchParams();
          for (const [key, val] of Object.entries(reqConfig.body)) {
            if (val !== undefined && val !== null) {
              encoded.append(key, String(val));
            }
          }
          reqConfig.body = encoded;
        }
      } else if (ctLower.includes('multipart/form-data')) {
        // Auto-convert plain object to FormData
        if (isPlainObject(reqConfig.body)) {
          try {
            reqConfig.body = toFormData(reqConfig.body);
            // Remove Content-Type header — let the runtime set it with boundary
            delete reqConfig.headers['Content-Type'];
            delete reqConfig.headers['content-type'];
          } catch {
            // FormData not available — leave as-is
          }
        }
      }
    }

    // 4. Run per-request transformRequest chain
    if (reqConfig.transformRequest && reqConfig.body !== undefined) {
      const transforms = Array.isArray(reqConfig.transformRequest)
        ? reqConfig.transformRequest
        : [reqConfig.transformRequest];
      for (const fn of transforms) {
        if (typeof fn === 'function') {
          reqConfig.body = fn(reqConfig.body, reqConfig.headers);
        }
      }
    }

    // 5. Transform outgoing body if needed (APIBridge auto-align)
    if (reqConfig.body && typeof reqConfig.body === 'object' &&
        !isFormData(reqConfig.body) && !isURLSearchParams(reqConfig.body) &&
        !isBuffer(reqConfig.body) && !isArrayBufferView(reqConfig.body) &&
        !isStream(reqConfig.body) &&
        this.autoAlign) {
      reqConfig.body = this.transformer.transform(
        reqConfig.body,
        this._schema,
        'toBackend',
      );
    }

    // 6. Enforce maxBodyLength
    if (reqConfig.maxBodyLength > 0 && reqConfig.body) {
      let bodySize = 0;
      if (typeof reqConfig.body === 'string') {
        bodySize = typeof Buffer !== 'undefined'
          ? Buffer.byteLength(reqConfig.body)
          : new TextEncoder().encode(reqConfig.body).length;
      } else if (typeof reqConfig.body === 'object' && !isFormData(reqConfig.body)) {
        const serialized = JSON.stringify(reqConfig.body);
        bodySize = typeof Buffer !== 'undefined'
          ? Buffer.byteLength(serialized)
          : new TextEncoder().encode(serialized).length;
      }
      if (bodySize > reqConfig.maxBodyLength) {
        this._stats.failures++;
        throw new ClientError(
          `Request body size ${bodySize} exceeds maxBodyLength ${reqConfig.maxBodyLength}`,
          { code: 'ERR_MAX_BODY_LENGTH_EXCEEDED', details: { size: bodySize, limit: reqConfig.maxBodyLength } },
        );
      }
    }

    // Check CancelToken before starting
    if (reqConfig.cancelToken && reqConfig.cancelToken.requested) {
      this._stats.failures++;
      throw reqConfig.cancelToken.reason;
    }

    // v14: Fire onRequest hooks
    this._fireHooks('onRequest', reqConfig);

    // v14: Request timing — record start time
    const requestStartTime = Date.now();

    // v14: Response caching — check cache before executing
    const cacheConfig = this.cache || this.defaults.cache;
    if (cacheConfig && cacheConfig.ttl > 0) {
      const cacheMethods = (cacheConfig.methods || ['GET']).map(m => m.toUpperCase());
      if (cacheMethods.includes(reqConfig.method.toUpperCase()) &&
          !this._isExcludedFromCache(reqConfig.url, cacheConfig.exclude)) {
        const cacheKey = this._generateCacheKey(reqConfig, cacheConfig);
        const cached = this._responseCache.get(cacheKey);
        if (cached) {
          const age = Date.now() - cached.timestamp;
          if (age < cacheConfig.ttl) {
            // Cache hit — return cached response
            this._stats.successes++;
            return cached.response;
          } else if (cacheConfig.staleWhileRevalidate) {
            // Serve stale and revalidate in background
            this._doRequestCore(reqConfig, activeExpect, expectMap, requestStartTime, true).then(freshResponse => {
              this._evictCacheIfNeeded(cacheConfig.maxSize || 100);
              this._responseCache.set(cacheKey, { response: freshResponse, timestamp: Date.now() });
            }).catch(() => { /* background revalidation failed — keep stale */ });
            this._stats.successes++;
            return cached.response;
          } else {
            // Stale — remove from cache
            this._responseCache.delete(cacheKey);
          }
        }
      }
    }

    // v14: Request deduplication
    const dedupeConfig = this.dedupe || this.defaults.dedupe;
    if (dedupeConfig && dedupeConfig.enabled) {
      const dedupMethods = (dedupeConfig.methods || ['GET']).map(m => m.toUpperCase());
      if (dedupMethods.includes(reqConfig.method.toUpperCase())) {
        const dedupKey = this._generateDedupKey(reqConfig, dedupeConfig);
        const inflight = this._inflightRequests.get(dedupKey);
        if (inflight) {
          return inflight;
        }
        const requestPromise = this._doRequestCore(reqConfig, activeExpect, expectMap, requestStartTime, false)
          .finally(() => {
            this._inflightRequests.delete(dedupKey);
          });
        this._inflightRequests.set(dedupKey, requestPromise);
        return requestPromise;
      }
    }

    return this._doRequestCore(reqConfig, activeExpect, expectMap, requestStartTime, false);
  }

  /**
   * Core request execution with retry loop, caching, token refresh, timing, and hooks.
   * @private
   */
  async _doRequestCore(reqConfig, activeExpect, expectMap, requestStartTime, isBackgroundRevalidation) {
    // Resolve retryConfig
    const retryConf = reqConfig.retryConfig || this.retryConfig || this.defaults.retryConfig;
    const maxRetries = retryConf ? (retryConf.retries !== undefined ? retryConf.retries : (reqConfig.retries || 0)) : (reqConfig.retries || 0);

    // Token refresh config
    const tokenRefreshConfig = this.tokenRefresh || this.defaults.tokenRefresh;
    let tokenRefreshAttempts = 0;
    const maxTokenRefreshRetries = tokenRefreshConfig ? (tokenRefreshConfig.maxRetries !== undefined ? tokenRefreshConfig.maxRetries : 1) : 0;

    let lastError;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        // v14: Reset timeout per retry if configured
        if (retryConf && retryConf.shouldResetTimeout && attempt > 0) {
          reqConfig.signal = undefined;
        }

        const response = await this._executeRequest(reqConfig);

        // 8. Transform + align response
        let responseData = response.data;

        if (this._debug) {
          console.log('[api-bridge] Raw response:', JSON.stringify(responseData, null, 2));
          if (activeExpect) {
            console.log('[api-bridge] Expected schema:', JSON.stringify(activeExpect, null, 2));
          }
        }

        // Run per-request transformResponse chain
        if (reqConfig.transformResponse) {
          const transforms = Array.isArray(reqConfig.transformResponse)
            ? reqConfig.transformResponse
            : [reqConfig.transformResponse];
          for (const fn of transforms) {
            if (typeof fn === 'function') {
              responseData = fn(responseData);
            }
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

        // Build response object (Axios-compatible shape)
        // v13: Wrap headers in AxiosHeaders, add request property, add data alias in config
        const responseHeaders = response.headers instanceof AxiosHeaders
          ? response.headers
          : new AxiosHeaders(response.headers);

        // Build a config object with `data` alias (Axios uses data, not body)
        const responseConfig = Object.assign({}, reqConfig);
        if (responseConfig.body !== undefined && responseConfig.data === undefined) {
          responseConfig.data = responseConfig.body;
        }

        let result = {
          data: responseData,
          status: response.status,
          statusText: response.statusText || '',
          headers: responseHeaders,
          config: responseConfig,
          request: response.request || {},
        };

        // v14: Add timing info
        const timingEnabled = this.timing || this.defaults.timing;
        if (timingEnabled) {
          const endTime = Date.now();
          const duration = endTime - requestStartTime;
          result.duration = duration;
          result.timing = {
            start: requestStartTime,
            end: endTime,
            duration,
          };
        }

        if (this._debug) {
          result.raw = response.rawData;
        }

        // 9. Run response interceptors
        try {
          result = await this.interceptors.runResponse(result);
        } catch (err) {
          this._stats.failures++;
          throw this._wrapError(err, reqConfig);
        }

        // v14: Fire onResponse hooks
        this._fireHooks('onResponse', result);

        this._stats.successes++;

        // v14: Store in response cache if applicable
        if (!isBackgroundRevalidation) {
          const cacheConfig = this.cache || this.defaults.cache;
          if (cacheConfig && cacheConfig.ttl > 0) {
            const cacheMethods = (cacheConfig.methods || ['GET']).map(m => m.toUpperCase());
            if (cacheMethods.includes(reqConfig.method.toUpperCase()) &&
                !this._isExcludedFromCache(reqConfig.url, cacheConfig.exclude)) {
              const cacheKey = this._generateCacheKey(reqConfig, cacheConfig);
              this._evictCacheIfNeeded(cacheConfig.maxSize || 100);
              this._responseCache.set(cacheKey, { response: result, timestamp: Date.now() });
            }
          }
        }

        return result;
      } catch (err) {
        lastError = err;

        // v14: Fire onError hooks
        this._fireHooks('onError', err);

        // Don't retry cancelled requests
        if (isCancel(err)) break;

        // Don't retry client errors (4xx except 408/429) or aborted requests
        if (err instanceof ClientError && err.code === 'ERR_ABORTED') {
          break;
        }
        if (err instanceof ClientError && err.code === 'ERR_MAX_BODY_LENGTH_EXCEEDED') {
          break;
        }
        if (err instanceof ClientError && err.code === 'ERR_MAX_CONTENT_LENGTH_EXCEEDED') {
          break;
        }

        // v14: Token refresh — handle 401 or configured status codes
        if (tokenRefreshConfig && tokenRefreshConfig.onRefresh && tokenRefreshAttempts < maxTokenRefreshRetries) {
          const triggerStatuses = tokenRefreshConfig.statusCodes || [401];
          if (err.status && triggerStatuses.includes(err.status)) {
            tokenRefreshAttempts++;
            try {
              let newToken;
              if (this._isRefreshing) {
                // Wait for the current refresh to complete
                newToken = await new Promise((resolve, reject) => {
                  this._refreshQueue.push({ resolve, reject });
                });
              } else {
                this._isRefreshing = true;
                try {
                  newToken = await tokenRefreshConfig.onRefresh();
                  // Resolve all queued requests
                  for (const queued of this._refreshQueue) {
                    queued.resolve(newToken);
                  }
                  this._refreshQueue = [];
                } catch (refreshErr) {
                  for (const queued of this._refreshQueue) {
                    queued.reject(refreshErr);
                  }
                  this._refreshQueue = [];
                  throw refreshErr;
                } finally {
                  this._isRefreshing = false;
                }
              }
              // Update header and retry
              const headerName = tokenRefreshConfig.headerName || 'Authorization';
              const tokenPrefix = tokenRefreshConfig.tokenPrefix !== undefined ? tokenRefreshConfig.tokenPrefix : 'Bearer ';
              reqConfig.headers[headerName] = `${tokenPrefix}${newToken}`;
              attempt--; // token refresh retry should not count against retry attempts
              continue; // retry with new token
            } catch (_refreshErr) {
              // Token refresh failed — fall through to normal retry logic
            }
          }
        }

        if (err.status && err.status >= 400 && err.status < 500 &&
            !this.retryableStatuses.has(err.status)) {
          break;
        }

        // v14: retryConfig.retryCondition check
        if (retryConf && retryConf.retryCondition && typeof retryConf.retryCondition === 'function') {
          if (!retryConf.retryCondition(err)) {
            break;
          }
        }

        // Don't retry if we've exhausted attempts
        if (attempt >= maxRetries) {
          break;
        }

        this._stats.retries++;

        // v14: Fire onRetry hooks
        this._fireHooks('onRetry', attempt + 1, err, reqConfig);

        // v14: retryConfig.onRetry callback
        if (retryConf && retryConf.onRetry && typeof retryConf.onRetry === 'function') {
          try { retryConf.onRetry(attempt + 1, err, reqConfig); } catch (_) { /* ignore */ }
        }

        // v14: Custom retry delay from retryConfig, or default exponential backoff
        let delay;
        if (retryConf && retryConf.retryDelay && typeof retryConf.retryDelay === 'function') {
          delay = retryConf.retryDelay(attempt + 1, err);
        } else {
          delay = this.retryDelay * Math.pow(2, attempt);
          const jitter = delay * 0.1 * Math.random();
          delay = delay + jitter;
        }
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    this._stats.failures++;

    // Re-throw cancellation errors directly
    if (isCancel(lastError)) throw lastError;

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
    const fullURL = buildURL(
      reqConfig.baseURL || this.baseURL,
      reqConfig.url,
      reqConfig.params,
      reqConfig.paramsSerializer,
    );

    // ─── v12: Resolve adapter (pluggable adapter system) ──────────
    const adapterConfig = reqConfig.adapter || this.defaults.adapter || this.adapter;
    let useAdapter = null;
    if (adapterConfig) {
      try {
        useAdapter = getAdapter(adapterConfig);
      } catch {
        // Fallback to native fetch if adapter resolution fails
        useAdapter = null;
      }
    }

    // Build adapter-compatible config
    const adapterReqConfig = {
      method: reqConfig.method,
      url: reqConfig.url,
      fullURL,
      headers: Object.assign({}, reqConfig.headers),
      body: reqConfig.body,
      responseType: reqConfig.responseType || 'json',
      withCredentials: reqConfig.withCredentials,
      timeout: reqConfig.timeout,
      maxRedirects: reqConfig.maxRedirects,
      onDownloadProgress: reqConfig.onDownloadProgress,
      onUploadProgress: reqConfig.onUploadProgress,
    };

    // Body handling
    if (reqConfig.body !== undefined && reqConfig.method !== 'GET' && reqConfig.method !== 'HEAD') {
      if (isFormData(reqConfig.body)) {
        adapterReqConfig.body = reqConfig.body;
        delete adapterReqConfig.headers['Content-Type'];
      } else if (isURLSearchParams(reqConfig.body)) {
        adapterReqConfig.headers['Content-Type'] = adapterReqConfig.headers['Content-Type'] || 'application/x-www-form-urlencoded';
        adapterReqConfig.body = reqConfig.body.toString();
      } else if (isBuffer(reqConfig.body) || isArrayBufferView(reqConfig.body)) {
        adapterReqConfig.body = reqConfig.body;
      } else if (isStream(reqConfig.body)) {
        adapterReqConfig.body = reqConfig.body;
      } else if (typeof reqConfig.body === 'string') {
        adapterReqConfig.body = reqConfig.body;
      } else if (typeof reqConfig.body === 'object') {
        adapterReqConfig.headers['Content-Type'] = adapterReqConfig.headers['Content-Type'] || 'application/json';
        adapterReqConfig.body = JSON.stringify(reqConfig.body);
      } else {
        adapterReqConfig.body = String(reqConfig.body);
      }
    } else {
      adapterReqConfig.body = undefined;
    }

    // Timeout + AbortController + CancelToken
    let timeoutTimer = null;
    const needsAbort = reqConfig.timeout > 0 || reqConfig.signal || reqConfig.cancelToken;

    if (needsAbort) {
      const combinedSignal = reqConfig.cancelToken
        ? reqConfig.cancelToken.signal
        : reqConfig.signal;

      const { controller, timer } = createTimeoutController(
        reqConfig.timeout || 0,
        combinedSignal,
      );

      if (reqConfig.timeout > 0) {
        adapterReqConfig.signal = controller.signal;
        timeoutTimer = timer;
      } else if (combinedSignal) {
        adapterReqConfig.signal = combinedSignal;
      }
    }

    try {
      let response;

      if (useAdapter) {
        // ─── Use pluggable adapter ────────────────────────────────
        response = await useAdapter(adapterReqConfig);
      } else {
        // ─── Default: native fetch ────────────────────────────────
        response = await this._nativeFetchRequest(adapterReqConfig, reqConfig);
      }

      if (timeoutTimer) clearTimeout(timeoutTimer);

      // Enforce maxContentLength
      if (reqConfig.maxContentLength > 0 && response.headers) {
        const contentLength = response.headers instanceof AxiosHeaders
          ? response.headers.get('content-length')
          : response.headers['content-length'];
        if (contentLength && parseInt(contentLength, 10) > reqConfig.maxContentLength) {
          throw new ClientError(
            `Response content length ${contentLength} exceeds maxContentLength ${reqConfig.maxContentLength}`,
            {
              code: ClientError.ERR_MAX_CONTENT_LENGTH_EXCEEDED,
              status: response.status,
              details: { size: parseInt(contentLength, 10), limit: reqConfig.maxContentLength },
            },
          );
        }
      }

      // Custom validateStatus (Axios-compatible)
      const statusValidator = reqConfig.validateStatus || this.validateStatus;
      if (!statusValidator(response.status)) {
        let errCode;
        if (response.status >= 400 && response.status < 500) {
          errCode = ClientError.ERR_BAD_REQUEST;
        } else if (response.status >= 500) {
          errCode = ClientError.ERR_BAD_RESPONSE;
        } else {
          errCode = `ERR_HTTP_${response.status}`;
        }
        throw new ClientError(
          `Request failed with status ${response.status}`,
          {
            status: response.status,
            code: errCode,
            details: response.data,
            config: reqConfig,
            response: {
              data: response.data,
              status: response.status,
              statusText: response.statusText || '',
              headers: response.headers instanceof AxiosHeaders
                ? response.headers
                : new AxiosHeaders(response.headers || {}),
              config: reqConfig,
            },
            request: response.request || {},
          },
        );
      }

      // onDownloadProgress callback (after data received)
      if (reqConfig.onDownloadProgress && typeof reqConfig.onDownloadProgress === 'function') {
        const contentLength = response.headers && (
          response.headers instanceof AxiosHeaders
            ? response.headers.get('content-length')
            : response.headers['content-length']
        );
        reqConfig.onDownloadProgress({
          loaded: contentLength ? parseInt(contentLength, 10) : 0,
          total: contentLength ? parseInt(contentLength, 10) : 0,
          progress: 1,
          bytes: contentLength ? parseInt(contentLength, 10) : 0,
        });
      }

      return {
        data: response.data,
        rawData: response.rawData || response.data,
        status: response.status,
        statusText: response.statusText || '',
        headers: response.headers || {},
        request: response.request || {},
      };
    } catch (err) {
      if (timeoutTimer) clearTimeout(timeoutTimer);

      // Already a ClientError
      if (err instanceof ClientError) throw err;

      // Cancellation
      if (isCancel(err)) throw err;
      if (err && err.name === 'AbortError' && reqConfig.cancelToken && reqConfig.cancelToken.requested) {
        throw reqConfig.cancelToken.reason;
      }

      // Abort / timeout error
      if (err.name === 'AbortError') {
        const isCancelledByToken = reqConfig.cancelToken && reqConfig.cancelToken.requested;
        if (isCancelledByToken) {
          throw reqConfig.cancelToken.reason;
        }
        throw new ClientError('Request aborted', {
          code: reqConfig.timeout > 0 ? ClientError.ECONNABORTED : ClientError.ERR_ABORTED,
          details: { url: fullURL },
        });
      }

      // Network error
      throw new ClientError(
        `Network error: ${err.message}`,
        {
          code: ClientError.ERR_NETWORK,
          details: { url: fullURL, originalError: err.message },
        },
      );
    }
  }

  /**
   * Internal: Native fetch-based request (default when no adapter is specified).
   */
  async _nativeFetchRequest(adapterReqConfig, reqConfig) {
    const fetchOptions = {
      method: adapterReqConfig.method,
    };

    if (adapterReqConfig.withCredentials) {
      fetchOptions.credentials = 'include';
    }

    fetchOptions.headers = adapterReqConfig.headers;

    if (adapterReqConfig.body !== undefined && adapterReqConfig.method !== 'GET' && adapterReqConfig.method !== 'HEAD') {
      fetchOptions.body = adapterReqConfig.body;
    }

    if (adapterReqConfig.signal) {
      fetchOptions.signal = adapterReqConfig.signal;
    }

    if (reqConfig.maxRedirects === 0) {
      fetchOptions.redirect = 'manual';
    }

    // v15: beforeRedirect callback — use manual redirect to intercept
    const beforeRedirectCb = reqConfig.beforeRedirect;
    if (beforeRedirectCb && typeof beforeRedirectCb === 'function' && reqConfig.maxRedirects !== 0) {
      fetchOptions.redirect = 'manual';
    }

    let res = await fetch(adapterReqConfig.fullURL, fetchOptions);

    // v15: Handle manual redirect with beforeRedirect callback
    if (beforeRedirectCb && typeof beforeRedirectCb === 'function' && reqConfig.maxRedirects !== 0) {
      let redirectCount = 0;
      const maxRedirects = reqConfig.maxRedirects || 5;
      while (res.status >= 300 && res.status < 400 && redirectCount < maxRedirects) {
        const location = res.headers.get('location');
        if (!location) break;
        redirectCount++;
        const redirectOptions = Object.assign({}, fetchOptions);
        const resHeaders = {};
        res.headers.forEach((value, key) => { resHeaders[key] = value; });
        try { beforeRedirectCb(redirectOptions, { headers: resHeaders, status: res.status, location }); } catch (_) { /* ignore */ }
        res = await fetch(location, redirectOptions);
      }
    }

    // Parse response based on responseType
    const contentType = res.headers.get('content-type') || '';
    let data;
    const responseType = adapterReqConfig.responseType || 'json';

    if (responseType === 'arraybuffer') {
      data = await res.arrayBuffer();
    } else if (responseType === 'blob') {
      if (typeof res.blob === 'function') {
        data = await res.blob();
      } else {
        data = await res.arrayBuffer();
      }
    } else if (responseType === 'text') {
      data = await res.text();
    } else if (responseType === 'stream') {
      data = res.body;
    } else {
      // Default: json
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
    }

    // Collect response headers as AxiosHeaders (v13)
    const resHeaders = new AxiosHeaders();
    res.headers.forEach((value, key) => {
      resHeaders.set(key, value);
    });

    return {
      data,
      rawData: data,
      status: res.status,
      statusText: res.statusText || '',
      headers: resHeaders,
      request: { url: adapterReqConfig.fullURL, method: adapterReqConfig.method },
    };
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

  _wrapError(err, reqConfig, response) {
    if (err instanceof ClientError) {
      if (!err.config) err.config = reqConfig;
      if (!err.response && response) {
        err.response = {
          data: response.data || response.details,
          status: response.status || err.status,
          statusText: response.statusText || '',
          headers: response.headers || {},
          config: reqConfig,
        };
      }
      err.isApiBridgeError = true;
      return err;
    }
    const wrapped = new ClientError(err.message || 'Unknown error', {
      status: err.status || (response && response.status) || null,
      code: err.code || 'ERR_UNKNOWN',
      details: {
        method: reqConfig ? reqConfig.method : undefined,
        url: reqConfig ? reqConfig.url : undefined,
      },
      config: reqConfig,
      response: response ? {
        data: response.data,
        status: response.status,
        statusText: response.statusText || '',
        headers: response.headers || {},
        config: reqConfig,
      } : null,
    });
    wrapped.isApiBridgeError = true;
    return wrapped;
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

// ─── Static Methods (Axios Compatibility) ─────────────────────────────────

/**
 * Check if an error is an APIBridge client error (like axios.isAxiosError).
 * @param {*} err
 * @returns {boolean}
 */
APIBridgeClient.isClientError = function isClientError(err) {
  return err instanceof ClientError || (err && (err.isApiBridgeError === true || err.isAxiosError === true));
};

/**
 * Check if an error is an APIBridge error.
 * @param {*} err
 * @returns {boolean}
 */
APIBridgeClient.isApiBridgeError = APIBridgeClient.isClientError;

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

// ─── Concurrent Request Helpers ─────────────────────────────────────────────

/**
 * Execute multiple requests concurrently (like axios.all).
 * @param {Array<Promise>} promises
 * @returns {Promise<Array>}
 */
function all(promises) {
  return Promise.all(promises);
}

/**
 * Spread the results of a concurrent request (like axios.spread).
 * @param {Function} callback
 * @returns {Function}
 */
function spread(callback) {
  return function (arr) {
    return callback.apply(null, arr);
  };
}

/**
 * Check if a value is a ClientError (like axios.isAxiosError).
 * @param {*} err
 * @returns {boolean}
 */
function isClientError(err) {
  return err instanceof ClientError || (err && (err.isApiBridgeError === true || err.isAxiosError === true));
}

/**
 * Check if an error is a ClientError (alias).
 * @param {*} err
 * @returns {boolean}
 */
function isApiBridgeError(err) {
  return isClientError(err);
}

// ─── Axios Aliases (v12: Complete drop-in compatibility) ─────────────────
const Axios = APIBridgeClient;
const AxiosError = ClientError;

/**
 * Check if an error is an AxiosError (alias for isClientError).
 * @param {*} err
 * @returns {boolean}
 */
function isAxiosError(err) {
  return isClientError(err);
}

module.exports = {
  APIBridgeClient,
  ClientError,
  createClient,
  buildURL,
  all,
  spread,
  isClientError,
  isApiBridgeError,
  mergeConfig,
  defaultParamsSerializer,
  resolveParamsSerializer,
  VERSION,
  // v12: Axios aliases
  Axios,
  AxiosError,
  isAxiosError,
};
