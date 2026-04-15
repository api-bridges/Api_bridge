/**
 * APIBridge AI v3
 * Intelligent API mismatch detector, transformer, and learner
 *
 * v2 features:
 *  - Middleware pipeline (before/after hooks)
 *  - Response caching with TTL
 *  - Retry with exponential backoff
 *  - Response normalization (pagination, errors, envelopes)
 *  - Schema validation
 *  - All HTTP methods (GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS)
 *  - Event-driven monitoring
 *  - Batch transformation
 *  - Bulk learning import/export
 *
 * v3 features:
 *  - Plugin system (extensible architecture)
 *  - Schema inference (auto-generate schemas from data)
 *  - Field projection (pick, omit, rename, reshape, flatten, compact)
 *  - Data masking (PII protection: redact, mask, hash)
 *  - Rate limiting (token bucket, burst, queue)
 *  - Schema diff engine (detect API drift & breaking changes)
 *  - TypeScript type generator (interfaces, type guards)
 *  - Metrics collector (timing, counters, percentiles)
 *
 * Usage:
 *   const { bridge, bridgeFetch, transform } = require('api-bridge-ai');
 *
 *   // Axios
 *   const api = bridge(axiosInstance, { schema: mySchema });
 *   const data = await api.get('/users/1');
 *
 *   // Native fetch
 *   const api = bridgeFetch({ schema: mySchema });
 *   const data = await api.get('https://api.example.com/users/1');
 *
 *   // Direct transform
 *   const result = transform({ first_name: 'John' });
 *   // → { firstName: 'John' }
 *
 *   // v3: Infer schema
 *   const { SchemaInference } = require('api-bridge-ai');
 *   const schema = new SchemaInference().infer(apiResponse);
 *
 *   // v3: Mask sensitive data
 *   const { DataMasker } = require('api-bridge-ai');
 *   const masked = new DataMasker().mask(data);
 */

const { APIBridgeTransformer } = require('./transformer');
const { exportMismatchCSV, exportMismatchJSON, exportSchemaSuggestions } = require('./exporter');
const { ResponseCache } = require('./cache');
const { MiddlewarePipeline } = require('./middleware');
const { SchemaValidator } = require('./validator');
const { ResponseNormalizer } = require('./normalizer');
const { LearningEngine } = require('./learning');
const { PluginManager } = require('./plugins');
const { SchemaInference } = require('./inference');
const { FieldProjection } = require('./projection');
const { DataMasker } = require('./masking');
const { RateLimiter } = require('./rate-limiter');
const { SchemaDiff } = require('./diff');
const { TypeGenerator } = require('./typegen');
const { MetricsCollector } = require('./metrics');
const {
  ApiBridgeError,
  ValidationError,
  TransformError,
  CacheError,
  MiddlewareError,
  NetworkError,
  PluginError,
  RateLimitError,
  InferenceError,
} = require('./errors');

// ─── AXIOS BRIDGE ─────────────────────────────────────────────────────────────

/**
 * Wrap an axios instance with APIBridge v3.
 *
 * @param {object} axiosInstance
 * @param {object} options
 * @param {object}  options.schema              Field mapping schema
 * @param {boolean} options.transformRequests    Transform outgoing request bodies (default true)
 * @param {object}  options.cache               Cache options { maxSize, ttl, enabled }
 * @param {object}  options.validator            Validator options { strict, coerce, throwOnError }
 * @param {object}  options.normalizer           Normalizer options
 * @returns {object} The enhanced axios instance
 */
function bridge(axiosInstance, options = {}) {
  const transformer = new APIBridgeTransformer(options);
  const cache = new ResponseCache(options.cache || {});
  const middleware = new MiddlewarePipeline();
  const validator = new SchemaValidator(options.validator || {});
  const normalizer = new ResponseNormalizer(options.normalizer || {});

  // Response interceptor
  axiosInstance.interceptors.response.use(
    (response) => {
      if (response.data) {
        // Check cache
        const cached = cache.get(response.data, { direction: 'toFrontend' });
        if (cached) {
          response.data = cached;
          return response;
        }

        const transformed = transformer.transform(
          response.data,
          options.schema || null,
          'toFrontend',
        );

        cache.set(response.data, { direction: 'toFrontend' }, transformed);
        response.data = transformed;
      }
      return response;
    },
    (error) => Promise.reject(error),
  );

  // Request interceptor
  if (options.transformRequests !== false) {
    axiosInstance.interceptors.request.use(
      (config) => {
        if (config.data && typeof config.data === 'object') {
          config.data = transformer.transform(
            config.data,
            options.schema || null,
            'toBackend',
          );
        }
        return config;
      },
      (error) => Promise.reject(error),
    );
  }

  // Attach v3 utilities
  axiosInstance.__bridge    = transformer;
  axiosInstance.__cache     = cache;
  axiosInstance.__middleware = middleware;
  axiosInstance.__validator  = validator;
  axiosInstance.__normalizer = normalizer;

  axiosInstance.approve      = (src, tgt) => transformer.approve(src, tgt);
  axiosInstance.reject       = (src, wrong, correct) => transformer.reject(src, wrong, correct);
  axiosInstance.exportCSV    = (p) => exportMismatchCSV(transformer.mismatches, p);
  axiosInstance.exportJSON   = (p) => exportMismatchJSON(transformer.mismatches, p);
  axiosInstance.getStats     = () => ({
    transformer: transformer.getStats(),
    cache: cache.getStats(),
    learning: transformer.learning.getStats(),
  });
  axiosInstance.getPending   = () => transformer.getPending();
  axiosInstance.validate     = (data, schema) => validator.validate(data, schema);
  axiosInstance.normalize    = (body, status) => normalizer.normalize(body, status);
  axiosInstance.use          = (name, fn, phase) => middleware.use(name, fn, phase);
  axiosInstance.clearCache   = () => cache.clear();
  axiosInstance.resetSession = () => transformer.resetSession();
  axiosInstance.bulkImport   = (mappings) => transformer.learning.bulkImport(mappings);
  axiosInstance.bulkExport   = () => transformer.learning.bulkExport();

  return axiosInstance;
}

// ─── FETCH BRIDGE ─────────────────────────────────────────────────────────────

/**
 * Wrap native fetch with APIBridge v3.
 * Supports all HTTP methods, retry logic, caching, middleware, and normalization.
 *
 * @param {object} options
 * @param {object}  options.schema        Field mapping schema
 * @param {number}  options.retries       Max retries on failure (default 0)
 * @param {number}  options.retryDelay    Base delay in ms (default 1000)
 * @param {object}  options.cache         Cache options
 * @param {object}  options.normalizer    Normalizer options
 * @param {object}  options.validator     Validator options
 */
function bridgeFetch(options = {}) {
  const transformer = new APIBridgeTransformer(options);
  const cache = new ResponseCache(options.cache || {});
  const middleware = new MiddlewarePipeline();
  const validator = new SchemaValidator(options.validator || {});
  const normalizer = new ResponseNormalizer(options.normalizer || {});
  const maxRetries = options.retries || 0;
  const retryDelay = options.retryDelay || 1000;

  /**
   * Core request with retry + middleware + caching.
   */
  async function request(method, url, body, config = {}) {
    const context = {
      method, url, body, config,
      direction: body ? 'toBackend' : 'toFrontend',
      schema: options.schema || null,
      meta: {},
    };

    // Before middleware
    await middleware.run('before', context);

    // Transform outgoing body
    let outBody = context.body;
    if (outBody && typeof outBody === 'object') {
      outBody = transformer.transform(outBody, context.schema, 'toBackend');
    }

    // Check cache for GET requests
    if (method === 'GET') {
      const cached = cache.get(url, { method });
      if (cached) return cached;
    }

    // Retry loop
    let lastError;
    for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
      try {
        const fetchOptions = {
          method,
          ...config,
        };

        if (outBody && method !== 'GET' && method !== 'HEAD') {
          fetchOptions.headers = {
            'Content-Type': 'application/json',
            ...(config.headers || {}),
          };
          fetchOptions.body = JSON.stringify(outBody);
        }

        const res = await fetch(url, fetchOptions);
        const contentType = res.headers.get('content-type') || '';

        let data;
        if (contentType.includes('application/json')) {
          data = await res.json();
        } else {
          const text = await res.text();
          try { data = JSON.parse(text); } catch { data = text; }
        }

        // Transform response
        let result;
        if (typeof data === 'object' && data !== null) {
          result = transformer.transform(data, context.schema, 'toFrontend');
        } else {
          result = data;
        }

        // Normalize if enabled
        if (options.normalizer !== false && typeof result === 'object' && result !== null) {
          const normalized = normalizer.normalize(result, res.status);
          context.normalized = normalized;
        }

        // Cache GET responses
        if (method === 'GET') {
          cache.set(url, { method }, result);
        }

        // After middleware
        context.result = result;
        context.status = res.status;
        await middleware.run('after', context);

        return context.result || result;
      } catch (err) {
        lastError = err;
        if (attempt <= maxRetries) {
          const delay = retryDelay * Math.pow(2, attempt - 1);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    throw new NetworkError(
      `Request to ${url} failed after ${maxRetries + 1} attempt(s): ${lastError.message}`,
      url, maxRetries + 1, maxRetries,
    );
  }

  return {
    get:     (url, config) => request('GET', url, null, config),
    post:    (url, body, config) => request('POST', url, body, config),
    put:     (url, body, config) => request('PUT', url, body, config),
    patch:   (url, body, config) => request('PATCH', url, body, config),
    delete:  (url, body, config) => request('DELETE', url, body, config),
    head:    (url, config) => request('HEAD', url, null, config),
    options: (url, config) => request('OPTIONS', url, null, config),
    request,

    // Utilities
    approve:      (src, tgt) => transformer.approve(src, tgt),
    reject:       (src, wrong, correct) => transformer.reject(src, wrong, correct),
    exportCSV:    (p) => exportMismatchCSV(transformer.mismatches, p),
    exportJSON:   (p) => exportMismatchJSON(transformer.mismatches, p),
    getStats:     () => ({
      transformer: transformer.getStats(),
      cache: cache.getStats(),
      learning: transformer.learning.getStats(),
    }),
    getPending:   () => transformer.getPending(),
    validate:     (data, schema) => validator.validate(data, schema),
    normalize:    (body, status) => normalizer.normalize(body, status),
    use:          (name, fn, phase) => middleware.use(name, fn, phase),
    clearCache:   () => cache.clear(),
    resetSession: () => transformer.resetSession(),
    bulkImport:   (mappings) => transformer.learning.bulkImport(mappings),
    bulkExport:   () => transformer.learning.bulkExport(),

    __bridge:     transformer,
    __cache:      cache,
    __middleware:  middleware,
    __validator:   validator,
    __normalizer:  normalizer,
  };
}

// ─── STANDALONE TRANSFORM ─────────────────────────────────────────────────────

/**
 * Transform any object directly, without an HTTP client.
 */
function transform(data, options = {}) {
  const transformer = new APIBridgeTransformer(options);
  return transformer.transform(data, options.schema || null, options.direction || 'toFrontend');
}

/**
 * Create a reusable transformer instance.
 */
function createTransformer(options = {}) {
  return new APIBridgeTransformer(options);
}

// ─── EXPORTS ──────────────────────────────────────────────────────────────────

module.exports = {
  // Main API
  bridge,
  bridgeFetch,
  transform,
  createTransformer,

  // Core classes
  APIBridgeTransformer,
  LearningEngine,
  ResponseCache,
  MiddlewarePipeline,
  SchemaValidator,
  ResponseNormalizer,

  // v3 classes
  PluginManager,
  SchemaInference,
  FieldProjection,
  DataMasker,
  RateLimiter,
  SchemaDiff,
  TypeGenerator,
  MetricsCollector,

  // Exporters
  exportMismatchCSV,
  exportMismatchJSON,
  exportSchemaSuggestions,

  // Error classes
  ApiBridgeError,
  ValidationError,
  TransformError,
  CacheError,
  MiddlewareError,
  NetworkError,
  PluginError,
  RateLimitError,
  InferenceError,
};
