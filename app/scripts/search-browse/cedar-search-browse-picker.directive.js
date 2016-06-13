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
          '$rootScope',
          '$timeout',
          '$scope',
          '$translate',
          'CedarUser',
          'resourceService',
          'UIMessageService',
          'UISettingsService',
          'UrlService',
          'CONST'
        ];

        function cedarSearchBrowsePickerController($location, $rootScope, $timeout, $scope, $translate, CedarUser,
                                                   resourceService, UIMessageService, UISettingsService, UrlService,
                                                   CONST) {
          var vm = this;

          vm.breadcrumbName = breadcrumbName;
          vm.cancelCreateEditFolder = cancelCreateEditFolder;
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
          vm.getResourceTypeClass = getResourceTypeClass;
          vm.goToResource = goToResource;
          vm.goToFolder = goToFolder;
          vm.isResourceSelected = isResourceSelected;
          vm.isResourceTypeActive = isResourceTypeActive;
          vm.isSearching = false;
          vm.launchInstance = launchInstance;
          vm.copyToWorkspace = copyToWorkspace;
          vm.onDashboard = onDashboard;
          vm.narrowContent = narrowContent;
          vm.pathInfo = [];
          vm.params = $location.search();
          vm.resources = [];
          vm.selectedResource = null;
          vm.selectResource = selectResource;
          vm.hasSelection = hasSelection;
          vm.getSelection = getSelection;
          vm.setSortOption = setSortOption;
          vm.sortName = sortName;
          vm.sortCreated = sortCreated;
          vm.sortUpdated = sortUpdated;
          vm.showCreateFolder = showCreateFolder;
          vm.showFilters = true;
          vm.filterShowing = filterShowing;
          vm.resetFilters = resetFilters;
          vm.filterSections = {};
          vm.isFilterSection = isFilterSection;
          vm.getArrowIcon = getArrowIcon;
          vm.showFloatingMenu = false;
          vm.toggleInfoPanel = toggleInfoPanel;
          vm.showInfoPanel = showInfoPanel;
          vm.infoShowing = infoShowing;
          vm.showOrHide = showOrHide;
          vm.showResourceInfo = false;
          vm.sortOptionLabel = $translate.instant('DASHBOARD.sort.name');
          vm.toggleFavorites = toggleFavorites;
          vm.toggleFilters = toggleFilters;
          vm.workspaceClass = workspaceClass;


          vm.toggleResourceInfo = toggleResourceInfo;
          vm.toggleResourceType = toggleResourceType;
          vm.setResourceViewMode = setResourceViewMode;
          vm.isTemplate = isTemplate;
          vm.isElement = isElement;
          vm.isFolder = isFolder;
          vm.isMeta = isMeta;

          vm.editingDescription = false;
          vm.updateDescription = updateDescription;


          //$rootScope.pageTitle = 'Dashboard';
          //$rootScope.pageId = 'DASHBOARD';


          setUIPreferences();
          init();

          function setUIPreferences() {
            //vm.showFavorites = CedarUser.getUIPreferences().populateATemplate.opened;
            vm.resourceTypes = {
              element : CedarUser.getUIPreferences().resourceTypeFilters.element,
              field   : CedarUser.getUIPreferences().resourceTypeFilters.field,
              instance: CedarUser.getUIPreferences().resourceTypeFilters.instance,
              template: CedarUser.getUIPreferences().resourceTypeFilters.template
            };
            vm.filterSections = {
              type  : false,
              author: false,
              status: false,
              term  : false
            };
            var option = CedarUser.getUIPreferences().folderView.sortBy;
            setSortOptionUI(option);
            vm.resourceViewMode = CedarUser.getUIPreferences().folderView.viewMode;
            ;
          }

          function init() {
            vm.isSearching = false;
            if (vm.params.folderId) {
              getFacets();
              getFolderContentsById(decodeURIComponent(vm.params.folderId));
            } else if (vm.params.search) {
              vm.isSearching = true;
              if (vm.showFavorites) {
                vm.showFavorites = false;
                updateFavorites();
              }
              getFacets();
              doSearch(vm.params.search);
            } else {
              goToFolder(CedarUser.getHomeFolderId());
            }
            if (vm.showFavorites) {
              getForms();
            }
            updateFavorites(false);
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
            $timeout(function () {
              $('#formFolderName').focus();
              var l = $('#formFolderName').val().length;
              $('#formFolderName')[0].setSelectionRange(0, l);
            });
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
                  function (response) {
                    UIMessageService.showBackendError('SERVER.FOLDER.update.error', response);
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
                  function (response) {
                    if (response.status == 400) {
                      UIMessageService.showWarning(
                          'GENERIC.Warning',
                          'SERVER.FOLDER.create.' + response.data.errorSubType,
                          'GENERIC.Ok',
                          response.data.errorParams
                      );
                    } else {
                      UIMessageService.showBackendError('SERVER.FOLDER.create.error', response);
                    }
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
                  UIMessageService.flashSuccess('SERVER.RESOURCE.copyToWorkspace.success', {"title": resource.name},
                      'GENERIC.Copied');
                },
                function (response) {
                  UIMessageService.showBackendError('SERVER.RESOURCE.copyToWorkspace.error', response);
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

            vm.params.search = null;

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

          function editResource(resource) {
            var id = resource['@id'];
            if (typeof vm.pickResourceCallback === 'function') {
              vm.pickResourceCallback(resource);
            }
            switch (resource.nodeType) {
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
            $timeout(function () {
              $('#formFolderName').focus();
              var l = $('#formFolderName').val().length;
              $('#formFolderName')[0].setSelectionRange(0, l);
            });
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

          function getResourceDetails(resource) {
            if (!resource && hasSelection()) {
              resource = getSelection();
            }
            var id = resource['@id'];
            resourceService.getResourceDetail(
                resource,
                function (response) {
                  vm.selectedResource = response;
                },
                function (error) {
                  UIMessageService.showBackendError('SERVER.' + resource.nodeType.toUpperCase() + '.load.error', error);
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
            if (vm.onDashboard()) {
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

          function isResourceSelected(resource) {
            if (resource == null || vm.selectedResource == null) {
              return false;
            } else {
              return vm.selectedResource['@id'] == resource['@id'];
            }
          }

          function onDashboard() {
            return vm.mode == 'dashboard';
          }

          function filterShowing() {
            return vm.showFilters && onDashboard();
          }

          // TBD this blows up the current user, not sure why
          function resetFilters() {
            //angular.forEach(Object.keys(vm.resourceTypes), function (value, key) {
            //  vm.resourceTypes[key] = true;
            //  UISettingsService.saveUIPreference('resourceTypeFilters.' + key, vm.resourceTypes[key]);
            //});
            //init();
          }

          function infoShowing() {
            return vm.showResourceInfo && onDashboard();
          }

          function narrowContent() {
            return vm.showFilters || vm.showResourceInfo || !onDashboard();
          }

          function selectResource(resource) {
            getResourceDetails(resource);
            if (typeof vm.selectResourceCallback === 'function') {
              vm.selectResourceCallback(resource);
            }
          }

          // show the info panel with this resource or find one
          function showInfoPanel(resource) {

            // if this one is defined, then use it
            if (resource) {
              if (!isResourceSelected(resource)) {
                selectResource(resource);
              }
            } else {
              if (vm.currentPath) {
                selectResource(vm.currentPath);
              } else {
                if (vm.formFolder) {
                  selectResource(vm.formFolder);
                }
              }
            }

            vm.showResourceInfo = true;
            resizeCenterPanel();

          }


          // toggle the info panel with this resource or find one
          function toggleInfoPanel(resource) {

            if (!vm.showResourceInfo) {
              showInfoPanel(resource);
            } else {
              vm.showResourceInfo = false;
              resizeCenterPanel();
            }
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
            resizeCenterPanel();
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

          function toggleResourceInfo() {
            vm.showResourceInfo = !vm.showResourceInfo;

            // resize center panel
            resizeCenterPanel();

          }

          function resizeCenterPanel() {
            var e = jQuery('#center-panel');
            e.css("left", vm.showFilters ? "200px" : "0");
            e.css("right", vm.showResourceInfo ? "400px" : "0");
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

          $scope.$on('search', function (event, searchTerm) {
            if (onDashboard()) {
              $location.url(UrlService.getSearchPath(searchTerm));
            } else {
              vm.params.search = searchTerm;
              initSearch();
            }
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
            vm.showResourceInfo = false;
            resizeCenterPanel();
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

          $scope.$on('$routeUpdate', function () {
            vm.params = $location.search();
            init();
          });


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
          };

          // TBD save the updated description
          function updateDescription() {
            vm.editingDescription = false;
          };

        }
      };

    }
)
;
