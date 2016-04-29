'use strict';

define([
  'angular'
], function(angular) {
  angular.module('cedar.templateEditor.layout.headerController', [])
    .controller('HeaderCtrl', HeaderController);

  HeaderController.$inject = [
    '$location',
    'UrlService'
  ];

  function HeaderController($location, UrlService) {
    var vm = this;

    vm.search = search;
    vm.searchTerm = null;

    function search(searchTerm) {
      $location.url(UrlService.getSearchPath(searchTerm));
    }

  }

});
