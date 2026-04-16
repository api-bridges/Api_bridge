// TypeScript Type Declarations for APIBridge AI v8
// Type definitions for api-bridge-ai 8.0.0

export = ApiBridgeAI;
export as namespace ApiBridgeAI;

declare namespace ApiBridgeAI {
  // ─── Main API ────────────────────────────────────────────────────────────

  /**
   * Wrap an Axios instance with APIBridge transformation.
   */
  function bridge(axiosInstance: any, options?: BridgeOptions): any;

  /**
   * Wrap native fetch with APIBridge transformation, retry, caching, and middleware.
   */
  function bridgeFetch(options?: BridgeFetchOptions): BridgeFetchInstance;

  /**
   * Transform any object directly without an HTTP client.
   */
  function transform(data: Record<string, any>, options?: TransformOptions): Record<string, any>;

  /**
   * Create a reusable transformer instance.
   */
  function createTransformer(options?: TransformOptions): APIBridgeTransformer;

  // ─── Options ─────────────────────────────────────────────────────────────

  interface BridgeOptions {
    schema?: Record<string, string>;
    transformRequests?: boolean;
    cache?: CacheOptions;
    validator?: ValidatorOptions;
    normalizer?: NormalizerOptions;
  }

  interface BridgeFetchOptions {
    schema?: Record<string, string>;
    retries?: number;
    retryDelay?: number;
    cache?: CacheOptions;
    normalizer?: NormalizerOptions;
    validator?: ValidatorOptions;
  }

  interface TransformOptions {
    schema?: Record<string, string>;
    direction?: 'toFrontend' | 'toBackend';
    convention?: string;
  }

  interface CacheOptions {
    maxSize?: number;
    ttl?: number;
    enabled?: boolean;
  }

  interface ValidatorOptions {
    strict?: boolean;
    coerce?: boolean;
    throwOnError?: boolean;
  }

  interface NormalizerOptions {
    envelope?: boolean;
  }

  // ─── Fetch Instance ──────────────────────────────────────────────────────

  interface BridgeFetchInstance {
    get(url: string, config?: RequestInit): Promise<any>;
    post(url: string, body?: any, config?: RequestInit): Promise<any>;
    put(url: string, body?: any, config?: RequestInit): Promise<any>;
    patch(url: string, body?: any, config?: RequestInit): Promise<any>;
    delete(url: string, body?: any, config?: RequestInit): Promise<any>;
    head(url: string, config?: RequestInit): Promise<any>;
    options(url: string, config?: RequestInit): Promise<any>;
    request(method: string, url: string, body?: any, config?: RequestInit): Promise<any>;
    approve(source: string, target: string): void;
    reject(source: string, wrong: string, correct: string): void;
    exportCSV(path?: string): string;
    exportJSON(path?: string): string;
    getStats(): { transformer: any; cache: any; learning: any };
    getPending(): any[];
    validate(data: Record<string, any>, schema: Record<string, SchemaField>): ValidationResult;
    normalize(body: any, status: number): any;
    use(name: string, fn: Function, phase?: string): void;
    clearCache(): void;
    resetSession(): void;
    bulkImport(mappings: Record<string, string>[]): void;
    bulkExport(): Record<string, string>[];
  }

  // ─── Core Classes ────────────────────────────────────────────────────────

  class APIBridgeTransformer {
    constructor(options?: TransformOptions);
    transform(data: Record<string, any>, schema: Record<string, string> | null, direction: string): Record<string, any>;
    approve(source: string, target: string): void;
    reject(source: string, wrong: string, correct: string): void;
    getStats(): any;
    getPending(): any[];
    resetSession(): void;
    readonly mismatches: any[];
    readonly learning: LearningEngine;
  }

  class LearningEngine {
    constructor(options?: any);
    learn(source: string, target: string, confidence: number): void;
    lookup(source: string): { target: string; confidence: number } | null;
    bulkImport(mappings: Record<string, string>[]): void;
    bulkExport(): Record<string, string>[];
    getStats(): any;
  }

  class ResponseNormalizer {
    constructor(options?: NormalizerOptions);
    normalize(body: any, status: number): any;
  }

  class SchemaValidator {
    constructor(options?: ValidatorOptions);
    validate(data: Record<string, any>, schema: Record<string, SchemaField>): ValidationResult;
  }

  class SchemaInference {
    constructor();
    infer(samples: Record<string, any>[]): Record<string, SchemaField>;
  }

  class FuzzyMatcher {
    constructor(options?: any);
    findBestMatch(source: string, candidates: string[]): { match: string; confidence: number } | null;
  }

  class CrypticResolver {
    constructor(options?: any);
    resolve(source: string, candidates: string[]): { match: string; confidence: number } | null;
  }

  class TypeCoercer {
    constructor(options?: any);
    coerceValue(value: any, targetType: string, field?: string): any;
  }

  class FieldAliaser {
    constructor();
    register(canonical: string, aliases: string[]): void;
    resolve(field: string): { canonical: string; matched: boolean };
    getAliases(canonical: string): string[];
  }

  class ConditionalTransform {
    constructor();
    when(name: string, condition: (value: any) => boolean, transform: (value: any) => any): void;
    apply(value: any): any;
  }

  class SchemaMigrator {
    constructor();
    define(fromVersion: string, toVersion: string, migration: MigrationDef): void;
    migrate(data: Record<string, any>, fromVersion: string, toVersion: string): Record<string, any>;
  }

  // ─── Utils Classes ───────────────────────────────────────────────────────

  class ResponseCache {
    constructor(options?: CacheOptions);
    get(key: any, meta?: any): any | null;
    set(key: any, meta: any, value: any): void;
    clear(): void;
    getStats(): any;
  }

  class RequestDeduplicator {
    constructor();
    deduplicate<T>(key: string, fn: () => Promise<T>): Promise<T>;
  }

  class SchemaDiff {
    constructor();
    diff(oldSchema: Record<string, any>, newSchema: Record<string, any>): any;
  }

  function exportMismatchCSV(mismatches: any[], path?: string): string;
  function exportMismatchJSON(mismatches: any[], path?: string): string;
  function exportSchemaSuggestions(mismatches: any[]): any;

  class DataMasker {
    constructor(options?: any);
    mask(data: Record<string, any>, rules: Record<string, string>): Record<string, any>;
  }

  class MetricsCollector {
    constructor();
    startTimer(name: string): () => number;
    increment(name: string, amount?: number): void;
    record(name: string, value: number): void;
    getMetrics(): any;
    reset(): void;
  }

  class JSONPatchGenerator {
    constructor();
    generate(source: any, target: any): PatchOperation[];
    apply(target: any, patches: PatchOperation[]): any;
  }

  class TypeGenerator {
    constructor();
    generate(schema: Record<string, SchemaField>, name?: string): string;
  }

  class DeepMerge {
    constructor(options?: { arrayStrategy?: string; maxDepth?: number });
    merge(target: any, source: any): any;
  }

  class OutputFormatter {
    constructor();
    toCSV(data: any[]): string;
    toJSON(data: any, indent?: number): string;
    toKeyValue(data: Record<string, any>): string;
    toTable(data: any[]): string;
    toXML(data: any, options?: { root?: string; item?: string }): string;
    format(data: any, template: string): string;
  }

  class FieldStats {
    constructor();
    record(field: string, matched: boolean, confidence?: number): void;
    getStats(field?: string): any;
    getCoverageReport(): any;
  }

  class FieldProjection {
    constructor();
    pick(data: Record<string, any>, fields: string[]): Record<string, any>;
    omit(data: Record<string, any>, fields: string[]): Record<string, any>;
    rename(data: Record<string, any>, mapping: Record<string, string>): Record<string, any>;
    reshape(data: Record<string, any>, template: any): any;
    flatten(data: Record<string, any>, prefix?: string): Record<string, any>;
    compact(data: Record<string, any>): Record<string, any>;
  }

  class RequestLogger {
    constructor(options?: any);
    log(entry: any): void;
    getEntries(): any[];
  }

  // ─── Adapter Classes ─────────────────────────────────────────────────────

  class GraphQLBridge {
    constructor(options?: any);
    transformResponse(response: any): any;
    transformVariables(variables: any): any;
  }

  class WebhookHandler {
    constructor(options?: any);
    register(provider: string, config: any): void;
    handle(provider: string, payload: any, headers?: any): any;
  }

  class OpenAPIImporter {
    constructor();
    import(spec: any): Record<string, SchemaField>;
  }

  class MockServer {
    constructor();
    register(method: string, path: string, response: any): void;
    handle(method: string, path: string, body?: any): any;
    getRecordings(): any[];
  }

  class ResponseStreamer {
    constructor(options?: any);
    stream(chunks: any[], transform?: (chunk: any) => any): any[];
  }

  class MiddlewarePipeline {
    constructor();
    use(name: string, fn: Function, phase?: string): void;
    run(phase: string, context: any): Promise<void>;
  }

  class ComposablePipeline {
    constructor();
    pipe(name: string, fn: (data: any) => any): ComposablePipeline;
    execute(data: any): Promise<any>;
  }

  class PluginManager {
    constructor();
    register(plugin: PluginDef): PluginManager;
    unregister(name: string): PluginManager;
    execute(hookName: string, data: any, context?: any): Promise<any>;
    executeSync(hookName: string, data: any, context?: any): any;
    has(name: string): boolean;
    list(): string[];
    get(name: string): PluginDef | null;
    size(): number;
  }

  class RequestInterceptor {
    constructor();
    use(name: string, fn: (ctx: any) => any, options?: { priority?: number; group?: string }): void;
    execute(context: any): Promise<any>;
  }

  class BatchOrchestrator {
    constructor(options?: { concurrency?: number; failureStrategy?: string });
    executeParallel(tasks: BatchTask[]): Promise<any[]>;
    executeSequential(tasks: BatchTask[]): Promise<any[]>;
  }

  class DependencyGraph {
    constructor();
    addNode(name: string, fn: () => Promise<any>, deps?: string[]): void;
    execute(): Promise<Record<string, any>>;
  }

  class EventBus {
    constructor(options?: { recordHistory?: boolean });
    on(event: string, handler: (data: any) => void, options?: { priority?: number }): void;
    off(event: string, handler?: (data: any) => void): void;
    emit(event: string, data?: any): Promise<void>;
    once(event: string, handler: (data: any) => void): void;
    waitFor(event: string, timeout?: number): Promise<any>;
    getHistory(): any[];
  }

  class APIVersionManager {
    constructor();
    register(version: string, config: any): void;
    resolve(version: string): any;
  }

  class CircuitBreaker {
    constructor(options?: { failureThreshold?: number; resetTimeout?: number });
    execute<T>(fn: () => Promise<T>): Promise<T>;
    getState(): string;
    reset(): void;
  }

  class RetryStrategy {
    constructor(options?: RetryOptions);
    execute<T>(fn: () => Promise<T>): Promise<T>;
  }

  class RateLimiter {
    constructor(options?: { maxTokens?: number; refillRate?: number });
    acquire(): boolean;
    waitForToken(timeout?: number): Promise<boolean>;
  }

  class HealthCheck {
    constructor(options?: { failureThreshold?: number; interval?: number });
    register(name: string, checkFn: () => Promise<boolean>): void;
    check(name?: string): Promise<any>;
    getStatus(): any;
  }

  class SchemaRegistry {
    constructor();
    register(name: string, version: string, schema: Record<string, SchemaField>): void;
    get(name: string, version?: string): Record<string, SchemaField> | null;
    listVersions(name: string): string[];
  }

  // ─── Error Classes ───────────────────────────────────────────────────────

  class ApiBridgeError extends Error {
    code: string;
    details: Record<string, any>;
    timestamp: string;
    constructor(message: string, code: string, details?: Record<string, any>);
    toJSON(): { name: string; code: string; message: string; details: any; timestamp: string };
  }

  class ValidationError extends ApiBridgeError {
    constructor(message: string, field: string, expected: string, received: string);
  }

  class TransformError extends ApiBridgeError {
    constructor(message: string, sourceKey: string, details?: Record<string, any>);
  }

  class CacheError extends ApiBridgeError {
    constructor(message: string, key: string);
  }

  class MiddlewareError extends ApiBridgeError {
    constructor(message: string, middlewareName: string, originalError?: Error);
  }

  class NetworkError extends ApiBridgeError {
    constructor(message: string, url: string, attempt: number, maxRetries: number);
  }

  class PluginError extends ApiBridgeError {
    constructor(message: string, pluginName: string, originalError?: Error);
  }

  class RateLimitError extends ApiBridgeError {
    constructor(message: string, limit: number, retryAfterMs: number);
  }

  class InferenceError extends ApiBridgeError {
    constructor(message: string, reason: string);
  }

  class CircuitBreakerError extends ApiBridgeError {
    constructor(message: string, state: string, failures: number);
  }

  class PipelineError extends ApiBridgeError {
    constructor(message: string, stageName: string, originalError?: Error);
  }

  class WebhookError extends ApiBridgeError {
    constructor(message: string, provider: string, reason: string);
  }

  class VersioningError extends ApiBridgeError {
    constructor(message: string, version: string, reason: string);
  }

  class RetryError extends ApiBridgeError {
    constructor(message: string, attempt: number, maxRetries: number, reason: string);
  }

  class SchemaRegistryError extends ApiBridgeError {
    constructor(message: string, schemaName: string, reason: string);
  }

  class DependencyGraphError extends ApiBridgeError {
    constructor(message: string, nodeName: string, reason: string);
  }

  class MockServerError extends ApiBridgeError {
    constructor(message: string, operation: string, reason: string);
  }

  class HealthCheckError extends ApiBridgeError {
    constructor(message: string, endpoint: string, reason: string);
  }

  class EventBusError extends ApiBridgeError {
    constructor(message: string, event: string, reason: string);
  }

  class FuzzyMatchError extends ApiBridgeError {
    constructor(message: string, sourceKey: string, candidates: string[]);
  }

  class TypeCoercionError extends ApiBridgeError {
    constructor(message: string, field: string, sourceType: string, targetType: string);
  }

  class CrypticResolverError extends ApiBridgeError {
    constructor(message: string, sourceKey: string, reason: string);
  }

  class FieldAliaserError extends ApiBridgeError {
    constructor(message: string, field: string, reason: string);
  }

  class SchemaMigrationError extends ApiBridgeError {
    constructor(message: string, fromVersion: string, toVersion: string, reason: string);
  }

  class BatchOrchestratorError extends ApiBridgeError {
    constructor(message: string, batchId: string, reason: string);
  }

  class DeepMergeError extends ApiBridgeError {
    constructor(message: string, path: string, reason: string);
  }

  class InterceptorError extends ApiBridgeError {
    constructor(message: string, interceptorName: string, reason: string);
  }

  // ─── Supporting Types ────────────────────────────────────────────────────

  interface SchemaField {
    type: 'string' | 'number' | 'boolean' | 'date' | 'array' | 'json' | 'object' | 'any';
    required?: boolean;
    default?: any;
  }

  interface ValidationResult {
    valid: boolean;
    errors: ValidationIssue[];
    data: Record<string, any>;
  }

  interface ValidationIssue {
    field: string;
    message: string;
    expected?: string;
    received?: string;
  }

  interface MigrationDef {
    rename?: Record<string, string>;
    add?: Record<string, any>;
    remove?: string[];
  }

  interface PatchOperation {
    op: 'add' | 'remove' | 'replace' | 'move' | 'copy' | 'test';
    path: string;
    value?: any;
    from?: string;
  }

  interface PluginDef {
    name: string;
    version?: string;
    hooks?: Record<string, (data: any, context?: any) => any>;
    init?: () => void;
    destroy?: () => void;
  }

  interface BatchTask {
    id: string;
    fn: (prevResults?: any) => Promise<any>;
  }

  interface RetryOptions {
    strategy?: 'linear' | 'exponential' | 'exponentialJitter' | 'custom';
    maxRetries?: number;
    baseDelay?: number;
    maxDelay?: number;
    shouldRetry?: (error: Error) => boolean;
    onRetry?: (attempt: number, error: Error) => void;
    backoffFn?: (attempt: number) => number;
  }
}
