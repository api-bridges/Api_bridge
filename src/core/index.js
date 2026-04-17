/**
 * APIBridge AI — Core Module
 *
 * Core transformation engine, matching algorithms, validation, and error classes.
 */

const { APIBridgeTransformer } = require('./transformer');
const { LearningEngine } = require('./learning');
const { ResponseNormalizer } = require('./normalizer');
const { SchemaValidator } = require('./validator');
const { SchemaInference } = require('./inference');
const { FuzzyMatcher, expandTokens, ABBREVIATION_MAP, ngramSimilarity } = require('./fuzzy-matcher');
const { CrypticResolver } = require('./cryptic-resolver');
const { TypeCoercer } = require('./type-coercer');
const { FieldAliaser } = require('./field-aliaser');
const { ConditionalTransform } = require('./conditional-transform');
const { SchemaMigrator } = require('./schema-migrator');
const { WORD_TO_GROUP, SYNONYM_GROUPS } = require('./synonyms');
const errors = require('./errors');

// v9 modules
const { APIBridgeClient, ClientError, createClient, buildURL } = require('./client');
const { InterceptorManager, InterceptorChain } = require('./interceptors');
const {
  validateExpect,
  serializeExpect,
  deserializeExpect,
  extractExpect,
  injectExpectHeader,
  flattenExpect,
  HEADER_NAME,
} = require('./expectation');
const { smartProxy, tokenize: proxyTokenize, generateCandidates } = require('./proxy');

module.exports = {
  // Classes
  APIBridgeTransformer,
  LearningEngine,
  ResponseNormalizer,
  SchemaValidator,
  SchemaInference,
  FuzzyMatcher,
  CrypticResolver,
  TypeCoercer,
  FieldAliaser,
  ConditionalTransform,
  SchemaMigrator,

  // v9 classes
  APIBridgeClient,
  ClientError,
  InterceptorManager,
  InterceptorChain,

  // v9 factory
  createClient,

  // v9 expectation helpers
  validateExpect,
  serializeExpect,
  deserializeExpect,
  extractExpect,
  injectExpectHeader,
  flattenExpect,
  HEADER_NAME,

  // v9 proxy
  smartProxy,
  generateCandidates,

  // v9 URL builder
  buildURL,

  // Matching helpers
  expandTokens,
  ABBREVIATION_MAP,
  ngramSimilarity,

  // Synonym data
  WORD_TO_GROUP,
  SYNONYM_GROUPS,

  // Error classes
  ...errors,
};
