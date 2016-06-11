'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.layout.headerController', [])
      .controller('HeaderCtrl', HeaderController);

  HeaderController.$inject = [
    '$rootScope',
    '$location',
    'UrlService'
  ];

  function HeaderController($rootScope, $location, UrlService) {
    var vm = this;

    vm.goToDashboardOrBack = goToDashboardOrBack;
    vm.search = search;
    vm.searchTerm = $location.search().search;
    vm.showSearch = showSearch;
    vm.isDashboard = isDashboard;
    vm.getDocumentTitle = getDocumentTitle;
    vm.isTemplate = isTemplate;
    vm.isElement = isElement;
    vm.isMetadata = isMetadata;


    function goToDashboardOrBack() {
      vm.searchTerm = null;
      var params = $location.search();
      var path = $location.path();
      var baseUrl = '/dashboard';
      if (path != baseUrl) {
        var queryParams = {};
        if (params.folderId) {
          queryParams['folderId'] = params.folderId;
        }
        if (params.search) {
          queryParams['search'] = params.search;
        }
      }
      var url = $rootScope.util.buildUrl(baseUrl, queryParams);
      $location.url(url);
    }

    function showSearch() {
      return $rootScope.showSearch;
    }

    function isDashboard() {
      return ($location.path() === "/dashboard");
    }

    function isTemplate() {
      console.log('isTemplate' + ($location.path() === "/templates"));
      return ($location.path() === "/templates");
    }

    function isElement() {
      return ($location.path() === "/elements");
    }

    function isMetadata() {
      return ($location.path() === "/instances");
    }

    function getDocumentTitle() {
      return $rootScope.documentTitle;
    }

    function search(searchTerm) {
      if (isDashboard()) {
        $location.url(UrlService.getSearchPath(searchTerm));
      }
      vm.searchTerm = searchTerm;
      $rootScope.$broadcast('search', vm.searchTerm || '');
    }

  }

});
