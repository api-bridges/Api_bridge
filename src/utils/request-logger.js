/**
 * awsibnj v5 — Structured Request Logger
 *
 * Structured logging for API requests and responses:
 *  - Configurable log levels (debug, info, warn, error)
 *  - Automatic field redaction for sensitive data
 *  - Request/response correlation IDs
 *  - Timing information
 *  - Pluggable output transports (console, callback, buffer)
 *  - Log filtering by pattern or level
 *  - Statistics tracking
 */

// ─── LOG LEVELS ───────────────────────────────────────────────────────────────

const LOG_LEVELS = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
  silent: 4,
};

// ─── DEFAULT SENSITIVE FIELDS ─────────────────────────────────────────────────

const DEFAULT_SENSITIVE_FIELDS = new Set([
  'password', 'secret', 'token', 'authorization', 'apiKey', 'api_key',
  'accessToken', 'access_token', 'refreshToken', 'refresh_token',
  'creditCard', 'credit_card', 'ssn', 'socialSecurityNumber',
  'social_security_number', 'cvv', 'pin',
]);

// ─── REQUEST LOGGER ──────────────────────────────────────────────────────────

class RequestLogger {
  /**
   * @param {object}   options
   * @param {string}   options.level             Minimum log level: 'debug' | 'info' | 'warn' | 'error' | 'silent' (default 'info')
   * @param {Function} options.transport         Custom output handler: (logEntry) => void. Default: internal buffer.
   * @param {Array<string>} options.sensitiveFields  Additional field names to redact
   * @param {string}   options.redactWith        Replacement string for redacted fields (default '[REDACTED]')
   * @param {boolean}  options.includeBody       Include request/response bodies in logs (default true)
   * @param {boolean}  options.includeHeaders    Include request headers in logs (default false)
   * @param {number}   options.maxBodyLength     Max characters of body to log (default 10000)
   * @param {number}   options.maxBufferSize     Max entries in internal buffer (default 1000)
   */
  constructor(options = {}) {
    this.level = options.level || 'info';
    this.transport = options.transport || null;
    this.redactWith = options.redactWith || '[REDACTED]';
    this.includeBody = options.includeBody !== false;
    this.includeHeaders = options.includeHeaders || false;
    this.maxBodyLength = options.maxBodyLength || 10000;
    this.maxBufferSize = options.maxBufferSize || 1000;

    this.sensitiveFields = new Set(DEFAULT_SENSITIVE_FIELDS);
    if (Array.isArray(options.sensitiveFields)) {
      for (const f of options.sensitiveFields) {
        this.sensitiveFields.add(f);
      }
    }

    /** @type {Array<object>} Internal log buffer */
    this._buffer = [];

    this._correlationCounter = 0;

    this._stats = {
      totalLogs: 0,
      byLevel: { debug: 0, info: 0, warn: 0, error: 0 },
      redactedFields: 0,
    };
  }

  /**
   * Generate a unique correlation ID for request tracking.
   * @returns {string}
   */
  correlationId() {
    this._correlationCounter++;
    const ts = Date.now().toString(36);
    const counter = this._correlationCounter.toString(36).padStart(4, '0');
    return `req_${ts}_${counter}`;
  }

  /**
   * Log a request.
   * @param {object} req
   * @param {string} req.method       HTTP method
   * @param {string} req.url          Request URL
   * @param {object} [req.headers]    Request headers
   * @param {*}      [req.body]       Request body
   * @param {string} [req.correlationId]  Correlation ID
   * @returns {object} The log entry
   */
  logRequest(req) {
    const entry = {
      type: 'request',
      level: 'info',
      correlationId: req.correlationId || this.correlationId(),
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.url,
    };

    if (this.includeHeaders && req.headers) {
      entry.headers = this._redactObject({ ...req.headers });
    }

    if (this.includeBody && req.body !== undefined) {
      entry.body = this._prepareBody(req.body);
    }

    this._emit('info', entry);
    return entry;
  }

  /**
   * Log a response.
   * @param {object} res
   * @param {number} res.status          HTTP status code
   * @param {string} res.url             Request URL
   * @param {*}      [res.body]          Response body
   * @param {number} [res.duration]      Request duration in ms
   * @param {string} [res.correlationId] Correlation ID
   * @returns {object} The log entry
   */
  logResponse(res) {
    const level = res.status >= 500 ? 'error' : res.status >= 400 ? 'warn' : 'info';

    const entry = {
      type: 'response',
      level,
      correlationId: res.correlationId || null,
      timestamp: new Date().toISOString(),
      status: res.status,
      url: res.url,
    };

    if (res.duration !== undefined) {
      entry.duration = res.duration;
    }

    if (this.includeBody && res.body !== undefined) {
      entry.body = this._prepareBody(res.body);
    }

    this._emit(level, entry);
    return entry;
  }

  /**
   * Log an error.
   * @param {object} err
   * @param {string} err.message         Error message
   * @param {string} [err.url]           Request URL
   * @param {string} [err.correlationId] Correlation ID
   * @param {object} [err.details]       Additional error details
   * @returns {object} The log entry
   */
  logError(err) {
    const entry = {
      type: 'error',
      level: 'error',
      correlationId: err.correlationId || null,
      timestamp: new Date().toISOString(),
      message: err.message,
      url: err.url || null,
    };

    if (err.details) {
      entry.details = err.details;
    }

    this._emit('error', entry);
    return entry;
  }

  /**
   * Log a custom message at the given level.
   * @param {string} level    'debug' | 'info' | 'warn' | 'error'
   * @param {string} message  Log message
   * @param {object} [meta]   Additional metadata
   * @returns {object} The log entry
   */
  log(level, message, meta = {}) {
    const entry = {
      type: 'custom',
      level,
      timestamp: new Date().toISOString(),
      message,
      ...meta,
    };

    this._emit(level, entry);
    return entry;
  }

  /**
   * Get all buffered log entries.
   * @param {object} [filter]
   * @param {string} [filter.level]   Filter by minimum level
   * @param {string} [filter.type]    Filter by type ('request' | 'response' | 'error' | 'custom')
   * @param {string} [filter.correlationId]  Filter by correlation ID
   * @returns {Array<object>}
   */
  getEntries(filter = {}) {
    let entries = [...this._buffer];

    if (filter.level) {
      const minLevel = LOG_LEVELS[filter.level] || 0;
      entries = entries.filter(e => (LOG_LEVELS[e.level] || 0) >= minLevel);
    }

    if (filter.type) {
      entries = entries.filter(e => e.type === filter.type);
    }

    if (filter.correlationId) {
      entries = entries.filter(e => e.correlationId === filter.correlationId);
    }

    return entries;
  }

  /**
   * Clear the internal log buffer.
   */
  clear() {
    this._buffer = [];
  }

  /**
   * Redact sensitive fields from an object (shallow copy).
   * @param {object} obj
   * @returns {object} Redacted copy
   */
  redact(obj) {
    if (!obj || typeof obj !== 'object') return obj;
    return this._redactObject(Array.isArray(obj) ? [...obj] : { ...obj });
  }

  /**
   * Get logger statistics.
   * @returns {object}
   */
  getStats() {
    return {
      ...this._stats,
      byLevel: { ...this._stats.byLevel },
      bufferSize: this._buffer.length,
    };
  }

  /**
   * Reset statistics and clear buffer.
   */
  reset() {
    this._buffer = [];
    this._correlationCounter = 0;
    this._stats = {
      totalLogs: 0,
      byLevel: { debug: 0, info: 0, warn: 0, error: 0 },
      redactedFields: 0,
    };
  }

  // ─── INTERNAL HELPERS ─────────────────────────────────────────────

  /**
   * Emit a log entry if it meets the minimum level.
   * @param {string} level
   * @param {object} entry
   */
  _emit(level, entry) {
    const entryLevel = LOG_LEVELS[level] != null ? LOG_LEVELS[level] : 1;
    const minLevel = LOG_LEVELS[this.level] != null ? LOG_LEVELS[this.level] : 1;

    if (entryLevel < minLevel) return;

    this._stats.totalLogs++;
    if (this._stats.byLevel[level] !== undefined) {
      this._stats.byLevel[level]++;
    }

    // Buffer entry
    this._buffer.push(entry);
    if (this._buffer.length > this.maxBufferSize) {
      this._buffer.shift();
    }

    // Transport
    if (typeof this.transport === 'function') {
      this.transport(entry);
    }
  }

  /**
   * Deep-redact sensitive fields from an object.
   * @param {*} obj
   * @returns {*}
   */
  _redactObject(obj) {
    if (obj === null || obj === undefined) return obj;
    if (typeof obj !== 'object') return obj;

    if (Array.isArray(obj)) {
      return obj.map(item => this._redactObject(item));
    }

    const result = {};
    for (const [key, value] of Object.entries(obj)) {
      if (this.sensitiveFields.has(key) || this.sensitiveFields.has(key.toLowerCase())) {
        result[key] = this.redactWith;
        this._stats.redactedFields++;
      } else if (typeof value === 'object' && value !== null) {
        result[key] = this._redactObject(value);
      } else {
        result[key] = value;
      }
    }
    return result;
  }

  /**
   * Prepare a body for logging (truncate, redact).
   * @param {*} body
   * @returns {*}
   */
  _prepareBody(body) {
    if (body === null || body === undefined) return body;

    if (typeof body === 'string') {
      return body.length > this.maxBodyLength
        ? body.substring(0, this.maxBodyLength) + '...[truncated]'
        : body;
    }

    if (typeof body === 'object') {
      const redacted = this._redactObject(body);
      const serialized = JSON.stringify(redacted);
      if (serialized.length > this.maxBodyLength) {
        return serialized.substring(0, this.maxBodyLength) + '...[truncated]';
      }
      return redacted;
    }

    return body;
  }
}

module.exports = { RequestLogger, LOG_LEVELS };
