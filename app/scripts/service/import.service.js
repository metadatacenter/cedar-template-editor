'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.service.importService', [])
      .service('ImportService', ImportService);

  ImportService.$inject = ['HttpBuilderService', 'UrlService'];

  function ImportService(HttpBuilderService, UrlService) {

    let service = {
      serviceId: 'ImportService'
    };

    service.getImportStatus = function (uploadId) {
      return HttpBuilderService.get(UrlService.importCadsrFormsStatus(uploadId));
    };

    return service;

  }

});
