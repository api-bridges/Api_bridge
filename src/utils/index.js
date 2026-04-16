/**
 * APIBridge AI — Utils Module
 *
 * Caching, deduplication, diffing, export, masking, metrics, and more.
 */

const { ResponseCache } = require('./cache');
const { RequestDeduplicator } = require('./dedup');
const { SchemaDiff } = require('./diff');
const { exportMismatchCSV, exportMismatchJSON, exportSchemaSuggestions } = require('./exporter');
const { DataMasker } = require('./masking');
const { MetricsCollector } = require('./metrics');
const { JSONPatchGenerator } = require('./patch');
const { TypeGenerator } = require('./typegen');
const { DeepMerge } = require('./deep-merge');
const { OutputFormatter } = require('./output-formatter');
const { FieldStats } = require('./field-stats');
const { FieldProjection } = require('./projection');
const { RequestLogger } = require('./request-logger');

module.exports = {
  ResponseCache,
  RequestDeduplicator,
  SchemaDiff,
  exportMismatchCSV,
  exportMismatchJSON,
  exportSchemaSuggestions,
  DataMasker,
  MetricsCollector,
  JSONPatchGenerator,
  TypeGenerator,
  DeepMerge,
  OutputFormatter,
  FieldStats,
  FieldProjection,
  RequestLogger,
};
