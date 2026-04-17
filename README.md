# APIBridge AI v13

[![npm version](https://img.shields.io/npm/v/api-bridge-ai.svg)](https://www.npmjs.com/package/api-bridge-ai)
[![license](https://img.shields.io/npm/l/api-bridge-ai.svg)](https://github.com/biswaranjantudu064-netizen/Api_bridge/blob/main/LICENSE)
[![Node.js](https://img.shields.io/node/v/api-bridge-ai.svg)](https://nodejs.org)

**Complete Axios replacement with zero-gap API compatibility** — a production-ready, zero-dependency HTTP client with intelligent API mismatch detection, transformation, and learning across 60+ modules.

APIBridge AI is a **true drop-in replacement for Axios** that also bridges the gap between backend and frontend naming conventions. It detects `snake_case`, `PascalCase`, `kebab-case`, `SCREAMING_SNAKE` keys from your API and transforms them into your preferred convention — with AI-powered semantic matching, persistent learning, and zero manual mapping.

> **v13 Highlights:** AxiosHeaders in all responses, default transform chains, `.isAxiosError` property on errors, `response.request` on every response, `maxRate` throttling, `lookup` DNS support, 849 tests.

---

## Table of Contents

- [Features](#features)
- [Why Replace Axios?](#why-replace-axios)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Axios Migration Guide](#axios-migration-guide)
- [API Reference](#api-reference)
  - [createClient() — HTTP Client (Axios Replacement)](#createclient--http-client-axios-replacement)
  - [bridge() — Axios Integration](#bridge--axios-integration)
  - [bridgeFetch() — Native Fetch Integration](#bridgefetch--native-fetch-integration)
  - [transform() — Direct Transform](#transform--direct-transform)
  - [createTransformer() — Reusable Instance](#createtransformer--reusable-instance)
- [V8 Features](#v8-features)
  - [Multi-Alias Field Resolution](#multi-alias-field-resolution)
  - [Schema Migration Engine](#schema-migration-engine)
  - [Batch Request Orchestrator](#batch-request-orchestrator)
  - [Field Analytics Collector](#field-analytics-collector)
  - [Conditional Transformation](#conditional-transformation)
  - [Deep Merge Engine](#deep-merge-engine)
  - [Output Formatter](#output-formatter)
  - [Request Interceptor Chain](#request-interceptor-chain)
- [V7 Features](#v7-features)
  - [Weighted Ensemble Fuzzy Matcher](#weighted-ensemble-fuzzy-matcher)
  - [N-Gram Similarity Matching](#n-gram-similarity-matching)
  - [Context-Aware Field Resolution](#context-aware-field-resolution)
  - [Enhanced Type Coercion](#enhanced-type-coercion)
  - [Expanded Synonym Dictionary](#expanded-synonym-dictionary)
  - [Database Prefix Stripping](#database-prefix-stripping)
- [V6 Features](#v6-features)
  - [Enhanced Fuzzy Matcher](#enhanced-fuzzy-matcher)
  - [Cryptic Name Resolver](#cryptic-name-resolver)
  - [Schema-Based Type Coercer](#schema-based-type-coercer)
- [V5 Features](#v5-features)
  - [Retry Strategy](#retry-strategy)
  - [Request Logger](#request-logger)
  - [Schema Registry](#schema-registry)
  - [Response Streamer](#response-streamer)
  - [Dependency Graph](#dependency-graph)
  - [Mock Server](#mock-server)
  - [Health Check](#health-check)
  - [Event Bus](#event-bus)
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
- [Migration from V5](#migration-from-v5)
- [License](#license)

---

## Features

### Axios Compatibility (v9–v13)

| Axios Feature | v9 | v10 | v11 | v12 | v13 |
|---|---|---|---|---|---|
| HTTP methods (GET/POST/PUT/PATCH/DELETE/HEAD/OPTIONS) | ✅ | ✅ | ✅ | ✅ | ✅ |
| `createClient()` / `create()` factory | ✅ | ✅ | ✅ | ✅ | ✅ |
| Request/response interceptors | ✅ | ✅ | ✅ | ✅ | ✅ |
| Base URL, headers, query params | ✅ | ✅ | ✅ | ✅ | ✅ |
| Timeout + AbortController | ✅ | ✅ | ✅ | ✅ | ✅ |
| Retries with exponential backoff | ✅ | ✅ | ✅ | ✅ | ✅ |
| Smart Proxy mode (dynamic field resolution) | ✅ | ✅ | ✅ | ✅ | ✅ |
| Expectation schema (expect) | ✅ | ✅ | ✅ | ✅ | ✅ |
| `auth`, `validateStatus`, `responseType` | ❌ | ✅ | ✅ | ✅ | ✅ |
| CancelToken, Cancel, isCancel | ❌ | ✅ | ✅ | ✅ | ✅ |
| `toFormData`, `formToJSON`, `isFormData` | ❌ | ✅ | ✅ | ✅ | ✅ |
| `all()`, `spread()`, `mergeConfig()` | ❌ | ✅ | ✅ | ✅ | ✅ |
| `transformRequest` / `transformResponse` | ❌ | ✅ | ✅ | ✅ | ✅ |
| `maxContentLength` / `maxBodyLength` | ❌ | ✅ | ✅ | ✅ | ✅ |
| AxiosHeaders class | ❌ | ❌ | ✅ | ✅ | ✅ |
| HttpStatusCode enum | ❌ | ❌ | ✅ | ✅ | ✅ |
| Pluggable adapters (fetch/xhr/custom) | ❌ | ❌ | ✅ | ✅ | ✅ |
| `postForm()`, `putForm()`, `patchForm()` | ❌ | ❌ | ✅ | ✅ | ✅ |
| `isAbsoluteURL`, `combineURLs`, URL utils | ❌ | ❌ | ✅ | ✅ | ✅ |
| Callable default export: `apiBridge(config)` | ❌ | ❌ | ❌ | ✅ | ✅ |
| `Axios` / `AxiosError` class aliases | ❌ | ❌ | ❌ | ✅ | ✅ |
| Error code constants (ERR_NETWORK, etc.) | ❌ | ❌ | ❌ | ✅ | ✅ |
| `isAxiosError()` function | ❌ | ❌ | ❌ | ✅ | ✅ |
| `transitional` config option | ❌ | ❌ | ❌ | ✅ | ✅ |
| Delete with data body | ❌ | ❌ | ❌ | ✅ | ✅ |
| **AxiosHeaders in all responses** | ❌ | ❌ | ❌ | ❌ | ✅ |
| **Default transformRequest/Response chains** | ❌ | ❌ | ❌ | ❌ | ✅ |
| **`.isAxiosError` property on errors** | ❌ | ❌ | ❌ | ❌ | ✅ |
| **`response.request` property** | ❌ | ❌ | ❌ | ❌ | ✅ |
| **`data` alias in response config** | ❌ | ❌ | ❌ | ❌ | ✅ |
| **`maxRate` throttling** | ❌ | ❌ | ❌ | ❌ | ✅ |
| **`lookup` DNS option** | ❌ | ❌ | ❌ | ❌ | ✅ |

### Core Features (v1–v8)

| Feature | v1 | v2 | v3 | v4 | v5 | v6 | v7 | v8 |
|---------|----|----|-----|-----|-----|-----|-----|-----|
| snake_case → camelCase | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| All 5 naming conventions | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Axios interceptors | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Native fetch wrapper | GET/POST | All HTTP methods | All HTTP methods | All HTTP methods | All HTTP methods | All HTTP methods | All HTTP methods | All HTTP methods |
| Semantic synonym matching | ✅ | ✅ (expanded) | ✅ (expanded + healthcare, analytics, DevOps) | ✅ | ✅ | ✅ | ✅ (+ financial, IoT, education, social) | ✅ |
| Fuzzy Levenshtein matching | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ (enhanced multi-strategy) | ✅ (weighted ensemble 7-strategy) | ✅ |
| Learning engine | ✅ | ✅ (confidence decay) | ✅ (v3 persistence format) | ✅ | ✅ | ✅ | ✅ | ✅ |
| Type coercion | ✅ | ✅ (+ integer, float) | ✅ | ✅ | ✅ | ✅ (schema-based auto-coercion) | ✅ (case-insensitive, %, comma) | ✅ |
| CSV export | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| JSON export | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Schema validation | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Response normalization | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Middleware pipeline | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Response caching (LRU + TTL) | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Retry with backoff | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Custom error classes | ❌ | ✅ | ✅ (9 types) | ✅ (13 types) | ✅ (19 types) | ✅ (22 types) | ✅ (22 types) | ✅ (27 types) |
| Plugin system | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Circuit breaker | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| GraphQL bridge | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Mock server | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| Health check monitor | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| Event bus | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| Weighted ensemble matching | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| **Multi-alias field resolution** | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| **Schema migration engine** | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| **Deep merge engine** | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| **Conditional transforms** | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |

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

## Why Replace Axios?

APIBridge AI is not just an Axios wrapper — it's a **complete replacement** that gives you everything Axios does plus intelligent API transformation:

| | Axios | APIBridge AI v13 |
|---|---|---|
| HTTP client (GET/POST/PUT/PATCH/DELETE) | ✅ | ✅ |
| Request/response interceptors | ✅ | ✅ |
| CancelToken + AbortController | ✅ | ✅ |
| FormData, toFormData, formToJSON | ✅ | ✅ |
| AxiosHeaders class | ✅ | ✅ |
| HttpStatusCode enum | ✅ | ✅ |
| transformRequest/transformResponse | ✅ | ✅ (with defaults) |
| Pluggable adapters (fetch/xhr) | ✅ | ✅ |
| `error.isAxiosError` property | ✅ | ✅ |
| response.request property | ✅ | ✅ |
| **Zero dependencies** | ❌ (follow-redirects) | ✅ |
| **Intelligent field mapping** | ❌ | ✅ |
| **Fuzzy matching (7 strategies)** | ❌ | ✅ |
| **Learning engine** | ❌ | ✅ |
| **Schema migration** | ❌ | ✅ |
| **Smart Proxy mode** | ❌ | ✅ |
| **60+ utility modules** | ❌ | ✅ |

### Quick Migration from Axios

```js
// Before (Axios)
const axios = require('axios');
const api = axios.create({ baseURL: '/api' });

// After (APIBridge AI — drop-in replacement)
const apiBridge = require('api-bridge-ai');
const api = apiBridge.create({ baseURL: '/api' });

// Everything works the same:
const res = await api.get('/users', { params: { page: 1 } });
console.log(res.data);           // ✅ Same response shape
console.log(res.status);         // ✅ Same status
console.log(res.headers.get('content-type')); // ✅ AxiosHeaders
console.log(res.request);        // ✅ Request object
console.log(res.config.data);    // ✅ Request data

// Error handling — identical to Axios
try {
  await api.get('/missing');
} catch (err) {
  if (err.isAxiosError) {        // ✅ Property check works
    console.log(err.response.status);
    console.log(err.response.headers.get('content-type')); // ✅ AxiosHeaders
  }
}
```

---

## Project Structure

```
api-bridge-ai/
├── src/
│   ├── index.js                 # Main entry point (exports everything)
│   ├── core/                    # Core transformation engine
│   │   ├── index.js             # Barrel export for core module
│   │   ├── errors.js            # 27 structured error classes
│   │   ├── client.js            # HTTP client engine (Axios replacement)
│   │   ├── interceptors.js      # Request/response interceptor system
│   │   ├── cancel.js            # CancelToken, Cancel, isCancel
│   │   ├── form-data.js         # FormData utilities
│   │   ├── headers.js           # AxiosHeaders class
│   │   ├── http-status.js       # HttpStatusCode enum
│   │   ├── adapters.js          # Pluggable adapters (fetch/xhr)
│   │   ├── url-utils.js         # URL utilities
│   │   ├── helpers.js           # Type & utility helpers
│   │   ├── expectation.js       # Expectation schema system
│   │   ├── proxy.js             # Smart Proxy mode
│   │   ├── transformer.js       # 7-level mismatch detection & correction
│   │   ├── learning.js          # Persistent learning engine
│   │   ├── normalizer.js        # Response normalization
│   │   ├── synonyms.js          # Synonym dictionary (financial, IoT, etc.)
│   │   ├── fuzzy-matcher.js     # Weighted ensemble fuzzy matching
│   │   ├── cryptic-resolver.js  # Cryptic/arbitrary name resolution
│   │   ├── type-coercer.js      # Schema-based type coercion
│   │   ├── field-aliaser.js     # Multi-alias field resolution
│   │   ├── validator.js         # Schema validation
│   │   ├── inference.js         # Auto schema inference
│   │   ├── conditional-transform.js  # Conditional rules
│   │   └── schema-migrator.js   # Version migration engine
│   ├── utils/                   # Utility modules
│   │   ├── index.js             # Barrel export for utils module
│   │   ├── cache.js             # LRU response cache with TTL
│   │   ├── dedup.js             # Request deduplication
│   │   ├── diff.js              # Schema diff engine
│   │   ├── exporter.js          # CSV/JSON export
│   │   ├── masking.js           # PII data masking
│   │   ├── metrics.js           # Performance metrics
│   │   ├── patch.js             # JSON Patch (RFC 6902)
│   │   ├── typegen.js           # TypeScript type generator
│   │   ├── deep-merge.js        # Intelligent deep merge
│   │   ├── output-formatter.js  # Multi-format output
│   │   ├── field-stats.js       # Field analytics
│   │   ├── projection.js        # Field projection
│   │   └── request-logger.js    # Structured request logging
│   └── adapters/                # Protocol adapters & middleware
│       ├── index.js             # Barrel export for adapters module
│       ├── graphql.js           # GraphQL bridge
│       ├── webhook.js           # Webhook handler
│       ├── openapi.js           # OpenAPI importer
│       ├── mock-server.js       # Mock server
│       ├── circuit-breaker.js   # Circuit breaker
│       ├── retry-strategy.js    # Advanced retry strategies
│       ├── rate-limiter.js      # Rate limiter
│       ├── health-check.js      # Health check monitor
│       ├── event-bus.js         # Event bus (pub/sub)
│       ├── middleware.js        # Middleware pipeline
│       ├── pipeline.js          # Composable pipeline
│       ├── plugins.js           # Plugin system
│       ├── request-interceptor.js # Request interceptor chain
│       ├── batch-orchestrator.js  # Batch execution
│       ├── dependency-graph.js  # DAG orchestration
│       ├── schema-registry.js   # Versioned schema registry
│       ├── response-streamer.js # Response streaming
│       └── versioning.js        # API versioning
├── types/
│   └── index.d.ts               # TypeScript type declarations
├── examples/
│   ├── basic-usage.js           # Basic usage examples
│   ├── advanced-usage.js        # Advanced SDK patterns
│   └── plugin-example.js        # Custom plugin development
├── test.js                      # 849 tests
├── package.json
├── CHANGELOG.md
└── README.md
```

---

## Importing Modules

### Full Import (default)

```js
const { bridge, transform, CircuitBreaker, EventBus } = require('api-bridge-ai');
```

### Subpath Imports (tree-shakeable)

Import only the modules you need for smaller bundle sizes:

```js
// Core transformation & matching
const { APIBridgeTransformer, FuzzyMatcher, SchemaValidator } = require('api-bridge-ai/core');

// Utilities
const { ResponseCache, DeepMerge, OutputFormatter } = require('api-bridge-ai/utils');

// Adapters & middleware
const { CircuitBreaker, EventBus, PluginManager } = require('api-bridge-ai/adapters');

// Error classes only
const { ValidationError, TransformError } = require('api-bridge-ai/errors');
```

---

## TypeScript Support

TypeScript type declarations are included out of the box:

```ts
import { transform, SchemaValidator, CircuitBreaker } from 'api-bridge-ai';

const result = transform({ first_name: 'John' });
// result is Record<string, any>

const validator = new SchemaValidator({ strict: true });
const { valid, errors } = validator.validate(data, schema);
```

---

## Plugin & Extension System

APIBridge has a built-in plugin system for extending functionality:

### Creating a Plugin

```js
const { PluginManager } = require('api-bridge-ai');

const myPlugin = {
  name: 'my-plugin',
  version: '1.0.0',
  hooks: {
    beforeTransform: (data, ctx) => {
      // Modify data before transformation
      console.log('Transforming:', Object.keys(data));
      return data;
    },
    afterTransform: (data, ctx) => {
      // Modify data after transformation
      return { ...data, _transformed: true };
    },
    onMismatch: (record) => {
      // React to field mismatches
      console.log('Mismatch detected:', record);
    },
    onError: (error) => {
      // Handle errors
      console.error('Error:', error.message);
    },
  },
  init: () => console.log('Plugin loaded'),
  destroy: () => console.log('Plugin unloaded'),
};

const plugins = new PluginManager();
plugins.register(myPlugin);
```

### Available Hook Points

| Hook | Phase | Description |
|------|-------|-------------|
| `beforeTransform` | Pre-transform | Modify data before field mapping |
| `afterTransform` | Post-transform | Modify data after field mapping |
| `beforeValidate` | Pre-validation | Modify data before schema validation |
| `afterValidate` | Post-validation | Modify validation results |
| `onMismatch` | Detection | React to field name mismatches |
| `onError` | Error | Handle errors in the pipeline |
| `beforeRequest` | Pre-request | Modify outgoing HTTP requests |
| `afterRequest` | Post-request | Modify incoming HTTP responses |

### Plugin Factory Pattern

```js
function createMetricsPlugin(options = {}) {
  const metrics = {};
  return {
    name: 'metrics-plugin',
    hooks: {
      beforeTransform: (data) => {
        metrics.startTime = Date.now();
        return data;
      },
      afterTransform: (data) => {
        metrics.duration = Date.now() - metrics.startTime;
        if (options.onMetric) options.onMetric(metrics);
        return data;
      },
    },
  };
}
```

---

## Quick Start

### 1. As Axios Replacement (v13 — Recommended)

```js
const apiBridge = require('api-bridge-ai');

// Works exactly like axios:
const api = apiBridge.create({ baseURL: 'https://api.example.com' });
const { data } = await api.get('/users/1');
console.log(data);

// Or use the callable default:
const res = await apiBridge.get('https://api.example.com/users/1');
console.log(res.data);
console.log(res.status);                // 200
console.log(res.headers.get('content-type')); // AxiosHeaders
console.log(res.request);               // Request object

// Error handling with .isAxiosError property:
try {
  await api.get('/missing');
} catch (err) {
  if (err.isAxiosError) {               // ✅ Property check
    console.log(err.response.status);    // 404
    console.log(err.code);              // ERR_BAD_REQUEST
  }
}
```

### 2. With Axios (Legacy Bridge)

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

### 3. With Native Fetch

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

### 4. Direct Transform (No HTTP)

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

### 5. Schema Inference (v3)

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

### 9. Enhanced Fuzzy Matcher (v6)

```js
const { FuzzyMatcher } = require('api-bridge-ai');

const fuzzy = new FuzzyMatcher();

// Multi-strategy fuzzy matching: Levenshtein, phonetic, vowel-drop, abbreviation
const result = fuzzy.findBestMatch('usr_email', ['user_email', 'user_name', 'phone']);
// { match: 'user_email', confidence: 0.92, method: 'fuzzy_abbreviation' }

// Works with typos
const typo = fuzzy.findBestMatch('frist_name', ['first_name', 'last_name']);
// { match: 'first_name', confidence: 0.88, method: 'fuzzy_levenshtein' }

// Vowel-dropped abbreviations
const abbr = fuzzy.findBestMatch('usr_nm', ['user_name', 'email']);
// { match: 'user_name', confidence: 0.85, method: 'fuzzy_vowel_drop' }
```

### 10. Cryptic Name Resolver (v6)

```js
const { CrypticResolver } = require('api-bridge-ai');

const resolver = new CrypticResolver();

// Resolve cryptic field names with prefixes
const result = resolver.resolve('z9_ref_id', ['reference_id', 'user_id']);
// { match: 'reference_id', confidence: 0.65, method: 'prefix_strip', stripped: 'ref_id' }

// Detect if a field name is cryptic
resolver.isCryptic('z9_ref_id');  // true
resolver.isCryptic('user_name');  // false

// Suffix-based matching
const suffix = resolver.resolve('x_user_flag', ['is_active', 'user_flag']);
// { match: 'user_flag', confidence: 0.65, method: 'suffix_match', stripped: '_flag' }
```

### 11. Schema-Based Type Coercer (v6)

```js
const { TypeCoercer } = require('api-bridge-ai');

const coercer = new TypeCoercer();

// Coerce individual values
const result = coercer.coerceValue('true', 'boolean', 'isActive');
// { value: true, coerced: true, conflict: { field: 'isActive', sourceType: 'boolean_string', targetType: 'boolean', ... } }

// Coerce an entire object based on a schema
const { data, coerced, conflicts } = coercer.coerceObject(
  { isActive: '1', count: '42', createdAt: '2024-01-15' },
  { isActive: { type: 'boolean' }, count: { type: 'integer' }, createdAt: { type: 'date' } }
);
// data: { isActive: true, count: 42, createdAt: Date('2024-01-15') }
// coerced: ['isActive', 'count', 'createdAt']

// Detect type conflicts without coercing
const conflicts = coercer.detectConflicts(data, schema);

// Statistics
coercer.getStats();
// { totalConflicts: 3, coerced: 3, failed: 0, byType: { boolean_string_to_boolean: 1, ... } }
```

---

## V8 Features

### Multi-Alias Field Resolution

```js
const { FieldAliaser } = require('api-bridge-ai');

const aliaser = new FieldAliaser();

// Register aliases for a canonical field
aliaser.register('userId', ['user_id', 'uid', 'member_id']);
aliaser.register('email', ['email_address', 'mail', 'e_mail']);

// Resolve any alias to canonical
aliaser.resolve('uid');         // { canonical: 'userId', matched: true, source: 'alias' }
aliaser.resolve('email_address'); // { canonical: 'email', matched: true }

// API-specific aliases (different APIs use different names)
aliaser.register('userId', ['usr_id'], { api: 'legacyService' });
aliaser.register('userId', ['memberId'], { api: 'memberService' });
aliaser.resolve('usr_id', 'legacyService'); // { canonical: 'userId', source: 'api:legacyService' }

// Get preferred alias for a specific API
aliaser.getAliasFor('userId', 'legacyService'); // 'usr_id'

// Bulk import/export
aliaser.bulkImport({ userId: ['uid', 'user_id'], name: ['full_name'] });
const definitions = aliaser.bulkExport();

// Conflict detection
const conflicts = aliaser.detectConflicts();

// Statistics
aliaser.getStats(); // { totalGroups, totalAliases, lookups, hits, misses, hitRate }
```

### Schema Migration Engine

```js
const { SchemaMigrator } = require('api-bridge-ai');

const migrator = new SchemaMigrator();

// Define migrations between versions
migrator.define('1.0', '2.0', {
  rename: { user_name: 'username', phone_number: 'phone' },
  add: { version: '2.0', updatedAt: () => new Date().toISOString() },
  remove: ['legacy_field', 'deprecated_flag'],
  transform: { price: (v) => v * 100 }, // dollars to cents
});

migrator.define('2.0', '3.0', {
  rename: { username: 'displayName' },
  add: { apiVersion: '3.0' },
});

// Migrate forward (auto-chains through intermediate versions)
const result = migrator.migrate(data, '1.0', '3.0');
// { data: { displayName: 'John', ... }, steps: ['1.0 → 2.0', '2.0 → 3.0'], success: true }

// Migrate backward (auto-reverses)
migrator.migrate(data, '3.0', '1.0');

// Dry-run to preview changes
const preview = migrator.dryRun(data, '1.0', '2.0');
// { changes: [{ type: 'renamed', field: 'user_name', ... }], path: [...], possible: true }

// Rollback last migration
migrator.rollback(data);

// Version detection
migrator.registerDetector((data) => data._version || null);
migrator.detectVersion({ _version: '2.0' }); // '2.0'

// History and stats
migrator.getHistory();
migrator.getStats(); // { totalMigrations, historyLength, versions }
```

### Batch Request Orchestrator

```js
const { BatchOrchestrator } = require('api-bridge-ai');

const batch = new BatchOrchestrator({
  concurrency: 5,
  failureStrategy: 'continue', // 'continue', 'abort', or 'retry'
  maxRetries: 2,
});

// Parallel execution with concurrency control
const result = await batch.executeParallel([
  { id: 'users', execute: () => fetch('/api/users').then(r => r.json()) },
  { id: 'orders', execute: () => fetch('/api/orders').then(r => r.json()) },
  { id: 'products', execute: () => fetch('/api/products').then(r => r.json()) },
]);
// { results: [...], successful: 3, failed: 0, duration: 150 }

// Sequential execution (each request receives previous results)
const sequential = await batch.executeSequential([
  { id: 'user', execute: () => fetch('/api/user/1').then(r => r.json()) },
  { id: 'orders', execute: (prev) => fetch(`/api/orders?userId=${prev.user.id}`).then(r => r.json()) },
]);

// Aggregate results
const merged = batch.aggregate(result.results, 'merge');    // Merge all into one object
const collected = batch.aggregate(result.results, 'collect'); // Array of results

// Progress tracking
const batchWithProgress = new BatchOrchestrator({
  onProgress: (completed, total, result) => console.log(`${completed}/${total}`),
});

// Statistics
batch.getStats(); // { totalBatches, totalRequests, successRate, avgDuration }
```

### Field Analytics Collector

```js
const { FieldStats } = require('api-bridge-ai');

const stats = new FieldStats();

// Record field transformations
stats.record('user_name', { targetKey: 'userName', confidence: 0.97, method: 'pattern_conversion' });
stats.record('usr_eml', { targetKey: 'userEmail', confidence: 0.72, method: 'fuzzy_abbreviation' });

// Per-field analytics
stats.getFieldStats('user_name');
// { count: 1, methods: { pattern_conversion: 1 }, avgConfidence: 0.97, ... }

// Top transformed fields
stats.getTopFields(10);
// [{ field: 'user_name', count: 100, primaryMethod: 'pattern_conversion', avgConfidence: 0.97 }, ...]

// Find fields that need schema definitions
stats.getLowConfidenceFields(0.75);
// [{ field: 'usr_eml', avgConfidence: 0.72, suggestedAction: 'add_synonym' }, ...]

// Coverage report
stats.getCoverageReport();
// { totalTransformations, uniqueFields, confidenceDistribution: { high, medium, low }, autoResolvedRate }

// Export all analytics
const analytics = stats.export();
```

### Conditional Transformation

```js
const { ConditionalTransform } = require('api-bridge-ai');

const ct = new ConditionalTransform();

// Value-based rules
ct.when('nullToNA', (v) => v === null, () => 'N/A');
ct.when('trimStrings', (v) => typeof v === 'string' && v !== v.trim(), (v) => v.trim());
ct.when('roundNumbers', (v) => typeof v === 'number' && !Number.isInteger(v), (v) => Math.round(v * 100) / 100);

// Context-aware rules (access sibling fields)
ct.when('vipDiscount',
  (value, field, context) => context.isVip === true,
  (value) => value * 0.8,
  { fields: ['price'] }
);

// Priority ordering
ct.when('lowPriority', condition, transform, { priority: 1 });
ct.when('highPriority', condition, transform, { priority: 10 }); // Evaluated first

// Default fallbacks
ct.otherwise('status', (v) => String(v).toUpperCase());

// Apply to a single field
const result = ct.apply(null, 'status');
// { value: 'N/A', rule: 'nullToNA', applied: true }

// Apply to all fields in an object
const { data, applied } = ct.applyAll({ name: '  John  ', status: null, price: 100 });
// data: { name: 'John', status: 'N/A', price: 100 }

// Statistics
ct.getStats(); // { totalRules, totalEvaluations, ruleHits, topRules }
```

### Deep Merge Engine

```js
const { DeepMerge } = require('api-bridge-ai');

const merger = new DeepMerge({
  arrayStrategy: 'union',       // 'concat', 'union', 'replace', 'interleave'
  conflictStrategy: 'latest',   // 'first', 'latest', 'custom'
});

// Basic deep merge
const result = merger.merge(
  { user: { name: 'John', age: 30 }, tags: ['admin'] },
  { user: { age: 31, email: 'john@test.com' }, tags: ['editor'] }
);
// { user: { name: 'John', age: 31, email: 'john@test.com' }, tags: ['admin', 'editor'] }

// Custom conflict resolution
const custom = new DeepMerge({
  conflictStrategy: 'custom',
  conflictResolver: (key, a, b) => key === 'priority' ? Math.max(a, b) : b,
});

// Labeled merge with source tracking
const { result: merged, sources } = merger.mergeLabeled([
  { label: 'userApi', data: { name: 'John' } },
  { label: 'orderApi', data: { lastOrder: '2024-01-15' } },
]);
// sources: { name: 'userApi', lastOrder: 'orderApi' }

// Multiple sources
merger.merge(source1, source2, source3, source4);

// Prototype pollution protection built-in
// Statistics
merger.getStats(); // { totalMerges, conflicts, fieldsProcessed }
```

### Output Formatter

```js
const { OutputFormatter } = require('api-bridge-ai');

const fmt = new OutputFormatter();

// JSON pretty-print
fmt.toJSON({ name: 'John', age: 30 });

// XML serialization
fmt.toXML({ name: 'John', age: 30 });
// <?xml version="1.0" encoding="UTF-8"?><root><name>John</name><age>30</age></root>

// XML with custom root/item names
fmt.toXML(dataArray, { root: 'users', item: 'user' });

// CSV output
fmt.toCSV([{ name: 'John', age: 30 }, { name: 'Jane', age: 25 }]);
// name,age\nJohn,30\nJane,25

// Key-value pairs (great for logging)
fmt.toKeyValue({ user: { name: 'John' } });
// user.name: John

// Table format (great for console)
fmt.toTable([{ name: 'John', age: 30 }, { name: 'Jane', age: 25 }]);

// Template formatting
fmt.fromTemplate({ name: 'John', age: 30 }, 'Hello {{name}}, you are {{age}} years old');
// 'Hello John, you are 30 years old'

// Statistics
fmt.getStats(); // { json: 1, xml: 2, csv: 1, keyvalue: 0, table: 0, template: 1 }
```

### Request Interceptor Chain

```js
const { RequestInterceptor } = require('api-bridge-ai');

const interceptor = new RequestInterceptor();

// Add request interceptors (priority-ordered)
interceptor.useRequest('addAuth', (ctx) => ({
  ...ctx,
  headers: { ...ctx.headers, Authorization: 'Bearer ' + getToken() },
}), { priority: 100, group: 'auth' });

interceptor.useRequest('addCorrelationId', (ctx) => ({
  ...ctx,
  headers: { ...ctx.headers, 'X-Correlation-ID': generateId() },
}), { priority: 50, group: 'logging' });

// Add response interceptors
interceptor.useResponse('transformBody', (ctx) => ({
  ...ctx,
  data: transformFields(ctx.data),
}));

// Run interceptor chains
const { context: req } = await interceptor.interceptRequest({ url: '/api/users', headers: {} });
const { context: res } = await interceptor.interceptResponse({ status: 200, data: rawData });

// Short-circuit (stop chain and return immediately)
interceptor.useRequest('rateLimit', (ctx) => {
  if (isRateLimited()) return { ...ctx, _shortCircuit: true, error: 'Rate limited' };
  return ctx;
}, { priority: 200 });

// Enable/disable groups
interceptor.setGroupEnabled('auth', false);  // Disable all auth interceptors

// Per-interceptor error handling
interceptor.useRequest('risky', handler, {
  onError: (err, ctx) => ({ ...ctx, fallback: true }),
});

// List, remove, stats
interceptor.list();     // { request: [...], response: [...] }
interceptor.remove('addAuth');
interceptor.getStats(); // { requestInterceptions, responseInterceptions, shortCircuits, errors }
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

## V7 Features

### Weighted Ensemble Fuzzy Matcher

v7 replaces the max-based scoring of v6 with a **weighted ensemble** that combines all 7 matching strategies with tuned weights for 99%+ accuracy:

```js
const { FuzzyMatcher } = require('api-bridge-ai');

const fuzzy = new FuzzyMatcher();

// Strategies: Levenshtein, token match, vowel-drop, phonetic,
//             abbreviation, n-gram, substring — all combined
const result = fuzzy.findBestMatch('usr_email', ['user_email', 'user_name']);
console.log(result);
// { match: 'user_email', confidence: 0.92, method: 'fuzzy_ensemble' }

// Get/set strategy weights
console.log(fuzzy.getWeights());
// { levenshtein: 0.30, tokenMatch: 0.25, vowelDrop: 0.10, ... }

fuzzy.setWeights({ levenshtein: 0.5, tokenMatch: 0.3 }); // Custom tuning
```

### N-Gram Similarity Matching

New bigram-based similarity scoring that catches matches missed by Levenshtein distance — especially effective for short/garbled field names:

```js
const { ngramSimilarity, ngrams } = require('api-bridge-ai/src/fuzzy-matcher');

// Generate bigrams
ngrams('hello'); // ['he', 'el', 'll', 'lo']

// Dice coefficient similarity
ngramSimilarity('username', 'usrname'); // ~0.67
ngramSimilarity('email', 'emial');      // ~0.50
```

### Context-Aware Field Resolution

v7's transformer uses abbreviation expansion in semantic similarity, meaning fields like `txn_id`, `inv_num`, or `cert_id` are automatically matched to `transaction_id`, `invoice_number`, or `certificate_id` even without a schema.

### Enhanced Type Coercion

v7 adds case-insensitive boolean parsing, percentage strings, comma-separated numbers, and more date formats:

```js
const { TypeCoercer } = require('api-bridge-ai');

const coercer = new TypeCoercer();

// Case-insensitive booleans
coercer.coerceValue('TRUE', 'boolean', 'flag');   // { value: true, coerced: true }
coercer.coerceValue('Yes', 'boolean', 'active');   // { value: true, coerced: true }
coercer.coerceValue('OFF', 'boolean', 'enabled');  // { value: false, coerced: true }

// Percentage strings
coercer.coerceValue('50%', 'float', 'rate');       // { value: 0.5, coerced: true }
coercer.coerceValue('75%', 'number', 'completion');// { value: 0.75, coerced: true }

// Comma-separated numbers
coercer.coerceValue('1,000', 'integer', 'count');  // { value: 1000, coerced: true }
coercer.coerceValue('1,234.56', 'float', 'amt');   // { value: 1234.56, coerced: true }

// More date formats (DD/MM/YYYY, MM-DD-YYYY)
coercer.coerceValue('15/01/2024', 'date', 'created_at');  // Date object

// Comma-separated strings as arrays
coercer.coerceValue('red,green,blue', 'array', 'colors'); // ['red', 'green', 'blue']
```

### Expanded Synonym Dictionary

v7 adds **4 new domain dictionaries** with 60+ new synonym groups:

| Domain | Example Groups |
|--------|---------------|
| **Financial** | balance/account_balance, credit/debit, routing_number/sort_code, transfer/wire/remittance |
| **IoT/Hardware** | device/gadget/endpoint, sensor/probe/detector, temperature/celsius, battery/charge |
| **Education** | student/pupil/learner, teacher/instructor/professor, course/class/module, grade/score/mark |
| **Social** | follower/subscriber/fan, post/article/entry, like/upvote/reaction, notification/alert/push |

### Database Prefix Stripping

The cryptic resolver now automatically strips common database prefixes (`tbl_`, `fk_`, `pk_`, `vw_`, `sp_`, `idx_`, `fn_`) before matching:

```js
const { CrypticResolver } = require('api-bridge-ai');

const resolver = new CrypticResolver();

resolver.resolve('tbl_user_name', ['user_name', 'account_name']);
// { match: 'user_name', confidence: 0.70, method: 'db_prefix_strip' }

resolver.resolve('fk_order_id', ['order_id', 'product_id']);
// { match: 'order_id', confidence: 0.70, method: 'db_prefix_strip' }
```

---

## V6 Features

### Enhanced Fuzzy Matcher

Multi-strategy fuzzy matching engine for resolving typos, abbreviations, and near-matches with 97%+ accuracy:

```js
const { FuzzyMatcher } = require('api-bridge-ai');

const fuzzy = new FuzzyMatcher({
  levenshteinThreshold: 0.35,   // Max normalized distance to consider
  minConfidence: 0.55,           // Minimum confidence to report
  expandAbbreviations: true,     // Expand common abbreviations (usr→user, eml→email)
  usePhonetic: true,             // Use phonetic similarity (ph/f confusion, etc.)
  useVowelDrop: true,            // Detect vowel-dropped abbreviations (usr→user)
});

// Find best match using 5 strategies: Levenshtein, token matching,
// vowel-drop detection, phonetic similarity, abbreviation expansion
const result = fuzzy.findBestMatch('usr_email', ['user_email', 'user_name', 'phone']);
// { match: 'user_email', confidence: 0.92, method: 'fuzzy_abbreviation' }

// Works with common typos
const typo = fuzzy.findBestMatch('frist_name', ['first_name', 'last_name']);
// { match: 'first_name', confidence: 0.88, method: 'fuzzy_levenshtein' }

// Vowel-dropped abbreviations
const abbr = fuzzy.findBestMatch('usr_nm', ['user_name', 'email']);
// { match: 'user_name', confidence: 0.85, method: 'fuzzy_vowel_drop' }

// Confidence boosting when multiple strategies agree
// If 2+ strategies score > 0.5, the best score gets a boost

// Check available strategies
fuzzy.getStrategies();
// { levenshtein: true, tokenMatch: true, vowelDrop: true, phonetic: true, abbreviation: true }
```

**Built-in abbreviation map** includes 80+ common developer abbreviations:
`usr→user`, `eml→email`, `addr→address`, `desc→description`, `cfg→config`, `pwd→password`, `tok→token`, `perm→permission`, `loc→location`, etc.

**Matching strategies:**
| Strategy | What it detects | Example |
|----------|----------------|---------|
| Levenshtein | Character-level similarity | `frist_name` → `first_name` |
| Token match | Token-level similarity | `user_full_name` → `full_user_name` |
| Vowel drop | Missing vowels | `usr` → `user`, `eml` → `email` |
| Phonetic | Sound-alike words | `fone` → `phone` |
| Abbreviation | Known abbreviations | `addr` → `address`, `msg` → `message` |

---

### Cryptic Name Resolver

Best-effort resolution of cryptic and arbitrary field names commonly found in legacy systems:

```js
const { CrypticResolver } = require('api-bridge-ai');

const resolver = new CrypticResolver({
  minConfidence: 0.45,         // Minimum confidence to report
  stripCrypticPrefix: true,     // Strip prefixes like x_, z9_, etc.
  useSuffixMatching: true,      // Match by shared suffixes (_id, _flag, _date, etc.)
  useVocabulary: true,          // Match fragments against known vocabulary
});

// Strategy 1: Strip cryptic prefix and match remainder
const result = resolver.resolve('z9_ref_id', ['reference_id', 'user_id']);
// { match: 'reference_id', confidence: 0.65, method: 'prefix_strip', stripped: 'ref_id' }

// Strategy 2: Suffix-based matching
const suffix = resolver.resolve('xq_user_flag', ['is_active', 'user_flag']);
// { match: 'user_flag', confidence: 0.65, method: 'suffix_match', stripped: '_flag' }

// Strategy 3: Fragment matching against known vocabulary
const vocab = resolver.resolve('x1_email_addr', ['email_address', 'phone']);
// { match: 'email_address', confidence: 0.60, method: 'vocabulary_match', stripped: 'email' }

// Strategy 4: Token overlap after cleaning
const overlap = resolver.resolve('z_user_name_2', ['user_name', 'email']);
// { match: 'user_name', confidence: 0.60, method: 'token_overlap', stripped: 'user_name' }

// Detect if a field name looks cryptic
resolver.isCryptic('z9_ref_id');    // true (letter+digit prefix)
resolver.isCryptic('x_flag');       // true (single letter prefix)
resolver.isCryptic('user_name');    // false (recognizable words)
```

**Known suffixes** for matching: `_id`, `_ref`, `_key`, `_code`, `_type`, `_name`, `_flag`, `_status`, `_date`, `_time`, `_count`, `_url`, `_email`, `_price`, `_enabled`, `_index`, `_message`, `_config`, and 40+ more.

---

### Schema-Based Type Coercer

Automatic type detection and coercion for resolving type conflicts between API data and schemas:

```js
const { TypeCoercer } = require('api-bridge-ai');

const coercer = new TypeCoercer({
  autoCoerce: true,           // Automatically coerce values (default true)
  reportConflicts: true,       // Record type conflicts (default true)
  strictDates: false,          // Only accept ISO 8601 dates (default false)
});

// Coerce individual values
const result = coercer.coerceValue('true', 'boolean', 'isActive');
// { value: true, coerced: true, conflict: { field: 'isActive', sourceType: 'boolean_string', ... } }

coercer.coerceValue('42', 'integer', 'count');
// { value: 42, coerced: true, conflict: { ... } }

coercer.coerceValue('2024-01-15', 'date', 'createdAt');
// { value: Date('2024-01-15'), coerced: true, conflict: { ... } }

// Coerce an entire object based on a schema
const { data, coerced, conflicts } = coercer.coerceObject(
  { isActive: '1', count: '42', createdAt: '2024-01-15' },
  { isActive: { type: 'boolean' }, count: { type: 'integer' }, createdAt: { type: 'date' } },
);
// data: { isActive: true, count: 42, createdAt: Date('2024-01-15') }
// coerced: ['isActive', 'count', 'createdAt']

// Detect type conflicts without coercing
const issues = coercer.detectConflicts(data, schema);
// [{ field: 'isActive', sourceType: 'boolean_string', targetType: 'boolean', canCoerce: true }]

// Statistics
coercer.getStats();
// { totalConflicts: 3, coerced: 3, failed: 0, byType: { boolean_string_to_boolean: 1, ... } }

// Manage conflict history
coercer.getConflicts();    // Get all recorded conflicts
coercer.clearConflicts();  // Clear history
```

**Supported coercions:**
| Source | Target | Examples |
|--------|--------|----------|
| `'true'`, `'1'`, `'yes'` | `boolean` | `'true'` → `true` |
| `'false'`, `'0'`, `'no'` | `boolean` | `'0'` → `false` |
| `'42'` | `integer` | `'42'` → `42` |
| `'3.14'` | `float` / `number` | `'3.14'` → `3.14` |
| `'2024-01-15'` | `date` | ISO string → `Date` object |
| `'{"a":1}'` | `object` / `json` | JSON string → parsed object |
| `'[1,2]'` | `array` | JSON string → parsed array |
| any | `string` | `42` → `'42'` |

**Type inference** detects: `boolean`, `integer`, `float`, `date`, `array`, `object`, `string`, `null`, `boolean_string`, `numeric_boolean`, `date_string`, `integer_string`, `float_string`, `json_string`.

---

## V5 Features

### Retry Strategy

Advanced pluggable retry strategies with configurable backoff, budget, and abort support:

```js
const { RetryStrategy } = require('api-bridge-ai');

// Exponential backoff with jitter (default)
const retry = new RetryStrategy({
  strategy: 'exponentialJitter', // 'linear' | 'exponential' | 'exponentialJitter' | 'constant'
  maxRetries: 5,
  baseDelay: 1000,
  maxDelay: 30000,
});
const data = await retry.execute(() => fetch('/api/users').then(r => r.json()));

// Custom backoff function
const custom = new RetryStrategy({
  backoffFn: (attempt, baseDelay) => baseDelay * attempt * attempt,
  maxRetries: 3,
});

// With retry budget (max 10 retries per minute)
const budgeted = new RetryStrategy({
  budgetWindow: 60000,
  budgetMax: 10,
});

// With abort signal
const controller = new AbortController();
const data = await retry.execute(() => fetch('/api'), { signal: controller.signal });

// onRetry callback
const retry = new RetryStrategy({
  onRetry: (attempt, delay, error) => {
    console.log(`Retry #${attempt} in ${delay}ms: ${error.message}`);
  },
});

// Check if status code is retryable
retry.isRetryable(503); // true
retry.isRetryable(404); // false

// Statistics
retry.getStats(); // { totalExecutions, totalRetries, totalSuccesses, totalFailures, lastError }
```

### Request Logger

Structured request/response logging with automatic field redaction:

```js
const { RequestLogger } = require('api-bridge-ai');

const logger = new RequestLogger({
  level: 'info',          // 'debug' | 'info' | 'warn' | 'error' | 'silent'
  redactWith: '[REDACTED]',
  sensitiveFields: ['ssn', 'creditCard'],  // Extends built-in list
  includeBody: true,
  includeHeaders: false,
  maxBodyLength: 10000,
});

// Log request/response with correlation IDs
const correlationId = logger.correlationId();
logger.logRequest({ method: 'POST', url: '/api/users', body: { name: 'John', password: 'secret' }, correlationId });
logger.logResponse({ status: 201, url: '/api/users', duration: 42, correlationId });
logger.logError({ message: 'Timeout', url: '/api/users', correlationId });

// Automatic sensitive field redaction
logger.redact({ username: 'john', password: 'secret123', token: 'abc' });
// → { username: 'john', password: '[REDACTED]', token: '[REDACTED]' }

// Query log entries
logger.getEntries({ type: 'request' });
logger.getEntries({ level: 'error' });
logger.getEntries({ correlationId: 'req_abc123_0001' });

// Custom transport
const logger = new RequestLogger({
  transport: (entry) => myExternalLogger.log(entry),
});

// Statistics
logger.getStats(); // { totalLogs, byLevel, redactedFields, bufferSize }
```

### Schema Registry

Centralized, versioned schema storage with compatibility checking:

```js
const { SchemaRegistry } = require('api-bridge-ai');

const registry = new SchemaRegistry({
  strict: false,
  requireCompatible: true,  // Enforce backward compatibility
});

// Register schemas (auto-versioned)
registry.register('User', {
  name: { type: 'string', required: true },
  email: { type: 'string', required: true },
});
registry.register('User', {
  name: { type: 'string', required: true },
  email: { type: 'string', required: true },
  age: { type: 'number' },
}, { metadata: { author: 'team-a' } });

// Retrieve latest or specific version
const latest = registry.get('User');
const v1 = registry.getVersion('User', 1);

// Namespace support for multi-service
registry.register('User', schema, { namespace: 'auth-service' });
registry.get('User', { namespace: 'auth-service' });

// Compatibility checking
const compat = registry.checkCompatibility(oldSchema, newSchema);
// { backward: true/false, forward: true/false, breakingChanges: [], additions: [] }

// Search for fields across all schemas
registry.search('email');
// [{ name: 'User', namespace: 'default', version: 2, field: 'email' }]

// Export/import for persistence
const snapshot = registry.export();
registry.import(snapshot);

// Statistics
registry.getStats(); // { totalRegistrations, totalLookups, totalSchemas, namespaces }
```

### Response Streamer

Chunked JSON response transformation with field filtering and progress tracking:

```js
const { ResponseStreamer } = require('api-bridge-ai');

const streamer = new ResponseStreamer({
  convention: 'camelCase',
  chunkSize: 50,                           // Keys per chunk
  includeFields: ['first_name', 'email'],  // Whitelist
  excludeFields: ['password'],             // Blacklist
  onChunk: (chunk, index) => console.log(`Chunk ${index}:`, chunk),
  onProgress: ({ processed, total, percent }) => console.log(`${percent}%`),
});

// Transform a large object in chunks
const result = streamer.process(largeApiResponse);

// Transform an array of objects
const users = streamer.processArray(usersFromApi);

// Accumulator for incremental building
const acc = streamer.createAccumulator();
acc.add({ first_name: 'John' });
acc.add({ last_name: 'Doe' });
const merged = acc.getResult();
// { firstName: 'John', lastName: 'Doe' }

// Statistics
streamer.getStats(); // { chunksProcessed, keysTransformed, totalBytesProcessed, streamsCompleted }
```

### Dependency Graph

DAG-based orchestration for dependent API calls with parallel execution:

```js
const { DependencyGraph } = require('api-bridge-ai');

const graph = new DependencyGraph();

// Add independent nodes (run in parallel)
graph.add('fetchUser', async () => {
  return await fetch('/api/user/1').then(r => r.json());
});
graph.add('fetchConfig', async () => {
  return await fetch('/api/config').then(r => r.json());
});

// Add dependent node (runs after its deps complete)
graph.add('merge', async (results) => {
  return { ...results.fetchUser, config: results.fetchConfig };
}, { deps: ['fetchUser', 'fetchConfig'] });

// Conditional execution
graph.add('optional', async () => 'extra data', {
  deps: ['fetchUser'],
  condition: (results) => results.fetchUser.premium === true,
  defaultValue: null,
});

// Execute the graph
const results = await graph.execute();
// { fetchUser: {...}, fetchConfig: {...}, merge: {...}, optional: null }

// Validate before execution
const validation = graph.validate();
// { valid: true/false, errors: [] }

// Get topological execution order
graph.getOrder(); // ['fetchUser', 'fetchConfig', 'merge', 'optional']

// Statistics
graph.getStats(); // { totalExecutions, totalNodeRuns, lastDuration, errors }
```

### Mock Server

Built-in mock server for testing with request recording and assertion helpers:

```js
const { MockServer } = require('api-bridge-ai');

const mock = new MockServer({
  defaultDelay: 0,
  defaultStatus: 200,
  recordRequests: true,
  strict: false,
});

// Static responses
mock.register('GET', '/api/users', {
  status: 200,
  body: [{ id: 1, name: 'John' }],
  headers: { 'x-total': '1' },
});

// Wildcard patterns
mock.register('GET', '/api/users/*', { body: { id: 1 } });

// Dynamic handlers
mock.register('POST', '/api/users', {
  handler: (req) => ({
    status: 201,
    body: { id: Date.now(), ...req.body },
  }),
});

// Sequence responses (different per call)
mock.registerSequence('GET', '/api/flaky', [
  { status: 500, body: { error: 'Server Error' } },
  { status: 200, body: { data: 'recovered' } },
]);

// Handle requests
const response = await mock.handle('GET', '/api/users');

// Request assertion
const result = mock.assertCalled('GET', '/api/users', { times: 1 });
// { called: true, count: 1, passed: true, requests: [...] }

// Get recorded requests
mock.getRequests({ method: 'POST' });

// Statistics
mock.getStats(); // { totalRequests, matchedRequests, unmatchedRequests, routesRegistered }
```

### Health Check

Endpoint health monitoring with configurable probes and alert callbacks:

```js
const { HealthCheck } = require('api-bridge-ai');

const health = new HealthCheck({
  failureThreshold: 3,    // Consecutive failures → UNHEALTHY
  successThreshold: 2,    // Consecutive successes → HEALTHY
  degradedThreshold: 1,   // Consecutive failures → DEGRADED
  defaultTimeout: 5000,
  onStatusChange: (endpoint, prev, next) => {
    console.log(`${endpoint}: ${prev} → ${next}`);
  },
});

// Register health check probes
health.register('database', async () => {
  const result = await db.ping();
  return result.ok;
}, { timeout: 3000 });

health.register('redis', async () => {
  return await redis.ping() === 'PONG';
});

// Manual check
const result = await health.check('database');
// { status: 'HEALTHY', duration: 12, error: null }

// Check all endpoints
const results = await health.checkAll();

// Aggregated status
const overall = health.getOverallStatus();
// { status: 'HEALTHY', endpoints: { database: 'HEALTHY', redis: 'HEALTHY' } }

// Check history
health.getHistory('database');
// [{ success: true, duration: 12, timestamp: '...', error: null }, ...]

// Auto-check with interval
health.register('api', checkFn, { interval: 30000 }); // Check every 30s

// Statistics
health.getStats(); // { totalChecks, totalFailures, totalSuccesses, endpointsRegistered }
```

### Event Bus

Typed, cross-module pub/sub event bus with wildcards and priority ordering:

```js
const { EventBus } = require('api-bridge-ai');

const bus = new EventBus({
  recordHistory: true,
  maxHistory: 100,
  maxListeners: 100,
});

// Subscribe to events
bus.on('api.request', (data) => console.log('Request:', data));
bus.on('api.response', (data) => console.log('Response:', data));

// Wildcard subscriptions
bus.on('api.*', (data) => console.log('Any API event:', data));

// Priority ordering (higher runs first)
bus.on('transform', fn, { priority: 10 });

// Once-only listeners
bus.once('init', (data) => console.log('Initialized'));

// Emit events
await bus.emit('api.request', { url: '/users', method: 'GET' });

// Synchronous emit
bus.emitSync('log', { message: 'fast path' });

// Wait for an event (promise-based)
const data = await bus.waitFor('ready', 5000); // 5s timeout

// Event history & replay
const history = bus.getHistory('api.request');
bus.replay('api.request', (data) => processHistorical(data));

// Unsubscribe
const unsub = bus.on('event', handler);
unsub(); // Remove listener

// Statistics
bus.getStats(); // { totalEmits, totalListeners, totalDeliveries, eventsWithListeners, historySize }
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

V6 introduces 3 additional structured error classes on top of V5's 19 (22 total):

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
  RetryError,              // Retry strategy exhaustion (v5)
  SchemaRegistryError,     // Schema registry failure (v5)
  DependencyGraphError,    // Dependency graph cycle/execution (v5)
  MockServerError,         // Mock server matching/handling (v5)
  HealthCheckError,        // Health check probe failure (v5)
  EventBusError,           // Event bus subscription/emission (v5)
  FuzzyMatchError,         // Fuzzy matching failure (v6)
  TypeCoercionError,       // Type coercion failure (v6)
  CrypticResolverError,    // Cryptic name resolution failure (v6)
} = require('api-bridge-ai');

try {
  await retry.execute(() => api.get('/data'));
} catch (err) {
  if (err instanceof RetryError) {
    console.log(err.details); // { attempt: 4, maxRetries: 3, reason: 'max_retries_exceeded' }
  }
  if (err instanceof SchemaRegistryError) {
    console.log(err.details); // { schemaName: 'User', reason: 'not_found' }
  }
  if (err instanceof DependencyGraphError) {
    console.log(err.details); // { nodeName: 'fetch', reason: 'cycle_detected' }
  }
  if (err instanceof MockServerError) {
    console.log(err.details); // { operation: 'handle', reason: 'no_match' }
  }
  if (err instanceof HealthCheckError) {
    console.log(err.details); // { endpoint: 'api', reason: 'timeout' }
  }
  if (err instanceof EventBusError) {
    console.log(err.details); // { event: 'test', reason: 'max_listeners' }
  }
  if (err instanceof FuzzyMatchError) {
    console.log(err.details); // { sourceKey: 'usr_nm', candidates: ['user_name', ...] }
  }
  if (err instanceof TypeCoercionError) {
    console.log(err.details); // { field: 'isActive', sourceType: 'string', targetType: 'boolean' }
  }
  if (err instanceof CrypticResolverError) {
    console.log(err.details); // { sourceKey: 'z9_ref', reason: 'no_match_found' }
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
| `RetryError` | `RETRY_ERROR` | v5 | Retry exhaustion |
| `SchemaRegistryError` | `SCHEMA_REGISTRY_ERROR` | v5 | Schema registry |
| `DependencyGraphError` | `DEPENDENCY_GRAPH_ERROR` | v5 | Dependency graph |
| `MockServerError` | `MOCK_SERVER_ERROR` | v5 | Mock server |
| `HealthCheckError` | `HEALTH_CHECK_ERROR` | v5 | Health monitoring |
| `EventBusError` | `EVENT_BUS_ERROR` | v5 | Event bus |
| `FuzzyMatchError` | `FUZZY_MATCH_ERROR` | v6 | Fuzzy matching failure |
| `TypeCoercionError` | `TYPE_COERCION_ERROR` | v6 | Type coercion failure |
| `CrypticResolverError` | `CRYPTIC_RESOLVER_ERROR` | v6 | Cryptic name resolution |
| `FieldAliaserError` | `FIELD_ALIASER_ERROR` | v8 | Field alias resolution failure |
| `SchemaMigrationError` | `SCHEMA_MIGRATION_ERROR` | v8 | Schema migration failure |
| `BatchOrchestratorError` | `BATCH_ORCHESTRATOR_ERROR` | v8 | Batch orchestration failure |
| `DeepMergeError` | `DEEP_MERGE_ERROR` | v8 | Deep merge conflict or depth failure |
| `InterceptorError` | `INTERCEPTOR_ERROR` | v8 | Request interceptor chain failure |

---

## Architecture

```
api-bridge-ai/
├── src/
│   ├── index.js                   # Main entry — bridge(), bridgeFetch(), transform()
│   ├── core/                      # Core transformation engine
│   │   ├── index.js               # Core barrel export
│   │   ├── errors.js              # Custom error class hierarchy (27 types)
│   │   ├── transformer.js         # 7-level mismatch detection & correction
│   │   ├── learning.js            # Persistent learning engine
│   │   ├── normalizer.js          # Response format normalizer
│   │   ├── synonyms.js            # 160+ synonym groups dictionary
│   │   ├── fuzzy-matcher.js       # Weighted ensemble fuzzy matching (7 strategies)
│   │   ├── cryptic-resolver.js    # Cryptic/arbitrary name resolver
│   │   ├── type-coercer.js        # Schema-based type coercer
│   │   ├── field-aliaser.js       # Multi-alias field resolution
│   │   ├── validator.js           # Schema validation engine
│   │   ├── inference.js           # Auto schema inference
│   │   ├── conditional-transform.js # Conditional transformation rules
│   │   └── schema-migrator.js     # Version migration engine
│   ├── utils/                     # Utility modules
│   │   ├── index.js               # Utils barrel export
│   │   ├── cache.js               # LRU response cache with TTL
│   │   ├── dedup.js               # Request deduplication
│   │   ├── diff.js                # Schema diff engine
│   │   ├── exporter.js            # CSV & JSON report generators
│   │   ├── masking.js             # PII data masking
│   │   ├── metrics.js             # Performance metrics collector
│   │   ├── patch.js               # JSON Patch generator (RFC 6902)
│   │   ├── typegen.js             # TypeScript type generator
│   │   ├── deep-merge.js          # Intelligent deep merge
│   │   ├── output-formatter.js    # Multi-format output (JSON, XML, CSV, table)
│   │   ├── field-stats.js         # Field analytics collector
│   │   ├── projection.js          # Field projection (pick/omit/rename/reshape)
│   │   └── request-logger.js      # Structured request logging
│   └── adapters/                  # Protocol adapters & middleware
│       ├── index.js               # Adapters barrel export
│       ├── graphql.js             # GraphQL response/variable bridge
│       ├── webhook.js             # Webhook handler & normalizer
│       ├── openapi.js             # OpenAPI/Swagger schema importer
│       ├── mock-server.js         # Built-in mock server for testing
│       ├── response-streamer.js   # Chunked response transformer
│       ├── circuit-breaker.js     # Circuit breaker (fault tolerance)
│       ├── retry-strategy.js      # Advanced retry strategies
│       ├── rate-limiter.js        # Rate limiter (token bucket)
│       ├── health-check.js        # Endpoint health monitoring
│       ├── middleware.js           # Composable before/after pipeline
│       ├── pipeline.js            # Composable transformation pipeline
│       ├── plugins.js             # Plugin system
│       ├── request-interceptor.js # Request interceptor chain
│       ├── batch-orchestrator.js  # Batch request orchestrator
│       ├── dependency-graph.js    # API dependency graph orchestrator
│       ├── event-bus.js           # Typed pub/sub event bus
│       ├── schema-registry.js     # Versioned schema registry
│       └── versioning.js          # API version management
├── types/
│   └── index.d.ts                 # TypeScript type declarations
├── examples/
│   ├── basic-usage.js             # Basic usage examples
│   ├── advanced-usage.js          # Advanced SDK patterns
│   └── plugin-example.js          # Plugin development guide
├── test.js                        # 462-test comprehensive suite
├── package.json                   # npm package config with subpath exports
├── CHANGELOG.md                   # Version history
└── README.md
```

---

## Running Tests

```bash
npm test
```

This runs 462 tests covering:
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
- Custom error classes (27 types)
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
- **v5: Retry strategy** (linear, exponential, jitter, custom, budget, callbacks)
- **v5: Request logger** (structured logging, redaction, levels, transports, correlation IDs)
- **v5: Schema registry** (versioned storage, compatibility, namespaces, search, export/import)
- **v5: Response streamer** (chunked processing, field filtering, accumulators, progress)
- **v5: Dependency graph** (DAG execution, parallel, cycle detection, conditional nodes)
- **v5: Mock server** (endpoint mocking, sequences, wildcards, assertions, recording)
- **v5: Health check** (probes, status aggregation, recovery, history, callbacks)
- **v5: Event bus** (pub/sub, wildcards, priority, once, replay, waitFor)
- **v6: Enhanced fuzzy matcher** (Levenshtein, token matching, vowel-drop, phonetic, abbreviation, confidence boosting)
- **v6: Cryptic name resolver** (prefix stripping, suffix matching, vocabulary matching, token overlap, cryptic detection)
- **v6: Schema-based type coercer** (boolean, integer, float, date, JSON coercion, conflict detection, batch coercion)
- **v7: Weighted ensemble matching** (7-strategy weighted scoring, tunable weights, ensemble vs max selection)
- **v7: N-gram similarity** (bigram generation, Dice coefficient, short-token matching)
- **v7: Expanded abbreviations** (financial, IoT, security, application abbreviations)
- **v7: Enhanced type coercion** (case-insensitive booleans, on/off, percentages, comma numbers, DD/MM/YYYY dates)
- **v7: Database prefix stripping** (tbl_, fk_, pk_, vw_, sp_, idx_ prefix removal)
- **v7: Expanded synonym dictionary** (financial, IoT, education, social domain groups)
- **v7: Transformer accuracy** (abbreviation-aware semantics, backward compatibility, nested objects)
- **v8: Field aliaser** (register, resolve, API-specific, bulk import/export, conflicts, unregister, stats)
- **v8: Schema migrator** (forward, backward, chained, transforms, dry-run, rollback, version detection, history)
- **v8: Batch orchestrator** (parallel, sequential, aggregation, failure strategies, progress, stats)
- **v8: Field stats** (record, per-field analytics, top fields, low confidence, coverage report, export)
- **v8: Conditional transform** (rules, priority, context-aware, otherwise, applyAll, remove, stats)
- **v8: Deep merge** (basic, nested, array strategies, conflict strategies, prototype pollution, source tracking, stats)
- **v8: Output formatter** (JSON, XML, CSV, key-value, table, template, XML escaping, stats)
- **v8: Request interceptor** (request/response chains, priority, short-circuit, groups, enable/disable, error handling, stats)
- **v8: Error classes** (FieldAliaserError, SchemaMigrationError, BatchOrchestratorError, DeepMergeError, InterceptorError)
- **v8: Backward compatibility** (all v7 exports available, all v8 exports available, transform still works)

---

## Axios Migration Guide

### Step 1: Install APIBridge AI

```bash
npm uninstall axios
npm install api-bridge-ai
```

### Step 2: Update Imports

```js
// Before
const axios = require('axios');
// or
import axios from 'axios';

// After
const apiBridge = require('api-bridge-ai');
// or
import apiBridge from 'api-bridge-ai';
```

### Step 3: Everything Just Works

```js
// ✅ Factory method
const api = apiBridge.create({ baseURL: '/api', timeout: 5000 });

// ✅ All HTTP methods
await api.get('/users');
await api.post('/users', { name: 'John' });
await api.put('/users/1', { name: 'Jane' });
await api.patch('/users/1', { active: true });
await api.delete('/users/1', { data: { reason: 'test' } });

// ✅ Interceptors
api.interceptors.request.use((config) => {
  config.headers.Authorization = 'Bearer token';
  return config;
});

// ✅ CancelToken
const source = apiBridge.CancelToken.source();
api.get('/slow', { cancelToken: source.token });
source.cancel('Operation cancelled');

// ✅ Error handling
try {
  await api.get('/missing');
} catch (err) {
  if (err.isAxiosError) {           // v13: property check works!
    console.log(err.code);          // ERR_BAD_REQUEST
    console.log(err.response.data); // error body
    console.log(err.response.headers.get('content-type')); // AxiosHeaders
    console.log(err.request);       // request object
  }
}

// ✅ Concurrent requests
const [users, orders] = await apiBridge.all([
  api.get('/users'),
  api.get('/orders'),
]);

// ✅ Default transforms
const api2 = apiBridge.create({
  transformRequest: [(data, headers) => {
    // Custom serialization
    return JSON.stringify(data);
  }],
});

// ✅ AxiosHeaders in responses
const res = await api.get('/users');
res.headers.get('content-type');    // case-insensitive
res.headers.has('Content-Type');    // true
res.headers.toJSON();               // plain object

// ✅ FormData
const formData = apiBridge.toFormData({ name: 'John', avatar: file });
await api.postForm('/upload', formData);
```

### What You Get Extra (Free)

When you replace Axios with APIBridge AI, you automatically get:
- **Intelligent field mapping**: `user_name` → `userName` automatically
- **Fuzzy matching**: `usr_nm` → `userName` with 95%+ confidence
- **Learning engine**: remembers field mappings across sessions
- **Smart Proxy mode**: `response.data.userName` resolves from any convention
- **60+ utility modules**: circuit breakers, GraphQL, schema migration, and more
- **Zero dependencies**: unlike Axios which depends on `follow-redirects`

---

## Migration from V7

V8 is backward compatible. Your V7 code will work without changes.

**Breaking changes:** None.

**Import path change:** None — the main import is the same as V7. Additionally, you can now use subpath imports:

```js
// Same as V7 (still works)
const { bridge, bridgeFetch, transform } = require('api-bridge-ai');

// New in V8: subpath imports
const { FuzzyMatcher } = require('api-bridge-ai/core');
const { DeepMerge } = require('api-bridge-ai/utils');
const { CircuitBreaker } = require('api-bridge-ai/adapters');
```

**New v8 features you can adopt incrementally:**

```js
// Multi-alias field resolution
const { FieldAliaser } = require('api-bridge-ai');
const aliaser = new FieldAliaser();
aliaser.register('userId', ['user_id', 'uid', 'member_id']);
aliaser.resolve('uid'); // { canonical: 'userId', matched: true }

// API-specific aliases
aliaser.register('userId', ['usr_id'], { api: 'legacyService' });
aliaser.resolve('usr_id', 'legacyService'); // { canonical: 'userId' }

// Schema migration engine
const { SchemaMigrator } = require('api-bridge-ai');
const migrator = new SchemaMigrator();
migrator.define('1.0', '2.0', { rename: { user_name: 'username' } });
migrator.migrate(data, '1.0', '2.0');

// Batch request orchestrator
const { BatchOrchestrator } = require('api-bridge-ai');
const batch = new BatchOrchestrator({ concurrency: 5 });
await batch.executeParallel([
  { id: 'users', execute: () => fetchUsers() },
  { id: 'orders', execute: () => fetchOrders() },
]);

// Field analytics
const { FieldStats } = require('api-bridge-ai');
const stats = new FieldStats();
stats.record('user_name', { confidence: 0.97, method: 'pattern_conversion' });
stats.getLowConfidenceFields(); // Find fields that need schema definitions

// Conditional transforms
const { ConditionalTransform } = require('api-bridge-ai');
const ct = new ConditionalTransform();
ct.when('nullToNA', (v) => v === null, () => 'N/A');
ct.applyAll({ name: 'John', status: null });

// Deep merge
const { DeepMerge } = require('api-bridge-ai');
const merger = new DeepMerge({ arrayStrategy: 'union' });
merger.merge(apiResponse1, apiResponse2);

// Output formatter
const { OutputFormatter } = require('api-bridge-ai');
const fmt = new OutputFormatter();
fmt.toXML(data);   // XML output
fmt.toCSV(data);   // CSV output
fmt.toTable(data);  // Table output
fmt.fromTemplate(data, 'Hello {{name}}');

// Request interceptor chain
const { RequestInterceptor } = require('api-bridge-ai');
const interceptor = new RequestInterceptor();
interceptor.useRequest('addAuth', (ctx) => ({ ...ctx, headers: { Authorization: 'Bearer token' } }));
```

---

## Industry Improvements & Roadmap

### Current Production Features
- ✅ **Modular architecture** — `core/`, `utils/`, `adapters/` separation
- ✅ **Subpath exports** — Tree-shakeable imports for smaller bundles
- ✅ **TypeScript declarations** — Full type safety out of the box
- ✅ **Plugin system** — Extensible via 8 hook points
- ✅ **27 structured error classes** — Precise error handling
- ✅ **462 tests** — Comprehensive test coverage
- ✅ **Zero config** — Works out of the box with sensible defaults
- ✅ **Single dependency** — Only `fastest-levenshtein` (no bloat)

### Suggested Future Improvements
- 📦 **ES Module support** — Add dual CJS/ESM builds via `exports` conditions
- 📊 **OpenTelemetry integration** — Distributed tracing support
- 🔌 **Official plugin registry** — Published plugins for common APIs (Stripe, Twilio, etc.)
- 🧪 **Property-based testing** — Fuzz testing for edge cases
- 📝 **JSON Schema validation** — Support standard JSON Schema (Draft 7+) alongside custom schemas
- 🚀 **Worker thread support** — Offload heavy transformations to worker threads
- 🌐 **Browser bundle** — UMD/ESM build for browser environments
- 📈 **Benchmarking suite** — Performance regression testing
- 🔄 **Streaming transforms** — Transform large datasets without buffering
- 🛡️ **Content Security Policy** — Built-in input sanitization

---

## License

MIT
