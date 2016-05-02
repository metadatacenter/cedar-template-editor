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

    vm.search = search;
    vm.searchTerm = null;
    vm.showSearch = showSearch;

    function showSearch() {
      return $rootScope.showSearch;
    };

    function search(searchTerm) {
      $location.url(UrlService.getSearchPath(searchTerm));
    }

  }

});
