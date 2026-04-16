/**
 * APIBridge AI v6 — Enhanced Fuzzy Matcher
 *
 * Multi-strategy fuzzy matching for typos and near-matches:
 *  - Levenshtein distance with normalized scoring
 *  - Vowel-drop detection (e.g., "usr" → "user", "eml" → "email")
 *  - Common abbreviation expansion (e.g., "addr" → "address", "msg" → "message")
 *  - Phonetic similarity (simple Soundex-like grouping)
 *  - Token-level partial matching for compound keys
 *  - Confidence scoring with method attribution
 *
 * Designed for 97%+ accuracy on typo/near-match fields.
 */

const { distance } = require('fastest-levenshtein');

// ─── COMMON ABBREVIATION MAP ─────────────────────────────────────────────────

const ABBREVIATION_MAP = new Map([
  // Person
  ['usr', 'user'], ['usrname', 'username'], ['uname', 'username'],
  ['fname', 'first_name'], ['lname', 'last_name'], ['mname', 'middle_name'],
  ['nm', 'name'], ['fullnm', 'full_name'],
  // Contact
  ['eml', 'email'], ['mail', 'email'], ['em', 'email'],
  ['addr', 'address'], ['ph', 'phone'], ['phn', 'phone'], ['tel', 'telephone'],
  ['mob', 'mobile'], ['cel', 'cell'],
  // Identity
  ['acct', 'account'], ['acc', 'account'],
  ['id', 'identifier'], ['num', 'number'], ['no', 'number'],
  // Content
  ['desc', 'description'], ['msg', 'message'], ['txt', 'text'],
  ['cmt', 'comment'], ['lbl', 'label'], ['cat', 'category'],
  // Status
  ['stat', 'status'], ['sts', 'status'], ['flg', 'flag'],
  ['act', 'active'], ['del', 'deleted'], ['en', 'enabled'],
  // Date/Time
  ['dt', 'date'], ['tm', 'time'], ['ts', 'timestamp'],
  ['crt', 'created'], ['upd', 'updated'], ['mod', 'modified'],
  // Technical
  ['cfg', 'config'], ['conf', 'config'], ['env', 'environment'],
  ['ver', 'version'], ['ref', 'reference'], ['req', 'request'],
  ['res', 'response'], ['resp', 'response'], ['err', 'error'],
  ['val', 'value'], ['cnt', 'count'], ['qty', 'quantity'],
  ['amt', 'amount'], ['prc', 'price'], ['cur', 'currency'],
  ['org', 'organization'], ['dept', 'department'], ['grp', 'group'],
  ['img', 'image'], ['pic', 'picture'], ['ava', 'avatar'],
  ['pwd', 'password'], ['pw', 'password'], ['tok', 'token'],
  ['perm', 'permission'], ['auth', 'authorization'],
  ['loc', 'location'], ['lat', 'latitude'], ['lng', 'longitude'],
  ['lon', 'longitude'], ['tz', 'timezone'],
  ['src', 'source'], ['dst', 'destination'], ['tgt', 'target'],
  ['idx', 'index'], ['pos', 'position'], ['seq', 'sequence'],
  ['lvl', 'level'], ['pri', 'priority'], ['sev', 'severity'],
  ['typ', 'type'], ['cls', 'class'], ['fmt', 'format'],
  ['len', 'length'], ['sz', 'size'], ['ht', 'height'], ['wd', 'width'],
  ['min', 'minimum'], ['max', 'maximum'], ['avg', 'average'],
  ['tmp', 'temporary'],
  ['prev', 'previous'], ['nxt', 'next'], ['curr', 'current'],
  ['cb', 'callback'], ['fn', 'function'], ['proc', 'process'],
  ['tbl', 'table'], ['col', 'column'], ['db', 'database'],
  ['srv', 'server'], ['svc', 'service'], ['api', 'api'],
  ['hdr', 'header'], ['bdy', 'body'], ['prm', 'parameter'],
  ['arg', 'argument'], ['opt', 'option'], ['prop', 'property'],
  ['attr', 'attribute'], ['elem', 'element'], ['comp', 'component'],
]);

// ─── VOWEL PATTERNS ──────────────────────────────────────────────────────────

/**
 * Remove vowels from a string (keeping first letter) to detect vowel-dropped abbreviations.
 */
function dropVowels(word) {
  if (word.length <= 2) return word;
  return word[0] + word.slice(1).replace(/[aeiou]/gi, '');
}

/**
 * Check if `abbr` is a vowel-dropped version of `full`.
 */
function isVowelDrop(abbr, full) {
  if (abbr.length >= full.length) return false;
  const droppedFull = dropVowels(full);
  if (abbr === droppedFull) return true;
  // Also check if abbr is a prefix of the vowel-dropped version
  if (droppedFull.startsWith(abbr) && abbr.length >= Math.max(2, droppedFull.length - 2)) return true;
  return false;
}

// ─── PHONETIC GROUPING ───────────────────────────────────────────────────────

/**
 * Simple phonetic fingerprint — groups similar-sounding tokens.
 * Not a full Soundex, but handles common developer typos:
 *  - ph/f confusion
 *  - y/i confusion
 *  - double letters collapsed
 *  - trailing e dropped
 */
function phoneticKey(word) {
  let key = word.toLowerCase();
  // Normalize common phonetic swaps
  key = key.replace(/ph/g, 'f');
  key = key.replace(/ght/g, 't');
  key = key.replace(/ck/g, 'k');
  key = key.replace(/([a-z])\1+/g, '$1'); // collapse doubles
  // Trailing silent e
  if (key.length > 3 && key.endsWith('e')) key = key.slice(0, -1);
  return key;
}

// ─── TOKEN UTILITIES ─────────────────────────────────────────────────────────

/**
 * Tokenize a key into lowercase words (same logic as transformer.js).
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

/**
 * Expand abbreviations in token list.
 */
function expandTokens(tokens) {
  return tokens.map(t => ABBREVIATION_MAP.get(t) || t);
}

// ─── FUZZY MATCHER CLASS ─────────────────────────────────────────────────────

class FuzzyMatcher {
  /**
   * @param {object} options
   * @param {number} options.levenshteinThreshold  Max normalized distance to consider a match (default 0.35)
   * @param {number} options.minConfidence         Minimum confidence to report a match (default 0.55)
   * @param {boolean} options.expandAbbreviations  Whether to expand common abbreviations (default true)
   * @param {boolean} options.usePhonetic          Whether to use phonetic grouping (default true)
   * @param {boolean} options.useVowelDrop         Whether to detect vowel-dropped abbreviations (default true)
   */
  constructor(options = {}) {
    this.levenshteinThreshold = options.levenshteinThreshold || 0.35;
    this.minConfidence = options.minConfidence || 0.55;
    this.expandAbbreviations = options.expandAbbreviations !== false;
    this.usePhonetic = options.usePhonetic !== false;
    this.useVowelDrop = options.useVowelDrop !== false;
  }

  /**
   * Find the best fuzzy match for `sourceKey` among `candidates`.
   *
   * @param {string} sourceKey         The input field name
   * @param {string[]} candidates      The list of known/target field names
   * @returns {{ match: string|null, confidence: number, method: string }}
   */
  findBestMatch(sourceKey, candidates) {
    if (!candidates || candidates.length === 0) {
      return { match: null, confidence: 0, method: 'none' };
    }

    const srcTokens = tokenize(sourceKey);
    const srcExpanded = this.expandAbbreviations ? expandTokens(srcTokens) : srcTokens;
    const srcJoined = srcExpanded.join('');

    let bestMatch = null;
    let bestScore = 0;
    let bestMethod = 'none';

    for (const candidate of candidates) {
      const candTokens = tokenize(candidate);
      const candExpanded = this.expandAbbreviations ? expandTokens(candTokens) : candTokens;
      const candJoined = candExpanded.join('');

      // Strategy 1: Levenshtein on joined expanded tokens
      const levenScore = this._levenshteinScore(srcJoined, candJoined);

      // Strategy 2: Token-level matching
      const tokenScore = this._tokenMatchScore(srcExpanded, candExpanded);

      // Strategy 3: Vowel-drop detection
      let vowelScore = 0;
      if (this.useVowelDrop) {
        vowelScore = this._vowelDropScore(srcTokens, candTokens);
      }

      // Strategy 4: Phonetic matching
      let phoneticScore = 0;
      if (this.usePhonetic) {
        phoneticScore = this._phoneticScore(srcTokens, candTokens);
      }

      // Strategy 5: Abbreviation match (raw tokens vs expanded candidates)
      let abbrScore = 0;
      if (this.expandAbbreviations) {
        abbrScore = this._abbreviationScore(srcTokens, candTokens);
      }

      // Combined score: weighted maximum of strategies
      const scores = [
        { score: levenScore, method: 'levenshtein' },
        { score: tokenScore, method: 'token_match' },
        { score: vowelScore, method: 'vowel_drop' },
        { score: phoneticScore, method: 'phonetic' },
        { score: abbrScore, method: 'abbreviation' },
      ];

      // Pick the best individual strategy score
      let candidateBest = 0;
      let candidateMethod = 'none';
      for (const s of scores) {
        if (s.score > candidateBest) {
          candidateBest = s.score;
          candidateMethod = s.method;
        }
      }

      // Boost if multiple strategies agree
      const agreeing = scores.filter(s => s.score > 0.5).length;
      if (agreeing >= 2) {
        candidateBest = Math.min(1.0, candidateBest + 0.05 * (agreeing - 1));
      }

      if (candidateBest > bestScore) {
        bestScore = candidateBest;
        bestMatch = candidate;
        bestMethod = candidateMethod;
      }
    }

    if (bestScore < this.minConfidence) {
      return { match: null, confidence: bestScore, method: bestMethod };
    }

    return { match: bestMatch, confidence: bestScore, method: 'fuzzy_' + bestMethod };
  }

  /**
   * Normalized Levenshtein similarity score.
   */
  _levenshteinScore(a, b) {
    if (a === b) return 1.0;
    if (a.length === 0 || b.length === 0) return 0;
    const dist = distance(a, b);
    const maxLen = Math.max(a.length, b.length);
    const normalized = 1 - dist / maxLen;
    return Math.max(0, normalized);
  }

  /**
   * Token-level matching: how many expanded tokens match.
   */
  _tokenMatchScore(srcTokens, candTokens) {
    if (srcTokens.length === 0 || candTokens.length === 0) return 0;
    let matches = 0;
    const total = Math.max(srcTokens.length, candTokens.length);

    for (const src of srcTokens) {
      let bestTokenScore = 0;
      for (const cand of candTokens) {
        if (src === cand) {
          bestTokenScore = Math.max(bestTokenScore, 1.0);
        } else {
          const dist = distance(src, cand);
          const maxLen = Math.max(src.length, cand.length);
          const sim = maxLen > 0 ? 1 - dist / maxLen : 0;
          if (sim > 0.7) {
            bestTokenScore = Math.max(bestTokenScore, sim);
          }
        }
      }
      matches += bestTokenScore;
    }

    return matches / total;
  }

  /**
   * Vowel-drop detection score.
   */
  _vowelDropScore(srcTokens, candTokens) {
    if (srcTokens.length === 0 || candTokens.length === 0) return 0;
    if (srcTokens.length !== candTokens.length) return 0;

    let matchCount = 0;
    for (let i = 0; i < srcTokens.length; i++) {
      const src = srcTokens[i];
      const cand = candTokens[i];
      if (src === cand) {
        matchCount++;
      } else if (isVowelDrop(src, cand) || isVowelDrop(cand, src)) {
        matchCount += 0.85;
      }
    }

    return matchCount / srcTokens.length;
  }

  /**
   * Phonetic similarity score.
   */
  _phoneticScore(srcTokens, candTokens) {
    if (srcTokens.length === 0 || candTokens.length === 0) return 0;
    if (srcTokens.length !== candTokens.length) return 0;

    let matchCount = 0;
    for (let i = 0; i < srcTokens.length; i++) {
      const srcPhonetic = phoneticKey(srcTokens[i]);
      const candPhonetic = phoneticKey(candTokens[i]);
      if (srcPhonetic === candPhonetic) {
        matchCount++;
      } else {
        const dist_ = distance(srcPhonetic, candPhonetic);
        const maxLen = Math.max(srcPhonetic.length, candPhonetic.length);
        const sim = maxLen > 0 ? 1 - dist_ / maxLen : 0;
        if (sim > 0.75) {
          matchCount += sim * 0.8;
        }
      }
    }

    return matchCount / srcTokens.length;
  }

  /**
   * Abbreviation expansion score: check if raw tokens are abbreviations of candidate tokens.
   */
  _abbreviationScore(srcTokens, candTokens) {
    if (srcTokens.length === 0 || candTokens.length === 0) return 0;
    if (srcTokens.length !== candTokens.length) return 0;

    let matchCount = 0;
    for (let i = 0; i < srcTokens.length; i++) {
      const srcRaw = srcTokens[i];
      const candRaw = candTokens[i];
      if (srcRaw === candRaw) {
        matchCount++;
        continue;
      }

      // Check if either is an abbreviation of the other
      const srcExpanded = ABBREVIATION_MAP.get(srcRaw);
      const candExpanded = ABBREVIATION_MAP.get(candRaw);

      if (srcExpanded && tokenize(srcExpanded).join('') === candRaw) {
        matchCount += 0.9;
      } else if (candExpanded && tokenize(candExpanded).join('') === srcRaw) {
        matchCount += 0.9;
      } else if (srcExpanded && candExpanded && srcExpanded === candExpanded) {
        matchCount += 0.85;
      } else if (srcRaw.length >= 2 && candRaw.startsWith(srcRaw)) {
        // Prefix abbreviation
        matchCount += 0.7;
      } else if (candRaw.length >= 2 && srcRaw.startsWith(candRaw)) {
        matchCount += 0.7;
      }
    }

    return matchCount / srcTokens.length;
  }

  /**
   * Get available strategies info.
   */
  getStrategies() {
    return {
      levenshtein: true,
      tokenMatch: true,
      vowelDrop: this.useVowelDrop,
      phonetic: this.usePhonetic,
      abbreviation: this.expandAbbreviations,
    };
  }
}

module.exports = {
  FuzzyMatcher,
  ABBREVIATION_MAP,
  tokenize,
  expandTokens,
  dropVowels,
  isVowelDrop,
  phoneticKey,
};
