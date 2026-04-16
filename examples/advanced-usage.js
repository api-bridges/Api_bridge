/**
 * APIBridge AI — Advanced SDK Usage Examples
 *
 * Demonstrates SDK-level features: plugins, pipelines, circuit breakers,
 * event-driven architecture, and custom extension patterns.
 *
 * Run: node examples/advanced-usage.js
 */

const {
  createTransformer,
  ComposablePipeline,
  CircuitBreaker,
  EventBus,
  PluginManager,
  RetryStrategy,
  SchemaRegistry,
  HealthCheck,
  BatchOrchestrator,
  RequestInterceptor,
  FieldStats,
  SchemaInference,
  DataMasker,
  MetricsCollector,
  SchemaDiff,
} = require('../src/index');

// ─── 1. Composable Pipeline ─────────────────────────────────────────────────
console.log('=== 1. Composable Pipeline ===');
(async () => {
  const pipeline = new ComposablePipeline();
  pipeline
    .pipe('validate', (data) => {
      if (!data.name) throw new Error('Name required');
      return data;
    })
    .pipe('transform', (data) => ({
      ...data,
      name: data.name.toUpperCase(),
      processedAt: new Date().toISOString(),
    }))
    .pipe('enrich', (data) => ({
      ...data,
      source: 'api-bridge',
    }));

  const result = await pipeline.execute({ name: 'Alice', role: 'admin' });
  console.log('Pipeline result:', result);
  console.log();

  // ─── 2. Circuit Breaker ──────────────────────────────────────────────────
  console.log('=== 2. Circuit Breaker ===');
  const breaker = new CircuitBreaker({ failureThreshold: 3, resetTimeout: 5000 });
  try {
    const cbResult = await breaker.execute(() => Promise.resolve({ status: 'ok' }));
    console.log('Circuit breaker result:', cbResult);
  } catch (err) {
    console.log('Circuit breaker error:', err.message);
  }
  console.log('Circuit breaker state:', breaker.getState());
  console.log();

  // ─── 3. Event Bus ────────────────────────────────────────────────────────
  console.log('=== 3. Event Bus ===');
  const bus = new EventBus({ recordHistory: true });
  bus.on('api.request', (data) => console.log('  [Event] Request:', data.url));
  bus.on('api.response', (data) => console.log('  [Event] Response:', data.status));
  bus.on('api.*', (data) => console.log('  [Wildcard] Caught:', data));
  await bus.emit('api.request', { url: '/users', method: 'GET' });
  await bus.emit('api.response', { status: 200, duration: 42 });
  console.log('Event history:', bus.getHistory().length, 'events');
  console.log();

  // ─── 4. Retry Strategy ───────────────────────────────────────────────────
  console.log('=== 4. Retry Strategy ===');
  let attempt = 0;
  const retry = new RetryStrategy({
    strategy: 'exponentialJitter',
    maxRetries: 3,
    baseDelay: 100,
    onRetry: (a, err) => console.log(`  Retry attempt ${a}: ${err.message}`),
  });
  try {
    const retryResult = await retry.execute(() => {
      attempt++;
      if (attempt < 3) throw new Error('Transient failure');
      return { data: 'success', attempts: attempt };
    });
    console.log('Retry result:', retryResult);
  } catch (err) {
    console.log('Retry failed:', err.message);
  }
  console.log();

  // ─── 5. Schema Registry ──────────────────────────────────────────────────
  console.log('=== 5. Schema Registry ===');
  const registry = new SchemaRegistry();
  registry.register('user', {
    name: { type: 'string', required: true },
    email: { type: 'string', required: true },
    age: { type: 'number', required: false },
  }, { version: 1 });
  registry.register('user', {
    name: { type: 'string', required: true },
    email: { type: 'string', required: true },
    age: { type: 'number', required: false },
    role: { type: 'string', required: true },
  }, { version: 2 });
  console.log('Schema versions:', registry.listVersions('user'));
  console.log('Latest schema:', registry.get('user'));
  console.log();

  // ─── 6. Batch Orchestrator ───────────────────────────────────────────────
  console.log('=== 6. Batch Orchestrator ===');
  const batch = new BatchOrchestrator({ concurrency: 2 });
  const tasks = [
    { id: 'task1', execute: () => Promise.resolve({ user: 'Alice' }) },
    { id: 'task2', execute: () => Promise.resolve({ user: 'Bob' }) },
    { id: 'task3', execute: () => Promise.resolve({ user: 'Charlie' }) },
  ];
  const batchResults = await batch.executeParallel(tasks);
  console.log('Batch results:', batchResults);
  console.log();

  // ─── 7. Request Interceptor Chain ────────────────────────────────────────
  console.log('=== 7. Request Interceptor Chain ===');
  const interceptor = new RequestInterceptor();
  interceptor.useRequest('auth', (ctx) => {
    ctx.headers = { ...ctx.headers, Authorization: 'Bearer token123' };
    return ctx;
  }, { priority: 1 });
  interceptor.useRequest('logging', (ctx) => {
    console.log('  [Interceptor] Request to:', ctx.url);
    return ctx;
  }, { priority: 2 });
  const interceptedCtx = await interceptor.interceptRequest({
    url: '/api/users',
    method: 'GET',
    headers: {},
  });
  console.log('Intercepted context headers:', interceptedCtx.headers);
  console.log();

  // ─── 8. Schema Inference ─────────────────────────────────────────────────
  console.log('=== 8. Schema Inference ===');
  const inferrer = new SchemaInference();
  const inferred = inferrer.infer([
    { name: 'Alice', age: 30, active: true },
    { name: 'Bob', age: 25, active: false, role: 'admin' },
  ]);
  console.log('Inferred schema:', JSON.stringify(inferred, null, 2));
  console.log();

  // ─── 9. Data Masking ─────────────────────────────────────────────────────
  console.log('=== 9. Data Masking (PII Protection) ===');
  const masker = new DataMasker();
  const sensitive = { name: 'Alice Smith', email: 'alice@test.com', ssn: '123-45-6789' };
  const masked = masker.mask(sensitive, {
    email: 'redact',
    ssn: 'mask',
    name: 'hash',
  });
  console.log('Original:', sensitive);
  console.log('Masked:', masked);
  console.log();

  // ─── 10. Schema Diff ─────────────────────────────────────────────────────
  console.log('=== 10. Schema Diff (API Drift Detection) ===');
  const differ = new SchemaDiff();
  const diff = differ.diff(
    { name: { type: 'string' }, age: { type: 'number' }, legacy: { type: 'string' } },
    { name: { type: 'string' }, age: { type: 'string' }, role: { type: 'string' } },
  );
  console.log('Schema differences:', JSON.stringify(diff, null, 2));
  console.log();

  console.log('✅ All advanced examples completed successfully!');
})();
