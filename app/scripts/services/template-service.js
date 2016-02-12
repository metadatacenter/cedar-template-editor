'use strict';

var TemplateService = function (HttpBuilderService, UrlService) {

  var service = {
    serviceId: "TemplateService"
  };

  service.getDefaultTemplatesSummary = function () {
    return HttpBuilderService.get(UrlService.getDefaultTemplatesSummary(3, 0));
  };

  service.getAllTemplatesSummary = function () {
    return HttpBuilderService.get(UrlService.getAllTemplatesSummary());
  };

  service.getTemplate = function (id) {
    return HttpBuilderService.get(UrlService.getTemplate(id));
  };

  service.deleteTemplate = function (id) {
    return HttpBuilderService.delete(UrlService.getTemplate(id));
  };

  service.saveTemplate = function (template) {
    return HttpBuilderService.post(UrlService.templates(), angular.toJson(template));
  };

  service.updateTemplate = function (id, template) {
    return HttpBuilderService.put(UrlService.getTemplate(id), angular.toJson(template));
  };

  return service;

};

TemplateService.$inject = ["HttpBuilderService", "UrlService"];
angularApp.service('TemplateService', TemplateService);