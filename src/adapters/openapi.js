/**
 * APIBridge AI v4 — OpenAPI Schema Importer
 *
 * Parses OpenAPI (v3) and Swagger (v2) specification objects and extracts
 * field schemas compatible with the APIBridge ecosystem.
 *
 * Handles:
 *  - Endpoint discovery from paths
 *  - Named schema / definition extraction
 *  - $ref resolution
 *  - Type mapping (string, integer, number, boolean, array, object, date, email)
 *  - Naming convention conversion for imported field names
 */

// ─── CONVENTIONS ──────────────────────────────────────────────────────────────

const SUPPORTED_CONVENTIONS = new Set([
  'camelCase',
  'snake_case',
  'PascalCase',
  'kebab-case',
  'SCREAMING_SNAKE',
]);

// ─── TYPE MAP ─────────────────────────────────────────────────────────────────

const TYPE_MAP = {
  string:  'string',
  integer: 'integer',
  number:  'number',
  boolean: 'boolean',
  array:   'array',
  object:  'object',
};

// ─── OPENAPI IMPORTER ─────────────────────────────────────────────────────────

class OpenAPIImporter {
  /**
   * @param {object}  options
   * @param {string}  options.convention          Target naming convention (default 'camelCase')
   * @param {boolean} options.includeDescriptions Include field descriptions (default true)
   * @param {boolean} options.strict              Strict mode — all fields required (default false)
   */
  constructor(options = {}) {
    const convention = options.convention || 'camelCase';
    if (!SUPPORTED_CONVENTIONS.has(convention)) {
      throw new Error(
        `Unsupported convention "${convention}". Expected one of: ${[...SUPPORTED_CONVENTIONS].join(', ')}`
      );
    }
    this.convention = convention;
    this.includeDescriptions = options.includeDescriptions !== false;
    this.strict = options.strict || false;

    this._stats = {
      schemasImported: 0,
      endpointsFound: 0,
      refsResolved: 0,
    };
  }

  // ─── PUBLIC API ─────────────────────────────────────────────────────────────

  /**
   * Parse an OpenAPI spec object (v2 Swagger or v3 OpenAPI).
   * Returns an array of endpoint schema objects.
   *
   * @param {object} spec  Parsed OpenAPI / Swagger specification object
   * @returns {Array<{ path: string, method: string, requestSchema: object|null, responseSchema: object|null }>}
   */
  import(spec) {
    if (!spec || typeof spec !== 'object') {
      return [];
    }

    const endpoints = [];
    const paths = spec.paths || {};

    for (const [path, pathItem] of Object.entries(paths)) {
      for (const [method, operation] of Object.entries(pathItem)) {
        if (method.startsWith('x-') || typeof operation !== 'object') continue;

        const requestSchema = this._extractRequestSchema(operation, spec);
        const responseSchema = this._extractResponseSchema(operation, spec);

        endpoints.push({
          path,
          method: method.toUpperCase(),
          requestSchema,
          responseSchema,
        });

        this._stats.endpointsFound++;
      }
    }

    return endpoints;
  }

  /**
   * Extract all named schemas / definitions from the spec.
   * Returns a map of schema names to APIBridge-compatible schemas.
   *
   * @param {object} spec  Parsed OpenAPI / Swagger specification object
   * @returns {{ [name: string]: object }}
   */
  extractSchemas(spec) {
    if (!spec || typeof spec !== 'object') {
      return {};
    }

    // v3: components.schemas, v2: definitions
    const raw = (spec.components && spec.components.schemas) || spec.definitions || {};
    const result = {};

    for (const [name, schema] of Object.entries(raw)) {
      result[name] = this.convertSchema(schema, spec);
      this._stats.schemasImported++;
    }

    return result;
  }

  /**
   * Resolve a $ref string to the actual schema object within the spec.
   *
   * Supports JSON Pointer references such as:
   *   '#/definitions/User'            (Swagger v2)
   *   '#/components/schemas/User'     (OpenAPI v3)
   *
   * @param {string} ref   $ref string
   * @param {object} spec  The root specification object
   * @returns {object|null} The resolved schema object, or null if unresolvable
   */
  resolveRef(ref, spec) {
    if (!ref || typeof ref !== 'string' || !spec) {
      return null;
    }

    const path = ref.replace(/^#\//, '').split('/');
    let current = spec;

    for (const segment of path) {
      if (current === null || current === undefined || typeof current !== 'object') {
        return null;
      }
      current = current[segment];
    }

    this._stats.refsResolved++;
    return current !== undefined ? current : null;
  }

  /**
   * Convert a single OpenAPI schema object to APIBridge format.
   *
   * Handles: type, required, properties, items (arrays), $ref, enum,
   * description, default, format.
   *
   * @param {object} openApiSchema  An OpenAPI schema object
   * @param {object} spec           The root specification (for $ref resolution)
   * @returns {object} APIBridge-compatible schema: { [field]: { type, required, description, ... } }
   */
  convertSchema(openApiSchema, spec) {
    if (!openApiSchema || typeof openApiSchema !== 'object') {
      return {};
    }

    // Resolve top-level $ref
    let schema = openApiSchema;
    if (schema.$ref) {
      schema = this.resolveRef(schema.$ref, spec) || {};
    }

    // For non-object schemas (e.g. a bare array or primitive at the top level)
    if (schema.type && schema.type !== 'object' && !schema.properties) {
      return this._convertField('value', schema, [], spec);
    }

    const properties = schema.properties || {};
    const requiredFields = new Set(schema.required || []);
    const result = {};

    for (const [field, fieldSchema] of Object.entries(properties)) {
      const convertedKey = this._convertKey(field);
      const isRequired = this.strict || requiredFields.has(field);
      result[convertedKey] = this._convertField(field, fieldSchema, requiredFields, spec);
      result[convertedKey].required = isRequired;
    }

    return result;
  }

  /**
   * List all endpoints found in the spec.
   *
   * @param {object} spec  Parsed OpenAPI / Swagger specification object
   * @returns {Array<{ path: string, method: string, operationId: string|null, summary: string|null }>}
   */
  getEndpoints(spec) {
    if (!spec || typeof spec !== 'object') {
      return [];
    }

    const endpoints = [];
    const paths = spec.paths || {};

    for (const [path, pathItem] of Object.entries(paths)) {
      for (const [method, operation] of Object.entries(pathItem)) {
        if (method.startsWith('x-') || typeof operation !== 'object') continue;

        endpoints.push({
          path,
          method: method.toUpperCase(),
          operationId: operation.operationId || null,
          summary: operation.summary || null,
        });
      }
    }

    return endpoints;
  }

  /**
   * Return cumulative stats for this importer instance.
   *
   * @returns {{ schemasImported: number, endpointsFound: number, refsResolved: number }}
   */
  getStats() {
    return { ...this._stats };
  }

  /**
   * Reset all stats to zero.
   */
  reset() {
    this._stats.schemasImported = 0;
    this._stats.endpointsFound = 0;
    this._stats.refsResolved = 0;
  }

  // ─── HELPERS ────────────────────────────────────────────────────────────────

  /**
   * Convert a single field schema to APIBridge field descriptor.
   *
   * @param {string} field          Original field name
   * @param {object} fieldSchema    OpenAPI field schema
   * @param {Set|Array} requiredFields  Set or array of required field names
   * @param {object} spec           Root spec for $ref resolution
   * @returns {object} APIBridge field descriptor
   */
  _convertField(field, fieldSchema, requiredFields, spec) {
    let schema = fieldSchema;

    // Resolve $ref
    if (schema && schema.$ref) {
      schema = this.resolveRef(schema.$ref, spec) || {};
    }

    const reqSet = requiredFields instanceof Set ? requiredFields : new Set(requiredFields || []);
    const descriptor = {};

    // Type mapping
    descriptor.type = this._mapType(schema);

    // Required
    descriptor.required = this.strict || reqSet.has(field);

    // Description
    if (this.includeDescriptions && schema.description) {
      descriptor.description = schema.description;
    }

    // Default value
    if (schema.default !== undefined) {
      descriptor.default = schema.default;
    }

    // Enum values
    if (Array.isArray(schema.enum)) {
      descriptor.enum = schema.enum;
    }

    // Format / pattern
    if (schema.format === 'email') {
      descriptor.pattern = 'email';
    }

    // Array items
    if (schema.type === 'array' && schema.items) {
      let itemSchema = schema.items;
      if (itemSchema.$ref) {
        itemSchema = this.resolveRef(itemSchema.$ref, spec) || {};
      }
      descriptor.items = this._mapType(itemSchema);
    }

    return descriptor;
  }

  /**
   * Map an OpenAPI type + format to an APIBridge type string.
   *
   * @param {object} schema  OpenAPI schema with `type` and optional `format`
   * @returns {string} APIBridge type
   */
  _mapType(schema) {
    if (!schema || !schema.type) return 'object';

    // Special format handling
    if (schema.type === 'string' && schema.format === 'date-time') {
      return 'date';
    }

    return TYPE_MAP[schema.type] || 'string';
  }

  /**
   * Extract the request body schema from an operation.
   * Supports v3 requestBody and v2 body parameters.
   *
   * @param {object} operation  OpenAPI operation object
   * @param {object} spec       Root spec for $ref resolution
   * @returns {object|null} Converted APIBridge schema or null
   */
  _extractRequestSchema(operation, spec) {
    // OpenAPI v3: requestBody.content.application/json.schema
    if (operation.requestBody) {
      const content = operation.requestBody.content;
      if (content) {
        const json = content['application/json'];
        if (json && json.schema) {
          return this.convertSchema(json.schema, spec);
        }
      }
    }

    // Swagger v2: parameters with in === 'body'
    if (Array.isArray(operation.parameters)) {
      for (const param of operation.parameters) {
        if (param.in === 'body' && param.schema) {
          return this.convertSchema(param.schema, spec);
        }
      }
    }

    return null;
  }

  /**
   * Extract the success response schema from an operation.
   * Looks for 200 or 201 responses.
   *
   * @param {object} operation  OpenAPI operation object
   * @param {object} spec       Root spec for $ref resolution
   * @returns {object|null} Converted APIBridge schema or null
   */
  _extractResponseSchema(operation, spec) {
    const responses = operation.responses;
    if (!responses || typeof responses !== 'object') return null;

    const successResponse = responses['200'] || responses['201'] || responses[200] || responses[201];
    if (!successResponse) return null;

    // OpenAPI v3: content.application/json.schema
    if (successResponse.content) {
      const json = successResponse.content['application/json'];
      if (json && json.schema) {
        return this.convertSchema(json.schema, spec);
      }
    }

    // Swagger v2: schema directly on the response
    if (successResponse.schema) {
      return this.convertSchema(successResponse.schema, spec);
    }

    return null;
  }

  /**
   * Convert a field name to the target naming convention.
   *
   * @param {string} key  Original field name
   * @returns {string} Converted field name
   */
  _convertKey(key) {
    const tokens = this._tokenize(key);
    return this._toConvention(tokens, this.convention);
  }

  /**
   * Break a key into lowercase word tokens.
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

module.exports = { OpenAPIImporter };
