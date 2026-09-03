'use strict';

define([
  'angular',
  'angularMocks',
  'cedar/template-editor/service/data-manipulation.service'
], function () {

  describe('Cleared constraints:', function () {
    beforeEach(module('cedar.templateEditor.service.dataManipulationService', function ($provide) {
      $provide.value('DataTemplateService', {});
      $provide.value('DataUtilService', {
        isSpecialKey: function (key) { return /^[@$_]/.test(key); }
      });
      $provide.value('UrlService', {});
      $provide.value('FieldTypeService', {});
      $provide.value('schemaService', {});
      $provide.value('$translate', {});
      $provide.value('CONST', {});
    }));

    // A numeric field the user gave a range and then cleared: AngularJS writes null into the model
    // for an emptied number input, and the meta-schema accepts only a number there.
    var numericField = function (constraints) {
      return {
        '@type': 'https://schema.metadatacenter.org/core/TemplateField',
        type: 'object',
        _ui: {inputType: 'numeric'},
        _valueConstraints: constraints,
        properties: {'@value': {type: ['string', 'null']}}
      };
    };

    it('drops a numeric range the user cleared, keeping the constraints it still holds',
        inject(function (DataManipulationService) {
          var field = numericField(
              {numberType: 'xsd:int', minValue: null, maxValue: null, requiredValue: false});
          DataManipulationService.stripClearedConstraints(field);
          expect(field._valueConstraints.hasOwnProperty('minValue')).toBe(false);
          expect(field._valueConstraints.hasOwnProperty('maxValue')).toBe(false);
          expect(field._valueConstraints.numberType).toBe('xsd:int');
          expect(field._valueConstraints.requiredValue).toBe(false);
        }));

    it('keeps a range that is still set, including a zero bound',
        inject(function (DataManipulationService) {
          var field = numericField({minValue: 0, maxValue: 10, decimalPlace: 0});
          DataManipulationService.stripClearedConstraints(field);
          expect(field._valueConstraints.minValue).toBe(0);
          expect(field._valueConstraints.maxValue).toBe(10);
          expect(field._valueConstraints.decimalPlace).toBe(0);
        }));

    it('drops cleared string length and text constraints',
        inject(function (DataManipulationService) {
          var field = numericField(
              {minLength: null, maxLength: null, regex: '', unitOfMeasure: '', defaultValue: null});
          DataManipulationService.stripClearedConstraints(field);
          expect(field._valueConstraints.hasOwnProperty('minLength')).toBe(false);
          expect(field._valueConstraints.hasOwnProperty('maxLength')).toBe(false);
          expect(field._valueConstraints.hasOwnProperty('regex')).toBe(false);
          expect(field._valueConstraints.hasOwnProperty('unitOfMeasure')).toBe(false);
          // The meta-schema accepts a null defaultValue, so it is left as the user left it.
          expect(field._valueConstraints.hasOwnProperty('defaultValue')).toBe(true);
        }));

    it('drops a cleared size from a static field',
        inject(function (DataManipulationService) {
          var field = {
            type: 'object',
            _ui: {inputType: 'youTube', _content: 'abc', _size: {width: null, height: 300}}
          };
          DataManipulationService.stripClearedConstraints(field);
          expect(field._ui._size.hasOwnProperty('width')).toBe(false);
          expect(field._ui._size.height).toBe(300);
        }));

    // The mechanism behind the bug: AngularJS writes null into the model for an emptied number
    // input, so the key stays behind holding a value the meta-schema rejects.
    it('leaves null in the model when a number input is emptied, which is what has to be stripped',
        inject(function ($compile, $rootScope, DataManipulationService) {
          var scope = $rootScope.$new();
          scope.constraints = {minValue: 1, maxValue: 10};
          var input = $compile('<input type="number" ng-model="constraints.minValue">')(scope);
          scope.$digest();

          input.controller('ngModel').$setViewValue('');
          scope.$digest();
          expect(scope.constraints.minValue).toBe(null);
          expect(scope.constraints.hasOwnProperty('minValue')).toBe(true);

          DataManipulationService.stripClearedConstraints(
              {type: 'object', _valueConstraints: scope.constraints});
          expect(scope.constraints.hasOwnProperty('minValue')).toBe(false);
          expect(scope.constraints.maxValue).toBe(10);
        }));

    it('reaches a field nested in an element and a multi-instance field',
        inject(function (DataManipulationService) {
          var template = {
            type: 'object',
            _ui: {order: ['section']},
            properties: {
              '@context': {type: 'object'},
              section: {
                type: 'object',
                _ui: {order: ['count']},
                properties: {
                  count: {
                    type: 'array',
                    minItems: 1,
                    items: numericField({minValue: null, maxValue: 5})
                  }
                }
              }
            }
          };
          DataManipulationService.stripClearedConstraints(template);
          var constraints = template.properties.section.properties.count.items._valueConstraints;
          expect(constraints.hasOwnProperty('minValue')).toBe(false);
          expect(constraints.maxValue).toBe(5);
        }));
  });
});
