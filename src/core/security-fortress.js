/**
 * awsibnj v19 — Fortress Security Module
 *
 * Ultra-hardened fortress-grade security utilities providing quantum-resistant
 * cryptography, behavioral analytics, honeypot detection, subresource integrity
 * verification, multi-level request throttling, IP geofencing, automated key
 * rotation, and cross-module security event correlation.
 *
 * Components:
 *   - QuantumResistantCrypto    — Post-quantum-inspired key derivation & HMAC signing
 *   - BehavioralAnalytics       — Request pattern anomaly detection per context
 *   - HoneypotManager           — Canary endpoint detection for scanners / bots
 *   - SubresourceIntegrity      — SHA-256/384 response integrity verification
 *   - RequestThrottleGuard      — Multi-level throttling with progressive penalties
 *   - GeofenceGuard             — IP-prefix based geographic access control
 *   - CryptoKeyRotator          — Versioned key rotation with scheduled expiry
 *   - SecurityEventCorrelator   — Cross-module event correlation & attack detection
 *
 * Usage:
 *   const { QuantumResistantCrypto, GeofenceGuard } = require('./security-fortress');
 *   const qrc = new QuantumResistantCrypto();
 *   const sig = qrc.sign('payload', qrc.deriveKey('secret', 'salt', 'ctx'));
 */

'use strict';

const crypto = require('crypto');

// ─── 1. QuantumResistantCrypto ─────────────────────────────────────────────

/**
 * Post-quantum-inspired cryptographic utilities.  Uses multi-round PBKDF2 key
 * derivation and double-HMAC signing to maximize classical resistance while
 * remaining implementable with Node.js built-ins.
 *
 * @example
 *   const qrc = new QuantumResistantCrypto({ iterations: 100000 });
 *   const key = qrc.deriveKey('my-secret', 'random-salt', 'app-context');
 *   const sig = qrc.sign('payload', key);
 *   qrc.verify('payload', sig, key); // true
 */
class QuantumResistantCrypto {
  /**
   * @param {object} [options]
   * @param {number} [options.iterations=100000]  — PBKDF2 iteration count
   * @param {number} [options.keyLength=64]       — derived key length in bytes
   * @param {string} [options.digest='sha512']    — PBKDF2 / HMAC digest
   * @param {number} [options.hashRounds=3]       — extra hash rounds for signing
   */
  constructor(options = {}) {
    this.iterations = options.iterations != null ? options.iterations : 100000;
    this.keyLength = options.keyLength != null ? options.keyLength : 64;
    this.digest = options.digest || 'sha512';
    this.hashRounds = options.hashRounds != null ? options.hashRounds : 3;
  }

  /**
   * Derive a key from a secret + salt + context using PBKDF2.
   *
   * @param {string|Buffer} secret
   * @param {string|Buffer} salt
   * @param {string} [context=''] — domain-separation context string
   * @returns {Buffer} derived key buffer
   */
  deriveKey(secret, salt, context = '') {
    const saltBuf = Buffer.isBuffer(salt) ? salt : Buffer.from(String(salt), 'utf8');
    const secretBuf = Buffer.isBuffer(secret) ? secret : Buffer.from(String(secret), 'utf8');
    const ctxBuf = Buffer.from(String(context), 'utf8');
    // Mix context into salt for domain separation
    const combinedSalt = Buffer.concat([saltBuf, ctxBuf]);
    return crypto.pbkdf2Sync(secretBuf, combinedSalt, this.iterations, this.keyLength, this.digest);
  }

  /**
   * Sign data using double-HMAC (multi-round).
   *
   * @param {string|Buffer} data
   * @param {string|Buffer} key — raw key material
   * @returns {string} hex-encoded signature
   */
  sign(data, key) {
    const keyBuf = Buffer.isBuffer(key) ? key : Buffer.from(String(key), 'hex').slice(0, 64);
    let result = Buffer.isBuffer(data) ? data : Buffer.from(String(data), 'utf8');
    for (let i = 0; i < this.hashRounds; i++) {
      result = Buffer.from(
        crypto.createHmac(this.digest, keyBuf).update(result).digest('hex'),
        'utf8',
      );
    }
    return result.toString('utf8');
  }

  /**
   * Verify data against a previously generated signature (timing-safe).
   *
   * @param {string|Buffer} data
   * @param {string} signature — hex-encoded signature to verify
   * @param {string|Buffer} key
   * @returns {boolean}
   */
  verify(data, signature, key) {
    try {
      const expected = this.sign(data, key);
      const eBuf = Buffer.from(expected, 'utf8');
      const sBuf = Buffer.from(String(signature), 'utf8');
      if (eBuf.length !== sBuf.length) return false;
      return crypto.timingSafeEqual(eBuf, sBuf);
    } catch {
      return false;
    }
  }

  /**
   * Compute a multi-round hash of data.
   *
   * @param {string|Buffer} data
   * @param {string} [algorithm='sha512']
   * @returns {string} hex digest
   */
  hash(data, algorithm) {
    const alg = algorithm || this.digest;
    let result = Buffer.isBuffer(data) ? data : Buffer.from(String(data), 'utf8');
    for (let i = 0; i < this.hashRounds; i++) {
      result = Buffer.from(crypto.createHash(alg).update(result).digest('hex'), 'utf8');
    }
    return result.toString('utf8');
  }

  /**
   * Return algorithm information.
   *
   * @returns {{ digest: string, iterations: number, keyLength: number, hashRounds: number }}
   */
  getAlgorithmInfo() {
    return {
      digest: this.digest,
      iterations: this.iterations,
      keyLength: this.keyLength,
      hashRounds: this.hashRounds,
    };
  }
}

// ─── 2. BehavioralAnalytics ────────────────────────────────────────────────

/**
 * Per-context request pattern tracker that detects anomalies by comparing
 * recent behavior against a rolling baseline.
 *
 * @example
 *   const ba = new BehavioralAnalytics({ windowMs: 60000 });
 *   ba.recordRequest('user-1', { method: 'GET', url: '/api' });
 *   ba.analyze('user-1'); // { anomaly: false, score: 0, reasons: [] }
 */
class BehavioralAnalytics {
  /**
   * @param {object} [options]
   * @param {number} [options.windowMs=300000]        — analysis window in ms (5 min)
   * @param {number} [options.maxRequestsPerWindow=200] — threshold before anomaly
   * @param {number} [options.anomalyScoreThreshold=70] — score (0–100) to flag
   * @param {number} [options.maxProfileHistory=1000] — max stored requests per ctx
   */
  constructor(options = {}) {
    this.windowMs = options.windowMs != null ? options.windowMs : 300000;
    this.maxRequestsPerWindow = options.maxRequestsPerWindow != null ? options.maxRequestsPerWindow : 200;
    this.anomalyScoreThreshold = options.anomalyScoreThreshold != null ? options.anomalyScoreThreshold : 70;
    this.maxProfileHistory = options.maxProfileHistory != null ? options.maxProfileHistory : 1000;

    /** @type {Map<string, { requests: Array<{method:string,url:string,timestamp:number}>, baseline?: object }>} */
    this._profiles = new Map();
  }

  /**
   * Record a request for a context.
   *
   * @param {string} contextId
   * @param {object} request
   * @param {string} request.method
   * @param {string} request.url
   * @param {number} [request.timestamp]
   */
  recordRequest(contextId, request) {
    let profile = this._profiles.get(contextId);
    if (!profile) {
      profile = { requests: [] };
      this._profiles.set(contextId, profile);
    }
    profile.requests.push({
      method: (request.method || 'GET').toUpperCase(),
      url: request.url || '',
      timestamp: request.timestamp != null ? request.timestamp : Date.now(),
    });
    // Prune old entries
    if (profile.requests.length > this.maxProfileHistory) {
      profile.requests = profile.requests.slice(-this.maxProfileHistory);
    }
  }

  /**
   * Analyze the recent request history for a context and return an anomaly report.
   *
   * @param {string} contextId
   * @returns {{ anomaly: boolean, score: number, reasons: string[], requestCount: number }}
   */
  analyze(contextId) {
    const profile = this._profiles.get(contextId);
    if (!profile) {
      return { anomaly: false, score: 0, reasons: [], requestCount: 0 };
    }

    const now = Date.now();
    const recent = profile.requests.filter(r => r.timestamp > now - this.windowMs);
    const reasons = [];
    let score = 0;

    // Volume anomaly
    if (recent.length > this.maxRequestsPerWindow) {
      const excess = recent.length - this.maxRequestsPerWindow;
      const volumeScore = Math.min(50, Math.floor((excess / this.maxRequestsPerWindow) * 50));
      score += volumeScore;
      reasons.push(`high_volume: ${recent.length} requests in window (limit ${this.maxRequestsPerWindow})`);
    }

    // Method distribution anomaly — too many non-GET
    const mutatingMethods = recent.filter(r => ['POST', 'PUT', 'DELETE', 'PATCH'].includes(r.method));
    if (mutatingMethods.length > recent.length * 0.6 && recent.length > 10) {
      score += 20;
      reasons.push(`high_mutating_ratio: ${mutatingMethods.length}/${recent.length} mutating requests`);
    }

    // Burst detection — many requests in last 5 seconds
    const burstWindow = 5000;
    const burst = recent.filter(r => r.timestamp > now - burstWindow);
    if (burst.length > 20) {
      score += 30;
      reasons.push(`burst_detected: ${burst.length} requests in ${burstWindow}ms`);
    }

    // Baseline deviation
    if (profile.baseline) {
      const baselineAvg = profile.baseline.avgRequestsPerWindow || 0;
      if (baselineAvg > 0 && recent.length > baselineAvg * 3) {
        score += 25;
        reasons.push(`baseline_deviation: ${recent.length} vs baseline ${baselineAvg}`);
      }
    }

    score = Math.min(100, score);
    const anomaly = score >= this.anomalyScoreThreshold;

    return { anomaly, score, reasons, requestCount: recent.length };
  }

  /**
   * Return the stored profile for a context.
   *
   * @param {string} contextId
   * @returns {{ requests: Array, baseline?: object } | null}
   */
  getProfile(contextId) {
    return this._profiles.get(contextId) || null;
  }

  /**
   * Set an expected-behavior baseline for a context.
   *
   * @param {string} contextId
   * @param {object} baseline
   * @param {number} [baseline.avgRequestsPerWindow] — expected average request count
   */
  setBaseline(contextId, baseline) {
    let profile = this._profiles.get(contextId);
    if (!profile) {
      profile = { requests: [] };
      this._profiles.set(contextId, profile);
    }
    profile.baseline = baseline;
  }

  /**
   * Remove all recorded history for a context.
   *
   * @param {string} contextId
   */
  resetProfile(contextId) {
    this._profiles.delete(contextId);
  }

  /**
   * Clear all profiles.
   */
  reset() {
    this._profiles.clear();
  }
}

// ─── 3. HoneypotManager ────────────────────────────────────────────────────

/**
 * Registers canary endpoints.  Any request matching a honeypot path is flagged
 * as a scanner / bot and an alert is emitted.
 *
 * @example
 *   const hp = new HoneypotManager();
 *   hp.addHoneypot('/admin-backup', { severity: 'high' });
 *   hp.checkRequest('/admin-backup', '1.2.3.4');
 *   // { tripped: true, honeypot: '/admin-backup', severity: 'high' }
 */
class HoneypotManager {
  /**
   * @param {object} [options]
   * @param {boolean} [options.strictMatch=false] — exact-path match (vs contains)
   * @param {number}  [options.alertThreshold=1]  — trips before raising alert
   */
  constructor(options = {}) {
    this.strictMatch = options.strictMatch === true;
    this.alertThreshold = options.alertThreshold != null ? options.alertThreshold : 1;

    /** @type {Map<string, { label: string, severity: string, options: object }>} */
    this._honeypots = new Map();

    /** @type {Map<string, { count: number, trips: Array<{ honeypot: string, timestamp: number }> }>} */
    this._trips = new Map();

    this._totalTrips = 0;
  }

  /**
   * Register a honeypot path.
   *
   * @param {string} path
   * @param {object} [options]
   * @param {string} [options.label]
   * @param {string} [options.severity='high']
   */
  addHoneypot(path, options = {}) {
    this._honeypots.set(path, {
      label: options.label || path,
      severity: options.severity || 'high',
      options,
    });
  }

  /**
   * Remove a honeypot path.
   *
   * @param {string} path
   */
  removeHoneypot(path) {
    this._honeypots.delete(path);
  }

  /**
   * Check whether a request URL matches any registered honeypot.
   *
   * @param {string} url
   * @param {string} [ip]
   * @returns {{ tripped: boolean, honeypot?: string, severity?: string, label?: string }}
   */
  checkRequest(url, ip) {
    for (const [honeypotPath, meta] of this._honeypots) {
      const matched = this.strictMatch
        ? url === honeypotPath
        : url.includes(honeypotPath);

      if (matched) {
        this._totalTrips += 1;

        if (ip) {
          let entry = this._trips.get(ip);
          if (!entry) {
            entry = { count: 0, trips: [] };
            this._trips.set(ip, entry);
          }
          entry.count += 1;
          entry.trips.push({ honeypot: honeypotPath, timestamp: Date.now() });
        }

        return {
          tripped: true,
          honeypot: honeypotPath,
          severity: meta.severity,
          label: meta.label,
        };
      }
    }
    return { tripped: false };
  }

  /**
   * Return trip history for an IP.
   *
   * @param {string} ip
   * @returns {{ count: number, trips: Array } | null}
   */
  getTrips(ip) {
    return this._trips.get(ip) || null;
  }

  /**
   * Return total trips across all IPs and honeypots.
   *
   * @returns {number}
   */
  getTotalTrips() {
    return this._totalTrips;
  }

  /**
   * Return all registered honeypot paths.
   *
   * @returns {string[]}
   */
  getHoneypots() {
    return [...this._honeypots.keys()];
  }

  /**
   * Clear all honeypots and trip history.
   */
  reset() {
    this._honeypots.clear();
    this._trips.clear();
    this._totalTrips = 0;
  }
}

// ─── 4. SubresourceIntegrity ───────────────────────────────────────────────

/**
 * SHA-256 / SHA-384 response integrity verification — API-level equivalent of
 * browser SubResource Integrity for API responses.
 *
 * @example
 *   const sri = new SubresourceIntegrity();
 *   const { hash } = sri.sign('{"ok":true}');
 *   sri.verify('{"ok":true}', hash); // true
 */
class SubresourceIntegrity {
  /**
   * @param {object} [options]
   * @param {string} [options.algorithm='sha256'] — 'sha256' or 'sha384'
   * @param {string} [options.encoding='hex']     — 'hex' or 'base64'
   */
  constructor(options = {}) {
    this.algorithm = options.algorithm || 'sha256';
    this.encoding = options.encoding || 'hex';

    /** @type {Map<string, string>} manifest: url → expected hash */
    this._manifest = new Map();
  }

  /**
   * Compute the integrity hash of data.
   *
   * @param {string|Buffer|object} data
   * @param {string} [algorithm]
   * @returns {string} hash in the configured encoding
   */
  computeHash(data, algorithm) {
    const alg = algorithm || this.algorithm;
    const input = typeof data === 'object' && !Buffer.isBuffer(data)
      ? JSON.stringify(data)
      : (Buffer.isBuffer(data) ? data : String(data));
    return crypto.createHash(alg).update(input).digest(this.encoding);
  }

  /**
   * Verify that data matches an expected hash (timing-safe).
   *
   * @param {string|Buffer|object} data
   * @param {string} expectedHash
   * @param {string} [algorithm]
   * @returns {boolean}
   */
  verify(data, expectedHash, algorithm) {
    try {
      const actual = this.computeHash(data, algorithm);
      const aBuf = Buffer.from(actual, 'utf8');
      const eBuf = Buffer.from(String(expectedHash), 'utf8');
      if (aBuf.length !== eBuf.length) return false;
      return crypto.timingSafeEqual(aBuf, eBuf);
    } catch {
      return false;
    }
  }

  /**
   * Sign data — compute and return a hash descriptor.
   *
   * @param {string|Buffer|object} data
   * @returns {{ hash: string, algorithm: string, encoding: string }}
   */
  sign(data) {
    return {
      hash: this.computeHash(data),
      algorithm: this.algorithm,
      encoding: this.encoding,
    };
  }

  /**
   * Register expected hashes for a set of resource identifiers.
   *
   * @param {Array<{ key: string, hash: string }>} entries
   */
  createManifest(entries) {
    for (const entry of entries) {
      this._manifest.set(entry.key, entry.hash);
    }
  }

  /**
   * Verify a set of responses against the stored manifest.
   *
   * @param {Array<{ key: string, data: * }>} responses
   * @returns {{ valid: boolean, failures: string[] }}
   */
  verifyManifest(responses) {
    const failures = [];
    for (const resp of responses) {
      const expected = this._manifest.get(resp.key);
      if (expected === undefined) {
        failures.push(`${resp.key}: not in manifest`);
        continue;
      }
      if (!this.verify(resp.data, expected)) {
        failures.push(`${resp.key}: hash mismatch`);
      }
    }
    return { valid: failures.length === 0, failures };
  }

  /**
   * Clear the stored manifest.
   */
  clearManifest() {
    this._manifest.clear();
  }

  /**
   * Return manifest size.
   *
   * @returns {number}
   */
  getManifestSize() {
    return this._manifest.size;
  }
}

// ─── 5. RequestThrottleGuard ───────────────────────────────────────────────

/** Throttle levels ordered by severity. */
const THROTTLE_LEVELS = { NONE: 0, WARN: 1, DELAY: 2, BLOCK: 3 };

/**
 * Multi-level progressive throttling guard.  Tracks request counts per key
 * within a rolling window and applies escalating responses: WARN → DELAY → BLOCK.
 *
 * @example
 *   const guard = new RequestThrottleGuard({ warnAt: 60, delayAt: 80, blockAt: 95 });
 *   guard.check('user-1'); // { level: 'NONE', allowed: true, remaining: 100 }
 */
class RequestThrottleGuard {
  /**
   * @param {object} [options]
   * @param {number} [options.maxRequests=100]  — window capacity
   * @param {number} [options.windowMs=60000]   — rolling window in ms
   * @param {number} [options.warnAt=60]        — % capacity triggering WARN
   * @param {number} [options.delayAt=80]       — % capacity triggering DELAY
   * @param {number} [options.blockAt=95]       — % capacity triggering BLOCK
   * @param {number} [options.penaltyWeight=10] — extra tokens added per penalize()
   */
  constructor(options = {}) {
    this.maxRequests = options.maxRequests != null ? options.maxRequests : 100;
    this.windowMs = options.windowMs != null ? options.windowMs : 60000;
    this.warnAt = options.warnAt != null ? options.warnAt : 60;
    this.delayAt = options.delayAt != null ? options.delayAt : 80;
    this.blockAt = options.blockAt != null ? options.blockAt : 95;
    this.penaltyWeight = options.penaltyWeight != null ? options.penaltyWeight : 10;

    /** @type {Map<string, { timestamps: number[], penalties: number }>} */
    this._buckets = new Map();
  }

  /**
   * Check and record a request for the given key.
   *
   * @param {string} key
   * @returns {{ level: string, allowed: boolean, remaining: number, usagePercent: number }}
   */
  check(key) {
    const now = Date.now();
    let bucket = this._buckets.get(key);
    if (!bucket) {
      bucket = { timestamps: [], penalties: 0 };
      this._buckets.set(key, bucket);
    }

    // Prune old timestamps
    bucket.timestamps = bucket.timestamps.filter(t => t > now - this.windowMs);

    // Record this request
    bucket.timestamps.push(now);

    const effectiveCount = bucket.timestamps.length + bucket.penalties;
    const usagePercent = Math.min(100, (effectiveCount / this.maxRequests) * 100);
    const remaining = Math.max(0, this.maxRequests - effectiveCount);

    let level;
    let allowed;
    if (usagePercent >= this.blockAt) {
      level = 'BLOCK';
      allowed = false;
    } else if (usagePercent >= this.delayAt) {
      level = 'DELAY';
      allowed = true;
    } else if (usagePercent >= this.warnAt) {
      level = 'WARN';
      allowed = true;
    } else {
      level = 'NONE';
      allowed = true;
    }

    return { level, allowed, remaining, usagePercent };
  }

  /**
   * Apply an additional penalty to a key (increases effective usage count).
   *
   * @param {string} key
   * @param {number} [amount]
   */
  penalize(key, amount) {
    const weight = amount != null ? amount : this.penaltyWeight;
    let bucket = this._buckets.get(key);
    if (!bucket) {
      bucket = { timestamps: [], penalties: 0 };
      this._buckets.set(key, bucket);
    }
    bucket.penalties += weight;
  }

  /**
   * Reduce the penalty for a key.
   *
   * @param {string} key
   * @param {number} [amount]
   */
  forgive(key, amount) {
    const bucket = this._buckets.get(key);
    if (!bucket) return;
    const weight = amount != null ? amount : this.penaltyWeight;
    bucket.penalties = Math.max(0, bucket.penalties - weight);
  }

  /**
   * Return the current throttle level for a key without recording a request.
   *
   * @param {string} key
   * @returns {string} — 'NONE' | 'WARN' | 'DELAY' | 'BLOCK'
   */
  getLevel(key) {
    const now = Date.now();
    const bucket = this._buckets.get(key);
    if (!bucket) return 'NONE';
    const active = bucket.timestamps.filter(t => t > now - this.windowMs);
    const effectiveCount = active.length + bucket.penalties;
    const usagePercent = (effectiveCount / this.maxRequests) * 100;
    if (usagePercent >= this.blockAt) return 'BLOCK';
    if (usagePercent >= this.delayAt) return 'DELAY';
    if (usagePercent >= this.warnAt) return 'WARN';
    return 'NONE';
  }

  /**
   * Reset the throttle state for a specific key.
   *
   * @param {string} key
   */
  resetKey(key) {
    this._buckets.delete(key);
  }

  /**
   * Clear all throttle state.
   */
  reset() {
    this._buckets.clear();
  }
}

// ─── 6. GeofenceGuard ─────────────────────────────────────────────────────

/**
 * IP-prefix based geographic access control.  Regions map IP prefix patterns
 * to 'allow' or 'deny' actions.
 *
 * @example
 *   const gf = new GeofenceGuard({ defaultAction: 'allow' });
 *   gf.addRegion('internal', ['10.', '192.168.'], 'allow');
 *   gf.addRegion('blocked-range', ['5.5.5.'], 'deny');
 *   gf.check('5.5.5.10'); // { allowed: false, region: 'blocked-range', action: 'deny', matched: true }
 */
class GeofenceGuard {
  /**
   * @param {object} [options]
   * @param {string} [options.defaultAction='allow'] — action when no region matches
   */
  constructor(options = {}) {
    this.defaultAction = options.defaultAction || 'allow';

    /** @type {Map<string, { prefixes: string[], action: string }>} */
    this._regions = new Map();
  }

  /**
   * Register a region with IP prefixes.
   *
   * @param {string}   name
   * @param {string[]} prefixes — IP prefix strings (e.g. '10.', '192.168.1.')
   * @param {string}   action   — 'allow' or 'deny'
   */
  addRegion(name, prefixes, action) {
    this._regions.set(name, { prefixes: prefixes.slice(), action });
  }

  /**
   * Remove a region.
   *
   * @param {string} name
   */
  removeRegion(name) {
    this._regions.delete(name);
  }

  /**
   * Check an IP against registered regions.
   *
   * @param {string} ip
   * @returns {{ allowed: boolean, region: string|null, action: string, matched: boolean }}
   */
  check(ip) {
    const str = String(ip || '');
    for (const [name, region] of this._regions) {
      for (const prefix of region.prefixes) {
        if (str.startsWith(prefix)) {
          const action = region.action;
          return {
            allowed: action === 'allow',
            region: name,
            action,
            matched: true,
          };
        }
      }
    }
    return {
      allowed: this.defaultAction === 'allow',
      region: null,
      action: this.defaultAction,
      matched: false,
    };
  }

  /**
   * Set the default action for unmatched IPs.
   *
   * @param {'allow'|'deny'} action
   */
  setDefaultAction(action) {
    this.defaultAction = action;
  }

  /**
   * Return all registered region names.
   *
   * @returns {string[]}
   */
  getRegions() {
    return [...this._regions.keys()];
  }

  /**
   * Return region details.
   *
   * @param {string} name
   * @returns {{ prefixes: string[], action: string } | null}
   */
  getRegion(name) {
    return this._regions.get(name) || null;
  }

  /**
   * Clear all regions and reset default action.
   */
  reset() {
    this._regions.clear();
    this.defaultAction = 'allow';
  }
}

// ─── 7. CryptoKeyRotator ──────────────────────────────────────────────────

/**
 * Manages versioned cryptographic key rotation with scheduled expiry.
 * Keeps a history of key versions so that in-flight requests signed with
 * older keys can still be verified during rollover periods.
 *
 * @example
 *   const rotator = new CryptoKeyRotator();
 *   rotator.addKey('v1', Buffer.alloc(32).toString('hex'), Date.now() + 3600000);
 *   const { key, version } = rotator.getCurrentKey();
 */
class CryptoKeyRotator {
  /**
   * @param {object} [options]
   * @param {number} [options.maxVersions=10] — maximum number of key versions kept
   */
  constructor(options = {}) {
    this.maxVersions = options.maxVersions != null ? options.maxVersions : 10;

    /** @type {Map<string, { keyMaterial: string, expiresAt: number, addedAt: number }>} */
    this._keys = new Map();

    /** @type {string|null} latest version label */
    this._currentVersion = null;
  }

  /**
   * Add a new key version.
   *
   * @param {string} version      — version label (e.g. 'v1', '2026-01')
   * @param {string} keyMaterial  — key material (hex string)
   * @param {number} expiresAt    — expiry timestamp in ms
   */
  addKey(version, keyMaterial, expiresAt) {
    // Prune if at capacity
    if (this._keys.size >= this.maxVersions) {
      this.pruneExpired();
      if (this._keys.size >= this.maxVersions) {
        // Remove oldest
        const oldest = this._keys.keys().next().value;
        this._keys.delete(oldest);
      }
    }

    this._keys.set(String(version), {
      keyMaterial: String(keyMaterial),
      expiresAt: Number(expiresAt),
      addedAt: Date.now(),
    });
    this._currentVersion = String(version);
  }

  /**
   * Return the current (latest non-expired) key.
   *
   * @returns {{ version: string, key: string, expiresAt: number } | null}
   */
  getCurrentKey() {
    if (!this._currentVersion) return null;
    const entry = this._keys.get(this._currentVersion);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) return null;
    return { version: this._currentVersion, key: entry.keyMaterial, expiresAt: entry.expiresAt };
  }

  /**
   * Return a specific key version.
   *
   * @param {string} version
   * @returns {{ version: string, key: string, expiresAt: number, expired: boolean } | null}
   */
  getKey(version) {
    const entry = this._keys.get(String(version));
    if (!entry) return null;
    return {
      version: String(version),
      key: entry.keyMaterial,
      expiresAt: entry.expiresAt,
      expired: Date.now() > entry.expiresAt,
    };
  }

  /**
   * Add a new key version and mark it current (rotate).
   *
   * @param {string} newVersion
   * @param {string} keyMaterial
   * @param {number} expiresAt
   */
  rotateKeys(newVersion, keyMaterial, expiresAt) {
    this.addKey(newVersion, keyMaterial, expiresAt);
  }

  /**
   * Remove all expired key versions.
   *
   * @returns {number} number of entries pruned
   */
  pruneExpired() {
    const now = Date.now();
    let count = 0;
    for (const [version, entry] of this._keys) {
      if (now > entry.expiresAt) {
        this._keys.delete(version);
        count += 1;
        if (version === this._currentVersion) {
          this._currentVersion = null;
        }
      }
    }
    return count;
  }

  /**
   * Return all stored version labels.
   *
   * @returns {string[]}
   */
  listVersions() {
    return [...this._keys.keys()];
  }

  /**
   * Check whether a version exists and is valid (non-expired).
   *
   * @param {string} version
   * @returns {boolean}
   */
  isValid(version) {
    const entry = this._keys.get(String(version));
    if (!entry) return false;
    return Date.now() <= entry.expiresAt;
  }

  /**
   * Clear all key versions.
   */
  reset() {
    this._keys.clear();
    this._currentVersion = null;
  }
}

// ─── 8. SecurityEventCorrelator ───────────────────────────────────────────

/** Severity order for correlation logic. */
const SEVERITY_ORDER = { info: 0, low: 1, medium: 2, warn: 3, high: 4, critical: 5 };

/**
 * SIEM-inspired cross-module security event correlator.  Records events from
 * all security layers, detects coordinated attack patterns within time windows,
 * and raises alerts.
 *
 * @example
 *   const sec = new SecurityEventCorrelator({ windowMs: 60000 });
 *   sec.record({ type: 'rate_limit', severity: 'warn', source: '1.2.3.4' });
 *   sec.record({ type: 'threat_detected', severity: 'high', source: '1.2.3.4' });
 *   sec.correlate(60000); // { alerts: [...], patterns: [...], risk: 'high' }
 */
class SecurityEventCorrelator {
  /**
   * @param {object} [options]
   * @param {number} [options.maxEvents=10000]        — max events to store
   * @param {number} [options.alertThreshold=3]       — events per source per window before alert
   * @param {number} [options.criticalThreshold=2]    — critical events before immediate alert
   */
  constructor(options = {}) {
    this.maxEvents = options.maxEvents != null ? options.maxEvents : 10000;
    this.alertThreshold = options.alertThreshold != null ? options.alertThreshold : 3;
    this.criticalThreshold = options.criticalThreshold != null ? options.criticalThreshold : 2;

    /** @type {Array<{ type: string, severity: string, source: string, details: object, timestamp: number }>} */
    this._events = [];

    /** @type {Array<{ type: string, severity: string, source: string, details: object, timestamp: number }>} */
    this._alerts = [];
  }

  /**
   * Record a security event.
   *
   * @param {object} event
   * @param {string} event.type       — event type identifier
   * @param {string} [event.severity='info'] — severity level
   * @param {string} [event.source]   — source identifier (IP, contextId, etc.)
   * @param {object} [event.details]  — additional details
   * @param {number} [event.timestamp]
   */
  record(event) {
    this._events.push({
      type: event.type || 'unknown',
      severity: event.severity || 'info',
      source: event.source || 'unknown',
      details: event.details || {},
      timestamp: event.timestamp != null ? event.timestamp : Date.now(),
    });

    // Keep within capacity
    if (this._events.length > this.maxEvents) {
      this._events = this._events.slice(-this.maxEvents);
    }
  }

  /**
   * Correlate recent events and produce alerts + risk assessment.
   *
   * @param {number} [windowMs=60000] — lookback window in ms
   * @returns {{ alerts: Array, patterns: string[], risk: string, eventCount: number }}
   */
  correlate(windowMs) {
    const window = windowMs != null ? windowMs : 60000;
    const now = Date.now();
    const recent = this._events.filter(e => e.timestamp > now - window);

    /** @type {Map<string, Array>} grouped by source */
    const bySource = new Map();
    for (const evt of recent) {
      const src = evt.source;
      if (!bySource.has(src)) bySource.set(src, []);
      bySource.get(src).push(evt);
    }

    const patterns = [];
    let maxRisk = 'none';

    for (const [source, events] of bySource) {
      // Volume correlation
      if (events.length >= this.alertThreshold) {
        patterns.push(`high_event_volume: ${events.length} events from ${source}`);
        this._alerts.push({
          type: 'high_event_volume',
          severity: 'warn',
          source,
          details: { count: events.length },
          timestamp: now,
        });
        if (SEVERITY_ORDER['warn'] > SEVERITY_ORDER[maxRisk] || maxRisk === 'none') {
          maxRisk = 'warn';
        }
      }

      // Critical event correlation
      const criticals = events.filter(e => e.severity === 'critical');
      if (criticals.length >= this.criticalThreshold) {
        patterns.push(`critical_storm: ${criticals.length} critical events from ${source}`);
        this._alerts.push({
          type: 'critical_storm',
          severity: 'critical',
          source,
          details: { count: criticals.length },
          timestamp: now,
        });
        maxRisk = 'critical';
      }

      // Mixed attack pattern — multiple different security event types
      const types = new Set(events.map(e => e.type));
      if (types.size >= 3) {
        patterns.push(`multi_vector_attack: ${types.size} event types from ${source}`);
        this._alerts.push({
          type: 'multi_vector_attack',
          severity: 'high',
          source,
          details: { types: [...types] },
          timestamp: now,
        });
        if (SEVERITY_ORDER['high'] > SEVERITY_ORDER[maxRisk] || maxRisk === 'none') {
          maxRisk = 'high';
        }
      }
    }

    // Determine overall risk level
    let risk = 'none';
    if (maxRisk === 'critical') risk = 'critical';
    else if (maxRisk === 'high') risk = 'high';
    else if (maxRisk === 'warn' || maxRisk === 'medium') risk = 'medium';
    else if (recent.length > 0) risk = 'low';

    return { alerts: this._alerts.slice(), patterns, risk, eventCount: recent.length };
  }

  /**
   * Return all active alerts.
   *
   * @returns {Array}
   */
  getAlerts() {
    return this._alerts.slice();
  }

  /**
   * Clear all alerts.
   */
  clearAlerts() {
    this._alerts = [];
  }

  /**
   * Return event counts by type for the given window.
   *
   * @param {number} [windowMs=60000]
   * @returns {{ total: number, byType: object, bySeverity: object }}
   */
  getStats(windowMs) {
    const window = windowMs != null ? windowMs : 60000;
    const now = Date.now();
    const recent = this._events.filter(e => e.timestamp > now - window);
    const byType = {};
    const bySeverity = {};
    for (const evt of recent) {
      byType[evt.type] = (byType[evt.type] || 0) + 1;
      bySeverity[evt.severity] = (bySeverity[evt.severity] || 0) + 1;
    }
    return { total: recent.length, byType, bySeverity };
  }

  /**
   * Clear all events and alerts.
   */
  reset() {
    this._events = [];
    this._alerts = [];
  }
}

// ─── Exports ────────────────────────────────────────────────────────────────

module.exports = {
  QuantumResistantCrypto,
  BehavioralAnalytics,
  HoneypotManager,
  SubresourceIntegrity,
  RequestThrottleGuard,
  GeofenceGuard,
  CryptoKeyRotator,
  SecurityEventCorrelator,
};
