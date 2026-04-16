/**
 * APIBridge AI Demo — Express Backend
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
 */

const path = require('path');
const express = require('express');
const Database = require('better-sqlite3');
const fs = require('fs');

// Import APIBridge AI from the parent package
const { transform, createTransformer } = require('../src/index');

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
 * Uses the bidirectional field map built from a sample forward transform,
 * ensuring every field is mapped to the correct SQL column.
 */
function reverseTransform(data) {
  if (!data || typeof data !== 'object') return data;
  const result = {};
  for (const [feKey, value] of Object.entries(data)) {
    const sqlKey = fieldMap.reverse[feKey] || feKey;
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
        note: 'Frontend camelCase was reverse-mapped to SQL column names using APIBridge AI field map',
        received: req.body,
        reversed: backendData,
      },
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

/**
 * PUT /api/users/:id — Update a user
 * Frontend sends camelCase fields. Reverse-mapped to SQL column names.
 */
app.put('/api/users/:id', (req, res) => {
  const existing = db.prepare('SELECT * FROM tbl_users WHERE usr_id = ?').get(req.params.id);
  if (!existing) {
    return res.status(404).json({ success: false, error: 'User not found' });
  }

  const backendData = reverseTransform(req.body);

  const SQL_COLUMNS = [
    'first_name', 'last_name', 'email_address', 'ph_number', 'dt_of_birth',
    'is_active', 'acc_balance', 'addr_line1', 'addr_city', 'addr_state',
    'zip_code', 'usr_role', 'profile_img_url', 'emp_id', 'dept_name', 'mgr_id', 'annual_sal',
  ];
  const params = {};
  for (const col of SQL_COLUMNS) {
    params[col] = backendData[col] !== undefined ? backendData[col] : null;
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

// ── Start server ─────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`\n🌉 APIBridge AI Demo Server running at http://localhost:${PORT}`);
  console.log(`   ├── Frontend:      http://localhost:${PORT}`);
  console.log(`   ├── API (users):   http://localhost:${PORT}/api/users`);
  console.log(`   ├── Raw SQL data:  http://localhost:${PORT}/api/debug/raw`);
  console.log(`   └── Mismatch map:  http://localhost:${PORT}/api/debug/mismatch-map\n`);
});
