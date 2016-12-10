'use strict';

define([
      'angular',
      'cedar/template-editor/service/cedar-user',
    ], function (angular) {
      angular.module('cedar.templateEditor.searchBrowse.cedarSearchBrowsePickerDirective', [
        'cedar.templateEditor.service.cedarUser'
      ]).directive('cedarSearchBrowsePicker', cedarSearchBrowsePickerDirective);

      cedarSearchBrowsePickerDirective.$inject = ['CedarUser'];

      function cedarSearchBrowsePickerDirective(CedarUser) {

        var directive = {
          bindToController: {
            selectResourceCallback: '=',
            pickResourceCallback  : '=',
            mode                  : '='
          },
          controller      : cedarSearchBrowsePickerController,
          controllerAs    : 'dc',
          restrict        : 'E',
          scope           : {},
          templateUrl     : 'scripts/search-browse/cedar-search-browse-picker.directive.html'
        };

        return directive;

        cedarSearchBrowsePickerController.$inject = [
          '$location',
          '$timeout',
          '$scope',
          '$rootScope',
          '$translate',
          'CedarUser',
          'resourceService',
          'UIMessageService',
          'UISettingsService',
          'UrlService',
          'AuthorizedBackendService',
          'TemplateInstanceService',
          'TemplateElementService',
          'TemplateService',
          'CONST'
        ];

        function cedarSearchBrowsePickerController($location, $timeout, $scope, $rootScope, $translate, CedarUser,
                                                   resourceService,
                                                   UIMessageService, UISettingsService, UrlService,
                                                   AuthorizedBackendService, TemplateInstanceService,
                                                   TemplateElementService, TemplateService, CONST) {
          var vm = this;

          vm.breadcrumbName = breadcrumbName;
          vm.currentPath = "";
          vm.currentFolderId = "";
          vm.offset = 0;

          vm.totalCount = null;
          vm.deleteResource = deleteResource;
          vm.doSearch = doSearch;
          vm.editResource = editResource;
          vm.facets = {};
          vm.forms = [];



          // modals
          vm.showMoveModal = showMoveModal;
          vm.showShareModal = showShareModal;
          vm.showRenameModal = showRenameModal;
          vm.showNewFolderModal = showNewFolderModal;
          vm.moveModalVisible = false;
          vm.shareModalVisible = false;
          vm.renameModalVisible = false;
          vm.newFolderModalVisible = false;

          vm.getFacets = getFacets;
          vm.getForms = getForms;
          vm.getCurrentFolderSummary = getCurrentFolderSummary;
          vm.getFolderContentsById = getFolderContentsById;
          vm.getSelectedNode = getSelectedNode;
          vm.getResourceIconClass = getResourceIconClass;
          vm.getResourceTypeClass = getResourceTypeClass;
          vm.goToResource = goToResource;
          vm.goToFolder = goToFolder;
          vm.isResourceTypeActive = isResourceTypeActive;
          vm.isSearching = false;
          vm.launchInstance = launchInstance;
          vm.copyToWorkspace = copyToWorkspace;
          vm.copyResource = copyResource;
          vm.setResourceInfoVisibility = setResourceInfoVisibility;
          vm.onDashboard = onDashboard;
          vm.narrowContent = narrowContent;
          vm.pathInfo = [];
          vm.params = $location.search();
          vm.resources = [];
          vm.selectedResource = null;
          vm.currentFolder = null;
          vm.hasSelection = hasSelection;
          vm.getSelection = getSelection;
          vm.setSortOption = setSortOption;
          vm.sortName = sortName;
          vm.sortCreated = sortCreated;
          vm.sortUpdated = sortUpdated;
          vm.showFilters = true;
          vm.filterShowing = filterShowing;
          vm.resetFilters = resetFilters;
          vm.filterSections = {};
          vm.isFilterSection = isFilterSection;
          vm.getArrowIcon = getArrowIcon;
          vm.showFloatingMenu = false;
          vm.infoShowing = infoShowing;
          vm.showOrHide = showOrHide;
          vm.sortOptionLabel = $translate.instant('DASHBOARD.sort.name');
          vm.toggleFavorites = toggleFavorites;
          vm.toggleFilters = toggleFilters;
          vm.workspaceClass = workspaceClass;
          vm.showResourceInfo = false;


          vm.toggleResourceInfo = toggleResourceInfo;
          vm.setResourceInfo = setResourceInfo;
          vm.toggleResourceType = toggleResourceType;
          vm.setResourceViewMode = setResourceViewMode;
          vm.isTemplate = isTemplate;
          vm.isElement = isElement;
          vm.isFolder = isFolder;
          vm.isMeta = isMeta;

          vm.editingDescription = false;

          vm.hideModal = function (visible) {
            visible = false;
          };

          vm.startDescriptionEditing = function () {
            console.log('startDescriptionEditing')
            var resource = vm.getSelection();
            if (resource != null) {
              vm.editingDescription = true;
              $timeout(function () {
                var jqDescriptionField = $('#edit-description');
                jqDescriptionField.focus();
                var l = jqDescriptionField.val().length;
                jqDescriptionField[0].setSelectionRange(0, l);
              });
            }
          };


          vm.cancelDescriptionEditing = function () {
            vm.editingDescription = false;
          };

          vm.selectResource = function (resource) {
            vm.cancelDescriptionEditing();
            vm.selectedResource = resource;
            vm.getResourceDetails(resource);
            if (typeof vm.selectResourceCallback === 'function') {
              vm.selectResourceCallback(resource);
            }
          };

          // show the info panel with this resource or find one
          vm.showInfoPanel = function (resource) {
            // if this one is defined, then use it
            if (resource) {
              if (!vm.isResourceSelected(resource)) {
                vm.selectResource(resource);
              }
            } else {
              if (vm.currentPath) {
                vm.selectResource(vm.currentPath);
              } else {
                if (vm.folder) {
                  vm.selectResource(vm.folder);
                }
              }
            }

            vm.setResourceInfoVisibility(true);
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

                  $timeout(function () {
                    vm.selectedResource = response;
                  },0);

                },
                function (error) {
                  UIMessageService.showBackendError('SERVER.' + resource.nodeType.toUpperCase() + '.load.error', error);
                }
            );
          };

          vm.canRead = function () {
            var node = this.getSelectedNode();
            if (node != null) {
              var perms = node.currentUserPermissions;
              if (perms != null) {
                return perms.indexOf("read") != -1;
              }
            }
            return false;
          };

          vm.canWrite = function () {
            var node = this.getSelectedNode();
            if (node != null) {
              var perms = node.currentUserPermissions;
              if (perms != null) {
                return perms.indexOf("write") != -1;
              }
            }
            return false;
          };

          vm.canChangeOwner = function () {
            var node = this.getSelectedNode();
            if (node != null) {
              var perms = node.currentUserPermissions;
              if (perms != null) {
                return perms.indexOf("changeowner") != -1;
              }
            }
            return false;
          };

          vm.canWriteToCurrentFolder = function () {
            var node = vm.currentFolder;
            if (node != null) {
              var perms = node.currentUserPermissions;
              if (perms != null) {
                return perms.indexOf("write") != -1;
              }
            }
            return false;
          };

          vm.updateDescription = function () {
            vm.editingDescription = false;
            var resource = vm.getSelection();
            if (resource != null) {
              var postData = {};
              var id = resource['@id'];
              var nodeType = resource.nodeType;
              var description = resource.description;

              if (nodeType == 'instance') {
                AuthorizedBackendService.doCall(
                    TemplateInstanceService.updateTemplateInstance(id, {'_ui.description': description}),
                    function (response) {
                      UIMessageService.flashSuccess('SERVER.INSTANCE.update.success', null, 'GENERIC.Updated');
                    },
                    function (err) {
                      UIMessageService.showBackendError('SERVER.INSTANCE.update.error', err);
                    }
                );
              } else if (nodeType == 'element') {
                AuthorizedBackendService.doCall(
                    TemplateElementService.updateTemplateElement(id, {'_ui.description': description}),
                    function (response) {
                      UIMessageService.flashSuccess('SERVER.ELEMENT.update.success', {"title": response.data._ui.title},
                          'GENERIC.Updated');
                    },
                    function (err) {
                      UIMessageService.showBackendError('SERVER.ELEMENT.update.error', err);
                    }
                );
              } else if (nodeType == 'template') {
                AuthorizedBackendService.doCall(
                    TemplateService.updateTemplate(id, {'_ui.description': description}),
                    function (response) {
                      $scope.form = response.data;
                      UIMessageService.flashSuccess('SERVER.TEMPLATE.update.success',
                          {"title": response.data._ui.title}, 'GENERIC.Updated');
                    },
                    function (err) {
                      UIMessageService.showBackendError('SERVER.TEMPLATE.update.error', err);
                    }
                );
              } else if (nodeType == 'folder') {
                vm.selectedResource.description = description;
                resourceService.updateFolder(
                    vm.selectedResource,
                    function (response) {
                      UIMessageService.flashSuccess('SERVER.FOLDER.update.success', {"title": vm.selectedResource.name},
                          'GENERIC.Updated');
                      init();
                    },
                    function (response) {
                      UIMessageService.showBackendError('SERVER.FOLDER.update.error', response);
                    }
                );
              }
            }
          };

          // callback to load more resources for the current folder
          vm.loadMore = function () {

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
          vm.searchMore = function () {

            var limit = UISettingsService.getRequestLimit();
            vm.offset += limit;
            var offset = vm.offset;
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
                  },
                  function (error) {
                    UIMessageService.showBackendError('SERVER.SEARCH.error', error);
                  }
              );
            }
          };


          //*********** ENTRY POINT

          setUIPreferences();
          init();

          function setUIPreferences() {
            var uip = CedarUser.getUIPreferences();
            //vm.showFavorites = CedarUser.getUIPreferences().populateATemplate.opened;
            vm.resourceTypes = {
              element : uip.resourceTypeFilters.element,
              field   : uip.resourceTypeFilters.field,
              instance: uip.resourceTypeFilters.instance,
              template: uip.resourceTypeFilters.template
            };
            vm.filterSections = {
              type  : false,
              author: false,
              status: false,
              term  : false
            };
            var option = CedarUser.getUIPreferences().folderView.sortBy;
            setSortOptionUI(option);
            vm.resourceViewMode = uip.folderView.viewMode;
            if (uip.hasOwnProperty('infoPanel')) {
              vm.showResourceInfo = uip.infoPanel.opened;
            } else {
              vm.showResourceInfo = false;
            }
          }

          function updateResourceInfoPanel() {
            var uip = CedarUser.getUIPreferences();
            vm.showResourceInfo = (uip.hasOwnProperty('infoPanel') && uip.infoPanel.opened );
          }

          function init() {
            vm.isSearching = false;
            if (vm.params.search) {
              vm.isSearching = true;
              if (vm.showFavorites) {
                vm.showFavorites = false;
                updateFavorites();
              }
              getFacets();
              doSearch(vm.params.search);
            } else if (vm.params.folderId) {
              vm.selectedResource = null;
              getFacets();
              var currentFolderId = decodeURIComponent(vm.params.folderId);
              getFolderContentsById(currentFolderId);
              getCurrentFolderSummary(currentFolderId);
            } else {
              goToFolder(CedarUser.getHomeFolderId());
            }
            if (vm.showFavorites) {
              getForms();
            }
            updateFavorites(false);
            updateResourceInfoPanel();
          }

          function initSearch() {
            if (vm.params.search) {
              vm.isSearching = true;
              getFacets();
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
                  vm.totalCount = response.totalCount;
                },
                function (error) {
                  UIMessageService.showBackendError('SERVER.SEARCH.error', error);
                }
            );
          }

          function copyToWorkspace(resource) {
            if (!resource) {
              resource = getSelection();
            }
            resourceService.copyResourceToWorkspace(
                resource,
                function (response) {

                  // TODO refresh the current page just in case you copied to the current page
                  vm.params = $location.search();
                  init();

                  UIMessageService.flashSuccess('SERVER.RESOURCE.copyToWorkspace.success', {"title": resource.name},
                      'GENERIC.Copied');
                },
                function (response) {
                  UIMessageService.showBackendError('SERVER.RESOURCE.copyToWorkspace.error', response);
                }
            );
          }

          function copyResource(resource) {
            if (!resource) {
              resource = getSelection();
            }
            var folderId = vm.currentFolderId;
            if (!folderId) {
              folderId = CedarUser.getHomeFolderId();
            }
            resourceService.copyResource(
                resource, folderId,
                function (response) {

                  // TODO refresh the current page just in case you copied to the current page
                  vm.params = $location.search();
                  init();

                  UIMessageService.flashSuccess('SERVER.RESOURCE.copyResource.success', {"title": resource.name},
                      'GENERIC.Copied');
                },
                function (response) {
                  UIMessageService.showBackendError('SERVER.RESOURCE.copyResource.error', response);
                }
            );
          }

          function launchInstance(resource) {
            if (!resource) {
              resource = getSelection();
            }


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

          function goToResource(resource) {
            var r = resource;
            if (!r && vm.selectedResource) {
              r = vm.selectedResource;
            }

            if (r) {

              //vm.params.search = null;
              var params = $location.search('');

              if (r.nodeType == 'folder') {
                goToFolder(r['@id']);
              } else {
                if (r.nodeType == 'template') {
                  launchInstance(r);
                } else {
                  editResource(r);
                }
              }
            }
          }

          function editResource(resource) {
            var r = resource;
            if (!r && vm.selectedResource) {
              r = vm.selectedResource;
            }

            if (r) {
              var id = r['@id'];
              if (typeof vm.pickResourceCallback === 'function') {
                vm.pickResourceCallback(r);
              }
              switch (r.nodeType) {
                case CONST.resourceType.TEMPLATE:
                  $location.path(UrlService.getTemplateEdit(id));
                  break;
                case CONST.resourceType.ELEMENT:
                  if (vm.onDashboard()) {
                    $location.path(UrlService.getElementEdit(id));
                  }
                  break;
                case CONST.resourceType.INSTANCE:
                  $location.path(UrlService.getInstanceEdit(id));
                  break;
                case CONST.resourceType.LINK:
                  $location.path(scope.href);
                  break;
                //case CONST.resourceType.FOLDER:
                //  vm.showEditFolder(r);
                //  break;
              }
            }
          }


          function deleteResource(resource) {
            if (!resource && hasSelection()) {
              resource = getSelection();
            }
            UIMessageService.confirmedExecution(
                function () {
                  resourceService.deleteResource(
                      resource,
                      function (response) {
                        // remove resource from list
                        var index = vm.resources.indexOf(resource);
                        vm.resources.splice(index, 1);
                        resetSelected();
                        UIMessageService.flashSuccess('SERVER.' + resource.nodeType.toUpperCase() + '.delete.success',
                            {"title": resource.nodeType},
                            'GENERIC.Deleted');
                      },
                      function (error) {
                        UIMessageService.showBackendError('SERVER.' + resource.nodeType.toUpperCase() + '.delete.error',
                            error);
                      }
                  );
                },
                'GENERIC.AreYouSure',
                'DASHBOARD.delete.confirm.' + resource.nodeType,
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
                  UIMessageService.showBackendError('SERVER.SEARCH.error', error);
                }
            );
          }


          function getFolderContentsById(folderId) {
            var resourceTypes = activeResourceTypes();
            vm.offset = 0;
            var offset = vm.offset;
            // var limit = vm.limit;
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

          function getCurrentFolderSummary(folderId) {
            var params = {
              '@id'     : folderId,
              'nodeType': CONST.resourceType.FOLDER
            };
            resourceService.getResourceDetail(
                params,
                function (response) {
                  vm.currentFolder = response;
                },
                function (error) {
                  UIMessageService.showBackendError('SERVER.FOLDER.load.error', error);
                }
            );
          }

          function getSelectedNode() {
            if (vm.selectedResource == null) {
              return vm.currentFolder;
            } else {
              return vm.selectedResource;
            }
          }

          function getResourceIconClass(resource) {
            var result = "";
            if (resource) {
              result += resource.nodeType + " ";

              switch (resource.nodeType) {
                case CONST.resourceType.FOLDER:
                  result += "fa-folder";
                  break;
                case CONST.resourceType.TEMPLATE:
                  result += "fa-file-text";
                  break;
                case CONST.resourceType.INSTANCE:
                  result += "fa-tag";
                  break;
                case CONST.resourceType.ELEMENT:
                  result += "fa-sitemap";
                  break;
                case CONST.resourceType.FIELD:
                  result += "fa-file-code-o";
                  break;
                  result += "fa-sitemap";
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
            if (vm.onDashboard()) {
              console.log('goToFolder ' + folderId);
              $location.url(UrlService.getFolderContents(folderId));
            } else {
              vm.params.folderId = folderId;
              init();
            }
          };

          function isResourceTypeActive(type) {
            return vm.resourceTypes[type];
          }

          function showOrHide(type) {
            return isResourceTypeActive(type) ? 'hide' : 'show';
          }

          function onDashboard() {
            return vm.mode == 'dashboard';
          }

          function filterShowing() {
            return vm.showFilters && onDashboard();
          }

          // TBD this blows up the current user, not sure why
          function resetFilters() {
            var updates = {};
            for (var nodeType in vm.resourceTypes) {
              vm.resourceTypes[nodeType] = true;
              var key = 'resourceTypeFilters.' + nodeType;
              updates[key] = true;
            }
            UISettingsService.saveUIPreferences(updates);
            init();
          }

          function infoShowing() {
            return vm.showResourceInfo && onDashboard();
          }

          function narrowContent() {
            return vm.showFilters || vm.showResourceInfo || !onDashboard();
          }

          function setResourceInfoVisibility(b) {
            vm.showResourceInfo = b;
            CedarUser.saveUIPreference('infoPanel', 'opened', vm.showResourceInfo);
            UISettingsService.saveUIPreference('infoPanel.opened', vm.showResourceInfo);
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

          function toggleFavorites() {
            vm.showFavorites = !vm.showFavorites;
            updateFavorites();
          }

          // toggle the faceted filter panel and the various sections within it
          function toggleFilters(section) {
            if (!section) {
              vm.showFilters = !vm.showFilters;
            } else {
              if (vm.filterSections.hasOwnProperty(section)) {
                vm.filterSections[section] = !vm.filterSections[section];
              }
            }
          }

          function workspaceClass() {
            var width = 12;
            if (vm.onDashboard()) {
              if (vm.showFilters) {
                width = width - 2;
              }
              if (vm.showResourceInfo) {
                width = width - 3;
              }
            }
            return 'col-sm-' + width;
          }


          function getArrowIcon(value) {
            return value ? 'fa-caret-left' : 'fa-caret-down';
          }

          function isFilterSection(section) {
            var result = false;
            if (!section) {
              result = vm.showFilters;
            } else {
              if (vm.filterSections.hasOwnProperty(section)) {
                result = vm.filterSections[section];
              }
            }
            return result;
          }

          function setResourceInfo(value) {
            vm.setResourceInfoVisibility(value);
          }

          function toggleResourceInfo() {
            vm.setResourceInfoVisibility(!vm.showResourceInfo);
          }

          function toggleResourceType(type) {
            vm.resourceTypes[type] = !vm.resourceTypes[type];
            UISettingsService.saveUIPreference('resourceTypeFilters.' + type, vm.resourceTypes[type]);
            init();
          }

          /**
           * Watch functions.
           */

          $scope.$on('$routeUpdate', function () {
            vm.params = $location.search();
            init();
          });

          $scope.$on('refreshWorkspace', function () {
            vm.params = $location.search();
            init();
          });

          $scope.$on('search', function (event, searchTerm) {
            console.log('on search');
            vm.params.search = searchTerm;
            initSearch();
          });

          $scope.hideModal = function (id) {
            jQuery('#' + id).modal('hide');
          };


          /**
           * Private functions.
           */

          function activeResourceTypes() {
            var activeResourceTypes = [];
            angular.forEach(Object.keys(vm.resourceTypes), function (value, key) {
              if (vm.resourceTypes[value]) {
                if (!vm.onDashboard()) {
                  // just elements can be selected
                  if (value == 'element') {
                    activeResourceTypes.push(value);
                  }
                } else {
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

          function setResourceViewMode(mode) {
            vm.resourceViewMode = mode;
            UISettingsService.saveUIPreference('folderView.viewMode', mode);
          }

          // open the move modal
          function showMoveModal(resource) {
            var r = resource;
            if (!r && vm.selectedResource) {
              r = vm.selectedResource;
            }
            vm.moveModalVisible = true;
            $scope.$broadcast('moveModalVisible',
                [vm.moveModalVisible, r, vm.currentPath, vm.currentFolderId, vm.resourceTypes,
                 vm.sortOptionField]);
          }

          // open the share modal
          function showShareModal(resource) {
            var r = resource;
            if (!r && vm.selectedResource) {
              r = vm.selectedResource;
            }
            vm.shareModalVisible = true;
            $scope.$broadcast('shareModalVisible', [vm.shareModalVisible, r]);
          }

          // open the rename modal
          function showRenameModal(resource) {

            var r = resource;
            if (!r && vm.selectedResource) {
              r = vm.selectedResource;
            }

            vm.renameModalVisible = true;
            $scope.$broadcast('renameModalVisible', [vm.renameModalVisible, r]);
          }

          // open the new folder modal
          function showNewFolderModal() {
            vm.newFolderModalVisible = true;
            var params = $location.search();
            var folderId;
            if (params.folderId) {
              folderId = params.folderId;
            } else {
              folderId = vm.currentFolderId
            }
            $scope.$broadcast('newFolderModalVisible', [vm.newFolderModalVisible, folderId]);
          }




        }
      }
    }
);
