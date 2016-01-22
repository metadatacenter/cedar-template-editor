'use strict';

var DataTemplateService = function () {
  var dataTemplate = {};

  var service = {
    serviceId: "DataTemplateService"
  };

  service.init = function () {
    dataTemplate.field = cedarBootstrap.getFileConfig(this.serviceId, 'resources/field-empty.json');
    dataTemplate.element = cedarBootstrap.getFileConfig(this.serviceId, 'resources/element-empty.json');
    dataTemplate.template = cedarBootstrap.getFileConfig(this.serviceId, 'resources/template-empty.json');
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

DataTemplateService.$inject = [];
angularApp.service('DataTemplateService', DataTemplateService);