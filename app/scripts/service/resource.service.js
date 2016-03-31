'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.service.resourceService', [])
    .service('resourceService', resourceService);

  resourceService.$inject = ['$http', '$timeout', 'Cedar', 'UrlService'];

  function resourceService($http, $timeout, cedar, urlService) {

    var service = {
      getResources: getResources
    };
    return service;

    function getResources() {
      debugger;
      var url = urlService.folders() + '?path=' + cedar.getHome();
    }

  }

});
