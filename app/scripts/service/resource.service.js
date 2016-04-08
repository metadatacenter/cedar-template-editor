'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.service.resourceService', [])
    .service('resourceService', resourceService);

  resourceService.$inject = [
    '$http',
    '$timeout',
    'AuthorizedBackendService',
    'Cedar',
    'HttpBuilderService',
    'UISettingsService',
    'UrlService'
  ];

  function resourceService($http, $timeout, authorizedBackendService, cedar, httpBuilderService, uiSettingsService, urlService) {

    var service = {
      getResources: getResources
    };
    return service;

    function getResources(options = {}, successCallback, errorCallback) {
      var homeDir = cedar.getHome();
      var resourceTypes = options.resourceTypes || uiSettingsService.getResourceTypeFilters().map(function(obj) { return obj.resourceType });
      var url = urlService.folders() + '?path=' + homeDir + '&resource_types=' + resourceTypes.join(',');
      if (options.sort) {
        url += '&sort=' + options.sort;
      }
      if (options.limit) {
        url += '&limit=' + options.limit;
      }
      if (options.offset) {
        url += '&offset=' + options.offset;
      }

      authorizedBackendService.doCall(
        httpBuilderService.get(url),
        function(response) {
          successCallback(response.data);
        },
        errorCallback
      );
    }

  }

});
