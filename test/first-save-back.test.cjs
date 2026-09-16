const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const scripts = path.join(__dirname, '../app/scripts');
for (const [directory, name, route] of [
  ['template', 'template', 'templates'],
  ['template-element', 'element', 'elements'],
  ['template-field', 'field', 'fields']
]) {
  test(`${name}: first save then CEDAR Back returns directly to the originating folder`, () => {
    const folder = '/dashboard?folderId=folder-1';
    let url = folder, changed, factory, replaced = false;
    const location = {
      url(value) {if (value === undefined) return url; url = value; return this;},
      path(value) {if (value === undefined) return url.split('?')[0]; url = value + '?folderId=folder-1'; return this;},
      replace() {replaced = true; return this;}
    };
    vm.runInNewContext(fs.readFileSync(path.join(scripts, 'service/previous-route.service.js'), 'utf8'), {
      define: (_, body) => body({module: () => ({service: (_, fn) => {factory = fn;}})})
    });
    const previous = factory({$on: (_, cb) => {changed = cb;}}, location, {scrollTo() {}}, {}, {});
    location.url(`/${route}/create?folderId=folder-1`); changed();
    const source = fs.readFileSync(path.join(scripts, directory, `create-${name}.controller.js`), 'utf8');
    new vm.Script(source); // Check the complete controller's syntax too.
    const callback = source.match(/var doSave = function\s*\(response\)\s*\{([\s\S]*?)\n\s*\};/)[1];
    const noop = () => {};
    const data = {getTitle: () => 'Study', createDomIds: noop};
    vm.runInNewContext(callback, {
      response: {headers: noop, data: {'@id': 'saved-id'}},
      ValidationService: {logValidation: noop}, schemaService: data, dms: data,
      DataManipulationService: data, UIMessageService: {flashSuccess: noop},
      UIUtilService: {setDirty: noop}, $scope: {setClean: noop},
      PreviousRouteService: previous, $location: location,
      FrontendUrlService: {[`get${name[0].toUpperCase() + name.slice(1)}Edit`]: id => `/${route}/edit/${id}`}
    });
    changed();
    assert.equal(replaced, true, 'native browser entry must be replaced');
    assert.equal(previous.getPreviousUrl(), folder);
    previous.goBack(); changed();
    assert.equal(url, folder);
    assert.equal(previous.hasPrevious(), false, 'the obsolete create route must not remain');
  });
}
