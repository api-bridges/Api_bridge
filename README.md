# APIBridge AI v2

**Intelligent API mismatch detector, transformer, and learner.**

APIBridge automatically bridges the gap between backend and frontend naming conventions. It detects `snake_case`, `PascalCase`, `kebab-case`, `SCREAMING_SNAKE` keys from your API and transforms them into your preferred convention — with AI-powered semantic matching, persistent learning, and zero manual mapping.

---

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [API Reference](#api-reference)
  - [bridge() — Axios Integration](#bridge--axios-integration)
  - [bridgeFetch() — Native Fetch Integration](#bridgefetch--native-fetch-integration)
  - [transform() — Direct Transform](#transform--direct-transform)
  - [createTransformer() — Reusable Instance](#createtransformer--reusable-instance)
- [V2 Features](#v2-features)
  - [All Output Conventions](#all-output-conventions)
  - [Schema Validation](#schema-validation)
  - [Response Normalization](#response-normalization)
  - [Middleware Pipeline](#middleware-pipeline)
  - [Response Caching](#response-caching)
  - [Retry with Exponential Backoff](#retry-with-exponential-backoff)
  - [Batch Transformation](#batch-transformation)
  - [Reverse Transform](#reverse-transform)
  - [Event Monitoring](#event-monitoring)
  - [Bulk Learning Import/Export](#bulk-learning-importexport)
  - [Session Management](#session-management)
- [Type Coercion](#type-coercion)
- [Learning Engine](#learning-engine)
- [Schema Definitions](#schema-definitions)
- [Export Reports](#export-reports)
- [Error Handling](#error-handling)
- [Architecture](#architecture)
- [Running Tests](#running-tests)
- [Migration from V1](#migration-from-v1)
- [License](#license)

---

## Features

| Feature | v1 | v2 |
|---------|----|----|
| snake_case → camelCase | ✅ | ✅ |
| All 5 naming conventions | ❌ | ✅ |
| Axios interceptors | ✅ | ✅ |
| Native fetch wrapper | GET/POST | All HTTP methods |
| Semantic synonym matching | ✅ | ✅ (expanded dictionary) |
| Fuzzy Levenshtein matching | ✅ | ✅ |
| Learning engine | ✅ | ✅ (confidence decay, bulk import) |
| Type coercion | ✅ | ✅ (+ integer, float) |
| CSV export | ✅ | ✅ |
| JSON export | ❌ | ✅ |
| Schema validation | ❌ | ✅ |
| Response normalization | ❌ | ✅ |
| Middleware pipeline | ❌ | ✅ |
| Response caching (LRU + TTL) | ❌ | ✅ |
| Retry with backoff | ❌ | ✅ |
| Batch transformation | ❌ | ✅ |
| Reverse transform | ❌ | ✅ |
| Event emitter | ❌ | ✅ |
| Circular reference protection | ❌ | ✅ |
| Custom error classes | ❌ | ✅ |
| Session management | ❌ | ✅ |

---

## Installation

```bash
npm install api-bridge-ai
```

Or clone the repo:

```bash
git clone https://github.com/biswaranjantudu064-netizen/Api_bridge.git
cd Api_bridge
npm install
```

---

## Quick Start

### 1. With Axios

```js
const axios = require('axios');
const { bridge } = require('api-bridge-ai');

const api = bridge(axios.create({ baseURL: 'https://api.example.com' }), {
  schema: {
    isActive: { column: 'is_active', type: 'boolean' },
    createdAt: { column: 'created_at', type: 'date' },
  },
});

// All responses automatically transformed to camelCase
const { data } = await api.get('/users/1');
console.log(data.firstName); // from "first_name"
console.log(data.isActive);  // true (from integer 1)
```

### 2. With Native Fetch

```js
const { bridgeFetch } = require('api-bridge-ai');

const api = bridgeFetch({
  retries: 3,
  retryDelay: 1000,
  cache: { ttl: 60000 },
});

const user = await api.get('https://api.example.com/users/1');
console.log(user.firstName); // from "first_name"
```

### 3. Direct Transform (No HTTP)

```js
const { transform } = require('api-bridge-ai');

const result = transform({
  user_id: 1,
  first_name: 'John',
  last_name: 'Doe',
  is_active: 1,
  created_at: '2024-01-15',
});

// Result:
// {
//   userId: 1,
//   firstName: 'John',
//   lastName: 'Doe',
//   isActive: 1,
//   createdAt: '2024-01-15',
// }
```

---

## API Reference

### `bridge()` — Axios Integration

```js
const api = bridge(axiosInstance, options);
```

**Options:**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `targetConvention` | string | `'camelCase'` | Output naming convention |
| `sourceConvention` | string | `'auto'` | Input naming convention (auto-detected) |
| `autoApplyThreshold` | number | `0.85` | Minimum confidence to auto-apply a mapping |
| `logMismatches` | boolean | `true` | Log mismatches to console |
| `schema` | object | `null` | Field mapping and type coercion schema |
| `transformRequests` | boolean | `true` | Transform outgoing request bodies |
| `cache` | object | `{}` | Cache options: `{ maxSize, ttl, enabled }` |
| `validator` | object | `{}` | Validator options: `{ strict, coerce, throwOnError }` |
| `normalizer` | object | `{}` | Normalizer options |
| `maxDepth` | number | `50` | Max nesting depth |
| `cloneInput` | boolean | `false` | Deep-clone input before transforming |

**Attached methods:**

```js
api.approve('src_key', 'targetKey')       // Teach a mapping
api.reject('src_key', 'wrong', 'correct') // Reject a wrong mapping
api.exportCSV('/path/to/file.csv')        // Export mismatch report (CSV)
api.exportJSON('/path/to/file.json')      // Export mismatch report (JSON)
api.getStats()                            // Get session statistics
api.getPending()                          // Get unresolved mismatches
api.validate(data, schema)                // Validate data against schema
api.normalize(body, statusCode)           // Normalize response
api.use('name', middlewareFn, 'before')   // Register middleware
api.clearCache()                          // Clear response cache
api.resetSession()                        // Reset stats and mismatches
api.bulkImport({ src: 'target', ... })    // Import learned mappings
api.bulkExport()                          // Export all learned mappings
```

---

### `bridgeFetch()` — Native Fetch Integration

```js
const api = bridgeFetch(options);
```

Supports all options from `bridge()` plus:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `retries` | number | `0` | Max retry attempts on failure |
| `retryDelay` | number | `1000` | Base delay in ms (doubles each retry) |

**HTTP Methods:**

```js
await api.get(url, config)
await api.post(url, body, config)
await api.put(url, body, config)
await api.patch(url, body, config)
await api.delete(url, body, config)
await api.head(url, config)
await api.options(url, config)
await api.request(method, url, body, config)  // Generic
```

---

### `transform()` — Direct Transform

```js
const { transform } = require('api-bridge-ai');

// Simple
const result = transform({ snake_key: 'value' });

// With options
const result = transform(data, {
  targetConvention: 'PascalCase',
  schema: mySchema,
  direction: 'toBackend',
});
```

---

### `createTransformer()` — Reusable Instance

```js
const { createTransformer } = require('api-bridge-ai');

const t = createTransformer({ logMismatches: false });

const r1 = t.transform({ first_name: 'John' });
const r2 = t.transform({ last_name: 'Doe' });

console.log(t.getStats()); // Stats accumulate across calls
```

---

## V2 Features

### All Output Conventions

```js
const { createTransformer } = require('api-bridge-ai');
const input = { user_first_name: 'John' };

// camelCase (default)
createTransformer({ targetConvention: 'camelCase' }).transform(input);
// → { userFirstName: 'John' }

// snake_case
createTransformer({ targetConvention: 'snake_case' }).transform({ firstName: 'John' });
// → { first_name: 'John' }

// PascalCase
createTransformer({ targetConvention: 'PascalCase' }).transform(input);
// → { UserFirstName: 'John' }

// kebab-case
createTransformer({ targetConvention: 'kebab-case' }).transform(input);
// → { 'user-first-name': 'John' }

// SCREAMING_SNAKE
createTransformer({ targetConvention: 'SCREAMING_SNAKE' }).transform(input);
// → { USER_FIRST_NAME: 'John' }
```

---

### Schema Validation

```js
const { SchemaValidator } = require('api-bridge-ai');

const validator = new SchemaValidator({ strict: true, throwOnError: false });

const schema = {
  name:     { type: 'string',  required: true },
  email:    { type: 'string',  required: true },
  age:      { type: 'number',  required: false },
  isActive: { type: 'boolean', required: true, default: true },
};

const { valid, errors, data } = validator.validate(
  { name: 'John', email: 'john@example.com' },
  schema,
);

console.log(valid);  // true (isActive filled with default)
console.log(data);   // { name: 'John', email: 'john@example.com', isActive: true }
```

**Supported types:** `string`, `number`, `boolean`, `date`, `array`, `object`, `json`, `any`

---

### Response Normalization

Standardizes API responses regardless of backend format:

```js
const { ResponseNormalizer } = require('api-bridge-ai');
const normalizer = new ResponseNormalizer();

// Envelope unwrapping
const result = normalizer.normalize({
  data: [{ id: 1, name: 'John' }],
  page: 2,
  per_page: 10,
  total: 100,
  total_pages: 10,
});

// Always get:
// {
//   data: [{ id: 1, name: 'John' }],
//   meta: {},
//   pagination: { page: 2, perPage: 10, total: 100, totalPages: 10 },
//   error: null,
// }

// Error detection
const errResult = normalizer.normalize({ error: 'Not found' }, 404);
// {
//   data: null, meta: {}, pagination: null,
//   error: { status: 404, message: 'Not found', code: null, details: null },
// }
```

---

### Middleware Pipeline

Add before/after hooks to the transform pipeline:

```js
const api = bridgeFetch();

// Log every request
api.use('logger', async (ctx, next) => {
  console.log(`→ ${ctx.method} ${ctx.url}`);
  const start = Date.now();
  await next();
  console.log(`← ${ctx.status} (${Date.now() - start}ms)`);
}, 'before');

// Add auth header
api.use('auth', async (ctx, next) => {
  ctx.config.headers = {
    ...ctx.config.headers,
    Authorization: 'Bearer my-token',
  };
  await next();
}, 'before');

// Transform result
api.use('addTimestamp', async (ctx, next) => {
  await next();
  if (ctx.result && typeof ctx.result === 'object') {
    ctx.result._fetchedAt = new Date().toISOString();
  }
}, 'after');
```

---

### Response Caching

Built-in LRU cache with TTL to prevent redundant transformations:

```js
const api = bridgeFetch({
  cache: {
    maxSize: 500,      // Max cached entries
    ttl: 5 * 60 * 1000, // 5 minute TTL
    enabled: true,
  },
});

// First call: fetches from network
await api.get('/users/1');

// Second call: returns cached result instantly
await api.get('/users/1');

// Clear cache manually
api.clearCache();

// Get cache stats
console.log(api.getStats().cache);
// { hits: 1, misses: 1, evictions: 0, sets: 1, size: 1, hitRate: '50%' }
```

---

### Retry with Exponential Backoff

Automatic retry for failed requests:

```js
const api = bridgeFetch({
  retries: 3,        // Up to 3 retries
  retryDelay: 1000,  // 1s, then 2s, then 4s (exponential backoff)
});

try {
  const data = await api.get('https://flaky-api.example.com/data');
} catch (err) {
  // NetworkError: Request to ... failed after 4 attempt(s)
  console.error(err.details);
  // { url: '...', attempt: 4, maxRetries: 3 }
}
```

---

### Batch Transformation

Transform multiple payloads in one call:

```js
const { createTransformer } = require('api-bridge-ai');
const t = createTransformer();

const results = t.transformBatch([
  { first_name: 'John', last_name: 'Doe' },
  { first_name: 'Jane', last_name: 'Smith' },
  { first_name: 'Bob',  last_name: 'Lee' },
]);
// [
//   { firstName: 'John', lastName: 'Doe' },
//   { firstName: 'Jane', lastName: 'Smith' },
//   { firstName: 'Bob', lastName: 'Lee' },
// ]
```

---

### Reverse Transform

Convert frontend data back to backend format:

```js
const { createTransformer } = require('api-bridge-ai');
const t = createTransformer();

const backendData = t.reverse({ firstName: 'John', lastName: 'Doe', isActive: true });
// { first_name: 'John', last_name: 'Doe', is_active: true }
```

---

### Event Monitoring

The transformer is an `EventEmitter`:

```js
const { createTransformer } = require('api-bridge-ai');
const t = createTransformer();

t.on('mismatch', (record) => {
  console.log(`Mismatch: ${record.sourceKey} → ${record.targetKey} (${record.method})`);
});

t.on('approved', ({ sourceKey, targetKey }) => {
  console.log(`Approved: ${sourceKey} → ${targetKey}`);
});

t.on('rejected', ({ sourceKey, wrongTargetKey, correctTargetKey }) => {
  console.log(`Rejected: ${sourceKey} → ${wrongTargetKey}, correct: ${correctTargetKey}`);
});

t.on('warning', ({ message, path }) => {
  console.warn(`Warning at ${path}: ${message}`);
});
```

---

### Bulk Learning Import/Export

Share learned mappings across projects or environments:

```js
const { createTransformer } = require('api-bridge-ai');
const t = createTransformer();

// Export all learned mappings
const mappings = t.learning.bulkExport();
// { 'usr_first_nm': 'firstName', 'addr_ln1': 'streetAddress', ... }

// Import into another instance
const t2 = createTransformer();
const count = t2.learning.bulkImport(mappings);
console.log(`Imported ${count} mappings`);
```

---

### Session Management

Reset stats without losing learned data:

```js
const t = createTransformer();

t.transform({ first_name: 'John' });
console.log(t.getStats().totalFields); // 1

t.resetSession();
console.log(t.getStats().totalFields); // 0
// Learned mappings are preserved
```

---

## Type Coercion

Define a schema to automatically convert types between SQL and JavaScript:

```js
const schema = {
  isActive:  { column: 'is_active',  type: 'boolean' },
  price:     { column: 'price',      type: 'number'  },
  createdAt: { column: 'created_at', type: 'date'    },
  count:     { column: 'count',      type: 'integer' },
  rating:    { column: 'rating',     type: 'float'   },
  tags:      { column: 'tags',       type: 'array'   },
  meta:      { column: 'meta',       type: 'json'    },
};
```

**Frontend direction (`toJS`):**

| SQL Value | Type | JS Result |
|-----------|------|-----------|
| `1`, `'true'`, `'yes'` | boolean | `true` |
| `0`, `'false'`, `'no'` | boolean | `false` |
| `'299.99'` | number | `299.99` |
| `'25'` | integer | `25` |
| `'2024-01-15T10:30:00Z'` | date | `Date` object |
| `'["a","b"]'` | array | `['a', 'b']` |
| `'{"key":"val"}'` | json | `{ key: 'val' }` |

**Backend direction (`toSQL`):**

| JS Value | Type | SQL Result |
|----------|------|------------|
| `true` | boolean | `1` |
| `false` | boolean | `0` |
| `new Date()` | date | `'2024-01-15 10:30:00'` |
| `[1, 2, 3]` | array | `'[1,2,3]'` |
| `{ a: 1 }` | json | `'{"a":1}'` |

---

## Learning Engine

APIBridge learns from your corrections and gets smarter over time.

```js
const api = bridgeFetch();

// Transform some data
const result = api.__bridge.transform({ usr_nm: 'John' });
// → { usrNm: 'John' } (best effort, 60% confidence)

// Teach it the correct mapping
api.approve('usr_nm', 'userName');

// Next time, it remembers (99% confidence)
const result2 = api.__bridge.transform({ usr_nm: 'Jane' });
// → { userName: 'Jane' }

// Reject a wrong suggestion
api.reject('addr_ln', 'addrLn', 'streetAddress');
```

**How detection levels work:**

| Level | Method | Confidence | Example |
|-------|--------|------------|---------|
| 1 | Exact match | 100% | `firstName` → `firstName` |
| 2 | Learned | 99% | Previously approved mapping |
| 3 | Schema | 100% | Schema says `is_active` → `isActive` |
| 4 | Pattern | 97% | `first_name` → `firstName` |
| 5 | Synonym | 92% | `email_addr` → `emailAddress` |
| 6 | Fuzzy | 70-90% | `usr_fst_nm` → `firstName` (with schema) |
| 7 | Best effort | 60% | Unknown key, convention-only conversion |

---

## Schema Definitions

Schemas serve three purposes: field mapping, type coercion, and validation.

```js
const userSchema = {
  // Field name: { column: 'backend_name', type: 'js_type', required: bool, default: value }
  userId:    { column: 'user_id',    type: 'number',  required: true },
  firstName: { column: 'first_name', type: 'string',  required: true },
  lastName:  { column: 'last_name',  type: 'string',  required: true },
  email:     { column: 'email',      type: 'string',  required: true },
  isActive:  { column: 'is_active',  type: 'boolean', required: true, default: true },
  createdAt: { column: 'created_at', type: 'date' },
  tags:      { column: 'tags',       type: 'array' },
  meta:      { column: 'meta',       type: 'json' },
};
```

---

## Export Reports

### CSV Report

```js
// To file
api.exportCSV('/path/to/report.csv');

// As string
const csvString = api.__bridge.exportCSV();
```

### JSON Report

```js
api.exportJSON('/path/to/report.json');
```

### Schema Suggestions

```js
const { exportSchemaSuggestions } = require('api-bridge-ai');
exportSchemaSuggestions(api.__bridge.learning, '/path/to/suggestions.json');
```

---

## Error Handling

V2 introduces structured error classes:

```js
const {
  ApiBridgeError,    // Base error
  ValidationError,   // Schema/type validation failure
  TransformError,    // Key resolution or coercion failure
  CacheError,        // Cache read/write issue
  MiddlewareError,   // Middleware pipeline failure
  NetworkError,      // Fetch retry exhaustion
} = require('api-bridge-ai');

try {
  await api.get('https://api.example.com/data');
} catch (err) {
  if (err instanceof NetworkError) {
    console.log(err.code);     // 'NETWORK_ERROR'
    console.log(err.details);  // { url, attempt, maxRetries }
  }
  if (err instanceof ValidationError) {
    console.log(err.details);  // { field, expected, received }
  }

  // All errors serialize to JSON
  console.log(JSON.stringify(err.toJSON()));
}
```

---

## Architecture

```
Api_bridge/
├── src/
│   ├── index.js          # Main entry — bridge(), bridgeFetch(), transform()
│   ├── transformer.js    # Core transform engine (7-level detection)
│   ├── learning.js       # Persistent learning engine
│   ├── synonyms.js       # 100+ synonym groups dictionary
│   ├── exporter.js       # CSV & JSON report generators
│   ├── cache.js          # LRU response cache with TTL
│   ├── middleware.js      # Composable before/after pipeline
│   ├── validator.js       # Schema validation engine
│   ├── normalizer.js      # Response format normalizer
│   └── errors.js          # Custom error class hierarchy
├── test.js               # 63-test comprehensive test suite
├── package.json
├── .gitignore
└── README.md
```

---

## Running Tests

```bash
npm test
```

This runs 63 tests covering:
- Basic transformations (all conventions)
- Nested objects and arrays
- Type coercion with schemas
- Semantic synonym matching
- Real-world API responses (user, e-commerce, payment)
- Learning engine (approve, reject, bulk import/export)
- CSV and JSON export
- Pending review queue
- All 5 output conventions
- Batch transformation
- Reverse transform
- Response caching
- Middleware pipeline
- Schema validation
- Response normalization
- Custom error classes
- Event emitter
- Session management

---

## Migration from V1

V2 is backward compatible. Your V1 code will work without changes.

**Breaking changes:** None.

**Import path change:**

```js
// V1 (still works)
const { bridge } = require('./index');

// V2 (recommended)
const { bridge } = require('api-bridge-ai');
// or
const { bridge } = require('./src/index');
```

**New features you can adopt incrementally:**

```js
// Add caching
const api = bridge(axios, { cache: { ttl: 60000 } });

// Add validation
const result = api.validate(data, schema);

// Add middleware
api.use('logger', async (ctx, next) => { /* ... */ await next(); });

// Listen for events
api.__bridge.on('mismatch', (record) => { /* ... */ });
```

---

## License

MIT
