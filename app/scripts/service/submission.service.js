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

    service.validateInstance = function (instance) {

      return HttpBuilderService.post(UrlService.biosampleValidation(), angular.toJson(instance));
    };

    service.submitInstance = function (instance) {

      return HttpBuilderService.post(UrlService.airrSubmission(), angular.toJson(instance));
    };

    return service;

  };

});
