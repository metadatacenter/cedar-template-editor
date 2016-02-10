'use strict';

var TemplateService = function ($http, UrlService, AuthorizedBackendService) {

  var service = {
    serviceId: "TemplateService"
  };

  service.getDefaultTemplatesSummary = function () {
    return $http.get(UrlService.getDefaultTemplatesSummary(3, 0), AuthorizedBackendService.getConfig());
  };

  service.getAllTemplatesSummary = function () {
    return $http.get(UrlService.getAllTemplatesSummary(), AuthorizedBackendService.getConfig());
  };

  service.getTemplate = function (id) {
    return $http.get(UrlService.getTemplate(id), AuthorizedBackendService.getConfig());
  };

  service.deleteTemplate = function (id) {
    return $http.delete(UrlService.getTemplate(id), AuthorizedBackendService.getConfig());
  };

  service.saveTemplate = function (template) {
    return $http.post(UrlService.templates(), angular.toJson(template), AuthorizedBackendService.getConfig());
  };

  service.updateTemplate = function (id, template) {
    return $http.put(UrlService.getTemplate(id), angular.toJson(template), AuthorizedBackendService.getConfig());
  };

  return service;

};

TemplateService.$inject = ["$http", "UrlService", "AuthorizedBackendService"];
angularApp.service('TemplateService', TemplateService);