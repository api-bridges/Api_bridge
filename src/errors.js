/**
 * APIBridge AI v8 — Custom Error Classes
 *
 * Structured error hierarchy for every failure mode:
 *  - ValidationError        — schema or type mismatch
 *  - TransformError         — key resolution / coercion failure
 *  - CacheError             — cache read/write issues
 *  - MiddlewareError        — pipeline failure
 *  - NetworkError           — retry-related fetch failures
 *  - PluginError            — plugin registration / execution failure  (v3)
 *  - RateLimitError         — rate limit exceeded                      (v3)
 *  - InferenceError         — schema inference failure                 (v3)
 *  - CircuitBreakerError    — circuit breaker tripped                  (v4)
 *  - PipelineError          — composable pipeline stage failure        (v4)
 *  - WebhookError           — webhook processing failure               (v4)
 *  - VersioningError        — API version management failure           (v4)
 *  - RetryError             — retry strategy exhaustion                (v5)
 *  - SchemaRegistryError    — schema registry failure                  (v5)
 *  - DependencyGraphError   — dependency graph cycle / execution       (v5)
 *  - MockServerError        — mock server matching / handling          (v5)
 *  - HealthCheckError       — health check probe failure               (v5)
 *  - EventBusError          — event bus subscription / emission        (v5)
 *  - FuzzyMatchError        — fuzzy matching failure                   (v6)
 *  - TypeCoercionError      — type coercion failure                    (v6)
 *  - CrypticResolverError   — cryptic name resolution failure          (v6)
 *  - FieldAliaserError      — field alias resolution failure           (v8)
 *  - SchemaMigrationError   — schema migration failure                 (v8)
 *  - BatchOrchestratorError — batch orchestration failure              (v8)
 *  - DeepMergeError         — deep merge conflict or depth failure     (v8)
 *  - InterceptorError       — request interceptor chain failure        (v8)
 */

class ApiBridgeError extends Error {
  constructor(message, code, details = {}) {
    super(message);
    this.name = 'ApiBridgeError';
    this.code = code;
    this.details = details;
    this.timestamp = new Date().toISOString();
  }

  toJSON() {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      details: this.details,
      timestamp: this.timestamp,
    };
  }
}

class ValidationError extends ApiBridgeError {
  constructor(message, field, expected, received) {
    super(message, 'VALIDATION_ERROR', { field, expected, received });
    this.name = 'ValidationError';
  }
}

class TransformError extends ApiBridgeError {
  constructor(message, sourceKey, details = {}) {
    super(message, 'TRANSFORM_ERROR', { sourceKey, ...details });
    this.name = 'TransformError';
  }
}

class CacheError extends ApiBridgeError {
  constructor(message, key) {
    super(message, 'CACHE_ERROR', { key });
    this.name = 'CacheError';
  }
}

class MiddlewareError extends ApiBridgeError {
  constructor(message, middlewareName, originalError) {
    super(message, 'MIDDLEWARE_ERROR', {
      middleware: middlewareName,
      originalMessage: originalError ? originalError.message : null,
    });
    this.name = 'MiddlewareError';
  }
}

class NetworkError extends ApiBridgeError {
  constructor(message, url, attempt, maxRetries) {
    super(message, 'NETWORK_ERROR', { url, attempt, maxRetries });
    this.name = 'NetworkError';
  }
}

class PluginError extends ApiBridgeError {
  constructor(message, pluginName, originalError) {
    super(message, 'PLUGIN_ERROR', {
      plugin: pluginName,
      originalMessage: originalError ? originalError.message : null,
    });
    this.name = 'PluginError';
  }
}

class RateLimitError extends ApiBridgeError {
  constructor(message, limit, retryAfterMs) {
    super(message, 'RATE_LIMIT_ERROR', { limit, retryAfterMs });
    this.name = 'RateLimitError';
  }
}

class InferenceError extends ApiBridgeError {
  constructor(message, reason) {
    super(message, 'INFERENCE_ERROR', { reason });
    this.name = 'InferenceError';
  }
}

class CircuitBreakerError extends ApiBridgeError {
  constructor(message, state, failures) {
    super(message, 'CIRCUIT_BREAKER_ERROR', { state, failures });
    this.name = 'CircuitBreakerError';
  }
}

class PipelineError extends ApiBridgeError {
  constructor(message, stageName, originalError) {
    super(message, 'PIPELINE_ERROR', {
      stage: stageName,
      originalMessage: originalError ? originalError.message : null,
    });
    this.name = 'PipelineError';
  }
}

class WebhookError extends ApiBridgeError {
  constructor(message, provider, reason) {
    super(message, 'WEBHOOK_ERROR', { provider, reason });
    this.name = 'WebhookError';
  }
}

class VersioningError extends ApiBridgeError {
  constructor(message, version, reason) {
    super(message, 'VERSIONING_ERROR', { version, reason });
    this.name = 'VersioningError';
  }
}

class RetryError extends ApiBridgeError {
  constructor(message, attempt, maxRetries, reason) {
    super(message, 'RETRY_ERROR', { attempt, maxRetries, reason });
    this.name = 'RetryError';
  }
}

class SchemaRegistryError extends ApiBridgeError {
  constructor(message, schemaName, reason) {
    super(message, 'SCHEMA_REGISTRY_ERROR', { schemaName, reason });
    this.name = 'SchemaRegistryError';
  }
}

class DependencyGraphError extends ApiBridgeError {
  constructor(message, nodeName, reason) {
    super(message, 'DEPENDENCY_GRAPH_ERROR', { nodeName, reason });
    this.name = 'DependencyGraphError';
  }
}

class MockServerError extends ApiBridgeError {
  constructor(message, operation, reason) {
    super(message, 'MOCK_SERVER_ERROR', { operation, reason });
    this.name = 'MockServerError';
  }
}

class HealthCheckError extends ApiBridgeError {
  constructor(message, endpoint, reason) {
    super(message, 'HEALTH_CHECK_ERROR', { endpoint, reason });
    this.name = 'HealthCheckError';
  }
}

class EventBusError extends ApiBridgeError {
  constructor(message, event, reason) {
    super(message, 'EVENT_BUS_ERROR', { event, reason });
    this.name = 'EventBusError';
  }
}

class FuzzyMatchError extends ApiBridgeError {
  constructor(message, sourceKey, candidates) {
    super(message, 'FUZZY_MATCH_ERROR', { sourceKey, candidates });
    this.name = 'FuzzyMatchError';
  }
}

class TypeCoercionError extends ApiBridgeError {
  constructor(message, field, sourceType, targetType) {
    super(message, 'TYPE_COERCION_ERROR', { field, sourceType, targetType });
    this.name = 'TypeCoercionError';
  }
}

class CrypticResolverError extends ApiBridgeError {
  constructor(message, sourceKey, reason) {
    super(message, 'CRYPTIC_RESOLVER_ERROR', { sourceKey, reason });
    this.name = 'CrypticResolverError';
  }
}

class FieldAliaserError extends ApiBridgeError {
  constructor(message, field, reason) {
    super(message, 'FIELD_ALIASER_ERROR', { field, reason });
    this.name = 'FieldAliaserError';
  }
}

class SchemaMigrationError extends ApiBridgeError {
  constructor(message, fromVersion, toVersion, reason) {
    super(message, 'SCHEMA_MIGRATION_ERROR', { fromVersion, toVersion, reason });
    this.name = 'SchemaMigrationError';
  }
}

class BatchOrchestratorError extends ApiBridgeError {
  constructor(message, batchId, reason) {
    super(message, 'BATCH_ORCHESTRATOR_ERROR', { batchId, reason });
    this.name = 'BatchOrchestratorError';
  }
}

class DeepMergeError extends ApiBridgeError {
  constructor(message, path, reason) {
    super(message, 'DEEP_MERGE_ERROR', { path, reason });
    this.name = 'DeepMergeError';
  }
}

class InterceptorError extends ApiBridgeError {
  constructor(message, interceptorName, reason) {
    super(message, 'INTERCEPTOR_ERROR', { interceptorName, reason });
    this.name = 'InterceptorError';
  }
}

module.exports = {
  ApiBridgeError,
  ValidationError,
  TransformError,
  CacheError,
  MiddlewareError,
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
  FuzzyMatchError,
  TypeCoercionError,
  CrypticResolverError,
  FieldAliaserError,
  SchemaMigrationError,
  BatchOrchestratorError,
  DeepMergeError,
  InterceptorError,
};
