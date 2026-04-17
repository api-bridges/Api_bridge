/**
 * APIBridge AI v11 — URL Utilities
 *
 * Helper functions for URL manipulation, matching Axios internals.
 *
 * Functions:
 *   - isAbsoluteURL — Check if URL is absolute
 *   - combineURLs — Combine base URL + relative URL
 *   - isURLSameOrigin — Check same-origin policy
 *   - parseURL — Parse URL into components
 *   - encode — URI encode with special char handling
 *
 * Usage:
 *   isAbsoluteURL('https://example.com/api'); // true
 *   isAbsoluteURL('/api/users'); // false
 *   combineURLs('https://example.com', '/api/users'); // 'https://example.com/api/users'
 */

'use strict';

/**
 * Check if a URL is absolute (has protocol).
 *
 * @param {string} url
 * @returns {boolean}
 */
function isAbsoluteURL(url) {
  if (!url || typeof url !== 'string') return false;
  // A URL is absolute if it starts with scheme:// or //
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
}

/**
 * Combine a base URL and a relative URL.
 * If relativeURL is absolute, it is returned as-is.
 *
 * @param {string} baseURL
 * @param {string} relativeURL
 * @returns {string}
 */
function combineURLs(baseURL, relativeURL) {
  if (!baseURL) return relativeURL || '';
  if (!relativeURL) return baseURL;
  if (isAbsoluteURL(relativeURL)) return relativeURL;

  // Remove trailing slashes from base and leading slashes from relative
  let base = baseURL;
  while (base.length > 0 && base[base.length - 1] === '/') {
    base = base.slice(0, -1);
  }
  let rel = relativeURL;
  while (rel.length > 0 && rel[0] === '/') {
    rel = rel.slice(1);
  }
  return base + '/' + rel;
}

/**
 * Check if two URLs share the same origin.
 *
 * @param {string} requestURL
 * @param {string} [currentOrigin] — Current page origin (auto-detected in browser)
 * @returns {boolean}
 */
function isURLSameOrigin(requestURL, currentOrigin) {
  if (!requestURL) return true;
  if (!isAbsoluteURL(requestURL)) return true;

  try {
    const parsed = new URL(requestURL);
    const origin = currentOrigin || (typeof location !== 'undefined' ? location.origin : '');

    if (!origin) return true;

    const currentParsed = new URL(origin);
    return (
      parsed.protocol === currentParsed.protocol &&
      parsed.host === currentParsed.host
    );
  } catch {
    return false;
  }
}

/**
 * Parse a URL into components.
 *
 * @param {string} url
 * @returns {{ protocol: string, host: string, pathname: string, search: string, hash: string, origin: string } | null}
 */
function parseURL(url) {
  if (!url || typeof url !== 'string') return null;

  try {
    const parsed = new URL(url, 'http://localhost');
    return {
      protocol: parsed.protocol,
      host: parsed.host,
      hostname: parsed.hostname,
      port: parsed.port,
      pathname: parsed.pathname,
      search: parsed.search,
      hash: parsed.hash,
      origin: parsed.origin,
    };
  } catch {
    return null;
  }
}

/**
 * URI-encode a value, with special handling for chars that should remain.
 *
 * @param {string} val
 * @returns {string}
 */
function encode(val) {
  return encodeURIComponent(val)
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',')
    .replace(/%20/g, '+')
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, ']');
}

module.exports = {
  isAbsoluteURL,
  combineURLs,
  isURLSameOrigin,
  parseURL,
  encode,
};
