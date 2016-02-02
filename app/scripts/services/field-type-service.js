'use strict';

var FieldTypeService = function () {

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

FieldTypeService.$inject = [];
angularApp.service('FieldTypeService', FieldTypeService);