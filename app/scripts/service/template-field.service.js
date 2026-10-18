'use strict';

define([
  'angular', 'cedar/template-editor/core/json-source-policy'
], function (angular, sourceJson) {
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
      return HttpBuilderService.post(UrlService.postTemplateField(folderId), sourceJson.stringify(field));
    };

    service.updateTemplateField = function (id, field, validatorArtifact) {
      return HttpBuilderService.put(UrlService.getTemplateField(id), sourceJson.stringify(field), validatorArtifact || field);
    };

    return service;

  }

});
