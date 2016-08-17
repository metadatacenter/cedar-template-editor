'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.layout.headerController', [])
      .controller('HeaderCtrl', HeaderController);

  HeaderController.$inject = [
    '$rootScope',
    '$location',
    '$window',
    'UrlService'
  ];

  function HeaderController($rootScope, $location, $window, UrlService) {

    var vm = this;

    vm.goToDashboardOrBack = function () {
      vm.searchTerm = null;
      var params = $location.search();
      var path = $location.path();
      var baseUrl = '/dashboard';
      if (path != baseUrl) {
        var queryParams = {};
        if (params.folderId) {
          queryParams['folderId'] = params.folderId;
        }
        /*if (params.search) {
          queryParams['search'] = params.search;
        }*/
      }
      var url = $rootScope.util.buildUrl(baseUrl, queryParams);
      $location.url(url);
      $window.scrollTo(0, 0);

    };

    vm.search = function (searchTerm) {
      if (vm.isDashboard()) {
        var params = $location.search();
        var baseUrl = '/dashboard';
        var queryParams = {};
        if (params.folderId) {
          queryParams['folderId'] = params.folderId;
        }
        queryParams['search'] = searchTerm;
        var url = $rootScope.util.buildUrl(baseUrl, queryParams);
        $location.url(url);
      }
      vm.searchTerm = searchTerm;
      $rootScope.$broadcast('search', vm.searchTerm || '');
    };

    vm.showSearch = function () {
      return $rootScope.showSearch;
    };

    vm.isDashboard = function () {
      return ($location.path() === "/dashboard");
    };

    vm.getDocumentTitle = function () {
      return $rootScope.documentTitle;
    };

    vm.getPageTitle = function () {
      return $rootScope.pageTitle;
    };

    vm.isTemplate = function () {
      //console.log('isTemplate' + ($location.path() === "/templates"));
      return ($location.path() === "/templates");
    };

    vm.isElement = function () {
      return ($location.path() === "/elements");
    };

    vm.isMetadata = function () {
      return ($location.path() === "/instances");
    };

    //*********** ENTRY POINT

    vm.searchTerm = $location.search().search;

  }

});
