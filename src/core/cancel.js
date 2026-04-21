/**
 * yarou v10 — Cancel Token
 *
 * Axios-compatible cancellation system. Supports both:
 *   - CancelToken (legacy axios pattern)
 *   - AbortController (modern pattern, already in v9)
 *
 * Usage:
 *   const source = CancelToken.source();
 *   api.get('/data', { cancelToken: source.token });
 *   source.cancel('User cancelled');
 *
 *   // Or executor pattern:
 *   const token = new CancelToken((cancel) => { setTimeout(cancel, 5000); });
 */

'use strict';

/**
 * A Cancel represents a cancellation reason.
 */
class Cancel {
  /**
   * @param {string} [message]
   */
  constructor(message) {
    this.message = message || 'Request cancelled';
    this.__CANCEL__ = true;
  }

  toString() {
    return `Cancel: ${this.message}`;
  }
}

/**
 * CancelToken — Axios-compatible cancellation token.
 *
 * A token that can be passed to request config and later triggered to cancel the request.
 */
class CancelToken {
  /**
   * @param {Function} executor — Receives a `cancel` function: (cancel) => void
   */
  constructor(executor) {
    if (typeof executor !== 'function') {
      throw new TypeError('CancelToken executor must be a function');
    }

    this.reason = null;
    this._listeners = [];

    // Create an AbortController to bridge with modern API
    this._controller = new AbortController();

    const cancel = (message) => {
      if (this.reason) return; // Already cancelled
      this.reason = new Cancel(message);
      this._controller.abort(this.reason);
      for (const listener of this._listeners) {
        listener(this.reason);
      }
      this._listeners = [];
    };

    executor(cancel);
  }

  /**
   * Get the AbortSignal for use with fetch.
   * @returns {AbortSignal}
   */
  get signal() {
    return this._controller.signal;
  }

  /**
   * Check if the token has been cancelled.
   * @returns {boolean}
   */
  get requested() {
    return this.reason !== null;
  }

  /**
   * Throw if cancellation has been requested.
   */
  throwIfRequested() {
    if (this.reason) {
      throw this.reason;
    }
  }

  /**
   * Subscribe to cancellation.
   * @param {Function} listener — Called with Cancel reason when cancelled
   */
  subscribe(listener) {
    if (this.reason) {
      listener(this.reason);
      return;
    }
    this._listeners.push(listener);
  }

  /**
   * Unsubscribe from cancellation.
   * @param {Function} listener
   */
  unsubscribe(listener) {
    const idx = this._listeners.indexOf(listener);
    if (idx !== -1) this._listeners.splice(idx, 1);
  }

  /**
   * Create a CancelToken source (most common pattern).
   * @returns {{ token: CancelToken, cancel: Function }}
   */
  static source() {
    let cancel;
    const token = new CancelToken((c) => { cancel = c; });
    return { token, cancel };
  }
}

/**
 * Check if a value is a Cancel (cancellation reason).
 * @param {*} value
 * @returns {boolean}
 */
function isCancel(value) {
  return !!(value && value.__CANCEL__);
}

/**
 * Check if a value is a CancelToken.
 * @param {*} value
 * @returns {boolean}
 */
function isCancelToken(value) {
  return value instanceof CancelToken;
}

// Static methods on CancelToken (Axios-compatible)
CancelToken.isCancel = isCancel;
CancelToken.isCancelToken = isCancelToken;

module.exports = { CancelToken, Cancel, isCancel, isCancelToken };
