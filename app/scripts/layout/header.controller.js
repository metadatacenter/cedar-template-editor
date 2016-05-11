'use strict';

define([
  'angular'
], function(angular) {
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
    vm.searchTerm = null;
    vm.showSearch = showSearch;
    vm.isDashboard = isDashboard;
    vm.getDocumentTitle = getDocumentTitle;

    function goToDashboardOrBack() {
      var params = $location.search();
      var path   = $location.path();
      var url    = '/dashboard';
      if (path != url) {
        if (params.folderId) {
          url += '?folderId=' + encodeURIComponent(params.folderId);
        }
        if (params.search) {
          url += '?search=' + encodeURIComponent(params.search);
        }
      }
      $location.url(url);
    };

    function showSearch() {
      return $rootScope.showSearch;
    };


    function isDashboard() {
      return ($location.path() === "/dashboard");
    };

    function getDocumentTitle() {
      return $rootScope.documentTitle;
    };

    function search(searchTerm) {
      $location.url(UrlService.getSearchPath(searchTerm));
//=======
//    function search() {
//      $rootScope.$broadcast('search', vm.searchTerm || '');
//>>>>>>> feature/good-search-browse-with-modal
    }

  }

});
