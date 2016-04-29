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
    '$translate',
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

  function DashboardController($location, $rootScope, $routeParams, $scope, $translate, AuthorizedBackendService, cedarUser, HeaderService, resourceService, TemplateElementService, TemplateService, TemplateInstanceService, UIMessageService, UrlService, CONST) {
    var vm = this;

    vm.breadcrumbName = breadcrumbName;
    vm.currentWorkspacePath = cedarUser.getHome();
    vm.currentPath = "";
    vm.currentFolderId = "";
    vm.deleteResource = deleteResource;
    vm.doCreateFolder = doCreateFolder;
    vm.doSearch = doSearch;
    vm.editResource = editResource;
    vm.facets = {};
    vm.forms = [];
    vm.formFolderName,
    vm.formFolderDescription,
    vm.getFacets = getFacets;
    vm.getForms = getForms;
    vm.getFolderContents = getFolderContents;
    vm.getFolderContentsById = getFolderContentsById;
    vm.getResourceIconClass = getResourceIconClass;
    vm.goToFolder = goToFolder;
    vm.isResourceSelected = isResourceSelected;
    vm.isResourceTypeActive = isResourceTypeActive;
    vm.isSearching = false;
    vm.launchInstance = launchInstance;
    vm.narrowContent = narrowContent;
    vm.pathInfo = [];
    vm.params = $location.search();
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
    vm.setSortOption = setSortOption;
    vm.showCreateFolder = showCreateFolder;
    vm.showFavorites = true;
    vm.showFilters = false;
    vm.showFloatingMenu = false;
    vm.showResourceInfo = false;
    vm.sortOptionLabel = $translate.instant('DASHBOARD.sort.name');
    vm.toggleFavorites = toggleFavorites;
    vm.toggleFilters = toggleFilters;
    vm.toggleResourceInfo = toggleResourceInfo;
    vm.toggleResourceType = toggleResourceType;

    $rootScope.pageTitle = 'Dashboard';    

    init();

    function init() {
      if (vm.params.folderId || vm.params.search) {
        getForms();
        getFacets();
        if (vm.params.folderId) {
          vm.isSearching = false;
          getFolderContentsById(decodeURIComponent(vm.params.folderId));
        } else {
          doSearch(vm.params.search);
        }
      } else {
        vm.isSearching = false;
        resourceService.getResources(
          { path: cedarUser.getHome() },
          function(response) {
            var currentFolder = response.pathInfo[response.pathInfo.length - 1];
            goToFolder(currentFolder['@id']);
          },
          function(error) {
          }
        );
      }
    }

    /**
     * Scope functions.
     */

    function breadcrumbName(folderName) {
      if (folderName == '/') {
        return 'All';
      }
      return folderName;
    }

    function showCreateFolder() {
      $('#editFolderModal').modal();
    };

    function doCreateFolder() {
      var path = vm.currentWorkspacePath;
      resourceService.createFolder(
        vm.formFolderName,
        path,
        vm.formFolderDescription,
        function(response) {
          $('#editFolderModal').hide();
          vm.formFolderName = null;
          vm.formFolderDescription = null;
          goToFolder(response['@id']);
        },
        function(response) {
          $('#editFolderModal').hide();
          alert('there was an error creating the folder!');
        }
      );
    }

    function doSearch(term) {
      resourceService.searchResources(
        term,
        {},
        function(response) {
          vm.searchTerm = term;
          vm.isSearching = true;
          vm.resources = response.resources;
        },
        function(error) { debugger; }
      );
    }
    
    function launchInstance(resource) {
      var params = $location.search();
      var folderId;
      if (params.folderId) {
        folderId = params.folderId;
      } else {
        folderId = vm.currentFolderId
      }
      var url = UrlService.getInstanceCreate(resource['@id'], folderId);
      $location.url(url);
    }

    /**
     * TODO: return link?
     */
    function editResource(resource) {
      var id = resource['@id'];
      switch (resource.resourceType) {
      case CONST.resourceType.TEMPLATE:
        $location.path(UrlService.getTemplateEdit(id));
        break;
      case CONST.resourceType.ELEMENT:
        $location.path(UrlService.getElementEdit(id));
        break;
      case CONST.resourceType.INSTANCE:
        $location.path(UrlService.getInstanceEdit(id));
        break;
      case CONST.resourceType.LINK:
        $location.path(scope.href);
        break;
      case CONST.resourceType.FOLDER:
        goToFolder(id);
        break;
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

    function getResourceDetails(resource) {
      var id = resource['@id'];
      resourceService.getResource(
        resource,
        function(response) {
          vm.selectedResource = response;
        },
        function(error) {
          alert('there was an error fetching the resource details');
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
            vm.currentFolderId = folderId;
            vm.resources       = response.resources;
            vm.pathInfo        = response.pathInfo;
            vm.currentPath     = vm.pathInfo.pop();
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
            vm.resources       = response.resources;
            vm.pathInfo        = response.pathInfo;
            vm.currentPath     = vm.pathInfo.pop();
            vm.currentFolderId = vm.currentPath['@id'];
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
      switch (resource.resourceType) {
      case CONST.resourceType.FOLDER:
        return "fa-folder-o";
      case CONST.resourceType.TEMPLATE:
        return "fa-file-o";
      case CONST.resourceType.INSTANCE:
        return "fa-clone";
      case CONST.resourceType.FIELD:
        return "fa-file-code-o";
      }
      return "fa-file-text-o";
    }

    function goToFolder(folderId) {
      $location.url(UrlService.getFolderContents(folderId));
    };

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
      getResourceDetails(resource);
      vm.showResourceInfo = true;
    }

    function setSortOption(option) {
      vm.sortOptionLabel = $translate.instant('DASHBOARD.sort.' + option);
    }

    function toggleFavorites() {
      vm.showFavorites = !vm.showFavorites;
      if (vm.showFavorites) {
        angular.element('#favorites').collapse('show');
      } else {
        angular.element('#favorites').collapse('hide');
      }
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

    $scope.$on('$routeUpdate', function(){
      vm.params = $location.search();
      init();
    });

    $scope.$on('search', function(event, data) {
      vm.searchTerm = $('#search').val();
      vm.isSearching = true;
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