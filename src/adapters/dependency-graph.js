/**
 * awsibnj v5 — API Dependency Graph
 *
 * Orchestrate dependent API calls with:
 *  - Directed acyclic graph (DAG) execution
 *  - Automatic topological sort
 *  - Parallel execution of independent nodes
 *  - Dependency data passing between nodes
 *  - Cycle detection
 *  - Conditional node execution
 *  - Execution statistics
 */

const { DependencyGraphError } = require('../core/errors');

class DependencyGraph {
  constructor() {
    /**
     * Map<nodeName, { fn: Function, deps: string[], options: object }>
     */
    this._nodes = new Map();

    this._stats = {
      totalExecutions: 0,
      totalNodeRuns: 0,
      lastDuration: 0,
      errors: 0,
    };
  }

  /**
   * Add a node to the dependency graph.
   *
   * @param {string}   name       Unique node name
   * @param {Function} fn         Async function: (results) => result. Receives resolved dependency results.
   * @param {object}   [options]
   * @param {Array<string>} [options.deps]        Names of nodes this node depends on
   * @param {Function}      [options.condition]    (results) => boolean — skip node when false
   * @param {number}        [options.timeout]      Max execution time in ms
   * @param {*}             [options.defaultValue] Value when node is skipped
   * @returns {DependencyGraph} this (for chaining)
   */
  add(name, fn, options = {}) {
    if (!name || typeof name !== 'string') {
      throw new DependencyGraphError('Node name must be a non-empty string', name, 'invalid_name');
    }
    if (typeof fn !== 'function') {
      throw new DependencyGraphError(`Node "${name}" must receive a function`, name, 'invalid_function');
    }

    this._nodes.set(name, {
      fn,
      deps: options.deps || [],
      condition: options.condition || null,
      timeout: options.timeout || 0,
      defaultValue: options.defaultValue !== undefined ? options.defaultValue : null,
    });

    return this;
  }

  /**
   * Remove a node from the graph.
   * @param {string} name
   * @returns {DependencyGraph} this
   */
  remove(name) {
    this._nodes.delete(name);
    // Remove from other nodes' deps
    for (const node of this._nodes.values()) {
      node.deps = node.deps.filter(d => d !== name);
    }
    return this;
  }

  /**
   * Execute all nodes in dependency order.
   * Independent nodes run in parallel.
   *
   * @param {object} [context]  Initial context passed to all nodes
   * @returns {Promise<object>} Map of node names to their results
   */
  async execute(context = {}) {
    const startTime = Date.now();
    this._stats.totalExecutions++;

    // Validate all deps exist
    for (const [name, node] of this._nodes) {
      for (const dep of node.deps) {
        if (!this._nodes.has(dep)) {
          throw new DependencyGraphError(
            `Node "${name}" depends on unknown node "${dep}"`,
            name,
            'missing_dependency',
          );
        }
      }
    }

    // Check for cycles
    this._detectCycles();

    // Topological execution
    const results = {};
    const completed = new Set();
    const nodeNames = new Set(this._nodes.keys());

    while (completed.size < nodeNames.size) {
      // Find all nodes whose deps are satisfied
      const ready = [];
      for (const [name, node] of this._nodes) {
        if (completed.has(name)) continue;
        if (node.deps.every(d => completed.has(d))) {
          ready.push(name);
        }
      }

      if (ready.length === 0) {
        throw new DependencyGraphError(
          'Deadlock detected: no nodes are ready to execute',
          null,
          'deadlock',
        );
      }

      // Execute ready nodes in parallel
      const promises = ready.map(async (name) => {
        const node = this._nodes.get(name);

        // Collect dependency results
        const depResults = {};
        for (const dep of node.deps) {
          depResults[dep] = results[dep];
        }

        // Check condition
        if (typeof node.condition === 'function') {
          if (!node.condition({ ...results, ...context })) {
            results[name] = node.defaultValue;
            completed.add(name);
            return;
          }
        }

        try {
          let result;
          if (node.timeout > 0) {
            result = await this._withTimeout(
              node.fn({ ...depResults, ...context }),
              node.timeout,
              name,
            );
          } else {
            result = await node.fn({ ...depResults, ...context });
          }
          results[name] = result;
          this._stats.totalNodeRuns++;
        } catch (error) {
          this._stats.errors++;
          throw new DependencyGraphError(
            `Node "${name}" failed: ${error.message}`,
            name,
            'execution_error',
          );
        }

        completed.add(name);
      });

      await Promise.all(promises);
    }

    this._stats.lastDuration = Date.now() - startTime;
    return results;
  }

  /**
   * Get the topological order of nodes.
   * @returns {string[]} Ordered node names
   */
  getOrder() {
    this._detectCycles();

    const order = [];
    const visited = new Set();

    const visit = (name) => {
      if (visited.has(name)) return;
      visited.add(name);
      const node = this._nodes.get(name);
      if (node) {
        for (const dep of node.deps) {
          visit(dep);
        }
      }
      order.push(name);
    };

    for (const name of this._nodes.keys()) {
      visit(name);
    }

    return order;
  }

  /**
   * Validate the graph (check for cycles and missing deps).
   * @returns {{ valid: boolean, errors: string[] }}
   */
  validate() {
    const errors = [];

    // Check missing deps
    for (const [name, node] of this._nodes) {
      for (const dep of node.deps) {
        if (!this._nodes.has(dep)) {
          errors.push(`Node "${name}" depends on unknown node "${dep}"`);
        }
      }
    }

    // Check cycles
    try {
      this._detectCycles();
    } catch (e) {
      errors.push(e.message);
    }

    return { valid: errors.length === 0, errors };
  }

  /**
   * List all nodes with their dependencies.
   * @returns {Array<{ name: string, deps: string[], hasCondition: boolean }>}
   */
  list() {
    const result = [];
    for (const [name, node] of this._nodes) {
      result.push({
        name,
        deps: [...node.deps],
        hasCondition: typeof node.condition === 'function',
      });
    }
    return result;
  }

  /**
   * Get the number of nodes.
   * @returns {number}
   */
  size() {
    return this._nodes.size;
  }

  /**
   * Check if a node exists.
   * @param {string} name
   * @returns {boolean}
   */
  has(name) {
    return this._nodes.has(name);
  }

  /**
   * Get execution statistics.
   * @returns {object}
   */
  getStats() {
    return { ...this._stats };
  }

  /**
   * Clear all nodes and reset statistics.
   */
  reset() {
    this._nodes.clear();
    this._stats = {
      totalExecutions: 0,
      totalNodeRuns: 0,
      lastDuration: 0,
      errors: 0,
    };
  }

  // ─── INTERNAL ─────────────────────────────────────────────────────

  /**
   * Detect cycles using DFS.
   * @throws {DependencyGraphError} if a cycle is found
   */
  _detectCycles() {
    const WHITE = 0, GRAY = 1, BLACK = 2;
    const colors = new Map();

    for (const name of this._nodes.keys()) {
      colors.set(name, WHITE);
    }

    const dfs = (name) => {
      colors.set(name, GRAY);
      const node = this._nodes.get(name);
      if (node) {
        for (const dep of node.deps) {
          if (colors.get(dep) === GRAY) {
            throw new DependencyGraphError(
              `Cycle detected: "${name}" → "${dep}"`,
              name,
              'cycle_detected',
            );
          }
          if (colors.get(dep) === WHITE) {
            dfs(dep);
          }
        }
      }
      colors.set(name, BLACK);
    };

    for (const name of this._nodes.keys()) {
      if (colors.get(name) === WHITE) {
        dfs(name);
      }
    }
  }

  /**
   * Race a promise against a timeout.
   * @param {Promise} promise
   * @param {number} ms
   * @param {string} name
   * @returns {Promise<*>}
   */
  _withTimeout(promise, ms, name) {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error(`Node "${name}" timed out after ${ms}ms`));
      }, ms);
      Promise.resolve(promise).then(
        (val) => { clearTimeout(timer); resolve(val); },
        (err) => { clearTimeout(timer); reject(err); },
      );
    });
  }
}

module.exports = { DependencyGraph };
