# APIBridge AI Demo — Full-Stack Mismatch Resolution

A complete single-page application demonstrating how **APIBridge AI** automatically resolves field name mismatches between a **SQL database**, a **Node.js backend**, and a **browser frontend**.

## Architecture

```
┌───────────────────┐         ┌───────────────────┐         ┌───────────────────┐
│   SQLite (SQL)    │         │  Express Backend   │         │  Browser Frontend │
│                   │         │                    │         │                   │
│  usr_id           │───────▶ │  APIBridge AI      │───────▶ │  userId           │
│  first_name       │  raw    │  transform()       │ camel   │  firstName        │
│  email_address    │  SQL    │  auto-resolves     │  Case   │  email            │
│  ph_number        │  names  │  every mismatch    │  JSON   │  phoneNumber      │
│  dt_of_birth      │         │                    │         │  dateOfBirth      │
│  acc_balance      │         │                    │         │  accountBalance   │
│  ...              │         │                    │         │  ...              │
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

## API Endpoints

| Method | Endpoint                  | Description                              |
|--------|---------------------------|------------------------------------------|
| GET    | `/api/users`              | List all users (transformed)             |
| GET    | `/api/users/:id`          | Get single user (transformed)            |
| POST   | `/api/users`              | Create user (reverse-transforms input)   |
| PUT    | `/api/users/:id`          | Update user (reverse-transforms input)   |
| DELETE | `/api/users/:id`          | Delete user                              |
| GET    | `/api/debug/raw`          | Raw SQL data (no transformation)         |
| GET    | `/api/debug/mismatch-map` | Field-by-field mismatch resolution map   |

## How APIBridge Resolves Each Mismatch

The demo uses multiple levels of APIBridge AI's resolution engine:

- **Level 4 — Pattern Conversion**: `first_name` → `firstName` (snake_case to camelCase)
- **Level 5 — Synonym Groups**: `email_address` maps to the `email` synonym group
- **Level 6 — Fuzzy Matching**: `ph_number` resolves via Levenshtein + phonetic similarity
- **Level 7 — Cryptic Resolution**: `dt_of_birth` uses abbreviation expansion + prefix stripping
