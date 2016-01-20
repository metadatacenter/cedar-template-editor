'use strict';

var DataTemplateService = function ($http) {
  var dataTemplate = {};

  var service = {
    serviceId: "DataTemplateService"
  };

  service.init = function () {
    $http.get('resources/field-empty.json').then(function (response) {
      dataTemplate.field = response.data;
    }).catch(function (err) {
      console.log(err);
    });

    $http.get('resources/element-empty.json').then(function (response) {
      dataTemplate.element = response.data;
    }).catch(function (err) {
      console.log(err);
    });

    $http.get('resources/template-empty.json').then(function (response) {
      dataTemplate.template = response.data;
    }).catch(function (err) {
      console.log(err);
    });
  };

  service.getField = function (tempId) {
    var clonedField = angular.copy(dataTemplate.field);
    clonedField['@id'] = tempId;
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

  return service;

};

DataTemplateService.$inject = ["$http"];
angularApp.service('DataTemplateService', DataTemplateService);