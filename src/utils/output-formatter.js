/**
 * awsibnj v8 — Output Formatter
 *
 * Format transformed API data into various output formats.
 * Converts JavaScript objects to XML, CSV, key-value pairs, or custom template formats.
 *
 * Features:
 *  - JSON pretty-printing with configurable indent
 *  - XML serialization with custom root/element names
 *  - CSV output with header generation
 *  - Key-value pair output (for logging/debugging)
 *  - Table format for console output
 *  - Custom template support
 *  - Flat/nested output control
 *  - Statistics on format usage
 */

class OutputFormatter {
  /**
   * @param {object} options
   * @param {number}  options.jsonIndent   JSON indent spaces (default 2)
   * @param {string}  options.xmlRoot      XML root element name (default 'root')
   * @param {string}  options.xmlItem      XML item element name (default 'item')
   * @param {string}  options.csvDelimiter CSV column delimiter (default ',')
   * @param {boolean} options.csvHeaders   Include headers in CSV (default true)
   */
  constructor(options = {}) {
    this.jsonIndent = options.jsonIndent || 2;
    this.xmlRoot = options.xmlRoot || 'root';
    this.xmlItem = options.xmlItem || 'item';
    this.csvDelimiter = options.csvDelimiter || ',';
    this.csvHeaders = options.csvHeaders !== false;

    this._stats = { json: 0, xml: 0, csv: 0, keyvalue: 0, table: 0, template: 0 };
  }

  /**
   * Format data as pretty JSON.
   *
   * @param {any} data  The data to format
   * @param {number} indent  Optional indent override
   * @returns {string}
   */
  toJSON(data, indent) {
    this._stats.json++;
    return JSON.stringify(data, null, indent || this.jsonIndent);
  }

  /**
   * Format data as XML.
   *
   * @param {any} data  The data to format
   * @param {object} options  Optional overrides { root, item }
   * @returns {string}
   */
  toXML(data, options = {}) {
    this._stats.xml++;
    const root = options.root || this.xmlRoot;
    const item = options.item || this.xmlItem;

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<${root}>\n`;

    if (Array.isArray(data)) {
      for (const entry of data) {
        xml += `  <${item}>\n`;
        xml += this._objectToXML(entry, 4);
        xml += `  </${item}>\n`;
      }
    } else if (typeof data === 'object' && data !== null) {
      xml += this._objectToXML(data, 2);
    } else {
      xml += `  ${this._escapeXML(String(data))}\n`;
    }

    xml += `</${root}>`;
    return xml;
  }

  /**
   * Format data as CSV.
   *
   * @param {any} data  Array of objects or single object
   * @returns {string}
   */
  toCSV(data) {
    this._stats.csv++;
    const rows = Array.isArray(data) ? data : [data];
    if (rows.length === 0) return '';

    // Collect all headers
    const headers = new Set();
    for (const row of rows) {
      if (row && typeof row === 'object') {
        for (const key of Object.keys(row)) {
          headers.add(key);
        }
      }
    }

    const headerArray = [...headers];
    const lines = [];

    if (this.csvHeaders) {
      lines.push(headerArray.map(h => this._csvEscape(h)).join(this.csvDelimiter));
    }

    for (const row of rows) {
      if (!row || typeof row !== 'object') continue;
      const values = headerArray.map(h => {
        const val = row[h];
        if (val === null || val === undefined) return '';
        if (typeof val === 'object') return this._csvEscape(JSON.stringify(val));
        return this._csvEscape(String(val));
      });
      lines.push(values.join(this.csvDelimiter));
    }

    return lines.join('\n');
  }

  /**
   * Format data as key-value pairs.
   *
   * @param {object} data  The data to format
   * @param {string} separator  Key-value separator (default ': ')
   * @returns {string}
   */
  toKeyValue(data, separator = ': ') {
    this._stats.keyvalue++;

    if (!data || typeof data !== 'object') return String(data);

    const lines = [];
    this._flattenForKV(data, '', lines, separator);
    return lines.join('\n');
  }

  /**
   * Format data as a simple table string.
   *
   * @param {any} data  Array of objects
   * @returns {string}
   */
  toTable(data) {
    this._stats.table++;
    const rows = Array.isArray(data) ? data : [data];
    if (rows.length === 0) return '(empty)';

    // Collect headers and column widths
    const headers = new Set();
    for (const row of rows) {
      if (row && typeof row === 'object') {
        for (const key of Object.keys(row)) headers.add(key);
      }
    }

    const headerArray = [...headers];
    const widths = headerArray.map(h => h.length);

    // Calculate column widths
    for (const row of rows) {
      if (!row || typeof row !== 'object') continue;
      headerArray.forEach((h, i) => {
        const val = row[h] !== undefined && row[h] !== null ? String(row[h]) : '';
        widths[i] = Math.max(widths[i], val.length);
      });
    }

    // Build table
    const divider = widths.map(w => '-'.repeat(w + 2)).join('+');
    const lines = [];

    // Header row
    lines.push(headerArray.map((h, i) => ` ${h.padEnd(widths[i])} `).join('|'));
    lines.push(divider);

    // Data rows
    for (const row of rows) {
      if (!row || typeof row !== 'object') continue;
      lines.push(headerArray.map((h, i) => {
        const val = row[h] !== undefined && row[h] !== null ? String(row[h]) : '';
        return ` ${val.padEnd(widths[i])} `;
      }).join('|'));
    }

    return lines.join('\n');
  }

  /**
   * Format data using a template string.
   * Template placeholders: {{fieldName}}
   *
   * @param {object} data      The data object
   * @param {string} template  Template string with {{placeholders}}
   * @returns {string}
   */
  fromTemplate(data, template) {
    this._stats.template++;
    if (!data || typeof data !== 'object') return template;

    return template.replace(/\{\{(\w+(?:\.\w+)*)\}\}/g, (match, path) => {
      const value = this._getNestedValue(data, path);
      return value !== undefined && value !== null ? String(value) : match;
    });
  }

  /**
   * Get formatting statistics.
   */
  getStats() {
    return { ...this._stats };
  }

  // ─── INTERNAL ──────────────────────────────────────────────────────────

  _objectToXML(obj, indent) {
    let xml = '';
    const pad = ' '.repeat(indent);

    for (const [key, value] of Object.entries(obj)) {
      const safeKey = key.replace(/[^a-zA-Z0-9_-]/g, '_');

      if (value === null || value === undefined) {
        xml += `${pad}<${safeKey}/>\n`;
      } else if (Array.isArray(value)) {
        xml += `${pad}<${safeKey}>\n`;
        for (const item of value) {
          if (typeof item === 'object' && item !== null) {
            xml += `${pad}  <item>\n`;
            xml += this._objectToXML(item, indent + 4);
            xml += `${pad}  </item>\n`;
          } else {
            xml += `${pad}  <item>${this._escapeXML(String(item))}</item>\n`;
          }
        }
        xml += `${pad}</${safeKey}>\n`;
      } else if (typeof value === 'object') {
        xml += `${pad}<${safeKey}>\n`;
        xml += this._objectToXML(value, indent + 2);
        xml += `${pad}</${safeKey}>\n`;
      } else {
        xml += `${pad}<${safeKey}>${this._escapeXML(String(value))}</${safeKey}>\n`;
      }
    }

    return xml;
  }

  _escapeXML(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  _csvEscape(str) {
    if (str.includes(this.csvDelimiter) || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  }

  _flattenForKV(obj, prefix, lines, separator) {
    for (const [key, value] of Object.entries(obj)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      if (value !== null && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
        this._flattenForKV(value, fullKey, lines, separator);
      } else {
        lines.push(`${fullKey}${separator}${value}`);
      }
    }
  }

  _getNestedValue(obj, path) {
    const parts = path.split('.');
    let current = obj;
    for (const part of parts) {
      if (current === null || current === undefined) return undefined;
      current = current[part];
    }
    return current;
  }
}

module.exports = { OutputFormatter };
