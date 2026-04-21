/**
 * yarou v18 — Elite Security Module
 *
 * Next-generation elite-grade security utilities for protecting API requests
 * and responses with zero-trust architecture, threat intelligence, encrypted
 * vaults, adaptive rate limiting, and mutual TLS management.
 *
 * Components:
 *   - ZeroTrustEngine        — Continuous verification with trust scoring
 *   - ThreatIntelligence     — Real-time threat feed & IP reputation tracking
 *   - SecureSessionManager   — Cryptographic session tokens with rotation
 *   - RequestIntegrityChain  — Blockchain-inspired request hash chain
 *   - AdaptiveRateLimiter    — ML-inspired anomaly detection rate limiting
 *   - SecurityHeadersManager — OWASP-recommended security headers injection
 *   - EncryptedConfigVault   — AES-256-GCM encrypted config storage
 *   - MutualTLSManager       — mTLS client certificate validation
 *
 * Usage:
 *   const { ZeroTrustEngine, EncryptedConfigVault } = require('./security-elite');
 *   const engine = new ZeroTrustEngine();
 *   console.log(engine.evaluate({ contextId: 'ctx-1', ip: '1.2.3.4' }));
 */

'use strict';

const crypto = require('crypto');

// ─── 1. ZeroTrustEngine ────────────────────────────────────────────────────

/** Suspicious HTTP methods that reduce trust. */
const SUSPICIOUS_METHODS = new Set(['DELETE', 'PATCH', 'TRACE', 'CONNECT']);

/**
 * Continuous verification engine that evaluates every request against a
 * dynamic trust score.  No request is implicitly trusted — each one must
 * earn enough score to pass the configured threshold.
 *
 * @example
 *   const engine = new ZeroTrustEngine({ trustThreshold: 40 });
 *   const result = engine.evaluate({ contextId: 'u1', ip: '10.0.0.1' });
 *   // { allowed: false, score: 0, factors: [...] }
 */
class ZeroTrustEngine {
  /**
   * @param {object} [options]
   * @param {number} [options.defaultTrustScore=0]   — initial trust score
   * @param {number} [options.trustThreshold=50]     — minimum score to allow
   * @param {number} [options.maxTrustScore=100]     — ceiling for trust score
   * @param {number} [options.decayRate=5]           — points lost per interval
   * @param {number} [options.decayIntervalMs=60000] — decay interval in ms
   */
  constructor(options = {}) {
    this.defaultTrustScore = options.defaultTrustScore != null ? options.defaultTrustScore : 0;
    this.trustThreshold = options.trustThreshold != null ? options.trustThreshold : 50;
    this.maxTrustScore = options.maxTrustScore != null ? options.maxTrustScore : 100;
    this.decayRate = options.decayRate != null ? options.decayRate : 5;
    this.decayIntervalMs = options.decayIntervalMs != null ? options.decayIntervalMs : 60000;

    /** @type {Map<string, { score: number, lastActivity: number, factors: string[], ip?: string, userAgent?: string }>} */
    this._trustStore = new Map();
  }

  /**
   * Evaluate a request context and return whether it is allowed based on the
   * accumulated trust score.
   *
   * @param {object} context
   * @param {string} context.contextId — unique context identifier
   * @param {string} [context.ip]
   * @param {string} [context.userAgent]
   * @param {string} [context.method]
   * @param {string} [context.url]
   * @returns {{ allowed: boolean, score: number, factors: string[] }}
   */
  evaluate(context) {
    const { contextId, ip, userAgent, method } = context;
    const now = Date.now();
    const factors = [];
    let entry = this._trustStore.get(contextId);

    let score = this.defaultTrustScore;

    if (entry) {
      score = entry.score;
      factors.push('known_context (+20)');
      score += 20;

      // Time-based decay
      const elapsed = now - entry.lastActivity;
      if (elapsed > 0) {
        const intervals = Math.floor(elapsed / this.decayIntervalMs);
        if (intervals > 0) {
          const decay = intervals * this.decayRate;
          score -= decay;
          if (decay > 0) {
            factors.push(`time_decay (-${decay})`);
          }
        }
      }

      if (ip && entry.ip === ip) {
        factors.push('consistent_ip (+10)');
        score += 10;
      }

      if (userAgent && entry.userAgent === userAgent) {
        factors.push('consistent_user_agent (+10)');
        score += 10;
      }
    }

    if (method && !SUSPICIOUS_METHODS.has(method.toUpperCase())) {
      factors.push('safe_method (+10)');
      score += 10;
    }

    // Clamp score
    score = Math.max(0, Math.min(score, this.maxTrustScore));

    // Persist entry
    this._trustStore.set(contextId, {
      score,
      lastActivity: now,
      factors,
      ip: ip || (entry && entry.ip) || undefined,
      userAgent: userAgent || (entry && entry.userAgent) || undefined,
    });

    return {
      allowed: score >= this.trustThreshold,
      score,
      factors,
    };
  }

  /**
   * Manually adjust the trust score for a context.
   *
   * @param {string} contextId
   * @param {number} delta   — positive or negative adjustment
   * @param {string} reason  — human-readable reason for the change
   */
  updateTrust(contextId, delta, reason) {
    const entry = this._trustStore.get(contextId) || {
      score: this.defaultTrustScore,
      lastActivity: Date.now(),
      factors: [],
    };

    entry.score = Math.max(0, Math.min(entry.score + delta, this.maxTrustScore));
    entry.factors.push(`manual_adjust(${delta > 0 ? '+' : ''}${delta}): ${reason}`);
    entry.lastActivity = Date.now();
    this._trustStore.set(contextId, entry);
  }

  /**
   * Revoke all trust for a context, removing it from the store.
   *
   * @param {string} contextId
   */
  revokeTrust(contextId) {
    this._trustStore.delete(contextId);
  }

  /**
   * Return the stored trust information for a context.
   *
   * @param {string} contextId
   * @returns {{ score: number, lastActivity: number, factors: string[] } | null}
   */
  getTrustInfo(contextId) {
    return this._trustStore.get(contextId) || null;
  }

  /**
   * Clear all trust data.
   */
  reset() {
    this._trustStore.clear();
  }
}

// ─── 2. ThreatIntelligence ─────────────────────────────────────────────────

/** Common attack patterns detected in header values. */
const HEADER_ATTACK_PATTERNS = [
  { re: /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER)\b\s)/i, label: 'sql_injection' },
  { re: /\.\.[/\\]/, label: 'path_traversal' },
  { re: /<script\b/i, label: 'xss_attempt' },
];

/**
 * Real-time threat assessment engine with IP reputation tracking,
 * pattern-based blocking, and automatic escalation.
 *
 * @example
 *   const intel = new ThreatIntelligence({ blockedIPs: ['192.168.1.100'] });
 *   const result = intel.assess({ ip: '192.168.1.100', url: '/api' });
 *   // { threat: true, level: 'critical', reasons: [...], blocked: true }
 */
class ThreatIntelligence {
  /**
   * @param {object}   [options]
   * @param {string[]} [options.blockedIPs=[]]            — known bad IPs
   * @param {Array<RegExp|string>} [options.blockedPatterns=[]] — URL block patterns
   * @param {number}   [options.suspiciousThreshold=5]    — events before auto-block
   * @param {boolean}  [options.autoBlock=true]            — auto-block on threshold
   */
  constructor(options = {}) {
    this._blockedIPs = new Set(options.blockedIPs || []);
    this._blockedPatterns = (options.blockedPatterns || []).map(
      p => (p instanceof RegExp ? p : new RegExp(p))
    );
    this.suspiciousThreshold = options.suspiciousThreshold != null
      ? options.suspiciousThreshold
      : 5;
    this.autoBlock = options.autoBlock !== false;

    /** @type {Map<string, { count: number, events: Array<{ event: string, timestamp: number }>, blocked: boolean }>} */
    this._activityLog = new Map();
  }

  /**
   * Assess a request for threats.
   *
   * @param {object} request
   * @param {string} request.ip
   * @param {string} [request.url]
   * @param {string} [request.method]
   * @param {object} [request.headers]
   * @returns {{ threat: boolean, level: string, reasons: string[], blocked: boolean }}
   */
  assess(request) {
    const { ip, url, headers } = request;
    const reasons = [];
    let level = 'none';
    let blocked = false;

    // Check IP blocklist
    if (this._blockedIPs.has(ip)) {
      reasons.push('ip_blocked');
      level = 'critical';
      blocked = true;
    }

    // Check activity-based block
    const activity = this._activityLog.get(ip);
    if (activity && activity.blocked) {
      reasons.push('auto_blocked');
      if (level !== 'critical') level = 'critical';
      blocked = true;
    }

    // Check URL patterns
    if (url) {
      for (const pattern of this._blockedPatterns) {
        if (pattern.test(url)) {
          reasons.push(`blocked_pattern: ${pattern}`);
          if (level === 'none') level = 'high';
          pattern.lastIndex = 0;
        }
      }
    }

    // Check suspicious activity count
    if (activity && activity.count >= this.suspiciousThreshold && !blocked) {
      reasons.push(`suspicious_activity_count: ${activity.count}`);
      if (level === 'none' || level === 'low') level = 'medium';
    }

    // Check header attack patterns
    if (headers) {
      for (const value of Object.values(headers)) {
        const strValue = String(value);
        for (const { re, label } of HEADER_ATTACK_PATTERNS) {
          if (re.test(strValue)) {
            reasons.push(`header_attack: ${label}`);
            if (level === 'none' || level === 'low') level = 'high';
            re.lastIndex = 0;
          }
        }
      }
    }

    const threat = reasons.length > 0;
    if (threat && level === 'none') level = 'low';

    return { threat, level, reasons, blocked };
  }

  /**
   * Report a suspicious activity event for an IP.
   *
   * @param {string} ip
   * @param {string} event — description of the event
   */
  reportActivity(ip, event) {
    let entry = this._activityLog.get(ip);
    if (!entry) {
      entry = { count: 0, events: [], blocked: false };
      this._activityLog.set(ip, entry);
    }

    entry.count += 1;
    entry.events.push({ event, timestamp: Date.now() });

    if (this.autoBlock && entry.count >= this.suspiciousThreshold) {
      entry.blocked = true;
    }
  }

  /**
   * Add an IP to the blocklist.
   *
   * @param {string} ip
   */
  blockIP(ip) {
    this._blockedIPs.add(ip);
  }

  /**
   * Remove an IP from the blocklist.
   *
   * @param {string} ip
   */
  unblockIP(ip) {
    this._blockedIPs.delete(ip);
    const entry = this._activityLog.get(ip);
    if (entry) {
      entry.blocked = false;
    }
  }

  /**
   * Check whether an IP is currently blocked.
   *
   * @param {string} ip
   * @returns {boolean}
   */
  isBlocked(ip) {
    if (this._blockedIPs.has(ip)) return true;
    const entry = this._activityLog.get(ip);
    return !!(entry && entry.blocked);
  }

  /**
   * Return the activity log for an IP.
   *
   * @param {string} ip
   * @returns {{ count: number, events: Array, blocked: boolean } | null}
   */
  getActivityLog(ip) {
    return this._activityLog.get(ip) || null;
  }

  /**
   * Add a URL pattern to the blocklist.
   *
   * @param {RegExp|string} pattern
   */
  addPattern(pattern) {
    this._blockedPatterns.push(pattern instanceof RegExp ? pattern : new RegExp(pattern));
  }

  /**
   * Clear all state (blocked IPs, patterns, activity logs).
   */
  reset() {
    this._blockedIPs.clear();
    this._blockedPatterns = [];
    this._activityLog.clear();
  }
}

// ─── 3. SecureSessionManager ───────────────────────────────────────────────

/**
 * Cryptographic session management with token rotation, binding to
 * client properties (IP / User-Agent), and automatic cleanup.
 *
 * @example
 *   const mgr = new SecureSessionManager();
 *   const { token } = mgr.createSession({ contextId: 'u1', ip: '10.0.0.1' });
 *   mgr.validateSession(token, { ip: '10.0.0.1' }); // { valid: true, ... }
 */
class SecureSessionManager {
  /**
   * @param {object}  [options]
   * @param {number}  [options.tokenLength=32]        — bytes for token
   * @param {number}  [options.maxAge=3600000]        — session TTL in ms
   * @param {number}  [options.rotationInterval=900000] — rotation interval ms
   * @param {number}  [options.maxSessions=10000]     — max concurrent sessions
   * @param {boolean} [options.bindToIP=true]          — bind session to IP
   * @param {boolean} [options.bindToUserAgent=true]   — bind to User-Agent
   */
  constructor(options = {}) {
    this.tokenLength = options.tokenLength != null ? options.tokenLength : 32;
    this.maxAge = options.maxAge != null ? options.maxAge : 3600000;
    this.rotationInterval = options.rotationInterval != null ? options.rotationInterval : 900000;
    this.maxSessions = options.maxSessions != null ? options.maxSessions : 10000;
    this.bindToIP = options.bindToIP !== false;
    this.bindToUserAgent = options.bindToUserAgent !== false;

    /** @type {Map<string, { contextId: string, ip: string, userAgent: string, createdAt: number, lastRotation: number, rotationCount: number, metadata: object }>} */
    this._sessions = new Map();
  }

  /**
   * Create a new session and return the token with its expiry.
   *
   * @param {object} context
   * @param {string} context.contextId
   * @param {string} [context.ip]
   * @param {string} [context.userAgent]
   * @param {object} [context.metadata]
   * @returns {{ token: string, expiresAt: number }}
   */
  createSession(context) {
    if (this._sessions.size >= this.maxSessions) {
      this.cleanup();
      if (this._sessions.size >= this.maxSessions) {
        throw new Error('SESSION_LIMIT: Maximum concurrent sessions reached');
      }
    }

    const token = crypto.randomBytes(this.tokenLength).toString('hex');
    const now = Date.now();

    this._sessions.set(token, {
      contextId: context.contextId,
      ip: context.ip || '',
      userAgent: context.userAgent || '',
      createdAt: now,
      lastRotation: now,
      rotationCount: 0,
      metadata: context.metadata || {},
    });

    return { token, expiresAt: now + this.maxAge };
  }

  /**
   * Validate an existing session token against the provided context.
   *
   * @param {string} token
   * @param {object} context
   * @param {string} [context.ip]
   * @param {string} [context.userAgent]
   * @returns {{ valid: boolean, reason?: string, needsRotation: boolean }}
   */
  validateSession(token, context = {}) {
    const session = this._sessions.get(token);
    if (!session) {
      return { valid: false, reason: 'Session not found', needsRotation: false };
    }

    const now = Date.now();

    if (now - session.createdAt > this.maxAge) {
      this._sessions.delete(token);
      return { valid: false, reason: 'Session expired', needsRotation: false };
    }

    if (this.bindToIP && context.ip && session.ip && context.ip !== session.ip) {
      return { valid: false, reason: 'IP mismatch', needsRotation: false };
    }

    if (this.bindToUserAgent && context.userAgent && session.userAgent && context.userAgent !== session.userAgent) {
      return { valid: false, reason: 'User-Agent mismatch', needsRotation: false };
    }

    const needsRotation = (now - session.lastRotation) > this.rotationInterval;

    return { valid: true, needsRotation };
  }

  /**
   * Rotate a session token: generate a new token, copy the session data,
   * delete the old token, and increment the rotation count.
   *
   * @param {string} oldToken
   * @returns {string} The new token
   */
  rotateSession(oldToken) {
    const session = this._sessions.get(oldToken);
    if (!session) {
      throw new Error('SESSION_NOT_FOUND: Cannot rotate unknown session');
    }

    const newToken = crypto.randomBytes(this.tokenLength).toString('hex');
    session.lastRotation = Date.now();
    session.rotationCount += 1;

    this._sessions.set(newToken, session);
    this._sessions.delete(oldToken);

    return newToken;
  }

  /**
   * Revoke (delete) a single session.
   *
   * @param {string} token
   */
  revokeSession(token) {
    this._sessions.delete(token);
  }

  /**
   * Revoke all sessions belonging to a context.
   *
   * @param {string} contextId
   */
  revokeAllSessions(contextId) {
    for (const [token, session] of this._sessions) {
      if (session.contextId === contextId) {
        this._sessions.delete(token);
      }
    }
  }

  /**
   * Return session information for a token.
   *
   * @param {string} token
   * @returns {object|null}
   */
  getSession(token) {
    return this._sessions.get(token) || null;
  }

  /**
   * Remove all expired sessions.
   *
   * @returns {number} The number of sessions removed
   */
  cleanup() {
    const now = Date.now();
    let removed = 0;
    for (const [token, session] of this._sessions) {
      if (now - session.createdAt > this.maxAge) {
        this._sessions.delete(token);
        removed += 1;
      }
    }
    return removed;
  }

  /**
   * Return the number of active (non-expired) sessions.
   *
   * @returns {number}
   */
  getActiveCount() {
    return this._sessions.size;
  }
}

// ─── 4. RequestIntegrityChain ──────────────────────────────────────────────

/**
 * Blockchain-inspired hash chain that links every request to the previous
 * one, providing a tamper-evident audit trail.
 *
 * @example
 *   const chain = new RequestIntegrityChain();
 *   chain.addRequest({ method: 'GET', url: '/api', timestamp: Date.now() });
 *   chain.verify(); // { valid: true, chainLength: 1 }
 */
class RequestIntegrityChain {
  /**
   * @param {object} [options]
   * @param {string} [options.algorithm='sha256'] — hash algorithm
   * @param {number} [options.maxChainLength=10000] — max entries before rotation
   */
  constructor(options = {}) {
    this.algorithm = options.algorithm || 'sha256';
    this.maxChainLength = options.maxChainLength != null ? options.maxChainLength : 10000;

    /** @type {Array<{ hash: string, previousHash: string, request: object, index: number }>} */
    this._chain = [];
    this._previousHash = '0'.repeat(64);
  }

  /**
   * Add a request to the chain.
   *
   * @param {object} request
   * @param {string} request.method
   * @param {string} request.url
   * @param {number} [request.timestamp]
   * @param {object} [request.headers]
   * @param {string} [request.bodyHash]
   * @returns {{ hash: string, previousHash: string, request: object, index: number }}
   */
  addRequest(request) {
    if (this._chain.length >= this.maxChainLength) {
      throw new Error('CHAIN_LIMIT: Maximum chain length reached — rotate the chain');
    }

    const method = request.method || '';
    const url = request.url || '';
    const timestamp = request.timestamp != null ? String(request.timestamp) : '';
    const bodyHash = request.bodyHash || '';

    const data = this._previousHash + method + url + timestamp + bodyHash;
    const hash = crypto.createHash(this.algorithm).update(data).digest('hex');

    const entry = {
      hash,
      previousHash: this._previousHash,
      request,
      index: this._chain.length,
    };

    this._chain.push(entry);
    this._previousHash = hash;

    return entry;
  }

  /**
   * Walk the entire chain and verify every hash link.
   *
   * @returns {{ valid: boolean, brokenAt?: number, chainLength: number }}
   */
  verify() {
    let previousHash = '0'.repeat(64);

    for (let i = 0; i < this._chain.length; i++) {
      const entry = this._chain[i];

      if (entry.previousHash !== previousHash) {
        return { valid: false, brokenAt: i, chainLength: this._chain.length };
      }

      const { method, url, timestamp, bodyHash } = entry.request;
      const data = previousHash
        + (method || '')
        + (url || '')
        + (timestamp != null ? String(timestamp) : '')
        + (bodyHash || '');
      const computed = crypto.createHash(this.algorithm).update(data).digest('hex');

      if (computed !== entry.hash) {
        return { valid: false, brokenAt: i, chainLength: this._chain.length };
      }

      previousHash = entry.hash;
    }

    return { valid: true, chainLength: this._chain.length };
  }

  /**
   * Verify a single entry by index.
   *
   * @param {number} index
   * @returns {{ valid: boolean }}
   */
  verifyEntry(index) {
    if (index < 0 || index >= this._chain.length) {
      return { valid: false };
    }

    const entry = this._chain[index];
    const expectedPrev = index === 0 ? '0'.repeat(64) : this._chain[index - 1].hash;

    if (entry.previousHash !== expectedPrev) {
      return { valid: false };
    }

    const { method, url, timestamp, bodyHash } = entry.request;
    const data = entry.previousHash
      + (method || '')
      + (url || '')
      + (timestamp != null ? String(timestamp) : '')
      + (bodyHash || '');
    const computed = crypto.createHash(this.algorithm).update(data).digest('hex');

    return { valid: computed === entry.hash };
  }

  /**
   * Return a shallow copy of the full chain.
   *
   * @returns {Array<{ hash: string, previousHash: string, request: object, index: number }>}
   */
  getChain() {
    return this._chain.slice();
  }

  /**
   * Return a single chain entry by index.
   *
   * @param {number} index
   * @returns {{ hash: string, previousHash: string, request: object, index: number } | null}
   */
  getEntry(index) {
    return this._chain[index] || null;
  }

  /**
   * Return the current chain length.
   *
   * @returns {number}
   */
  getLength() {
    return this._chain.length;
  }

  /**
   * Return the hash of the most recent entry (chain head).
   *
   * @returns {string}
   */
  getLatestHash() {
    return this._previousHash;
  }

  /**
   * Clear the chain and reset the previous hash to the genesis value.
   */
  reset() {
    this._chain = [];
    this._previousHash = '0'.repeat(64);
  }
}

// ─── 5. AdaptiveRateLimiter ────────────────────────────────────────────────

/**
 * ML-inspired adaptive rate limiter that adjusts per-key limits based on
 * observed traffic patterns and flags statistical anomalies.
 *
 * @example
 *   const limiter = new AdaptiveRateLimiter({ baseRate: 60 });
 *   const result = limiter.acquire('user-123');
 *   // { allowed: true, remaining: 59, anomaly: false, currentRate: 60 }
 */
class AdaptiveRateLimiter {
  /**
   * @param {object} [options]
   * @param {number} [options.baseRate=100]          — base max requests per window
   * @param {number} [options.windowMs=60000]        — base window in ms
   * @param {number} [options.burstMultiplier=1.5]   — burst allowance multiplier
   * @param {number} [options.anomalyThreshold=2.0]  — std-dev threshold for anomaly
   * @param {number} [options.adaptationRate=0.1]    — how fast rates adapt (0–1)
   * @param {number} [options.minRate=10]            — minimum allowed rate
   * @param {number} [options.maxRate=1000]          — maximum allowed rate
   */
  constructor(options = {}) {
    this.baseRate = options.baseRate != null ? options.baseRate : 100;
    this.windowMs = options.windowMs != null ? options.windowMs : 60000;
    this.burstMultiplier = options.burstMultiplier != null ? options.burstMultiplier : 1.5;
    this.anomalyThreshold = options.anomalyThreshold != null ? options.anomalyThreshold : 2.0;
    this.adaptationRate = options.adaptationRate != null ? options.adaptationRate : 0.1;
    this.minRate = options.minRate != null ? options.minRate : 10;
    this.maxRate = options.maxRate != null ? options.maxRate : 1000;

    /** @type {Map<string, { tokens: number, lastRefill: number, requestHistory: number[], meanRate: number, stdDev: number, adaptedRate: number }>} */
    this._buckets = new Map();
  }

  /**
   * Try to acquire a token for the given key.
   *
   * @param {string} key
   * @returns {{ allowed: boolean, remaining: number, anomaly: boolean, currentRate: number }}
   */
  acquire(key) {
    const now = Date.now();
    let bucket = this._buckets.get(key);

    if (!bucket) {
      bucket = {
        tokens: this.baseRate,
        lastRefill: now,
        requestHistory: [],
        meanRate: this.baseRate,
        stdDev: 0,
        adaptedRate: this.baseRate,
      };
      this._buckets.set(key, bucket);
    }

    this._refillBucket(bucket);

    // Record request timestamp and update statistics
    bucket.requestHistory.push(now);
    this._updateStatistics(bucket);

    // Anomaly detection
    const recentWindow = bucket.requestHistory.filter(t => t > now - this.windowMs);
    const currentRequestRate = recentWindow.length;
    const anomaly = bucket.stdDev > 0 &&
      currentRequestRate > bucket.meanRate + this.anomalyThreshold * bucket.stdDev;

    // Token check
    const maxTokens = Math.floor(bucket.adaptedRate * this.burstMultiplier);
    const allowed = bucket.tokens >= 1;
    if (allowed) {
      bucket.tokens -= 1;
    }

    return {
      allowed,
      remaining: Math.max(0, Math.floor(bucket.tokens)),
      anomaly,
      currentRate: Math.floor(bucket.adaptedRate),
    };
  }

  /**
   * Return statistics for a key.
   *
   * @param {string} key
   * @returns {{ currentRate: number, meanRate: number, stdDev: number, anomalyDetected: boolean, requestCount: number } | null}
   */
  getStats(key) {
    const bucket = this._buckets.get(key);
    if (!bucket) return null;

    const now = Date.now();
    const recentWindow = bucket.requestHistory.filter(t => t > now - this.windowMs);
    const currentRequestRate = recentWindow.length;
    const anomalyDetected = bucket.stdDev > 0 &&
      currentRequestRate > bucket.meanRate + this.anomalyThreshold * bucket.stdDev;

    return {
      currentRate: Math.floor(bucket.adaptedRate),
      meanRate: bucket.meanRate,
      stdDev: bucket.stdDev,
      anomalyDetected,
      requestCount: bucket.requestHistory.length,
    };
  }

  /**
   * Manually override the adapted rate for a key.
   *
   * @param {string} key
   * @param {number} newRate
   */
  adjustRate(key, newRate) {
    const bucket = this._buckets.get(key);
    if (bucket) {
      bucket.adaptedRate = Math.max(this.minRate, Math.min(newRate, this.maxRate));
    }
  }

  /**
   * Reset a specific key's bucket.
   *
   * @param {string} key
   */
  resetKey(key) {
    this._buckets.delete(key);
  }

  /**
   * Clear all buckets.
   */
  reset() {
    this._buckets.clear();
  }

  /**
   * Refill tokens based on elapsed time since last refill.
   *
   * @param {object} bucket
   * @private
   */
  _refillBucket(bucket) {
    const now = Date.now();
    const elapsed = now - bucket.lastRefill;
    const maxTokens = Math.floor(bucket.adaptedRate * this.burstMultiplier);
    const tokensToAdd = (elapsed / this.windowMs) * bucket.adaptedRate;

    bucket.tokens = Math.min(maxTokens, bucket.tokens + tokensToAdd);
    bucket.lastRefill = now;
  }

  /**
   * Recalculate mean and standard deviation from request history within
   * the recent window, then adapt the rate accordingly.
   *
   * @param {object} bucket
   * @private
   */
  _updateStatistics(bucket) {
    const now = Date.now();

    // Keep only requests within the last 10 windows for statistics
    const statsWindow = this.windowMs * 10;
    bucket.requestHistory = bucket.requestHistory.filter(t => t > now - statsWindow);

    if (bucket.requestHistory.length < 2) return;

    // Compute per-window counts for the last several windows
    const windowCount = Math.min(10, Math.ceil((now - bucket.requestHistory[0]) / this.windowMs));
    const counts = new Array(Math.max(1, windowCount)).fill(0);

    for (const ts of bucket.requestHistory) {
      const idx = Math.min(
        counts.length - 1,
        Math.floor((now - ts) / this.windowMs)
      );
      counts[counts.length - 1 - idx] += 1;
    }

    const mean = counts.reduce((s, c) => s + c, 0) / counts.length;
    const variance = counts.reduce((s, c) => s + (c - mean) ** 2, 0) / counts.length;
    const stdDev = Math.sqrt(variance);

    bucket.meanRate = mean;
    bucket.stdDev = stdDev;

    // Adapt rate: move adapted rate towards observed mean
    const target = Math.max(this.minRate, Math.min(mean * 1.2, this.maxRate));
    bucket.adaptedRate = bucket.adaptedRate * (1 - this.adaptationRate) +
      target * this.adaptationRate;
    bucket.adaptedRate = Math.max(this.minRate, Math.min(bucket.adaptedRate, this.maxRate));
  }
}

// ─── 6. SecurityHeadersManager ─────────────────────────────────────────────

/**
 * Generates and manages OWASP-recommended security headers for HTTP
 * responses, providing a comprehensive defence-in-depth strategy.
 *
 * @example
 *   const headers = new SecurityHeadersManager();
 *   headers.buildHeaders();
 *   // { 'Strict-Transport-Security': 'max-age=31536000; includeSubDomains', ... }
 */
class SecurityHeadersManager {
  /**
   * @param {object}  [options]
   * @param {object}  [options.hsts]                          — HSTS config
   * @param {number}  [options.hsts.maxAge=31536000]
   * @param {boolean} [options.hsts.includeSubDomains=true]
   * @param {boolean} [options.hsts.preload=false]
   * @param {string}  [options.xFrameOptions='DENY']
   * @param {boolean} [options.xContentTypeOptions=true]      — adds 'nosniff'
   * @param {string}  [options.referrerPolicy='strict-origin-when-cross-origin']
   * @param {object}  [options.permissionsPolicy]             — feature policies
   * @param {string}  [options.crossOriginEmbedderPolicy='require-corp']
   * @param {string}  [options.crossOriginOpenerPolicy='same-origin']
   * @param {string}  [options.crossOriginResourcePolicy='same-origin']
   * @param {boolean} [options.xDNSPrefetchControl=false]     — false = off
   * @param {boolean} [options.xDownloadOptions=true]         — 'noopen'
   * @param {string}  [options.xPermittedCrossDomainPolicies='none']
   * @param {object}  [options.customHeaders={}]
   */
  constructor(options = {}) {
    const hsts = options.hsts || {};
    this.hsts = {
      maxAge: hsts.maxAge != null ? hsts.maxAge : 31536000,
      includeSubDomains: hsts.includeSubDomains !== false,
      preload: hsts.preload === true,
    };
    this.xFrameOptions = options.xFrameOptions || 'DENY';
    this.xContentTypeOptions = options.xContentTypeOptions !== false;
    this.referrerPolicy = options.referrerPolicy || 'strict-origin-when-cross-origin';
    this.permissionsPolicy = options.permissionsPolicy || {
      camera: [],
      microphone: [],
      geolocation: [],
    };
    this.crossOriginEmbedderPolicy = options.crossOriginEmbedderPolicy || 'require-corp';
    this.crossOriginOpenerPolicy = options.crossOriginOpenerPolicy || 'same-origin';
    this.crossOriginResourcePolicy = options.crossOriginResourcePolicy || 'same-origin';
    this.xDNSPrefetchControl = options.xDNSPrefetchControl === true;
    this.xDownloadOptions = options.xDownloadOptions !== false;
    this.xPermittedCrossDomainPolicies = options.xPermittedCrossDomainPolicies || 'none';
    this.customHeaders = options.customHeaders ? { ...options.customHeaders } : {};
  }

  /**
   * Build all configured security headers as a key-value object.
   *
   * @returns {object}
   */
  buildHeaders() {
    const headers = {};

    // HSTS
    let hstsValue = `max-age=${this.hsts.maxAge}`;
    if (this.hsts.includeSubDomains) hstsValue += '; includeSubDomains';
    if (this.hsts.preload) hstsValue += '; preload';
    headers['Strict-Transport-Security'] = hstsValue;

    // Frame options
    headers['X-Frame-Options'] = this.xFrameOptions;

    // Content type options
    if (this.xContentTypeOptions) {
      headers['X-Content-Type-Options'] = 'nosniff';
    }

    // Referrer policy
    headers['Referrer-Policy'] = this.referrerPolicy;

    // Permissions policy
    const ppParts = [];
    for (const [feature, allowList] of Object.entries(this.permissionsPolicy)) {
      ppParts.push(`${feature}=(${allowList.join(' ')})`);
    }
    if (ppParts.length > 0) {
      headers['Permissions-Policy'] = ppParts.join(', ');
    }

    // Cross-origin policies
    headers['Cross-Origin-Embedder-Policy'] = this.crossOriginEmbedderPolicy;
    headers['Cross-Origin-Opener-Policy'] = this.crossOriginOpenerPolicy;
    headers['Cross-Origin-Resource-Policy'] = this.crossOriginResourcePolicy;

    // DNS prefetch control
    headers['X-DNS-Prefetch-Control'] = this.xDNSPrefetchControl ? 'on' : 'off';

    // Download options
    if (this.xDownloadOptions) {
      headers['X-Download-Options'] = 'noopen';
    }

    // Permitted cross-domain policies
    headers['X-Permitted-Cross-Domain-Policies'] = this.xPermittedCrossDomainPolicies;

    // Custom headers
    for (const [name, value] of Object.entries(this.customHeaders)) {
      headers[name] = value;
    }

    return headers;
  }

  /**
   * Get the value of a single header by name.
   *
   * @param {string} name
   * @returns {string|undefined}
   */
  getHeader(name) {
    return this.buildHeaders()[name];
  }

  /**
   * Set or override a custom header.
   *
   * @param {string} name
   * @param {string} value
   */
  setHeader(name, value) {
    this.customHeaders[name] = value;
  }

  /**
   * Remove a custom header.
   *
   * @param {string} name
   */
  removeHeader(name) {
    delete this.customHeaders[name];
  }

  /**
   * Merge security headers into an existing response headers object.
   *
   * @param {object} responseHeaders — existing headers
   * @returns {object} The merged headers
   */
  applyToResponse(responseHeaders) {
    const securityHeaders = this.buildHeaders();
    return Object.assign({}, responseHeaders, securityHeaders);
  }

  /**
   * Validate the current header configuration and return a security score.
   *
   * @returns {{ secure: boolean, warnings: string[], score: number }}
   */
  validate() {
    const warnings = [];
    let score = 0;

    // HSTS (20 points)
    if (this.hsts.maxAge >= 31536000) {
      score += 10;
    } else {
      warnings.push('HSTS max-age should be at least 31536000 (1 year)');
    }
    if (this.hsts.includeSubDomains) {
      score += 5;
    } else {
      warnings.push('HSTS should include subdomains');
    }
    if (this.hsts.preload) {
      score += 5;
    } else {
      warnings.push('Consider enabling HSTS preload');
    }

    // Frame options (10 points)
    if (this.xFrameOptions === 'DENY' || this.xFrameOptions === 'SAMEORIGIN') {
      score += 10;
    } else {
      warnings.push('X-Frame-Options should be DENY or SAMEORIGIN');
    }

    // Content type options (10 points)
    if (this.xContentTypeOptions) {
      score += 10;
    } else {
      warnings.push('X-Content-Type-Options nosniff should be enabled');
    }

    // Referrer policy (10 points)
    const strictPolicies = ['no-referrer', 'strict-origin', 'strict-origin-when-cross-origin'];
    if (strictPolicies.includes(this.referrerPolicy)) {
      score += 10;
    } else {
      warnings.push('Referrer-Policy should use a strict policy');
    }

    // Cross-origin policies (15 points)
    if (this.crossOriginEmbedderPolicy === 'require-corp') score += 5;
    else warnings.push('Cross-Origin-Embedder-Policy should be require-corp');

    if (this.crossOriginOpenerPolicy === 'same-origin') score += 5;
    else warnings.push('Cross-Origin-Opener-Policy should be same-origin');

    if (this.crossOriginResourcePolicy === 'same-origin') score += 5;
    else warnings.push('Cross-Origin-Resource-Policy should be same-origin');

    // Permissions policy (10 points)
    const features = Object.keys(this.permissionsPolicy);
    if (features.length >= 3) {
      score += 10;
    } else {
      warnings.push('Permissions-Policy should restrict at least camera, microphone, geolocation');
    }

    // Download options (5 points)
    if (this.xDownloadOptions) {
      score += 5;
    } else {
      warnings.push('X-Download-Options noopen should be enabled');
    }

    // DNS prefetch (5 points — off is safer)
    if (!this.xDNSPrefetchControl) {
      score += 5;
    } else {
      warnings.push('X-DNS-Prefetch-Control should be off for maximum privacy');
    }

    // Cross-domain policies (5 points)
    if (this.xPermittedCrossDomainPolicies === 'none') {
      score += 5;
    } else {
      warnings.push('X-Permitted-Cross-Domain-Policies should be none');
    }

    return { secure: score >= 80, warnings, score };
  }

  /**
   * Serialize configuration to a JSON-friendly object.
   *
   * @returns {object}
   */
  toJSON() {
    return {
      hsts: { ...this.hsts },
      xFrameOptions: this.xFrameOptions,
      xContentTypeOptions: this.xContentTypeOptions,
      referrerPolicy: this.referrerPolicy,
      permissionsPolicy: { ...this.permissionsPolicy },
      crossOriginEmbedderPolicy: this.crossOriginEmbedderPolicy,
      crossOriginOpenerPolicy: this.crossOriginOpenerPolicy,
      crossOriginResourcePolicy: this.crossOriginResourcePolicy,
      xDNSPrefetchControl: this.xDNSPrefetchControl,
      xDownloadOptions: this.xDownloadOptions,
      xPermittedCrossDomainPolicies: this.xPermittedCrossDomainPolicies,
      customHeaders: { ...this.customHeaders },
    };
  }
}

// ─── 7. EncryptedConfigVault ───────────────────────────────────────────────

/**
 * Encrypted key-value vault for secrets and sensitive configuration values.
 * Uses AES-256-GCM with random IVs and authentication tags.
 *
 * @example
 *   const vault = new EncryptedConfigVault();
 *   vault.store('apiKey', 'sk_live_abc123');
 *   vault.retrieve('apiKey'); // 'sk_live_abc123'
 */
class EncryptedConfigVault {
  /**
   * @param {object} [options]
   * @param {string} [options.masterKey]          — hex-encoded 32-byte key
   * @param {string} [options.algorithm='aes-256-gcm'] — cipher algorithm
   * @param {number} [options.ivLength=12]        — IV length in bytes
   * @param {number} [options.tagLength=16]       — auth tag length in bytes
   */
  constructor(options = {}) {
    this._masterKey = options.masterKey
      ? Buffer.from(options.masterKey, 'hex')
      : crypto.randomBytes(32);
    this.algorithm = options.algorithm || 'aes-256-gcm';
    this.ivLength = options.ivLength != null ? options.ivLength : 12;
    this.tagLength = options.tagLength != null ? options.tagLength : 16;

    /** @type {Map<string, string>} key → "iv:authTag:ciphertext" (hex) */
    this._vault = new Map();
  }

  /**
   * Encrypt and store a value under the given key.
   *
   * @param {string} key
   * @param {*}      value — strings or objects (auto JSON-serialized)
   * @returns {boolean} true on success
   */
  store(key, value) {
    const plaintext = typeof value === 'string' ? value : JSON.stringify(value);

    const iv = crypto.randomBytes(this.ivLength);
    const cipher = crypto.createCipheriv(this.algorithm, this._masterKey, iv, {
      authTagLength: this.tagLength,
    });

    let encrypted = cipher.update(plaintext, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag().toString('hex');

    this._vault.set(key, `${iv.toString('hex')}:${authTag}:${encrypted}`);
    return true;
  }

  /**
   * Decrypt and return the value for a key.
   *
   * @param {string} key
   * @returns {*} The decrypted value, or null if not found
   */
  retrieve(key) {
    const blob = this._vault.get(key);
    if (!blob) return null;

    const [ivHex, authTagHex, ciphertext] = blob.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');

    const decipher = crypto.createDecipheriv(this.algorithm, this._masterKey, iv, {
      authTagLength: this.tagLength,
    });
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(ciphertext, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    try {
      return JSON.parse(decrypted);
    } catch (_) {
      return decrypted;
    }
  }

  /**
   * Check whether a key exists in the vault.
   *
   * @param {string} key
   * @returns {boolean}
   */
  has(key) {
    return this._vault.has(key);
  }

  /**
   * Remove a key from the vault.
   *
   * @param {string} key
   * @returns {boolean}
   */
  remove(key) {
    return this._vault.delete(key);
  }

  /**
   * Return an array of all stored key names (values are NOT exposed).
   *
   * @returns {string[]}
   */
  list() {
    return [...this._vault.keys()];
  }

  /**
   * Re-encrypt all values with a new master key.
   *
   * @param {string} newKey — hex-encoded 32-byte key
   */
  rotateMasterKey(newKey) {
    const newKeyBuf = Buffer.from(newKey, 'hex');
    const entries = [];

    // Decrypt all with old key
    for (const [k, blob] of this._vault) {
      const [ivHex, authTagHex, ciphertext] = blob.split(':');
      const iv = Buffer.from(ivHex, 'hex');
      const authTag = Buffer.from(authTagHex, 'hex');

      const decipher = crypto.createDecipheriv(this.algorithm, this._masterKey, iv, {
        authTagLength: this.tagLength,
      });
      decipher.setAuthTag(authTag);

      let decrypted = decipher.update(ciphertext, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      entries.push([k, decrypted]);
    }

    // Switch key and re-encrypt
    this._masterKey = newKeyBuf;
    this._vault.clear();

    for (const [k, plaintext] of entries) {
      const iv = crypto.randomBytes(this.ivLength);
      const cipher = crypto.createCipheriv(this.algorithm, this._masterKey, iv, {
        authTagLength: this.tagLength,
      });

      let encrypted = cipher.update(plaintext, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      const authTag = cipher.getAuthTag().toString('hex');

      this._vault.set(k, `${iv.toString('hex')}:${authTag}:${encrypted}`);
    }
  }

  /**
   * Return a fingerprint (first 16 hex chars of SHA-256) of the master key.
   *
   * @returns {string}
   */
  getFingerprint() {
    return crypto.createHash('sha256').update(this._masterKey).digest('hex').slice(0, 16);
  }

  /**
   * Delete all entries in the vault.
   */
  clear() {
    this._vault.clear();
  }

  /**
   * Export all encrypted blobs as a plain object (for backup — still encrypted).
   *
   * @returns {object}
   */
  export() {
    const data = {};
    for (const [k, v] of this._vault) {
      data[k] = v;
    }
    return data;
  }

  /**
   * Import previously exported encrypted blobs.
   *
   * @param {object} data — object of key → encrypted blob strings
   */
  import(data) {
    for (const [k, v] of Object.entries(data)) {
      this._vault.set(k, v);
    }
  }
}

// ─── 8. MutualTLSManager ──────────────────────────────────────────────────

/**
 * Mutual TLS certificate management for validating client certificates
 * against a trusted CA store and a revocation list.
 *
 * @example
 *   const mtls = new MutualTLSManager();
 *   const fp = mtls.generateFingerprint('cert-data-here');
 *   mtls.addTrustedCert(fp);
 *   mtls.validateClientCert({ fingerprint: fp, notBefore: '2024-01-01', notAfter: '2025-01-01' });
 */
class MutualTLSManager {
  /**
   * @param {object}   [options]
   * @param {string[]} [options.trustedCerts=[]]       — trusted CA fingerprints
   * @param {boolean}  [options.requireClientCert=true] — require client cert
   * @param {boolean}  [options.allowExpired=false]     — allow expired certs
   * @param {number}   [options.maxCertAge=31536000000] — max cert age in ms
   * @param {string[]} [options.revocationList=[]]     — revoked fingerprints
   */
  constructor(options = {}) {
    this.requireClientCert = options.requireClientCert !== false;
    this.allowExpired = options.allowExpired === true;
    this.maxCertAge = options.maxCertAge != null ? options.maxCertAge : 31536000000;

    /** @type {Set<string>} */
    this._trustedCerts = new Set(options.trustedCerts || []);

    /** @type {Set<string>} */
    this._revocationList = new Set(options.revocationList || []);
  }

  /**
   * Validate a client certificate object.
   *
   * @param {object} cert
   * @param {string} cert.fingerprint   — SHA-256 fingerprint
   * @param {string} [cert.issuer]
   * @param {string} [cert.subject]
   * @param {string|number} [cert.notBefore] — start of validity (ISO string or ms)
   * @param {string|number} [cert.notAfter]  — end of validity (ISO string or ms)
   * @param {string} [cert.serialNumber]
   * @returns {{ valid: boolean, reason?: string, trusted: boolean }}
   */
  validateClientCert(cert) {
    if (!cert || !cert.fingerprint) {
      return { valid: false, reason: 'No certificate provided', trusted: false };
    }

    // Revocation check
    if (this._revocationList.has(cert.fingerprint)) {
      return { valid: false, reason: 'Certificate has been revoked', trusted: false };
    }

    // Trust check
    const trusted = this._trustedCerts.has(cert.fingerprint);
    if (!trusted && this.requireClientCert) {
      return { valid: false, reason: 'Certificate is not trusted', trusted: false };
    }

    const now = Date.now();

    // Expiry check
    if (cert.notAfter) {
      const notAfter = typeof cert.notAfter === 'number' ? cert.notAfter : new Date(cert.notAfter).getTime();
      if (now > notAfter && !this.allowExpired) {
        return { valid: false, reason: 'Certificate has expired', trusted };
      }
    }

    // Not-yet-valid check
    if (cert.notBefore) {
      const notBefore = typeof cert.notBefore === 'number' ? cert.notBefore : new Date(cert.notBefore).getTime();
      if (now < notBefore) {
        return { valid: false, reason: 'Certificate is not yet valid', trusted };
      }
    }

    // Max age check
    if (cert.notBefore) {
      const notBefore = typeof cert.notBefore === 'number' ? cert.notBefore : new Date(cert.notBefore).getTime();
      if (now - notBefore > this.maxCertAge) {
        return { valid: false, reason: 'Certificate exceeds maximum age', trusted };
      }
    }

    return { valid: true, trusted };
  }

  /**
   * Add a certificate fingerprint to the trusted set.
   *
   * @param {string} fingerprint
   */
  addTrustedCert(fingerprint) {
    this._trustedCerts.add(fingerprint);
  }

  /**
   * Remove a certificate fingerprint from the trusted set.
   *
   * @param {string} fingerprint
   */
  removeTrustedCert(fingerprint) {
    this._trustedCerts.delete(fingerprint);
  }

  /**
   * Add a certificate fingerprint to the revocation list.
   *
   * @param {string} fingerprint
   */
  revokeCert(fingerprint) {
    this._revocationList.add(fingerprint);
  }

  /**
   * Check whether a certificate fingerprint has been revoked.
   *
   * @param {string} fingerprint
   * @returns {boolean}
   */
  isRevoked(fingerprint) {
    return this._revocationList.has(fingerprint);
  }

  /**
   * Return all trusted certificate fingerprints.
   *
   * @returns {string[]}
   */
  getTrustedCerts() {
    return [...this._trustedCerts];
  }

  /**
   * Return all revoked certificate fingerprints.
   *
   * @returns {string[]}
   */
  getRevocationList() {
    return [...this._revocationList];
  }

  /**
   * Compute a SHA-256 fingerprint of a certificate data string.
   *
   * @param {string} certData
   * @returns {string}
   */
  generateFingerprint(certData) {
    return crypto.createHash('sha256').update(certData).digest('hex');
  }

  /**
   * Clear all trusted certificates and revocation entries.
   */
  reset() {
    this._trustedCerts.clear();
    this._revocationList.clear();
  }
}

// ─── Exports ────────────────────────────────────────────────────────────────

module.exports = {
  ZeroTrustEngine,
  ThreatIntelligence,
  SecureSessionManager,
  RequestIntegrityChain,
  AdaptiveRateLimiter,
  SecurityHeadersManager,
  EncryptedConfigVault,
  MutualTLSManager,
};
