'use strict';

define([
  'angular',
  'json!resources/field-empty.json',
  'json!resources/element-empty.json',
  'json!resources/template-empty.json'
], function(angular, emptyField, emptyElement, emptyTemplate) {
  angular.module('cedar.templateEditor.service.dataTemplateService', [])
    .service('DataTemplateService', DataTemplateService);

  DataTemplateService.$inject = [];

  function DataTemplateService() {
    var dataTemplate = {};

    var service = {
      serviceId: "DataTemplateService"
    };

    service.init = function () {
      dataTemplate.field = emptyField;
      dataTemplate.element = emptyElement;
      dataTemplate.template = emptyTemplate;
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

});
