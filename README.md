# APIBridge AI v4

**The most powerful API mismatch detector, transformer, and learner — now with circuit breaker, GraphQL support, OpenAPI import, webhooks, JSON Patch, composable pipelines, and more.**

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
- [V4 Features](#v4-features)
  - [Circuit Breaker](#circuit-breaker)
  - [Request Deduplication](#request-deduplication)
  - [GraphQL Bridge](#graphql-bridge)
  - [OpenAPI Schema Importer](#openapi-schema-importer)
  - [API Versioning](#api-versioning)
  - [Webhook Handler](#webhook-handler)
  - [JSON Patch Generator](#json-patch-generator)
  - [Composable Pipeline](#composable-pipeline)
- [V3 Features](#v3-features)
  - [Plugin System](#plugin-system)
  - [Schema Inference](#schema-inference)
  - [Field Projection](#field-projection)
  - [Data Masking](#data-masking)
  - [Rate Limiter](#rate-limiter)
  - [Schema Diff Engine](#schema-diff-engine)
  - [TypeScript Type Generator](#typescript-type-generator)
  - [Metrics Collector](#metrics-collector)
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
- [Migration from V3](#migration-from-v3)
- [License](#license)

---

## Features

| Feature | v1 | v2 | v3 | v4 |
|---------|----|----|-----|-----|
| snake_case → camelCase | ✅ | ✅ | ✅ | ✅ |
| All 5 naming conventions | ❌ | ✅ | ✅ | ✅ |
| Axios interceptors | ✅ | ✅ | ✅ | ✅ |
| Native fetch wrapper | GET/POST | All HTTP methods | All HTTP methods | All HTTP methods |
| Semantic synonym matching | ✅ | ✅ (expanded) | ✅ (expanded + healthcare, analytics, DevOps) | ✅ |
| Fuzzy Levenshtein matching | ✅ | ✅ | ✅ | ✅ |
| Learning engine | ✅ | ✅ (confidence decay) | ✅ (v3 persistence format) | ✅ |
| Type coercion | ✅ | ✅ (+ integer, float) | ✅ | ✅ |
| CSV export | ✅ | ✅ | ✅ | ✅ |
| JSON export | ❌ | ✅ | ✅ | ✅ |
| Schema validation | ❌ | ✅ | ✅ | ✅ |
| Response normalization | ❌ | ✅ | ✅ | ✅ |
| Middleware pipeline | ❌ | ✅ | ✅ | ✅ |
| Response caching (LRU + TTL) | ❌ | ✅ | ✅ | ✅ |
| Retry with backoff | ❌ | ✅ | ✅ | ✅ |
| Batch transformation | ❌ | ✅ | ✅ | ✅ |
| Reverse transform | ❌ | ✅ | ✅ | ✅ |
| Event emitter | ❌ | ✅ | ✅ | ✅ |
| Circular reference protection | ❌ | ✅ | ✅ | ✅ |
| Custom error classes | ❌ | ✅ | ✅ (9 types) | ✅ (13 types) |
| Session management | ❌ | ✅ | ✅ | ✅ |
| Plugin system | ❌ | ❌ | ✅ | ✅ |
| Schema inference | ❌ | ❌ | ✅ | ✅ |
| Field projection | ❌ | ❌ | ✅ | ✅ |
| Data masking (PII) | ❌ | ❌ | ✅ | ✅ |
| Rate limiter | ❌ | ❌ | ✅ | ✅ |
| Schema diff engine | ❌ | ❌ | ✅ | ✅ |
| TypeScript type generator | ❌ | ❌ | ✅ | ✅ |
| Metrics collector | ❌ | ❌ | ✅ | ✅ |
| **Circuit breaker** | ❌ | ❌ | ❌ | ✅ |
| **Request deduplication** | ❌ | ❌ | ❌ | ✅ |
| **GraphQL bridge** | ❌ | ❌ | ❌ | ✅ |
| **OpenAPI schema importer** | ❌ | ❌ | ❌ | ✅ |
| **API versioning** | ❌ | ❌ | ❌ | ✅ |
| **Webhook handler** | ❌ | ❌ | ❌ | ✅ |
| **JSON Patch generator** | ❌ | ❌ | ❌ | ✅ |
| **Composable pipeline** | ❌ | ❌ | ❌ | ✅ |

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

### 4. Schema Inference (v3)

```js
const { SchemaInference } = require('api-bridge-ai');

const inference = new SchemaInference();
const schema = inference.infer([
  { id: 1, name: 'John', email: 'john@example.com', is_active: true },
  { id: 2, name: 'Jane', email: 'jane@example.com', is_active: false },
]);
// Automatically detects types, required fields, and patterns
```

### 5. Data Masking (v3)

```js
const { DataMasker } = require('api-bridge-ai');

const masker = new DataMasker();
const masked = masker.mask({
  name: 'John',
  password: 'secret123',
  api_key: 'sk-abc123',
  email: 'john@example.com',
});
// { name: 'John', password: '[REDACTED]', api_key: '[REDACTED]', email: 'john@example.com' }
```

### 6. Circuit Breaker (v4)

```js
const { CircuitBreaker } = require('api-bridge-ai');

const breaker = new CircuitBreaker({
  failureThreshold: 5,  // Open after 5 consecutive failures
  resetTimeout: 30000,  // Try half-open after 30s
});

// All API calls go through the breaker
const data = await breaker.execute(async () => {
  const res = await fetch('https://api.example.com/users');
  return res.json();
});

// If the API keeps failing, the breaker opens and rejects instantly
// After 30s, it allows a probe request to test recovery
console.log(breaker.getState()); // 'CLOSED', 'OPEN', or 'HALF_OPEN'
```

### 7. GraphQL Bridge (v4)

```js
const { GraphQLBridge } = require('api-bridge-ai');

const gql = new GraphQLBridge({
  convention: 'camelCase',
  stripTypename: true,
});

// Transform GraphQL response
const result = gql.transformResponse({
  data: { user_name: 'John', email_address: 'john@test.com' },
  errors: [],
});
// { data: { userName: 'John', emailAddress: 'john@test.com' }, errors: [] }

// Transform variables for server
const vars = gql.transformVariables({ userName: 'John' }, 'snake_case');
// { user_name: 'John' }

// Extract nested data
const posts = gql.extractData(response, 'user.posts');
```

### 8. Composable Pipeline (v4)

```js
const { ComposablePipeline } = require('api-bridge-ai');

const pipe = new ComposablePipeline({ name: 'userPipeline' });

pipe
  .pipe('validate', (data) => { if (!data.name) throw new Error('Name required'); return data; })
  .pipe('transform', (data) => ({ ...data, name: data.name.toUpperCase() }))
  .tap('log', (data) => console.log('Processed:', data.name))
  .pipe('enrich', (data) => ({ ...data, processedAt: new Date().toISOString() }));

const { result, stages, duration } = await pipe.execute({ name: 'John', age: 30 });
// result: { name: 'JOHN', age: 30, processedAt: '2024-...' }
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

## V4 Features

### Circuit Breaker

Fault-tolerant API calls with automatic failure detection and recovery:

```js
const { CircuitBreaker } = require('api-bridge-ai');

const breaker = new CircuitBreaker({
  failureThreshold: 5,    // Open after 5 consecutive failures
  resetTimeout: 30000,    // Try half-open after 30 seconds
  halfOpenMax: 1,          // Allow 1 probe request in half-open
  onStateChange: ({ from, to }) => console.log(`Circuit: ${from} → ${to}`),
});

// Execute through the breaker
try {
  const data = await breaker.execute(async () => {
    const res = await fetch('https://api.example.com/users');
    return res.json();
  });
} catch (err) {
  if (err instanceof CircuitBreakerError) {
    console.log('Circuit is open, service unavailable');
    console.log(err.details); // { state: 'OPEN', failures: 5 }
  }
}

// Manual control
breaker.forceOpen();      // Force open for maintenance
breaker.forceClose();     // Force close to resume
breaker.reset();          // Reset all state

// Stats
console.log(breaker.getStats());
// { state: 'CLOSED', failures: 0, successes: 10, totalRequests: 10, ... }

// Cleanup
breaker.destroy();        // Clear timers
```

**States:**
| State | Behavior |
|-------|----------|
| `CLOSED` | Requests flow normally. Failures counted. |
| `OPEN` | All requests rejected instantly with `CircuitBreakerError`. |
| `HALF_OPEN` | Limited probe requests allowed. Success → CLOSED, failure → OPEN. |

---

### Request Deduplication

Coalesce concurrent identical requests — only one network call is made:

```js
const { RequestDeduplicator } = require('api-bridge-ai');

const dedup = new RequestDeduplicator({
  ttl: 5000,      // Max time to keep a pending entry
  maxSize: 1000,   // Max concurrent dedup entries
});

// Three concurrent calls with the same key → only ONE fetch executes
const [a, b, c] = await Promise.all([
  dedup.dedupe('/api/users', () => fetch('/api/users').then(r => r.json())),
  dedup.dedupe('/api/users', () => fetch('/api/users').then(r => r.json())),
  dedup.dedupe('/api/users', () => fetch('/api/users').then(r => r.json())),
]);
// a === b === c (same result, single HTTP call)

// Check if a request is in-flight
dedup.has('/api/users'); // false (completed)

// Stats
console.log(dedup.getStats());
// { totalRequests: 3, deduped: 2, executed: 1, pending: 0 }
```

---

### GraphQL Bridge

Transform GraphQL responses and variables between naming conventions:

```js
const { GraphQLBridge } = require('api-bridge-ai');

const gql = new GraphQLBridge({
  convention: 'camelCase',      // Target convention for response fields
  transformVariables: true,      // Transform query variable names
  transformFields: true,         // Transform response field names
  stripTypename: true,           // Remove __typename from responses
});

// Transform a full GraphQL response
const result = gql.transformResponse({
  data: {
    user_profile: {
      first_name: 'John',
      email_address: 'john@test.com',
      __typename: 'User',
    },
  },
  errors: [],
});
// { data: { userProfile: { firstName: 'John', emailAddress: 'john@test.com' } }, errors: [] }

// Transform variables for the server (camelCase → snake_case)
const vars = gql.transformVariables({ userId: 1, sortOrder: 'asc' }, 'snake_case');
// { user_id: 1, sort_order: 'asc' }

// Extract nested data from response
const posts = gql.extractData(response, 'user.posts');

// Normalize GraphQL errors
const errors = gql.normalizeErrors(response.errors);
// [{ message: '...', path: [...], code: '...', locations: [...] }]

// Build query with transformed variables
const query = gql.buildQuery('query GetUser($userId: ID!) { ... }', { userId: 1 });
```

---

### OpenAPI Schema Importer

Auto-generate APIBridge schemas from OpenAPI/Swagger specifications:

```js
const { OpenAPIImporter } = require('api-bridge-ai');

const importer = new OpenAPIImporter({
  convention: 'camelCase',       // Target naming convention
  includeDescriptions: true,     // Include field descriptions
});

// Parse a full OpenAPI v3 spec
const endpoints = importer.import({
  openapi: '3.0.0',
  paths: {
    '/users': {
      get: { /* ... */ },
      post: {
        requestBody: {
          content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } },
        },
      },
    },
  },
  components: {
    schemas: {
      User: {
        type: 'object',
        required: ['id', 'name'],
        properties: {
          id: { type: 'integer', description: 'Unique identifier' },
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
          created_at: { type: 'string', format: 'date-time' },
        },
      },
    },
  },
});
// Returns: [{ path: '/users', method: 'get', ... }, { path: '/users', method: 'post', requestSchema: {...} }]

// Extract all named schemas
const schemas = importer.extractSchemas(spec);
// { User: { id: { type: 'integer', required: true, description: '...' }, ... } }

// Resolve $ref references
const resolved = importer.resolveRef('#/components/schemas/User', spec);

// List all endpoints
const endpoints = importer.getEndpoints(spec);
// [{ path: '/users', method: 'get', operationId: 'getUsers', summary: '...' }]
```

**Supports:** OpenAPI 3.x and Swagger 2.0 specifications.

---

### API Versioning

Version-specific transforms with migration support:

```js
const { APIVersionManager } = require('api-bridge-ai');

const versions = new APIVersionManager({ defaultVersion: 'v1' });

// Register version-specific configurations
versions.register('v1', {
  schema: { userName: { column: 'user_name' } },
  transforms: {
    response: (data) => ({ ...data, apiVersion: 'v1' }),
  },
});

versions.register('v2', {
  schema: { fullName: { column: 'full_name' } },
  transforms: {
    response: (data) => ({ ...data, apiVersion: 'v2' }),
    request: (data) => ({ ...data, version: 2 }),
  },
});

versions.register('v1', {
  deprecated: true,
  successor: 'v2',
  // ...other config
});

// Transform with version
const result = versions.transform(data, 'v2', 'response');

// Check deprecation
if (versions.isDeprecated('v1')) {
  const next = versions.getSuccessor('v1'); // 'v2'
  console.warn(`v1 is deprecated, migrate to ${next}`);
}

// Migrate data between versions
const migrated = versions.migrate(data, 'v1', 'v3');
// Chains through: v1 → v2 → v3

// List all versions
const all = versions.list();
// [{ version: 'v1', deprecated: true, successor: 'v2' }, { version: 'v2', deprecated: false }]
```

---

### Webhook Handler

Normalize incoming webhook payloads from any provider:

```js
const { WebhookHandler } = require('api-bridge-ai');

const webhooks = new WebhookHandler({
  convention: 'camelCase',      // Normalize payload keys
  verifySignatures: true,        // Enable signature verification
});

// Built-in providers: 'github', 'stripe', 'generic'

// Process a GitHub webhook
const event = webhooks.process('github', payload, headers);
// { event: 'push', data: { ... }, provider: 'github', timestamp: '...', raw: { ... } }

// Register a custom provider
webhooks.register('slack', {
  eventKey: 'type',
  payloadKey: 'event',
  signatureHeader: 'x-slack-signature',
  signatureAlgorithm: 'sha256',
});

// Process custom webhook
const slackEvent = webhooks.process('slack', payload, headers);

// Verify webhook signature
const isValid = webhooks.verifySignature('github', rawBody, signature, secret);

// Normalize any payload to target convention
const normalized = webhooks.normalize({ user_name: 'John', created_at: '2024-01-15' });
// { userName: 'John', createdAt: '2024-01-15' }

// Stats
console.log(webhooks.getStats());
// { webhooksProcessed: 42, byProvider: { github: 30, stripe: 12 }, ... }
```

---

### JSON Patch Generator

Generate and apply RFC 6902 JSON Patch operations:

```js
const { JSONPatchGenerator } = require('api-bridge-ai');

const patcher = new JSONPatchGenerator({ deepClone: true });

// Generate patches (diff two objects)
const patches = patcher.generate(
  { name: 'John', age: 30, email: 'john@test.com' },
  { name: 'Jane', age: 30, phone: '555-1234' },
);
// [
//   { op: 'replace', path: '/name', value: 'Jane' },
//   { op: 'remove', path: '/email' },
//   { op: 'add', path: '/phone', value: '555-1234' },
// ]

// Apply patches to a document
const result = patcher.apply(
  { name: 'John', age: 30 },
  [
    { op: 'replace', path: '/name', value: 'Jane' },
    { op: 'add', path: '/email', value: 'jane@test.com' },
  ],
);
// { name: 'Jane', age: 30, email: 'jane@test.com' }

// Validate patches
const { valid, errors } = patcher.validate(patches);

// Test a value at a path
patcher.test(document, { op: 'test', path: '/name', value: 'John' }); // true

// Generate reverse patches (undo)
const undoPatches = patcher.revert(document, patches);

// Merge patch arrays
const merged = patcher.merge(patchesA, patchesB);
```

**Security:** Automatically rejects paths containing `__proto__`, `constructor`, or `prototype` to prevent prototype pollution.

---

### Composable Pipeline

Build functional, stage-based data transformation pipelines:

```js
const { ComposablePipeline } = require('api-bridge-ai');

const pipe = new ComposablePipeline({
  name: 'userPipeline',
  errorStrategy: 'skip',      // 'throw' | 'skip' | 'fallback'
});

// Chain stages with pipe()
pipe
  .pipe('validate', (data) => {
    if (!data.name) throw new Error('Name required');
    return data;
  })
  .pipe('normalize', (data) => ({
    ...data,
    name: data.name.trim().toLowerCase(),
  }))
  .pipe('enrich', async (data) => ({
    ...data,
    enrichedAt: new Date().toISOString(),
  }))
  .pipe('expensive', (data) => data, {
    condition: (data) => data.premium,  // Only run for premium users
    timeout: 5000,                       // 5s timeout
  });

// Side-effect stage (doesn't modify data)
pipe.tap('audit', (data) => auditLog.write(data));

// Execute the pipeline
const { result, stages, duration, errors } = await pipe.execute({ name: '  John  ', premium: false });
// result: { name: 'john', enrichedAt: '...', premium: false }
// stages: [{ name: 'validate', duration: 0.5, skipped: false }, ...]

// Dynamic pipeline modification
pipe.insertBefore('enrich', 'uppercase', (data) => ({ ...data, name: data.name.toUpperCase() }));
pipe.insertAfter('validate', 'sanitize', (data) => ({ ...data, name: data.name.replace(/[<>]/g, '') }));
pipe.replace('normalize', (data) => ({ ...data, name: data.name.toUpperCase() }));
pipe.remove('expensive');

// Branch: conditional pipeline execution
const branchFn = pipe.branch(
  (data) => data.type === 'admin',
  adminPipeline,
  userPipeline,
);

// Parallel execution: run pipelines concurrently and merge results
pipe.parallel('enrichAll', [enrichPipeA, enrichPipeB]);

// Clone for reuse
const pipe2 = pipe.clone();
```

---

## V3 Features

### Plugin System

Extensible architecture for registering hooks into the transform pipeline:

```js
const { PluginManager } = require('api-bridge-ai');

const plugins = new PluginManager();

// Register a plugin
plugins.register({
  name: 'logger',
  hooks: {
    beforeTransform: (data, ctx) => {
      console.log('Transforming:', Object.keys(data).length, 'fields');
      return data;
    },
    afterTransform: (data, ctx) => {
      console.log('Transformed:', Object.keys(data).length, 'fields');
      return data;
    },
  },
  init: () => console.log('Logger plugin initialized'),
});

// Execute hooks
const result = plugins.executeSync('beforeTransform', { first_name: 'John' });

// List plugins
console.log(plugins.list()); // ['logger']

// Unregister
plugins.unregister('logger');
```

**Valid hook points:** `beforeTransform`, `afterTransform`, `beforeValidate`, `afterValidate`, `onMismatch`, `onError`, `beforeRequest`, `afterRequest`

---

### Schema Inference

Auto-generate schemas from API response data:

```js
const { SchemaInference } = require('api-bridge-ai');

const inference = new SchemaInference({
  requiredThreshold: 1.0,  // Field must appear in 100% of samples to be required
  detectPatterns: true,     // Detect email, URL, UUID, ISO date patterns
});

// Infer from multiple samples
const schema = inference.infer([
  { id: 1, name: 'John', email: 'john@example.com', age: 25 },
  { id: 2, name: 'Jane', email: 'jane@example.com', age: 30 },
  { id: 3, name: 'Bob' },
]);

// Result:
// {
//   id:    { type: 'integer', required: true },
//   name:  { type: 'string',  required: true },
//   email: { type: 'string',  required: false, pattern: 'email' },
//   age:   { type: 'integer', required: false },
// }

// Merge schemas from different endpoints
const merged = inference.merge([schemaA, schemaB]);
```

---

### Field Projection

Select, omit, rename, and reshape fields — like SQL SELECT for objects:

```js
const { FieldProjection } = require('api-bridge-ai');

const fp = new FieldProjection();

// Pick only the fields you need
fp.pick(data, ['id', 'name', 'email']);

// Omit sensitive fields
fp.omit(data, ['password', 'ssn', 'api_key']);

// Rename fields
fp.rename(data, { first_name: 'firstName', last_name: 'lastName' });

// Reshape with dot-notation paths
fp.reshape(data, {
  userName: 'user.name',
  city: 'user.address.city',
});

// Flatten nested objects
fp.flatten({ a: { b: { c: 1 } } });
// → { 'a.b.c': 1 }

// Remove null/undefined fields
fp.compact({ a: 1, b: null, c: undefined });
// → { a: 1 }
```

---

### Data Masking

Protect PII and sensitive data with automatic detection and multiple masking strategies:

```js
const { DataMasker } = require('api-bridge-ai');

// Auto-detect sensitive fields
const masker = new DataMasker();
masker.mask({ password: 'secret', name: 'John' });
// → { password: '[REDACTED]', name: 'John' }

// Custom rules per field
const masker = new DataMasker({
  defaultStrategy: 'redact',
  fieldRules: {
    email: 'mask',                                    // jo**@example.com
    ssn: 'hash',                                       // SHA-256 hash
    phone: 'mask',                                     // ****1234
    api_key: { strategy: 'replace', replaceWith: '***' },
  },
});

// Strategies:
// - 'redact':  Replace with '[REDACTED]'
// - 'mask':    Partial masking (email, phone, card)
// - 'hash':    SHA-256 hash
// - 'replace': Custom replacement value
```

**Auto-detected sensitive fields:** `password`, `secret`, `token`, `api_key`, `ssn`, `credit_card`, `cvv`, `private_key`, `pin`, `access_key`

---

### Rate Limiter

Built-in request throttling with token bucket algorithm:

```js
const { RateLimiter } = require('api-bridge-ai');

const limiter = new RateLimiter({
  maxRequests: 60,      // 60 requests per window
  windowMs: 60000,      // 1-minute window
  burstLimit: 10,       // Allow up to 10 burst requests
  queueExcess: false,   // Reject over-limit requests
});

// Synchronous check
if (limiter.tryAcquire()) {
  // Make request
}

// Async with queuing
try {
  await limiter.acquire();
  // Make request
} catch (err) {
  // RateLimitError: Rate limit exceeded
  console.log(err.details.retryAfterMs);
}

// Stats
console.log(limiter.getStats());
// { totalRequests: 50, allowed: 48, throttled: 2, queued: 0, remaining: 12 }
```

---

### Schema Diff Engine

Detect API schema drift and breaking changes:

```js
const { SchemaDiff } = require('api-bridge-ai');

const differ = new SchemaDiff();

// Compare two API responses
const diff = differ.diff(
  { id: 1, name: 'John', age: 25, email: 'a@b.com' },
  { id: 1, fullName: 'John Doe', age: '25', phone: '555-1234' },
);

// Result:
// {
//   summary: { added: 1, removed: 1, typeChanged: 1, renamed: 1, hasBreakingChanges: true },
//   added:       [{ field: 'phone', type: 'string' }],
//   removed:     [{ field: 'email', type: 'string' }],
//   typeChanged: [{ field: 'age', before: 'number', after: 'string' }],
//   renamed:     [{ before: 'name', after: 'fullName', similarity: 80 }],
// }

// Compare schemas
const schemaDiff = differ.diffSchemas(oldSchema, newSchema);
console.log(schemaDiff.hasBreakingChanges);
```

---

### TypeScript Type Generator

Generate TypeScript interfaces and type guards from schemas or data:

```js
const { TypeGenerator } = require('api-bridge-ai');

const gen = new TypeGenerator({
  exportTypes: true,
  includeJSDoc: true,
});

// From schema
const ts = gen.fromSchema('User', {
  id:    { type: 'integer', required: true },
  name:  { type: 'string',  required: true },
  email: { type: 'string',  required: false, nullable: true },
});
// Output:
// /**
//  * Auto-generated by APIBridge AI v4
//  * @generated
//  */
// export interface User {
//   id: number;
//   name: string;
//   email?: string | null;
// }

// From raw data
const ts2 = gen.fromData('Order', { id: 1, total: 99.99, active: true });

// Type guard
const guard = gen.generateTypeGuard('User', schema);
// export function isUser(value: unknown): value is User { ... }

// Nested interfaces
const nested = gen.fromNestedData('Order', {
  id: 1,
  address: { city: 'NYC', zip: '10001' },
  items: [{ name: 'Shirt', price: 29.99 }],
});
// Generates: Order, OrderAddress, OrderItemsItem
```

---

### Metrics Collector

Track performance and usage metrics with percentile calculations:

```js
const { MetricsCollector } = require('api-bridge-ai');

const metrics = new MetricsCollector({ windowSize: 1000 });

// Record measurements
metrics.record('transform.duration', 5.2);
metrics.record('transform.duration', 3.1);

// Increment counters
metrics.increment('requests.total');
metrics.increment('errors.total');

// Measure function execution
const result = await metrics.measure('api.call', async () => {
  return await fetch('/api/users');
});

// Get statistical summary
const summary = metrics.getSummary('transform.duration');
// { count: 2, min: 3.1, max: 5.2, mean: 4.15, p50: 3.1, p95: 5.2, p99: 5.2, sum: 8.3 }

// Full report
const report = metrics.getReport();
// { uptime: 12345, counters: { ... }, metrics: { ... } }
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

V4 introduces 4 additional structured error classes on top of V3's 9:

```js
const {
  ApiBridgeError,          // Base error
  ValidationError,         // Schema/type validation failure
  TransformError,          // Key resolution or coercion failure
  CacheError,              // Cache read/write issue
  MiddlewareError,         // Middleware pipeline failure
  NetworkError,            // Fetch retry exhaustion
  PluginError,             // Plugin registration/execution failure (v3)
  RateLimitError,          // Rate limit exceeded (v3)
  InferenceError,          // Schema inference failure (v3)
  CircuitBreakerError,     // Circuit breaker tripped (v4)
  PipelineError,           // Composable pipeline stage failure (v4)
  WebhookError,            // Webhook processing failure (v4)
  VersioningError,         // API version management failure (v4)
} = require('api-bridge-ai');

try {
  await breaker.execute(() => api.get('/data'));
} catch (err) {
  if (err instanceof CircuitBreakerError) {
    console.log(err.details); // { state: 'OPEN', failures: 5 }
  }
  if (err instanceof NetworkError) {
    console.log(err.details); // { url, attempt, maxRetries }
  }
  if (err instanceof PipelineError) {
    console.log(err.details); // { stage: 'validate', originalMessage: '...' }
  }
  if (err instanceof WebhookError) {
    console.log(err.details); // { provider: 'github', reason: '...' }
  }
  if (err instanceof VersioningError) {
    console.log(err.details); // { version: 'v99', reason: 'not_registered' }
  }

  // All errors serialize to JSON
  console.log(JSON.stringify(err.toJSON()));
}
```

**Error class summary:**

| Error | Code | Added | Use Case |
|-------|------|-------|----------|
| `ApiBridgeError` | varies | v1 | Base error class |
| `ValidationError` | `VALIDATION_ERROR` | v2 | Schema/type validation |
| `TransformError` | `TRANSFORM_ERROR` | v2 | Key resolution failure |
| `CacheError` | `CACHE_ERROR` | v2 | Cache operations |
| `MiddlewareError` | `MIDDLEWARE_ERROR` | v2 | Pipeline hooks |
| `NetworkError` | `NETWORK_ERROR` | v2 | HTTP request failures |
| `PluginError` | `PLUGIN_ERROR` | v3 | Plugin system |
| `RateLimitError` | `RATE_LIMIT_ERROR` | v3 | Rate limiting |
| `InferenceError` | `INFERENCE_ERROR` | v3 | Schema inference |
| `CircuitBreakerError` | `CIRCUIT_BREAKER_ERROR` | v4 | Circuit breaker tripped |
| `PipelineError` | `PIPELINE_ERROR` | v4 | Pipeline stage failure |
| `WebhookError` | `WEBHOOK_ERROR` | v4 | Webhook processing |
| `VersioningError` | `VERSIONING_ERROR` | v4 | Version management |

---

## Architecture

```
Api_bridge/
├── src/
│   ├── index.js            # Main entry — bridge(), bridgeFetch(), transform()
│   ├── transformer.js      # Core transform engine (7-level detection)
│   ├── learning.js         # Persistent learning engine
│   ├── synonyms.js         # 100+ synonym groups dictionary (healthcare, analytics, DevOps)
│   ├── exporter.js         # CSV & JSON report generators
│   ├── cache.js            # LRU response cache with TTL
│   ├── middleware.js        # Composable before/after pipeline
│   ├── validator.js         # Schema validation engine
│   ├── normalizer.js        # Response format normalizer
│   ├── errors.js            # Custom error class hierarchy (13 types)
│   ├── plugins.js           # v3: Plugin system
│   ├── inference.js         # v3: Schema inference engine
│   ├── projection.js        # v3: Field projection (pick/omit/rename/reshape)
│   ├── masking.js           # v3: Data masking (PII protection)
│   ├── rate-limiter.js      # v3: Rate limiter (token bucket)
│   ├── diff.js              # v3: Schema diff engine
│   ├── typegen.js           # v3: TypeScript type generator
│   ├── metrics.js           # v3: Performance metrics collector
│   ├── circuit-breaker.js   # v4: Circuit breaker (fault tolerance)
│   ├── dedup.js             # v4: Request deduplication
│   ├── graphql.js           # v4: GraphQL response/variable bridge
│   ├── openapi.js           # v4: OpenAPI/Swagger schema importer
│   ├── versioning.js        # v4: API version management
│   ├── webhook.js           # v4: Webhook handler & normalizer
│   ├── patch.js             # v4: JSON Patch generator (RFC 6902)
│   └── pipeline.js          # v4: Composable transformation pipeline
├── test.js                  # 172-test comprehensive test suite
├── package.json
├── .gitignore
└── README.md
```

---

## Running Tests

```bash
npm test
```

This runs 172 tests covering:
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
- Custom error classes (13 types)
- Event emitter
- Session management
- **v3: Plugin system** (register, unregister, hooks, error handling)
- **v3: Schema inference** (single/multiple samples, pattern detection, merge)
- **v3: Field projection** (pick, omit, rename, reshape, flatten, compact)
- **v3: Data masking** (auto-detect, strategies, nested objects)
- **v3: Rate limiter** (allow, throttle, stats, reset)
- **v3: Schema diff** (added, removed, type changes, renames, breaking changes)
- **v3: TypeScript generation** (interfaces, type guards, nested types)
- **v3: Metrics collector** (record, counters, summaries, reports)
- **v4: Circuit breaker** (states, transitions, failure threshold, recovery, force open/close)
- **v4: Request deduplication** (concurrent request coalescing, stats, cleanup)
- **v4: GraphQL bridge** (response transform, variable transform, data extraction, errors)
- **v4: OpenAPI importer** (v2/v3 specs, schema extraction, ref resolution, endpoints)
- **v4: API versioning** (register, transform, deprecation, migration, stats)
- **v4: Webhook handler** (process, normalize, providers, signature verification)
- **v4: JSON Patch** (generate, apply, validate, test, revert, prototype pollution protection)
- **v4: Composable pipeline** (stages, conditions, tap, error strategies, insert/remove)

---

## Migration from V3

V4 is backward compatible. Your V3 code will work without changes.

**Breaking changes:** None.

**Import path change:** None — same as V3.

```js
const { bridge, bridgeFetch, transform } = require('api-bridge-ai');
```

**New v4 features you can adopt incrementally:**

```js
// Circuit breaker for fault tolerance
const { CircuitBreaker } = require('api-bridge-ai');
const breaker = new CircuitBreaker({ failureThreshold: 5 });
const data = await breaker.execute(() => fetchData());

// Request deduplication
const { RequestDeduplicator } = require('api-bridge-ai');
const dedup = new RequestDeduplicator();
const data = await dedup.dedupe('key', () => fetchData());

// GraphQL support
const { GraphQLBridge } = require('api-bridge-ai');
const gql = new GraphQLBridge({ convention: 'camelCase', stripTypename: true });
const result = gql.transformResponse(graphqlResponse);

// OpenAPI schema import
const { OpenAPIImporter } = require('api-bridge-ai');
const schemas = new OpenAPIImporter().extractSchemas(openApiSpec);

// API versioning
const { APIVersionManager } = require('api-bridge-ai');
const versions = new APIVersionManager();
versions.register('v2', { transforms: { response: (d) => d } });

// Webhook handling
const { WebhookHandler } = require('api-bridge-ai');
const webhooks = new WebhookHandler();
const event = webhooks.process('github', payload, headers);

// JSON Patch (RFC 6902)
const { JSONPatchGenerator } = require('api-bridge-ai');
const patches = new JSONPatchGenerator().generate(oldData, newData);

// Composable pipelines
const { ComposablePipeline } = require('api-bridge-ai');
const pipe = new ComposablePipeline();
pipe.pipe('validate', validateFn).pipe('transform', transformFn);
const { result } = await pipe.execute(data);
```

---

## License

MIT
