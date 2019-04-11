'use strict';

define([
  'angular',
  'json!resources/field-empty.json',
  'json!resources/field-static-empty.json',
  'json!resources/element-empty.json',
  'json!resources/template-empty.json',
  'json!resources/field-attribute-value-empty.json',
  'json!resources/field-container-empty.json',
  'json!resources/additionalproperties-attributevaluefield.json',
  'json!resources/additionalproperties-context-attributevaluefield.json'
], function (angular, emptyField, emptyStaticField, emptyElement, emptyTemplate, emptyAttributeValue,
             emptyContainerField, additionalPropertiesAttValueField, additionalPropertiesContextAttValueField) {
  angular.module('cedar.templateEditor.service.dataTemplateService', [])
      .service('DataTemplateService', DataTemplateService);

  DataTemplateService.$inject = [];

  function DataTemplateService() {
    var dataTemplate = {};

    var service = {
      serviceId: "DataTemplateService"
    };

    service.init = function () {
      dataTemplate.field = emptyField;
      dataTemplate.staticField = emptyStaticField;
      dataTemplate.element = emptyElement;
      dataTemplate.template = emptyTemplate;
      dataTemplate.attributeValueField = emptyAttributeValue;
      dataTemplate.containerField = emptyContainerField;
      dataTemplate.additionalPropertiesAttValueField = additionalPropertiesAttValueField;
      dataTemplate.additionalPropertiesContextAttValueField = additionalPropertiesContextAttValueField;
    };

    service.getField = function (tempId) {
      var clonedField = angular.copy(dataTemplate.field);
      clonedField['@id'] = tempId;
      return clonedField;
    };

    service.getStaticField = function (tempId) {
      var clonedField = angular.copy(dataTemplate.staticField);
      clonedField['@id'] = tempId;
      return clonedField;
    };

    service.getContainerField = function (tempId) {
      var clonedField = angular.copy(dataTemplate.containerField);
      clonedField['@id'] = tempId;
      return clonedField;
    };

    service.getAttributeValueField = function (tempId) {
      var clonedField = angular.copy(dataTemplate.attributeValueField);
      clonedField['items']['@id'] = tempId;
      return clonedField;
    };

    service.getElement = function () {
      var clonedElement = angular.copy(dataTemplate.element);
      return clonedElement;
    };

    service.getTemplate = function () {
      var clonedTemplate = angular.copy(dataTemplate.template);
      return clonedTemplate;
    };

    service.getAdditionalPropertiesForAttributeValueField = function () {
      return dataTemplate.additionalPropertiesAttValueField;
    };

    service.getAdditionalPropertiesForContextOfAttributeValueField = function () {
      return dataTemplate.additionalPropertiesContextAttValueField;
    };

    return service;

  };

});
