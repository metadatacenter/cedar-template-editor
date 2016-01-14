'use strict';

var FieldTypeService = function ($http) {
  var fieldTypes = [];

  var service = {
    serviceId: "FieldTypeService"
  };

  service.init = function () {
    $http.get('config/field-type-service.conf.json').then(function (response) {
      fieldTypes = response.data;
    }).catch(function (err) {
      console.log(err);
    });

  };

  service.getFieldTypes = function () {
    return fieldTypes;
  };

  return service;

};

FieldTypeService.$inject = ["$http"];
angularApp.service('FieldTypeService', FieldTypeService);