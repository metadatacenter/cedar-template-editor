'use strict';

var FieldTypeService = function ($http, $document) {

  var config = null;
  var fieldTypes = [];

  var service = {
    serviceId: "FieldTypeService"
  };

  service.init = function () {
    config = $document[0].serviceConfigMap[this.serviceId].config;
    fieldTypes = config;
  };

  service.getFieldTypes = function () {
    return fieldTypes;
  };

  return service;

};

FieldTypeService.$inject = ["$http", "$document"];
angularApp.service('FieldTypeService', FieldTypeService);