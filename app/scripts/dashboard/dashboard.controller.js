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
    'CedarUser',
    'HeaderService',
    'resourceService',
    'TemplateElementService',
    'TemplateService',
    'TemplateInstanceService',
    'UIMessageService',
    'UrlService',
    'CONST'
  ];

  function DashboardController($location, $rootScope, $routeParams, $scope, AuthorizedBackendService, cedarUser, HeaderService, resourceService, TemplateElementService, TemplateService, TemplateInstanceService, UIMessageService, UrlService, CONST) {
    var vm = this;

    vm.createFolder = createFolder;
    vm.currentWorkspacePath = cedarUser.getHome();
    vm.currentPath = "";
    vm.deleteResource = deleteResource;
    vm.editResource = editResource;
    vm.facets = {};
    vm.forms = [];
    vm.getFacets = getFacets;
    vm.getForms = getForms;
    vm.getFolderContents = getFolderContents;
    vm.getFolderContentsById = getFolderContentsById;
    vm.getResourceIconClass = getResourceIconClass;
    vm.isResourceSelected = isResourceSelected;
    vm.isResourceTypeActive = isResourceTypeActive;
    vm.narrowContent = narrowContent;
    vm.pathInfo = [];
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
    getFolderContents(vm.currentWorkspacePath);

    /**
     * Scope functions.
     */

    function createFolder() {
      var name = prompt('Please enter a folder name');
      var description = prompt('Please enter a folder description');
      var path = vm.currentWorkspacePath;
      resourceService.createFolder(
        name,
        path,
        description,
        function(response) {
          getFolderContents(path);
        },
        function(response) {
          alert('there was an error creating the folder!');
        }
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
      case CONST.resourceType.FOLDER:
        // TODO: update url
        getFolderContentsById(resource['@id']);
      }
    }

    function deleteResource(resource) {
      switch (resource.resourceType) {
      case CONST.resourceType.FOLDER:
        resourceService.deleteFolder(
          resource['@id'],
          function(response) {
            // remove resource from list
            var index = vm.resources.indexOf(resource);
            vm.resources.splice(index, 1);
          },
          function(error) {
            alert('There was an error deleting the folder');
          }
        );
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

    function getFolderDetails(folderId) {
      return resourceService.getFolder(
        folderId,
        {},
        function(response) {
          vm.selectedResource = response;
        },
        function(error) {
          alert('there was an error fetching the folder details');
        }
      );
    };

    // TODO: merge this with getFolderContents below
    function getFolderContentsById(folderId) {
      var resourceTypes = activeResourceTypes();
      if (resourceTypes.length > 0) {
        return resourceService.getResources(
          { folderId: folderId, resourceTypes: resourceTypes, sort: '-createdOn', limit: 10, offset: 0 },
          function(response) {
            vm.resources   = response.resources;
            vm.pathInfo    = response.pathInfo;
            vm.currentPath = vm.pathInfo.pop();
          },
          function(error) {
            alert('there was an error fetching the folder contents');
          }
        );
      } else {
        vm.resources = [];
      }
    }

    // TODO: merge this with getFolderContentsById above
    function getFolderContents(path) {
      var resourceTypes = activeResourceTypes();
      if (resourceTypes.length > 0) {
        return resourceService.getResources(
          { path: path, resourceTypes: resourceTypes, sort: '-createdOn', limit: 10, offset: 0 },
          function(response) {
            vm.resources   = response.resources;
            vm.pathInfo    = response.pathInfo;
            vm.currentPath = vm.pathInfo.pop();
          },
          function(error) {
            alert('there was an error fetching the folder contents');
          }
        );
      } else {
        vm.resources = [];
      }
    }

    function getResourceIconClass(resource) {
      if (resource.resourceType == 'folder') {
        return "fa-folder-o";
      } else {
        return "fa-file-text-o";
      }
    }

    function isResourceTypeActive(type) {
      return vm.resourceTypes[type];
    }

    function isResourceSelected(resource) {
      if (resource == null || vm.selectedResource == null) {
        return false;
      } else {
        return vm.selectedResource['@id'] == resource['@id'];
      }
    }

    function narrowContent() {
      return vm.showFilters || vm.showResourceInfo;
    }

    function selectResource(resource) {
      vm.selectedResource = resource;
      getFolderDetails(resource['@id']);
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
      // TODO: should be cedarUser.getCurrentFolderId()
      getFolderContents(vm.currentWorkspacePath);
    }

    /**
     * Watch functions.
     */

    $scope.$on('search', function(event, data) {
      vm.resources = data.resources;
    });

    $scope.$watch(
      function(scope) {
        return vm.showFilters || vm.showResourceInfo;
      },
      function(newVal, oldVal) {
        if (newVal) {
          angular.element('#favorites').collapse('hide');
        } else {
          angular.element('#favorites').collapse('show');
        }
      }
    );

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
      // always want to show folders
      activeResourceTypes.push('folder');
      return activeResourceTypes;
    }

    function resetSelected() {
      vm.selectedResource = null;
      vm.showResourceInfo = false;
    };

  };

});