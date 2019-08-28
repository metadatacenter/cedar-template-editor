'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.service.categoryService', [])
      .service('CategoryService', CategoryService);

  CategoryService.$inject = ["$window", "$rootScope", "$sce", "DataManipulationService", 'schemaService', "DataUtilService",
    "AuthorizedBackendService", "HttpBuilderService", "UrlService", "$translate", "CONST"];

  function CategoryService($window, $rootScope, $sce, DataManipulationService, schemaService, DataUtilService,
                           AuthorizedBackendService, HttpBuilderService, UrlService, $translate, CONST) {

    var service = {
      serviceId: "CategoryService",
    };

    var categoryTree = null;

    service.initCategories = function (successCallback, errorCallback) {
      if (categoryTree == null) {
        service.readCategories(successCallback, errorCallback);
      }
    };

    service.readCategories = function (successCallback, errorCallback) {
      AuthorizedBackendService.doCall(
          HttpBuilderService.get(UrlService.getCategoryTree()),
          function (response) {
            successCallback(response.data)
          },
          function (err) {
            errorCallback(err);
          }
      );
    };

    service.getCategories = function () {
      return categoryTree;
    };

    return service;
  }

});
