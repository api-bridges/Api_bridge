-- ============================================================================
-- APIBridge AI Demo — SQL Schema
-- 
-- This schema deliberately uses naming conventions that DIFFER from the
-- frontend's camelCase expectations, to showcase APIBridge AI's mismatch
-- resolution capabilities.
--
-- Mismatches demonstrated:
--   SQL Column Name          →  Frontend Expects
--   ─────────────────────────   ──────────────────
--   usr_id                   →  userId
--   first_name               →  firstName
--   last_name                →  lastName
--   email_address            →  email
--   ph_number                →  phoneNumber
--   dt_of_birth              →  dateOfBirth
--   is_active                →  active
--   acc_balance              →  accountBalance
--   created_at               →  createdAt
--   updated_at               →  updatedAt
--   addr_line1               →  addressLine1
--   addr_city                →  city
--   addr_state               →  state
--   zip_code                 →  zipCode
--   usr_role                 →  role
--   profile_img_url          →  profileImageUrl
--   emp_id                   →  employeeId
--   dept_name                →  departmentName
--   mgr_id                   →  managerId
--   annual_sal               →  annualSalary
-- ============================================================================

CREATE TABLE IF NOT EXISTS tbl_users (
    usr_id          INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name      TEXT        NOT NULL,
    last_name       TEXT        NOT NULL,
    email_address   TEXT        NOT NULL UNIQUE,
    ph_number       TEXT,
    dt_of_birth     TEXT,
    is_active       INTEGER     DEFAULT 1,      -- 0 or 1 (boolean stored as int)
    acc_balance     REAL        DEFAULT 0.0,
    created_at      TEXT        DEFAULT (datetime('now')),
    updated_at      TEXT        DEFAULT (datetime('now')),
    addr_line1      TEXT,
    addr_city       TEXT,
    addr_state      TEXT,
    zip_code        TEXT,
    usr_role        TEXT        DEFAULT 'member',
    profile_img_url TEXT,
    emp_id          TEXT,
    dept_name       TEXT,
    mgr_id          INTEGER,
    annual_sal      REAL
);

-- ── Seed data ────────────────────────────────────────────────────────────────

INSERT OR IGNORE INTO tbl_users (
    first_name, last_name, email_address, ph_number, dt_of_birth,
    is_active, acc_balance, addr_line1, addr_city, addr_state,
    zip_code, usr_role, profile_img_url, emp_id, dept_name, mgr_id, annual_sal
) VALUES
(   'Alice',   'Johnson',  'alice@example.com',   '555-0101', '1990-03-15',
    1, 52400.50, '123 Oak Street',   'Portland',   'OR',
    '97201', 'admin',  'https://i.pravatar.cc/150?u=alice', 'EMP-001', 'Engineering', NULL, 125000.00),
(   'Bob',     'Smith',    'bob@example.com',     '555-0202', '1985-07-22',
    1, 18200.75, '456 Maple Avenue', 'Seattle',    'WA',
    '98101', 'member', 'https://i.pravatar.cc/150?u=bob',   'EMP-002', 'Marketing',   1,   95000.00),
(   'Charlie', 'Brown',    'charlie@example.com', '555-0303', '1992-11-08',
    0, 3100.00,  '789 Pine Road',    'San Francisco', 'CA',
    '94102', 'member', 'https://i.pravatar.cc/150?u=charlie','EMP-003', 'Engineering', 1,   110000.00),
(   'Diana',   'Lee',      'diana@example.com',   '555-0404', '1988-01-30',
    1, 67890.25, '321 Elm Drive',    'Austin',     'TX',
    '73301', 'admin',  'https://i.pravatar.cc/150?u=diana',  'EMP-004', 'Product',     NULL, 135000.00),
(   'Ethan',   'Garcia',   'ethan@example.com',   '555-0505', '1995-06-17',
    1, 8900.00,  '654 Cedar Lane',   'Denver',     'CO',
    '80201', 'member', 'https://i.pravatar.cc/150?u=ethan',  'EMP-005', 'Engineering', 1,   105000.00);
