# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
