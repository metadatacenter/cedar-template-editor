'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.service.templateService', [])
      .service('TemplateService', TemplateService);

  TemplateService.$inject = ['HttpBuilderService', 'UrlService', 'CedarUser'];

  function TemplateService(HttpBuilderService, UrlService, CedarUser) {

    var service = {
      serviceId: 'TemplateService'
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

    service.saveTemplate = function (folderId, template) {
      return HttpBuilderService.post(UrlService.postTemplate(folderId), angular.toJson(template));
    };

    service.updateTemplate = function (id, template) {
      return HttpBuilderService.put(UrlService.getTemplate(id), angular.toJson(template));
    };

    return service;

  };

});
