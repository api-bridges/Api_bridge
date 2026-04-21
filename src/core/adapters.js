/**
 * yarou v11 — Adapter System
 *
 * Pluggable adapter architecture, like Axios's adapter system.
 * Allows switching between fetch (default), XMLHttpRequest, or custom adapters.
 *
 * Built-in adapters:
 *   - 'fetch' — Uses native fetch API (default, Node 18+/browsers)
 *   - 'xhr' — Uses XMLHttpRequest (browsers)
 *   - 'http' — Uses Node.js http/https modules (Node.js)
 *   - Custom function — User-provided adapter
 *
 * Usage:
 *   const api = createClient({ adapter: 'fetch' });
 *   const api = createClient({ adapter: 'xhr' });
 *   const api = createClient({ adapter: customAdapterFn });
 *   const adapter = getAdapter('fetch');
 */

'use strict';

const { isFormData, isURLSearchParams, isBuffer, isStream, isArrayBufferView } = require('./form-data');

/**
 * Fetch adapter — uses native fetch() API.
 *
 * @param {object} config — Request configuration
 * @returns {Promise<object>} Response object { data, status, statusText, headers }
 */
async function fetchAdapter(config) {
  const fetchOptions = {
    method: config.method || 'GET',
  };

  // Credentials
  if (config.withCredentials) {
    fetchOptions.credentials = 'include';
  }

  // Headers
  const headers = Object.assign({}, config.headers || {});

  // Body
  if (config.body !== undefined && config.method !== 'GET' && config.method !== 'HEAD') {
    if (isFormData(config.body)) {
      fetchOptions.body = config.body;
      delete headers['Content-Type'];
    } else if (isURLSearchParams(config.body)) {
      headers['Content-Type'] = headers['Content-Type'] || 'application/x-www-form-urlencoded';
      fetchOptions.body = config.body.toString();
    } else if (isBuffer(config.body) || isArrayBufferView(config.body)) {
      fetchOptions.body = config.body;
    } else if (isStream(config.body)) {
      fetchOptions.body = config.body;
    } else if (typeof config.body === 'string') {
      fetchOptions.body = config.body;
    } else if (typeof config.body === 'object') {
      headers['Content-Type'] = headers['Content-Type'] || 'application/json';
      fetchOptions.body = JSON.stringify(config.body);
    } else {
      fetchOptions.body = String(config.body);
    }
  }

  fetchOptions.headers = headers;

  // Signal
  if (config.signal) {
    fetchOptions.signal = config.signal;
  }

  // Redirect
  if (config.maxRedirects === 0) {
    fetchOptions.redirect = 'manual';
  }

  const res = await fetch(config.fullURL || config.url, fetchOptions);

  // Parse response
  const contentType = res.headers.get('content-type') || '';
  let data;
  const responseType = config.responseType || 'json';

  if (responseType === 'arraybuffer') {
    data = await res.arrayBuffer();
  } else if (responseType === 'blob') {
    if (typeof res.blob === 'function') {
      data = await res.blob();
    } else {
      data = await res.arrayBuffer();
    }
  } else if (responseType === 'text') {
    data = await res.text();
  } else if (responseType === 'stream') {
    data = res.body;
  } else {
    if (contentType.includes('application/json')) {
      data = await res.json();
    } else {
      const text = await res.text();
      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }
    }
  }

  // Collect headers
  const resHeaders = {};
  res.headers.forEach((value, key) => {
    resHeaders[key] = value;
  });

  return {
    data,
    rawData: data,
    status: res.status,
    statusText: res.statusText || '',
    headers: resHeaders,
  };
}

/**
 * XHR adapter — uses XMLHttpRequest (browser environments).
 *
 * @param {object} config — Request configuration
 * @returns {Promise<object>} Response object
 */
function xhrAdapter(config) {
  return new Promise((resolve, reject) => {
    if (typeof XMLHttpRequest === 'undefined') {
      reject(new Error('XMLHttpRequest is not available in this environment'));
      return;
    }

    const xhr = new XMLHttpRequest();
    const url = config.fullURL || config.url;

    xhr.open(config.method || 'GET', url, true);

    // Set response type
    const responseType = config.responseType || 'json';
    if (responseType === 'json') {
      xhr.responseType = 'text';
    } else {
      xhr.responseType = responseType;
    }

    // Set headers
    if (config.headers) {
      for (const [key, value] of Object.entries(config.headers)) {
        if (key.toLowerCase() === 'content-type' && isFormData(config.body)) {
          continue; // Let browser set it for FormData
        }
        xhr.setRequestHeader(key, value);
      }
    }

    // Credentials
    if (config.withCredentials) {
      xhr.withCredentials = true;
    }

    // Timeout
    if (config.timeout) {
      xhr.timeout = config.timeout;
    }

    // Progress callbacks
    if (config.onDownloadProgress && typeof config.onDownloadProgress === 'function') {
      xhr.onprogress = (event) => {
        config.onDownloadProgress({
          loaded: event.loaded,
          total: event.total,
          progress: event.total ? event.loaded / event.total : 0,
          bytes: event.loaded,
          event,
        });
      };
    }

    if (config.onUploadProgress && typeof config.onUploadProgress === 'function' && xhr.upload) {
      xhr.upload.onprogress = (event) => {
        config.onUploadProgress({
          loaded: event.loaded,
          total: event.total,
          progress: event.total ? event.loaded / event.total : 0,
          bytes: event.loaded,
          event,
        });
      };
    }

    // Abort signal
    if (config.signal) {
      if (config.signal.aborted) {
        xhr.abort();
        reject(new Error('Request aborted'));
        return;
      }
      config.signal.addEventListener('abort', () => xhr.abort(), { once: true });
    }

    xhr.onload = () => {
      // Parse response headers
      const resHeaders = {};
      const rawHeaders = xhr.getAllResponseHeaders();
      if (rawHeaders) {
        rawHeaders.split('\r\n').forEach(line => {
          const idx = line.indexOf(':');
          if (idx !== -1) {
            const key = line.slice(0, idx).trim().toLowerCase();
            const value = line.slice(idx + 1).trim();
            resHeaders[key] = value;
          }
        });
      }

      // Parse data
      let data;
      if (responseType === 'json') {
        try {
          data = JSON.parse(xhr.responseText);
        } catch {
          data = xhr.responseText;
        }
      } else {
        data = xhr.response;
      }

      resolve({
        data,
        rawData: data,
        status: xhr.status,
        statusText: xhr.statusText || '',
        headers: resHeaders,
      });
    };

    xhr.onerror = () => {
      reject(new Error('Network Error'));
    };

    xhr.ontimeout = () => {
      reject(new Error('Request timeout'));
    };

    xhr.onabort = () => {
      reject(new Error('Request aborted'));
    };

    // Send body
    const body = config.body;
    if (body !== undefined && config.method !== 'GET' && config.method !== 'HEAD') {
      if (isFormData(body) || isURLSearchParams(body) || typeof body === 'string' ||
          isBuffer(body) || isArrayBufferView(body)) {
        xhr.send(body);
      } else if (typeof body === 'object') {
        xhr.send(JSON.stringify(body));
      } else {
        xhr.send(String(body));
      }
    } else {
      xhr.send();
    }
  });
}

/**
 * Known adapter registry.
 */
const adapters = {
  fetch: fetchAdapter,
  xhr: xhrAdapter,
  http: fetchAdapter, // In modern Node.js, fetch is available; fallback
};

/**
 * Get an adapter by name or return the custom function.
 *
 * @param {string|Function|string[]} adapterConfig — Adapter name, function, or priority list
 * @returns {Function} Adapter function
 */
function getAdapter(adapterConfig) {
  if (typeof adapterConfig === 'function') {
    return adapterConfig;
  }

  if (typeof adapterConfig === 'string') {
    const adapter = adapters[adapterConfig];
    if (!adapter) {
      throw new Error(`Unknown adapter: "${adapterConfig}". Available: ${Object.keys(adapters).join(', ')}`);
    }
    return adapter;
  }

  if (Array.isArray(adapterConfig)) {
    for (const name of adapterConfig) {
      try {
        return getAdapter(name);
      } catch {
        continue;
      }
    }
    throw new Error(`No suitable adapter found from: ${adapterConfig.join(', ')}`);
  }

  // Default: auto-detect
  if (typeof fetch !== 'undefined') {
    return fetchAdapter;
  }
  if (typeof XMLHttpRequest !== 'undefined') {
    return xhrAdapter;
  }

  throw new Error('No suitable adapter found for this environment');
}

module.exports = {
  fetchAdapter,
  xhrAdapter,
  adapters,
  getAdapter,
};
