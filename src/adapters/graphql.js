/**
 * awsibnj v4 — GraphQL Bridge
 *
 * Transforms GraphQL responses and variable names between
 * naming conventions so your frontend and server always speak
 * the same language.
 *
 * Handles:
 *  - Deep field-name transformation in response `data`
 *  - Variable-name conversion (e.g. camelCase → snake_case for the server)
 *  - __typename stripping
 *  - Dot-notation data extraction
 *  - Error normalization
 */

// ─── CONVENTIONS ──────────────────────────────────────────────────────────────

const SUPPORTED_CONVENTIONS = new Set([
  'camelCase',
  'snake_case',
  'PascalCase',
  'kebab-case',
  'SCREAMING_SNAKE',
]);

// ─── GRAPHQL BRIDGE ───────────────────────────────────────────────────────────

class GraphQLBridge {
  /**
   * @param {object}  options
   * @param {string}  options.convention         Target naming convention (default 'camelCase')
   * @param {boolean} options.transformVariables  Transform query variable names (default true)
   * @param {boolean} options.transformFields     Transform response field names (default true)
   * @param {boolean} options.stripTypename       Remove __typename fields (default false)
   */
  constructor(options = {}) {
    const convention = options.convention || 'camelCase';
    if (!SUPPORTED_CONVENTIONS.has(convention)) {
      throw new Error(`Unsupported convention "${convention}". Expected one of: ${[...SUPPORTED_CONVENTIONS].join(', ')}`);
    }
    this.convention = convention;
    this.transformVariablesEnabled = options.transformVariables !== false;
    this.transformFieldsEnabled = options.transformFields !== false;
    this.stripTypename = options.stripTypename || false;

    this._stats = {
      responsesTransformed: 0,
      variablesTransformed: 0,
      errorsNormalized: 0,
    };
  }

  // ─── PUBLIC API ─────────────────────────────────────────────────────────────

  /**
   * Transform a full GraphQL response object.
   * Handles `data`, `errors`, and `extensions` fields.
   * Deep-transforms field names in `data` to the target convention.
   *
   * @param {object} graphqlResponse  Raw GraphQL response
   * @returns {object} Transformed response with same top-level shape
   */
  transformResponse(graphqlResponse) {
    if (graphqlResponse === null || graphqlResponse === undefined) {
      return graphqlResponse;
    }

    const result = {};

    if (graphqlResponse.data !== undefined) {
      result.data = this.transformFieldsEnabled
        ? this._transformKeys(graphqlResponse.data, this.convention)
        : graphqlResponse.data;
    }

    if (graphqlResponse.errors !== undefined) {
      result.errors = graphqlResponse.errors;
    }

    if (graphqlResponse.extensions !== undefined) {
      result.extensions = graphqlResponse.extensions;
    }

    this._stats.responsesTransformed++;
    return result;
  }

  /**
   * Transform variable names to a target convention.
   * Defaults to snake_case (typical server expectation).
   *
   * @param {object} variables            Variable map to transform
   * @param {string} [convention='snake_case'] Target convention for the keys
   * @returns {object} New object with transformed keys
   */
  transformVariables(variables, convention) {
    if (variables === null || variables === undefined) {
      return variables;
    }

    const target = convention || 'snake_case';
    const result = {};

    for (const [key, value] of Object.entries(variables)) {
      const tokens = this._tokenize(key);
      const newKey = this._toConvention(tokens, target);
      result[newKey] = value;
    }

    this._stats.variablesTransformed++;
    return result;
  }

  /**
   * Extract nested data from a response using dot-notation path.
   * e.g. extractData(response, 'user.posts') returns response.data.user.posts
   *
   * @param {object} response  GraphQL response (expects a `data` property)
   * @param {string} path      Dot-separated path into `data`
   * @returns {any} The value at the path, or undefined
   */
  extractData(response, path) {
    if (!response || response.data === undefined || response.data === null) {
      return undefined;
    }

    let current = response.data;
    const segments = path.split('.');

    for (const segment of segments) {
      if (current === null || current === undefined || typeof current !== 'object') {
        return undefined;
      }
      current = current[segment];
    }

    return current;
  }

  /**
   * Normalize a GraphQL error array to a standard format.
   *
   * @param {Array} errors  Raw errors array from a GraphQL response
   * @returns {Array<{ message: string, path: Array|null, code: string|null, locations: Array|null }>}
   */
  normalizeErrors(errors) {
    if (!Array.isArray(errors)) {
      return [];
    }

    const normalized = errors.map(err => ({
      message: err.message || 'Unknown error',
      path: err.path || null,
      code: (err.extensions && err.extensions.code) || err.code || null,
      locations: err.locations || null,
    }));

    this._stats.errorsNormalized++;
    return normalized;
  }

  /**
   * Build a query payload with transformed variable names.
   *
   * @param {string} query      GraphQL query string
   * @param {object} variables  Variable map
   * @returns {{ query: string, variables: object }}
   */
  buildQuery(query, variables) {
    const transformedVars = this.transformVariablesEnabled && variables
      ? this.transformVariables(variables)
      : variables || {};

    return { query, variables: transformedVars };
  }

  /**
   * Return cumulative stats for this bridge instance.
   *
   * @returns {{ responsesTransformed: number, variablesTransformed: number, errorsNormalized: number }}
   */
  getStats() {
    return { ...this._stats };
  }

  /**
   * Reset all stats to zero.
   */
  reset() {
    this._stats.responsesTransformed = 0;
    this._stats.variablesTransformed = 0;
    this._stats.errorsNormalized = 0;
  }

  // ─── HELPERS ────────────────────────────────────────────────────────────────

  /**
   * Recursively transform all keys in an object (or array of objects)
   * to the target naming convention.
   *
   * @param {any}    obj        Value to transform
   * @param {string} convention Target naming convention
   * @returns {any} Transformed value
   */
  _transformKeys(obj, convention) {
    if (obj === null || obj === undefined) return obj;

    if (Array.isArray(obj)) {
      return obj.map(item => this._transformKeys(item, convention));
    }

    if (typeof obj !== 'object' || obj instanceof Date) return obj;

    const result = {};

    for (const [key, value] of Object.entries(obj)) {
      // Optionally strip __typename
      if (this.stripTypename && key === '__typename') continue;

      const tokens = this._tokenize(key);
      const newKey = this._toConvention(tokens, convention);
      result[newKey] = this._transformKeys(value, convention);
    }

    return result;
  }

  /**
   * Break a key into lowercase word tokens.
   * Uses the same logic as transformer.js:
   *   "user_first_name" → ["user", "first", "name"]
   *   "UserFirstName"   → ["user", "first", "name"]
   *   "user-first-name" → ["user", "first", "name"]
   *   "userFirstName"   → ["user", "first", "name"]
   *
   * @param {string} key
   * @returns {string[]}
   */
  _tokenize(key) {
    return key
      .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
      .replace(/([a-z])([A-Z])/g, '$1_$2')
      .toLowerCase()
      .replace(/[-.\s]+/g, '_')
      .replace(/[^a-z0-9_]/g, '')
      .split('_')
      .filter(Boolean);
  }

  /**
   * Join tokens into the target naming convention.
   *
   * @param {string[]} tokens
   * @param {string}   convention
   * @returns {string}
   */
  _toConvention(tokens, convention) {
    if (tokens.length === 0) return '';

    switch (convention) {
      case 'camelCase':
        return tokens
          .map((t, i) => (i === 0 ? t : t[0].toUpperCase() + t.slice(1)))
          .join('');

      case 'snake_case':
        return tokens.join('_');

      case 'PascalCase':
        return tokens
          .map(t => t[0].toUpperCase() + t.slice(1))
          .join('');

      case 'kebab-case':
        return tokens.join('-');

      case 'SCREAMING_SNAKE':
        return tokens.map(t => t.toUpperCase()).join('_');

      default:
        return tokens.join('_');
    }
  }
}

module.exports = { GraphQLBridge };
