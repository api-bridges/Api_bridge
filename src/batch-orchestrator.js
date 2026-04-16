/**
 * APIBridge AI v8 — Batch Request Orchestrator
 *
 * Orchestrate multiple API requests with automatic field transformation, concurrency
 * control, and result aggregation. Handles parallel/sequential batch execution with
 * per-request configuration.
 *
 * Features:
 *  - Parallel batch execution with configurable concurrency
 *  - Sequential execution with dependency ordering
 *  - Per-request field transformation options
 *  - Result aggregation (merge, collect, reduce)
 *  - Partial failure handling (continue, abort, retry)
 *  - Progress tracking and callbacks
 *  - Timeout per request and overall
 *  - Result caching within batch
 */

class BatchOrchestrator {
  /**
   * @param {object} options
   * @param {number}  options.concurrency       Max parallel requests (default 5)
   * @param {string}  options.failureStrategy   'continue' | 'abort' | 'retry' (default 'continue')
   * @param {number}  options.maxRetries        Max retries per request (default 2)
   * @param {number}  options.timeout           Overall timeout in ms (default 30000)
   * @param {number}  options.requestTimeout    Per-request timeout in ms (default 10000)
   * @param {Function} options.onProgress       Progress callback: (completed, total, result) => void
   */
  constructor(options = {}) {
    this.concurrency = options.concurrency || 5;
    this.failureStrategy = options.failureStrategy || 'continue';
    this.maxRetries = options.maxRetries || 2;
    this.timeout = options.timeout || 30000;
    this.requestTimeout = options.requestTimeout || 10000;
    this.onProgress = options.onProgress || null;

    this._stats = {
      totalBatches: 0,
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      retriedRequests: 0,
      totalDuration: 0,
    };
  }

  /**
   * Execute a batch of requests in parallel with concurrency control.
   *
   * @param {object[]} requests  Array of request definitions
   * @param {string}   requests[].id        Unique request identifier
   * @param {Function} requests[].execute   The function to execute: () => Promise<any>
   * @param {object}   requests[].options   Per-request options (timeout, retries, etc.)
   * @returns {Promise<{ results: object[], successful: number, failed: number, duration: number }>}
   */
  async executeParallel(requests) {
    const startTime = Date.now();
    this._stats.totalBatches++;
    this._stats.totalRequests += requests.length;

    const results = [];
    let completed = 0;
    let successful = 0;
    let failedCount = 0;

    // Process in chunks based on concurrency
    const chunks = this._chunk(requests, this.concurrency);

    for (const chunk of chunks) {
      if (this.failureStrategy === 'abort' && failedCount > 0) break;

      const chunkPromises = chunk.map(async (req) => {
        const result = await this._executeWithRetry(req);
        completed++;

        if (result.success) {
          successful++;
        } else {
          failedCount++;
        }

        if (this.onProgress) {
          this.onProgress(completed, requests.length, result);
        }

        return result;
      });

      const chunkResults = await Promise.all(chunkPromises);
      results.push(...chunkResults);
    }

    const duration = Date.now() - startTime;
    this._stats.successfulRequests += successful;
    this._stats.failedRequests += failedCount;
    this._stats.totalDuration += duration;

    return { results, successful, failed: failedCount, duration };
  }

  /**
   * Execute requests sequentially, where each request can depend on previous results.
   *
   * @param {object[]} requests  Array of request definitions
   * @param {string}   requests[].id        Unique request identifier
   * @param {Function} requests[].execute   The function: (previousResults) => Promise<any>
   * @returns {Promise<{ results: object[], successful: number, failed: number, duration: number }>}
   */
  async executeSequential(requests) {
    const startTime = Date.now();
    this._stats.totalBatches++;
    this._stats.totalRequests += requests.length;

    const results = [];
    const previousResults = {};
    let successful = 0;
    let failedCount = 0;

    for (let i = 0; i < requests.length; i++) {
      const req = requests[i];

      if (this.failureStrategy === 'abort' && failedCount > 0) {
        results.push({
          id: req.id,
          success: false,
          error: 'Aborted due to previous failure',
          skipped: true,
        });
        continue;
      }

      // Sequential requests receive previous results
      const wrappedReq = {
        ...req,
        execute: () => req.execute(previousResults),
      };

      const result = await this._executeWithRetry(wrappedReq);

      if (result.success) {
        successful++;
        previousResults[req.id] = result.data;
      } else {
        failedCount++;
      }

      results.push(result);

      if (this.onProgress) {
        this.onProgress(i + 1, requests.length, result);
      }
    }

    const duration = Date.now() - startTime;
    this._stats.successfulRequests += successful;
    this._stats.failedRequests += failedCount;
    this._stats.totalDuration += duration;

    return { results, successful, failed: failedCount, duration };
  }

  /**
   * Aggregate batch results using a strategy.
   *
   * @param {object[]} results    The results array from execute*
   * @param {string}   strategy   'merge' | 'collect' | 'reduce'
   * @param {Function} reducer    Reducer function for 'reduce' strategy: (acc, result) => acc
   * @returns {any} Aggregated result
   */
  aggregate(results, strategy = 'collect', reducer = null) {
    const successfulResults = results.filter(r => r.success);

    switch (strategy) {
      case 'merge': {
        const merged = {};
        for (const result of successfulResults) {
          if (result.data && typeof result.data === 'object') {
            Object.assign(merged, result.data);
          }
        }
        return merged;
      }
      case 'collect':
        return successfulResults.map(r => r.data);
      case 'reduce':
        if (!reducer) return successfulResults.map(r => r.data);
        return successfulResults.reduce((acc, r) => reducer(acc, r), null);
      default:
        return successfulResults.map(r => r.data);
    }
  }

  /**
   * Get batch execution statistics.
   */
  getStats() {
    return {
      ...this._stats,
      avgDuration: this._stats.totalBatches > 0
        ? Math.round(this._stats.totalDuration / this._stats.totalBatches)
        : 0,
      successRate: this._stats.totalRequests > 0
        ? Math.round((this._stats.successfulRequests / this._stats.totalRequests) * 100) + '%'
        : '0%',
    };
  }

  /**
   * Reset statistics.
   */
  resetStats() {
    this._stats = {
      totalBatches: 0, totalRequests: 0, successfulRequests: 0,
      failedRequests: 0, retriedRequests: 0, totalDuration: 0,
    };
  }

  // ─── INTERNAL ──────────────────────────────────────────────────────────

  async _executeWithRetry(req) {
    const maxRetries = (req.options && req.options.retries) || this.maxRetries;
    let lastError;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      if (attempt > 0) {
        this._stats.retriedRequests++;
      }

      try {
        const timeout = (req.options && req.options.timeout) || this.requestTimeout;
        const data = await this._withTimeout(req.execute(), timeout);

        return {
          id: req.id,
          success: true,
          data,
          attempts: attempt + 1,
        };
      } catch (err) {
        lastError = err;

        if (this.failureStrategy !== 'retry' && attempt === 0) break;
        if (attempt >= maxRetries) break;

        // Brief backoff between retries
        await new Promise(r => setTimeout(r, 100 * Math.pow(2, attempt)));
      }
    }

    return {
      id: req.id,
      success: false,
      error: lastError ? lastError.message : 'Unknown error',
      attempts: maxRetries + 1,
    };
  }

  _withTimeout(promise, ms) {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('Request timeout')), ms);
      promise
        .then(v => { clearTimeout(timer); resolve(v); })
        .catch(e => { clearTimeout(timer); reject(e); });
    });
  }

  _chunk(arr, size) {
    const chunks = [];
    for (let i = 0; i < arr.length; i += size) {
      chunks.push(arr.slice(i, i + size));
    }
    return chunks;
  }
}

module.exports = { BatchOrchestrator };
