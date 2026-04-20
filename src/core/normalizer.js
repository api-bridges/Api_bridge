/**
 * nopes v3 — Response Normalizer
 *
 * Standardises common API response shapes so your frontend
 * always gets a predictable structure, regardless of the backend.
 *
 * Handles:
 *  - Envelope unwrapping  { data: { ... }, meta: { ... } }
 *  - Pagination normalization (page/limit/offset/cursor)
 *  - Error format normalization
 *  - Empty-response safety
 */

class ResponseNormalizer {
  /**
   * @param {object} options
   * @param {boolean}  options.unwrapEnvelope   Auto-unwrap { data: ... } (default true)
   * @param {boolean}  options.normalizePagination Normalize pagination fields (default true)
   * @param {boolean}  options.normalizeErrors  Normalize error responses (default true)
   * @param {string[]} options.dataKeys         Keys to treat as envelope data wrappers
   */
  constructor(options = {}) {
    this.unwrapEnvelope = options.unwrapEnvelope !== false;
    this.normalizePagination = options.normalizePagination !== false;
    this.normalizeErrors = options.normalizeErrors !== false;
    this.dataKeys = options.dataKeys || ['data', 'result', 'results', 'payload', 'items', 'records'];
  }

  /**
   * Normalize an API response.
   * @param {any}    body        Raw response body
   * @param {number} statusCode  HTTP status (optional)
   * @returns {{ data: any, meta: object, pagination: object|null, error: object|null }}
   */
  normalize(body, statusCode) {
    if (body === null || body === undefined) {
      return { data: null, meta: { empty: true }, pagination: null, error: null };
    }

    // Primitives / arrays pass through
    if (typeof body !== 'object' || Array.isArray(body)) {
      return { data: body, meta: {}, pagination: null, error: null };
    }

    // Error detection
    if (this.normalizeErrors && this._looksLikeError(body, statusCode)) {
      return {
        data: null,
        meta: {},
        pagination: null,
        error: this._extractError(body, statusCode),
      };
    }

    // Envelope unwrapping
    let data = body;
    let meta = {};

    if (this.unwrapEnvelope) {
      const unwrapped = this._unwrapEnvelope(body);
      data = unwrapped.data;
      meta = unwrapped.meta;
    }

    // Pagination
    let pagination = null;
    if (this.normalizePagination) {
      pagination = this._extractPagination(body);
    }

    return { data, meta, pagination, error: null };
  }

  _unwrapEnvelope(body) {
    for (const key of this.dataKeys) {
      if (Object.prototype.hasOwnProperty.call(body, key)) {
        const data = body[key];
        const meta = {};
        for (const [k, v] of Object.entries(body)) {
          if (k !== key) meta[k] = v;
        }
        return { data, meta };
      }
    }
    return { data: body, meta: {} };
  }

  _extractPagination(body) {
    const pg = {};
    const paginationKeys = {
      page:       ['page', 'current_page', 'currentPage', 'pageNumber', 'page_number'],
      perPage:    ['per_page', 'perPage', 'limit', 'page_size', 'pageSize', 'size'],
      total:      ['total', 'total_count', 'totalCount', 'total_records', 'totalRecords', 'total_items', 'totalItems'],
      totalPages: ['total_pages', 'totalPages', 'page_count', 'pageCount', 'last_page', 'lastPage'],
      offset:     ['offset', 'skip', 'start'],
      nextCursor: ['next_cursor', 'nextCursor', 'cursor', 'after'],
      prevCursor: ['prev_cursor', 'prevCursor', 'before'],
      hasMore:    ['has_more', 'hasMore', 'has_next', 'hasNext'],
    };

    let found = false;
    for (const [canonical, variants] of Object.entries(paginationKeys)) {
      for (const variant of variants) {
        if (Object.prototype.hasOwnProperty.call(body, variant)) {
          pg[canonical] = body[variant];
          found = true;
          break;
        }
      }
    }

    return found ? pg : null;
  }

  _looksLikeError(body, statusCode) {
    if (statusCode && statusCode >= 400) return true;
    if (body.error || body.errors) return true;
    if (body.success === false || body.ok === false) return true;
    if (body.status === 'error' || body.status === 'fail') return true;
    return false;
  }

  _extractError(body, statusCode) {
    return {
      status: statusCode || body.status || body.statusCode || body.code || 500,
      message: body.message || body.error || body.error_message ||
               body.errorMessage || body.msg || body.reason ||
               (body.errors && Array.isArray(body.errors) ? body.errors.map(e => e.message || e).join('; ') : 'Unknown error'),
      code: body.code || body.error_code || body.errorCode || null,
      details: body.errors || body.details || null,
    };
  }
}

module.exports = { ResponseNormalizer };
