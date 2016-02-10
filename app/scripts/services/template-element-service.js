'use strict';

var TemplateElementService = function ($http, UrlService, AuthorizedBackendService) {

  var service = {
    serviceId: "TemplateElementService"
  };

  service.getDefaultTemplateElementsSummary = function () {
    return $http.get(UrlService.getDefaultTemplateElementsSummary(3, 0), AuthorizedBackendService.getConfig());
  };

  service.getAllTemplateElementsSummary = function () {
    return $http.get(UrlService.getAllTemplateElementsSummary(), AuthorizedBackendService.getConfig());
  };

  service.getTemplateElement = function (id) {
    return $http.get(UrlService.getTemplateElement(id), AuthorizedBackendService.getConfig());
  };

  service.deleteTemplateElement = function (id) {
    return $http.delete(UrlService.getTemplateElement(id), AuthorizedBackendService.getConfig());
  };

  service.saveTemplateElement = function (element) {
    return $http.post(UrlService.templateElements(), angular.toJson(element), AuthorizedBackendService.getConfig());
  };

  service.updateTemplateElement = function (id, element) {
    return $http.put(UrlService.getTemplateElement(id), angular.toJson(element), AuthorizedBackendService.getConfig());
  };

  return service;

};

TemplateElementService.$inject = ["$http", "UrlService", "AuthorizedBackendService"];
angularApp.service('TemplateElementService', TemplateElementService);