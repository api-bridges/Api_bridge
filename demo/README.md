# APIBridge AI v8.0.1 Demo — Full-Stack Mismatch Resolution

A complete single-page application demonstrating how **APIBridge AI v8** automatically resolves field name mismatches between a **SQL database**, a **Node.js backend**, and a **browser frontend** — now showcasing all v8 features.

## Architecture

```
┌───────────────────┐         ┌───────────────────┐         ┌───────────────────┐
│   SQLite (SQL)    │         │  Express Backend   │         │  Browser Frontend │
│                   │         │                    │         │                   │
│  usr_id           │───────▶ │  APIBridge AI v8   │───────▶ │  userId           │
│  first_name       │  raw    │  transform()       │ camel   │  firstName        │
│  email_address    │  SQL    │  + FieldAliaser    │  Case   │  email            │
│  ph_number        │  names  │  + FieldStats      │  JSON   │  phoneNumber      │
│  dt_of_birth      │         │  + OutputFormatter │         │  dateOfBirth      │
│  acc_balance      │         │  + DeepMerge       │         │  accountBalance   │
│  ...              │         │  + ConditionalTx   │         │  ...              │
└───────────────────┘         └───────────────────┘         └───────────────────┘
```

## Mismatches Demonstrated

The table below shows the SQL column names and what APIBridge AI's `transform()` function resolves them to (camelCase conversion):

| # | Mismatch Type               | SQL Column         | APIBridge Output    |
|---|-----------------------------|--------------------|---------------------|
| 1 | Prefix + abbreviation       | `usr_id`           | `usrId`             |
| 2 | snake_case → camelCase      | `first_name`       | `firstName`         |
| 3 | snake_case → camelCase      | `last_name`        | `lastName`          |
| 4 | snake_case → camelCase      | `email_address`    | `emailAddress`      |
| 5 | Abbreviation                | `ph_number`        | `phNumber`          |
| 6 | Abbreviation                | `dt_of_birth`      | `dtOfBirth`         |
| 7 | Boolean naming              | `is_active`        | `isActive`          |
| 8 | Abbreviation + prefix       | `acc_balance`      | `accBalance`        |
| 9 | snake_case → camelCase      | `created_at`       | `createdAt`         |
| 10| snake_case → camelCase      | `updated_at`       | `updatedAt`         |
| 11| Abbreviation                | `addr_line1`       | `addrLine1`         |
| 12| Abbreviation                | `addr_city`        | `addrCity`          |
| 13| Abbreviation                | `addr_state`       | `addrState`         |
| 14| snake_case → camelCase      | `zip_code`         | `zipCode`           |
| 15| Prefix + abbreviation       | `usr_role`         | `usrRole`           |
| 16| Compound abbreviation       | `profile_img_url`  | `profileImgUrl`     |
| 17| Abbreviation                | `emp_id`           | `empId`             |
| 18| Abbreviation                | `dept_name`        | `deptName`          |
| 19| Abbreviation                | `mgr_id`           | `mgrId`             |
| 20| Abbreviation                | `annual_sal`       | `annualSal`         |

The frontend Create User form demonstrates **reverse mapping**: the developer writes user-friendly names like `firstName`, `email`, `phoneNumber`, `departmentName`, etc. and the server uses APIBridge's bidirectional field map to convert them back to the exact SQL column names.

## v8 Features Demonstrated

### 🔗 Field Aliaser (Multi-Alias Resolution)
Register multiple aliases for each canonical field name. For example, `userId` can be resolved from `usr_id`, `uid`, `user_id`, or `member_id`. The demo registers 18 alias groups with 70+ aliases covering all SQL columns.

### 📊 Field Stats (Transformation Analytics)
Track per-field transformation statistics including usage frequency, resolution methods, and confidence scores. Accessible via the `/api/debug/field-stats` endpoint and the v8 Features tab.

### 📄 Output Formatter (Multi-Format Export)
Export transformed user data in JSON, CSV, XML, or key-value format. The demo provides interactive buttons to switch between formats.

### 🔀 Conditional Transform (Dynamic Rules)
Apply value-based transformation rules dynamically:
- Convert `0`/`1` integers to proper booleans
- Replace `null` values with `"N/A"` display defaults
- Round currency values to 2 decimal places

### 🔄 Deep Merge (Intelligent Update Merging)
The PUT `/api/users/:id` endpoint uses DeepMerge to intelligently merge partial updates with existing data, with conflict resolution strategies.

### 📦 Batch Operations
The POST `/api/users/batch` endpoint accepts an array of user objects for bulk creation, with per-item error tracking.

## Quick Start

```bash
# From the repository root:
cd demo
npm install
npm start
```

Then open **http://localhost:3000** in your browser.

## What You'll See

1. **Field Mappings** — Visual display of every SQL → Frontend field resolution
2. **Before / After** — Side-by-side JSON comparison of raw SQL vs transformed data
3. **User Data** — Interactive table with all users (fully transformed)
4. **Create User** — Form that sends camelCase data, reverse-transformed by APIBridge
5. **v8 Features** — Interactive showcase of FieldAliaser, FieldStats, OutputFormatter, and ConditionalTransform

## API Endpoints

| Method | Endpoint                      | Description                                    |
|--------|-------------------------------|------------------------------------------------|
| GET    | `/api/users`                  | List all users (transformed)                   |
| GET    | `/api/users/:id`              | Get single user (transformed)                  |
| POST   | `/api/users`                  | Create user (reverse-transforms input)         |
| POST   | `/api/users/batch`            | Batch create users (v8)                        |
| PUT    | `/api/users/:id`              | Update user (v8 DeepMerge)                     |
| DELETE | `/api/users/:id`              | Delete user                                    |
| GET    | `/api/debug/raw`              | Raw SQL data (no transformation)               |
| GET    | `/api/debug/mismatch-map`     | Field-by-field mismatch resolution map         |
| GET    | `/api/debug/field-stats`      | v8 Field analytics                             |
| GET    | `/api/debug/aliases`          | v8 FieldAliaser groups and stats               |
| POST   | `/api/debug/resolve-alias`    | v8 Resolve a field alias to canonical name     |
| GET    | `/api/debug/output/:format`   | v8 OutputFormatter (json, csv, xml, keyvalue)  |
| GET    | `/api/debug/conditional`      | v8 ConditionalTransform demo                   |
| GET    | `/api/debug/v8-summary`       | v8 Feature summary with all module stats       |

## How APIBridge Resolves Each Mismatch

The demo uses multiple levels of APIBridge AI's resolution engine:

- **Level 4 — Pattern Conversion**: `first_name` → `firstName` (snake_case to camelCase)
- **Level 5 — Synonym Groups**: `email_address` maps to the `email` synonym group
- **Level 6 — Fuzzy Matching**: `ph_number` resolves via Levenshtein + phonetic similarity
- **Level 7 — Cryptic Resolution**: `dt_of_birth` uses abbreviation expansion + prefix stripping
- **Level 8 — Multi-Alias Resolution** (v8): `uid`, `user_id`, `member_id` all resolve to `userId`
