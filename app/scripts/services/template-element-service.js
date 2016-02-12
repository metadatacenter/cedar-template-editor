'use strict';

var TemplateElementService = function (HttpBuilderService, UrlService) {

  var service = {
    serviceId: "TemplateElementService"
  };

  service.getDefaultTemplateElementsSummary = function () {
    return HttpBuilderService.get(UrlService.getDefaultTemplateElementsSummary(3, 0));
  };

  service.getAllTemplateElementsSummary = function () {
    return HttpBuilderService.get(UrlService.getAllTemplateElementsSummary());
  };

  service.getTemplateElement = function (id) {
    return HttpBuilderService.get(UrlService.getTemplateElement(id));
  };

  service.deleteTemplateElement = function (id) {
    return HttpBuilderService.delete(UrlService.getTemplateElement(id));
  };

  service.saveTemplateElement = function (element) {
    return HttpBuilderService.post(UrlService.templateElements(), angular.toJson(element));
  };

  service.updateTemplateElement = function (id, element) {
    return HttpBuilderService.put(UrlService.getTemplateElement(id), angular.toJson(element));
  };

  return service;

};

TemplateElementService.$inject = ["HttpBuilderService", "UrlService"];
angularApp.service('TemplateElementService', TemplateElementService);