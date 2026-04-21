/**
 * awsibnj v3 — Learning Engine
 *
 * Persistent, session-aware learning with:
 *  - Confidence decay over time
 *  - Frequency-based priority
 *  - Bulk import / export
 *  - Auto-learn from high-confidence transforms
 *  - Schema suggestion generation
 *  - v3: persistence format version 3
 */

const fs   = require('fs');
const path = require('path');
const crypto = require('crypto');

const DEFAULT_STORE_PATH = path.join(process.cwd(), '.apibridge', 'learned.json');

class LearningEngine {
  /**
   * @param {object} options
   * @param {string} options.storePath  Custom path for persistence file
   * @param {number} options.decayDays  Days after which unused mappings lose confidence (default 90)
   */
  constructor(options = {}) {
    this.storePath = options.storePath || DEFAULT_STORE_PATH;
    this.decayDays = options.decayDays || 90;
    this.sessionId = crypto.randomBytes(4).toString('hex');

    this.approved  = new Map();   // sourceKey → { target, confidence, lastUsed, learnedAt }
    this.rejected  = new Map();   // sourceKey → Set of wrong targets
    this.frequency = new Map();   // sourceKey → number of times seen

    this._load();
  }

  /**
   * Learn a mapping — approved or rejected.
   */
  learn(sourceKey, targetKey, approved) {
    const norm = sourceKey.toLowerCase().trim();

    if (approved) {
      this.approved.set(norm, {
        target: targetKey,
        confidence: 1.0,
        lastUsed: Date.now(),
        learnedAt: Date.now(),
      });

      // Remove from rejected if it was there
      if (this.rejected.has(norm)) {
        this.rejected.get(norm).delete(targetKey);
      }
    } else {
      if (!this.rejected.has(norm)) {
        this.rejected.set(norm, new Set());
      }
      this.rejected.get(norm).add(targetKey);

      // Remove from approved if wrong
      const existing = this.approved.get(norm);
      if (existing && existing.target === targetKey) {
        this.approved.delete(norm);
      }
    }

    this._save();
  }

  /**
   * Auto-learn from high-confidence transformer results.
   */
  autoLearn(sourceKey, targetKey, confidence) {
    if (confidence >= 0.97) {
      const norm = sourceKey.toLowerCase().trim();
      if (!this.approved.has(norm) && !this._isRejected(norm, targetKey)) {
        this.approved.set(norm, {
          target: targetKey,
          confidence,
          lastUsed: Date.now(),
          learnedAt: Date.now(),
        });
        this._incrementFrequency(norm);
      }
    }
  }

  /**
   * Lookup a previously learned mapping.
   * Applies confidence decay for stale mappings.
   */
  lookup(sourceKey) {
    const norm = sourceKey.toLowerCase().trim();
    this._incrementFrequency(norm);

    const entry = this.approved.get(norm);
    if (!entry) return null;

    // Confidence decay
    const ageMs = Date.now() - (entry.lastUsed || entry.learnedAt);
    const ageDays = ageMs / (1000 * 60 * 60 * 24);
    if (ageDays > this.decayDays) {
      const decay = Math.max(0.5, 1.0 - ((ageDays - this.decayDays) / this.decayDays) * 0.3);
      entry.confidence = Math.max(0.5, entry.confidence * decay);
    }

    entry.lastUsed = Date.now();
    return entry.target;
  }

  /**
   * Check if a mapping was previously rejected.
   */
  _isRejected(sourceKey, targetKey) {
    const norm = sourceKey.toLowerCase().trim();
    return this.rejected.has(norm) && this.rejected.get(norm).has(targetKey);
  }

  _incrementFrequency(key) {
    this.frequency.set(key, (this.frequency.get(key) || 0) + 1);
  }

  /**
   * Get the N most-frequently-seen mismatches.
   */
  getTopMismatches(limit = 20) {
    return [...this.frequency.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([key, count]) => {
        const entry = this.approved.get(key);
        return {
          sourceKey: key,
          learnedTarget: entry ? entry.target : null,
          seenCount: count,
          confidence: entry ? entry.confidence : 0,
          status: entry ? 'learned' : 'pending',
        };
      });
  }

  /**
   * Export learned mappings as schema suggestions.
   */
  exportSchemaSuggestions() {
    const suggestions = {};
    for (const [source, entry] of this.approved.entries()) {
      suggestions[entry.target] = {
        from: source,
        confidence: entry.confidence,
        learnedAt: new Date(entry.learnedAt).toISOString(),
      };
    }
    return suggestions;
  }

  /**
   * Bulk import mappings from another engine or exported file.
   */
  bulkImport(mappings) {
    let imported = 0;
    for (const [source, target] of Object.entries(mappings)) {
      const norm = source.toLowerCase().trim();
      if (!this.approved.has(norm)) {
        this.approved.set(norm, {
          target,
          confidence: 0.95,
          lastUsed: Date.now(),
          learnedAt: Date.now(),
        });
        imported++;
      }
    }
    this._save();
    return imported;
  }

  /**
   * Bulk export all approved mappings as { source: target }.
   */
  bulkExport() {
    const result = {};
    for (const [source, entry] of this.approved.entries()) {
      result[source] = entry.target;
    }
    return result;
  }

  size() {
    return this.approved.size;
  }

  /**
   * Get engine statistics.
   */
  getStats() {
    return {
      approvedCount: this.approved.size,
      rejectedCount: this.rejected.size,
      totalLookups: [...this.frequency.values()].reduce((a, b) => a + b, 0),
      uniqueKeys: this.frequency.size,
      sessionId: this.sessionId,
    };
  }

  /**
   * Persist to disk.
   */
  _save() {
    try {
      const dir = path.dirname(this.storePath);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

      const data = {
        version: 3,
        lastUpdated: new Date().toISOString(),
        approved: Object.fromEntries(
          [...this.approved.entries()].map(([k, v]) => [k, {
            target: v.target,
            confidence: v.confidence,
            lastUsed: v.lastUsed,
            learnedAt: v.learnedAt,
          }])
        ),
        rejected: Object.fromEntries(
          [...this.rejected.entries()].map(([k, v]) => [k, [...v]])
        ),
        frequency: Object.fromEntries(this.frequency),
      };

      fs.writeFileSync(this.storePath, JSON.stringify(data, null, 2));
    } catch (e) {
      console.error(`[awsibnj] Failed to save learned data: ${e.message}`);
    }
  }

  /**
   * Load from disk, supporting both v1 and v2 formats.
   */
  _load() {
    try {
      if (!fs.existsSync(this.storePath)) return;
      const data = JSON.parse(fs.readFileSync(this.storePath, 'utf8'));

      if (data.version === 3 || data.version === 2) {
        // v2/v3 format: entries are { target, confidence, lastUsed, learnedAt }
        this.approved = new Map(
          Object.entries(data.approved || {}).map(([k, v]) => [k, {
            target: v.target,
            confidence: v.confidence || 1.0,
            lastUsed: v.lastUsed || Date.now(),
            learnedAt: v.learnedAt || Date.now(),
          }])
        );
      } else {
        // v1 compat: entries are simple strings
        this.approved = new Map(
          Object.entries(data.approved || {}).map(([k, v]) => [k, {
            target: typeof v === 'string' ? v : v.target || v,
            confidence: 1.0,
            lastUsed: Date.now(),
            learnedAt: Date.now(),
          }])
        );
      }

      this.frequency = new Map(Object.entries(data.frequency || {}));
      this.rejected = new Map(
        Object.entries(data.rejected || {}).map(([k, v]) => [k, new Set(v)])
      );
    } catch (e) {
      console.error(`[awsibnj] Failed to load learned data: ${e.message}`);
    }
  }

  /**
   * Clear all learned data — fresh start.
   */
  reset() {
    this.approved.clear();
    this.rejected.clear();
    this.frequency.clear();
    try { fs.unlinkSync(this.storePath); } catch { /* ignore */ }
  }
}

module.exports = { LearningEngine };
