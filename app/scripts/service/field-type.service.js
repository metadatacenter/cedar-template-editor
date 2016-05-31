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
    var otherFieldTypes = [];
    var primaryFieldTypeCount = 4;

    var service = {
      serviceId: "FieldTypeService"
    };

    service.init = function () {
      fieldTypes = config;
      otherFieldTypes = fieldTypes.slice([4]);

      console.log(fieldTypes)
      console.log(otherFieldTypes);
    };

    service.getFieldTypes = function () {
      return fieldTypes;
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
