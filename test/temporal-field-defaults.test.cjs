const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

/**
 * A temporal field carries the precision it is read at. Only the field's own settings panel used
 * to write it, so a date added and saved without opening that panel was stored as
 * {"inputType": "temporal"} and nothing else — accepted on write, because the meta-schema asks
 * every literal field for an inputType and nothing more, and unreadable afterwards:
 * cedar-artifact-library answers "No text value present for field temporalGranularity" and the
 * artifact has no YAML representation at all.
 *
 * Fourteen such fields reached production between 2018 and 2026, from four editor versions.
 */
const scripts = path.join(__dirname, '../app/scripts');
const emptyField = JSON.parse(fs.readFileSync(path.join(__dirname, '../app/resources/field-empty.json'), 'utf8'));
const emptyContainerField = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../app/resources/field-container-empty.json'), 'utf8'));

let make;
vm.runInNewContext(fs.readFileSync(path.join(scripts, 'service/data-manipulation.service.js'), 'utf8'), {
  define: (_deps, factory) => factory(
    {module: () => ({service: (_name, constructor) => {make = constructor;}})},
    {}),
  // The service mints a temporary id from the browser clock; the tests care about the field's
  // shape rather than its id, so a fixed clock stands in for it.
  window: {performance: {now: () => 0}},
  Date,
});

const dataTemplateService = {
  getField: () => structuredClone(emptyField),
  getContainerField: () => structuredClone(emptyContainerField),
  getStaticStandaloneField: () => structuredClone(emptyField),
  getAttributeValueField: () => structuredClone(emptyField),
};
const fieldTypeService = {
  isStaticField: () => false,
  isAttributeValueField: () => false,
};
const $translate = {instant: (key) => key};
const service = make(dataTemplateService, {}, {}, fieldTypeService, {}, {$on: () => {}}, $translate, {}, {});

test('a new date field states the precision it is read at', () => {
  const field = service.generateField('temporal');
  assert.equal(field._ui.inputType, 'temporal');
  assert.equal(field._ui.temporalGranularity, 'day');
  assert.equal(field._valueConstraints.temporalType, 'xsd:date');
});

test('a date field inside an element states it too', () => {
  const field = service.generateField('temporal', true);
  assert.equal(field._ui.temporalGranularity, 'day');
  assert.equal(field._valueConstraints.temporalType, 'xsd:date');
});

test('no other field type gains a temporal precision', () => {
  for (const inputType of ['textfield', 'textarea', 'numeric', 'email', 'link', 'list']) {
    const field = service.generateField(inputType);
    assert.equal(field._ui.temporalGranularity, undefined, inputType);
    assert.equal(field._valueConstraints.temporalType, undefined, inputType);
  }
});
