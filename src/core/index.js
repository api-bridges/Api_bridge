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
