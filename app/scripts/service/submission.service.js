'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.service.submissionService', [])
      .service('SubmissionService', SubmissionService);

  SubmissionService.$inject = ['HttpBuilderService', 'UrlService'];

  function SubmissionService(HttpBuilderService, UrlService) {

    var service = {
      serviceId: 'SubmissionService'
    };

    service.validateBiosample = function (instance) {

      return HttpBuilderService.post(UrlService.biosampleValidation(), angular.toJson(instance));
    };

    service.validateAirr = function (instance) {

      return HttpBuilderService.post(UrlService.airrValidation(), angular.toJson(instance));
    };

    return service;

  };

});
