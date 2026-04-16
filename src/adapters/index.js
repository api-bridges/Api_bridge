/**
 * APIBridge AI — Adapters Module
 *
 * Protocol bridges, middleware, resilience patterns, and orchestration.
 */

const { GraphQLBridge } = require('./graphql');
const { WebhookHandler } = require('./webhook');
const { OpenAPIImporter } = require('./openapi');
const { MockServer } = require('./mock-server');
const { ResponseStreamer } = require('./response-streamer');
const { MiddlewarePipeline } = require('./middleware');
const { ComposablePipeline } = require('./pipeline');
const { PluginManager } = require('./plugins');
const { RequestInterceptor } = require('./request-interceptor');
const { BatchOrchestrator } = require('./batch-orchestrator');
const { DependencyGraph } = require('./dependency-graph');
const { EventBus } = require('./event-bus');
const { APIVersionManager } = require('./versioning');
const { CircuitBreaker } = require('./circuit-breaker');
const { RetryStrategy } = require('./retry-strategy');
const { RateLimiter } = require('./rate-limiter');
const { HealthCheck } = require('./health-check');
const { SchemaRegistry } = require('./schema-registry');

module.exports = {
  GraphQLBridge,
  WebhookHandler,
  OpenAPIImporter,
  MockServer,
  ResponseStreamer,
  MiddlewarePipeline,
  ComposablePipeline,
  PluginManager,
  RequestInterceptor,
  BatchOrchestrator,
  DependencyGraph,
  EventBus,
  APIVersionManager,
  CircuitBreaker,
  RetryStrategy,
  RateLimiter,
  HealthCheck,
  SchemaRegistry,
};
