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

// v9/v10 modules
const {
  APIBridgeClient, ClientError, createClient, buildURL,
  all, spread, isClientError, isApiBridgeError, mergeConfig, defaultParamsSerializer,
  VERSION,
  // v12: Axios aliases
  Axios, AxiosError, isAxiosError,
} = require('./client');
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
const { CancelToken, Cancel, isCancel, isCancelToken } = require('./cancel');
const {
  toFormData, toURLEncodedForm, formToJSON,
  isFormData, isBlob, isFile, isBuffer, isStream, isArrayBufferView, isURLSearchParams,
  isTypedArray, isFileList,
} = require('./form-data');

// v11 new modules
const { AxiosHeaders, normalizeHeaderName } = require('./headers');
const { HttpStatusCode } = require('./http-status');
const { fetchAdapter, xhrAdapter, adapters, getAdapter } = require('./adapters');
const { isAbsoluteURL, combineURLs, isURLSameOrigin, parseURL, encode: uriEncode } = require('./url-utils');
const {
  kindOf, isPlainObject, isObject, isFunction, isString, isNumber, isBoolean, isUndefined,
  isDate, isRegExp, isHTMLForm, isArrayBuffer, isSpecCompliantForm,
  forEach, merge, extend, stripBOM, findKey, isBrowser, isNode, freezeDeep, generateUID,
  formToJSON: helpersFormToJSON,
} = require('./helpers');

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

  // v9/v10 classes
  APIBridgeClient,
  ClientError,
  InterceptorManager,
  InterceptorChain,

  // v10 cancellation
  CancelToken,
  Cancel,
  isCancel,
  isCancelToken,

  // v10/v11 FormData utilities
  toFormData,
  toURLEncodedForm,
  formToJSON,
  isFormData,
  isBlob,
  isFile,
  isBuffer,
  isStream,
  isArrayBufferView,
  isURLSearchParams,
  isTypedArray,
  isFileList,

  // v10 helpers
  all,
  spread,
  isClientError,
  isApiBridgeError,
  mergeConfig,
  defaultParamsSerializer,

  // v11: AxiosHeaders
  AxiosHeaders,
  normalizeHeaderName,

  // v11: HttpStatusCode
  HttpStatusCode,

  // v11: Adapter system
  fetchAdapter,
  xhrAdapter,
  adapters,
  getAdapter,

  // v11: URL utilities
  isAbsoluteURL,
  combineURLs,
  isURLSameOrigin,
  parseURL,
  uriEncode,

  // v11: Type helpers
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
  isHTMLForm,
  isArrayBuffer,
  isSpecCompliantForm,
  forEach,
  merge,
  extend,
  stripBOM,
  findKey,
  isBrowser,
  isNode,
  freezeDeep,
  generateUID,

  // v11: VERSION
  VERSION,

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

  // v12: Axios aliases
  Axios,
  AxiosError,
  isAxiosError,
};
