/**
 * APIBridge AI v9 — Smart Proxy
 *
 * Returns response data wrapped in a Proxy that dynamically resolves
 * field names using multiple strategies:
 *   - Direct access (data.userName)
 *   - snake_case resolution (data.userName → data.user_name)
 *   - SCREAMING_SNAKE_CASE (data.userName → data.USER_NAME)
 *   - Fuzzy/cryptic resolution (data.userName → data.usr_nm)
 *   - Learned mapping resolution
 *
 * Also integrates with the auto-learning engine so resolved mappings
 * are remembered for future requests.
 *
 * Usage:
 *   const data = smartProxy(rawData, { learningEngine, fuzzyMatcher });
 *   data.userName // resolves from user_name, USER_NAME, usr_nm, etc.
 */

'use strict';

const DANGEROUS_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

/**
 * Tokenize a key into lowercase words.
 * Handles camelCase, PascalCase, snake_case, kebab-case, SCREAMING_SNAKE.
 *
 * @param {string} key
 * @returns {string[]}
 */
function tokenize(key) {
  return key
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
    .replace(/[-\s]+/g, '_')
    .toLowerCase()
    .split('_')
    .filter(Boolean);
}

/**
 * Convert tokens to various naming conventions for lookup.
 *
 * @param {string[]} tokens
 * @returns {string[]} Array of candidate key forms
 */
function generateCandidates(tokens) {
  if (!tokens.length) return [];

  // camelCase
  const camel = tokens[0] + tokens.slice(1).map(t => t[0].toUpperCase() + t.slice(1)).join('');
  // snake_case
  const snake = tokens.join('_');
  // SCREAMING_SNAKE_CASE
  const screamSnake = tokens.join('_').toUpperCase();
  // PascalCase
  const pascal = tokens.map(t => t[0].toUpperCase() + t.slice(1)).join('');
  // kebab-case
  const kebab = tokens.join('-');
  // flat lowercase
  const flat = tokens.join('');

  return [camel, snake, screamSnake, pascal, kebab, flat];
}

/**
 * Create a smart proxy around response data.
 *
 * @param {object} data — Raw response data
 * @param {object} [options={}]
 * @param {object} [options.learningEngine] — LearningEngine instance for auto-learning
 * @param {object} [options.fuzzyMatcher] — FuzzyMatcher instance for fuzzy resolution
 * @param {Map} [options.cache] — Shared resolution cache
 * @returns {Proxy} Proxied data object
 */
function smartProxy(data, options = {}) {
  if (data === null || data === undefined || typeof data !== 'object') {
    return data;
  }

  // Don't proxy arrays directly, but proxy their object elements
  if (Array.isArray(data)) {
    return data.map(item =>
      typeof item === 'object' && item !== null
        ? smartProxy(item, options)
        : item,
    );
  }

  const { learningEngine, fuzzyMatcher, cache } = options;
  const resolutionCache = cache || new Map();
  const actualKeys = Object.keys(data);

  return new Proxy(data, {
    get(target, prop, receiver) {
      // Symbol properties and dangerous keys pass through
      if (typeof prop === 'symbol' || DANGEROUS_KEYS.has(prop)) {
        return Reflect.get(target, prop, receiver);
      }

      // 1. Direct access
      if (prop in target) {
        const val = target[prop];
        // Recursively proxy nested objects
        if (typeof val === 'object' && val !== null) {
          return smartProxy(val, options);
        }
        return val;
      }

      // Internal/system properties — don't attempt resolution
      if (prop === 'toJSON' || prop === 'then' || prop === 'valueOf' || prop === 'toString' ||
          prop === 'inspect' || prop === 'nodeType' || prop === 'tagName') {
        return undefined;
      }

      // 2. Check resolution cache
      const cacheKey = prop;
      if (resolutionCache.has(cacheKey)) {
        const resolved = resolutionCache.get(cacheKey);
        if (resolved && resolved in target) {
          return target[resolved];
        }
      }

      // 3. Check learning engine
      if (learningEngine) {
        const learned = learningEngine.lookup(prop);
        if (learned && learned.target in target) {
          resolutionCache.set(cacheKey, learned.target);
          return target[learned.target];
        }
      }

      // 4. Convention-based lookup (camelCase ↔ snake_case, etc.)
      const tokens = tokenize(prop);
      const candidates = generateCandidates(tokens);
      for (const candidate of candidates) {
        if (candidate in target) {
          resolutionCache.set(cacheKey, candidate);
          if (learningEngine) {
            learningEngine.autoLearn(prop, candidate, 0.97);
          }
          return target[candidate];
        }
      }

      // 5. Case-insensitive lookup
      const lowerProp = prop.toLowerCase();
      for (const key of actualKeys) {
        if (key.toLowerCase() === lowerProp) {
          resolutionCache.set(cacheKey, key);
          if (learningEngine) {
            learningEngine.autoLearn(prop, key, 0.95);
          }
          return target[key];
        }
      }

      // 6. Fuzzy matching
      if (fuzzyMatcher && actualKeys.length > 0) {
        const match = fuzzyMatcher.findBestMatch(prop, actualKeys);
        if (match && match.match && match.confidence >= 0.7) {
          resolutionCache.set(cacheKey, match.match);
          if (learningEngine) {
            learningEngine.autoLearn(prop, match.match, match.confidence);
          }
          return target[match.match];
        }
      }

      // Not found
      return undefined;
    },

    has(target, prop) {
      if (prop in target) return true;
      if (typeof prop === 'symbol' || DANGEROUS_KEYS.has(prop)) return false;

      const tokens = tokenize(prop);
      const candidates = generateCandidates(tokens);
      for (const candidate of candidates) {
        if (candidate in target) return true;
      }
      return false;
    },

    ownKeys(target) {
      return Reflect.ownKeys(target);
    },

    getOwnPropertyDescriptor(target, prop) {
      return Reflect.getOwnPropertyDescriptor(target, prop);
    },
  });
}

module.exports = { smartProxy, tokenize, generateCandidates };
