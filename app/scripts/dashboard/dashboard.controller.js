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
    '$scope',
    '$translate',
    'CedarUser',
    'resourceService',
    'UIMessageService',
    'UrlService',
    'UISettingsService',
    '$timeout',
    'CONST'
  ];

  function DashboardController($location, $rootScope, $scope, $translate, cedarUser, resourceService, UIMessageService,
                               UrlService, UISettingsService, $timeout, CONST) {
    var vm = this;

    $rootScope.showSearch = true;

    vm.breadcrumbName = breadcrumbName;
    vm.cancelCreateEditFolder = cancelCreateEditFolder;
    vm.currentWorkspacePath = cedarUser.getHome();
    vm.currentPath = "";
    vm.currentFolderId = "";
    vm.deleteResource = deleteResource;
    vm.doCreateEditFolder = doCreateEditFolder;
    vm.doSearch = doSearch;
    vm.editResource = editResource;
    vm.facets = {};
    vm.forms = [];
    vm.formFolder = null;
    vm.formFolderName = null;
    vm.formFolderDescription = null;
    vm.getFacets = getFacets;
    vm.getForms = getForms;
    vm.getFolderContents = getFolderContents;
    vm.getFolderContentsById = getFolderContentsById;
    vm.getResourceIconClass = getResourceIconClass;
    vm.goToResource = goToResource;
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
      element : true,
      field   : true,
      instance: true,
      template: true
    };
    vm.resourceView = 'grid';
    vm.selectedResource = null;
    vm.selectResource = selectResource;
    vm.setSortOption = setSortOption;
    vm.showCreateFolder = showCreateFolder;
    vm.showFavorites = cedarUser.getUIPreferences().populateATemplate.opened;
    vm.showFilters = false;
    vm.showFloatingMenu = false;
    vm.showInfoPanel = showInfoPanel;
    vm.showResourceInfo = false;
    vm.sortOptionLabel = $translate.instant('DASHBOARD.sort.name');
    vm.sortOptionField = 'name';
    vm.toggleFavorites = toggleFavorites;
    vm.toggleFilters = toggleFilters;
    vm.toggleResourceInfo = toggleResourceInfo;
    vm.toggleResourceType = toggleResourceType;

    $rootScope.pageTitle = 'Dashboard';

    init();

    function init() {
      if (vm.params.folderId) {
        vm.isSearching = false;
        getFacets();
        getFolderContentsById(decodeURIComponent(vm.params.folderId));
      } else if (vm.params.search) {
        if (vm.showFavorites) {
          vm.showFavorites = false;
          updateFavorites();
        }
        vm.isSearching = true;
        getFacets();
        doSearch(vm.params.search);
      } else {
        vm.isSearching = false;
        resourceService.getResources(
            {path: cedarUser.getHome()},
            function (response) {
              var currentFolder = response.pathInfo[response.pathInfo.length - 1];
              goToFolder(currentFolder['@id']);
            },
            function (error) {
            }
        );
      }
      if (vm.showFavorites) {
        getForms();
      }
      updateFavorites(false);
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

    function cancelCreateEditFolder() {
      vm.formFolderName = 'Untitled';
      vm.formFolderDescription = 'Untitled';
      vm.formFolder = null;
      $('#editFolderModal').modal('hide');
    };

    function showCreateFolder() {
      vm.showFloatingMenu = false;
      vm.formFolderName = 'Untitled';
      vm.formFolderDescription = 'Untitled';
      vm.formFolder = null;
      $('#editFolderModal').modal('show');
      $('#formFolderName').focus();
    };

    function doCreateEditFolder() {
      $('#editFolderModal').modal('hide');
      if (vm.formFolder) {
        vm.formFolder.name = vm.formFolderName;
        vm.formFolder.description = vm.formFolderDescription;
        resourceService.updateFolder(
            vm.formFolder,
            function (response) {
              init();
              UIMessageService.flashSuccess('SERVER.FOLDER.update.success', {"title": vm.formFolderName},
                  'GENERIC.Updated');
            },
            function (error) {
              UIMessageService.showBackendError('SERVER.FOLDER.update.error', error);
            }
        );
        // edit
      } else {
        resourceService.createFolder(
            vm.params.folderId,
            vm.formFolderName,
            vm.formFolderDescription,
            function (response) {
              init();
              UIMessageService.flashSuccess('SERVER.FOLDER.create.success', {"title": vm.formFolderName},
                  'GENERIC.Created');
            },
            function (error) {
              UIMessageService.showBackendError('SERVER.FOLDER.create.error', error);
            }
        );
      }
    }

    function doSearch(term) {
      var resourceTypes = activeResourceTypes();
      resourceService.searchResources(
          term,
          {resourceTypes: resourceTypes, sort: sortField(), limit: 100, offset: 0},
          function (response) {
            vm.searchTerm = term;
            vm.isSearching = true;
            vm.resources = response.resources;
          },
          function (error) {
            debugger;
          }
      );
    }

    function launchInstance(resource) {
      var params = $location.search();
      var folderId, url;

      if (params.folderId) {
        folderId = params.folderId;
        url = UrlService.getInstanceCreate(resource['@id'], folderId);
        $location.url(url);
      } else {
        // in search - look up resource to find its parent
        // place instance next to template
        resourceService.getResourceDetail(
            resource,
            function (response) {
              folderId = response.parentFolderId;
              url = UrlService.getInstanceCreate(resource['@id'], folderId);
              $location.url(url);
            },
            function (error) {
              UIMessageService.showBackendError('SERVER.' + resource.resourceType.toUpperCase() + '.load.error', error);
            }
        );
      }
    }

    function goToResource(resource) {
      if (resource.resourceType == 'folder') {
        goToFolder(resource['@id']);
      } else {
        editResource(resource);
      }
    }

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
          showEditFolder(resource);
          break;
      }
    }

    function showEditFolder(resource) {
      vm.formFolder = resource;
      vm.formFolderName = resource.name;
      vm.formFolderDescription = resource.description
      $('#editFolderModal').modal('show');
      $('#formFolderName').focus();
    }

    function deleteResource(resource) {
      UIMessageService.confirmedExecution(
          function () {
            resourceService.deleteResource(
                resource,
                function (response) {
                  // remove resource from list
                  var index = vm.resources.indexOf(resource);
                  vm.resources.splice(index, 1);
                  resetSelected();
                  UIMessageService.flashSuccess('SERVER.' + resource.resourceType.toUpperCase() + '.delete.success',
                      {"title": resource.resourceType},
                      'GENERIC.Deleted');
                },
                function (error) {
                  UIMessageService.showBackendError('SERVER.' + resource.resourceType.toUpperCase() + '.delete.error',
                      error);
                }
            );
          },
          'GENERIC.AreYouSure',
          'DASHBOARD.delete.confirm.' + resource.resourceType,
          'GENERIC.YesDeleteIt'
      );
    }

    function getFacets() {
      resourceService.getFacets(
          function (response) {
            vm.facets = response.facets;
          },
          function (error) {
          }
      );
    }

    function getForms() {
      return resourceService.searchResources(
          null,
          {resourceTypes: ['template'], sort: '-lastUpdatedOnTS', limit: 4, offset: 0},
          function (response) {
            vm.forms = response.resources;
          },
          function (error) {
          }
      );
    }

    function getResourceDetails(resource) {
      var id = resource['@id'];
      resourceService.getResourceDetail(
          resource,
          function (response) {
            vm.selectedResource = response;
          },
          function (error) {
            UIMessageService.showBackendError('SERVER.' + resource.resourceType.toUpperCase() + '.load.error', error);
          }
      );
    };

    // TODO: merge this with getFolderContents below
    function getFolderContentsById(folderId) {
      var resourceTypes = activeResourceTypes();
      if (resourceTypes.length > 0) {
        return resourceService.getResources(
            {folderId: folderId, resourceTypes: resourceTypes, sort: sortField(), limit: 100, offset: 0},
            function (response) {
              vm.currentFolderId = folderId;
              vm.resources = response.resources;
              vm.pathInfo = response.pathInfo;
              vm.currentPath = vm.pathInfo.pop();
            },
            function (error) {
              UIMessageService.showBackendError('SERVER.FOLDER.load.error', error);
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
            {path: path, resourceTypes: resourceTypes, sort: sortField(), limit: 100, offset: 0},
            function (response) {
              vm.resources = response.resources;
              vm.pathInfo = response.pathInfo;
              vm.currentPath = vm.pathInfo.pop();
              vm.currentFolderId = vm.currentPath['@id'];
            },
            function (error) {
              UIMessageService.showBackendError('SERVER.FOLDER.load.error', error);
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
          return "fa-check-square-o";
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
    }

    function showInfoPanel(resource) {
      selectResource(resource);
      vm.showResourceInfo = true;
      vm.showFavorites = false;
      updateFavorites();
    }

    function setSortOption(option) {
      vm.sortOptionLabel = $translate.instant('DASHBOARD.sort.' + option);
      vm.sortOptionField = option;
      init();
    }

    function toggleFavorites() {
      vm.showFavorites = !vm.showFavorites;
      updateFavorites();
    }

    function toggleFilters() {
      vm.showFilters = !vm.showFilters;
    }

    function toggleResourceInfo() {
      vm.showResourceInfo = !vm.showResourceInfo;
    }

    function toggleResourceType(type) {
      vm.resourceTypes[type] = !vm.resourceTypes[type];
      init();
    }

    /**
     * Watch functions.
     */

    $scope.$on('$routeUpdate', function () {
      vm.params = $location.search();
      init();
    });

    $scope.$on('search', function (event, data) {
      console.log("DashboardController on: search");
      vm.searchTerm = $('#search').val();
      vm.isSearching = true;
      vm.resources = data.resources;
    });

    /**
     * Private functions.
     */

    function activeResourceTypes() {
      var activeResourceTypes = [];
      angular.forEach(Object.keys(vm.resourceTypes), function (value, key) {
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

    function sortField() {
      if (vm.sortOptionField == 'name') {
        return 'name';
      } else {
        return '-' + vm.sortOptionField;
      }
    }

    function updateFavorites(saveData) {
      $timeout(function () {
        if (vm.showFavorites) {
          angular.element('#favorites').collapse('show');
          getForms();
        } else {
          angular.element('#favorites').collapse('hide');
        }
      });
      if (saveData == null || saveData) {
        UISettingsService.saveUIPreference('populateATemplate.opened', vm.showFavorites);
      }
    }

  };

});