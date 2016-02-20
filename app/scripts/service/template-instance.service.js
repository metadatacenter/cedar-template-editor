'use strict';

define([
  'angular'
], function(angular) {
  angular.module('cedar.templateEditor.service.templateInstanceService', [])
    .service('TemplateInstanceService', TemplateInstanceService);

  TemplateInstanceService.$inject = ['$http', 'UrlService'];

  function TemplateInstanceService($http, UrlService) {

    var service = {
      serviceId: "TemplateInstanceService"
    };

    service.getDefaultTemplateInstancesSummary = function () {
      return $http.get(UrlService.getDefaultTemplateInstancesSummary(10, 0));
    };

    service.getAllTemplateInstancesSummary = function () {
      return $http.get(UrlService.getAllTemplateInstancesSummary());
    };

    service.getTemplateInstance = function (id) {
      return $http.get(UrlService.getTemplateInstance(id));
    };

    service.deleteTemplateInstance = function (id) {
      return $http.delete(UrlService.getTemplateInstance(id));
    };

    service.saveTemplateInstance = function (instance) {
      return $http.post(UrlService.templateInstances(), angular.toJson(instance));
    };

    service.updateTemplateInstance = function (id, instance) {
      return $http.put(UrlService.getTemplateInstance(id), angular.toJson(instance));
    };

    return service;

  };

});
