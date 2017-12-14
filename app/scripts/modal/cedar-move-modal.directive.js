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

        var directive = {
          bindToController: {
            moveResource: '=',
            modalVisible: '='
          },
          controller      : cedarMoveModalController,
          controllerAs    : 'move',
          restrict        : 'E',
          templateUrl     : 'scripts/modal/cedar-move-modal.directive.html'
        };

        return directive;

        cedarMoveModalController.$inject = [
          '$scope',
          '$uibModal',
          'CedarUser',
          '$timeout',
          'resourceService',
          'UIMessageService',
          'UISettingsService','$anchorScroll',
          'CONST'
        ];

        function cedarMoveModalController($scope, $uibModal, CedarUser, $timeout,
                                          resourceService,
                                          UIMessageService,UISettingsService, $anchorScroll,
                                          CONST) {
          var vm = this;


          // move to...
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
          vm.totalCount = null;

          // put this in scope so the unit tests can look at it
          $scope.destinationResources = [];


          function canWrite() {
            return hasPermission('write');
          };

          function hasPermission(permission, resource) {
            var node = resource;
            if (node != null) {
              var perms = node.currentUserPermissions;
              if (perms != null) {

                return perms.indexOf(permission) != -1;
              }
            }
            return false;
          };

          function openParent() {

            var length = vm.destinationPathInfo.length;
            var parent = vm.destinationPathInfo[length - 1];
            openDestination(parent);
          }

          function parentTitle() {
            var result = '';
            if (vm.destinationPathInfo && vm.destinationPathInfo.length > 1) {

              var length = vm.destinationPathInfo.length;
              var parent = vm.destinationPathInfo[length - 1];
              result = parent.displayName;

            }
            return result;
          }

          function updateResource() {

            if (vm.selectedDestination) {
              var folderId = vm.selectedDestination['@id'];

              if (vm.moveResource) {
                var resource = vm.moveResource;

                resourceService.moveResource(
                    resource,
                    folderId,
                    function (response) {

                      UIMessageService.flashSuccess('SERVER.RESOURCE.moveResource.success', {"title": resource.name},
                          'GENERIC.Moved');

                      refresh();
                    },
                    function (response) {
                      UIMessageService.showBackendError('SERVER.RESOURCE.moveResource.error', response);
                    }
                );

              }
            }
          }

          function refresh() {
            $scope.$broadcast('refreshWorkspace');
          }

          function currentTitle() {
            return vm.currentDestination ? vm.currentDestination.displayName : 'none';
          }

          function selectDestination(resource) {
            vm.selectedDestination = resource;
          }

          function selectCurrent() {
            vm.selectedDestination = vm.currentDestination;
          }

          function openDestination(resource) {
            if (resource) {
              var id = resource['@id'];
              getDestinationById(id);
              vm.selectedDestination = resource;
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

          function sortField() {
            if (vm.sortOptionField == 'name') {
              return 'name';
            } else {
              return '-' + vm.sortOptionField;
            }
          }

          // callback to load more resources for the current folder or search
          function loadMore() {
            if ( vm.modalVisible) {
              vm.offset += UISettingsService.getRequestLimit();
              var offset = vm.offset;
              var folderId = vm.currentFolderId;
              var resourceTypes = activeResourceTypes();

              // are there more?
              if (offset < vm.totalCount) {
                getDestinationById(folderId);
              }
            }
          };

          function getDestinationById(folderId) {
            var limit = UISettingsService.getRequestLimit();
            var offset = vm.offset;
            var resourceTypes = activeResourceTypes();
            if (resourceTypes.length > 0) {
              return resourceService.getResources(
                  {folderId: folderId, resourceTypes: resourceTypes, sort: sortField(), limit: limit, offset: offset},
                  function (response) {

                    vm.totalCount = response.totalCount;
                    vm.currentDestinationID = folderId;
                    if (vm.offset > 0) {
                      $scope.destinationResources =  $scope.destinationResources.concat(response.resources);
                    } else {
                      $scope.destinationResources = response.resources;
                    }

                    vm.destinationPathInfo = response.pathInfo;
                    vm.destinationPath = vm.destinationPathInfo.pop();

                    vm.selectCurrent();

                  },
                  function (error) {
                    UIMessageService.showBackendError('SERVER.FOLDER.load.error', error);
                  }
              );
            } else {
              console.log('set destinationResorces to null');
              $scope.destinationResources = [];
            }
          }

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

          function isFolder(resource) {
            var result = false;
            if (resource) {
              result = (resource.nodeType == CONST.resourceType.FOLDER);
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


            var visible = params[0];
            var resource = params[1];
            var currentPath = params[2];
            var currentFolderId = params[3];
            var resourceTypes = params[4];
            var sortOptionField = params[5];



            if (visible && resource) {
              vm.modalVisible = visible;
              vm.moveResource = resource;
              vm.currentPath = currentPath;
              vm.currentFolderId = currentFolderId;
              vm.currentDestination = vm.currentPath;
              vm.resourceTypes = resourceTypes;
              vm.sortOptionField = sortOptionField;
              vm.selectedDestination = null;
              vm.offset = 0;
              getDestinationById(vm.currentFolderId);
            }
          });
        }
      }
    }
);
