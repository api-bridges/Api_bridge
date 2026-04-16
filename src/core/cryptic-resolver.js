/**
 * APIBridge AI v7 — Enhanced Cryptic Name Resolver
 *
 * Best-effort resolution of cryptic/arbitrary field names:
 *  - Prefix/suffix pattern extraction (e.g., z9_ref_id → ref_id)
 *  - Common cryptic prefix stripping (x_, z_, q_, etc.)
 *  - Database prefix stripping (tbl_, fk_, pk_, vw_, sp_)
 *  - Numeric prefix/suffix removal (e.g., field1 → field)
 *  - Known suffix matching (_id, _flag, _ref, _code, _type, _name, _date, _time)
 *  - Fragment-based matching against known vocabulary
 *  - N-gram similarity for short fragments
 *  - Confidence-weighted resolution with calibrated scoring
 *  - Context-aware scoring when sibling fields are available
 *
 * v7 improvements:
 *  - N-gram similarity for short fragment comparison
 *  - Database prefix detection (tbl_, fk_, pk_, vw_, sp_, idx_, fn_)
 *  - Calibrated confidence scoring with less conservative capping
 *  - Improved vocabulary matching with partial word detection
 *
 * Level 7 resolution: 55-70% confidence, flagged for review.
 */

const { distance } = require('fastest-levenshtein');
const { WORD_TO_GROUP, SYNONYM_GROUPS } = require('./synonyms');
const { ngramSimilarity } = require('./fuzzy-matcher');

// ─── KNOWN SUFFIXES AND PREFIXES ─────────────────────────────────────────────

/**
 * Common meaningful suffixes in API field names.
 */
const KNOWN_SUFFIXES = [
  '_id', '_ids', '_ref', '_key', '_code', '_type', '_kind', '_class',
  '_name', '_label', '_title', '_desc', '_description',
  '_flag', '_status', '_state', '_level', '_mode',
  '_date', '_time', '_timestamp', '_at', '_on',
  '_count', '_total', '_sum', '_avg', '_min', '_max', '_num', '_number',
  '_url', '_uri', '_path', '_link', '_href',
  '_email', '_phone', '_addr', '_address',
  '_price', '_cost', '_amount', '_rate', '_fee',
  '_size', '_length', '_width', '_height', '_weight',
  '_color', '_colour', '_icon', '_image', '_img',
  '_enabled', '_disabled', '_active', '_deleted', '_hidden', '_visible',
  '_index', '_order', '_position', '_rank', '_priority', '_seq',
  '_message', '_msg', '_text', '_note', '_comment',
  '_list', '_array', '_set', '_map', '_data', '_info', '_details',
  '_config', '_settings', '_options', '_params', '_args',
];

/**
 * Common cryptic prefixes that can be stripped.
 */
const CRYPTIC_PREFIXES = /^([a-z]{1,2}\d{0,2}|[a-z]\d|[a-z]{1,2})_/;

/**
 * v7: Common database/system prefixes that can be stripped.
 */
const DB_PREFIXES = /^(tbl|fk|pk|vw|sp|idx|fn|udf|trg|tmp|stg|dim|fct)_/i;

/**
 * Tokenize (same logic as transformer.js).
 */
function tokenize(key) {
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

// ─── CRYPTIC RESOLVER CLASS ──────────────────────────────────────────────────

class CrypticResolver {
  /**
   * @param {object} options
   * @param {number}  options.minConfidence      Minimum confidence to report (default 0.45)
   * @param {boolean} options.stripCrypticPrefix  Strip cryptic prefixes like x_, z9_, etc. (default true)
   * @param {boolean} options.stripDbPrefix        Strip database prefixes like tbl_, fk_, etc. (default true)
   * @param {boolean} options.useSuffixMatching   Use suffix-based matching (default true)
   * @param {boolean} options.useVocabulary       Match fragments against known vocabulary (default true)
   * @param {boolean} options.useNgram            Use n-gram similarity for short fragments (default true)
   */
  constructor(options = {}) {
    this.minConfidence = options.minConfidence || 0.45;
    this.stripCrypticPrefix = options.stripCrypticPrefix !== false;
    this.stripDbPrefix = options.stripDbPrefix !== false;
    this.useSuffixMatching = options.useSuffixMatching !== false;
    this.useVocabulary = options.useVocabulary !== false;
    this.useNgram = options.useNgram !== false;
  }

  /**
   * Attempt to resolve a cryptic field name to a meaningful one.
   *
   * @param {string}   sourceKey    The cryptic field name
   * @param {string[]} candidates   List of known/target field names to match against
   * @returns {{ match: string|null, confidence: number, method: string, stripped: string|null }}
   */
  resolve(sourceKey, candidates) {
    if (!candidates || candidates.length === 0) {
      return { match: null, confidence: 0, method: 'none', stripped: null };
    }

    const lower = sourceKey.toLowerCase();
    const results = [];

    // Strategy 1: Strip cryptic prefix and match remainder
    if (this.stripCrypticPrefix) {
      const stripped = this._stripPrefix(lower);
      if (stripped && stripped !== lower) {
        const match = this._findBestCandidate(stripped, candidates);
        if (match) {
          results.push({
            match: match.candidate,
            confidence: match.score * 0.65, // Prefix-stripped matches are lower confidence
            method: 'prefix_strip',
            stripped,
          });
        }
      }
    }

    // Strategy 1b: Strip database prefix and match remainder (v7)
    if (this.stripDbPrefix) {
      const dbStripped = this._stripDbPrefix(lower);
      if (dbStripped && dbStripped !== lower) {
        const match = this._findBestCandidate(dbStripped, candidates);
        if (match) {
          results.push({
            match: match.candidate,
            confidence: match.score * 0.70, // DB prefixes are more meaningful than cryptic
            method: 'db_prefix_strip',
            stripped: dbStripped,
          });
        }
      }
    }

    // Strategy 2: Suffix-based matching
    if (this.useSuffixMatching) {
      const suffixMatch = this._suffixMatch(lower, candidates);
      if (suffixMatch) {
        results.push({
          match: suffixMatch.candidate,
          confidence: suffixMatch.score,
          method: 'suffix_match',
          stripped: suffixMatch.suffix,
        });
      }
    }

    // Strategy 3: Fragment matching against known vocabulary
    if (this.useVocabulary) {
      const vocabMatch = this._vocabularyMatch(lower, candidates);
      if (vocabMatch) {
        results.push({
          match: vocabMatch.candidate,
          confidence: vocabMatch.score,
          method: 'vocabulary_match',
          stripped: vocabMatch.fragment,
        });
      }
    }

    // Strategy 4: Token overlap after stripping numeric/cryptic parts
    const cleanedTokens = this._cleanTokens(tokenize(sourceKey));
    if (cleanedTokens.length > 0) {
      const tokenMatch = this._tokenOverlapMatch(cleanedTokens, candidates);
      if (tokenMatch) {
        results.push({
          match: tokenMatch.candidate,
          confidence: tokenMatch.score,
          method: 'token_overlap',
          stripped: cleanedTokens.join('_'),
        });
      }
    }

    // Strategy 5: N-gram similarity (v7 — helps with short/garbled names)
    if (this.useNgram) {
      const ngramMatch = this._ngramMatch(lower, candidates);
      if (ngramMatch) {
        results.push({
          match: ngramMatch.candidate,
          confidence: ngramMatch.score,
          method: 'ngram_match',
          stripped: null,
        });
      }
    }

    // Return the best result
    if (results.length === 0) {
      return { match: null, confidence: 0, method: 'none', stripped: null };
    }

    results.sort((a, b) => b.confidence - a.confidence);
    const best = results[0];

    if (best.confidence < this.minConfidence) {
      return { match: null, confidence: best.confidence, method: best.method, stripped: best.stripped };
    }

    return best;
  }

  /**
   * Check if a key appears cryptic (short random-looking prefix, digits mixed in).
   */
  isCryptic(key) {
    const lower = key.toLowerCase();

    // Pattern: single/double letter + digit prefix (e.g., x9_, z1_, a2b_)
    if (/^[a-z]{1,2}\d+_/.test(lower)) return true;

    // Pattern: single letter prefix with underscore (e.g., x_, q_)
    if (/^[a-z]_/.test(lower) && lower.length > 2) return true;

    // Pattern: all tokens are very short (< 3 chars) and contain digits
    const tokens = tokenize(key);
    const shortCount = tokens.filter(t => t.length <= 2).length;
    const digitCount = tokens.filter(t => /\d/.test(t)).length;
    if (tokens.length > 1 && shortCount > tokens.length / 2 && digitCount > 0) return true;

    // Pattern: no recognizable words from synonym dictionary
    if (this.useVocabulary && tokens.length > 0) {
      const recognized = tokens.filter(t => WORD_TO_GROUP.has(t)).length;
      if (recognized === 0 && tokens.some(t => /\d/.test(t))) return true;
    }

    return false;
  }

  /**
   * Strip cryptic prefix from a key.
   */
  _stripPrefix(key) {
    const match = key.match(CRYPTIC_PREFIXES);
    if (match) {
      const prefix = match[1];
      // Only strip if prefix looks cryptic (single letter, letter+digit, etc.)
      if (/^[a-z]\d*$/.test(prefix) || /^[a-z]{2}\d+$/.test(prefix)) {
        return key.slice(match[0].length);
      }
    }
    return null;
  }

  /**
   * v7: Strip database prefix from a key.
   */
  _stripDbPrefix(key) {
    const match = key.match(DB_PREFIXES);
    if (match) {
      return key.slice(match[0].length);
    }
    return null;
  }

  /**
   * Find the best candidate match for a stripped/cleaned key.
   * v7: Enhanced with n-gram fallback for short tokens.
   */
  _findBestCandidate(key, candidates) {
    const keyTokens = tokenize(key);
    const keyJoined = keyTokens.join('');

    let bestCandidate = null;
    let bestScore = 0;

    for (const candidate of candidates) {
      const candTokens = tokenize(candidate);
      const candJoined = candTokens.join('');

      // Exact match after tokenization
      if (keyJoined === candJoined) {
        return { candidate, score: 1.0 };
      }

      // Levenshtein similarity
      const maxLen = Math.max(keyJoined.length, candJoined.length);
      if (maxLen === 0) continue;
      const dist = distance(keyJoined, candJoined);
      let score = 1 - dist / maxLen;

      // v7: Boost with n-gram similarity for short keys
      if (this.useNgram && keyJoined.length >= 3 && candJoined.length >= 3) {
        const ngramScore = ngramSimilarity(keyJoined, candJoined);
        score = Math.max(score, (score + ngramScore) / 2);
      }

      if (score > bestScore) {
        bestScore = score;
        bestCandidate = candidate;
      }
    }

    if (bestScore < 0.6) return null;
    return { candidate: bestCandidate, score: bestScore };
  }

  /**
   * Match by shared suffix patterns.
   */
  _suffixMatch(key, candidates) {
    // Find the longest known suffix in the source key
    let foundSuffix = null;
    for (const suffix of KNOWN_SUFFIXES) {
      if (key.endsWith(suffix) || key.endsWith(suffix.replace(/_/g, ''))) {
        if (!foundSuffix || suffix.length > foundSuffix.length) {
          foundSuffix = suffix;
        }
      }
    }

    if (!foundSuffix) return null;

    // Find candidates that share this suffix
    let bestCandidate = null;
    let bestScore = 0;

    for (const candidate of candidates) {
      const candLower = candidate.toLowerCase();
      const candTokenized = tokenize(candidate).join('_');

      if (candLower.endsWith(foundSuffix) || candTokenized.endsWith(foundSuffix.replace(/^_/, ''))) {
        // Both share the same suffix — score based on overall similarity
        const dist = distance(tokenize(key).join(''), tokenize(candidate).join(''));
        const maxLen = Math.max(key.length, candidate.length);
        const score = maxLen > 0 ? Math.max(0.55, (1 - dist / maxLen) * 0.7 + 0.3) : 0;

        if (score > bestScore) {
          bestScore = score;
          bestCandidate = candidate;
        }
      }
    }

    if (!bestCandidate) return null;
    return { candidate: bestCandidate, score: Math.min(bestScore, 0.65), suffix: foundSuffix };
  }

  /**
   * Match fragments of the cryptic key against known vocabulary words.
   * v7: Improved with partial word detection and better confidence calibration.
   */
  _vocabularyMatch(key, candidates) {
    const tokens = tokenize(key);

    // Find tokens that are in the vocabulary
    const meaningfulTokens = tokens.filter(t =>
      WORD_TO_GROUP.has(t) || t.length >= 4,
    );

    if (meaningfulTokens.length === 0) return null;

    let bestCandidate = null;
    let bestScore = 0;
    let bestFragment = null;

    for (const candidate of candidates) {
      const candTokens = tokenize(candidate);
      let overlapCount = 0;

      for (const mt of meaningfulTokens) {
        for (const ct of candTokens) {
          if (mt === ct) {
            overlapCount++;
            break;
          }
          // Check same synonym group
          const mtGroup = WORD_TO_GROUP.get(mt);
          const ctGroup = WORD_TO_GROUP.get(ct);
          if (mtGroup !== undefined && mtGroup === ctGroup) {
            overlapCount += 0.8;
            break;
          }
          // v7: Partial word overlap (one contains the other)
          if (mt.length >= 3 && ct.length >= 3 && (mt.includes(ct) || ct.includes(mt))) {
            const shorter = Math.min(mt.length, ct.length);
            const longer = Math.max(mt.length, ct.length);
            overlapCount += (shorter / longer) * 0.6;
            break;
          }
        }
      }

      if (overlapCount > 0) {
        // v7: Better confidence calibration — allow higher confidence when overlap is strong
        const ratio = overlapCount / Math.max(meaningfulTokens.length, candTokens.length);
        const score = Math.min(0.70, ratio * 0.75 + 0.1);
        if (score > bestScore) {
          bestScore = score;
          bestCandidate = candidate;
          bestFragment = meaningfulTokens.join('_');
        }
      }
    }

    if (!bestCandidate) return null;
    return { candidate: bestCandidate, score: bestScore, fragment: bestFragment };
  }

  /**
   * Remove purely numeric and single-char cryptic tokens.
   */
  _cleanTokens(tokens) {
    return tokens.filter(t => {
      // Remove pure numbers
      if (/^\d+$/.test(t)) return false;
      // Remove single-char tokens that look cryptic
      if (t.length === 1 && /^[a-z]$/.test(t)) return false;
      // Remove letter+digit combos (e.g., "z9", "x1")
      if (/^[a-z]\d+$/.test(t)) return false;
      return true;
    });
  }

  /**
   * Match cleaned tokens against candidate tokens.
   * v7: Enhanced with n-gram similarity for better short-token matching.
   */
  _tokenOverlapMatch(cleanedTokens, candidates) {
    let bestCandidate = null;
    let bestScore = 0;

    for (const candidate of candidates) {
      const candTokens = tokenize(candidate);
      let matchCount = 0;

      for (const ct of cleanedTokens) {
        for (const candt of candTokens) {
          if (ct === candt) {
            matchCount++;
            break;
          }
          // Levenshtein on tokens
          const maxLen = Math.max(ct.length, candt.length);
          if (maxLen > 0) {
            const sim = 1 - distance(ct, candt) / maxLen;
            if (sim > 0.75) {
              matchCount += sim;
              break;
            }
            // v7: N-gram fallback for short tokens
            if (this.useNgram && ct.length >= 3 && candt.length >= 3) {
              const ngramSim = ngramSimilarity(ct, candt);
              if (ngramSim > 0.6) {
                matchCount += ngramSim * 0.7;
                break;
              }
            }
          }
        }
      }

      if (matchCount > 0) {
        const total = Math.max(cleanedTokens.length, candTokens.length);
        // v7: Better calibration — allow higher confidence when match is strong
        const score = Math.min(0.70, (matchCount / total) * 0.70 + 0.1);

        if (score > bestScore) {
          bestScore = score;
          bestCandidate = candidate;
        }
      }
    }

    if (!bestCandidate || bestScore < 0.45) return null;
    return { candidate: bestCandidate, score: bestScore };
  }

  /**
   * v7: N-gram based matching for short/garbled cryptic names.
   */
  _ngramMatch(key, candidates) {
    const keyTokens = tokenize(key).join('');
    if (keyTokens.length < 3) return null;

    let bestCandidate = null;
    let bestScore = 0;

    for (const candidate of candidates) {
      const candTokens = tokenize(candidate).join('');
      if (candTokens.length < 3) continue;

      const sim = ngramSimilarity(keyTokens, candTokens);
      if (sim > bestScore) {
        bestScore = sim;
        bestCandidate = candidate;
      }
    }

    if (!bestCandidate || bestScore < 0.5) return null;
    // Cap at 0.60 — n-gram alone is not high-confidence
    return { candidate: bestCandidate, score: Math.min(bestScore * 0.65, 0.60) };
  }
}

module.exports = {
  CrypticResolver,
  KNOWN_SUFFIXES,
  CRYPTIC_PREFIXES,
  DB_PREFIXES,
  tokenize,
};
