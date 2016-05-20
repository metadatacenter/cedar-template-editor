'use strict';

define([
  'angular',
  'lib/angular-ui-tree/dist/angular-ui-tree'
], function (angular) {
  angular.module('cedar.templateEditor.dashboard.dashboardController', [])
      .controller('DashboardController', DashboardController);

  DashboardController.$inject = [
    '$location',
    '$rootScope',
    '$translate'
  ];

  function DashboardController($location, $rootScope, $translate) {
    var vm = this;

    $rootScope.showSearch = true;

    vm.currentPath = "";
    vm.currentFolderId = "";
    vm.facets = {};
    vm.forms = [];
    vm.formFolder = null;
    vm.formFolderName = null;
    vm.formFolderDescription = null;
    vm.isSearching = false;
    vm.pathInfo = [];
    vm.params = $location.search();
    vm.resources = [];
    vm.resourceTypes = {
      element : true,
      field   : true,
      instance: true,
      template: true
    };
    vm.resourceView = 'grid';
    vm.selectedResource = null;
    vm.showFilters = false;
    vm.showFloatingMenu = false;
    vm.showResourceInfo = false;
    vm.sortOptionLabel = $translate.instant('DASHBOARD.sort.name');
    vm.sortOptionField = 'name';

    $rootScope.pageTitle = 'Dashboard';


  };

});