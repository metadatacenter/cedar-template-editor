'use strict';

define([
  'angular'
], function(angular) {
  angular.module('cedar.templateEditor.layout.headerController', [])
    .controller('HeaderCtrl', HeaderController);

  HeaderController.$inject = [
    '$rootScope',
    'UrlService'
  ];

  function HeaderController($rootScope, UrlService) {
    var vm = this;

    vm.search = search;
    vm.searchTerm = null;
    vm.showSearch = showSearch;

    function showSearch() {
      return $rootScope.showSearch;
    };

    function search() {
      $rootScope.$broadcast('search', vm.searchTerm || '');
    }

  }

});
