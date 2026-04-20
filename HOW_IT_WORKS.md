# How APIBridge Works

APIBridge solves one problem: **your backend sends field names in one style, your frontend expects another.**

For example, your API returns `first_name` but your React app uses `firstName`. Instead of writing manual mapping for every field, APIBridge does it automatically.

---

## The Core Idea

```
Backend Response              APIBridge              Your Frontend
─────────────────          ──────────────          ─────────────────
{                    →     auto-detects     →     {
  "first_name": "John"      & converts              "firstName": "John"
  "last_name": "Doe"                                "lastName": "Doe"
  "is_active": true                                 "isActive": true
}                                                 }
```

No config needed for simple cases. It just works.

---

## How Mismatches Are Resolved

When APIBridge sees a field name, it goes through **7 levels** to figure out the correct mapping. It stops at the first level that gives a confident answer.

### Level 1 — Exact Match (100% confidence)

The field is already in your target convention. Nothing to do.

```
Input:  "firstName"    Target: camelCase
Result: "firstName"    → already correct, skip
```

### Level 2 — Learned Mapping (99% confidence)

You approved this mapping before. APIBridge remembers it.

```
Input:  "usr_nm"
Result: "userName"     → you approved this last week, reuse it
```

### Level 3 — Schema Defined (100% confidence)

You provided an explicit mapping in your schema config.

```js
const schema = {
  userName: { column: 'usr_nm' }
};
// "usr_nm" → "userName" (you told it exactly what to do)
```

### Level 4 — Pattern Conversion (97% confidence)

Pure algorithm. It splits the field into words and reassembles in your target style.

```
"user_name"  → split: ["user", "name"]  → camelCase: "userName"
"firstName"  → split: ["first", "name"] → snake_case: "first_name"
```

This handles standard conversions between `snake_case`, `camelCase`, `PascalCase`, `kebab-case`, and `SCREAMING_SNAKE`.

### Level 5 — Synonym Match (92% confidence)

APIBridge has a built-in dictionary of 160+ developer vocabulary synonym groups spanning multiple domains (person, contact, auth, status, dates, media, pricing, healthcare, analytics, infrastructure, financial, IoT, education, social). It knows that `phone`, `mobile`, `cell`, `tel`, and `contact_number` all mean the same thing.

```
Input:  "cell_number"
Result: "phone"        → recognized as synonym for "phone"
```

### Level 6 — Fuzzy + Semantic Match (70–95% confidence)

When a schema is provided, APIBridge compares the field against schema keys using a **weighted ensemble of 7 strategies**: Levenshtein distance, token matching, vowel-drop detection, phonetic similarity, abbreviation expansion, n-gram overlap, and substring containment.

All strategies are combined with tuned weights and the ensemble score is compared against the best individual strategy. Multiple strategies agreeing boosts confidence further. The semantic similarity engine also expands abbreviations (`txn` → `transaction`, `dev` → `device`, etc.) before comparing tokens.

```
Input:  "usr_email"   Schema has: "userEmail"
Result: "userEmail"   → weighted ensemble match with 92% confidence

Input:  "txn_id"      Schema has: "transactionId"
Result: "transactionId" → abbreviation expansion + token match
```

### Level 7 — Best Effort with Cryptic Resolution (55–70% confidence)

When nothing else matches, APIBridge attempts to resolve cryptic/arbitrary field names by:
- Stripping cryptic prefixes (`x_`, `z9_`, etc.)
- Stripping database prefixes (`tbl_`, `fk_`, `pk_`, `vw_`, `sp_`, `idx_`)
- Matching by suffixes (`_id`, `_flag`, `_date`)
- Checking fragments against known vocabulary with n-gram similarity
- N-gram based matching for short/garbled names

All Level 7 results are flagged for your review.

```
Input:  "z9_ref_id"
Result: "referenceId"  → cryptic prefix stripped, matched against schema

Input:  "tbl_user_name"
Result: "userName"     → database prefix stripped, matched

Input:  "xq_flag"
Result: "xqFlag"       → converted but flagged for review
```

---

## V8 New Capabilities

### Multi-Alias Field Resolution

When different APIs use different names for the same concept, the FieldAliaser maps them all to a canonical name:

```js
const { FieldAliaser } = require('api-bridge-ai');
const aliaser = new FieldAliaser();
aliaser.register('userId', ['user_id', 'uid', 'member_id']);
aliaser.resolve('uid'); // { canonical: 'userId', matched: true }
```

### Schema Migration

When your API's field names change across versions, the SchemaMigrator upgrades or downgrades data automatically:

```js
const { SchemaMigrator } = require('api-bridge-ai');
const migrator = new SchemaMigrator();
migrator.define('1.0', '2.0', { rename: { user_name: 'username' }, add: { version: '2.0' } });
migrator.migrate(data, '1.0', '2.0'); // Applies renames, adds, removes, transforms
```

### Batch Orchestration

Execute multiple API calls with concurrency control, failure handling, and result aggregation:

```js
const { BatchOrchestrator } = require('api-bridge-ai');
const batch = new BatchOrchestrator({ concurrency: 5 });
await batch.executeParallel([
  { id: 'users', execute: () => fetchUsers() },
  { id: 'orders', execute: () => fetchOrders() },
]);
```

### Deep Merge

Intelligently merge responses from multiple APIs with configurable conflict resolution:

```js
const { DeepMerge } = require('api-bridge-ai');
const merger = new DeepMerge({ arrayStrategy: 'union' });
const combined = merger.merge(apiResponse1, apiResponse2, apiResponse3);
```

### Conditional Transforms

Apply different transformations based on field values, types, or context:

```js
const { ConditionalTransform } = require('api-bridge-ai');
const ct = new ConditionalTransform();
ct.when('nullToNA', (v) => v === null, () => 'N/A');
ct.when('vipDiscount', (v, field, ctx) => ctx.isVip, (v) => v * 0.8, { fields: ['price'] });
```

### Output Formatting

Format transformed data into XML, CSV, key-value pairs, tables, or custom templates:

```js
const { OutputFormatter } = require('api-bridge-ai');
const fmt = new OutputFormatter();
fmt.toXML(data);   // XML output
fmt.toCSV(data);   // CSV output
fmt.toTable(data);  // Console table
fmt.fromTemplate(data, 'Hello {{name}}');
```

### Request Interceptor Chain

Priority-ordered, groupable interceptors for modifying requests and responses:

```js
const { RequestInterceptor } = require('api-bridge-ai');
const interceptor = new RequestInterceptor();
interceptor.useRequest('addAuth', (ctx) => ({
  ...ctx, headers: { ...ctx.headers, Authorization: 'Bearer token' }
}), { priority: 100, group: 'auth' });
```

---

## Using APIBridge in Your Project

### Install

```bash
npm install api-bridge-ai
```

### Option 1: As Axios Replacement (v13 — Recommended)

```js
const apiBridge = require('api-bridge-ai');

// Create a client instance (like axios.create())
const api = apiBridge.create({
  baseURL: 'https://api.example.com',
  timeout: 5000,
  headers: { 'X-Custom': 'value' },
});

// Make requests — identical to Axios API
const res = await api.get('/users/1');
console.log(res.data);            // Parsed + transformed response
console.log(res.status);          // 200
console.log(res.statusText);      // 'OK'
console.log(res.headers);         // AxiosHeaders (case-insensitive)
console.log(res.config);          // Request config (with .data alias)
console.log(res.request);         // Request object

// Headers are AxiosHeaders instances (v13)
res.headers.get('content-type');   // 'application/json'
res.headers.has('Authorization');  // false
res.headers.toJSON();              // Plain object

// Error handling with .isAxiosError (v13)
try {
  await api.get('/missing');
} catch (err) {
  if (err.isAxiosError) {                      // ✅ Property check
    console.log(err.code);                     // 'ERR_BAD_REQUEST'
    console.log(err.response.status);          // 404
    console.log(err.response.headers.get('content-type')); // AxiosHeaders
    console.log(err.request);                  // Request object
  }
}

// Interceptors
api.interceptors.request.use((config) => {
  config.headers['Authorization'] = 'Bearer token';
  return config;
});

// Default transforms (v13 — automatic JSON serialize/deserialize)
const api2 = apiBridge.create(); // transformRequest/Response are set by default
```

### Option 2: With Axios (Legacy Bridge)

```js
const axios = require('axios');
const { bridge } = require('api-bridge-ai');

const api = bridge(axios.create({ baseURL: 'https://api.example.com' }));

// Response fields are auto-converted to camelCase
const response = await api.get('/users/1');
console.log(response.data);
// { firstName: "John", lastName: "Doe", isActive: true }
```

### Option 3: With Fetch

```js
const { bridgeFetch } = require('api-bridge-ai');

const api = bridgeFetch();

const user = await api.get('https://api.example.com/users/1');
console.log(user);
// { firstName: "John", lastName: "Doe", isActive: true }
```

### Option 4: Direct Transform (No HTTP)

```js
const { transform } = require('api-bridge-ai');

const result = transform({
  first_name: 'John',
  last_name: 'Doe',
  is_active: true
});

console.log(result);
// { firstName: "John", lastName: "Doe", isActive: true }
```

---

## Two-Way Transformation

APIBridge also converts **frontend → backend** when you send data.

```js
// When you POST data, it auto-converts back to snake_case for the backend
await api.post('/users', {
  firstName: 'John',  // sent as first_name
  lastName: 'Doe'     // sent as last_name
});
```

---

## Enhanced Type Coercion (v7)

APIBridge v7+ automatically coerces values when a schema is provided, with support for:

| Input | Target Type | Output |
|-------|-------------|--------|
| `"TRUE"`, `"Yes"`, `"on"` | `boolean` | `true` |
| `"FALSE"`, `"No"`, `"off"` | `boolean` | `false` |
| `"50%"` | `float` | `0.5` |
| `"1,000"` | `integer` | `1000` |
| `"15/01/2024"` | `date` | `Date` object |
| `"red,green,blue"` | `array` | `['red','green','blue']` |

---

## Using a Schema for Exact Control

When automatic detection isn't enough, provide a schema:

```js
const api = bridge(axios.create(), {
  schema: {
    userName: { column: 'usr_nm', type: 'string' },
    isActive: { column: 'is_active', type: 'boolean' },
    createdAt: { column: 'created_at', type: 'date' }
  }
});
```

The schema gives you:
- **Exact field mapping** — `usr_nm` always becomes `userName`
- **Type coercion** — `"1"` becomes `true` for boolean fields, date strings become Date objects
- **Fuzzy matching** — Schema keys serve as candidates for the weighted ensemble matcher

---

## Approving and Rejecting Mappings

When APIBridge isn't sure about a mapping, it flags it. You can teach it the correct answer:

```js
// "Yes, this mapping is correct"
api.approve('usr_nm', 'userName');

// "No, that's wrong. Here's the correct one"
api.reject('usr_nm', 'usrNm', 'userName');
```

Once approved, APIBridge remembers it forever (Level 2). Next time it sees `usr_nm`, it instantly maps to `userName` with 99% confidence.

### Where Learnings Are Stored

Approved mappings are saved to `.apibridge/learned.json` in your project root. This file is auto-created. You can commit it to your repo so the whole team shares the same learnings, or add it to `.gitignore` if each environment should learn independently.

---

## Checking What Happened

```js
// See transformation stats
console.log(api.getStats());
// {
//   transformer: { totalFields: 50, exactMatches: 30, autoFixed: 18, flagged: 2 },
//   cache: { hits: 5, misses: 10 },
//   learning: { approvedCount: 12, rejectedCount: 1 }
// }

// See fields that need your review
console.log(api.getPending());
// [{ sourceKey: "xq_flag", targetKey: "xqFlag", confidence: 0.6, method: "best_effort" }]

// Export all mismatches as CSV
api.exportCSV('./mismatches.csv');
```

---

## Summary

| What | How |
|------|-----|
| Install | `npm install api-bridge-ai` |
| Replace Axios | `const api = require('api-bridge-ai').create({ baseURL: '/api' })` |
| Basic use | `transform({ snake_case: value })` → `{ camelCase: value }` |
| With Axios | `bridge(axiosInstance)` — auto-transforms all requests & responses |
| With Fetch | `bridgeFetch()` — same as above but with native fetch |
| Custom mapping | Pass a `schema` object to define exact field mappings |
| Teach it | `approve(source, target)` or `reject(source, wrong, correct)` |
| It remembers | Learnings saved to `.apibridge/learned.json` |
| Review flags | `getPending()` shows low-confidence mappings that need your approval |
| Accuracy | 99%+ for standard fields, 92%+ for synonyms, 70-95% for fuzzy matches |
| V18 modules | 80+ source modules, 27 error types + 21 security error codes, 1178 tests |

---

## V14: Enterprise-Grade Power Tools

Version 14 adds six production-ready features to the HTTP client:

### Auto-Retry Engine
Configure advanced retry strategies per-client or per-request. Set custom `retryCondition` functions to decide when to retry, `retryDelay` functions for backoff control, and `onRetry` callbacks for logging/monitoring:
```
retryConfig: { retries: 3, retryCondition: (err) => err.status >= 500, retryDelay: (n) => n * 1000 }
```

### Response Caching
Built-in memory cache with TTL, maxSize eviction, method-based filtering, URL exclusion patterns, stale-while-revalidate, and custom key generation. Use `client.clearResponseCache()` to invalidate.

### Request Deduplication
Identical in-flight requests are coalesced into a single network call. When two components simultaneously GET the same URL, only one fetch fires. Configurable per-method with custom key functions.

### Auto Token Refresh
When a 401 (or configured status code) is received, the client automatically calls your `onRefresh` function, gets a new token, updates the header, and retries the request — all transparently. Concurrent requests are queued during refresh so only one refresh happens at a time.

### Request Timing
Enable `timing: true` to get `response.duration` (ms) and `response.timing` `{ start, end, duration }` on every response for performance monitoring and SLA tracking.

### Lifecycle Hooks
Add `onRequest`, `onResponse`, `onError`, and `onRetry` hooks for logging, analytics, error tracking, and observability. Hooks are fire-and-forget observers — they never affect the request pipeline.

---

## V15: Full Axios API Parity

Version 15 closes the remaining Axios API gaps:

### Interceptor runWhen / synchronous
Conditional interceptor execution with `runWhen: (config) => boolean` — skip interceptors that don't apply. Synchronous mode with `synchronous: true` reduces overhead for simple handlers.

### Auto Content-Type Serialization
Plain objects are automatically converted to `URLSearchParams` or `FormData` based on the Content-Type header. No manual conversion needed.

### Enhanced paramsSerializer
Accepts Axios 1.x object form `{ encode, serialize }` in addition to the legacy function form.

### beforeRedirect Callback
Intercept and modify redirect requests before they are followed — useful for adding auth headers or logging redirects.

### Request Correlation IDs
Enable `requestId: true` to auto-generate a unique `x-request-id` header on every request for distributed tracing.

---

## V16: Security Hardening

Version 16 adds enterprise-grade security hardening — many features enabled by default:

### SSRF Protection
Blocks requests to private IPs, cloud metadata endpoints, and dangerous protocols. Enabled by default on all client instances. Configurable allowlist for trusted internal hosts.

### Header Injection Prevention
Validates all header names/values against RFC 7230. Rejects headers containing CR/LF characters to prevent CRLF injection attacks.

### Client-Side Rate Limiting
Token bucket algorithm with configurable `maxRequests` and `windowMs`. Supports per-endpoint rate limiting with separate buckets.

### Response Size Guard
Prevents memory exhaustion by enforcing `maxResponseSize` limits. Validates Content-Length before reading the response body.

### Sensitive Data Redaction
Automatically strips Authorization, Cookie, API keys, and other sensitive headers from error objects. URL query parameters containing tokens/secrets are also redacted.

### Request Fingerprinting
SHA-256 content-based fingerprinting detects replay attacks. Configure `replayDetection: 5000` to block duplicate requests within a time window.

### Journey Tracking
Enable `journeyTracking: true` to get a complete history of each request — attempts, cache hits, dedup, token refresh, redirects, and timing.

---

## V17: Advanced Security

Version 17 adds military-grade security features:

### Content Security Policy
Build standards-compliant CSP headers from configurable directives. Supports nonce generation, report-only mode, and custom directives.

### Certificate Pinning
Pin SHA-256 certificate hashes per host. Enforce or report mode. Supports subdomain pinning and dynamic pin management.

### Request Signing
HMAC-SHA256 request signing with canonical string construction. Auto-injects signature + timestamp headers for integrity verification.

### Input Sanitizer
XSS prevention (HTML escaping, script/event handler removal), SQL injection detection, and path traversal detection. Three modes: `escape`, `strip`, `reject`.

### Security Audit Logger
Tamper-proof append-only event log with SHA-256 hash chain. Supports severity levels, filtering, and automatic rotation.

### Permission Policy (RBAC)
Role-based method + endpoint access control with wildcard patterns. Configure policies per role and check authorization before each request.

### Payload Encryptor
AES-256-GCM authenticated encryption for request/response payloads. Auto-generates keys, supports key rotation, and provides key fingerprinting.

### Idempotency Manager
Automatic UUID-based idempotency key generation for POST/PUT/PATCH requests. Caches responses with configurable TTL to safely handle retries.

---

## V18: Elite Security Architecture

Version 18 adds the most advanced security layer — zero trust, threat intelligence, and cryptographic integrity:

### Zero Trust Engine
Every request is evaluated against an accumulated trust score. Trust factors include known context, consistent IP, consistent user-agent, and non-suspicious methods. Trust decays over time with configurable rates.

### Threat Intelligence
Real-time IP blocklist management with automatic blocking after suspicious activity threshold. URL pattern blocking and known attack pattern detection in headers (SQL injection, path traversal).

### Secure Session Manager
Cryptographic session tokens (32 bytes, hex-encoded) bound to IP and User-Agent for hijack prevention. Automatic session rotation with configurable intervals.

### Request Integrity Chain
Blockchain-inspired immutable request lineage. Every request is hashed with SHA-256: `hash = H(previousHash + method + url + timestamp + bodyHash)`. The full chain can be verified to detect tampering.

### Adaptive Rate Limiter
Token bucket with dynamically adapted rates based on traffic statistics. Standard deviation-based anomaly detection flags unusual traffic patterns and adjusts rates automatically.

### Security Headers Manager
Auto-generates all OWASP-recommended security headers: HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, and Cross-Origin headers (COEP, COOP, CORP).

### Encrypted Config Vault
AES-256-GCM encrypted storage for API keys, secrets, and sensitive configuration. Supports master key rotation, fingerprinting, and backup/restore.

### Mutual TLS Manager
Client certificate validation with trusted CA fingerprint store, certificate revocation list management, and configurable certificate age limits.
