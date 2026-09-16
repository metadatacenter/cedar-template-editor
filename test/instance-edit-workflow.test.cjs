const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const scripts = path.join(__dirname, '../app/scripts');
const noop = () => {};
// Execute production controller blocks with isolated boundary services, without a browser/backend.
function block(source, start, end) {
  const from = source.indexOf(start), to = source.indexOf(end, from);
  assert.ok(from >= 0 && to > from, `controller boundaries found: ${start}`);
  return source.slice(from, to);
}
function warning(kind, {locked = false, count = 2, failure = false} = {}) {
  const source = fs.readFileSync(path.join(scripts, kind === 'template' ? 'template' : 'template-element', `create-${kind}.controller.js`), 'utf8');
  const warnings = [], errors = [];
  let callback, resolveCount, rejectCount, lookups = 0, destination;
  const scope = {$evalAsync: fn => fn(), checkLocking() {this.cannotEdit = locked;}, canEdit() {this.cannotEdit = locked;}};
  const context = vm.createContext({$scope: scope,
    $window: {location: {assign: url => {destination = url;}}},
    $location: {url: url => {destination = url;}},
    FrontendUrlService: {getWorkspaceReturn: (_, id) => `/dashboard?folderId=${id}`, getFolderContents: id => `/dashboard?folderId=${id}`},
    QueryParamUtilsService: {getReturnTo: () => null, getFolderId: () => 'origin'},
    CONST: {resourceType: {ELEMENT: 'element'}},
    UIUtilService: {setDirty: noop, setTotalMetadata: noop, setVisibleMetadata: noop, setInstances: noop},
    UIMessageService: {confirmEditingWithInstances: (...args) => warnings.push(args), showBackendError: (...args) => errors.push(args)},
    resourceService: {getTemplateReport: (_, ok) => {callback = ok;}, getResourceDetailFromId: (_, type, ok) => {callback = ok;}},
    InclusionService: {getContainingInstanceCount() {lookups++; return new Promise((resolve, reject) => {resolveCount = resolve; rejectCount = reject;});}}
  });
  const cancel = kind === 'template' ? 'cancelTemplate' : 'cancelElement';
  vm.runInContext(block(source, `$scope.${cancel} = function`, '$scope.elementSearch'), context);
  vm.runInContext(kind === 'template'
    ? block(source, 'var instanceWarningShown', 'var getTemplate =')
    : block(source, 'var instanceWarningChecked', 'var getElement ='), context);
  vm.runInContext(kind === 'template' ? "getReport('id')" : "getDetails('id')", context);
  const report = () => callback({numberOfInstances: count});
  return {scope, warnings, errors, report, get destination() {return destination;}, get lookups() {return lookups;},
    async finish() {if (resolveCount) failure ? rejectCount(new Error('offline')) : resolveCount(count); await Promise.resolve();}};
}
for (const kind of ['template', 'element']) {
  test(`${kind}: warn once and Cancel navigates to originating folder`, async () => {
    const h = warning(kind); h.report(); await h.finish(); h.report(); await h.finish();
    assert.equal(h.warnings.length, 1);
    assert.equal(h.warnings[0][0], 2); assert.equal(h.warnings[0][1], kind === 'element');
    assert.equal(h.destination, undefined);
    h.warnings[0][2](); assert.equal(h.destination, '/dashboard?folderId=origin');
    if (kind === 'element') assert.equal(h.lookups, 1);
  });
  for (const options of [{locked: true}, {count: 0}]) {
    test(`${kind}: no warning for ${options.locked ? 'locked resource' : 'zero instances'}`, async () => {
      const h = warning(kind, options); h.report(); await h.finish();
      assert.equal(h.warnings.length, 0);
      if (options.locked) assert.equal(h.lookups, 0);
    });
  }
}
test('element: ignore late count after leaving editor', async () => {
  const h = warning('element'); h.report(); h.scope.$$destroyed = true; await h.finish();
  assert.equal(h.warnings.length, 0);
});
test('element: show lookup failure without an editing warning', async () => {
  const h = warning('element', {failure: true}); h.report(); await h.finish();
  assert.equal(h.errors.length, 1); assert.equal(h.warnings.length, 0);
});
for (const verdict of [true, false, 'error']) {
  test(`template save: compatibility check ${verdict} controls in-place update`, () => {
    const source = fs.readFileSync(path.join(scripts, 'template/create-template.controller.js'), 'utf8');
    const calls = [], events = [], errors = [];
    const form = {'@id': 'original', properties: {}};
    const scope = {form, disableSaveButton: noop, enableSaveButton: noop};
    vm.runInNewContext(block(source, '$scope.doSaveTemplate = function', '// close all the first order elements'), {
      $scope: scope, $routeParams: {id: 'original'},
      $rootScope: {$broadcast: (...args) => events.push(args)},
      schemaService: {getTitle: () => 'Study', removeUnnecessaryMaxItems: noop, defaultSchemaTitleAndDescription: noop},
      DataManipulationService: {updateKeys: noop, stripTmps: noop, stripClearedConstraints: noop},
      jQuery: {extend: (_, target, value) => structuredClone(value)},
      TemplateService: {checkUpdateTemplate: (id, body) => ({op: 'check', id, body}), updateTemplate: (id, body) => ({op: 'update', id, body})},
      AuthorizedBackendService: {doCall(request, ok, fail) {calls.push(request); if (request.op === 'check') verdict === 'error' ? fail({}) : ok({data: {canBeUpdated: verdict}});}},
      UIMessageService: {showBackendError: (...args) => errors.push(args)}
    });
    scope.doSaveTemplate();
    assert.deepEqual(calls.map(c => c.op), verdict === true ? ['check', 'update'] : ['check']);
    assert.equal(events.length, verdict === false ? 1 : 0);
    if (verdict === false) {
      assert.equal(events[0][0], 'updateTemplateWithInstancesModalVisible');
      assert.equal(events[0][1][2], 'original');
      assert.equal(scope.updateTemplateWithInstancesModalVisible, true);
    }
    assert.equal(errors.length, verdict === 'error' ? 1 : 0);
  });
}
function versionModal({deferred = false} = {}) {
  let factory, onOpen, destination, complete, fail;
  const calls = [];
  vm.runInNewContext(fs.readFileSync(path.join(scripts, 'modal/cedar-update-template-with-instances-modal.directive.js'), 'utf8'), {
    define: (_, deps, body) => body({module: () => ({directive: (_, fn) => {factory = fn;}})})
  });
  const Controller = factory().controller;
  const modal = new Controller({$on: (_, fn) => {onOpen = fn;}}, {}, {}, {path: value => {destination = value;}}, noop,
    {getFolderId: () => 'origin'}, {setDirty: noop}, {},
    {doCall(request, ok, error) {calls.push(request); complete = () => ok({data: {'@id': 'new-version', 'pav:version': '0.0.2'}}); fail = error; if (!deferred) complete();}},
    {publishCreateDraftTemplate: (id, form, folder) => ({id, form, folder})},
    {flashSuccess: noop, showBackendError: noop}, {getTemplateEdit: (id, folder) => `/edit/${id}?folderId=${folder}`});
  const original = {'@id': 'original', 'schema:name': 'Study'};
  const proposed = {...original, 'schema:name': 'Revised Study'};
  onOpen(null, [true, {data: {numberOfInstances: 3}}, 'original', proposed]);
  return {modal, calls, original, proposed, complete: () => complete(), fail: () => fail({}), get destination() {return destination;}};
}
test('new version without clones sends no clone folder and opens the returned version', () => {
  const h = versionModal(); h.modal.doAccept();
  assert.equal(h.calls.length, 1);
  assert.equal(h.calls[0].id, 'original');
  assert.equal(h.calls[0].form, h.proposed);
  assert.equal(h.calls[0].folder, null);
  assert.equal(h.destination, '/edit/new-version?folderId=origin');
});
test('cancelling version dialog makes no save request', () => {
  const h = versionModal(); h.modal.doCancel();
  assert.equal(h.calls.length, 0); assert.equal(h.destination, undefined);
  assert.equal(h.modal.modalVisible, false);
});

test('version save prevents duplicate submissions and allows retry after failure', () => {
  const h = versionModal({deferred: true});
  h.modal.doAccept(); h.modal.doAccept(); h.modal.doCancel();
  assert.equal(h.calls.length, 1); assert.equal(h.modal.modalVisible, true);
  h.fail(); assert.equal(h.modal.saving, false); assert.equal(h.modal.modalVisible, true);
  assert.equal(h.destination, undefined);
  h.modal.doAccept(); assert.equal(h.calls.length, 2); h.complete();
  assert.equal(h.modal.modalVisible, false);
});
test('breaking-change dialog offers version creation and continued editing without cloning', () => {
  const html = fs.readFileSync(path.join(scripts, 'modal/cedar-update-template-with-instances-modal.directive.html'), 'utf8');
  const strings = JSON.parse(fs.readFileSync(path.join(scripts, '../resources/i18n/locale-en.json'))).DELTAFINDER.ChangedTemplate;
  assert.equal(strings.acceptButton, 'Create new version');
  assert.equal(strings.cancelButton, 'Continue editing');
  assert.doesNotMatch(html, /selectedOption|newFolderName|doRevert|type="radio"/);
  assert.match(strings.text1, /remain attached to the original template and will not be changed/);
});
