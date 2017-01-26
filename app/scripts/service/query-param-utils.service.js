'use strict';

define([
  'angular',
], function (angular) {
  angular.module('cedar.templateEditor.service.queryParamUtilsService', [])
      .service('QueryParamUtilsService', QueryParamUtilsService);

  QueryParamUtilsService.$inject = ['$location'];

  function QueryParamUtilsService($location) {

    var service = {
      serviceId: "QueryParamUtilsService"
    };

    service.init = function () {
      // Code to initialize service
    };

    service.getFolderId = function () {
      return service.getQueryParameter("folderId");
    }

    service.getQueryParameter = function(parameterName) {
      var params = $location.search();
      return params[parameterName];
    }

    return service;
  };

});
