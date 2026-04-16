/**
 * APIBridge AI v5 — Event Bus
 *
 * Typed, cross-module pub/sub event bus:
 *  - Subscribe/unsubscribe to named events
 *  - Wildcard subscriptions (e.g. 'api.*')
 *  - Once-only listeners
 *  - Event history / replay
 *  - Async event handlers
 *  - Namespaced events
 *  - Priority-ordered listeners
 *  - Statistics tracking
 */

const { EventBusError } = require('./errors');

class EventBus {
  /**
   * @param {object}  options
   * @param {boolean} options.recordHistory   Keep event history (default false)
   * @param {number}  options.maxHistory      Max history entries (default 100)
   * @param {number}  options.maxListeners    Max listeners per event (default 100)
   * @param {boolean} options.async           Execute all handlers asynchronously (default true)
   */
  constructor(options = {}) {
    this.recordHistory = options.recordHistory || false;
    this.maxHistory = options.maxHistory || 100;
    this.maxListeners = options.maxListeners || 100;
    this.async = options.async !== false;

    /** @type {Map<string, Array<{ fn: Function, once: boolean, priority: number }>>} */
    this._listeners = new Map();

    /** @type {Array<{ event: string, data: *, timestamp: string }>} */
    this._history = [];

    this._stats = {
      totalEmits: 0,
      totalListeners: 0,
      totalDeliveries: 0,
    };
  }

  /**
   * Subscribe to an event.
   *
   * @param {string}   event     Event name (supports wildcards: 'api.*')
   * @param {Function} fn        Handler function: (data) => void
   * @param {object}   [options]
   * @param {boolean}  [options.once]      Remove after first invocation (default false)
   * @param {number}   [options.priority]  Higher priority runs first (default 0)
   * @returns {Function} Unsubscribe function
   */
  on(event, fn, options = {}) {
    if (!event || typeof event !== 'string') {
      throw new EventBusError('Event name must be a non-empty string', event, 'invalid_event');
    }
    if (typeof fn !== 'function') {
      throw new EventBusError('Handler must be a function', event, 'invalid_handler');
    }

    if (!this._listeners.has(event)) {
      this._listeners.set(event, []);
    }

    const listeners = this._listeners.get(event);
    if (listeners.length >= this.maxListeners) {
      throw new EventBusError(
        `Max listeners (${this.maxListeners}) exceeded for event "${event}"`,
        event,
        'max_listeners',
      );
    }

    const entry = {
      fn,
      once: options.once || false,
      priority: options.priority || 0,
    };

    listeners.push(entry);

    // Sort by priority (descending)
    listeners.sort((a, b) => b.priority - a.priority);

    this._stats.totalListeners++;

    // Return unsubscribe function
    return () => this.off(event, fn);
  }

  /**
   * Subscribe to an event with a once-only listener.
   *
   * @param {string}   event  Event name
   * @param {Function} fn     Handler function
   * @param {object}   [options]
   * @returns {Function} Unsubscribe function
   */
  once(event, fn, options = {}) {
    return this.on(event, fn, { ...options, once: true });
  }

  /**
   * Unsubscribe a handler from an event.
   *
   * @param {string}   event  Event name
   * @param {Function} fn     Handler function to remove
   * @returns {boolean} Whether the handler was found and removed
   */
  off(event, fn) {
    if (!this._listeners.has(event)) return false;

    const listeners = this._listeners.get(event);
    const idx = listeners.findIndex(l => l.fn === fn);

    if (idx === -1) return false;

    listeners.splice(idx, 1);
    if (listeners.length === 0) {
      this._listeners.delete(event);
    }

    return true;
  }

  /**
   * Emit an event.
   *
   * @param {string} event  Event name
   * @param {*}      data   Event data
   * @returns {Promise<number>} Number of handlers invoked
   */
  async emit(event, data) {
    if (!event || typeof event !== 'string') {
      throw new EventBusError('Event name must be a non-empty string', event, 'invalid_event');
    }

    this._stats.totalEmits++;

    // Record history
    if (this.recordHistory) {
      this._history.push({
        event,
        data,
        timestamp: new Date().toISOString(),
      });
      if (this._history.length > this.maxHistory) {
        this._history.shift();
      }
    }

    // Collect matching listeners (exact + wildcard)
    const handlers = this._getMatchingHandlers(event);
    let deliveries = 0;

    for (const entry of handlers) {
      try {
        if (this.async) {
          await entry.fn(data);
        } else {
          entry.fn(data);
        }
        deliveries++;
        this._stats.totalDeliveries++;
      } catch (err) {
        // Errors in handlers don't break emission
      }
    }

    // Remove once-only listeners
    this._cleanupOnceListeners(event);

    return deliveries;
  }

  /**
   * Emit an event synchronously (no await).
   *
   * @param {string} event  Event name
   * @param {*}      data   Event data
   * @returns {number} Number of handlers invoked
   */
  emitSync(event, data) {
    if (!event || typeof event !== 'string') {
      throw new EventBusError('Event name must be a non-empty string', event, 'invalid_event');
    }

    this._stats.totalEmits++;

    if (this.recordHistory) {
      this._history.push({
        event,
        data,
        timestamp: new Date().toISOString(),
      });
      if (this._history.length > this.maxHistory) {
        this._history.shift();
      }
    }

    const handlers = this._getMatchingHandlers(event);
    let deliveries = 0;

    for (const entry of handlers) {
      try {
        entry.fn(data);
        deliveries++;
        this._stats.totalDeliveries++;
      } catch (err) {
        // Errors in handlers don't break emission
      }
    }

    this._cleanupOnceListeners(event);
    return deliveries;
  }

  /**
   * Get event history.
   * @param {string} [event]  Filter by event name
   * @returns {Array<{ event: string, data: *, timestamp: string }>}
   */
  getHistory(event) {
    if (event) {
      return this._history.filter(h => h.event === event);
    }
    return [...this._history];
  }

  /**
   * Get the number of listeners for an event.
   * @param {string} event
   * @returns {number}
   */
  listenerCount(event) {
    const listeners = this._listeners.get(event);
    return listeners ? listeners.length : 0;
  }

  /**
   * List all events with registered listeners.
   * @returns {Array<{ event: string, listenerCount: number }>}
   */
  list() {
    const result = [];
    for (const [event, listeners] of this._listeners) {
      result.push({ event, listenerCount: listeners.length });
    }
    return result;
  }

  /**
   * Remove all listeners for a specific event.
   * @param {string} event
   */
  removeAll(event) {
    if (event) {
      this._listeners.delete(event);
    } else {
      this._listeners.clear();
    }
  }

  /**
   * Replay event history to a handler.
   * @param {string}   event  Event name to replay
   * @param {Function} fn     Handler to receive replayed events
   */
  replay(event, fn) {
    const events = this._history.filter(h => h.event === event);
    for (const entry of events) {
      fn(entry.data);
    }
  }

  /**
   * Wait for an event to be emitted (returns a promise).
   * @param {string}  event     Event name
   * @param {number}  [timeout] Timeout in ms (default 0 = no timeout)
   * @returns {Promise<*>} Event data
   */
  waitFor(event, timeout = 0) {
    return new Promise((resolve, reject) => {
      let timer = null;

      const unsub = this.once(event, (data) => {
        if (timer) clearTimeout(timer);
        resolve(data);
      });

      if (timeout > 0) {
        timer = setTimeout(() => {
          unsub();
          reject(new EventBusError(`Timeout waiting for event "${event}"`, event, 'timeout'));
        }, timeout);

        if (typeof timer.unref === 'function') timer.unref();
      }
    });
  }

  /**
   * Get event bus statistics.
   * @returns {object}
   */
  getStats() {
    return {
      ...this._stats,
      eventsWithListeners: this._listeners.size,
      historySize: this._history.length,
    };
  }

  /**
   * Reset the event bus (clear all listeners, history, stats).
   */
  reset() {
    this._listeners.clear();
    this._history = [];
    this._stats = {
      totalEmits: 0,
      totalListeners: 0,
      totalDeliveries: 0,
    };
  }

  // ─── INTERNAL ─────────────────────────────────────────────────────

  /**
   * Get all handlers matching an event (exact + wildcard).
   * @param {string} event
   * @returns {Array<{ fn: Function, once: boolean, priority: number }>}
   */
  _getMatchingHandlers(event) {
    const handlers = [];

    for (const [pattern, listeners] of this._listeners) {
      if (pattern === event || this._matchWildcard(pattern, event)) {
        handlers.push(...listeners);
      }
    }

    // Sort by priority (descending)
    handlers.sort((a, b) => b.priority - a.priority);
    return handlers;
  }

  /**
   * Check if a wildcard pattern matches an event name.
   * Supports trailing wildcards: 'api.*' matches 'api.request', 'api.response'
   * @param {string} pattern
   * @param {string} event
   * @returns {boolean}
   */
  _matchWildcard(pattern, event) {
    if (!pattern.includes('*')) return false;
    const regex = new RegExp('^' + pattern.replace(/\\/g, '\\\\').replace(/\./g, '\\.').replace(/\*/g, '[^.]+') + '$');
    return regex.test(event);
  }

  /**
   * Clean up once-only listeners after emission.
   * @param {string} event
   */
  _cleanupOnceListeners(event) {
    for (const [pattern, listeners] of this._listeners) {
      if (pattern === event || this._matchWildcard(pattern, event)) {
        const remaining = listeners.filter(l => !l.once || !l._fired);
        // Mark once-only listeners as fired
        for (const l of listeners) {
          if (l.once) l._fired = true;
        }
        const filtered = listeners.filter(l => !(l.once && l._fired));
        if (filtered.length === 0) {
          this._listeners.delete(pattern);
        } else {
          this._listeners.set(pattern, filtered);
        }
      }
    }
  }
}

module.exports = { EventBus };
