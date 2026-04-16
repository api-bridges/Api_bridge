/**
 * APIBridge AI — Basic Usage Examples
 *
 * Run: node examples/basic-usage.js
 */

const {
  transform,
  createTransformer,
  SchemaValidator,
  FuzzyMatcher,
  TypeCoercer,
  FieldAliaser,
  SchemaMigrator,
  DeepMerge,
  ConditionalTransform,
  OutputFormatter,
  CircuitBreaker,
  ComposablePipeline,
  EventBus,
  PluginManager,
} = require('../src/index');

// ─── 1. Basic Transform ──────────────────────────────────────────────────────
console.log('=== 1. Basic Transform (snake_case → camelCase) ===');
const apiResponse = {
  user_name: 'John Doe',
  email_address: 'john@example.com',
  created_at: '2024-01-15',
  is_active: true,
};
const transformed = transform(apiResponse);
console.log('Input:', apiResponse);
console.log('Output:', transformed);
console.log();

// ─── 2. Schema-Based Validation ──────────────────────────────────────────────
console.log('=== 2. Schema Validation ===');
const validator = new SchemaValidator({ strict: false, coerce: true });
const schema = {
  userName: { type: 'string', required: true },
  email: { type: 'string', required: true },
  age: { type: 'number', required: false, default: 0 },
};
const result = validator.validate({ userName: 'Alice', email: 'alice@test.com' }, schema);
console.log('Validation result:', result);
console.log();

// ─── 3. Fuzzy Matching ──────────────────────────────────────────────────────
console.log('=== 3. Fuzzy Field Matching ===');
const fuzzy = new FuzzyMatcher();
const candidates = ['user_email', 'user_name', 'created_date', 'is_active'];
const match = fuzzy.findBestMatch('usr_email', candidates);
console.log('Best match for "usr_email":', match);
console.log();

// ─── 4. Field Aliasing ───────────────────────────────────────────────────────
console.log('=== 4. Field Aliasing ===');
const aliaser = new FieldAliaser();
aliaser.register('userId', ['user_id', 'uid', 'member_id', 'usr_id']);
aliaser.register('email', ['email_address', 'mail', 'e_mail']);
console.log('Resolve "uid":', aliaser.resolve('uid'));
console.log('Resolve "mail":', aliaser.resolve('mail'));
console.log();

// ─── 5. Schema Migration ────────────────────────────────────────────────────
console.log('=== 5. Schema Migration ===');
const migrator = new SchemaMigrator();
migrator.define('1.0', '2.0', {
  rename: { user_name: 'username', email_addr: 'email' },
  add: { role: 'user' },
  remove: ['legacy_field'],
});
const migrated = migrator.migrate(
  { user_name: 'John', email_addr: 'john@test.com', legacy_field: 'old' },
  '1.0',
  '2.0',
);
console.log('Migrated:', migrated);
console.log();

// ─── 6. Deep Merge ──────────────────────────────────────────────────────────
console.log('=== 6. Deep Merge ===');
const merger = new DeepMerge({ arrayStrategy: 'union' });
const merged = merger.merge(
  { user: { name: 'John', tags: ['admin'] } },
  { user: { email: 'john@test.com', tags: ['editor'] } },
);
console.log('Merged:', JSON.stringify(merged, null, 2));
console.log();

// ─── 7. Conditional Transform ────────────────────────────────────────────────
console.log('=== 7. Conditional Transform ===');
const ct = new ConditionalTransform();
ct.when('nullToDefault', (v) => v === null, () => 'N/A');
ct.when('trimStrings', (v) => typeof v === 'string', (v) => v.trim());
console.log('null →', ct.apply(null));
console.log('"  hello  " →', ct.apply('  hello  '));
console.log();

// ─── 8. Output Formatting ───────────────────────────────────────────────────
console.log('=== 8. Output Formatting ===');
const formatter = new OutputFormatter();
const data = [
  { name: 'Alice', age: 30, role: 'admin' },
  { name: 'Bob', age: 25, role: 'user' },
];
console.log('CSV output:');
console.log(formatter.toCSV(data));
console.log();

// ─── 9. Plugin System ───────────────────────────────────────────────────────
console.log('=== 9. Plugin System ===');
const plugins = new PluginManager();
plugins.register({
  name: 'logging-plugin',
  version: '1.0.0',
  hooks: {
    beforeTransform: (data) => {
      console.log('  [Plugin] Before transform:', Object.keys(data).length, 'fields');
      return data;
    },
    afterTransform: (data) => {
      console.log('  [Plugin] After transform:', Object.keys(data).length, 'fields');
      return data;
    },
  },
});
console.log('Registered plugins:', plugins.list());
console.log();

// ─── 10. Reusable Transformer ───────────────────────────────────────────────
console.log('=== 10. Reusable Transformer ===');
const transformer = createTransformer({
  schema: {
    first_name: 'firstName',
    last_name: 'lastName',
    phone_number: 'phone',
  },
});
console.log(
  'Transform:',
  transformer.transform(
    { first_name: 'Jane', last_name: 'Doe', phone_number: '555-0123' },
    { first_name: 'firstName', last_name: 'lastName', phone_number: 'phone' },
    'toFrontend',
  ),
);
console.log();

console.log('✅ All examples completed successfully!');
