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
          'DataManipulationService',
          'QueryParamUtilsService',
          'FrontendUrlService',
          'CategoryService',
          'schemaService',
          'CONST',
          '$sce'
        ];

        function cedarFinderController($location, $timeout, $scope, $rootScope, $translate, CedarUser, resourceService,
                                       UIMessageService, UISettingsService, DataManipulationService,
                                       QueryParamUtilsService, FrontendUrlService, CategoryService, schemaService, CONST,
                                       $sce) {

          let vm = this;
          vm.id = 'finder-modal';
          vm.currentPath = "";
          vm.pathInfo = [];
          vm.selectedPathInfo = [];

          vm.offset = 0;
          vm.totalCount = -1;
          vm.requestLimit = UISettingsService.getRequestLimit();

          vm.currentFolderId = "";
          vm.resources = [];
          vm.selectedResource = null;
          vm.breadcrumbTitle = null;

          vm.params = {};
          vm.params.folderId = QueryParamUtilsService.getFolderId();
          vm.params.search = $location.search().search;

          vm.isSearching = false;
          vm.isLoadingMore = false;

          vm.categoryId = null;
          vm.categoryTreeAvailable = false;
          vm.categoryTreeEnabled = true;
          vm.categoryTree = null;
          vm.loadingCategoryTree = false;

          vm.selectedResources = []; //resource list to be added to template

          /*
           * Public function declarations
           */

          vm.isHomeMode = isHomeMode;
          vm.isSharedWithMeMode = isSharedWithMeMode;
          vm.isSharedWithEverybodyMode = isSharedWithEverybodyMode;
          vm.isSpecialFoldersMode = isSpecialFoldersMode;
          vm.isSearchMode = isSearchMode;
          vm.isCategorySearchMode = isCategorySearchMode;

          vm.loadMore = loadMore;
          vm.searchMore = searchMore;

          vm.openResource = openResource;
          vm.getResourceIconClass = getResourceIconClass;
          vm.getResourceTypeClass = getResourceTypeClass;
          vm.canBeVersioned = canBeVersioned;
          vm.isFolder = isFolder;
          vm.goToFolder = goToFolder;
          vm.isResourceTypeActive = isResourceTypeActive;
          vm.selectResource = selectResource;
          vm.isResourceSelected = isResourceSelected;
          vm.getResourceDetails = getResourceDetails;
          vm.canRead = canRead;
          vm.canWrite = canWrite;
          vm.canChangeOwner = canChangeOwner;
          vm.isPublished = isPublished;
          vm.getResourceVersion = getResourceVersion;
          vm.getTitle = getTitle;
          vm.linkFolder = linkFolder;
          vm.resourceListIsLoading = resourceListIsLoading;
          vm.resourceListIsLoadingMore = resourceListIsLoadingMore;
          vm.resourceListIsEmpty = resourceListIsEmpty;
          vm.getVisibleCount = getVisibleCount;
          vm.getSelection = getSelection;
          vm.hasSelection = hasSelection;
          vm.search = search;
          vm.getFolders = getFolders;
          vm.hasFolders = hasFolders;
          vm.hasElementsOrFields = hasElementsOrFields;
          vm.getElementsAndFields = getElementsAndFields;
          vm.getId = getId;
          vm.isOverflow = isOverflow;

          vm.setSortByCreated = setSortByCreated;
          vm.setSortByName = setSortByName;
          vm.setSortByUpdated = setSortByUpdated;
          vm.sortName = sortName;
          vm.sortCreated = sortCreated;
          vm.sortUpdated = sortUpdated;

          vm.goToMyWorkspace = goToMyWorkspace;
          vm.goToSharedWithMe = goToSharedWithMe;
          vm.goToSharedWithEverybody = goToSharedWithEverybody;
          vm.goToSpecialFolders = goToSpecialFolders;

          vm.getSelectedCategories = getSelectedCategories;
          vm.categorySearch = categorySearch;

          vm.breadcrumbName = breadcrumbName;
          vm.buildBreadcrumbTitle = buildBreadcrumbTitle;

          vm.getTrustedBy = getTrustedBy;
          vm.addToSelectedResources = addToSelectedResources;
          vm.removeFromSelectedResources = removeFromSelectedResources;
          vm.reset = reset;

          //------

          init();
          initCategories();

          /**
           * Private functions
           */

          function init() {
            vm.resourceTypes = {
              element : true,
              field   : true,
              instance: false,
              template: false
            };

            vm.searchTerm = null;

            if (isSearchMode()) {
              vm.isSearching = true;
              doSearch(vm.params.search);
            } else if (isCategorySearchMode()) {
              vm.isSearching = true;
              doCategorySearch(vm.categoryId);
            } else if (isSharedWithMeMode()) {
              vm.isSearching = true;
              doSharedWithMe();
            } else if (isSharedWithEverybodyMode()) {
              vm.isSearching = true;
              doSharedWithEverybody();
            } else if (isSpecialFoldersMode()) {
              vm.isSearching = true;
              doSpecialFolders();
            } else if (vm.params.folderId) {
              vm.isSearching = false;
              getFolderContentsById(decodeURIComponent(vm.params.folderId));
            } else {
              vm.isSearching = false;
              goToFolder(CedarUser.getHomeFolderId());
            }
          };

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
          };

          function initCategories() {
            if (!doShowCategoryTree()) {
              return;
            }
            CategoryService.initCategories(
                function (response) {
                  vm.categoryTreeAvailable = true;
                  vm.categoryTree = response;
                },
                function (error) {
                  UIMessageService.showBackendError('CATEGORYSERVICE.errorReadingCategoryTree', error);
                });
          };

          function doShowCategoryTree() {
            return vm.categoryTreeEnabled;
          };

          function activeResourceTypes() {
            let activeResourceTypes = ['element', 'field', 'folder'];
            return activeResourceTypes;
          };

          function sortField(searchParams) {
            if (searchParams && searchParams.fromSearchBox) {
              return null;
            }
            else {
              return (CedarUser.isSortByName() ? '' : '-') + CedarUser.getSort();
            }
          }

          function getFilterVersion() {
            return CedarUser.getVersion();
          };

          function getFilterStatus() {
            return CedarUser.getStatus();
          };

          function doSearch(term) {
            let resourceTypes = activeResourceTypes();
            let limit = vm.requestLimit;
            vm.offset = 0;
            vm.nextOffset = null;

            resourceService.searchResources(
                term,
                {
                  resourceTypes    : resourceTypes,
                  sort             : sortField(vm.params),
                  limit            : limit,
                  offset           : vm.offset,
                  version          : getFilterVersion(),
                  publicationStatus: getFilterStatus()
                },
                function (response) {
                  vm.searchTerm = term;
                  vm.isSearching = true;
                  vm.resources = response.resources;
                  vm.nextOffset = getNextOffset(response.paging.next);
                  vm.nodeListQueryType = response.nodeListQueryType;
                  vm.breadcrumbTitle = vm.buildBreadcrumbTitle(term);
                  vm.selectedResource = null;
                  vm.totalCount = response.totalCount;
                },
                function (error) {
                  UIMessageService.showBackendError('SERVER.SEARCH.error', error);
                }
            );
          };

          function doCategorySearch(categoryId) {
            vm.selectedResource = null;
            vm.totalCount = -1;
            vm.offset = 0;
            vm.nextOffset = null;
            vm.loading = true;

            resourceService.categorySearchResources(
                categoryId,
                {
                  resourceTypes    : activeResourceTypes(),
                  sort             : sortField(),
                  limit            : vm.requestLimit,
                  offset           : vm.offset,
                  version          : getFilterVersion(),
                  publicationStatus: getFilterStatus()
                },
                function (response) {
                  vm.categoryId = categoryId;
                  vm.isSearching = true;
                  vm.resources = response.resources;
                  vm.nextOffset = getNextOffset(response.paging.next);
                  vm.totalCount = response.totalCount;
                  vm.loading = false;

                  vm.nodeListQueryType = response.nodeListQueryType;
                  let title = '';
                  let separator = '';
                  for (let ti in response.categoryPath) {
                    if (ti > 0) {
                      let name = response.categoryPath[ti]['schema:name']
                      title += separator + name;
                      separator = ' &raquo; ';
                    }
                  }
                  vm.breadcrumbTitle = $sce.trustAsHtml(vm.buildBreadcrumbTitle(title));
                },
                function (error) {
                  UIMessageService.showBackendError('SERVER.CATEGORYSEARCH.error', error);
                  vm.loading = false;
                }
            );
          };

          function doSharedWithMe() {

            vm.totalCount = -1;
            vm.offset = 0;
            vm.nextOffset = null;

            resourceService.sharedWithMeResources(
                {
                  resourceTypes    : activeResourceTypes(),
                  sort             : sortField(),
                  limit            : vm.requestLimit,
                  offset           : vm.offset,
                  version          : getFilterVersion(),
                  publicationStatus: getFilterStatus()
                },
                function (response) {
                  vm.isSearching = true;
                  vm.resources = response.resources;
                  vm.nodeListQueryType = response.nodeListQueryType;
                  vm.breadcrumbTitle = vm.buildBreadcrumbTitle();
                  vm.nextOffset = getNextOffset(response.paging.next);
                  vm.totalCount = response.totalCount;
                  vm.loading = false;

                },
                function (error) {
                  UIMessageService.showBackendError('SERVER.SEARCH.error', error);
                }
            );
          };

          function doSharedWithEverybody() {

            vm.totalCount = -1;
            vm.offset = 0;
            vm.nextOffset = null;

            resourceService.sharedWithEverybodyResources(
                {
                  resourceTypes    : activeResourceTypes(),
                  sort             : sortField(),
                  limit            : vm.requestLimit,
                  offset           : 0,
                  version          : getFilterVersion(),
                  publicationStatus: getFilterStatus()
                },
                function (response) {
                  vm.isSearching = true;
                  vm.resources = response.resources;
                  vm.nodeListQueryType = response.nodeListQueryType;
                  vm.breadcrumbTitle = vm.buildBreadcrumbTitle();
                  vm.nextOffset = getNextOffset(response.paging.next);
                  vm.totalCount = response.totalCount;
                  vm.loading = false;
                },
                function (error) {
                  UIMessageService.showBackendError('SERVER.SEARCH.error', error);
                }
            );
          };

          function doSpecialFolders() {

            vm.totalCount = -1;
            vm.offset = 0;
            vm.nextOffset = null;

            resourceService.specialFolders(
                {
                  resourceTypes    : activeResourceTypes(),
                  sort             : sortField(),
                  limit            : vm.requestLimit,
                  offset           : vm.offset,
                  version          : getFilterVersion(),
                  publicationStatus: getFilterStatus()
                },
                function (response) {
                  vm.isSearching = true;
                  vm.resources = response.resources;
                  vm.nodeListQueryType = response.nodeListQueryType;
                  vm.breadcrumbTitle = vm.buildBreadcrumbTitle();
                  vm.nextOffset = getNextOffset(response.paging.next);
                  vm.totalCount = response.totalCount;
                  vm.loading = false;

                },
                function (error) {
                  UIMessageService.showBackendError('SERVER.SEARCH.error', error);
                }
            );
          }

          function getNextOffset(next) {
            let result = null;
            if (next) {
              result = [];
              next.split("&").forEach(function (part) {
                let item = part.split("=");
                result[item[0]] = decodeURIComponent(item[1]);
              });
              result = parseInt(result['offset']);
            }
            return result;
          };

          function getFolderContentsById(folderId) {
            let resourceTypes = activeResourceTypes();
            let limit = UISettingsService.getRequestLimit();
            vm.offset = 0;
            vm.nextOffset = null;

            if (resourceTypes.length > 0) {
              return resourceService.getResources(
                  {
                    folderId         : folderId,
                    resourceTypes    : resourceTypes,
                    sort             : sortField(),
                    limit            : limit,
                    offset           : vm.offset,
                    version          : getFilterVersion(),
                    publicationStatus: getFilterStatus()
                  },
                  function (response) {
                    vm.isSearching = false;
                    vm.currentFolderId = folderId;
                    vm.resources = response.resources;
                    vm.nextOffset = getNextOffset(response.paging.next);
                    vm.nodeListQueryType = response.nodeListQueryType;
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
          };

          /*
          * Public functions
          */

          function isHomeMode() {
            return (vm.nodeListQueryType === 'folder-content');
          };

          function isSharedWithMeMode() {
            return (vm.nodeListQueryType === 'view-shared-with-me');
          };

          function isSharedWithEverybodyMode() {
            return (vm.nodeListQueryType === 'view-shared-with-everybody');
          };

          function isSpecialFoldersMode() {
            return (vm.nodeListQueryType === 'view-special-folders');
          };

          function isFolderContentMode() {
            return (vm.nodeListQueryType == 'folder-content');
          };

          function isSearchMode() {
            return (vm.nodeListQueryType === 'search-term');
          };

          function isCategorySearchMode() {
            return (vm.nodeListQueryType == 'search-category-id');
          };

          // Callback to load more resources for the current folder or search
          function loadMore() {
            if (vm.isSearching) {
              vm.searchMore();
            } else {
              let limit = vm.requestLimit;
              vm.offset += limit;
              let offset = vm.offset;
              let folderId = vm.currentFolderId;
              let resourceTypes = activeResourceTypes();

              // Are there more?
              if (offset < vm.totalCount) {
                if (resourceTypes.length > 0) {
                  vm.isLoadingMore = true;
                  return resourceService.getResources(
                      {
                        folderId         : folderId,
                        resourceTypes    : resourceTypes,
                        sort             : sortField(),
                        limit            : limit,
                        offset           : offset,
                        version          : getFilterVersion(),
                        publicationStatus: getFilterStatus()
                      },
                      function (response) {
                        vm.resources = vm.resources.concat(response.resources);
                        vm.isLoadingMore = false;
                      },
                      function (error) {
                        UIMessageService.showBackendError('SERVER.FOLDER.load.error', error);
                        vm.isLoadingMore = false;
                      }
                  );
                } else {
                  vm.resources = [];
                }
              }
            }
          };

          function searchMore() {
            if (activeResourceTypes().length > 0) {
              // Are there more?
              if (vm.nextOffset && !vm.isLoadingMore) {
                vm.offset = vm.nextOffset;
                vm.isLoadingMore = true;
                if (vm.nodeListQueryType == 'search-category-id') {
                  return resourceService.categorySearchResources(
                      vm.categoryId,
                      {
                        resourceTypes    : activeResourceTypes(),
                        sort             : sortField(),
                        limit            : vm.requestLimit,
                        offset           : vm.offset,
                        version          : getFilterVersion(),
                        publicationStatus: getFilterStatus()
                      },
                      function (response) {
                        vm.isSearching = true;
                        for (let i = 0; i < response.resources.length; i++) {
                          vm.resources[i + vm.offset] = response.resources[i];
                        }
                        vm.nextOffset = getNextOffset(response.paging.next);
                        vm.totalCount = response.totalCount;
                        vm.isLoadingMore = false;

                        vm.nodeListQueryType = response.nodeListQueryType;
                        var title = '';
                        var separator = '';
                        for (var ti in response.categoryPath) {
                          if (ti > 0) {
                            var name = response.categoryPath[ti]['schema:name']
                            title += separator + name;
                            separator = ' &raquo; ';
                          }
                        }
                      },
                      function (error) {
                        UIMessageService.showBackendError('SERVER.CATEGORYSEARCH.error', error);
                        vm.isLoadingMore = false;
                      }
                  );
                } else {
                  return resourceService.searchResources(vm.searchTerm,
                      {
                        resourceTypes: activeResourceTypes(),
                        sort         : sortField(vm.params),
                        limit        : vm.requestLimit,
                        offset       : vm.offset
                      },
                      function (response) {

                        for (let i = 0; i < response.resources.length; i++) {
                          vm.resources[i + vm.offset] = response.resources[i];
                        }
                        vm.totalCount = response.totalCount;
                        vm.nextOffset = getNextOffset(response.paging.next);
                        vm.isLoadingMore = false;
                      },
                      function (error) {
                        UIMessageService.showBackendError('SERVER.SEARCH.error', error);
                        vm.isLoadingMore = false;
                      }
                  );
                }
              }
            }
          };

          function openResource (resource) {
            let r = resource;
            if (!r && vm.selectedResource) {
              r = vm.selectedResource;
            }
            vm.params.search = null;
            if (r.resourceType == 'folder') {
              goToFolder(r['@id']);
            } else {
              const _resource = vm.selectedResources.shift();
              if (typeof vm.pickResourceCallback === 'function') {
                  vm.pickResourceCallback(_resource);
              }
              $scope.hideModal(vm.id);
            }
          };

          function getResourceIconClass(resource) {
            let result = '';
            if (resource) {

              switch (resource.resourceType) {
                case CONST.resourceType.FOLDER:
                  result += "fa-folder";
                  break;
                case CONST.resourceType.ELEMENT:
                  result += "fa-cubes";
                  break;
                case CONST.resourceType.FIELD:
                  result += "fa-cube";
                  break;
              }
              result += ' ' + resource.resourceType;
            }
            return result;
          };

          function getResourceTypeClass(resource) {
            let result = '';
            if (resource) {
              switch (resource.resourceType) {
                case CONST.resourceType.FOLDER:
                  result += "folder";
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
              switch (resource.resourceType) {
                case CONST.resourceType.TEMPLATE:
                  return true;
                case CONST.resourceType.ELEMENT:
                  return true;
              }
            }
            return false;
          }

          function isFolder(resource) {
            let result;
            if (resource) {
              result = (resource.resourceType == CONST.resourceType.FOLDER);
            } else {
              result = (hasSelection() && (vm.selectedResource.resourceType == CONST.resourceType.FOLDER))
            }
            return result;
          };

          function goToFolder(folderId) {
            vm.isSearching = false;
            vm.params.search = null;
            vm.selectedResource = null;
            vm.params.folderId = folderId;

            if (vm.params.folderId) {
              getFolderContentsById(decodeURIComponent(vm.params.folderId));
            }
          };

          function isResourceTypeActive(type) {
            console.log('Is active', type, vm.resourceTypes[type]);
            return vm.resourceTypes[type];
          };

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

          function addToSelectedResources(resource) {
            if (!resource['@id'])
              return;

            vm.selectedResources.push(resource);
          };

          function removeFromSelectedResources(index, resource) {
            const _toBeRemoved =  vm.selectedResources[index];
            if(resource['@id'] !== _toBeRemoved['@id'])
              return

            vm.selectedResources.splice(index, 1);
          }

          function getResourceDetails(resource) {
            if (!resource && vm.hasSelection()) {
              resource = vm.getSelection();
            }
            resourceService.getResourceReport(
                resource,
                function (response) {
                  vm.selectedResource = response;
                },
                function (error) {
                  UIMessageService.showBackendError('SERVER.' + resource.resourceType.toUpperCase() + '.load.error',
                      error);
                }
            );
          };

          function canRead() {
            return resourceService.canRead(vm.selectedResource);
          };

          function canWrite() {
            return resourceService.canWrite(vm.selectedResource);
          };

          function canChangeOwner() {
            return resourceService.canChangeOwner(vm.selectedResource);
          };

          function isPublished(resource) {
            let r = resource || vm.selectedResource;
            return (r[CONST.publication.STATUS] == CONST.publication.PUBLISHED);
          };

          function getResourceVersion(resource) {
            let r = resource || vm.selectedResource;
            let resourceId = schemaService.getId(r);
            if (r.versions) {
              for (let i = 0; i < r.versions.length; i++) {
                if (resourceId === r.versions[i]['@id']) {
                  return r.versions[i]['pav:version'];
                }
              }
            }
          };

          function getTitle(node) {
            if (node) {
              return DataManipulationService.getTitle(node);
            }
          };

          function linkFolder(node) {
            return node['activeUserCanRead']
          };

          function resourceListIsLoading() {
            return vm.totalCount == -1;
          };

          function resourceListIsLoadingMore() {
            return vm.isLoadingMore;
          };

          function resourceListIsEmpty() {
            return vm.totalCount === 0;
          };

          function getVisibleCount() {
            return Math.min(vm.offset + vm.requestLimit, vm.totalCount);
          };

          function getSelection() {
            return vm.selectedResource;
          };

          function hasSelection() {
            return vm.selectedResource != null;
          };

          $scope.hideModal = function (id) {
            jQuery('#' + id).modal('hide');
          };

          function search(searchTerm) {
            vm.params.fromSearchBox = true;
            vm.searchTerm = searchTerm;
            $rootScope.$broadcast('search-finder', vm.searchTerm || '');
          };

          function getFolders() {
            let result = [];
            if (vm.resources) {
              result = vm.resources.filter(function (obj) {
                return obj.resourceType == CONST.resourceType.FOLDER;
              });
            }
            return result;
          };

          function hasFolders() {
            return getFolders().length > 0;
          }

          function hasElementsOrFields() {
            return getElementsAndFields().length > 0;
          }

          function getElementsAndFields() {
            let result = [];

            if (vm.resources) {
              result = vm.resources.filter(function (obj) {
                return obj.resourceType == CONST.resourceType.FIELD || obj.resourceType == CONST.resourceType.ELEMENT;
              });
            }
            return result;
          };

          function getId(node, label) {
            if (node) {
              let id = schemaService.getId(node);
              return id.substr(id.lastIndexOf('/') + 1) + label;
            }
          };

          function isOverflow(node, label) {
            let id = '#' + vm.getId(node, label);
            let elm = jQuery(id);
            return (elm[0].offsetWidth < elm[0].scrollWidth);
          };

          /** Sort by... **/

          function setSortByCreated() {
            delete vm.params.fromSearchBox;
            UISettingsService.saveSort(CedarUser.setSortByCreated());
            init();
          };

          function setSortByName() {
            delete vm.params.fromSearchBox;
            UISettingsService.saveSort(CedarUser.setSortByName());
            init();
          };

          function setSortByUpdated() {
            delete vm.params.fromSearchBox;
            UISettingsService.saveSort(CedarUser.setSortByUpdated());
            init();
          };

          function sortName() {
            if (vm.params.fromSearchBox || !CedarUser.isSortByName()) {
              return 'invisible';
            }
            else {
              return "";
            }
          }

          function sortCreated() {
            if (vm.params.fromSearchBox || !CedarUser.isSortByCreated()) {
              return 'invisible';
            }
            else {
              return "";
            }
          }

          function sortUpdated() {
            if (vm.params.fromSearchBox || !CedarUser.isSortByUpdated()) {
              return 'invisible';
            }
            else {
              return "";
            }
          }

          /** Shortcut functions **/

          function goToMyWorkspace() {
            goToFolder(CedarUser.getHomeFolderId());
          }

          function goToSharedWithMe() {
            vm.selectedResource = null;
            doSharedWithMe();
          };

          function goToSharedWithEverybody() {
            vm.selectedResource = null;
            doSharedWithEverybody();
          };

          function goToSpecialFolders() {
            vm.selectedResource = null;
            doSpecialFolders();
          };

          function getSelectedCategories() {
            return vm.selectedResource.categories;
          };

          function categorySearch(categoryId) {
            doCategorySearch(categoryId);
          };

          function breadcrumbName(folderName) {
            if (folderName == '/') {
              return 'All';
            }
            return folderName;
          };

          function buildBreadcrumbTitle(searchTerm) {
            if (isSharedWithMeMode()) {
              return $translate.instant("BreadcrumbTitle.sharedWithMe");
            } else if (isSharedWithEverybodyMode()) {
              return $translate.instant("BreadcrumbTitle.sharedWithEverybody");
            } else if (isSpecialFoldersMode()) {
              return $translate.instant("BreadcrumbTitle.specialFolders");
            } else if (isFolderContentMode()) {
              return $translate.instant("BreadcrumbTitle.viewAll");
            } else if (isSearchMode()) {
              return $translate.instant("BreadcrumbTitle.searchResult", {searchTerm: searchTerm});
            } else if (vm.nodeListQueryType == 'search-category-id') {
              return $translate.instant("BreadcrumbTitle.categorySearchResult", {searchTerm: searchTerm});
            } else {
              return "";
            }
          }

          function getTrustedBy(resource) {
            return resource['trustedBy'];
          }

          function reset() {
            vm.selectedResources = [];
          }

          /**
           * Event listeners
           */

          $scope.$on('search-finder', function (event, searchTerm) {
            vm.params.search = searchTerm;
            initSearch();
          });

          $scope.$on('finderModalVisible', function (event, params) {
            vm.modalVisible = true;
            vm.finderResource = null;
            vm.params.search = null;
            vm.params.folderId = null;
            vm.selectedResource = null;
          });

          // When bulk adding artifacts, pick the next one in queue once the previous is added and signaled form:update
          $scope.$on("form:update", (resource)=> {
            const _resource = vm.selectedResources.shift();
            if(!_resource)
              return;
            if (typeof vm.pickResourceCallback === 'function') {
              vm.pickResourceCallback(_resource);
            }
          });
        };

        /**
         * Directive definition
         */

        let directive = {
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

      }
    }
);
