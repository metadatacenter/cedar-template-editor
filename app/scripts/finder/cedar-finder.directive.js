'use strict';

define([
      'angular',
      'cedar/template-editor/service/cedar-user',
    ], function (angular) {
      angular.module('cedar.templateEditor.finder.cedarFinderDirective', [
        'cedar.templateEditor.service.cedarUser'
      ]).directive('cedarFinder', cedarFinderDirective);

      cedarFinderDirective.$inject = ['CedarUser'];

      function cedarFinderDirective(CedarUser) {

        var directive = {
          bindToController: {
            selectResourceCallback: '=',
            pickResourceCallback  : '=',
            mode                  : '='
          },
          controller      : cedarFinderController,
          controllerAs    : 'finder',
          restrict        : 'E',
          scope           : {},
          templateUrl     : 'scripts/finder/cedar-finder.directive.html'
        };

        return directive;

        cedarFinderController.$inject = [
          '$location',
          '$timeout',
          '$scope',
          '$rootScope',
          '$translate',
          'CedarUser',
          'resourceService',
          'UIMessageService',
          'UISettingsService',
          'AuthorizedBackendService',
          'CONST'
        ];

        function cedarFinderController($location, $timeout, $scope, $rootScope, $translate, CedarUser, resourceService,
                                                   UIMessageService, UISettingsService,
                                                   AuthorizedBackendService,  CONST) {
          var vm = this;

          vm.breadcrumbName = breadcrumbName;
          vm.currentPath = "";
          vm.currentFolderId = "";
          vm.doSearch = doSearch;
          vm.getFolderContentsById = getFolderContentsById;
          vm.getResourceIconClass = getResourceIconClass;
          vm.getResourceTypeClass = getResourceTypeClass;
          vm.goToResource = goToResource;
          vm.goToFolder = goToFolder;
          vm.isResourceTypeActive = isResourceTypeActive;
          vm.isSearching = false;
          vm.pathInfo = [];
          vm.selectedPathInfo = [];
          vm.params = $location.search();
          vm.resources = [];
          vm.selectedResource = null;
          vm.hasSelection = hasSelection;
          vm.getSelection = getSelection;
          vm.setSortOption = setSortOption;
          vm.sortName = sortName;
          vm.sortCreated = sortCreated;
          vm.sortUpdated = sortUpdated;
          vm.sortOptionLabel = $translate.instant('DASHBOARD.sort.name');
          vm.setResourceViewMode = setResourceViewMode;
          vm.isResourceViewMode = isResourceViewMode;
          vm.isTemplate = isTemplate;
          vm.isElement = isElement;
          vm.isFolder = isFolder;
          vm.isMeta = isMeta;
          vm.finderModalId = 'finder-modal';
          vm.search = search;
          vm.openResource = openResource;
          vm.hideFinder = hideFinder;
          vm.hasFolders = hasFolders;
          vm.getFolders = getFolders;
          vm.hasElements = hasElements;
          vm.getElements = getElements;

          vm.selectResource = function (resource) {

            if (vm.selectedResource == null || vm.selectedResource['@id'] != resource['@id']) {
              vm.getResourceDetails(resource);
            }
            if (typeof vm.selectResourceCallback === 'function') {
              vm.selectResourceCallback(resource);
            }
          };

          vm.isResourceSelected = function (resource) {
            if (resource == null || vm.selectedResource == null) {
              return false;
            } else {
              return vm.selectedResource['@id'] == resource['@id'];
            }
          };

          // toggle the info panel with this resource or find one
          vm.toggleInfoPanel = function (resource) {
            if (!vm.showResourceInfo) {
              vm.showInfoPanel(resource);
            } else {
              vm.setResourceInfoVisibility(false);
            }
          };


          vm.getResourceDetails = function (resource) {
            if (!resource && vm.hasSelection()) {
              resource = vm.getSelection();
            }
            var id = resource['@id'];
            resourceService.getResourceDetail(
                resource,
                function (response) {
                  vm.selectedResource = response;

                  // get path info for this resource
                 getPathInfo(response.parentFolderId);

                },
                function (error) {
                  UIMessageService.showBackendError('SERVER.' + resource.nodeType.toUpperCase() + '.load.error', error);
                }
            );
          };


          function getPathInfo(folderId) {
            var resourceTypes = activeResourceTypes();
            if (resourceTypes.length > 0) {
              return resourceService.getResources(
                  {folderId: folderId, resourceTypes: resourceTypes, sort: sortField(), limit: 100, offset: 0},
                  function (response) {
                    //vm.currentFolderId = folderId;
                    //vm.resources = response.resources;
                    vm.selectedPathInfo = response.pathInfo;
                    //vm.selectedPathInfo.pop();
                  },
                  function (error) {
                    UIMessageService.showBackendError('SERVER.FOLDER.load.error', error);
                  }
              );
            } else {
              //vm.resources = [];
            }
          }


          //*********** ENTRY POINT

          setUIPreferences();
          init();

          function setUIPreferences() {
            var uip = CedarUser.getUIPreferences();
            vm.resourceTypes = {
              element : uip.resourceTypeFilters.element,
              field   : uip.resourceTypeFilters.field,
              instance: uip.resourceTypeFilters.instance,
              template: uip.resourceTypeFilters.template
            };
            var option = CedarUser.getUIPreferences().folderView.sortBy;
            setSortOptionUI(option);
            vm.resourceViewMode = uip.folderView.viewMode;
          }

          function init() {
            vm.isSearching = false;
            vm.searchTerm = null;
            if (vm.params.search) {
              vm.isSearching = true;
              doSearch(vm.params.search);
            } else if (vm.params.folderId) {

              getFolderContentsById(decodeURIComponent(vm.params.folderId));
            } else {
              goToFolder(CedarUser.getHomeFolderId());
            }
          }

          function initSearch() {
            if (vm.params.search) {
              vm.isSearching = true;
              doSearch(vm.params.search);
            } else {
              goToFolder(CedarUser.getHomeFolderId());
            }
          }

          function breadcrumbName(folderName) {
            if (folderName == '/') {
              return 'All';
            }
            return folderName;
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
                  UIMessageService.showBackendError('SERVER.SEARCH.error', error);
                }
            );
          }

          function openResource(resource) {
            var r = resource;
            if (!r && vm.selectedResource) {
              r = vm.selectedResource;
            }

            vm.params.search = null;

            if (r.nodeType == 'folder') {
              goToFolder(r['@id']);
            } else {
              if (typeof vm.pickResourceCallback === 'function') {
                vm.pickResourceCallback(r);
              }
              hideFinder();
            }
          }

          function goToResource(resource) {
            var r = resource;
            if (!r && vm.selectedResource) {
              r = vm.selectedResource;
            }

            vm.params.search = null;

            if (r.nodeType == 'folder') {
              goToFolder(r['@id']);
            } else {
              if (typeof vm.pickResourceCallback === 'function') {
                vm.pickResourceCallback(r);
              }
            }
          }

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

          function getResourceIconClass(resource) {
            var result = "";
            if (resource) {
              result += resource.nodeType + " ";

              switch (resource.nodeType) {
                case CONST.resourceType.FOLDER:
                  result += "fa-folder-o";
                  break;
                case CONST.resourceType.TEMPLATE:
                  result += "fa-file-o";
                  break;
                case CONST.resourceType.INSTANCE:
                  result += "fa-tags";
                  break;
                case CONST.resourceType.ELEMENT:
                  result += "fa-file-text-o";
                  break;
                case CONST.resourceType.FIELD:
                  result += "fa-file-code-o";
                  break;
                  result += "fa-file-text-o";
                  break;

              }
            }
            return result;
          }

          function getResourceTypeClass(resource) {
            var result = '';
            if (resource) {
              switch (resource.nodeType) {
                case CONST.resourceType.FOLDER:
                  result += "folder";
                  break;
                case CONST.resourceType.TEMPLATE:
                  result += "template";
                  break;
                case CONST.resourceType.METADATA:
                  result += "metadata";
                  break;
                case CONST.resourceType.INSTANCE:
                  result += "metadata";
                  break;
                case CONST.resourceType.ELEMENT:
                  result += "element";
                  break;
                case CONST.resourceType.FIELD:
                  result += "field";
                  break;
              }

            }
            return result;
          }

          function isTemplate() {
            return (hasSelection() && (vm.selectedResource.nodeType == CONST.resourceType.TEMPLATE));
          }

          function isElement() {
            return (hasSelection() && (vm.selectedResource.nodeType == CONST.resourceType.ELEMENT));
          }

          function isFolder(resource) {
            var result = false;
            if (resource) {
              result = (resource.nodeType == CONST.resourceType.FOLDER);
            } else {
              result = (hasSelection() && (vm.selectedResource.nodeType == CONST.resourceType.FOLDER))
            }
            return result;
          }

          function isMeta() {
            return (hasSelection() && (vm.selectedResource.nodeType == CONST.resourceType.INSTANCE));
          }


          function goToFolder(folderId) {
              vm.params.search = null;
              vm.selectedResource = null;
              vm.params.folderId = folderId;
              init();
          };

          function isResourceTypeActive(type) {
            return vm.resourceTypes[type];
          }


          function setSortOptionUI(option) {
            vm.sortOptionLabel = $translate.instant('DASHBOARD.sort.' + option);
            vm.sortOptionField = option;
          }

          function setSortOption(option) {
            setSortOptionUI(option);
            UISettingsService.saveUIPreference('folderView.sortBy', vm.sortOptionField);
            init();
          }



          /**
           * Watch functions.
           */

          $scope.$on('$routeUpdate', function () {
            vm.params = $location.search();
            init();
          });

          $scope.$on('search-finder', function (event, searchTerm) {
              vm.params.search = searchTerm;
              initSearch();
          });

          $scope.hideModal = function (id) {
            jQuery('#' + id).modal('hide');
          };

          function search  (searchTerm) {
            vm.searchTerm = searchTerm;
            $rootScope.$broadcast('search-finder', vm.searchTerm || '');
          };


          /**
           * Private functions.
           */

          function activeResourceTypes() {
            var activeResourceTypes = [];
            angular.forEach(Object.keys(vm.resourceTypes), function (value, key) {
              if (vm.resourceTypes[value]) {

                  // just elements can be selected
                  if (value == 'element') {
                    activeResourceTypes.push(value);
                  }

              }
            });
            // always want to show folders
            activeResourceTypes.push('folder');
            return activeResourceTypes;
          }

          function resetSelected() {
            vm.selectedResource = null;
          }

          function getSelection() {
            return vm.selectedResource;
          }

          function hasSelection() {
            return vm.selectedResource != null;
          }

          function sortField() {
            if (vm.sortOptionField == 'name') {
              return 'name';
            } else {
              return '-' + vm.sortOptionField;
            }
          }

          function sortName() {
            return (vm.sortOptionField == 'name') ? "" : 'invisible';
          };

          function sortCreated() {
            return (vm.sortOptionField == 'createdOnTS') ? "" : 'invisible';
          };

          function sortUpdated() {
            return (vm.sortOptionField == 'lastUpdatedOnTS') ? "" : 'invisible';
          };

          function setResourceViewMode(mode) {
            vm.resourceViewMode = mode;
            if (mode === 'list' || mode === 'grid') {
              UISettingsService.saveUIPreference('folderView.viewMode', mode);
            }
          }

          function isResourceViewMode(mode) {
            return mode === vm.resourceViewMode;
          }

          function hideFinder () {
            jQuery("#" + vm.finderModalId).modal('hide');
            vm.finderResource = null;
            vm.params.search = null;
            vm.params.folderId = null;
            vm.selectedResource = null;
            init();
          }

          function getFolders() {
            var result = [];

            if (vm.resources) {
              var result = vm.resources.filter(function( obj ) {
                return obj.nodeType == CONST.resourceType.FOLDER;
              });
            }
            return result;
          }

          function hasFolders() {
            return getFolders().length > 0;
          }

          function getElements() {
            var result = [];

            if (vm.resources) {
              var result = vm.resources.filter(function( obj ) {
                return obj.nodeType == CONST.resourceType.ELEMENT;
              });
            }
            return result;
          }

          function hasElements() {
            return getElements().length > 0;
          }

        }
      }

    }
);
