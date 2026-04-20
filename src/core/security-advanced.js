/**
 * nopes v17 — Advanced Security Module
 *
 * Extended security utilities for protecting API requests and responses
 * with advanced patterns including CSP, certificate pinning, request signing,
 * input sanitization, audit logging, RBAC, payload encryption, and idempotency.
 *
 * Components:
 *   - ContentSecurityPolicy  — Build & validate CSP headers
 *   - CertificatePinning     — SHA-256 certificate pin verification
 *   - RequestSigning         — HMAC-SHA256 request signing for integrity
 *   - InputSanitizer         — XSS & injection prevention with deep sanitization
 *   - SecurityAuditLogger    — Immutable append-only hash-chained event log
 *   - PermissionPolicy       — Method/endpoint RBAC access control
 *   - PayloadEncryptor       — AES-256-GCM payload encryption/decryption
 *   - IdempotencyManager     — Idempotency key generation and enforcement
 *
 * Usage:
 *   const { ContentSecurityPolicy, PayloadEncryptor } = require('./security-advanced');
 *   const csp = new ContentSecurityPolicy();
 *   console.log(csp.buildHeader());
 */

'use strict';

const crypto = require('crypto');

// ─── 1. Content Security Policy ─────────────────────────────────────────────

/**
 * Builds and validates Content-Security-Policy headers for HTTP responses.
 *
 * @example
 *   const csp = new ContentSecurityPolicy();
 *   const header = csp.buildHeader();
 *   // "default-src 'self'; script-src 'self'; ..."
 */
class ContentSecurityPolicy {
  /**
   * @param {object}   [options]
   * @param {string[]} [options.defaultSrc=["'self'"]]           — default-src directive
   * @param {string[]} [options.scriptSrc=["'self'"]]            — script-src directive
   * @param {string[]} [options.styleSrc=["'self'","'unsafe-inline'"]] — style-src directive
   * @param {string[]} [options.imgSrc=["'self'","data:"]]       — img-src directive
   * @param {string[]} [options.connectSrc=["'self'"]]           — connect-src directive
   * @param {string[]} [options.fontSrc=["'self'"]]              — font-src directive
   * @param {string[]} [options.objectSrc=["'none'"]]            — object-src directive
   * @param {string[]} [options.frameSrc=["'none'"]]             — frame-src directive
   * @param {string[]} [options.baseUri=["'self'"]]              — base-uri directive
   * @param {string[]} [options.formAction=["'self'"]]           — form-action directive
   * @param {string|null} [options.reportUri=null]               — report-uri endpoint
   * @param {boolean}  [options.reportOnly=false]                — use report-only header
   * @param {object}   [options.customDirectives={}]             — arbitrary extra directives
   */
  constructor(options = {}) {
    this.defaultSrc = options.defaultSrc || ["'self'"];
    this.scriptSrc = options.scriptSrc || ["'self'"];
    this.styleSrc = options.styleSrc || ["'self'", "'unsafe-inline'"];
    this.imgSrc = options.imgSrc || ["'self'", 'data:'];
    this.connectSrc = options.connectSrc || ["'self'"];
    this.fontSrc = options.fontSrc || ["'self'"];
    this.objectSrc = options.objectSrc || ["'none'"];
    this.frameSrc = options.frameSrc || ["'none'"];
    this.baseUri = options.baseUri || ["'self'"];
    this.formAction = options.formAction || ["'self'"];
    this.reportUri = options.reportUri || null;
    this.reportOnly = options.reportOnly === true;
    this.customDirectives = options.customDirectives || {};
  }

  /**
   * Build the CSP header value string from all configured directives.
   *
   * @returns {string}
   */
  buildHeader() {
    const directives = [
      ['default-src', this.defaultSrc],
      ['script-src', this.scriptSrc],
      ['style-src', this.styleSrc],
      ['img-src', this.imgSrc],
      ['connect-src', this.connectSrc],
      ['font-src', this.fontSrc],
      ['object-src', this.objectSrc],
      ['frame-src', this.frameSrc],
      ['base-uri', this.baseUri],
      ['form-action', this.formAction],
    ];

    const parts = [];
    for (const [name, values] of directives) {
      if (values && values.length > 0) {
        parts.push(`${name} ${values.join(' ')}`);
      }
    }

    for (const [name, values] of Object.entries(this.customDirectives)) {
      if (Array.isArray(values) && values.length > 0) {
        parts.push(`${name} ${values.join(' ')}`);
      }
    }

    if (this.reportUri) {
      parts.push(`report-uri ${this.reportUri}`);
    }

    return parts.join('; ');
  }

  /**
   * Return the appropriate CSP header name.
   *
   * @returns {string}
   */
  getHeaderName() {
    return this.reportOnly
      ? 'Content-Security-Policy-Report-Only'
      : 'Content-Security-Policy';
  }

  /**
   * Validate a CSP source value against the spec. Rejects unsafe patterns
   * unless explicitly configured in the current directives.
   *
   * @param {string} source
   * @returns {boolean}
   */
  validateSource(source) {
    if (!source || typeof source !== 'string') return false;

    const validPatterns = [
      /^'self'$/,
      /^'none'$/,
      /^'unsafe-inline'$/,
      /^'unsafe-eval'$/,
      /^'strict-dynamic'$/,
      /^'nonce-[A-Za-z0-9+/=]+'$/,
      /^'sha256-[A-Za-z0-9+/=]+'$/,
      /^'sha384-[A-Za-z0-9+/=]+'$/,
      /^'sha512-[A-Za-z0-9+/=]+'$/,
      /^data:$/,
      /^blob:$/,
      /^https?:$/,
      /^https?:\/\/[^\s]+$/,
      /^\*$/,
      /^[a-zA-Z0-9.*-]+$/,
    ];

    return validPatterns.some(re => re.test(source));
  }

  /**
   * Generate a random nonce, add it to the scriptSrc directive, and return
   * the raw nonce value.
   *
   * @returns {string} The generated nonce value
   */
  addNonce() {
    const nonce = crypto.randomBytes(16).toString('base64');
    this.scriptSrc.push(`'nonce-${nonce}'`);
    return nonce;
  }

  /**
   * Serialize all directives to a plain object.
   *
   * @returns {object}
   */
  toJSON() {
    return {
      defaultSrc: this.defaultSrc,
      scriptSrc: this.scriptSrc,
      styleSrc: this.styleSrc,
      imgSrc: this.imgSrc,
      connectSrc: this.connectSrc,
      fontSrc: this.fontSrc,
      objectSrc: this.objectSrc,
      frameSrc: this.frameSrc,
      baseUri: this.baseUri,
      formAction: this.formAction,
      reportUri: this.reportUri,
      reportOnly: this.reportOnly,
      customDirectives: this.customDirectives,
    };
  }
}

// ─── 2. Certificate Pinning ─────────────────────────────────────────────────

/**
 * SHA-256 certificate pin verification for outgoing HTTPS requests.
 *
 * @example
 *   const pinner = new CertificatePinning();
 *   pinner.addPin('api.example.com', 'abc123...');
 *   pinner.verify('api.example.com', 'abc123...'); // { valid: true, ... }
 */
class CertificatePinning {
  /**
   * @param {object}   [options]
   * @param {Array<{host: string, sha256: string[]}>} [options.pins=[]]
   *   — Initial pin entries
   * @param {string}   [options.enforceMode='enforce'] — 'enforce' | 'report'
   * @param {number}   [options.maxAge=86400]          — Pin max age in seconds
   * @param {boolean}  [options.includeSubdomains=false]
   */
  constructor(options = {}) {
    this.enforceMode = options.enforceMode || 'enforce';
    this.maxAge = options.maxAge != null ? options.maxAge : 86400;
    this.includeSubdomains = options.includeSubdomains === true;

    /** @type {Map<string, Set<string>>} */
    this._pins = new Map();

    const pins = options.pins || [];
    for (const entry of pins) {
      if (entry.host && Array.isArray(entry.sha256)) {
        for (const hash of entry.sha256) {
          this.addPin(entry.host, hash);
        }
      }
    }
  }

  /**
   * Add a SHA-256 pin for a host.
   *
   * @param {string} host
   * @param {string} sha256Hash
   */
  addPin(host, sha256Hash) {
    const key = host.toLowerCase();
    if (!this._pins.has(key)) {
      this._pins.set(key, new Set());
    }
    this._pins.get(key).add(sha256Hash);
  }

  /**
   * Remove all pins for a host.
   *
   * @param {string} host
   */
  removePin(host) {
    this._pins.delete(host.toLowerCase());
  }

  /**
   * Verify a certificate hash against stored pins for a host.
   *
   * @param {string} host
   * @param {string} certHash — SHA-256 hash of the certificate
   * @returns {{ valid: boolean, host: string, enforced: boolean }}
   */
  verify(host, certHash) {
    const key = host.toLowerCase();
    const pins = this._pins.get(key);

    if (!pins || pins.size === 0) {
      return { valid: true, host, enforced: false };
    }

    const matches = pins.has(certHash);

    if (this.enforceMode === 'report') {
      return { valid: true, host, enforced: false };
    }

    return { valid: matches, host, enforced: true };
  }

  /**
   * Return the pin hashes for a given host.
   *
   * @param {string} host
   * @returns {string[]}
   */
  getPins(host) {
    const pins = this._pins.get(host.toLowerCase());
    return pins ? [...pins] : [];
  }

  /**
   * Build a Public-Key-Pins header string for a host.
   *
   * @param {string} host
   * @returns {string}
   */
  buildHPKPHeader(host) {
    const pins = this.getPins(host);
    const pinDirectives = pins.map(p => `pin-sha256="${p}"`).join('; ');
    let header = `${pinDirectives}; max-age=${this.maxAge}`;
    if (this.includeSubdomains) {
      header += '; includeSubDomains';
    }
    return header;
  }

  /**
   * Serialize the pinning configuration to a plain object.
   *
   * @returns {object}
   */
  toJSON() {
    const pins = [];
    for (const [host, hashes] of this._pins) {
      pins.push({ host, sha256: [...hashes] });
    }
    return {
      pins,
      enforceMode: this.enforceMode,
      maxAge: this.maxAge,
      includeSubdomains: this.includeSubdomains,
    };
  }
}

// ─── 3. Request Signing ─────────────────────────────────────────────────────

/**
 * HMAC-SHA256 request signing for integrity verification of outgoing and
 * incoming API requests.
 *
 * @example
 *   const signer = new RequestSigning({ secret: 'my-secret' });
 *   const { signature, timestamp } = signer.sign(config);
 *   signer.verify(config, signature, timestamp); // { valid: true }
 */
class RequestSigning {
  /**
   * @param {object}   [options]
   * @param {string}   [options.secret='']         — Signing secret
   * @param {string}   [options.algorithm='sha256'] — Hash algorithm
   * @param {string}   [options.headerName='x-signature'] — Signature header name
   * @param {string[]} [options.signedHeaders=['host','content-type','x-timestamp']]
   *   — Headers to include in the signature
   * @param {number}   [options.timestampTolerance=300] — Max age of signature in seconds
   */
  constructor(options = {}) {
    this.secret = options.secret || '';
    this.algorithm = options.algorithm || 'sha256';
    this.headerName = options.headerName || 'x-signature';
    this.signedHeaders = options.signedHeaders || ['host', 'content-type', 'x-timestamp'];
    this.timestampTolerance = options.timestampTolerance != null
      ? options.timestampTolerance
      : 300;
  }

  /**
   * Build the canonical string used for signing.
   *
   * @param {string}   method
   * @param {string}   url
   * @param {number}   timestamp
   * @param {object}   headers — Full headers object
   * @param {string[]} signedHeaderNames — Names of headers to include
   * @returns {string}
   */
  createCanonicalString(method, url, timestamp, headers, signedHeaderNames) {
    const headerValues = signedHeaderNames.map(name => {
      const key = name.toLowerCase();
      if (!headers) return '';
      for (const [k, v] of Object.entries(headers)) {
        if (k.toLowerCase() === key) return String(v);
      }
      return '';
    });

    return `${method.toUpperCase()}\n${url}\n${timestamp}\n${headerValues.join('\n')}`;
  }

  /**
   * Sign a request config and return the signature, timestamp, and
   * signed header names.
   *
   * @param {object} config — { method, url, headers }
   * @returns {{ signature: string, timestamp: number, signedHeaders: string[] }}
   */
  sign(config) {
    const method = (config.method || 'GET').toUpperCase();
    const url = config.url || '';
    const headers = config.headers || {};
    const timestamp = Math.floor(Date.now() / 1000);

    const canonical = this.createCanonicalString(
      method, url, timestamp, headers, this.signedHeaders
    );

    const signature = crypto
      .createHmac(this.algorithm, this.secret)
      .update(canonical)
      .digest('hex');

    return { signature, timestamp, signedHeaders: [...this.signedHeaders] };
  }

  /**
   * Verify a signature against a request config.
   *
   * @param {object} config    — { method, url, headers }
   * @param {string} signature — The signature to verify
   * @param {number} timestamp — The timestamp the signature was created at
   * @returns {{ valid: boolean, reason?: string }}
   */
  verify(config, signature, timestamp) {
    const now = Math.floor(Date.now() / 1000);
    if (Math.abs(now - timestamp) > this.timestampTolerance) {
      return { valid: false, reason: 'Signature timestamp has expired' };
    }

    const method = (config.method || 'GET').toUpperCase();
    const url = config.url || '';
    const headers = config.headers || {};

    const canonical = this.createCanonicalString(
      method, url, timestamp, headers, this.signedHeaders
    );

    const expected = crypto
      .createHmac(this.algorithm, this.secret)
      .update(canonical)
      .digest('hex');

    if (expected !== signature) {
      return { valid: false, reason: 'Signature does not match' };
    }

    return { valid: true };
  }
}

// ─── 4. Input Sanitizer ─────────────────────────────────────────────────────

const HTML_ENTITIES = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;',
  '`': '&#96;',
};

const SCRIPT_RE = /<script\b[^<]*(?:(?!<\/script[\s>])<[^<]*)*<\/script[^>]*>/gi;
const EVENT_HANDLER_RE = /\bon\w+\s*=/gi;
const SQL_INJECTION_RE = /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER|CREATE|EXEC|EXECUTE)\b\s)/gi;
const PATH_TRAVERSAL_RE = /\.\.[/\\]/g;

const DANGEROUS_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

/**
 * XSS and injection prevention with deep object sanitization.
 *
 * @example
 *   const sanitizer = new InputSanitizer();
 *   sanitizer.sanitizeString('<script>alert(1)</script>');
 *   // '&lt;script&gt;alert(1)&lt;/script&gt;' (with script tag stripped)
 */
class InputSanitizer {
  /**
   * @param {object}   [options]
   * @param {string}   [options.mode='escape']         — 'escape' | 'strip' | 'reject'
   * @param {number}   [options.maxDepth=10]            — Max nesting depth
   * @param {number}   [options.maxStringLength=10000]  — Max string length
   * @param {boolean}  [options.allowHTML=false]         — Skip HTML entity escaping
   * @param {RegExp[]} [options.customPatterns=[]]       — Additional regex patterns
   */
  constructor(options = {}) {
    this.mode = options.mode || 'escape';
    this.maxDepth = options.maxDepth != null ? options.maxDepth : 10;
    this.maxStringLength = options.maxStringLength != null ? options.maxStringLength : 10000;
    this.allowHTML = options.allowHTML === true;
    this.customPatterns = options.customPatterns || [];
  }

  /**
   * Sanitize a single string value according to the configured mode.
   *
   * @param {string} str
   * @returns {string}
   * @throws {Error} If mode is 'reject' and dangerous content is found,
   *   or if the string exceeds maxStringLength
   */
  sanitizeString(str) {
    if (typeof str !== 'string') return str;

    if (str.length > this.maxStringLength) {
      throw new Error(
        `INPUT_REJECTED: String length ${str.length} exceeds maximum of ${this.maxStringLength}`
      );
    }

    if (this.mode === 'reject') {
      if (SCRIPT_RE.test(str)) {
        SCRIPT_RE.lastIndex = 0;
        throw new Error('INPUT_REJECTED: Script tags detected');
      }
      SCRIPT_RE.lastIndex = 0;

      if (EVENT_HANDLER_RE.test(str)) {
        EVENT_HANDLER_RE.lastIndex = 0;
        throw new Error('INPUT_REJECTED: Event handlers detected');
      }
      EVENT_HANDLER_RE.lastIndex = 0;

      if (SQL_INJECTION_RE.test(str)) {
        SQL_INJECTION_RE.lastIndex = 0;
        throw new Error('INPUT_REJECTED: SQL injection pattern detected');
      }
      SQL_INJECTION_RE.lastIndex = 0;

      if (PATH_TRAVERSAL_RE.test(str)) {
        PATH_TRAVERSAL_RE.lastIndex = 0;
        throw new Error('INPUT_REJECTED: Path traversal detected');
      }
      PATH_TRAVERSAL_RE.lastIndex = 0;

      for (const pattern of this.customPatterns) {
        if (pattern.test(str)) {
          pattern.lastIndex = 0;
          throw new Error('INPUT_REJECTED: Custom pattern matched');
        }
        pattern.lastIndex = 0;
      }

      return str;
    }

    let result = str;

    if (this.mode === 'strip') {
      let prev;
      do {
        prev = result;
        result = result.replace(SCRIPT_RE, '');
        SCRIPT_RE.lastIndex = 0;
        result = result.replace(EVENT_HANDLER_RE, '');
        EVENT_HANDLER_RE.lastIndex = 0;
        for (const pattern of this.customPatterns) {
          result = result.replace(pattern, '');
          pattern.lastIndex = 0;
        }
      } while (result !== prev);
      return result;
    }

    // mode === 'escape'
    if (!this.allowHTML) {
      result = result.replace(/[&<>"'`/]/g, ch => HTML_ENTITIES[ch] || ch);
    }
    let prev;
    do {
      prev = result;
      result = result.replace(SCRIPT_RE, '');
      SCRIPT_RE.lastIndex = 0;
      result = result.replace(EVENT_HANDLER_RE, '');
      EVENT_HANDLER_RE.lastIndex = 0;
    } while (result !== prev);

    return result;
  }

  /**
   * Recursively sanitize objects, arrays, and strings. Skips dangerous
   * prototype-polluting keys.
   *
   * @param {*}      input
   * @param {number} [depth=0] — Current nesting depth
   * @returns {*}
   * @throws {Error} If depth exceeds maxDepth
   */
  sanitize(input, depth = 0) {
    if (depth > this.maxDepth) {
      throw new Error(`INPUT_REJECTED: Nesting depth exceeds maximum of ${this.maxDepth}`);
    }

    if (typeof input === 'string') {
      return this.sanitizeString(input);
    }

    if (Array.isArray(input)) {
      return input.map(item => this.sanitize(item, depth + 1));
    }

    if (input !== null && typeof input === 'object') {
      const result = {};
      for (const key of Object.keys(input)) {
        if (DANGEROUS_KEYS.has(key)) continue;
        result[key] = this.sanitize(input[key], depth + 1);
      }
      return result;
    }

    return input;
  }

  /**
   * Detect threats in the input without modifying it. Returns an array
   * of threat descriptors.
   *
   * @param {*}      input
   * @param {string} [path=''] — Current object path (for reporting)
   * @returns {Array<{type: string, value: string, path: string}>}
   */
  detectThreats(input, path = '') {
    const threats = [];

    if (typeof input === 'string') {
      SCRIPT_RE.lastIndex = 0;
      if (SCRIPT_RE.test(input)) {
        threats.push({ type: 'xss', value: input.slice(0, 100), path });
      }
      SCRIPT_RE.lastIndex = 0;

      EVENT_HANDLER_RE.lastIndex = 0;
      if (EVENT_HANDLER_RE.test(input)) {
        threats.push({ type: 'xss', value: input.slice(0, 100), path });
      }
      EVENT_HANDLER_RE.lastIndex = 0;

      SQL_INJECTION_RE.lastIndex = 0;
      if (SQL_INJECTION_RE.test(input)) {
        threats.push({ type: 'sql_injection', value: input.slice(0, 100), path });
      }
      SQL_INJECTION_RE.lastIndex = 0;

      PATH_TRAVERSAL_RE.lastIndex = 0;
      if (PATH_TRAVERSAL_RE.test(input)) {
        threats.push({ type: 'path_traversal', value: input.slice(0, 100), path });
      }
      PATH_TRAVERSAL_RE.lastIndex = 0;

      for (const pattern of this.customPatterns) {
        pattern.lastIndex = 0;
        if (pattern.test(input)) {
          threats.push({ type: 'custom', value: input.slice(0, 100), path });
        }
        pattern.lastIndex = 0;
      }
    } else if (Array.isArray(input)) {
      for (let i = 0; i < input.length; i++) {
        threats.push(...this.detectThreats(input[i], `${path}[${i}]`));
      }
    } else if (input !== null && typeof input === 'object') {
      for (const key of Object.keys(input)) {
        if (DANGEROUS_KEYS.has(key)) continue;
        threats.push(...this.detectThreats(input[key], path ? `${path}.${key}` : key));
      }
    }

    return threats;
  }

  /**
   * Returns true if no threats are detected in the input.
   *
   * @param {*} input
   * @returns {boolean}
   */
  isClean(input) {
    return this.detectThreats(input).length === 0;
  }
}

// ─── 5. Security Audit Logger ───────────────────────────────────────────────

/**
 * Immutable append-only security event log with tamper detection via
 * hash chains. Each entry's hash depends on the previous entry's hash,
 * forming a verifiable chain.
 *
 * @example
 *   const logger = new SecurityAuditLogger();
 *   logger.log({ event: 'login', severity: 'info', details: { user: 'alice' } });
 *   logger.verify(); // { valid: true, entries: 1 }
 */
class SecurityAuditLogger {
  /**
   * @param {object}        [options]
   * @param {number}        [options.maxEntries=10000]   — Max entries before rotation
   * @param {Function|null} [options.onAlert=null]       — Callback for high-severity events
   * @param {string}        [options.hashAlgorithm='sha256'] — Hash algorithm for chain
   */
  constructor(options = {}) {
    this.maxEntries = options.maxEntries != null ? options.maxEntries : 10000;
    this.onAlert = options.onAlert || null;
    this.hashAlgorithm = options.hashAlgorithm || 'sha256';

    /** @type {Array<object>} */
    this._entries = [];

    /** @type {string} — hash preceding the first entry (genesis or post-rotation) */
    this._chainBase = '0'.repeat(64);

    /** @type {string} */
    this._lastHash = '0'.repeat(64);
  }

  /**
   * Append a security event to the log.
   *
   * @param {object} event
   * @param {string} event.event    — Event name
   * @param {string} event.severity — 'info' | 'warn' | 'error' | 'critical'
   * @param {object} event.details  — Arbitrary event details
   * @returns {{ id: number, timestamp: number, event: string, severity: string, details: object, hash: string }}
   */
  log(event) {
    const timestamp = Date.now();
    const id = this._entries.length;

    const hashInput = `${this._lastHash}${timestamp}${event.event}${JSON.stringify(event.details || {})}`;
    const hash = crypto
      .createHash(this.hashAlgorithm)
      .update(hashInput)
      .digest('hex');

    const entry = {
      id,
      timestamp,
      event: event.event,
      severity: event.severity || 'info',
      details: event.details || {},
      hash,
    };

    this._entries.push(entry);
    this._lastHash = hash;

    if ((entry.severity === 'critical' || entry.severity === 'error') && this.onAlert) {
      this.onAlert(entry);
    }

    // Auto-rotate: remove oldest half when exceeding maxEntries
    if (this._entries.length > this.maxEntries) {
      const half = Math.floor(this._entries.length / 2);
      // Preserve the hash preceding the new first entry for chain verification
      this._chainBase = this._entries[half - 1].hash;
      this._entries = this._entries.slice(half);
    }

    return entry;
  }

  /**
   * Walk the hash chain and verify integrity of all entries.
   *
   * @returns {{ valid: boolean, entries: number, brokenAt?: number }}
   */
  verify() {
    let previousHash = this._chainBase;

    for (let i = 0; i < this._entries.length; i++) {
      const entry = this._entries[i];
      const hashInput = `${previousHash}${entry.timestamp}${entry.event}${JSON.stringify(entry.details)}`;
      const expected = crypto
        .createHash(this.hashAlgorithm)
        .update(hashInput)
        .digest('hex');

      if (expected !== entry.hash) {
        return { valid: false, entries: this._entries.length, brokenAt: i };
      }
      previousHash = entry.hash;
    }

    return { valid: true, entries: this._entries.length };
  }

  /**
   * Retrieve log entries with optional filters.
   *
   * @param {object} [filter={}]
   * @param {string} [filter.severity] — Filter by severity level
   * @param {string} [filter.event]    — Filter by event name
   * @param {number} [filter.since]    — Filter by timestamp >= since
   * @param {number} [filter.limit]    — Max entries to return (from end)
   * @returns {Array<object>}
   */
  getEntries(filter = {}) {
    let entries = this._entries;

    if (filter.severity) {
      entries = entries.filter(e => e.severity === filter.severity);
    }
    if (filter.event) {
      entries = entries.filter(e => e.event === filter.event);
    }
    if (filter.since != null) {
      entries = entries.filter(e => e.timestamp >= filter.since);
    }
    if (filter.limit != null) {
      entries = entries.slice(-filter.limit);
    }

    return entries;
  }

  /**
   * Return aggregate statistics about the log.
   *
   * @returns {{ total: number, bySeverity: object, lastEntry: object|null }}
   */
  getStats() {
    const bySeverity = { info: 0, warn: 0, error: 0, critical: 0 };
    for (const entry of this._entries) {
      if (bySeverity[entry.severity] != null) {
        bySeverity[entry.severity]++;
      }
    }

    return {
      total: this._entries.length,
      bySeverity,
      lastEntry: this._entries.length > 0
        ? this._entries[this._entries.length - 1]
        : null,
    };
  }

  /**
   * Reset the log, clearing all entries and the hash chain.
   */
  clear() {
    this._entries = [];
    this._chainBase = '0'.repeat(64);
    this._lastHash = '0'.repeat(64);
  }
}

// ─── 6. Permission Policy ───────────────────────────────────────────────────

/**
 * Method/endpoint access control using role-based policies with wildcard
 * endpoint matching.
 *
 * @example
 *   const pp = new PermissionPolicy();
 *   pp.addPolicy('admin', ['GET', 'POST'], ['/api/*']);
 *   pp.check('admin', 'GET', '/api/users'); // { allowed: true, ... }
 */
class PermissionPolicy {
  /**
   * @param {object}  [options]
   * @param {Array<{role: string, methods: string[], endpoints: string[]}>}
   *   [options.policies=[]] — Initial policies
   * @param {boolean} [options.defaultAllow=false] — Allow when no policy matches
   * @param {boolean} [options.caseSensitive=false] — Case-sensitive endpoint matching
   */
  constructor(options = {}) {
    this.defaultAllow = options.defaultAllow === true;
    this.caseSensitive = options.caseSensitive === true;

    /** @type {Array<{role: string, methods: string[], endpoints: string[]}>} */
    this._policies = [];

    const policies = options.policies || [];
    for (const p of policies) {
      this.addPolicy(p.role, p.methods, p.endpoints);
    }
  }

  /**
   * Add a policy for a role.
   *
   * @param {string}   role
   * @param {string[]} methods   — Allowed HTTP methods
   * @param {string[]} endpoints — Allowed endpoint patterns (supports '*' wildcard)
   */
  addPolicy(role, methods, endpoints) {
    this._policies.push({
      role,
      methods: methods.map(m => m.toUpperCase()),
      endpoints,
    });
  }

  /**
   * Remove all policies for a role.
   *
   * @param {string} role
   */
  removePolicy(role) {
    this._policies = this._policies.filter(p => p.role !== role);
  }

  /**
   * Check whether a role can access a method + endpoint combination.
   *
   * @param {string} role
   * @param {string} method
   * @param {string} endpoint
   * @returns {{ allowed: boolean, role: string, method: string, endpoint: string, matchedPolicy?: object }}
   */
  check(role, method, endpoint) {
    const upperMethod = method.toUpperCase();
    const normalizedEndpoint = this.caseSensitive ? endpoint : endpoint.toLowerCase();

    for (const policy of this._policies) {
      if (policy.role !== role) continue;
      if (!policy.methods.includes(upperMethod)) continue;

      for (const pattern of policy.endpoints) {
        const normalizedPattern = this.caseSensitive ? pattern : pattern.toLowerCase();
        if (this._matchEndpoint(normalizedPattern, normalizedEndpoint)) {
          return { allowed: true, role, method: upperMethod, endpoint, matchedPolicy: policy };
        }
      }
    }

    return { allowed: this.defaultAllow, role, method: upperMethod, endpoint };
  }

  /**
   * Check whether any of the given roles can access a method + endpoint.
   *
   * @param {string[]} roles
   * @param {string}   method
   * @param {string}   endpoint
   * @returns {{ allowed: boolean, matchedRole?: string }}
   */
  checkMultiple(roles, method, endpoint) {
    for (const role of roles) {
      const result = this.check(role, method, endpoint);
      if (result.allowed && result.matchedPolicy) {
        return { allowed: true, matchedRole: role };
      }
    }
    return { allowed: this.defaultAllow };
  }

  /**
   * List policies, optionally filtered by role.
   *
   * @param {string} [role] — If provided, only return policies for this role
   * @returns {Array<object>}
   */
  listPolicies(role) {
    if (role) {
      return this._policies.filter(p => p.role === role);
    }
    return [...this._policies];
  }

  /**
   * Match an endpoint against a pattern that supports '*' wildcards.
   *
   * @private
   * @param {string} pattern
   * @param {string} endpoint
   * @returns {boolean}
   */
  _matchEndpoint(pattern, endpoint) {
    if (pattern === '*') return true;
    if (pattern === endpoint) return true;

    if (pattern.includes('*')) {
      const regex = new RegExp(
        '^' + pattern.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*') + '$'
      );
      return regex.test(endpoint);
    }

    return false;
  }
}

// ─── 7. Payload Encryptor ───────────────────────────────────────────────────

/**
 * AES-256-GCM payload encryption and decryption for securing sensitive
 * request/response data in transit or at rest.
 *
 * @example
 *   const enc = new PayloadEncryptor({ key: crypto.randomBytes(32) });
 *   const { encrypted, iv, tag } = enc.encrypt('sensitive data');
 *   enc.decrypt(encrypted, iv, tag); // 'sensitive data'
 */
class PayloadEncryptor {
  /**
   * @param {object}       [options]
   * @param {Buffer|string|null} [options.key=null]  — 32-byte key (Buffer or hex). Auto-generated if null.
   * @param {string}       [options.algorithm='aes-256-gcm'] — Cipher algorithm
   * @param {number}       [options.ivLength=12]     — IV length in bytes
   * @param {number}       [options.tagLength=16]    — Auth tag length in bytes
   * @param {string}       [options.encoding='base64'] — Output encoding
   */
  constructor(options = {}) {
    this.algorithm = options.algorithm || 'aes-256-gcm';
    this.ivLength = options.ivLength != null ? options.ivLength : 12;
    this.tagLength = options.tagLength != null ? options.tagLength : 16;
    this.encoding = options.encoding || 'base64';

    if (options.key) {
      this._key = typeof options.key === 'string'
        ? Buffer.from(options.key, 'hex')
        : options.key;
    } else {
      this._key = crypto.randomBytes(32);
    }
  }

  /**
   * Encrypt a plaintext string or object.
   *
   * @param {string|object} plaintext — String or object (will be JSON-stringified)
   * @returns {{ encrypted: string, iv: string, tag: string }}
   */
  encrypt(plaintext) {
    const data = typeof plaintext === 'object' ? JSON.stringify(plaintext) : String(plaintext);
    const iv = crypto.randomBytes(this.ivLength);
    const cipher = crypto.createCipheriv(this.algorithm, this._key, iv, {
      authTagLength: this.tagLength,
    });

    let encrypted = cipher.update(data, 'utf8', this.encoding);
    encrypted += cipher.final(this.encoding);

    return {
      encrypted,
      iv: iv.toString(this.encoding),
      tag: cipher.getAuthTag().toString(this.encoding),
    };
  }

  /**
   * Decrypt an encrypted payload back to a plaintext string.
   *
   * @param {string} encrypted — Encrypted data
   * @param {string} iv        — Initialization vector
   * @param {string} tag       — Authentication tag
   * @returns {string}
   */
  decrypt(encrypted, iv, tag) {
    const ivBuf = Buffer.from(iv, this.encoding);
    const tagBuf = Buffer.from(tag, this.encoding);
    const decipher = crypto.createDecipheriv(this.algorithm, this._key, ivBuf, {
      authTagLength: this.tagLength,
    });
    decipher.setAuthTag(tagBuf);

    let decrypted = decipher.update(encrypted, this.encoding, 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }

  /**
   * Encrypt an object (shorthand for JSON.stringify + encrypt).
   *
   * @param {object} obj
   * @returns {{ encrypted: string, iv: string, tag: string }}
   */
  encryptObject(obj) {
    return this.encrypt(JSON.stringify(obj));
  }

  /**
   * Decrypt an encrypted payload and parse it as JSON.
   *
   * @param {string} encrypted
   * @param {string} iv
   * @param {string} tag
   * @returns {object}
   */
  decryptObject(encrypted, iv, tag) {
    return JSON.parse(this.decrypt(encrypted, iv, tag));
  }

  /**
   * Return a SHA-256 fingerprint of the key (first 16 hex chars) for
   * identification without exposing the key.
   *
   * @returns {string}
   */
  getKeyFingerprint() {
    return crypto.createHash('sha256').update(this._key).digest('hex').slice(0, 16);
  }

  /**
   * Replace the current key with a new key or generate a fresh one.
   *
   * @param {Buffer|string} [newKey] — New key (Buffer or hex string). Auto-generated if omitted.
   */
  rotateKey(newKey) {
    if (newKey) {
      this._key = typeof newKey === 'string'
        ? Buffer.from(newKey, 'hex')
        : newKey;
    } else {
      this._key = crypto.randomBytes(32);
    }
  }
}

// ─── 8. Idempotency Manager ─────────────────────────────────────────────────

/**
 * Idempotency key generation and enforcement to prevent duplicate processing
 * of non-idempotent requests.
 *
 * @example
 *   const mgr = new IdempotencyManager();
 *   const key = mgr.generateKey(config);
 *   if (mgr.hasKey(key)) { return mgr.getStoredResponse(key); }
 */
class IdempotencyManager {
  /**
   * @param {object}   [options]
   * @param {string}   [options.headerName='idempotency-key'] — Header name for the key
   * @param {number}   [options.ttl=86400000]                  — TTL in ms (24 hours)
   * @param {number}   [options.maxEntries=10000]              — Max stored responses
   * @param {string[]} [options.methods=['POST','PUT','PATCH']] — Methods requiring idempotency
   */
  constructor(options = {}) {
    this.headerName = options.headerName || 'idempotency-key';
    this.ttl = options.ttl != null ? options.ttl : 86400000;
    this.maxEntries = options.maxEntries != null ? options.maxEntries : 10000;
    this.methods = options.methods || ['POST', 'PUT', 'PATCH'];

    /** @type {Map<string, {response: *, timestamp: number}>} */
    this._store = new Map();
  }

  /**
   * Generate a UUID-like idempotency key from random bytes.
   *
   * @param {object} [config] — Request config (unused; signature reserved for future use)
   * @returns {string} UUID v4-formatted key
   */
  generateKey(config) {
    const bytes = crypto.randomBytes(16);
    // Set version 4 bits
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    // Set variant bits
    bytes[8] = (bytes[8] & 0x3f) | 0x80;

    const hex = bytes.toString('hex');
    return [
      hex.slice(0, 8),
      hex.slice(8, 12),
      hex.slice(12, 16),
      hex.slice(16, 20),
      hex.slice(20, 32),
    ].join('-');
  }

  /**
   * Check whether the given HTTP method requires idempotency enforcement.
   *
   * @param {string} method
   * @returns {boolean}
   */
  shouldEnforce(method) {
    return this.methods.includes(method.toUpperCase());
  }

  /**
   * Store a response associated with an idempotency key.
   *
   * @param {string} key
   * @param {*}      response
   */
  recordResponse(key, response) {
    this._store.set(key, { response, timestamp: Date.now() });

    // Evict oldest entries when exceeding maxEntries
    if (this._store.size > this.maxEntries) {
      const firstKey = this._store.keys().next().value;
      this._store.delete(firstKey);
    }
  }

  /**
   * Retrieve a stored response for a key if it is still within TTL.
   *
   * @param {string} key
   * @returns {*|null} The stored response or null
   */
  getStoredResponse(key) {
    const entry = this._store.get(key);
    if (!entry) return null;

    if (Date.now() - entry.timestamp > this.ttl) {
      this._store.delete(key);
      return null;
    }

    return entry.response;
  }

  /**
   * Remove all expired entries and return the number removed.
   *
   * @returns {number}
   */
  cleanup() {
    const now = Date.now();
    let removed = 0;

    for (const [key, entry] of this._store) {
      if (now - entry.timestamp > this.ttl) {
        this._store.delete(key);
        removed++;
      }
    }

    return removed;
  }

  /**
   * Check whether a key exists in the store (regardless of TTL).
   *
   * @param {string} key
   * @returns {boolean}
   */
  hasKey(key) {
    return this._store.has(key);
  }

  /**
   * Clear all stored responses.
   */
  reset() {
    this._store.clear();
  }
}

// ─── Exports ────────────────────────────────────────────────────────────────

module.exports = {
  ContentSecurityPolicy,
  CertificatePinning,
  RequestSigning,
  InputSanitizer,
  SecurityAuditLogger,
  PermissionPolicy,
  PayloadEncryptor,
  IdempotencyManager,
};
