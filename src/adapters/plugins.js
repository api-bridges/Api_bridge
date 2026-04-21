/**
 * yarou v3 — Plugin System
 *
 * Extensible architecture for registering, managing, and executing plugins.
 * Plugins can hook into transform, validate, normalize, and export pipelines.
 *
 * Plugin shape:
 *   {
 *     name: 'myPlugin',
 *     version: '1.0.0',
 *     hooks: {
 *       beforeTransform: (data, ctx) => data,
 *       afterTransform: (data, ctx) => data,
 *       beforeValidate: (data, schema) => data,
 *       afterValidate: (result) => result,
 *       onMismatch: (record) => {},
 *       onError: (error) => {},
 *     },
 *     init: (bridge) => {},
 *     destroy: () => {},
 *   }
 */

const { PluginError } = require('../core/errors');

const VALID_HOOKS = new Set([
  'beforeTransform',
  'afterTransform',
  'beforeValidate',
  'afterValidate',
  'onMismatch',
  'onError',
  'beforeRequest',
  'afterRequest',
]);

class PluginManager {
  constructor() {
    /** @type {Map<string, object>} */
    this._plugins = new Map();
    /** @type {Map<string, Array<Function>>} */
    this._hooks = new Map();

    for (const hook of VALID_HOOKS) {
      this._hooks.set(hook, []);
    }
  }

  /**
   * Register a plugin.
   * @param {object} plugin  Plugin object with name, hooks, etc.
   * @returns {PluginManager} for chaining
   */
  register(plugin) {
    if (!plugin || typeof plugin !== 'object') {
      throw new PluginError('Plugin must be an object', null);
    }
    if (!plugin.name || typeof plugin.name !== 'string') {
      throw new PluginError('Plugin must have a string "name"', null);
    }
    if (this._plugins.has(plugin.name)) {
      throw new PluginError(`Plugin "${plugin.name}" is already registered`, plugin.name);
    }

    // Register hooks
    if (plugin.hooks && typeof plugin.hooks === 'object') {
      for (const [hookName, fn] of Object.entries(plugin.hooks)) {
        if (!VALID_HOOKS.has(hookName)) {
          throw new PluginError(
            `Plugin "${plugin.name}" has invalid hook "${hookName}". Valid hooks: ${[...VALID_HOOKS].join(', ')}`,
            plugin.name,
          );
        }
        if (typeof fn !== 'function') {
          throw new PluginError(
            `Plugin "${plugin.name}" hook "${hookName}" must be a function`,
            plugin.name,
          );
        }
        this._hooks.get(hookName).push({ pluginName: plugin.name, fn });
      }
    }

    this._plugins.set(plugin.name, plugin);

    // Call init if provided
    if (typeof plugin.init === 'function') {
      try {
        plugin.init();
      } catch (err) {
        throw new PluginError(
          `Plugin "${plugin.name}" init failed: ${err.message}`,
          plugin.name,
          err,
        );
      }
    }

    return this;
  }

  /**
   * Unregister a plugin by name.
   */
  unregister(name) {
    const plugin = this._plugins.get(name);
    if (!plugin) return this;

    // Remove hooks
    for (const [, hooks] of this._hooks) {
      const idx = hooks.findIndex(h => h.pluginName === name);
      while (idx >= 0) {
        hooks.splice(idx, 1);
        const next = hooks.findIndex(h => h.pluginName === name);
        if (next < 0) break;
      }
    }

    // Remove stale entries
    for (const [hookName, hooks] of this._hooks) {
      this._hooks.set(hookName, hooks.filter(h => h.pluginName !== name));
    }

    // Call destroy if provided
    if (typeof plugin.destroy === 'function') {
      try { plugin.destroy(); } catch { /* ignore */ }
    }

    this._plugins.delete(name);
    return this;
  }

  /**
   * Execute all registered hooks for a given hook point.
   * Hooks are executed in registration order; each can modify and return data.
   * @param {string} hookName
   * @param {any}    data     Input data (passed through each hook)
   * @param {object} context  Additional context
   * @returns {any} The (possibly modified) data
   */
  async execute(hookName, data, context = {}) {
    if (!VALID_HOOKS.has(hookName)) return data;

    const hooks = this._hooks.get(hookName) || [];
    let result = data;

    for (const { pluginName, fn } of hooks) {
      try {
        const output = await fn(result, context);
        if (output !== undefined) result = output;
      } catch (err) {
        throw new PluginError(
          `Plugin "${pluginName}" hook "${hookName}" failed: ${err.message}`,
          pluginName,
          err,
        );
      }
    }

    return result;
  }

  /**
   * Synchronous version of execute for hot paths.
   */
  executeSync(hookName, data, context = {}) {
    if (!VALID_HOOKS.has(hookName)) return data;

    const hooks = this._hooks.get(hookName) || [];
    let result = data;

    for (const { pluginName, fn } of hooks) {
      try {
        const output = fn(result, context);
        if (output !== undefined) result = output;
      } catch (err) {
        throw new PluginError(
          `Plugin "${pluginName}" hook "${hookName}" failed: ${err.message}`,
          pluginName,
          err,
        );
      }
    }

    return result;
  }

  /**
   * Check if a plugin is registered.
   */
  has(name) {
    return this._plugins.has(name);
  }

  /**
   * List all registered plugin names.
   */
  list() {
    return [...this._plugins.keys()];
  }

  /**
   * Get a plugin by name.
   */
  get(name) {
    return this._plugins.get(name) || null;
  }

  /**
   * Number of registered plugins.
   */
  size() {
    return this._plugins.size;
  }
}

module.exports = { PluginManager, VALID_HOOKS };
