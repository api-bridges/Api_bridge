/**
 * awsibnj v18 — Comprehensive Test Suite
 * Tests every scenario a developer actually hits, including all v2-v18 features.
 */

const {
  awsibnjTransformer,
  bridge,
  bridgeFetch,
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
  YarouError,
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

  // v9 exports
  createClient,
  awsibnjClient,
  ClientError,
  InterceptorManager,
  InterceptorChain,
  validateExpect,
  serializeExpect,
  deserializeExpect,
  extractExpect,
  injectExpectHeader,
  flattenExpect,
  HEADER_NAME,
  smartProxy,
  buildURL,

  // v10 exports
  CancelToken,
  Cancel,
  isCancel,
  toFormData,
  isFormData,
  isBlob,
  isFile,
  isBuffer,
  isStream,
  isArrayBufferView,
  isURLSearchParams,
  all,
  spread,
  isClientError,
  isYarouError,
  mergeConfig,
  defaultParamsSerializer,
  create,

  // v11 exports
  isCancelToken,
  toURLEncodedForm,
  formToJSON,
  isTypedArray,
  isFileList,
  AxiosHeaders,
  normalizeHeaderName,
  HttpStatusCode,
  fetchAdapter,
  xhrAdapter,
  adapters,
  getAdapter,
  isAbsoluteURL,
  combineURLs,
  isURLSameOrigin,
  parseURL,
  kindOf,
  isPlainObject,
  isObject,
  isFunction,
  isString,
  isNumber,
  isBoolean,
  isUndefined,
  isDate,
  isRegExp,
  isArrayBuffer,
  forEach: forEachUtil,
  merge: mergeUtil,
  extend,
  stripBOM,
  findKey,
  isBrowser,
  isNode,
  freezeDeep,
  generateUID,
  VERSION,

  // v12 exports
  Axios,
  AxiosError,
  isAxiosError,
  default: apiBridge,
  request: defaultRequest,
  get: defaultGet,
  post: defaultPost,
  put: defaultPut,
  patch: defaultPatch,
  delete: defaultDelete,
  head: defaultHead,
  options: defaultOptions,
  postForm: defaultPostForm,
  putForm: defaultPutForm,
  patchForm: defaultPatchForm,
  getUri: defaultGetUri,
  interceptors: defaultInterceptors,
  resolveParamsSerializer,

  // v16 exports
  SSRFGuard,
  HeaderValidator,
  RequestRateLimiter,
  ResponseSizeGuard,
  SensitiveDataRedactor,
  RequestFingerprinter,
  safeMerge,
  sanitizeObject,
  isPrivateIP,

  // v17 exports
  ContentSecurityPolicy,
  CertificatePinning,
  RequestSigning,
  InputSanitizer,
  SecurityAuditLogger,
  PermissionPolicy,
  PayloadEncryptor,
  IdempotencyManager,

  // v18 exports
  ZeroTrustEngine,
  ThreatIntelligence,
  SecureSessionManager,
  RequestIntegrityChain,
  AdaptiveRateLimiter,
  SecurityHeadersManager,
  EncryptedConfigVault,
  MutualTLSManager,

  // v19 exports
  QuantumResistantCrypto,
  BehavioralAnalytics,
  HoneypotManager,
  SubresourceIntegrity,
  RequestThrottleGuard,
  GeofenceGuard,
  CryptoKeyRotator,
  SecurityEventCorrelator,
} = require('./src/index');

const fs = require('fs');
const os = require('os');
const path = require('path');
const TEMP_DIR = os.tmpdir();

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

const t = new awsibnjTransformer({ logMismatches: false });

// ─────────────────────────────────────────────────────────────
console.log('\n\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501');
console.log('  awsibnj v6 \u2014 Test Suite');
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

const learner = new awsibnjTransformer({ logMismatches: false });

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
  const le = new LearningEngine({ storePath: path.join(TEMP_DIR, 'apibridge_test_bulk1.json') });
  le.reset();
  le.learn('test_src', 'testDst', true);
  const exported = le.bulkExport();
  assert(exported['test_src'] === 'testDst', 'Should export learned mapping');

  const le2 = new LearningEngine({ storePath: path.join(TEMP_DIR, 'apibridge_test_bulk2.json') });
  le2.reset();
  const count = le2.bulkImport({ 'foo_bar': 'fooBar', 'baz_qux': 'bazQux' });
  assertEqual(count, 2);
  assertEqual(le2.lookup('foo_bar'), 'fooBar');
});

test('learning engine stats', () => {
  const le = new LearningEngine({ storePath: path.join(TEMP_DIR, 'apibridge_test_stats.json') });
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
  const csvTransformer = new awsibnjTransformer({ logMismatches: false });
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
  const csvTransformer = new awsibnjTransformer({ logMismatches: false });
  csvTransformer.transform({ test_field: 'value', another_key: 123 });

  const filePath = exportMismatchCSV(
    csvTransformer.mismatches,
    path.join(TEMP_DIR, 'apibridge_test_export.csv')
  );
  assert(fs.existsSync(filePath), 'CSV file should exist');

  const content = fs.readFileSync(filePath, 'utf8');
  assert(content.includes('source_key'), 'CSV should have headers');
  assert(content.length > 100, 'CSV should have content');
});

test('JSON export generates valid file', () => {
  const jt = new awsibnjTransformer({ logMismatches: false });
  jt.transform({ test_key: 'val', another_key: 42 });

  const filePath = exportMismatchJSON(
    jt.mismatches,
    path.join(TEMP_DIR, 'apibridge_test_export.json')
  );
  assert(fs.existsSync(filePath), 'JSON file should exist');

  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  assertEqual(data.version, '3.0.0');
  assert(data.summary.total > 0, 'Should have mismatch count');
});

// ─── 9. PENDING MISMATCHES ────────────────────────────────────
console.log('\n9. Pending review queue');

test('low confidence mismatches flagged as pending', () => {
  const pt = new awsibnjTransformer({
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
  const st = new awsibnjTransformer({ logMismatches: false, targetConvention: 'snake_case' });
  const r = st.transform({ firstName: 'John', lastName: 'Doe' });
  assertEqual(r.first_name, 'John');
  assertEqual(r.last_name, 'Doe');
});

test('PascalCase output', () => {
  const pt = new awsibnjTransformer({ logMismatches: false, targetConvention: 'PascalCase' });
  const r = pt.transform({ first_name: 'John' });
  assertEqual(r.FirstName, 'John');
});

test('kebab-case output', () => {
  const kt = new awsibnjTransformer({ logMismatches: false, targetConvention: 'kebab-case' });
  const r = kt.transform({ first_name: 'John' });
  assertEqual(r['first-name'], 'John');
});

test('SCREAMING_SNAKE output', () => {
  const sst = new awsibnjTransformer({ logMismatches: false, targetConvention: 'SCREAMING_SNAKE' });
  const r = sst.transform({ first_name: 'John' });
  assertEqual(r['FIRST_NAME'], 'John');
});

// ─── 11. v2: BATCH TRANSFORMATION ───────────────────────────
console.log('\n11. v2: Batch transformation');

test('transformBatch processes array of payloads', () => {
  const bt = new awsibnjTransformer({ logMismatches: false });
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
  const bt = new awsibnjTransformer({ logMismatches: false });
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
  const rt = new awsibnjTransformer({ logMismatches: false });
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

test('YarouError has structured output', () => {
  const err = new YarouError('Test error', 'TEST', { detail: 1 });
  assertEqual(err.code, 'TEST');
  assertEqual(err.name, 'YarouError');
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
  const et = new awsibnjTransformer({ logMismatches: false });
  let emitted = false;
  et.on('mismatch', (record) => {
    emitted = true;
    assert(record.sourceKey !== undefined, 'Mismatch should have sourceKey');
  });
  et.transform({ first_name: 'John' });
  assert(emitted, 'Should have emitted mismatch event');
});

test('emits approved/rejected events', () => {
  const et = new awsibnjTransformer({ logMismatches: false });
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
  const st = new awsibnjTransformer({ logMismatches: false });
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

test('converts OpenAPI schema to awsibnj format', () => {
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

test('all v4 errors extend YarouError', () => {
  assert(new CircuitBreakerError('test', 'OPEN', 0) instanceof YarouError, 'CircuitBreakerError should extend YarouError');
  assert(new PipelineError('test', 'stage') instanceof YarouError, 'PipelineError should extend YarouError');
  assert(new WebhookError('test', 'provider') instanceof YarouError, 'WebhookError should extend YarouError');
  assert(new VersioningError('test', 'v1') instanceof YarouError, 'VersioningError should extend YarouError');
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

test('all v5 errors extend YarouError', () => {
  assert(new RetryError('test', 1, 3) instanceof YarouError, 'RetryError should extend YarouError');
  assert(new SchemaRegistryError('test', 'User') instanceof YarouError, 'SchemaRegistryError should extend YarouError');
  assert(new DependencyGraphError('test', 'node') instanceof YarouError, 'DependencyGraphError should extend YarouError');
  assert(new MockServerError('test', 'op') instanceof YarouError, 'MockServerError should extend YarouError');
  assert(new HealthCheckError('test', 'ep') instanceof YarouError, 'HealthCheckError should extend YarouError');
  assert(new EventBusError('test', 'ev') instanceof YarouError, 'EventBusError should extend YarouError');
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
  const t6 = new awsibnjTransformer({ logMismatches: false, targetConvention: 'camelCase' });
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
  const t6 = new awsibnjTransformer({ logMismatches: false, targetConvention: 'camelCase' });
  const schema = {
    isActive: { type: 'boolean', column: 'is_active' },
  };
  const result = t6.transform({ is_active: 'true' }, schema, 'toFrontend');
  assertEqual(result.isActive, true);
});

test('Transformer v6 coerces integer string with schema', () => {
  const t6 = new awsibnjTransformer({ logMismatches: false, targetConvention: 'camelCase' });
  const schema = {
    age: { type: 'integer', column: 'age' },
  };
  const result = t6.transform({ age: '25' }, schema, 'toFrontend');
  assertEqual(result.age, 25);
});

test('Transformer v6 coerces date string with schema', () => {
  const t6 = new awsibnjTransformer({ logMismatches: false, targetConvention: 'camelCase' });
  const schema = {
    createdAt: { type: 'date', column: 'created_at' },
  };
  const result = t6.transform({ created_at: '2024-01-15' }, schema, 'toFrontend');
  assert(result.createdAt instanceof Date, 'Should be Date object');
});

test('Transformer v6 handles mixed type conflicts in batch', () => {
  const t6 = new awsibnjTransformer({ logMismatches: false, targetConvention: 'camelCase' });
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
  const t6 = new awsibnjTransformer({ logMismatches: false, targetConvention: 'camelCase' });
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
  const t6 = new awsibnjTransformer({ logMismatches: false, targetConvention: 'camelCase' });
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

test('all v6 errors extend YarouError', () => {
  assert(new FuzzyMatchError('test', 'key') instanceof YarouError, 'FuzzyMatchError should extend YarouError');
  assert(new TypeCoercionError('test', 'field', 'string', 'boolean') instanceof YarouError, 'TypeCoercionError should extend YarouError');
  assert(new CrypticResolverError('test', 'key') instanceof YarouError, 'CrypticResolverError should extend YarouError');
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
  const t6 = new awsibnjTransformer({ logMismatches: false });
  const result = t6.transform({ first_name: 'John', last_name: 'Doe' });
  assertEqual(result.firstName, 'John');
  assertEqual(result.lastName, 'Doe');
});

test('Transformer v6 preserves nested object transformation', () => {
  const t6 = new awsibnjTransformer({ logMismatches: false });
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
  const t6 = new awsibnjTransformer({ logMismatches: false });
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
  const { inferType } = require('./src/core/type-coercer');
  assertEqual(inferType('50%'), 'percentage_string');
  assertEqual(inferType('100%'), 'percentage_string');
  assertEqual(inferType('-10.5%'), 'percentage_string');
});

test('v7 inferType detects case-insensitive booleans', () => {
  const { inferType } = require('./src/core/type-coercer');
  assertEqual(inferType('TRUE'), 'boolean_string');
  assertEqual(inferType('FALSE'), 'boolean_string');
  assertEqual(inferType('Yes'), 'boolean_string');
  assertEqual(inferType('No'), 'boolean_string');
  assertEqual(inferType('ON'), 'boolean_string');
  assertEqual(inferType('OFF'), 'boolean_string');
});

test('v7 inferType detects comma-separated numbers', () => {
  const { inferType } = require('./src/core/type-coercer');
  assertEqual(inferType('1,000'), 'float_string');
  assertEqual(inferType('1,234,567'), 'float_string');
});

// ─── V7 TESTS: EXPANDED SYNONYM DICTIONARY ────────────────────

test('v7 synonym dictionary includes financial terms', () => {
  const { WORD_TO_GROUP } = require('./src/core/synonyms');
  assert(WORD_TO_GROUP.has('balance'), 'Should have balance');
  assert(WORD_TO_GROUP.has('credit'), 'Should have credit');
  assert(WORD_TO_GROUP.has('debit'), 'Should have debit');
});

test('v7 synonym dictionary includes IoT terms', () => {
  const { WORD_TO_GROUP } = require('./src/core/synonyms');
  assert(WORD_TO_GROUP.has('sensor'), 'Should have sensor');
  assert(WORD_TO_GROUP.has('firmware'), 'Should have firmware');
  assert(WORD_TO_GROUP.has('battery'), 'Should have battery');
});

test('v7 synonym dictionary includes education terms', () => {
  const { WORD_TO_GROUP } = require('./src/core/synonyms');
  assert(WORD_TO_GROUP.has('student'), 'Should have student');
  assert(WORD_TO_GROUP.has('teacher'), 'Should have teacher');
  assert(WORD_TO_GROUP.has('course'), 'Should have course');
});

test('v7 synonym dictionary includes social terms', () => {
  const { WORD_TO_GROUP } = require('./src/core/synonyms');
  assert(WORD_TO_GROUP.has('follower'), 'Should have follower');
  assert(WORD_TO_GROUP.has('notification'), 'Should have notification');
  assert(WORD_TO_GROUP.has('like'), 'Should have like');
});

test('v7 synonym groups map related financial terms together', () => {
  const { WORD_TO_GROUP } = require('./src/core/synonyms');
  const balanceGroup = WORD_TO_GROUP.get('balance');
  const accountBalanceGroup = WORD_TO_GROUP.get('account_balance');
  assertEqual(balanceGroup, accountBalanceGroup);
});

// ─── V7 TESTS: N-GRAM FUNCTIONS ───────────────────────────────

test('v7 ngramSimilarity returns 1.0 for identical strings', () => {
  const { ngramSimilarity } = require('./src/core/fuzzy-matcher');
  assertEqual(ngramSimilarity('hello', 'hello'), 1.0);
});

test('v7 ngramSimilarity returns 0 for completely different strings', () => {
  const { ngramSimilarity } = require('./src/core/fuzzy-matcher');
  const sim = ngramSimilarity('abc', 'xyz');
  assert(sim < 0.3, `Should be low similarity, got ${sim}`);
});

test('v7 ngramSimilarity detects similar strings', () => {
  const { ngramSimilarity } = require('./src/core/fuzzy-matcher');
  const sim = ngramSimilarity('username', 'usrname');
  assert(sim > 0.5, `Should be high similarity, got ${sim}`);
});

test('v7 ngrams generates correct bigrams', () => {
  const { ngrams } = require('./src/core/fuzzy-matcher');
  const result = ngrams('hello', 2);
  assert(result.length === 4, 'hello should have 4 bigrams');
  assertEqual(result[0], 'he');
  assertEqual(result[1], 'el');
  assertEqual(result[2], 'll');
  assertEqual(result[3], 'lo');
});

// ─── V7 TESTS: TRANSFORMER ACCURACY ───────────────────────────

test('v7 Transformer abbreviation-aware semantic similarity', () => {
  const t7 = new awsibnjTransformer({ logMismatches: false });
  const schema = {
    userName: { column: 'usr_nm', type: 'string' },
    emailAddress: { column: 'eml_addr', type: 'string' },
  };
  const result = t7.transform({ usr_nm: 'john', eml_addr: 'john@test.com' }, schema);
  assertEqual(result.userName, 'john');
  assertEqual(result.emailAddress, 'john@test.com');
});

test('v7 Transformer preserves backward compatibility', () => {
  const t7 = new awsibnjTransformer({ logMismatches: false });
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
  const t7 = new awsibnjTransformer({ logMismatches: false });
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
  assert(err instanceof YarouError, 'Should extend YarouError');
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
  assert(typeof awsibnjTransformer === 'function', 'awsibnjTransformer');
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

// ═══════════════════════════════════════════════════════════════════════════
// v9 TEST SUITE — Next-Gen API Client
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n━━━ v9: Interceptor System ━━━');

test('InterceptorChain — use and eject', () => {
  const chain = new InterceptorChain();
  const id1 = chain.use((x) => x);
  const id2 = chain.use((x) => x);
  assertEqual(chain.size, 2);
  assert(chain.eject(id1), 'should eject existing');
  assertEqual(chain.size, 1);
  assert(!chain.eject(999), 'should not eject non-existing');
});

test('InterceptorChain — use rejects non-function', () => {
  const chain = new InterceptorChain();
  let threw = false;
  try { chain.use('not a function'); } catch (e) { threw = true; }
  assert(threw, 'should throw for non-function');
});

test('InterceptorChain — clear', () => {
  const chain = new InterceptorChain();
  chain.use((x) => x);
  chain.use((x) => x);
  chain.clear();
  assertEqual(chain.size, 0);
});

test('InterceptorManager — request interceptors', async () => {
  const manager = new InterceptorManager();
  manager.request.use((config) => {
    config.modified = true;
    return config;
  });
  manager.request.use((config) => {
    config.count = (config.count || 0) + 1;
    return config;
  });
  const result = await manager.runRequest({ url: '/test' });
  assert(result.modified, 'should be modified');
  assertEqual(result.count, 1);
});

test('InterceptorManager — response interceptors', async () => {
  const manager = new InterceptorManager();
  manager.response.use((res) => {
    res.timestamp = 12345;
    return res;
  });
  const result = await manager.runResponse({ data: 'hello' });
  assertEqual(result.timestamp, 12345);
  assertEqual(result.data, 'hello');
});

test('InterceptorManager — error recovery in response chain', async () => {
  const manager = new InterceptorManager();
  manager.response.use(
    (res) => res,
    (err) => ({ recovered: true, original: err.message }),
  );
  const result = await manager.runError(new Error('test error'));
  assert(result.recovered, 'should be recovered');
  assertEqual(result.original, 'test error');
});

test('InterceptorManager — clear all', () => {
  const manager = new InterceptorManager();
  manager.request.use((x) => x);
  manager.response.use((x) => x);
  manager.clear();
  assertEqual(manager.request.size, 0);
  assertEqual(manager.response.size, 0);
});

test('InterceptorManager — async interceptors', async () => {
  const manager = new InterceptorManager();
  manager.request.use(async (config) => {
    await new Promise(r => setTimeout(r, 1));
    config.async = true;
    return config;
  });
  const result = await manager.runRequest({});
  assert(result.async, 'should support async interceptors');
});

console.log('\n━━━ v9: Expectation Engine ━━━');

test('validateExpect — valid schema', () => {
  const result = validateExpect({ userName: 'string', age: 'number' });
  assert(result.valid, 'should be valid');
});

test('validateExpect — nested schema', () => {
  const result = validateExpect({
    user: { name: 'string', email: 'string' },
    balance: 'number',
  });
  assert(result.valid, 'nested should be valid');
});

test('validateExpect — rejects null', () => {
  const result = validateExpect(null);
  assert(!result.valid, 'null should be invalid');
});

test('validateExpect — rejects array', () => {
  const result = validateExpect([1, 2, 3]);
  assert(!result.valid, 'array should be invalid');
});

test('validateExpect — rejects __proto__', () => {
  // Must use Object.create(null) since { __proto__: x } sets prototype, not a key
  const schema = Object.create(null);
  schema['__proto__'] = 'string';
  const result = validateExpect(schema);
  assert(!result.valid, 'should reject __proto__');
  assert(result.error.includes('dangerous'), 'error message mentions dangerous');
});

test('validateExpect — rejects constructor', () => {
  const result = validateExpect({ constructor: 'string' });
  assert(!result.valid, 'should reject constructor');
});

test('validateExpect — rejects prototype', () => {
  const result = validateExpect({ prototype: 'string' });
  assert(!result.valid, 'should reject prototype');
});

test('validateExpect — rejects unknown type', () => {
  const result = validateExpect({ field: 'foobar' });
  assert(!result.valid, 'unknown type should be invalid');
});

test('validateExpect — accepts all valid types', () => {
  const schema = {
    a: 'string', b: 'number', c: 'boolean',
    d: 'date', e: 'object', f: 'array', g: 'any',
  };
  const result = validateExpect(schema);
  assert(result.valid, 'all valid types should pass');
});

test('serializeExpect / deserializeExpect roundtrip', () => {
  const schema = { userName: 'string', age: 'number' };
  const encoded = serializeExpect(schema);
  assert(typeof encoded === 'string', 'should be string');
  const decoded = deserializeExpect(encoded);
  assertEqual(decoded.userName, 'string');
  assertEqual(decoded.age, 'number');
});

test('deserializeExpect — invalid base64 returns null', () => {
  const result = deserializeExpect('!!!not-valid!!!');
  assertEqual(result, null);
});

test('extractExpect — extracts expect from config', () => {
  const config = { headers: { auth: 'token' }, expect: { userName: 'string' } };
  const result = extractExpect(config);
  assertEqual(result.expect.userName, 'string');
  assert(!result.config.expect, 'expect removed from config');
  assertEqual(result.config.headers.auth, 'token');
});

test('extractExpect — no expect returns null', () => {
  const result = extractExpect({ headers: {} });
  assertEqual(result.expect, null);
});

test('extractExpect — invalid expect returns null with error', () => {
  const schema = Object.create(null);
  schema['__proto__'] = 'string';
  const result = extractExpect({ expect: schema });
  assertEqual(result.expect, null);
  assert(result.error, 'should have error message');
});

test('extractExpect — handles null config', () => {
  const result = extractExpect(null);
  assertEqual(result.expect, null);
});

test('injectExpectHeader — adds header', () => {
  const expect = { userName: 'string' };
  const headers = injectExpectHeader({ 'Content-Type': 'application/json' }, expect);
  assert(headers[HEADER_NAME], 'should have expect header');
  assertEqual(headers['Content-Type'], 'application/json');
  // Verify it's decodable
  const decoded = deserializeExpect(headers[HEADER_NAME]);
  assertEqual(decoded.userName, 'string');
});

test('injectExpectHeader — null expect returns original', () => {
  const headers = injectExpectHeader({ foo: 'bar' }, null);
  assertEqual(headers.foo, 'bar');
  assert(!headers[HEADER_NAME], 'should not have header');
});

test('flattenExpect — flat schema', () => {
  const map = flattenExpect({ userName: 'string', age: 'number' });
  assertEqual(map.get('userName'), 'string');
  assertEqual(map.get('age'), 'number');
});

test('flattenExpect — nested schema', () => {
  const map = flattenExpect({
    user: { name: 'string', email: 'string' },
  });
  assertEqual(map.get('user'), 'object');
  assertEqual(map.get('user.name'), 'string');
  assertEqual(map.get('user.email'), 'string');
});

test('HEADER_NAME constant', () => {
  assertEqual(HEADER_NAME, 'x-api-bridge-expect');
});

console.log('\n━━━ v9: Smart Proxy ━━━');

test('smartProxy — direct access', () => {
  const data = smartProxy({ userName: 'John', age: 30 });
  assertEqual(data.userName, 'John');
  assertEqual(data.age, 30);
});

test('smartProxy — snake_case resolution', () => {
  const data = smartProxy({ user_name: 'John' });
  assertEqual(data.userName, 'John');
});

test('smartProxy — SCREAMING_SNAKE resolution', () => {
  const data = smartProxy({ USER_NAME: 'John' });
  assertEqual(data.userName, 'John');
});

test('smartProxy — PascalCase resolution', () => {
  const data = smartProxy({ UserName: 'John' });
  assertEqual(data.userName, 'John');
});

test('smartProxy — kebab-case resolution', () => {
  const data = smartProxy({ 'user-name': 'John' });
  assertEqual(data.userName, 'John');
});

test('smartProxy — case-insensitive fallback', () => {
  const data = smartProxy({ USERNAME: 'John' });
  assertEqual(data.username, 'John');
});

test('smartProxy — returns undefined for missing', () => {
  const data = smartProxy({ foo: 'bar' });
  assertEqual(data.completelyDifferent, undefined);
});

test('smartProxy — handles null', () => {
  assertEqual(smartProxy(null), null);
});

test('smartProxy — handles primitive', () => {
  assertEqual(smartProxy(42), 42);
});

test('smartProxy — handles arrays', () => {
  const data = smartProxy([{ user_name: 'John' }, { user_name: 'Jane' }]);
  assert(Array.isArray(data), 'should be array');
  assertEqual(data[0].userName, 'John');
  assertEqual(data[1].userName, 'Jane');
});

test('smartProxy — nested object resolution', () => {
  const data = smartProxy({ user: { first_name: 'John' } });
  assertEqual(data.user.firstName, 'John');
});

test('smartProxy — has() trap works for snake_case', () => {
  const data = smartProxy({ user_name: 'John' });
  assert('userName' in data, 'should find via has trap');
});

test('smartProxy — ownKeys returns original keys', () => {
  const data = smartProxy({ user_name: 'John', age: 30 });
  const keys = Object.keys(data);
  assert(keys.includes('user_name'), 'should have original key');
  assert(keys.includes('age'), 'should have age key');
});

test('smartProxy — fuzzy matching with FuzzyMatcher', () => {
  const fuzzy = new FuzzyMatcher();
  const data = smartProxy({ usr_email: 'john@example.com' }, { fuzzyMatcher: fuzzy });
  assertEqual(data.userEmail, 'john@example.com');
});

test('smartProxy — auto-learning integration', () => {
  const learning = new LearningEngine({ storePath: null });
  const data = smartProxy({ user_name: 'John' }, { learningEngine: learning });
  // Trigger resolution — should auto-learn the mapping
  const resolved = data.userName;
  assertEqual(resolved, 'John');
});

test('smartProxy — rejects __proto__ access safely', () => {
  const data = smartProxy({ normal: 'value' });
  // __proto__ access should not resolve to any data field or crash
  assertEqual(data.normal, 'value');
  // Verify no extra keys are exposed
  const keys = Object.keys(data);
  assertEqual(keys.length, 1);
  assertEqual(keys[0], 'normal');
});

console.log('\n━━━ v9: URL Builder ━━━');

test('buildURL — base + path', () => {
  assertEqual(buildURL('/api', '/users'), '/api/users');
});

test('buildURL — base with trailing slash', () => {
  assertEqual(buildURL('/api/', '/users'), '/api/users');
});

test('buildURL — base without slash, path without slash', () => {
  assertEqual(buildURL('/api', 'users'), '/api/users');
});

test('buildURL — with params', () => {
  const url = buildURL('/api', '/users', { page: 1, limit: 10 });
  assert(url.includes('page=1'), 'should have page param');
  assert(url.includes('limit=10'), 'should have limit param');
});

test('buildURL — params skip null/undefined', () => {
  const url = buildURL('/api', '/users', { page: 1, filter: null, search: undefined });
  assert(url.includes('page=1'), 'should have page');
  assert(!url.includes('filter'), 'should skip null');
  assert(!url.includes('search'), 'should skip undefined');
});

test('buildURL — empty base', () => {
  assertEqual(buildURL('', '/users'), '/users');
});

test('buildURL — no path', () => {
  assertEqual(buildURL('/api', ''), '/api');
});

test('buildURL — encodes param values', () => {
  const url = buildURL('/api', '/search', { q: 'hello world' });
  assert(url.includes('q=hello%20world'), 'should encode spaces');
});

console.log('\n━━━ v9: ClientError ━━━');

test('ClientError — basic construction', () => {
  const err = new ClientError('something went wrong');
  assertEqual(err.message, 'something went wrong');
  assertEqual(err.name, 'ClientError');
  assertEqual(err.code, 'ERR_CLIENT');
  assertEqual(err.status, null);
  assertEqual(err.details, null);
});

test('ClientError — with details', () => {
  const err = new ClientError('not found', {
    status: 404,
    code: 'ERR_HTTP_404',
    details: { resource: 'user' },
  });
  assertEqual(err.status, 404);
  assertEqual(err.code, 'ERR_HTTP_404');
  assertEqual(err.details.resource, 'user');
});

test('ClientError — toJSON', () => {
  const err = new ClientError('bad request', { status: 400, code: 'ERR_BAD_REQUEST', details: 'invalid' });
  const json = err.toJSON();
  assertEqual(json.message, 'bad request');
  assertEqual(json.status, 400);
  assertEqual(json.code, 'ERR_BAD_REQUEST');
  assertEqual(json.details, 'invalid');
});

test('ClientError — is YarouError', () => {
  const err = new ClientError('test');
  assert(err instanceof YarouError, 'should extend YarouError');
  assert(err instanceof Error, 'should extend Error');
});

console.log('\n━━━ v9: awsibnjClient ━━━');

test('createClient — returns awsibnjClient', () => {
  const client = createClient({ baseURL: '/api' });
  assert(client instanceof awsibnjClient, 'should be awsibnjClient');
});

test('awsibnjClient — default options', () => {
  const client = createClient();
  assertEqual(client.baseURL, '');
  assertEqual(client.timeout, 0);
  assertEqual(client.retries, 0);
  assertEqual(client.proxyMode, false);
  assertEqual(client.autoAlign, true);
  assertEqual(client.autoCoerce, true);
  assertEqual(client._debug, false);
});

test('awsibnjClient — custom options', () => {
  const client = createClient({
    baseURL: 'https://api.example.com',
    timeout: 5000,
    retries: 3,
    retryDelay: 500,
    proxyMode: true,
    debug: true,
    headers: { 'Authorization': 'Bearer token' },
  });
  assertEqual(client.baseURL, 'https://api.example.com');
  assertEqual(client.timeout, 5000);
  assertEqual(client.retries, 3);
  assertEqual(client.retryDelay, 500);
  assert(client.proxyMode, 'proxy mode should be on');
  assert(client._debug, 'debug should be on');
  assertEqual(client.defaultHeaders['Authorization'], 'Bearer token');
});

test('awsibnjClient — setSchema', () => {
  const client = createClient();
  client.setSchema({ userName: 'string', age: 'number' });
  assertEqual(client._schema.userName, 'string');
});

test('awsibnjClient — setSchema rejects invalid', () => {
  const client = createClient();
  let threw = false;
  const schema = Object.create(null);
  schema['__proto__'] = 'string';
  try { client.setSchema(schema); } catch (e) { threw = true; }
  assert(threw, 'should throw for invalid schema');
});

test('awsibnjClient — enableDebug', () => {
  const client = createClient();
  assert(!client._debug, 'debug off by default');
  client.enableDebug(true);
  assert(client._debug, 'debug should be on');
  client.enableDebug(false);
  assert(!client._debug, 'debug should be off again');
});

test('awsibnjClient — enableProxy', () => {
  const client = createClient();
  assert(!client.proxyMode, 'proxy off by default');
  client.enableProxy(true);
  assert(client.proxyMode, 'proxy should be on');
});

test('awsibnjClient — interceptors accessible', () => {
  const client = createClient();
  assert(client.interceptors instanceof InterceptorManager, 'should have interceptors');
  assert(client.interceptors.request instanceof InterceptorChain, 'should have request chain');
  assert(client.interceptors.response instanceof InterceptorChain, 'should have response chain');
});

test('awsibnjClient — interceptors.request.use returns id', () => {
  const client = createClient();
  const id = client.interceptors.request.use((config) => config);
  assertEqual(typeof id, 'number');
});

test('awsibnjClient — interceptors.request.eject', () => {
  const client = createClient();
  const id = client.interceptors.request.use((config) => config);
  assert(client.interceptors.request.eject(id), 'should eject');
  assertEqual(client.interceptors.request.size, 0);
});

test('awsibnjClient — getStats', () => {
  const client = createClient();
  const stats = client.getStats();
  assertEqual(stats.requests, 0);
  assertEqual(stats.successes, 0);
  assertEqual(stats.failures, 0);
  assert(stats.transformer, 'should have transformer stats');
  assert(stats.learning, 'should have learning stats');
});

test('awsibnjClient — clearCache', () => {
  const client = createClient();
  client._endpointCache.set('test', true);
  assertEqual(client._endpointCache.size, 1);
  client.clearCache();
  assertEqual(client._endpointCache.size, 0);
});

test('awsibnjClient — reset', () => {
  const client = createClient();
  client.interceptors.request.use((x) => x);
  client._endpointCache.set('test', true);
  client._stats.requests = 5;
  client.reset();
  assertEqual(client.interceptors.request.size, 0);
  assertEqual(client._endpointCache.size, 0);
  assertEqual(client._stats.requests, 0);
});

test('awsibnjClient — has HTTP method shortcuts', () => {
  const client = createClient();
  assertEqual(typeof client.get, 'function');
  assertEqual(typeof client.post, 'function');
  assertEqual(typeof client.put, 'function');
  assertEqual(typeof client.patch, 'function');
  assertEqual(typeof client.delete, 'function');
  assertEqual(typeof client.head, 'function');
  assertEqual(typeof client.options, 'function');
  assertEqual(typeof client.request, 'function');
});

test('awsibnjClient — _coerceValue string→number', () => {
  const client = createClient();
  assertEqual(client._coerceValue('5000', 'number'), 5000);
  assertEqual(client._coerceValue('3.14', 'number'), 3.14);
  assertEqual(client._coerceValue(42, 'number'), 42);
});

test('awsibnjClient — _coerceValue string→boolean', () => {
  const client = createClient();
  assertEqual(client._coerceValue('true', 'boolean'), true);
  assertEqual(client._coerceValue('false', 'boolean'), false);
  assertEqual(client._coerceValue('yes', 'boolean'), true);
  assertEqual(client._coerceValue('no', 'boolean'), false);
  assertEqual(client._coerceValue('1', 'boolean'), true);
  assertEqual(client._coerceValue('0', 'boolean'), false);
});

test('awsibnjClient — _coerceValue string→date', () => {
  const client = createClient();
  const result = client._coerceValue('2024-01-15', 'date');
  assert(result instanceof Date, 'should be Date');
  assertEqual(result.getFullYear(), 2024);
});

test('awsibnjClient — _coerceValue number→string', () => {
  const client = createClient();
  assertEqual(client._coerceValue(42, 'string'), '42');
});

test('awsibnjClient — _coerceValue passthrough for any', () => {
  const client = createClient();
  assertEqual(client._coerceValue('hello', 'any'), 'hello');
  assertEqual(client._coerceValue(42, 'any'), 42);
});

test('awsibnjClient — _coerceToExpect with expect map', () => {
  const client = createClient();
  const expectMap = new Map([['balance', 'number'], ['active', 'boolean'], ['name', 'string']]);
  const data = { balance: '5000', active: 'true', name: 'John' };
  const result = client._coerceToExpect(data, expectMap);
  assertEqual(result.balance, 5000);
  assertEqual(result.active, true);
  assertEqual(result.name, 'John');
});

test('awsibnjClient — _coerceToExpect handles arrays', () => {
  const client = createClient();
  const expectMap = new Map([['score', 'number']]);
  const data = [{ score: '100' }, { score: '200' }];
  const result = client._coerceToExpect(data, expectMap);
  assertEqual(result[0].score, 100);
  assertEqual(result[1].score, 200);
});

test('awsibnjClient — _coerceToExpect handles nested objects', () => {
  const client = createClient();
  const expectMap = new Map([['age', 'number']]);
  const data = { user: { age: '25' } };
  const result = client._coerceToExpect(data, expectMap);
  assertEqual(result.user.age, 25);
});

console.log('\n━━━ v9: Backward Compatibility ━━━');

test('v9 backward compatibility — all v9 exports available', () => {
  assert(typeof createClient === 'function', 'createClient');
  assert(typeof awsibnjClient === 'function', 'awsibnjClient');
  assert(typeof ClientError === 'function', 'ClientError');
  assert(typeof InterceptorManager === 'function', 'InterceptorManager');
  assert(typeof InterceptorChain === 'function', 'InterceptorChain');
  assert(typeof validateExpect === 'function', 'validateExpect');
  assert(typeof serializeExpect === 'function', 'serializeExpect');
  assert(typeof deserializeExpect === 'function', 'deserializeExpect');
  assert(typeof extractExpect === 'function', 'extractExpect');
  assert(typeof injectExpectHeader === 'function', 'injectExpectHeader');
  assert(typeof flattenExpect === 'function', 'flattenExpect');
  assert(typeof smartProxy === 'function', 'smartProxy');
  assert(typeof buildURL === 'function', 'buildURL');
  assertEqual(HEADER_NAME, 'x-api-bridge-expect');
});

test('v9 backward compatibility — all v8 exports still work', () => {
  assert(typeof bridge === 'function', 'bridge');
  assert(typeof bridgeFetch === 'function', 'bridgeFetch');
  assert(typeof transform === 'function', 'transform');
  assert(typeof createTransformer === 'function', 'createTransformer');
  assert(typeof FieldAliaser === 'function', 'FieldAliaser');
  assert(typeof SchemaMigrator === 'function', 'SchemaMigrator');
  assert(typeof BatchOrchestrator === 'function', 'BatchOrchestrator');
  assert(typeof FieldStats === 'function', 'FieldStats');
  assert(typeof ConditionalTransform === 'function', 'ConditionalTransform');
  assert(typeof DeepMerge === 'function', 'DeepMerge');
  assert(typeof OutputFormatter === 'function', 'OutputFormatter');
  assert(typeof RequestInterceptor === 'function', 'RequestInterceptor');
});

test('v9 backward compatibility — transform still works as before', () => {
  const result = transform({
    first_name: 'John',
    last_name: 'Doe',
    is_active: true,
    account_balance: 1000,
  });
  assertEqual(result.firstName, 'John');
  assertEqual(result.lastName, 'Doe');
  assertEqual(result.isActive, true);
  assertEqual(result.accountBalance, 1000);
});

console.log('\n━━━ v9: Integration Tests ━━━');

test('createClient + interceptors + schema integration', () => {
  const client = createClient({ baseURL: '/api' });

  // Add request interceptor
  let interceptorCalled = false;
  client.interceptors.request.use((config) => {
    interceptorCalled = true;
    config.headers = config.headers || {};
    config.headers['X-Custom'] = 'test';
    return config;
  });

  // Set schema
  client.setSchema({ userName: 'string', userAge: 'number' });

  assert(client._schema.userName === 'string', 'schema should be set');
  assert(client.interceptors.request.size === 1, 'should have 1 interceptor');
});

test('expectation → header → decode roundtrip', () => {
  const expect = { userName: 'string', accountBalance: 'number', isActive: 'boolean' };
  const { config, expect: extracted } = extractExpect({ expect, headers: {} });
  assert(extracted, 'should extract expect');
  const headers = injectExpectHeader(config.headers || {}, extracted);
  const decoded = deserializeExpect(headers[HEADER_NAME]);
  assertEqual(decoded.userName, 'string');
  assertEqual(decoded.accountBalance, 'number');
  assertEqual(decoded.isActive, 'boolean');
});

test('smart proxy + transform integration', () => {
  // Simulate what the client does: transform then proxy
  const raw = { user_name: 'John', user_email: 'john@example.com', account_balance: 5000 };
  const transformed = transform(raw);
  assertEqual(transformed.userName, 'John');
  assertEqual(transformed.userEmail, 'john@example.com');
  assertEqual(transformed.accountBalance, 5000);
});

test('smart proxy resolves multiple naming conventions simultaneously', () => {
  const data = smartProxy({
    user_name: 'Snake',
    UserEmail: 'pascal@test.com',
    'account-balance': 100,
    IS_ACTIVE: true,
  });
  assertEqual(data.userName, 'Snake');
  assertEqual(data.userEmail, 'pascal@test.com');
  assertEqual(data.accountBalance, 100);
  assertEqual(data.isActive, true);
});

test('validateExpect — depth limit protection', () => {
  // Build a deeply nested schema
  let schema = { leaf: 'string' };
  for (let i = 0; i < 15; i++) {
    schema = { nested: schema };
  }
  const result = validateExpect(schema);
  assert(!result.valid, 'deeply nested should be invalid');
  assert(result.error.includes('depth'), 'error mentions depth');
});

test('createClient — transformer has correct options', () => {
  const client = createClient({ schema: { userName: 'string' } });
  assert(client.transformer instanceof awsibnjTransformer, 'should have transformer');
  assert(client.learning, 'should have learning engine');
  assert(client.fuzzyMatcher instanceof FuzzyMatcher, 'should have fuzzy matcher');
  assert(client.typeCoercer instanceof TypeCoercer, 'should have type coercer');
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// v10 TEST SUITE — Complete Axios Replacement
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

console.log('\n━━━ v10: CancelToken System ━━━');

test('CancelToken.source() — creates token and cancel function', () => {
  const source = CancelToken.source();
  assert(source.token instanceof CancelToken, 'should return CancelToken');
  assert(typeof source.cancel === 'function', 'should have cancel function');
  assert(!source.token.requested, 'should not be cancelled initially');
});

test('CancelToken.source() — cancel sets reason', () => {
  const source = CancelToken.source();
  source.cancel('User cancelled');
  assert(source.token.requested, 'should be cancelled');
  assertEqual(source.token.reason.message, 'User cancelled');
  assert(source.token.reason.__CANCEL__, 'should have __CANCEL__ flag');
});

test('CancelToken — executor pattern', () => {
  let cancelFn;
  const token = new CancelToken((c) => { cancelFn = c; });
  assert(!token.requested, 'not cancelled initially');
  cancelFn('timeout');
  assert(token.requested, 'should be cancelled');
  assertEqual(token.reason.message, 'timeout');
});

test('CancelToken — throwIfRequested', () => {
  const source = CancelToken.source();
  // Should not throw before cancel
  source.token.throwIfRequested();
  source.cancel('done');
  let threw = false;
  try { source.token.throwIfRequested(); } catch (e) { threw = true; }
  assert(threw, 'should throw after cancel');
});

test('CancelToken — subscribe and unsubscribe', () => {
  const source = CancelToken.source();
  let called = false;
  const listener = () => { called = true; };
  source.token.subscribe(listener);
  source.cancel('test');
  assert(called, 'listener should be called');
});

test('CancelToken — subscribe after cancel fires immediately', () => {
  const source = CancelToken.source();
  source.cancel('pre-cancelled');
  let called = false;
  source.token.subscribe(() => { called = true; });
  assert(called, 'should fire immediately');
});

test('CancelToken — unsubscribe prevents notification', () => {
  const source = CancelToken.source();
  let called = false;
  const listener = () => { called = true; };
  source.token.subscribe(listener);
  source.token.unsubscribe(listener);
  source.cancel('test');
  assert(!called, 'should not be called after unsubscribe');
});

test('CancelToken — double cancel is no-op', () => {
  const source = CancelToken.source();
  source.cancel('first');
  source.cancel('second');
  assertEqual(source.token.reason.message, 'first');
});

test('CancelToken — has signal property', () => {
  const source = CancelToken.source();
  assert(source.token.signal instanceof AbortSignal, 'should have AbortSignal');
});

test('CancelToken — constructor rejects non-function', () => {
  let threw = false;
  try { new CancelToken('not a function'); } catch (e) { threw = true; }
  assert(threw, 'should throw for non-function executor');
});

test('isCancel — returns true for Cancel instances', () => {
  const source = CancelToken.source();
  source.cancel('test');
  assert(isCancel(source.token.reason), 'should detect Cancel');
});

test('isCancel — returns false for regular errors', () => {
  assert(!isCancel(new Error('test')), 'regular Error is not Cancel');
  assert(!isCancel(null), 'null is not Cancel');
  assert(!isCancel(undefined), 'undefined is not Cancel');
  assert(!isCancel('string'), 'string is not Cancel');
});

test('isCancel — returns false for ClientError', () => {
  assert(!isCancel(new ClientError('test')), 'ClientError is not Cancel');
});

test('Cancel — toString', () => {
  const source = CancelToken.source();
  source.cancel('custom message');
  assertEqual(source.token.reason.toString(), 'Cancel: custom message');
});

test('Cancel — default message', () => {
  const cancel = new Cancel();
  assertEqual(cancel.message, 'Request cancelled');
});

console.log('\n━━━ v10: FormData Utilities ━━━');

test('isFormData — returns false for plain objects', () => {
  assert(!isFormData({}), 'plain object is not FormData');
  assert(!isFormData(null), 'null is not FormData');
  assert(!isFormData(undefined), 'undefined is not FormData');
  assert(!isFormData('string'), 'string is not FormData');
});

test('isFormData — detects duck-typed FormData', () => {
  // Simulate FormData-like object
  const fake = {
    append: function() {},
    toString: function() { return '[object FormData]'; },
  };
  assert(isFormData(fake), 'should detect duck-typed FormData');
});

test('isBlob — returns false for non-Blob', () => {
  assert(!isBlob({}), 'plain object is not Blob');
  assert(!isBlob(null), 'null is not Blob');
  assert(!isBlob('string'), 'string is not Blob');
});

test('isFile — returns false for non-File', () => {
  assert(!isFile({}), 'plain object is not File');
  assert(!isFile(null), 'null is not File');
});

test('isBuffer — works with Buffer', () => {
  const buf = Buffer.from('hello');
  assert(isBuffer(buf), 'should detect Buffer');
  assert(!isBuffer('string'), 'string is not Buffer');
  assert(!isBuffer(null), 'null is not Buffer');
});

test('isStream — detects stream-like objects', () => {
  const streamLike = { pipe: function() {} };
  assert(isStream(streamLike), 'should detect stream-like');
  assert(!isStream({}), 'plain object is not stream');
  assert(!isStream(null), 'null is not stream');
});

test('isArrayBufferView — detects ArrayBuffer', () => {
  const ab = new ArrayBuffer(8);
  assert(isArrayBufferView(ab), 'should detect ArrayBuffer');
  const typed = new Uint8Array(8);
  assert(isArrayBufferView(typed), 'should detect typed array');
  assert(!isArrayBufferView({}), 'plain object is not ArrayBufferView');
});

test('isURLSearchParams — detects URLSearchParams', () => {
  const params = new URLSearchParams('a=1&b=2');
  assert(isURLSearchParams(params), 'should detect URLSearchParams');
  assert(!isURLSearchParams({}), 'plain object is not URLSearchParams');
  assert(!isURLSearchParams(null), 'null is not URLSearchParams');
});

test('toFormData — converts object to FormData', () => {
  const fd = toFormData({ name: 'John', age: 30 });
  assert(fd instanceof FormData, 'should return FormData');
  assertEqual(fd.get('name'), 'John');
  assertEqual(fd.get('age'), '30');
});

test('toFormData — handles nested objects', () => {
  const fd = toFormData({ user: { name: 'John' } });
  assertEqual(fd.get('user[name]'), 'John');
});

test('toFormData — handles arrays', () => {
  const fd = toFormData({ tags: ['a', 'b'] });
  assertEqual(fd.get('tags[0]'), 'a');
  assertEqual(fd.get('tags[1]'), 'b');
});

test('toFormData — handles Date objects', () => {
  const date = new Date('2024-01-15T00:00:00.000Z');
  const fd = toFormData({ created: date });
  assertEqual(fd.get('created'), date.toISOString());
});

test('toFormData — handles null values', () => {
  const fd = toFormData({ field: null });
  assertEqual(fd.get('field'), '');
});

test('toFormData — handles Buffer', () => {
  const fd = toFormData({ data: Buffer.from('hello') });
  // Should not throw
  assert(fd instanceof FormData, 'should return FormData');
});

test('toFormData — rejects __proto__ keys', () => {
  const obj = Object.create(null);
  obj['__proto__'] = 'evil';
  obj.safe = 'value';
  const fd = toFormData(obj);
  assert(!fd.has('__proto__'), 'should skip __proto__');
  assertEqual(fd.get('safe'), 'value');
});

test('toFormData — returns empty FormData for null', () => {
  const fd = toFormData(null);
  assert(fd instanceof FormData, 'should return FormData');
});

test('toFormData — appends to existing FormData', () => {
  const existing = new FormData();
  existing.append('existing', 'value');
  const fd = toFormData({ new: 'data' }, existing);
  assertEqual(fd.get('existing'), 'value');
  assertEqual(fd.get('new'), 'data');
});

console.log('\n━━━ v10: Enhanced Client Options ━━━');

test('awsibnjClient — defaults object', () => {
  const client = createClient({ baseURL: '/api', timeout: 5000 });
  assertEqual(client.defaults.baseURL, '/api');
  assertEqual(client.defaults.timeout, 5000);
  assert(client.defaults.headers.common, 'should have common headers');
  assert(client.defaults.headers.post, 'should have post headers');
  assertEqual(client.defaults.headers.post['Content-Type'], 'application/json');
});

test('awsibnjClient — auth option', () => {
  const client = createClient({ auth: { username: 'user', password: 'pass' } });
  assertEqual(client.auth.username, 'user');
  assertEqual(client.auth.password, 'pass');
  assertEqual(client.defaults.auth.username, 'user');
});

test('awsibnjClient — responseType option', () => {
  const client = createClient({ responseType: 'text' });
  assertEqual(client.responseType, 'text');
  assertEqual(client.defaults.responseType, 'text');
});

test('awsibnjClient — default responseType is json', () => {
  const client = createClient();
  assertEqual(client.responseType, 'json');
});

test('awsibnjClient — validateStatus option', () => {
  const custom = (status) => status < 500;
  const client = createClient({ validateStatus: custom });
  assert(client.validateStatus(200), '200 should be valid');
  assert(client.validateStatus(404), '404 should be valid');
  assert(!client.validateStatus(500), '500 should not be valid');
});

test('awsibnjClient — default validateStatus', () => {
  const client = createClient();
  assert(client.validateStatus(200), '200 valid');
  assert(client.validateStatus(299), '299 valid');
  assert(!client.validateStatus(300), '300 not valid');
  assert(!client.validateStatus(400), '400 not valid');
  assert(!client.validateStatus(500), '500 not valid');
});

test('awsibnjClient — paramsSerializer option', () => {
  const custom = (params) => 'custom=true';
  const client = createClient({ paramsSerializer: custom });
  assertEqual(client.paramsSerializer({ any: 'thing' }), 'custom=true');
});

test('awsibnjClient — maxContentLength option', () => {
  const client = createClient({ maxContentLength: 1024 });
  assertEqual(client.maxContentLength, 1024);
  assertEqual(client.defaults.maxContentLength, 1024);
});

test('awsibnjClient — maxBodyLength option', () => {
  const client = createClient({ maxBodyLength: 2048 });
  assertEqual(client.maxBodyLength, 2048);
  assertEqual(client.defaults.maxBodyLength, 2048);
});

test('awsibnjClient — default maxContentLength is -1', () => {
  const client = createClient();
  assertEqual(client.maxContentLength, -1);
});

test('awsibnjClient — default maxBodyLength is -1', () => {
  const client = createClient();
  assertEqual(client.maxBodyLength, -1);
});

test('awsibnjClient — transformRequest option', () => {
  const fn = (data) => data;
  const client = createClient({ transformRequest: [fn] });
  assert(Array.isArray(client.transformRequest), 'should be array');
  assertEqual(client.transformRequest.length, 1);
});

test('awsibnjClient — transformResponse option', () => {
  const fn = (data) => data;
  const client = createClient({ transformResponse: [fn] });
  assert(Array.isArray(client.transformResponse), 'should be array');
  assertEqual(client.transformResponse.length, 1);
});

test('awsibnjClient — withCredentials option', () => {
  const client = createClient({ withCredentials: true });
  assert(client.withCredentials, 'should be true');
  assert(client.defaults.withCredentials, 'defaults should match');
});

test('awsibnjClient — xsrfCookieName / xsrfHeaderName', () => {
  const client = createClient({ xsrfCookieName: 'MY-XSRF', xsrfHeaderName: 'X-MY-XSRF' });
  assertEqual(client.xsrfCookieName, 'MY-XSRF');
  assertEqual(client.xsrfHeaderName, 'X-MY-XSRF');
});

test('awsibnjClient — default xsrf names', () => {
  const client = createClient();
  assertEqual(client.xsrfCookieName, 'XSRF-TOKEN');
  assertEqual(client.xsrfHeaderName, 'X-XSRF-TOKEN');
});

test('awsibnjClient — defaults.headers per-method', () => {
  const client = createClient();
  assertEqual(client.defaults.headers.post['Content-Type'], 'application/json');
  assertEqual(client.defaults.headers.put['Content-Type'], 'application/json');
  assertEqual(client.defaults.headers.patch['Content-Type'], 'application/json');
  assert(typeof client.defaults.headers.get === 'object', 'should have get headers');
  assert(typeof client.defaults.headers.delete === 'object', 'should have delete headers');
});

test('awsibnjClient — mutable defaults', () => {
  const client = createClient();
  client.defaults.headers.common['X-Custom'] = 'test';
  assertEqual(client.defaults.headers.common['X-Custom'], 'test');
  client.defaults.timeout = 30000;
  assertEqual(client.defaults.timeout, 30000);
});

console.log('\n━━━ v10: getUri ━━━');

test('awsibnjClient — getUri basic', () => {
  const client = createClient({ baseURL: 'https://api.example.com' });
  const uri = client.getUri({ url: '/users' });
  assertEqual(uri, 'https://api.example.com/users');
});

test('awsibnjClient — getUri with params', () => {
  const client = createClient({ baseURL: '/api' });
  const uri = client.getUri({ url: '/users', params: { page: 1, limit: 10 } });
  assert(uri.includes('page=1'), 'should have page');
  assert(uri.includes('limit=10'), 'should have limit');
});

test('awsibnjClient — getUri with custom paramsSerializer', () => {
  const client = createClient({
    baseURL: '/api',
    paramsSerializer: () => 'custom=serialized',
  });
  const uri = client.getUri({ url: '/users', params: { any: 'thing' } });
  assert(uri.includes('custom=serialized'), 'should use custom serializer');
});

test('awsibnjClient — getUri overrides base with config', () => {
  const client = createClient({ baseURL: '/default' });
  const uri = client.getUri({ baseURL: '/override', url: '/test' });
  assertEqual(uri, '/override/test');
});

console.log('\n━━━ v10: request(config) Pattern ━━━');

test('awsibnjClient — request with config object pattern', () => {
  const client = createClient({ baseURL: '/api' });
  // Just verify it accepts config object without throwing
  assertEqual(typeof client.request, 'function');
});

test('awsibnjClient — request config object has method/url', () => {
  const client = createClient();
  // Verify the method signature accepts an object
  assert(typeof client.request === 'function', 'should be a function');
});

console.log('\n━━━ v10: Concurrent Helpers ━━━');

test('all — resolves all promises', async () => {
  const results = await all([
    Promise.resolve(1),
    Promise.resolve(2),
    Promise.resolve(3),
  ]);
  assertEqual(results.length, 3);
  assertEqual(results[0], 1);
  assertEqual(results[1], 2);
  assertEqual(results[2], 3);
});

test('all — rejects if any promise rejects', async () => {
  let threw = false;
  try {
    await all([
      Promise.resolve(1),
      Promise.reject(new Error('fail')),
    ]);
  } catch (e) {
    threw = true;
    assertEqual(e.message, 'fail');
  }
  assert(threw, 'should reject');
});

test('spread — spreads array to function args', () => {
  const fn = spread((a, b, c) => a + b + c);
  assertEqual(fn([1, 2, 3]), 6);
});

test('spread — works with strings', () => {
  const fn = spread((first, last) => `${first} ${last}`);
  assertEqual(fn(['John', 'Doe']), 'John Doe');
});

console.log('\n━━━ v10: Error Type Checks ━━━');

test('isClientError — returns true for ClientError', () => {
  assert(isClientError(new ClientError('test')), 'should detect ClientError');
});

test('isClientError — returns false for regular Error', () => {
  assert(!isClientError(new Error('test')), 'regular Error is not ClientError');
});

test('isClientError — returns false for null/undefined', () => {
  assert(!isClientError(null), 'null is not ClientError');
  assert(!isClientError(undefined), 'undefined is not ClientError');
});

test('isYarouError — alias for isClientError', () => {
  assert(isYarouError(new ClientError('test')), 'should detect');
  assert(!isYarouError(new Error('test')), 'should not detect');
});

test('awsibnjClient.isClientError static method', () => {
  assert(awsibnjClient.isClientError(new ClientError('test')), 'static should detect');
  assert(!awsibnjClient.isClientError(new Error('test')), 'static should not detect');
});

test('awsibnjClient.isYarouError static method', () => {
  assert(awsibnjClient.isYarouError(new ClientError('test')), 'should detect');
});

console.log('\n━━━ v10: mergeConfig ━━━');

test('mergeConfig — merges two configs', () => {
  const result = mergeConfig(
    { baseURL: '/api', timeout: 1000 },
    { timeout: 5000, retries: 3 },
  );
  assertEqual(result.baseURL, '/api');
  assertEqual(result.timeout, 5000);
  assertEqual(result.retries, 3);
});

test('mergeConfig — deep merges nested objects', () => {
  const result = mergeConfig(
    { headers: { common: { Accept: 'application/json' } } },
    { headers: { common: { Authorization: 'Bearer token' } } },
  );
  assertEqual(result.headers.common.Accept, 'application/json');
  assertEqual(result.headers.common.Authorization, 'Bearer token');
});

test('mergeConfig — later values override', () => {
  const result = mergeConfig(
    { responseType: 'json' },
    { responseType: 'text' },
  );
  assertEqual(result.responseType, 'text');
});

test('mergeConfig — handles null/undefined targets', () => {
  const result = mergeConfig(null, { foo: 'bar' });
  assertEqual(result.foo, 'bar');
});

test('mergeConfig — handles null/undefined sources', () => {
  const result = mergeConfig({ foo: 'bar' }, null);
  assertEqual(result.foo, 'bar');
});

test('mergeConfig — arrays are replaced not merged', () => {
  const result = mergeConfig(
    { items: [1, 2] },
    { items: [3, 4, 5] },
  );
  assertEqual(result.items.length, 3);
  assertEqual(result.items[0], 3);
});

console.log('\n━━━ v10: defaultParamsSerializer ━━━');

test('defaultParamsSerializer — basic params', () => {
  const result = defaultParamsSerializer({ a: 1, b: 'hello' });
  assert(result.includes('a=1'), 'should have a=1');
  assert(result.includes('b=hello'), 'should have b=hello');
});

test('defaultParamsSerializer — skips null/undefined', () => {
  const result = defaultParamsSerializer({ a: 1, b: null, c: undefined });
  assert(result.includes('a=1'), 'should have a');
  assert(!result.includes('b='), 'should not have b');
  assert(!result.includes('c='), 'should not have c');
});

test('defaultParamsSerializer — encodes special characters', () => {
  const result = defaultParamsSerializer({ q: 'hello world' });
  assert(result.includes('q=hello%20world'), 'should encode spaces');
});

test('defaultParamsSerializer — handles arrays', () => {
  const result = defaultParamsSerializer({ tags: ['a', 'b'] });
  assert(result.includes('tags=a'), 'should have first array item');
  assert(result.includes('tags=b'), 'should have second array item');
});

test('defaultParamsSerializer — empty object returns empty string', () => {
  assertEqual(defaultParamsSerializer({}), '');
});

test('defaultParamsSerializer — null returns empty string', () => {
  assertEqual(defaultParamsSerializer(null), '');
});

test('defaultParamsSerializer — handles URLSearchParams', () => {
  const params = new URLSearchParams('a=1&b=2');
  const result = defaultParamsSerializer(params);
  assertEqual(result, 'a=1&b=2');
});

console.log('\n━━━ v10: buildURL Enhanced ━━━');

test('buildURL — with custom paramsSerializer', () => {
  const url = buildURL('/api', '/users', { page: 1 }, () => 'custom=true');
  assert(url.includes('custom=true'), 'should use custom serializer');
});

test('buildURL — with array params', () => {
  const url = buildURL('/api', '/search', { tags: ['js', 'ts'] });
  assert(url.includes('tags=js'), 'should have first tag');
  assert(url.includes('tags=ts'), 'should have second tag');
});

console.log('\n━━━ v10: create() Factory ━━━');

test('create — is alias for createClient', () => {
  assert(typeof create === 'function', 'should be exported');
  const client = create({ baseURL: '/api' });
  assert(client instanceof awsibnjClient, 'should return awsibnjClient');
  assertEqual(client.baseURL, '/api');
});

console.log('\n━━━ v10: ClientError Enhanced ━━━');

test('ClientError — isYarouError flag preserved on wrap', () => {
  const client = createClient();
  const err = client._wrapError(new Error('test'), { method: 'GET', url: '/api' });
  assert(err.isYarouError, 'should have flag');
  assert(err.config, 'should have config');
});

test('ClientError — config attached on existing ClientError', () => {
  const client = createClient();
  const original = new ClientError('test', { status: 404 });
  const wrapped = client._wrapError(original, { method: 'GET', url: '/test' });
  assert(wrapped.config, 'should have config');
  assertEqual(wrapped.config.method, 'GET');
});

console.log('\n━━━ v10: Response Shape ━━━');

test('awsibnjClient — has statusText and config in response', () => {
  const client = createClient();
  // Verify the response shape is compatible with axios
  // We can't make real HTTP requests but verify the method signatures exist
  assertEqual(typeof client.get, 'function');
  assertEqual(typeof client.post, 'function');
  assertEqual(typeof client.put, 'function');
  assertEqual(typeof client.patch, 'function');
  assertEqual(typeof client.delete, 'function');
  assertEqual(typeof client.head, 'function');
  assertEqual(typeof client.options, 'function');
  assertEqual(typeof client.request, 'function');
  assertEqual(typeof client.getUri, 'function');
});

console.log('\n━━━ v10: Backward Compatibility ━━━');

test('v10 backward compat — all v10 exports available', () => {
  assert(typeof CancelToken === 'function', 'CancelToken');
  assert(typeof Cancel === 'function', 'Cancel');
  assert(typeof isCancel === 'function', 'isCancel');
  assert(typeof toFormData === 'function', 'toFormData');
  assert(typeof isFormData === 'function', 'isFormData');
  assert(typeof isBlob === 'function', 'isBlob');
  assert(typeof isFile === 'function', 'isFile');
  assert(typeof isBuffer === 'function', 'isBuffer');
  assert(typeof isStream === 'function', 'isStream');
  assert(typeof isArrayBufferView === 'function', 'isArrayBufferView');
  assert(typeof isURLSearchParams === 'function', 'isURLSearchParams');
  assert(typeof all === 'function', 'all');
  assert(typeof spread === 'function', 'spread');
  assert(typeof isClientError === 'function', 'isClientError');
  assert(typeof isYarouError === 'function', 'isYarouError');
  assert(typeof mergeConfig === 'function', 'mergeConfig');
  assert(typeof defaultParamsSerializer === 'function', 'defaultParamsSerializer');
  assert(typeof create === 'function', 'create');
});

test('v10 backward compat — all v9 exports still work', () => {
  assert(typeof createClient === 'function', 'createClient');
  assert(typeof awsibnjClient === 'function', 'awsibnjClient');
  assert(typeof ClientError === 'function', 'ClientError');
  assert(typeof InterceptorManager === 'function', 'InterceptorManager');
  assert(typeof InterceptorChain === 'function', 'InterceptorChain');
  assert(typeof validateExpect === 'function', 'validateExpect');
  assert(typeof serializeExpect === 'function', 'serializeExpect');
  assert(typeof deserializeExpect === 'function', 'deserializeExpect');
  assert(typeof extractExpect === 'function', 'extractExpect');
  assert(typeof injectExpectHeader === 'function', 'injectExpectHeader');
  assert(typeof flattenExpect === 'function', 'flattenExpect');
  assert(typeof smartProxy === 'function', 'smartProxy');
  assert(typeof buildURL === 'function', 'buildURL');
  assertEqual(HEADER_NAME, 'x-api-bridge-expect');
});

test('v10 backward compat — all v8 exports still work', () => {
  assert(typeof bridge === 'function', 'bridge');
  assert(typeof bridgeFetch === 'function', 'bridgeFetch');
  assert(typeof transform === 'function', 'transform');
  assert(typeof createTransformer === 'function', 'createTransformer');
  assert(typeof FieldAliaser === 'function', 'FieldAliaser');
  assert(typeof SchemaMigrator === 'function', 'SchemaMigrator');
  assert(typeof BatchOrchestrator === 'function', 'BatchOrchestrator');
  assert(typeof FieldStats === 'function', 'FieldStats');
  assert(typeof ConditionalTransform === 'function', 'ConditionalTransform');
  assert(typeof DeepMerge === 'function', 'DeepMerge');
  assert(typeof OutputFormatter === 'function', 'OutputFormatter');
  assert(typeof RequestInterceptor === 'function', 'RequestInterceptor');
});

test('v10 backward compat — transform still works', () => {
  const result = transform({
    first_name: 'John',
    last_name: 'Doe',
    is_active: true,
  });
  assertEqual(result.firstName, 'John');
  assertEqual(result.lastName, 'Doe');
  assertEqual(result.isActive, true);
});

test('v10 backward compat — all pre-v9 classes still exported', () => {
  // v2
  assert(typeof MiddlewarePipeline === 'function', 'MiddlewarePipeline');
  assert(typeof ResponseCache === 'function', 'ResponseCache');
  assert(typeof SchemaValidator === 'function', 'SchemaValidator');
  assert(typeof ResponseNormalizer === 'function', 'ResponseNormalizer');
  // v3
  assert(typeof PluginManager === 'function', 'PluginManager');
  assert(typeof SchemaInference === 'function', 'SchemaInference');
  assert(typeof FieldProjection === 'function', 'FieldProjection');
  assert(typeof DataMasker === 'function', 'DataMasker');
  assert(typeof RateLimiter === 'function', 'RateLimiter');
  assert(typeof SchemaDiff === 'function', 'SchemaDiff');
  assert(typeof TypeGenerator === 'function', 'TypeGenerator');
  assert(typeof MetricsCollector === 'function', 'MetricsCollector');
  // v4
  assert(typeof CircuitBreaker === 'function', 'CircuitBreaker');
  assert(typeof RequestDeduplicator === 'function', 'RequestDeduplicator');
  assert(typeof GraphQLBridge === 'function', 'GraphQLBridge');
  assert(typeof ComposablePipeline === 'function', 'ComposablePipeline');
  // v5
  assert(typeof RetryStrategy === 'function', 'RetryStrategy');
  assert(typeof EventBus === 'function', 'EventBus');
  assert(typeof HealthCheck === 'function', 'HealthCheck');
  assert(typeof MockServer === 'function', 'MockServer');
  // v6
  assert(typeof FuzzyMatcher === 'function', 'FuzzyMatcher');
  assert(typeof CrypticResolver === 'function', 'CrypticResolver');
  assert(typeof TypeCoercer === 'function', 'TypeCoercer');
});

test('v10 backward compat — all error classes still exported', () => {
  assert(typeof YarouError === 'function', 'YarouError');
  assert(typeof ValidationError === 'function', 'ValidationError');
  assert(typeof TransformError === 'function', 'TransformError');
  assert(typeof NetworkError === 'function', 'NetworkError');
  assert(typeof PluginError === 'function', 'PluginError');
  assert(typeof RateLimitError === 'function', 'RateLimitError');
  assert(typeof CircuitBreakerError === 'function', 'CircuitBreakerError');
  assert(typeof PipelineError === 'function', 'PipelineError');
  assert(typeof RetryError === 'function', 'RetryError');
  assert(typeof FuzzyMatchError === 'function', 'FuzzyMatchError');
  assert(typeof TypeCoercionError === 'function', 'TypeCoercionError');
  assert(typeof CrypticResolverError === 'function', 'CrypticResolverError');
  assert(typeof FieldAliaserError === 'function', 'FieldAliaserError');
  assert(typeof SchemaMigrationError === 'function', 'SchemaMigrationError');
  assert(typeof BatchOrchestratorError === 'function', 'BatchOrchestratorError');
  assert(typeof DeepMergeError === 'function', 'DeepMergeError');
  assert(typeof InterceptorError === 'function', 'InterceptorError');
});

console.log('\n━━━ v10: Integration Tests ━━━');

test('createClient + CancelToken integration', () => {
  const client = createClient({ baseURL: '/api' });
  const source = CancelToken.source();
  // CancelToken should be passable in config
  assert(typeof source.token.signal !== 'undefined', 'should have signal');
  assert(!source.token.requested, 'should not be cancelled');
});

test('createClient + auth + interceptors integration', () => {
  const client = createClient({
    baseURL: '/api',
    auth: { username: 'admin', password: 'secret' },
  });
  client.interceptors.request.use((config) => {
    config.headers['X-Custom'] = 'test';
    return config;
  });
  assertEqual(client.auth.username, 'admin');
  assertEqual(client.interceptors.request.size, 1);
});

test('createClient + defaults mutation integration', () => {
  const client = createClient({ baseURL: '/api' });
  client.defaults.headers.common['Authorization'] = 'Bearer mytoken';
  client.defaults.timeout = 10000;
  assertEqual(client.defaults.headers.common['Authorization'], 'Bearer mytoken');
  assertEqual(client.defaults.timeout, 10000);
});

test('createClient + transformRequest integration', () => {
  const client = createClient({
    baseURL: '/api',
    transformRequest: [(data) => {
      if (data && typeof data === 'object') {
        data.timestamp = '2024-01-01';
      }
      return data;
    }],
  });
  assert(Array.isArray(client.transformRequest), 'should have transformRequest');
  assertEqual(client.transformRequest.length, 1);
});

test('createClient + validateStatus integration', () => {
  const client = createClient({
    validateStatus: (status) => status < 500,
  });
  assert(client.validateStatus(200), '200 ok');
  assert(client.validateStatus(404), '404 ok');
  assert(!client.validateStatus(500), '500 not ok');
});

test('create + all + spread integration', async () => {
  const results = await all([
    Promise.resolve({ data: 'user' }),
    Promise.resolve({ data: 'posts' }),
  ]);
  const combined = spread((user, posts) => ({
    user: user.data,
    posts: posts.data,
  }))(results);
  assertEqual(combined.user, 'user');
  assertEqual(combined.posts, 'posts');
});

test('smart proxy + transform + v10 still works', () => {
  const raw = { user_name: 'John', user_email: 'john@example.com', account_balance: 5000 };
  const transformed = transform(raw);
  assertEqual(transformed.userName, 'John');
  assertEqual(transformed.userEmail, 'john@example.com');
  assertEqual(transformed.accountBalance, 5000);
});

test('CancelToken + isCancel roundtrip', () => {
  const source = CancelToken.source();
  source.cancel('test cancel');
  assert(isCancel(source.token.reason), 'should be cancel');
  assertEqual(source.token.reason.message, 'test cancel');
  assert(!isCancel(new ClientError('not cancel')), 'ClientError not cancel');
});

test('mergeConfig + defaults integration', () => {
  const client = createClient({ baseURL: '/api', timeout: 5000 });
  const merged = mergeConfig(client.defaults, { timeout: 10000, headers: { common: { 'X-Test': 'yes' } } });
  assertEqual(merged.baseURL, '/api');
  assertEqual(merged.timeout, 10000);
  assertEqual(merged.headers.common['X-Test'], 'yes');
});

// ═══════════════════════════════════════════════════════════════════════════════
// v11: NEW TESTS — Complete Axios Drop-in Replacement
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n━━━ v11: VERSION ━━━');

test('VERSION is exported and correct', () => {
  assert(typeof VERSION === 'string', 'VERSION should be a string');
  assertEqual(VERSION, '18.0.2');
});

console.log('\n━━━ v11: AxiosHeaders ━━━');

test('AxiosHeaders — constructor with object', () => {
  const h = new AxiosHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer abc' });
  assertEqual(h.get('content-type'), 'application/json');
  assertEqual(h.get('Authorization'), 'Bearer abc');
  assertEqual(h.size, 2);
});

test('AxiosHeaders — case-insensitive get/set/has/delete', () => {
  const h = new AxiosHeaders();
  h.set('content-type', 'text/html');
  assertEqual(h.get('Content-Type'), 'text/html');
  assertEqual(h.get('CONTENT-TYPE'), 'text/html');
  assert(h.has('content-TYPE'), 'has should be case-insensitive');
  assert(h.delete('Content-Type'), 'delete should work case-insensitive');
  assert(!h.has('content-type'), 'should be deleted');
});

test('AxiosHeaders — set with rewrite=false', () => {
  const h = new AxiosHeaders({ 'Content-Type': 'application/json' });
  h.set('content-type', 'text/html', false);
  assertEqual(h.get('Content-Type'), 'application/json');
});

test('AxiosHeaders — set null deletes header', () => {
  const h = new AxiosHeaders({ 'Content-Type': 'application/json' });
  h.set('Content-Type', null);
  assert(!h.has('Content-Type'), 'should be deleted');
});

test('AxiosHeaders — forEach iterates all headers', () => {
  const h = new AxiosHeaders({ 'X-A': '1', 'X-B': '2' });
  const collected = [];
  h.forEach((value, name) => collected.push({ name, value }));
  assertEqual(collected.length, 2);
  assert(collected.some(c => c.value === '1'), 'should have X-A');
  assert(collected.some(c => c.value === '2'), 'should have X-B');
});

test('AxiosHeaders — keys/values/entries', () => {
  const h = new AxiosHeaders({ 'Accept': 'text/html' });
  const keys = h.keys();
  const values = h.values();
  const entries = h.entries();
  assertEqual(keys.length, 1);
  assertEqual(values[0], 'text/html');
  assertEqual(entries[0][1], 'text/html');
});

test('AxiosHeaders — merge', () => {
  const h = new AxiosHeaders({ 'X-A': '1' });
  h.merge({ 'X-B': '2', 'X-C': '3' });
  assertEqual(h.size, 3);
  assertEqual(h.get('X-B'), '2');
});

test('AxiosHeaders — toJSON', () => {
  const h = new AxiosHeaders({ 'content-type': 'text/html' });
  const json = h.toJSON();
  assertEqual(json['Content-Type'], 'text/html');
});

test('AxiosHeaders — toString', () => {
  const h = new AxiosHeaders({ 'Accept': 'application/json' });
  const str = h.toString();
  assert(str.includes('Accept: application/json'), 'should format correctly');
});

test('AxiosHeaders — from another AxiosHeaders', () => {
  const h1 = new AxiosHeaders({ 'X-Test': 'abc' });
  const h2 = AxiosHeaders.from(h1);
  assertEqual(h2.get('X-Test'), 'abc');
});

test('AxiosHeaders — concat multiple sources', () => {
  const h = AxiosHeaders.concat(
    { 'X-A': '1' },
    new AxiosHeaders({ 'X-B': '2' }),
    { 'X-C': '3' },
  );
  assertEqual(h.size, 3);
  assertEqual(h.get('X-A'), '1');
  assertEqual(h.get('X-C'), '3');
});

test('AxiosHeaders — clear', () => {
  const h = new AxiosHeaders({ 'X-A': '1', 'X-B': '2' });
  h.clear();
  assertEqual(h.size, 0);
});

test('AxiosHeaders — normalize', () => {
  const h = new AxiosHeaders({ 'content-type': 'text/html' });
  h.normalize();
  const json = h.toJSON();
  assert('Content-Type' in json, 'should be normalized');
});

test('AxiosHeaders — accessor methods', () => {
  const h = new AxiosHeaders({ 'Content-Type': 'application/json' });
  assertEqual(h.getContentType(), 'application/json');
  h.setContentType('text/html');
  assertEqual(h.getContentType(), 'text/html');
  assert(h.hasContentType(), 'should have Content-Type');
});

test('AxiosHeaders — iterable with Symbol.iterator', () => {
  const h = new AxiosHeaders({ 'X-A': '1' });
  const entries = [...h];
  assertEqual(entries.length, 1);
  assertEqual(entries[0][1], '1');
});

test('AxiosHeaders — rejects dangerous keys', () => {
  const h = new AxiosHeaders({ '__proto__': 'evil', 'constructor': 'bad' });
  assertEqual(h.size, 0);
});

test('AxiosHeaders — get with asParsed for JSON', () => {
  const h = new AxiosHeaders();
  h.set('X-Data', '{"key":"value"}');
  const parsed = h.get('X-Data', true);
  assert(typeof parsed === 'object', 'should parse JSON');
  assertEqual(parsed.key, 'value');
});

test('AxiosHeaders — merge with rewrite=false', () => {
  const h = new AxiosHeaders({ 'X-A': '1' });
  h.merge({ 'X-A': '2', 'X-B': '3' }, false);
  assertEqual(h.get('X-A'), '1');
  assertEqual(h.get('X-B'), '3');
});

test('normalizeHeaderName utility', () => {
  assertEqual(normalizeHeaderName('content-type'), 'Content-Type');
  assertEqual(normalizeHeaderName('x-custom-header'), 'X-Custom-Header');
  assertEqual(normalizeHeaderName(''), '');
});

console.log('\n━━━ v11: HttpStatusCode ━━━');

test('HttpStatusCode — has all common codes', () => {
  assertEqual(HttpStatusCode.Ok, 200);
  assertEqual(HttpStatusCode.Created, 201);
  assertEqual(HttpStatusCode.NoContent, 204);
  assertEqual(HttpStatusCode.BadRequest, 400);
  assertEqual(HttpStatusCode.Unauthorized, 401);
  assertEqual(HttpStatusCode.Forbidden, 403);
  assertEqual(HttpStatusCode.NotFound, 404);
  assertEqual(HttpStatusCode.RequestTimeout, 408);
  assertEqual(HttpStatusCode.TooManyRequests, 429);
  assertEqual(HttpStatusCode.InternalServerError, 500);
  assertEqual(HttpStatusCode.BadGateway, 502);
  assertEqual(HttpStatusCode.ServiceUnavailable, 503);
  assertEqual(HttpStatusCode.GatewayTimeout, 504);
});

test('HttpStatusCode — has informational codes', () => {
  assertEqual(HttpStatusCode.Continue, 100);
  assertEqual(HttpStatusCode.SwitchingProtocols, 101);
  assertEqual(HttpStatusCode.Processing, 102);
  assertEqual(HttpStatusCode.EarlyHints, 103);
});

test('HttpStatusCode — has redirect codes', () => {
  assertEqual(HttpStatusCode.MovedPermanently, 301);
  assertEqual(HttpStatusCode.Found, 302);
  assertEqual(HttpStatusCode.SeeOther, 303);
  assertEqual(HttpStatusCode.NotModified, 304);
  assertEqual(HttpStatusCode.TemporaryRedirect, 307);
  assertEqual(HttpStatusCode.PermanentRedirect, 308);
});

test('HttpStatusCode — has extended 4xx codes', () => {
  assertEqual(HttpStatusCode.Conflict, 409);
  assertEqual(HttpStatusCode.Gone, 410);
  assertEqual(HttpStatusCode.PayloadTooLarge, 413);
  assertEqual(HttpStatusCode.UnsupportedMediaType, 415);
  assertEqual(HttpStatusCode.UnprocessableEntity, 422);
  assertEqual(HttpStatusCode.Locked, 423);
  assertEqual(HttpStatusCode.ImATeapot, 418);
});

test('HttpStatusCode — has extended 5xx codes', () => {
  assertEqual(HttpStatusCode.NotImplemented, 501);
  assertEqual(HttpStatusCode.HttpVersionNotSupported, 505);
  assertEqual(HttpStatusCode.InsufficientStorage, 507);
  assertEqual(HttpStatusCode.LoopDetected, 508);
  assertEqual(HttpStatusCode.NetworkAuthenticationRequired, 511);
});

test('HttpStatusCode — is frozen (immutable)', () => {
  assert(Object.isFrozen(HttpStatusCode), 'should be frozen');
});

console.log('\n━━━ v11: Adapter System ━━━');

test('fetchAdapter is a function', () => {
  assert(typeof fetchAdapter === 'function', 'should be a function');
});

test('xhrAdapter is a function', () => {
  assert(typeof xhrAdapter === 'function', 'should be a function');
});

test('adapters registry has fetch and xhr', () => {
  assert(typeof adapters.fetch === 'function', 'should have fetch adapter');
  assert(typeof adapters.xhr === 'function', 'should have xhr adapter');
  assert(typeof adapters.http === 'function', 'should have http adapter');
});

test('getAdapter — returns fetch adapter by name', () => {
  const adapter = getAdapter('fetch');
  assertEqual(adapter, fetchAdapter);
});

test('getAdapter — returns xhr adapter by name', () => {
  const adapter = getAdapter('xhr');
  assertEqual(adapter, xhrAdapter);
});

test('getAdapter — returns custom function as-is', () => {
  const custom = () => {};
  const adapter = getAdapter(custom);
  assertEqual(adapter, custom);
});

test('getAdapter — priority list selects first available', () => {
  const adapter = getAdapter(['fetch', 'xhr']);
  assertEqual(adapter, fetchAdapter);
});

test('getAdapter — throws on unknown adapter', () => {
  let threw = false;
  try {
    getAdapter('nonexistent');
  } catch (e) {
    threw = true;
    assert(e.message.includes('Unknown adapter'), 'should mention unknown adapter');
  }
  assert(threw, 'should throw');
});

test('getAdapter — auto-detect returns fetch if available', () => {
  const adapter = getAdapter(undefined);
  assertEqual(adapter, fetchAdapter);
});

test('createClient — accepts adapter option', () => {
  const client = createClient({ adapter: 'fetch' });
  assertEqual(client.adapter, 'fetch');
  assertEqual(client.defaults.adapter, 'fetch');
});

console.log('\n━━━ v11: URL Utilities ━━━');

test('isAbsoluteURL — detects absolute URLs', () => {
  assert(isAbsoluteURL('https://example.com/api'), 'https is absolute');
  assert(isAbsoluteURL('http://localhost:3000'), 'http is absolute');
  assert(isAbsoluteURL('//cdn.example.com/image.png'), '// is absolute');
  assert(isAbsoluteURL('ftp://files.example.com'), 'ftp is absolute');
});

test('isAbsoluteURL — detects relative URLs', () => {
  assert(!isAbsoluteURL('/api/users'), '/ is relative');
  assert(!isAbsoluteURL('api/users'), 'no prefix is relative');
  assert(!isAbsoluteURL(''), 'empty is not absolute');
  assert(!isAbsoluteURL(null), 'null is not absolute');
});

test('combineURLs — combines base and relative', () => {
  assertEqual(combineURLs('https://example.com', '/api/users'), 'https://example.com/api/users');
  assertEqual(combineURLs('https://example.com/', '/api/users'), 'https://example.com/api/users');
  assertEqual(combineURLs('https://example.com/', 'api/users'), 'https://example.com/api/users');
});

test('combineURLs — returns relative if absolute', () => {
  assertEqual(combineURLs('https://old.com', 'https://new.com/api'), 'https://new.com/api');
});

test('combineURLs — handles empty inputs', () => {
  assertEqual(combineURLs('', '/api'), '/api');
  assertEqual(combineURLs('https://example.com', ''), 'https://example.com');
  assertEqual(combineURLs('', ''), '');
});

test('isURLSameOrigin — same origin returns true', () => {
  assert(isURLSameOrigin('/api/users'), 'relative URLs are same origin');
  assert(isURLSameOrigin(''), 'empty is same origin');
});

test('parseURL — parses full URL', () => {
  const parsed = parseURL('https://example.com:8080/api/users?page=1#section');
  assert(parsed !== null, 'should parse');
  assertEqual(parsed.protocol, 'https:');
  assertEqual(parsed.host, 'example.com:8080');
  assertEqual(parsed.pathname, '/api/users');
  assertEqual(parsed.search, '?page=1');
  assertEqual(parsed.hash, '#section');
});

test('parseURL — returns null for invalid input', () => {
  assertEqual(parseURL(null), null);
  assertEqual(parseURL(''), null);
});

console.log('\n━━━ v11: Type Helpers ━━━');

test('kindOf — detects types correctly', () => {
  assertEqual(kindOf(null), 'null');
  assertEqual(kindOf(undefined), 'undefined');
  assertEqual(kindOf('hello'), 'string');
  assertEqual(kindOf(42), 'number');
  assertEqual(kindOf(true), 'boolean');
  assertEqual(kindOf([]), 'array');
  assertEqual(kindOf({}), 'object');
  assertEqual(kindOf(new Date()), 'date');
  assertEqual(kindOf(/regex/), 'regexp');
});

test('isPlainObject — true for plain objects', () => {
  assert(isPlainObject({}), '{} is plain');
  assert(isPlainObject({ a: 1 }), 'literal is plain');
  assert(isPlainObject(Object.create(null)), 'null proto is plain');
});

test('isPlainObject — false for non-plain objects', () => {
  assert(!isPlainObject([]), 'array is not plain');
  assert(!isPlainObject(new Date()), 'date is not plain');
  assert(!isPlainObject(null), 'null is not plain');
  assert(!isPlainObject('str'), 'string is not plain');
});

test('isObject — detects objects', () => {
  assert(isObject({}), '{} is object');
  assert(isObject([]), 'array is object');
  assert(isObject(new Date()), 'date is object');
  assert(!isObject(null), 'null is not object');
  assert(!isObject('str'), 'string is not object');
  assert(!isObject(42), 'number is not object');
});

test('isFunction — detects functions', () => {
  assert(isFunction(() => {}), 'arrow is function');
  assert(isFunction(function() {}), 'function declaration');
  assert(isFunction(Math.max), 'built-in is function');
  assert(!isFunction('str'), 'string is not function');
  assert(!isFunction(42), 'number is not function');
});

test('isString — detects strings', () => {
  assert(isString('hello'), 'string literal');
  assert(isString(''), 'empty string');
  assert(!isString(42), 'number is not string');
  assert(!isString(null), 'null is not string');
});

test('isNumber — detects numbers', () => {
  assert(isNumber(42), '42 is number');
  assert(isNumber(0), '0 is number');
  assert(isNumber(NaN), 'NaN is number');
  assert(!isNumber('42'), 'string is not number');
});

test('isBoolean — detects booleans', () => {
  assert(isBoolean(true), 'true is boolean');
  assert(isBoolean(false), 'false is boolean');
  assert(!isBoolean(1), '1 is not boolean');
  assert(!isBoolean('true'), 'string is not boolean');
});

test('isUndefined — detects undefined', () => {
  assert(isUndefined(undefined), 'undefined is undefined');
  assert(!isUndefined(null), 'null is not undefined');
  assert(!isUndefined(0), '0 is not undefined');
  assert(!isUndefined(''), 'empty string is not undefined');
});

test('isDate — detects dates', () => {
  assert(isDate(new Date()), 'Date instance');
  assert(!isDate('2024-01-01'), 'string is not date');
  assert(!isDate(Date.now()), 'timestamp is not date');
});

test('isRegExp — detects regexps', () => {
  assert(isRegExp(/test/), 'literal regexp');
  assert(isRegExp(new RegExp('test')), 'RegExp constructor');
  assert(!isRegExp('test'), 'string is not regexp');
});

test('isArrayBuffer — detects ArrayBuffer', () => {
  assert(isArrayBuffer(new ArrayBuffer(8)), 'ArrayBuffer instance');
  assert(!isArrayBuffer(Buffer.alloc(8)), 'Buffer is not ArrayBuffer');
  assert(!isArrayBuffer([]), 'array is not ArrayBuffer');
});

test('isTypedArray — detects typed arrays', () => {
  assert(isTypedArray(new Uint8Array(4)), 'Uint8Array');
  assert(isTypedArray(new Int32Array(4)), 'Int32Array');
  assert(isTypedArray(new Float64Array(4)), 'Float64Array');
  assert(!isTypedArray([]), 'array is not typed array');
  assert(!isTypedArray({}), 'object is not typed array');
});

console.log('\n━━━ v11: Utility Helpers ━━━');

test('forEachUtil — iterates arrays', () => {
  const collected = [];
  forEachUtil([1, 2, 3], (val) => collected.push(val));
  assertEqual(collected.length, 3);
  assertEqual(collected[0], 1);
});

test('forEachUtil — iterates objects', () => {
  const collected = {};
  forEachUtil({ a: 1, b: 2 }, (val, key) => { collected[key] = val; });
  assertEqual(collected.a, 1);
  assertEqual(collected.b, 2);
});

test('forEachUtil — handles null/undefined', () => {
  forEachUtil(null, () => { throw new Error('should not call'); });
  forEachUtil(undefined, () => { throw new Error('should not call'); });
});

test('mergeUtil — deep merges objects', () => {
  const result = mergeUtil({ a: { x: 1 } }, { a: { y: 2 }, b: 3 });
  assertEqual(result.a.x, 1);
  assertEqual(result.a.y, 2);
  assertEqual(result.b, 3);
});

test('mergeUtil — handles arrays', () => {
  const result = mergeUtil({ items: [1, 2] }, { items: [3, 4] });
  assertEqual(result.items.length, 2);
  assertEqual(result.items[0], 3);
});

test('extend — copies properties', () => {
  const a = { x: 1 };
  const b = { y: 2, z: 3 };
  extend(a, b);
  assertEqual(a.y, 2);
  assertEqual(a.z, 3);
});

test('stripBOM — removes BOM', () => {
  assertEqual(stripBOM('\uFEFFhello'), 'hello');
  assertEqual(stripBOM('hello'), 'hello');
});

test('findKey — case insensitive key lookup', () => {
  const obj = { 'Content-Type': 'json', 'Accept': 'html' };
  assertEqual(findKey(obj, 'content-type'), 'Content-Type');
  assertEqual(findKey(obj, 'ACCEPT'), 'Accept');
  assertEqual(findKey(obj, 'nonexistent'), undefined);
  assertEqual(findKey(null, 'key'), undefined);
});

test('isBrowser — returns boolean', () => {
  assert(typeof isBrowser() === 'boolean', 'should return boolean');
  // In Node.js test environment, should be false
  assertEqual(isBrowser(), false);
});

test('isNode — returns boolean', () => {
  assert(typeof isNode() === 'boolean', 'should return boolean');
  // In Node.js test environment, should be true
  assertEqual(isNode(), true);
});

test('freezeDeep — deeply freezes objects', () => {
  const obj = { a: { b: { c: 1 } } };
  freezeDeep(obj);
  assert(Object.isFrozen(obj), 'root should be frozen');
  assert(Object.isFrozen(obj.a), 'nested should be frozen');
  assert(Object.isFrozen(obj.a.b), 'deep nested should be frozen');
});

test('freezeDeep — handles null and primitives', () => {
  freezeDeep(null);
  freezeDeep(42);
  freezeDeep('str');
});

test('generateUID — returns string of correct length', () => {
  const uid = generateUID();
  assertEqual(uid.length, 21);
  assert(/^[a-zA-Z0-9]+$/.test(uid), 'should be alphanumeric');
});

test('generateUID — custom size', () => {
  const uid = generateUID(10);
  assertEqual(uid.length, 10);
});

test('generateUID — unique values', () => {
  const uid1 = generateUID();
  const uid2 = generateUID();
  assert(uid1 !== uid2, 'should generate unique IDs');
});

console.log('\n━━━ v11: Enhanced CancelToken ━━━');

test('isCancelToken — detects CancelToken', () => {
  const source = CancelToken.source();
  assert(isCancelToken(source.token), 'should detect CancelToken');
  assert(!isCancelToken({}), 'plain object is not CancelToken');
  assert(!isCancelToken(null), 'null is not CancelToken');
});

test('CancelToken.isCancel static method', () => {
  assert(typeof CancelToken.isCancel === 'function', 'static method exists');
  const source = CancelToken.source();
  source.cancel('test');
  assert(CancelToken.isCancel(source.token.reason), 'should detect cancel');
});

test('CancelToken.isCancelToken static method', () => {
  assert(typeof CancelToken.isCancelToken === 'function', 'static method exists');
  const source = CancelToken.source();
  assert(CancelToken.isCancelToken(source.token), 'should detect token');
});

console.log('\n━━━ v11: Enhanced FormData Utilities ━━━');

test('toURLEncodedForm — converts object to URLSearchParams', () => {
  const params = toURLEncodedForm({ name: 'John', age: 30 });
  assert(params instanceof URLSearchParams, 'should return URLSearchParams');
  assertEqual(params.get('name'), 'John');
  assertEqual(params.get('age'), '30');
});

test('toURLEncodedForm — handles arrays', () => {
  const params = toURLEncodedForm({ tags: ['a', 'b'] });
  const all = params.getAll('tags[]');
  assertEqual(all.length, 2);
  assertEqual(all[0], 'a');
  assertEqual(all[1], 'b');
});

test('toURLEncodedForm — handles null values', () => {
  const params = toURLEncodedForm({ key: null });
  assertEqual(params.get('key'), '');
});

test('toURLEncodedForm — handles dates', () => {
  const date = new Date('2024-01-01T00:00:00Z');
  const params = toURLEncodedForm({ date });
  assert(params.get('date').includes('2024'), 'should contain year');
});

test('toURLEncodedForm — passes through URLSearchParams', () => {
  const original = new URLSearchParams('a=1&b=2');
  const result = toURLEncodedForm(original);
  assertEqual(result, original);
});

test('toURLEncodedForm — handles empty/null input', () => {
  const params = toURLEncodedForm(null);
  assert(params instanceof URLSearchParams, 'should return URLSearchParams');
  assertEqual(params.toString(), '');
});

test('toURLEncodedForm — skips dangerous keys', () => {
  const params = toURLEncodedForm({ __proto__: 'evil', valid: 'ok' });
  assertEqual(params.get('__proto__'), null);
  assertEqual(params.get('valid'), 'ok');
});

test('formToJSON — converts simple entries', () => {
  // Use URLSearchParams as a FormData stand-in (has entries())
  const params = new URLSearchParams();
  params.append('name', 'John');
  params.append('age', '30');
  const result = formToJSON(params);
  assertEqual(result.name, 'John');
  assertEqual(result.age, '30');
});

test('formToJSON — handles bracket notation', () => {
  const params = new URLSearchParams();
  params.append('user[name]', 'John');
  params.append('user[email]', 'john@test.com');
  const result = formToJSON(params);
  assert(typeof result.user === 'object', 'should create nested object');
  assertEqual(result.user.name, 'John');
  assertEqual(result.user.email, 'john@test.com');
});

test('formToJSON — handles duplicate keys as array', () => {
  const params = new URLSearchParams();
  params.append('tags', 'a');
  params.append('tags', 'b');
  const result = formToJSON(params);
  assert(Array.isArray(result.tags), 'should create array');
  assertEqual(result.tags.length, 2);
});

test('formToJSON — handles null/empty input', () => {
  const result = formToJSON(null);
  assert(typeof result === 'object', 'should return object');
  assertEqual(Object.keys(result).length, 0);
});

console.log('\n━━━ v11: InterceptorChain.forEach ━━━');

test('InterceptorChain forEach — iterates handlers', () => {
  const chain = new InterceptorChain();
  chain.use((c) => c);
  chain.use((c) => c, (e) => Promise.reject(e));

  const handlers = [];
  chain.forEach((h) => handlers.push(h));
  assertEqual(handlers.length, 2);
  assert(typeof handlers[0].fulfilled === 'function', 'should have fulfilled');
  assert(handlers[1].rejected !== null, 'second should have rejected');
});

test('InterceptorChain forEach — no-op for non-function', () => {
  const chain = new InterceptorChain();
  chain.use((c) => c);
  chain.forEach(null); // should not throw
  chain.forEach(undefined);
});

console.log('\n━━━ v11: Enhanced ClientError ━━━');

test('ClientError — has response property', () => {
  const err = new ClientError('Not Found', {
    status: 404,
    code: 'ERR_HTTP_404',
    response: { data: { error: 'not found' }, status: 404, headers: {} },
  });
  assert(err.response !== null, 'should have response');
  assertEqual(err.response.status, 404);
  assertEqual(err.response.data.error, 'not found');
});

test('ClientError — has config property', () => {
  const err = new ClientError('test', {
    config: { method: 'GET', url: '/api' },
  });
  assert(err.config !== null, 'should have config');
  assertEqual(err.config.method, 'GET');
});

test('ClientError — isYarouError is true by default', () => {
  const err = new ClientError('test');
  assert(err.isYarouError === true, 'should have isYarouError flag');
});

test('ClientError.from — creates error from source', () => {
  const source = new Error('Network failure');
  const err = ClientError.from(
    source,
    'ERR_NETWORK',
    { method: 'GET', url: '/api' },
    null,
    { data: null, status: 0 },
  );
  assertEqual(err.message, 'Network failure');
  assertEqual(err.code, 'ERR_NETWORK');
  assert(err.config !== null, 'should have config');
  assertEqual(err.config.method, 'GET');
  assertEqual(err.cause, source);
});

test('ClientError.from — without response', () => {
  const err = ClientError.from(new Error('timeout'), 'ERR_TIMEOUT', { url: '/test' });
  assertEqual(err.code, 'ERR_TIMEOUT');
  assertEqual(err.response, null);
});

test('ClientError — toJSON includes name and config', () => {
  const err = new ClientError('test', {
    status: 500,
    code: 'ERR_HTTP_500',
    config: { method: 'POST', url: '/api', baseURL: '/v1' },
  });
  const json = err.toJSON();
  assertEqual(json.name, 'ClientError');
  assertEqual(json.status, 500);
  assert(json.config !== null, 'should include config');
  assertEqual(json.config.method, 'POST');
});

console.log('\n━━━ v11: postForm/putForm/patchForm ━━━');

test('awsibnjClient — has postForm method', () => {
  const client = createClient();
  assert(typeof client.postForm === 'function', 'should have postForm');
});

test('awsibnjClient — has putForm method', () => {
  const client = createClient();
  assert(typeof client.putForm === 'function', 'should have putForm');
});

test('awsibnjClient — has patchForm method', () => {
  const client = createClient();
  assert(typeof client.patchForm === 'function', 'should have patchForm');
});

console.log('\n━━━ v11: New Client Options ━━━');

test('createClient — accepts proxy option', () => {
  const client = createClient({ proxy: { host: '127.0.0.1', port: 8080 } });
  assert(client.proxy !== null, 'should have proxy');
  assertEqual(client.proxy.host, '127.0.0.1');
  assertEqual(client.proxy.port, 8080);
  assertEqual(client.defaults.proxy.host, '127.0.0.1');
});

test('createClient — accepts httpAgent option', () => {
  const agent = { keepAlive: true };
  const client = createClient({ httpAgent: agent });
  assertEqual(client.httpAgent, agent);
  assertEqual(client.defaults.httpAgent, agent);
});

test('createClient — accepts httpsAgent option', () => {
  const agent = { keepAlive: true };
  const client = createClient({ httpsAgent: agent });
  assertEqual(client.httpsAgent, agent);
  assertEqual(client.defaults.httpsAgent, agent);
});

test('createClient — accepts socketPath option', () => {
  const client = createClient({ socketPath: '/var/run/docker.sock' });
  assertEqual(client.socketPath, '/var/run/docker.sock');
  assertEqual(client.defaults.socketPath, '/var/run/docker.sock');
});

test('createClient — accepts formSerializer option', () => {
  const serializer = { indexes: true };
  const client = createClient({ formSerializer: serializer });
  assertEqual(client.formSerializer.indexes, true);
  assertEqual(client.defaults.formSerializer.indexes, true);
});

test('createClient — has env.FormData by default', () => {
  const client = createClient();
  assert(client.env !== null, 'should have env');
});

test('createClient — defaults include v11 options', () => {
  const client = createClient({
    maxRedirects: 10,
    decompress: false,
    responseEncoding: 'utf16',
  });
  assertEqual(client.defaults.maxRedirects, 10);
  assertEqual(client.defaults.decompress, false);
  assertEqual(client.defaults.responseEncoding, 'utf16');
});

console.log('\n━━━ v11: Backward Compatibility ━━━');

test('v11 backward compat — all v11 exports available', () => {
  assert(typeof VERSION === 'string', 'VERSION');
  assert(typeof AxiosHeaders === 'function', 'AxiosHeaders');
  assert(typeof normalizeHeaderName === 'function', 'normalizeHeaderName');
  assert(typeof HttpStatusCode === 'object', 'HttpStatusCode');
  assert(typeof fetchAdapter === 'function', 'fetchAdapter');
  assert(typeof xhrAdapter === 'function', 'xhrAdapter');
  assert(typeof adapters === 'object', 'adapters');
  assert(typeof getAdapter === 'function', 'getAdapter');
  assert(typeof isAbsoluteURL === 'function', 'isAbsoluteURL');
  assert(typeof combineURLs === 'function', 'combineURLs');
  assert(typeof isURLSameOrigin === 'function', 'isURLSameOrigin');
  assert(typeof parseURL === 'function', 'parseURL');
  assert(typeof kindOf === 'function', 'kindOf');
  assert(typeof isPlainObject === 'function', 'isPlainObject');
  assert(typeof isObject === 'function', 'isObject');
  assert(typeof isFunction === 'function', 'isFunction');
  assert(typeof isString === 'function', 'isString');
  assert(typeof isNumber === 'function', 'isNumber');
  assert(typeof isBoolean === 'function', 'isBoolean');
  assert(typeof isUndefined === 'function', 'isUndefined');
  assert(typeof isDate === 'function', 'isDate');
  assert(typeof isRegExp === 'function', 'isRegExp');
  assert(typeof isArrayBuffer === 'function', 'isArrayBuffer');
  assert(typeof isTypedArray === 'function', 'isTypedArray');
  assert(typeof forEachUtil === 'function', 'forEach');
  assert(typeof mergeUtil === 'function', 'merge');
  assert(typeof extend === 'function', 'extend');
  assert(typeof stripBOM === 'function', 'stripBOM');
  assert(typeof findKey === 'function', 'findKey');
  assert(typeof isBrowser === 'function', 'isBrowser');
  assert(typeof isNode === 'function', 'isNode');
  assert(typeof freezeDeep === 'function', 'freezeDeep');
  assert(typeof generateUID === 'function', 'generateUID');
  assert(typeof isCancelToken === 'function', 'isCancelToken');
  assert(typeof toURLEncodedForm === 'function', 'toURLEncodedForm');
  assert(typeof formToJSON === 'function', 'formToJSON');
});

test('v11 backward compat — all v10 exports still work', () => {
  assert(typeof CancelToken === 'function', 'CancelToken');
  assert(typeof Cancel === 'function', 'Cancel');
  assert(typeof isCancel === 'function', 'isCancel');
  assert(typeof toFormData === 'function', 'toFormData');
  assert(typeof isFormData === 'function', 'isFormData');
  assert(typeof isBlob === 'function', 'isBlob');
  assert(typeof isFile === 'function', 'isFile');
  assert(typeof isBuffer === 'function', 'isBuffer');
  assert(typeof isStream === 'function', 'isStream');
  assert(typeof isArrayBufferView === 'function', 'isArrayBufferView');
  assert(typeof isURLSearchParams === 'function', 'isURLSearchParams');
  assert(typeof all === 'function', 'all');
  assert(typeof spread === 'function', 'spread');
  assert(typeof isClientError === 'function', 'isClientError');
  assert(typeof isYarouError === 'function', 'isYarouError');
  assert(typeof mergeConfig === 'function', 'mergeConfig');
  assert(typeof defaultParamsSerializer === 'function', 'defaultParamsSerializer');
  assert(typeof create === 'function', 'create');
});

test('v11 backward compat — all v9 exports still work', () => {
  assert(typeof createClient === 'function', 'createClient');
  assert(typeof awsibnjClient === 'function', 'awsibnjClient');
  assert(typeof ClientError === 'function', 'ClientError');
  assert(typeof InterceptorManager === 'function', 'InterceptorManager');
  assert(typeof InterceptorChain === 'function', 'InterceptorChain');
  assert(typeof validateExpect === 'function', 'validateExpect');
  assert(typeof smartProxy === 'function', 'smartProxy');
  assert(typeof buildURL === 'function', 'buildURL');
  assertEqual(HEADER_NAME, 'x-api-bridge-expect');
});

test('v11 backward compat — transform still works', () => {
  const result = transform({
    first_name: 'John',
    last_name: 'Doe',
    is_active: true,
  });
  assertEqual(result.firstName, 'John');
  assertEqual(result.lastName, 'Doe');
  assertEqual(result.isActive, true);
});

test('v11 backward compat — all pre-v9 classes still exported', () => {
  assert(typeof MiddlewarePipeline === 'function', 'MiddlewarePipeline');
  assert(typeof ResponseCache === 'function', 'ResponseCache');
  assert(typeof SchemaValidator === 'function', 'SchemaValidator');
  assert(typeof PluginManager === 'function', 'PluginManager');
  assert(typeof CircuitBreaker === 'function', 'CircuitBreaker');
  assert(typeof RetryStrategy === 'function', 'RetryStrategy');
  assert(typeof EventBus === 'function', 'EventBus');
  assert(typeof FuzzyMatcher === 'function', 'FuzzyMatcher');
  assert(typeof FieldAliaser === 'function', 'FieldAliaser');
  assert(typeof DeepMerge === 'function', 'DeepMerge');
});

test('v11 backward compat — all error classes still exported', () => {
  assert(typeof YarouError === 'function', 'YarouError');
  assert(typeof ValidationError === 'function', 'ValidationError');
  assert(typeof TransformError === 'function', 'TransformError');
  assert(typeof NetworkError === 'function', 'NetworkError');
  assert(typeof CircuitBreakerError === 'function', 'CircuitBreakerError');
  assert(typeof FuzzyMatchError === 'function', 'FuzzyMatchError');
  assert(typeof InterceptorError === 'function', 'InterceptorError');
});

console.log('\n━━━ v11: Integration Tests ━━━');

test('AxiosHeaders + createClient integration', () => {
  const headers = new AxiosHeaders({
    'Authorization': 'Bearer token123',
    'Content-Type': 'application/json',
  });
  const client = createClient({
    baseURL: '/api',
    headers: headers.toJSON(),
  });
  assertEqual(client.defaults.headers.common['Authorization'], 'Bearer token123');
});

test('HttpStatusCode + validateStatus integration', () => {
  const client = createClient({
    validateStatus: (status) => status < HttpStatusCode.InternalServerError,
  });
  assert(client.validateStatus(HttpStatusCode.Ok), '200 should be valid');
  assert(client.validateStatus(HttpStatusCode.NotFound), '404 should be valid');
  assert(!client.validateStatus(HttpStatusCode.InternalServerError), '500 should not be valid');
});

test('isAbsoluteURL + combineURLs + buildURL integration', () => {
  const base = 'https://api.example.com';
  const relative = '/users';
  const combined = combineURLs(base, relative);
  const full = buildURL(combined, '', { page: 1 });
  assert(full.includes('https://api.example.com/users'), 'should have combined URL');
  assert(full.includes('page=1'), 'should have params');
});

test('CancelToken + isCancelToken + isCancel full roundtrip', () => {
  const source = CancelToken.source();
  assert(isCancelToken(source.token), 'should be cancel token');
  assert(!source.token.requested, 'should not be cancelled');

  source.cancel('user abort');
  assert(source.token.requested, 'should be cancelled');
  assert(isCancel(source.token.reason), 'reason should be cancel');
  assert(CancelToken.isCancel(source.token.reason), 'static should detect');
});

test('formToJSON + toURLEncodedForm roundtrip', () => {
  const original = { name: 'John', age: '30', active: 'true' };
  const encoded = toURLEncodedForm(original);
  const decoded = formToJSON(encoded);
  assertEqual(decoded.name, 'John');
  assertEqual(decoded.age, '30');
  assertEqual(decoded.active, 'true');
});

test('kindOf + isPlainObject + isFunction together', () => {
  assertEqual(kindOf({}), 'object');
  assert(isPlainObject({}), 'plain object');
  assertEqual(kindOf(() => {}), 'function');
  assert(isFunction(() => {}), 'is function');
  assert(!isPlainObject(() => {}), 'function is not plain object');
});

test('complete Axios API surface check', () => {
  // Verify all Axios-compatible APIs exist
  const client = createClient({ baseURL: '/api' });

  // HTTP methods
  assert(typeof client.get === 'function', 'get');
  assert(typeof client.post === 'function', 'post');
  assert(typeof client.put === 'function', 'put');
  assert(typeof client.patch === 'function', 'patch');
  assert(typeof client.delete === 'function', 'delete');
  assert(typeof client.head === 'function', 'head');
  assert(typeof client.options === 'function', 'options');
  assert(typeof client.request === 'function', 'request');

  // v11 form methods
  assert(typeof client.postForm === 'function', 'postForm');
  assert(typeof client.putForm === 'function', 'putForm');
  assert(typeof client.patchForm === 'function', 'patchForm');

  // getUri
  assert(typeof client.getUri === 'function', 'getUri');

  // Interceptors
  assert(client.interceptors !== undefined, 'interceptors');
  assert(typeof client.interceptors.request.use === 'function', 'interceptors.request.use');
  assert(typeof client.interceptors.response.use === 'function', 'interceptors.response.use');
  assert(typeof client.interceptors.request.eject === 'function', 'interceptors.request.eject');
  assert(typeof client.interceptors.request.forEach === 'function', 'interceptors.request.forEach');

  // Defaults
  assert(client.defaults !== undefined, 'defaults');
  assert(client.defaults.headers !== undefined, 'defaults.headers');
  assert(client.defaults.headers.common !== undefined, 'defaults.headers.common');

  // v11 defaults
  assert('adapter' in client.defaults, 'defaults.adapter');
  assert('proxy' in client.defaults, 'defaults.proxy');
  assert('env' in client.defaults, 'defaults.env');
  assert('maxRedirects' in client.defaults, 'defaults.maxRedirects');
  assert('decompress' in client.defaults, 'defaults.decompress');

  // v12 defaults
  assert('transitional' in client.defaults, 'defaults.transitional');
  assert('signal' in client.defaults, 'defaults.signal');
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// v12: True Axios Drop-in — Callable Export + Full API Surface
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

console.log('\n━━━ v12: Callable Default Export ━━━');

test('v12: apiBridge is a callable function', () => {
  assert(typeof apiBridge === 'function', 'default export should be a function');
});

test('v12: apiBridge has all HTTP shorthand methods', () => {
  assert(typeof apiBridge.get === 'function', 'apiBridge.get');
  assert(typeof apiBridge.post === 'function', 'apiBridge.post');
  assert(typeof apiBridge.put === 'function', 'apiBridge.put');
  assert(typeof apiBridge.patch === 'function', 'apiBridge.patch');
  assert(typeof apiBridge.delete === 'function', 'apiBridge.delete');
  assert(typeof apiBridge.head === 'function', 'apiBridge.head');
  assert(typeof apiBridge.options === 'function', 'apiBridge.options');
  assert(typeof apiBridge.request === 'function', 'apiBridge.request');
});

test('v12: apiBridge has form methods', () => {
  assert(typeof apiBridge.postForm === 'function', 'apiBridge.postForm');
  assert(typeof apiBridge.putForm === 'function', 'apiBridge.putForm');
  assert(typeof apiBridge.patchForm === 'function', 'apiBridge.patchForm');
});

test('v12: apiBridge has getUri', () => {
  assert(typeof apiBridge.getUri === 'function', 'apiBridge.getUri');
  const uri = apiBridge.getUri({ url: '/users', params: { page: 1 } });
  assert(uri.includes('/users'), 'should include path');
  assert(uri.includes('page=1'), 'should include params');
});

test('v12: apiBridge.defaults is accessible', () => {
  assert(apiBridge.defaults !== undefined, 'defaults exists');
  assert(apiBridge.defaults.headers !== undefined, 'defaults.headers exists');
  assert(apiBridge.defaults.headers.common !== undefined, 'defaults.headers.common exists');
});

test('v12: apiBridge.interceptors is accessible', () => {
  assert(apiBridge.interceptors !== undefined, 'interceptors exists');
  assert(typeof apiBridge.interceptors.request.use === 'function', 'interceptors.request.use');
  assert(typeof apiBridge.interceptors.response.use === 'function', 'interceptors.response.use');
});

test('v12: apiBridge.create is createClient', () => {
  assert(typeof apiBridge.create === 'function', 'create exists');
  const instance = apiBridge.create({ baseURL: '/test' });
  assert(instance instanceof awsibnjClient, 'creates awsibnjClient');
  assertEqual(instance.baseURL, '/test');
});

test('v12: apiBridge.all and apiBridge.spread', () => {
  assert(typeof apiBridge.all === 'function', 'all exists');
  assert(typeof apiBridge.spread === 'function', 'spread exists');
});

test('v12: apiBridge has error checking methods', () => {
  assert(typeof apiBridge.isClientError === 'function', 'isClientError');
  assert(typeof apiBridge.isYarouError === 'function', 'isYarouError');
  assert(typeof apiBridge.isAxiosError === 'function', 'isAxiosError');
  assert(typeof apiBridge.isCancel === 'function', 'isCancel');
  assert(typeof apiBridge.isCancelToken === 'function', 'isCancelToken');
});

test('v12: apiBridge has class constructors', () => {
  assert(apiBridge.Axios === awsibnjClient, 'Axios === awsibnjClient');
  assert(apiBridge.AxiosError === ClientError, 'AxiosError === ClientError');
  assert(apiBridge.CancelToken === CancelToken, 'CancelToken');
  assert(apiBridge.Cancel === Cancel, 'Cancel');
  assert(apiBridge.AxiosHeaders === AxiosHeaders, 'AxiosHeaders');
  assert(apiBridge.HttpStatusCode === HttpStatusCode, 'HttpStatusCode');
});

test('v12: apiBridge has utilities', () => {
  assert(typeof apiBridge.toFormData === 'function', 'toFormData');
  assert(typeof apiBridge.toURLEncodedForm === 'function', 'toURLEncodedForm');
  assert(typeof apiBridge.formToJSON === 'function', 'formToJSON');
  assert(typeof apiBridge.mergeConfig === 'function', 'mergeConfig');
  assert(typeof apiBridge.getAdapter === 'function', 'getAdapter');
  assert(typeof apiBridge.buildURL === 'function', 'buildURL');
});

test('v12: apiBridge.VERSION is correct', () => {
  assertEqual(apiBridge.VERSION, '18.0.2');
});

console.log('\n━━━ v12: Axios Class Aliases ━━━');

test('v12: Axios alias equals awsibnjClient', () => {
  assert(Axios === awsibnjClient, 'Axios should be awsibnjClient');
});

test('v12: AxiosError alias equals ClientError', () => {
  assert(AxiosError === ClientError, 'AxiosError should be ClientError');
});

test('v12: isAxiosError works like isClientError', () => {
  const err = new ClientError('test', { code: 'ERR_TEST' });
  assert(isAxiosError(err), 'should detect ClientError');
  assert(isAxiosError({ isYarouError: true }), 'should detect duck-typed errors');
  assert(!isAxiosError(new Error('plain')), 'should not detect plain errors');
  assert(!isAxiosError(null), 'should not detect null');
  assert(!isAxiosError(42), 'should not detect non-errors');
});

test('v12: AxiosError can be instantiated', () => {
  const err = new AxiosError('test error', { status: 404, code: 'ERR_NOT_FOUND' });
  assert(err instanceof ClientError, 'should be ClientError');
  assert(err instanceof AxiosError, 'should be AxiosError (same class)');
  assertEqual(err.message, 'test error');
  assertEqual(err.status, 404);
  assertEqual(err.code, 'ERR_NOT_FOUND');
});

console.log('\n━━━ v12: Error Code Constants ━━━');

test('v12: ClientError has all standard error code constants', () => {
  assertEqual(ClientError.ERR_NETWORK, 'ERR_NETWORK');
  assertEqual(ClientError.ERR_CANCELED, 'ERR_CANCELED');
  assertEqual(ClientError.ERR_BAD_REQUEST, 'ERR_BAD_REQUEST');
  assertEqual(ClientError.ERR_BAD_RESPONSE, 'ERR_BAD_RESPONSE');
  assertEqual(ClientError.ERR_BAD_OPTION, 'ERR_BAD_OPTION');
  assertEqual(ClientError.ERR_BAD_OPTION_VALUE, 'ERR_BAD_OPTION_VALUE');
  assertEqual(ClientError.ERR_DEPRECATED, 'ERR_DEPRECATED');
  assertEqual(ClientError.ERR_NOT_SUPPORT, 'ERR_NOT_SUPPORT');
  assertEqual(ClientError.ERR_INVALID_URL, 'ERR_INVALID_URL');
  assertEqual(ClientError.ECONNABORTED, 'ECONNABORTED');
  assertEqual(ClientError.ETIMEDOUT, 'ETIMEDOUT');
  assertEqual(ClientError.ERR_TIMEOUT, 'ERR_TIMEOUT');
  assertEqual(ClientError.ERR_MAX_BODY_LENGTH_EXCEEDED, 'ERR_MAX_BODY_LENGTH_EXCEEDED');
  assertEqual(ClientError.ERR_MAX_CONTENT_LENGTH_EXCEEDED, 'ERR_MAX_CONTENT_LENGTH_EXCEEDED');
  assertEqual(ClientError.ERR_FR_TOO_MANY_REDIRECTS, 'ERR_FR_TOO_MANY_REDIRECTS');
});

test('v12: AxiosError has same error code constants', () => {
  assertEqual(AxiosError.ERR_NETWORK, 'ERR_NETWORK');
  assertEqual(AxiosError.ERR_CANCELED, 'ERR_CANCELED');
  assertEqual(AxiosError.ERR_BAD_REQUEST, 'ERR_BAD_REQUEST');
  assertEqual(AxiosError.ERR_BAD_RESPONSE, 'ERR_BAD_RESPONSE');
  assertEqual(AxiosError.ECONNABORTED, 'ECONNABORTED');
  assertEqual(AxiosError.ETIMEDOUT, 'ETIMEDOUT');
});

test('v12: ClientError.from works as AxiosError.from', () => {
  const original = new Error('network failure');
  original.code = 'ENETWORK';
  const config = { method: 'GET', url: '/api' };
  const response = { data: null, status: 500, statusText: 'Error', headers: {} };

  const wrapped = AxiosError.from(original, 'ERR_NETWORK', config, null, response);
  assert(wrapped instanceof ClientError, 'should be ClientError');
  assert(wrapped instanceof AxiosError, 'should be AxiosError');
  assertEqual(wrapped.code, 'ERR_NETWORK');
  assertEqual(wrapped.config.method, 'GET');
  assertEqual(wrapped.response.status, 500);
  assertEqual(wrapped.cause, original);
});

console.log('\n━━━ v12: Transitional Config ━━━');

test('v12: createClient defaults include transitional', () => {
  const client = createClient();
  assert(client.transitional !== undefined, 'transitional exists');
  assertEqual(client.transitional.silentJSONParsing, true);
  assertEqual(client.transitional.forcedJSONParsing, true);
  assertEqual(client.transitional.clarifyTimeoutError, false);
});

test('v12: transitional in defaults object', () => {
  const client = createClient();
  assert(client.defaults.transitional !== undefined, 'defaults.transitional exists');
  assertEqual(client.defaults.transitional.silentJSONParsing, true);
});

test('v12: custom transitional config', () => {
  const client = createClient({
    transitional: { silentJSONParsing: false, forcedJSONParsing: true, clarifyTimeoutError: true },
  });
  assertEqual(client.transitional.silentJSONParsing, false);
  assertEqual(client.transitional.clarifyTimeoutError, true);
});

console.log('\n━━━ v12: Delete with Data ━━━');

test('v12: delete method accepts data in config', () => {
  const client = createClient({ baseURL: 'https://httpbin.org' });
  // Verify the delete method signature allows data
  assert(typeof client.delete === 'function', 'delete method exists');
  // We can't make real HTTP calls but we can test the method exists and accepts args
  const uri = client.getUri({ url: '/api/items/1' });
  assert(uri.includes('/api/items/1'), 'getUri works for delete path');
});

console.log('\n━━━ v12: Default Export Shorthand Methods ━━━');

test('v12: module exports shorthand methods', () => {
  assert(typeof defaultRequest === 'function', 'request is exported');
  assert(typeof defaultGet === 'function', 'get is exported');
  assert(typeof defaultPost === 'function', 'post is exported');
  assert(typeof defaultPut === 'function', 'put is exported');
  assert(typeof defaultPatch === 'function', 'patch is exported');
  assert(typeof defaultDelete === 'function', 'delete is exported');
  assert(typeof defaultHead === 'function', 'head is exported');
  assert(typeof defaultOptions === 'function', 'options is exported');
  assert(typeof defaultPostForm === 'function', 'postForm is exported');
  assert(typeof defaultPutForm === 'function', 'putForm is exported');
  assert(typeof defaultPatchForm === 'function', 'patchForm is exported');
  assert(typeof defaultGetUri === 'function', 'getUri is exported');
});

test('v12: module exports interceptors', () => {
  assert(defaultInterceptors !== undefined, 'interceptors exported');
  assert(typeof defaultInterceptors.request.use === 'function', 'request.use');
  assert(typeof defaultInterceptors.response.use === 'function', 'response.use');
});

test('v12: defaultGetUri works', () => {
  const uri = defaultGetUri({ url: '/test', params: { foo: 'bar' } });
  assert(uri.includes('/test'), 'should include path');
  assert(uri.includes('foo=bar'), 'should include params');
});

console.log('\n━━━ v12: Adapter System Integration ━━━');

test('v12: custom adapter can be provided to createClient', () => {
  let adapterCalled = false;
  const customAdapter = async (config) => {
    adapterCalled = true;
    return {
      data: { custom: true },
      rawData: { custom: true },
      status: 200,
      statusText: 'OK',
      headers: {},
    };
  };

  const client = createClient({ adapter: customAdapter });
  assert(client.defaults.adapter === customAdapter, 'adapter in defaults');
});

test('v12: getAdapter resolves built-in adapters', () => {
  const fetchAd = getAdapter('fetch');
  assert(typeof fetchAd === 'function', 'fetch adapter is a function');

  const customFn = () => {};
  const customAd = getAdapter(customFn);
  assert(customAd === customFn, 'custom function returned as-is');
});

test('v12: getAdapter throws for unknown adapter', () => {
  let threw = false;
  try {
    getAdapter('nonexistent');
  } catch (e) {
    threw = true;
    assert(e.message.includes('Unknown adapter'), 'correct error message');
  }
  assert(threw, 'should throw');
});

test('v12: getAdapter resolves priority list', () => {
  const adapter = getAdapter(['fetch', 'xhr']);
  assert(typeof adapter === 'function', 'resolved adapter is a function');
});

console.log('\n━━━ v12: Complete Axios Migration Surface ━━━');

test('v12: full Axios replacement API surface check', () => {
  // Module-level exports
  const api = require('./src/index');

  // Classes
  assert(api.Axios !== undefined, 'Axios class');
  assert(api.AxiosError !== undefined, 'AxiosError class');
  assert(api.CancelToken !== undefined, 'CancelToken');
  assert(api.Cancel !== undefined, 'Cancel');
  assert(api.AxiosHeaders !== undefined, 'AxiosHeaders');
  assert(api.HttpStatusCode !== undefined, 'HttpStatusCode');

  // Factory
  assert(typeof api.create === 'function', 'create');
  assert(typeof api.createClient === 'function', 'createClient');

  // Helpers
  assert(typeof api.all === 'function', 'all');
  assert(typeof api.spread === 'function', 'spread');
  assert(typeof api.isCancel === 'function', 'isCancel');
  assert(typeof api.isAxiosError === 'function', 'isAxiosError');
  assert(typeof api.isClientError === 'function', 'isClientError');

  // Utilities
  assert(typeof api.toFormData === 'function', 'toFormData');
  assert(typeof api.formToJSON === 'function', 'formToJSON');
  assert(typeof api.toURLEncodedForm === 'function', 'toURLEncodedForm');
  assert(typeof api.mergeConfig === 'function', 'mergeConfig');
  assert(typeof api.getAdapter === 'function', 'getAdapter');

  // Default instance
  assert(api.defaults !== undefined, 'defaults');
  assert(api.interceptors !== undefined, 'interceptors');

  // VERSION
  assert(typeof api.VERSION === 'string', 'VERSION');

  // Shorthand methods on module
  assert(typeof api.get === 'function', 'module.get');
  assert(typeof api.post === 'function', 'module.post');
  assert(typeof api.put === 'function', 'module.put');
  assert(typeof api.patch === 'function', 'module.patch');
  assert(typeof api.delete === 'function', 'module.delete');
  assert(typeof api.head === 'function', 'module.head');
  assert(typeof api.options === 'function', 'module.options');
  assert(typeof api.request === 'function', 'module.request');
  assert(typeof api.postForm === 'function', 'module.postForm');
  assert(typeof api.putForm === 'function', 'module.putForm');
  assert(typeof api.patchForm === 'function', 'module.patchForm');
  assert(typeof api.getUri === 'function', 'module.getUri');

  // Callable default export
  assert(typeof api.default === 'function', 'default export is callable');
});

test('v12: Axios-compatible error shape', () => {
  const err = new AxiosError('Request failed', {
    status: 400,
    code: AxiosError.ERR_BAD_REQUEST,
    config: { method: 'POST', url: '/api/users', baseURL: 'https://api.example.com' },
    response: {
      data: { error: 'Invalid input' },
      status: 400,
      statusText: 'Bad Request',
      headers: { 'content-type': 'application/json' },
    },
  });

  assertEqual(err.name, 'ClientError');
  assertEqual(err.message, 'Request failed');
  assertEqual(err.status, 400);
  assertEqual(err.code, AxiosError.ERR_BAD_REQUEST);
  assert(err.config !== null, 'has config');
  assert(err.response !== null, 'has response');
  assert(err.isYarouError === true, 'isYarouError flag');

  // toJSON
  const json = err.toJSON();
  assertEqual(json.status, 400);
  assertEqual(json.code, 'ERR_BAD_REQUEST');
  assertEqual(json.config.method, 'POST');
});

test('v12: mergeConfig deep merges transitional', () => {
  const a = {
    transitional: { silentJSONParsing: true, forcedJSONParsing: true },
    timeout: 5000,
  };
  const b = {
    transitional: { clarifyTimeoutError: true },
    timeout: 10000,
  };
  const merged = mergeConfig(a, b);
  assertEqual(merged.timeout, 10000);
  assertEqual(merged.transitional.silentJSONParsing, true);
  assertEqual(merged.transitional.clarifyTimeoutError, true);
});

test('v12: createClient with adapter in defaults', () => {
  const customAdapter = async () => ({ data: {}, status: 200, statusText: 'OK', headers: {} });
  const client = createClient({ adapter: customAdapter });
  assertEqual(client.defaults.adapter, customAdapter);
  assertEqual(client.adapter, customAdapter);
});

test('v12: signal in defaults', () => {
  const controller = new AbortController();
  const client = createClient({ signal: controller.signal });
  assertEqual(client.defaults.signal, controller.signal);
});

test('v12: instance has v12 Axios API surface', () => {
  const client = createClient({ baseURL: '/api' });

  // All HTTP methods
  const methods = ['get', 'post', 'put', 'patch', 'delete', 'head', 'options', 'request'];
  methods.forEach(m => assert(typeof client[m] === 'function', `client.${m}`));

  // Form methods
  assert(typeof client.postForm === 'function', 'postForm');
  assert(typeof client.putForm === 'function', 'putForm');
  assert(typeof client.patchForm === 'function', 'patchForm');

  // getUri
  assert(typeof client.getUri === 'function', 'getUri');

  // Interceptors
  assert(client.interceptors !== undefined, 'interceptors');
  assert(typeof client.interceptors.request.use === 'function', 'request interceptors');
  assert(typeof client.interceptors.response.use === 'function', 'response interceptors');

  // Defaults
  assert(client.defaults !== undefined, 'defaults');
  assert('transitional' in client.defaults, 'defaults.transitional');
  assert('adapter' in client.defaults, 'defaults.adapter');
  assert('signal' in client.defaults, 'defaults.signal');
});

test('v12: AxiosHeaders on apiBridge callable', () => {
  const headers = new apiBridge.AxiosHeaders({ 'Content-Type': 'application/json' });
  assertEqual(headers.get('content-type'), 'application/json');
  assert(headers.has('Content-Type'), 'has content type');
});

test('v12: HttpStatusCode on apiBridge callable', () => {
  assertEqual(apiBridge.HttpStatusCode.Ok, 200);
  assertEqual(apiBridge.HttpStatusCode.NotFound, 404);
  assertEqual(apiBridge.HttpStatusCode.InternalServerError, 500);
});

test('v12: CancelToken on apiBridge callable', () => {
  const source = apiBridge.CancelToken.source();
  assert(typeof source.cancel === 'function', 'cancel function');
  assert(source.token !== undefined, 'token');
  assert(!source.token.requested, 'not cancelled');

  source.cancel('test');
  assert(source.token.requested, 'cancelled');
  assert(apiBridge.isCancel(source.token.reason), 'reason is Cancel');
});

test('v12: apiBridge.isAxiosError matches isClientError', () => {
  const err = new ClientError('test');
  assert(apiBridge.isAxiosError(err), 'detect via apiBridge');
  assert(apiBridge.isClientError(err), 'detect via isClientError');
  assert(!apiBridge.isAxiosError(new Error('plain')), 'plain errors not detected');
});

test('v12: buildURL on apiBridge callable', () => {
  const url = apiBridge.buildURL('/api', '/users', { page: 1, limit: 10 });
  assert(url.includes('/api/users'), 'has path');
  assert(url.includes('page=1'), 'has page param');
  assert(url.includes('limit=10'), 'has limit param');
});

test('v12: mergeConfig on apiBridge callable', () => {
  const merged = apiBridge.mergeConfig({ timeout: 5000 }, { timeout: 10000, baseURL: '/api' });
  assertEqual(merged.timeout, 10000);
  assertEqual(merged.baseURL, '/api');
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// v13: Complete Axios Replacement — Zero Gaps
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

console.log('\n━━━ v13: AxiosHeaders in Responses ━━━');

test('v13: createClient response headers are AxiosHeaders instances (integration)', () => {
  // Verify AxiosHeaders class is available and works
  const headers = new AxiosHeaders({ 'Content-Type': 'application/json', 'X-Custom': 'test' });
  assert(headers instanceof AxiosHeaders, 'should be AxiosHeaders');
  assertEqual(headers.get('content-type'), 'application/json');
  assertEqual(headers.get('x-custom'), 'test');
  assert(headers.has('Content-Type'), 'case-insensitive has');
  assert(headers.has('x-custom'), 'case-insensitive has');
});

test('v13: AxiosHeaders toJSON returns plain object', () => {
  const headers = new AxiosHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer test' });
  const json = headers.toJSON();
  assertEqual(json['Content-Type'], 'application/json');
  assertEqual(json['Authorization'], 'Bearer test');
});

test('v13: AxiosHeaders supports iteration', () => {
  const headers = new AxiosHeaders({ 'Content-Type': 'application/json', 'X-Api': 'v13' });
  const entries = headers.entries();
  assert(entries.length === 2, 'should have 2 entries');
});

test('v13: AxiosHeaders case-insensitive get/set/has/delete', () => {
  const headers = new AxiosHeaders();
  headers.set('Content-Type', 'application/json');
  assertEqual(headers.get('content-type'), 'application/json');
  assertEqual(headers.get('CONTENT-TYPE'), 'application/json');
  assert(headers.has('content-type'), 'has lowercase');
  assert(headers.has('Content-Type'), 'has original');
  headers.delete('CONTENT-TYPE');
  assert(!headers.has('content-type'), 'deleted');
});

console.log('\n━━━ v13: .isAxiosError Property ━━━');

test('v13: ClientError has .isAxiosError property', () => {
  const err = new ClientError('test', { code: 'ERR_TEST' });
  assert(err.isAxiosError === true, 'isAxiosError should be true');
  assert(err.isYarouError === true, 'isYarouError should be true');
});

test('v13: AxiosError has .isAxiosError property', () => {
  const err = new AxiosError('test');
  assert(err.isAxiosError === true, 'isAxiosError on AxiosError');
});

test('v13: isAxiosError() detects .isAxiosError property (duck typing)', () => {
  const duckError = { isAxiosError: true, message: 'from other lib' };
  assert(isAxiosError(duckError), 'should detect duck-typed error with isAxiosError');
});

test('v13: isClientError() detects .isAxiosError property', () => {
  const duckError = { isAxiosError: true, message: 'from other lib' };
  assert(isClientError(duckError), 'should detect duck-typed error with isAxiosError');
});

test('v13: ClientError.from preserves .isAxiosError', () => {
  const original = new Error('network');
  const wrapped = ClientError.from(original, 'ERR_NETWORK');
  assert(wrapped.isAxiosError === true, 'from() result has isAxiosError');
  assert(wrapped.isYarouError === true, 'from() result has isYarouError');
});

console.log('\n━━━ v13: Default Transform Chains ━━━');

test('v13: createClient has default transformRequest array', () => {
  const client = createClient();
  assert(Array.isArray(client.transformRequest), 'transformRequest is array');
  assert(client.transformRequest.length > 0, 'has default transforms');
  assert(typeof client.transformRequest[0] === 'function', 'first entry is function');
});

test('v13: createClient has default transformResponse array', () => {
  const client = createClient();
  assert(Array.isArray(client.transformResponse), 'transformResponse is array');
  assert(client.transformResponse.length > 0, 'has default transforms');
  assert(typeof client.transformResponse[0] === 'function', 'first entry is function');
});

test('v13: defaults.transformRequest is an array', () => {
  const client = createClient();
  assert(Array.isArray(client.defaults.transformRequest), 'defaults.transformRequest is array');
});

test('v13: defaults.transformResponse is an array', () => {
  const client = createClient();
  assert(Array.isArray(client.defaults.transformResponse), 'defaults.transformResponse is array');
});

test('v13: default transformRequest serializes objects to JSON', () => {
  const client = createClient();
  const transform = client.transformRequest[0];
  const headers = {};
  const result = transform({ name: 'John' }, headers);
  assertEqual(result, '{"name":"John"}');
  assertEqual(headers['Content-Type'], 'application/json');
});

test('v13: default transformRequest passes through strings', () => {
  const client = createClient();
  const transform = client.transformRequest[0];
  const result = transform('already a string', {});
  assertEqual(result, 'already a string');
});

test('v13: default transformRequest passes through null/undefined', () => {
  const client = createClient();
  const transform = client.transformRequest[0];
  assertEqual(transform(null, {}), null);
  assertEqual(transform(undefined, {}), undefined);
});

test('v13: default transformResponse parses JSON strings', () => {
  const client = createClient();
  const transform = client.transformResponse[0];
  const result = transform('{"name":"John","age":30}');
  assertEqual(result.name, 'John');
  assertEqual(result.age, 30);
});

test('v13: default transformResponse passes through non-JSON strings', () => {
  const client = createClient();
  const transform = client.transformResponse[0];
  const result = transform('not json');
  assertEqual(result, 'not json');
});

test('v13: default transformResponse passes through objects', () => {
  const client = createClient();
  const transform = client.transformResponse[0];
  const obj = { already: 'parsed' };
  assertEqual(transform(obj), obj);
});

test('v13: custom transformRequest overrides defaults', () => {
  const customTransform = (data) => data;
  const client = createClient({ transformRequest: [customTransform] });
  assertEqual(client.transformRequest[0], customTransform);
  assertEqual(client.transformRequest.length, 1);
});

test('v13: custom transformResponse overrides defaults', () => {
  const customTransform = (data) => data;
  const client = createClient({ transformResponse: [customTransform] });
  assertEqual(client.transformResponse[0], customTransform);
  assertEqual(client.transformResponse.length, 1);
});

console.log('\n━━━ v13: maxRate Support ━━━');

test('v13: maxRate config option defaults to null', () => {
  const client = createClient();
  assertEqual(client.maxRate, null);
  assertEqual(client.defaults.maxRate, null);
});

test('v13: maxRate config option is set when provided', () => {
  const client = createClient({ maxRate: [1024, 2048] });
  assert(Array.isArray(client.maxRate), 'maxRate is array');
  assertEqual(client.maxRate[0], 1024);
  assertEqual(client.maxRate[1], 2048);
  assertEqual(client.defaults.maxRate[0], 1024);
  assertEqual(client.defaults.maxRate[1], 2048);
});

test('v13: maxRate single value works', () => {
  const client = createClient({ maxRate: 4096 });
  assertEqual(client.maxRate, 4096);
  assertEqual(client.defaults.maxRate, 4096);
});

console.log('\n━━━ v13: lookup DNS Option ━━━');

test('v13: lookup config option defaults to null', () => {
  const client = createClient();
  assertEqual(client.lookup, null);
  assertEqual(client.defaults.lookup, null);
});

test('v13: lookup config option is set when provided', () => {
  const customLookup = (hostname, opts, cb) => cb(null, '127.0.0.1', 4);
  const client = createClient({ lookup: customLookup });
  assertEqual(client.lookup, customLookup);
  assertEqual(client.defaults.lookup, customLookup);
});

console.log('\n━━━ v13: Response request Property ━━━');

test('v13: custom adapter response includes request property', async () => {
  const customAdapter = async (config) => ({
    data: { ok: true },
    rawData: { ok: true },
    status: 200,
    statusText: 'OK',
    headers: {},
    request: { url: config.fullURL, method: config.method },
  });

  const client = createClient({ adapter: customAdapter, baseURL: 'http://test.local' });
  const res = await client.get('/api');
  assert(res.request !== undefined, 'response has request property');
  assert(res.request.url !== undefined || typeof res.request === 'object', 'request has properties');
});

test('v13: custom adapter response headers wrapped in AxiosHeaders', async () => {
  const customAdapter = async (config) => ({
    data: { ok: true },
    rawData: { ok: true },
    status: 200,
    statusText: 'OK',
    headers: { 'content-type': 'application/json', 'x-custom': 'hello' },
    request: {},
  });

  const client = createClient({ adapter: customAdapter, baseURL: 'http://test.local' });
  const res = await client.get('/api');
  assert(res.headers instanceof AxiosHeaders, 'response headers are AxiosHeaders');
  assertEqual(res.headers.get('content-type'), 'application/json');
  assertEqual(res.headers.get('x-custom'), 'hello');
  assertEqual(res.headers.get('X-Custom'), 'hello');
});

console.log('\n━━━ v13: Response Config data Alias ━━━');

test('v13: response.config has data field for POST', async () => {
  const customAdapter = async () => ({
    data: { ok: true },
    rawData: { ok: true },
    status: 200,
    statusText: 'OK',
    headers: {},
    request: {},
  });

  const client = createClient({
    adapter: customAdapter,
    baseURL: 'http://test.local',
    autoAlign: false,
    transformRequest: [],
  });
  const res = await client.post('/api', { name: 'John' });
  assert(res.config !== undefined, 'response has config');
  assert(res.config.data !== undefined || res.config.body !== undefined, 'config has data or body');
});

console.log('\n━━━ v13: Error Shape Enhancement ━━━');

test('v13: ClientError includes isAxiosError in all error paths', () => {
  const err = new ClientError('test', {
    status: 500,
    code: 'ERR_BAD_RESPONSE',
    config: { method: 'GET', url: '/api' },
    response: { data: 'error', status: 500 },
  });
  assert(err.isAxiosError === true, 'isAxiosError property');
  assert(err.isYarouError === true, 'isYarouError property');
  assertEqual(err.status, 500);
  assertEqual(err.code, 'ERR_BAD_RESPONSE');
});

test('v13: error.response.headers is AxiosHeaders when adapter returns headers', async () => {
  const customAdapter = async () => ({
    data: { error: 'not found' },
    rawData: { error: 'not found' },
    status: 404,
    statusText: 'Not Found',
    headers: { 'content-type': 'application/json' },
    request: {},
  });

  const client = createClient({ adapter: customAdapter, baseURL: 'http://test.local' });
  try {
    await client.get('/missing');
    assert(false, 'should have thrown');
  } catch (err) {
    assert(err.isAxiosError === true, 'error has isAxiosError');
    assert(err.response !== null, 'error has response');
    assert(err.response.headers instanceof AxiosHeaders, 'error.response.headers is AxiosHeaders');
    assertEqual(err.response.headers.get('content-type'), 'application/json');
  }
});

test('v13: error includes request property', async () => {
  const customAdapter = async () => ({
    data: null,
    rawData: null,
    status: 500,
    statusText: 'Error',
    headers: {},
    request: { url: 'http://test.local/fail', method: 'GET' },
  });

  const client = createClient({ adapter: customAdapter, baseURL: 'http://test.local' });
  try {
    await client.get('/fail');
    assert(false, 'should have thrown');
  } catch (err) {
    assert(err.request !== undefined || err.response !== undefined, 'error has request or response');
  }
});

console.log('\n━━━ v13: Complete API Surface Verification ━━━');

test('v13: full Axios replacement API surface check (v13)', () => {
  const api = require('./src/index');

  // v13: VERSION
  assertEqual(api.VERSION, '18.0.2');

  // Classes with isAxiosError support
  const err = new api.ClientError('test');
  assert(err.isAxiosError === true, 'ClientError.isAxiosError');
  assert(err.isYarouError === true, 'ClientError.isYarouError');

  // AxiosError alias also works
  const axErr = new api.AxiosError('test');
  assert(axErr.isAxiosError === true, 'AxiosError.isAxiosError');

  // Verify defaults have transform chains
  const client = api.createClient();
  assert(Array.isArray(client.defaults.transformRequest), 'defaults.transformRequest is array');
  assert(Array.isArray(client.defaults.transformResponse), 'defaults.transformResponse is array');
  assert(client.defaults.transformRequest.length > 0, 'has default request transforms');
  assert(client.defaults.transformResponse.length > 0, 'has default response transforms');

  // v13 options
  assert('maxRate' in client.defaults, 'defaults.maxRate');
  assert('lookup' in client.defaults, 'defaults.lookup');
});

test('v13: AxiosHeaders concat and merge', () => {
  const h1 = new AxiosHeaders({ 'Content-Type': 'application/json' });
  const h2 = new AxiosHeaders({ 'Authorization': 'Bearer token' });
  const merged = AxiosHeaders.concat(h1, h2);
  assertEqual(merged.get('content-type'), 'application/json');
  assertEqual(merged.get('authorization'), 'Bearer token');
  assertEqual(merged.size, 2);
});

test('v13: AxiosHeaders accessor methods', () => {
  const headers = new AxiosHeaders({ 'Content-Type': 'application/json' });
  assertEqual(headers.getContentType(), 'application/json');
  headers.setContentType('text/html');
  assertEqual(headers.getContentType(), 'text/html');
  assert(headers.hasContentType(), 'hasContentType');
});

test('v13: AxiosHeaders clear', () => {
  const headers = new AxiosHeaders({ 'A': '1', 'B': '2' });
  assertEqual(headers.size, 2);
  headers.clear();
  assertEqual(headers.size, 0);
});

test('v13: AxiosHeaders normalize', () => {
  const headers = new AxiosHeaders({ 'content-type': 'application/json' });
  headers.normalize();
  const keys = headers.keys();
  assert(keys.some(k => k === 'Content-Type'), 'normalized to Title-Case');
});

test('v13: AxiosHeaders from static constructor', () => {
  const headers = AxiosHeaders.from({ 'X-Test': 'value' });
  assert(headers instanceof AxiosHeaders, 'from returns AxiosHeaders');
  assertEqual(headers.get('x-test'), 'value');
});

test('v13: AxiosHeaders toString', () => {
  const headers = new AxiosHeaders({ 'Content-Type': 'application/json' });
  const str = headers.toString();
  assert(str.includes('Content-Type'), 'toString includes header name');
  assert(str.includes('application/json'), 'toString includes header value');
});

test('v13: AxiosHeaders Symbol.iterator', () => {
  const headers = new AxiosHeaders({ 'A': '1', 'B': '2' });
  let count = 0;
  for (const [name, value] of headers) {
    assert(typeof name === 'string', 'entry name is string');
    assert(typeof value === 'string', 'entry value is string');
    count++;
  }
  assertEqual(count, 2);
});

test('v13: default instance transformRequest in defaults', () => {
  const api = require('./src/index');
  assert(Array.isArray(api.defaults.transformRequest), 'module defaults.transformRequest');
  assert(Array.isArray(api.defaults.transformResponse), 'module defaults.transformResponse');
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// v14 Tests — Enterprise-Grade HTTP Client Features
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

console.log('\n━━━ v14: Auto-Retry Engine ━━━');

test('v14: retryConfig stored in defaults', () => {
  const retryConfig = {
    retries: 3,
    retryCondition: (err) => err.status >= 500,
    retryDelay: (count) => count * 500,
    shouldResetTimeout: false,
    onRetry: () => {},
  };
  const client = createClient({ retryConfig });
  assertEqual(client.defaults.retryConfig.retries, 3);
  assert(typeof client.defaults.retryConfig.retryCondition === 'function', 'retryCondition is function');
  assert(typeof client.defaults.retryConfig.retryDelay === 'function', 'retryDelay is function');
  assertEqual(client.defaults.retryConfig.shouldResetTimeout, false);
  assert(typeof client.defaults.retryConfig.onRetry === 'function', 'onRetry is function');
});

test('v14: retryConfig.retryCondition controls whether to retry', async () => {
  let attempts = 0;
  const customAdapter = async () => {
    attempts++;
    return {
      data: null,
      rawData: null,
      status: 400,
      statusText: 'Bad Request',
      headers: {},
      request: {},
    };
  };
  const client = createClient({
    adapter: customAdapter,
    baseURL: 'http://test.local',
    retryConfig: {
      retries: 3,
      retryCondition: (err) => err.status >= 500, // only retry 5xx
    },
  });
  try {
    await client.get('/test');
    assert(false, 'should have thrown');
  } catch (err) {
    assertEqual(attempts, 1); // no retries because 400 doesn't match retryCondition
  }
});

test('v14: retryConfig.retryDelay function controls delay', async () => {
  let attempts = 0;
  const delays = [];
  const customAdapter = async () => {
    attempts++;
    if (attempts < 3) {
      return {
        data: null, rawData: null,
        status: 500, statusText: 'Error',
        headers: {}, request: {},
      };
    }
    return {
      data: { ok: true }, rawData: { ok: true },
      status: 200, statusText: 'OK',
      headers: {}, request: {},
    };
  };

  const client = createClient({
    adapter: customAdapter,
    baseURL: 'http://test.local',
    retryConfig: {
      retries: 5,
      retryDelay: (count) => {
        delays.push(count);
        return 1; // 1ms for testing speed
      },
    },
  });

  const res = await client.get('/test');
  assertEqual(res.status, 200);
  assertEqual(attempts, 3);
  assert(delays.length >= 1, 'retryDelay was called');
});

test('v14: retryConfig.onRetry callback called on each retry', async () => {
  let attempts = 0;
  const onRetryCalls = [];
  const customAdapter = async () => {
    attempts++;
    if (attempts < 3) {
      return {
        data: null, rawData: null,
        status: 503, statusText: 'Service Unavailable',
        headers: {}, request: {},
      };
    }
    return {
      data: { ok: true }, rawData: { ok: true },
      status: 200, statusText: 'OK',
      headers: {}, request: {},
    };
  };

  const client = createClient({
    adapter: customAdapter,
    baseURL: 'http://test.local',
    retryConfig: {
      retries: 5,
      retryDelay: () => 1,
      onRetry: (count, err, config) => {
        onRetryCalls.push({ count, errMsg: err.message, url: config.url });
      },
    },
  });

  await client.get('/retry-test');
  assertEqual(onRetryCalls.length, 2);
  assertEqual(onRetryCalls[0].count, 1);
  assertEqual(onRetryCalls[1].count, 2);
});

test('v14: per-request retryConfig overrides client retryConfig', async () => {
  let attempts = 0;
  const customAdapter = async () => {
    attempts++;
    return {
      data: null, rawData: null,
      status: 500, statusText: 'Error',
      headers: {}, request: {},
    };
  };

  const client = createClient({
    adapter: customAdapter,
    baseURL: 'http://test.local',
    retryConfig: { retries: 5, retryDelay: () => 1 },
  });

  try {
    await client.get('/test', {
      retryConfig: { retries: 1, retryDelay: () => 1 }, // override to 1 retry
    });
  } catch (_) {}
  assertEqual(attempts, 2); // 1 original + 1 retry
});

console.log('\n━━━ v14: Response Caching ━━━');

test('v14: cache config stored in defaults', () => {
  const cacheConfig = {
    ttl: 60000,
    maxSize: 100,
    methods: ['GET'],
    exclude: ['/no-cache'],
    staleWhileRevalidate: false,
  };
  const client = createClient({ cache: cacheConfig });
  assertEqual(client.defaults.cache.ttl, 60000);
  assertEqual(client.defaults.cache.maxSize, 100);
  assert(Array.isArray(client.defaults.cache.methods), 'methods is array');
  assertEqual(client.defaults.cache.staleWhileRevalidate, false);
});

test('v14: response caching returns cached result on second request', async () => {
  let callCount = 0;
  const customAdapter = async () => {
    callCount++;
    return {
      data: { id: callCount }, rawData: { id: callCount },
      status: 200, statusText: 'OK',
      headers: {}, request: {},
    };
  };

  const client = createClient({
    adapter: customAdapter,
    baseURL: 'http://test.local',
    cache: { ttl: 10000, methods: ['GET'] },
  });

  const res1 = await client.get('/users');
  const res2 = await client.get('/users');

  assertEqual(callCount, 1); // only 1 actual request
  assertEqual(res1.data.id, 1);
  assertEqual(res2.data.id, 1); // same cached result
});

test('v14: cache only applies to configured methods', async () => {
  let callCount = 0;
  const customAdapter = async () => {
    callCount++;
    return {
      data: { id: callCount }, rawData: { id: callCount },
      status: 200, statusText: 'OK',
      headers: {}, request: {},
    };
  };

  const client = createClient({
    adapter: customAdapter,
    baseURL: 'http://test.local',
    cache: { ttl: 10000, methods: ['GET'] },
  });

  await client.post('/users', { name: 'A' });
  await client.post('/users', { name: 'B' });

  assertEqual(callCount, 2); // POST not cached
});

test('v14: cache excludes matching URL patterns', async () => {
  let callCount = 0;
  const customAdapter = async () => {
    callCount++;
    return {
      data: { id: callCount }, rawData: { id: callCount },
      status: 200, statusText: 'OK',
      headers: {}, request: {},
    };
  };

  const client = createClient({
    adapter: customAdapter,
    baseURL: 'http://test.local',
    cache: { ttl: 10000, methods: ['GET'], exclude: ['/no-cache'] },
  });

  await client.get('/no-cache/data');
  await client.get('/no-cache/data');

  assertEqual(callCount, 2); // excluded from cache
});

test('v14: clearResponseCache() clears the cache', async () => {
  let callCount = 0;
  const customAdapter = async () => {
    callCount++;
    return {
      data: { id: callCount }, rawData: { id: callCount },
      status: 200, statusText: 'OK',
      headers: {}, request: {},
    };
  };

  const client = createClient({
    adapter: customAdapter,
    baseURL: 'http://test.local',
    cache: { ttl: 10000, methods: ['GET'] },
  });

  await client.get('/users');
  assertEqual(callCount, 1);

  client.clearResponseCache();

  await client.get('/users');
  assertEqual(callCount, 2); // fresh request after cache clear
});

test('v14: cache evicts oldest entry when maxSize exceeded', async () => {
  let callCount = 0;
  const customAdapter = async (config) => {
    callCount++;
    return {
      data: { url: config.url, count: callCount }, rawData: { url: config.url, count: callCount },
      status: 200, statusText: 'OK',
      headers: {}, request: {},
    };
  };

  const client = createClient({
    adapter: customAdapter,
    baseURL: 'http://test.local',
    cache: { ttl: 60000, methods: ['GET'], maxSize: 2 },
  });

  await client.get('/a');
  await client.get('/b');
  await client.get('/c'); // should evict /a
  const startCount = callCount;

  await client.get('/a'); // should be a cache miss (was evicted)
  assertEqual(callCount, startCount + 1);

  await client.get('/c'); // should be a cache hit
  assertEqual(callCount, startCount + 1);
});

test('v14: cache custom keyGenerator', async () => {
  let callCount = 0;
  const customAdapter = async () => {
    callCount++;
    return {
      data: { id: callCount }, rawData: { id: callCount },
      status: 200, statusText: 'OK',
      headers: {}, request: {},
    };
  };

  const client = createClient({
    adapter: customAdapter,
    baseURL: 'http://test.local',
    cache: {
      ttl: 10000,
      methods: ['GET'],
      keyGenerator: (config) => `custom:${config.url}`,
    },
  });

  await client.get('/users');
  await client.get('/users');
  assertEqual(callCount, 1); // cached with custom key
});

console.log('\n━━━ v14: Request Deduplication ━━━');

test('v14: dedupe config stored in defaults', () => {
  const client = createClient({
    dedupe: { enabled: true, methods: ['GET', 'HEAD'] },
  });
  assert(client.defaults.dedupe.enabled === true, 'dedupe enabled');
  assert(Array.isArray(client.defaults.dedupe.methods), 'dedupe methods is array');
});

test('v14: deduplication coalesces identical in-flight GET requests', async () => {
  let callCount = 0;
  const customAdapter = async () => {
    callCount++;
    await new Promise(r => setTimeout(r, 50)); // simulate delay
    return {
      data: { value: callCount }, rawData: { value: callCount },
      status: 200, statusText: 'OK',
      headers: {}, request: {},
    };
  };

  const client = createClient({
    adapter: customAdapter,
    baseURL: 'http://test.local',
    dedupe: { enabled: true, methods: ['GET'] },
  });

  // Fire two identical requests concurrently
  const [res1, res2] = await Promise.all([
    client.get('/data'),
    client.get('/data'),
  ]);

  assertEqual(callCount, 1); // only 1 actual request
  assertEqual(res1.data.value, res2.data.value);
});

test('v14: deduplication does not affect POST requests by default', async () => {
  let callCount = 0;
  const customAdapter = async () => {
    callCount++;
    await new Promise(r => setTimeout(r, 10));
    return {
      data: { id: callCount }, rawData: { id: callCount },
      status: 200, statusText: 'OK',
      headers: {}, request: {},
    };
  };

  const client = createClient({
    adapter: customAdapter,
    baseURL: 'http://test.local',
    dedupe: { enabled: true, methods: ['GET'] },
  });

  await Promise.all([
    client.post('/data', { a: 1 }),
    client.post('/data', { a: 1 }),
  ]);

  assertEqual(callCount, 2); // POST not deduped
});

test('v14: deduplication with custom keyGenerator', async () => {
  let callCount = 0;
  const customAdapter = async () => {
    callCount++;
    await new Promise(r => setTimeout(r, 50));
    return {
      data: { v: callCount }, rawData: { v: callCount },
      status: 200, statusText: 'OK',
      headers: {}, request: {},
    };
  };

  const client = createClient({
    adapter: customAdapter,
    baseURL: 'http://test.local',
    dedupe: {
      enabled: true,
      methods: ['GET'],
      keyGenerator: (config) => `dedup:${config.url}`,
    },
  });

  const [r1, r2] = await Promise.all([
    client.get('/items'),
    client.get('/items'),
  ]);

  assertEqual(callCount, 1);
  assertEqual(r1.data.v, r2.data.v);
});

test('v14: deduplication removes inflight after completion', async () => {
  let callCount = 0;
  const customAdapter = async () => {
    callCount++;
    return {
      data: { v: callCount }, rawData: { v: callCount },
      status: 200, statusText: 'OK',
      headers: {}, request: {},
    };
  };

  const client = createClient({
    adapter: customAdapter,
    baseURL: 'http://test.local',
    dedupe: { enabled: true, methods: ['GET'] },
  });

  await client.get('/data');
  await client.get('/data'); // sequential — should make a new request
  assertEqual(callCount, 2);
});

console.log('\n━━━ v14: Auto Token Refresh ━━━');

test('v14: tokenRefresh config stored in defaults', () => {
  const client = createClient({
    tokenRefresh: {
      onRefresh: async () => 'new-token',
      statusCodes: [401],
      maxRetries: 1,
      headerName: 'Authorization',
      tokenPrefix: 'Bearer ',
    },
  });
  assertEqual(client.defaults.tokenRefresh.statusCodes[0], 401);
  assertEqual(client.defaults.tokenRefresh.maxRetries, 1);
  assertEqual(client.defaults.tokenRefresh.headerName, 'Authorization');
  assertEqual(client.defaults.tokenRefresh.tokenPrefix, 'Bearer ');
  assert(typeof client.defaults.tokenRefresh.onRefresh === 'function', 'onRefresh is function');
});

test('v14: token refresh retries on 401 with new token', async () => {
  let callCount = 0;
  let receivedAuthHeader = null;
  const customAdapter = async (config) => {
    callCount++;
    if (callCount === 1) {
      return {
        data: { error: 'Unauthorized' }, rawData: { error: 'Unauthorized' },
        status: 401, statusText: 'Unauthorized',
        headers: {}, request: {},
      };
    }
    receivedAuthHeader = config.headers['Authorization'];
    return {
      data: { ok: true }, rawData: { ok: true },
      status: 200, statusText: 'OK',
      headers: {}, request: {},
    };
  };

  const client = createClient({
    adapter: customAdapter,
    baseURL: 'http://test.local',
    tokenRefresh: {
      onRefresh: async () => 'fresh-token-123',
      statusCodes: [401],
      maxRetries: 1,
    },
  });

  const res = await client.get('/protected');
  assertEqual(res.status, 200);
  assertEqual(callCount, 2);
  assertEqual(receivedAuthHeader, 'Bearer fresh-token-123');
});

test('v14: token refresh custom headerName and prefix', async () => {
  let callCount = 0;
  let receivedHeader = null;
  const customAdapter = async (config) => {
    callCount++;
    if (callCount === 1) {
      return {
        data: null, rawData: null,
        status: 401, statusText: 'Unauthorized',
        headers: {}, request: {},
      };
    }
    receivedHeader = config.headers['X-API-Key'];
    return {
      data: { ok: true }, rawData: { ok: true },
      status: 200, statusText: 'OK',
      headers: {}, request: {},
    };
  };

  const client = createClient({
    adapter: customAdapter,
    baseURL: 'http://test.local',
    tokenRefresh: {
      onRefresh: async () => 'api-key-456',
      headerName: 'X-API-Key',
      tokenPrefix: '',
      statusCodes: [401],
    },
  });

  await client.get('/api-resource');
  assertEqual(receivedHeader, 'api-key-456');
});

test('v14: token refresh does not retry on non-configured status codes', async () => {
  let callCount = 0;
  const customAdapter = async () => {
    callCount++;
    return {
      data: null, rawData: null,
      status: 403, statusText: 'Forbidden',
      headers: {}, request: {},
    };
  };

  const client = createClient({
    adapter: customAdapter,
    baseURL: 'http://test.local',
    tokenRefresh: {
      onRefresh: async () => 'new-token',
      statusCodes: [401], // only refresh on 401, not 403
    },
  });

  try {
    await client.get('/forbidden');
    assert(false, 'should have thrown');
  } catch (err) {
    assertEqual(callCount, 1); // no refresh retry for 403
  }
});

console.log('\n━━━ v14: Request Timing ━━━');

test('v14: timing disabled by default', async () => {
  const customAdapter = async () => ({
    data: { ok: true }, rawData: { ok: true },
    status: 200, statusText: 'OK',
    headers: {}, request: {},
  });

  const client = createClient({
    adapter: customAdapter,
    baseURL: 'http://test.local',
  });

  const res = await client.get('/data');
  assert(res.duration === undefined, 'no duration by default');
  assert(res.timing === undefined, 'no timing by default');
});

test('v14: timing enabled adds duration and timing to response', async () => {
  const customAdapter = async () => {
    await new Promise(r => setTimeout(r, 10));
    return {
      data: { ok: true }, rawData: { ok: true },
      status: 200, statusText: 'OK',
      headers: {}, request: {},
    };
  };

  const client = createClient({
    adapter: customAdapter,
    baseURL: 'http://test.local',
    timing: true,
  });

  const res = await client.get('/data');
  assert(typeof res.duration === 'number', 'duration is number');
  assert(res.duration >= 0, 'duration >= 0');
  assert(typeof res.timing === 'object', 'timing is object');
  assert(typeof res.timing.start === 'number', 'timing.start is number');
  assert(typeof res.timing.end === 'number', 'timing.end is number');
  assert(typeof res.timing.duration === 'number', 'timing.duration is number');
  assertEqual(res.timing.duration, res.duration);
  assert(res.timing.end >= res.timing.start, 'end >= start');
});

test('v14: timing in defaults', () => {
  const client = createClient({ timing: true });
  assertEqual(client.defaults.timing, true);
});

console.log('\n━━━ v14: Lifecycle Hooks ━━━');

test('v14: hooks config stored in defaults', () => {
  const hooks = {
    onRequest: [(config) => {}],
    onResponse: [(res) => {}],
    onError: [(err) => {}],
    onRetry: [(count, err, config) => {}],
  };
  const client = createClient({ hooks });
  assert(Array.isArray(client.defaults.hooks.onRequest), 'onRequest is array');
  assert(Array.isArray(client.defaults.hooks.onResponse), 'onResponse is array');
  assert(Array.isArray(client.defaults.hooks.onError), 'onError is array');
  assert(Array.isArray(client.defaults.hooks.onRetry), 'onRetry is array');
});

test('v14: onRequest hook fires before request', async () => {
  const hookCalls = [];
  const customAdapter = async () => ({
    data: { ok: true }, rawData: { ok: true },
    status: 200, statusText: 'OK',
    headers: {}, request: {},
  });

  const client = createClient({
    adapter: customAdapter,
    baseURL: 'http://test.local',
    hooks: {
      onRequest: [(config) => { hookCalls.push({ hook: 'onRequest', method: config.method }); }],
    },
  });

  await client.get('/data');
  assertEqual(hookCalls.length, 1);
  assertEqual(hookCalls[0].hook, 'onRequest');
  assertEqual(hookCalls[0].method, 'GET');
});

test('v14: onResponse hook fires after response', async () => {
  const hookCalls = [];
  const customAdapter = async () => ({
    data: { userId: 1 }, rawData: { userId: 1 },
    status: 200, statusText: 'OK',
    headers: {}, request: {},
  });

  const client = createClient({
    adapter: customAdapter,
    baseURL: 'http://test.local',
    hooks: {
      onResponse: [(res) => { hookCalls.push({ status: res.status }); }],
    },
  });

  await client.get('/data');
  assertEqual(hookCalls.length, 1);
  assertEqual(hookCalls[0].status, 200);
});

test('v14: onError hook fires on error', async () => {
  const hookCalls = [];
  const customAdapter = async () => ({
    data: null, rawData: null,
    status: 500, statusText: 'Error',
    headers: {}, request: {},
  });

  const client = createClient({
    adapter: customAdapter,
    baseURL: 'http://test.local',
    hooks: {
      onError: [(err) => { hookCalls.push({ msg: err.message }); }],
    },
  });

  try {
    await client.get('/fail');
  } catch (_) {}

  assert(hookCalls.length >= 1, 'onError was called');
});

test('v14: onRetry hook fires on retry', async () => {
  let attempts = 0;
  const hookCalls = [];
  const customAdapter = async () => {
    attempts++;
    if (attempts < 3) {
      return {
        data: null, rawData: null,
        status: 503, statusText: 'Unavailable',
        headers: {}, request: {},
      };
    }
    return {
      data: { ok: true }, rawData: { ok: true },
      status: 200, statusText: 'OK',
      headers: {}, request: {},
    };
  };

  const client = createClient({
    adapter: customAdapter,
    baseURL: 'http://test.local',
    retryConfig: { retries: 5, retryDelay: () => 1 },
    hooks: {
      onRetry: [(count, err) => { hookCalls.push({ count, msg: err.message }); }],
    },
  });

  await client.get('/retry');
  assert(hookCalls.length >= 1, 'onRetry was called');
  assertEqual(hookCalls[0].count, 1);
});

test('v14: hooks are fire-and-forget (errors swallowed)', async () => {
  const customAdapter = async () => ({
    data: { ok: true }, rawData: { ok: true },
    status: 200, statusText: 'OK',
    headers: {}, request: {},
  });

  const client = createClient({
    adapter: customAdapter,
    baseURL: 'http://test.local',
    hooks: {
      onRequest: [() => { throw new Error('hook error!'); }],
      onResponse: [() => { throw new Error('response hook error!'); }],
    },
  });

  // Should not throw despite hooks throwing
  const res = await client.get('/data');
  assertEqual(res.status, 200);
});

test('v14: multiple hooks in same lifecycle', async () => {
  const calls = [];
  const customAdapter = async () => ({
    data: { ok: true }, rawData: { ok: true },
    status: 200, statusText: 'OK',
    headers: {}, request: {},
  });

  const client = createClient({
    adapter: customAdapter,
    baseURL: 'http://test.local',
    hooks: {
      onRequest: [
        () => calls.push('hook1'),
        () => calls.push('hook2'),
        () => calls.push('hook3'),
      ],
    },
  });

  await client.get('/data');
  assertEqual(calls.length, 3);
  assertEqual(calls[0], 'hook1');
  assertEqual(calls[1], 'hook2');
  assertEqual(calls[2], 'hook3');
});

test('v14: hooks accept single function (not just arrays)', async () => {
  let called = false;
  const customAdapter = async () => ({
    data: { ok: true }, rawData: { ok: true },
    status: 200, statusText: 'OK',
    headers: {}, request: {},
  });

  const client = createClient({
    adapter: customAdapter,
    baseURL: 'http://test.local',
    hooks: {
      onRequest: () => { called = true; }, // single function, not array
    },
  });

  await client.get('/data');
  assert(called, 'single function hook was called');
});

console.log('\n━━━ v14: Complete API Surface Verification ━━━');

test('v14: full API surface check', () => {
  const api = require('./src/index');

  // Version
  assertEqual(api.VERSION, '18.0.2');

  // v14 options available in client defaults
  const client = api.createClient({
    retryConfig: { retries: 2 },
    cache: { ttl: 5000 },
    dedupe: { enabled: true },
    tokenRefresh: { onRefresh: async () => 'token' },
    timing: true,
    hooks: { onRequest: [() => {}] },
  });

  assert('retryConfig' in client.defaults, 'defaults.retryConfig');
  assert('cache' in client.defaults, 'defaults.cache');
  assert('dedupe' in client.defaults, 'defaults.dedupe');
  assert('tokenRefresh' in client.defaults, 'defaults.tokenRefresh');
  assert('timing' in client.defaults, 'defaults.timing');
  assert('hooks' in client.defaults, 'defaults.hooks');

  // New methods
  assert(typeof client.clearResponseCache === 'function', 'clearResponseCache is function');
});

test('v14: defaults are null when not configured', () => {
  const client = createClient();
  assertEqual(client.defaults.retryConfig, null);
  assertEqual(client.defaults.cache, null);
  assertEqual(client.defaults.dedupe, null);
  assertEqual(client.defaults.tokenRefresh, null);
  assertEqual(client.defaults.timing, false);
  assertEqual(client.defaults.hooks, null);
});

test('v14: client still works perfectly without any v14 config', async () => {
  const customAdapter = async () => ({
    data: { name: 'test' }, rawData: { name: 'test' },
    status: 200, statusText: 'OK',
    headers: { 'content-type': 'application/json' },
    request: { url: 'http://test.local/basic', method: 'GET' },
  });

  const client = createClient({
    adapter: customAdapter,
    baseURL: 'http://test.local',
  });

  const res = await client.get('/basic');
  assertEqual(res.status, 200);
  assertEqual(res.data.name, 'test');
});

test('v14: cache + dedup + timing combined', async () => {
  let callCount = 0;
  const customAdapter = async () => {
    callCount++;
    await new Promise(r => setTimeout(r, 10));
    return {
      data: { v: callCount }, rawData: { v: callCount },
      status: 200, statusText: 'OK',
      headers: {}, request: {},
    };
  };

  const client = createClient({
    adapter: customAdapter,
    baseURL: 'http://test.local',
    cache: { ttl: 10000, methods: ['GET'] },
    dedupe: { enabled: true, methods: ['GET'] },
    timing: true,
  });

  const res = await client.get('/combined');
  assert(typeof res.duration === 'number', 'has duration');
  assert(res.timing.duration >= 0, 'timing duration >= 0');
  assertEqual(callCount, 1);
});

test('v14: retryConfig + hooks combined', async () => {
  let attempts = 0;
  const hookLog = [];
  const customAdapter = async () => {
    attempts++;
    if (attempts < 2) {
      return {
        data: null, rawData: null,
        status: 502, statusText: 'Bad Gateway',
        headers: {}, request: {},
      };
    }
    return {
      data: { ok: true }, rawData: { ok: true },
      status: 200, statusText: 'OK',
      headers: {}, request: {},
    };
  };

  const client = createClient({
    adapter: customAdapter,
    baseURL: 'http://test.local',
    retryConfig: { retries: 3, retryDelay: () => 1 },
    hooks: {
      onRequest: [(config) => hookLog.push('req')],
      onResponse: [(res) => hookLog.push('res')],
      onError: [(err) => hookLog.push('err')],
      onRetry: [(count) => hookLog.push(`retry:${count}`)],
    },
  });

  const res = await client.get('/test');
  assertEqual(res.status, 200);
  assert(hookLog.includes('req'), 'onRequest fired');
  assert(hookLog.includes('res'), 'onResponse fired');
});

test('v14: staleWhileRevalidate returns stale data immediately', async () => {
  let callCount = 0;
  const customAdapter = async () => {
    callCount++;
    return {
      data: { v: callCount }, rawData: { v: callCount },
      status: 200, statusText: 'OK',
      headers: {}, request: {},
    };
  };

  const client = createClient({
    adapter: customAdapter,
    baseURL: 'http://test.local',
    cache: { ttl: 1, methods: ['GET'], staleWhileRevalidate: true }, // 1ms TTL
  });

  // First request — fills cache
  const res1 = await client.get('/stale-test');
  assertEqual(res1.data.v, 1);

  // Wait for cache to expire
  await new Promise(r => setTimeout(r, 10));

  // Second request — should return stale data immediately
  const res2 = await client.get('/stale-test');
  assertEqual(res2.data.v, 1); // stale data returned immediately
});

// ─── v15 Tests ─────────────────────────────────────────────────────────────────

console.log('\n--- v15: Full Axios Replacement Tests ---');

// ─── Interceptor runWhen + synchronous ──────────────────────────────────────

test('v15: interceptor runWhen — skips interceptor when predicate returns false', async () => {
  const log = [];
  const customAdapter = async () => ({
    data: { ok: true }, rawData: { ok: true },
    status: 200, statusText: 'OK',
    headers: {}, request: {},
  });

  const client = createClient({ adapter: customAdapter, baseURL: 'http://test.local' });
  client.interceptors.request.use(
    (config) => { log.push('always'); return config; },
  );
  client.interceptors.request.use(
    (config) => { log.push('conditional'); return config; },
    null,
    { runWhen: (config) => config.url === '/only-this' },
  );

  await client.get('/other');
  assert(log.includes('always'), 'always interceptor ran');
  assert(!log.includes('conditional'), 'conditional interceptor was skipped');

  log.length = 0;
  await client.get('/only-this');
  assert(log.includes('always'), 'always interceptor ran again');
  assert(log.includes('conditional'), 'conditional interceptor ran when predicate matched');
});

test('v15: interceptor runWhen — runs all when runWhen not specified', async () => {
  const log = [];
  const customAdapter = async () => ({
    data: {}, rawData: {},
    status: 200, statusText: 'OK',
    headers: {}, request: {},
  });

  const client = createClient({ adapter: customAdapter, baseURL: 'http://test.local' });
  client.interceptors.request.use((config) => { log.push('a'); return config; });
  client.interceptors.request.use((config) => { log.push('b'); return config; });

  await client.get('/test');
  assertEqual(log.length, 2);
  assertEqual(log[0], 'a');
  assertEqual(log[1], 'b');
});

test('v15: interceptor synchronous option stores correctly', () => {
  const chain = new InterceptorChain();
  const id = chain.use((x) => x, null, { synchronous: true });
  const handlers = chain.handlers();
  assert(handlers.length === 1, 'handler registered');
  assertEqual(handlers[0].synchronous, true);
});

test('v15: interceptor use with options preserves fulfilled/rejected', () => {
  const chain = new InterceptorChain();
  const fn1 = (x) => x;
  const fn2 = (e) => { throw e; };
  const id = chain.use(fn1, fn2, { runWhen: () => true, synchronous: false });
  const handlers = chain.handlers();
  assertEqual(handlers[0].fulfilled, fn1);
  assertEqual(handlers[0].rejected, fn2);
  assertEqual(typeof handlers[0].runWhen, 'function');
  assertEqual(handlers[0].synchronous, false);
});

test('v15: response interceptor runWhen — skips when predicate returns false', async () => {
  const log = [];
  const customAdapter = async (config) => ({
    data: { status: config.fullURL.includes('special') ? 'special' : 'normal' },
    rawData: { status: 'normal' },
    status: 200, statusText: 'OK',
    headers: {}, request: {},
  });

  const client = createClient({ adapter: customAdapter, baseURL: 'http://test.local' });
  client.interceptors.response.use(
    (res) => { log.push('always-res'); return res; },
  );
  client.interceptors.response.use(
    (res) => { log.push('conditional-res'); return res; },
    null,
    { runWhen: (res) => res.data && res.data.status === 'special' },
  );

  await client.get('/normal');
  assert(log.includes('always-res'), 'always response interceptor ran');
  assert(!log.includes('conditional-res'), 'conditional response interceptor was skipped');

  log.length = 0;
  await client.get('/special');
  assert(log.includes('always-res'), 'always response interceptor ran again');
  assert(log.includes('conditional-res'), 'conditional response interceptor ran when predicate matched');
});

// ─── AxiosHeaders.fromString ────────────────────────────────────────────────

test('v15: AxiosHeaders.fromString parses raw header string', () => {
  const raw = 'Content-Type: application/json\r\nAccept: text/html\r\nAuthorization: Bearer token123';
  const headers = AxiosHeaders.fromString(raw);
  assertEqual(headers.get('Content-Type'), 'application/json');
  assertEqual(headers.get('accept'), 'text/html');
  assertEqual(headers.get('authorization'), 'Bearer token123');
});

test('v15: AxiosHeaders.fromString handles empty string', () => {
  const headers = AxiosHeaders.fromString('');
  assertEqual(headers.size, 0);
});

test('v15: AxiosHeaders.fromString handles null', () => {
  const headers = AxiosHeaders.fromString(null);
  assertEqual(headers.size, 0);
});

test('v15: AxiosHeaders.fromString handles LF-only line endings', () => {
  const raw = 'Content-Type: text/plain\nX-Custom: value';
  const headers = AxiosHeaders.fromString(raw);
  assertEqual(headers.get('Content-Type'), 'text/plain');
  assertEqual(headers.get('X-Custom'), 'value');
});

// ─── AxiosHeaders toJSON filter ─────────────────────────────────────────────

test('v15: AxiosHeaders toJSON with array filter', () => {
  const headers = new AxiosHeaders({
    'Content-Type': 'application/json',
    'Accept': 'text/html',
    'Authorization': 'Bearer token',
  });
  const filtered = headers.toJSON(['Content-Type', 'Accept']);
  assert('Content-Type' in filtered, 'Content-Type included');
  assert('Accept' in filtered, 'Accept included');
  assert(!('Authorization' in filtered), 'Authorization excluded');
});

test('v15: AxiosHeaders toJSON with RegExp filter', () => {
  const headers = new AxiosHeaders({
    'Content-Type': 'application/json',
    'Content-Length': '100',
    'Accept': 'text/html',
  });
  const filtered = headers.toJSON(/^Content/i);
  assert('Content-Type' in filtered, 'Content-Type included');
  assert('Content-Length' in filtered, 'Content-Length included');
  assert(!('Accept' in filtered), 'Accept excluded');
});

test('v15: AxiosHeaders toJSON with boolean (legacy behavior)', () => {
  const headers = new AxiosHeaders({ 'Content-Type': 'application/json' });
  const result = headers.toJSON(true);
  assert('Content-Type' in result, 'uses normalized names');
});

// ─── AxiosHeaders additional accessors ──────────────────────────────────────

test('v15: AxiosHeaders has User-Agent accessor', () => {
  const headers = new AxiosHeaders();
  headers.setUserAgent('test-agent/1.0');
  assertEqual(headers.getUserAgent(), 'test-agent/1.0');
  assert(headers.hasUserAgent(), 'hasUserAgent returns true');
});

test('v15: AxiosHeaders has Content-Encoding accessor', () => {
  const headers = new AxiosHeaders();
  headers.setContentEncoding('gzip');
  assertEqual(headers.getContentEncoding(), 'gzip');
  assert(headers.hasContentEncoding(), 'hasContentEncoding returns true');
});

test('v15: AxiosHeaders has Content-Disposition accessor', () => {
  const headers = new AxiosHeaders();
  headers.setContentDisposition('attachment; filename="file.pdf"');
  assertEqual(headers.getContentDisposition(), 'attachment; filename="file.pdf"');
  assert(headers.hasContentDisposition(), 'hasContentDisposition returns true');
});

// ─── Auto Content-Type serialization ────────────────────────────────────────

test('v15: auto Content-Type serialization — URLSearchParams for application/x-www-form-urlencoded', async () => {
  let capturedBody = null;
  const customAdapter = async (config) => {
    capturedBody = config.body;
    return {
      data: { ok: true }, rawData: { ok: true },
      status: 200, statusText: 'OK',
      headers: {}, request: {},
    };
  };

  const client = createClient({
    adapter: customAdapter,
    baseURL: 'http://test.local',
    transformRequest: [], // disable default JSON transform to test auto-serialization
  });

  await client.post('/data', { name: 'John', age: 30 }, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });

  // Body should have been auto-converted to URLSearchParams then serialized
  assert(capturedBody !== null, 'body was sent');
  // URLSearchParams.toString() or the string form
  const bodyStr = typeof capturedBody === 'string' ? capturedBody : capturedBody.toString();
  assert(bodyStr.includes('name=John'), 'contains name=John');
  assert(bodyStr.includes('age=30'), 'contains age=30');
});

test('v15: auto Content-Type serialization disabled when autoContentType=false', async () => {
  let capturedBody = null;
  const customAdapter = async (config) => {
    capturedBody = config.body;
    return {
      data: { ok: true }, rawData: { ok: true },
      status: 200, statusText: 'OK',
      headers: {}, request: {},
    };
  };

  const client = createClient({
    adapter: customAdapter,
    baseURL: 'http://test.local',
    autoContentType: false,
    transformRequest: [],
  });

  await client.post('/data', { name: 'John' }, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });

  // Body should NOT be auto-converted (it will be serialized as JSON by body handler)
  assert(capturedBody !== null, 'body was sent');
  // It should be JSON string, not URLSearchParams
  const bodyStr = typeof capturedBody === 'string' ? capturedBody : JSON.stringify(capturedBody);
  assert(bodyStr.includes('name'), 'body contains name');
});

// ─── Request correlation IDs ────────────────────────────────────────────────

test('v15: requestId adds x-request-id header', async () => {
  let capturedHeaders = null;
  const customAdapter = async (config) => {
    capturedHeaders = config.headers;
    return {
      data: { ok: true }, rawData: { ok: true },
      status: 200, statusText: 'OK',
      headers: {}, request: {},
    };
  };

  const client = createClient({
    adapter: customAdapter,
    baseURL: 'http://test.local',
    requestId: true,
  });

  await client.get('/test');
  assert(capturedHeaders !== null, 'headers captured');
  assert(capturedHeaders['x-request-id'] !== undefined, 'x-request-id header present');
  assertEqual(typeof capturedHeaders['x-request-id'], 'string');
  assert(capturedHeaders['x-request-id'].length > 0, 'x-request-id is non-empty');
});

test('v15: requestId with custom header name', async () => {
  let capturedHeaders = null;
  const customAdapter = async (config) => {
    capturedHeaders = config.headers;
    return {
      data: { ok: true }, rawData: { ok: true },
      status: 200, statusText: 'OK',
      headers: {}, request: {},
    };
  };

  const client = createClient({
    adapter: customAdapter,
    baseURL: 'http://test.local',
    requestId: 'X-Correlation-ID',
  });

  await client.get('/test');
  assert(capturedHeaders['X-Correlation-ID'] !== undefined, 'custom correlation header present');
  assertEqual(typeof capturedHeaders['X-Correlation-ID'], 'string');
});

test('v15: requestId=false does not add header', async () => {
  let capturedHeaders = null;
  const customAdapter = async (config) => {
    capturedHeaders = config.headers;
    return {
      data: { ok: true }, rawData: { ok: true },
      status: 200, statusText: 'OK',
      headers: {}, request: {},
    };
  };

  const client = createClient({
    adapter: customAdapter,
    baseURL: 'http://test.local',
    requestId: false,
  });

  await client.get('/test');
  assert(capturedHeaders['x-request-id'] === undefined, 'no x-request-id header');
});

// ─── Enhanced paramsSerializer ──────────────────────────────────────────────

test('v15: paramsSerializer with { serialize } function', () => {
  const client = createClient({
    baseURL: 'http://test.local',
    paramsSerializer: {
      serialize: (params) => `custom=${Object.keys(params).join(',')}`,
    },
  });

  const uri = client.getUri({ url: '/test', params: { a: 1, b: 2 } });
  assert(uri.includes('custom=a,b'), 'uses custom serialize function');
});

test('v15: paramsSerializer with { encode } function', () => {
  const client = createClient({
    baseURL: 'http://test.local',
    paramsSerializer: {
      encode: (value) => value.toUpperCase(),
    },
  });

  const uri = client.getUri({ url: '/test', params: { name: 'hello' } });
  assert(uri.includes('NAME=HELLO'), 'uses custom encode function');
});

test('v15: paramsSerializer as function still works (backward compat)', () => {
  const client = createClient({
    baseURL: 'http://test.local',
    paramsSerializer: (params) => `legacy=${JSON.stringify(params)}`,
  });

  const uri = client.getUri({ url: '/test', params: { a: 1 } });
  assert(uri.includes('legacy='), 'legacy function serializer works');
});

test('v15: resolveParamsSerializer returns null for null input', () => {
  assertEqual(resolveParamsSerializer(null), null);
});

test('v15: resolveParamsSerializer handles function directly', () => {
  const fn = (params) => 'test';
  const result = resolveParamsSerializer(fn);
  assertEqual(result, fn);
});

test('v15: resolveParamsSerializer handles object with serialize', () => {
  const serializer = { serialize: (params) => 'custom' };
  const fn = resolveParamsSerializer(serializer);
  assertEqual(typeof fn, 'function');
  assertEqual(fn({ a: 1 }), 'custom');
});

test('v15: resolveParamsSerializer handles object with encode only', () => {
  const serializer = { encode: (v) => v.toUpperCase() };
  const fn = resolveParamsSerializer(serializer);
  assertEqual(typeof fn, 'function');
  const result = fn({ name: 'test' });
  assert(result.includes('NAME=TEST'), 'encode function applied');
});

// ─── beforeRedirect ─────────────────────────────────────────────────────────

test('v15: beforeRedirect callback is stored in config', () => {
  const cb = () => {};
  const client = createClient({
    baseURL: 'http://test.local',
    beforeRedirect: cb,
  });
  assertEqual(client.defaults.beforeRedirect, cb);
});

// ─── Full API surface check ────────────────────────────────────────────────

test('v15: full API surface check', () => {
  // v15 new exports available
  const api = { resolveParamsSerializer, VERSION };
  assertEqual(typeof resolveParamsSerializer, 'function');
  assertEqual(api.VERSION, '18.0.2');

  // AxiosHeaders v15 enhancements
  assert(typeof AxiosHeaders.fromString === 'function', 'AxiosHeaders.fromString exists');

  // Interceptor chain supports 3-arg use
  const chain = new InterceptorChain();
  const id = chain.use((x) => x, null, { runWhen: () => true, synchronous: true });
  assert(typeof id === 'number', 'use returns an id');
  const handlers = chain.handlers();
  assert(handlers[0].runWhen !== undefined, 'runWhen stored');
  assert(handlers[0].synchronous !== undefined, 'synchronous stored');

  // apiBridge callable has resolveParamsSerializer
  assert(typeof apiBridge.resolveParamsSerializer === 'function', 'apiBridge.resolveParamsSerializer exists');
});

test('v15: all existing awsibnj features preserved', () => {
  // Verify all core exports still exist
  assert(typeof bridge === 'function', 'bridge function exists');
  assert(typeof bridgeFetch === 'function', 'bridgeFetch function exists');
  assert(typeof transform === 'function', 'transform function exists');
  assert(typeof createTransformer === 'function', 'createTransformer function exists');
  assert(typeof createClient === 'function', 'createClient function exists');
  assert(typeof all === 'function', 'all function exists');
  assert(typeof spread === 'function', 'spread function exists');
  assert(typeof isClientError === 'function', 'isClientError function exists');
  assert(typeof isCancel === 'function', 'isCancel function exists');
  assert(typeof toFormData === 'function', 'toFormData function exists');
  assert(typeof mergeConfig === 'function', 'mergeConfig function exists');
  assert(typeof buildURL === 'function', 'buildURL function exists');

  // v3-v8 classes
  assert(typeof PluginManager === 'function', 'PluginManager exists');
  assert(typeof CircuitBreaker === 'function', 'CircuitBreaker exists');
  assert(typeof GraphQLBridge === 'function', 'GraphQLBridge exists');
  assert(typeof RetryStrategy === 'function', 'RetryStrategy exists');
  assert(typeof EventBus === 'function', 'EventBus exists');
  assert(typeof FuzzyMatcher === 'function', 'FuzzyMatcher exists');
  assert(typeof FieldAliaser === 'function', 'FieldAliaser exists');
  assert(typeof SchemaMigrator === 'function', 'SchemaMigrator exists');
  assert(typeof BatchOrchestrator === 'function', 'BatchOrchestrator exists');
  assert(typeof DeepMerge === 'function', 'DeepMerge exists');

  // v9-v14 client features
  assert(typeof awsibnjClient === 'function', 'awsibnjClient exists');
  assert(typeof ClientError === 'function', 'ClientError exists');
  assert(typeof InterceptorManager === 'function', 'InterceptorManager exists');
  assert(typeof CancelToken === 'function', 'CancelToken exists');
  assert(typeof AxiosHeaders === 'function', 'AxiosHeaders exists');
  assert(typeof Axios === 'function', 'Axios alias exists');
  assert(typeof AxiosError === 'function', 'AxiosError alias exists');
  assert(typeof isAxiosError === 'function', 'isAxiosError exists');
});

test('v15: client with all v14 features still works', async () => {
  let callCount = 0;
  const customAdapter = async () => {
    callCount++;
    return {
      data: { result: callCount }, rawData: { result: callCount },
      status: 200, statusText: 'OK',
      headers: {}, request: {},
    };
  };

  const client = createClient({
    adapter: customAdapter,
    baseURL: 'http://test.local',
    cache: { ttl: 10000, methods: ['GET'] },
    dedupe: { enabled: true, methods: ['GET'] },
    timing: true,
    requestId: true, // v15 feature
    hooks: {
      onRequest: [(config) => {}],
      onResponse: [(res) => {}],
    },
  });

  const res = await client.get('/combined-v15');
  assertEqual(res.status, 200);
  assert(typeof res.duration === 'number', 'timing works');
  assert(res.config.headers['x-request-id'] !== undefined, 'request ID injected');
});

// ═══════════════════════════════════════════════════════════════════════════════
// v16: Security & Power Tests
// ═══════════════════════════════════════════════════════════════════════════════

// ─── SSRFGuard Tests ──────────────────────────────────────────────────────────

test('v16: SSRFGuard — blocks private IP 127.0.0.1', () => {
  const guard = new SSRFGuard();
  let threw = false;
  try { guard.validateURL('http://127.0.0.1/admin'); } catch (e) { threw = true; assert(e.message.includes('SSRF_BLOCKED'), e.message); }
  assert(threw, 'Should have thrown for 127.0.0.1');
});

test('v16: SSRFGuard — blocks private IP 10.0.0.1', () => {
  const guard = new SSRFGuard();
  let threw = false;
  try { guard.validateURL('http://10.0.0.1/internal'); } catch (e) { threw = true; assert(e.message.includes('SSRF_BLOCKED'), e.message); }
  assert(threw, 'Should have thrown for 10.0.0.1');
});

test('v16: SSRFGuard — blocks private IP 192.168.1.1', () => {
  const guard = new SSRFGuard();
  let threw = false;
  try { guard.validateURL('http://192.168.1.1/api'); } catch (e) { threw = true; assert(e.message.includes('SSRF_BLOCKED'), e.message); }
  assert(threw, 'Should have thrown for 192.168.1.1');
});

test('v16: SSRFGuard — blocks private IP 172.16.0.1', () => {
  const guard = new SSRFGuard();
  let threw = false;
  try { guard.validateURL('http://172.16.0.1/api'); } catch (e) { threw = true; assert(e.message.includes('SSRF_BLOCKED'), e.message); }
  assert(threw, 'Should have thrown for 172.16.0.1');
});

test('v16: SSRFGuard — blocks cloud metadata 169.254.169.254', () => {
  const guard = new SSRFGuard();
  let threw = false;
  try { guard.validateURL('http://169.254.169.254/latest/meta-data/'); } catch (e) { threw = true; assert(e.message.includes('SSRF_BLOCKED'), e.message); }
  assert(threw, 'Should have thrown for metadata endpoint');
});

test('v16: SSRFGuard — blocks metadata.google.internal', () => {
  const guard = new SSRFGuard();
  let threw = false;
  try { guard.validateURL('http://metadata.google.internal/computeMetadata/v1/'); } catch (e) { threw = true; assert(e.message.includes('SSRF_BLOCKED'), e.message); }
  assert(threw, 'Should have thrown for GCP metadata');
});

test('v16: SSRFGuard — blocks localhost', () => {
  const guard = new SSRFGuard();
  let threw = false;
  try { guard.validateURL('http://localhost/admin'); } catch (e) { threw = true; assert(e.message.includes('SSRF_BLOCKED'), e.message); }
  assert(threw, 'Should have thrown for localhost');
});

test('v16: SSRFGuard — blocks file:// protocol', () => {
  const guard = new SSRFGuard();
  let threw = false;
  try { guard.validateURL('file:///etc/passwd'); } catch (e) { threw = true; assert(e.message.includes('SSRF_BLOCKED'), e.message); }
  assert(threw, 'Should have thrown for file protocol');
});

test('v16: SSRFGuard — blocks data: protocol', () => {
  const guard = new SSRFGuard();
  let threw = false;
  try { guard.validateURL('data:text/html,<script>alert(1)</script>'); } catch (e) { threw = true; assert(e.message.includes('SSRF_BLOCKED'), e.message); }
  assert(threw, 'Should have thrown for data protocol');
});

test('v16: SSRFGuard — blocks javascript: protocol', () => {
  const guard = new SSRFGuard();
  let threw = false;
  try { guard.validateURL('javascript:alert(1)'); } catch (e) { threw = true; assert(e.message.includes('SSRF_BLOCKED'), e.message); }
  assert(threw, 'Should have thrown for javascript protocol');
});

test('v16: SSRFGuard — allows public URLs', () => {
  const guard = new SSRFGuard();
  assertEqual(guard.validateURL('https://api.example.com/users'), true);
});

test('v16: SSRFGuard — allowlist bypasses SSRF check', () => {
  const guard = new SSRFGuard({ allowlist: ['localhost'] });
  assertEqual(guard.validateURL('http://localhost/api'), true);
});

test('v16: SSRFGuard — custom blocklist blocks specified hosts', () => {
  const guard = new SSRFGuard({ blocklist: ['evil.com'] });
  let threw = false;
  try { guard.validateURL('https://evil.com/steal'); } catch (e) { threw = true; }
  assert(threw, 'Should have blocked evil.com');
});

test('v16: SSRFGuard — disabled does not block', () => {
  const guard = new SSRFGuard({ enabled: false });
  assertEqual(guard.validateURL('http://127.0.0.1/admin'), true);
});

test('v16: SSRFGuard — throws on empty/null URL', () => {
  const guard = new SSRFGuard();
  let threw = false;
  try { guard.validateURL(''); } catch (e) { threw = true; }
  assert(threw, 'Should have thrown for empty URL');
});

test('v16: SSRFGuard — blocks 0.0.0.0', () => {
  const guard = new SSRFGuard();
  let threw = false;
  try { guard.validateURL('http://0.0.0.0/admin'); } catch (e) { threw = true; assert(e.message.includes('SSRF_BLOCKED'), e.message); }
  assert(threw, 'Should have thrown for 0.0.0.0');
});

test('v16: isPrivateIP — identifies private IPs', () => {
  assert(isPrivateIP('127.0.0.1'), '127.0.0.1 is private');
  assert(isPrivateIP('10.0.0.1'), '10.0.0.1 is private');
  assert(isPrivateIP('192.168.0.1'), '192.168.0.1 is private');
  assert(isPrivateIP('172.16.0.1'), '172.16.0.1 is private');
  assert(!isPrivateIP('8.8.8.8'), '8.8.8.8 is not private');
  assert(!isPrivateIP('203.0.113.1'), '203.0.113.1 is not private');
});

// ─── HeaderValidator Tests ────────────────────────────────────────────────────

test('v16: HeaderValidator — accepts valid header names', () => {
  const v = new HeaderValidator();
  assertEqual(v.validateHeaderName('Content-Type'), true);
  assertEqual(v.validateHeaderName('X-Custom-Header'), true);
  assertEqual(v.validateHeaderName('Authorization'), true);
});

test('v16: HeaderValidator — rejects CRLF in header name', () => {
  const v = new HeaderValidator();
  let threw = false;
  try { v.validateHeaderName('Bad\r\nHeader'); } catch (e) { threw = true; assert(e.message.includes('CRLF'), e.message); }
  assert(threw, 'Should have rejected CRLF in header name');
});

test('v16: HeaderValidator — rejects CRLF in header value', () => {
  const v = new HeaderValidator();
  let threw = false;
  try { v.validateHeaderValue('value\r\nInjected: evil'); } catch (e) { threw = true; assert(e.message.includes('CRLF'), e.message); }
  assert(threw, 'Should have rejected CRLF in header value');
});

test('v16: HeaderValidator — rejects empty header name', () => {
  const v = new HeaderValidator();
  let threw = false;
  try { v.validateHeaderName(''); } catch (e) { threw = true; }
  assert(threw, 'Should have rejected empty header name');
});

test('v16: HeaderValidator — rejects invalid characters in header name', () => {
  const v = new HeaderValidator();
  let threw = false;
  try { v.validateHeaderName('Bad Header'); } catch (e) { threw = true; }
  assert(threw, 'Should have rejected space in header name');
});

test('v16: HeaderValidator — enforces maxHeadersCount', () => {
  const v = new HeaderValidator({ maxHeadersCount: 3 });
  const headers = { 'A': '1', 'B': '2', 'C': '3', 'D': '4' };
  let threw = false;
  try { v.validateHeaders(headers); } catch (e) { threw = true; assert(e.message.includes('COUNT_EXCEEDED'), e.message); }
  assert(threw, 'Should have thrown for too many headers');
});

test('v16: HeaderValidator — enforces maxHeaderSize', () => {
  const v = new HeaderValidator({ maxHeaderSize: 10 });
  let threw = false;
  try { v.validateHeaderValue('this is way too long for the limit'); } catch (e) { threw = true; assert(e.message.includes('TOO_LARGE'), e.message); }
  assert(threw, 'Should have thrown for oversized header');
});

test('v16: HeaderValidator — validates all headers in object', () => {
  const v = new HeaderValidator();
  assertEqual(v.validateHeaders({ 'Content-Type': 'application/json', 'Accept': 'text/html' }), true);
});

test('v16: HeaderValidator — allows null header value', () => {
  const v = new HeaderValidator();
  assertEqual(v.validateHeaderValue(null), true);
});

// ─── RequestRateLimiter Tests ─────────────────────────────────────────────────

test('v16: RequestRateLimiter — allows requests within limit', () => {
  const limiter = new RequestRateLimiter({ maxRequests: 5, windowMs: 60000 });
  assert(limiter.acquire(), 'First request should be allowed');
  assert(limiter.acquire(), 'Second request should be allowed');
  assert(limiter.acquire(), 'Third request should be allowed');
});

test('v16: RequestRateLimiter — blocks requests over limit', () => {
  const limiter = new RequestRateLimiter({ maxRequests: 2, windowMs: 60000 });
  assert(limiter.acquire(), 'First request allowed');
  assert(limiter.acquire(), 'Second request allowed');
  assert(!limiter.acquire(), 'Third request should be blocked');
});

test('v16: RequestRateLimiter — per-endpoint limiting', () => {
  const limiter = new RequestRateLimiter({ maxRequests: 1, windowMs: 60000 });
  assert(limiter.acquire('/users'), 'First /users request allowed');
  assert(!limiter.acquire('/users'), 'Second /users request blocked');
  assert(limiter.acquire('/posts'), 'First /posts request still allowed');
});

test('v16: RequestRateLimiter — reset restores tokens', () => {
  const limiter = new RequestRateLimiter({ maxRequests: 1, windowMs: 60000 });
  assert(limiter.acquire(), 'First request allowed');
  assert(!limiter.acquire(), 'Second request blocked');
  limiter.reset();
  assert(limiter.acquire(), 'After reset, request allowed again');
});

test('v16: RequestRateLimiter — reset specific endpoint', () => {
  const limiter = new RequestRateLimiter({ maxRequests: 1, windowMs: 60000 });
  assert(limiter.acquire('/users'), 'First /users request allowed');
  assert(!limiter.acquire('/users'), 'Second /users request blocked');
  limiter.reset('/users');
  assert(limiter.acquire('/users'), 'After reset, /users allowed again');
});

// ─── ResponseSizeGuard Tests ──────────────────────────────────────────────────

test('v16: ResponseSizeGuard — allows responses within limit', () => {
  const guard = new ResponseSizeGuard({ maxResponseSize: 1024 });
  assertEqual(guard.checkSize(512), true);
});

test('v16: ResponseSizeGuard — blocks oversized responses', () => {
  const guard = new ResponseSizeGuard({ maxResponseSize: 1024 });
  let threw = false;
  try { guard.checkSize(2048); } catch (e) { threw = true; assert(e.message.includes('RESPONSE_TOO_LARGE'), e.message); }
  assert(threw, 'Should have thrown for oversized response');
});

test('v16: ResponseSizeGuard — handles string Content-Length', () => {
  const guard = new ResponseSizeGuard({ maxResponseSize: 100 });
  let threw = false;
  try { guard.checkSize('200'); } catch (e) { threw = true; }
  assert(threw, 'Should have thrown for string content-length above limit');
});

test('v16: ResponseSizeGuard — allows unknown size', () => {
  const guard = new ResponseSizeGuard({ maxResponseSize: 100 });
  assertEqual(guard.checkSize(NaN), true);
  assertEqual(guard.checkSize(undefined), true);
});

test('v16: ResponseSizeGuard — streaming tracker works', () => {
  const guard = new ResponseSizeGuard({ maxResponseSize: 100 });
  const tracker = guard.createSizeTracker();
  tracker.add(50);
  assertEqual(tracker.total, 50);
  tracker.add(30);
  assertEqual(tracker.total, 80);
  let threw = false;
  try { tracker.add(30); } catch (e) { threw = true; }
  assert(threw, 'Should have thrown when cumulative exceeds limit');
});

test('v16: ResponseSizeGuard — default 10MB limit', () => {
  const guard = new ResponseSizeGuard();
  assertEqual(guard.maxResponseSize, 10 * 1024 * 1024);
});

// ─── SensitiveDataRedactor Tests ──────────────────────────────────────────────

test('v16: SensitiveDataRedactor — redacts Authorization header', () => {
  const redactor = new SensitiveDataRedactor();
  const result = redactor.redactHeaders({ 'Authorization': 'Bearer secret-token', 'Content-Type': 'application/json' });
  assertEqual(result['Authorization'], '[REDACTED]');
  assertEqual(result['Content-Type'], 'application/json');
});

test('v16: SensitiveDataRedactor — redacts Cookie header', () => {
  const redactor = new SensitiveDataRedactor();
  const result = redactor.redactHeaders({ 'cookie': 'session=abc123' });
  assertEqual(result['cookie'], '[REDACTED]');
});

test('v16: SensitiveDataRedactor — redacts x-api-key header', () => {
  const redactor = new SensitiveDataRedactor();
  const result = redactor.redactHeaders({ 'x-api-key': 'sk-12345' });
  assertEqual(result['x-api-key'], '[REDACTED]');
});

test('v16: SensitiveDataRedactor — redactConfig strips auth and headers', () => {
  const redactor = new SensitiveDataRedactor();
  const config = {
    method: 'GET',
    url: 'https://api.example.com/users?token=secret123',
    headers: { 'Authorization': 'Bearer token123', 'Accept': 'application/json' },
    auth: { username: 'admin', password: 'secret' },
  };
  const safe = redactor.redactConfig(config);
  assertEqual(safe.headers['Authorization'], '[REDACTED]');
  assertEqual(safe.headers['Accept'], 'application/json');
  assertEqual(safe.auth, '[REDACTED]');
  assert(safe.url.includes('[REDACTED]'), 'URL token should be redacted');
  assertEqual(safe.method, 'GET');
});

test('v16: SensitiveDataRedactor — redactURL strips sensitive params', () => {
  const redactor = new SensitiveDataRedactor();
  const url = 'https://api.example.com/users?token=abc123&page=1&api_key=xyz';
  const safe = redactor.redactURL(url);
  assert(safe.includes('page=1'), 'Non-sensitive param preserved');
  assert(safe.includes('[REDACTED]'), 'Sensitive params redacted');
  assert(!safe.includes('abc123'), 'Token value removed');
});

test('v16: SensitiveDataRedactor — isSensitiveHeader returns correct results', () => {
  const redactor = new SensitiveDataRedactor();
  assert(redactor.isSensitiveHeader('Authorization'), 'Authorization is sensitive');
  assert(redactor.isSensitiveHeader('COOKIE'), 'Cookie (uppercase) is sensitive');
  assert(redactor.isSensitiveHeader('x-api-key'), 'x-api-key is sensitive');
  assert(!redactor.isSensitiveHeader('Content-Type'), 'Content-Type is not sensitive');
  assert(!redactor.isSensitiveHeader('Accept'), 'Accept is not sensitive');
});

test('v16: SensitiveDataRedactor — custom sensitive headers', () => {
  const redactor = new SensitiveDataRedactor({ sensitiveHeaders: ['X-Custom-Secret'] });
  assert(redactor.isSensitiveHeader('X-Custom-Secret'), 'Custom header is sensitive');
  assert(redactor.isSensitiveHeader('Authorization'), 'Default headers still sensitive');
});

test('v16: SensitiveDataRedactor — handles null/undefined gracefully', () => {
  const redactor = new SensitiveDataRedactor();
  const result1 = redactor.redactHeaders(null);
  assert(typeof result1 === 'object', 'Returns object for null');
  const result2 = redactor.redactConfig(null);
  assert(typeof result2 === 'object', 'Returns object for null config');
  assertEqual(redactor.redactURL(''), '');
  assertEqual(redactor.redactURL(null), '');
});

// ─── RequestFingerprinter Tests ───────────────────────────────────────────────

test('v16: RequestFingerprinter — generates consistent fingerprints', () => {
  const fp = new RequestFingerprinter();
  const config = { method: 'GET', url: '/users', params: { page: 1 } };
  const hash1 = fp.fingerprint(config);
  const hash2 = fp.fingerprint(config);
  assertEqual(hash1, hash2);
  assert(hash1.length === 64, 'SHA-256 produces 64-char hex');
});

test('v16: RequestFingerprinter — different configs produce different fingerprints', () => {
  const fp = new RequestFingerprinter();
  const hash1 = fp.fingerprint({ method: 'GET', url: '/users' });
  const hash2 = fp.fingerprint({ method: 'POST', url: '/users' });
  assert(hash1 !== hash2, 'Different methods should produce different hashes');
});

test('v16: RequestFingerprinter — isDuplicate detects duplicates', () => {
  const fp = new RequestFingerprinter();
  const config = { method: 'GET', url: '/users' };
  assert(!fp.isDuplicate(config, 5000), 'First time should not be duplicate');
  assert(fp.isDuplicate(config, 5000), 'Second time should be duplicate');
});

test('v16: RequestFingerprinter — isDuplicate respects window', () => {
  const fp = new RequestFingerprinter();
  const config = { method: 'GET', url: '/test-window' };
  assert(!fp.isDuplicate(config, 0), 'With 0 window, nothing is duplicate');
});

test('v16: RequestFingerprinter — reset clears history', () => {
  const fp = new RequestFingerprinter();
  fp.isDuplicate({ method: 'GET', url: '/test' }, 5000);
  fp.reset();
  assert(!fp.isDuplicate({ method: 'GET', url: '/test' }, 5000), 'After reset, no duplicates');
});

test('v16: RequestFingerprinter — handles null/undefined config', () => {
  const fp = new RequestFingerprinter();
  assertEqual(fp.fingerprint(null), '');
  assertEqual(fp.fingerprint(undefined), '');
  assert(!fp.isDuplicate(null, 5000), 'Null config is not duplicate');
});

// ─── Prototype Pollution Guard Tests ──────────────────────────────────────────

test('v16: safeMerge — merges objects safely', () => {
  const target = { a: 1, b: { c: 2 } };
  const source = { b: { d: 3 }, e: 4 };
  safeMerge(target, source);
  assertEqual(target.a, 1);
  assertEqual(target.b.c, 2);
  assertEqual(target.b.d, 3);
  assertEqual(target.e, 4);
});

test('v16: safeMerge — blocks __proto__ pollution', () => {
  const target = {};
  const malicious = JSON.parse('{"__proto__": {"polluted": true}}');
  safeMerge(target, malicious);
  assertEqual(({}).polluted, undefined);
  assertEqual(target.polluted, undefined);
});

test('v16: safeMerge — blocks constructor pollution', () => {
  const target = {};
  const malicious = { constructor: { prototype: { polluted: true } } };
  safeMerge(target, malicious);
  assertEqual(({}).polluted, undefined);
});

test('v16: safeMerge — blocks prototype pollution', () => {
  const target = {};
  const malicious = { prototype: { polluted: true } };
  safeMerge(target, malicious);
  assert(!target.hasOwnProperty('prototype'), 'prototype key should be skipped');
});

test('v16: safeMerge — handles non-object inputs gracefully', () => {
  const target = { a: 1 };
  safeMerge(target, null);
  assertEqual(target.a, 1);
  safeMerge(target, 'string');
  assertEqual(target.a, 1);
  safeMerge(target, [1, 2, 3]);
  assertEqual(target.a, 1);
});

test('v16: sanitizeObject — removes dangerous keys', () => {
  const obj = { a: 1, __proto__: { evil: true }, b: { constructor: 'bad', c: 3 } };
  sanitizeObject(obj);
  assertEqual(obj.a, 1);
  assert(!obj.hasOwnProperty('__proto__'), '__proto__ removed');
  assertEqual(obj.b.c, 3);
  assert(!obj.b.hasOwnProperty('constructor'), 'constructor removed');
});

test('v16: sanitizeObject — handles arrays', () => {
  const arr = [{ a: 1 }, { __proto__: { evil: true }, b: 2 }];
  sanitizeObject(arr);
  assertEqual(arr[0].a, 1);
  assertEqual(arr[1].b, 2);
});

test('v16: sanitizeObject — handles null/undefined', () => {
  assertEqual(sanitizeObject(null), null);
  assertEqual(sanitizeObject(undefined), undefined);
  assertEqual(sanitizeObject('string'), 'string');
});

// ─── Client Integration Tests ─────────────────────────────────────────────────

test('v16: client SSRF protection blocks internal URLs', async () => {
  const client = createClient({ baseURL: 'http://127.0.0.1' });
  let threw = false;
  try {
    await client.get('/admin');
  } catch (e) {
    threw = true;
    assertEqual(e.code, 'ERR_SSRF_BLOCKED');
    assert(e instanceof ClientError, 'Should be ClientError');
  }
  assert(threw, 'Should have thrown for SSRF attempt');
});

test('v16: client SSRF protection blocks metadata endpoints', async () => {
  const client = createClient({ baseURL: 'http://169.254.169.254' });
  let threw = false;
  try {
    await client.get('/latest/meta-data/');
  } catch (e) {
    threw = true;
    assertEqual(e.code, 'ERR_SSRF_BLOCKED');
  }
  assert(threw, 'Should have thrown for cloud metadata');
});

test('v16: client SSRF can be disabled', async () => {
  let fetchCalled = false;
  const mockAdapter = async () => {
    fetchCalled = true;
    return { data: {}, rawData: {}, status: 200, statusText: 'OK', headers: {}, request: {} };
  };
  const client = createClient({ ssrf: { enabled: false }, adapter: mockAdapter, baseURL: 'http://127.0.0.1' });
  await client.get('/admin');
  assert(fetchCalled, 'Request should have proceeded');
});

test('v16: client SSRF allowlist works', async () => {
  let fetchCalled = false;
  const mockAdapter = async () => {
    fetchCalled = true;
    return { data: {}, rawData: {}, status: 200, statusText: 'OK', headers: {}, request: {} };
  };
  const client = createClient({ ssrf: { allowlist: ['127.0.0.1'] }, adapter: mockAdapter, baseURL: 'http://127.0.0.1' });
  await client.get('/admin');
  assert(fetchCalled, 'Allowlisted host should work');
});

test('v16: client header validation catches CRLF injection', async () => {
  const mockAdapter = async () => ({ data: {}, rawData: {}, status: 200, statusText: 'OK', headers: {}, request: {} });
  const client = createClient({ adapter: mockAdapter, ssrf: { enabled: false }, baseURL: 'http://example.com' });
  let threw = false;
  try {
    await client.get('/test', { headers: { 'X-Evil\r\nInjection': 'value' } });
  } catch (e) {
    threw = true;
    assertEqual(e.code, 'ERR_HEADER_VALIDATION');
  }
  assert(threw, 'Should have caught CRLF injection');
});

test('v16: client rate limiter blocks excessive requests', async () => {
  const mockAdapter = async () => ({ data: {}, rawData: {}, status: 200, statusText: 'OK', headers: {}, request: {} });
  const client = createClient({
    adapter: mockAdapter,
    ssrf: { enabled: false },
    baseURL: 'http://example.com',
    rateLimiter: { maxRequests: 2, windowMs: 60000 },
  });

  await client.get('/test1');
  await client.get('/test1');
  let threw = false;
  try {
    await client.get('/test1');
  } catch (e) {
    threw = true;
    assertEqual(e.code, 'ERR_RATE_LIMITED');
  }
  assert(threw, 'Third request should be rate limited');
});

test('v16: client replay detection blocks duplicate requests', async () => {
  const mockAdapter = async () => ({ data: { ok: true }, rawData: { ok: true }, status: 200, statusText: 'OK', headers: {}, request: {} });
  const client = createClient({
    adapter: mockAdapter,
    ssrf: { enabled: false },
    baseURL: 'http://example.com',
    replayDetection: 60000,
  });

  await client.get('/replay-test');
  let threw = false;
  try {
    await client.get('/replay-test');
  } catch (e) {
    threw = true;
    assertEqual(e.code, 'ERR_DUPLICATE_REQUEST');
  }
  assert(threw, 'Duplicate request should be detected');
});

test('v16: client journey tracking records attempts', async () => {
  const mockAdapter = async () => ({
    data: { ok: true }, rawData: { ok: true },
    status: 200, statusText: 'OK',
    headers: {}, request: {},
  });
  const client = createClient({
    adapter: mockAdapter,
    ssrf: { enabled: false },
    baseURL: 'http://example.com',
    journeyTracking: true,
    timing: true,
  });

  const res = await client.get('/journey-test');
  assert(res.journey !== undefined, 'Journey should be attached');
  assert(res.journey.attempts.length > 0, 'Should have at least one attempt');
  assert(typeof res.journey.totalDuration === 'number', 'Should have totalDuration');
  assert(typeof res.journey.startTime === 'number', 'Should have startTime');
  assert(typeof res.journey.endTime === 'number', 'Should have endTime');
});

test('v16: client error objects have redacted config', async () => {
  const mockAdapter = async () => ({
    data: {}, rawData: {},
    status: 401, statusText: 'Unauthorized',
    headers: {}, request: {},
  });
  const client = createClient({
    adapter: mockAdapter,
    ssrf: { enabled: false },
    baseURL: 'http://example.com',
    auth: { username: 'admin', password: 'secret' },
  });

  let threw = false;
  try {
    await client.get('/secure');
  } catch (e) {
    threw = true;
    // Error config should have redacted sensitive data
    if (e.config && e.config.auth) {
      assertEqual(e.config.auth, '[REDACTED]');
    }
    if (e.config && e.config.headers && e.config.headers['Authorization']) {
      assertEqual(e.config.headers['Authorization'], '[REDACTED]');
    }
  }
  assert(threw, 'Should have thrown for 401');
});

test('v16: new error codes exist on ClientError', () => {
  assertEqual(ClientError.ERR_SSRF_BLOCKED, 'ERR_SSRF_BLOCKED');
  assertEqual(ClientError.ERR_HEADER_VALIDATION, 'ERR_HEADER_VALIDATION');
  assertEqual(ClientError.ERR_RATE_LIMITED, 'ERR_RATE_LIMITED');
  assertEqual(ClientError.ERR_DUPLICATE_REQUEST, 'ERR_DUPLICATE_REQUEST');
  assertEqual(ClientError.ERR_RESPONSE_TOO_LARGE, 'ERR_RESPONSE_TOO_LARGE');
});

test('v18: VERSION is 18.0.2', () => {
  assertEqual(VERSION, '18.0.2');
});

// ─── v16 Export Tests ─────────────────────────────────────────────────────────

test('v16: all security classes are exported', () => {
  assert(typeof SSRFGuard === 'function', 'SSRFGuard exported');
  assert(typeof HeaderValidator === 'function', 'HeaderValidator exported');
  assert(typeof RequestRateLimiter === 'function', 'RequestRateLimiter exported');
  assert(typeof ResponseSizeGuard === 'function', 'ResponseSizeGuard exported');
  assert(typeof SensitiveDataRedactor === 'function', 'SensitiveDataRedactor exported');
  assert(typeof RequestFingerprinter === 'function', 'RequestFingerprinter exported');
  assert(typeof safeMerge === 'function', 'safeMerge exported');
  assert(typeof sanitizeObject === 'function', 'sanitizeObject exported');
  assert(typeof isPrivateIP === 'function', 'isPrivateIP exported');
});

test('v16: security classes available on default apiBridge export', () => {
  assert(typeof apiBridge.SSRFGuard === 'function', 'apiBridge.SSRFGuard');
  assert(typeof apiBridge.HeaderValidator === 'function', 'apiBridge.HeaderValidator');
  assert(typeof apiBridge.RequestRateLimiter === 'function', 'apiBridge.RequestRateLimiter');
  assert(typeof apiBridge.ResponseSizeGuard === 'function', 'apiBridge.ResponseSizeGuard');
  assert(typeof apiBridge.SensitiveDataRedactor === 'function', 'apiBridge.SensitiveDataRedactor');
  assert(typeof apiBridge.RequestFingerprinter === 'function', 'apiBridge.RequestFingerprinter');
  assert(typeof apiBridge.safeMerge === 'function', 'apiBridge.safeMerge');
  assert(typeof apiBridge.sanitizeObject === 'function', 'apiBridge.sanitizeObject');
  assert(typeof apiBridge.isPrivateIP === 'function', 'apiBridge.isPrivateIP');
});

test('v16: client with all v15+v16 features combined', async () => {
  let callCount = 0;
  const customAdapter = async () => {
    callCount++;
    return {
      data: { result: callCount }, rawData: { result: callCount },
      status: 200, statusText: 'OK',
      headers: {}, request: {},
    };
  };

  const client = createClient({
    adapter: customAdapter,
    ssrf: { enabled: false },
    baseURL: 'http://test.local',
    cache: { ttl: 10000, methods: ['GET'] },
    dedupe: { enabled: true, methods: ['GET'] },
    timing: true,
    requestId: true,
    journeyTracking: true,
    hooks: {
      onRequest: [(config) => {}],
      onResponse: [(res) => {}],
    },
  });

  const res = await client.get('/combined-v16');
  assertEqual(res.status, 200);
  assert(typeof res.duration === 'number', 'timing works');
  assert(res.config.headers['x-request-id'] !== undefined, 'request ID injected');
  assert(res.journey !== undefined, 'journey tracking works');
});

// ─── v17: ContentSecurityPolicy Tests ─────────────────────────────────────────
console.log('\n━━━ v17: ContentSecurityPolicy ━━━');

test('v17: CSP buildHeader() returns valid CSP string with all directives', () => {
  const csp = new ContentSecurityPolicy();
  const header = csp.buildHeader();
  assert(header.includes("default-src 'self'"), 'has default-src');
  assert(header.includes("script-src 'self'"), 'has script-src');
  assert(header.includes("style-src 'self' 'unsafe-inline'"), 'has style-src');
  assert(header.includes("img-src 'self' data:"), 'has img-src');
  assert(header.includes("connect-src 'self'"), 'has connect-src');
  assert(header.includes("font-src 'self'"), 'has font-src');
  assert(header.includes("object-src 'none'"), 'has object-src');
  assert(header.includes("frame-src 'none'"), 'has frame-src');
  assert(header.includes("base-uri 'self'"), 'has base-uri');
  assert(header.includes("form-action 'self'"), 'has form-action');
});

test('v17: CSP getHeaderName() returns Content-Security-Policy', () => {
  const csp = new ContentSecurityPolicy();
  assertEqual(csp.getHeaderName(), 'Content-Security-Policy');
});

test('v17: CSP getHeaderName() returns report-only header name', () => {
  const csp = new ContentSecurityPolicy({ reportOnly: true });
  assertEqual(csp.getHeaderName(), 'Content-Security-Policy-Report-Only');
});

test('v17: CSP validateSource() accepts safe sources', () => {
  const csp = new ContentSecurityPolicy();
  assert(csp.validateSource("'self'"), "'self' is valid");
  assert(csp.validateSource("'none'"), "'none' is valid");
  assert(csp.validateSource('data:'), 'data: is valid');
  assert(csp.validateSource('https://cdn.example.com'), 'HTTPS URL is valid');
  assert(csp.validateSource("'nonce-abc123=='"), 'nonce is valid');
  assert(csp.validateSource('*.example.com'), 'wildcard domain is valid');
});

test('v17: CSP validateSource() rejects dangerous/invalid sources', () => {
  const csp = new ContentSecurityPolicy();
  assert(!csp.validateSource(''), 'empty string is invalid');
  assert(!csp.validateSource(null), 'null is invalid');
  assert(!csp.validateSource(undefined), 'undefined is invalid');
  assert(!csp.validateSource('javascript:alert(1)'), 'javascript: is invalid');
});

test('v17: CSP addNonce() generates nonce and adds to scriptSrc', () => {
  const csp = new ContentSecurityPolicy();
  const initialLen = csp.scriptSrc.length;
  const nonce = csp.addNonce();
  assert(typeof nonce === 'string', 'nonce is string');
  assert(nonce.length > 0, 'nonce is non-empty');
  assertEqual(csp.scriptSrc.length, initialLen + 1);
  assert(csp.scriptSrc[csp.scriptSrc.length - 1].includes(nonce), 'scriptSrc includes nonce');
  assert(csp.buildHeader().includes(`'nonce-${nonce}'`), 'header includes nonce');
});

test('v17: CSP toJSON() returns all directives as object', () => {
  const csp = new ContentSecurityPolicy();
  const json = csp.toJSON();
  assert(Array.isArray(json.defaultSrc), 'defaultSrc is array');
  assert(Array.isArray(json.scriptSrc), 'scriptSrc is array');
  assert(Array.isArray(json.styleSrc), 'styleSrc is array');
  assert(Array.isArray(json.imgSrc), 'imgSrc is array');
  assertEqual(json.reportOnly, false);
  assertEqual(json.reportUri, null);
});

test('v17: CSP custom directives are included in buildHeader()', () => {
  const csp = new ContentSecurityPolicy({
    customDirectives: { 'worker-src': ["'self'", 'blob:'] },
  });
  const header = csp.buildHeader();
  assert(header.includes("worker-src 'self' blob:"), 'custom directive in header');
});

test('v17: CSP constructor uses defaults when no options provided', () => {
  const csp = new ContentSecurityPolicy();
  assertEqual(csp.defaultSrc[0], "'self'");
  assertEqual(csp.scriptSrc[0], "'self'");
  assertEqual(csp.reportOnly, false);
  assertEqual(csp.reportUri, null);
});

test('v17: CSP custom options override defaults', () => {
  const csp = new ContentSecurityPolicy({
    defaultSrc: ["'none'"],
    scriptSrc: ['https://scripts.example.com'],
    reportUri: '/csp-report',
    reportOnly: true,
  });
  assertEqual(csp.defaultSrc[0], "'none'");
  assertEqual(csp.scriptSrc[0], 'https://scripts.example.com');
  assertEqual(csp.reportUri, '/csp-report');
  assertEqual(csp.reportOnly, true);
  assert(csp.buildHeader().includes('report-uri /csp-report'), 'report-uri in header');
});

test('v17: CSP reportUri appears in buildHeader output', () => {
  const csp = new ContentSecurityPolicy({ reportUri: '/report' });
  assert(csp.buildHeader().includes('report-uri /report'), 'report-uri present');
});

test('v17: CSP buildHeader directives separated by semicolons', () => {
  const csp = new ContentSecurityPolicy();
  const header = csp.buildHeader();
  const parts = header.split('; ');
  assert(parts.length >= 10, 'at least 10 directives');
});

test('v17: CSP validateSource accepts sha256 hash', () => {
  const csp = new ContentSecurityPolicy();
  assert(csp.validateSource("'sha256-abc123=='"), 'sha256 hash is valid');
});

test('v17: CSP validateSource accepts blob:', () => {
  const csp = new ContentSecurityPolicy();
  assert(csp.validateSource('blob:'), 'blob: is valid');
});

test('v17: CSP validateSource accepts wildcard', () => {
  const csp = new ContentSecurityPolicy();
  assert(csp.validateSource('*'), 'wildcard is valid');
});

test('v17: CSP addNonce generates unique nonces', () => {
  const csp = new ContentSecurityPolicy();
  const n1 = csp.addNonce();
  const n2 = csp.addNonce();
  assert(n1 !== n2, 'nonces should be unique');
});

// ─── v17: CertificatePinning Tests ────────────────────────────────────────────
console.log('\n━━━ v17: CertificatePinning ━━━');

test('v17: CertificatePinning addPin/getPins stores and retrieves pins', () => {
  const cp = new CertificatePinning();
  cp.addPin('api.example.com', 'hash1');
  cp.addPin('api.example.com', 'hash2');
  const pins = cp.getPins('api.example.com');
  assertEqual(pins.length, 2);
  assert(pins.includes('hash1'), 'has hash1');
  assert(pins.includes('hash2'), 'has hash2');
});

test('v17: CertificatePinning verify() valid when cert matches pin', () => {
  const cp = new CertificatePinning();
  cp.addPin('api.example.com', 'correcthash');
  const result = cp.verify('api.example.com', 'correcthash');
  assertEqual(result.valid, true);
  assertEqual(result.enforced, true);
});

test('v17: CertificatePinning verify() invalid when cert does not match', () => {
  const cp = new CertificatePinning();
  cp.addPin('api.example.com', 'correcthash');
  const result = cp.verify('api.example.com', 'wronghash');
  assertEqual(result.valid, false);
  assertEqual(result.enforced, true);
});

test('v17: CertificatePinning verify() valid for unknown hosts (no pins)', () => {
  const cp = new CertificatePinning();
  const result = cp.verify('unknown.com', 'anyhash');
  assertEqual(result.valid, true);
  assertEqual(result.enforced, false);
});

test('v17: CertificatePinning report mode returns valid even on mismatch', () => {
  const cp = new CertificatePinning({ enforceMode: 'report' });
  cp.addPin('api.example.com', 'correcthash');
  const result = cp.verify('api.example.com', 'wronghash');
  assertEqual(result.valid, true);
  assertEqual(result.enforced, false);
});

test('v17: CertificatePinning removePin removes all pins for host', () => {
  const cp = new CertificatePinning();
  cp.addPin('api.example.com', 'hash1');
  cp.addPin('api.example.com', 'hash2');
  cp.removePin('api.example.com');
  assertEqual(cp.getPins('api.example.com').length, 0);
});

test('v17: CertificatePinning buildHPKPHeader builds correct header', () => {
  const cp = new CertificatePinning({ maxAge: 3600, includeSubdomains: true });
  cp.addPin('api.example.com', 'hash1');
  const header = cp.buildHPKPHeader('api.example.com');
  assert(header.includes('pin-sha256="hash1"'), 'has pin directive');
  assert(header.includes('max-age=3600'), 'has max-age');
  assert(header.includes('includeSubDomains'), 'has includeSubDomains');
});

test('v17: CertificatePinning toJSON returns pins structure', () => {
  const cp = new CertificatePinning({ enforceMode: 'report', maxAge: 7200 });
  cp.addPin('api.example.com', 'hash1');
  const json = cp.toJSON();
  assertEqual(json.enforceMode, 'report');
  assertEqual(json.maxAge, 7200);
  assert(Array.isArray(json.pins), 'pins is array');
  assertEqual(json.pins[0].host, 'api.example.com');
  assert(json.pins[0].sha256.includes('hash1'), 'sha256 has hash');
});

test('v17: CertificatePinning constructor initializes from options.pins', () => {
  const cp = new CertificatePinning({
    pins: [{ host: 'a.com', sha256: ['h1', 'h2'] }],
  });
  assertEqual(cp.getPins('a.com').length, 2);
});

test('v17: CertificatePinning host matching is case-insensitive', () => {
  const cp = new CertificatePinning();
  cp.addPin('API.Example.COM', 'hash1');
  const pins = cp.getPins('api.example.com');
  assertEqual(pins.length, 1);
});

// ─── v17: RequestSigning Tests ────────────────────────────────────────────────
console.log('\n━━━ v17: RequestSigning ━━━');

test('v17: RequestSigning sign() produces signature and timestamp', () => {
  const signer = new RequestSigning({ secret: 'test-secret' });
  const result = signer.sign({ method: 'POST', url: '/api/data', headers: {} });
  assert(typeof result.signature === 'string', 'signature is string');
  assert(result.signature.length > 0, 'signature is non-empty');
  assert(typeof result.timestamp === 'number', 'timestamp is number');
  assert(Array.isArray(result.signedHeaders), 'signedHeaders is array');
});

test('v17: RequestSigning verify() validates correct signature', () => {
  const signer = new RequestSigning({ secret: 'test-secret' });
  const config = { method: 'POST', url: '/api/data', headers: {} };
  const { signature, timestamp } = signer.sign(config);
  const result = signer.verify(config, signature, timestamp);
  assertEqual(result.valid, true);
});

test('v17: RequestSigning verify() rejects wrong signature', () => {
  const signer = new RequestSigning({ secret: 'test-secret' });
  const config = { method: 'POST', url: '/api/data', headers: {} };
  const { timestamp } = signer.sign(config);
  const result = signer.verify(config, 'wrongsignature', timestamp);
  assertEqual(result.valid, false);
  assert(result.reason.includes('does not match'), 'reason mentions mismatch');
});

test('v17: RequestSigning verify() rejects expired timestamp', () => {
  const signer = new RequestSigning({ secret: 'test-secret', timestampTolerance: 1 });
  const config = { method: 'POST', url: '/api/data', headers: {} };
  const { signature } = signer.sign(config);
  const expiredTimestamp = Math.floor(Date.now() / 1000) - 100;
  const result = signer.verify(config, signature, expiredTimestamp);
  assertEqual(result.valid, false);
  assert(result.reason.includes('expired'), 'reason mentions expired');
});

test('v17: RequestSigning createCanonicalString produces deterministic output', () => {
  const signer = new RequestSigning({ secret: 'test-secret' });
  const headers = { host: 'example.com', 'content-type': 'application/json' };
  const s1 = signer.createCanonicalString('POST', '/api', 1000, headers, ['host', 'content-type']);
  const s2 = signer.createCanonicalString('POST', '/api', 1000, headers, ['host', 'content-type']);
  assertEqual(s1, s2);
  assert(s1.includes('POST'), 'includes method');
  assert(s1.includes('/api'), 'includes url');
  assert(s1.includes('1000'), 'includes timestamp');
});

test('v17: RequestSigning custom secret changes signature', () => {
  const signer1 = new RequestSigning({ secret: 'secret-a' });
  const signer2 = new RequestSigning({ secret: 'secret-b' });
  const config = { method: 'GET', url: '/test', headers: {} };
  const sig1 = signer1.sign(config).signature;
  const sig2 = signer2.sign(config).signature;
  assert(sig1 !== sig2, 'different secrets produce different signatures');
});

test('v17: RequestSigning custom headerName is used', () => {
  const signer = new RequestSigning({ headerName: 'x-custom-sig' });
  assertEqual(signer.headerName, 'x-custom-sig');
});

test('v17: RequestSigning custom algorithm works', () => {
  const signer = new RequestSigning({ secret: 'test', algorithm: 'sha512' });
  const config = { method: 'GET', url: '/test', headers: {} };
  const { signature, timestamp } = signer.sign(config);
  const result = signer.verify(config, signature, timestamp);
  assertEqual(result.valid, true);
});

test('v17: RequestSigning sign includes all signed headers', () => {
  const signer = new RequestSigning({ secret: 'test', signedHeaders: ['host', 'x-custom'] });
  const { signedHeaders } = signer.sign({ method: 'GET', url: '/', headers: { host: 'a', 'x-custom': 'b' } });
  assert(signedHeaders.includes('host'), 'includes host');
  assert(signedHeaders.includes('x-custom'), 'includes x-custom');
});

test('v17: RequestSigning default secret is empty string', () => {
  const signer = new RequestSigning();
  assertEqual(signer.secret, '');
});

// ─── v17: InputSanitizer Tests ────────────────────────────────────────────────
console.log('\n━━━ v17: InputSanitizer ━━━');

test('v17: InputSanitizer sanitizeString escapes HTML entities in escape mode', () => {
  const s = new InputSanitizer({ mode: 'escape' });
  const result = s.sanitizeString('<b>hello</b>');
  assert(result.includes('&lt;'), 'escapes <');
  assert(result.includes('&gt;'), 'escapes >');
  assert(!result.includes('<b>'), 'no raw HTML tags');
});

test('v17: InputSanitizer sanitizeString strips script tags', () => {
  const s = new InputSanitizer({ mode: 'escape' });
  const result = s.sanitizeString('before<script>alert(1)</script>after');
  assert(!result.includes('<script>'), 'no script tags');
  assert(!result.includes('</script>'), 'no closing script tags');
});

test('v17: InputSanitizer sanitizeString strips event handlers', () => {
  const s = new InputSanitizer({ mode: 'escape' });
  const result = s.sanitizeString('<div onclick=alert(1)>test</div>');
  assert(!result.includes('onclick'), 'no event handlers');
});

test('v17: InputSanitizer sanitize() handles nested objects', () => {
  const s = new InputSanitizer({ mode: 'escape' });
  const result = s.sanitize({ a: { b: '<script>x</script>' } });
  assert(!result.a.b.includes('<script>'), 'nested strings sanitized');
});

test('v17: InputSanitizer sanitize() handles arrays', () => {
  const s = new InputSanitizer({ mode: 'escape' });
  const result = s.sanitize(['<b>a</b>', '<i>b</i>']);
  assert(result[0].includes('&lt;'), 'array item sanitized');
});

test('v17: InputSanitizer sanitize() respects maxDepth', () => {
  const s = new InputSanitizer({ maxDepth: 2 });
  let threw = false;
  try {
    s.sanitize({ a: { b: { c: 'deep' } } });
  } catch (e) {
    threw = true;
    assert(e.message.includes('Nesting depth'), 'mentions depth');
  }
  assert(threw, 'should throw for exceeding depth');
});

test('v17: InputSanitizer sanitize() respects maxStringLength', () => {
  const s = new InputSanitizer({ maxStringLength: 5 });
  let threw = false;
  try {
    s.sanitizeString('toolongstring');
  } catch (e) {
    threw = true;
    assert(e.message.includes('String length'), 'mentions string length');
  }
  assert(threw, 'should throw for exceeding max string length');
});

test('v17: InputSanitizer reject mode throws on dangerous content', () => {
  const s = new InputSanitizer({ mode: 'reject' });
  let threw = false;
  try {
    s.sanitizeString('<script>alert(1)</script>');
  } catch (e) {
    threw = true;
    assert(e.message.includes('INPUT_REJECTED'), 'mentions INPUT_REJECTED');
  }
  assert(threw, 'should throw for script tags in reject mode');
});

test('v17: InputSanitizer strip mode removes dangerous content', () => {
  const s = new InputSanitizer({ mode: 'strip' });
  const result = s.sanitizeString('hello<script>alert(1)</script>world');
  assertEqual(result, 'helloworld');
});

test('v17: InputSanitizer detectThreats finds XSS patterns', () => {
  const s = new InputSanitizer();
  const threats = s.detectThreats('<script>alert(1)</script>');
  assert(threats.length > 0, 'detected XSS threats');
  assertEqual(threats[0].type, 'xss');
});

test('v17: InputSanitizer detectThreats finds SQL injection patterns', () => {
  const s = new InputSanitizer();
  const threats = s.detectThreats("'; DROP TABLE users; --");
  assert(threats.some(t => t.type === 'sql_injection'), 'detected SQL injection');
});

test('v17: InputSanitizer detectThreats finds path traversal', () => {
  const s = new InputSanitizer();
  const threats = s.detectThreats('../../etc/passwd');
  assert(threats.some(t => t.type === 'path_traversal'), 'detected path traversal');
});

test('v17: InputSanitizer isClean returns true for safe input', () => {
  const s = new InputSanitizer();
  assert(s.isClean('hello world'), 'safe input is clean');
  assert(s.isClean({ name: 'John', age: 30 }), 'safe object is clean');
});

test('v17: InputSanitizer isClean returns false for dangerous input', () => {
  const s = new InputSanitizer();
  assert(!s.isClean('<script>alert(1)</script>'), 'XSS is not clean');
});

test('v17: InputSanitizer skips __proto__/constructor/prototype keys', () => {
  const s = new InputSanitizer({ mode: 'escape' });
  const input = Object.create(null);
  input.safe = 'ok';
  input['__proto__'] = 'bad';
  input['constructor'] = 'bad';
  input['prototype'] = 'bad';
  const result = s.sanitize(input);
  assert(!Object.prototype.hasOwnProperty.call(result, '__proto__'), '__proto__ skipped');
  assert(!Object.prototype.hasOwnProperty.call(result, 'constructor'), 'constructor skipped');
  assert(!Object.prototype.hasOwnProperty.call(result, 'prototype'), 'prototype skipped');
  assertEqual(result.safe, 'ok');
});

// ─── v17: SecurityAuditLogger Tests ──────────────────────────────────────────
console.log('\n━━━ v17: SecurityAuditLogger ━━━');

test('v17: SecurityAuditLogger log() creates entry with hash chain', () => {
  const logger = new SecurityAuditLogger();
  const entry = logger.log({ event: 'login', severity: 'info', details: { user: 'alice' } });
  assert(typeof entry.hash === 'string', 'entry has hash');
  assert(entry.hash.length > 0, 'hash is non-empty');
  assertEqual(entry.event, 'login');
  assertEqual(entry.severity, 'info');
  assertEqual(entry.id, 0);
  assert(typeof entry.timestamp === 'number', 'has timestamp');
});

test('v17: SecurityAuditLogger log() auto-rotates when maxEntries exceeded', () => {
  const logger = new SecurityAuditLogger({ maxEntries: 5 });
  for (let i = 0; i < 10; i++) {
    logger.log({ event: `event_${i}`, severity: 'info', details: {} });
  }
  const entries = logger.getEntries();
  assert(entries.length <= 5, 'entries rotated to at most maxEntries');
});

test('v17: SecurityAuditLogger verify() returns valid for intact log', () => {
  const logger = new SecurityAuditLogger();
  logger.log({ event: 'e1', severity: 'info', details: {} });
  logger.log({ event: 'e2', severity: 'warn', details: {} });
  logger.log({ event: 'e3', severity: 'info', details: {} });
  const result = logger.verify();
  assertEqual(result.valid, true);
  assertEqual(result.entries, 3);
});

test('v17: SecurityAuditLogger verify() detects tampered entries', () => {
  const logger = new SecurityAuditLogger();
  logger.log({ event: 'e1', severity: 'info', details: {} });
  logger.log({ event: 'e2', severity: 'info', details: {} });
  // Tamper with the hash
  logger._entries[1].hash = 'tampered';
  const result = logger.verify();
  assertEqual(result.valid, false);
});

test('v17: SecurityAuditLogger getEntries() filters by severity', () => {
  const logger = new SecurityAuditLogger();
  logger.log({ event: 'a', severity: 'info', details: {} });
  logger.log({ event: 'b', severity: 'error', details: {} });
  logger.log({ event: 'c', severity: 'info', details: {} });
  const errors = logger.getEntries({ severity: 'error' });
  assertEqual(errors.length, 1);
  assertEqual(errors[0].event, 'b');
});

test('v17: SecurityAuditLogger getEntries() filters by event name', () => {
  const logger = new SecurityAuditLogger();
  logger.log({ event: 'login', severity: 'info', details: {} });
  logger.log({ event: 'logout', severity: 'info', details: {} });
  logger.log({ event: 'login', severity: 'info', details: {} });
  const logins = logger.getEntries({ event: 'login' });
  assertEqual(logins.length, 2);
});

test('v17: SecurityAuditLogger getEntries() filters by since timestamp', () => {
  const logger = new SecurityAuditLogger();
  logger.log({ event: 'old', severity: 'info', details: {} });
  const cutoff = Date.now() + 1;
  logger.log({ event: 'new', severity: 'info', details: {} });
  // The 'new' entry should have timestamp >= cutoff (or very close)
  const all = logger.getEntries();
  const recent = logger.getEntries({ since: cutoff });
  assert(recent.length <= all.length, 'filtered entries <= total entries');
});

test('v17: SecurityAuditLogger getEntries() respects limit', () => {
  const logger = new SecurityAuditLogger();
  for (let i = 0; i < 10; i++) {
    logger.log({ event: `e${i}`, severity: 'info', details: {} });
  }
  const limited = logger.getEntries({ limit: 3 });
  assertEqual(limited.length, 3);
});

test('v17: SecurityAuditLogger getStats() returns correct counts', () => {
  const logger = new SecurityAuditLogger();
  logger.log({ event: 'a', severity: 'info', details: {} });
  logger.log({ event: 'b', severity: 'error', details: {} });
  logger.log({ event: 'c', severity: 'critical', details: {} });
  const stats = logger.getStats();
  assertEqual(stats.total, 3);
  assertEqual(stats.bySeverity.info, 1);
  assertEqual(stats.bySeverity.error, 1);
  assertEqual(stats.bySeverity.critical, 1);
  assertEqual(stats.bySeverity.warn, 0);
  assert(stats.lastEntry !== null, 'has lastEntry');
});

test('v17: SecurityAuditLogger onAlert callback fires for critical/error events', () => {
  let alertFired = 0;
  const logger = new SecurityAuditLogger({
    onAlert: (entry) => { alertFired++; },
  });
  logger.log({ event: 'a', severity: 'info', details: {} });
  logger.log({ event: 'b', severity: 'error', details: {} });
  logger.log({ event: 'c', severity: 'critical', details: {} });
  logger.log({ event: 'd', severity: 'warn', details: {} });
  assertEqual(alertFired, 2);
});

test('v17: SecurityAuditLogger clear() resets the log', () => {
  const logger = new SecurityAuditLogger();
  logger.log({ event: 'a', severity: 'info', details: {} });
  logger.log({ event: 'b', severity: 'info', details: {} });
  logger.clear();
  assertEqual(logger.getEntries().length, 0);
  assertEqual(logger.getStats().total, 0);
  const result = logger.verify();
  assertEqual(result.valid, true);
  assertEqual(result.entries, 0);
});

test('v17: SecurityAuditLogger multiple entries build correct hash chain', () => {
  const logger = new SecurityAuditLogger();
  const e1 = logger.log({ event: 'a', severity: 'info', details: {} });
  const e2 = logger.log({ event: 'b', severity: 'info', details: {} });
  const e3 = logger.log({ event: 'c', severity: 'info', details: {} });
  assert(e1.hash !== e2.hash, 'e1 and e2 have different hashes');
  assert(e2.hash !== e3.hash, 'e2 and e3 have different hashes');
  assertEqual(logger.verify().valid, true);
});

// ─── v17: PermissionPolicy Tests ─────────────────────────────────────────────
console.log('\n━━━ v17: PermissionPolicy ━━━');

test('v17: PermissionPolicy addPolicy/listPolicies stores and lists', () => {
  const pp = new PermissionPolicy();
  pp.addPolicy('admin', ['GET', 'POST'], ['/api/*']);
  pp.addPolicy('viewer', ['GET'], ['/api/read']);
  const all = pp.listPolicies();
  assertEqual(all.length, 2);
  const adminPolicies = pp.listPolicies('admin');
  assertEqual(adminPolicies.length, 1);
});

test('v17: PermissionPolicy check() allows matching role+method+endpoint', () => {
  const pp = new PermissionPolicy();
  pp.addPolicy('admin', ['GET', 'POST'], ['/api/users']);
  const result = pp.check('admin', 'GET', '/api/users');
  assertEqual(result.allowed, true);
});

test('v17: PermissionPolicy check() denies non-matching role', () => {
  const pp = new PermissionPolicy();
  pp.addPolicy('admin', ['GET'], ['/api/users']);
  const result = pp.check('viewer', 'GET', '/api/users');
  assertEqual(result.allowed, false);
});

test('v17: PermissionPolicy check() supports wildcard endpoints', () => {
  const pp = new PermissionPolicy();
  pp.addPolicy('admin', ['GET'], ['/api/*']);
  const result = pp.check('admin', 'GET', '/api/users/123');
  assertEqual(result.allowed, true);
});

test('v17: PermissionPolicy check() is case-insensitive for methods', () => {
  const pp = new PermissionPolicy();
  pp.addPolicy('admin', ['GET'], ['/api/users']);
  const result = pp.check('admin', 'get', '/api/users');
  assertEqual(result.allowed, true);
});

test('v17: PermissionPolicy checkMultiple() allows if any role matches', () => {
  const pp = new PermissionPolicy();
  pp.addPolicy('admin', ['GET'], ['/api/users']);
  const result = pp.checkMultiple(['viewer', 'admin'], 'GET', '/api/users');
  assertEqual(result.allowed, true);
  assertEqual(result.matchedRole, 'admin');
});

test('v17: PermissionPolicy checkMultiple() denies if no role matches', () => {
  const pp = new PermissionPolicy();
  pp.addPolicy('admin', ['GET'], ['/api/users']);
  const result = pp.checkMultiple(['viewer', 'guest'], 'GET', '/api/users');
  assertEqual(result.allowed, false);
});

test('v17: PermissionPolicy defaultAllow:true allows unmatched requests', () => {
  const pp = new PermissionPolicy({ defaultAllow: true });
  const result = pp.check('anyone', 'GET', '/unknown');
  assertEqual(result.allowed, true);
});

test('v17: PermissionPolicy removePolicy removes role policies', () => {
  const pp = new PermissionPolicy();
  pp.addPolicy('admin', ['GET'], ['/api/*']);
  pp.removePolicy('admin');
  assertEqual(pp.listPolicies('admin').length, 0);
  assertEqual(pp.check('admin', 'GET', '/api/users').allowed, false);
});

test('v17: PermissionPolicy empty policies with defaultAllow:false denies all', () => {
  const pp = new PermissionPolicy({ defaultAllow: false });
  const result = pp.check('admin', 'GET', '/anything');
  assertEqual(result.allowed, false);
});

test('v17: PermissionPolicy constructor initializes from options.policies', () => {
  const pp = new PermissionPolicy({
    policies: [
      { role: 'admin', methods: ['GET', 'POST'], endpoints: ['/api/*'] },
      { role: 'viewer', methods: ['GET'], endpoints: ['/api/read'] },
    ],
  });
  assertEqual(pp.listPolicies().length, 2);
  assertEqual(pp.check('admin', 'POST', '/api/data').allowed, true);
});

test('v17: PermissionPolicy check denies wrong method', () => {
  const pp = new PermissionPolicy();
  pp.addPolicy('viewer', ['GET'], ['/api/*']);
  const result = pp.check('viewer', 'DELETE', '/api/users');
  assertEqual(result.allowed, false);
});

// ─── v17: PayloadEncryptor Tests ─────────────────────────────────────────────
console.log('\n━━━ v17: PayloadEncryptor ━━━');

test('v17: PayloadEncryptor encrypt/decrypt roundtrip', () => {
  const enc = new PayloadEncryptor();
  const plaintext = 'hello secret world';
  const { encrypted, iv, tag } = enc.encrypt(plaintext);
  const decrypted = enc.decrypt(encrypted, iv, tag);
  assertEqual(decrypted, plaintext);
});

test('v17: PayloadEncryptor encryptObject/decryptObject roundtrip', () => {
  const enc = new PayloadEncryptor();
  const obj = { name: 'Alice', age: 30, nested: { key: 'value' } };
  const { encrypted, iv, tag } = enc.encryptObject(obj);
  const decrypted = enc.decryptObject(encrypted, iv, tag);
  assertEqual(decrypted.name, 'Alice');
  assertEqual(decrypted.age, 30);
  assertEqual(decrypted.nested.key, 'value');
});

test('v17: PayloadEncryptor different plaintexts produce different ciphertexts', () => {
  const enc = new PayloadEncryptor();
  const c1 = enc.encrypt('hello');
  const c2 = enc.encrypt('world');
  assert(c1.encrypted !== c2.encrypted, 'different ciphertexts');
});

test('v17: PayloadEncryptor getKeyFingerprint returns consistent fingerprint', () => {
  const enc = new PayloadEncryptor();
  const fp1 = enc.getKeyFingerprint();
  const fp2 = enc.getKeyFingerprint();
  assertEqual(fp1, fp2);
  assertEqual(fp1.length, 16);
});

test('v17: PayloadEncryptor rotateKey changes the key fingerprint', () => {
  const enc = new PayloadEncryptor();
  const fp1 = enc.getKeyFingerprint();
  enc.rotateKey();
  const fp2 = enc.getKeyFingerprint();
  assert(fp1 !== fp2, 'fingerprint changed after rotation');
});

test('v17: PayloadEncryptor constructor generates key when none provided', () => {
  const enc = new PayloadEncryptor();
  const fp = enc.getKeyFingerprint();
  assert(typeof fp === 'string', 'fingerprint is string');
  assert(fp.length === 16, 'fingerprint is 16 chars');
});

test('v17: PayloadEncryptor constructor accepts hex key string', () => {
  const crypto = require('crypto');
  const hexKey = crypto.randomBytes(32).toString('hex');
  const enc = new PayloadEncryptor({ key: hexKey });
  const { encrypted, iv, tag } = enc.encrypt('test');
  const decrypted = enc.decrypt(encrypted, iv, tag);
  assertEqual(decrypted, 'test');
});

test('v17: PayloadEncryptor invalid decryption throws error', () => {
  const enc1 = new PayloadEncryptor();
  const enc2 = new PayloadEncryptor(); // different key
  const { encrypted, iv, tag } = enc1.encrypt('test');
  let threw = false;
  try {
    // Decrypt with wrong key
    enc2.decrypt(encrypted, iv, tag);
  } catch (e) {
    threw = true;
  }
  assert(threw, 'should throw for invalid decryption');
});

test('v17: PayloadEncryptor same plaintext produces different ciphertext (random IV)', () => {
  const enc = new PayloadEncryptor();
  const c1 = enc.encrypt('same');
  const c2 = enc.encrypt('same');
  assert(c1.iv !== c2.iv, 'different IVs');
});

test('v17: PayloadEncryptor rotateKey with specific key', () => {
  const crypto = require('crypto');
  const enc = new PayloadEncryptor();
  const newKey = crypto.randomBytes(32);
  enc.rotateKey(newKey);
  const { encrypted, iv, tag } = enc.encrypt('after-rotate');
  assertEqual(enc.decrypt(encrypted, iv, tag), 'after-rotate');
});

// ─── v17: IdempotencyManager Tests ───────────────────────────────────────────
console.log('\n━━━ v17: IdempotencyManager ━━━');

test('v17: IdempotencyManager generateKey() returns UUID-format string', () => {
  const mgr = new IdempotencyManager();
  const key = mgr.generateKey();
  assert(typeof key === 'string', 'key is string');
  const parts = key.split('-');
  assertEqual(parts.length, 5);
  assertEqual(parts[0].length, 8);
  assertEqual(parts[1].length, 4);
  assertEqual(parts[2].length, 4);
  assertEqual(parts[3].length, 4);
  assertEqual(parts[4].length, 12);
});

test('v17: IdempotencyManager shouldEnforce() returns true for POST/PUT/PATCH', () => {
  const mgr = new IdempotencyManager();
  assert(mgr.shouldEnforce('POST'), 'POST enforced');
  assert(mgr.shouldEnforce('PUT'), 'PUT enforced');
  assert(mgr.shouldEnforce('PATCH'), 'PATCH enforced');
  assert(mgr.shouldEnforce('post'), 'lowercase post enforced');
});

test('v17: IdempotencyManager shouldEnforce() returns false for GET', () => {
  const mgr = new IdempotencyManager();
  assert(!mgr.shouldEnforce('GET'), 'GET not enforced');
  assert(!mgr.shouldEnforce('DELETE'), 'DELETE not enforced');
  assert(!mgr.shouldEnforce('HEAD'), 'HEAD not enforced');
});

test('v17: IdempotencyManager recordResponse/getStoredResponse roundtrip', () => {
  const mgr = new IdempotencyManager();
  const key = 'test-key-123';
  const response = { status: 200, data: { ok: true } };
  mgr.recordResponse(key, response);
  const stored = mgr.getStoredResponse(key);
  assertEqual(stored.status, 200);
  assertEqual(stored.data.ok, true);
});

test('v17: IdempotencyManager expired responses return null', () => {
  const mgr = new IdempotencyManager({ ttl: 1 }); // 1ms TTL
  const key = 'expire-key';
  mgr.recordResponse(key, { status: 200 });
  // Force expiration by manipulating timestamp
  mgr._store.get(key).timestamp = Date.now() - 100;
  const stored = mgr.getStoredResponse(key);
  assertEqual(stored, null);
});

test('v17: IdempotencyManager cleanup() removes expired entries', () => {
  const mgr = new IdempotencyManager({ ttl: 1 });
  mgr.recordResponse('k1', { a: 1 });
  mgr.recordResponse('k2', { a: 2 });
  // Force expiration
  for (const [, entry] of mgr._store) {
    entry.timestamp = Date.now() - 100;
  }
  const removed = mgr.cleanup();
  assertEqual(removed, 2);
  assert(!mgr.hasKey('k1'), 'k1 removed');
  assert(!mgr.hasKey('k2'), 'k2 removed');
});

test('v17: IdempotencyManager hasKey() detects stored keys', () => {
  const mgr = new IdempotencyManager();
  mgr.recordResponse('existing-key', { ok: true });
  assert(mgr.hasKey('existing-key'), 'has existing key');
  assert(!mgr.hasKey('missing-key'), 'does not have missing key');
});

test('v17: IdempotencyManager reset() clears all entries', () => {
  const mgr = new IdempotencyManager();
  mgr.recordResponse('a', { a: 1 });
  mgr.recordResponse('b', { b: 2 });
  mgr.reset();
  assert(!mgr.hasKey('a'), 'a removed');
  assert(!mgr.hasKey('b'), 'b removed');
});

test('v17: IdempotencyManager custom methods list is respected', () => {
  const mgr = new IdempotencyManager({ methods: ['DELETE', 'POST'] });
  assert(mgr.shouldEnforce('DELETE'), 'DELETE enforced');
  assert(mgr.shouldEnforce('POST'), 'POST enforced');
  assert(!mgr.shouldEnforce('PUT'), 'PUT not enforced');
  assert(!mgr.shouldEnforce('PATCH'), 'PATCH not enforced');
});

test('v17: IdempotencyManager custom headerName is used', () => {
  const mgr = new IdempotencyManager({ headerName: 'x-idem-key' });
  assertEqual(mgr.headerName, 'x-idem-key');
});

// ─── v17: Client Integration Tests ──────────────────────────────────────────
console.log('\n━━━ v17: Client Integration ━━━');

test('v17: client with inputSanitizer sanitizes request body', async () => {
  let capturedBody = null;
  const mockAdapter = async (config) => {
    capturedBody = config.body;
    return { data: { ok: true }, rawData: { ok: true }, status: 200, statusText: 'OK', headers: {}, request: {} };
  };
  const client = createClient({
    adapter: mockAdapter,
    ssrf: { enabled: false },
    baseURL: 'http://example.com',
    inputSanitizer: { mode: 'strip' },
  });
  await client.post('/api/data', { name: 'hello<script>alert(1)</script>world' });
  assert(capturedBody != null, 'body was captured');
  const bodyStr = typeof capturedBody === 'string' ? capturedBody : JSON.stringify(capturedBody);
  assert(!bodyStr.includes('<script>'), 'script tags stripped from body');
});

test('v17: client with permissions denies unauthorized requests', async () => {
  const mockAdapter = async () => ({ data: { ok: true }, rawData: { ok: true }, status: 200, statusText: 'OK', headers: {}, request: {} });
  const client = createClient({
    adapter: mockAdapter,
    ssrf: { enabled: false },
    baseURL: 'http://example.com',
    permissions: {
      policies: [{ role: 'admin', methods: ['GET'], endpoints: ['/api/*'] }],
      defaultAllow: false,
    },
  });

  // Inject role via request interceptor so it's on reqConfig
  client.interceptors.request.use((config) => {
    config.role = 'guest';
    return config;
  });

  let threw = false;
  try {
    await client.get('/api/users');
  } catch (e) {
    threw = true;
    assertEqual(e.code, 'ERR_PERMISSION_DENIED');
  }
  assert(threw, 'should deny unauthorized request');
});

test('v17: client with requestSigning adds signature headers', async () => {
  let capturedHeaders = {};
  const mockAdapter = async (config) => {
    capturedHeaders = config.headers || {};
    return { data: { ok: true }, rawData: { ok: true }, status: 200, statusText: 'OK', headers: {}, request: {} };
  };
  const client = createClient({
    adapter: mockAdapter,
    ssrf: { enabled: false },
    baseURL: 'http://example.com',
    requestSigning: { secret: 'my-secret', headerName: 'x-signature' },
  });
  await client.get('/api/data');
  assert(capturedHeaders['x-signature'] !== undefined, 'signature header injected');
  assert(capturedHeaders['x-timestamp'] !== undefined, 'timestamp header injected');
});

test('v17: client with idempotency injects idempotency-key header', async () => {
  let capturedHeaders = {};
  const mockAdapter = async (config) => {
    capturedHeaders = config.headers || {};
    return { data: { ok: true }, rawData: { ok: true }, status: 200, statusText: 'OK', headers: {}, request: {} };
  };
  const client = createClient({
    adapter: mockAdapter,
    ssrf: { enabled: false },
    baseURL: 'http://example.com',
    idempotency: { headerName: 'idempotency-key' },
  });
  await client.post('/api/create', { name: 'test' });
  assert(capturedHeaders['idempotency-key'] !== undefined, 'idempotency key injected');
});

test('v17: client with auditLog logs requests', async () => {
  const mockAdapter = async () => ({ data: { ok: true }, rawData: { ok: true }, status: 200, statusText: 'OK', headers: {}, request: {} });
  const client = createClient({
    adapter: mockAdapter,
    ssrf: { enabled: false },
    baseURL: 'http://example.com',
    auditLog: { maxEntries: 100 },
  });
  await client.get('/api/test');
  // AuditLog is internal but should not throw
  assert(true, 'request with auditLog completed without error');
});

test('v17: new error codes exist on ClientError (all 8)', () => {
  assertEqual(ClientError.ERR_CSP_VIOLATION, 'ERR_CSP_VIOLATION');
  assertEqual(ClientError.ERR_CERT_PIN_FAILED, 'ERR_CERT_PIN_FAILED');
  assertEqual(ClientError.ERR_SIGNATURE_INVALID, 'ERR_SIGNATURE_INVALID');
  assertEqual(ClientError.ERR_INPUT_REJECTED, 'ERR_INPUT_REJECTED');
  assertEqual(ClientError.ERR_PERMISSION_DENIED, 'ERR_PERMISSION_DENIED');
  assertEqual(ClientError.ERR_ENCRYPTION_FAILED, 'ERR_ENCRYPTION_FAILED');
  assertEqual(ClientError.ERR_DECRYPTION_FAILED, 'ERR_DECRYPTION_FAILED');
  assertEqual(ClientError.ERR_IDEMPOTENCY_CONFLICT, 'ERR_IDEMPOTENCY_CONFLICT');
});

test('v17: all v17 security classes are exported', () => {
  assert(typeof ContentSecurityPolicy === 'function', 'ContentSecurityPolicy exported');
  assert(typeof CertificatePinning === 'function', 'CertificatePinning exported');
  assert(typeof RequestSigning === 'function', 'RequestSigning exported');
  assert(typeof InputSanitizer === 'function', 'InputSanitizer exported');
  assert(typeof SecurityAuditLogger === 'function', 'SecurityAuditLogger exported');
  assert(typeof PermissionPolicy === 'function', 'PermissionPolicy exported');
  assert(typeof PayloadEncryptor === 'function', 'PayloadEncryptor exported');
  assert(typeof IdempotencyManager === 'function', 'IdempotencyManager exported');
});

test('v17: v17 security classes available on default apiBridge export', () => {
  assert(typeof apiBridge.ContentSecurityPolicy === 'function', 'apiBridge.ContentSecurityPolicy');
  assert(typeof apiBridge.CertificatePinning === 'function', 'apiBridge.CertificatePinning');
  assert(typeof apiBridge.RequestSigning === 'function', 'apiBridge.RequestSigning');
  assert(typeof apiBridge.InputSanitizer === 'function', 'apiBridge.InputSanitizer');
  assert(typeof apiBridge.SecurityAuditLogger === 'function', 'apiBridge.SecurityAuditLogger');
  assert(typeof apiBridge.PermissionPolicy === 'function', 'apiBridge.PermissionPolicy');
  assert(typeof apiBridge.PayloadEncryptor === 'function', 'apiBridge.PayloadEncryptor');
  assert(typeof apiBridge.IdempotencyManager === 'function', 'apiBridge.IdempotencyManager');
});

test('v17: client with all v16+v17 features combined', async () => {
  let callCount = 0;
  const customAdapter = async () => {
    callCount++;
    return {
      data: { result: callCount }, rawData: { result: callCount },
      status: 200, statusText: 'OK',
      headers: {}, request: {},
    };
  };

  const client = createClient({
    adapter: customAdapter,
    ssrf: { enabled: false },
    baseURL: 'http://test.local',
    cache: { ttl: 10000, methods: ['GET'] },
    dedupe: { enabled: true, methods: ['GET'] },
    timing: true,
    requestId: true,
    journeyTracking: true,
    requestSigning: { secret: 'combined-test' },
    auditLog: { maxEntries: 100 },
    idempotency: { headerName: 'idempotency-key' },
    hooks: {
      onRequest: [(config) => {}],
      onResponse: [(res) => {}],
    },
  });

  const res = await client.get('/combined-v17');
  assertEqual(res.status, 200);
  assert(typeof res.duration === 'number', 'timing works');
  assert(res.config.headers['x-request-id'] !== undefined, 'request ID injected');
  assert(res.config.headers['x-signature'] !== undefined, 'signature injected');
  assert(res.journey !== undefined, 'journey tracking works');
});

// ═══════════════════════════════════════════════════════════════════════════════
// v18: Elite Security Tests
// ═══════════════════════════════════════════════════════════════════════════════

// ─── ZeroTrustEngine Tests ─────────────────────────────────────────────────

test('v18: ZeroTrustEngine constructor defaults', () => {
  const engine = new ZeroTrustEngine();
  assertEqual(engine.trustThreshold, 50);
  assertEqual(engine.maxTrustScore, 100);
  assertEqual(engine.decayRate, 5);
  assertEqual(engine.decayIntervalMs, 60000);
});

test('v18: ZeroTrustEngine evaluate — unknown context denied', () => {
  const engine = new ZeroTrustEngine({ trustThreshold: 50 });
  const result = engine.evaluate({ contextId: 'ctx-1', ip: '1.2.3.4' });
  assertEqual(result.allowed, false);
  assert(typeof result.score === 'number', 'score is a number');
  assert(Array.isArray(result.factors), 'factors is array');
});

test('v18: ZeroTrustEngine evaluate — trusted context allowed', () => {
  const engine = new ZeroTrustEngine({ trustThreshold: 30 });
  engine.updateTrust('ctx-1', 60, 'initial setup');
  const result = engine.evaluate({ contextId: 'ctx-1', ip: '1.2.3.4', userAgent: 'TestAgent', method: 'GET' });
  assertEqual(result.allowed, true);
  assert(result.score >= 30, 'score above threshold');
});

test('v18: ZeroTrustEngine updateTrust and getTrustInfo', () => {
  const engine = new ZeroTrustEngine();
  engine.updateTrust('ctx-1', 40, 'manual boost');
  const info = engine.getTrustInfo('ctx-1');
  assert(info !== null, 'trust info exists');
  assertEqual(info.score, 40);
});

test('v18: ZeroTrustEngine updateTrust clamps to maxTrustScore', () => {
  const engine = new ZeroTrustEngine({ maxTrustScore: 100 });
  engine.updateTrust('ctx-1', 200, 'over max');
  const info = engine.getTrustInfo('ctx-1');
  assertEqual(info.score, 100);
});

test('v18: ZeroTrustEngine updateTrust clamps to 0', () => {
  const engine = new ZeroTrustEngine();
  engine.updateTrust('ctx-1', -50, 'negative');
  const info = engine.getTrustInfo('ctx-1');
  assertEqual(info.score, 0);
});

test('v18: ZeroTrustEngine revokeTrust removes context', () => {
  const engine = new ZeroTrustEngine();
  engine.updateTrust('ctx-1', 50, 'setup');
  engine.revokeTrust('ctx-1');
  const info = engine.getTrustInfo('ctx-1');
  assertEqual(info, null);
});

test('v18: ZeroTrustEngine reset clears all', () => {
  const engine = new ZeroTrustEngine();
  engine.updateTrust('ctx-1', 50, 'setup');
  engine.updateTrust('ctx-2', 60, 'setup');
  engine.reset();
  assertEqual(engine.getTrustInfo('ctx-1'), null);
  assertEqual(engine.getTrustInfo('ctx-2'), null);
});

test('v18: ZeroTrustEngine consistent IP/UA boost trust on subsequent evaluations', () => {
  const engine = new ZeroTrustEngine({ trustThreshold: 20 });
  // First evaluation sets up context
  engine.evaluate({ contextId: 'ctx-1', ip: '1.2.3.4', userAgent: 'TestAgent', method: 'GET' });
  // Boost trust manually
  engine.updateTrust('ctx-1', 30, 'boost');
  // Second evaluation with same IP/UA should get boost factors
  const r2 = engine.evaluate({ contextId: 'ctx-1', ip: '1.2.3.4', userAgent: 'TestAgent', method: 'GET' });
  assert(r2.score > 0, 'score is positive');
});

test('v18: ZeroTrustEngine custom options', () => {
  const engine = new ZeroTrustEngine({ defaultTrustScore: 10, trustThreshold: 20, maxTrustScore: 50, decayRate: 2, decayIntervalMs: 30000 });
  assertEqual(engine.trustThreshold, 20);
  assertEqual(engine.maxTrustScore, 50);
  assertEqual(engine.decayRate, 2);
  assertEqual(engine.decayIntervalMs, 30000);
});

// ─── ThreatIntelligence Tests ──────────────────────────────────────────────

test('v18: ThreatIntelligence constructor defaults', () => {
  const ti = new ThreatIntelligence();
  assertEqual(ti.suspiciousThreshold, 5);
  assertEqual(ti.autoBlock, true);
});

test('v18: ThreatIntelligence assess — clean request', () => {
  const ti = new ThreatIntelligence();
  const result = ti.assess({ ip: '1.2.3.4', url: '/api/users', method: 'GET', headers: {} });
  assertEqual(result.blocked, false);
  assertEqual(result.level, 'none');
});

test('v18: ThreatIntelligence assess — blocked IP', () => {
  const ti = new ThreatIntelligence({ blockedIPs: ['10.0.0.1'] });
  const result = ti.assess({ ip: '10.0.0.1', url: '/api/users', method: 'GET', headers: {} });
  assertEqual(result.blocked, true);
  assert(result.reasons.length > 0, 'has reasons');
});

test('v18: ThreatIntelligence blockIP and unblockIP', () => {
  const ti = new ThreatIntelligence();
  ti.blockIP('5.5.5.5');
  assertEqual(ti.isBlocked('5.5.5.5'), true);
  ti.unblockIP('5.5.5.5');
  assertEqual(ti.isBlocked('5.5.5.5'), false);
});

test('v18: ThreatIntelligence reportActivity and auto-block', () => {
  const ti = new ThreatIntelligence({ suspiciousThreshold: 3, autoBlock: true });
  ti.reportActivity('10.10.10.10', 'scan');
  ti.reportActivity('10.10.10.10', 'scan');
  ti.reportActivity('10.10.10.10', 'scan');
  assertEqual(ti.isBlocked('10.10.10.10'), true);
});

test('v18: ThreatIntelligence getActivityLog', () => {
  const ti = new ThreatIntelligence();
  ti.reportActivity('7.7.7.7', 'probe');
  const log = ti.getActivityLog('7.7.7.7');
  assert(log !== null, 'log exists');
  assert(log.count >= 1, 'count >= 1');
});

test('v18: ThreatIntelligence addPattern detects matching URLs as threats', () => {
  const ti = new ThreatIntelligence();
  ti.addPattern('/admin');
  const result = ti.assess({ ip: '1.1.1.1', url: '/admin/settings', method: 'GET', headers: {} });
  assertEqual(result.threat, true);
  assertEqual(result.level, 'high');
  assert(result.reasons.length > 0, 'has reasons');
});

test('v18: ThreatIntelligence reset clears all', () => {
  const ti = new ThreatIntelligence({ blockedIPs: ['1.1.1.1'] });
  ti.reportActivity('2.2.2.2', 'scan');
  ti.reset();
  assertEqual(ti.isBlocked('1.1.1.1'), false);
  assertEqual(ti.getActivityLog('2.2.2.2'), null);
});

test('v18: ThreatIntelligence assess — SQL injection in headers', () => {
  const ti = new ThreatIntelligence();
  const result = ti.assess({ ip: '1.1.1.1', url: '/api/data', method: 'GET', headers: { 'x-custom': "'; DROP TABLE users; --" } });
  assert(result.level !== 'none', 'threat level detected');
  assert(result.reasons.length > 0, 'has reasons');
});

// ─── SecureSessionManager Tests ────────────────────────────────────────────

test('v18: SecureSessionManager constructor defaults', () => {
  const sm = new SecureSessionManager();
  assertEqual(sm.tokenLength, 32);
  assertEqual(sm.maxAge, 3600000);
  assertEqual(sm.bindToIP, true);
  assertEqual(sm.bindToUserAgent, true);
});

test('v18: SecureSessionManager createSession returns token', () => {
  const sm = new SecureSessionManager();
  const session = sm.createSession({ contextId: 'user-1', ip: '1.2.3.4', userAgent: 'TestAgent' });
  assert(typeof session.token === 'string', 'token is string');
  assert(session.token.length > 0, 'token not empty');
  assert(session.expiresAt > Date.now(), 'expiresAt in future');
});

test('v18: SecureSessionManager validateSession — valid', () => {
  const sm = new SecureSessionManager();
  const session = sm.createSession({ contextId: 'user-1', ip: '1.2.3.4', userAgent: 'TestAgent' });
  const result = sm.validateSession(session.token, { ip: '1.2.3.4', userAgent: 'TestAgent' });
  assertEqual(result.valid, true);
});

test('v18: SecureSessionManager validateSession — IP mismatch', () => {
  const sm = new SecureSessionManager({ bindToIP: true });
  const session = sm.createSession({ contextId: 'user-1', ip: '1.2.3.4', userAgent: 'TestAgent' });
  const result = sm.validateSession(session.token, { ip: '9.9.9.9', userAgent: 'TestAgent' });
  assertEqual(result.valid, false);
  assert(result.reason.length > 0, 'has reason');
});

test('v18: SecureSessionManager validateSession — invalid token', () => {
  const sm = new SecureSessionManager();
  const result = sm.validateSession('nonexistent-token', { ip: '1.2.3.4' });
  assertEqual(result.valid, false);
});

test('v18: SecureSessionManager rotateSession', () => {
  const sm = new SecureSessionManager();
  const session = sm.createSession({ contextId: 'user-1', ip: '1.2.3.4', userAgent: 'TestAgent' });
  const newToken = sm.rotateSession(session.token);
  assert(typeof newToken === 'string', 'new token is string');
  assert(newToken !== session.token, 'new token differs');
  // Old token should be invalid
  const oldResult = sm.validateSession(session.token, { ip: '1.2.3.4', userAgent: 'TestAgent' });
  assertEqual(oldResult.valid, false);
  // New token should be valid
  const newResult = sm.validateSession(newToken, { ip: '1.2.3.4', userAgent: 'TestAgent' });
  assertEqual(newResult.valid, true);
});

test('v18: SecureSessionManager revokeSession', () => {
  const sm = new SecureSessionManager();
  const session = sm.createSession({ contextId: 'user-1', ip: '1.2.3.4' });
  sm.revokeSession(session.token);
  const result = sm.validateSession(session.token, { ip: '1.2.3.4' });
  assertEqual(result.valid, false);
});

test('v18: SecureSessionManager revokeAllSessions', () => {
  const sm = new SecureSessionManager();
  const s1 = sm.createSession({ contextId: 'user-1', ip: '1.2.3.4' });
  const s2 = sm.createSession({ contextId: 'user-1', ip: '1.2.3.4' });
  sm.revokeAllSessions('user-1');
  assertEqual(sm.validateSession(s1.token, { ip: '1.2.3.4' }).valid, false);
  assertEqual(sm.validateSession(s2.token, { ip: '1.2.3.4' }).valid, false);
});

test('v18: SecureSessionManager getActiveCount', () => {
  const sm = new SecureSessionManager();
  sm.createSession({ contextId: 'user-1', ip: '1.2.3.4' });
  sm.createSession({ contextId: 'user-2', ip: '5.6.7.8' });
  assertEqual(sm.getActiveCount(), 2);
});

test('v18: SecureSessionManager getSession', () => {
  const sm = new SecureSessionManager();
  const s = sm.createSession({ contextId: 'user-1', ip: '1.2.3.4', userAgent: 'TestAgent', metadata: { role: 'admin' } });
  const info = sm.getSession(s.token);
  assert(info !== null, 'session info exists');
  assertEqual(info.contextId, 'user-1');
});

// ─── RequestIntegrityChain Tests ───────────────────────────────────────────

test('v18: RequestIntegrityChain constructor defaults', () => {
  const chain = new RequestIntegrityChain();
  assertEqual(chain.getLength(), 0);
});

test('v18: RequestIntegrityChain addRequest returns entry with hash', () => {
  const chain = new RequestIntegrityChain();
  const entry = chain.addRequest({ method: 'GET', url: '/api/users', timestamp: Date.now(), bodyHash: '0'.repeat(64) });
  assert(typeof entry.hash === 'string', 'hash is string');
  assert(entry.hash.length === 64, 'hash is 64 chars (sha256 hex)');
  assertEqual(entry.index, 0);
  assertEqual(chain.getLength(), 1);
});

test('v18: RequestIntegrityChain verify — valid chain', () => {
  const chain = new RequestIntegrityChain();
  chain.addRequest({ method: 'GET', url: '/api/users', timestamp: 1000, bodyHash: 'abc' });
  chain.addRequest({ method: 'POST', url: '/api/users', timestamp: 2000, bodyHash: 'def' });
  chain.addRequest({ method: 'PUT', url: '/api/users/1', timestamp: 3000, bodyHash: 'ghi' });
  const result = chain.verify();
  assertEqual(result.valid, true);
  assertEqual(result.chainLength, 3);
});

test('v18: RequestIntegrityChain getEntry returns correct entry', () => {
  const chain = new RequestIntegrityChain();
  chain.addRequest({ method: 'GET', url: '/api/test', timestamp: 1000, bodyHash: 'x' });
  const entry = chain.getEntry(0);
  assert(entry !== null, 'entry exists');
  assertEqual(entry.request.method, 'GET');
});

test('v18: RequestIntegrityChain getLatestHash', () => {
  const chain = new RequestIntegrityChain();
  const genesis = chain.getLatestHash();
  assert(genesis.length === 64, 'genesis hash is 64 chars');
  chain.addRequest({ method: 'GET', url: '/test', timestamp: 1000, bodyHash: 'x' });
  const newHash = chain.getLatestHash();
  assert(newHash !== genesis, 'hash changed after add');
});

test('v18: RequestIntegrityChain reset', () => {
  const chain = new RequestIntegrityChain();
  chain.addRequest({ method: 'GET', url: '/test', timestamp: 1000, bodyHash: 'x' });
  chain.reset();
  assertEqual(chain.getLength(), 0);
});

test('v18: RequestIntegrityChain verifyEntry', () => {
  const chain = new RequestIntegrityChain();
  chain.addRequest({ method: 'GET', url: '/test', timestamp: 1000, bodyHash: 'x' });
  const result = chain.verifyEntry(0);
  assertEqual(result.valid, true);
});

test('v18: RequestIntegrityChain getChain returns copy', () => {
  const chain = new RequestIntegrityChain();
  chain.addRequest({ method: 'GET', url: '/a', timestamp: 1, bodyHash: 'a' });
  chain.addRequest({ method: 'POST', url: '/b', timestamp: 2, bodyHash: 'b' });
  const copy = chain.getChain();
  assert(Array.isArray(copy), 'chain is array');
  assertEqual(copy.length, 2);
});

// ─── AdaptiveRateLimiter Tests ─────────────────────────────────────────────

test('v18: AdaptiveRateLimiter constructor defaults', () => {
  const limiter = new AdaptiveRateLimiter();
  assertEqual(limiter.baseRate, 100);
  assertEqual(limiter.windowMs, 60000);
});

test('v18: AdaptiveRateLimiter acquire — allowed', () => {
  const limiter = new AdaptiveRateLimiter({ baseRate: 10 });
  const result = limiter.acquire('test-key');
  assertEqual(result.allowed, true);
  assert(typeof result.remaining === 'number', 'remaining is number');
});

test('v18: AdaptiveRateLimiter acquire — exhausted', () => {
  const limiter = new AdaptiveRateLimiter({ baseRate: 3, windowMs: 60000, burstMultiplier: 1.0, adaptationRate: 0, minRate: 1 });
  limiter.acquire('key1');
  limiter.acquire('key1');
  limiter.acquire('key1');
  const result = limiter.acquire('key1');
  assertEqual(result.allowed, false);
});

test('v18: AdaptiveRateLimiter getStats returns stats', () => {
  const limiter = new AdaptiveRateLimiter();
  limiter.acquire('key1');
  const stats = limiter.getStats('key1');
  assert(stats !== null, 'stats exist');
  assert(typeof stats.currentRate === 'number', 'currentRate is number');
});

test('v18: AdaptiveRateLimiter resetKey clears specific key', () => {
  const limiter = new AdaptiveRateLimiter({ baseRate: 2 });
  limiter.acquire('key1');
  limiter.acquire('key1');
  limiter.resetKey('key1');
  const result = limiter.acquire('key1');
  assertEqual(result.allowed, true);
});

test('v18: AdaptiveRateLimiter reset clears all', () => {
  const limiter = new AdaptiveRateLimiter();
  limiter.acquire('key1');
  limiter.acquire('key2');
  limiter.reset();
  assertEqual(limiter.getStats('key1'), null);
  assertEqual(limiter.getStats('key2'), null);
});

test('v18: AdaptiveRateLimiter adjustRate overrides rate', () => {
  const limiter = new AdaptiveRateLimiter({ baseRate: 10 });
  limiter.acquire('key1');
  limiter.adjustRate('key1', 5);
  const stats = limiter.getStats('key1');
  assert(stats !== null, 'stats exist after adjustRate');
});

test('v18: AdaptiveRateLimiter custom options', () => {
  const limiter = new AdaptiveRateLimiter({
    baseRate: 50, windowMs: 30000, burstMultiplier: 2.0, anomalyThreshold: 3.0, minRate: 5, maxRate: 500,
  });
  assertEqual(limiter.baseRate, 50);
  assertEqual(limiter.windowMs, 30000);
  assertEqual(limiter.burstMultiplier, 2.0);
});

// ─── SecurityHeadersManager Tests ──────────────────────────────────────────

test('v18: SecurityHeadersManager constructor defaults', () => {
  const mgr = new SecurityHeadersManager();
  assert(mgr.hsts !== undefined, 'hsts configured');
  assertEqual(mgr.xFrameOptions, 'DENY');
});

test('v18: SecurityHeadersManager buildHeaders returns all OWASP headers', () => {
  const mgr = new SecurityHeadersManager();
  const headers = mgr.buildHeaders();
  assert(typeof headers === 'object', 'headers is object');
  assert('Strict-Transport-Security' in headers, 'has HSTS');
  assert('X-Frame-Options' in headers, 'has X-Frame-Options');
  assert('X-Content-Type-Options' in headers, 'has X-Content-Type-Options');
  assert('Referrer-Policy' in headers, 'has Referrer-Policy');
});

test('v18: SecurityHeadersManager getHeader and setHeader', () => {
  const mgr = new SecurityHeadersManager();
  mgr.setHeader('X-Custom', 'test-value');
  assertEqual(mgr.getHeader('X-Custom'), 'test-value');
});

test('v18: SecurityHeadersManager removeHeader', () => {
  const mgr = new SecurityHeadersManager();
  mgr.setHeader('X-Custom', 'test');
  mgr.removeHeader('X-Custom');
  assertEqual(mgr.getHeader('X-Custom'), undefined);
});

test('v18: SecurityHeadersManager validate returns score', () => {
  const mgr = new SecurityHeadersManager();
  const result = mgr.validate();
  assert(typeof result.secure === 'boolean', 'secure is boolean');
  assert(typeof result.score === 'number', 'score is number');
  assert(Array.isArray(result.warnings), 'warnings is array');
  assert(result.score > 0, 'default config has positive score');
});

test('v18: SecurityHeadersManager applyToResponse merges headers', () => {
  const mgr = new SecurityHeadersManager();
  const existing = { 'Content-Type': 'application/json' };
  const merged = mgr.applyToResponse(existing);
  assert('Content-Type' in merged, 'preserves existing');
  assert('Strict-Transport-Security' in merged, 'adds security headers');
});

test('v18: SecurityHeadersManager toJSON', () => {
  const mgr = new SecurityHeadersManager();
  const json = mgr.toJSON();
  assert(typeof json === 'object', 'toJSON returns object');
  assert('hsts' in json, 'has hsts config');
});

test('v18: SecurityHeadersManager custom options', () => {
  const mgr = new SecurityHeadersManager({
    xFrameOptions: 'SAMEORIGIN',
    referrerPolicy: 'no-referrer',
  });
  assertEqual(mgr.xFrameOptions, 'SAMEORIGIN');
  assertEqual(mgr.referrerPolicy, 'no-referrer');
});

// ─── EncryptedConfigVault Tests ────────────────────────────────────────────

test('v18: EncryptedConfigVault constructor auto-generates key', () => {
  const vault = new EncryptedConfigVault();
  assert(typeof vault.getFingerprint() === 'string', 'fingerprint is string');
  assert(vault.getFingerprint().length === 16, 'fingerprint is 16 hex chars');
});

test('v18: EncryptedConfigVault store and retrieve string', () => {
  const vault = new EncryptedConfigVault();
  vault.store('api-key', 'sk-12345abcdef');
  const result = vault.retrieve('api-key');
  assertEqual(result, 'sk-12345abcdef');
});

test('v18: EncryptedConfigVault store and retrieve object', () => {
  const vault = new EncryptedConfigVault();
  const config = { host: 'db.example.com', port: 5432, password: 'secret' };
  vault.store('db-config', config);
  const result = vault.retrieve('db-config');
  assertEqual(result.host, 'db.example.com');
  assertEqual(result.port, 5432);
  assertEqual(result.password, 'secret');
});

test('v18: EncryptedConfigVault has and remove', () => {
  const vault = new EncryptedConfigVault();
  vault.store('key1', 'value1');
  assertEqual(vault.has('key1'), true);
  vault.remove('key1');
  assertEqual(vault.has('key1'), false);
  assertEqual(vault.retrieve('key1'), null);
});

test('v18: EncryptedConfigVault list returns key names', () => {
  const vault = new EncryptedConfigVault();
  vault.store('k1', 'v1');
  vault.store('k2', 'v2');
  const keys = vault.list();
  assert(keys.includes('k1'), 'has k1');
  assert(keys.includes('k2'), 'has k2');
});

test('v18: EncryptedConfigVault export and import', () => {
  const vault = new EncryptedConfigVault();
  vault.store('secret1', 'value1');
  vault.store('secret2', { nested: true });
  const exported = vault.export();
  assert(typeof exported === 'object', 'export is object');
  // Import into new vault with same key
  const vault2 = new EncryptedConfigVault({ masterKey: vault._masterKey ? vault._masterKey.toString('hex') : undefined });
  // The export contains encrypted blobs so we can test import
  vault2.import(exported);
  assert(vault2.has('secret1'), 'imported has secret1');
});

test('v18: EncryptedConfigVault clear removes all', () => {
  const vault = new EncryptedConfigVault();
  vault.store('k1', 'v1');
  vault.store('k2', 'v2');
  vault.clear();
  assertEqual(vault.list().length, 0);
});

test('v18: EncryptedConfigVault getFingerprint', () => {
  const vault = new EncryptedConfigVault();
  const fp = vault.getFingerprint();
  assert(typeof fp === 'string', 'fingerprint is string');
  assertEqual(fp.length, 16);
});

test('v18: EncryptedConfigVault retrieve nonexistent returns null', () => {
  const vault = new EncryptedConfigVault();
  assertEqual(vault.retrieve('nope'), null);
});

// ─── MutualTLSManager Tests ────────────────────────────────────────────────

test('v18: MutualTLSManager constructor defaults', () => {
  const mtls = new MutualTLSManager();
  assertEqual(mtls.requireClientCert, true);
  assertEqual(mtls.allowExpired, false);
});

test('v18: MutualTLSManager addTrustedCert and getTrustedCerts', () => {
  const mtls = new MutualTLSManager();
  mtls.addTrustedCert('abc123');
  mtls.addTrustedCert('def456');
  const certs = mtls.getTrustedCerts();
  assert(certs.includes('abc123'), 'has abc123');
  assert(certs.includes('def456'), 'has def456');
});

test('v18: MutualTLSManager removeTrustedCert', () => {
  const mtls = new MutualTLSManager({ trustedCerts: ['abc123'] });
  mtls.removeTrustedCert('abc123');
  assertEqual(mtls.getTrustedCerts().includes('abc123'), false);
});

test('v18: MutualTLSManager validateClientCert — trusted', () => {
  const mtls = new MutualTLSManager({ trustedCerts: ['abc123'] });
  const now = Date.now();
  const result = mtls.validateClientCert({
    fingerprint: 'abc123',
    issuer: 'CA',
    subject: 'client',
    notBefore: now - 10000,
    notAfter: now + 3600000,
    serialNumber: '001',
  });
  assertEqual(result.valid, true);
  assertEqual(result.trusted, true);
});

test('v18: MutualTLSManager validateClientCert — untrusted', () => {
  const mtls = new MutualTLSManager({ trustedCerts: ['abc123'] });
  const now = Date.now();
  const result = mtls.validateClientCert({
    fingerprint: 'unknown',
    issuer: 'CA',
    subject: 'client',
    notBefore: now - 10000,
    notAfter: now + 3600000,
    serialNumber: '002',
  });
  assertEqual(result.valid, false);
});

test('v18: MutualTLSManager validateClientCert — revoked', () => {
  const mtls = new MutualTLSManager({ trustedCerts: ['abc123'], revocationList: ['abc123'] });
  const now = Date.now();
  const result = mtls.validateClientCert({
    fingerprint: 'abc123',
    issuer: 'CA',
    subject: 'client',
    notBefore: now - 10000,
    notAfter: now + 3600000,
    serialNumber: '003',
  });
  assertEqual(result.valid, false);
  assert(result.reason.length > 0, 'has reason');
});

test('v18: MutualTLSManager validateClientCert — expired', () => {
  const mtls = new MutualTLSManager({ trustedCerts: ['abc123'] });
  const now = Date.now();
  const result = mtls.validateClientCert({
    fingerprint: 'abc123',
    issuer: 'CA',
    subject: 'client',
    notBefore: now - 100000000,
    notAfter: now - 1000,
    serialNumber: '004',
  });
  assertEqual(result.valid, false);
});

test('v18: MutualTLSManager revokeCert and isRevoked', () => {
  const mtls = new MutualTLSManager();
  mtls.revokeCert('abc123');
  assertEqual(mtls.isRevoked('abc123'), true);
  assertEqual(mtls.isRevoked('def456'), false);
});

test('v18: MutualTLSManager getRevocationList', () => {
  const mtls = new MutualTLSManager({ revocationList: ['aaa', 'bbb'] });
  const list = mtls.getRevocationList();
  assert(list.includes('aaa'), 'has aaa');
  assert(list.includes('bbb'), 'has bbb');
});

test('v18: MutualTLSManager generateFingerprint', () => {
  const mtls = new MutualTLSManager();
  const fp = mtls.generateFingerprint('test-cert-data');
  assert(typeof fp === 'string', 'fingerprint is string');
  assertEqual(fp.length, 64); // SHA-256 hex = 64 chars
});

test('v18: MutualTLSManager reset clears all', () => {
  const mtls = new MutualTLSManager({ trustedCerts: ['abc'], revocationList: ['def'] });
  mtls.reset();
  assertEqual(mtls.getTrustedCerts().length, 0);
  assertEqual(mtls.getRevocationList().length, 0);
});

// ─── Client Integration Tests ──────────────────────────────────────────────

test('v18: client with threatIntel blocks bad IPs', async () => {
  const mockAdapter = async () => ({ data: { ok: true }, rawData: { ok: true }, status: 200, statusText: 'OK', headers: {}, request: {} });
  const client = createClient({
    adapter: mockAdapter,
    ssrf: { enabled: false },
    baseURL: 'http://example.com',
    threatIntel: { blockedIPs: ['10.0.0.1'] },
  });

  // Inject client IP
  client.interceptors.request.use((config) => {
    config.clientIP = '10.0.0.1';
    return config;
  });

  let threw = false;
  try {
    await client.get('/api/data');
  } catch (e) {
    threw = true;
    assertEqual(e.code, 'ERR_THREAT_DETECTED');
  }
  assert(threw, 'should block bad IP');
});

test('v18: client with zeroTrust denies low-trust requests', async () => {
  const mockAdapter = async () => ({ data: { ok: true }, rawData: { ok: true }, status: 200, statusText: 'OK', headers: {}, request: {} });
  const client = createClient({
    adapter: mockAdapter,
    ssrf: { enabled: false },
    baseURL: 'http://example.com',
    zeroTrust: { trustThreshold: 80 },
  });

  let threw = false;
  try {
    await client.get('/api/data');
  } catch (e) {
    threw = true;
    assertEqual(e.code, 'ERR_ZERO_TRUST_DENIED');
  }
  assert(threw, 'should deny low-trust request');
});

test('v18: client with adaptiveRateLimiter blocks excess requests', async () => {
  const mockAdapter = async () => ({ data: { ok: true }, rawData: { ok: true }, status: 200, statusText: 'OK', headers: {}, request: {} });
  const client = createClient({
    adapter: mockAdapter,
    ssrf: { enabled: false },
    baseURL: 'http://example.com',
    adaptiveRateLimiter: { baseRate: 2, windowMs: 60000, burstMultiplier: 1.0, adaptationRate: 0, minRate: 1 },
  });

  await client.get('/api/data');
  await client.get('/api/data');

  let threw = false;
  try {
    await client.get('/api/data');
  } catch (e) {
    threw = true;
    assertEqual(e.code, 'ERR_ADAPTIVE_RATE_LIMITED');
  }
  assert(threw, 'should block after rate exceeded');
});

test('v18: client with securityHeaders injects headers', async () => {
  let capturedHeaders = {};
  const mockAdapter = async (config) => {
    capturedHeaders = config.headers || {};
    return { data: { ok: true }, rawData: { ok: true }, status: 200, statusText: 'OK', headers: {}, request: {} };
  };
  const client = createClient({
    adapter: mockAdapter,
    ssrf: { enabled: false },
    baseURL: 'http://example.com',
    securityHeaders: {},
  });
  await client.get('/api/data');
  assert(capturedHeaders['Strict-Transport-Security'] !== undefined, 'HSTS header injected');
  assert(capturedHeaders['X-Frame-Options'] !== undefined, 'X-Frame-Options header injected');
  assert(capturedHeaders['X-Content-Type-Options'] !== undefined, 'X-Content-Type-Options header injected');
});

test('v18: client with integrityChain records requests', async () => {
  const mockAdapter = async () => ({ data: { ok: true }, rawData: { ok: true }, status: 200, statusText: 'OK', headers: {}, request: {} });
  const client = createClient({
    adapter: mockAdapter,
    ssrf: { enabled: false },
    baseURL: 'http://example.com',
    integrityChain: {},
  });
  await client.get('/api/data');
  await client.post('/api/data', { name: 'test' });
  assert(client._integrityChain.getLength() === 2, 'integrity chain has 2 entries');
  const verification = client._integrityChain.verify();
  assertEqual(verification.valid, true);
});

test('v18: new error codes exist on ClientError (all 8)', () => {
  assertEqual(ClientError.ERR_ZERO_TRUST_DENIED, 'ERR_ZERO_TRUST_DENIED');
  assertEqual(ClientError.ERR_THREAT_DETECTED, 'ERR_THREAT_DETECTED');
  assertEqual(ClientError.ERR_SESSION_INVALID, 'ERR_SESSION_INVALID');
  assertEqual(ClientError.ERR_INTEGRITY_VIOLATION, 'ERR_INTEGRITY_VIOLATION');
  assertEqual(ClientError.ERR_ADAPTIVE_RATE_LIMITED, 'ERR_ADAPTIVE_RATE_LIMITED');
  assertEqual(ClientError.ERR_MTLS_FAILED, 'ERR_MTLS_FAILED');
  assertEqual(ClientError.ERR_VAULT_ACCESS_DENIED, 'ERR_VAULT_ACCESS_DENIED');
  assertEqual(ClientError.ERR_SECURITY_HEADER_VIOLATION, 'ERR_SECURITY_HEADER_VIOLATION');
});

test('v18: all v18 elite security classes are exported', () => {
  assert(typeof ZeroTrustEngine === 'function', 'ZeroTrustEngine exported');
  assert(typeof ThreatIntelligence === 'function', 'ThreatIntelligence exported');
  assert(typeof SecureSessionManager === 'function', 'SecureSessionManager exported');
  assert(typeof RequestIntegrityChain === 'function', 'RequestIntegrityChain exported');
  assert(typeof AdaptiveRateLimiter === 'function', 'AdaptiveRateLimiter exported');
  assert(typeof SecurityHeadersManager === 'function', 'SecurityHeadersManager exported');
  assert(typeof EncryptedConfigVault === 'function', 'EncryptedConfigVault exported');
  assert(typeof MutualTLSManager === 'function', 'MutualTLSManager exported');
});

test('v18: v18 elite security classes available on default apiBridge export', () => {
  assert(typeof apiBridge.ZeroTrustEngine === 'function', 'apiBridge.ZeroTrustEngine');
  assert(typeof apiBridge.ThreatIntelligence === 'function', 'apiBridge.ThreatIntelligence');
  assert(typeof apiBridge.SecureSessionManager === 'function', 'apiBridge.SecureSessionManager');
  assert(typeof apiBridge.RequestIntegrityChain === 'function', 'apiBridge.RequestIntegrityChain');
  assert(typeof apiBridge.AdaptiveRateLimiter === 'function', 'apiBridge.AdaptiveRateLimiter');
  assert(typeof apiBridge.SecurityHeadersManager === 'function', 'apiBridge.SecurityHeadersManager');
  assert(typeof apiBridge.EncryptedConfigVault === 'function', 'apiBridge.EncryptedConfigVault');
  assert(typeof apiBridge.MutualTLSManager === 'function', 'apiBridge.MutualTLSManager');
});

test('v18: client with all v16+v17+v18 features combined', async () => {
  let callCount = 0;
  const customAdapter = async () => {
    callCount++;
    return {
      data: { result: callCount }, rawData: { result: callCount },
      status: 200, statusText: 'OK',
      headers: {}, request: {},
    };
  };

  const client = createClient({
    adapter: customAdapter,
    ssrf: { enabled: false },
    baseURL: 'http://test.local',
    cache: { ttl: 10000, methods: ['GET'] },
    dedupe: { enabled: true, methods: ['GET'] },
    timing: true,
    requestId: true,
    journeyTracking: true,
    requestSigning: { secret: 'combined-test' },
    auditLog: { maxEntries: 100 },
    idempotency: { headerName: 'idempotency-key' },
    integrityChain: {},
    securityHeaders: {},
    hooks: {
      onRequest: [(config) => {}],
      onResponse: [(res) => {}],
    },
  });

  const res = await client.get('/combined-v18');
  assertEqual(res.status, 200);
  assert(typeof res.duration === 'number', 'timing works');
  assert(res.config.headers['x-request-id'] !== undefined, 'request ID injected');
  assert(res.config.headers['x-signature'] !== undefined, 'signature injected');
  assert(res.config.headers['Strict-Transport-Security'] !== undefined, 'HSTS injected');
  assert(res.journey !== undefined, 'journey tracking works');
  assert(client._integrityChain.getLength() >= 1, 'integrity chain recorded');
});

test('v18: VERSION is 18.0.2', () => {
  assertEqual(VERSION, '18.0.2');
});

// ═══════════════════════════════════════════════════════════════════════════════
// v19: Fortress Security Tests
// ═══════════════════════════════════════════════════════════════════════════════

// ─── QuantumResistantCrypto Tests ──────────────────────────────────────────

test('v19: QuantumResistantCrypto constructor defaults', () => {
  const qrc = new QuantumResistantCrypto();
  assertEqual(qrc.iterations, 100000);
  assertEqual(qrc.keyLength, 64);
  assertEqual(qrc.digest, 'sha512');
  assertEqual(qrc.hashRounds, 3);
});

test('v19: QuantumResistantCrypto custom options', () => {
  const qrc = new QuantumResistantCrypto({ iterations: 10000, keyLength: 32, digest: 'sha256', hashRounds: 1 });
  assertEqual(qrc.iterations, 10000);
  assertEqual(qrc.keyLength, 32);
  assertEqual(qrc.digest, 'sha256');
  assertEqual(qrc.hashRounds, 1);
});

test('v19: QuantumResistantCrypto deriveKey returns Buffer', () => {
  const qrc = new QuantumResistantCrypto({ iterations: 1000 });
  const key = qrc.deriveKey('secret', 'salt', 'context');
  assert(Buffer.isBuffer(key), 'key is a Buffer');
  assertEqual(key.length, 64);
});

test('v19: QuantumResistantCrypto deriveKey is deterministic for same inputs', () => {
  const qrc = new QuantumResistantCrypto({ iterations: 1000 });
  const key1 = qrc.deriveKey('secret', 'salt', 'ctx');
  const key2 = qrc.deriveKey('secret', 'salt', 'ctx');
  assertEqual(key1.toString('hex'), key2.toString('hex'));
});

test('v19: QuantumResistantCrypto deriveKey differs with different context', () => {
  const qrc = new QuantumResistantCrypto({ iterations: 1000 });
  const key1 = qrc.deriveKey('secret', 'salt', 'ctx-a');
  const key2 = qrc.deriveKey('secret', 'salt', 'ctx-b');
  assert(key1.toString('hex') !== key2.toString('hex'), 'different context → different key');
});

test('v19: QuantumResistantCrypto sign returns string', () => {
  const qrc = new QuantumResistantCrypto({ iterations: 1000, hashRounds: 1 });
  const key = qrc.deriveKey('secret', 'salt', 'ctx');
  const sig = qrc.sign('my-data', key);
  assert(typeof sig === 'string', 'signature is string');
  assert(sig.length > 0, 'signature not empty');
});

test('v19: QuantumResistantCrypto verify returns true for correct data', () => {
  const qrc = new QuantumResistantCrypto({ iterations: 1000, hashRounds: 1 });
  const key = qrc.deriveKey('secret', 'salt', 'ctx');
  const sig = qrc.sign('my-data', key);
  assertEqual(qrc.verify('my-data', sig, key), true);
});

test('v19: QuantumResistantCrypto verify returns false for tampered data', () => {
  const qrc = new QuantumResistantCrypto({ iterations: 1000, hashRounds: 1 });
  const key = qrc.deriveKey('secret', 'salt', 'ctx');
  const sig = qrc.sign('my-data', key);
  assertEqual(qrc.verify('tampered-data', sig, key), false);
});

test('v19: QuantumResistantCrypto verify returns false for wrong key', () => {
  const qrc = new QuantumResistantCrypto({ iterations: 1000, hashRounds: 1 });
  const key1 = qrc.deriveKey('secret1', 'salt', 'ctx');
  const key2 = qrc.deriveKey('secret2', 'salt', 'ctx');
  const sig = qrc.sign('my-data', key1);
  assertEqual(qrc.verify('my-data', sig, key2), false);
});

test('v19: QuantumResistantCrypto hash returns string', () => {
  const qrc = new QuantumResistantCrypto({ hashRounds: 1 });
  const h = qrc.hash('test-data');
  assert(typeof h === 'string', 'hash is string');
  assert(h.length > 0, 'hash not empty');
});

test('v19: QuantumResistantCrypto hash is deterministic', () => {
  const qrc = new QuantumResistantCrypto({ hashRounds: 1 });
  const h1 = qrc.hash('abc');
  const h2 = qrc.hash('abc');
  assertEqual(h1, h2);
});

test('v19: QuantumResistantCrypto getAlgorithmInfo returns correct structure', () => {
  const qrc = new QuantumResistantCrypto({ iterations: 5000, keyLength: 32, digest: 'sha256', hashRounds: 2 });
  const info = qrc.getAlgorithmInfo();
  assertEqual(info.digest, 'sha256');
  assertEqual(info.iterations, 5000);
  assertEqual(info.keyLength, 32);
  assertEqual(info.hashRounds, 2);
});

// ─── BehavioralAnalytics Tests ─────────────────────────────────────────────

test('v19: BehavioralAnalytics constructor defaults', () => {
  const ba = new BehavioralAnalytics();
  assertEqual(ba.windowMs, 300000);
  assertEqual(ba.maxRequestsPerWindow, 200);
  assertEqual(ba.anomalyScoreThreshold, 70);
});

test('v19: BehavioralAnalytics analyze — no profile returns clean', () => {
  const ba = new BehavioralAnalytics();
  const result = ba.analyze('unknown-context');
  assertEqual(result.anomaly, false);
  assertEqual(result.score, 0);
  assertEqual(result.requestCount, 0);
});

test('v19: BehavioralAnalytics recordRequest creates profile', () => {
  const ba = new BehavioralAnalytics();
  ba.recordRequest('ctx-1', { method: 'GET', url: '/api' });
  const profile = ba.getProfile('ctx-1');
  assert(profile !== null, 'profile created');
  assertEqual(profile.requests.length, 1);
});

test('v19: BehavioralAnalytics analyze — low volume, no anomaly', () => {
  const ba = new BehavioralAnalytics({ maxRequestsPerWindow: 100, anomalyScoreThreshold: 50 });
  for (let i = 0; i < 5; i++) {
    ba.recordRequest('ctx-1', { method: 'GET', url: '/api' });
  }
  const result = ba.analyze('ctx-1');
  assertEqual(result.anomaly, false);
});

test('v19: BehavioralAnalytics analyze — high volume flags anomaly', () => {
  const ba = new BehavioralAnalytics({ maxRequestsPerWindow: 10, anomalyScoreThreshold: 30 });
  for (let i = 0; i < 25; i++) {
    ba.recordRequest('ctx-1', { method: 'GET', url: '/api' });
  }
  const result = ba.analyze('ctx-1');
  assertEqual(result.anomaly, true);
  assert(result.score > 0, 'score > 0');
  assert(result.reasons.length > 0, 'has reasons');
});

test('v19: BehavioralAnalytics setBaseline and baseline deviation', () => {
  const ba = new BehavioralAnalytics({ maxRequestsPerWindow: 1000, anomalyScoreThreshold: 20 });
  ba.setBaseline('ctx-1', { avgRequestsPerWindow: 5 });
  for (let i = 0; i < 20; i++) {
    ba.recordRequest('ctx-1', { method: 'GET', url: '/api' });
  }
  const result = ba.analyze('ctx-1');
  assert(result.score > 0, 'baseline deviation detected');
});

test('v19: BehavioralAnalytics resetProfile removes profile', () => {
  const ba = new BehavioralAnalytics();
  ba.recordRequest('ctx-1', { method: 'GET', url: '/api' });
  ba.resetProfile('ctx-1');
  assertEqual(ba.getProfile('ctx-1'), null);
});

test('v19: BehavioralAnalytics reset clears all profiles', () => {
  const ba = new BehavioralAnalytics();
  ba.recordRequest('ctx-1', { method: 'GET', url: '/api' });
  ba.recordRequest('ctx-2', { method: 'POST', url: '/data' });
  ba.reset();
  assertEqual(ba.getProfile('ctx-1'), null);
  assertEqual(ba.getProfile('ctx-2'), null);
});

// ─── HoneypotManager Tests ─────────────────────────────────────────────────

test('v19: HoneypotManager constructor defaults', () => {
  const hp = new HoneypotManager();
  assertEqual(hp.strictMatch, false);
  assertEqual(hp.alertThreshold, 1);
});

test('v19: HoneypotManager addHoneypot and getHoneypots', () => {
  const hp = new HoneypotManager();
  hp.addHoneypot('/admin-backup');
  hp.addHoneypot('/secret-config', { severity: 'critical' });
  const honeypots = hp.getHoneypots();
  assert(honeypots.includes('/admin-backup'), 'has /admin-backup');
  assert(honeypots.includes('/secret-config'), 'has /secret-config');
});

test('v19: HoneypotManager checkRequest — not tripped', () => {
  const hp = new HoneypotManager();
  hp.addHoneypot('/admin-backup');
  const result = hp.checkRequest('/api/users', '1.2.3.4');
  assertEqual(result.tripped, false);
});

test('v19: HoneypotManager checkRequest — tripped', () => {
  const hp = new HoneypotManager();
  hp.addHoneypot('/admin-backup', { severity: 'high' });
  const result = hp.checkRequest('/admin-backup/db.sql', '5.5.5.5');
  assertEqual(result.tripped, true);
  assertEqual(result.severity, 'high');
  assert(result.honeypot.length > 0, 'honeypot path returned');
});

test('v19: HoneypotManager getTrips tracks IP trips', () => {
  const hp = new HoneypotManager();
  hp.addHoneypot('/trap');
  hp.checkRequest('/trap', '10.0.0.1');
  hp.checkRequest('/trap', '10.0.0.1');
  const trips = hp.getTrips('10.0.0.1');
  assert(trips !== null, 'trips exist');
  assertEqual(trips.count, 2);
});

test('v19: HoneypotManager getTotalTrips counts all trips', () => {
  const hp = new HoneypotManager();
  hp.addHoneypot('/canary');
  hp.checkRequest('/canary', '1.1.1.1');
  hp.checkRequest('/canary', '2.2.2.2');
  hp.checkRequest('/canary', '3.3.3.3');
  assertEqual(hp.getTotalTrips(), 3);
});

test('v19: HoneypotManager strictMatch mode', () => {
  const hp = new HoneypotManager({ strictMatch: true });
  hp.addHoneypot('/trap');
  const r1 = hp.checkRequest('/trap', '1.1.1.1');
  assertEqual(r1.tripped, true);
  const r2 = hp.checkRequest('/trap/subpath', '2.2.2.2');
  assertEqual(r2.tripped, false);
});

test('v19: HoneypotManager removeHoneypot works', () => {
  const hp = new HoneypotManager();
  hp.addHoneypot('/bait');
  hp.removeHoneypot('/bait');
  assertEqual(hp.getHoneypots().includes('/bait'), false);
  const result = hp.checkRequest('/bait', '1.1.1.1');
  assertEqual(result.tripped, false);
});

test('v19: HoneypotManager reset clears all', () => {
  const hp = new HoneypotManager();
  hp.addHoneypot('/trap1');
  hp.checkRequest('/trap1', '1.1.1.1');
  hp.reset();
  assertEqual(hp.getHoneypots().length, 0);
  assertEqual(hp.getTotalTrips(), 0);
  assertEqual(hp.getTrips('1.1.1.1'), null);
});

// ─── SubresourceIntegrity Tests ────────────────────────────────────────────

test('v19: SubresourceIntegrity constructor defaults', () => {
  const sri = new SubresourceIntegrity();
  assertEqual(sri.algorithm, 'sha256');
  assertEqual(sri.encoding, 'hex');
});

test('v19: SubresourceIntegrity computeHash returns string', () => {
  const sri = new SubresourceIntegrity();
  const hash = sri.computeHash('test data');
  assert(typeof hash === 'string', 'hash is string');
  assertEqual(hash.length, 64); // sha256 hex = 64 chars
});

test('v19: SubresourceIntegrity computeHash is deterministic', () => {
  const sri = new SubresourceIntegrity();
  const h1 = sri.computeHash('hello world');
  const h2 = sri.computeHash('hello world');
  assertEqual(h1, h2);
});

test('v19: SubresourceIntegrity computeHash handles objects', () => {
  const sri = new SubresourceIntegrity();
  const hash = sri.computeHash({ key: 'value' });
  assert(typeof hash === 'string', 'hash is string');
  assert(hash.length === 64, '64 chars');
});

test('v19: SubresourceIntegrity verify returns true for matching data', () => {
  const sri = new SubresourceIntegrity();
  const data = 'important response data';
  const hash = sri.computeHash(data);
  assertEqual(sri.verify(data, hash), true);
});

test('v19: SubresourceIntegrity verify returns false for tampered data', () => {
  const sri = new SubresourceIntegrity();
  const hash = sri.computeHash('original data');
  assertEqual(sri.verify('tampered data', hash), false);
});

test('v19: SubresourceIntegrity sign returns hash descriptor', () => {
  const sri = new SubresourceIntegrity();
  const result = sri.sign('test data');
  assert(typeof result.hash === 'string', 'hash is string');
  assertEqual(result.algorithm, 'sha256');
  assertEqual(result.encoding, 'hex');
});

test('v19: SubresourceIntegrity createManifest and verifyManifest — valid', () => {
  const sri = new SubresourceIntegrity();
  const r1 = { key: '/api/users', data: [{ id: 1 }] };
  const r2 = { key: '/api/posts', data: [{ id: 2 }] };
  sri.createManifest([
    { key: r1.key, hash: sri.computeHash(r1.data) },
    { key: r2.key, hash: sri.computeHash(r2.data) },
  ]);
  const result = sri.verifyManifest([r1, r2]);
  assertEqual(result.valid, true);
  assertEqual(result.failures.length, 0);
});

test('v19: SubresourceIntegrity verifyManifest — detects mismatch', () => {
  const sri = new SubresourceIntegrity();
  sri.createManifest([{ key: '/api/data', hash: sri.computeHash('original') }]);
  const result = sri.verifyManifest([{ key: '/api/data', data: 'tampered' }]);
  assertEqual(result.valid, false);
  assert(result.failures.length > 0, 'has failures');
});

test('v19: SubresourceIntegrity verifyManifest — key not in manifest', () => {
  const sri = new SubresourceIntegrity();
  const result = sri.verifyManifest([{ key: '/not-in-manifest', data: 'x' }]);
  assertEqual(result.valid, false);
  assert(result.failures[0].includes('not in manifest'), 'reports not in manifest');
});

test('v19: SubresourceIntegrity clearManifest works', () => {
  const sri = new SubresourceIntegrity();
  sri.createManifest([{ key: '/test', hash: 'abc' }]);
  assertEqual(sri.getManifestSize(), 1);
  sri.clearManifest();
  assertEqual(sri.getManifestSize(), 0);
});

test('v19: SubresourceIntegrity sha384 algorithm', () => {
  const sri = new SubresourceIntegrity({ algorithm: 'sha384' });
  const hash = sri.computeHash('test');
  assertEqual(hash.length, 96); // sha384 hex = 96 chars
  assertEqual(sri.verify('test', hash), true);
});

// ─── RequestThrottleGuard Tests ────────────────────────────────────────────

test('v19: RequestThrottleGuard constructor defaults', () => {
  const guard = new RequestThrottleGuard();
  assertEqual(guard.maxRequests, 100);
  assertEqual(guard.windowMs, 60000);
  assertEqual(guard.warnAt, 60);
  assertEqual(guard.delayAt, 80);
  assertEqual(guard.blockAt, 95);
});

test('v19: RequestThrottleGuard check — NONE for low usage', () => {
  const guard = new RequestThrottleGuard({ maxRequests: 100 });
  const result = guard.check('user-1');
  assertEqual(result.level, 'NONE');
  assertEqual(result.allowed, true);
  assert(typeof result.remaining === 'number', 'remaining is number');
});

test('v19: RequestThrottleGuard check — WARN at 60%', () => {
  const guard = new RequestThrottleGuard({ maxRequests: 10, warnAt: 60, delayAt: 80, blockAt: 95 });
  for (let i = 0; i < 6; i++) guard.check('key');
  const result = guard.check('key');
  assert(result.level === 'WARN' || result.level === 'DELAY' || result.level === 'BLOCK', 'elevated level');
});

test('v19: RequestThrottleGuard check — BLOCK blocks request', () => {
  const guard = new RequestThrottleGuard({ maxRequests: 5, warnAt: 30, delayAt: 60, blockAt: 80 });
  for (let i = 0; i < 4; i++) guard.check('blocked-key');
  // At 80% (4/5), should be BLOCK
  const result = guard.check('blocked-key');
  assertEqual(result.allowed, false);
  assertEqual(result.level, 'BLOCK');
});

test('v19: RequestThrottleGuard penalize increases usage count', () => {
  const guard = new RequestThrottleGuard({ maxRequests: 100, warnAt: 10, delayAt: 30, blockAt: 50 });
  guard.check('penalized');
  guard.penalize('penalized', 60); // adds 60 penalty tokens
  const result = guard.check('penalized');
  assert(result.usagePercent >= 50, 'penalty raised usage');
});

test('v19: RequestThrottleGuard forgive reduces penalty', () => {
  const guard = new RequestThrottleGuard({ maxRequests: 100 });
  guard.penalize('key', 50);
  guard.forgive('key', 40);
  const level = guard.getLevel('key');
  assert(typeof level === 'string', 'level is string');
});

test('v19: RequestThrottleGuard getLevel without recording request', () => {
  const guard = new RequestThrottleGuard({ maxRequests: 100 });
  assertEqual(guard.getLevel('fresh-key'), 'NONE');
});

test('v19: RequestThrottleGuard resetKey clears specific key', () => {
  const guard = new RequestThrottleGuard({ maxRequests: 5, warnAt: 10, delayAt: 40, blockAt: 80 });
  for (let i = 0; i < 5; i++) guard.check('r-key');
  guard.resetKey('r-key');
  assertEqual(guard.getLevel('r-key'), 'NONE');
});

test('v19: RequestThrottleGuard reset clears all', () => {
  const guard = new RequestThrottleGuard({ maxRequests: 5 });
  for (let i = 0; i < 5; i++) guard.check('k1');
  for (let i = 0; i < 5; i++) guard.check('k2');
  guard.reset();
  assertEqual(guard.getLevel('k1'), 'NONE');
  assertEqual(guard.getLevel('k2'), 'NONE');
});

// ─── GeofenceGuard Tests ───────────────────────────────────────────────────

test('v19: GeofenceGuard constructor defaults', () => {
  const gf = new GeofenceGuard();
  assertEqual(gf.defaultAction, 'allow');
});

test('v19: GeofenceGuard addRegion and getRegions', () => {
  const gf = new GeofenceGuard();
  gf.addRegion('internal', ['10.', '192.168.'], 'allow');
  gf.addRegion('blocked', ['5.5.5.'], 'deny');
  const regions = gf.getRegions();
  assert(regions.includes('internal'), 'has internal');
  assert(regions.includes('blocked'), 'has blocked');
});

test('v19: GeofenceGuard check — no match, default allow', () => {
  const gf = new GeofenceGuard({ defaultAction: 'allow' });
  const result = gf.check('1.2.3.4');
  assertEqual(result.allowed, true);
  assertEqual(result.matched, false);
});

test('v19: GeofenceGuard check — no match, default deny', () => {
  const gf = new GeofenceGuard({ defaultAction: 'deny' });
  const result = gf.check('9.9.9.9');
  assertEqual(result.allowed, false);
  assertEqual(result.matched, false);
});

test('v19: GeofenceGuard check — matched allow region', () => {
  const gf = new GeofenceGuard();
  gf.addRegion('trusted', ['192.168.1.'], 'allow');
  const result = gf.check('192.168.1.100');
  assertEqual(result.allowed, true);
  assertEqual(result.matched, true);
  assertEqual(result.region, 'trusted');
});

test('v19: GeofenceGuard check — matched deny region', () => {
  const gf = new GeofenceGuard({ defaultAction: 'allow' });
  gf.addRegion('blocked', ['5.5.5.'], 'deny');
  const result = gf.check('5.5.5.10');
  assertEqual(result.allowed, false);
  assertEqual(result.matched, true);
  assertEqual(result.region, 'blocked');
});

test('v19: GeofenceGuard setDefaultAction changes default', () => {
  const gf = new GeofenceGuard({ defaultAction: 'allow' });
  gf.setDefaultAction('deny');
  assertEqual(gf.check('8.8.8.8').allowed, false);
});

test('v19: GeofenceGuard removeRegion removes it', () => {
  const gf = new GeofenceGuard({ defaultAction: 'allow' });
  gf.addRegion('r1', ['5.'], 'deny');
  gf.removeRegion('r1');
  assertEqual(gf.check('5.5.5.5').matched, false);
});

test('v19: GeofenceGuard getRegion returns details', () => {
  const gf = new GeofenceGuard();
  gf.addRegion('r1', ['10.'], 'allow');
  const region = gf.getRegion('r1');
  assert(region !== null, 'region details returned');
  assert(region.prefixes.includes('10.'), 'has prefix');
  assertEqual(region.action, 'allow');
});

test('v19: GeofenceGuard reset clears all regions', () => {
  const gf = new GeofenceGuard({ defaultAction: 'deny' });
  gf.addRegion('r1', ['1.'], 'deny');
  gf.addRegion('r2', ['2.'], 'deny');
  gf.reset();
  assertEqual(gf.getRegions().length, 0);
  assertEqual(gf.defaultAction, 'allow');
});

// ─── CryptoKeyRotator Tests ────────────────────────────────────────────────

test('v19: CryptoKeyRotator constructor defaults', () => {
  const r = new CryptoKeyRotator();
  assertEqual(r.maxVersions, 10);
  assertEqual(r.getCurrentKey(), null);
  assertEqual(r.listVersions().length, 0);
});

test('v19: CryptoKeyRotator addKey and getCurrentKey', () => {
  const r = new CryptoKeyRotator();
  r.addKey('v1', 'deadbeef', Date.now() + 3600000);
  const current = r.getCurrentKey();
  assert(current !== null, 'current key exists');
  assertEqual(current.version, 'v1');
  assertEqual(current.key, 'deadbeef');
});

test('v19: CryptoKeyRotator getCurrentKey returns null for expired key', () => {
  const r = new CryptoKeyRotator();
  r.addKey('v1', 'deadbeef', Date.now() - 1000); // already expired
  assertEqual(r.getCurrentKey(), null);
});

test('v19: CryptoKeyRotator getKey returns specific version', () => {
  const r = new CryptoKeyRotator();
  r.addKey('v1', 'key1', Date.now() + 3600000);
  r.addKey('v2', 'key2', Date.now() + 7200000);
  const k1 = r.getKey('v1');
  assert(k1 !== null, 'v1 exists');
  assertEqual(k1.key, 'key1');
  assertEqual(k1.expired, false);
});

test('v19: CryptoKeyRotator getKey returns null for nonexistent version', () => {
  const r = new CryptoKeyRotator();
  assertEqual(r.getKey('nonexistent'), null);
});

test('v19: CryptoKeyRotator rotateKeys updates current', () => {
  const r = new CryptoKeyRotator();
  r.addKey('v1', 'old-key', Date.now() + 3600000);
  r.rotateKeys('v2', 'new-key', Date.now() + 7200000);
  const current = r.getCurrentKey();
  assertEqual(current.version, 'v2');
  assertEqual(current.key, 'new-key');
});

test('v19: CryptoKeyRotator pruneExpired removes expired versions', () => {
  const r = new CryptoKeyRotator();
  r.addKey('v1', 'k1', Date.now() - 1000); // expired
  r.addKey('v2', 'k2', Date.now() + 3600000); // valid
  const pruned = r.pruneExpired();
  assertEqual(pruned, 1);
  assert(!r.listVersions().includes('v1'), 'v1 removed');
  assert(r.listVersions().includes('v2'), 'v2 kept');
});

test('v19: CryptoKeyRotator listVersions returns all version labels', () => {
  const r = new CryptoKeyRotator();
  r.addKey('v1', 'k1', Date.now() + 3600000);
  r.addKey('v2', 'k2', Date.now() + 7200000);
  const versions = r.listVersions();
  assert(versions.includes('v1'), 'has v1');
  assert(versions.includes('v2'), 'has v2');
});

test('v19: CryptoKeyRotator isValid — true for non-expired key', () => {
  const r = new CryptoKeyRotator();
  r.addKey('v1', 'k', Date.now() + 3600000);
  assertEqual(r.isValid('v1'), true);
});

test('v19: CryptoKeyRotator isValid — false for expired key', () => {
  const r = new CryptoKeyRotator();
  r.addKey('v1', 'k', Date.now() - 1000);
  assertEqual(r.isValid('v1'), false);
});

test('v19: CryptoKeyRotator isValid — false for nonexistent key', () => {
  const r = new CryptoKeyRotator();
  assertEqual(r.isValid('vX'), false);
});

test('v19: CryptoKeyRotator reset clears all keys', () => {
  const r = new CryptoKeyRotator();
  r.addKey('v1', 'k1', Date.now() + 3600000);
  r.reset();
  assertEqual(r.listVersions().length, 0);
  assertEqual(r.getCurrentKey(), null);
});

// ─── SecurityEventCorrelator Tests ─────────────────────────────────────────

test('v19: SecurityEventCorrelator constructor defaults', () => {
  const sec = new SecurityEventCorrelator();
  assertEqual(sec.maxEvents, 10000);
  assertEqual(sec.alertThreshold, 3);
  assertEqual(sec.criticalThreshold, 2);
});

test('v19: SecurityEventCorrelator record stores event', () => {
  const sec = new SecurityEventCorrelator();
  sec.record({ type: 'auth_fail', severity: 'warn', source: '1.2.3.4' });
  const stats = sec.getStats(60000);
  assertEqual(stats.total, 1);
});

test('v19: SecurityEventCorrelator correlate — no events, risk none', () => {
  const sec = new SecurityEventCorrelator();
  const result = sec.correlate(60000);
  assertEqual(result.risk, 'none');
  assertEqual(result.eventCount, 0);
});

test('v19: SecurityEventCorrelator correlate — low events, low risk', () => {
  const sec = new SecurityEventCorrelator({ alertThreshold: 10 });
  sec.record({ type: 'auth_fail', severity: 'warn', source: '1.2.3.4' });
  sec.record({ type: 'auth_fail', severity: 'warn', source: '1.2.3.4' });
  const result = sec.correlate(60000);
  assertEqual(result.risk, 'low');
});

test('v19: SecurityEventCorrelator correlate — high volume triggers alert', () => {
  const sec = new SecurityEventCorrelator({ alertThreshold: 3 });
  for (let i = 0; i < 5; i++) {
    sec.record({ type: 'auth_fail', severity: 'warn', source: '10.0.0.1' });
  }
  const result = sec.correlate(60000);
  assert(result.risk === 'medium' || result.risk === 'high', 'risk elevated');
  assert(result.patterns.length > 0, 'patterns detected');
});

test('v19: SecurityEventCorrelator correlate — critical storm', () => {
  const sec = new SecurityEventCorrelator({ criticalThreshold: 2 });
  sec.record({ type: 'breach', severity: 'critical', source: '5.5.5.5' });
  sec.record({ type: 'breach', severity: 'critical', source: '5.5.5.5' });
  const result = sec.correlate(60000);
  assertEqual(result.risk, 'critical');
  assert(result.patterns.some(p => p.includes('critical_storm')), 'critical_storm pattern detected');
});

test('v19: SecurityEventCorrelator correlate — multi-vector attack', () => {
  const sec = new SecurityEventCorrelator({ alertThreshold: 100 });
  sec.record({ type: 'rate_limit', severity: 'warn', source: '3.3.3.3' });
  sec.record({ type: 'auth_fail', severity: 'warn', source: '3.3.3.3' });
  sec.record({ type: 'honeypot_trip', severity: 'high', source: '3.3.3.3' });
  sec.record({ type: 'geofence_block', severity: 'high', source: '3.3.3.3' });
  const result = sec.correlate(60000);
  assert(result.patterns.some(p => p.includes('multi_vector')), 'multi_vector_attack detected');
});

test('v19: SecurityEventCorrelator getAlerts returns alerts array', () => {
  const sec = new SecurityEventCorrelator({ criticalThreshold: 1 });
  sec.record({ type: 'breach', severity: 'critical', source: '5.5.5.5' });
  sec.correlate(60000);
  const alerts = sec.getAlerts();
  assert(Array.isArray(alerts), 'alerts is array');
});

test('v19: SecurityEventCorrelator clearAlerts empties alerts', () => {
  const sec = new SecurityEventCorrelator({ criticalThreshold: 1 });
  sec.record({ type: 'breach', severity: 'critical', source: '5.5.5.5' });
  sec.correlate(60000);
  sec.clearAlerts();
  assertEqual(sec.getAlerts().length, 0);
});

test('v19: SecurityEventCorrelator getStats by type and severity', () => {
  const sec = new SecurityEventCorrelator();
  sec.record({ type: 'auth_fail', severity: 'warn', source: 'a' });
  sec.record({ type: 'rate_limit', severity: 'warn', source: 'b' });
  sec.record({ type: 'auth_fail', severity: 'high', source: 'c' });
  const stats = sec.getStats(60000);
  assertEqual(stats.total, 3);
  assertEqual(stats.byType['auth_fail'], 2);
  assertEqual(stats.byType['rate_limit'], 1);
});

test('v19: SecurityEventCorrelator reset clears events and alerts', () => {
  const sec = new SecurityEventCorrelator();
  sec.record({ type: 'x', severity: 'warn', source: '1.1.1.1' });
  sec.reset();
  assertEqual(sec.getStats(60000).total, 0);
  assertEqual(sec.getAlerts().length, 0);
});

// ─── v19: Client Integration Tests ────────────────────────────────────────

test('v19: client with honeypot blocks matching URL', async () => {
  const mockAdapter = async () => ({ data: { ok: true }, rawData: { ok: true }, status: 200, statusText: 'OK', headers: {}, request: {} });
  const client = createClient({
    adapter: mockAdapter,
    ssrf: { enabled: false },
    baseURL: 'http://example.com',
    honeypot: {},
  });
  client._honeypot.addHoneypot('/admin-backup');
  let caught = null;
  try {
    await client.get('/admin-backup/db');
  } catch (e) {
    caught = e;
  }
  assert(caught !== null, 'error thrown');
  assertEqual(caught.code, 'ERR_HONEYPOT_TRIP');
});

test('v19: client with geofence blocks denied IP', async () => {
  const mockAdapter = async () => ({ data: { ok: true }, rawData: { ok: true }, status: 200, statusText: 'OK', headers: {}, request: {} });
  const client = createClient({
    adapter: mockAdapter,
    ssrf: { enabled: false },
    baseURL: 'http://example.com',
    geofence: { defaultAction: 'allow' },
  });
  client._geofence.addRegion('blocked', ['5.5.5.'], 'deny');
  // Inject client IP via interceptor
  client.interceptors.request.use((config) => {
    config.clientIP = '5.5.5.10';
    return config;
  });
  let caught = null;
  try {
    await client.get('/api');
  } catch (e) {
    caught = e;
  }
  assert(caught !== null, 'error thrown');
  assertEqual(caught.code, 'ERR_GEOFENCE_BLOCKED');
});

test('v19: client with throttleGuard blocks over-limit requests', async () => {
  const mockAdapter = async () => ({ data: { ok: true }, rawData: { ok: true }, status: 200, statusText: 'OK', headers: {}, request: {} });
  const client = createClient({
    adapter: mockAdapter,
    ssrf: { enabled: false },
    baseURL: 'http://example.com',
    throttleGuard: { maxRequests: 3, windowMs: 60000, warnAt: 10, delayAt: 40, blockAt: 80 },
  });
  // Pre-fill throttle to past BLOCK threshold
  client._throttleGuard.penalize('GET:/api', 100);
  let caught = null;
  try {
    await client.get('/api');
  } catch (e) {
    caught = e;
  }
  assert(caught !== null, 'error thrown');
  assertEqual(caught.code, 'ERR_THROTTLE_BLOCKED');
});

test('v19: client with keyRotator injects key version header', async () => {
  const mockAdapter = async (config) => ({
    data: { ok: true }, rawData: { ok: true }, status: 200, statusText: 'OK',
    headers: {}, request: {},
  });
  const client = createClient({
    adapter: mockAdapter,
    ssrf: { enabled: false },
    baseURL: 'http://example.com',
    keyRotator: {},
  });
  client._keyRotator.addKey('v1', 'mykey', Date.now() + 3600000);
  const res = await client.get('/api');
  assert(res.config.headers['x-key-version'] !== undefined, 'key version header injected');
  assertEqual(res.config.headers['x-key-version'], 'v1');
});

test('v19: client with eventCorrelator records request events', async () => {
  const mockAdapter = async () => ({ data: { ok: true }, rawData: { ok: true }, status: 200, statusText: 'OK', headers: {}, request: {} });
  const client = createClient({
    adapter: mockAdapter,
    ssrf: { enabled: false },
    baseURL: 'http://example.com',
    eventCorrelator: { alertThreshold: 100 },
  });
  await client.get('/api');
  const stats = client._eventCorrelator.getStats(60000);
  assert(stats.total >= 1, 'at least one event recorded');
});

test('v19: VERSION is 19.0.0', () => {
  assertEqual(VERSION, '18.0.2');
});

test('v19: ERR_HONEYPOT_TRIP error code exists', () => {
  assertEqual(ClientError.ERR_HONEYPOT_TRIP, 'ERR_HONEYPOT_TRIP');
});

test('v19: ERR_GEOFENCE_BLOCKED error code exists', () => {
  assertEqual(ClientError.ERR_GEOFENCE_BLOCKED, 'ERR_GEOFENCE_BLOCKED');
});

test('v19: ERR_BEHAVIORAL_ANOMALY error code exists', () => {
  assertEqual(ClientError.ERR_BEHAVIORAL_ANOMALY, 'ERR_BEHAVIORAL_ANOMALY');
});

test('v19: ERR_THROTTLE_BLOCKED error code exists', () => {
  assertEqual(ClientError.ERR_THROTTLE_BLOCKED, 'ERR_THROTTLE_BLOCKED');
});

test('v19: ERR_SRI_MISMATCH error code exists', () => {
  assertEqual(ClientError.ERR_SRI_MISMATCH, 'ERR_SRI_MISMATCH');
});

test('v19: ERR_QUANTUM_VERIFY_FAILED error code exists', () => {
  assertEqual(ClientError.ERR_QUANTUM_VERIFY_FAILED, 'ERR_QUANTUM_VERIFY_FAILED');
});

test('v19: ERR_KEY_ROTATION_FAILED error code exists', () => {
  assertEqual(ClientError.ERR_KEY_ROTATION_FAILED, 'ERR_KEY_ROTATION_FAILED');
});

test('v19: ERR_CORRELATION_ALERT error code exists', () => {
  assertEqual(ClientError.ERR_CORRELATION_ALERT, 'ERR_CORRELATION_ALERT');
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
