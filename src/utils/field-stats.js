/**
 * nopes v8 — Field Analytics Collector
 *
 * Track field usage patterns, transformation accuracy, and resolution performance.
 * Helps optimize schema definitions and identify poorly-matched fields.
 *
 * Features:
 *  - Per-field usage frequency tracking
 *  - Match method distribution (which level resolves each field)
 *  - Confidence score histograms
 *  - Transformation timing metrics
 *  - Top mismatched fields report
 *  - Field coverage analysis (what % of fields are auto-resolved)
 *  - Time-series tracking (field usage over time)
 *  - Export analytics as JSON
 */

class FieldStats {
  /**
   * @param {object} options
   * @param {boolean} options.trackTiming    Track per-field transformation timing (default true)
   * @param {boolean} options.trackTimeSeries Track usage over time windows (default false)
   * @param {number}  options.maxFields      Maximum fields to track (default 10000)
   * @param {number}  options.timeWindowMs   Time window for time-series in ms (default 60000)
   */
  constructor(options = {}) {
    this.trackTiming = options.trackTiming !== false;
    this.trackTimeSeries = options.trackTimeSeries || false;
    this.maxFields = options.maxFields || 10000;
    this.timeWindowMs = options.timeWindowMs || 60000;

    // fieldName → { count, methods: {}, totalConfidence, minConfidence, maxConfidence, avgTime, ... }
    this._fields = new Map();
    this._globalStats = {
      totalTransformations: 0,
      totalFields: 0,
      byMethod: {},
      confidenceBuckets: { high: 0, medium: 0, low: 0 },
    };
    this._timeSeries = [];
  }

  /**
   * Record a field transformation event.
   *
   * @param {string} fieldName   The original field name
   * @param {object} details     Transformation details
   * @param {string} details.targetKey    The resolved field name
   * @param {number} details.confidence   Match confidence (0-1)
   * @param {string} details.method       Resolution method used
   * @param {number} details.duration     Transformation time in ms (optional)
   */
  record(fieldName, details = {}) {
    this._globalStats.totalTransformations++;

    const key = fieldName.toLowerCase();

    if (!this._fields.has(key) && this._fields.size >= this.maxFields) {
      return; // Don't track beyond limit
    }

    if (!this._fields.has(key)) {
      this._fields.set(key, {
        originalName: fieldName,
        count: 0,
        methods: {},
        totalConfidence: 0,
        minConfidence: 1.0,
        maxConfidence: 0,
        targetKeys: {},
        totalTime: 0,
        timings: [],
      });
      this._globalStats.totalFields++;
    }

    const stats = this._fields.get(key);
    stats.count++;

    // Track methods
    const method = details.method || 'unknown';
    stats.methods[method] = (stats.methods[method] || 0) + 1;
    this._globalStats.byMethod[method] = (this._globalStats.byMethod[method] || 0) + 1;

    // Track confidence
    const confidence = details.confidence || 0;
    stats.totalConfidence += confidence;
    stats.minConfidence = Math.min(stats.minConfidence, confidence);
    stats.maxConfidence = Math.max(stats.maxConfidence, confidence);

    // Confidence buckets
    if (confidence >= 0.85) {
      this._globalStats.confidenceBuckets.high++;
    } else if (confidence >= 0.60) {
      this._globalStats.confidenceBuckets.medium++;
    } else {
      this._globalStats.confidenceBuckets.low++;
    }

    // Track target keys
    if (details.targetKey) {
      stats.targetKeys[details.targetKey] = (stats.targetKeys[details.targetKey] || 0) + 1;
    }

    // Track timing
    if (this.trackTiming && details.duration !== undefined) {
      stats.totalTime += details.duration;
      stats.timings.push(details.duration);
      if (stats.timings.length > 100) {
        stats.timings = stats.timings.slice(-100); // Keep last 100
      }
    }

    // Time series
    if (this.trackTimeSeries) {
      this._timeSeries.push({
        field: fieldName,
        confidence,
        method,
        timestamp: Date.now(),
      });
      // Prune old entries
      const cutoff = Date.now() - this.timeWindowMs * 10;
      this._timeSeries = this._timeSeries.filter(e => e.timestamp > cutoff);
    }
  }

  /**
   * Get stats for a specific field.
   *
   * @param {string} fieldName
   * @returns {object|null}
   */
  getFieldStats(fieldName) {
    const stats = this._fields.get(fieldName.toLowerCase());
    if (!stats) return null;

    return {
      originalName: stats.originalName,
      count: stats.count,
      methods: { ...stats.methods },
      avgConfidence: stats.count > 0 ? Math.round((stats.totalConfidence / stats.count) * 100) / 100 : 0,
      minConfidence: stats.minConfidence,
      maxConfidence: stats.maxConfidence,
      targetKeys: { ...stats.targetKeys },
      avgTime: stats.count > 0 && stats.totalTime > 0
        ? Math.round(stats.totalTime / stats.count * 100) / 100
        : 0,
    };
  }

  /**
   * Get the top N most frequently transformed fields.
   *
   * @param {number} n  Number of fields to return (default 10)
   * @returns {object[]}
   */
  getTopFields(n = 10) {
    return [...this._fields.values()]
      .sort((a, b) => b.count - a.count)
      .slice(0, n)
      .map(f => ({
        field: f.originalName,
        count: f.count,
        primaryMethod: this._primaryMethod(f.methods),
        avgConfidence: f.count > 0 ? Math.round((f.totalConfidence / f.count) * 100) / 100 : 0,
      }));
  }

  /**
   * Get fields with consistently low confidence scores (candidates for schema definition).
   *
   * @param {number} threshold  Confidence threshold (default 0.75)
   * @returns {object[]}
   */
  getLowConfidenceFields(threshold = 0.75) {
    return [...this._fields.values()]
      .filter(f => f.count > 0 && (f.totalConfidence / f.count) < threshold)
      .sort((a, b) => (a.totalConfidence / a.count) - (b.totalConfidence / b.count))
      .map(f => ({
        field: f.originalName,
        count: f.count,
        avgConfidence: Math.round((f.totalConfidence / f.count) * 100) / 100,
        primaryMethod: this._primaryMethod(f.methods),
        suggestedAction: (f.totalConfidence / f.count) < 0.5 ? 'add_to_schema' : 'add_synonym',
      }));
  }

  /**
   * Get field coverage report.
   *
   * @returns {object}
   */
  getCoverageReport() {
    const total = this._globalStats.totalTransformations;
    const { high, medium, low } = this._globalStats.confidenceBuckets;

    return {
      totalTransformations: total,
      uniqueFields: this._globalStats.totalFields,
      confidenceDistribution: {
        high: { count: high, percentage: total > 0 ? Math.round((high / total) * 100) + '%' : '0%' },
        medium: { count: medium, percentage: total > 0 ? Math.round((medium / total) * 100) + '%' : '0%' },
        low: { count: low, percentage: total > 0 ? Math.round((low / total) * 100) + '%' : '0%' },
      },
      methodDistribution: { ...this._globalStats.byMethod },
      autoResolvedRate: total > 0
        ? Math.round(((high + medium) / total) * 100) + '%'
        : '0%',
    };
  }

  /**
   * Export all analytics as JSON.
   */
  export() {
    return {
      global: { ...this._globalStats },
      fields: this.getTopFields(this._fields.size),
      lowConfidence: this.getLowConfidenceFields(),
      coverage: this.getCoverageReport(),
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Clear all collected statistics.
   */
  clear() {
    this._fields.clear();
    this._globalStats = {
      totalTransformations: 0,
      totalFields: 0,
      byMethod: {},
      confidenceBuckets: { high: 0, medium: 0, low: 0 },
    };
    this._timeSeries = [];
  }

  // ─── INTERNAL ──────────────────────────────────────────────────────────

  _primaryMethod(methods) {
    let maxCount = 0;
    let primary = 'unknown';
    for (const [method, count] of Object.entries(methods)) {
      if (count > maxCount) {
        maxCount = count;
        primary = method;
      }
    }
    return primary;
  }
}

module.exports = { FieldStats };
