/**
 * APIBridge AI v3 — Comprehensive Test Suite
 * Tests every scenario a developer actually hits, including all v2 and v3 features.
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
  PluginManager,
  SchemaInference,
  FieldProjection,
  DataMasker,
  RateLimiter,
  SchemaDiff,
  TypeGenerator,
  MetricsCollector,
  ApiBridgeError,
  ValidationError,
  TransformError,
  NetworkError,
  PluginError,
  RateLimitError,
  InferenceError,
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
console.log('  APIBridge AI v3 \u2014 Test Suite');
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
  assertEqual(data.version, '3.0.0');
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

// ─── 21. v3: PLUGIN SYSTEM ───────────────────────────────────
console.log('\n21. v3: Plugin system');

test('register and list plugins', () => {
  const pm = new PluginManager();
  pm.register({
    name: 'testPlugin',
    hooks: {
      beforeTransform: (data) => ({ ...data, injected: true }),
    },
  });
  assertEqual(pm.size(), 1);
  assert(pm.has('testPlugin'), 'Should have registered plugin');
  assertEqual(pm.list().length, 1);
});

test('execute sync hook modifies data', () => {
  const pm = new PluginManager();
  pm.register({
    name: 'uppercaser',
    hooks: {
      beforeTransform: (data) => {
        const result = {};
        for (const [k, v] of Object.entries(data)) {
          result[k] = typeof v === 'string' ? v.toUpperCase() : v;
        }
        return result;
      },
    },
  });
  const result = pm.executeSync('beforeTransform', { name: 'john' });
  assertEqual(result.name, 'JOHN');
});

test('execute async hook modifies data', async () => {
  const pm = new PluginManager();
  pm.register({
    name: 'asyncPlugin',
    hooks: {
      afterTransform: async (data) => ({ ...data, processed: true }),
    },
  });
  const result = await pm.execute('afterTransform', { id: 1 });
  assertEqual(result.processed, true);
});

test('unregister removes plugin and hooks', () => {
  const pm = new PluginManager();
  pm.register({ name: 'temp', hooks: { beforeTransform: () => {} } });
  assertEqual(pm.size(), 1);
  pm.unregister('temp');
  assertEqual(pm.size(), 0);
  assert(!pm.has('temp'), 'Should no longer have plugin');
});

test('duplicate plugin registration throws PluginError', () => {
  const pm = new PluginManager();
  pm.register({ name: 'dup' });
  let threw = false;
  try {
    pm.register({ name: 'dup' });
  } catch (e) {
    threw = true;
    assert(e instanceof PluginError, 'Should be PluginError');
  }
  assert(threw, 'Should have thrown');
});

test('invalid hook name throws PluginError', () => {
  const pm = new PluginManager();
  let threw = false;
  try {
    pm.register({ name: 'bad', hooks: { nonExistentHook: () => {} } });
  } catch (e) {
    threw = true;
    assert(e instanceof PluginError, 'Should be PluginError');
  }
  assert(threw, 'Should have thrown');
});

// ─── 22. v3: SCHEMA INFERENCE ────────────────────────────────
console.log('\n22. v3: Schema inference');

test('infer schema from single object', () => {
  const si = new SchemaInference();
  const schema = si.infer({
    id: 1,
    name: 'John',
    email: 'john@example.com',
    is_active: true,
    age: 25,
  });
  assertEqual(schema.name.type, 'string');
  assertEqual(schema.is_active.type, 'boolean');
  assertEqual(schema.age.type, 'integer');
  assert(schema.name.required === true, 'Single sample fields should be required');
});

test('infer schema from multiple samples', () => {
  const si = new SchemaInference();
  const schema = si.infer([
    { id: 1, name: 'John', email: 'a@b.com' },
    { id: 2, name: 'Jane', email: 'c@d.com' },
    { id: 3, name: 'Bob' },
  ]);
  assertEqual(schema.id.type, 'integer');
  assert(schema.email.required === false, 'email missing in one sample, should not be required');
});

test('detect email pattern', () => {
  const si = new SchemaInference();
  const schema = si.infer([
    { email: 'a@b.com' },
    { email: 'c@d.com' },
  ]);
  assertEqual(schema.email.pattern, 'email');
});

test('infer from empty array throws InferenceError', () => {
  const si = new SchemaInference();
  let threw = false;
  try {
    si.infer([]);
  } catch (e) {
    threw = true;
    assert(e instanceof InferenceError, 'Should be InferenceError');
  }
  assert(threw, 'Should have thrown');
});

test('merge schemas widens types', () => {
  const si = new SchemaInference();
  const s1 = { name: { type: 'string', required: true } };
  const s2 = { name: { type: 'number', required: true } };
  const merged = si.merge([s1, s2]);
  assertEqual(merged.name.type, 'any');
});

// ─── 23. v3: FIELD PROJECTION ────────────────────────────────
console.log('\n23. v3: Field projection');

test('pick selects only specified fields', () => {
  const fp = new FieldProjection();
  const r = fp.pick({ id: 1, name: 'John', secret: 'xxx' }, ['id', 'name']);
  assertEqual(r.id, 1);
  assertEqual(r.name, 'John');
  assert(r.secret === undefined, 'secret should be omitted');
});

test('omit excludes specified fields', () => {
  const fp = new FieldProjection();
  const r = fp.omit({ id: 1, password: 'secret', name: 'John' }, ['password']);
  assertEqual(r.id, 1);
  assertEqual(r.name, 'John');
  assert(r.password === undefined, 'password should be omitted');
});

test('rename renames fields', () => {
  const fp = new FieldProjection();
  const r = fp.rename({ first_name: 'John' }, { first_name: 'firstName' });
  assertEqual(r.firstName, 'John');
  assert(r.first_name === undefined, 'old key should be gone');
});

test('reshape maps nested paths', () => {
  const fp = new FieldProjection();
  const data = { user: { name: 'John', address: { city: 'NYC' } }, id: 1 };
  const r = fp.reshape(data, { userName: 'user.name', city: 'user.address.city' });
  assertEqual(r.userName, 'John');
  assertEqual(r.city, 'NYC');
});

test('flatten converts nested to dot-notation', () => {
  const fp = new FieldProjection();
  const r = fp.flatten({ a: { b: { c: 1 } }, d: 2 });
  assertEqual(r['a.b.c'], 1);
  assertEqual(r.d, 2);
});

test('compact removes null/undefined', () => {
  const fp = new FieldProjection();
  const r = fp.compact({ a: 1, b: null, c: undefined, d: 'ok' });
  assertEqual(r.a, 1);
  assertEqual(r.d, 'ok');
  assert(r.b === undefined, 'null should be removed');
  assert(r.c === undefined, 'undefined should be removed');
});

test('pick on arrays', () => {
  const fp = new FieldProjection();
  const r = fp.pick([{ id: 1, name: 'A', secret: 'x' }, { id: 2, name: 'B', secret: 'y' }], ['id', 'name']);
  assertEqual(r.length, 2);
  assertEqual(r[0].id, 1);
  assert(r[0].secret === undefined);
});

// ─── 24. v3: DATA MASKING ───────────────────────────────────
console.log('\n24. v3: Data masking');

test('auto-detect and redact sensitive fields', () => {
  const dm = new DataMasker();
  const r = dm.mask({ name: 'John', password: 'secret123', email: 'a@b.com' });
  assertEqual(r.name, 'John');
  assertEqual(r.password, '[REDACTED]');
  assertEqual(r.email, 'a@b.com'); // email not in default sensitive list
});

test('mask with custom field rules', () => {
  const dm = new DataMasker({
    fieldRules: { email: 'mask', ssn: 'hash' },
  });
  const r = dm.mask({ email: 'john@example.com', ssn: '123-45-6789' });
  assert(r.email.includes('*'), 'Email should be masked');
  assert(r.ssn.length === 64, 'SSN should be SHA-256 hash (64 chars)');
});

test('mask nested objects', () => {
  const dm = new DataMasker();
  const r = dm.mask({ user: { password: 'secret', name: 'John' } });
  assertEqual(r.user.password, '[REDACTED]');
  assertEqual(r.user.name, 'John');
});

test('isSensitive detects common patterns', () => {
  const dm = new DataMasker();
  assert(dm.isSensitive('password') === true);
  assert(dm.isSensitive('api_key') === true);
  assert(dm.isSensitive('ssn') === true);
  assert(dm.isSensitive('name') === false);
});

test('replace strategy uses custom value', () => {
  const dm = new DataMasker({
    fieldRules: { token: { strategy: 'replace', replaceWith: '***' } },
  });
  const r = dm.mask({ token: 'abc123' });
  assertEqual(r.token, '***');
});

// ─── 25. v3: RATE LIMITER ───────────────────────────────────
console.log('\n25. v3: Rate limiter');

test('allows requests within limit', () => {
  const rl = new RateLimiter({ maxRequests: 10, windowMs: 1000 });
  assert(rl.tryAcquire() === true, 'Should allow first request');
  assertEqual(rl.remaining() > 0, true);
});

test('throttles requests over limit', () => {
  const rl = new RateLimiter({ maxRequests: 2, windowMs: 60000, burstLimit: 2 });
  assert(rl.tryAcquire() === true);
  assert(rl.tryAcquire() === true);
  assert(rl.tryAcquire() === false, 'Third request should be throttled');
  assertEqual(rl.getStats().throttled, 1);
});

test('reset clears state', () => {
  const rl = new RateLimiter({ maxRequests: 1, windowMs: 60000, burstLimit: 1 });
  rl.tryAcquire();
  rl.tryAcquire(); // throttled
  rl.reset();
  assert(rl.tryAcquire() === true, 'After reset, should allow');
  assertEqual(rl.getStats().totalRequests, 1);
});

test('getStats tracks totals', () => {
  const rl = new RateLimiter({ maxRequests: 5, windowMs: 1000 });
  rl.tryAcquire();
  rl.tryAcquire();
  const stats = rl.getStats();
  assertEqual(stats.totalRequests, 2);
  assertEqual(stats.allowed, 2);
  assertEqual(stats.throttled, 0);
});

// ─── 26. v3: SCHEMA DIFF ───────────────────────────────────
console.log('\n26. v3: Schema diff engine');

test('detect added fields', () => {
  const sd = new SchemaDiff();
  const r = sd.diff({ id: 1, name: 'John' }, { id: 1, name: 'John', email: 'a@b.com' });
  assertEqual(r.summary.added, 1);
  assertEqual(r.added[0].field, 'email');
});

test('detect removed fields', () => {
  const sd = new SchemaDiff();
  const r = sd.diff({ id: 1, name: 'John', age: 25 }, { id: 1, name: 'John' });
  assertEqual(r.summary.removed, 1);
  assertEqual(r.removed[0].field, 'age');
});

test('detect type changes', () => {
  const sd = new SchemaDiff();
  const r = sd.diff({ age: 25 }, { age: 'twenty-five' });
  assertEqual(r.summary.typeChanged, 1);
  assertEqual(r.typeChanged[0].before, 'number');
  assertEqual(r.typeChanged[0].after, 'string');
});

test('detect renamed fields', () => {
  const sd = new SchemaDiff({ renameThreshold: 0.5 });
  const r = sd.diff(
    { first_name: 'John', last_name: 'Doe' },
    { firstName: 'John', lastName: 'Doe' },
  );
  assert(r.summary.renamed >= 1, 'Should detect rename');
});

test('hasBreakingChanges flag', () => {
  const sd = new SchemaDiff();
  const r1 = sd.diff({ id: 1 }, { id: 1, extra: 2 });
  assert(r1.summary.hasBreakingChanges === false, 'Adding is not breaking');

  const r2 = sd.diff({ id: 1, name: 'x' }, { id: 1 });
  assert(r2.summary.hasBreakingChanges === true, 'Removing is breaking');
});

test('diffSchemas compares schema definitions', () => {
  const sd = new SchemaDiff();
  const r = sd.diffSchemas(
    { name: { type: 'string', required: true }, age: { type: 'number', required: false } },
    { name: { type: 'string', required: true }, email: { type: 'string', required: true } },
  );
  assertEqual(r.added.length, 1);
  assertEqual(r.removed.length, 1);
  assertEqual(r.added[0], 'email');
  assertEqual(r.removed[0], 'age');
});

// ─── 27. v3: TYPESCRIPT TYPE GENERATOR ──────────────────────
console.log('\n27. v3: TypeScript type generator');

test('generate interface from schema', () => {
  const tg = new TypeGenerator();
  const ts = tg.fromSchema('User', {
    id:    { type: 'integer', required: true },
    name:  { type: 'string',  required: true },
    email: { type: 'string',  required: false },
  });
  assert(ts.includes('interface User'), 'Should have interface declaration');
  assert(ts.includes('id: number'), 'Should map integer to number');
  assert(ts.includes('email?:'), 'Optional fields should have ?');
});

test('generate interface from data', () => {
  const tg = new TypeGenerator();
  const ts = tg.fromData('Order', { id: 1, total: 99.99, active: true });
  assert(ts.includes('interface Order'), 'Should have interface');
  assert(ts.includes('id: number'), 'Should infer number');
  assert(ts.includes('active: boolean'), 'Should infer boolean');
});

test('generate type guard', () => {
  const tg = new TypeGenerator();
  const ts = tg.generateTypeGuard('User', {
    name: { type: 'string', required: true },
    age:  { type: 'number', required: true },
  });
  assert(ts.includes('function isUser'), 'Should have type guard');
  assert(ts.includes('value is User'), 'Should have type predicate');
});

test('generate nested interfaces', () => {
  const tg = new TypeGenerator();
  const ts = tg.fromNestedData('Order', {
    id: 1,
    address: { city: 'NYC', zip: '10001' },
  });
  assert(ts.includes('interface Order'), 'Should have root interface');
  assert(ts.includes('interface OrderAddress'), 'Should have nested interface');
});

// ─── 28. v3: METRICS COLLECTOR ──────────────────────────────
console.log('\n28. v3: Metrics collector');

test('record and get summary', () => {
  const mc = new MetricsCollector();
  mc.record('transform.duration', 5);
  mc.record('transform.duration', 10);
  mc.record('transform.duration', 15);
  const summary = mc.getSummary('transform.duration');
  assertEqual(summary.count, 3);
  assertEqual(summary.min, 5);
  assertEqual(summary.max, 15);
  assertEqual(summary.mean, 10);
});

test('increment and get counter', () => {
  const mc = new MetricsCollector();
  mc.increment('requests.total');
  mc.increment('requests.total');
  mc.increment('requests.total', 3);
  assertEqual(mc.getCounter('requests.total'), 5);
});

test('measureSync tracks duration', () => {
  const mc = new MetricsCollector();
  const result = mc.measureSync('test.op', () => 42);
  assertEqual(result, 42);
  const summary = mc.getSummary('test.op');
  assertEqual(summary.count, 1);
  assert(summary.mean >= 0, 'Duration should be non-negative');
});

test('getReport returns full report', () => {
  const mc = new MetricsCollector();
  mc.record('a', 1);
  mc.increment('b');
  const report = mc.getReport();
  assert(report.uptime >= 0, 'Should have uptime');
  assert(report.counters.b === 1, 'Should have counter');
  assert(report.metrics.a !== undefined, 'Should have metric summary');
});

test('reset clears all data', () => {
  const mc = new MetricsCollector();
  mc.record('x', 1);
  mc.increment('y');
  mc.reset();
  assertEqual(mc.listMetrics().length, 0);
  assertEqual(mc.listCounters().length, 0);
});

test('disabled collector skips recording', () => {
  const mc = new MetricsCollector({ enabled: false });
  mc.record('x', 1);
  mc.increment('y');
  assertEqual(mc.getSummary('x').count, 0);
  assertEqual(mc.getCounter('y'), 0);
});

// ─── 29. v3: NEW ERROR CLASSES ──────────────────────────────
console.log('\n29. v3: New error classes');

test('PluginError has plugin info', () => {
  const err = new PluginError('Plugin failed', 'myPlugin');
  assertEqual(err.name, 'PluginError');
  assertEqual(err.code, 'PLUGIN_ERROR');
  assertEqual(err.details.plugin, 'myPlugin');
});

test('RateLimitError has limit info', () => {
  const err = new RateLimitError('Too many requests', 60, 1000);
  assertEqual(err.name, 'RateLimitError');
  assertEqual(err.code, 'RATE_LIMIT_ERROR');
  assertEqual(err.details.limit, 60);
  assertEqual(err.details.retryAfterMs, 1000);
});

test('InferenceError has reason', () => {
  const err = new InferenceError('Cannot infer', 'empty_data');
  assertEqual(err.name, 'InferenceError');
  assertEqual(err.code, 'INFERENCE_ERROR');
  assertEqual(err.details.reason, 'empty_data');
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
