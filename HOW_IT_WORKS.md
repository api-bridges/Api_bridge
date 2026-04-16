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

APIBridge has a built-in dictionary of developer vocabulary. It knows that `phone`, `mobile`, `cell`, `tel`, and `contact_number` all mean the same thing.

```
Input:  "cell_number"
Result: "phone"        → recognized as synonym for "phone"
```

### Level 6 — Fuzzy + Semantic Match (70–90% confidence)

When a schema is provided, APIBridge compares the field against schema keys using character similarity (Levenshtein distance) and synonym proximity.

```
Input:  "usr_email"   Schema has: "userEmail"
Result: "userEmail"   → fuzzy match with 85% confidence
```

### Level 7 — Best Effort (60% confidence)

When nothing else matches, it does a basic convention conversion and flags the field for your review.

```
Input:  "xq_flag"
Result: "xqFlag"      → converted but flagged for review
```

---

## Using APIBridge in Your Project

### Install

```bash
npm install api-bridge-ai
```

### Option 1: With Axios

```js
const axios = require('axios');
const { bridge } = require('api-bridge-ai');

const api = bridge(axios.create({ baseURL: 'https://api.example.com' }));

// Response fields are auto-converted to camelCase
const response = await api.get('/users/1');
console.log(response.data);
// { firstName: "John", lastName: "Doe", isActive: true }
```

### Option 2: With Fetch

```js
const { bridgeFetch } = require('api-bridge-ai');

const api = bridgeFetch();

const user = await api.get('https://api.example.com/users/1');
console.log(user);
// { firstName: "John", lastName: "Doe", isActive: true }
```

### Option 3: Direct Transform (No HTTP)

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

Approved mappings are saved to `.apibridge/learned.json` in your project root. This file is auto-created and can be committed to your repo so the whole team shares the same learnings.

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
| Basic use | `transform({ snake_case: value })` → `{ camelCase: value }` |
| With Axios | `bridge(axiosInstance)` — auto-transforms all requests & responses |
| With Fetch | `bridgeFetch()` — same as above but with native fetch |
| Custom mapping | Pass a `schema` object to define exact field mappings |
| Teach it | `approve(source, target)` or `reject(source, wrong, correct)` |
| It remembers | Learnings saved to `.apibridge/learned.json` |
| Review flags | `getPending()` shows low-confidence mappings that need your approval |
