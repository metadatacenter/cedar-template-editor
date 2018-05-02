'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.service.templateFieldService', [])
      .service('TemplateFieldService', TemplateFieldService);

  TemplateFieldService.$inject = ['HttpBuilderService', 'UrlService'];

  function TemplateFieldService(HttpBuilderService, UrlService) {

    var service = {
      serviceId: "TemplateFieldService"
    };

    service.getTemplateField = function (id) {
      return HttpBuilderService.get(UrlService.getTemplateField(id));
    };

    service.deleteTemplateField = function (id) {
      return HttpBuilderService.delete(UrlService.getTemplateField(id));
    };

    service.saveTemplateField = function (folderId, field) {
      return HttpBuilderService.post(UrlService.postTemplateField(folderId), angular.toJson(field));
    };

    service.updateTemplateField = function (id, field) {
      return HttpBuilderService.put(UrlService.getTemplateField(id), angular.toJson(field));
    };

    return service;

  }

});
