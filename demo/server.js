/**
 * APIBridge AI Demo — Express Backend (v8.0.1)
 *
 * This server uses SQLite with column names that intentionally mismatch the
 * frontend's camelCase expectations. APIBridge AI's `transform()` function
 * sits between the SQL layer and the API responses to automatically resolve
 * every mismatch.
 *
 * Mismatch categories demonstrated:
 *   1. snake_case ↔ camelCase        (first_name → firstName)
 *   2. Abbreviations                  (ph_number → phoneNumber, dt_of_birth → dateOfBirth)
 *   3. Prefix differences             (usr_id → userId, acc_balance → accountBalance)
 *   4. Synonym resolution             (email_address → email, is_active → active)
 *   5. Compound abbreviations         (profile_img_url → profileImageUrl)
 *   6. Domain-specific short forms    (annual_sal → annualSalary, dept_name → departmentName)
 *   7. Table prefix stripping         (tbl_users → users)
 *
 * v8 features demonstrated:
 *   8. Multi-alias field resolution   (FieldAliaser — map one field to many API names)
 *   9. Field analytics                (FieldStats — per-field usage tracking & accuracy)
 *  10. Multi-format output            (OutputFormatter — JSON, CSV, XML, key-value)
 *  11. Conditional transforms         (ConditionalTransform — dynamic value-based rules)
 *  12. Deep merge for updates         (DeepMerge — intelligent partial update merging)
 */

const path = require('path');
const express = require('express');
const Database = require('better-sqlite3');
const fs = require('fs');

// Import APIBridge AI from the parent package
const {
  transform,
  createTransformer,
  FieldAliaser,
  FieldStats,
  OutputFormatter,
  ConditionalTransform,
  DeepMerge,
} = require('../src/index');

const app = express();
const PORT = process.env.PORT || 3000;

// ── Database setup ───────────────────────────────────────────────────────────

const DB_PATH = path.join(__dirname, 'demo.db');
const db = new Database(DB_PATH);

// Enable WAL mode for better concurrency
db.pragma('journal_mode = WAL');

// Initialize database from schema.sql
const schemaSQL = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
db.exec(schemaSQL);

// ── APIBridge Transformer ────────────────────────────────────────────────────

// Create a reusable transformer instance with the target convention
const transformer = createTransformer({ convention: 'camelCase' });

// ── v8: Field Aliaser ────────────────────────────────────────────────────────
// Register multi-alias groups so frontend devs can use ANY of these names
// and they all resolve to the correct canonical field.

const aliaser = new FieldAliaser({ caseSensitive: false });

aliaser.register('userId', ['usr_id', 'uid', 'user_id', 'member_id']);
aliaser.register('firstName', ['first_name', 'fname', 'given_name']);
aliaser.register('lastName', ['last_name', 'lname', 'surname', 'family_name']);
aliaser.register('email', ['email_address', 'e_mail', 'mail', 'contact_email']);
aliaser.register('phoneNumber', ['ph_number', 'phone', 'tel', 'contact_phone']);
aliaser.register('dateOfBirth', ['dt_of_birth', 'dob', 'birth_date', 'birthday']);
aliaser.register('isActive', ['is_active', 'active', 'status', 'enabled']);
aliaser.register('accountBalance', ['acc_balance', 'balance', 'account_bal']);
aliaser.register('addressLine1', ['addr_line1', 'address', 'street_address']);
aliaser.register('city', ['addr_city', 'address_city', 'town']);
aliaser.register('state', ['addr_state', 'address_state', 'province', 'region']);
aliaser.register('zipCode', ['zip_code', 'postal_code', 'postcode', 'zip']);
aliaser.register('role', ['usr_role', 'user_role', 'access_level']);
aliaser.register('profileImageUrl', ['profile_img_url', 'avatar', 'photo_url', 'profile_pic']);
aliaser.register('employeeId', ['emp_id', 'employee_number', 'staff_id']);
aliaser.register('departmentName', ['dept_name', 'department', 'division']);
aliaser.register('managerId', ['mgr_id', 'manager', 'supervisor_id']);
aliaser.register('annualSalary', ['annual_sal', 'salary', 'yearly_pay', 'compensation']);

// ── v8: Field Stats ──────────────────────────────────────────────────────────
// Track per-field transformation analytics

const fieldStats = new FieldStats({ trackTiming: true });

// ── v8: Output Formatter ─────────────────────────────────────────────────────
// Format API responses in multiple output formats

const formatter = new OutputFormatter({
  xmlRoot: 'users',
  xmlItem: 'user',
  csvDelimiter: ',',
});

// ── v8: Conditional Transform ────────────────────────────────────────────────
// Dynamic value-based transformation rules

const conditionalTransform = new ConditionalTransform({ trackStats: true });

// Convert 0/1 integers to proper booleans
conditionalTransform.when(
  'intToBoolean',
  (value) => (value === 0 || value === 1) && typeof value === 'number',
  (value) => value === 1,
  { fields: ['isActive', 'is_active'] }
);

// Convert null values to display-friendly defaults
conditionalTransform.when(
  'nullToNA',
  (value) => value === null || value === undefined,
  () => 'N/A',
  { priority: -1 }
);

// Format currency values
conditionalTransform.when(
  'formatCurrency',
  (value) => typeof value === 'number' && value > 100,
  (value) => Math.round(value * 100) / 100,
  { fields: ['accBalance', 'acc_balance', 'annualSal', 'annual_sal', 'accountBalance', 'annualSalary'] }
);

// ── v8: Deep Merge ───────────────────────────────────────────────────────────
// For intelligent partial update merging

const merger = new DeepMerge({
  arrayStrategy: 'replace',
  conflictStrategy: 'latest',
  skipNull: false,
  skipUndefined: true,
});

/**
 * Build a bidirectional mapping by transforming a sample row.
 * This lets us accurately reverse-map frontend field names → SQL column names.
 */
function buildFieldMap() {
  const sampleRow = db.prepare('SELECT * FROM tbl_users LIMIT 1').get();
  if (!sampleRow) return { forward: {}, reverse: {} };

  const sqlKeys = Object.keys(sampleRow);
  const transformed = transform(sampleRow, { convention: 'camelCase', direction: 'toFrontend' });
  const feKeys = Object.keys(transformed);

  const forward = {};  // sqlCol → feField
  const reverse = {};  // feField → sqlCol
  sqlKeys.forEach((sqlKey, i) => {
    forward[sqlKey] = feKeys[i];
    reverse[feKeys[i]] = sqlKey;

    // Record each field transformation in FieldStats
    fieldStats.record(sqlKey, {
      targetKey: feKeys[i],
      confidence: sqlKey !== feKeys[i] ? 0.95 : 1.0,
      method: sqlKey !== feKeys[i] ? 'transform' : 'exact',
    });
  });
  return { forward, reverse };
}

let fieldMap = buildFieldMap();

/**
 * Transform a row (or array of rows) from SQL column names to frontend
 * camelCase using APIBridge AI.
 */
function transformRow(row) {
  if (!row) return null;
  return transform(row, { convention: 'camelCase', direction: 'toFrontend' });
}

function transformRows(rows) {
  return rows.map(transformRow);
}

/**
 * Reverse-map incoming frontend data (camelCase) back to exact SQL column names.
 * Enhanced with v8 FieldAliaser — resolves ANY known alias to the canonical name,
 * then maps that canonical name to the SQL column using the bidirectional field map.
 */
function reverseTransform(data) {
  if (!data || typeof data !== 'object') return data;
  const result = {};
  for (const [feKey, value] of Object.entries(data)) {
    // First try FieldAliaser resolution
    const aliasResult = aliaser.resolve(feKey);
    const resolvedKey = aliasResult.matched ? aliasResult.canonical : feKey;

    // Then map to SQL column name
    const sqlKey = fieldMap.reverse[resolvedKey] || fieldMap.reverse[feKey] || feKey;
    result[sqlKey] = value;
  }
  return result;
}

// ── Middleware ────────────────────────────────────────────────────────────────

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// CORS headers for local development
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  next();
});

// ── API Routes ───────────────────────────────────────────────────────────────

/**
 * GET /api/users — List all users
 * Raw SQL returns snake_case/abbreviated columns.
 * APIBridge transforms them to camelCase for the frontend.
 */
app.get('/api/users', (req, res) => {
  const rows = db.prepare('SELECT * FROM tbl_users').all();
  const transformed = transformRows(rows);

  res.json({
    success: true,
    count: transformed.length,
    data: transformed,
    _bridge: {
      note: 'Fields were auto-transformed from SQL snake_case to frontend camelCase by APIBridge AI',
      stats: transformer.getStats(),
    },
  });
});

/**
 * GET /api/users/:id — Get single user
 */
app.get('/api/users/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM tbl_users WHERE usr_id = ?').get(req.params.id);
  if (!row) {
    return res.status(404).json({ success: false, error: 'User not found' });
  }

  const transformed = transformRow(row);
  res.json({
    success: true,
    data: transformed,
    _bridge: {
      note: 'Fields were auto-transformed by APIBridge AI',
      stats: transformer.getStats(),
    },
  });
});

/**
 * POST /api/users — Create a new user
 * Frontend sends camelCase. We reverse-transform to SQL column names using
 * the bidirectional field map built from APIBridge AI's forward transform.
 * Enhanced with v8 FieldAliaser for multi-alias resolution.
 *
 * This demonstrates the full round-trip: camelCase → SQL column names → INSERT.
 */
app.post('/api/users', (req, res) => {
  const backendData = reverseTransform(req.body);

  // Ensure all required columns have at least null
  const SQL_COLUMNS = [
    'first_name', 'last_name', 'email_address', 'ph_number', 'dt_of_birth',
    'is_active', 'acc_balance', 'addr_line1', 'addr_city', 'addr_state',
    'zip_code', 'usr_role', 'profile_img_url', 'emp_id', 'dept_name', 'mgr_id', 'annual_sal',
  ];
  const params = {};
  for (const col of SQL_COLUMNS) {
    params[col] = backendData[col] !== undefined ? backendData[col] : null;
  }

  const stmt = db.prepare(`
    INSERT INTO tbl_users (
      first_name, last_name, email_address, ph_number, dt_of_birth,
      is_active, acc_balance, addr_line1, addr_city, addr_state,
      zip_code, usr_role, profile_img_url, emp_id, dept_name, mgr_id, annual_sal
    ) VALUES (
      @first_name, @last_name, @email_address, @ph_number, @dt_of_birth,
      @is_active, @acc_balance, @addr_line1, @addr_city, @addr_state,
      @zip_code, @usr_role, @profile_img_url, @emp_id, @dept_name, @mgr_id, @annual_sal
    )
  `);

  try {
    const result = stmt.run(params);
    // Rebuild field map if this is the first row
    if (!fieldMap.forward || Object.keys(fieldMap.forward).length === 0) {
      fieldMap = buildFieldMap();
    }
    const newRow = db.prepare('SELECT * FROM tbl_users WHERE usr_id = ?').get(result.lastInsertRowid);
    res.status(201).json({
      success: true,
      data: transformRow(newRow),
      _bridge: {
        note: 'Frontend camelCase was reverse-mapped to SQL column names using APIBridge AI field map + v8 FieldAliaser',
        received: req.body,
        reversed: backendData,
        aliasStats: aliaser.getStats(),
      },
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/users/batch — Batch create multiple users (v8 feature)
 * Accepts an array of user objects and inserts them all.
 * Demonstrates v8 batch processing capabilities.
 */
app.post('/api/users/batch', (req, res) => {
  const users = req.body.users || req.body;
  if (!Array.isArray(users) || users.length === 0) {
    return res.status(400).json({ success: false, error: 'Provide an array of users' });
  }

  const SQL_COLUMNS = [
    'first_name', 'last_name', 'email_address', 'ph_number', 'dt_of_birth',
    'is_active', 'acc_balance', 'addr_line1', 'addr_city', 'addr_state',
    'zip_code', 'usr_role', 'profile_img_url', 'emp_id', 'dept_name', 'mgr_id', 'annual_sal',
  ];

  const stmt = db.prepare(`
    INSERT INTO tbl_users (
      first_name, last_name, email_address, ph_number, dt_of_birth,
      is_active, acc_balance, addr_line1, addr_city, addr_state,
      zip_code, usr_role, profile_img_url, emp_id, dept_name, mgr_id, annual_sal
    ) VALUES (
      @first_name, @last_name, @email_address, @ph_number, @dt_of_birth,
      @is_active, @acc_balance, @addr_line1, @addr_city, @addr_state,
      @zip_code, @usr_role, @profile_img_url, @emp_id, @dept_name, @mgr_id, @annual_sal
    )
  `);

  const results = { created: [], errors: [] };

  const insertMany = db.transaction((items) => {
    for (const userData of items) {
      const backendData = reverseTransform(userData);
      const params = {};
      for (const col of SQL_COLUMNS) {
        params[col] = backendData[col] !== undefined ? backendData[col] : null;
      }
      try {
        const result = stmt.run(params);
        const newRow = db.prepare('SELECT * FROM tbl_users WHERE usr_id = ?').get(result.lastInsertRowid);
        results.created.push(transformRow(newRow));
      } catch (err) {
        results.errors.push({ input: userData, error: err.message });
      }
    }
  });

  try {
    insertMany(users);
    // Rebuild field map after batch insert
    fieldMap = buildFieldMap();
    res.status(201).json({
      success: true,
      count: results.created.length,
      data: results.created,
      errors: results.errors,
      _bridge: {
        note: 'Batch insert with v8 FieldAliaser reverse-mapping',
      },
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

/**
 * PUT /api/users/:id — Update a user
 * Frontend sends camelCase fields. Reverse-mapped to SQL column names.
 * Enhanced with v8 DeepMerge for intelligent partial update merging.
 */
app.put('/api/users/:id', (req, res) => {
  const existing = db.prepare('SELECT * FROM tbl_users WHERE usr_id = ?').get(req.params.id);
  if (!existing) {
    return res.status(404).json({ success: false, error: 'User not found' });
  }

  const backendData = reverseTransform(req.body);

  // v8: Use DeepMerge to intelligently merge partial updates with existing data
  const merged = merger.merge(existing, backendData);

  const SQL_COLUMNS = [
    'first_name', 'last_name', 'email_address', 'ph_number', 'dt_of_birth',
    'is_active', 'acc_balance', 'addr_line1', 'addr_city', 'addr_state',
    'zip_code', 'usr_role', 'profile_img_url', 'emp_id', 'dept_name', 'mgr_id', 'annual_sal',
  ];
  const params = {};
  for (const col of SQL_COLUMNS) {
    params[col] = merged[col] !== undefined ? merged[col] : null;
  }
  params.usr_id = parseInt(req.params.id, 10);

  const stmt = db.prepare(`
    UPDATE tbl_users SET
      first_name = COALESCE(@first_name, first_name),
      last_name = COALESCE(@last_name, last_name),
      email_address = COALESCE(@email_address, email_address),
      ph_number = COALESCE(@ph_number, ph_number),
      dt_of_birth = COALESCE(@dt_of_birth, dt_of_birth),
      is_active = COALESCE(@is_active, is_active),
      acc_balance = COALESCE(@acc_balance, acc_balance),
      addr_line1 = COALESCE(@addr_line1, addr_line1),
      addr_city = COALESCE(@addr_city, addr_city),
      addr_state = COALESCE(@addr_state, addr_state),
      zip_code = COALESCE(@zip_code, zip_code),
      usr_role = COALESCE(@usr_role, usr_role),
      profile_img_url = COALESCE(@profile_img_url, profile_img_url),
      emp_id = COALESCE(@emp_id, emp_id),
      dept_name = COALESCE(@dept_name, dept_name),
      mgr_id = COALESCE(@mgr_id, mgr_id),
      annual_sal = COALESCE(@annual_sal, annual_sal),
      updated_at = datetime('now')
    WHERE usr_id = @usr_id
  `);

  try {
    stmt.run(params);
    const updatedRow = db.prepare('SELECT * FROM tbl_users WHERE usr_id = ?').get(req.params.id);
    res.json({
      success: true,
      data: transformRow(updatedRow),
      _bridge: {
        note: 'v8 DeepMerge used for intelligent partial update merging',
        mergeStats: merger.getStats(),
      },
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

/**
 * DELETE /api/users/:id — Delete a user
 */
app.delete('/api/users/:id', (req, res) => {
  const existing = db.prepare('SELECT * FROM tbl_users WHERE usr_id = ?').get(req.params.id);
  if (!existing) {
    return res.status(404).json({ success: false, error: 'User not found' });
  }

  db.prepare('DELETE FROM tbl_users WHERE usr_id = ?').run(req.params.id);
  res.json({ success: true, message: 'User deleted' });
});

/**
 * GET /api/debug/raw — Return raw SQL data WITHOUT transformation
 * This endpoint lets the frontend show the "before" vs "after" comparison.
 */
app.get('/api/debug/raw', (req, res) => {
  const rows = db.prepare('SELECT * FROM tbl_users').all();
  res.json({
    success: true,
    note: 'Raw SQL column names — NO transformation applied',
    data: rows,
  });
});

/**
 * GET /api/debug/mismatch-map — Show what APIBridge resolved
 */
app.get('/api/debug/mismatch-map', (req, res) => {
  // Get one raw row to show the mapping
  const raw = db.prepare('SELECT * FROM tbl_users LIMIT 1').get();
  if (!raw) {
    return res.json({ success: true, mappings: [] });
  }

  const rawKeys = Object.keys(raw);
  const transformed = transformRow(raw);
  const transformedKeys = Object.keys(transformed);

  const mappings = rawKeys.map((sqlKey, i) => ({
    sqlColumn: sqlKey,
    frontendField: transformedKeys[i] || '(unmapped)',
    matched: sqlKey !== transformedKeys[i],
    value: raw[sqlKey],
  }));

  res.json({
    success: true,
    totalFields: rawKeys.length,
    mismatches: mappings.filter(m => m.matched).length,
    mappings,
  });
});

/**
 * GET /api/debug/field-stats — v8 Field analytics
 * Returns per-field transformation statistics collected by FieldStats.
 */
app.get('/api/debug/field-stats', (req, res) => {
  // Record current state by running a fresh transform
  const rows = db.prepare('SELECT * FROM tbl_users').all();
  if (rows.length > 0) {
    const sqlKeys = Object.keys(rows[0]);
    const transformed = transformRow(rows[0]);
    const feKeys = Object.keys(transformed);
    sqlKeys.forEach((sqlKey, i) => {
      fieldStats.record(sqlKey, {
        targetKey: feKeys[i],
        confidence: sqlKey !== feKeys[i] ? 0.95 : 1.0,
        method: sqlKey !== feKeys[i] ? 'transform' : 'exact',
      });
    });
  }

  res.json({
    success: true,
    note: 'v8 FieldStats — per-field transformation analytics',
    stats: fieldStats.export(),
  });
});

/**
 * GET /api/debug/aliases — v8 FieldAliaser info
 * Shows registered alias groups and resolution stats.
 */
app.get('/api/debug/aliases', (req, res) => {
  const aliasGroups = aliaser.bulkExport();
  res.json({
    success: true,
    note: 'v8 FieldAliaser — multi-alias field resolution groups',
    stats: aliaser.getStats(),
    groups: aliasGroups,
  });
});

/**
 * POST /api/debug/resolve-alias — v8 FieldAliaser resolution test
 * Send { "field": "uid" } and see what canonical name it resolves to.
 */
app.post('/api/debug/resolve-alias', (req, res) => {
  const fieldName = req.body.field;
  if (!fieldName) {
    return res.status(400).json({ success: false, error: 'Provide a "field" name to resolve' });
  }

  const result = aliaser.resolve(fieldName);
  res.json({
    success: true,
    input: fieldName,
    resolved: result,
    note: result.matched
      ? `"${fieldName}" resolved to canonical name "${result.canonical}"`
      : `"${fieldName}" did not match any registered alias`,
  });
});

/**
 * GET /api/debug/output/:format — v8 OutputFormatter
 * Returns user data formatted as: json, csv, xml, or keyvalue.
 */
app.get('/api/debug/output/:format', (req, res) => {
  const rows = db.prepare('SELECT * FROM tbl_users').all();
  const transformed = transformRows(rows);
  const format = req.params.format.toLowerCase();

  try {
    switch (format) {
      case 'json':
        res.type('application/json').send(formatter.toJSON(transformed));
        break;
      case 'csv':
        res.type('text/csv').send(formatter.toCSV(transformed));
        break;
      case 'xml':
        res.type('application/xml').send(formatter.toXML(transformed));
        break;
      case 'keyvalue':
        res.type('text/plain').send(formatter.toKeyValue(transformed[0] || {}));
        break;
      default:
        res.status(400).json({
          success: false,
          error: `Unknown format "${format}". Use: json, csv, xml, keyvalue`,
        });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/debug/conditional — v8 ConditionalTransform demo
 * Applies conditional transformation rules to a sample row.
 */
app.get('/api/debug/conditional', (req, res) => {
  const raw = db.prepare('SELECT * FROM tbl_users LIMIT 1').get();
  if (!raw) {
    return res.json({ success: true, data: null });
  }

  // Apply conditional transforms to each field
  const transformed = {};
  for (const [key, value] of Object.entries(raw)) {
    const result = conditionalTransform.apply(value, key, raw);
    transformed[key] = result.applied ? result.value : value;
  }

  res.json({
    success: true,
    note: 'v8 ConditionalTransform — dynamic value-based transformation rules',
    original: raw,
    conditionallyTransformed: transformed,
    ruleStats: conditionalTransform.getStats(),
  });
});

/**
 * GET /api/debug/v8-summary — Summary of all v8 features in use
 */
app.get('/api/debug/v8-summary', (req, res) => {
  res.json({
    success: true,
    version: '8.0.1',
    v8Features: {
      fieldAliaser: {
        description: 'Multi-alias field resolution — map one canonical field to many API names',
        stats: aliaser.getStats(),
      },
      fieldStats: {
        description: 'Per-field transformation analytics and accuracy tracking',
        coverage: fieldStats.getCoverageReport(),
      },
      outputFormatter: {
        description: 'Multi-format output — JSON, CSV, XML, key-value',
        stats: formatter.getStats(),
        availableFormats: ['json', 'csv', 'xml', 'keyvalue'],
      },
      conditionalTransform: {
        description: 'Dynamic value-based transformation rules',
        stats: conditionalTransform.getStats(),
      },
      deepMerge: {
        description: 'Intelligent object merging with conflict resolution',
        stats: merger.getStats(),
      },
    },
  });
});

// ── Start server ─────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`\n🌉 APIBridge AI v8.0.1 Demo Server running at http://localhost:${PORT}`);
  console.log(`   ├── Frontend:         http://localhost:${PORT}`);
  console.log(`   ├── API (users):      http://localhost:${PORT}/api/users`);
  console.log(`   ├── Raw SQL data:     http://localhost:${PORT}/api/debug/raw`);
  console.log(`   ├── Mismatch map:     http://localhost:${PORT}/api/debug/mismatch-map`);
  console.log(`   ├── Field stats (v8): http://localhost:${PORT}/api/debug/field-stats`);
  console.log(`   ├── Aliases (v8):     http://localhost:${PORT}/api/debug/aliases`);
  console.log(`   ├── Output CSV (v8):  http://localhost:${PORT}/api/debug/output/csv`);
  console.log(`   ├── Output XML (v8):  http://localhost:${PORT}/api/debug/output/xml`);
  console.log(`   ├── Conditional (v8): http://localhost:${PORT}/api/debug/conditional`);
  console.log(`   └── v8 Summary:       http://localhost:${PORT}/api/debug/v8-summary\n`);
});
