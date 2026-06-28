const fs = require('fs');
const path = require('path');

const schemaPath = path.join('node_modules', 'webpack', 'schemas', 'plugins', 'ProgressPlugin.json');

try {
  const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));

  if (schema.definitions && schema.definitions.ProgressPluginOptions) {
    delete schema.definitions.ProgressPluginOptions.additionalProperties;
    fs.writeFileSync(schemaPath, JSON.stringify(schema, null, 2));
    console.log('✓ Patched webpack ProgressPlugin schema (webpackbar compatibility)');
  }
} catch (e) {
  console.warn('Could not patch webpack ProgressPlugin schema:', e.message);
}
