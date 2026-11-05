const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const source = fs.readFileSync(path.join(__dirname, '../app/scripts/core/cee-loader.js'), 'utf8');
function harness(registered = false) {
  let loader, complete, fail;
  const requests = [], cleared = [], outcomes = [];
  const target = { customElements: { get: () => registered }, requirejs: { undef: name => cleared.push(name) } };
  vm.runInNewContext(source, { define: (dependencies, factory) => {
    loader = factory((names, ready, failed) => { requests.push(...names); complete = ready; fail = failed; });
  }});
  return { requests, cleared, outcomes, load: () => loader.load(target, () => outcomes.push('ready'), error => outcomes.push(error.message)),
    complete: () => complete(), fail: () => fail(new Error('offline')), register: () => { registered = true; } };
}
test('defers requesting CEE until an instance route asks and waits for registration', () => {
  const h = harness();
  assert.deepEqual(h.requests, []);
  h.load();
  assert.deepEqual(h.requests, ['cedar-embeddable-editor']);
  assert.deepEqual(h.outcomes, []);
  h.register(); h.complete();
  assert.deepEqual(h.outcomes, ['ready']);
  h.load();
  assert.equal(h.requests.length, 1);
});
test('a failed script is cleared for a later visit and reports its failure', () => {
  const h = harness(); h.load(); h.fail();
  assert.deepEqual(h.cleared, ['cedar-embeddable-editor']);
  assert.deepEqual(h.outcomes, ['offline']);
  h.load(); h.register(); h.complete();
  assert.deepEqual(h.outcomes, ['offline', 'ready']);
});
test('a script that does not register CEE fails instead of opening an inert form', () => {
  const h = harness(); h.load(); h.complete();
  assert.deepEqual(h.outcomes, ['CEDAR Embeddable Editor did not initialize']);
});
