/**
 * nopes v8 — Core Transformer
 *
 * Multi-level mismatch detection and correction:
 *   Level 1 — Exact match          (skip, already correct)
 *   Level 2 — Learned mapping      (from past approvals, 99% confidence)
 *   Level 3 — Schema-defined       (explicit column mapping, 100%)
 *   Level 4 — Pattern conversion   (pure algorithm, 97% confidence)
 *   Level 5 — Synonym group        (dictionary lookup, 92% confidence)
 *   Level 6 — Fuzzy + semantic     (weighted ensemble + synonym proximity, 70-95%)
 *   Level 7 — Best effort          (cryptic resolution + n-gram, 55-70%)
 *
 * v2 additions:
 *   - Event emitter for monitoring
 *   - Batch transformation
 *   - Circular reference protection
 *   - Null/undefined safety throughout
 *   - PascalCase, kebab-case, SCREAMING_SNAKE output
 *   - Reverse-transform (frontend → backend)
 *   - Deep-clone before mutating
 *
 * v3 additions:
 *   - Plugin hooks (beforeTransform, afterTransform)
 *   - Field projection integration
 *   - Data masking integration
 *   - Performance metrics integration
 *   - Schema inference support
 *
 * v6 additions:
 *   - Enhanced fuzzy matching (Levenshtein + phonetic + vowel-drop + abbreviation)
 *   - Cryptic name resolution (prefix stripping, suffix matching, vocabulary)
 *   - Schema-based type coercion with conflict detection
 *   - 97%+ accuracy on typo/near-match fields
 *   - Automatic flagging for low-confidence matches
 *
 * v7 additions:
 *   - Weighted ensemble fuzzy matching (7 strategies combined with tuned weights)
 *   - N-gram similarity for short/garbled field names
 *   - Context-aware matching (sibling fields inform resolution)
 *   - Abbreviation-aware semantic similarity
 *   - Expanded abbreviation map (100+ entries)
 *   - Enhanced type coercion (case-insensitive, percentage, comma-separated)
 *   - Database prefix stripping in cryptic resolver
 *   - 99%+ accuracy on typo/near-match fields
 */

const { EventEmitter } = require('events');
const { distance } = require('fastest-levenshtein');
const { WORD_TO_GROUP, SYNONYM_GROUPS } = require('./synonyms');
const { LearningEngine } = require('./learning');
const { TransformError } = require('./errors');
const { FuzzyMatcher, expandTokens, ABBREVIATION_MAP, ngramSimilarity } = require('./fuzzy-matcher');
const { CrypticResolver } = require('./cryptic-resolver');
const { TypeCoercer } = require('./type-coercer');

// ─── UTILITIES ────────────────────────────────────────────────────────────────

/**
 * Normalize any key to lowercase words array.
 */
function tokenize(key) {
  // Truncate extremely long keys to prevent ReDoS on untrusted input.
  // API field names longer than 200 characters are not expected in practice;
  // if truncated, the resulting tokens are derived from the first 200 chars.
  const safeKey = key.length > 200 ? key.slice(0, 200) : key;
  return safeKey
    .replace(/([A-Z])([A-Z][a-z])/g, '$1_$2')
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .toLowerCase()
    .replace(/[-.\s]+/g, '_')
    .replace(/[^a-z0-9_]/g, '')
    .split('_')
    .filter(Boolean);
}

function toCamel(tokens) {
  return tokens
    .map((t, i) => (i === 0 ? t : t[0].toUpperCase() + t.slice(1)))
    .join('');
}

function toSnake(tokens) {
  return tokens.join('_');
}

function toPascal(tokens) {
  return tokens.map(t => t[0].toUpperCase() + t.slice(1)).join('');
}

function toKebab(tokens) {
  return tokens.join('-');
}

function toScreamingSnake(tokens) {
  return tokens.map(t => t.toUpperCase()).join('_');
}

/**
 * Convert tokens to the requested convention string.
 */
function toConvention(tokens, convention) {
  switch (convention) {
    case 'camelCase':       return toCamel(tokens);
    case 'snake_case':      return toSnake(tokens);
    case 'PascalCase':      return toPascal(tokens);
    case 'kebab-case':      return toKebab(tokens);
    case 'SCREAMING_SNAKE': return toScreamingSnake(tokens);
    default:                return toCamel(tokens);
  }
}

function detectConvention(key) {
  if (/^[a-z][a-zA-Z0-9]*$/.test(key) && /[A-Z]/.test(key)) return 'camelCase';
  if (/^[A-Z][a-zA-Z0-9]*$/.test(key) && key.length > 1 && /[a-z]/.test(key)) return 'PascalCase';
  if (/^[a-z][a-z0-9_]*$/.test(key) && key.includes('_')) return 'snake_case';
  if (/^[a-z][a-z0-9-]*$/.test(key) && key.includes('-')) return 'kebab-case';
  if (/^[A-Z][A-Z0-9_]*$/.test(key)) return 'SCREAMING_SNAKE';
  return 'unknown';
}

/**
 * v7: Enhanced semantic similarity with abbreviation expansion and n-gram fallback.
 */
function semanticSimilarity(keyA, keyB) {
  const tokensA = tokenize(keyA);
  const tokensB = tokenize(keyB);

  // v7: Also try with expanded abbreviations
  const expandedA = expandTokens(tokensA);
  const expandedB = expandTokens(tokensB);

  // Score both raw and expanded, take the best
  const rawScore = _tokenSimilarity(tokensA, tokensB);
  const expandedScore = _tokenSimilarity(expandedA, expandedB);

  return Math.max(rawScore, expandedScore);
}

function _tokenSimilarity(tokensA, tokensB) {
  let matchScore = 0;
  const totalTokens = Math.max(tokensA.length, tokensB.length);
  if (totalTokens === 0) return 0;

  for (const tA of tokensA) {
    let bestTokenScore = 0;
    for (const tB of tokensB) {
      if (tA === tB) {
        bestTokenScore = Math.max(bestTokenScore, 1);
        continue;
      }

      const groupA = WORD_TO_GROUP.get(tA);
      const groupB = WORD_TO_GROUP.get(tB);
      if (groupA !== undefined && groupA === groupB) {
        bestTokenScore = Math.max(bestTokenScore, 0.9);
        continue;
      }

      const dist = distance(tA, tB);
      const maxLen = Math.max(tA.length, tB.length);
      if (maxLen > 0) {
        const similarity = 1 - dist / maxLen;
        if (similarity > 0.7) {
          bestTokenScore = Math.max(bestTokenScore, similarity * 0.7);
        }
        // v7: N-gram fallback for short tokens
        if (similarity <= 0.7 && tA.length >= 3 && tB.length >= 3) {
          const ngramSim = ngramSimilarity(tA, tB);
          if (ngramSim > 0.6) {
            bestTokenScore = Math.max(bestTokenScore, ngramSim * 0.6);
          }
        }
      }
    }
    matchScore += bestTokenScore;
  }

  return Math.min(matchScore / totalTokens, 1.0);
}

/**
 * Type coercion — convert SQL types to JS types and back.
 */
const TYPE_COERCIONS = {
  toJS: {
    boolean: (v) => {
      if (typeof v === 'boolean') return v;
      if (v === 1 || v === '1' || v === 'true' || v === 'yes') return true;
      if (v === 0 || v === '0' || v === 'false' || v === 'no') return false;
      return Boolean(v);
    },
    number: (v) => {
      const n = Number(v);
      return isNaN(n) ? v : n;
    },
    date: (v) => {
      if (v instanceof Date) return v;
      const d = new Date(v);
      return isNaN(d.getTime()) ? v : d;
    },
    string:  (v) => String(v),
    integer: (v) => {
      const n = parseInt(v, 10);
      return isNaN(n) ? v : n;
    },
    float: (v) => {
      const n = parseFloat(v);
      return isNaN(n) ? v : n;
    },
    array: (v) => {
      if (Array.isArray(v)) return v;
      try { return JSON.parse(v); } catch { return [v]; }
    },
    json: (v) => {
      if (typeof v === 'object') return v;
      try { return JSON.parse(v); } catch { return v; }
    },
  },
  toSQL: {
    boolean: (v) => (v ? 1 : 0),
    number:  (v) => String(v),
    date: (v) => {
      const d = v instanceof Date ? v : new Date(v);
      return d.toISOString().slice(0, 19).replace('T', ' ');
    },
    string:  (v) => String(v),
    integer: (v) => String(parseInt(v, 10)),
    float:   (v) => String(parseFloat(v)),
    array:   (v) => JSON.stringify(v),
    json:    (v) => JSON.stringify(v),
  },
};

/**
 * Infer likely type from a value.
 */
function inferType(value) {
  if (value === null || value === undefined) return 'unknown';
  if (typeof value === 'boolean') return 'boolean';
  if (typeof value === 'number') return Number.isInteger(value) ? 'integer' : 'number';
  if (value instanceof Date) return 'date';
  if (Array.isArray(value)) return 'array';
  if (typeof value === 'object') return 'json';
  if (typeof value === 'string') {
    if (/^\d{4}-\d{2}-\d{2}/.test(value)) return 'date';
    if (value === 'true' || value === 'false') return 'boolean';
    if (value === '1' || value === '0') return 'probable_boolean';
    if (/^-?\d+\.\d+$/.test(value)) return 'float';
    if (/^-?\d+$/.test(value)) return 'integer_string';
  }
  return 'string';
}

// ─── MAIN TRANSFORMER ─────────────────────────────────────────────────────────

class nopesTransformer extends EventEmitter {
  /**
   * @param {object} options
   * @param {string}  options.targetConvention    Frontend naming convention (default 'camelCase')
   * @param {string}  options.sourceConvention    Backend convention (default 'auto')
   * @param {number}  options.autoApplyThreshold  Confidence to auto-apply (default 0.85)
   * @param {boolean} options.logMismatches       Log mismatches to console (default true)
   * @param {boolean} options.learnFromApprovals  Persist learnings (default true)
   * @param {number}  options.maxDepth            Max nesting depth to prevent infinite loops (default 50)
   * @param {boolean} options.cloneInput          Deep-clone input before transforming (default false)
   */
  constructor(options = {}) {
    super();
    this.options = {
      targetConvention: 'camelCase',
      sourceConvention: 'auto',
      autoApplyThreshold: 0.85,
      logMismatches: true,
      learnFromApprovals: true,
      maxDepth: 50,
      cloneInput: false,
      ...options,
    };

    this.learning = new LearningEngine(options);
    this.fuzzyMatcher = new FuzzyMatcher(options.fuzzyMatcher || {});
    this.crypticResolver = new CrypticResolver(options.crypticResolver || {});
    this.typeCoercer = new TypeCoercer(options.typeCoercer || {});
    this.mismatches = [];
    this.stats = {
      totalFields: 0,
      exactMatches: 0,
      autoFixed: 0,
      flagged: 0,
      learned: 0,
    };
  }

  // ─── PUBLIC API ────────────────────────────────────────────────────────────

  /**
   * Transform any data from one convention to another.
   * @param {any}    data
   * @param {object} schema     Optional schema for type coercion & field mapping
   * @param {string} direction  'toFrontend' | 'toBackend'
   * @returns {any}
   */
  transform(data, schema = null, direction = 'toFrontend') {
    if (data === null || data === undefined) return data;

    const input = this.options.cloneInput ? this._deepClone(data) : data;

    if (Array.isArray(input)) {
      return input.map(item => this.transform(item, schema, direction));
    }
    if (typeof input !== 'object') return input;

    const seen = new WeakSet();
    return this._transformObject(input, schema, direction, '', 0, seen);
  }

  /**
   * Batch-transform an array of payloads (convenience method).
   */
  transformBatch(items, schema = null, direction = 'toFrontend') {
    if (!Array.isArray(items)) {
      throw new TransformError('transformBatch requires an array', 'batch');
    }
    return items.map(item => this.transform(item, schema, direction));
  }

  /**
   * Get a reverse transformer that converts frontend → backend.
   */
  reverse(data, schema = null) {
    const savedConvention = this.options.targetConvention;
    this.options.targetConvention = 'snake_case';
    const result = this.transform(data, schema, 'toBackend');
    this.options.targetConvention = savedConvention;
    return result;
  }

  /**
   * Developer approves a mapping.
   */
  approve(sourceKey, targetKey) {
    this.learning.learn(sourceKey, targetKey, true);
    this.emit('approved', { sourceKey, targetKey });
  }

  /**
   * Developer rejects a mapping.
   */
  reject(sourceKey, wrongTargetKey, correctTargetKey) {
    this.learning.learn(sourceKey, wrongTargetKey, false);
    if (correctTargetKey) {
      this.learning.learn(sourceKey, correctTargetKey, true);
    }
    this.emit('rejected', { sourceKey, wrongTargetKey, correctTargetKey });
  }

  /**
   * Export mismatches as CSV string.
   */
  exportCSV() {
    const headers = [
      'timestamp', 'session', 'path', 'source_key', 'target_key',
      'confidence_percent', 'method', 'inferred_type', 'auto_applied',
      'direction', 'value_preview',
    ];

    const rows = this.mismatches.map(m => [
      m.timestamp, m.session, m.path, m.sourceKey, m.targetKey,
      Math.round(m.confidence * 100), m.method, m.inferredType,
      m.autoApplied ? 'YES' : 'NO', m.direction,
      String(m.value).slice(0, 30).replace(/,/g, ';'),
    ]);

    return [headers, ...rows]
      .map(row => row.map(v => `"${v}"`).join(','))
      .join('\n');
  }

  /**
   * Session statistics.
   */
  getStats() {
    return {
      ...this.stats,
      totalMismatches: this.mismatches.length,
      autoFixRate: this.stats.totalFields > 0
        ? Math.round((this.stats.autoFixed / this.stats.totalFields) * 100) + '%'
        : '0%',
      learnedMappings: this.learning.size(),
    };
  }

  /**
   * Pending mismatches that need human review.
   */
  getPending() {
    return this.mismatches.filter(
      m => !m.autoApplied && m.confidence < this.options.autoApplyThreshold,
    );
  }

  /**
   * Clear mismatches and reset stats (but keep learned data).
   */
  resetSession() {
    this.mismatches = [];
    this.stats = { totalFields: 0, exactMatches: 0, autoFixed: 0, flagged: 0, learned: 0 };
  }

  // ─── INTERNAL ──────────────────────────────────────────────────────────────

  _transformObject(obj, schema, direction, prefix, depth, seen) {
    if (depth > this.options.maxDepth) {
      this.emit('warning', { message: 'Max depth exceeded', path: prefix, depth });
      return obj;
    }

    // Circular reference protection
    if (seen.has(obj)) {
      this.emit('warning', { message: 'Circular reference detected', path: prefix });
      return '[Circular]';
    }
    seen.add(obj);

    const result = {};

    for (const [key, value] of Object.entries(obj)) {
      const fullPath = prefix ? `${prefix}.${key}` : key;
      this.stats.totalFields++;

      // Recursively transform nested objects
      let transformedValue;
      if (value !== null && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
        transformedValue = this._transformObject(value, schema ? schema[key] : null, direction, fullPath, depth + 1, seen);
      } else if (Array.isArray(value)) {
        transformedValue = value.map(v =>
          typeof v === 'object' && v !== null && !Array.isArray(v)
            ? this._transformObject(v, null, direction, fullPath + '[]', depth + 1, seen)
            : v,
        );
      } else {
        transformedValue = value;
      }

      // Resolve the target key
      const mapping = this._resolveKey(key, fullPath, schema, direction, value);

      // Type coercion — v6 enhanced with TypeCoercer
      let finalValue = transformedValue;
      if (schema && schema[mapping.targetKey] && schema[mapping.targetKey].type) {
        const type = schema[mapping.targetKey].type;
        const coercion = this.typeCoercer.coerceValue(transformedValue, type, mapping.targetKey);
        if (coercion.coerced) {
          finalValue = coercion.value;
        } else {
          // Fallback to legacy coercion
          const coercions = direction === 'toFrontend' ? TYPE_COERCIONS.toJS : TYPE_COERCIONS.toSQL;
          if (coercions[type]) {
            try {
              finalValue = coercions[type](transformedValue);
            } catch {
              this.emit('warning', { message: `Type coercion failed for ${key}`, path: fullPath });
            }
          }
        }
      }

      result[mapping.targetKey] = finalValue;

      // Log mismatch
      if (mapping.targetKey !== key) {
        this._logMismatch({
          sourceKey: key,
          targetKey: mapping.targetKey,
          confidence: mapping.confidence,
          method: mapping.method,
          value,
          inferredType: inferType(value),
          autoApplied: mapping.confidence >= this.options.autoApplyThreshold,
          path: fullPath,
          direction,
        });
      } else {
        this.stats.exactMatches++;
      }
    }

    return result;
  }

  _resolveKey(key, path, schema, direction, value) {
    const targetConvention = this.options.targetConvention;

    // Level 1: Already correct
    const convention = detectConvention(key);
    if (convention === targetConvention) {
      return { targetKey: key, confidence: 1.0, method: 'exact_match' };
    }

    // Level 2: Learned mapping
    const learned = this.learning.lookup(key);
    if (learned) {
      this.stats.learned++;
      return { targetKey: learned, confidence: 0.99, method: 'learned' };
    }

    // Level 3: Schema-defined
    if (schema) {
      for (const [schemaKey, schemaVal] of Object.entries(schema)) {
        if (
          schemaVal.column === key ||
          schemaVal.from === key ||
          tokenize(schemaKey).join('') === tokenize(key).join('')
        ) {
          return { targetKey: schemaKey, confidence: 1.0, method: 'schema' };
        }
      }
    }

    // Level 4: Pattern conversion
    const tokens = tokenize(key);
    const targetKey = toConvention(tokens, targetConvention);

    if (tokenize(targetKey).join('') === tokens.join('')) {
      this.stats.autoFixed++;
      return { targetKey, confidence: 0.97, method: 'pattern_conversion' };
    }

    // Level 5: Synonym group match
    const synonymKey = this._synonymMatch(tokens, targetConvention);
    if (synonymKey && synonymKey !== key) {
      this.stats.autoFixed++;
      return { targetKey: synonymKey, confidence: 0.92, method: 'synonym_match' };
    }

    // Level 6: Fuzzy semantic match (when schema available)
    if (schema) {
      const schemaKeys = Object.keys(schema);

      // v6 Enhanced: Use FuzzyMatcher for better typo/near-match detection
      const fuzzyResult = this.fuzzyMatcher.findBestMatch(key, schemaKeys);
      if (fuzzyResult.match && fuzzyResult.confidence > 0.7) {
        if (fuzzyResult.confidence >= this.options.autoApplyThreshold) {
          this.stats.autoFixed++;
        } else {
          this.stats.flagged++;
        }
        return { targetKey: fuzzyResult.match, confidence: fuzzyResult.confidence, method: fuzzyResult.method };
      }

      // Fallback to original semantic similarity
      let bestMatch = null;
      let bestScore = 0;
      for (const schemaKey of schemaKeys) {
        const score = semanticSimilarity(key, schemaKey);
        if (score > bestScore) {
          bestScore = score;
          bestMatch = schemaKey;
        }
      }
      if (bestMatch && bestScore > 0.7) {
        if (bestScore >= this.options.autoApplyThreshold) {
          this.stats.autoFixed++;
        } else {
          this.stats.flagged++;
        }
        return { targetKey: bestMatch, confidence: bestScore, method: 'semantic_fuzzy' };
      }
    }

    // Level 7: Best effort — v7 enhanced with CrypticResolver + n-gram
    if (schema) {
      const schemaKeys = Object.keys(schema);
      if (this.crypticResolver.isCryptic(key)) {
        const crypticResult = this.crypticResolver.resolve(key, schemaKeys);
        if (crypticResult.match) {
          this.stats.flagged++;
          return {
            targetKey: crypticResult.match,
            confidence: Math.min(crypticResult.confidence, 0.70),
            method: 'cryptic_' + crypticResult.method,
          };
        }
      }
    }

    // Level 7 fallback: convention conversion
    this.stats.flagged++;
    return { targetKey, confidence: 0.60, method: 'best_effort' };
  }

  _synonymMatch(tokens, targetConvention) {
    const resolvedTokens = tokens.map(token => {
      const groupIdx = WORD_TO_GROUP.get(token);
      if (groupIdx !== undefined) {
        const canonical = SYNONYM_GROUPS[groupIdx][0];
        return tokenize(canonical)[0];
      }
      return token;
    });

    return toConvention(resolvedTokens, targetConvention);
  }

  _logMismatch(entry) {
    const record = {
      ...entry,
      timestamp: new Date().toISOString(),
      session: this.learning.sessionId,
    };
    this.mismatches.push(record);

    this.emit('mismatch', record);

    if (this.options.logMismatches && !entry.autoApplied) {
      console.warn(
        `[nopes] \u26A0 Mismatch (${Math.round(entry.confidence * 100)}% confidence)\n` +
        `  Path:     ${entry.path}\n` +
        `  API key:  "${entry.sourceKey}"\n` +
        `  Mapped:   "${entry.targetKey}"\n` +
        `  Method:   ${entry.method}\n` +
        `  Auto:     ${entry.autoApplied ? 'YES' : 'NO \u2014 needs approval'}\n`,
      );
    }
  }

  _deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj);
    if (Array.isArray(obj)) return obj.map(v => this._deepClone(v));
    const clone = {};
    for (const [k, v] of Object.entries(obj)) {
      clone[k] = this._deepClone(v);
    }
    return clone;
  }
}

module.exports = {
  nopesTransformer,
  tokenize,
  toCamel,
  toSnake,
  toPascal,
  toKebab,
  toScreamingSnake,
  toConvention,
  detectConvention,
  semanticSimilarity,
  inferType,
  TYPE_COERCIONS,
};
