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

    vm.editResource = editResource;
    vm.forms = [];
    vm.getForms = getForms;
    vm.getWorkspace = getWorkspace;
    vm.isResourceTypeActive = isResourceTypeActive;
    vm.narrowContent = narrowContent;
    vm.resources = [];
    vm.resourceTypes = {
      element: true,
      field: true,
      instance: true,
      template: true
    };
    vm.resourceView = 'grid';
    vm.selectedResource = null;
    vm.selectResource = selectResource;
    vm.showFilters = false;
    vm.showFloatingMenu = false;
    vm.toggleFilters = toggleFilters;
    vm.toggleResourceType = toggleResourceType;

    $rootScope.pageTitle = 'Dashboard';    

    getForms();
    getWorkspace();

    /**
     * Scope functions.
     */

    /**
     * TODO: return link?
     */
    function editResource(resource) {
      switch (resource.resourceType) {
        case CONST.resourceType.TEMPLATE:
          $location.path(UrlService.getTemplateEdit(resource.id));
          break;
        case CONST.resourceType.ELEMENT:
          $location.path(UrlService.getElementEdit(resource.id));
          break;
        case CONST.resourceType.INSTANCE:
          $location.path(UrlService.getInstanceEdit(resource.id));
          break;
        case CONST.resourceType.LINK:
          $location.path(scope.href);
          break;
      }
    }

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

    function narrowContent() {
      return vm.showFilters || vm.selectedResource;
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
     * Watch functions.
     */

    $scope.$on('search', function(event, data) {
      vm.resources = data.resources;
    });

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