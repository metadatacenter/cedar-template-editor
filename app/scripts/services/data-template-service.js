'use strict';

var DataTemplateService = function ($http) {
  var dataTemplate = {};

  var service = {
    serviceId: "DataTemplateService"
  };

  service.init = function () {
    $http.get('data/field-empty.json').then(function (response) {
      dataTemplate.field = response.data;
    }).catch(function (err) {
      console.log(err);
    });

    $http.get('data/element-empty.json').then(function (response) {
      dataTemplate.element = response.data;
    }).catch(function (err) {
      console.log(err);
    });

    $http.get('data/template-empty.json').then(function (response) {
      dataTemplate.template = response.data;
    }).catch(function (err) {
      console.log(err);
    });
  };

  service.getField = function (id) {
    var clonedField = angular.copy(dataTemplate.field);
    clonedField['@id'] = id;
    return clonedField;
  };

  service.getElement = function (id) {
    var clonedElement = angular.copy(dataTemplate.element);
    clonedElement['@id'] = id;
    return clonedElement;
  };

  service.getTemplate = function (id) {
    var clonedTemplate = angular.copy(dataTemplate.template);
    clonedTemplate['@id'] = id;
    return clonedTemplate;
  };

  return service;

};

DataTemplateService.$inject = ["$http"];
angularApp.service('DataTemplateService', DataTemplateService);