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
    '$routeParams',
    '$scope',
    'AuthorizedBackendService',
    'Cedar',
    'HeaderService',
    'resourceService',
    'TemplateElementService',
    'TemplateService',
    'TemplateInstanceService',
    'UIMessageService',
    'UrlService',
    'CONST'
  ];

  function DashboardController($location, $rootScope, $routeParams, $scope, AuthorizedBackendService, cedar, HeaderService, resourceService, TemplateElementService, TemplateService, TemplateInstanceService, UIMessageService, UrlService, CONST) {
    var vm = this;

    vm.createFolder = createFolder;
    vm.currentWorkspacePath = cedar.getHome();
    vm.editResource = editResource;
    vm.facets = {};
    vm.forms = [];
    vm.getFacets = getFacets;
    vm.getForms = getForms;
    vm.getWorkspace = getWorkspace;
    vm.isResourceSelected = isResourceSelected;
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
    vm.showResourceInfo = false;
    vm.toggleFilters = toggleFilters;
    vm.toggleResourceInfo = toggleResourceInfo;
    vm.toggleResourceType = toggleResourceType;

    $rootScope.pageTitle = 'Dashboard';    

    getFacets();
    getForms();
    getWorkspace();

    /**
     * Scope functions.
     */

    function createFolder() {
      var name = prompt("Please enter a folder name");
      var path = vm.currentWorkspacePath;
      resourceService.createFolder(
        name,
        path,
        function(response) {
          debugger;
        },
        function(response) { }
      );
    }

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

    function getFacets() {
      resourceService.getFacets(
        function(response) {
          vm.facets = response.facets;
        },
        function(error) { }
      );
    }

    function getForms() {
      return resourceService.searchResources(
        null,
        { resourceTypes: ['template'], sort: 'dateModified' },
        function(response) {
          vm.forms = response.resources;
        },
        function(error) { }
      );
    }

    function getWorkspace() {
      var path = vm.currentWorkspacePath;
      var resourceTypes = activeResourceTypes();
      if (resourceTypes.length > 0) {
        return resourceService.getResources(
          path,
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

    function isResourceSelected(resource) {
      return angular.equals(vm.selectedResource, resource);
    }

    function narrowContent() {
      return vm.showFilters || vm.selectedResource;
    }

    function selectResource(resource) {
      vm.selectedResource = resource;
      vm.showResourceInfo = true;
    }

    function toggleFilters() {
      vm.showFilters = !vm.showFilters;
    }

    function toggleResourceInfo() {
      vm.showResourceInfo = !vm.showResourceInfo;
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