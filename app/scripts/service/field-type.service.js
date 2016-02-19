'use strict';


define([
  'angular'
], function(angular) {
  angular.module('cedar.templateEditor.service.fieldTypeService', [])
    .service('FieldTypeService', FieldTypeService);

  FieldTypeService.$inject = [];

  function FieldTypeService() {

    var config = null;
    var fieldTypes = [];

    var service = {
      serviceId: "FieldTypeService"
    };

    service.init = function () {
      config = cedarBootstrap.getBaseConfig(this.serviceId);
      fieldTypes = config;
    };

    service.getFieldTypes = function () {
      return fieldTypes;
    };

    return service;

  };

});
