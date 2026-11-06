const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const settle = () => new Promise(resolve => setImmediate(resolve));
function definitions() {
  let loader, directive;
  const module = {factory: (_, value) => {loader = value.at(-1); return module;}, directive: (_, value) => {directive = value.at(-1); return module;}};
  const requests = [], cleared = [];
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../app/scripts/form/deferred-ckeditor.directive.js'), 'utf8'), {
    define: (_, callback) => callback({module: () => module}, (names, resolve, reject) => requests.push({resolve, reject})),
    requirejs: {undef: name => cleared.push(name)}
  });
  return {loader, directive, requests, cleared};
}
test('rich text loads once on demand, registers the vendor module and retries failed downloads', async () => {
  const {loader, requests, cleared} = definitions(); const modules = [];
  const load = loader(executor => new Promise(executor), {loadNewModules: names => modules.push(...names)});
  assert.equal(requests.length, 0);
  const first = load(); assert.equal(load(), first);
  const error = Object.assign(new Error('Download failed'), {requireModules: ['ckeditor']});
  requests[0].reject(error); await assert.rejects(first, /Download failed/);
  assert.deepEqual(cleared, ['ckeditor', 'lib/ng-ckeditor/ng-ckeditor.min']);
  const retry = load(); requests[1].resolve(); requests[2].resolve(); await retry; await load();
  assert.equal(requests.length, 3); assert.deepEqual(modules, ['ngCkeditor']);
});
test('the directive waits before linking ngModel and skips elements removed during loading', async () => {
  for (const destroyed of [false, true]) {
    const {directive} = definitions(); let resolve, onDestroy; const calls = [];
    const ready = new Promise(done => {resolve = done;});
    const element = {on: (_, handler) => {onDestroy = handler;}, prop: (...args) => calls.push(args), removeAttr: name => calls.push(['remove', name]), attr: (...args) => calls.push(args)};
    const scope = {};
    const contract = directive(el => linked => {assert.equal(el, element); assert.equal(linked, scope); calls.push(['linked']);}, () => ready,
      {flashWarning: () => assert.fail('unexpected warning')}, error => assert.fail(error));
    assert.equal(contract.terminal, true);
    contract.link(scope, element, {cedarCkeditor: 'editorOptions'});
    assert.deepEqual(calls, [['disabled', true]]);
    if (destroyed) onDestroy(); resolve(); await settle();
    assert.deepEqual(calls, destroyed ? [['disabled', true]] : [['disabled', true], ['remove', 'cedar-ckeditor'], ['ckeditor', 'editorOptions'], ['disabled', false], ['linked']]);
  }
});
