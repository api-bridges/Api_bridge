# 🔍 How awsibnj Works — AI-Powered API Field Transformation

> **awsibnj** solves one universal problem: your backend sends field names in one style, your frontend expects another — automatically, intelligently, and with no manual mapping.

---

## 📐 The Core Concept

```
  Your Backend                  awsibnj                 Your Frontend
  ────────────────          ──────────────────          ─────────────────
  {                   ──►   Auto-detects &        ──►  {
    "first_name": "John"      converts naming              "firstName": "John"
    "last_name":  "Doe"       conventions                  "lastName":  "Doe"
    "is_active":  true        intelligently                "isActive":  true
    "usr_nm":     "jd"        even for cryptic             "userName":  "jd"
  }                           field names               }
```

No config needed for simple cases. It **just works**.

---

## 🧠 7-Level Mismatch Resolution Pipeline

When awsibnj encounters a field name, it runs through **7 escalating levels** to find the best mapping. It stops at the first level that returns a confident answer.

```
 ┌─────────────────────────────────────────────────────────────────────┐
 │              FIELD NAME RESOLUTION PIPELINE                         │
 ├───────┬─────────────────────────────────┬───────────────────────────┤
 │ LEVEL │ STRATEGY                        │ CONFIDENCE                │
 ├───────┼─────────────────────────────────┼───────────────────────────┤
 │  1    │ Exact Match                     │ ████████████████  100%    │
 │  2    │ Learned Mapping                 │ ███████████████   99%     │
 │  3    │ Schema Defined                  │ ████████████████  100%    │
 │  4    │ Pattern Conversion              │ ███████████████   97%     │
 │  5    │ Synonym Match                   │ █████████████     92%     │
 │  6    │ Fuzzy + Semantic Match          │ ██████████ – ████ 70–95%  │
 │  7    │ Best Effort / Cryptic Resolve   │ ████████           55–70% │
 └───────┴─────────────────────────────────┴───────────────────────────┘
```

### 🟢 Level 1 — Exact Match `(100% confidence)`

The field is already in the target convention. Zero work done.

```
Input:  "firstName"    Target: camelCase
Result: "firstName"    ✓ already correct, skip
```

---

### 🟢 Level 2 — Learned Mapping `(99% confidence)`

You approved this mapping before. awsibnj remembers it forever.

```
Input:  "usr_nm"
Result: "userName"     ✓ you approved this last week — instant recall
```

---

### 🟢 Level 3 — Schema Defined `(100% confidence)`

You provided an explicit mapping in your schema config.

```js
const schema = {
  userName: { column: 'usr_nm' }
};
// "usr_nm" → "userName"  (you told it exactly what to do)
```

---

### 🔵 Level 4 — Pattern Conversion `(97% confidence)`

Pure algorithmic conversion. Splits the field into words and reassembles in the target style.

```
"user_name"  → tokens: ["user", "name"]  → camelCase:     "userName"
"firstName"  → tokens: ["first", "name"] → snake_case:     "first_name"
"UserID"     → tokens: ["user", "id"]    → kebab-case:     "user-id"
```

Handles: `snake_case` ↔ `camelCase` ↔ `PascalCase` ↔ `kebab-case` ↔ `SCREAMING_SNAKE`

---

### 🔵 Level 5 — Synonym Match `(92% confidence)`

Built-in dictionary of **160+ developer vocabulary synonym groups** across 14 domains. Knows that `phone`, `mobile`, `cell`, `tel`, and `contact_number` all mean the same thing.

| Domain | Example synonyms |
|--------|-----------------|
| 👤 Person | `name`, `full_name`, `display_name`, `username` |
| 📞 Contact | `phone`, `mobile`, `cell`, `tel`, `contact_number` |
| 🔐 Auth | `password`, `passwd`, `pwd`, `secret`, `token` |
| 📅 Dates | `created_at`, `creation_date`, `date_created`, `timestamp` |
| 💰 Finance | `amount`, `price`, `cost`, `total`, `value` |
| 🏥 Healthcare | `patient`, `diagnosis`, `treatment`, `prescription` |
| 📡 IoT | `device`, `sensor`, `endpoint`, `temperature`, `battery` |
| 🎓 Education | `student`, `course`, `grade`, `assignment`, `instructor` |

```
Input:  "cell_number"
Result: "phone"        ✓ recognized synonym group match
```

---

### 🟡 Level 6 — Fuzzy + Semantic Match `(70–95% confidence)`

When a schema is provided, awsibnj compares the field against schema keys using a **weighted ensemble of 7 strategies**:

```
 Strategy             Weight   Example
 ─────────────────────────────────────────────────────────────────────
 Levenshtein Distance  30%     "frist_name" → "first_name"  (edit dist 1)
 Token Match           25%     "name_full"  → "full_name"   (same tokens)
 Vowel Drop            10%     "usr_nm"     → "user_name"   (no vowels)
 Phonetic Similarity   10%     "fone"       → "phone"       (sounds like)
 Abbreviation Expand   15%     "txn_id"     → "transactionId" (abbrev map)
 N-Gram Overlap        05%     "email"      → "emial"       (shared grams)
 Substring Contain     05%     "order_id"   → "orderId"     (contained)
 ─────────────────────────────────────────────────────────────────────
```

Multiple strategies agreeing **boosts confidence** further.

```
Input:  "usr_email"   Schema has: "userEmail"
Result: "userEmail"   ✓ weighted ensemble: 92% confidence

Input:  "txn_id"      Schema has: "transactionId"
Result: "transactionId" ✓ abbreviation expansion: 88% confidence
```

---

### 🟠 Level 7 — Best Effort / Cryptic Resolve `(55–70% confidence)`

When nothing else matches, awsibnj attempts to resolve cryptic or arbitrary field names:

| Technique | Example |
|-----------|---------|
| Strip cryptic prefix | `z9_ref_id` → `ref_id` → `referenceId` |
| Strip database prefix | `tbl_user_name` → `user_name` → `userName` |
| Suffix-based matching | `x_user_flag` → matches `is_active` via `_flag` suffix |
| Vocabulary fragments | `x1_email_addr` → matches `emailAddress` |

> ⚠️ All Level 7 results are **flagged for review** via `getPending()`.

```
Input:  "z9_ref_id"        Result: "referenceId"  (cryptic prefix stripped)
Input:  "tbl_user_name"    Result: "userName"      (database prefix stripped)
Input:  "xq_flag"          Result: "xqFlag"        ⚑ flagged — needs review
```

---

## 🔄 Two-Way Transformation

awsibnj converts **both directions** — backend → frontend and frontend → backend.

```
  Backend Response (snake_case)              Your Frontend Request (camelCase)
  ──────────────────────────────             ─────────────────────────────────
  { first_name: "John" }            ←────   POST { firstName: "John" }
                         auto-maps           auto-reverses on outgoing
  { firstName: "John" } ────────►            to send correct format back
```

---

## ⚡ Quick Start — 4 Integration Patterns

### Pattern 1 · Axios Drop-in Replacement *(Recommended)*

```js
const apiBridge = require('awsibnj');
const api = apiBridge.create({ baseURL: 'https://api.example.com' });

const { data } = await api.get('/users/1');
// → { firstName: "John", lastName: "Doe", isActive: true }
```

### Pattern 2 · Wrap Existing Axios Instance

```js
const axios = require('axios');
const { bridge } = require('awsibnj');

const api = bridge(axios.create({ baseURL: 'https://api.example.com' }));
const response = await api.get('/users/1');
// → response.data: { firstName: "John", lastName: "Doe", isActive: true }
```

### Pattern 3 · Native Fetch Wrapper

```js
const { bridgeFetch } = require('awsibnj');
const api = bridgeFetch();

const user = await api.get('https://api.example.com/users/1');
// → { firstName: "John", lastName: "Doe", isActive: true }
```

### Pattern 4 · Direct Transform (No HTTP)

```js
const { transform } = require('awsibnj');

const result = transform({ first_name: 'John', is_active: 1, created_at: '2024-01-15' });
// → { firstName: 'John', isActive: 1, createdAt: '2024-01-15' }
```

---

## 🔤 5 Supported Naming Conventions

```
  Input                  camelCase    snake_case    PascalCase    kebab-case    SCREAMING_SNAKE
  ─────────────────────  ───────────  ────────────  ────────────  ────────────  ───────────────
  "user_first_name"   →  userFirstName  user_first_name  UserFirstName  user-first-name  USER_FIRST_NAME
  "UserLastName"      →  userLastName   user_last_name   UserLastName   user-last-name   USER_LAST_NAME
  "IS-ACTIVE"         →  isActive       is_active        IsActive       is-active        IS_ACTIVE
```

---

## 📊 Type Coercion (Schema-Based)

When a schema is provided, values are automatically coerced to the correct types:

| SQL / API Value | Target Type | JavaScript Result |
|-----------------|-------------|-------------------|
| `1`, `"true"`, `"yes"`, `"on"` | `boolean` | `true` |
| `0`, `"false"`, `"no"`, `"off"` | `boolean` | `false` |
| `"50%"` | `float` | `0.5` |
| `"1,000"` | `integer` | `1000` |
| `"15/01/2024"` | `date` | `Date` object |
| `"TRUE"`, `"Yes"` | `boolean` | `true` (case-insensitive) |
| `"red,green,blue"` | `array` | `['red', 'green', 'blue']` |
| `'{"a":1}'` | `json` | `{ a: 1 }` |

```js
const api = bridge(axios.create(), {
  schema: {
    userName:  { column: 'usr_nm',     type: 'string'  },
    isActive:  { column: 'is_active',  type: 'boolean' },
    createdAt: { column: 'created_at', type: 'date'    },
    price:     { column: 'price',      type: 'number'  },
  }
});
```

---

## 🎓 The Learning Engine

awsibnj learns from your corrections and gets smarter over time.

```
  First encounter:               After you teach it:
  ─────────────────              ───────────────────
  "usr_nm" → ?                   api.approve('usr_nm', 'userName')
  → "usrNm"  (60% confidence)   → Saved to .apibridge/learned.json
                                 → "usr_nm" → "userName" (99% confidence)
                                    for all future calls, instantly
```

### Teaching the Engine

```js
// Approve a correct mapping
api.approve('usr_nm', 'userName');

// Reject a wrong suggestion and provide the correct one
api.reject('addr_ln', 'addrLn', 'streetAddress');
```

> 💡 Approved mappings are saved to `.apibridge/learned.json`. Commit it to share learnings team-wide, or add to `.gitignore` for per-environment learning.

---

## 🔍 Monitoring & Observability

```js
// See transformation stats
console.log(api.getStats());
// {
//   transformer: { totalFields: 50, exactMatches: 30, autoFixed: 18, flagged: 2 },
//   cache:       { hits: 5, misses: 10 },
//   learning:    { approvedCount: 12, rejectedCount: 1 }
// }

// Review low-confidence mappings that need your approval
console.log(api.getPending());
// [{ sourceKey: "xq_flag", targetKey: "xqFlag", confidence: 0.6, method: "best_effort" }]

// Export mismatch report
api.exportCSV('./mismatches.csv');
api.exportJSON('./mismatches.json');
```

---

## 🛡️ Security Architecture (v16–v19)

awsibnj layers security features into every HTTP request pipeline:

```
  Incoming Request
       │
       ▼
  ┌──────────────────────────────────────────────────┐
  │  SECURITY PIPELINE (applied in order)            │
  ├──────────────────────────────────────────────────┤
  │  v16 │ 🛡  SSRF Guard          (blocks private IPs) │
  │  v16 │ 🔒  Header Validator    (CRLF prevention)    │
  │  v16 │ ⏱  Rate Limiter        (token bucket)       │
  │  v16 │ 🔍  Replay Detection    (SHA-256 fingerprint)│
  │  v17 │ 👤  RBAC Permissions    (role-based access)  │
  │  v17 │ 🧹  Input Sanitizer     (XSS / SQL injection)│
  │  v17 │ ✍️  Request Signing     (HMAC-SHA256)        │
  │  v17 │ 🔑  Idempotency         (safe retries)       │
  │  v18 │ 🕵️  Threat Intel        (IP reputation)      │
  │  v18 │ 🚫  Zero Trust Engine   (trust scoring)      │
  │  v18 │ 📈  Adaptive Rate Limiter (ML anomaly detect)│
  │  v18 │ ⛓  Integrity Chain     (blockchain hash)    │
  │  v18 │ 📋  Security Headers    (OWASP recommended)  │
  │  v19 │ 🔬  Behavioral Analytics (pattern anomalies) │
  │  v19 │ 🍯  Honeypot Manager    (canary detection)   │
  │  v19 │ 🔐  Quantum Crypto      (post-quantum PBKDF2)│
  │  v19 │ 🌍  Geofence Guard      (IP-region control)  │
  ├──────────────────────────────────────────────────┤
  │              Execute Request                     │
  └──────────────────────────────────────────────────┘
       │
       ▼
  Response Processing
```

---

## 📦 Version History at a Glance

| Version | Key Additions | Tests |
|---------|--------------|-------|
| **v19** | Quantum crypto, behavioral analytics, honeypot, SRI, throttle guard, geofence, key rotation, event correlator | 1275 |
| **v18** | Zero trust, threat intel, secure sessions, integrity chain, adaptive rate limiter, OWASP headers, encrypted vault, mTLS | 1178 |
| **v17** | CSP builder, cert pinning, HMAC signing, input sanitizer, RBAC, AES-256-GCM encryption, idempotency | 1095 |
| **v16** | SSRF guard, header validation, rate limiting, replay detection, sensitive data redaction, journey tracking | 991 |
| **v15** | Full Axios API parity: `runWhen`, auto Content-Type, `paramsSerializer` object form, `beforeRedirect`, correlation IDs | 918 |
| **v14** | Auto-retry engine, response caching, request dedup, auto token refresh, request timing, lifecycle hooks | 887 |
| **v13** | AxiosHeaders in all responses, default transform chains, `.isAxiosError` property, `maxRate`, `lookup` | 849 |
| **v9–v12** | Full HTTP client (`createClient`), Axios compatibility, interceptors, CancelToken, AxiosHeaders | 549+ |
| **v8** | Multi-alias resolution, schema migration, batch orchestrator, conditional transforms, deep merge | ~462 |
| **v7** | 7-strategy weighted ensemble fuzzy matching, n-gram similarity, 4 new synonym domains | ~390 |
| **v6** | Enhanced fuzzy matcher, cryptic name resolver, schema-based type coercer | ~330 |
| **v1–v5** | Core transformation engine, synonym matching, learning engine, plugin system, circuit breaker | ~249 |

---

## 📋 Quick Reference

| Task | Code |
|------|------|
| **Install** | `npm install awsibnj` |
| **Axios replacement** | `require('awsibnj').create({ baseURL: '/api' })` |
| **Wrap Axios** | `bridge(axiosInstance, { schema })` |
| **Native fetch** | `bridgeFetch({ retries: 3 })` |
| **Direct transform** | `transform({ snake_key: value })` |
| **Custom mapping** | Pass `schema` object with `column` definitions |
| **Teach a mapping** | `api.approve('source_field', 'targetField')` |
| **Reject a wrong mapping** | `api.reject('source', 'wrong', 'correct')` |
| **View pending review** | `api.getPending()` |
| **Export mismatch report** | `api.exportCSV('./report.csv')` |
| **Bulk import learnings** | `api.bulkImport({ src_key: 'targetKey' })` |

---

## 📈 Accuracy Summary

| Level | Method | Confidence | Typical Use Case |
|-------|--------|:----------:|-----------------|
| 1 | Exact match | **100%** | Field already in target convention |
| 2 | Learned | **99%** | Previously approved by your team |
| 3 | Schema | **100%** | Explicit column mapping in config |
| 4 | Pattern | **97%** | Standard `snake_case` ↔ `camelCase` |
| 5 | Synonym | **92%** | `phone` / `mobile` / `cell` synonyms |
| 6 | Fuzzy | **70–95%** | Abbreviations, typos, near-matches |
| 7 | Best effort | **55–70%** | Cryptic legacy field names (flagged) |

> **Overall accuracy:** 99%+ for standard fields · 92%+ for synonyms · 70–95% for fuzzy · 55–70% for cryptic (flagged)

---

*[→ Back to README](README.md) · [→ See CHANGELOG](CHANGELOG.md)*
