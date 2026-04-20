/**
 * APIBridge AI v16 — Security Module
 *
 * Comprehensive security utilities for protecting API requests and responses
 * against common web vulnerabilities and abuse patterns.
 *
 * Components:
 *   - SSRFGuard              — Server-Side Request Forgery protection
 *   - HeaderValidator        — Header injection / CRLF prevention
 *   - RequestRateLimiter     — Token bucket rate limiting
 *   - ResponseSizeGuard      — Response body size enforcement
 *   - SensitiveDataRedactor  — Credential / token stripping for logs
 *   - RequestFingerprinter   — Replay detection via request hashing
 *   - Prototype Pollution    — safeMerge / sanitizeObject helpers
 *
 * Usage:
 *   const { SSRFGuard, HeaderValidator } = require('./security');
 *   const guard = new SSRFGuard();
 *   guard.validateURL('https://example.com/api'); // ok
 *   guard.validateURL('http://169.254.169.254/metadata'); // throws
 */

'use strict';

const crypto = require('crypto');

// ─── Shared Constants ───────────────────────────────────────────────────────

const DANGEROUS_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

// ─── 1. SSRF Guard ─────────────────────────────────────────────────────────

/**
 * Private IP ranges expressed as { base (uint32), mask (uint32) } for fast
 * bitwise comparison.
 */
const PRIVATE_IP_RANGES = [
  { base: 0x7F000000, mask: 0xFF000000 }, // 127.0.0.0/8
  { base: 0x0A000000, mask: 0xFF000000 }, // 10.0.0.0/8
  { base: 0xAC100000, mask: 0xFFF00000 }, // 172.16.0.0/12
  { base: 0xC0A80000, mask: 0xFFFF0000 }, // 192.168.0.0/16
  { base: 0xA9FE0000, mask: 0xFFFF0000 }, // 169.254.0.0/16
  { base: 0x00000000, mask: 0xFFFFFFFF }, // 0.0.0.0/32
];

const CLOUD_METADATA_HOSTS = new Set([
  '169.254.169.254',
  'metadata.google.internal',
  'metadata.azure.com',
]);

const BLOCKED_PROTOCOLS = new Set([
  'file:',
  'data:',
  'javascript:',
  'vbscript:',
]);

const LOCALHOST_ALIASES = new Set([
  'localhost',
  '0.0.0.0',
  '[::1]',
  '[::ffff:127.0.0.1]',
]);

/**
 * Parse a dotted-quad IPv4 string into a 32-bit unsigned integer.
 * Returns NaN for non-IPv4 strings.
 *
 * @param {string} ip
 * @returns {number}
 */
function ipToLong(ip) {
  const parts = ip.split('.');
  if (parts.length !== 4) return NaN;

  let num = 0;
  for (let i = 0; i < 4; i++) {
    const octet = Number(parts[i]);
    if (!Number.isInteger(octet) || octet < 0 || octet > 255) return NaN;
    num = (num * 256) + octet;
  }
  return num >>> 0; // ensure unsigned
}

/**
 * Check whether an IPv4 address falls inside any private / reserved range.
 *
 * @param {string} ip — dotted-quad IPv4 string
 * @returns {boolean}
 */
function isPrivateIP(ip) {
  const long = ipToLong(ip);
  if (Number.isNaN(long)) return false;

  for (const range of PRIVATE_IP_RANGES) {
    if (((long & range.mask) >>> 0) === (range.base >>> 0)) return true;
  }
  return false;
}

/**
 * SSRF (Server-Side Request Forgery) guard.
 *
 * Validates outgoing URLs to prevent requests to internal infrastructure,
 * cloud metadata endpoints, and dangerous protocol schemes.
 *
 * @example
 *   const guard = new SSRFGuard();
 *   guard.validateURL('https://api.example.com'); // ok
 *   guard.validateURL('http://127.0.0.1/admin');  // throws
 */
class SSRFGuard {
  /**
   * @param {object}   [options]
   * @param {boolean}  [options.enabled=true]     — Enable / disable the guard
   * @param {string[]} [options.allowlist=[]]      — Hosts that bypass SSRF checks
   * @param {string[]} [options.blocklist=[]]      — Additional blocked hosts
   */
  constructor(options = {}) {
    this.enabled = options.enabled !== false;
    this._allowlist = new Set((options.allowlist || []).map(h => h.toLowerCase()));
    this._blocklist = new Set((options.blocklist || []).map(h => h.toLowerCase()));
  }

  /**
   * Validate a URL string. Throws if the URL targets a forbidden destination.
   *
   * @param {string} url
   * @throws {Error} If the URL is blocked
   * @returns {true}
   */
  validateURL(url) {
    if (!this.enabled) return true;

    if (!url || typeof url !== 'string') {
      throw new Error('SSRF_INVALID_URL: URL must be a non-empty string');
    }

    // Block dangerous protocols (check before URL parsing for schemeless strings)
    const lower = url.toLowerCase().trim();
    for (const proto of BLOCKED_PROTOCOLS) {
      if (lower.startsWith(proto)) {
        throw new Error(`SSRF_BLOCKED_PROTOCOL: Protocol "${proto}" is not allowed`);
      }
    }

    let parsed;
    try {
      parsed = new URL(url);
    } catch {
      throw new Error('SSRF_INVALID_URL: Unable to parse URL');
    }

    // Re-check protocol after parsing (handles e.g. "File://")
    if (BLOCKED_PROTOCOLS.has(parsed.protocol)) {
      throw new Error(`SSRF_BLOCKED_PROTOCOL: Protocol "${parsed.protocol}" is not allowed`);
    }

    const hostname = parsed.hostname.toLowerCase();

    // Allowlist takes precedence
    if (this._allowlist.has(hostname)) return true;

    // Custom blocklist
    if (this._blocklist.has(hostname)) {
      throw new Error(`SSRF_BLOCKED_HOST: Host "${hostname}" is blocked`);
    }

    // Cloud metadata endpoints
    if (CLOUD_METADATA_HOSTS.has(hostname)) {
      throw new Error(`SSRF_BLOCKED_HOST: Cloud metadata endpoint "${hostname}" is blocked`);
    }

    // Localhost aliases
    if (LOCALHOST_ALIASES.has(hostname)) {
      throw new Error(`SSRF_BLOCKED_HOST: Localhost alias "${hostname}" is blocked`);
    }

    // Private IP ranges
    if (isPrivateIP(hostname)) {
      throw new Error(`SSRF_BLOCKED_IP: Private/internal IP "${hostname}" is blocked`);
    }

    return true;
  }
}

// ─── 2. Header Validator ────────────────────────────────────────────────────

/**
 * Valid HTTP header name: RFC 7230 token characters.
 * Must not contain control chars, spaces, or delimiters.
 */
const HEADER_NAME_RE = /^[!#$%&'*+\-.^_`|~0-9A-Za-z]+$/;

/**
 * Reject header values containing CR or LF (CRLF injection).
 */
const CRLF_RE = /[\r\n]/;

/**
 * Validates HTTP headers to prevent CRLF injection and oversized payloads.
 *
 * @example
 *   const v = new HeaderValidator();
 *   v.validateHeaderName('Content-Type');      // ok
 *   v.validateHeaderName('Bad\r\nHeader');      // throws
 */
class HeaderValidator {
  /**
   * @param {object} [options]
   * @param {number} [options.maxHeadersCount=100]  — Max number of headers
   * @param {number} [options.maxHeaderSize=8192]    — Max single value size (bytes)
   */
  constructor(options = {}) {
    this.maxHeadersCount = options.maxHeadersCount != null ? options.maxHeadersCount : 100;
    this.maxHeaderSize = options.maxHeaderSize != null ? options.maxHeaderSize : 8192;
  }

  /**
   * Validate a single header name.
   *
   * @param {string} name
   * @throws {Error} If the name is invalid
   * @returns {true}
   */
  validateHeaderName(name) {
    if (!name || typeof name !== 'string') {
      throw new Error('HEADER_INVALID_NAME: Header name must be a non-empty string');
    }

    if (CRLF_RE.test(name)) {
      throw new Error('HEADER_CRLF_INJECTION: Header name contains CR/LF characters');
    }

    if (!HEADER_NAME_RE.test(name)) {
      throw new Error('HEADER_INVALID_NAME: Header name contains invalid characters');
    }

    return true;
  }

  /**
   * Validate a single header value.
   *
   * @param {string} value
   * @throws {Error} If the value is invalid
   * @returns {true}
   */
  validateHeaderValue(value) {
    if (value == null) return true;

    const str = String(value);

    if (CRLF_RE.test(str)) {
      throw new Error('HEADER_CRLF_INJECTION: Header value contains CR/LF characters');
    }

    if (Buffer.byteLength(str, 'utf8') > this.maxHeaderSize) {
      throw new Error(
        `HEADER_TOO_LARGE: Header value exceeds maximum size of ${this.maxHeaderSize} bytes`
      );
    }

    return true;
  }

  /**
   * Validate all headers in a plain object.
   *
   * @param {object} headers — { name: value } map
   * @throws {Error} If any header is invalid or count is exceeded
   * @returns {true}
   */
  validateHeaders(headers) {
    if (!headers || typeof headers !== 'object') {
      throw new Error('HEADER_INVALID: Headers must be a non-null object');
    }

    const keys = Object.keys(headers);

    if (keys.length > this.maxHeadersCount) {
      throw new Error(
        `HEADER_COUNT_EXCEEDED: ${keys.length} headers exceeds maximum of ${this.maxHeadersCount}`
      );
    }

    for (const name of keys) {
      this.validateHeaderName(name);
      this.validateHeaderValue(headers[name]);
    }

    return true;
  }
}

// ─── 3. Request Rate Limiter ────────────────────────────────────────────────

/**
 * Token-bucket rate limiter for outgoing requests.
 *
 * Supports a global bucket as well as optional per-endpoint buckets.
 *
 * @example
 *   const limiter = new RequestRateLimiter({ maxRequests: 10, windowMs: 1000 });
 *   if (limiter.acquire()) { // send request }
 */
class RequestRateLimiter {
  /**
   * @param {object} [options]
   * @param {number} [options.maxRequests=100]  — Tokens per window
   * @param {number} [options.windowMs=60000]   — Window length in milliseconds
   */
  constructor(options = {}) {
    this.maxRequests = options.maxRequests != null ? options.maxRequests : 100;
    this.windowMs = options.windowMs != null ? options.windowMs : 60000;

    this._tokens = this.maxRequests;
    this._lastRefill = Date.now();

    /** @type {Map<string, {tokens: number, lastRefill: number}>} */
    this._endpoints = new Map();
  }

  /**
   * Refill tokens based on elapsed time.
   * @private
   */
  _refill(bucket) {
    const now = Date.now();
    const elapsed = now - bucket.lastRefill;

    if (elapsed >= this.windowMs) {
      bucket.tokens = this.maxRequests;
      bucket.lastRefill = now;
    } else {
      const refillAmount = (elapsed / this.windowMs) * this.maxRequests;
      bucket.tokens = Math.min(this.maxRequests, bucket.tokens + refillAmount);
      bucket.lastRefill = now;
    }
  }

  /**
   * Attempt to acquire a token from the global (or per-endpoint) bucket.
   *
   * @param {string} [endpoint] — Optional endpoint key for per-endpoint limiting
   * @returns {boolean} true if request may proceed
   */
  acquire(endpoint) {
    const bucket = endpoint ? this._getEndpointBucket(endpoint) : this;
    this._refill(bucket);

    if (bucket.tokens >= 1) {
      bucket.tokens -= 1;
      return true;
    }
    return false;
  }

  /**
   * Reset the global bucket (and optionally a specific endpoint bucket).
   *
   * @param {string} [endpoint] — If provided, only that endpoint is reset
   */
  reset(endpoint) {
    if (endpoint) {
      this._endpoints.delete(endpoint);
    } else {
      this._tokens = this.maxRequests;
      this._lastRefill = Date.now();
      this._endpoints.clear();
    }
  }

  /**
   * Get or create a per-endpoint bucket.
   * @private
   * @param {string} endpoint
   * @returns {{tokens: number, lastRefill: number}}
   */
  _getEndpointBucket(endpoint) {
    if (!this._endpoints.has(endpoint)) {
      this._endpoints.set(endpoint, {
        tokens: this.maxRequests,
        lastRefill: Date.now(),
      });
    }
    return this._endpoints.get(endpoint);
  }

  /**
   * Bucket interface used by _refill. The global bucket exposes these fields
   * directly on the instance via _tokens / _lastRefill.
   * @private
   */
  get tokens() { return this._tokens; }
  set tokens(v) { this._tokens = v; }
  get lastRefill() { return this._lastRefill; }
  set lastRefill(v) { this._lastRefill = v; }
}

// ─── 4. Response Size Guard ─────────────────────────────────────────────────

const DEFAULT_MAX_RESPONSE_SIZE = 10 * 1024 * 1024; // 10 MB

/**
 * Guards against unexpectedly large response bodies.
 *
 * @example
 *   const guard = new ResponseSizeGuard({ maxResponseSize: 5 * 1024 * 1024 });
 *   guard.checkSize(response.headers['content-length']);
 */
class ResponseSizeGuard {
  /**
   * @param {object} [options]
   * @param {number} [options.maxResponseSize=10485760] — Max body size in bytes (10 MB)
   */
  constructor(options = {}) {
    this.maxResponseSize = options.maxResponseSize != null
      ? options.maxResponseSize
      : DEFAULT_MAX_RESPONSE_SIZE;
  }

  /**
   * Validate a Content-Length value.
   *
   * @param {number|string} contentLength
   * @throws {Error} If the length exceeds the limit
   * @returns {true}
   */
  checkSize(contentLength) {
    const size = Number(contentLength);
    if (Number.isNaN(size) || size < 0) return true; // unknown size — can't check

    if (size > this.maxResponseSize) {
      throw new Error(
        `RESPONSE_TOO_LARGE: Content-Length ${size} exceeds maximum of ${this.maxResponseSize} bytes`
      );
    }
    return true;
  }

  /**
   * Create a streaming size tracker. Call `tracker.add(chunkByteLength)` for
   * each chunk received. Throws if cumulative size exceeds the limit.
   *
   * @returns {{ add: (bytes: number) => void, total: number }}
   */
  createSizeTracker() {
    const max = this.maxResponseSize;
    const tracker = {
      total: 0,
      /**
       * @param {number} bytes — Number of bytes in the chunk
       * @throws {Error} If cumulative size exceeds the limit
       */
      add(bytes) {
        this.total += bytes;
        if (this.total > max) {
          throw new Error(
            `RESPONSE_TOO_LARGE: Received ${this.total} bytes, exceeds maximum of ${max} bytes`
          );
        }
      },
    };
    return tracker;
  }
}

// ─── 5. Sensitive Data Redactor ─────────────────────────────────────────────

const DEFAULT_SENSITIVE_HEADERS = [
  'authorization',
  'cookie',
  'set-cookie',
  'x-api-key',
  'x-auth-token',
  'proxy-authorization',
  'www-authenticate',
];

const SENSITIVE_QUERY_RE = /(?:^|&)((?:token|key|secret|password|auth|api_key|apikey|access_token|refresh_token|client_secret)=[^&]*)/gi;

/**
 * Redacts sensitive information from request configs, headers, and URLs
 * to prevent accidental credential leakage in logs and error messages.
 *
 * @example
 *   const redactor = new SensitiveDataRedactor();
 *   const safe = redactor.redactHeaders({ Authorization: 'Bearer secret' });
 *   // { Authorization: '[REDACTED]' }
 */
class SensitiveDataRedactor {
  /**
   * @param {object}   [options]
   * @param {string[]} [options.sensitiveHeaders] — Additional sensitive header names
   */
  constructor(options = {}) {
    const extra = (options.sensitiveHeaders || []).map(h => h.toLowerCase());
    this._sensitiveHeaders = new Set([...DEFAULT_SENSITIVE_HEADERS, ...extra]);
  }

  /**
   * Test whether a header name is sensitive.
   *
   * @param {string} name
   * @returns {boolean}
   */
  isSensitiveHeader(name) {
    if (!name) return false;
    return this._sensitiveHeaders.has(name.toLowerCase());
  }

  /**
   * Return a copy of the headers object with sensitive values replaced.
   *
   * @param {object} headers
   * @returns {object}
   */
  redactHeaders(headers) {
    if (!headers || typeof headers !== 'object') return {};

    const result = {};
    for (const [key, value] of Object.entries(headers)) {
      if (DANGEROUS_KEYS.has(key)) continue;
      result[key] = this.isSensitiveHeader(key) ? '[REDACTED]' : value;
    }
    return result;
  }

  /**
   * Return a copy of a request config with sensitive headers and auth removed.
   *
   * @param {object} config — Axios-style request config
   * @returns {object}
   */
  redactConfig(config) {
    if (!config || typeof config !== 'object') return {};

    const safe = {};
    for (const [key, value] of Object.entries(config)) {
      if (DANGEROUS_KEYS.has(key)) continue;

      if (key === 'headers') {
        safe.headers = this.redactHeaders(value);
      } else if (key === 'auth') {
        safe.auth = '[REDACTED]';
      } else if (key === 'url' && typeof value === 'string') {
        safe.url = this.redactURL(value);
      } else {
        safe[key] = value;
      }
    }
    return safe;
  }

  /**
   * Strip sensitive-looking query parameters from a URL.
   *
   * @param {string} url
   * @returns {string}
   */
  redactURL(url) {
    if (!url || typeof url !== 'string') return '';

    const qIdx = url.indexOf('?');
    if (qIdx === -1) return url;

    const base = url.slice(0, qIdx);
    const query = url.slice(qIdx + 1);
    const hashIdx = query.indexOf('#');
    const qs = hashIdx === -1 ? query : query.slice(0, hashIdx);
    const hash = hashIdx === -1 ? '' : query.slice(hashIdx);

    const redacted = qs.replace(SENSITIVE_QUERY_RE, (match, pair) => {
      const eqIdx = pair.indexOf('=');
      const paramName = pair.slice(0, eqIdx);
      return match.replace(pair, `${paramName}=[REDACTED]`);
    });

    return base + '?' + redacted + hash;
  }
}

// ─── 6. Request Fingerprinter ───────────────────────────────────────────────

/**
 * Generates content-based fingerprints for request configs to enable
 * duplicate / replay detection within configurable time windows.
 *
 * @example
 *   const fp = new RequestFingerprinter();
 *   fp.isDuplicate({ method: 'GET', url: '/users' }, 5000); // false (first time)
 *   fp.isDuplicate({ method: 'GET', url: '/users' }, 5000); // true  (within 5 s)
 */
class RequestFingerprinter {
  constructor() {
    /** @type {Map<string, number>} fingerprint → timestamp */
    this._seen = new Map();
  }

  /**
   * Generate a SHA-256 hex fingerprint for a request config.
   *
   * @param {object} config — { method, url, data, params, ... }
   * @returns {string} hex digest
   */
  fingerprint(config) {
    if (!config || typeof config !== 'object') return '';

    const method = (config.method || 'GET').toUpperCase();
    const url = config.url || '';
    const body = config.data != null ? JSON.stringify(config.data) : '';
    const params = config.params != null ? JSON.stringify(config.params) : '';

    const raw = `${method}:${url}:${body}:${params}`;
    return crypto.createHash('sha256').update(raw).digest('hex');
  }

  /**
   * Check whether an identical request was already recorded within `windowMs`.
   * If not, records the current request.
   *
   * @param {object} config   — Request config
   * @param {number} windowMs — Dedup window in milliseconds
   * @returns {boolean} true if a duplicate was found
   */
  isDuplicate(config, windowMs) {
    const fp = this.fingerprint(config);
    if (!fp) return false;

    const now = Date.now();

    // Prune stale entries periodically (simple inline sweep)
    if (this._seen.size > 1000) {
      for (const [key, ts] of this._seen) {
        if (now - ts > windowMs) this._seen.delete(key);
      }
    }

    const lastSeen = this._seen.get(fp);
    if (lastSeen !== undefined && (now - lastSeen) <= windowMs) {
      return true;
    }

    this._seen.set(fp, now);
    return false;
  }

  /**
   * Clear all recorded fingerprints.
   */
  reset() {
    this._seen.clear();
  }
}

// ─── 7. Prototype Pollution Guard ───────────────────────────────────────────

/**
 * Deep-merge `source` into `target` while skipping prototype-polluting keys
 * (__proto__, constructor, prototype).
 *
 * @param {object} target
 * @param {object} source
 * @returns {object} target (mutated)
 */
function safeMerge(target, source) {
  if (!source || typeof source !== 'object' || Array.isArray(source)) return target;
  if (!target || typeof target !== 'object' || Array.isArray(target)) return target;

  for (const key of Object.keys(source)) {
    if (DANGEROUS_KEYS.has(key)) continue;

    if (!Object.prototype.hasOwnProperty.call(source, key)) continue;

    const srcVal = source[key];
    const tgtVal = Object.prototype.hasOwnProperty.call(target, key) ? target[key] : undefined;

    if (
      srcVal !== null &&
      typeof srcVal === 'object' &&
      !Array.isArray(srcVal) &&
      tgtVal !== null &&
      typeof tgtVal === 'object' &&
      !Array.isArray(tgtVal)
    ) {
      safeMerge(tgtVal, srcVal);
    } else {
      // Use defineProperty to avoid triggering setters on Object.prototype
      Object.defineProperty(target, key, {
        value: srcVal,
        writable: true,
        enumerable: true,
        configurable: true,
      });
    }
  }

  return target;
}

/**
 * Recursively remove all prototype-polluting keys from an object graph.
 *
 * @param {object} obj
 * @returns {object} The same object (mutated)
 */
function sanitizeObject(obj) {
  if (!obj || typeof obj !== 'object') return obj;

  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      sanitizeObject(obj[i]);
    }
    return obj;
  }

  for (const key of Object.keys(obj)) {
    if (DANGEROUS_KEYS.has(key)) {
      delete obj[key];
    } else if (obj[key] !== null && typeof obj[key] === 'object') {
      sanitizeObject(obj[key]);
    }
  }
  return obj;
}

// ─── Exports ────────────────────────────────────────────────────────────────

module.exports = {
  // Classes
  SSRFGuard,
  HeaderValidator,
  RequestRateLimiter,
  ResponseSizeGuard,
  SensitiveDataRedactor,
  RequestFingerprinter,

  // Standalone helpers
  safeMerge,
  sanitizeObject,
  isPrivateIP,
  ipToLong,
};
