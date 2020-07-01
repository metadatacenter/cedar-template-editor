'use strict';


define([
  'angular',
  'json!config/field-type-service.conf.json'
], function (angular, config) {
  angular.module('cedar.templateEditor.service.fieldTypeService', [])
      .service('FieldTypeService', FieldTypeService);

  FieldTypeService.$inject = [];

  function FieldTypeService() {

    var fieldTypes = [];
    var primaryFieldTypes = [];
    var otherFieldTypes = [];

    var service = {
      serviceId: "FieldTypeService"
    };

    service.init = function () {
      fieldTypes = config;
      primaryFieldTypes = [];
      otherFieldTypes = [];

      // find the fields that are in the toolbar
      for (var ft in fieldTypes) {
        if (fieldTypes[ft].primaryField) {
          primaryFieldTypes.push(fieldTypes[ft]);
        } else {
          otherFieldTypes.push(fieldTypes[ft]);
        }
      }
    };

    service.getFieldTypes = function () {
      return fieldTypes;
    };

    service.getPrimaryFieldTypes = function () {
      return primaryFieldTypes;
    };

    service.getOtherFieldTypes = function () {
      return otherFieldTypes;
    };

    service.isStaticField = function (fieldType) {
      for (var ft in fieldTypes) {
        if (fieldTypes[ft].cedarType === fieldType) {
          return fieldTypes[ft].staticField;
        }
      }
      return false;
    };

    service.isAttributeValueField = function (fieldType) {
      return fieldType === 'attribute-value';
    };

    service.getFieldIconClass = function (fieldType) {
      for (var ft in fieldTypes) {
        if (fieldTypes[ft].cedarType === fieldType) {
          return fieldTypes[ft].iconClass;
        }
      }
      return false;
    };

    return service;

  };

});
