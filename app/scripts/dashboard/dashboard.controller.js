'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.dashboard.dashboardController', [])
      .controller('DashboardController', DashboardController);

  DashboardController.$inject = [
    '$location',
    '$rootScope',
    '$routeParams',
    '$scope',
    'AuthorizedBackendService',
    'HeaderService',
    'resourceService',
    'TemplateElementService',
    'TemplateService',
    'TemplateInstanceService',
    'UIMessageService',
    'UrlService',
    'CONST'
  ];

  function DashboardController($location, $rootScope, $routeParams, $scope, AuthorizedBackendService, HeaderService, resourceService, TemplateElementService, TemplateService, TemplateInstanceService, UIMessageService, UrlService, CONST) {
    var vm = this;

    vm.forms = [];
    vm.getForms = getForms;
    vm.getWorkspace = getWorkspace;
    vm.isResourceTypeActive = isResourceTypeActive;
    vm.resources = [];
    vm.resourceTypes = {
      element: true,
      field: true,
      instance: true,
      template: true
    };
    vm.selectedResource = null;
    vm.selectResource = selectResource;
    vm.showFilters = false;
    vm.toggleFilters = toggleFilters;
    vm.toggleResourceType = toggleResourceType;

    $rootScope.pageTitle = 'Dashboard';    

    getForms();
    getWorkspace();

    /**
     * Scope functions.
     */

    function getForms() {
      return resourceService.getResources(
        { resourceTypes: ['template'], sort: '-createdOn' },
        function(response) {
          vm.forms = response.resources;
        },
        function(error) { }
      );
    }

    function getWorkspace() {
      var resourceTypes = activeResourceTypes();
      if (resourceTypes.length > 0) {
        return resourceService.getResources(
          { resourceTypes: resourceTypes, sort: '-createdOn' },
          function(response) {
            vm.resources = response.resources;
          },
          function(error) { }
        );
      } else {
        vm.resources = [];
      }
    }

    function isResourceTypeActive(type) {
      return vm.resourceTypes[type];
    }

    function selectResource(resource) {
      vm.selectedResource = resource;
    }

    function toggleFilters() {
      vm.showFilters = !vm.showFilters;
    }

    function toggleResourceType(type) {
      vm.resourceTypes[type] = !vm.resourceTypes[type];
      getWorkspace();
    }

    /**
     * Private functions.
     */

    function activeResourceTypes() {
      var activeResourceTypes = [];
      angular.forEach(Object.keys(vm.resourceTypes), function(value, key) {
        if (vm.resourceTypes[value]) {
          activeResourceTypes.push(value);
        }
      });
      return activeResourceTypes;
    }

  };

});