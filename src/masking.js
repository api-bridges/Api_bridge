/**
 * APIBridge AI v3 — Data Masking Engine
 *
 * Protects sensitive/PII fields by masking, redacting, or hashing them.
 * Built-in detection of common sensitive field patterns.
 *
 * Strategies:
 *  - redact:   Replace value with '[REDACTED]'
 *  - mask:     Show partial value ('jo**@example.com', '****1234')
 *  - hash:     SHA-256 hash of the value
 *  - replace:  Replace with a custom value
 */

const crypto = require('crypto');

// Common field names that likely contain sensitive data
const SENSITIVE_PATTERNS = [
  /password/i, /passwd/i, /pwd/i, /secret/i,
  /token/i, /api_?key/i, /auth/i, /bearer/i,
  /ssn/i, /social_?security/i,
  /credit_?card/i, /card_?number/i, /cvv/i, /cvc/i,
  /private_?key/i, /secret_?key/i,
  /^pin$/i, /access_?key/i,
];

// Patterns for partial masking
const MASK_PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^\+?[\d\s()-]{7,20}$/,
  card:  /^\d{13,19}$/,
};

class DataMasker {
  /**
   * @param {object} options
   * @param {string}   options.defaultStrategy   Default masking strategy (default 'redact')
   * @param {object}   options.fieldRules        Field-specific rules { fieldName: 'strategy' | { strategy, options } }
   * @param {boolean}  options.autoDetect        Auto-detect sensitive fields (default true)
   * @param {string}   options.redactText        Text to use for redaction (default '[REDACTED]')
   * @param {string}   options.maskChar          Character for masking (default '*')
   */
  constructor(options = {}) {
    this.defaultStrategy = options.defaultStrategy || 'redact';
    this.fieldRules = options.fieldRules || {};
    this.autoDetect = options.autoDetect !== false;
    this.redactText = options.redactText || '[REDACTED]';
    this.maskChar = options.maskChar || '*';
  }

  /**
   * Mask sensitive fields in data.
   * @param {object} data
   * @returns {object} Masked copy (original not modified)
   */
  mask(data) {
    if (data === null || data === undefined || typeof data !== 'object') return data;
    if (Array.isArray(data)) return data.map(item => this.mask(item));
    return this._maskObject(data, '');
  }

  /**
   * Check if a field name matches sensitive patterns.
   */
  isSensitive(fieldName) {
    // Explicit rule
    if (this.fieldRules[fieldName]) return true;

    // Auto-detect
    if (this.autoDetect) {
      return SENSITIVE_PATTERNS.some(pattern => pattern.test(fieldName));
    }

    return false;
  }

  /**
   * Get the masking strategy for a field.
   */
  getStrategy(fieldName) {
    const rule = this.fieldRules[fieldName];
    if (typeof rule === 'string') return rule;
    if (rule && typeof rule === 'object') return rule.strategy || this.defaultStrategy;
    return this.defaultStrategy;
  }

  _maskObject(obj, prefix) {
    const result = {};

    for (const [key, value] of Object.entries(obj)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;

      if (this.isSensitive(key)) {
        result[key] = this._applyStrategy(key, value);
      } else if (value !== null && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
        result[key] = this._maskObject(value, fullKey);
      } else if (Array.isArray(value)) {
        result[key] = value.map(item =>
          typeof item === 'object' && item !== null ? this._maskObject(item, fullKey) : item,
        );
      } else {
        result[key] = value;
      }
    }

    return result;
  }

  _applyStrategy(fieldName, value) {
    const strategy = this.getStrategy(fieldName);

    switch (strategy) {
      case 'redact':
        return this.redactText;

      case 'mask':
        return this._maskValue(value);

      case 'hash':
        return this._hashValue(value);

      case 'replace': {
        const rule = this.fieldRules[fieldName];
        return (rule && typeof rule === 'object' && rule.replaceWith !== undefined)
          ? rule.replaceWith
          : this.redactText;
      }

      default:
        return this.redactText;
    }
  }

  _maskValue(value) {
    const str = String(value);
    if (str.length <= 2) return this.maskChar.repeat(str.length);

    // Email masking: jo**@example.com
    if (MASK_PATTERNS.email.test(str)) {
      const [local, domain] = str.split('@');
      const maskedLocal = local.slice(0, 2) + this.maskChar.repeat(Math.max(local.length - 2, 2));
      return `${maskedLocal}@${domain}`;
    }

    // Phone masking: ****1234
    if (MASK_PATTERNS.phone.test(str)) {
      const digits = str.replace(/\D/g, '');
      const last4 = digits.slice(-4);
      return this.maskChar.repeat(Math.max(digits.length - 4, 4)) + last4;
    }

    // Card masking: ****1234
    if (MASK_PATTERNS.card.test(str)) {
      return this.maskChar.repeat(str.length - 4) + str.slice(-4);
    }

    // Generic masking: show first and last character
    if (str.length <= 4) return str[0] + this.maskChar.repeat(str.length - 1);
    return str[0] + this.maskChar.repeat(str.length - 2) + str[str.length - 1];
  }

  _hashValue(value) {
    return crypto.createHash('sha256').update(String(value)).digest('hex');
  }
}

module.exports = { DataMasker, SENSITIVE_PATTERNS };
