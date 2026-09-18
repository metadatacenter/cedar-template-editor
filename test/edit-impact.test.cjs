const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const scripts = path.join(__dirname, '../app/scripts');
let make;
vm.runInNewContext(fs.readFileSync(path.join(scripts, 'service/schema.service.js'), 'utf8'), {
  define: (_, factory) => factory({module: () => ({service: (_, constructor) => {make = constructor;}})})
});
const service = make({}, {}, {});
function fixture() {
  return {'schema:name': 'Study', _ui: {order: ['PI', 'Date'], propertyLabels: {PI: 'Investigator'}}, properties: {
    PI: {type: 'array', minItems: 1, items: {'schema:name': 'PI', _ui: {order: ['Name']}, properties: {
      Name: {'schema:name': 'Name', _ui: {inputType: 'textfield'}, _valueConstraints: {requiredValue: false}, properties: {'@value': {type: 'string'}}}
    }}},
    Date: {'schema:name': 'Date', _ui: {inputType: 'temporal'}, properties: {'@value': {type: 'string'}}}
  }};
}
function impact(edit) {const original = fixture(), current = structuredClone(original); edit(current); return service.getEditImpact(original, current);}
test('unchanged templates and editor-only state do not show an impact', () => {
  assert.equal(impact(t => {t._tmp = {active: true}; t.properties.PI._tmp = {expanded: true};}), 'unchanged');
});
for (const [name, edit] of [
  ['display labels', t => {t._ui.propertyLabels.PI = 'Principal investigator';}],
  ['description', t => {t['schema:description'] = 'Updated description';}],
  ['nested help text', t => {t.properties.PI.items.properties.Name['schema:description'] = 'Enter a name';}],
  ['child order', t => {t._ui.order.reverse();}],
]) test(`${name} is presentation-only`, () => assert.equal(impact(edit), 'display'));
for (const [name, edit] of [
  ['field name', t => {t.properties.PI.items.properties.Name['schema:name'] = 'Full name';}],
  ['cardinality', t => {t.properties.PI.minItems = 2;}],
  ['required value', t => {t.properties.PI.items.properties.Name._valueConstraints.requiredValue = true;}],
  ['field type', t => {t.properties.Date._ui.inputType = 'textfield';}],
  ['new child', t => {t.properties.Added = {_ui: {inputType: 'textfield'}};}],
  ['deleted child', t => {delete t.properties.Date;}],
  ['unknown setting', t => {t.newSetting = true;}],
  ['constraint named description', t => {t.properties.PI.items.properties.Name._valueConstraints.description = 'semantic';}],
  ['context term named description', t => {t['@context'] = {description: 'https://example.org/predicate'};}],
]) test(`${name} requires a version`, () => assert.equal(impact(edit), 'version'));
test('restoring a structural edit preserves earlier display edits and becomes safe again', () => {
  const original = fixture(), current = structuredClone(original);
  current['schema:description'] = 'Display edit'; current.properties.PI.minItems = 2;
  assert.equal(service.getEditImpact(original, current), 'version');
  current.properties.PI.minItems = 1;
  assert.equal(service.getEditImpact(original, current), 'display');
  delete current['schema:description'];
  assert.equal(service.getEditImpact(original, current), 'unchanged');
});
test('controller debounces comparison, skips unused templates and cancels work on exit', () => {
  const source = fs.readFileSync(path.join(scripts, 'template/create-template.controller.js'), 'utf8');
  const start = source.indexOf('var savedDefinition;'), end = source.indexOf('var instanceWarningShown', start);
  let changed, destroy, pending, comparisons = 0;
  const scope = {form: fixture(), details: {numberOfInstances: 1}, $watch: (_, fn) => {changed = fn;}, $on: (_, fn) => {destroy = fn;}};
  const timeout = fn => {pending = fn; return fn;}; timeout.cancel = () => {pending = null;};
  const context = vm.createContext({$scope: scope, $timeout: timeout, baseline: fixture(), schemaService: {getEditImpact(a, b) {comparisons++; return service.getEditImpact(a, b);}}});
  vm.runInContext(source.slice(start, end) + '\nsavedDefinition = baseline;', context);
  scope.form['schema:description'] = 'Help'; changed(); changed();
  assert.equal(comparisons, 0); pending(); assert.equal(scope.editImpact, 'display');
  scope.form.properties.PI.minItems = 2; changed(); pending(); assert.equal(scope.editImpact, 'version');
  scope.form.properties.PI.minItems = 1; changed(); pending(); assert.equal(scope.editImpact, 'display');
  scope.details.numberOfInstances = 0; changed(); assert.equal(scope.editImpact, 'unchanged'); assert.equal(pending, null);
  scope.details.numberOfInstances = 1; changed(); destroy(); assert.equal(pending, null);
});
