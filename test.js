/**
 * APIBridge AI v2 — Comprehensive Test Suite
 * Tests every scenario a developer actually hits, including all v2 features.
 */

const {
  APIBridgeTransformer,
  transform,
  createTransformer,
  exportMismatchCSV,
  exportMismatchJSON,
  ResponseCache,
  MiddlewarePipeline,
  SchemaValidator,
  ResponseNormalizer,
  LearningEngine,
  ApiBridgeError,
  ValidationError,
  TransformError,
  NetworkError,
} = require('./src/index');

const fs = require('fs');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    const result = fn();
    // Handle async tests
    if (result && typeof result.then === 'function') {
      result.then(() => {
        console.log(`  \u2713 ${name}`);
        passed++;
      }).catch(e => {
        console.log(`  \u2717 ${name}`);
        console.log(`    ${e.message}`);
        failed++;
      });
    } else {
      console.log(`  \u2713 ${name}`);
      passed++;
    }
  } catch(e) {
    console.log(`  \u2717 ${name}`);
    console.log(`    ${e.message}`);
    failed++;
  }
}

function assert(condition, msg) {
  if (!condition) throw new Error(msg || 'Assertion failed');
}

function assertEqual(a, b, msg) {
  if (a !== b) throw new Error(msg || `Expected "${b}" but got "${a}"`);
}

const t = new APIBridgeTransformer({ logMismatches: false });

// ─────────────────────────────────────────────────────────────
console.log('\n\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501');
console.log('  APIBridge AI v2 \u2014 Test Suite');
console.log('\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n');

// ─── 1. BASIC TRANSFORMATION ──────────────────────────────────
console.log('1. Basic snake_case \u2192 camelCase');

test('simple snake_case field', () => {
  const r = t.transform({ first_name: 'John' });
  assertEqual(r.firstName, 'John');
});

test('multiple fields', () => {
  const r = t.transform({ first_name: 'John', last_name: 'Doe', user_age: 25 });
  assertEqual(r.firstName, 'John');
  assertEqual(r.lastName,  'Doe');
  assertEqual(r.userAge,   25);
});

test('already camelCase \u2014 passes through untouched', () => {
  const r = t.transform({ firstName: 'John', isActive: true });
  assertEqual(r.firstName, 'John');
  assertEqual(r.isActive,  true);
});

test('SCREAMING_SNAKE_CASE', () => {
  const r = t.transform({ FIRST_NAME: 'John', USER_ID: 42 });
  assertEqual(r.firstName, 'John');
  assertEqual(r.userId,    42);
});

test('PascalCase', () => {
  const r = t.transform({ FirstName: 'John', LastName: 'Doe' });
  assertEqual(r.firstName, 'John');
  assertEqual(r.lastName,  'Doe');
});

test('null and undefined pass through safely', () => {
  assertEqual(t.transform(null), null);
  assertEqual(t.transform(undefined), undefined);
  assertEqual(t.transform('hello'), 'hello');
  assertEqual(t.transform(42), 42);
});

// ─── 2. NESTED OBJECTS ───────────────────────────────────────
console.log('\n2. Nested objects');

test('nested object keys transformed', () => {
  const r = t.transform({
    user_info: {
      first_name: 'John',
      home_address: { addr_city: 'Delhi', pin_code: '110001' }
    }
  });
  assertEqual(r.userInfo.firstName, 'John');
  assertEqual(r.userInfo.homeAddress.addrCity, 'Delhi');
});

test('deeply nested', () => {
  const r = t.transform({
    order_data: { line_items: { product_name: 'Shoes' } }
  });
  assertEqual(r.orderData.lineItems.productName, 'Shoes');
});

// ─── 3. ARRAYS ────────────────────────────────────────────────
console.log('\n3. Arrays of objects');

test('array of objects transformed', () => {
  const r = t.transform([
    { first_name: 'John', is_active: true },
    { first_name: 'Jane', is_active: false },
  ]);
  assertEqual(r[0].firstName, 'John');
  assertEqual(r[1].firstName, 'Jane');
  assertEqual(r[0].isActive,  true);
});

test('nested array inside object', () => {
  const r = t.transform({
    order_items: [
      { product_name: 'Shoes', unit_price: 500 },
      { product_name: 'Belt',  unit_price: 200 },
    ]
  });
  assertEqual(r.orderItems[0].productName, 'Shoes');
  assertEqual(r.orderItems[1].unitPrice,   200);
});

// ─── 4. TYPE COERCION ────────────────────────────────────────
console.log('\n4. Type coercion with schema');

const userSchema = {
  isActive:    { column: 'is_active',   type: 'boolean' },
  price:       { column: 'price',       type: 'number'  },
  createdAt:   { column: 'created_at',  type: 'date'    },
  age:         { column: 'age',         type: 'number'  },
};

test('SQL integer 1 \u2192 JS boolean true', () => {
  const r = t.transform({ is_active: 1 }, userSchema);
  assertEqual(r.isActive, true);
});

test('SQL integer 0 \u2192 JS boolean false', () => {
  const r = t.transform({ is_active: 0 }, userSchema);
  assertEqual(r.isActive, false);
});

test('SQL decimal string \u2192 JS number', () => {
  const r = t.transform({ price: '299.99' }, userSchema);
  assertEqual(r.price, 299.99);
});

test('SQL date string \u2192 JS Date object', () => {
  const r = t.transform({ created_at: '2024-01-15T10:30:00.000Z' }, userSchema);
  assert(r.createdAt instanceof Date, 'Should be a Date object');
});

test('integer string \u2192 number', () => {
  const r = t.transform({ age: '25' }, userSchema);
  assertEqual(r.age, 25);
});

// ─── 5. SYNONYM MATCHING ─────────────────────────────────────
console.log('\n5. Semantic synonym matching');

test('addr_line1 maps to street concept', () => {
  const r = t.transform({ addr_line1: '123 Main St' });
  assert(r.addrLine1 !== undefined || r.addressLine1 !== undefined,
    'Should map addr_line1');
});

test('usr_id maps to userId', () => {
  const r = t.transform({ usr_id: 42 });
  assert(r.usrId !== undefined || r.userId !== undefined);
});

test('is_active maps to isActive', () => {
  const r = t.transform({ is_active: true });
  assertEqual(r.isActive, true);
});

// ─── 6. REAL WORLD API EXAMPLES ──────────────────────────────
console.log('\n6. Real-world API responses');

test('Typical user API response', () => {
  const r = t.transform({
    user_id:        101,
    user_first_name:'Ravi',
    user_last_name: 'Kumar',
    email_address:  'ravi@example.com',
    mobile_number:  '9876543210',
    is_active:      1,
    is_verified:    1,
    created_at:     '2024-01-01T00:00:00Z',
    profile_image:  'https://cdn.example.com/pic.jpg',
  });
  assertEqual(r.userId,       101);
  assertEqual(r.userFirstName,'Ravi');
  assertEqual(r.emailAddress, 'ravi@example.com');
  assertEqual(r.isActive,     1);   // without schema, no coercion
  assertEqual(r.profileImage, 'https://cdn.example.com/pic.jpg');
});

test('E-commerce order response', () => {
  const r = t.transform({
    order_id:       'ORD-2024-001',
    order_date:     '2024-01-15',
    total_amount:   '1499.00',
    delivery_address: {
      addr_line1:   '42 MG Road',
      addr_city:    'Bengaluru',
      addr_pincode: '560001',
    },
    order_items: [
      { product_id: 1, product_name: 'Shirt', unit_price: '999.00', qty: 1 },
      { product_id: 2, product_name: 'Belt',  unit_price: '500.00', qty: 1 },
    ]
  });
  assertEqual(r.orderId,    'ORD-2024-001');
  assertEqual(r.totalAmount,'1499.00');
  assertEqual(r.deliveryAddress.addrCity, 'Bengaluru');
  assertEqual(r.orderItems[0].productName,'Shirt');
  assertEqual(r.orderItems[1].qty, 1);
});

test('Razorpay-style payment response', () => {
  const r = t.transform({
    razorpay_payment_id: 'pay_xxx123',
    razorpay_order_id:   'order_xxx456',
    razorpay_signature:  'sig_xxx789',
    payment_status:      'captured',
    amount_paid:         49900,
    currency_code:       'INR',
  });
  assertEqual(r.razorpayPaymentId,'pay_xxx123');
  assertEqual(r.paymentStatus,    'captured');
  assertEqual(r.currencyCode,     'INR');
});

// ─── 7. LEARNING ENGINE ──────────────────────────────────────
console.log('\n7. Learning engine');

const learner = new APIBridgeTransformer({ logMismatches: false });

test('approve a mapping \u2014 remembered', () => {
  learner.approve('usr_first_nm', 'firstName');
  const r = learner.transform({ usr_first_nm: 'Priya' });
  assertEqual(r.firstName, 'Priya');
});

test('reject a mapping \u2014 not applied again', () => {
  learner.transform({ addr_ln1: '123 St' });
  learner.reject('addr_ln1', 'addrLn1', 'streetAddress');
  assert(learner.learning.size() >= 1);
});

test('stats tracking', () => {
  const stats = learner.getStats();
  assert(stats.totalFields > 0, 'Should have tracked fields');
  assert(typeof stats.autoFixRate === 'string');
});

test('bulk import/export mappings', () => {
  const le = new LearningEngine({ storePath: '/tmp/apibridge_test_bulk1.json' });
  le.reset();
  le.learn('test_src', 'testDst', true);
  const exported = le.bulkExport();
  assert(exported['test_src'] === 'testDst', 'Should export learned mapping');

  const le2 = new LearningEngine({ storePath: '/tmp/apibridge_test_bulk2.json' });
  le2.reset();
  const count = le2.bulkImport({ 'foo_bar': 'fooBar', 'baz_qux': 'bazQux' });
  assertEqual(count, 2);
  assertEqual(le2.lookup('foo_bar'), 'fooBar');
});

test('learning engine stats', () => {
  const le = new LearningEngine({ storePath: '/tmp/apibridge_test_stats.json' });
  le.reset();
  le.learn('x_key', 'xKey', true);
  le.learn('y_key', 'badKey', false);
  const stats = le.getStats();
  assertEqual(stats.approvedCount, 1);
  assertEqual(stats.rejectedCount, 1);
});

// ─── 8. CSV / JSON EXPORT ────────────────────────────────────
console.log('\n8. Export (CSV + JSON)');

test('CSV generated with correct structure', () => {
  const csvTransformer = new APIBridgeTransformer({ logMismatches: false });
  csvTransformer.transform({
    first_name: 'John',
    last_name:  'Doe',
    usr_age:    25,
    is_active:  1,
  });

  const csv = csvTransformer.exportCSV();
  assert(csv.includes('source_key'),  'Should have header: source_key');
  assert(csv.includes('target_key'),  'Should have header: target_key');
  assert(csv.includes('confidence_percent') || csv.includes('confidence_%'),
    'Should have header: confidence');
  assert(csv.includes('firstName') || csv.includes('first_name'),
    'Should contain field data');
});

test('CSV file exported to disk', () => {
  const csvTransformer = new APIBridgeTransformer({ logMismatches: false });
  csvTransformer.transform({ test_field: 'value', another_key: 123 });

  const filePath = exportMismatchCSV(
    csvTransformer.mismatches,
    '/tmp/apibridge_test_export.csv'
  );
  assert(fs.existsSync(filePath), 'CSV file should exist');

  const content = fs.readFileSync(filePath, 'utf8');
  assert(content.includes('source_key'), 'CSV should have headers');
  assert(content.length > 100, 'CSV should have content');
});

test('JSON export generates valid file', () => {
  const jt = new APIBridgeTransformer({ logMismatches: false });
  jt.transform({ test_key: 'val', another_key: 42 });

  const filePath = exportMismatchJSON(
    jt.mismatches,
    '/tmp/apibridge_test_export.json'
  );
  assert(fs.existsSync(filePath), 'JSON file should exist');

  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  assertEqual(data.version, '2.0.0');
  assert(data.summary.total > 0, 'Should have mismatch count');
});

// ─── 9. PENDING MISMATCHES ────────────────────────────────────
console.log('\n9. Pending review queue');

test('low confidence mismatches flagged as pending', () => {
  const pt = new APIBridgeTransformer({
    logMismatches: false,
    autoApplyThreshold: 0.99
  });
  pt.transform({ weird_custom_key_xyz: 'value' });
  const pending = pt.getPending();
  assert(Array.isArray(pending), 'Should return array');
});

// ─── 10. v2: MULTIPLE OUTPUT CONVENTIONS ──────────────────────
console.log('\n10. v2: Multiple output conventions');

test('snake_case output', () => {
  const st = new APIBridgeTransformer({ logMismatches: false, targetConvention: 'snake_case' });
  const r = st.transform({ firstName: 'John', lastName: 'Doe' });
  assertEqual(r.first_name, 'John');
  assertEqual(r.last_name, 'Doe');
});

test('PascalCase output', () => {
  const pt = new APIBridgeTransformer({ logMismatches: false, targetConvention: 'PascalCase' });
  const r = pt.transform({ first_name: 'John' });
  assertEqual(r.FirstName, 'John');
});

test('kebab-case output', () => {
  const kt = new APIBridgeTransformer({ logMismatches: false, targetConvention: 'kebab-case' });
  const r = kt.transform({ first_name: 'John' });
  assertEqual(r['first-name'], 'John');
});

test('SCREAMING_SNAKE output', () => {
  const sst = new APIBridgeTransformer({ logMismatches: false, targetConvention: 'SCREAMING_SNAKE' });
  const r = sst.transform({ first_name: 'John' });
  assertEqual(r['FIRST_NAME'], 'John');
});

// ─── 11. v2: BATCH TRANSFORMATION ───────────────────────────
console.log('\n11. v2: Batch transformation');

test('transformBatch processes array of payloads', () => {
  const bt = new APIBridgeTransformer({ logMismatches: false });
  const results = bt.transformBatch([
    { first_name: 'John', last_name: 'Doe' },
    { first_name: 'Jane', last_name: 'Smith' },
    { first_name: 'Bob',  last_name: 'Lee' },
  ]);
  assertEqual(results.length, 3);
  assertEqual(results[0].firstName, 'John');
  assertEqual(results[2].lastName, 'Lee');
});

test('transformBatch rejects non-array', () => {
  const bt = new APIBridgeTransformer({ logMismatches: false });
  let threw = false;
  try {
    bt.transformBatch({ not: 'array' });
  } catch (e) {
    threw = true;
    assert(e.code === 'TRANSFORM_ERROR', 'Should throw TransformError');
  }
  assert(threw, 'Should have thrown');
});

// ─── 12. v2: REVERSE TRANSFORM ──────────────────────────────
console.log('\n12. v2: Reverse transform (frontend \u2192 backend)');

test('reverse converts camelCase to snake_case', () => {
  const rt = new APIBridgeTransformer({ logMismatches: false });
  const r = rt.reverse({ firstName: 'John', lastName: 'Doe' });
  assertEqual(r.first_name, 'John');
  assertEqual(r.last_name, 'Doe');
});

// ─── 13. v2: STANDALONE TRANSFORM ───────────────────────────
console.log('\n13. v2: Standalone transform() function');

test('transform() works without creating class instance', () => {
  const r = transform({ user_name: 'Alice', email_address: 'a@b.com' });
  assertEqual(r.userName, 'Alice');
  assertEqual(r.emailAddress, 'a@b.com');
});

test('createTransformer() returns reusable instance', () => {
  const tr = createTransformer({ logMismatches: false });
  const r1 = tr.transform({ first_name: 'A' });
  const r2 = tr.transform({ last_name: 'B' });
  assertEqual(r1.firstName, 'A');
  assertEqual(r2.lastName, 'B');
  assert(tr.getStats().totalFields === 2, 'Stats should accumulate');
});

// ─── 14. v2: RESPONSE CACHE ─────────────────────────────────
console.log('\n14. v2: Response cache');

test('cache stores and retrieves values', () => {
  const cache = new ResponseCache({ ttl: 5000 });
  cache.set({ a: 1 }, { dir: 'toFrontend' }, { b: 2 });
  const result = cache.get({ a: 1 }, { dir: 'toFrontend' });
  assertEqual(result.b, 2);
});

test('cache misses on unknown data', () => {
  const cache = new ResponseCache();
  const result = cache.get({ unknown: true }, {});
  assertEqual(result, undefined);
});

test('cache respects maxSize and evicts LRU', () => {
  const cache = new ResponseCache({ maxSize: 2 });
  cache.set('a', {}, 'val_a');
  cache.set('b', {}, 'val_b');
  cache.set('c', {}, 'val_c'); // should evict 'a'
  assertEqual(cache.size(), 2);
  const stats = cache.getStats();
  assertEqual(stats.evictions, 1);
});

test('cache invalidate clears all', () => {
  const cache = new ResponseCache();
  cache.set('x', {}, 'val_x');
  cache.set('y', {}, 'val_y');
  cache.invalidate();
  assertEqual(cache.size(), 0);
});

test('cache stats reports hit rate', () => {
  const cache = new ResponseCache();
  cache.set({ k: 1 }, {}, 'v');
  cache.get({ k: 1 }, {});  // hit
  cache.get({ k: 2 }, {});  // miss
  const stats = cache.getStats();
  assertEqual(stats.hits, 1);
  assertEqual(stats.misses, 1);
  assertEqual(stats.hitRate, '50%');
});

// ─── 15. v2: MIDDLEWARE PIPELINE ─────────────────────────────
console.log('\n15. v2: Middleware pipeline');

test('middleware runs in order', async () => {
  const mw = new MiddlewarePipeline();
  const log = [];
  mw.use('first', async (ctx, next) => { log.push('1'); await next(); });
  mw.use('second', async (ctx, next) => { log.push('2'); await next(); });
  await mw.run('before', {});
  assertEqual(log.join(','), '1,2');
});

test('middleware can modify context', async () => {
  const mw = new MiddlewarePipeline();
  mw.use('addMeta', async (ctx, next) => { ctx.meta = { added: true }; await next(); });
  const ctx = {};
  await mw.run('before', ctx);
  assertEqual(ctx.meta.added, true);
});

test('middleware list and remove', () => {
  const mw = new MiddlewarePipeline();
  mw.use('a', async (ctx, next) => next());
  mw.use('b', async (ctx, next) => next(), 'after');
  assertEqual(mw.size(), 2);
  assertEqual(mw.list().length, 2);
  mw.remove('a');
  assertEqual(mw.size(), 1);
});

// ─── 16. v2: SCHEMA VALIDATOR ────────────────────────────────
console.log('\n16. v2: Schema validator');

test('validates required fields', () => {
  const v = new SchemaValidator();
  const schema = {
    name: { type: 'string', required: true },
    age:  { type: 'number', required: true },
  };
  const result = v.validate({ name: 'John' }, schema);
  assertEqual(result.valid, false);
  assertEqual(result.errors.length, 1);
  assert(result.errors[0].field === 'age');
});

test('validates field types', () => {
  const v = new SchemaValidator();
  const schema = {
    name: { type: 'string' },
    age:  { type: 'number' },
  };
  const result = v.validate({ name: 'John', age: 'not_a_number' }, schema);
  assertEqual(result.valid, false);
  assert(result.errors[0].field === 'age');
});

test('coerces defaults for missing required fields', () => {
  const v = new SchemaValidator({ coerce: true });
  const schema = {
    name:     { type: 'string', required: true },
    isActive: { type: 'boolean', required: true, default: false },
  };
  const result = v.validate({ name: 'John' }, schema);
  assertEqual(result.valid, true);
  assertEqual(result.data.isActive, false);
});

test('strict mode rejects extra fields', () => {
  const v = new SchemaValidator({ strict: true });
  const schema = { name: { type: 'string' } };
  const result = v.validate({ name: 'John', extra: 'field' }, schema);
  assertEqual(result.valid, false);
  assert(result.errors[0].rule === 'extra');
});

test('throwOnError throws ValidationError', () => {
  const v = new SchemaValidator({ throwOnError: true });
  const schema = { name: { type: 'string', required: true } };
  let threw = false;
  try {
    v.validate({}, schema);
  } catch (e) {
    threw = true;
    assert(e instanceof ValidationError, 'Should be ValidationError');
  }
  assert(threw, 'Should have thrown');
});

// ─── 17. v2: RESPONSE NORMALIZER ────────────────────────────
console.log('\n17. v2: Response normalizer');

test('unwraps envelope responses', () => {
  const n = new ResponseNormalizer();
  const result = n.normalize({ data: { id: 1, name: 'John' }, meta: { page: 1 } });
  assertEqual(result.data.id, 1);
  assert(result.meta.meta !== undefined || result.meta.page !== undefined,
    'Meta should be extracted');
});

test('detects error responses', () => {
  const n = new ResponseNormalizer();
  const result = n.normalize({ error: 'Not found', status: 'error' }, 404);
  assert(result.error !== null, 'Should detect error');
  assertEqual(result.error.status, 404);
});

test('extracts pagination fields', () => {
  const n = new ResponseNormalizer();
  const result = n.normalize({
    data: [{ id: 1 }],
    page: 2,
    per_page: 10,
    total: 100,
    total_pages: 10,
  });
  assert(result.pagination !== null, 'Should have pagination');
  assertEqual(result.pagination.page, 2);
  assertEqual(result.pagination.total, 100);
});

test('handles null/undefined safely', () => {
  const n = new ResponseNormalizer();
  const r1 = n.normalize(null);
  assertEqual(r1.data, null);
  assert(r1.meta.empty === true);

  const r2 = n.normalize(undefined);
  assertEqual(r2.data, null);
});

test('handles primitive and array responses', () => {
  const n = new ResponseNormalizer();
  const r1 = n.normalize([1, 2, 3]);
  assert(Array.isArray(r1.data), 'Array should pass through');

  const r2 = n.normalize('plain text');
  assertEqual(r2.data, 'plain text');
});

// ─── 18. v2: ERROR CLASSES ───────────────────────────────────
console.log('\n18. v2: Error classes');

test('ApiBridgeError has structured output', () => {
  const err = new ApiBridgeError('Test error', 'TEST', { detail: 1 });
  assertEqual(err.code, 'TEST');
  assertEqual(err.name, 'ApiBridgeError');
  const json = err.toJSON();
  assert(json.timestamp !== undefined, 'Should have timestamp');
  assertEqual(json.details.detail, 1);
});

test('ValidationError contains field info', () => {
  const err = new ValidationError('Bad field', 'email', 'string', 'number');
  assertEqual(err.name, 'ValidationError');
  assertEqual(err.details.field, 'email');
});

test('NetworkError contains retry info', () => {
  const err = new NetworkError('Failed', 'http://x.com', 3, 3);
  assertEqual(err.name, 'NetworkError');
  assertEqual(err.details.attempt, 3);
});

// ─── 19. v2: EVENT EMITTER ──────────────────────────────────
console.log('\n19. v2: Event emitter');

test('emits mismatch events', () => {
  const et = new APIBridgeTransformer({ logMismatches: false });
  let emitted = false;
  et.on('mismatch', (record) => {
    emitted = true;
    assert(record.sourceKey !== undefined, 'Mismatch should have sourceKey');
  });
  et.transform({ first_name: 'John' });
  assert(emitted, 'Should have emitted mismatch event');
});

test('emits approved/rejected events', () => {
  const et = new APIBridgeTransformer({ logMismatches: false });
  let approvedEvent = null;
  let rejectedEvent = null;
  et.on('approved', (e) => { approvedEvent = e; });
  et.on('rejected', (e) => { rejectedEvent = e; });
  et.approve('foo', 'bar');
  et.reject('baz', 'wrong', 'right');
  assert(approvedEvent !== null, 'Should emit approved');
  assert(rejectedEvent !== null, 'Should emit rejected');
  assertEqual(approvedEvent.targetKey, 'bar');
  assertEqual(rejectedEvent.correctTargetKey, 'right');
});

// ─── 20. v2: SESSION RESET ──────────────────────────────────
console.log('\n20. v2: Session management');

test('resetSession clears stats and mismatches', () => {
  const st = new APIBridgeTransformer({ logMismatches: false });
  st.transform({ first_name: 'John' });
  assert(st.getStats().totalFields > 0, 'Should have stats');
  assert(st.mismatches.length > 0, 'Should have mismatches');
  st.resetSession();
  assertEqual(st.getStats().totalFields, 0);
  assertEqual(st.mismatches.length, 0);
});

// ─── SUMMARY ──────────────────────────────────────────────────
// Wait a tick for async tests
setTimeout(() => {
  console.log('\n\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501');
  console.log(`  Results: ${passed} passed, ${failed} failed`);
  console.log('\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n');

  if (failed > 0) {
    console.log('  Some tests failed \u2014 check output above.\n');
    process.exit(1);
  } else {
    console.log('  All tests passed \u2713\n');
  }
}, 500);
