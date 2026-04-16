/**
 * APIBridge AI v3 — Middleware Pipeline
 *
 * Composable before/after hooks for request and response processing.
 *
 * Middleware signature:
 *   (context, next) => { ... await next(); ... }
 *
 * Context shape:
 *   { data, direction, schema, path, meta }
 */

const { MiddlewareError } = require('../core/errors');

class MiddlewarePipeline {
  constructor() {
    /** @type {Array<{name: string, fn: Function, phase: string}>} */
    this._stack = [];
  }

  /**
   * Register middleware.
   * @param {string}   name   Human-readable name for debugging
   * @param {Function} fn     (context, next) => Promise<void>
   * @param {string}   phase  'before' | 'after' (default 'before')
   */
  use(name, fn, phase = 'before') {
    if (typeof fn !== 'function') {
      throw new MiddlewareError(`Middleware "${name}" must be a function`, name);
    }
    this._stack.push({ name, fn, phase });
    return this; // chainable
  }

  /**
   * Remove a named middleware.
   */
  remove(name) {
    this._stack = this._stack.filter(m => m.name !== name);
    return this;
  }

  /**
   * Execute all middleware for a given phase.
   */
  async run(phase, context) {
    const layers = this._stack.filter(m => m.phase === phase);
    let index = 0;

    const next = async () => {
      if (index >= layers.length) return;
      const layer = layers[index++];
      try {
        await layer.fn(context, next);
      } catch (err) {
        throw new MiddlewareError(
          `Middleware "${layer.name}" failed: ${err.message}`,
          layer.name,
          err,
        );
      }
    };

    await next();
    return context;
  }

  /**
   * List registered middleware names.
   */
  list() {
    return this._stack.map(m => ({ name: m.name, phase: m.phase }));
  }

  /**
   * Number of registered middleware.
   */
  size() {
    return this._stack.length;
  }
}

module.exports = { MiddlewarePipeline };
