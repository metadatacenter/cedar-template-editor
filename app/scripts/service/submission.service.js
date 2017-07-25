'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.service.submissionService', [])
      .service('SubmissionService', SubmissionService);

  SubmissionService.$inject = ['$rootScope', 'HttpBuilderService', 'UrlService', 'AuthorizedBackendService'];

  function SubmissionService($rootScope, HttpBuilderService, UrlService, AuthorizedBackendService) {

    var service = {
      serviceId: 'SubmissionService'
    };

    service.validateBiosample = function (instance) {

      return HttpBuilderService.post(UrlService.biosampleValidation(), angular.toJson(instance));
    };

    service.validateAirr = function (instance) {

      return HttpBuilderService.post(UrlService.airrValidation(), angular.toJson(instance));
    };


    service.getWorkspaces = function (successCallback, errorCallback) {

      var params = {};
      var baseUrl = UrlService.immportWorkspaces();
      var url = $rootScope.util.buildUrl(baseUrl, params);


      // return AuthorizedBackendService.doCall(HttpBuilderService.post(url)).then(function (response) {
      //   return successCallback(response);
      // }).catch(function (err) {
      //   return errorCallback(err);
      // });

      return AuthorizedBackendService.doCall(
          HttpBuilderService.get(url),
          function (response) {
            successCallback(response.data);
          },
          errorCallback
      );
    };

    return service;

  };

});
