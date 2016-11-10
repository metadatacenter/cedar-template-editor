'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.service.biosampleService', [])
      .service('BiosampleService', BiosampleService);

  BiosampleService.$inject = ['HttpBuilderService', 'UrlService'];

  function BiosampleService(HttpBuilderService, UrlService) {

    var service = {
      serviceId: 'BiosampleService'
    };

    service.validateInstance = function (instance) {

      return HttpBuilderService.post(UrlService.biosampleValidation(), angular.toJson(instance));
    };

    return service;

  };

});
