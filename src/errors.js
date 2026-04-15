/**
 * APIBridge AI v3 — Custom Error Classes
 *
 * Structured error hierarchy for every failure mode:
 *  - ValidationError   — schema or type mismatch
 *  - TransformError    — key resolution / coercion failure
 *  - CacheError        — cache read/write issues
 *  - MiddlewareError   — pipeline failure
 *  - NetworkError      — retry-related fetch failures
 *  - PluginError       — plugin registration / execution failure  (v3)
 *  - RateLimitError    — rate limit exceeded                      (v3)
 *  - InferenceError    — schema inference failure                 (v3)
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
};
