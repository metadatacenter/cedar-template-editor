'use strict';

var TemplateInstanceService = function (HttpBuilderService, UrlService) {

  var service = {
    serviceId: "TemplateInstanceService"
  };

  service.getDefaultTemplateInstancesSummary = function () {
    return HttpBuilderService.get(UrlService.getDefaultTemplateInstancesSummary(10, 0));
  };

  service.getAllTemplateInstancesSummary = function () {
    return HttpBuilderService.get(UrlService.getAllTemplateInstancesSummary());
  };

  service.getTemplateInstance = function (id) {
    return HttpBuilderService.get(UrlService.getTemplateInstance(id));
  };

  service.deleteTemplateInstance = function (id) {
    return HttpBuilderService.delete(UrlService.getTemplateInstance(id));
  };

  service.saveTemplateInstance = function (instance) {
    return HttpBuilderService.post(UrlService.templateInstances(), angular.toJson(instance));
  };

  service.updateTemplateInstance = function (id, instance) {
    return HttpBuilderService.put(UrlService.getTemplateInstance(id), angular.toJson(instance));
  };

  return service;

};

TemplateInstanceService.$inject = ["HttpBuilderService", "UrlService"];
angularApp.service('TemplateInstanceService', TemplateInstanceService);