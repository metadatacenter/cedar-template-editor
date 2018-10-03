'use strict';

define([
      'angular',
      'cedar/template-editor/service/cedar-user',
    ], function (angular) {
      angular.module('cedar.templateEditor.modal.cedarCopyModalDirective', [
        'cedar.templateEditor.service.cedarUser'
      ]).directive('cedarCopyModal', cedarCopyModalDirective);

      cedarCopyModalDirective.$inject = ['CedarUser'];

      function cedarCopyModalDirective(CedarUser) {

        var directive = {
          bindToController: {
            copyResource: '=',
            modalVisible: '='
          },
          controller      : cedarCopyModalController,
          controllerAs    : 'copyto',
          restrict        : 'E',
          templateUrl     : 'scripts/modal/cedar-copy-modal.directive.html'
        };

        return directive;

        cedarCopyModalController.$inject = [
          '$scope',
          '$uibModal',
          'CedarUser',
          '$timeout',
          '$translate',
          'resourceService',
          'UIMessageService',
          'UISettingsService',
          'CONST'
        ];

        function cedarCopyModalController($scope, $uibModal, CedarUser, $timeout, $translate,
                                          resourceService,
                                          UIMessageService,UISettingsService,
                                          CONST) {
          var vm = this;

          // copy to...
          vm.openHome = openHome;
          vm.openParent = openParent;
          vm.currentTitle = currentTitle;
          vm.parentTitle = parentTitle;
          vm.selectCurrent = selectCurrent;
          vm.selectDestination = selectDestination;
          vm.isDestinationSelected = isDestinationSelected;
          vm.copyDisabled = copyDisabled;
          vm.updateResource = updateResource;
          vm.openDestination = openDestination;
          vm.getResourceIconClass = getResourceIconClass;
          vm.loadMore = loadMore;
          vm.isFolder = isFolder;
          vm.canWrite = canWrite;
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
          $scope.destinationResources = [];

          function canWrite() {
            return hasPermission('canWrite');
          }

          function hasPermission(permission, resource) {
            var node = resource;
            if (node != null) {
              var perms = node.currentUserPermissions;
              if (perms != null) {
                return perms[permission];
              }
            }
            return false;
          }

          function openHome() {
            vm.offset = 0;
            getDestinationById(vm.homeFolderId);
          }

          function openParent() {
            vm.offset = 0;
            var length = vm.destinationPathInfo.length;
            var parent = vm.destinationPathInfo[length - 1];
            openDestination(parent);
          }

          function parentTitle() {
            var result = '';
            if (vm.destinationPathInfo && vm.destinationPathInfo.length > 1) {

              var length = vm.destinationPathInfo.length;
              var parent = vm.destinationPathInfo[length - 1];
              result = parent['schema:name'];

            }
            return result;
          }

          function updateResource() {

            if (vm.selectedDestination) {
              var folderId = vm.selectedDestination['@id'];

              if (vm.copyResource) {
                var resource = vm.copyResource;
                var newTitle = resource['schema:name'];
                var sameFolder = vm.currentFolderId === folderId;
                if (sameFolder) {
                  newTitle = $translate.instant('GENERIC.CopyOfTitle', {"title": resource['schema:name']});
                }

                resourceService.copyResource(
                    resource,
                    folderId,
                    newTitle,
                    function (response) {

                      UIMessageService.flashSuccess('SERVER.RESOURCE.copyToResource.success', {"title": resource['schema:name']},
                          'GENERIC.Copied');

                      if (sameFolder) {
                        refresh();
                      }

                    },
                    function (response) {
                      UIMessageService.showBackendError('SERVER.RESOURCE.copyToResource.error', response);
                    }
                );
              }
            }
          }

          function refresh() {
            $scope.$broadcast('refreshWorkspace', [vm.copyResource]);
          }

          function currentTitle() {
            return vm.currentDestination ? vm.currentDestination['schema:name'] : '';
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
              vm.offset = 0;
              getDestinationById(id);
              vm.selectedDestination = resource;
              vm.currentDestination = resource;
            }
          }

          function copyDisabled() {
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
              if (vm.offset < vm.totalCount) {
                getDestinationById(vm.currentDestinationID);
              }
            }
          };

          function getDestinationById(folderId) {
            if (folderId) {
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
                        $scope.destinationResources = $scope.destinationResources.concat(response.resources);
                      } else {
                        $scope.destinationResources = response.resources;
                      }

                      var resource = response.pathInfo[response.pathInfo.length - 1];
                      vm.selectedDestination = resource;
                      vm.currentDestination = resource;
                      vm.destinationPathInfo = response.pathInfo;
                      vm.destinationPath = vm.destinationPathInfo.pop();

                    },
                    function (error) {
                      UIMessageService.showBackendError('SERVER.FOLDER.load.error', error);
                    }
                );
              } else {
                $scope.destinationResources = [];
              }
            }
          }

          function activeResourceTypes() {
            var activeResourceTypes = [];
            angular.forEach(Object.keys(vm.resourceTypes), function (value, key) {
              if (vm.resourceTypes[value]) {
                activeResourceTypes.push(value);
              }
            });
            // always want to show folders, elements and field
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
            document.getElementById('copyModalContent').scrollTop = 0;
            vm.modalVisible = false;
          }

          // modal open or closed
          $scope.$on('copyModalVisible', function (event, params) {

            var visible = params[0];
            var resource = params[1];
            var currentPath = params[2];
            var currentFolderId = params[3];
            var homeFolderId = params[4];
            var resourceTypes = params[5];
            var sortOptionField = params[6];

            if (visible && resource) {
              vm.modalVisible = visible;
              vm.copyResource = resource;
              vm.currentPath = currentPath;
              vm.currentFolderId = currentFolderId;
              vm.homeFolderId = homeFolderId;
              vm.currentDestination = vm.currentPath;
              vm.resourceTypes = resourceTypes;
              vm.sortOptionField = sortOptionField;
              vm.selectedDestination = null;
              vm.offset = 0;
              // TODO scroll to top
              getDestinationById(vm.currentFolderId);
            }
          });
        }
      }
    }
);
