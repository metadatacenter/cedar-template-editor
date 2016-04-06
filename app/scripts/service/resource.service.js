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
    'UrlService'
  ];

  function resourceService($http, $timeout, authorizedBackendService, cedar, httpBuilderService, urlService) {

    var service = {
      getResources: getResources
    };
    return service;

    function getResources() {
      var homeDir = cedar.getHome();
      var url = urlService.folders() + '?path=' + homeDir + '&resource_types=field,element,template,instance&limit=50&offset=0';
      authorizedBackendService.doCall(
        httpBuilderService.get(url),
        function(response) {
          debugger;
        },
        function(error) {
          debugger;
        }
      );
    }

  }

});
