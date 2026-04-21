/**
 * yarou v8 — Conditional Transformation Rules
 *
 * Apply different transformation logic based on field values, context, or external conditions.
 * Enables dynamic field mapping where the same source field maps differently based on runtime state.
 *
 * Features:
 *  - Value-based conditions (if value is X, transform as Y)
 *  - Type-based conditions (if value is number, transform differently)
 *  - Context-aware transforms (based on sibling field values)
 *  - Chained conditions (if-else-if chains)
 *  - Default/fallback transforms
 *  - Condition groups (AND/OR logic)
 *  - Rule priority ordering
 *  - Statistics on which rules fire most often
 */

class ConditionalTransform {
  /**
   * @param {object} options
   * @param {boolean} options.trackStats    Track rule firing statistics (default true)
   * @param {boolean} options.throwOnNoMatch Whether to throw when no rule matches (default false)
   */
  constructor(options = {}) {
    this.trackStats = options.trackStats !== false;
    this.throwOnNoMatch = options.throwOnNoMatch || false;

    this._rules = [];
    this._defaults = new Map();
    this._stats = {
      totalEvaluations: 0,
      ruleHits: {},
      noMatchCount: 0,
    };
  }

  /**
   * Add a conditional transformation rule.
   *
   * @param {string}   name       Rule name (for tracking)
   * @param {Function} condition  Condition function: (value, field, context) => boolean
   * @param {Function} transform  Transform function: (value, field, context) => any
   * @param {object}   options
   * @param {number}   options.priority  Rule priority (higher evaluated first, default 0)
   * @param {string[]} options.fields    Restrict rule to these field names (optional)
   * @returns {ConditionalTransform} this (for chaining)
   */
  when(name, condition, transform, options = {}) {
    this._rules.push({
      name,
      condition,
      transform,
      priority: options.priority || 0,
      fields: options.fields || null,
    });

    // Keep sorted by priority (descending)
    this._rules.sort((a, b) => b.priority - a.priority);

    if (this.trackStats) {
      this._stats.ruleHits[name] = this._stats.ruleHits[name] || 0;
    }

    return this;
  }

  /**
   * Set a default transformation for a field when no rules match.
   *
   * @param {string}   field      Field name
   * @param {Function} transform  Transform function: (value) => any
   * @returns {ConditionalTransform} this
   */
  otherwise(field, transform) {
    this._defaults.set(field, transform);
    return this;
  }

  /**
   * Apply conditional transformation to a value.
   *
   * @param {any}    value    The value to transform
   * @param {string} field    The field name
   * @param {object} context  The full object being transformed (for context-aware rules)
   * @returns {{ value: any, rule: string|null, applied: boolean }}
   */
  apply(value, field, context = {}) {
    this._stats.totalEvaluations++;

    for (const rule of this._rules) {
      // Check field restriction
      if (rule.fields && !rule.fields.includes(field)) continue;

      try {
        if (rule.condition(value, field, context)) {
          const transformed = rule.transform(value, field, context);

          if (this.trackStats) {
            this._stats.ruleHits[rule.name]++;
          }

          return { value: transformed, rule: rule.name, applied: true };
        }
      } catch {
        // Skip rules that throw during evaluation
        continue;
      }
    }

    // Default transform
    if (this._defaults.has(field)) {
      const transformed = this._defaults.get(field)(value);
      return { value: transformed, rule: 'default', applied: true };
    }

    this._stats.noMatchCount++;

    if (this.throwOnNoMatch) {
      throw new Error(`No conditional transform rule matched for field "${field}"`);
    }

    return { value, rule: null, applied: false };
  }

  /**
   * Apply conditional transformations to all fields of an object.
   *
   * @param {object} data  The object to transform
   * @returns {{ data: object, applied: object[] }}
   */
  applyAll(data) {
    if (!data || typeof data !== 'object') {
      return { data, applied: [] };
    }

    const result = { ...data };
    const applied = [];

    for (const [field, value] of Object.entries(result)) {
      const { value: transformed, rule, applied: wasApplied } = this.apply(value, field, data);
      if (wasApplied) {
        result[field] = transformed;
        applied.push({ field, rule, original: value, transformed });
      }
    }

    return { data: result, applied };
  }

  /**
   * Remove a rule by name.
   */
  removeRule(name) {
    this._rules = this._rules.filter(r => r.name !== name);
    return this;
  }

  /**
   * Get the list of registered rules.
   */
  getRules() {
    return this._rules.map(r => ({
      name: r.name,
      priority: r.priority,
      fields: r.fields,
    }));
  }

  /**
   * Get statistics on rule usage.
   */
  getStats() {
    return {
      totalRules: this._rules.length,
      totalEvaluations: this._stats.totalEvaluations,
      noMatchCount: this._stats.noMatchCount,
      ruleHits: { ...this._stats.ruleHits },
      topRules: Object.entries(this._stats.ruleHits)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([name, count]) => ({ name, count })),
    };
  }

  /**
   * Clear all rules and stats.
   */
  clear() {
    this._rules = [];
    this._defaults.clear();
    this._stats = { totalEvaluations: 0, ruleHits: {}, noMatchCount: 0 };
  }
}

module.exports = { ConditionalTransform };
