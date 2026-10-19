'use strict';

define([
  'angular', 'cedar/template-editor/core/json-source-policy'
], function (angular, sourceJson) {
  angular.module('cedar.templateEditor.service.templateService', [])
      .service('TemplateService', TemplateService);

  TemplateService.$inject = ['HttpBuilderService', 'UrlService'];

  function TemplateService(HttpBuilderService, UrlService) {

    var service = {
      serviceId: 'TemplateService'
    };

    service.getTemplate = function (id) {
      return HttpBuilderService.get(UrlService.getTemplate(id));
    };

    service.deleteTemplate = function (id) {
      return HttpBuilderService.delete(UrlService.getTemplate(id));
    };

    service.saveTemplate = function (folderId, template) {
      return HttpBuilderService.post(UrlService.postTemplate(folderId), sourceJson.stringify(template));
    };

    service.updateTemplate = function (id, template, validatorArtifact) {
      return HttpBuilderService.put(UrlService.getTemplate(id), sourceJson.stringify(template), validatorArtifact || template);
    };

    service.checkUpdateTemplate = function (id, template) {
      return HttpBuilderService.post(UrlService.checkUpdateTemplate(id), sourceJson.stringify(template));
    };

    service.publishCreateDraftTemplate = function (id, template, newFolderName, sourceEtag) {
      var request = HttpBuilderService.post(UrlService.publishCreateDraftTemplate(id, newFolderName), sourceJson.stringify(template));
      request.headers = {'If-Match': sourceEtag || template.$$cedarEtag};
      return request;
    };

    return service;

  }

});
