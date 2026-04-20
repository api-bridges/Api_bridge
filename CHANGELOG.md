# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [16.0.0] - 2026-04-20

### Added — Maximum Security & Power (Enterprise-Grade Hardening)
- **SSRF Protection (`SSRFGuard`)** — Server-Side Request Forgery prevention
  - Blocks private IP ranges (127.0.0.0/8, 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16, 169.254.0.0/16)
  - Blocks cloud metadata endpoints (169.254.169.254, metadata.google.internal, metadata.azure.com)
  - Blocks dangerous protocols (file://, data://, javascript://, vbscript://)
  - Blocks localhost aliases (localhost, 0.0.0.0, [::1], [::ffff:127.0.0.1])
  - Configurable allowlist — bypass SSRF checks for trusted hosts
  - Configurable blocklist — block additional hosts
  - **Enabled by default** on all client instances — zero-config security
  - `ssrf: { enabled: false }` to disable for testing
- **Header Injection Prevention (`HeaderValidator`)** — CRLF attack prevention
  - Validates all header names against RFC 7230 token spec
  - Rejects header names/values containing CR (\r) or LF (\n) characters
  - `maxHeadersCount` — configurable limit on number of headers (default 100)
  - `maxHeaderSize` — configurable max single header value size (default 8192 bytes)
  - Integrated into request pipeline — validates headers before every request
- **Client-Side Rate Limiting (`RequestRateLimiter`)** — Token bucket algorithm
  - `maxRequests` — max requests in time window (default 100)
  - `windowMs` — time window in ms (default 60000)
  - Per-endpoint rate limiting — separate buckets per URL
  - `acquire()` — check if request can proceed
  - `reset()` — reset global or per-endpoint bucket
  - `rateLimiter: { maxRequests: 50, windowMs: 10000 }` in client config
- **Response Size Guard (`ResponseSizeGuard`)** — Memory exhaustion prevention
  - `maxResponseSize` — max response body size (default 10MB)
  - Content-Length header validation before reading body
  - Streaming byte tracker — `createSizeTracker()` for chunked responses
  - Integrated into response pipeline after maxContentLength check
- **Sensitive Data Redaction (`SensitiveDataRedactor`)** — Credential leak prevention
  - Auto-strips sensitive headers from error objects (Authorization, Cookie, Set-Cookie, X-API-Key, etc.)
  - `redactConfig()` — sanitize entire request config for safe logging
  - `redactHeaders()` — replace sensitive header values with [REDACTED]
  - `redactURL()` — strip token/key/secret/password query parameters
  - Custom sensitive header patterns via `sensitiveHeaders` option
  - Error objects automatically contain redacted configs — safe to log/report
- **Request Fingerprinting (`RequestFingerprinter`)** — Replay detection
  - SHA-256 content-based request fingerprinting
  - `isDuplicate(config, windowMs)` — detect replay requests within time window
  - `replayDetection: 5000` in client config — auto-block duplicate requests
  - Configurable window, auto-cleanup of stale entries
- **Prototype Pollution Hardening** — Deep defense
  - `safeMerge()` — deep merge that skips __proto__, constructor, prototype keys
  - `sanitizeObject()` — recursively remove dangerous keys from object graphs
  - `isPrivateIP()` — utility to check if an IP is in private/reserved ranges
- **Request Journey Tracking** — Per-request observability
  - `journeyTracking: true` in client config
  - Every response includes `response.journey` with attempt history
  - Tracks: attempts, cache hits, dedup, token refresh, redirects, timing
  - `journey.totalDuration` — end-to-end request time
  - `journey.attempts[]` — per-attempt status and duration
- **5 New Error Codes** on `ClientError`:
  - `ERR_SSRF_BLOCKED` — Request blocked by SSRF guard
  - `ERR_HEADER_VALIDATION` — Header validation failed (CRLF injection, invalid chars)
  - `ERR_RATE_LIMITED` — Client-side rate limit exceeded
  - `ERR_DUPLICATE_REQUEST` — Replay/duplicate request detected
  - `ERR_RESPONSE_TOO_LARGE` — Response exceeds maximum allowed size
- 73 new tests (991 total)

### Changed
- Security checks integrated into request pipeline: SSRF → Headers → Rate Limit → Replay Detection
- Error objects now automatically redact sensitive config data (Authorization, Cookie, auth, etc.)
- Response pipeline includes size guard after maxContentLength check
- Package description updated to reflect security-first positioning
- Added 13 new keywords: ssrf-protection, crlf-prevention, header-validation, rate-limiter-client, replay-detection, response-size-guard, sensitive-data-redaction, prototype-pollution, request-fingerprinting, security-hardening, journey-tracking, request-tracing
- TypeScript definitions updated with all v16 classes, interfaces, and options

## [15.0.0] - 2026-04-20

### Added — Full Axios Replacement (Complete API Gap Closure + All Features Preserved)
- **Interceptor `runWhen` option** — Conditional interceptor execution with predicate function
  - `interceptors.request.use(fn, null, { runWhen: (config) => boolean })` — Skip interceptor when predicate returns false
  - `interceptors.response.use(fn, null, { runWhen: (response) => boolean })` — Skip response interceptor conditionally
  - Fully backward compatible — existing interceptors without options work as before
- **Interceptor `synchronous` option** — Synchronous interceptor execution mode
  - `interceptors.request.use(fn, null, { synchronous: true })` — Skip `await` for synchronous handlers
  - Reduces overhead for simple synchronous interceptors
- **Auto Content-Type serialization** — Automatic body conversion based on Content-Type header
  - `Content-Type: application/x-www-form-urlencoded` + plain object body → auto-converts to `URLSearchParams`
  - `Content-Type: multipart/form-data` + plain object body → auto-converts to `FormData` (removes Content-Type to let runtime set boundary)
  - Configurable via `autoContentType: false` to disable
  - Only applies to plain objects — FormData, URLSearchParams, Buffer, Stream, etc. are left as-is
- **Enhanced `paramsSerializer`** — Accepts Axios 1.x object form `{ encode, serialize }`
  - `paramsSerializer: { serialize: (params, options) => string }` — Custom serialization function
  - `paramsSerializer: { encode: (value) => string }` — Custom encoding function (defaults to `encodeURIComponent`)
  - `paramsSerializer: (params) => string` — Legacy function form still works
  - `resolveParamsSerializer(serializer)` — Utility to resolve any serializer config into a function
- **`beforeRedirect` callback** — Intercept and modify redirect requests before they are followed
  - `beforeRedirect: (options, { headers, status, location }) => void`
  - Per-client or per-request configuration
  - Follows redirects up to `maxRedirects` limit
- **Request correlation IDs** — Automatic `x-request-id` header generation
  - `requestId: true` — Auto-generate 16-character unique ID on every request
  - `requestId: 'X-Correlation-ID'` — Use custom header name
  - `requestId: false` — Disabled (default)
  - Existing manually-set IDs are preserved (not overwritten)
- **`AxiosHeaders.fromString(headerStr)`** — Parse raw HTTP header strings into AxiosHeaders instances
  - Handles `\r\n` and `\n` line endings
  - Safe handling of empty/null input
- **`AxiosHeaders.toJSON()` filter support** — Filter output by header name array or RegExp pattern
  - `headers.toJSON(['Content-Type', 'Accept'])` — Only include specified headers
  - `headers.toJSON(/^Content/i)` — Only include headers matching pattern
  - `headers.toJSON(true)` — Legacy boolean behavior preserved
- **Additional AxiosHeaders accessors** — `getUserAgent()`, `setUserAgent()`, `hasUserAgent()`, `getContentEncoding()`, `setContentEncoding()`, `hasContentEncoding()`, `getContentDisposition()`, `setContentDisposition()`, `hasContentDisposition()`
- **`resolveParamsSerializer(serializer)`** — Exported utility to resolve any paramsSerializer config into a callable function
- 31 new tests (918 total)

### Changed
- Interceptor handlers now store `runWhen` and `synchronous` properties
- `buildURL()` now uses `resolveParamsSerializer()` to handle all paramsSerializer forms
- `defaultParamsSerializer()` accepts optional `options` parameter with `encode` function
- Updated package description for full Axios replacement positioning
- Added new keywords: `run-when`, `before-redirect`, `request-id`, `auto-content-type`, `params-serializer`

## [14.0.0] - 2026-04-20

### Added — Enterprise-Grade HTTP Client (Production Power Tools)
- **Auto-Retry Engine (`retryConfig`)** — Advanced configurable retry strategies per-client and per-request
  - `retryConfig.retries` — Max retry attempts
  - `retryConfig.retryCondition(error)` — Function to decide whether to retry (e.g., only retry 5xx)
  - `retryConfig.retryDelay(retryCount, error)` — Custom delay function (e.g., linear, exponential, fixed)
  - `retryConfig.shouldResetTimeout` — Reset timeout for each retry attempt
  - `retryConfig.onRetry(retryCount, error, config)` — Callback fired on each retry attempt
  - Per-request `retryConfig` override via request config
- **Response Caching** — Built-in TTL-based memory cache at the HTTP client level
  - `cache.ttl` — Cache time-to-live in milliseconds (0 = disabled)
  - `cache.maxSize` — Maximum number of cached entries (evicts oldest when full)
  - `cache.methods` — Which HTTP methods to cache (default: `['GET']`)
  - `cache.exclude` — URL patterns to exclude from caching
  - `cache.staleWhileRevalidate` — Serve stale cache while refreshing in background
  - `cache.keyGenerator(config)` — Custom cache key generation function
  - `client.clearResponseCache()` — Clear all cached responses
- **Request Deduplication (`dedupe`)** — Coalesce identical in-flight requests
  - `dedupe.enabled` — Enable/disable deduplication
  - `dedupe.methods` — Which HTTP methods to deduplicate (default: `['GET']`)
  - `dedupe.keyGenerator(config)` — Custom dedup key generation function
  - Prevents redundant network calls when multiple components request the same data simultaneously
- **Auto Token Refresh (`tokenRefresh`)** — Automatic 401 handling with token refresh
  - `tokenRefresh.onRefresh()` — Async function that returns a new token
  - `tokenRefresh.statusCodes` — Which status codes trigger a refresh (default: `[401]`)
  - `tokenRefresh.maxRetries` — Maximum refresh attempts (default: `1`)
  - `tokenRefresh.headerName` — Header to update with new token (default: `'Authorization'`)
  - `tokenRefresh.tokenPrefix` — Prefix for token value (default: `'Bearer '`)
  - Queues concurrent requests during token refresh (only one refresh at a time)
  - Token refresh retries do not count against normal retry attempts
- **Request Timing** — Performance monitoring built into every response
  - `response.duration` — Total request duration in milliseconds
  - `response.timing` — `{ start, end, duration }` with timestamps
  - Enabled via `timing: true` in client config (disabled by default)
- **Lifecycle Hooks** — Fire-and-forget event observers at the client level
  - `hooks.onRequest` — Called before each request is sent (receives config)
  - `hooks.onResponse` — Called after each successful response (receives response)
  - `hooks.onError` — Called on each error (receives error)
  - `hooks.onRetry` — Called on each retry attempt (receives retryCount, error, config)
  - Accepts arrays of functions or single functions
  - Errors in hooks are silently swallowed (observers only, no side effects on pipeline)
- 38 new tests (887 total)

### Changed
- `_doRequest` refactored into `_doRequest` (pre-processing, caching, dedup) + `_doRequestCore` (retry loop, timing, token refresh, hooks)
- Updated package description for enterprise-grade positioning
- Added new keywords: `auto-retry`, `response-cache`, `request-dedup`, `token-refresh`, `request-timing`, `lifecycle-hooks`, `stale-while-revalidate`

## [13.0.0] - 2026-04-17

### Added — Complete Axios Replacement (Zero-Gap API Compatibility)
- **AxiosHeaders in responses** — All response headers are now `AxiosHeaders` instances with case-insensitive get/set/has/delete, normalize, merge, toJSON, toString, iterator support
- **`response.request` property** — Every response now includes the request object (URL, method) for Axios-compatible error handling and logging
- **Default `transformRequest` chain** — Automatic JSON.stringify for object payloads with Content-Type header auto-detection (like Axios defaults)
- **Default `transformResponse` chain** — Automatic JSON.parse for string responses with safe fallback (like Axios defaults)
- **`.isAxiosError` property on ClientError** — `error.isAxiosError === true` on all ClientError/AxiosError instances (Axios duck-typing compatible)
- **`data` alias in response config** — `response.config.data` mirrors `response.config.body` for Axios compatibility
- **`maxRate` config option** — Upload/download rate throttling: `{ maxRate: [uploadBytesPerSec, downloadBytesPerSec] }`
- **`lookup` DNS option** — Custom DNS resolution function for Node.js: `{ lookup: (hostname, opts, cb) => ... }`
- **Enhanced error shapes** — `error.response.headers` is AxiosHeaders, `error.request` included in error objects
- **`isAxiosError()` duck-typing** — Now checks both `.isApiBridgeError` and `.isAxiosError` properties for cross-library error detection
- 41 new tests (849 total)

### Changed
- Default `transformRequest` is now an array with a JSON.stringify function (was `null`)
- Default `transformResponse` is now an array with a JSON.parse function (was `null`)
- Response headers throughout the entire pipeline are AxiosHeaders instances (were plain objects)
- `_nativeFetchRequest` now returns AxiosHeaders and request object in response
- Updated package description for zero-gap positioning
- Added new keywords: `axios-headers`, `zero-dependency-http`, `fetch-wrapper`, `max-rate`, `dns-lookup`

## [12.0.0] - 2026-04-17

### Added — True Axios Drop-in Replacement (Callable Export + Full API Surface)
- **Callable default export** — Module can be called as a function, just like `axios(config)` or `axios(url, config)`
  - `apiBridge('/api/users')` — GET request by default
  - `apiBridge({ method: 'post', url: '/api/users', data: { name: 'John' } })` — config object
  - `apiBridge.get('/api/users')`, `apiBridge.post()`, etc. — shorthand methods
- **Shorthand methods on default export** — `get`, `post`, `put`, `patch`, `delete`, `head`, `options`, `request`, `postForm`, `putForm`, `patchForm`, `getUri`
- **Default export properties** — `defaults`, `interceptors`, `create`, `all`, `spread`
- **`Axios` class alias** — `apiBridge.Axios === APIBridgeClient` for migration compatibility
- **`AxiosError` class alias** — `apiBridge.AxiosError === ClientError` for migration compatibility
- **`isAxiosError()` function** — Alias for `isClientError()`, enables `apiBridge.isAxiosError(err)`
- **Error code constants on ClientError/AxiosError**:
  - `ERR_NETWORK`, `ERR_CANCELED`, `ERR_BAD_REQUEST`, `ERR_BAD_RESPONSE`
  - `ERR_BAD_OPTION`, `ERR_BAD_OPTION_VALUE`, `ERR_DEPRECATED`, `ERR_NOT_SUPPORT`
  - `ERR_INVALID_URL`, `ERR_FR_TOO_MANY_REDIRECTS`
  - `ECONNABORTED`, `ETIMEDOUT`, `ERR_TIMEOUT`
  - `ERR_MAX_BODY_LENGTH_EXCEEDED`, `ERR_MAX_CONTENT_LENGTH_EXCEEDED`
- **Semantic error codes on HTTP failures** — `ERR_BAD_REQUEST` for 4xx, `ERR_BAD_RESPONSE` for 5xx
- **`delete(url, { data })` body support** — Axios-compatible DELETE with request body
- **Adapter system wired into request pipeline** — `_executeRequest` now uses `getAdapter()` to resolve and dispatch through pluggable adapters (fetch, xhr, custom)
- **`transitional` config option** — `{ silentJSONParsing, forcedJSONParsing, clarifyTimeoutError }`
- **`signal` in defaults** — Default AbortSignal propagation
- **Callable export has all Axios statics** — `CancelToken`, `Cancel`, `AxiosHeaders`, `HttpStatusCode`, `toFormData`, `formToJSON`, `mergeConfig`, `getAdapter`, `buildURL`, `VERSION`
- **Module-level shorthand methods** — `require('api-bridge-ai').get()`, `.post()`, etc.
- **Module-level `interceptors`** — Shared default instance interceptors
- **42 new tests** (808 total, up from 766)
- **Updated TypeScript declarations** with all v12 types, interfaces, and callable export

## [10.0.0] - 2026-04-17

### Added — Complete Axios Replacement
- **CancelToken System** — Axios-compatible request cancellation
  - `CancelToken.source()` factory (most common pattern)
  - `new CancelToken(executor)` executor pattern
  - `isCancel(error)` check for cancellation errors
  - `Cancel` class with `__CANCEL__` flag, `message`, and `toString()`
  - `token.throwIfRequested()`, `token.subscribe()`, `token.unsubscribe()`
  - `token.signal` property bridges to native `AbortSignal`
  - Double-cancel is no-op (idempotent)
- **Basic Auth Support** — `{ auth: { username, password } }` → auto `Authorization: Basic` header
- **Custom `responseType`** — `'json'` (default), `'text'`, `'blob'`, `'arraybuffer'`
- **Custom `validateStatus`** — Function to override success status check (e.g., `(status) => status < 500`)
- **Custom `paramsSerializer`** — Override query string serialization (supports arrays, URLSearchParams)
- **Per-request `transformRequest` / `transformResponse`** — Arrays of transform functions per request
  - `transformRequest: [(data, headers) => modifiedData]`
  - `transformResponse: [(data) => modifiedData]`
- **`maxContentLength` / `maxBodyLength`** — Enforce response/request size limits
  - `ERR_MAX_CONTENT_LENGTH_EXCEEDED` and `ERR_MAX_BODY_LENGTH_EXCEEDED` error codes
- **`onDownloadProgress` / `onUploadProgress`** — Progress callbacks `({ loaded, total, progress, bytes })`
- **`withCredentials`** — Include credentials in cross-origin requests
- **FormData Auto-Detection** — Automatic `Content-Type` handling for FormData, URLSearchParams, Buffer, Stream, ArrayBuffer
- **`toFormData(obj)`** — Convert plain objects to FormData with nested keys, arrays, dates, null handling
  - Prototype pollution protection (`__proto__`, `constructor`, `prototype` keys rejected)
  - Append to existing FormData
- **Type Detection Utilities** — `isFormData()`, `isBlob()`, `isFile()`, `isBuffer()`, `isStream()`, `isArrayBufferView()`, `isURLSearchParams()`
- **`request(config)` Pattern** — Axios-compatible config-object request: `client.request({ method: 'get', url: '/user', data: {} })`
  - Also supports `request(url, config)` pattern
  - Backward compatible with v9 positional args `request(method, url, body, config)`
- **`getUri(config)`** — Build URL without making request: `client.getUri({ url: '/users', params: { page: 1 } })`
- **Mutable `defaults` Object** — Axios-compatible defaults
  - `client.defaults.headers.common['Authorization'] = 'Bearer token'`
  - Per-method headers: `client.defaults.headers.post`, `.put`, `.patch`, `.get`, `.delete`, `.head`, `.options`
  - `client.defaults.timeout`, `.responseType`, `.validateStatus`, `.auth`, etc.
- **Deep Config Merging** — `mergeConfig(target, source)` utility for deep-merging configurations
- **`all()` + `spread()`** — Concurrent request helpers (like `axios.all`, `axios.spread`)
  - `all([api.get('/a'), api.get('/b')]).then(spread((a, b) => ...))`
- **`isClientError()` / `isApiBridgeError()`** — Error type checking (like `axios.isAxiosError`)
  - Available as standalone function and static method `APIBridgeClient.isClientError(err)`
- **`create()` Factory** — Alias for `createClient()` (Axios `axios.create()` pattern)
- **`defaultParamsSerializer()`** — Exported default params serializer with array support
- **Response Shape Enhancement** — `statusText` and `config` now included in response objects
  - `{ data, status, statusText, headers, config, raw? }`
- **`xsrfCookieName` / `xsrfHeaderName`** — XSRF protection configuration
- **`responseEncoding`** — Response encoding configuration
- **`maxRedirects`** — Max redirects configuration
- **`decompress`** — Auto decompress configuration
- **`isApiBridgeError` flag** — Attached to wrapped errors for detection
- 100 new tests (649 total)

### Changed
- `buildURL()` now accepts optional 4th parameter `paramsSerializer` function
- Client error objects now include `config` and `isApiBridgeError` flag
- Updated package description for complete Axios replacement positioning
- Added 13 new keywords: `cancel-token`, `form-data`, `axios-replacement`, `drop-in`, etc.

## [9.0.0] - 2026-04-17

### Added
- **HTTP Client Engine (`createClient`)** — Full-featured fetch-based HTTP client that replaces Axios
  - `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `HEAD`, `OPTIONS` methods
  - `baseURL`, headers, query params, body support
  - Timeout support via `AbortController`
  - Request cancellation via user-supplied `AbortSignal`
  - Retries with exponential backoff + jitter
  - Configurable retryable status codes
- **Axios-Compatible Interceptor System** — `client.interceptors.request.use(fn)` / `client.interceptors.response.use(fn)`
  - `InterceptorManager` and `InterceptorChain` classes
  - Request, response, and error interceptors
  - Async execution support
  - Ejection by ID, clear all
- **Expectation-Aware System** — Declare expected response format inline
  - `expect` property in request config: `client.get("/user", { expect: { userName: "string" } })`
  - Automatic extraction, validation, serialization as `x-api-bridge-expect` header
  - Schema validation with prototype pollution protection (depth/size limits)
  - `validateExpect`, `serializeExpect`, `deserializeExpect`, `extractExpect`, `injectExpectHeader`, `flattenExpect`
- **Smart Proxy Mode** — Response data wrapped in `Proxy` for dynamic field resolution
  - `data.userName` resolves from `user_name`, `USER_NAME`, `usr_nm`, etc.
  - Convention-based lookup (camelCase ↔ snake_case ↔ PascalCase ↔ kebab-case)
  - Case-insensitive fallback
  - Fuzzy matching integration
  - Auto-learning integration (resolved mappings remembered)
  - Nested object proxy wrapping
  - Array element proxying
- **Auto Data Alignment** — Automatic response transformation
  - `snake_case` → `camelCase`
  - `PascalCase` → `camelCase`
  - `kebab-case` → `camelCase`
  - Fuzzy matching (e.g. `usr_nm` → `userName`)
  - Nested and array transformation
- **Type Coercion in Responses** — Based on `expect` schema
  - `"5000"` → `5000` (string → number)
  - `"true"` → `true` (string → boolean)
  - Date strings → `Date` objects
- **Schema-Aware Mode** — `client.setSchema({ userName: String })` for improved mapping accuracy
- **Debug Mode** — `client.enableDebug(true)` logs raw response, expected schema, and transformed output
- **Standardized Error Object** — `ClientError` with `{ message, status, code, details }` and `toJSON()`
- **URL Builder** — `buildURL(base, path, params)` with proper encoding and null/undefined filtering
- **Endpoint Mapping Cache** — Per-endpoint caching of field mappings
- 1 new error class: `ClientError`
- 87 new tests (549 total)

### Changed
- Updated package description for next-gen API client positioning
- Added new keywords: `http-client`, `smart-proxy`, `expectation-engine`, `data-alignment`, `createClient`, `abort-controller`

## [8.0.0] - 2024-01-15

### Added
- **Multi-alias field resolution** — Map one canonical field to many aliases across APIs
- **Schema migration engine** — Version-to-version field mapping with upgrade/downgrade paths
- **Batch request orchestrator** — Parallel/sequential execution with concurrency control
- **Field analytics collector** — Per-field usage tracking, accuracy metrics, coverage reports
- **Conditional transformation rules** — Value/type/context-based dynamic transforms
- **Deep merge engine** — Intelligent object merging with conflict resolution strategies
- **Output formatter** — JSON, XML, CSV, key-value, table, and template output
- **Request interceptor chain** — Priority-ordered, groupable, async interceptors
- 5 new error classes: `FieldAliaserError`, `SchemaMigrationError`, `BatchOrchestratorError`, `DeepMergeError`, `InterceptorError`

### Changed
- **Project structure** — Reorganized into `src/core/`, `src/utils/`, `src/adapters/` for production npm package
- Added TypeScript type declarations
- Added `exports` field in package.json for subpath imports
- Added example usage files

## [7.0.0] - 2024-01-01

### Added
- Weighted ensemble fuzzy matching (7 strategies with tuned weights, 99%+ accuracy)
- N-gram similarity matching for short/garbled field names
- Context-aware matching using sibling field names
- Abbreviation-aware semantic similarity (100+ abbreviation entries)
- Database prefix stripping (tbl_, fk_, pk_, vw_, sp_, idx_)
- Case-insensitive boolean coercion
- Percentage string coercion ("50%" → 0.5)
- Comma-separated number coercion ("1,000" → 1000)
- Expanded synonym dictionary (financial, IoT, education, social domains)

## [6.0.0] - 2023-12-15

### Added
- Enhanced fuzzy matcher (Levenshtein + phonetic + vowel-drop + abbreviation patterns, 97%+ accuracy)
- Cryptic name resolver (prefix stripping, suffix matching, vocabulary-based)
- Schema-based type coercer (automatic coercion of string↔boolean, date strings, numeric strings)
- 3 new error classes: `FuzzyMatchError`, `TypeCoercionError`, `CrypticResolverError`

## [5.0.0] - 2023-12-01

### Added
- Advanced retry strategies (linear, exponential, jitter, custom backoff, retry budget)
- Structured request logger (correlation IDs, field redaction, transports)
- Schema registry (versioned schema storage, compatibility checks, namespaces)
- Response streamer (chunked JSON transformation, field filtering, accumulators)
- API dependency graph (DAG execution, parallel orchestration, cycle detection)
- Mock server (endpoint mocking, request recording, sequence responses)
- Health check monitor (configurable probes, aggregated status, alert callbacks)
- Event bus (typed pub/sub, wildcards, priority listeners, event replay)
- 6 new error classes

## [4.0.0] - 2023-11-15

### Added
- Circuit breaker (fault tolerance, auto-recovery)
- Request deduplication
- GraphQL bridge (response/variable transformation)
- OpenAPI schema importer
- API versioning (version-specific transforms, migration)
- Webhook handler (normalize incoming webhooks)
- JSON Patch generator (RFC 6902)
- Composable pipeline (functional stage-based transformation)
- 4 new error classes

## [3.0.0] - 2023-11-01

### Added
- Plugin system (extensible architecture with hooks)
- Schema inference (auto-generate schemas from data)
- Field projection (pick, omit, rename, reshape, flatten, compact)
- Data masking (PII protection: redact, mask, hash)
- Rate limiting (token bucket, burst, queue)
- Schema diff engine (detect API drift & breaking changes)
- TypeScript type generator
- Metrics collector (timing, counters, percentiles)

## [2.0.0] - 2023-10-15

### Added
- Middleware pipeline (before/after hooks)
- Response caching with TTL
- Retry with exponential backoff
- Response normalization (pagination, errors, envelopes)
- Schema validation
- All HTTP methods (GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS)
- Event-driven monitoring
- Batch transformation
- Bulk learning import/export

## [1.0.0] - 2023-10-01

### Added
- Initial release
- Multi-level mismatch detection (7 levels)
- Automatic case conversion (camelCase, snake_case, PascalCase, kebab-case)
- Synonym-based field matching
- Learning engine with persistence
- Axios and native fetch bridges
