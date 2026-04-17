/**
 * APIBridge AI v13
 * Complete Axios Drop-in Replacement + Intelligent API mismatch detector, transformer, and learner
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
 * v4 features:
 *  - Circuit breaker (fault tolerance, auto-recovery)
 *  - Request deduplication (coalesce concurrent identical requests)
 *  - GraphQL bridge (response/variable transformation)
 *  - OpenAPI schema importer (auto-generate schemas from specs)
 *  - API versioning (version-specific transforms, migration)
 *  - Webhook handler (normalize incoming webhooks)
 *  - JSON Patch generator (RFC 6902 patch generation & application)
 *  - Composable pipeline (functional stage-based transformation)
 *
 * v5 features:
 *  - Advanced retry strategies (linear, exponential, jitter, custom backoff, retry budget)
 *  - Structured request logger (correlation IDs, field redaction, transports)
 *  - Schema registry (versioned schema storage, compatibility checks, namespaces)
 *  - Response streamer (chunked JSON transformation, field filtering, accumulators)
 *  - API dependency graph (DAG execution, parallel orchestration, cycle detection)
 *  - Mock server (endpoint mocking, request recording, sequence responses)
 *  - Health check monitor (configurable probes, aggregated status, alert callbacks)
 *  - Event bus (typed pub/sub, wildcards, priority listeners, event replay)
 *
 * v6 features:
 *  - Enhanced fuzzy matcher (Levenshtein + phonetic + vowel-drop + abbreviation patterns, 97%+ accuracy)
 *  - Cryptic name resolver (prefix stripping, suffix matching, vocabulary-based, best-effort 60% confidence)
 *  - Schema-based type coercer (automatic coercion of string↔boolean, date strings, numeric strings)
 *  - Improved Level 6 matching: multi-strategy fuzzy with confidence boosting
 *  - Improved Level 7 matching: cryptic/arbitrary name detection and resolution
 *  - Type conflict detection and automatic resolution when schema is defined
 *  - 3 new error classes (FuzzyMatchError, TypeCoercionError, CrypticResolverError)
 *
 * v7 features:
 *  - Weighted ensemble fuzzy matching (7 strategies with tuned weights, 99%+ accuracy)
 *  - N-gram similarity matching for short/garbled field names
 *  - Context-aware matching using sibling field names
 *  - Abbreviation-aware semantic similarity (100+ abbreviation entries)
 *  - Database prefix stripping (tbl_, fk_, pk_, vw_, sp_, idx_)
 *  - Case-insensitive boolean coercion ("TRUE", "Yes", "ON" → true)
 *  - Percentage string coercion ("50%" → 0.5)
 *  - Comma-separated number coercion ("1,000" → 1000)
 *  - Additional date format support (DD/MM/YYYY, MM-DD-YYYY)
 *  - Expanded synonym dictionary (financial, IoT, education, social domains)
 *  - Substring/containment matching for compound keys
 *  - Improved confidence calibration throughout all levels
 *
 * v8 features:
 *  - Multi-alias field resolution (map one canonical field to many aliases across APIs)
 *  - Schema migration engine (version-to-version field mapping with upgrade/downgrade paths)
 *  - Batch request orchestrator (parallel/sequential execution with concurrency control)
 *  - Field analytics collector (per-field usage tracking, accuracy metrics, coverage reports)
 *  - Conditional transformation rules (value/type/context-based dynamic transforms)
 *  - Deep merge engine (intelligent object merging with conflict resolution strategies)
 *  - Output formatter (JSON, XML, CSV, key-value, table, and template output)
 *  - Request interceptor chain (priority-ordered, groupable, async interceptors)
 *  - 5 new error classes (FieldAliaserError, SchemaMigrationError, BatchOrchestratorError, DeepMergeError, InterceptorError)
 *
 * v9 features:
 *  - HTTP client engine (createClient) — full-featured fetch-based HTTP client
 *  - Axios-compatible interceptor system (client.interceptors.request.use / response.use)
 *  - Expectation-aware system (declare expected response format, auto-align)
 *  - Smart Proxy mode (dynamic field resolution via Proxy)
 *  - Auto data alignment engine (snake_case → camelCase, fuzzy, nested)
 *  - Type coercion in responses (string → number/boolean/date)
 *  - Schema-aware mode (setSchema for improved accuracy)
 *  - AbortController + timeout support
 *  - Retries with exponential backoff + jitter
 *  - Debug mode (enableDebug) with raw/expected/transformed logging
 *  - Auto-learning with endpoint mapping cache
 *  - Standardized error objects { message, status, code, details }
 *  - ClientError class
 *
 * v10 features (Complete Axios Replacement):
 *  - CancelToken system (axios-compatible: CancelToken.source(), new CancelToken(executor))
 *  - isCancel() check for cancelled requests
 *  - Basic auth support ({ username, password } → Authorization header)
 *  - Custom responseType ('json', 'text', 'blob', 'arraybuffer')
 *  - Custom validateStatus function (override success status check)
 *  - Custom paramsSerializer function (serialize query params)
 *  - Per-request transformRequest / transformResponse chains
 *  - maxContentLength / maxBodyLength enforcement
 *  - onDownloadProgress / onUploadProgress callbacks
 *  - withCredentials support
 *  - FormData auto-detection (multipart/form-data, URLSearchParams, Buffer, Stream)
 *  - toFormData() utility (convert objects to FormData)
 *  - request(config) — Axios-compatible config-object request method
 *  - getUri(config) — Build URL without making request
 *  - Mutable defaults object (client.defaults.headers.common, per-method headers)
 *  - Deep config merging (defaults + instance + per-request)
 *  - all() + spread() concurrent request helpers
 *  - isClientError() / isApiBridgeError() error type checking
 *  - mergeConfig() utility
 *  - Default instance with shorthand methods
 *  - xsrfCookieName / xsrfHeaderName configuration
 *  - Array params serialization
 *  - Type detection utilities (isFormData, isBlob, isFile, isBuffer, isStream, etc.)
 *  - statusText in response object
 *  - config in response object
 *
 * v11 features (Complete Drop-in Axios Replacement):
 *  - Pluggable adapter system (fetch, xhr, custom function, priority list)
 *  - AxiosHeaders class (case-insensitive header management, normalize, merge, iterate)
 *  - HttpStatusCode enum (all standard HTTP status codes: Ok, NotFound, etc.)
 *  - postForm() / putForm() / patchForm() shorthand methods
 *  - formToJSON() utility (convert FormData back to plain object)
 *  - toURLEncodedForm() utility (convert object to URLSearchParams)
 *  - URL utilities: isAbsoluteURL(), combineURLs(), isURLSameOrigin(), parseURL()
 *  - Type helpers: isPlainObject, isObject, isFunction, isString, isNumber, isBoolean, etc.
 *  - Utility helpers: kindOf, forEach, merge, extend, stripBOM, findKey
 *  - Environment helpers: isBrowser(), isNode()
 *  - Error response/request properties (full Axios error shape with response.data/status/headers)
 *  - ClientError.from() static factory (like AxiosError.from)
 *  - Proxy configuration support ({ host, port, auth, protocol })
 *  - httpAgent / httpsAgent support
 *  - socketPath support (Unix domain sockets)
 *  - formSerializer options
 *  - env.FormData configuration
 *  - VERSION export
 *  - getAdapter() utility
 *  - isCancelToken() check
 *  - isTypedArray() / isFileList() detection
 *  - InterceptorChain.forEach() iteration
 *  - freezeDeep() / generateUID() utilities
 *  - normalizeHeaderName() utility
 *  - Common header accessors (getContentType, setContentType, etc.)
 *
 * v12 features (True Axios Drop-in — Callable Export + Full API Surface):
 *  - Callable default export: apiBridge(config), apiBridge(url, config)
 *  - Shorthand methods on default export: apiBridge.get(), .post(), .put(), etc.
 *  - Axios class alias: apiBridge.Axios === APIBridgeClient
 *  - AxiosError alias: apiBridge.AxiosError === ClientError with error code constants
 *  - Error code constants: ERR_NETWORK, ERR_CANCELED, ECONNABORTED, ETIMEDOUT, etc.
 *  - isAxiosError() alias for isClientError()
 *  - delete(url, { data }) — send body with DELETE requests (Axios-compatible)
 *  - Adapter system fully wired into request pipeline (_executeRequest uses getAdapter)
 *  - transitional config option { silentJSONParsing, forcedJSONParsing, clarifyTimeoutError }
 *  - ERR_BAD_REQUEST / ERR_BAD_RESPONSE semantic error codes on status failures
 *  - Default export has: get, post, put, patch, delete, head, options, request
 *  - Default export has: postForm, putForm, patchForm, getUri
 *  - Default export has: defaults, interceptors, create, all, spread
 *  - Default export has: CancelToken, Cancel, isCancel, AxiosHeaders, HttpStatusCode
 *  - Default export has: toFormData, formToJSON, isAxiosError, VERSION
 *  - 100% Axios API surface coverage for seamless migration
 *
 * v13 features (Complete Axios Replacement — Zero Gaps):
 *  - AxiosHeaders in responses: all response headers are now AxiosHeaders instances (case-insensitive)
 *  - response.request property: every response includes the request object (Axios-compatible)
 *  - Default transformRequest chain: automatic JSON.stringify for object payloads
 *  - Default transformResponse chain: automatic JSON.parse for string responses
 *  - .isAxiosError property on ClientError instances: `error.isAxiosError === true`
 *  - data alias in response config: response.config.data mirrors response.config.body
 *  - maxRate support: `{ maxRate: [uploadBytesPerSec, downloadBytesPerSec] }` throttling
 *  - lookup DNS option: custom DNS resolution function for Node.js
 *  - Enhanced error shapes: error.response.headers is AxiosHeaders, error.request included
 *  - AxiosHeaders integration throughout entire request/response pipeline
 *  - isAxiosError() now also checks `.isAxiosError` property (duck-typing compatible)
 *  - Version 13.0.0
 *
 * Usage:
 *   const { createClient, bridge, bridgeFetch, transform } = require('api-bridge-ai');
 *
 *   // v9: Next-gen client
 *   const api = createClient({ baseURL: '/api', timeout: 5000 });
 *   const res = await api.get('/user', { expect: { userName: 'string' } });
 *   console.log(res.data.userName); // auto-aligned from user_name, usr_nm, etc.
 *
 *   // v9: Interceptors
 *   api.interceptors.request.use(config => { config.headers.Auth = 'token'; return config; });
 *   api.interceptors.response.use(res => { res.timestamp = Date.now(); return res; });
 *
 *   // v9: Smart Proxy mode
 *   const proxyApi = createClient({ baseURL: '/api', proxyMode: true });
 *   const { data } = await proxyApi.get('/user');
 *   data.userName; // resolves from user_name, USER_NAME, usr_nm dynamically
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
 *   // v4: Circuit breaker
 *   const { CircuitBreaker } = require('api-bridge-ai');
 *   const breaker = new CircuitBreaker({ failureThreshold: 3 });
 *   const data = await breaker.execute(() => fetch('/api/users'));
 *
 *   // v4: GraphQL bridge
 *   const { GraphQLBridge } = require('api-bridge-ai');
 *   const gql = new GraphQLBridge({ convention: 'camelCase' });
 *   const result = gql.transformResponse(graphqlResponse);
 *
 *   // v4: Composable pipeline
 *   const { ComposablePipeline } = require('api-bridge-ai');
 *   const pipe = new ComposablePipeline();
 *   pipe.pipe('validate', validateFn).pipe('transform', transformFn);
 *   const result = await pipe.execute(data);
 *
 *   // v5: Retry strategy
 *   const { RetryStrategy } = require('api-bridge-ai');
 *   const retry = new RetryStrategy({ strategy: 'exponentialJitter', maxRetries: 5 });
 *   const data = await retry.execute(() => fetch('/api/users'));
 *
 *   // v5: Event bus
 *   const { EventBus } = require('api-bridge-ai');
 *   const bus = new EventBus({ recordHistory: true });
 *   bus.on('api.request', (data) => console.log(data));
 *   await bus.emit('api.request', { url: '/users' });
 *
 *   // v5: Health check
 *   const { HealthCheck } = require('api-bridge-ai');
 *   const health = new HealthCheck({ failureThreshold: 3 });
 *   health.register('api', () => fetch('/health').then(r => r.ok));
 *
 *   // v5: Mock server
 *   const { MockServer } = require('api-bridge-ai');
 *   const mock = new MockServer();
 *   mock.register('GET', '/api/users', { body: [{ id: 1 }] });
 *
 *   // v6: Fuzzy matcher
 *   const { FuzzyMatcher } = require('api-bridge-ai');
 *   const fuzzy = new FuzzyMatcher();
 *   const result = fuzzy.findBestMatch('usr_email', ['user_email', 'user_name']);
 *
 *   // v6: Cryptic resolver
 *   const { CrypticResolver } = require('api-bridge-ai');
 *   const resolver = new CrypticResolver();
 *   const resolved = resolver.resolve('z9_ref_id', ['reference_id', 'user_id']);
 *
 *   // v6: Type coercer
 *   const { TypeCoercer } = require('api-bridge-ai');
 *   const coercer = new TypeCoercer();
 *   const coerced = coercer.coerceValue('true', 'boolean', 'isActive');
 *
 *   // v8: Field aliaser
 *   const { FieldAliaser } = require('api-bridge-ai');
 *   const aliaser = new FieldAliaser();
 *   aliaser.register('userId', ['user_id', 'uid', 'member_id']);
 *   const resolved = aliaser.resolve('uid'); // { canonical: 'userId', matched: true }
 *
 *   // v8: Schema migrator
 *   const { SchemaMigrator } = require('api-bridge-ai');
 *   const migrator = new SchemaMigrator();
 *   migrator.define('1.0', '2.0', { rename: { user_name: 'username' } });
 *   const migrated = migrator.migrate(data, '1.0', '2.0');
 *
 *   // v8: Deep merge
 *   const { DeepMerge } = require('api-bridge-ai');
 *   const merger = new DeepMerge({ arrayStrategy: 'union' });
 *   const merged = merger.merge(apiResponse1, apiResponse2);
 *
 *   // v8: Conditional transform
 *   const { ConditionalTransform } = require('api-bridge-ai');
 *   const ct = new ConditionalTransform();
 *   ct.when('nullToDefault', (v) => v === null, () => 'N/A');
 */

// ─── Core ─────────────────────────────────────────────────────────────────────
const { APIBridgeTransformer } = require('./core/transformer');
const { LearningEngine } = require('./core/learning');
const { ResponseNormalizer } = require('./core/normalizer');
const { SchemaValidator } = require('./core/validator');
const { SchemaInference } = require('./core/inference');
const { FuzzyMatcher } = require('./core/fuzzy-matcher');
const { CrypticResolver } = require('./core/cryptic-resolver');
const { TypeCoercer } = require('./core/type-coercer');
const { FieldAliaser } = require('./core/field-aliaser');
const { ConditionalTransform } = require('./core/conditional-transform');
const { SchemaMigrator } = require('./core/schema-migrator');
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
  CircuitBreakerError,
  PipelineError,
  WebhookError,
  VersioningError,
  RetryError,
  SchemaRegistryError,
  DependencyGraphError,
  MockServerError,
  HealthCheckError,
  EventBusError,
  FuzzyMatchError,
  TypeCoercionError,
  CrypticResolverError,
  FieldAliaserError,
  SchemaMigrationError,
  BatchOrchestratorError,
  DeepMergeError,
  InterceptorError,
} = require('./core/errors');

// ─── v10 Core ─────────────────────────────────────────────────────────────────
const {
  APIBridgeClient, ClientError, createClient, buildURL,
  all, spread, isClientError, isApiBridgeError, mergeConfig, defaultParamsSerializer,
  VERSION,
  // v12: Axios aliases
  Axios, AxiosError, isAxiosError,
} = require('./core/client');
const { InterceptorManager, InterceptorChain } = require('./core/interceptors');
const {
  validateExpect,
  serializeExpect,
  deserializeExpect,
  extractExpect,
  injectExpectHeader,
  flattenExpect,
  HEADER_NAME,
} = require('./core/expectation');
const { smartProxy } = require('./core/proxy');
const { CancelToken, Cancel, isCancel, isCancelToken } = require('./core/cancel');
const {
  toFormData, toURLEncodedForm, formToJSON,
  isFormData, isBlob, isFile, isBuffer, isStream, isArrayBufferView, isURLSearchParams,
  isTypedArray, isFileList,
} = require('./core/form-data');

// ─── v11 Core ─────────────────────────────────────────────────────────────────
const { AxiosHeaders, normalizeHeaderName } = require('./core/headers');
const { HttpStatusCode } = require('./core/http-status');
const { fetchAdapter, xhrAdapter, adapters, getAdapter } = require('./core/adapters');
const { isAbsoluteURL, combineURLs, isURLSameOrigin, parseURL } = require('./core/url-utils');
const {
  kindOf, isPlainObject, isObject, isFunction, isString, isNumber, isBoolean, isUndefined,
  isDate, isRegExp, isHTMLForm, isArrayBuffer, isSpecCompliantForm,
  forEach: forEachUtil, merge: mergeUtil, extend, stripBOM, findKey, isBrowser, isNode,
  freezeDeep, generateUID,
} = require('./core/helpers');

// ─── Utils ────────────────────────────────────────────────────────────────────
const { ResponseCache } = require('./utils/cache');
const { RequestDeduplicator } = require('./utils/dedup');
const { SchemaDiff } = require('./utils/diff');
const { exportMismatchCSV, exportMismatchJSON, exportSchemaSuggestions } = require('./utils/exporter');
const { DataMasker } = require('./utils/masking');
const { MetricsCollector } = require('./utils/metrics');
const { JSONPatchGenerator } = require('./utils/patch');
const { TypeGenerator } = require('./utils/typegen');
const { DeepMerge } = require('./utils/deep-merge');
const { OutputFormatter } = require('./utils/output-formatter');
const { FieldStats } = require('./utils/field-stats');
const { FieldProjection } = require('./utils/projection');
const { RequestLogger } = require('./utils/request-logger');

// ─── Adapters ─────────────────────────────────────────────────────────────────
const { GraphQLBridge } = require('./adapters/graphql');
const { WebhookHandler } = require('./adapters/webhook');
const { OpenAPIImporter } = require('./adapters/openapi');
const { MockServer } = require('./adapters/mock-server');
const { ResponseStreamer } = require('./adapters/response-streamer');
const { MiddlewarePipeline } = require('./adapters/middleware');
const { ComposablePipeline } = require('./adapters/pipeline');
const { PluginManager } = require('./adapters/plugins');
const { RequestInterceptor } = require('./adapters/request-interceptor');
const { BatchOrchestrator } = require('./adapters/batch-orchestrator');
const { DependencyGraph } = require('./adapters/dependency-graph');
const { EventBus } = require('./adapters/event-bus');
const { APIVersionManager } = require('./adapters/versioning');
const { CircuitBreaker } = require('./adapters/circuit-breaker');
const { RetryStrategy } = require('./adapters/retry-strategy');
const { RateLimiter } = require('./adapters/rate-limiter');
const { HealthCheck } = require('./adapters/health-check');
const { SchemaRegistry } = require('./adapters/schema-registry');

// ─── AXIOS BRIDGE ─────────────────────────────────────────────────────────────

/**
 * Wrap an axios instance with APIBridge v8.
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

  // Attach v4 utilities
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
 * Wrap native fetch with APIBridge v8.
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

// Default instance (use like axios: apiBridge.get(), apiBridge.post(), etc.)
const defaultInstance = createClient();

// ─── v12: Callable default export (like axios) ──────────────────────────────
// Makes the module callable: const apiBridge = require('api-bridge-ai');
//   apiBridge('/api/users')           — GET by default
//   apiBridge({ method: 'post', url: '/api/users', data: { name: 'John' } })
//   apiBridge.get('/api/users')       — shorthand
//   apiBridge.create({ baseURL: '/api' })
//
// This is the key feature that makes api-bridge-ai a true drop-in Axios replacement.

function apiBridge(configOrUrl, config) {
  if (typeof configOrUrl === 'string') {
    return defaultInstance.request(configOrUrl, config || {});
  }
  return defaultInstance.request(configOrUrl);
}

// Bind default instance methods
apiBridge.request = function request(configOrUrl, config) {
  if (typeof configOrUrl === 'string') {
    return defaultInstance.request(configOrUrl, config || {});
  }
  return defaultInstance.request(configOrUrl);
};
apiBridge.get = function get(url, config) { return defaultInstance.get(url, config); };
apiBridge.post = function post(url, data, config) { return defaultInstance.post(url, data, config); };
apiBridge.put = function put(url, data, config) { return defaultInstance.put(url, data, config); };
apiBridge.patch = function patch(url, data, config) { return defaultInstance.patch(url, data, config); };
apiBridge.delete = function del(url, config) { return defaultInstance.delete(url, config); };
apiBridge.head = function head(url, config) { return defaultInstance.head(url, config); };
apiBridge.options = function options(url, config) { return defaultInstance.options(url, config); };
apiBridge.postForm = function postForm(url, data, config) { return defaultInstance.postForm(url, data, config); };
apiBridge.putForm = function putForm(url, data, config) { return defaultInstance.putForm(url, data, config); };
apiBridge.patchForm = function patchForm(url, data, config) { return defaultInstance.patchForm(url, data, config); };
apiBridge.getUri = function getUri(config) { return defaultInstance.getUri(config); };

// Default instance properties
apiBridge.defaults = defaultInstance.defaults;
apiBridge.interceptors = defaultInstance.interceptors;

// Factory
apiBridge.create = createClient;
apiBridge.createClient = createClient;

// Concurrent helpers
apiBridge.all = all;
apiBridge.spread = spread;

// Error checking
apiBridge.isClientError = isClientError;
apiBridge.isApiBridgeError = isApiBridgeError;
apiBridge.isAxiosError = isAxiosError;
apiBridge.isCancel = isCancel;
apiBridge.isCancelToken = isCancelToken;

// Classes & constructors
apiBridge.Axios = Axios;
apiBridge.AxiosError = AxiosError;
apiBridge.APIBridgeClient = APIBridgeClient;
apiBridge.ClientError = ClientError;
apiBridge.CancelToken = CancelToken;
apiBridge.Cancel = Cancel;
apiBridge.AxiosHeaders = AxiosHeaders;
apiBridge.HttpStatusCode = HttpStatusCode;
apiBridge.InterceptorManager = InterceptorManager;

// Utilities
apiBridge.toFormData = toFormData;
apiBridge.toURLEncodedForm = toURLEncodedForm;
apiBridge.formToJSON = formToJSON;
apiBridge.mergeConfig = mergeConfig;
apiBridge.getAdapter = getAdapter;
apiBridge.buildURL = buildURL;
apiBridge.VERSION = VERSION;

module.exports = {
  // v12: Callable default export
  default: apiBridge,

  // Main API
  bridge,
  bridgeFetch,
  transform,
  createTransformer,
  createClient,

  // Axios-compatible alias
  create: createClient,

  // Default instance methods (Axios-compatible)
  defaults: defaultInstance.defaults,
  interceptors: defaultInstance.interceptors,

  // v12: Default instance shorthand methods
  request: apiBridge.request,
  get: apiBridge.get,
  post: apiBridge.post,
  put: apiBridge.put,
  patch: apiBridge.patch,
  delete: apiBridge.delete,
  head: apiBridge.head,
  options: apiBridge.options,
  postForm: apiBridge.postForm,
  putForm: apiBridge.putForm,
  patchForm: apiBridge.patchForm,
  getUri: apiBridge.getUri,

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

  // v4 classes
  CircuitBreaker,
  RequestDeduplicator,
  GraphQLBridge,
  OpenAPIImporter,
  APIVersionManager,
  WebhookHandler,
  JSONPatchGenerator,
  ComposablePipeline,

  // v5 classes
  RetryStrategy,
  RequestLogger,
  SchemaRegistry,
  ResponseStreamer,
  DependencyGraph,
  MockServer,
  HealthCheck,
  EventBus,

  // v6 classes
  FuzzyMatcher,
  CrypticResolver,
  TypeCoercer,

  // v8 classes
  FieldAliaser,
  SchemaMigrator,
  BatchOrchestrator,
  FieldStats,
  ConditionalTransform,
  DeepMerge,
  OutputFormatter,
  RequestInterceptor,

  // v9/v10 classes
  APIBridgeClient,
  ClientError,
  InterceptorManager,
  InterceptorChain,

  // v10: CancelToken system
  CancelToken,
  Cancel,
  isCancel,
  isCancelToken,

  // v10/v11: FormData utilities
  toFormData,
  toURLEncodedForm,
  formToJSON,
  isFormData,
  isBlob,
  isFile,
  isBuffer,
  isStream,
  isArrayBufferView,
  isURLSearchParams,
  isTypedArray,
  isFileList,

  // v10: Concurrent helpers
  all,
  spread,

  // v10: Error type checks
  isClientError,
  isApiBridgeError,

  // v10: Config utilities
  mergeConfig,
  defaultParamsSerializer,

  // v11: AxiosHeaders
  AxiosHeaders,
  normalizeHeaderName,

  // v11: HttpStatusCode
  HttpStatusCode,

  // v11: Adapter system
  fetchAdapter,
  xhrAdapter,
  adapters,
  getAdapter,

  // v11: URL utilities
  isAbsoluteURL,
  combineURLs,
  isURLSameOrigin,
  parseURL,

  // v11: Type & utility helpers
  kindOf,
  isPlainObject,
  isObject,
  isFunction,
  isString,
  isNumber,
  isBoolean,
  isUndefined,
  isDate,
  isRegExp,
  isHTMLForm,
  isArrayBuffer,
  isSpecCompliantForm,
  forEach: forEachUtil,
  merge: mergeUtil,
  extend,
  stripBOM,
  findKey,
  isBrowser,
  isNode,
  freezeDeep,
  generateUID,

  // v11: VERSION
  VERSION,

  // v9 expectation helpers
  validateExpect,
  serializeExpect,
  deserializeExpect,
  extractExpect,
  injectExpectHeader,
  flattenExpect,
  HEADER_NAME,

  // v9 proxy
  smartProxy,

  // v9 URL builder
  buildURL,

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
  CircuitBreakerError,
  PipelineError,
  WebhookError,
  VersioningError,
  RetryError,
  SchemaRegistryError,
  DependencyGraphError,
  MockServerError,
  HealthCheckError,
  EventBusError,
  FuzzyMatchError,
  TypeCoercionError,
  CrypticResolverError,
  FieldAliaserError,
  SchemaMigrationError,
  BatchOrchestratorError,
  DeepMergeError,
  InterceptorError,

  // v12: Axios class aliases
  Axios,
  AxiosError,
  isAxiosError,
};
