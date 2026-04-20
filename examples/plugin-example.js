/**
 * nopes — Plugin Extension Example
 *
 * Shows how to create custom plugins to extend nopes.
 *
 * Run: node examples/plugin-example.js
 */

const { PluginManager, createTransformer } = require('../src/index');

// ─── Custom Plugin: Transform Logger ─────────────────────────────────────────
const transformLogger = {
  name: 'transform-logger',
  version: '1.0.0',
  hooks: {
    beforeTransform: (data, ctx) => {
      console.log(`[transform-logger] Incoming fields: ${Object.keys(data).join(', ')}`);
      return data;
    },
    afterTransform: (data, ctx) => {
      console.log(`[transform-logger] Outgoing fields: ${Object.keys(data).join(', ')}`);
      return data;
    },
  },
  init: () => {
    console.log('[transform-logger] Plugin initialized');
  },
  destroy: () => {
    console.log('[transform-logger] Plugin destroyed');
  },
};

// ─── Custom Plugin: Field Sanitizer ──────────────────────────────────────────
const fieldSanitizer = {
  name: 'field-sanitizer',
  version: '1.0.0',
  hooks: {
    afterTransform: (data) => {
      const sanitized = {};
      for (const [key, value] of Object.entries(data)) {
        if (typeof value === 'string') {
          sanitized[key] = value.trim();
        } else {
          sanitized[key] = value;
        }
      }
      return sanitized;
    },
  },
};

// ─── Custom Plugin: Default Values ───────────────────────────────────────────
function createDefaultsPlugin(defaults) {
  return {
    name: 'defaults-plugin',
    version: '1.0.0',
    hooks: {
      afterTransform: (data) => {
        const result = { ...data };
        for (const [key, value] of Object.entries(defaults)) {
          if (result[key] === undefined || result[key] === null) {
            result[key] = value;
          }
        }
        return result;
      },
    },
  };
}

// ─── Usage ───────────────────────────────────────────────────────────────────
console.log('=== Plugin System Demo ===\n');

const plugins = new PluginManager();

// Register plugins
plugins.register(transformLogger);
plugins.register(fieldSanitizer);
plugins.register(createDefaultsPlugin({ role: 'user', status: 'active' }));

console.log('Registered plugins:', plugins.list());
console.log('Plugin count:', plugins.size());
console.log();

// Execute hooks in sequence
(async () => {
  const inputData = {
    first_name: '  Alice  ',
    email: 'alice@test.com',
  };

  console.log('--- Running beforeTransform hooks ---');
  const beforeResult = await plugins.execute('beforeTransform', inputData, {});

  console.log('\n--- Running afterTransform hooks ---');
  const afterResult = await plugins.execute('afterTransform', beforeResult, {});

  console.log('\nFinal result:', afterResult);
  console.log();

  // Unregister a plugin
  plugins.unregister('transform-logger');
  console.log('After unregister:', plugins.list());

  console.log('\n✅ Plugin example completed!');
})();
