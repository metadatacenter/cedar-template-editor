'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.service.templateInstanceService', [])
      .service('TemplateInstanceService', TemplateInstanceService);

  TemplateInstanceService.$inject = ['HttpBuilderService', 'UrlService'];

  function TemplateInstanceService(HttpBuilderService, UrlService) {

    var service = {
      serviceId: "TemplateInstanceService"
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

  }

});
