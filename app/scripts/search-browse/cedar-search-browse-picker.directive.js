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

        function cedarSearchBrowsePickerController($location, $timeout, $scope, $rootScope,$translate, CedarUser, resourceService,
                                                   UIMessageService, UISettingsService, UrlService,
                                                   AuthorizedBackendService, TemplateInstanceService,
                                                   TemplateElementService, TemplateService, CONST) {
          var vm = this;

          vm.breadcrumbName = breadcrumbName;
          //vm.cancelCreateEditFolder = cancelCreateEditFolder;
          vm.currentPath = "";
          vm.currentFolderId = "";
          vm.offset = 0;

          vm.totalCount = null;
          vm.deleteResource = deleteResource;
          //vm.doCreateEditFolder = doCreateEditFolder;
          vm.renameResource = renameResource;
          vm.doSearch = doSearch;
          vm.editResource = editResource;
          vm.facets = {};
          vm.forms = [];

          //vm.formFolder = null;
          //vm.formFolderName = null;
          //vm.formFolderDescription = null;

          vm.newFolder = newFolder;
          vm.showNewFolder = showNewFolder;
          vm.folder = {};
          vm.folder.name = "";
          vm.folder.description = "folder description";


          // move to...
          vm.openParent = openParent;
          vm.selectDestination = selectDestination;
          vm.isDestinationSelected = isDestinationSelected;
          vm.moveDisabled = moveDisabled;
          vm.moveResource = moveResource;
          vm.openDestination = openDestination;
          vm.showMoveResourceModal = showMoveResourceModal;
          vm.selectedDestination = null;
          vm.currentDestination = null;
          vm.destinationResources = [];
          vm.currentDestinationID = null;
          vm.destinationPathInfo = null;
          vm.destinationPath = null;

          // share
          vm.openShare = openShare;
          vm.saveShare = saveShare;
          vm.getNode = getNode;
          vm.canBeOwner = canBeOwner;
          vm.canUpdate = canUpdate;
          vm.addShare = addShare;
          vm.addAndSaveShare = addAndSaveShare;
          vm.removeShare = removeShare;
          vm.removeAndSaveShare = removeAndSaveShare;
          vm.updateNodePermission = updateNodePermission;
          vm.getName = getName;
          vm.selectedUserId = null;
          vm.giveUserPermission = 'read';
          vm.selectedGroupId = null;
          vm.giveGroupPermission = 'read';
          vm.selectedNodeId = null;
          vm.selectedUserId = null;
          vm.selectedGroupId = null;
          vm.giveNodePermission = 'read';
          vm.userIsOriginalOwner = false;
          vm.userIsOriginalWriter = false;
          vm.everybodyIsOriginalWriter = false;
          vm.resourceUsers = null;
          vm.resourceGroups = null;
          vm.resourcePermissions = null;
          vm.resourceNodes = null;
          vm.showGroups = false;
          vm.openShareModal = openShareModal;


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
          //vm.showCreateFolder = showCreateFolder;
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

          vm.canAccessParentFunction = canAccessParentFunction;


          vm.startDescriptionEditing = function () {
            var resource = vm.getSelection();
            if (resource != null) {
              //if (resource.nodeType == 'folder') {
              //  vm.showEditFolder(resource, true);
              //} else {
              vm.editingDescription = true;
              $timeout(function () {
                var jqDescriptionField = $('#edit-description');
                jqDescriptionField.focus();
                var l = jqDescriptionField.val().length;
                jqDescriptionField[0].setSelectionRange(0, l);
              });
              //}
            }
          };


          vm.cancelDescriptionEditing = function () {
            vm.editingDescription = false;
          };

          vm.selectResource = function (resource) {
            vm.cancelDescriptionEditing();
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
            vm.resizeCenterPanel();
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
              vm.resizeCenterPanel();
            }
          };

          vm.resizeCenterPanel = function () {
            //var e = jQuery('#center-panel');
            //e.class("left", vm.showFilters ? "200px" : "0");
            //e.css("right", vm.showResourceInfo ? "400px" : "0");
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
                    sort: sortField(),
                    limit: limit,
                    offset: offset
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

          vm.canAccessParent = 'can access parent';




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
              vm.resizeCenterPanel();
            } else {
              vm.showResourceInfo = false;
            }
          }

          function updateResourceInfoPanel() {
            var uip = CedarUser.getUIPreferences();
            vm.showResourceInfo = (uip.hasOwnProperty('infoPanel') && uip.infoPanel.opened );
            vm.resizeCenterPanel();
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

          //function cancelCreateEditFolder() {
          //  vm.formFolderName = 'Untitled';
          //  vm.formFolderDescription = 'Untitled';
          //  vm.formFolder = null;
          //  $('#editFolderModal').modal('hide');
          //}

          //function showCreateFolder() {
          //  vm.showFloatingMenu = false;
          //  vm.formFolderName = 'Untitled';
          //  vm.formFolderDescription = 'Untitled';
          //  vm.formFolder = null;
          //  $('#editFolderModal').modal('show');
          //  $timeout(function () {
          //    var jqFolderName = $('#formFolderName');
          //    jqFolderName.focus();
          //    var l = jqFolderName.val().length;
          //    jqFolderName[0].setSelectionRange(0, l);
          //  });
          //}

          function showNewFolder(id) {
            vm.showFloatingMenu = false;
            vm.folder.name = '';
            $(id).modal('show');
            $timeout(function () {
              jQuery(id + ' input').focus();
            });
          }

          function renameResource() {
            var resource = vm.getSelection();
            if (resource != null) {
              var postData = {};
              var id = resource['@id'];
              var nodeType = resource.nodeType;
              var name = vm.selectedResource.name;

              if (nodeType == 'instance') {
                AuthorizedBackendService.doCall(
                    TemplateInstanceService.updateTemplateInstance(id, {'_ui.title': name}),
                    function (response) {
                      UIMessageService.flashSuccess('SERVER.INSTANCE.update.success', null, 'GENERIC.Updated');
                      init();
                    },
                    function (err) {
                      UIMessageService.showBackendError('SERVER.INSTANCE.update.error', err);
                    }
                );
              } else if (nodeType == 'element') {
                AuthorizedBackendService.doCall(
                    TemplateElementService.updateTemplateElement(id, {'_ui.title': name}),
                    function (response) {
                      UIMessageService.flashSuccess('SERVER.ELEMENT.update.success', {"title": response.data._ui.title},
                          'GENERIC.Updated');
                      init();
                    },
                    function (err) {
                      UIMessageService.showBackendError('SERVER.ELEMENT.update.error', err);
                    }
                );
              } else if (nodeType == 'template') {
                AuthorizedBackendService.doCall(
                    TemplateService.updateTemplate(id, {'_ui.title': name}),
                    function (response) {
                      //$scope.form = response.data;  // WTF?
                      UIMessageService.flashSuccess('SERVER.TEMPLATE.update.success',
                          {"title": response.data._ui.title}, 'GENERIC.Updated');
                      init();
                    },
                    function (err) {
                      UIMessageService.showBackendError('SERVER.TEMPLATE.update.error', err);
                    }
                );
              } else if (nodeType == 'folder') {
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

          }

          function newFolder() {
            if (vm.folder.name) {
              resourceService.createFolder(
                  vm.params.folderId,
                  vm.folder.name,
                  'description',
                  function (response) {
                    init();
                    UIMessageService.flashSuccess('SERVER.FOLDER.create.success', {"title": vm.folder.name},
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

          //function doCreateEditFolder() {
          //  $('#editFolderModal').modal('hide');
          //  if (vm.formFolder) {
          //    vm.formFolder.name = vm.formFolderName;
          //    vm.formFolder.description = vm.formFolderDescription;
          //    resourceService.updateFolder(
          //        vm.formFolder,
          //        function (response) {
          //          init();
          //          UIMessageService.flashSuccess('SERVER.FOLDER.update.success', {"title": vm.formFolderName},
          //              'GENERIC.Updated');
          //        },
          //        function (response) {
          //          UIMessageService.showBackendError('SERVER.FOLDER.update.error', response);
          //        }
          //    );
          //    // edit
          //  } else {
          //    resourceService.createFolder(
          //        vm.params.folderId,
          //        vm.formFolderName,
          //        vm.formFolderDescription,
          //        function (response) {
          //          init();
          //          UIMessageService.flashSuccess('SERVER.FOLDER.create.success', {"title": vm.formFolderName},
          //              'GENERIC.Created');
          //        },
          //        function (response) {
          //          if (response.status == 400) {
          //            UIMessageService.showWarning(
          //                'GENERIC.Warning',
          //                'SERVER.FOLDER.create.' + response.data.errorSubType,
          //                'GENERIC.Ok',
          //                response.data.errorParams
          //            );
          //          } else {
          //            UIMessageService.showBackendError('SERVER.FOLDER.create.error', response);
          //          }
          //        }
          //    );
          //  }
          //}

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

          function canAccessParentFunction() {
            return vm.canAccessParent;
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
            vm.resizeCenterPanel();
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
            vm.resizeCenterPanel();
          }

          function toggleResourceInfo() {
            vm.setResourceInfoVisibility(!vm.showResourceInfo);
            vm.resizeCenterPanel();
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
              //$location.url(UrlService.getSearchPath(searchTerm));
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
            vm.resizeCenterPanel();
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
          }


          // move to...

          function openParent() {
            var length = vm.destinationPathInfo.length;
            var parent = vm.destinationPathInfo[length - 1];
            openDestination(parent);
          }

          function moveResource() {

            if (vm.selectedDestination) {
              var folderId = vm.selectedDestination['@id'];


              if (vm.selectedResource) {
                var resource = vm.selectedResource;


                resourceService.moveResource(
                    resource,
                    folderId,
                    function (response) {

                      // TODO refresh the current page just in case you copied to the current page
                      vm.params = $location.search();
                      init();

                      UIMessageService.flashSuccess('SERVER.RESOURCE.moveResource.success', {"title": resource.name},
                          'GENERIC.Moved');
                    },
                    function (response) {
                      UIMessageService.showBackendError('SERVER.RESOURCE.moveResource.error', response);
                    }
                );

              }
            }
          }

          function selectDestination(resource) {
            vm.selectedDestination = resource;
          }

          function openDestination(resource) {
            if (resource) {
              var id = resource['@id'];
              getDestinationById(id);
              vm.selectedDestination = null;
              vm.currentDestination = resource;
            }
          }

          function moveDisabled() {
            return vm.selectedDestination == null;
          }

          function isDestinationSelected(resource) {
            if (resource == null || vm.selectedDestination == null) {
              return false;
            } else {
              return (vm.selectedDestination['@id'] == resource['@id']);
            }
          }

          function showMoveResourceModal(id) {
            vm.showFloatingMenu = false;
            vm.currentDestination = vm.currentPath;
            vm.selectedDestination = null;
            getDestinationById(vm.currentFolderId);
            $(id).modal('show');

          }

          function getDestinationById(folderId) {
            var resourceTypes = activeResourceTypes();
            if (resourceTypes.length > 0) {
              return resourceService.getResources(
                  {folderId: folderId, resourceTypes: resourceTypes, sort: sortField(), limit: 100, offset: 0},
                  function (response) {
                    vm.currentDestinationID = folderId;
                    vm.destinationResources = response.resources;
                    vm.destinationPathInfo = response.pathInfo;
                    vm.destinationPath = vm.destinationPathInfo.pop();
                  },
                  function (error) {
                    UIMessageService.showBackendError('SERVER.FOLDER.load.error', error);
                  }
              );
            } else {
              vm.destinationResources = [];
            }
          }

          // share...

          // is the current user the owner?
          function userIsOwner() {
            var userId = CedarUser.getUserId();
            var ownerId = null;

            if (vm.resourcePermissions) {
              ownerId = vm.resourcePermissions.owner.id.substr(vm.resourcePermissions.owner.id.lastIndexOf('/') + 1);
            }

            return (ownerId === userId);
          }

          // does the current user have write permissions?
          function userIsWriter() {
            var userId = CedarUser.getUserId();
            if (vm.resourcePermissions) {
              for (var i = 0; i < vm.resourcePermissions.userPermissions.length; i++) {
                var id = vm.resourcePermissions.userPermissions[i].user.id;
                id = id.substr(id.lastIndexOf('/') + 1);
                if (userId === id) {
                  return vm.resourcePermissions.userPermissions[i].permission === 'write';
                }
              }
            }
            return false;
          }

          // does the current user have write permissions?
          function everybodyIsWriter() {
            var userId = CedarUser.getUserId();
            if (vm.resourcePermissions && vm.resourcePermissions.groupPermissions.length > 0) {
              return vm.resourcePermissions.groupPermissions[0].permission === 'write'
            }
            return false;
          }

          // is the node's owner the same as the current owner
          function isOwner(node) {
            if (vm.resourcePermissions && vm.resourcePermissions.owner && node) {
              return vm.resourcePermissions.owner.id === node.id;
            }
            return false;
          }

          // can ownership be assigned on this node by the current user
          function canUpdate() {
            //return vm.userIsOriginalOwner || vm.userIsOriginalWriter || vm.everybodyIsOriginalWriter || vm.canWrite();
            return vm.canWrite();
          }

          // can ownership be assigned on this node by the current user
          function canBeOwner(id) {
            var node = getNode(id);
            //return id && node && node.nodeType === 'user' && vm.userIsOriginalOwner || vm.canChangeOwner();
            return id && node && node.nodeType === 'user' && vm.canChangeOwner();
          }


          // sorting strings
          function dynamicSort(property) {
            var sortOrder = 1;
            if (property[0] === "-") {
              sortOrder = -1;
              property = property.substr(1);
            }
            return function (a, b) {
              var result = (a[property].toUpperCase() < b[property].toUpperCase()) ? -1 : (a[property].toUpperCase() > b[property].toUpperCase()) ? 1 : 0;
              return result * sortOrder;
            }
          }

          // update the permission for this node
          function updateShare(node, permission) {

            for (var i = 0; i < vm.resourcePermissions.shares.length; i++) {
              if (node.id === vm.resourcePermissions.shares[i].node.id) {
                vm.resourcePermissions.shares[i].permission = permission;
                return true;
              }
            }
            return false;
          }

          // update the permission for this node
          function updateAndSaveShare(node, permission, resource) {

            for (var i = 0; i < vm.resourcePermissions.shares.length; i++) {
              if (node.id === vm.resourcePermissions.shares[i].node.id) {
                vm.resourcePermissions.shares[i].permission = permission;
                saveShare(resource);
                return true;
              }
            }
            return false;
          }

          // get the node for this id
          function getNode(id) {
            if (vm.resourceNodes) {
              for (var i = 0; i < vm.resourceNodes.length; i++) {
                if (vm.resourceNodes[i].id === id) {
                  return vm.resourceNodes[i];
                }
              }
            }
          }

          // is this node a user?
          function isUser(node) {
            return node && (!node.hasOwnProperty('nodeType') || node.nodeType === 'user');
          }



          // initialize the modal share dialog
          function openShareModal(resource) {
            $rootScope.$broadcast('share-modal', resource);
          };


          // initialize the share dialog
          function openShare(resource) {
            vm.selectedNodeId = null;
            vm.selectedUserId = null;
            vm.selectedGroupId = null;
            vm.giveNodePermission = 'read';
            vm.userIsOriginalOwner = false;
            vm.userIsOriginalWriter = false;
            vm.everybodyIsOriginalWriter = false;
            vm.resourceUsers = null;
            vm.resourceGroups = null;
            vm.resourceNodes = null;
            vm.resourcePermissions = null;
            vm.showGroups = false;
            getNodes();
            getPermissions(resource);
          };

          // save the modified permissions to the server
          function saveShare(resource) {
            setPermissions(resource);
          };

          // read the permissions from the server
          function getPermissions(resource) {
            // get the sharing for this resource
            if (!resource && vm.hasSelection()) {
              resource = vm.getSelection();
            }
            var id = resource['@id'];
            resourceService.getResourceShare(
                resource,
                function (response) {
                  vm.resourcePermissions = response;
                  vm.userIsOriginalOwner = userIsOwner();
                  vm.userIsOriginalWriter = userIsWriter();
                  vm.everybodyIsOriginalWriter = everybodyIsWriter();
                  vm.resourcePermissions.owner.name = getName(vm.resourcePermissions.owner);
                  getShares();
                },
                function (error) {
                  UIMessageService.showBackendError('SERVER.' + resource.nodeType.toUpperCase() + '.load.error', error);
                }
            );
          };

          function getShares() {
            if (vm.resourcePermissions) {

              vm.resourcePermissions.shares = [];
              for (var i = 0; i < vm.resourcePermissions.groupPermissions.length; i++) {
                var share = {};
                share.permission = vm.resourcePermissions.groupPermissions[i].permission;
                share.node = vm.resourcePermissions.groupPermissions[i].group;
                share.node.nodeType = 'group';
                share.node.name = getName(share.node);
                vm.resourcePermissions.shares.push(share);
              }
              for (var i = 0; i < vm.resourcePermissions.userPermissions.length; i++) {
                var share = {};
                share.permission = vm.resourcePermissions.userPermissions[i].permission;
                share.node = vm.resourcePermissions.userPermissions[i].user;
                share.node.nodeType = 'user';
                share.node.name = getName(share.node);
                vm.resourcePermissions.shares.push(share);
              }

              //if (vm.resourcePermissions.shares.length > 0) {
              //  var id = vm.resourcePermissions.shares[0].node.id;
              //  vm.selectedNodeId = id.substr(id.lastIndexOf('/') + 1);
              //}
            }
          }

          // write the permissions to the server
          function setPermissions(resource) {

            // rebuild permissions from shares
            vm.resourcePermissions.groupPermissions = [];
            vm.resourcePermissions.userPermissions = [];
            for (var i = 0; i < vm.resourcePermissions.shares.length; i++) {
              var share = vm.resourcePermissions.shares[i];
              if (share.node.nodeType === 'user') {
                share.user = share.node;
                delete share.node;
                vm.resourcePermissions.userPermissions.push(share);
              } else {
                share.group = share.node;
                delete share.node;
                vm.resourcePermissions.groupPermissions.push(share);
              }
            }
            delete vm.resourcePermissions.shares;

            if (!resource && vm.hasSelection()) {
              resource = vm.getSelection();
            }
            var id = resource['@id'];
            resourceService.setResourceShare(
                resource,
                vm.resourcePermissions,
                function (response) {
                  vm.resourcePermissions = response;
                  getShares();
                },
                function (error) {
                  UIMessageService.showBackendError('SERVER.' + resource.nodeType.toUpperCase() + '.load.error', error);
                }
            );
          };

          function initNodes(nodes) {

            var result;
            for (var i = 0; i < nodes.length; i++) {
              nodes[i].name = getName(nodes[i]);
            }
            nodes.sort(dynamicSort("name"));
            if (nodes.length > 0) {
              result = nodes[0].id;
            }
            return result;

          }

          // get all the users and groups on the system
          function getNodes() {

            // get the users
            resourceService.getUsers(
                function (response) {
                  vm.resourceUsers = response.users;
                  vm.selectedUserId = initNodes(vm.resourceUsers);


                  // get groups
                  resourceService.getGroups(
                      function (response) {
                        vm.resourceGroups = response.groups;
                        vm.selectedGroupId = initNodes(vm.resourceGroups);

                        // resource nodes is the users and groups combined
                        vm.resourceNodes = [];
                        vm.resourceNodes = vm.resourceNodes.concat(vm.resourceUsers);
                        vm.resourceNodes = vm.resourceNodes.concat(vm.resourceGroups);
                        vm.selectedNodeId = initNodes(vm.resourceNodes);

                      },
                      function (error) {
                        UIMessageService.showBackendError('SERVER.' + resource.nodeType.toUpperCase() + '.load.error',
                            error);
                      }
                  );
                },
                function (error) {
                  UIMessageService.showBackendError('SERVER.' + resource.nodeType.toUpperCase() + '.load.error', error);
                }
            );
          }

          // get all the users on the system
          function getUsers() {

            // get the users
            resourceService.getUsers(
                function (response) {
                  vm.resourceUsers = response.users;
                  if (vm.resourceUsers.length > 0) {
                    vm.selectedUserId = vm.resourceUsers[0].id;
                  }
                },
                function (error) {
                  UIMessageService.showBackendError('SERVER.' + resource.nodeType.toUpperCase() + '.load.error', error);
                }
            );
          }

          // get all the groups on the system
          function getGroups() {

            resourceService.getGroups(
                function (response) {
                  vm.resourceGroups = response.groups;
                  if (vm.resourceGroups.length > 0) {
                    vm.selectedGroupId = vm.resourceGroups[0].id;
                  }
                },
                function (error) {
                  UIMessageService.showBackendError('SERVER.' + resource.nodeType.toUpperCase() + '.load.error', error);
                }
            );
          }

          // remove the share permission on this node
          function removeShare(node) {
            for (var i = 0; i < vm.resourcePermissions.shares.length; i++) {
              if (node.id === vm.resourcePermissions.shares[i].node.id) {
                vm.resourcePermissions.shares.splice(i, 1);
              }
            }
            for (var i = 0; i < vm.resourcePermissions.userPermissions.length; i++) {
              if (node.id === vm.resourcePermissions.userPermissions[i].user.id) {
                vm.resourcePermissions.userPermissions.splice(i, 1);
                return;
              }
            }
            for (var i = 0; i < vm.resourcePermissions.groupPermissions.length; i++) {
              if (node.id === vm.resourcePermissions.groupPermissions[i].group.id) {
                vm.resourcePermissions.groupPermissions.splice(i, 1);
                return;
              }
            }
          }

          // remove the share permission on this node
          function removeAndSaveShare(node, resource) {
            for (var i = 0; i < vm.resourcePermissions.shares.length; i++) {
              if (node.id === vm.resourcePermissions.shares[i].node.id) {
                vm.resourcePermissions.shares.splice(i, 1);
              }
            }
            for (var i = 0; i < vm.resourcePermissions.userPermissions.length; i++) {
              if (node.id === vm.resourcePermissions.userPermissions[i].user.id) {
                vm.resourcePermissions.userPermissions.splice(i, 1);
                saveShare(resource);
                return;
              }
            }
            for (var i = 0; i < vm.resourcePermissions.groupPermissions.length; i++) {
              if (node.id === vm.resourcePermissions.groupPermissions[i].group.id) {
                vm.resourcePermissions.groupPermissions.splice(i, 1);
                saveShare(resource);
                return;
              }
            }
          }

          // format a name for this node
          function getName(node) {
            var result = "";
            if (node) {
              if (isUser(node)) {
                result = node.firstName + ' ' + node.lastName + ' (' + node.email + ')';
              } else {
                result = node.displayName;
              }
            }
            return result;
          }

          // when selected user changes, reset selected permisison
          function updateNodePermission() {
            var node = getNode(vm.selectedNodeId);
            if (node.nodeType === 'group' && vm.giveNodePermission === 'own') {
              vm.giveNodePermission = 'read';
            }
          }

          // add a share permission for this node
          function addShare(id, permission, domId) {

            var node = getNode(id);
            var share = {};
            if (node) {

              if (permission === 'own') {

                var owner = vm.resourcePermissions.owner;

                if (owner.id != id) {

                  // make the node the owner
                  removeShare(node);

                  vm.resourcePermissions.owner = node;

                  share.permission = 'write';
                  share.node = owner;
                  share.node.nodeType = 'user';
                  share.node.name = getName(share.node);
                  vm.resourcePermissions.shares.push(share);
                }

              } else {

                // can we just update it
                if (!isOwner(node) && !updateShare(node, permission)) {

                  // create the new share for this group
                  share.permission = permission;
                  share.node = node;
                  share.node.name = getName(node);
                  vm.resourcePermissions.shares.push(share);
                }
              }
              // scroll to this node
              $timeout(function () {
                var scroller = document.getElementById(domId);
                scroller.scrollTop = scroller.scrollHeight;
              }, 0, false);
            }
          }

          function addAndSaveShare(id, permission, domId, resource) {

            var node = getNode(id);
            var share = {};
            if (node) {

              if (permission === 'own') {

                var owner = vm.resourcePermissions.owner;

                if (owner.id != id) {

                  // make the node the owner
                  removeShare(node);

                  vm.resourcePermissions.owner = node;

                  share.permission = 'write';
                  share.node = owner;
                  share.node.nodeType = 'user';
                  share.node.name = getName(share.node);
                  vm.resourcePermissions.shares.push(share);
                  saveShare(resource);
                }

              } else {

                // can we just update it
                if (!isOwner(node) && !updateAndSaveShare(node, permission, resource)) {

                  // create the new share for this group
                  share.permission = permission;
                  share.node = node;
                  share.node.name = getName(node);
                  vm.resourcePermissions.shares.push(share);
                  saveShare(resource);
                }
              }
              // scroll to this node
              $timeout(function () {
                var scroller = document.getElementById(domId);
                scroller.scrollTop = scroller.scrollHeight;
              }, 0, false);
            }
          }
        }
      }
    }
);
