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
    var primaryFieldTypeCount = 4;

    var service = {
      serviceId: "FieldTypeService"
    };

    service.init = function () {
      fieldTypes = config;
      primaryFieldTypes = fieldTypes.slice(0, primaryFieldTypeCount);
      otherFieldTypes = fieldTypes.slice(primaryFieldTypeCount);
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
        if (fieldTypes[ft].cedarType == fieldType) {
          return fieldTypes[ft].staticField;
        }
      }
      return false;
    };

    return service;

  };

});
