/**
 * awsibnj v4 — Webhook Handler
 *
 * Normalizes and processes incoming webhook payloads from various providers.
 * Extracts event types, unwraps nested payloads, converts key naming
 * conventions, and optionally verifies HMAC signatures.
 *
 * Built-in provider templates: github, stripe, generic.
 */

const crypto = require('crypto');

// ─── KEY CONVENTION UTILITIES ─────────────────────────────────────────────────

/**
 * Tokenize any key into lowercase word segments.
 * Handles camelCase, PascalCase, snake_case, kebab-case, and dot.notation.
 * @param {string} key
 * @returns {string[]}
 */
function tokenize(key) {
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
 * Join tokens as camelCase.
 * @param {string[]} tokens
 * @returns {string}
 */
function toCamel(tokens) {
  return tokens
    .map((t, i) => (i === 0 ? t : t[0].toUpperCase() + t.slice(1)))
    .join('');
}

/**
 * Join tokens as snake_case.
 * @param {string[]} tokens
 * @returns {string}
 */
function toSnake(tokens) {
  return tokens.join('_');
}

/**
 * Join tokens as PascalCase.
 * @param {string[]} tokens
 * @returns {string}
 */
function toPascal(tokens) {
  return tokens.map(t => t[0].toUpperCase() + t.slice(1)).join('');
}

/**
 * Join tokens as kebab-case.
 * @param {string[]} tokens
 * @returns {string}
 */
function toKebab(tokens) {
  return tokens.join('-');
}

/**
 * Convert a single key string to the target naming convention.
 * @param {string} key
 * @param {string} convention  'camelCase' | 'snake_case' | 'PascalCase' | 'kebab-case'
 * @returns {string}
 */
function convertKey(key, convention) {
  const tokens = tokenize(key);
  if (tokens.length === 0) return key;
  switch (convention) {
    case 'snake_case':  return toSnake(tokens);
    case 'PascalCase':  return toPascal(tokens);
    case 'kebab-case':  return toKebab(tokens);
    case 'camelCase':
    default:            return toCamel(tokens);
  }
}

// ─── BUILT-IN PROVIDER TEMPLATES ──────────────────────────────────────────────

const BUILTIN_PROVIDERS = {
  github: {
    eventKey: 'action',
    signatureHeader: 'x-hub-signature-256',
    signatureAlgorithm: 'sha256',
  },
  stripe: {
    eventKey: 'type',
    payloadKey: 'data.object',
    signatureHeader: 'stripe-signature',
    signatureAlgorithm: 'sha256',
  },
  generic: {
    eventKey: 'event',
    payloadKey: 'data',
  },
};

// ─── WEBHOOK HANDLER ──────────────────────────────────────────────────────────

class WebhookHandler {
  /**
   * @param {object}  options
   * @param {string}  options.convention       Target naming convention (default 'camelCase')
   * @param {boolean} options.verifySignatures Whether to verify webhook signatures (default false)
   * @param {number}  options.maxPayloadSize   Max payload size in bytes (default 1048576)
   */
  constructor(options = {}) {
    this.convention = options.convention || 'camelCase';
    this.verifySignatures = options.verifySignatures || false;
    this.maxPayloadSize = options.maxPayloadSize || 1048576;

    /** @type {Map<string, object>} */
    this._providers = new Map();

    this._stats = {
      webhooksProcessed: 0,
      byProvider: {},
      signatureVerifications: 0,
      signatureFailures: 0,
    };

    // Pre-register built-in provider templates
    for (const [name, config] of Object.entries(BUILTIN_PROVIDERS)) {
      this._providers.set(name, { ...config });
    }
  }

  /**
   * Register a webhook provider configuration.
   * @param {string} provider  Provider name
   * @param {object} config
   * @param {string}   config.eventKey           Field name for the event type
   * @param {string}   [config.payloadKey]       Dot-path to nested payload data
   * @param {string}   [config.signatureHeader]  Header that carries the signature
   * @param {string}   [config.signatureAlgorithm] HMAC algorithm (default 'sha256')
   * @param {Function} [config.transform]        Custom transform function
   */
  register(provider, config) {
    if (!provider || typeof provider !== 'string') {
      throw new Error('Provider name must be a non-empty string');
    }
    if (!config || !config.eventKey) {
      throw new Error('Provider config must include an eventKey');
    }
    this._providers.set(provider, { ...config });
  }

  /**
   * Remove a registered provider.
   * @param {string} provider
   */
  unregister(provider) {
    this._providers.delete(provider);
  }

  /**
   * Process an incoming webhook payload.
   * @param {string} provider   Registered provider name
   * @param {object} payload    Raw webhook payload
   * @param {object} [headers]  HTTP headers (for signature verification)
   * @returns {{ event: string|null, data: object, provider: string, timestamp: string, raw: object }}
   */
  process(provider, payload, headers = {}) {
    const config = this._providers.get(provider);
    if (!config) {
      throw new Error(`Unknown webhook provider: "${provider}"`);
    }

    // Payload size guard
    const serialized = JSON.stringify(payload);
    if (serialized.length > this.maxPayloadSize) {
      throw new Error(
        `Payload size ${serialized.length} exceeds maximum ${this.maxPayloadSize} bytes`
      );
    }

    // Extract event type
    const event = payload != null ? payload[config.eventKey] || null : null;

    // Unwrap nested payload via dot-path
    let data = payload;
    if (config.payloadKey) {
      data = this._getByPath(payload, config.payloadKey);
      if (data === undefined) {
        data = payload;
      }
    }

    // Apply custom transform if provided
    if (typeof config.transform === 'function') {
      data = config.transform(data);
    }

    // Normalize keys to target convention
    data = this.normalize(data);

    // Update stats
    this._stats.webhooksProcessed++;
    if (!this._stats.byProvider[provider]) {
      this._stats.byProvider[provider] = 0;
    }
    this._stats.byProvider[provider]++;

    return {
      event,
      data,
      provider,
      timestamp: new Date().toISOString(),
      raw: payload,
    };
  }

  /**
   * Deep-transform all object keys to the target naming convention.
   * @param {any} payload
   * @returns {any}
   */
  normalize(payload) {
    if (payload === null || payload === undefined) return payload;
    if (Array.isArray(payload)) {
      return payload.map(item => this.normalize(item));
    }
    if (typeof payload !== 'object' || payload instanceof Date) return payload;

    const result = {};
    for (const [key, value] of Object.entries(payload)) {
      const newKey = convertKey(key, this.convention);
      result[newKey] = this.normalize(value);
    }
    return result;
  }

  /**
   * Verify a webhook signature using HMAC.
   * @param {string} provider   Registered provider name
   * @param {string|object} payload  Raw payload (string or object to be stringified)
   * @param {string} signature  Signature value from the request header
   * @param {string} secret     Shared secret for HMAC computation
   * @returns {boolean}
   */
  verifySignature(provider, payload, signature, secret) {
    const config = this._providers.get(provider);
    if (!config) {
      throw new Error(`Unknown webhook provider: "${provider}"`);
    }

    this._stats.signatureVerifications++;

    const algorithm = config.signatureAlgorithm || 'sha256';
    const body = typeof payload === 'string' ? payload : JSON.stringify(payload);
    const expected = crypto
      .createHmac(algorithm, secret)
      .update(body)
      .digest('hex');

    // Support signatures with algorithm prefix (e.g. "sha256=abc123")
    const rawSignature = signature.includes('=')
      ? signature.split('=').slice(1).join('=')
      : signature;

    let isValid;
    try {
      isValid = crypto.timingSafeEqual(
        Buffer.from(rawSignature, 'hex'),
        Buffer.from(expected, 'hex')
      );
    } catch {
      isValid = false;
    }

    if (!isValid) {
      this._stats.signatureFailures++;
    }

    return isValid;
  }

  /**
   * List all registered provider names.
   * @returns {string[]}
   */
  list() {
    return Array.from(this._providers.keys());
  }

  /**
   * Check whether a provider is registered.
   * @param {string} provider
   * @returns {boolean}
   */
  has(provider) {
    return this._providers.has(provider);
  }

  /**
   * Return processing statistics.
   * @returns {{ webhooksProcessed: number, byProvider: object, signatureVerifications: number, signatureFailures: number }}
   */
  getStats() {
    return { ...this._stats, byProvider: { ...this._stats.byProvider } };
  }

  /**
   * Reset all statistics and remove all providers (including built-ins).
   */
  reset() {
    this._providers.clear();
    this._stats = {
      webhooksProcessed: 0,
      byProvider: {},
      signatureVerifications: 0,
      signatureFailures: 0,
    };
  }

  // ─── INTERNAL HELPERS ─────────────────────────────────────────────────────

  /**
   * Resolve a dot-separated path against an object.
   * @param {object} obj
   * @param {string} path  e.g. 'data.object'
   * @returns {any}
   */
  _getByPath(obj, path) {
    return path.split('.').reduce((acc, segment) => {
      if (acc == null || typeof acc !== 'object') return undefined;
      return acc[segment];
    }, obj);
  }
}

module.exports = { WebhookHandler };
