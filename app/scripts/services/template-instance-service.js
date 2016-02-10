'use strict';

var TemplateInstanceService = function ($http, UrlService, AuthorizedBackendService) {

  var service = {
    serviceId: "TemplateInstanceService"
  };

  service.getDefaultTemplateInstancesSummary = function () {
    return $http.get(UrlService.getDefaultTemplateInstancesSummary(10, 0), AuthorizedBackendService.getConfig());
  };

  service.getAllTemplateInstancesSummary = function () {
    return $http.get(UrlService.getAllTemplateInstancesSummary(), AuthorizedBackendService.getConfig());
  };

  service.getTemplateInstance = function (id) {
    return $http.get(UrlService.getTemplateInstance(id), AuthorizedBackendService.getConfig());
  };

  service.deleteTemplateInstance = function (id) {
    return $http.delete(UrlService.getTemplateInstance(id), AuthorizedBackendService.getConfig());
  };

  service.saveTemplateInstance = function (instance) {
    return $http.post(UrlService.templateInstances(), angular.toJson(instance), AuthorizedBackendService.getConfig());
  };

  service.updateTemplateInstance = function (id, instance) {
    return $http.put(UrlService.getTemplateInstance(id), angular.toJson(instance), AuthorizedBackendService.getConfig());
  };

  return service;

};

TemplateInstanceService.$inject = ["$http", "UrlService", "AuthorizedBackendService"];
angularApp.service('TemplateInstanceService', TemplateInstanceService);