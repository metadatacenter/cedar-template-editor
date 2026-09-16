const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const app = path.join(__dirname, '../app');
function load(file, extras = {}) {
  let constructor;
  const angular = {toJson: JSON.stringify, module: () => ({service: (_, fn) => {constructor = fn;}})};
  vm.runInNewContext(fs.readFileSync(path.join(app, 'scripts/service', file), 'utf8'),
      {define: (_, factory) => factory(angular), ...extras});
  return constructor;
}
function counter(graphs, counts) {
  const calls = [];
  const q = executor => new Promise(executor);
  q.resolve = Promise.resolve.bind(Promise); q.all = Promise.all.bind(Promise);
  const make = load('inclusion.service.js');
  const service = make({post: (_, body) => JSON.parse(body)}, {getInclusions: () => '/preview'}, {
    doCall(request, ok, fail) {
      calls.push(request['@id']);
      graphs[request['@id']] instanceof Error ? fail(graphs[request['@id']]) :
          ok({data: graphs[request['@id']]});
    }
  }, {getTemplateReport(id, ok) {calls.push(id); ok({numberOfInstances: counts[id]});}}, q);
  return {service, calls};
}
test('counts indirect uses once across shared branches and cycles', async () => {
  const {service, calls} = counter({
    pi: {elements: {a: {}, b: {}}, templates: {study: {}}},
    a: {elements: {pi: {}}, templates: {study: {}, second: {}}},
    b: {templates: {second: {}}}
  }, {study: 2, second: 3});
  assert.equal(await service.getContainingInstanceCount('pi'), 5);
  assert.equal(calls.filter(id => id === 'study').length, 1);
  assert.equal(calls.filter(id => id === 'pi').length, 1);
});
test('unused elements do not produce an instance warning', async () => {
  const {service} = counter({pi: {}}, {});
  assert.equal(await service.getContainingInstanceCount('pi'), 0);
});
test('lookup failures are reported rather than treated as zero instances', async () => {
  const {service} = counter({pi: new Error('unavailable')}, {});
  await assert.rejects(service.getContainingInstanceCount('pi'), /unavailable/);
});
test('modal uses exact copy and explicit Continue editing / Cancel choices', () => {
  const strings = JSON.parse(fs.readFileSync(path.join(app, 'resources/i18n/locale-en.json')));
  let options, callback, cancelled = 0;
  const make = load('ui-message.service.js', {swal: (o, cb) => {options = o; callback = cb;}});
  const translate = {instant: key => key.split('.').reduce((value, part) => value[part], strings)};
  const service = make({}, translate, fn => fn(), {});
  service.confirmEditingWithInstances(3, true, () => cancelled++);
  assert.equal(options.text, 'You can change display labels, descriptions, help text, and order. Other changes require a new template version. If a new template is required, existing instances will remain attached to this original template.');
  assert.equal(options.confirmButtonText, 'Continue editing');
  assert.equal(options.showCancelButton, true);
  assert.equal(options.allowOutsideClick, false);
  assert.equal(options.allowEscapeKey, false);
  callback(true); assert.equal(cancelled, 0);
  callback(false); assert.equal(cancelled, 1);
});
