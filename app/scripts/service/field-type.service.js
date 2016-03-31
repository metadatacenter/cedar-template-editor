'use strict';


define([
  'angular',
  'json!config/field-type-service.conf.json'
], function(angular, config) {
  angular.module('cedar.templateEditor.service.fieldTypeService', [])
    .service('FieldTypeService', FieldTypeService);

  FieldTypeService.$inject = [];

  function FieldTypeService() {

    var fieldTypes = [];

    var service = {
      serviceId: "FieldTypeService"
    };

    service.init = function () {
      fieldTypes = config;
    };

    service.getFieldTypes = function () {
      return fieldTypes;
    };

    return service;

  };

});
