const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const scripts = path.join(__dirname, '../app/scripts');
const locale = JSON.parse(fs.readFileSync(path.join(__dirname, '../app/resources/i18n/locale-en.json'), 'utf8'));

// The error toast shows the translation of the key it is given, and the key itself when the key has
// none, so a misspelled key reaches the user as text such as "IMPEX.error".
function translation(key) {
  return key.split('.').reduce((node, part) => (node && typeof node === 'object' ? node[part] : undefined), locale);
}


function sources(directory) {
  return fs.readdirSync(directory, {withFileTypes: true}).flatMap(entry => {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) return entry.name === 'unit' ? [] : sources(file);
    return entry.name.endsWith('.js') ? [file] : [];
  });
}

// A literal that holds a space is a sentence the toast shows as it is written, not a key. A key built
// by concatenation is not a literal, and is left out.
const calls = sources(scripts).flatMap(file =>
  [...fs.readFileSync(file, 'utf8').matchAll(/showBackendError\(\s*'([^']+)'\s*,/g)]
    .map(match => ({file: path.relative(scripts, file), key: match[1]}))
    .filter(call => !call.key.includes(' ')));

test('every error toast key has an English translation', () => {
  assert.ok(calls.length > 20, `only ${calls.length} toast keys found`);
  const missing = calls.filter(call => typeof translation(call.key) !== 'string');
  assert.deepEqual(missing, []);
});
