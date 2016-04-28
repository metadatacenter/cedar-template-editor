'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.service.templateInstanceService', [])
      .service('TemplateInstanceService', TemplateInstanceService);

  TemplateInstanceService.$inject = ['HttpBuilderService', 'UrlService', 'CedarUser'];

  function TemplateInstanceService(HttpBuilderService, UrlService, CedarUser) {

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

    service.saveTemplateInstance = function (folderId, instance) {
      return HttpBuilderService.post(UrlService.postTemplateInstance(folderId), angular.toJson(instance));
    };

    service.updateTemplateInstance = function (id, instance) {
      return HttpBuilderService.put(UrlService.getTemplateInstance(id), angular.toJson(instance));
    };

    return service;

  };

});
