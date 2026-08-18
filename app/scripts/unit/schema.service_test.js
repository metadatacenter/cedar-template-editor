'use strict';

define(['app', 'angular'], function (app) {
  describe('schemaService multiple-choice cardinality', function () {
    var schemaService;

    beforeEach(module(app.name));
    beforeEach(module('cedar.templateEditor.service.schemaService'));

    beforeEach(inject(function (_schemaService_) {
      schemaService = _schemaService_;
    }));

    var listField = function (required) {
      return {
        type: 'object',
        '@id': 'https://repo.metadatacenter.org/template-fields/list',
        '@type': 'https://schema.metadatacenter.org/core/TemplateField',
        'schema:identifier': 'stable-identifier',
        _annotations: { note: { '@value': 'preserve me' } },
        _ui: { inputType: 'list' },
        _valueConstraints: { multipleChoice: false, requiredValue: required },
        properties: { '@value': { type: ['string', 'null'] } },
        required: ['@value'],
        additionalProperties: false
      };
    };

    it('creates and removes multiple-choice cardinality without dropping extension keys', function () {
      var field = listField(false);

      schemaService.setMultipleChoice(field, true);
      expect(field.type).toBe('array');
      expect(field.minItems).toBe(0);
      expect(field.items['schema:identifier']).toBe('stable-identifier');

      schemaService.setMultipleChoice(field, false);
      expect(field.type).toBe('object');
      expect(field['schema:identifier']).toBe('stable-identifier');
      expect(field._annotations.note['@value']).toBe('preserve me');
    });

    it('does not clean nested cardinality while preparing a template for save', function () {
      var properties = {
        Outer: {
          type: 'array', minItems: 1, maxItems: 1,
          items: {properties: {Inner: {type: 'array', minItems: 0, maxItems: 0, items: {}}}}
        }
      };

      schemaService.removeUnnecessaryMaxItems(properties);

      expect(properties.Outer.minItems).toBeUndefined();
      expect(properties.Outer.maxItems).toBeUndefined();
      expect(properties.Outer.items.properties.Inner.maxItems).toBe(0);
    });
  });
});
