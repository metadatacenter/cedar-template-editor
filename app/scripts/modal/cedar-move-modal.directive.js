'use strict';

define([
      'angular',
      'cedar/template-editor/service/cedar-user',
    ], function (angular) {
      angular.module('cedar.templateEditor.modal.cedarMoveModalDirective', [
        'cedar.templateEditor.service.cedarUser'
      ]).directive('cedarMoveModal', cedarMoveModalDirective);

      cedarMoveModalDirective.$inject = ['CedarUser'];

      function cedarMoveModalDirective(CedarUser) {

        cedarMoveModalController.$inject = [
          '$scope',
          '$uibModal',
          'CedarUser',
          '$timeout',
          '$translate',
          'resourceService',
          'UIMessageService',
          'UISettingsService', '$anchorScroll',
          'CONST'
        ];

        function cedarMoveModalController($scope, $uibModal, CedarUser, $timeout, $translate,
                                          resourceService,
                                          UIMessageService, UISettingsService, $anchorScroll,
                                          CONST) {
          var vm = this;


          // move to...
          vm.openHome = openHome;
          vm.openSpecialFolders = openSpecialFolders;
          vm.openParent = openParent;
          vm.currentTitle = currentTitle;
          vm.parentTitle = parentTitle;
          vm.selectCurrent = selectCurrent;
          vm.selectDestination = selectDestination;
          vm.isDestinationSelected = isDestinationSelected;
          vm.moveDisabled = moveDisabled;
          vm.updateResource = updateResource;
          vm.openDestination = openDestination;
          vm.getResourceIconClass = getResourceIconClass;
          vm.isFolder = isFolder;
          vm.canWrite = canWrite;
          vm.loadMore = loadMore;
          vm.hideModal = hideModal;
          vm.selectedDestination = null;
          vm.currentDestination = null;
          vm.currentDestinationID = null;
          vm.destinationPathInfo = null;
          vm.destinationPath = null;
          vm.resourceTypes = null;
          vm.sortOptionField = null;
          vm.offset = 0;
          vm.totalCount = -1;
          vm.isCommunity = false;
          // put this in scope so the unit tests can look at it
          $scope.destinationResources = [];


          function canWrite() {
            return hasPermission('canWrite');
          }

          function hasPermission(permission, resource) {
            const node = resource;
            if (node != null) {
              const perms = node.currentUserPermissions;
              if (perms != null) {
                return perms[permission];
              }
            }
            return false;
          }

          function openHome() {
            vm.offset = 0;
            vm.isCommunity = false;
            getDestinationById(vm.homeFolderId);
          }

          function openParent() {
            const length = vm.destinationPathInfo.length;
            const parent = vm.destinationPathInfo[length - 1];
            openDestination(parent);
          }

          function parentTitle() {
            let result = '';
            if (vm.destinationPathInfo && vm.destinationPathInfo.length > 1) {

              const length = vm.destinationPathInfo.length;
              const parent = vm.destinationPathInfo[length - 1];
              result = parent['schema:name'];

            }
            return result;
          }


          function moveEnabled() {
            return vm.moveResource && vm.selectedDestination && vm.selectedDestination['@id'] !== vm.currentFolderId;
          }

          function moveDisabled() {
            return !moveEnabled();
          }

          function refresh() {
            $scope.$broadcast('refreshWorkspace');
          }

          function updateResource() {

            if (moveEnabled()) {

              const folderId = vm.selectedDestination['@id'];
              const resource = vm.moveResource;

              resourceService.moveResource(
                  resource,
                  folderId,
                  function (response) {

                    UIMessageService.flashSuccess('SERVER.RESOURCE.moveResource.success',
                        {"title": resource['schema:name']},
                        'GENERIC.Moved');

                    refresh();
                  },
                  function (response) {
                    UIMessageService.showBackendError('SERVER.RESOURCE.moveResource.error', response);
                  }
              );
            }
          }

          function currentTitle() {
            return vm.currentDestination ? vm.currentDestination['schema:name'] : 'none';
          }

          function selectDestination(resource) {
            vm.selectedDestination = resource;
          }

          function selectCurrent() {
            vm.selectedDestination = vm.currentDestination;
          }

          function openDestination(resource) {
            vm.isCommunity = false;
            if (resource) {
              const id = resource['@id'];
              vm.offset = 0;
              getDestinationById(id);
              vm.selectedDestination = resource;
              vm.currentDestination = resource;
            }
          }


          function isDestinationSelected(resource) {
            if (resource == null || vm.selectedDestination == null) {
              return false;
            } else {
              return (vm.selectedDestination['@id'] === resource['@id']);
            }
          }

          function sortField() {
            if (vm.sortOptionField === 'name') {
              return 'name';
            } else {
              return '-' + vm.sortOptionField;
            }
          }

          // callback to load more resources for the current folder or search
          function loadMore() {
            if (vm.modalVisible) {
              vm.offset += UISettingsService.getRequestLimit();
              if (vm.offset < vm.totalCount) {
                getDestinationById(vm.currentDestinationID);
              }
            }
          }

          function getDestinationById(folderId) {
            const limit = UISettingsService.getRequestLimit();
            const offset = vm.offset;
            const resourceTypes = activeResourceTypes();
            if (resourceTypes.length > 0) {
              return resourceService.getResources(
                  {folderId: folderId, resourceTypes: resourceTypes, sort: sortField(), limit: limit, offset: offset},
                  function (response) {

                    vm.totalCount = response.totalCount;
                    vm.currentDestinationID = folderId;
                    if (vm.offset > 0) {
                      $scope.destinationResources = $scope.destinationResources.concat(response.resources);
                    } else {
                      $scope.destinationResources = response.resources;
                    }

                    const resource = response.pathInfo[response.pathInfo.length - 1];
                    vm.selectedDestination = resource;
                    vm.currentDestination = resource;
                    vm.destinationPathInfo = response.pathInfo;
                    //vm.destinationPath = vm.destinationPathInfo.pop();

                  },
                  function (error) {
                    UIMessageService.showBackendError('SERVER.FOLDER.load.error', error);
                  }
              );
            } else {
              $scope.destinationResources = [];
            }
          }


          function openSpecialFolders() {

            vm.isCommunity = true;

            vm.totalCount = -1;
            vm.offset = 0;
            vm.nextOffset = null;

            const limit = UISettingsService.getRequestLimit();
            const offset = vm.offset;
            const resourceTypes = activeResourceTypes();

            if (resourceTypes.length > 0) {

              resourceService.specialFolders(
                  {
                    resourceTypes: resourceTypes,
                    sort         : sortField(),
                    limit        : limit,
                    offset       : offset
                  },
                  function (response) {

                    if (vm.offset > 0) {
                      $scope.destinationResources = $scope.destinationResources.concat(response.resources);
                    } else {
                      $scope.destinationResources = response.resources;
                    }


                    vm.isSearching = true;
                    vm.nodeListQueryType = response.nodeListQueryType;
                    vm.breadcrumbTitle = $translate.instant("BreadcrumbTitle.specialFolders");
                    vm.nextOffset = getNextOffset(response.paging.next);
                    vm.totalCount = response.totalCount;
                    vm.loading = false;

                  },
                  function (error) {
                    UIMessageService.showBackendError('SERVER.SEARCH.error', error);
                  }
              );
            } else {
              $scope.destinationResources = [];
            }
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
          }

          function activeResourceTypes() {
            const activeResourceTypes = [];
            angular.forEach(Object.keys(vm.resourceTypes), function (value, key) {
              if (vm.resourceTypes[value]) {
                activeResourceTypes.push(value);
              }
            });
            // always want to show folders
            activeResourceTypes.push('folder');
            return activeResourceTypes;
          }

          function getResourceIconClass(resource) {
            let result = "";
            if (resource) {
              result += resource.resourceType + " ";

              switch (resource.resourceType) {
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
                  //result += "fa-sitemap";
                  //break;
              }
            }
            return result;
          }

          function isFolder(resource) {
            let result = false;
            if (resource) {
              result = (resource.resourceType == CONST.resourceType.FOLDER);
            }
            return result;
          }

          // on modal close, scroll to the top the cheap way
          function hideModal() {
            document.getElementById('moveModalContent').scrollTop = 0;
            vm.modalVisible = false;
          }

          // on modal open
          $scope.$on('moveModalVisible', function (event, params) {


            const visible = params[0];
            const resource = params[1];
            const currentPath = params[2];
            const currentFolderId = params[3];
            const homeFolderId = params[4];
            const resourceTypes = params[5];
            const sortOptionField = params[6];


            if (visible && resource) {
              vm.modalVisible = visible;
              vm.moveResource = resource;
              vm.currentPath = currentPath;
              vm.currentFolderId = currentFolderId;
              vm.homeFolderId = homeFolderId;
              vm.currentDestination = vm.currentPath;
              vm.resourceTypes = resourceTypes;
              vm.sortOptionField = sortOptionField;
              vm.selectedDestination = null;
              vm.offset = 0;
              getDestinationById(vm.currentFolderId);
            }
          });
        }

        return {
          bindToController: {
            moveResource: '=',
            modalVisible: '='
          },
          controller      : cedarMoveModalController,
          controllerAs    : 'move',
          restrict        : 'E',
          templateUrl     : 'scripts/modal/cedar-move-modal.directive.html'
        };
      }
    }
);
