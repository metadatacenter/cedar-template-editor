'use strict';

define([
      'angular',
      'cedar/template-editor/service/cedar-user'
    ], function (angular) {
      angular.module('cedar.templateEditor.modal.cedarFinderDirective', [
        'cedar.templateEditor.service.cedarUser'
      ]).directive('cedarFinder', cedarFinderDirective);

      cedarFinderDirective.$inject = ['CedarUser'];

      function cedarFinderDirective(CedarUser) {

        var directive = {
          bindToController: {
            modalVisible          : '=',
            selectResourceCallback: '=',
            pickResourceCallback  : '='
          },
          controller      : cedarFinderController,
          controllerAs    : 'finder',
          restrict        : 'E',
          templateUrl     : 'scripts/modal/cedar-finder.directive.html'
        };

        return directive;

        cedarFinderController.$inject = [
          '$location',
          '$scope',
          '$rootScope',
          '$translate',
          'CedarUser',
          'resourceService',
          'UIMessageService',
          'UISettingsService',
          'QueryParamUtilsService',
          'CONST'
        ];

        function cedarFinderController($location, $scope, $rootScope, $translate, CedarUser, resourceService,
                                       UIMessageService, UISettingsService,
                                       QueryParamUtilsService, CONST) {

          var vm = this;
          vm.id = 'finder-modal';

          vm.currentPath = "";
          vm.currentFolderId = "";
          vm.offset = 0;
          vm.totalCount = null;

          vm.isSearching = false;
          vm.pathInfo = [];
          vm.selectedPathInfo = [];

          vm.params = {};
          vm.params.folderId = QueryParamUtilsService.getFolderId();
          vm.params.search = $location.search().search;

          vm.resources = [];
          vm.selectedResource = null;


          /*
           * public functions
           */

          vm.breadcrumbName = breadcrumbName;
          vm.hasSelection = hasSelection;
          vm.getSelection = getSelection;
          vm.doSearch = doSearch;

          vm.getResourceIconClass = getResourceIconClass;
          vm.getResourceTypeClass = getResourceTypeClass;
          vm.canBeVersioned = canBeVersioned;
          vm.goToResource = goToResource;
          vm.goToFolder = goToFolder;
          vm.isResourceTypeActive = isResourceTypeActive;

          vm.setSortByName = setSortByName;
          vm.setSortByCreated = setSortByCreated;
          vm.setSortByUpdated = setSortByUpdated;
          vm.sortName = sortName;
          vm.sortCreated = sortCreated;
          vm.sortUpdated = sortUpdated;

          vm.isGridView = isGridView;
          vm.isListView = isListView;
          vm.toggleView = toggleView;

          vm.isTemplate = isTemplate;
          vm.isElement = isElement;
          vm.isFolder = isFolder;
          vm.isMeta = isMeta;

          vm.search = search;
          vm.openResource = openResource;

          vm.hasFolders = hasFolders;
          vm.getFolders = getFolders;
          vm.hasElementsOrFields = hasElementsOrFields;
          vm.getElementsAndFields = getElementsAndFields;

          vm.selectResource = selectResource;
          vm.isResourceSelected = isResourceSelected;
          vm.getResourceDetails = getResourceDetails;
          vm.loadMore = loadMore;
          vm.searchMore = searchMore;

          //*********** ENTRY POINT

          getPreferences();
          init();


          function getPreferences() {
            var uip = CedarUser.getUIPreferences();
            vm.resourceTypes = {
              element : uip.resourceTypeFilters.element,
              field   : uip.resourceTypeFilters.field,
              instance: uip.resourceTypeFilters.instance,
              template: uip.resourceTypeFilters.template
            };


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
              vm.isSearching = false;
              if (vm.params.folderId) {
                goToFolder(vm.params.folderId);
              } else {
                goToFolder(CedarUser.getHomeFolderId());
              }
            }
          }

          function breadcrumbName(folderName) {
            if (folderName == '/') {
              return 'All';
            }
            return folderName;
          }

          function getPathInfo(folderId) {
            var resourceTypes = activeResourceTypes();
            var limit = UISettingsService.getRequestLimit();
            vm.offset = 0;
            var offset = vm.offset;

            if (resourceTypes.length > 0) {
              return resourceService.getResources(
                  {folderId: folderId, resourceTypes: resourceTypes, sort: sortField(), limit: limit, offset: offset},
                  function (response) {
                    //vm.currentFolderId = folderId;
                    //vm.resources = response.resources;
                    vm.selectedPathInfo = response.pathInfo;
                    vm.totalCount = response.totalCount;
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

          function doSearch(term) {
            var resourceTypes = activeResourceTypes();
            var limit = UISettingsService.getRequestLimit();
            vm.offset = 0;
            var offset = vm.offset;
            resourceService.searchResources(
                term,
                {resourceTypes: resourceTypes, sort: sortField(), limit: limit, offset: offset},
                function (response) {
                  vm.searchTerm = term;
                  vm.isSearching = true;
                  vm.resources = response.resources;
                  vm.selectedResource = null;
                  vm.totalCount = response.totalCount;
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

              $scope.hideModal(vm.id);
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
            vm.offset = 0;
            var offset = vm.offset;
            var limit = UISettingsService.getRequestLimit();

            if (resourceTypes.length > 0) {
              return resourceService.getResources(
                  {folderId: folderId, resourceTypes: resourceTypes, sort: sortField(), limit: limit, offset: offset},
                  function (response) {
                    vm.currentFolderId = folderId;
                    vm.resources = response.resources;
                    vm.pathInfo = response.pathInfo;
                    vm.currentPath = vm.pathInfo.pop();
                    vm.totalCount = response.totalCount;
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
            var result = '';
            if (resource) {

              switch (resource.nodeType) {
                case CONST.resourceType.FOLDER:
                  result += "fa-folder";
                  break;
                case CONST.resourceType.TEMPLATE:
                  result += " fa-file-text";
                  break;
                case CONST.resourceType.INSTANCE:
                  result += "fa-tag";
                  break;
                case CONST.resourceType.ELEMENT:
                  result += "fa-cubes";
                  break;
                case CONST.resourceType.FIELD:
                  result += "fa-cube";
                  break;
              }
              result += ' ' + resource.nodeType;
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

          function canBeVersioned(resource) {
            if (resource) {
              switch (resource.nodeType) {
                case CONST.resourceType.TEMPLATE:
                  return true;
                case CONST.resourceType.ELEMENT:
                  return true;
              }
            }
            return false;
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

            if (vm.params.folderId) {
              getFolderContentsById(decodeURIComponent(vm.params.folderId));
            }
          }

          function isResourceTypeActive(type) {
            return vm.resourceTypes[type];
          }

          function selectResource(resource) {

            if (vm.selectedResource == null || vm.selectedResource['@id'] != resource['@id']) {
              vm.getResourceDetails(resource);
            }
            if (typeof vm.selectResourceCallback === 'function') {
              vm.selectResourceCallback(resource);
            }
          };

          function isResourceSelected(resource) {
            if (resource == null || vm.selectedResource == null) {
              return false;
            } else {
              return vm.selectedResource['@id'] == resource['@id'];
            }
          };

          function getResourceDetails(resource) {
            if (!resource && vm.hasSelection()) {
              resource = vm.getSelection();
            }
            var id = resource['@id'];
            console.log('getResourceDetails',resource);
            resourceService.getResourceDetail(
                resource,
                function (response) {
                  vm.selectedResource = response;

                  // TODO get path info for this resource
                  //getPathInfo(response.parentFolderId);

                },
                function (error) {
                  UIMessageService.showBackendError('SERVER.' + resource.nodeType.toUpperCase() + '.load.error', error);
                }
            );
          };

          // callback to load more resources for the current folder or search
          function loadMore() {

            if (vm.isSearching) {
              vm.searchMore();
            } else {

              var limit = UISettingsService.getRequestLimit();
              vm.offset += limit;
              var offset = vm.offset;
              var folderId = vm.currentFolderId;
              var resourceTypes = activeResourceTypes();

              // are there more?
              if (offset < vm.totalCount) {

                if (resourceTypes.length > 0) {
                  return resourceService.getResources(
                      {
                        folderId     : folderId,
                        resourceTypes: resourceTypes,
                        sort         : sortField(),
                        limit        : limit,
                        offset       : offset
                      },
                      function (response) {
                        vm.resources = vm.resources.concat(response.resources);
                      },
                      function (error) {
                        UIMessageService.showBackendError('SERVER.FOLDER.load.error', error);
                      }
                  );
                } else {
                  vm.resources = [];
                }
              }
            }
          };

          // callback to load more resources for the current folder
          function searchMore() {

            var limit = UISettingsService.getRequestLimit();
            //vm.offset += limit;
            var offset = vm.offset;
            offset += limit;
            var term = vm.searchTerm;
            var resourceTypes = activeResourceTypes();

            // Temporary fix to load more results if the totalCount can't be computed by the backend
            if (vm.totalCount == -1) {
              // Search for more results
              vm.totalCount = Number.MAX_VALUE;
            }
            else if (vm.totalCount == 0) {
              // No more results available. Stop searching
              vm.totalCount = -2;
            }

            // are there more?
            if (offset < vm.totalCount) {
              return resourceService.searchResources(term,
                  {
                    resourceTypes: resourceTypes,
                    sort         : sortField(),
                    limit        : limit,
                    offset       : offset
                  },
                  function (response) {
                    vm.resources = vm.resources.concat(response.resources);
                    vm.totalCount = response.totalCount;
                    vm.offset = offset;
                  },
                  function (error) {
                    UIMessageService.showBackendError('SERVER.SEARCH.error', error);
                  }
              );
            }
          };


          /**
           * Watch functions.
           */


          $scope.$on('search-finder', function (event, searchTerm) {
            vm.params.search = searchTerm;
            initSearch();
          });

          $scope.hideModal = function (id) {
            jQuery('#' + id).modal('hide');
          };

          function search(searchTerm) {
            vm.searchTerm = searchTerm;
            $rootScope.$broadcast('search-finder', vm.searchTerm || '');
          };

          // modal open
          $scope.$on('finderModalVisible', function (event, params) {
            vm.modalVisible = true;
            vm.finderResource = null;
            vm.params.search = null;
            vm.params.folderId = null;
            vm.selectedResource = null;
          });


          /**
           * Private functions.
           */

          function activeResourceTypes() {
            var activeResourceTypes = [];
            angular.forEach(Object.keys(vm.resourceTypes), function (value, key) {
              if (vm.resourceTypes[value]) {

                // just elements adn field can be selected
                if (value == 'element' ||value == 'field') {
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
            var result = '';
            if (CedarUser.isSortByName()) {
              result += '-';
            }
            return result += CedarUser.getSort();
          }

          function setSortByCreated() {
            UISettingsService.saveSort(CedarUser.setSortByCreated());
            init();
          }

          function setSortByName() {
            UISettingsService.saveSort(CedarUser.setSortByName());
            init();
          }

          function setSortByUpdated() {
            UISettingsService.saveSort(CedarUser.setSortByUpdated());
            init();
          }

          function sortName() {
            return CedarUser.isSortByName() ? "" : 'invisible';
          }

          function sortCreated() {
            return CedarUser.isSortByCreated() ? "" : 'invisible';
          }

          function sortUpdated() {
            return CedarUser.isSortByUpdated() ? "" : 'invisible';
          }

          function isGridView() {
            return CedarUser.isGridView();
          }

          function isListView() {
            return CedarUser.isListView();
          }

          function toggleView() {
            UISettingsService.saveView(CedarUser.toggleView());
          }

          function getFolders() {
            var result = [];

            if (vm.resources) {
              var result = vm.resources.filter(function (obj) {
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
              var result = vm.resources.filter(function (obj) {
                return obj.nodeType == CONST.resourceType.ELEMENT;
              });
            }
            return result;
          }

          function hasElementsOrFields() {
            return getElements().length > 0;
          }

          function getElementsAndFields() {
            var result = [];

            if (vm.resources) {
              var result = vm.resources.filter(function (obj) {
                return obj.nodeType == CONST.resourceType.FIELD || obj.nodeType == CONST.resourceType.ELEMENT;
              });
            }
            return result;
          }

          function hasFields() {
            return getFields().length > 0;
          }

        }
      }

    }
);
