# 📋 Changelog — awsibnj

All notable changes to this project are documented in this file.  
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) · Versioning follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## 🗂️ Version Index

| Version | Date | Headline | Tests |
|---------|------|----------|------:|
| [19.0.0](#1900---2026-04-21) | 2026-04-21 | 🔬 Fortress Security — Post-Quantum + Behavioral Analytics | 1275 |
| [18.0.0](#1800---2026-04-21) | 2026-04-21 | 🛡️ Elite Security — Zero-Trust + Threat Intel + mTLS | 1178 |
| [17.0.0](#1700---2026-04-20) | 2026-04-20 | ⚔️ Advanced Security — CSP + Cert Pinning + HMAC Signing | 1095 |
| [16.0.0](#1600---2026-04-20) | 2026-04-20 | 🔒 Max Security — SSRF + CRLF + Rate Limiting + Replay | 991 |
| [15.0.0](#1500---2026-04-20) | 2026-04-20 | ✅ Full Axios API Parity — runWhen + auto Content-Type | 918 |
| [14.0.0](#1400---2026-04-20) | 2026-04-20 | 🚀 Enterprise HTTP — Auto-Retry + Cache + Token Refresh | 887 |
| [13.0.0](#1300---2026-04-17) | 2026-04-17 | 🔄 Axios Zero-Gap — AxiosHeaders + isAxiosError | 849 |
| [12.0.0](#1200---2026-04-17) | 2026-04-17 | 📦 True Axios Drop-in — Callable export + full API surface | 808 |
| [10.0.0](#1000---2026-04-17) | 2026-04-17 | 🌐 Complete Axios Replacement — CancelToken + Auth | 649 |
| [9.0.0](#900---2026-04-17)  | 2026-04-17 | ⚡ HTTP Client Engine — createClient + Smart Proxy | 549 |
| [8.0.0](#800---2024-01-15)  | 2024-01-15 | 🏗️ Production Architecture — Multi-alias + Batch + Pipeline | ~462 |
| [7.0.0](#700---2024-01-01)  | 2024-01-01 | 🎯 99%+ Fuzzy Accuracy — 7-strategy weighted ensemble | ~390 |
| [6.0.0](#600---2023-12-15)  | 2023-12-15 | 🔍 Fuzzy + Cryptic + Type Coercion | ~330 |
| [5.0.0](#500---2023-12-01)  | 2023-12-01 | 🔁 Retry Strategies + Schema Registry + Response Streaming | ~249 |
| [4.0.0](#400---2023-11-15)  | 2023-11-15 | 🔌 Circuit Breaker + GraphQL + OpenAPI | ~195 |
| [3.0.0](#300---2023-11-01)  | 2023-11-01 | 🔩 Plugin System + Schema Inference + PII Masking | ~140 |
| [2.0.0](#200---2023-10-15)  | 2023-10-15 | 📡 Middleware + Caching + Batch Transform | ~80 |
| [1.0.0](#100---2023-10-01)  | 2023-10-01 | 🎉 Initial Release — 7-level detection + learning engine | ~40 |

---

## [19.0.0] - 2026-04-21

> 🔬 **Fortress Security Architecture** — Post-Quantum Cryptography · Behavioral Analytics · Honeypot Detection · Subresource Integrity · Event Correlation

### ✨ Added

- **Quantum-Resistant Crypto (`QuantumResistantCrypto`)** — Post-quantum-inspired key derivation & signing
  - Multi-round PBKDF2 key derivation with domain-separation context for maximum classical resistance
  - Double-HMAC signing with configurable `hashRounds` to resist length-extension and pre-image attacks
  - Timing-safe `verify()` using `crypto.timingSafeEqual` to prevent timing-oracle attacks
  - Key diversification via context strings — same master key produces different derived keys per domain
  - `deriveKey(password, salt, context)` → 32-byte derived key (PBKDF2 + HMAC)
  - `sign(data, context)` → `{ signature, timestamp, context, algorithm }` with double-HMAC
  - `verify(data, signature, timestamp, context, tolerance)` → timing-safe boolean
  - `hashRounds: 200000` default for high entropy; configurable for performance tuning
  - `quantumCrypto: { hashRounds: 200000, signatureAlgorithm: 'sha512' }` in client config

- **Behavioral Analytics (`BehavioralAnalytics`)** — Anomaly detection via request pattern analysis
  - Sliding-window statistics per endpoint: mean, standard deviation, percentiles
  - Rate anomaly detection: flags bursts more than `anomalyThreshold` σ above baseline
  - Unusual hour detection: flags requests outside the historical active window
  - Endpoint diversity: flags when a single client accesses too many distinct endpoints
  - `analyze(request)` → `{ anomalous, score, reasons[], riskLevel }` with four risk levels: `low/medium/high/critical`
  - `updateBaseline(endpoint, data)` — feed new observations to update statistics
  - `getEndpointStats(endpoint)` — retrieve rolling window statistics
  - `behavioralAnalytics: { anomalyThreshold: 2.5, windowMs: 60000 }` in client config

- **Honeypot Manager (`HoneypotManager`)** — Canary endpoint detection & attacker identification
  - Register decoy endpoints that no legitimate client should ever access
  - Token-based canary injection: embed invisible sentinel values in responses
  - `registerTrap(path, options)` — create a honeypot endpoint
  - `checkRequest(path, token)` → `{ tripped, severity, trapId }` — detect access or token exposure
  - `injectToken(response, endpoint)` — embed canary token into response data
  - `getTrips()` — retrieve all honeypot activation events
  - `honeypot: { traps: ['/admin/.env', '/backup.sql'], tokenInjection: true }` in client config

- **Subresource Integrity (`SubresourceIntegrity`)** — Hash-verify external content
  - SHA-256 / SHA-384 / SHA-512 content hashing matching the W3C SRI specification
  - `generateIntegrity(content, algorithm)` → `sha256-<base64hash>` SRI string
  - `verifyIntegrity(content, integrityString)` → boolean
  - `verifyResponse(response, expectedHash)` → verify HTTP response body integrity
  - `sri: { algorithm: 'sha384', enforce: true }` in client config

- **Request Throttle Guard (`RequestThrottleGuard`)** — Multi-tier traffic shaping
  - Three enforcement levels: `ALLOW` → `THROTTLE` → `BLOCK`
  - Per-endpoint independent buckets with separate `throttleRate` and `blockRate` thresholds
  - Graduated response: throttled requests get `Retry-After` metadata; blocked requests throw
  - `check(endpoint)` → `{ level, retryAfter, currentRate }` — granular decision
  - `getStatus(endpoint)` → live bucket state and current level
  - `throttleGuard: { blockRate: 200, throttleRate: 100 }` in client config

- **Geofence Guard (`GeofenceGuard`)** — IP-to-region access control
  - Allow or deny requests based on geographic IP classification
  - IANA-based region detection from IP structure (private/loopback/public classification)
  - Configurable `allowedRegions`, `blockedRegions`, and per-IP override lists
  - `check(ip)` → `{ allowed, region, reason }` — geographic access decision
  - `addAllowedRegion(region)` / `addBlockedRegion(region)` — dynamic policy update
  - `geofence: { allowedRegions: ['US', 'EU'], blockedRegions: ['CN'] }` in client config

- **Crypto Key Rotator (`CryptoKeyRotator`)** — Automated key lifecycle management
  - Schedule automatic key rotation with configurable `rotationIntervalMs`
  - Supports multi-algorithm key pairs (symmetric AES, HMAC-SHA256, RSA-style)
  - Keeps `N` previous key versions for decryption of in-flight data (configurable `retainVersions`)
  - `generateKey(algorithm)` → new cryptographic key for the given algorithm
  - `rotateKey(keyId)` → rotate key immediately, archive old version
  - `getActiveKey(algorithm)` → current active key for the algorithm
  - `getKeyVersion(keyId, version)` → retrieve archived key version
  - `keyRotator: { rotationIntervalMs: 86400000, retainVersions: 3 }` in client config

- **Security Event Correlator (`SecurityEventCorrelator`)** — Coordinated-attack detection
  - Aggregates security events across the entire pipeline into time-windowed buckets
  - Correlation rules: fire alerts when multiple event types occur together (e.g. rate-limit + SSRF + threat-intel within 60 s)
  - Severity-weighted scoring: critical events score 10x, warnings score 1x
  - `recordEvent(event)` — push a security event into the correlation engine
  - `getAlerts()` → `[{ rule, events, score, timestamp }]` — active correlation alerts
  - `getStats()` → event counts by type, active alert count, last correlation time
  - `eventCorrelator: { windowMs: 60000, alertThreshold: 5 }` in client config

### 🔴 New Error Codes (v19)

| Error Code | Thrown By | Trigger Condition |
|------------|-----------|-------------------|
| `ERR_QUANTUM_VERIFY_FAILED` | `QuantumResistantCrypto` | Signature verification failed |
| `ERR_BEHAVIORAL_ANOMALY` | `BehavioralAnalytics` | Anomalous request pattern detected |
| `ERR_HONEYPOT_TRIP` | `HoneypotManager` | Canary endpoint accessed |
| `ERR_SRI_MISMATCH` | `SubresourceIntegrity` | Response hash mismatch |
| `ERR_THROTTLE_BLOCKED` | `RequestThrottleGuard` | Request blocked at BLOCK level |
| `ERR_GEOFENCE_BLOCKED` | `GeofenceGuard` | Request from restricted IP region |
| `ERR_KEY_ROTATION_FAILED` | `CryptoKeyRotator` | Key operation failed |
| `ERR_CORRELATION_ALERT` | `SecurityEventCorrelator` | Coordinated attack alert raised |

### 🔧 Changed

- Security pipeline extended with 4 additional v19 stages after existing v18 checks
- Package version bumped to `19.0.0` · 1275 tests (97 new)
- TypeScript definitions updated with all v19 classes, interfaces, and options

---

## [18.0.0] - 2026-04-21

> 🛡️ **Elite Security Architecture** — Zero-Trust · Threat Intelligence · Secure Sessions · Request Integrity Chain · Adaptive Rate Limiting · OWASP Headers · Encrypted Vault · mTLS

### ✨ Added

- **Zero Trust Engine (`ZeroTrustEngine`)** — Continuous verification, never implicit trust
  - Every request evaluated against accumulated trust score
  - Dynamic trust factors: known context (+20), consistent IP (+10), consistent user-agent (+10), non-suspicious method (+10)
  - Time-based trust decay with configurable `decayRate` and `decayIntervalMs`
  - `evaluate(context)` → `{ allowed, score, factors }` · `updateTrust(id, delta)` · `revokeTrust(id)`
  - `zeroTrust: { trustThreshold: 50, maxTrustScore: 100, decayRate: 5 }` in client config

- **Threat Intelligence (`ThreatIntelligence`)** — Real-time IP reputation & attack detection
  - IP blocklist with auto-block after suspicious activity threshold
  - URL pattern blocking (regex/string), known attack pattern detection in headers
  - `assess(request)` → `{ threat, level, reasons, blocked }` with severity: `none/low/medium/high/critical`
  - `threatIntel: { blockedIPs: [], suspiciousThreshold: 5, autoBlock: true }` in client config

- **Secure Session Manager (`SecureSessionManager`)** — Cryptographic session tokens
  - `crypto.randomBytes`-based 32-byte hex tokens bound to IP and User-Agent
  - Auto-rotation every 15 minutes; immediate revocation support
  - `sessionManager: { tokenLength: 32, maxAge: 3600000, bindToIP: true, rotationInterval: 900000 }` in client config

- **Request Integrity Chain (`RequestIntegrityChain`)** — Blockchain-inspired request lineage
  - SHA-256 chained hashes: `H(prevHash + method + url + timestamp + bodyHash)`
  - `verify()` → `{ valid, brokenAt, chainLength }` — detect any tampering
  - `integrityChain: { algorithm: 'sha256', maxChainLength: 10000 }` in client config

- **Adaptive Rate Limiter (`AdaptiveRateLimiter`)** — ML-inspired anomaly detection
  - Token bucket with dynamically adapted rates based on standard-deviation statistics
  - `acquire(key)` → `{ allowed, remaining, anomaly, currentRate }`
  - `adaptiveRateLimiter: { baseRate: 100, windowMs: 60000, anomalyThreshold: 2.0 }` in client config

- **Security Headers Manager (`SecurityHeadersManager`)** — All OWASP-recommended headers
  - HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, COEP, COOP, CORP
  - `buildHeaders()` · `validate()` → security score 0–100
  - `securityHeaders: { hsts: { maxAge: 31536000 }, frameOptions: 'DENY' }` in client config

- **Encrypted Config Vault (`EncryptedConfigVault`)** — AES-256-GCM secret storage
  - Encrypted storage with random IV per entry, 16-byte authentication tag
  - `store(key, value)` · `retrieve(key)` · `rotateMasterKey(newKey)` · `export()` / `import()`
  - `configVault: { masterKey: 'hex-encoded-32-byte-key' }` in client config

- **Mutual TLS Manager (`MutualTLSManager`)** — mTLS certificate lifecycle
  - Trusted CA fingerprint store, revocation list, expiry validation
  - `validateClientCert(cert)` → `{ valid, reason, trusted }`
  - `mtls: { trustedCerts: ['sha256-fp'], requireClientCert: true }` in client config

### 🔴 New Error Codes (v18)

| Error Code | Trigger |
|------------|---------|
| `ERR_ZERO_TRUST_DENIED` | Trust score below threshold |
| `ERR_THREAT_DETECTED` | IP blocked / attack pattern found |
| `ERR_SESSION_INVALID` | Expired, hijacked, or revoked session |
| `ERR_INTEGRITY_VIOLATION` | Request chain tampered |
| `ERR_ADAPTIVE_RATE_LIMITED` | Anomalous traffic pattern |
| `ERR_MTLS_FAILED` | Certificate validation failure |
| `ERR_VAULT_ACCESS_DENIED` | Config vault access denied |
| `ERR_SECURITY_HEADER_VIOLATION` | Security header check failed |

### 🔧 Changed

- Security pipeline extended through 12 stages ending with `→ Security Headers → Execute`
- 1178 tests (120+ new) · Package version bumped to `18.0.0`
- TypeScript definitions updated with all v18 classes, interfaces, and options

---

## [17.0.0] - 2026-04-20

> ⚔️ **Advanced Security** — Content Security Policy · Certificate Pinning · HMAC Request Signing · Input Sanitization · RBAC · AES-256-GCM Encryption · Idempotency

### ✨ Added

- **Content Security Policy (`ContentSecurityPolicy`)** — Build standards-compliant CSP headers from configurable directives. Nonce generation, report-only mode, `reportUri`
- **Certificate Pinning (`CertificatePinning`)** — SHA-256 hash verification per host. Enforce or report mode, subdomain support, dynamic pin management
- **Request Signing (`RequestSigning`)** — HMAC-SHA256 canonical string signing. Auto-injects `x-signature`, `x-timestamp`, `x-signed-headers` into request pipeline
- **Input Sanitizer (`InputSanitizer`)** — XSS / SQL injection / path traversal prevention. Three modes: `escape`, `strip`, `reject`. Deep object sanitization with `maxDepth` limit
- **Security Audit Logger (`SecurityAuditLogger`)** — Tamper-proof append-only SHA-256 hash chain log. Severity levels, filtering, auto-rotation, `onAlert` callback
- **Permission Policy (`PermissionPolicy`)** — Role-based method + endpoint access control. Wildcard patterns (`/api/*`), multi-role checks, dynamic policy management
- **Payload Encryptor (`PayloadEncryptor`)** — AES-256-GCM authenticated encryption. Random 12-byte IV per encryption, 16-byte auth tag, key rotation, fingerprinting
- **Idempotency Manager (`IdempotencyManager`)** — UUID v4 idempotency keys for POST/PUT/PATCH. Response caching with TTL, duplicate detection

### 🔴 New Error Codes (v17)

`ERR_CSP_VIOLATION` · `ERR_CERT_PIN_FAILED` · `ERR_SIGNATURE_INVALID` · `ERR_INPUT_REJECTED` · `ERR_PERMISSION_DENIED` · `ERR_ENCRYPTION_FAILED` · `ERR_DECRYPTION_FAILED` · `ERR_IDEMPOTENCY_CONFLICT`

### 🔧 Changed

- Security pipeline: `SSRF → Headers → Rate Limit → Replay → Permissions → Input Sanitize → Sign → Idempotency → Execute`
- 1095 tests (104 new) · Package version bumped to `17.0.0`

---

## [16.0.0] - 2026-04-20

> 🔒 **Maximum Security & Enterprise Hardening** — SSRF Protection · CRLF Prevention · Rate Limiting · Replay Detection · Sensitive Data Redaction · Prototype Pollution Defense

### ✨ Added

- **SSRF Guard (`SSRFGuard`)** — Blocks private IPs (RFC 1918), cloud metadata endpoints (`169.254.169.254`, `metadata.google.internal`), dangerous protocols (`file://`, `data://`, `javascript://`). **Enabled by default** · `ssrf: { enabled: false }` to disable for testing
- **Header Injection Prevention (`HeaderValidator`)** — RFC 7230 token validation, CR/LF character rejection, configurable `maxHeadersCount` (100) and `maxHeaderSize` (8192 bytes)
- **Client-Side Rate Limiter (`RequestRateLimiter`)** — Token bucket; `maxRequests` / `windowMs` / per-endpoint buckets · `rateLimiter: { maxRequests: 50, windowMs: 10000 }`
- **Response Size Guard (`ResponseSizeGuard`)** — `maxResponseSize` enforcement, Content-Length pre-check, streaming byte tracker
- **Sensitive Data Redactor (`SensitiveDataRedactor`)** — Auto-strips `Authorization`, `Cookie`, `X-API-Key` from error objects. `redactURL()` strips token/secret query params
- **Request Fingerprinter (`RequestFingerprinter`)** — SHA-256 content fingerprinting; `replayDetection: 5000` blocks duplicate requests within window
- **Prototype Pollution Hardening** — `safeMerge()`, `sanitizeObject()`, `isPrivateIP()` exported utilities
- **Request Journey Tracking** — `journeyTracking: true` adds `response.journey` with full attempt history, cache hits, token refresh events, timing

### 🔴 New Error Codes (v16)

`ERR_SSRF_BLOCKED` · `ERR_HEADER_VALIDATION` · `ERR_RATE_LIMITED` · `ERR_DUPLICATE_REQUEST` · `ERR_RESPONSE_TOO_LARGE`

### 🔧 Changed

- Security pipeline: `SSRF → Headers → Rate Limit → Replay Detection → Execute`
- Error objects auto-redact sensitive config before serialization
- 991 tests (73 new) · Package version bumped to `16.0.0`

---

## [15.0.0] - 2026-04-20

> ✅ **Full Axios Replacement** — Closing every remaining API gap

### ✨ Added

- **Interceptor `runWhen` option** — `interceptors.request.use(fn, null, { runWhen: (config) => boolean })` — skip interceptor conditionally
- **Interceptor `synchronous` option** — `{ synchronous: true }` skips `await` overhead for simple handlers
- **Auto Content-Type serialization** — Object + `application/x-www-form-urlencoded` → `URLSearchParams`; Object + `multipart/form-data` → `FormData`
- **Enhanced `paramsSerializer`** — Accepts `{ encode, serialize }` object (Axios 1.x form) in addition to legacy function
- **`beforeRedirect` callback** — `(options, { headers, status, location }) => void`
- **Request correlation IDs** — `requestId: true` → auto-generates `x-request-id`; `requestId: 'X-Correlation-ID'` → custom header name
- **`AxiosHeaders.fromString()`** — Parse raw HTTP header strings
- **`AxiosHeaders.toJSON()` filter** — Filter by array of names or RegExp
- **Additional AxiosHeaders accessors** — `getUserAgent`, `setUserAgent`, `getContentEncoding`, `setContentEncoding`, `getContentDisposition`, `setContentDisposition` (+ `has*` variants)

### 🔧 Changed

- 918 tests (31 new) · Package version bumped to `15.0.0`

---

## [14.0.0] - 2026-04-20

> 🚀 **Enterprise-Grade HTTP Client** — Production Power Tools

### ✨ Added

- **Auto-Retry Engine** — `retryConfig: { retries, retryCondition, retryDelay, onRetry, shouldResetTimeout }`. Per-request override supported
- **Response Caching** — TTL cache with `maxSize`, `methods`, `exclude` patterns, `staleWhileRevalidate`, custom `keyGenerator`. `client.clearResponseCache()`
- **Request Deduplication** — `dedupe: { enabled, methods, keyGenerator }` — identical in-flight requests share one network call
- **Auto Token Refresh** — `tokenRefresh: { onRefresh, statusCodes, maxRetries, headerName, tokenPrefix }` — transparent 401 handling with request queuing
- **Request Timing** — `timing: true` → `response.duration` and `response.timing: { start, end, duration }`
- **Lifecycle Hooks** — `hooks: { onRequest, onResponse, onError, onRetry }` — fire-and-forget observers (arrays or single functions)

### 🔧 Changed

- 887 tests (38 new) · Package version bumped to `14.0.0`

---

## [13.0.0] - 2026-04-17

> 🔄 **Complete Axios Zero-Gap Compatibility**

### ✨ Added

- **AxiosHeaders in all responses** — Case-insensitive `get/set/has/delete`, `normalize`, `merge`, `toJSON`, `toString`, iterator
- **`response.request` property** — Every response includes the request object (URL, method)
- **Default `transformRequest` chain** — Auto JSON.stringify for object payloads with Content-Type detection
- **Default `transformResponse` chain** — Auto JSON.parse for string responses with safe fallback
- **`.isAxiosError` property** — `error.isAxiosError === true` on all `ClientError` instances (Axios duck-typing)
- **`data` alias in response config** — `response.config.data` mirrors `response.config.body`
- **`maxRate` config option** — Upload/download rate throttling `{ maxRate: [uploadBps, downloadBps] }`
- **`lookup` DNS option** — Custom DNS resolution function for Node.js

### 🔧 Changed

- 849 tests (41 new) · Package version bumped to `13.0.0`

---

## [12.0.0] - 2026-04-17

> �� **True Axios Drop-in** — Callable export · Full API surface

### ✨ Added

- **Callable default export** — `apiBridge('/api/users')` works exactly like `axios('/api/users')`
- **All shorthand methods** — `get`, `post`, `put`, `patch`, `delete`, `head`, `options`, `request`, `postForm`, `putForm`, `patchForm`, `getUri`
- **`Axios` class alias** — `apiBridge.Axios === awsibnjClient`
- **`AxiosError` class alias** — `apiBridge.AxiosError === ClientError`
- **`isAxiosError()` function** — Alias for `isClientError()`
- **Error code constants** — `ERR_NETWORK`, `ERR_CANCELED`, `ERR_BAD_REQUEST`, `ERR_BAD_RESPONSE`, `ERR_INVALID_URL`, `ECONNABORTED`, `ETIMEDOUT` and more
- **`transitional` config option** — `{ silentJSONParsing, forcedJSONParsing, clarifyTimeoutError }`
- **Callable export statics** — `CancelToken`, `Cancel`, `AxiosHeaders`, `HttpStatusCode`, `toFormData`, `mergeConfig`, `VERSION`

### 🔧 Changed

- 808 tests (42 new) · Package version bumped to `12.0.0`

---

## [10.0.0] - 2026-04-17

> 🌐 **Complete Axios Replacement** — CancelToken · Basic Auth · Custom Adapters

### ✨ Added

- **CancelToken System** — `CancelToken.source()`, `new CancelToken(executor)`, `isCancel()`, token-to-AbortSignal bridge
- **Basic Auth** — `{ auth: { username, password } }` → auto `Authorization: Basic` header
- **Custom `responseType`** — `json` · `text` · `blob` · `arraybuffer`
- **Custom `validateStatus`** — Override success criteria (e.g. `(status) => status < 500`)
- **Custom `paramsSerializer`** — Override query string serialization
- **Per-request transforms** — `transformRequest` / `transformResponse` arrays
- **`maxContentLength` / `maxBodyLength`** — Size enforcement with error codes
- **Progress callbacks** — `onDownloadProgress` / `onUploadProgress` with `{ loaded, total, progress, bytes }`
- **`toFormData(obj)`** — Convert objects to FormData (prototype pollution protected)
- **Mutable `defaults`** — `client.defaults.headers.common['Authorization']`, per-method headers
- **`all()` + `spread()`** — Concurrent request helpers
- **`request(config)` pattern** — Axios-compatible config-object requests

### 🔧 Changed

- 649 tests (100 new) · Package version bumped to `10.0.0`

---

## [9.0.0] - 2026-04-17

> ⚡ **HTTP Client Engine** — Full-featured fetch-based Axios replacement

### ✨ Added

- **`createClient()`** — `baseURL`, headers, params, body, timeout, AbortSignal, retries, retryable status codes
- **Axios-Compatible Interceptor System** — `InterceptorManager` + `InterceptorChain`, async execution, eject by ID
- **Expectation-Aware System** — Declare expected response format inline with `expect:` in request config
- **Smart Proxy Mode** — `data.userName` resolves from `user_name`, `USER_NAME`, `usr_nm`, etc. via convention + fuzzy
- **Auto Data Alignment** — `snake_case → camelCase`, `PascalCase → camelCase`, `kebab-case → camelCase` in all responses
- **Type Coercion in Responses** — Based on `expect` schema; `"5000"` → `5000`, `"true"` → `true`
- **Schema-Aware Mode** — `client.setSchema({ userName: String })` for improved mapping
- **Debug Mode** — `client.enableDebug(true)` logs raw response, schema, transformed output
- **`ClientError`** — Standardized error `{ message, status, code, details }` with `toJSON()`
- **`buildURL()`** — `buildURL(base, path, params)` with proper encoding

### 🔧 Changed

- 549 tests (87 new) · Package version bumped to `9.0.0`

---

## [8.0.0] - 2024-01-15

> 🏗️ **Production Architecture** — Multi-Alias · Schema Migration · Batch Orchestration · Conditional Transforms

### ✨ Added

- **Multi-Alias Field Resolution (`FieldAliaser`)** — One canonical field mapped to many API-specific aliases. Bulk import/export, conflict detection, per-API override
- **Schema Migration Engine (`SchemaMigrator`)** — Forward/backward version migration with rename, add, remove, transform steps. Dry-run, rollback, auto-chain through intermediate versions
- **Batch Request Orchestrator (`BatchOrchestrator`)** — Parallel + sequential execution with `concurrency`, `failureStrategy`, `maxRetries`, progress callbacks, aggregation
- **Field Analytics Collector (`FieldStats`)** — Per-field usage tracking, accuracy metrics, coverage reports, low-confidence field detection
- **Conditional Transform Rules (`ConditionalTransform`)** — Value/type/context-based dynamic transforms with priority ordering and `otherwise` fallbacks
- **Deep Merge Engine (`DeepMerge`)** — Intelligent object merging: `concat/union/replace/interleave` array strategies, custom conflict resolvers, prototype pollution protection
- **Output Formatter (`OutputFormatter`)** — JSON, XML, CSV, key-value, table, and Mustache-style template output
- **Request Interceptor Chain (`RequestInterceptor`)** — Priority-ordered, groupable, short-circuit-capable interceptors with per-interceptor error handling
- **5 new error classes** — `FieldAliaserError`, `SchemaMigrationError`, `BatchOrchestratorError`, `DeepMergeError`, `InterceptorError`
- **Reorganized project structure** — `src/core/`, `src/utils/`, `src/adapters/`, TypeScript declarations, `exports` subpath map

---

## [7.0.0] - 2024-01-01

> 🎯 **99%+ Fuzzy Accuracy** — Weighted Ensemble · N-Gram · Context-Aware · Database Prefixes

### ✨ Added

- **Weighted ensemble fuzzy matching** — 7 strategies (Levenshtein, token match, vowel-drop, phonetic, abbreviation, n-gram, substring) with tuned weights → 99%+ accuracy
- **N-gram similarity** — Bigram-based Dice coefficient for short/garbled field names
- **Context-aware field resolution** — Sibling field names used as matching context
- **Abbreviation-aware semantics** — `txn_id` → `transactionId`, `inv_num` → `invoiceNumber` (100+ abbreviations)
- **Database prefix stripping** — `tbl_`, `fk_`, `pk_`, `vw_`, `sp_`, `idx_`, `fn_` prefixes auto-stripped before matching
- **Enhanced type coercion** — Case-insensitive booleans (`TRUE`, `Yes`, `OFF`), percentage strings (`50%` → `0.5`), comma-separated numbers (`1,000` → `1000`), `DD/MM/YYYY` dates, comma-separated arrays
- **4 new synonym domains** — Financial (60+ groups), IoT/Hardware, Education, Social

---

## [6.0.0] - 2023-12-15

> 🔍 **Advanced Matching** — Fuzzy · Cryptic Resolution · Type Coercion

### ✨ Added

- **Enhanced Fuzzy Matcher** — Levenshtein + phonetic + vowel-drop + abbreviation patterns → 97%+ accuracy. 80+ built-in abbreviation mappings
- **Cryptic Name Resolver** — Cryptic prefix stripping (`z9_`), suffix matching (`_flag`), vocabulary fragment matching, token overlap
- **Schema-Based Type Coercer** — `string → boolean/integer/float/date/array/json` coercion, conflict detection, batch processing, statistics
- **3 new error classes** — `FuzzyMatchError`, `TypeCoercionError`, `CrypticResolverError`

---

## [5.0.0] - 2023-12-01

> 🔁 **Reliability & Observability** — Retry · Logging · Schema Registry · Streaming · DAG · Mock · Health · Events

### ✨ Added

Advanced retry strategies (linear/exponential/jitter, retry budget, abort signal) · Structured request logger (correlation IDs, field redaction, transports) · Schema registry (versioned storage, compatibility checks, namespaces) · Response streamer (chunked JSON, field filtering, accumulators) · API dependency graph (DAG, parallel, cycle detection) · Mock server (wildcard patterns, sequences, request assertion) · Health check monitor (configurable probes, aggregated status) · Event bus (typed pub/sub, wildcards, priority, replay) · 6 new error classes

---

## [4.0.0] - 2023-11-15

> 🔌 **Ecosystem Integrations** — Circuit Breaker · GraphQL · OpenAPI · Versioning · Webhooks · JSON Patch · Pipeline

### ✨ Added

Circuit breaker (fault tolerance, CLOSED/OPEN/HALF_OPEN states) · Request deduplication · GraphQL bridge (response/variable transform, `__typename` stripping) · OpenAPI importer (v2/v3, `$ref` resolution) · API versioning (version-specific transforms, migration chains) · Webhook handler (normalize payloads, signature verification, custom providers) · JSON Patch generator (RFC 6902, prototype pollution protected) · Composable pipeline (branch, parallel, conditional stages, dynamic insert/remove) · 4 new error classes

---

## [3.0.0] - 2023-11-01

> 🔩 **Extensibility & PII Protection** — Plugin System · Schema Inference · Field Projection · Data Masking

### ✨ Added

Plugin system with 8 hook points (`beforeTransform`, `afterTransform`, `beforeValidate`, `afterValidate`, `onMismatch`, `onError`, `beforeRequest`, `afterRequest`) · Schema inference (auto-generate from samples, pattern detection, merge) · Field projection (pick/omit/rename/reshape/flatten/compact) · Data masking (PII redaction, mask, SHA-256 hash, custom rules) · Rate limiter (token bucket, burst, queue) · Schema diff engine (breaking change detection, rename detection) · TypeScript type generator (interfaces, guards, nested types) · Metrics collector (percentiles, counters, summaries)

---

## [2.0.0] - 2023-10-15

> 📡 **Production Middleware** — Pipeline · Caching · Retry · Normalization · Validation

### ✨ Added

Middleware pipeline (before/after hooks) · Response caching with TTL · Retry with exponential backoff · Response normalization (pagination, errors, envelopes) · Schema validation · All HTTP methods (GET/POST/PUT/PATCH/DELETE/HEAD/OPTIONS) · Event-driven monitoring · Batch transformation · Bulk learning import/export

---

## [1.0.0] - 2023-10-01

> 🎉 **Initial Release** — 7-level detection engine · Learning · Axios bridge · Fetch bridge

### ✨ Added

- 7-level field mismatch detection and correction
- Automatic case conversion (camelCase ↔ snake_case ↔ PascalCase ↔ kebab-case)
- Semantic synonym matching (built-in dictionary)
- Learning engine with persistence (`approve`, `reject`, `bulkImport/Export`)
- Axios bridge (`bridge()`) and native fetch bridge (`bridgeFetch()`)
