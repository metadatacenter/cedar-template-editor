'use strict';

define([
  'angular'
], function(angular) {
  angular.module('cedar.templateEditor.layout.headerController', [])
    .controller('HeaderCtrl', HeaderController);

  HeaderController.$inject = [
    '$rootScope',
    'resourceService',
  ];

  function HeaderController($rootScope, resourceService) {
    var vm = this;

    vm.search = search;
    vm.searchTerm = null;

    function search(searchTerm) {
      resourceService.searchResources(
        searchTerm,
        {},
        function(response) {
          $rootScope.$broadcast('search', response);
        },
        function(error) { debugger; }
      );
    }
  }

});
