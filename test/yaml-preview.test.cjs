const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const scripts = path.join(__dirname, '../app/scripts');
const CONTROLLERS = ['template/create-template.controller.js', 'template-element/create-element.controller.js', 'template-field/create-field.controller.js'];
const settle = () => new Promise(resolve => setImmediate(resolve));
function handler(file, name) {
  return fs.readFileSync(path.join(scripts, file), 'utf8').match(new RegExp(`\\$scope\\.${name} = function \\(\\) \\{([\\s\\S]*?)\\n\\s*\\};`))[1];
}
function service(globals = {}) {
  let factory, requests = [], cleared = [];
  const angular = {module: () => ({factory: (name, value) => {factory = value.at(-1);}})};
  vm.runInNewContext(fs.readFileSync(path.join(scripts, 'service/yaml.service.js'), 'utf8'), {
    define: (_, callback) => callback(angular, (names, resolve, reject) => requests.push({names, resolve, reject})),
    requirejs: {undef: name => cleared.push(name)}, WeakMap, Promise, Blob, ...globals
  });
  const q = executor => new Promise(executor); q.resolve = value => Promise.resolve(value);
  return {yaml: factory(q), requests, cleared};
}
test('the writer loads only on demand and concurrent callers share it', async () => {
  const {yaml, requests} = service();
  assert.equal(requests.length, 0);
  const first = yaml.load(); assert.equal(yaml.load(), first);
  assert.equal(requests.length, 1);
  const library = {}; requests[0].resolve(library);
  assert.equal(await first, library); assert.equal(yaml.get(), library);
  await yaml.load(); assert.equal(requests.length, 1);
});
test('a failed preview shows its error and retries when reopened', async () => {
  const {yaml, requests, cleared} = service(); let watch;
  const scope = {$watch: (_, handler) => {watch = handler;}};
  assert.equal(yaml.preview(scope, () => 'name: Study'), '');
  requests[0].reject(new Error('Download failed')); await settle();
  assert.equal(yaml.preview(scope, () => 'name: Study'), 'Download failed');
  assert.equal(requests.length, 1);
  assert.deepEqual(cleared, ['CedarModelTypescriptLibrary']);
  watch(false); watch(true);
  assert.equal(yaml.preview(scope, () => 'name: Study'), '');
  requests[1].resolve({}); await settle();
  assert.equal(yaml.preview(scope, () => 'name: Study'), 'name: Study');
  assert.equal(yaml.preview(scope, () => {throw new Error('A field must have a name.');}), 'A field must have a name.');
});
for (const file of CONTROLLERS) {
  test(`copying YAML in ${path.basename(file)} waits for the writer and handles refusals`, async () => {
    const body = handler(file, 'copyYaml2Clipboard');
    for (const failure of [null, 'load', 'write']) {
      const writes = [], flashes = []; let loaded = false;
      const context = {
        YamlService: {copy: async write => {if (failure === 'load') throw Error('Download failed'); loaded = true; writes.push(write());}},
        $scope: {writeYaml: () => {assert.ok(loaded); if (failure === 'write') throw Error('A field must have a name.'); return 'name: Study';}, $apply: () => {}},
        navigator: {clipboard: {writeText: async text => {writes.push(text);}}},
        UIMessageService: {flashSuccess: key => flashes.push(['success', key]), flashWarning: key => flashes.push(['warning', key])},
        console: {error: () => {}}, Promise
      };
      vm.runInNewContext(`(function () {${body}})()`, context); await settle();
      assert.deepEqual(writes, failure ? [] : ['name: Study']);
      assert.deepEqual(flashes, [[failure ? 'warning' : 'success', failure ? 'METADATAEDITOR.YamlCopyFail' : 'METADATAEDITOR.YamlCopied']]);
    }
  });
}

test('the first copy starts the clipboard write before the writer download settles', async () => {
  let item, called = false;
  const {yaml, requests} = service({
    ClipboardItem: class {constructor(value) {item = value;}},
    navigator: {clipboard: {write: async () => {called = true; await item['text/plain'];}}}
  });
  const copy = yaml.copy(() => 'name: Study');
  assert.equal(called, true); assert.equal(requests.length, 1);
  requests[0].resolve({}); await copy;
  assert.equal(await (await item['text/plain']).text(), 'name: Study');
  await assert.rejects(yaml.copy(() => {throw Error('A field must have a name.');}), /A field must have a name/);
});
