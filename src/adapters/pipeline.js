/**
 * awsibnj v4 — Composable Pipeline
 *
 * Functional composition for data transformation pipelines.
 * Stages execute sequentially, each receiving the output of the previous.
 *
 * Features:
 *  - Named stages with optional conditions, timeouts, and retries
 *  - Three error strategies: throw, skip, fallback
 *  - Conditional branching and parallel execution
 *  - Side-effect taps for logging / debugging
 *  - Pipeline cloning and insertion helpers
 *  - Execution statistics tracking
 */

class ComposablePipeline {
  /**
   * @param {object}  options
   * @param {string}  options.name           Pipeline name (default 'default')
   * @param {string}  options.errorStrategy  'throw' | 'skip' | 'fallback' (default 'throw')
   * @param {*}       options.fallbackValue  Value used when errorStrategy is 'fallback' (default null)
   */
  constructor(options = {}) {
    this.name = options.name || 'default';
    this.errorStrategy = options.errorStrategy || 'throw';
    this.fallbackValue = options.fallbackValue !== undefined ? options.fallbackValue : null;

    /** @type {Array<{name: string, fn: Function, options: object}>} */
    this._stages = [];

    this._stats = {
      executions: 0,
      totalDuration: 0,
      errors: 0,
    };
  }

  /**
   * Add a named stage to the pipeline.
   * @param {string}   name           Human-readable stage name
   * @param {Function} fn             (data, context) => result
   * @param {object}   [options]
   * @param {Function} [options.condition]   (data) => boolean — skip stage when false
   * @param {number}   [options.timeout]     Max execution time in ms
   * @param {number}   [options.retry]       Number of retry attempts on failure
   * @param {number}   [options.retryDelay]  Delay between retries in ms
   * @returns {ComposablePipeline} this (for chaining)
   */
  pipe(name, fn, options = {}) {
    if (typeof fn !== 'function') {
      throw new Error(`Stage "${name}" must receive a function`);
    }
    this._stages.push({ name, fn, options });
    return this;
  }

  /**
   * Execute all stages sequentially.
   * @param {*}      data     Initial input data
   * @param {object} [context] Shared context passed to every stage
   * @returns {Promise<{result: *, stages: Array, duration: number, errors: Array}>}
   */
  async execute(data, context = {}) {
    const pipelineStart = Date.now();
    const stageResults = [];
    const errors = [];
    let current = data;

    for (const stage of this._stages) {
      const stageStart = Date.now();
      const record = { name: stage.name, duration: 0, skipped: false, error: null };

      // Evaluate condition
      if (typeof stage.options.condition === 'function') {
        if (!stage.options.condition(current)) {
          record.skipped = true;
          record.duration = Date.now() - stageStart;
          stageResults.push(record);
          continue;
        }
      }

      try {
        current = await this._executeStage(stage, current, context);
      } catch (err) {
        record.error = err.message;
        errors.push({ stage: stage.name, error: err.message });
        this._stats.errors++;

        if (this.errorStrategy === 'throw') {
          record.duration = Date.now() - stageStart;
          stageResults.push(record);
          throw err;
        }

        if (this.errorStrategy === 'fallback') {
          current = this.fallbackValue;
        }
        // 'skip' keeps current unchanged
      }

      record.duration = Date.now() - stageStart;
      stageResults.push(record);
    }

    const duration = Date.now() - pipelineStart;
    this._stats.executions++;
    this._stats.totalDuration += duration;

    return { result: current, stages: stageResults, duration, errors };
  }

  /**
   * Execute a single stage with optional timeout and retry.
   * @private
   */
  async _executeStage(stage, data, context) {
    const { timeout, retry = 0, retryDelay = 0 } = stage.options;
    let lastError;

    for (let attempt = 0; attempt <= retry; attempt++) {
      try {
        let result;
        if (timeout && timeout > 0) {
          result = await this._withTimeout(stage.fn(data, context), timeout, stage.name);
        } else {
          result = await stage.fn(data, context);
        }
        return result;
      } catch (err) {
        lastError = err;
        if (attempt < retry && retryDelay > 0) {
          await this._delay(retryDelay);
        }
      }
    }

    throw lastError;
  }

  /**
   * Race a promise against a timeout.
   * @private
   */
  _withTimeout(promise, ms, name) {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error(`Stage "${name}" timed out after ${ms}ms`));
      }, ms);

      Promise.resolve(promise).then(
        (val) => { clearTimeout(timer); resolve(val); },
        (err) => { clearTimeout(timer); reject(err); },
      );
    });
  }

  /**
   * Simple delay helper.
   * @private
   */
  _delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Remove a stage by name.
   * @param {string} name
   * @returns {ComposablePipeline} this
   */
  remove(name) {
    this._stages = this._stages.filter(s => s.name !== name);
    return this;
  }

  /**
   * Insert a stage before an existing stage.
   * @param {string}   existingName  Name of the stage to insert before
   * @param {string}   name          New stage name
   * @param {Function} fn            (data, context) => result
   * @param {object}   [options]     Stage options
   * @returns {ComposablePipeline} this
   */
  insertBefore(existingName, name, fn, options = {}) {
    const idx = this._stages.findIndex(s => s.name === existingName);
    if (idx === -1) {
      throw new Error(`Stage "${existingName}" not found`);
    }
    this._stages.splice(idx, 0, { name, fn, options });
    return this;
  }

  /**
   * Insert a stage after an existing stage.
   * @param {string}   existingName  Name of the stage to insert after
   * @param {string}   name          New stage name
   * @param {Function} fn            (data, context) => result
   * @param {object}   [options]     Stage options
   * @returns {ComposablePipeline} this
   */
  insertAfter(existingName, name, fn, options = {}) {
    const idx = this._stages.findIndex(s => s.name === existingName);
    if (idx === -1) {
      throw new Error(`Stage "${existingName}" not found`);
    }
    this._stages.splice(idx + 1, 0, { name, fn, options });
    return this;
  }

  /**
   * Replace an existing stage's function and options.
   * @param {string}   name       Stage to replace
   * @param {Function} fn         New function
   * @param {object}   [options]  New options (merged with existing)
   * @returns {ComposablePipeline} this
   */
  replace(name, fn, options = {}) {
    const stage = this._stages.find(s => s.name === name);
    if (!stage) {
      throw new Error(`Stage "${name}" not found`);
    }
    stage.fn = fn;
    stage.options = { ...stage.options, ...options };
    return this;
  }

  /**
   * Create a conditional branch function.
   * Returns a function suitable for pipe() that routes data through
   * pipelineA when condition is true, pipelineB otherwise.
   * @param {Function}           condition  (data) => boolean
   * @param {ComposablePipeline} pipelineA  Pipeline when true
   * @param {ComposablePipeline} pipelineB  Pipeline when false
   * @returns {Function} (data, context) => result
   */
  branch(condition, pipelineA, pipelineB) {
    return async (data, context) => {
      const target = condition(data) ? pipelineA : pipelineB;
      const { result } = await target.execute(data, context);
      return result;
    };
  }

  /**
   * Add a stage that executes multiple pipelines in parallel and merges results.
   * @param {string}                  name       Stage name
   * @param {Array<ComposablePipeline>} pipelines  Pipelines to run in parallel
   * @returns {ComposablePipeline} this
   */
  parallel(name, pipelines) {
    const fn = async (data, context) => {
      const results = await Promise.all(
        pipelines.map(p => p.execute(data, context)),
      );
      return results.reduce((merged, r) => Object.assign(merged, r.result), {});
    };
    this._stages.push({ name, fn, options: {} });
    return this;
  }

  /**
   * Add a side-effect stage that does not modify the data.
   * @param {string}   name  Stage name
   * @param {Function} fn    (data) => void
   * @returns {ComposablePipeline} this
   */
  tap(name, fn) {
    const wrapper = async (data, context) => {
      await fn(data, context);
      return data;
    };
    this._stages.push({ name, fn: wrapper, options: {} });
    return this;
  }

  /**
   * List stage names in order.
   * @returns {string[]}
   */
  list() {
    return this._stages.map(s => s.name);
  }

  /**
   * Number of stages.
   * @returns {number}
   */
  size() {
    return this._stages.length;
  }

  /**
   * Deep clone the pipeline (stages, options, and stats).
   * @returns {ComposablePipeline}
   */
  clone() {
    const copy = new ComposablePipeline({
      name: this.name,
      errorStrategy: this.errorStrategy,
      fallbackValue: this.fallbackValue,
    });
    copy._stages = this._stages.map(s => ({
      name: s.name,
      fn: s.fn,
      options: { ...s.options },
    }));
    copy._stats = { ...this._stats };
    return copy;
  }

  /**
   * Get execution statistics.
   * @returns {{executions: number, totalDuration: number, averageDuration: number, stageCount: number, errors: number}}
   */
  getStats() {
    return {
      executions: this._stats.executions,
      totalDuration: this._stats.totalDuration,
      averageDuration: this._stats.executions > 0
        ? Math.round(this._stats.totalDuration / this._stats.executions)
        : 0,
      stageCount: this._stages.length,
      errors: this._stats.errors,
    };
  }

  /**
   * Clear all stages and reset stats.
   */
  reset() {
    this._stages = [];
    this._stats = {
      executions: 0,
      totalDuration: 0,
      errors: 0,
    };
  }
}

module.exports = { ComposablePipeline };
