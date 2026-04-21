/**
 * awsibnj v3 — Metrics Collector
 *
 * Tracks performance and usage metrics for:
 *  - Transform operations (duration, field count)
 *  - Cache performance (hit rate, latency)
 *  - Request timing (latency, success rate)
 *  - Learning progress (accuracy over time)
 *  - Error rates by type
 *
 * Supports:
 *  - Rolling window statistics
 *  - Percentile calculations (p50, p95, p99)
 *  - Export as JSON
 *  - Periodic snapshots
 */

class MetricsCollector {
  /**
   * @param {object} options
   * @param {number} options.windowSize   Max data points per metric (default 1000)
   * @param {boolean} options.enabled     Enable metrics collection (default true)
   */
  constructor(options = {}) {
    this.windowSize = options.windowSize || 1000;
    this.enabled = options.enabled !== false;

    this._metrics = new Map();
    this._counters = new Map();
    this._startTime = Date.now();
  }

  /**
   * Record a timed measurement (e.g., transform duration).
   * @param {string} name    Metric name (e.g., 'transform.duration')
   * @param {number} value   Measured value
   * @param {object} tags    Optional tags { endpoint: '/users', method: 'GET' }
   */
  record(name, value, tags = {}) {
    if (!this.enabled) return;

    if (!this._metrics.has(name)) {
      this._metrics.set(name, []);
    }

    const dataPoints = this._metrics.get(name);
    dataPoints.push({
      value,
      timestamp: Date.now(),
      tags,
    });

    // Rolling window: trim oldest entries
    if (dataPoints.length > this.windowSize) {
      dataPoints.splice(0, dataPoints.length - this.windowSize);
    }
  }

  /**
   * Increment a counter.
   * @param {string} name  Counter name (e.g., 'requests.total')
   * @param {number} amount  Increment amount (default 1)
   */
  increment(name, amount = 1) {
    if (!this.enabled) return;
    this._counters.set(name, (this._counters.get(name) || 0) + amount);
  }

  /**
   * Get a counter value.
   */
  getCounter(name) {
    return this._counters.get(name) || 0;
  }

  /**
   * Measure execution time of a function.
   * @param {string}   name  Metric name
   * @param {Function} fn    Function to measure
   * @returns {any} The function's return value
   */
  async measure(name, fn) {
    if (!this.enabled) return fn();

    const start = performance.now();
    try {
      const result = await fn();
      this.record(name, performance.now() - start, { status: 'success' });
      return result;
    } catch (err) {
      this.record(name, performance.now() - start, { status: 'error' });
      throw err;
    }
  }

  /**
   * Synchronous version of measure.
   */
  measureSync(name, fn) {
    if (!this.enabled) return fn();

    const start = performance.now();
    try {
      const result = fn();
      this.record(name, performance.now() - start, { status: 'success' });
      return result;
    } catch (err) {
      this.record(name, performance.now() - start, { status: 'error' });
      throw err;
    }
  }

  /**
   * Get statistical summary for a metric.
   * @param {string} name  Metric name
   * @returns {object} { count, min, max, mean, p50, p95, p99, sum }
   */
  getSummary(name) {
    const dataPoints = this._metrics.get(name);
    if (!dataPoints || dataPoints.length === 0) {
      return { count: 0, min: 0, max: 0, mean: 0, p50: 0, p95: 0, p99: 0, sum: 0 };
    }

    const values = dataPoints.map(d => d.value).sort((a, b) => a - b);
    const count = values.length;
    const sum = values.reduce((a, b) => a + b, 0);

    return {
      count,
      min: values[0],
      max: values[count - 1],
      mean: Math.round((sum / count) * 100) / 100,
      p50: this._percentile(values, 50),
      p95: this._percentile(values, 95),
      p99: this._percentile(values, 99),
      sum: Math.round(sum * 100) / 100,
    };
  }

  /**
   * Get all metrics as a structured report.
   */
  getReport() {
    const report = {
      uptime: Date.now() - this._startTime,
      counters: Object.fromEntries(this._counters),
      metrics: {},
    };

    for (const [name] of this._metrics) {
      report.metrics[name] = this.getSummary(name);
    }

    return report;
  }

  /**
   * List all tracked metric names.
   */
  listMetrics() {
    return [...this._metrics.keys()];
  }

  /**
   * List all counter names.
   */
  listCounters() {
    return [...this._counters.keys()];
  }

  /**
   * Reset all metrics and counters.
   */
  reset() {
    this._metrics.clear();
    this._counters.clear();
    this._startTime = Date.now();
  }

  /**
   * Calculate a percentile from sorted values.
   */
  _percentile(sortedValues, p) {
    if (sortedValues.length === 0) return 0;
    const index = Math.ceil((p / 100) * sortedValues.length) - 1;
    return Math.round(sortedValues[Math.max(0, index)] * 100) / 100;
  }
}

module.exports = { MetricsCollector };
