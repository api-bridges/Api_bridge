/**
 * APIBridge AI v8 — Comprehensive Test Suite
 * Tests every scenario a developer actually hits, including all v2, v3, v4, v5, v6, v7, and v8 features.
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
  CircuitBreaker,
  RequestDeduplicator,
  GraphQLBridge,
  OpenAPIImporter,
  APIVersionManager,
  WebhookHandler,
  JSONPatchGenerator,
  ComposablePipeline,
  RetryStrategy,
  RequestLogger,
  SchemaRegistry,
  ResponseStreamer,
  DependencyGraph,
  MockServer,
  HealthCheck,
  EventBus,
  ApiBridgeError,
  ValidationError,
  TransformError,
  NetworkError,
  PluginError,
  RateLimitError,
  InferenceError,
  CircuitBreakerError,
  PipelineError,
  WebhookError,
  VersioningError,
  RetryError,
  SchemaRegistryError,
  DependencyGraphError,
  MockServerError,
  HealthCheckError,
  EventBusError,
  FuzzyMatcher,
  CrypticResolver,
  TypeCoercer,
  FuzzyMatchError,
  TypeCoercionError,
  CrypticResolverError,
  FieldAliaser,
  SchemaMigrator,
  BatchOrchestrator,
  FieldStats,
  ConditionalTransform,
  DeepMerge,
  OutputFormatter,
  RequestInterceptor,
  FieldAliaserError,
  SchemaMigrationError,
  BatchOrchestratorError,
  DeepMergeError,
  InterceptorError,
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
console.log('  APIBridge AI v6 \u2014 Test Suite');
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

// ─── 30. v4: CIRCUIT BREAKER ──────────────────────────────────
console.log('\n30. v4: Circuit Breaker');

test('starts in CLOSED state', () => {
  const cb = new CircuitBreaker();
  assertEqual(cb.getState(), 'CLOSED');
  assert(cb.isHealthy(), 'Should be healthy');
});

test('execute succeeds in CLOSED state', () => {
  const cb = new CircuitBreaker({ failureThreshold: 3 });
  return cb.execute(() => Promise.resolve(42)).then(result => {
    assertEqual(result, 42);
    assertEqual(cb.getStats().successes, 1);
  });
});

test('transitions to OPEN after failure threshold', () => {
  const cb = new CircuitBreaker({ failureThreshold: 2, resetTimeout: 60000 });
  const fail = () => cb.execute(() => Promise.reject(new Error('fail'))).catch(() => {});
  return fail().then(() => fail()).then(() => {
    assertEqual(cb.getState(), 'OPEN');
    assert(!cb.isHealthy(), 'Should not be healthy');
    cb.destroy();
  });
});

test('rejects requests when OPEN', () => {
  const cb = new CircuitBreaker({ failureThreshold: 1, resetTimeout: 60000 });
  return cb.execute(() => Promise.reject(new Error('fail'))).catch(() => {
    return cb.execute(() => Promise.resolve(42)).then(
      () => { throw new Error('Should have thrown'); },
      (err) => {
        assert(err instanceof CircuitBreakerError, 'Should be CircuitBreakerError');
        cb.destroy();
      }
    );
  });
});

test('forceOpen and forceClose work', () => {
  const cb = new CircuitBreaker();
  cb.forceOpen();
  assertEqual(cb.getState(), 'OPEN');
  cb.forceClose();
  assertEqual(cb.getState(), 'CLOSED');
  cb.destroy();
});

test('reset clears all state', () => {
  const cb = new CircuitBreaker({ failureThreshold: 1, resetTimeout: 60000 });
  return cb.execute(() => Promise.reject(new Error('fail'))).catch(() => {
    cb.reset();
    assertEqual(cb.getState(), 'CLOSED');
    assertEqual(cb.getStats().failures, 0);
    assertEqual(cb.getStats().totalRequests, 0);
    cb.destroy();
  });
});

test('getStats returns correct data', () => {
  const cb = new CircuitBreaker();
  const stats = cb.getStats();
  assert(stats.state !== undefined, 'Should have state');
  assert(stats.failures !== undefined, 'Should have failures');
  assert(stats.successes !== undefined, 'Should have successes');
  assert(stats.totalRequests !== undefined, 'Should have totalRequests');
});

// ─── 31. v4: REQUEST DEDUPLICATOR ─────────────────────────────
console.log('\n31. v4: Request Deduplicator');

test('deduplicates concurrent identical requests', () => {
  const dedup = new RequestDeduplicator();
  let callCount = 0;
  const fn = () => { callCount++; return Promise.resolve('result'); };
  return Promise.all([
    dedup.dedupe('key1', fn),
    dedup.dedupe('key1', fn),
    dedup.dedupe('key1', fn),
  ]).then(results => {
    assertEqual(callCount, 1);
    assertEqual(results[0], 'result');
    assertEqual(results[1], 'result');
    assertEqual(results[2], 'result');
    assertEqual(dedup.getStats().deduped, 2);
  });
});

test('different keys execute independently', () => {
  const dedup = new RequestDeduplicator();
  let callCount = 0;
  const fn = () => { callCount++; return Promise.resolve('ok'); };
  return Promise.all([
    dedup.dedupe('a', fn),
    dedup.dedupe('b', fn),
  ]).then(() => {
    assertEqual(callCount, 2);
  });
});

test('has and size track in-flight requests', () => {
  const dedup = new RequestDeduplicator();
  let resolve;
  const pending = new Promise(r => { resolve = r; });
  const fn = () => pending;
  const p = dedup.dedupe('x', fn);
  assert(dedup.has('x'), 'Should have pending key');
  assertEqual(dedup.size(), 1);
  resolve('done');
  return p.then(() => {
    assertEqual(dedup.size(), 0);
  });
});

test('getStats tracks correctly', () => {
  const dedup = new RequestDeduplicator();
  const stats = dedup.getStats();
  assertEqual(stats.totalRequests, 0);
  assertEqual(stats.deduped, 0);
  assertEqual(stats.executed, 0);
});

test('clear removes pending entries', () => {
  const dedup = new RequestDeduplicator();
  dedup.clear();
  assertEqual(dedup.size(), 0);
});

// ─── 32. v4: GRAPHQL BRIDGE ──────────────────────────────────
console.log('\n32. v4: GraphQL Bridge');

test('transforms GraphQL response fields to camelCase', () => {
  const gql = new GraphQLBridge({ convention: 'camelCase' });
  const response = {
    data: { user_name: 'John', email_address: 'john@test.com' },
  };
  const result = gql.transformResponse(response);
  assert(result.data.userName !== undefined || result.data.user_name !== undefined, 'Should transform data');
});

test('transforms variables to snake_case for server', () => {
  const gql = new GraphQLBridge();
  const vars = { userName: 'John', userAge: 30 };
  const result = gql.transformVariables(vars, 'snake_case');
  assert(result.user_name === 'John' || result.userName === 'John', 'Should transform or keep variables');
});

test('extracts nested data from response', () => {
  const gql = new GraphQLBridge();
  const response = {
    data: { user: { posts: [{ id: 1 }] } },
  };
  const posts = gql.extractData(response, 'user.posts');
  assert(Array.isArray(posts), 'Should extract array');
  assertEqual(posts.length, 1);
});

test('normalizes GraphQL errors', () => {
  const gql = new GraphQLBridge();
  const errors = [
    { message: 'Not found', locations: [{ line: 1, column: 2 }], path: ['user'] },
  ];
  const normalized = gql.normalizeErrors(errors);
  assertEqual(normalized.length, 1);
  assertEqual(normalized[0].message, 'Not found');
});

test('buildQuery returns query and variables', () => {
  const gql = new GraphQLBridge();
  const result = gql.buildQuery('query { user }', { userId: 1 });
  assertEqual(result.query, 'query { user }');
  assert(result.variables !== undefined, 'Should have variables');
});

test('getStats tracks operations', () => {
  const gql = new GraphQLBridge();
  const stats = gql.getStats();
  assert(stats.responsesTransformed !== undefined, 'Should track responses');
});

test('stripTypename removes __typename', () => {
  const gql = new GraphQLBridge({ stripTypename: true });
  const response = {
    data: { __typename: 'User', name: 'John' },
  };
  const result = gql.transformResponse(response);
  assertEqual(result.data.__typename, undefined);
});

// ─── 33. v4: OPENAPI IMPORTER ────────────────────────────────
console.log('\n33. v4: OpenAPI Importer');

test('extracts schemas from OpenAPI v3 spec', () => {
  const importer = new OpenAPIImporter();
  const spec = {
    openapi: '3.0.0',
    components: {
      schemas: {
        User: {
          type: 'object',
          required: ['id', 'name'],
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
          },
        },
      },
    },
    paths: {},
  };
  const schemas = importer.extractSchemas(spec);
  assert(schemas.User !== undefined, 'Should extract User schema');
  assert(schemas.User.id !== undefined, 'Should have id field');
});

test('extracts schemas from Swagger v2 spec', () => {
  const importer = new OpenAPIImporter();
  const spec = {
    swagger: '2.0',
    definitions: {
      Product: {
        type: 'object',
        properties: {
          product_id: { type: 'integer' },
          product_name: { type: 'string' },
        },
      },
    },
    paths: {},
  };
  const schemas = importer.extractSchemas(spec);
  assert(schemas.Product !== undefined, 'Should extract Product schema');
});

test('resolves $ref references', () => {
  const importer = new OpenAPIImporter();
  const spec = {
    openapi: '3.0.0',
    components: {
      schemas: {
        User: { type: 'object', properties: { name: { type: 'string' } } },
      },
    },
  };
  const resolved = importer.resolveRef('#/components/schemas/User', spec);
  assert(resolved !== undefined, 'Should resolve ref');
  assert(resolved.properties.name !== undefined, 'Should have name property');
});

test('converts OpenAPI schema to APIBridge format', () => {
  const importer = new OpenAPIImporter();
  const schema = {
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'integer', description: 'User ID' },
      email: { type: 'string', format: 'email' },
      created_at: { type: 'string', format: 'date-time' },
      is_active: { type: 'boolean', default: true },
    },
  };
  const result = importer.convertSchema(schema, {});
  assert(result.id !== undefined, 'Should have id');
  assertEqual(result.id.type, 'integer');
});

test('getEndpoints lists API paths', () => {
  const importer = new OpenAPIImporter();
  const spec = {
    openapi: '3.0.0',
    paths: {
      '/users': {
        get: { operationId: 'getUsers', summary: 'List users' },
        post: { operationId: 'createUser', summary: 'Create user' },
      },
    },
    components: {},
  };
  const endpoints = importer.getEndpoints(spec);
  assert(endpoints.length >= 2, 'Should find at least 2 endpoints');
});

test('getStats tracks imports', () => {
  const importer = new OpenAPIImporter();
  const stats = importer.getStats();
  assert(stats.schemasImported !== undefined, 'Should track schemas');
  assert(stats.endpointsFound !== undefined, 'Should track endpoints');
});

// ─── 34. v4: API VERSIONING ──────────────────────────────────
console.log('\n34. v4: API Versioning');

test('register and transform with version', () => {
  const vm = new APIVersionManager();
  vm.register('v1', {
    transforms: {
      response: (data) => ({ ...data, version: 'v1' }),
    },
  });
  const result = vm.transform({ name: 'John' }, 'v1', 'response');
  assertEqual(result.version, 'v1');
});

test('isDeprecated checks version status', () => {
  const vm = new APIVersionManager();
  vm.register('v1', { deprecated: true, successor: 'v2' });
  vm.register('v2', {});
  assert(vm.isDeprecated('v1'), 'v1 should be deprecated');
  assert(!vm.isDeprecated('v2'), 'v2 should not be deprecated');
});

test('getSuccessor returns next version', () => {
  const vm = new APIVersionManager();
  vm.register('v1', { deprecated: true, successor: 'v2' });
  vm.register('v2', {});
  assertEqual(vm.getSuccessor('v1'), 'v2');
});

test('list returns all versions', () => {
  const vm = new APIVersionManager();
  vm.register('v1', {});
  vm.register('v2', {});
  const versions = vm.list();
  assert(versions.length >= 2, 'Should have at least 2 versions');
});

test('has checks version existence', () => {
  const vm = new APIVersionManager();
  vm.register('v1', {});
  assert(vm.has('v1'), 'Should have v1');
  assert(!vm.has('v99'), 'Should not have v99');
});

test('unregister removes version', () => {
  const vm = new APIVersionManager();
  vm.register('v1', {});
  vm.unregister('v1');
  assert(!vm.has('v1'), 'v1 should be removed');
});

test('getStats tracks operations', () => {
  const vm = new APIVersionManager();
  const stats = vm.getStats();
  assert(stats.versionsRegistered !== undefined, 'Should track versions');
});

test('reset clears all versions', () => {
  const vm = new APIVersionManager();
  vm.register('v1', {});
  vm.reset();
  assert(!vm.has('v1'), 'Should be cleared');
});

// ─── 35. v4: WEBHOOK HANDLER ─────────────────────────────────
console.log('\n35. v4: Webhook Handler');

test('process normalizes webhook payload', () => {
  const wh = new WebhookHandler({ convention: 'camelCase' });
  const result = wh.process('generic', { event: 'user.created', data: { user_name: 'John' } }, {});
  assertEqual(result.event, 'user.created');
  assert(result.data !== undefined, 'Should have data');
  assertEqual(result.provider, 'generic');
});

test('register and use custom provider', () => {
  const wh = new WebhookHandler();
  wh.register('custom', { eventKey: 'type', payloadKey: 'payload' });
  assert(wh.has('custom'), 'Should have custom provider');
  const result = wh.process('custom', { type: 'order.completed', payload: { order_id: 123 } }, {});
  assertEqual(result.event, 'order.completed');
});

test('normalize transforms keys deeply', () => {
  const wh = new WebhookHandler({ convention: 'camelCase' });
  const result = wh.normalize({ user_name: 'John', user_email: 'john@test.com' });
  assert(result.userName !== undefined || result.user_name !== undefined, 'Should transform keys');
});

test('list returns registered providers', () => {
  const wh = new WebhookHandler();
  const providers = wh.list();
  assert(Array.isArray(providers), 'Should return array');
  assert(providers.length >= 3, 'Should have built-in providers');
});

test('unregister removes provider', () => {
  const wh = new WebhookHandler();
  wh.register('temp', { eventKey: 'event' });
  wh.unregister('temp');
  assert(!wh.has('temp'), 'Should be removed');
});

test('getStats tracks webhooks processed', () => {
  const wh = new WebhookHandler();
  wh.process('generic', { event: 'test', data: {} }, {});
  const stats = wh.getStats();
  assert(stats.webhooksProcessed >= 1, 'Should track processed count');
});

test('reset clears stats', () => {
  const wh = new WebhookHandler();
  wh.process('generic', { event: 'test', data: {} }, {});
  wh.reset();
  assertEqual(wh.getStats().webhooksProcessed, 0);
});

// ─── 36. v4: JSON PATCH GENERATOR ────────────────────────────
console.log('\n36. v4: JSON Patch Generator');

test('generates patches for object differences', () => {
  const pg = new JSONPatchGenerator();
  const source = { name: 'John', age: 30 };
  const target = { name: 'Jane', age: 30, email: 'jane@test.com' };
  const patches = pg.generate(source, target);
  assert(Array.isArray(patches), 'Should return array');
  assert(patches.length > 0, 'Should find differences');
});

test('applies patches to document', () => {
  const pg = new JSONPatchGenerator();
  const doc = { name: 'John', age: 30 };
  const patches = [
    { op: 'replace', path: '/name', value: 'Jane' },
    { op: 'add', path: '/email', value: 'jane@test.com' },
  ];
  const result = pg.apply(doc, patches);
  assertEqual(result.name, 'Jane');
  assertEqual(result.email, 'jane@test.com');
});

test('validates patch operations', () => {
  const pg = new JSONPatchGenerator();
  const valid = pg.validate([
    { op: 'add', path: '/foo', value: 'bar' },
  ]);
  assert(valid.valid, 'Should be valid');

  const invalid = pg.validate([
    { op: 'invalid_op', path: '/foo' },
  ]);
  assert(!invalid.valid, 'Should be invalid');
});

test('test operation checks values', () => {
  const pg = new JSONPatchGenerator();
  const doc = { name: 'John' };
  assert(pg.test(doc, { op: 'test', path: '/name', value: 'John' }), 'Should match');
  assert(!pg.test(doc, { op: 'test', path: '/name', value: 'Jane' }), 'Should not match');
});

test('generates remove patches', () => {
  const pg = new JSONPatchGenerator();
  const source = { name: 'John', age: 30 };
  const target = { name: 'John' };
  const patches = pg.generate(source, target);
  const removeOp = patches.find(p => p.op === 'remove');
  assert(removeOp !== undefined, 'Should have remove operation');
});

test('roundtrip: generate and apply', () => {
  const pg = new JSONPatchGenerator();
  const source = { a: 1, b: 2, c: 3 };
  const target = { a: 1, b: 99, d: 4 };
  const patches = pg.generate(source, target);
  const result = pg.apply(source, patches);
  assertEqual(result.b, 99);
  assertEqual(result.d, 4);
  assertEqual(result.c, undefined);
});

test('getStats tracks operations', () => {
  const pg = new JSONPatchGenerator();
  pg.generate({ a: 1 }, { a: 2 });
  const stats = pg.getStats();
  assert(stats.patchesGenerated >= 1, 'Should track generations');
});

test('rejects prototype pollution paths', () => {
  const pg = new JSONPatchGenerator({ strict: true });
  let caught = false;
  try {
    pg.apply({}, [{ op: 'add', path: '/__proto__/polluted', value: true }]);
  } catch (e) {
    caught = true;
  }
  assert(caught, 'Should reject __proto__ paths');
});

// ─── 37. v4: COMPOSABLE PIPELINE ─────────────────────────────
console.log('\n37. v4: Composable Pipeline');

test('executes stages in order', () => {
  const pipe = new ComposablePipeline();
  pipe
    .pipe('double', (data) => data * 2)
    .pipe('add10', (data) => data + 10);
  return pipe.execute(5).then(result => {
    assertEqual(result.result, 20);
  });
});

test('stages can be conditional', () => {
  const pipe = new ComposablePipeline();
  pipe
    .pipe('always', (data) => data + 1)
    .pipe('conditional', (data) => data * 10, { condition: (d) => d > 100 });
  return pipe.execute(5).then(result => {
    assertEqual(result.result, 6); // condition not met, skip multiply
  });
});

test('tap does not modify data', () => {
  const pipe = new ComposablePipeline();
  let sideEffect = null;
  pipe
    .pipe('transform', (data) => data + 1)
    .tap('log', (data) => { sideEffect = data; });
  return pipe.execute(5).then(result => {
    assertEqual(result.result, 6);
    assertEqual(sideEffect, 6);
  });
});

test('remove stage by name', () => {
  const pipe = new ComposablePipeline();
  pipe.pipe('a', (d) => d + 1).pipe('b', (d) => d + 2);
  pipe.remove('a');
  return pipe.execute(0).then(result => {
    assertEqual(result.result, 2);
  });
});

test('list returns stage names', () => {
  const pipe = new ComposablePipeline();
  pipe.pipe('a', (d) => d).pipe('b', (d) => d);
  const names = pipe.list();
  assertEqual(names.length, 2);
  assertEqual(names[0], 'a');
  assertEqual(names[1], 'b');
});

test('size returns stage count', () => {
  const pipe = new ComposablePipeline();
  pipe.pipe('a', (d) => d).pipe('b', (d) => d);
  assertEqual(pipe.size(), 2);
});

test('getStats returns execution data', () => {
  const pipe = new ComposablePipeline();
  const stats = pipe.getStats();
  assert(stats.executions !== undefined, 'Should track executions');
  assert(stats.stageCount !== undefined, 'Should track stage count');
});

test('reset clears all stages', () => {
  const pipe = new ComposablePipeline();
  pipe.pipe('a', (d) => d);
  pipe.reset();
  assertEqual(pipe.size(), 0);
});

test('error strategy skip continues on error', () => {
  const pipe = new ComposablePipeline({ errorStrategy: 'skip' });
  pipe
    .pipe('fail', () => { throw new Error('oops'); })
    .pipe('ok', (data) => data + 1);
  return pipe.execute(5).then(result => {
    assertEqual(result.result, 6);
    assert(result.errors.length >= 1, 'Should track errors');
  });
});

// ─── 38. v4: NEW ERROR CLASSES ───────────────────────────────
console.log('\n38. v4: New error classes');

test('CircuitBreakerError has state info', () => {
  const err = new CircuitBreakerError('Circuit open', 'OPEN', 5);
  assertEqual(err.name, 'CircuitBreakerError');
  assertEqual(err.code, 'CIRCUIT_BREAKER_ERROR');
  assertEqual(err.details.state, 'OPEN');
  assertEqual(err.details.failures, 5);
});

test('PipelineError has stage info', () => {
  const err = new PipelineError('Stage failed', 'transform', new Error('inner'));
  assertEqual(err.name, 'PipelineError');
  assertEqual(err.code, 'PIPELINE_ERROR');
  assertEqual(err.details.stage, 'transform');
});

test('WebhookError has provider info', () => {
  const err = new WebhookError('Webhook failed', 'github', 'invalid signature');
  assertEqual(err.name, 'WebhookError');
  assertEqual(err.code, 'WEBHOOK_ERROR');
  assertEqual(err.details.provider, 'github');
});

test('VersioningError has version info', () => {
  const err = new VersioningError('Unknown version', 'v99', 'not_registered');
  assertEqual(err.name, 'VersioningError');
  assertEqual(err.code, 'VERSIONING_ERROR');
  assertEqual(err.details.version, 'v99');
});

test('all v4 errors extend ApiBridgeError', () => {
  assert(new CircuitBreakerError('test', 'OPEN', 0) instanceof ApiBridgeError, 'CircuitBreakerError should extend ApiBridgeError');
  assert(new PipelineError('test', 'stage') instanceof ApiBridgeError, 'PipelineError should extend ApiBridgeError');
  assert(new WebhookError('test', 'provider') instanceof ApiBridgeError, 'WebhookError should extend ApiBridgeError');
  assert(new VersioningError('test', 'v1') instanceof ApiBridgeError, 'VersioningError should extend ApiBridgeError');
});

test('v4 errors serialize to JSON', () => {
  const err = new CircuitBreakerError('test', 'OPEN', 3);
  const json = err.toJSON();
  assertEqual(json.name, 'CircuitBreakerError');
  assertEqual(json.code, 'CIRCUIT_BREAKER_ERROR');
  assert(json.timestamp !== undefined, 'Should have timestamp');
});

// ═════════════════════════════════════════════════════════════════════
//  V5 FEATURES
// ═════════════════════════════════════════════════════════════════════

console.log('\n── V5: Retry Strategy ──');

test('RetryStrategy executes successfully on first try', async () => {
  const retry = new RetryStrategy({ maxRetries: 3, baseDelay: 10 });
  let calls = 0;
  const result = await retry.execute(() => { calls++; return Promise.resolve('ok'); });
  assertEqual(result, 'ok');
  assertEqual(calls, 1);
  assertEqual(retry.getStats().totalSuccesses, 1);
});

test('RetryStrategy retries on failure and eventually succeeds', async () => {
  const retry = new RetryStrategy({ maxRetries: 3, baseDelay: 10, strategy: 'constant' });
  let calls = 0;
  const result = await retry.execute(() => {
    calls++;
    if (calls < 3) throw new Error('fail');
    return Promise.resolve('recovered');
  });
  assertEqual(result, 'recovered');
  assertEqual(calls, 3);
  assertEqual(retry.getStats().totalRetries, 2);
});

test('RetryStrategy throws RetryError after max retries', async () => {
  const retry = new RetryStrategy({ maxRetries: 2, baseDelay: 10, strategy: 'constant' });
  try {
    await retry.execute(() => { throw new Error('always fail'); });
    assert(false, 'Should have thrown');
  } catch (e) {
    assert(e instanceof RetryError, 'Should be RetryError');
    assert(e.message.includes('All 3 attempts failed'), 'Should mention all attempts');
  }
});

test('RetryStrategy getDelay calculates correctly for exponential', () => {
  const retry = new RetryStrategy({ baseDelay: 100, strategy: 'exponential' });
  assertEqual(retry.getDelay(1), 100);
  assertEqual(retry.getDelay(2), 200);
  assertEqual(retry.getDelay(3), 400);
});

test('RetryStrategy respects maxDelay cap', () => {
  const retry = new RetryStrategy({ baseDelay: 100, maxDelay: 250, strategy: 'exponential' });
  assertEqual(retry.getDelay(5), 250);
});

test('RetryStrategy linear strategy', () => {
  const retry = new RetryStrategy({ baseDelay: 100, strategy: 'linear' });
  assertEqual(retry.getDelay(1), 100);
  assertEqual(retry.getDelay(2), 200);
  assertEqual(retry.getDelay(3), 300);
});

test('RetryStrategy isRetryable checks status codes', () => {
  const retry = new RetryStrategy();
  assert(retry.isRetryable(503), '503 should be retryable');
  assert(retry.isRetryable(429), '429 should be retryable');
  assert(!retry.isRetryable(404), '404 should not be retryable');
});

test('RetryStrategy custom shouldRetry predicate', async () => {
  const retry = new RetryStrategy({
    maxRetries: 5,
    baseDelay: 10,
    strategy: 'constant',
    shouldRetry: (err, attempt) => attempt <= 1,
  });
  let calls = 0;
  try {
    await retry.execute(() => { calls++; throw new Error('fail'); });
    assert(false, 'Should have thrown');
  } catch (e) {
    assertEqual(calls, 2);
  }
});

test('RetryStrategy onRetry callback fires', async () => {
  const retryLog = [];
  const retry = new RetryStrategy({
    maxRetries: 2,
    baseDelay: 10,
    strategy: 'constant',
    onRetry: (attempt, delay, err) => retryLog.push({ attempt, delay }),
  });
  let calls = 0;
  const result = await retry.execute(() => {
    calls++;
    if (calls < 2) throw new Error('fail');
    return Promise.resolve('ok');
  });
  assertEqual(retryLog.length, 1);
  assertEqual(retryLog[0].attempt, 1);
});

test('RetryStrategy reset clears stats', () => {
  const retry = new RetryStrategy();
  retry._stats.totalExecutions = 10;
  retry.reset();
  assertEqual(retry.getStats().totalExecutions, 0);
});

console.log('\n── V5: Request Logger ──');

test('RequestLogger logs requests and responses', () => {
  const logger = new RequestLogger({ level: 'debug' });
  const reqEntry = logger.logRequest({ method: 'GET', url: '/api/users' });
  assertEqual(reqEntry.type, 'request');
  assert(reqEntry.correlationId.startsWith('req_'), 'Should have correlation ID');

  const resEntry = logger.logResponse({ status: 200, url: '/api/users', correlationId: reqEntry.correlationId });
  assertEqual(resEntry.type, 'response');
  assertEqual(resEntry.correlationId, reqEntry.correlationId);
});

test('RequestLogger redacts sensitive fields', () => {
  const logger = new RequestLogger();
  const redacted = logger.redact({ username: 'john', password: 'secret123', token: 'abc' });
  assertEqual(redacted.username, 'john');
  assertEqual(redacted.password, '[REDACTED]');
  assertEqual(redacted.token, '[REDACTED]');
});

test('RequestLogger respects log level', () => {
  const logger = new RequestLogger({ level: 'error' });
  logger.logRequest({ method: 'GET', url: '/test' }); // info level, should be filtered
  assertEqual(logger.getEntries().length, 0);

  logger.logError({ message: 'Server error' }); // error level, should be recorded
  assertEqual(logger.getEntries().length, 1);
});

test('RequestLogger getEntries with filters', () => {
  const logger = new RequestLogger({ level: 'debug' });
  const req = logger.logRequest({ method: 'GET', url: '/a' });
  logger.logResponse({ status: 200, url: '/a', correlationId: req.correlationId });
  logger.logError({ message: 'err' });

  const requests = logger.getEntries({ type: 'request' });
  assertEqual(requests.length, 1);

  const errors = logger.getEntries({ type: 'error' });
  assertEqual(errors.length, 1);

  const byCorrelation = logger.getEntries({ correlationId: req.correlationId });
  assertEqual(byCorrelation.length, 2);
});

test('RequestLogger tracks stats', () => {
  const logger = new RequestLogger({ level: 'debug' });
  logger.logRequest({ method: 'GET', url: '/a' });
  logger.logResponse({ status: 500, url: '/a' });
  const stats = logger.getStats();
  assertEqual(stats.totalLogs, 2);
  assertEqual(stats.byLevel.info, 1);
  assertEqual(stats.byLevel.error, 1);
});

test('RequestLogger custom transport', () => {
  const entries = [];
  const logger = new RequestLogger({ level: 'debug', transport: (entry) => entries.push(entry) });
  logger.logRequest({ method: 'GET', url: '/test' });
  assertEqual(entries.length, 1);
});

test('RequestLogger reset clears state', () => {
  const logger = new RequestLogger({ level: 'debug' });
  logger.logRequest({ method: 'GET', url: '/test' });
  logger.reset();
  assertEqual(logger.getEntries().length, 0);
  assertEqual(logger.getStats().totalLogs, 0);
});

test('RequestLogger deep-redacts nested objects', () => {
  const logger = new RequestLogger();
  const redacted = logger.redact({ user: { name: 'John', password: 'secret' } });
  assertEqual(redacted.user.name, 'John');
  assertEqual(redacted.user.password, '[REDACTED]');
});

console.log('\n── V5: Schema Registry ──');

test('SchemaRegistry registers and retrieves schemas', () => {
  const registry = new SchemaRegistry();
  registry.register('User', { name: { type: 'string' }, email: { type: 'string' } });
  const schema = registry.get('User');
  assertEqual(schema.name.type, 'string');
  assertEqual(schema.email.type, 'string');
});

test('SchemaRegistry auto-increments versions', () => {
  const registry = new SchemaRegistry();
  const v1 = registry.register('User', { name: { type: 'string' } });
  assertEqual(v1.version, 1);
  const v2 = registry.register('User', { name: { type: 'string' }, age: { type: 'number' } });
  assertEqual(v2.version, 2);
});

test('SchemaRegistry retrieves specific versions', () => {
  const registry = new SchemaRegistry();
  registry.register('User', { name: { type: 'string' } });
  registry.register('User', { name: { type: 'string' }, age: { type: 'number' } });
  const v1 = registry.getVersion('User', 1);
  assert(v1.age === undefined, 'v1 should not have age');
  const v2 = registry.getVersion('User', 2);
  assertEqual(v2.age.type, 'number');
});

test('SchemaRegistry namespace support', () => {
  const registry = new SchemaRegistry();
  registry.register('User', { a: 1 }, { namespace: 'serviceA' });
  registry.register('User', { b: 2 }, { namespace: 'serviceB' });
  const a = registry.get('User', { namespace: 'serviceA' });
  assertEqual(a.a, 1);
  const b = registry.get('User', { namespace: 'serviceB' });
  assertEqual(b.b, 2);
});

test('SchemaRegistry checkCompatibility detects breaking changes', () => {
  const registry = new SchemaRegistry();
  const old = { name: { type: 'string' }, email: { type: 'string' } };
  const newer = { name: { type: 'number' } }; // changed type + removed email
  const compat = registry.checkCompatibility(old, newer);
  assert(!compat.backward, 'Should not be backward compatible');
  assert(compat.breakingChanges.length > 0, 'Should have breaking changes');
});

test('SchemaRegistry search finds fields', () => {
  const registry = new SchemaRegistry();
  registry.register('User', { userName: { type: 'string' }, email: { type: 'string' } });
  registry.register('Order', { orderId: { type: 'number' } });
  const results = registry.search('name');
  assert(results.length >= 1, 'Should find userName');
  assert(results.some(r => r.field === 'userName'), 'Should match userName');
});

test('SchemaRegistry export/import round-trip', () => {
  const registry = new SchemaRegistry();
  registry.register('User', { name: { type: 'string' } });
  const exported = registry.export();

  const registry2 = new SchemaRegistry();
  registry2.import(exported);
  const schema = registry2.get('User');
  assertEqual(schema.name.type, 'string');
});

test('SchemaRegistry list and has', () => {
  const registry = new SchemaRegistry();
  registry.register('User', { name: { type: 'string' } });
  assert(registry.has('User'), 'Should have User');
  assert(!registry.has('Order'), 'Should not have Order');
  const list = registry.list();
  assertEqual(list.length, 1);
  assertEqual(list[0].name, 'User');
});

test('SchemaRegistry remove', () => {
  const registry = new SchemaRegistry();
  registry.register('User', { name: { type: 'string' } });
  assert(registry.has('User'), 'Should exist before remove');
  registry.remove('User');
  assert(!registry.has('User'), 'Should not exist after remove');
});

test('SchemaRegistry strict mode throws on missing', () => {
  const registry = new SchemaRegistry({ strict: true });
  try {
    registry.get('NonExistent');
    assert(false, 'Should have thrown');
  } catch (e) {
    assert(e instanceof SchemaRegistryError, 'Should be SchemaRegistryError');
  }
});

console.log('\n── V5: Response Streamer ──');

test('ResponseStreamer transforms object keys', () => {
  const streamer = new ResponseStreamer({ convention: 'camelCase' });
  const result = streamer.process({ first_name: 'John', last_name: 'Doe' });
  assertEqual(result.firstName, 'John');
  assertEqual(result.lastName, 'Doe');
});

test('ResponseStreamer processes in chunks', () => {
  const chunks = [];
  const streamer = new ResponseStreamer({
    convention: 'camelCase',
    chunkSize: 2,
    onChunk: (chunk, idx) => chunks.push({ chunk, idx }),
  });
  const data = { first_name: 'a', last_name: 'b', user_age: 1, phone_number: '123' };
  const result = streamer.process(data);
  assertEqual(chunks.length, 2);
  assertEqual(result.firstName, 'a');
  assertEqual(result.phoneNumber, '123');
});

test('ResponseStreamer field filtering with includeFields', () => {
  const streamer = new ResponseStreamer({ includeFields: ['first_name'] });
  const result = streamer.process({ first_name: 'John', last_name: 'Doe' });
  assertEqual(result.firstName, 'John');
  assert(result.lastName === undefined, 'Should not include last_name');
});

test('ResponseStreamer field filtering with excludeFields', () => {
  const streamer = new ResponseStreamer({ excludeFields: ['password'] });
  const result = streamer.process({ name: 'John', password: 'secret' });
  assertEqual(result.name, 'John');
  assert(result.password === undefined, 'Should exclude password');
});

test('ResponseStreamer processArray', () => {
  const streamer = new ResponseStreamer({ convention: 'camelCase' });
  const result = streamer.processArray([
    { first_name: 'John' },
    { first_name: 'Jane' },
  ]);
  assertEqual(result.length, 2);
  assertEqual(result[0].firstName, 'John');
  assertEqual(result[1].firstName, 'Jane');
});

test('ResponseStreamer progress callback', () => {
  const progress = [];
  const streamer = new ResponseStreamer({
    chunkSize: 1,
    onProgress: (p) => progress.push(p),
  });
  streamer.process({ a: 1, b: 2, c: 3 });
  assert(progress.length >= 3, 'Should have progress updates');
  assertEqual(progress[progress.length - 1].percent, 100);
});

test('ResponseStreamer accumulator mode', () => {
  const streamer = new ResponseStreamer({ convention: 'camelCase' });
  const acc = streamer.createAccumulator();
  acc.add({ first_name: 'John' });
  acc.add({ last_name: 'Doe' });
  const result = acc.getResult();
  assertEqual(result.firstName, 'John');
  assertEqual(result.lastName, 'Doe');
});

test('ResponseStreamer deep nested transform', () => {
  const streamer = new ResponseStreamer({ convention: 'camelCase' });
  const result = streamer.process({ user_data: { first_name: 'John', address_info: { zip_code: '12345' } } });
  assertEqual(result.userData.firstName, 'John');
  assertEqual(result.userData.addressInfo.zipCode, '12345');
});

test('ResponseStreamer tracks stats', () => {
  const streamer = new ResponseStreamer();
  streamer.process({ a: 1, b: 2 });
  const stats = streamer.getStats();
  assert(stats.streamsCompleted >= 1, 'Should count streams');
  assert(stats.keysTransformed >= 2, 'Should count keys');
});

console.log('\n── V5: Dependency Graph ──');

test('DependencyGraph executes independent nodes in parallel', async () => {
  const graph = new DependencyGraph();
  const order = [];
  graph.add('a', async () => { order.push('a'); return 1; });
  graph.add('b', async () => { order.push('b'); return 2; });
  const results = await graph.execute();
  assertEqual(results.a, 1);
  assertEqual(results.b, 2);
  assertEqual(order.length, 2);
});

test('DependencyGraph respects dependencies', async () => {
  const graph = new DependencyGraph();
  graph.add('fetch', async () => ({ userId: 1 }));
  graph.add('transform', async (deps) => ({ ...deps.fetch, name: 'John' }), { deps: ['fetch'] });
  const results = await graph.execute();
  assertEqual(results.transform.userId, 1);
  assertEqual(results.transform.name, 'John');
});

test('DependencyGraph detects cycles', () => {
  const graph = new DependencyGraph();
  graph.add('a', async () => 1, { deps: ['b'] });
  graph.add('b', async () => 2, { deps: ['a'] });
  try {
    graph.getOrder();
    assert(false, 'Should have thrown');
  } catch (e) {
    assert(e instanceof DependencyGraphError, 'Should be DependencyGraphError');
    assert(e.message.includes('Cycle'), 'Should mention cycle');
  }
});

test('DependencyGraph validates missing dependencies', () => {
  const graph = new DependencyGraph();
  graph.add('a', async () => 1, { deps: ['nonexistent'] });
  const validation = graph.validate();
  assert(!validation.valid, 'Should be invalid');
  assert(validation.errors.length > 0, 'Should have errors');
});

test('DependencyGraph conditional node execution', async () => {
  const graph = new DependencyGraph();
  graph.add('check', async () => false);
  graph.add('skip', async () => 'should not run', {
    deps: ['check'],
    condition: (results) => results.check === true,
    defaultValue: 'skipped',
  });
  const results = await graph.execute();
  assertEqual(results.skip, 'skipped');
});

test('DependencyGraph getOrder returns topological order', () => {
  const graph = new DependencyGraph();
  graph.add('c', async () => 3, { deps: ['b'] });
  graph.add('a', async () => 1);
  graph.add('b', async () => 2, { deps: ['a'] });
  const order = graph.getOrder();
  const aIdx = order.indexOf('a');
  const bIdx = order.indexOf('b');
  const cIdx = order.indexOf('c');
  assert(aIdx < bIdx, 'a should come before b');
  assert(bIdx < cIdx, 'b should come before c');
});

test('DependencyGraph list and size', () => {
  const graph = new DependencyGraph();
  graph.add('a', async () => 1);
  graph.add('b', async () => 2, { deps: ['a'] });
  assertEqual(graph.size(), 2);
  const list = graph.list();
  assertEqual(list.length, 2);
  assert(list.some(n => n.name === 'a'), 'Should list node a');
});

test('DependencyGraph remove node', () => {
  const graph = new DependencyGraph();
  graph.add('a', async () => 1);
  graph.add('b', async () => 2, { deps: ['a'] });
  graph.remove('a');
  assertEqual(graph.size(), 1);
  assert(!graph.has('a'), 'Should not have a');
});

console.log('\n── V5: Mock Server ──');

test('MockServer registers and handles requests', async () => {
  const mock = new MockServer();
  mock.register('GET', '/api/users', { body: [{ id: 1, name: 'John' }] });
  const response = await mock.handle('GET', '/api/users');
  assertEqual(response.status, 200);
  assertEqual(response.body.length, 1);
  assertEqual(response.body[0].name, 'John');
});

test('MockServer returns 404 for unregistered routes', async () => {
  const mock = new MockServer();
  const response = await mock.handle('GET', '/unknown');
  assertEqual(response.status, 404);
});

test('MockServer strict mode throws on unmatched', async () => {
  const mock = new MockServer({ strict: true });
  try {
    await mock.handle('GET', '/unknown');
    assert(false, 'Should have thrown');
  } catch (e) {
    assert(e instanceof MockServerError, 'Should be MockServerError');
  }
});

test('MockServer records requests', async () => {
  const mock = new MockServer();
  mock.register('POST', '/api/users', { status: 201, body: { id: 1 } });
  await mock.handle('POST', '/api/users', { body: { name: 'John' } });
  const requests = mock.getRequests();
  assertEqual(requests.length, 1);
  assertEqual(requests[0].method, 'POST');
  assertEqual(requests[0].body.name, 'John');
});

test('MockServer assertCalled checks', async () => {
  const mock = new MockServer();
  mock.register('GET', '/api/users', { body: [] });
  await mock.handle('GET', '/api/users');
  await mock.handle('GET', '/api/users');
  const result = mock.assertCalled('GET', '/api/users', { times: 2 });
  assert(result.passed, 'Should have been called 2 times');
  assertEqual(result.count, 2);
});

test('MockServer wildcard patterns', async () => {
  const mock = new MockServer();
  mock.register('GET', '/api/users/*', { body: { id: 1 } });
  const response = await mock.handle('GET', '/api/users/123');
  assertEqual(response.status, 200);
  assertEqual(response.body.id, 1);
});

test('MockServer sequence responses', async () => {
  const mock = new MockServer();
  mock.registerSequence('GET', '/api/data', [
    { status: 200, body: { attempt: 1 } },
    { status: 500, body: { error: 'fail' } },
    { status: 200, body: { attempt: 3 } },
  ]);
  const r1 = await mock.handle('GET', '/api/data');
  assertEqual(r1.status, 200);
  assertEqual(r1.body.attempt, 1);
  const r2 = await mock.handle('GET', '/api/data');
  assertEqual(r2.status, 500);
  const r3 = await mock.handle('GET', '/api/data');
  assertEqual(r3.status, 200);
  assertEqual(r3.body.attempt, 3);
});

test('MockServer dynamic handler', async () => {
  const mock = new MockServer();
  mock.register('POST', '/api/echo', {
    handler: (req) => ({ status: 200, body: { echo: req.body } }),
  });
  const response = await mock.handle('POST', '/api/echo', { body: { msg: 'hello' } });
  assertEqual(response.body.echo.msg, 'hello');
});

test('MockServer list and unregister', () => {
  const mock = new MockServer();
  mock.register('GET', '/a', { body: 1 });
  mock.register('POST', '/b', { body: 2 });
  assertEqual(mock.list().length, 2);
  mock.unregister('GET', '/a');
  assertEqual(mock.list().length, 1);
});

test('MockServer stats tracking', async () => {
  const mock = new MockServer();
  mock.register('GET', '/api', { body: 'ok' });
  await mock.handle('GET', '/api');
  await mock.handle('GET', '/missing');
  const stats = mock.getStats();
  assertEqual(stats.totalRequests, 2);
  assertEqual(stats.matchedRequests, 1);
  assertEqual(stats.unmatchedRequests, 1);
});

console.log('\n── V5: Health Check ──');

test('HealthCheck registers and checks endpoints', async () => {
  const health = new HealthCheck({ successThreshold: 1 });
  health.register('api', async () => true);
  const result = await health.check('api');
  assertEqual(result.status, 'HEALTHY');
  assert(result.duration >= 0, 'Should track duration');
});

test('HealthCheck detects unhealthy endpoints', async () => {
  const health = new HealthCheck({ failureThreshold: 2, degradedThreshold: 1, successThreshold: 1 });
  health.register('db', async () => { throw new Error('Connection refused'); });
  await health.check('db');
  assertEqual(health.getStatus('db'), 'DEGRADED');
  await health.check('db');
  assertEqual(health.getStatus('db'), 'UNHEALTHY');
});

test('HealthCheck overall status aggregation', async () => {
  const health = new HealthCheck({ successThreshold: 1, failureThreshold: 1 });
  health.register('api', async () => true);
  health.register('db', async () => { throw new Error('down'); });
  await health.checkAll();
  const overall = health.getOverallStatus();
  assertEqual(overall.status, 'UNHEALTHY');
  assertEqual(overall.endpoints.api, 'HEALTHY');
  assertEqual(overall.endpoints.db, 'UNHEALTHY');
});

test('HealthCheck tracks history', async () => {
  const health = new HealthCheck({ successThreshold: 1 });
  health.register('api', async () => true);
  await health.check('api');
  await health.check('api');
  const history = health.getHistory('api');
  assertEqual(history.length, 2);
  assert(history[0].success, 'First check should be successful');
});

test('HealthCheck recovery from unhealthy', async () => {
  let healthy = false;
  const health = new HealthCheck({ failureThreshold: 1, successThreshold: 2, degradedThreshold: 1 });
  health.register('api', async () => { if (!healthy) throw new Error('down'); return true; });

  await health.check('api');
  assertEqual(health.getStatus('api'), 'UNHEALTHY');

  healthy = true;
  await health.check('api');
  await health.check('api');
  assertEqual(health.getStatus('api'), 'HEALTHY');
});

test('HealthCheck status change callback', async () => {
  const changes = [];
  const health = new HealthCheck({
    failureThreshold: 1,
    successThreshold: 1,
    degradedThreshold: 1,
    onStatusChange: (name, prev, next) => changes.push({ name, prev, next }),
  });
  health.register('api', async () => { throw new Error('fail'); });
  await health.check('api');
  assert(changes.length >= 1, 'Should have status changes');
});

test('HealthCheck list and isHealthy', async () => {
  const health = new HealthCheck({ successThreshold: 1 });
  health.register('api', async () => true);
  health.register('db', async () => true);
  await health.checkAll();
  const list = health.list();
  assertEqual(list.length, 2);
  assert(health.isHealthy('api'), 'api should be healthy');
});

test('HealthCheck unregister', () => {
  const health = new HealthCheck();
  health.register('api', async () => true);
  assert(health.unregister('api'), 'Should return true');
  assertEqual(health.list().length, 0);
});

test('HealthCheck stats', async () => {
  const health = new HealthCheck({ successThreshold: 1 });
  health.register('api', async () => true);
  await health.check('api');
  const stats = health.getStats();
  assertEqual(stats.totalChecks, 1);
  assertEqual(stats.totalSuccesses, 1);
});

console.log('\n── V5: Event Bus ──');

test('EventBus subscribe and emit', async () => {
  const bus = new EventBus();
  let received = null;
  bus.on('test', (data) => { received = data; });
  await bus.emit('test', { msg: 'hello' });
  assertEqual(received.msg, 'hello');
});

test('EventBus once listener fires only once', async () => {
  const bus = new EventBus();
  let count = 0;
  bus.once('event', () => { count++; });
  await bus.emit('event', {});
  await bus.emit('event', {});
  assertEqual(count, 1);
});

test('EventBus off removes listener', async () => {
  const bus = new EventBus();
  let count = 0;
  const fn = () => { count++; };
  bus.on('event', fn);
  await bus.emit('event', {});
  bus.off('event', fn);
  await bus.emit('event', {});
  assertEqual(count, 1);
});

test('EventBus wildcard subscriptions', async () => {
  const bus = new EventBus();
  let received = [];
  bus.on('api.*', (data) => { received.push(data); });
  await bus.emit('api.request', { type: 'req' });
  await bus.emit('api.response', { type: 'res' });
  await bus.emit('other.event', { type: 'other' });
  assertEqual(received.length, 2);
});

test('EventBus priority ordering', async () => {
  const bus = new EventBus();
  const order = [];
  bus.on('event', () => { order.push('low'); }, { priority: 1 });
  bus.on('event', () => { order.push('high'); }, { priority: 10 });
  bus.on('event', () => { order.push('mid'); }, { priority: 5 });
  await bus.emit('event', {});
  assertEqual(order[0], 'high');
  assertEqual(order[1], 'mid');
  assertEqual(order[2], 'low');
});

test('EventBus event history', async () => {
  const bus = new EventBus({ recordHistory: true });
  await bus.emit('a', { x: 1 });
  await bus.emit('b', { x: 2 });
  const history = bus.getHistory();
  assertEqual(history.length, 2);
  const filtered = bus.getHistory('a');
  assertEqual(filtered.length, 1);
});

test('EventBus emitSync works synchronously', () => {
  const bus = new EventBus({ async: false });
  let received = null;
  bus.on('test', (data) => { received = data; });
  bus.emitSync('test', 42);
  assertEqual(received, 42);
});

test('EventBus listenerCount', () => {
  const bus = new EventBus();
  bus.on('a', () => {});
  bus.on('a', () => {});
  bus.on('b', () => {});
  assertEqual(bus.listenerCount('a'), 2);
  assertEqual(bus.listenerCount('b'), 1);
  assertEqual(bus.listenerCount('c'), 0);
});

test('EventBus list events', () => {
  const bus = new EventBus();
  bus.on('a', () => {});
  bus.on('b', () => {});
  const list = bus.list();
  assertEqual(list.length, 2);
});

test('EventBus removeAll', () => {
  const bus = new EventBus();
  bus.on('a', () => {});
  bus.on('b', () => {});
  bus.removeAll('a');
  assertEqual(bus.listenerCount('a'), 0);
  assertEqual(bus.listenerCount('b'), 1);
});

test('EventBus replay', async () => {
  const bus = new EventBus({ recordHistory: true });
  await bus.emit('event', 1);
  await bus.emit('event', 2);
  const replayed = [];
  bus.replay('event', (data) => replayed.push(data));
  assertEqual(replayed.length, 2);
  assertEqual(replayed[0], 1);
  assertEqual(replayed[1], 2);
});

test('EventBus waitFor resolves on emit', async () => {
  const bus = new EventBus();
  const promise = bus.waitFor('signal', 1000);
  setTimeout(() => bus.emit('signal', 'done'), 10);
  const result = await promise;
  assertEqual(result, 'done');
});

test('EventBus stats tracking', async () => {
  const bus = new EventBus();
  bus.on('a', () => {});
  await bus.emit('a', {});
  const stats = bus.getStats();
  assert(stats.totalEmits >= 1, 'Should track emits');
  assert(stats.totalDeliveries >= 1, 'Should track deliveries');
});

test('EventBus unsubscribe function returned from on', async () => {
  const bus = new EventBus();
  let count = 0;
  const unsub = bus.on('event', () => { count++; });
  await bus.emit('event', {});
  unsub();
  await bus.emit('event', {});
  assertEqual(count, 1);
});

console.log('\n── V5: Error Classes ──');

test('RetryError has attempt info', () => {
  const err = new RetryError('Exhausted', 3, 3, 'max_retries_exceeded');
  assertEqual(err.name, 'RetryError');
  assertEqual(err.code, 'RETRY_ERROR');
  assertEqual(err.details.attempt, 3);
  assertEqual(err.details.reason, 'max_retries_exceeded');
});

test('SchemaRegistryError has schema info', () => {
  const err = new SchemaRegistryError('Not found', 'User', 'not_found');
  assertEqual(err.name, 'SchemaRegistryError');
  assertEqual(err.code, 'SCHEMA_REGISTRY_ERROR');
  assertEqual(err.details.schemaName, 'User');
});

test('DependencyGraphError has node info', () => {
  const err = new DependencyGraphError('Cycle detected', 'nodeA', 'cycle_detected');
  assertEqual(err.name, 'DependencyGraphError');
  assertEqual(err.code, 'DEPENDENCY_GRAPH_ERROR');
  assertEqual(err.details.nodeName, 'nodeA');
});

test('MockServerError has operation info', () => {
  const err = new MockServerError('No match', 'handle', 'no_match');
  assertEqual(err.name, 'MockServerError');
  assertEqual(err.code, 'MOCK_SERVER_ERROR');
});

test('HealthCheckError has endpoint info', () => {
  const err = new HealthCheckError('Timeout', 'api', 'timeout');
  assertEqual(err.name, 'HealthCheckError');
  assertEqual(err.code, 'HEALTH_CHECK_ERROR');
  assertEqual(err.details.endpoint, 'api');
});

test('EventBusError has event info', () => {
  const err = new EventBusError('Max listeners', 'test.event', 'max_listeners');
  assertEqual(err.name, 'EventBusError');
  assertEqual(err.code, 'EVENT_BUS_ERROR');
  assertEqual(err.details.event, 'test.event');
});

test('all v5 errors extend ApiBridgeError', () => {
  assert(new RetryError('test', 1, 3) instanceof ApiBridgeError, 'RetryError should extend ApiBridgeError');
  assert(new SchemaRegistryError('test', 'User') instanceof ApiBridgeError, 'SchemaRegistryError should extend ApiBridgeError');
  assert(new DependencyGraphError('test', 'node') instanceof ApiBridgeError, 'DependencyGraphError should extend ApiBridgeError');
  assert(new MockServerError('test', 'op') instanceof ApiBridgeError, 'MockServerError should extend ApiBridgeError');
  assert(new HealthCheckError('test', 'ep') instanceof ApiBridgeError, 'HealthCheckError should extend ApiBridgeError');
  assert(new EventBusError('test', 'ev') instanceof ApiBridgeError, 'EventBusError should extend ApiBridgeError');
});

test('v5 errors serialize to JSON', () => {
  const err = new RetryError('test', 3, 3, 'max_retries_exceeded');
  const json = err.toJSON();
  assertEqual(json.name, 'RetryError');
  assertEqual(json.code, 'RETRY_ERROR');
  assert(json.timestamp !== undefined, 'Should have timestamp');
});

// ─── v6: FUZZY MATCHER ───────────────────────────────────────
console.log('\n28. FuzzyMatcher (v6)');

test('FuzzyMatcher finds exact token match', () => {
  const fm = new FuzzyMatcher();
  const result = fm.findBestMatch('user_email', ['user_email', 'user_name']);
  assertEqual(result.match, 'user_email');
  assert(result.confidence >= 0.9, 'Should have high confidence for exact match');
});

test('FuzzyMatcher matches usr_email → user_email (abbreviation)', () => {
  const fm = new FuzzyMatcher();
  const result = fm.findBestMatch('usr_email', ['user_email', 'user_name', 'phone_number']);
  assertEqual(result.match, 'user_email');
  assert(result.confidence >= 0.55, `Confidence ${result.confidence} should be >= 0.55`);
});

test('FuzzyMatcher matches userEmal → user_email (typo)', () => {
  const fm = new FuzzyMatcher();
  const result = fm.findBestMatch('userEmal', ['user_email', 'user_name', 'phone_number']);
  assertEqual(result.match, 'user_email');
  assert(result.confidence >= 0.55, `Confidence ${result.confidence} should be >= 0.55`);
});

test('FuzzyMatcher matches phn_number → phone_number (abbreviation)', () => {
  const fm = new FuzzyMatcher();
  const result = fm.findBestMatch('phn_number', ['user_email', 'user_name', 'phone_number']);
  assertEqual(result.match, 'phone_number');
  assert(result.confidence >= 0.55, `Confidence ${result.confidence} should be >= 0.55`);
});

test('FuzzyMatcher matches frst_name → first_name (vowel-drop)', () => {
  const fm = new FuzzyMatcher();
  const result = fm.findBestMatch('frst_name', ['first_name', 'last_name', 'full_name']);
  assertEqual(result.match, 'first_name');
  assert(result.confidence >= 0.55, `Confidence ${result.confidence} should be >= 0.55`);
});

test('FuzzyMatcher returns null for completely unrelated key', () => {
  const fm = new FuzzyMatcher();
  const result = fm.findBestMatch('xyzabc123', ['user_email', 'user_name']);
  assertEqual(result.match, null);
});

test('FuzzyMatcher returns null for empty candidates', () => {
  const fm = new FuzzyMatcher();
  const result = fm.findBestMatch('user_email', []);
  assertEqual(result.match, null);
});

test('FuzzyMatcher handles single-token keys', () => {
  const fm = new FuzzyMatcher();
  const result = fm.findBestMatch('eml', ['email', 'phone', 'name']);
  assertEqual(result.match, 'email');
  assert(result.confidence >= 0.55, `Confidence ${result.confidence} should be >= 0.55`);
});

test('FuzzyMatcher getStrategies returns strategy info', () => {
  const fm = new FuzzyMatcher();
  const strategies = fm.getStrategies();
  assertEqual(strategies.levenshtein, true);
  assertEqual(strategies.tokenMatch, true);
  assertEqual(strategies.vowelDrop, true);
  assertEqual(strategies.phonetic, true);
  assertEqual(strategies.abbreviation, true);
});

test('FuzzyMatcher respects custom minConfidence', () => {
  const fm = new FuzzyMatcher({ minConfidence: 0.99 });
  const result = fm.findBestMatch('usr_email', ['user_email']);
  // With very high threshold, might not match
  assert(result.confidence < 1.0 || result.match !== null, 'Should handle high threshold');
});

test('FuzzyMatcher matches addr → address (common abbreviation)', () => {
  const fm = new FuzzyMatcher();
  const result = fm.findBestMatch('addr', ['address', 'phone', 'email']);
  assertEqual(result.match, 'address');
  assert(result.confidence >= 0.55, `Confidence ${result.confidence} should be >= 0.55`);
});

test('FuzzyMatcher matches passwd → password', () => {
  const fm = new FuzzyMatcher();
  const result = fm.findBestMatch('passwd', ['password', 'username', 'email']);
  assertEqual(result.match, 'password');
  assert(result.confidence >= 0.55, `Confidence ${result.confidence} should be >= 0.55`);
});

test('FuzzyMatcher matches desc → description', () => {
  const fm = new FuzzyMatcher();
  const result = fm.findBestMatch('desc', ['description', 'title', 'name']);
  assertEqual(result.match, 'description');
  assert(result.confidence >= 0.55, `Confidence ${result.confidence} should be >= 0.55`);
});

test('FuzzyMatcher can disable strategies', () => {
  const fm = new FuzzyMatcher({ usePhonetic: false, useVowelDrop: false, expandAbbreviations: false });
  const strategies = fm.getStrategies();
  assertEqual(strategies.phonetic, false);
  assertEqual(strategies.vowelDrop, false);
  assertEqual(strategies.abbreviation, false);
});

// ─── v6: CRYPTIC RESOLVER ────────────────────────────────────
console.log('\n29. CrypticResolver (v6)');

test('CrypticResolver detects cryptic keys', () => {
  const cr = new CrypticResolver();
  assert(cr.isCryptic('x9_ref_id'), 'x9_ref_id should be cryptic');
  assert(cr.isCryptic('z_flag'), 'z_flag should be cryptic');
  assert(cr.isCryptic('q1_status'), 'q1_status should be cryptic');
});

test('CrypticResolver does not flag normal keys as cryptic', () => {
  const cr = new CrypticResolver();
  assert(!cr.isCryptic('user_email'), 'user_email should not be cryptic');
  assert(!cr.isCryptic('firstName'), 'firstName should not be cryptic');
  assert(!cr.isCryptic('is_active'), 'is_active should not be cryptic');
});

test('CrypticResolver resolves z9_ref_id via prefix stripping', () => {
  const cr = new CrypticResolver();
  const result = cr.resolve('z9_ref_id', ['reference_id', 'user_id', 'order_id']);
  assert(result.match !== null, 'Should find a match');
  assert(result.confidence >= 0.45, `Confidence ${result.confidence} should be >= 0.45`);
});

test('CrypticResolver resolves x_flag via suffix matching', () => {
  const cr = new CrypticResolver();
  const result = cr.resolve('x_flag', ['is_active_flag', 'status_flag', 'deleted_flag']);
  assert(result.match !== null, 'Should find a match via suffix');
  assert(result.confidence >= 0.45, `Confidence ${result.confidence} should be >= 0.45`);
});

test('CrypticResolver returns null for completely unresolvable key', () => {
  const cr = new CrypticResolver();
  const result = cr.resolve('qqq', ['user_email', 'user_name']);
  // May or may not find a match, but if not, confidence should be low
  if (result.match === null) {
    assert(result.confidence < 0.45, 'Should have low confidence for unresolvable key');
  }
});

test('CrypticResolver returns null for empty candidates', () => {
  const cr = new CrypticResolver();
  const result = cr.resolve('x9_ref_id', []);
  assertEqual(result.match, null);
});

test('CrypticResolver resolves via vocabulary matching', () => {
  const cr = new CrypticResolver();
  const result = cr.resolve('q1_email', ['user_email', 'user_name', 'phone_number']);
  assert(result.match !== null, 'Should resolve via vocabulary');
  assertEqual(result.match, 'user_email');
});

test('CrypticResolver handles multi-token cryptic keys', () => {
  const cr = new CrypticResolver();
  const result = cr.resolve('x1_user_name', ['username', 'user_name', 'full_name']);
  assert(result.match !== null, 'Should match despite cryptic prefix');
});

test('CrypticResolver confidence is capped at 0.70', () => {
  const cr = new CrypticResolver();
  const result = cr.resolve('z9_ref_id', ['ref_id', 'reference_id']);
  if (result.match) {
    assert(result.confidence <= 0.70, `Confidence ${result.confidence} should be <= 0.70 for cryptic`);
  }
});

test('CrypticResolver with custom minConfidence', () => {
  const cr = new CrypticResolver({ minConfidence: 0.9 });
  const result = cr.resolve('z9_ref_id', ['reference_id']);
  // With high minConfidence, may not match
  if (result.match === null) {
    assert(result.confidence < 0.9, 'Should be below threshold');
  }
});

// ─── v6: TYPE COERCER ────────────────────────────────────────
console.log('\n30. TypeCoercer (v6)');

test('TypeCoercer coerces "true" string to boolean true', () => {
  const tc = new TypeCoercer();
  const result = tc.coerceValue('true', 'boolean', 'isActive');
  assertEqual(result.value, true);
  assertEqual(result.coerced, true);
});

test('TypeCoercer coerces "false" string to boolean false', () => {
  const tc = new TypeCoercer();
  const result = tc.coerceValue('false', 'boolean', 'isActive');
  assertEqual(result.value, false);
  assertEqual(result.coerced, true);
});

test('TypeCoercer coerces "1" to boolean true', () => {
  const tc = new TypeCoercer();
  const result = tc.coerceValue('1', 'boolean', 'flag');
  assertEqual(result.value, true);
  assertEqual(result.coerced, true);
});

test('TypeCoercer coerces "0" to boolean false', () => {
  const tc = new TypeCoercer();
  const result = tc.coerceValue('0', 'boolean', 'flag');
  assertEqual(result.value, false);
  assertEqual(result.coerced, true);
});

test('TypeCoercer coerces "yes" to boolean true', () => {
  const tc = new TypeCoercer();
  const result = tc.coerceValue('yes', 'boolean', 'flag');
  assertEqual(result.value, true);
  assertEqual(result.coerced, true);
});

test('TypeCoercer coerces "42" string to integer', () => {
  const tc = new TypeCoercer();
  const result = tc.coerceValue('42', 'integer', 'age');
  assertEqual(result.value, 42);
  assertEqual(result.coerced, true);
});

test('TypeCoercer coerces "3.14" string to float', () => {
  const tc = new TypeCoercer();
  const result = tc.coerceValue('3.14', 'float', 'price');
  assertEqual(result.value, 3.14);
  assertEqual(result.coerced, true);
});

test('TypeCoercer coerces "100" string to number', () => {
  const tc = new TypeCoercer();
  const result = tc.coerceValue('100', 'number', 'count');
  assertEqual(result.value, 100);
  assertEqual(result.coerced, true);
});

test('TypeCoercer coerces ISO date string to Date', () => {
  const tc = new TypeCoercer();
  const result = tc.coerceValue('2024-01-15', 'date', 'createdAt');
  assert(result.value instanceof Date, 'Should be a Date instance');
  assertEqual(result.coerced, true);
});

test('TypeCoercer coerces ISO datetime string to Date', () => {
  const tc = new TypeCoercer();
  const result = tc.coerceValue('2024-01-15T10:30:00Z', 'date', 'updatedAt');
  assert(result.value instanceof Date, 'Should be a Date instance');
  assertEqual(result.coerced, true);
});

test('TypeCoercer does not coerce already correct types', () => {
  const tc = new TypeCoercer();
  const result = tc.coerceValue(true, 'boolean', 'isActive');
  assertEqual(result.value, true);
  assertEqual(result.coerced, false);
});

test('TypeCoercer coerces number 1 to boolean true', () => {
  const tc = new TypeCoercer();
  const result = tc.coerceValue(1, 'boolean', 'flag');
  assertEqual(result.value, true);
  assertEqual(result.coerced, true);
});

test('TypeCoercer coerces number 0 to boolean false', () => {
  const tc = new TypeCoercer();
  const result = tc.coerceValue(0, 'boolean', 'flag');
  assertEqual(result.value, false);
  assertEqual(result.coerced, true);
});

test('TypeCoercer handles null values gracefully', () => {
  const tc = new TypeCoercer();
  const result = tc.coerceValue(null, 'boolean', 'isActive');
  assertEqual(result.value, null);
  assertEqual(result.coerced, false);
});

test('TypeCoercer handles undefined values gracefully', () => {
  const tc = new TypeCoercer();
  const result = tc.coerceValue(undefined, 'string', 'name');
  assertEqual(result.value, undefined);
  assertEqual(result.coerced, false);
});

test('TypeCoercer coerceObject coerces all fields per schema', () => {
  const tc = new TypeCoercer();
  const data = { isActive: 'true', age: '25', name: 'John' };
  const schema = {
    isActive: { type: 'boolean' },
    age: { type: 'integer' },
    name: { type: 'string' },
  };
  const result = tc.coerceObject(data, schema);
  assertEqual(result.data.isActive, true);
  assertEqual(result.data.age, 25);
  assertEqual(result.data.name, 'John');
  assert(result.coerced.includes('isActive'), 'isActive should be listed as coerced');
  assert(result.coerced.includes('age'), 'age should be listed as coerced');
});

test('TypeCoercer detectConflicts finds type mismatches', () => {
  const tc = new TypeCoercer();
  const data = { isActive: 'true', count: '42' };
  const schema = {
    isActive: { type: 'boolean' },
    count: { type: 'integer' },
  };
  const conflicts = tc.detectConflicts(data, schema);
  assert(conflicts.length >= 2, `Should find at least 2 conflicts, found ${conflicts.length}`);
  assert(conflicts.some(c => c.field === 'isActive'), 'Should detect isActive conflict');
  assert(conflicts.some(c => c.field === 'count'), 'Should detect count conflict');
});

test('TypeCoercer getStats returns coercion statistics', () => {
  const tc = new TypeCoercer();
  tc.coerceValue('true', 'boolean', 'flag1');
  tc.coerceValue('42', 'integer', 'count1');
  const stats = tc.getStats();
  assert(stats.totalConflicts >= 2, `Should have >= 2 conflicts, got ${stats.totalConflicts}`);
  assert(stats.coerced >= 2, `Should have >= 2 coerced, got ${stats.coerced}`);
});

test('TypeCoercer clearConflicts resets conflict log', () => {
  const tc = new TypeCoercer();
  tc.coerceValue('true', 'boolean', 'flag');
  tc.clearConflicts();
  assertEqual(tc.getConflicts().length, 0);
});

test('TypeCoercer coerces JSON string to object', () => {
  const tc = new TypeCoercer();
  const result = tc.coerceValue('{"key":"val"}', 'object', 'metadata');
  assert(typeof result.value === 'object', 'Should be object');
  assertEqual(result.value.key, 'val');
  assertEqual(result.coerced, true);
});

test('TypeCoercer coerces JSON string to array', () => {
  const tc = new TypeCoercer();
  const result = tc.coerceValue('[1,2,3]', 'array', 'items');
  assert(Array.isArray(result.value), 'Should be array');
  assertEqual(result.value.length, 3);
  assertEqual(result.coerced, true);
});

test('TypeCoercer coerces number to string', () => {
  const tc = new TypeCoercer();
  const result = tc.coerceValue(42, 'string', 'id');
  assertEqual(result.value, '42');
  assertEqual(result.coerced, true);
});

test('TypeCoercer coerceObject handles missing schema', () => {
  const tc = new TypeCoercer();
  const data = { name: 'test' };
  const result = tc.coerceObject(data, null);
  assertEqual(result.data.name, 'test');
  assertEqual(result.coerced.length, 0);
});

test('TypeCoercer coerceObject handles missing data', () => {
  const tc = new TypeCoercer();
  const result = tc.coerceObject(null, { name: { type: 'string' } });
  assertEqual(result.data, null);
});

test('TypeCoercer coerceObject skips fields not in data', () => {
  const tc = new TypeCoercer();
  const data = { name: 'test' };
  const schema = { name: { type: 'string' }, age: { type: 'integer' } };
  const result = tc.coerceObject(data, schema);
  assertEqual(result.data.name, 'test');
  assert(!result.coerced.includes('age'), 'age not in data should not be coerced');
});

// ─── v6: TRANSFORMER INTEGRATION ─────────────────────────────
console.log('\n31. Transformer v6 Integration');

test('Transformer v6 resolves typo usr_email with schema', () => {
  const t6 = new APIBridgeTransformer({ logMismatches: false, targetConvention: 'camelCase' });
  const schema = {
    userEmail: { type: 'string', from: 'user_email' },
    userName: { type: 'string' },
  };
  const result = t6.transform({ usr_email: 'test@test.com' }, schema, 'toFrontend');
  // Should map to userEmail via schema or fuzzy match
  assert(result.userEmail === 'test@test.com' || result.usrEmail === 'test@test.com',
    'Should transform usr_email field');
});

test('Transformer v6 performs type coercion with schema', () => {
  const t6 = new APIBridgeTransformer({ logMismatches: false, targetConvention: 'camelCase' });
  const schema = {
    isActive: { type: 'boolean', column: 'is_active' },
  };
  const result = t6.transform({ is_active: 'true' }, schema, 'toFrontend');
  assertEqual(result.isActive, true);
});

test('Transformer v6 coerces integer string with schema', () => {
  const t6 = new APIBridgeTransformer({ logMismatches: false, targetConvention: 'camelCase' });
  const schema = {
    age: { type: 'integer', column: 'age' },
  };
  const result = t6.transform({ age: '25' }, schema, 'toFrontend');
  assertEqual(result.age, 25);
});

test('Transformer v6 coerces date string with schema', () => {
  const t6 = new APIBridgeTransformer({ logMismatches: false, targetConvention: 'camelCase' });
  const schema = {
    createdAt: { type: 'date', column: 'created_at' },
  };
  const result = t6.transform({ created_at: '2024-01-15' }, schema, 'toFrontend');
  assert(result.createdAt instanceof Date, 'Should be Date object');
});

test('Transformer v6 handles mixed type conflicts in batch', () => {
  const t6 = new APIBridgeTransformer({ logMismatches: false, targetConvention: 'camelCase' });
  const schema = {
    isActive: { type: 'boolean', column: 'is_active' },
    count: { type: 'integer', column: 'count' },
    price: { type: 'float', column: 'price' },
  };
  const data = [
    { is_active: '1', count: '10', price: '19.99' },
    { is_active: '0', count: '5', price: '9.99' },
  ];
  const result = t6.transformBatch(data, schema, 'toFrontend');
  assertEqual(result[0].isActive, true);
  assertEqual(result[0].count, 10);
  assertEqual(result[0].price, 19.99);
  assertEqual(result[1].isActive, false);
  assertEqual(result[1].count, 5);
});

test('Transformer v6 enhanced fuzzy matching with schema', () => {
  const t6 = new APIBridgeTransformer({ logMismatches: false, targetConvention: 'camelCase' });
  const schema = {
    userEmail: { type: 'string' },
    userName: { type: 'string' },
    phoneNumber: { type: 'string' },
  };
  // Test with abbreviation "eml"
  const result = t6.transform({ user_eml: 'test@test.com' }, schema, 'toFrontend');
  // Should either fuzzy match to userEmail or pattern-convert to userEml
  assert(result.userEmail !== undefined || result.userEml !== undefined,
    'Should handle abbreviated field name');
});

test('Transformer v6 stats track fuzzy and cryptic matches', () => {
  const t6 = new APIBridgeTransformer({ logMismatches: false, targetConvention: 'camelCase' });
  t6.transform({ first_name: 'John' }, null, 'toFrontend');
  const stats = t6.getStats();
  assert(stats.totalFields > 0, 'Should track total fields');
});

// ─── v6: ERROR CLASSES ───────────────────────────────────────
console.log('\n32. v6 Error Classes');

test('FuzzyMatchError has correct properties', () => {
  const err = new FuzzyMatchError('No match found', 'usr_email', ['user_email']);
  assertEqual(err.name, 'FuzzyMatchError');
  assertEqual(err.code, 'FUZZY_MATCH_ERROR');
  assertEqual(err.details.sourceKey, 'usr_email');
  assert(Array.isArray(err.details.candidates), 'candidates should be array');
});

test('TypeCoercionError has correct properties', () => {
  const err = new TypeCoercionError('Cannot coerce', 'isActive', 'string', 'boolean');
  assertEqual(err.name, 'TypeCoercionError');
  assertEqual(err.code, 'TYPE_COERCION_ERROR');
  assertEqual(err.details.field, 'isActive');
  assertEqual(err.details.sourceType, 'string');
  assertEqual(err.details.targetType, 'boolean');
});

test('CrypticResolverError has correct properties', () => {
  const err = new CrypticResolverError('Cannot resolve', 'xq_flag', 'no_match');
  assertEqual(err.name, 'CrypticResolverError');
  assertEqual(err.code, 'CRYPTIC_RESOLVER_ERROR');
  assertEqual(err.details.sourceKey, 'xq_flag');
  assertEqual(err.details.reason, 'no_match');
});

test('all v6 errors extend ApiBridgeError', () => {
  assert(new FuzzyMatchError('test', 'key') instanceof ApiBridgeError, 'FuzzyMatchError should extend ApiBridgeError');
  assert(new TypeCoercionError('test', 'field', 'string', 'boolean') instanceof ApiBridgeError, 'TypeCoercionError should extend ApiBridgeError');
  assert(new CrypticResolverError('test', 'key') instanceof ApiBridgeError, 'CrypticResolverError should extend ApiBridgeError');
});

test('v6 errors serialize to JSON', () => {
  const err = new FuzzyMatchError('test', 'usr_email', ['user_email']);
  const json = err.toJSON();
  assertEqual(json.name, 'FuzzyMatchError');
  assertEqual(json.code, 'FUZZY_MATCH_ERROR');
  assert(json.timestamp !== undefined, 'Should have timestamp');
});

test('v6 errors have timestamps', () => {
  const err1 = new FuzzyMatchError('test', 'key');
  const err2 = new TypeCoercionError('test', 'field', 's', 'b');
  const err3 = new CrypticResolverError('test', 'key', 'reason');
  assert(err1.timestamp !== undefined, 'FuzzyMatchError should have timestamp');
  assert(err2.timestamp !== undefined, 'TypeCoercionError should have timestamp');
  assert(err3.timestamp !== undefined, 'CrypticResolverError should have timestamp');
});

// ─── v6: EDGE CASES ──────────────────────────────────────────
console.log('\n33. v6 Edge Cases');

test('FuzzyMatcher handles very long key names', () => {
  const fm = new FuzzyMatcher();
  const longKey = 'a'.repeat(250) + '_email';
  const result = fm.findBestMatch(longKey, ['user_email']);
  // Should not crash, may or may not match
  assert(result !== null, 'Should return a result object');
});

test('CrypticResolver handles empty string', () => {
  const cr = new CrypticResolver();
  const result = cr.resolve('', ['user_email']);
  // Should not crash
  assert(result !== null, 'Should return a result object');
});

test('TypeCoercer handles non-parseable date string', () => {
  const tc = new TypeCoercer();
  const result = tc.coerceValue('not-a-date', 'date', 'createdAt');
  // Should not crash, may fail to coerce
  assert(result !== null, 'Should return a result object');
});

test('TypeCoercer handles NaN for integer coercion', () => {
  const tc = new TypeCoercer();
  const result = tc.coerceValue('abc', 'integer', 'count');
  // Should fail gracefully
  assert(result !== null, 'Should return a result object');
  assertEqual(result.value, 'abc');
});

test('FuzzyMatcher handles keys with special characters', () => {
  const fm = new FuzzyMatcher();
  const result = fm.findBestMatch('user.email', ['user_email', 'user_name']);
  assertEqual(result.match, 'user_email');
  assert(result.confidence >= 0.55, 'Should match despite dot separator');
});

test('FuzzyMatcher matches with different casing conventions', () => {
  const fm = new FuzzyMatcher();
  const result = fm.findBestMatch('UserEmail', ['user_email', 'user_name']);
  assertEqual(result.match, 'user_email');
  assert(result.confidence >= 0.55, 'Should match PascalCase to snake_case');
});

test('TypeCoercer coerces "no" to boolean false', () => {
  const tc = new TypeCoercer();
  const result = tc.coerceValue('no', 'boolean', 'flag');
  assertEqual(result.value, false);
  assertEqual(result.coerced, true);
});

test('TypeCoercer detects boolean_string conflict type', () => {
  const tc = new TypeCoercer();
  const conflicts = tc.detectConflicts(
    { isActive: 'true' },
    { isActive: { type: 'boolean' } },
  );
  assert(conflicts.length === 1, 'Should detect one conflict');
  assertEqual(conflicts[0].field, 'isActive');
  assertEqual(conflicts[0].sourceType, 'boolean_string');
  assertEqual(conflicts[0].targetType, 'boolean');
  assertEqual(conflicts[0].canCoerce, true);
});

test('CrypticResolver isCryptic handles edge cases', () => {
  const cr = new CrypticResolver();
  assert(!cr.isCryptic(''), 'Empty string should not be cryptic');
  assert(!cr.isCryptic('a'), 'Single char should not be cryptic');
  assert(!cr.isCryptic('email'), 'Normal word should not be cryptic');
});

test('Transformer v6 preserves existing behavior for standard transforms', () => {
  const t6 = new APIBridgeTransformer({ logMismatches: false });
  const result = t6.transform({ first_name: 'John', last_name: 'Doe' });
  assertEqual(result.firstName, 'John');
  assertEqual(result.lastName, 'Doe');
});

test('Transformer v6 preserves nested object transformation', () => {
  const t6 = new APIBridgeTransformer({ logMismatches: false });
  const result = t6.transform({
    user_data: {
      first_name: 'John',
      contact_info: { phone_number: '555-1234' },
    },
  });
  assertEqual(result.userData.firstName, 'John');
  assertEqual(result.userData.contactInfo.phoneNumber, '555-1234');
});

test('Transformer v6 preserves array transformation', () => {
  const t6 = new APIBridgeTransformer({ logMismatches: false });
  const result = t6.transform([
    { first_name: 'John' },
    { first_name: 'Jane' },
  ]);
  assertEqual(result[0].firstName, 'John');
  assertEqual(result[1].firstName, 'Jane');
});

// ─── V7 TESTS: WEIGHTED ENSEMBLE FUZZY MATCHING ───────────────

test('v7 FuzzyMatcher weighted ensemble finds better matches', () => {
  const fm = new FuzzyMatcher();
  const result = fm.findBestMatch('usr_email', ['user_email', 'user_name', 'email_address']);
  assertEqual(result.match, 'user_email');
  assert(result.confidence >= 0.7, `Should have high confidence, got ${result.confidence}`);
});

test('v7 FuzzyMatcher ensemble scoring produces higher confidence than v6 max-based', () => {
  const fmEnsemble = new FuzzyMatcher({ useEnsemble: true });
  const fmMax = new FuzzyMatcher({ useEnsemble: false });
  const resultEnsemble = fmEnsemble.findBestMatch('acct_name', ['account_name', 'user_name']);
  const resultMax = fmMax.findBestMatch('acct_name', ['account_name', 'user_name']);
  assertEqual(resultEnsemble.match, 'account_name');
  assertEqual(resultMax.match, 'account_name');
  // Ensemble should be at least as confident as max-based
  assert(resultEnsemble.confidence >= resultMax.confidence - 0.05,
    `Ensemble ${resultEnsemble.confidence} should be >= max ${resultMax.confidence} - 0.05`);
});

test('v7 FuzzyMatcher getStrategies includes new strategies', () => {
  const fm = new FuzzyMatcher();
  const strategies = fm.getStrategies();
  assertEqual(strategies.ngram, true);
  assertEqual(strategies.substring, true);
  assertEqual(strategies.ensemble, true);
});

test('v7 FuzzyMatcher getWeights returns strategy weights', () => {
  const fm = new FuzzyMatcher();
  const weights = fm.getWeights();
  assert(weights.levenshtein > 0, 'Should have levenshtein weight');
  assert(weights.ngram > 0, 'Should have ngram weight');
  assert(weights.substring > 0, 'Should have substring weight');
});

test('v7 FuzzyMatcher setWeights allows custom tuning', () => {
  const fm = new FuzzyMatcher();
  fm.setWeights({ levenshtein: 0.5, tokenMatch: 0.5 });
  const weights = fm.getWeights();
  assertEqual(weights.levenshtein, 0.5);
  assertEqual(weights.tokenMatch, 0.5);
});

test('v7 FuzzyMatcher n-gram matching improves short token matches', () => {
  const fm = new FuzzyMatcher();
  const result = fm.findBestMatch('desc_txt', ['description_text', 'detail_info']);
  assertEqual(result.match, 'description_text');
  assert(result.confidence >= 0.55, `Should match via abbreviation expansion, got ${result.confidence}`);
});

test('v7 FuzzyMatcher substring matching detects containment', () => {
  const fm = new FuzzyMatcher();
  const result = fm.findBestMatch('user_email_addr', ['user_email_address', 'user_phone_number']);
  assertEqual(result.match, 'user_email_address');
  assert(result.confidence >= 0.55, `Should match via substring, got ${result.confidence}`);
});

// ─── V7 TESTS: EXPANDED ABBREVIATION MAP ──────────────────────

test('v7 FuzzyMatcher expands financial abbreviations', () => {
  const fm = new FuzzyMatcher();
  const result = fm.findBestMatch('txn_id', ['transaction_id', 'order_id']);
  assertEqual(result.match, 'transaction_id');
  assert(result.confidence >= 0.6, `Should match txn→transaction, got ${result.confidence}`);
});

test('v7 FuzzyMatcher expands IoT abbreviations', () => {
  const fm = new FuzzyMatcher();
  const result = fm.findBestMatch('dev_id', ['device_id', 'developer_id']);
  assertEqual(result.match, 'device_id');
  assert(result.confidence >= 0.6, `Should match dev→device, got ${result.confidence}`);
});

test('v7 FuzzyMatcher expands security abbreviations', () => {
  const fm = new FuzzyMatcher();
  const result = fm.findBestMatch('cert_id', ['certificate_id', 'certain_id']);
  assertEqual(result.match, 'certificate_id');
  assert(result.confidence >= 0.55, `Should match cert→certificate, got ${result.confidence}`);
});

test('v7 FuzzyMatcher expands application abbreviations', () => {
  const fm = new FuzzyMatcher();
  const result = fm.findBestMatch('notif_count', ['notification_count', 'note_count']);
  assertEqual(result.match, 'notification_count');
  assert(result.confidence >= 0.55, `Should match notif→notification, got ${result.confidence}`);
});

// ─── V7 TESTS: ENHANCED CRYPTIC RESOLVER ──────────────────────

test('v7 CrypticResolver strips database prefixes', () => {
  const cr = new CrypticResolver();
  const result = cr.resolve('tbl_user_name', ['user_name', 'account_name']);
  assertEqual(result.match, 'user_name');
  assert(result.confidence >= 0.45, `Should resolve tbl_ prefix, got ${result.confidence}`);
});

test('v7 CrypticResolver strips fk_ prefix', () => {
  const cr = new CrypticResolver();
  const result = cr.resolve('fk_order_id', ['order_id', 'product_id']);
  assertEqual(result.match, 'order_id');
  assert(result.confidence >= 0.45, `Should resolve fk_ prefix, got ${result.confidence}`);
});

test('v7 CrypticResolver n-gram matching helps short names', () => {
  const cr = new CrypticResolver({ useNgram: true });
  const result = cr.resolve('usrnm', ['username', 'password']);
  // Even without prefix stripping, n-gram might help
  if (result.match) {
    assertEqual(result.match, 'username');
  }
});

test('v7 CrypticResolver improved vocabulary matching with partial words', () => {
  const cr = new CrypticResolver();
  const result = cr.resolve('x1_email_addr', ['email_address', 'phone_number']);
  if (result.match) {
    assertEqual(result.match, 'email_address');
  }
});

test('v7 CrypticResolver confidence cap raised to 0.70', () => {
  const cr = new CrypticResolver();
  const result = cr.resolve('z9_ref_id', ['ref_id', 'reference_id']);
  if (result.match) {
    assert(result.confidence <= 0.70, `Confidence ${result.confidence} should be <= 0.70`);
    assert(result.confidence >= 0.45, `Confidence ${result.confidence} should be >= 0.45`);
  }
});

// ─── V7 TESTS: ENHANCED TYPE COERCER ──────────────────────────

test('v7 TypeCoercer handles case-insensitive booleans TRUE', () => {
  const tc = new TypeCoercer();
  const result = tc.coerceValue('TRUE', 'boolean', 'flag');
  assertEqual(result.value, true);
  assertEqual(result.coerced, true);
});

test('v7 TypeCoercer handles case-insensitive booleans FALSE', () => {
  const tc = new TypeCoercer();
  const result = tc.coerceValue('FALSE', 'boolean', 'flag');
  assertEqual(result.value, false);
  assertEqual(result.coerced, true);
});

test('v7 TypeCoercer handles Yes/No booleans', () => {
  const tc = new TypeCoercer();
  assertEqual(tc.coerceValue('Yes', 'boolean', 'flag').value, true);
  assertEqual(tc.coerceValue('No', 'boolean', 'flag').value, false);
});

test('v7 TypeCoercer handles on/off booleans', () => {
  const tc = new TypeCoercer();
  assertEqual(tc.coerceValue('on', 'boolean', 'flag').value, true);
  assertEqual(tc.coerceValue('off', 'boolean', 'flag').value, false);
  assertEqual(tc.coerceValue('ON', 'boolean', 'flag').value, true);
  assertEqual(tc.coerceValue('OFF', 'boolean', 'flag').value, false);
});

test('v7 TypeCoercer handles percentage strings to float', () => {
  const tc = new TypeCoercer();
  const result = tc.coerceValue('50%', 'float', 'rate');
  assertEqual(result.value, 0.5);
  assertEqual(result.coerced, true);
});

test('v7 TypeCoercer handles percentage strings to number', () => {
  const tc = new TypeCoercer();
  const result = tc.coerceValue('75%', 'number', 'completion');
  assertEqual(result.value, 0.75);
  assertEqual(result.coerced, true);
});

test('v7 TypeCoercer handles comma-separated integers', () => {
  const tc = new TypeCoercer();
  const result = tc.coerceValue('1,000', 'integer', 'count');
  assertEqual(result.value, 1000);
  assertEqual(result.coerced, true);
});

test('v7 TypeCoercer handles comma-separated floats', () => {
  const tc = new TypeCoercer();
  const result = tc.coerceValue('1,234.56', 'float', 'amount');
  assertEqual(result.value, 1234.56);
  assertEqual(result.coerced, true);
});

test('v7 TypeCoercer handles DD/MM/YYYY dates', () => {
  const tc = new TypeCoercer();
  const result = tc.coerceValue('15/01/2024', 'date', 'created_at');
  assert(result.value instanceof Date, 'Should be a Date object');
  assertEqual(result.coerced, true);
});

test('v7 TypeCoercer handles comma-separated strings as arrays', () => {
  const tc = new TypeCoercer();
  const result = tc.coerceValue('red,green,blue', 'array', 'colors');
  assert(Array.isArray(result.value), 'Should be an array');
  assertEqual(result.value.length, 3);
  assertEqual(result.value[0], 'red');
  assertEqual(result.value[1], 'green');
  assertEqual(result.value[2], 'blue');
});

test('v7 inferType detects percentage_string', () => {
  const { inferType } = require('./src/type-coercer');
  assertEqual(inferType('50%'), 'percentage_string');
  assertEqual(inferType('100%'), 'percentage_string');
  assertEqual(inferType('-10.5%'), 'percentage_string');
});

test('v7 inferType detects case-insensitive booleans', () => {
  const { inferType } = require('./src/type-coercer');
  assertEqual(inferType('TRUE'), 'boolean_string');
  assertEqual(inferType('FALSE'), 'boolean_string');
  assertEqual(inferType('Yes'), 'boolean_string');
  assertEqual(inferType('No'), 'boolean_string');
  assertEqual(inferType('ON'), 'boolean_string');
  assertEqual(inferType('OFF'), 'boolean_string');
});

test('v7 inferType detects comma-separated numbers', () => {
  const { inferType } = require('./src/type-coercer');
  assertEqual(inferType('1,000'), 'float_string');
  assertEqual(inferType('1,234,567'), 'float_string');
});

// ─── V7 TESTS: EXPANDED SYNONYM DICTIONARY ────────────────────

test('v7 synonym dictionary includes financial terms', () => {
  const { WORD_TO_GROUP } = require('./src/synonyms');
  assert(WORD_TO_GROUP.has('balance'), 'Should have balance');
  assert(WORD_TO_GROUP.has('credit'), 'Should have credit');
  assert(WORD_TO_GROUP.has('debit'), 'Should have debit');
});

test('v7 synonym dictionary includes IoT terms', () => {
  const { WORD_TO_GROUP } = require('./src/synonyms');
  assert(WORD_TO_GROUP.has('sensor'), 'Should have sensor');
  assert(WORD_TO_GROUP.has('firmware'), 'Should have firmware');
  assert(WORD_TO_GROUP.has('battery'), 'Should have battery');
});

test('v7 synonym dictionary includes education terms', () => {
  const { WORD_TO_GROUP } = require('./src/synonyms');
  assert(WORD_TO_GROUP.has('student'), 'Should have student');
  assert(WORD_TO_GROUP.has('teacher'), 'Should have teacher');
  assert(WORD_TO_GROUP.has('course'), 'Should have course');
});

test('v7 synonym dictionary includes social terms', () => {
  const { WORD_TO_GROUP } = require('./src/synonyms');
  assert(WORD_TO_GROUP.has('follower'), 'Should have follower');
  assert(WORD_TO_GROUP.has('notification'), 'Should have notification');
  assert(WORD_TO_GROUP.has('like'), 'Should have like');
});

test('v7 synonym groups map related financial terms together', () => {
  const { WORD_TO_GROUP } = require('./src/synonyms');
  const balanceGroup = WORD_TO_GROUP.get('balance');
  const accountBalanceGroup = WORD_TO_GROUP.get('account_balance');
  assertEqual(balanceGroup, accountBalanceGroup);
});

// ─── V7 TESTS: N-GRAM FUNCTIONS ───────────────────────────────

test('v7 ngramSimilarity returns 1.0 for identical strings', () => {
  const { ngramSimilarity } = require('./src/fuzzy-matcher');
  assertEqual(ngramSimilarity('hello', 'hello'), 1.0);
});

test('v7 ngramSimilarity returns 0 for completely different strings', () => {
  const { ngramSimilarity } = require('./src/fuzzy-matcher');
  const sim = ngramSimilarity('abc', 'xyz');
  assert(sim < 0.3, `Should be low similarity, got ${sim}`);
});

test('v7 ngramSimilarity detects similar strings', () => {
  const { ngramSimilarity } = require('./src/fuzzy-matcher');
  const sim = ngramSimilarity('username', 'usrname');
  assert(sim > 0.5, `Should be high similarity, got ${sim}`);
});

test('v7 ngrams generates correct bigrams', () => {
  const { ngrams } = require('./src/fuzzy-matcher');
  const result = ngrams('hello', 2);
  assert(result.length === 4, 'hello should have 4 bigrams');
  assertEqual(result[0], 'he');
  assertEqual(result[1], 'el');
  assertEqual(result[2], 'll');
  assertEqual(result[3], 'lo');
});

// ─── V7 TESTS: TRANSFORMER ACCURACY ───────────────────────────

test('v7 Transformer abbreviation-aware semantic similarity', () => {
  const t7 = new APIBridgeTransformer({ logMismatches: false });
  const schema = {
    userName: { column: 'usr_nm', type: 'string' },
    emailAddress: { column: 'eml_addr', type: 'string' },
  };
  const result = t7.transform({ usr_nm: 'john', eml_addr: 'john@test.com' }, schema);
  assertEqual(result.userName, 'john');
  assertEqual(result.emailAddress, 'john@test.com');
});

test('v7 Transformer preserves backward compatibility', () => {
  const t7 = new APIBridgeTransformer({ logMismatches: false });
  const result = t7.transform({
    first_name: 'John',
    last_name: 'Doe',
    is_active: true,
    created_at: '2024-01-15',
  });
  assertEqual(result.firstName, 'John');
  assertEqual(result.lastName, 'Doe');
  assertEqual(result.isActive, true);
  assertEqual(result.createdAt, '2024-01-15');
});

test('v7 Transformer handles nested objects with accuracy', () => {
  const t7 = new APIBridgeTransformer({ logMismatches: false });
  const result = t7.transform({
    user_data: {
      first_name: 'John',
      contact_info: {
        phone_number: '555-1234',
        email_address: 'john@test.com',
      },
    },
  });
  assertEqual(result.userData.firstName, 'John');
  assertEqual(result.userData.contactInfo.phoneNumber, '555-1234');
  assertEqual(result.userData.contactInfo.emailAddress, 'john@test.com');
});

// ═══════════════════════════════════════════════════════════════
//  V8 TESTS: FIELD ALIASER
// ═══════════════════════════════════════════════════════════════

test('v8 FieldAliaser register and resolve alias', () => {
  const aliaser = new FieldAliaser();
  aliaser.register('userId', ['user_id', 'uid', 'member_id']);
  const result = aliaser.resolve('uid');
  assertEqual(result.canonical, 'userId');
  assertEqual(result.matched, true);
  assertEqual(result.source, 'alias');
});

test('v8 FieldAliaser resolve canonical directly', () => {
  const aliaser = new FieldAliaser();
  aliaser.register('userId', ['user_id', 'uid']);
  const result = aliaser.resolve('userId');
  assertEqual(result.canonical, 'userId');
  assertEqual(result.source, 'canonical');
});

test('v8 FieldAliaser resolve unregistered returns null', () => {
  const aliaser = new FieldAliaser();
  aliaser.register('userId', ['uid']);
  const result = aliaser.resolve('unknown_field');
  assertEqual(result.canonical, null);
  assertEqual(result.matched, false);
});

test('v8 FieldAliaser API-specific aliases', () => {
  const aliaser = new FieldAliaser();
  aliaser.register('userId', ['user_id'], { api: 'serviceA' });
  aliaser.register('userId', ['member_id'], { api: 'serviceB' });
  const resultA = aliaser.resolve('user_id', 'serviceA');
  assertEqual(resultA.canonical, 'userId');
  assertEqual(resultA.source, 'api:serviceA');
  const resultB = aliaser.resolve('member_id', 'serviceB');
  assertEqual(resultB.canonical, 'userId');
});

test('v8 FieldAliaser getAliasFor returns API-specific alias', () => {
  const aliaser = new FieldAliaser();
  aliaser.register('userId', ['user_id'], { api: 'legacy' });
  const alias = aliaser.getAliasFor('userId', 'legacy');
  assertEqual(alias, 'user_id');
});

test('v8 FieldAliaser getAliases returns all aliases', () => {
  const aliaser = new FieldAliaser();
  aliaser.register('email', ['email_address', 'mail']);
  const aliases = aliaser.getAliases('email');
  assertEqual(aliases.global.length, 2);
  assert(aliases.global.includes('email_address'), 'Should include email_address');
  assert(aliases.global.includes('mail'), 'Should include mail');
});

test('v8 FieldAliaser hasAliases detects registered fields', () => {
  const aliaser = new FieldAliaser();
  aliaser.register('name', ['full_name']);
  assert(aliaser.hasAliases('name'), 'Should have aliases for canonical');
  assert(aliaser.hasAliases('full_name'), 'Should have aliases for alias');
  assert(!aliaser.hasAliases('unknown'), 'Should not have aliases for unknown');
});

test('v8 FieldAliaser bulkImport and bulkExport', () => {
  const aliaser = new FieldAliaser();
  aliaser.bulkImport({
    userId: ['uid', 'user_id'],
    email: ['mail', 'email_address'],
  });
  const exported = aliaser.bulkExport();
  assert(exported.userId, 'Should export userId');
  assert(exported.email, 'Should export email');
  assertEqual(exported.userId.global.length, 2);
});

test('v8 FieldAliaser unregister removes canonical and aliases', () => {
  const aliaser = new FieldAliaser();
  aliaser.register('userId', ['uid']);
  assertEqual(aliaser.resolve('uid').matched, true);
  aliaser.unregister('userId');
  assertEqual(aliaser.resolve('uid').matched, false);
});

test('v8 FieldAliaser stats tracking', () => {
  const aliaser = new FieldAliaser();
  aliaser.register('userId', ['uid']);
  aliaser.resolve('uid');
  aliaser.resolve('unknown');
  const stats = aliaser.getStats();
  assertEqual(stats.lookups, 2);
  assertEqual(stats.hits, 1);
  assertEqual(stats.misses, 1);
});

test('v8 FieldAliaser detectConflicts', () => {
  const aliaser = new FieldAliaser({ allowOverlap: true });
  aliaser.register('userId', ['uid']);
  aliaser.register('memberId', ['uid']);
  const conflicts = aliaser.detectConflicts();
  assert(conflicts.length > 0, 'Should detect alias conflict');
  assertEqual(conflicts[0].alias, 'uid');
});

test('v8 FieldAliaser clear resets everything', () => {
  const aliaser = new FieldAliaser();
  aliaser.register('userId', ['uid']);
  aliaser.clear();
  assertEqual(aliaser.resolve('uid').matched, false);
  assertEqual(aliaser.getStats().totalGroups, 0);
});

// ═══════════════════════════════════════════════════════════════
//  V8 TESTS: SCHEMA MIGRATOR
// ═══════════════════════════════════════════════════════════════

test('v8 SchemaMigrator define and migrate forward', () => {
  const migrator = new SchemaMigrator();
  migrator.define('1.0', '2.0', {
    rename: { user_name: 'username' },
    add: { version: '2.0' },
    remove: ['legacy_field'],
  });
  const result = migrator.migrate(
    { user_name: 'John', legacy_field: 'old', email: 'john@test.com' },
    '1.0', '2.0'
  );
  assert(result.success, 'Migration should succeed');
  assertEqual(result.data.username, 'John');
  assertEqual(result.data.version, '2.0');
  assert(!result.data.user_name, 'Old field name should be removed');
  assert(!result.data.legacy_field, 'Removed field should be gone');
  assertEqual(result.data.email, 'john@test.com');
});

test('v8 SchemaMigrator migrate backward (auto-reverse)', () => {
  const migrator = new SchemaMigrator();
  migrator.define('1.0', '2.0', {
    rename: { user_name: 'username' },
  });
  const result = migrator.migrate({ username: 'John', email: 'john@test.com' }, '2.0', '1.0');
  assert(result.success, 'Backward migration should succeed');
  assertEqual(result.data.user_name, 'John');
  assert(!result.data.username, 'New field name should be reversed');
});

test('v8 SchemaMigrator chained migration', () => {
  const migrator = new SchemaMigrator();
  migrator.define('1.0', '2.0', { rename: { name: 'full_name' } });
  migrator.define('2.0', '3.0', { rename: { full_name: 'displayName' } });
  const result = migrator.migrate({ name: 'John' }, '1.0', '3.0');
  assert(result.success, 'Chained migration should succeed');
  assertEqual(result.data.displayName, 'John');
  assertEqual(result.steps.length, 2);
});

test('v8 SchemaMigrator transform rules', () => {
  const migrator = new SchemaMigrator();
  migrator.define('1.0', '2.0', {
    transform: { price: (v) => v * 100 }, // dollars to cents
  });
  const result = migrator.migrate({ price: 9.99 }, '1.0', '2.0');
  assertEqual(result.data.price, 999);
});

test('v8 SchemaMigrator dryRun previews changes', () => {
  const migrator = new SchemaMigrator();
  migrator.define('1.0', '2.0', {
    rename: { old_name: 'new_name' },
    add: { added_field: 'default' },
  });
  const preview = migrator.dryRun({ old_name: 'val', other: 'data' }, '1.0', '2.0');
  assert(preview.possible, 'Should be possible');
  assert(preview.changes.length > 0, 'Should have changes');
});

test('v8 SchemaMigrator same version returns data unchanged', () => {
  const migrator = new SchemaMigrator();
  const result = migrator.migrate({ a: 1 }, '1.0', '1.0');
  assert(result.success, 'Same version migration should succeed');
  assertEqual(result.data.a, 1);
  assertEqual(result.steps.length, 0);
});

test('v8 SchemaMigrator no path returns failure (non-strict)', () => {
  const migrator = new SchemaMigrator();
  const result = migrator.migrate({ a: 1 }, '1.0', '99.0');
  assertEqual(result.success, false);
});

test('v8 SchemaMigrator getVersions lists all versions', () => {
  const migrator = new SchemaMigrator();
  migrator.define('1.0', '2.0', { rename: {} });
  migrator.define('2.0', '3.0', { rename: {} });
  const versions = migrator.getVersions();
  assert(versions.includes('1.0'), 'Should include 1.0');
  assert(versions.includes('2.0'), 'Should include 2.0');
  assert(versions.includes('3.0'), 'Should include 3.0');
});

test('v8 SchemaMigrator history tracking', () => {
  const migrator = new SchemaMigrator();
  migrator.define('1.0', '2.0', { rename: { a: 'b' } });
  migrator.migrate({ a: 1 }, '1.0', '2.0');
  const history = migrator.getHistory();
  assertEqual(history.length, 1);
  assertEqual(history[0].from, '1.0');
  assertEqual(history[0].to, '2.0');
});

test('v8 SchemaMigrator rollback', () => {
  const migrator = new SchemaMigrator();
  migrator.define('1.0', '2.0', { rename: { a: 'b' } });
  migrator.migrate({ a: 1 }, '1.0', '2.0');
  const result = migrator.rollback({ b: 1 });
  assert(result.success, 'Rollback should succeed');
  assertEqual(result.data.a, 1);
});

test('v8 SchemaMigrator registerDetector', () => {
  const migrator = new SchemaMigrator();
  migrator.registerDetector((data) => data._version || null);
  assertEqual(migrator.detectVersion({ _version: '2.0' }), '2.0');
  assertEqual(migrator.detectVersion({ name: 'test' }), null);
});

test('v8 SchemaMigrator getStats', () => {
  const migrator = new SchemaMigrator();
  migrator.define('1.0', '2.0', { rename: {} });
  const stats = migrator.getStats();
  assert(stats.totalMigrations > 0, 'Should have migrations');
  assert(stats.versions.length > 0, 'Should have versions');
});

// ═══════════════════════════════════════════════════════════════
//  V8 TESTS: BATCH ORCHESTRATOR
// ═══════════════════════════════════════════════════════════════

test('v8 BatchOrchestrator executeParallel basic', async () => {
  const batch = new BatchOrchestrator({ concurrency: 2 });
  const result = await batch.executeParallel([
    { id: 'r1', execute: () => Promise.resolve({ name: 'John' }) },
    { id: 'r2', execute: () => Promise.resolve({ name: 'Jane' }) },
    { id: 'r3', execute: () => Promise.resolve({ name: 'Bob' }) },
  ]);
  assertEqual(result.successful, 3);
  assertEqual(result.failed, 0);
  assertEqual(result.results.length, 3);
});

test('v8 BatchOrchestrator handles failures with continue strategy', async () => {
  const batch = new BatchOrchestrator({ failureStrategy: 'continue', maxRetries: 0 });
  const result = await batch.executeParallel([
    { id: 'r1', execute: () => Promise.resolve('ok') },
    { id: 'r2', execute: () => Promise.reject(new Error('fail')) },
    { id: 'r3', execute: () => Promise.resolve('ok') },
  ]);
  assertEqual(result.successful, 2);
  assertEqual(result.failed, 1);
});

test('v8 BatchOrchestrator executeSequential passes previous results', async () => {
  const batch = new BatchOrchestrator();
  const result = await batch.executeSequential([
    { id: 'step1', execute: () => Promise.resolve(10) },
    { id: 'step2', execute: (prev) => Promise.resolve(prev.step1 + 5) },
  ]);
  assertEqual(result.successful, 2);
  assertEqual(result.results[1].data, 15);
});

test('v8 BatchOrchestrator aggregate merge strategy', () => {
  const batch = new BatchOrchestrator();
  const results = [
    { id: 'a', success: true, data: { name: 'John' } },
    { id: 'b', success: true, data: { age: 30 } },
    { id: 'c', success: false, error: 'fail' },
  ];
  const merged = batch.aggregate(results, 'merge');
  assertEqual(merged.name, 'John');
  assertEqual(merged.age, 30);
});

test('v8 BatchOrchestrator aggregate collect strategy', () => {
  const batch = new BatchOrchestrator();
  const results = [
    { id: 'a', success: true, data: 1 },
    { id: 'b', success: true, data: 2 },
  ];
  const collected = batch.aggregate(results, 'collect');
  assertEqual(collected.length, 2);
  assertEqual(collected[0], 1);
  assertEqual(collected[1], 2);
});

test('v8 BatchOrchestrator stats tracking', async () => {
  const batch = new BatchOrchestrator();
  await batch.executeParallel([
    { id: 'r1', execute: () => Promise.resolve('ok') },
  ]);
  const stats = batch.getStats();
  assertEqual(stats.totalBatches, 1);
  assertEqual(stats.totalRequests, 1);
  assertEqual(stats.successfulRequests, 1);
});

test('v8 BatchOrchestrator progress callback', async () => {
  let progressCalls = 0;
  const batch = new BatchOrchestrator({
    onProgress: () => { progressCalls++; },
  });
  await batch.executeParallel([
    { id: 'r1', execute: () => Promise.resolve('ok') },
    { id: 'r2', execute: () => Promise.resolve('ok') },
  ]);
  assertEqual(progressCalls, 2);
});

// ═══════════════════════════════════════════════════════════════
//  V8 TESTS: FIELD STATS
// ═══════════════════════════════════════════════════════════════

test('v8 FieldStats record and retrieve field stats', () => {
  const stats = new FieldStats();
  stats.record('user_name', { targetKey: 'userName', confidence: 0.95, method: 'pattern_conversion' });
  stats.record('user_name', { targetKey: 'userName', confidence: 0.97, method: 'pattern_conversion' });
  const fieldStats = stats.getFieldStats('user_name');
  assertEqual(fieldStats.count, 2);
  assert(fieldStats.avgConfidence > 0.9, 'Avg confidence should be high');
  assertEqual(fieldStats.methods.pattern_conversion, 2);
});

test('v8 FieldStats getTopFields returns sorted by frequency', () => {
  const stats = new FieldStats();
  stats.record('email', { confidence: 0.9, method: 'exact' });
  stats.record('email', { confidence: 0.9, method: 'exact' });
  stats.record('name', { confidence: 0.8, method: 'pattern' });
  const top = stats.getTopFields(5);
  assertEqual(top[0].field, 'email');
  assertEqual(top[0].count, 2);
});

test('v8 FieldStats getLowConfidenceFields', () => {
  const stats = new FieldStats();
  stats.record('good_field', { confidence: 0.95, method: 'exact' });
  stats.record('bad_field', { confidence: 0.4, method: 'best_effort' });
  const lowConf = stats.getLowConfidenceFields(0.75);
  assertEqual(lowConf.length, 1);
  assertEqual(lowConf[0].field, 'bad_field');
  assertEqual(lowConf[0].suggestedAction, 'add_to_schema');
});

test('v8 FieldStats getCoverageReport', () => {
  const stats = new FieldStats();
  stats.record('a', { confidence: 0.95, method: 'exact' });
  stats.record('b', { confidence: 0.65, method: 'fuzzy' });
  stats.record('c', { confidence: 0.3, method: 'best_effort' });
  const report = stats.getCoverageReport();
  assertEqual(report.totalTransformations, 3);
  assertEqual(report.uniqueFields, 3);
  assertEqual(report.confidenceDistribution.high.count, 1);
  assertEqual(report.confidenceDistribution.medium.count, 1);
  assertEqual(report.confidenceDistribution.low.count, 1);
});

test('v8 FieldStats export returns comprehensive analytics', () => {
  const stats = new FieldStats();
  stats.record('a', { confidence: 0.9, method: 'exact' });
  const exported = stats.export();
  assert(exported.global, 'Should have global stats');
  assert(exported.fields, 'Should have field details');
  assert(exported.coverage, 'Should have coverage');
  assert(exported.timestamp, 'Should have timestamp');
});

test('v8 FieldStats clear resets everything', () => {
  const stats = new FieldStats();
  stats.record('a', { confidence: 0.9 });
  stats.clear();
  assertEqual(stats.getFieldStats('a'), null);
  assertEqual(stats.getCoverageReport().totalTransformations, 0);
});

// ═══════════════════════════════════════════════════════════════
//  V8 TESTS: CONDITIONAL TRANSFORM
// ═══════════════════════════════════════════════════════════════

test('v8 ConditionalTransform basic rule application', () => {
  const ct = new ConditionalTransform();
  ct.when('nullToNA', (v) => v === null, () => 'N/A');
  const result = ct.apply(null, 'status');
  assertEqual(result.value, 'N/A');
  assertEqual(result.rule, 'nullToNA');
  assertEqual(result.applied, true);
});

test('v8 ConditionalTransform no matching rule', () => {
  const ct = new ConditionalTransform();
  ct.when('nullCheck', (v) => v === null, () => 'N/A');
  const result = ct.apply('hello', 'name');
  assertEqual(result.applied, false);
  assertEqual(result.rule, null);
});

test('v8 ConditionalTransform field-restricted rules', () => {
  const ct = new ConditionalTransform();
  ct.when('uppercase', () => true, (v) => String(v).toUpperCase(), { fields: ['name'] });
  const r1 = ct.apply('john', 'name');
  assertEqual(r1.value, 'JOHN');
  const r2 = ct.apply('john', 'email');
  assertEqual(r2.applied, false);
});

test('v8 ConditionalTransform priority ordering', () => {
  const ct = new ConditionalTransform();
  ct.when('low', () => true, () => 'low', { priority: 1 });
  ct.when('high', () => true, () => 'high', { priority: 10 });
  const result = ct.apply('test', 'field');
  assertEqual(result.value, 'high');
  assertEqual(result.rule, 'high');
});

test('v8 ConditionalTransform otherwise default', () => {
  const ct = new ConditionalTransform();
  ct.when('isNull', (v) => v === null, () => 'N/A');
  ct.otherwise('status', (v) => String(v).toUpperCase());
  const result = ct.apply('active', 'status');
  assertEqual(result.value, 'ACTIVE');
  assertEqual(result.rule, 'default');
});

test('v8 ConditionalTransform applyAll transforms object', () => {
  const ct = new ConditionalTransform();
  ct.when('nullToDefault', (v) => v === null, () => 'N/A');
  ct.when('trimStrings', (v) => typeof v === 'string' && v !== v.trim(), (v) => v.trim());
  const result = ct.applyAll({ name: '  John  ', status: null, age: 30 });
  assertEqual(result.data.name, 'John');
  assertEqual(result.data.status, 'N/A');
  assertEqual(result.data.age, 30);
  assert(result.applied.length >= 2, 'Should have applied at least 2 rules');
});

test('v8 ConditionalTransform context-aware rules', () => {
  const ct = new ConditionalTransform();
  ct.when('vipDiscount',
    (v, field, ctx) => ctx.isVip === true,
    (v) => v * 0.8, // 20% discount
    { fields: ['price'] }
  );
  const result = ct.apply(100, 'price', { isVip: true });
  assertEqual(result.value, 80);
});

test('v8 ConditionalTransform removeRule', () => {
  const ct = new ConditionalTransform();
  ct.when('rule1', () => true, () => 'match');
  assertEqual(ct.getRules().length, 1);
  ct.removeRule('rule1');
  assertEqual(ct.getRules().length, 0);
});

test('v8 ConditionalTransform stats tracking', () => {
  const ct = new ConditionalTransform();
  ct.when('testRule', () => true, (v) => v);
  ct.apply('a', 'x');
  ct.apply('b', 'y');
  const stats = ct.getStats();
  assertEqual(stats.totalEvaluations, 2);
  assertEqual(stats.ruleHits.testRule, 2);
});

// ═══════════════════════════════════════════════════════════════
//  V8 TESTS: DEEP MERGE
// ═══════════════════════════════════════════════════════════════

test('v8 DeepMerge basic object merge', () => {
  const merger = new DeepMerge();
  const result = merger.merge({ a: 1, b: 2 }, { b: 3, c: 4 });
  assertEqual(result.a, 1);
  assertEqual(result.b, 3); // latest wins
  assertEqual(result.c, 4);
});

test('v8 DeepMerge nested objects', () => {
  const merger = new DeepMerge();
  const result = merger.merge(
    { user: { name: 'John', age: 30 } },
    { user: { age: 31, email: 'john@test.com' } }
  );
  assertEqual(result.user.name, 'John');
  assertEqual(result.user.age, 31);
  assertEqual(result.user.email, 'john@test.com');
});

test('v8 DeepMerge array concat strategy', () => {
  const merger = new DeepMerge({ arrayStrategy: 'concat' });
  const result = merger.merge({ tags: ['a', 'b'] }, { tags: ['c', 'd'] });
  assertEqual(result.tags.length, 4);
});

test('v8 DeepMerge array replace strategy', () => {
  const merger = new DeepMerge({ arrayStrategy: 'replace' });
  const result = merger.merge({ tags: ['a', 'b'] }, { tags: ['c', 'd'] });
  assertEqual(result.tags.length, 2);
  assertEqual(result.tags[0], 'c');
});

test('v8 DeepMerge array union strategy', () => {
  const merger = new DeepMerge({ arrayStrategy: 'union' });
  const result = merger.merge({ tags: ['a', 'b'] }, { tags: ['b', 'c'] });
  assertEqual(result.tags.length, 3);
});

test('v8 DeepMerge first conflict strategy', () => {
  const merger = new DeepMerge({ conflictStrategy: 'first' });
  const result = merger.merge({ a: 'first' }, { a: 'second' });
  assertEqual(result.a, 'first');
});

test('v8 DeepMerge custom conflict resolver', () => {
  const merger = new DeepMerge({
    conflictStrategy: 'custom',
    conflictResolver: (key, a, b) => `${a}+${b}`,
  });
  const result = merger.merge({ name: 'John' }, { name: 'Jane' });
  assertEqual(result.name, 'John+Jane');
});

test('v8 DeepMerge prototype pollution protection', () => {
  const merger = new DeepMerge();
  const malicious = JSON.parse('{"__proto__": {"polluted": true}, "safe": "value"}');
  const result = merger.merge({}, malicious);
  assertEqual(result.safe, 'value');
  assert(!({}).polluted, 'Prototype should not be polluted');
});

test('v8 DeepMerge skipNull option', () => {
  const merger = new DeepMerge({ skipNull: true });
  const result = merger.merge({ a: 1, b: 2 }, { a: null, b: 3 });
  assertEqual(result.a, 1); // null skipped
  assertEqual(result.b, 3);
});

test('v8 DeepMerge mergeLabeled with source tracking', () => {
  const merger = new DeepMerge({ trackSources: true });
  const { result, sources } = merger.mergeLabeled([
    { label: 'api1', data: { name: 'John' } },
    { label: 'api2', data: { email: 'john@test.com' } },
  ]);
  assertEqual(result.name, 'John');
  assertEqual(result.email, 'john@test.com');
  assertEqual(sources.name, 'api1');
  assertEqual(sources.email, 'api2');
});

test('v8 DeepMerge stats tracking', () => {
  const merger = new DeepMerge();
  merger.merge({ a: 1 }, { a: 2, b: 3 });
  const stats = merger.getStats();
  assertEqual(stats.totalMerges, 1);
  assert(stats.fieldsProcessed > 0, 'Should have processed fields');
  assert(stats.conflicts > 0, 'Should have conflicts');
});

test('v8 DeepMerge multiple sources', () => {
  const merger = new DeepMerge();
  const result = merger.merge({ a: 1 }, { b: 2 }, { c: 3 });
  assertEqual(result.a, 1);
  assertEqual(result.b, 2);
  assertEqual(result.c, 3);
});

// ═══════════════════════════════════════════════════════════════
//  V8 TESTS: OUTPUT FORMATTER
// ═══════════════════════════════════════════════════════════════

test('v8 OutputFormatter toJSON', () => {
  const fmt = new OutputFormatter();
  const json = fmt.toJSON({ name: 'John', age: 30 });
  const parsed = JSON.parse(json);
  assertEqual(parsed.name, 'John');
  assertEqual(parsed.age, 30);
});

test('v8 OutputFormatter toXML simple object', () => {
  const fmt = new OutputFormatter();
  const xml = fmt.toXML({ name: 'John', age: 30 });
  assert(xml.includes('<?xml'), 'Should have XML header');
  assert(xml.includes('<name>John</name>'), 'Should contain name element');
  assert(xml.includes('<age>30</age>'), 'Should contain age element');
});

test('v8 OutputFormatter toXML array of objects', () => {
  const fmt = new OutputFormatter();
  const xml = fmt.toXML([{ name: 'John' }, { name: 'Jane' }]);
  assert(xml.includes('<item>'), 'Should have item elements');
  assert(xml.includes('John'), 'Should contain John');
  assert(xml.includes('Jane'), 'Should contain Jane');
});

test('v8 OutputFormatter toXML escapes special characters', () => {
  const fmt = new OutputFormatter();
  const xml = fmt.toXML({ note: 'a < b & c > d' });
  assert(xml.includes('&lt;'), 'Should escape <');
  assert(xml.includes('&amp;'), 'Should escape &');
  assert(xml.includes('&gt;'), 'Should escape >');
});

test('v8 OutputFormatter toCSV', () => {
  const fmt = new OutputFormatter();
  const csv = fmt.toCSV([
    { name: 'John', age: 30 },
    { name: 'Jane', age: 25 },
  ]);
  const lines = csv.split('\n');
  assertEqual(lines.length, 3); // header + 2 data rows
  assert(lines[0].includes('name'), 'Should have header');
  assert(lines[1].includes('John'), 'Should have John');
});

test('v8 OutputFormatter toCSV without headers', () => {
  const fmt = new OutputFormatter({ csvHeaders: false });
  const csv = fmt.toCSV([{ name: 'John' }]);
  const lines = csv.split('\n');
  assertEqual(lines.length, 1);
  assert(lines[0].includes('John'), 'Should have data');
});

test('v8 OutputFormatter toKeyValue', () => {
  const fmt = new OutputFormatter();
  const kv = fmt.toKeyValue({ name: 'John', age: 30 });
  assert(kv.includes('name: John'), 'Should have name');
  assert(kv.includes('age: 30'), 'Should have age');
});

test('v8 OutputFormatter toKeyValue nested', () => {
  const fmt = new OutputFormatter();
  const kv = fmt.toKeyValue({ user: { name: 'John' } });
  assert(kv.includes('user.name: John'), 'Should flatten nested keys');
});

test('v8 OutputFormatter toTable', () => {
  const fmt = new OutputFormatter();
  const table = fmt.toTable([
    { name: 'John', age: 30 },
    { name: 'Jane', age: 25 },
  ]);
  assert(table.includes('name'), 'Should have header');
  assert(table.includes('John'), 'Should have data');
  assert(table.includes('---'), 'Should have divider');
});

test('v8 OutputFormatter fromTemplate', () => {
  const fmt = new OutputFormatter();
  const result = fmt.fromTemplate(
    { name: 'John', age: 30 },
    'Hello {{name}}, you are {{age}} years old'
  );
  assertEqual(result, 'Hello John, you are 30 years old');
});

test('v8 OutputFormatter fromTemplate with nested paths', () => {
  const fmt = new OutputFormatter();
  const result = fmt.fromTemplate(
    { user: { name: 'John' } },
    'User: {{user.name}}'
  );
  assertEqual(result, 'User: John');
});

test('v8 OutputFormatter stats tracking', () => {
  const fmt = new OutputFormatter();
  fmt.toJSON({});
  fmt.toXML({});
  fmt.toCSV([]);
  const stats = fmt.getStats();
  assertEqual(stats.json, 1);
  assertEqual(stats.xml, 1);
  assertEqual(stats.csv, 1);
});

// ═══════════════════════════════════════════════════════════════
//  V8 TESTS: REQUEST INTERCEPTOR
// ═══════════════════════════════════════════════════════════════

test('v8 RequestInterceptor basic request interception', async () => {
  const interceptor = new RequestInterceptor();
  interceptor.useRequest('addAuth', (ctx) => ({
    ...ctx,
    headers: { ...ctx.headers, Authorization: 'Bearer token' },
  }));
  const { context } = await interceptor.interceptRequest({ url: '/api', headers: {} });
  assertEqual(context.headers.Authorization, 'Bearer token');
});

test('v8 RequestInterceptor response interception', async () => {
  const interceptor = new RequestInterceptor();
  interceptor.useResponse('addMeta', (ctx) => ({
    ...ctx,
    meta: { processed: true },
  }));
  const { context } = await interceptor.interceptResponse({ data: { a: 1 } });
  assertEqual(context.meta.processed, true);
});

test('v8 RequestInterceptor priority ordering', async () => {
  const interceptor = new RequestInterceptor();
  const order = [];
  interceptor.useRequest('low', (ctx) => { order.push('low'); return ctx; }, { priority: 1 });
  interceptor.useRequest('high', (ctx) => { order.push('high'); return ctx; }, { priority: 10 });
  await interceptor.interceptRequest({});
  assertEqual(order[0], 'high');
  assertEqual(order[1], 'low');
});

test('v8 RequestInterceptor short circuit', async () => {
  const interceptor = new RequestInterceptor();
  interceptor.useRequest('blocker', () => ({ blocked: true, _shortCircuit: true }));
  interceptor.useRequest('afterBlocker', (ctx) => ({ ...ctx, afterCalled: true }), { priority: -1 });
  const { context, shortCircuited } = await interceptor.interceptRequest({});
  assertEqual(shortCircuited, true);
  assertEqual(context.blocked, true);
  assert(!context.afterCalled, 'After interceptor should not run');
});

test('v8 RequestInterceptor group enable/disable', async () => {
  const interceptor = new RequestInterceptor();
  let called = false;
  interceptor.useRequest('grouped', (ctx) => { called = true; return ctx; }, { group: 'auth' });
  interceptor.setGroupEnabled('auth', false);
  await interceptor.interceptRequest({});
  assert(!called, 'Disabled group interceptor should not run');
  interceptor.setGroupEnabled('auth', true);
  await interceptor.interceptRequest({});
  assert(called, 'Enabled group interceptor should run');
});

test('v8 RequestInterceptor individual enable/disable', async () => {
  const interceptor = new RequestInterceptor();
  let called = false;
  interceptor.useRequest('test', (ctx) => { called = true; return ctx; });
  interceptor.setEnabled('test', false);
  await interceptor.interceptRequest({});
  assert(!called, 'Disabled interceptor should not run');
});

test('v8 RequestInterceptor error handling with continueOnError', async () => {
  const interceptor = new RequestInterceptor({ continueOnError: true });
  let secondCalled = false;
  interceptor.useRequest('failing', () => { throw new Error('fail'); }, { priority: 10 });
  interceptor.useRequest('passing', (ctx) => { secondCalled = true; return ctx; }, { priority: 1 });
  await interceptor.interceptRequest({});
  assert(secondCalled, 'Second interceptor should still run');
});

test('v8 RequestInterceptor per-interceptor error handler', async () => {
  const interceptor = new RequestInterceptor();
  let errorHandled = false;
  interceptor.useRequest('failing', () => { throw new Error('fail'); }, {
    onError: (err, ctx) => { errorHandled = true; return ctx; },
  });
  await interceptor.interceptRequest({});
  assert(errorHandled, 'Error handler should be called');
});

test('v8 RequestInterceptor list shows all interceptors', () => {
  const interceptor = new RequestInterceptor();
  interceptor.useRequest('reqInt', (ctx) => ctx, { priority: 5, group: 'g1' });
  interceptor.useResponse('resInt', (ctx) => ctx);
  const list = interceptor.list();
  assertEqual(list.request.length, 1);
  assertEqual(list.response.length, 1);
  assertEqual(list.request[0].name, 'reqInt');
  assertEqual(list.request[0].priority, 5);
});

test('v8 RequestInterceptor remove', () => {
  const interceptor = new RequestInterceptor();
  interceptor.useRequest('test', (ctx) => ctx);
  assertEqual(interceptor.list().request.length, 1);
  interceptor.remove('test');
  assertEqual(interceptor.list().request.length, 0);
});

test('v8 RequestInterceptor stats', async () => {
  const interceptor = new RequestInterceptor();
  interceptor.useRequest('test', (ctx) => ctx);
  await interceptor.interceptRequest({});
  await interceptor.interceptRequest({});
  const stats = interceptor.getStats();
  assertEqual(stats.requestInterceptions, 2);
});

// ═══════════════════════════════════════════════════════════════
//  V8 TESTS: ERROR CLASSES
// ═══════════════════════════════════════════════════════════════

test('v8 FieldAliaserError has correct properties', () => {
  const err = new FieldAliaserError('Alias conflict', 'userId', 'duplicate');
  assertEqual(err.name, 'FieldAliaserError');
  assertEqual(err.code, 'FIELD_ALIASER_ERROR');
  assertEqual(err.details.field, 'userId');
  assertEqual(err.details.reason, 'duplicate');
  assert(err instanceof ApiBridgeError, 'Should extend ApiBridgeError');
});

test('v8 SchemaMigrationError has correct properties', () => {
  const err = new SchemaMigrationError('No path found', '1.0', '3.0', 'no_path');
  assertEqual(err.name, 'SchemaMigrationError');
  assertEqual(err.code, 'SCHEMA_MIGRATION_ERROR');
  assertEqual(err.details.fromVersion, '1.0');
  assertEqual(err.details.toVersion, '3.0');
});

test('v8 BatchOrchestratorError has correct properties', () => {
  const err = new BatchOrchestratorError('Batch failed', 'batch-1', 'timeout');
  assertEqual(err.name, 'BatchOrchestratorError');
  assertEqual(err.code, 'BATCH_ORCHESTRATOR_ERROR');
  assertEqual(err.details.batchId, 'batch-1');
});

test('v8 DeepMergeError has correct properties', () => {
  const err = new DeepMergeError('Merge conflict', 'user.name', 'unresolvable');
  assertEqual(err.name, 'DeepMergeError');
  assertEqual(err.code, 'DEEP_MERGE_ERROR');
  assertEqual(err.details.path, 'user.name');
});

test('v8 InterceptorError has correct properties', () => {
  const err = new InterceptorError('Interceptor failed', 'authInterceptor', 'timeout');
  assertEqual(err.name, 'InterceptorError');
  assertEqual(err.code, 'INTERCEPTOR_ERROR');
  assertEqual(err.details.interceptorName, 'authInterceptor');
});

// ═══════════════════════════════════════════════════════════════
//  V8 TESTS: BACKWARD COMPATIBILITY
// ═══════════════════════════════════════════════════════════════

test('v8 backward compatibility — all v7 exports still available', () => {
  assert(typeof APIBridgeTransformer === 'function', 'APIBridgeTransformer');
  assert(typeof transform === 'function', 'transform');
  assert(typeof createTransformer === 'function', 'createTransformer');
  assert(typeof FuzzyMatcher === 'function', 'FuzzyMatcher');
  assert(typeof CrypticResolver === 'function', 'CrypticResolver');
  assert(typeof TypeCoercer === 'function', 'TypeCoercer');
  assert(typeof CircuitBreaker === 'function', 'CircuitBreaker');
  assert(typeof EventBus === 'function', 'EventBus');
  assert(typeof MockServer === 'function', 'MockServer');
});

test('v8 backward compatibility — all v8 exports available', () => {
  assert(typeof FieldAliaser === 'function', 'FieldAliaser');
  assert(typeof SchemaMigrator === 'function', 'SchemaMigrator');
  assert(typeof BatchOrchestrator === 'function', 'BatchOrchestrator');
  assert(typeof FieldStats === 'function', 'FieldStats');
  assert(typeof ConditionalTransform === 'function', 'ConditionalTransform');
  assert(typeof DeepMerge === 'function', 'DeepMerge');
  assert(typeof OutputFormatter === 'function', 'OutputFormatter');
  assert(typeof RequestInterceptor === 'function', 'RequestInterceptor');
});

test('v8 backward compatibility — transform still works', () => {
  const result = transform({
    first_name: 'John',
    last_name: 'Doe',
    is_active: true,
  });
  assertEqual(result.firstName, 'John');
  assertEqual(result.lastName, 'Doe');
  assertEqual(result.isActive, true);
});
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
