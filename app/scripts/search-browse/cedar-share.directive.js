'use strict';

define([
      'angular',
      'cedar/template-editor/service/cedar-user',
    ], function (angular) {
      angular.module('cedar.templateEditor.searchBrowse.cedarShareDirective', [
        'cedar.templateEditor.service.cedarUser'
      ]).directive('cedarShare', cedarShareDirective);

      cedarShareDirective.$inject = ['CedarUser'];

      function cedarShareDirective(CedarUser) {

        var directive = {
          bindToController: {
            shareResource: '='
          },
          controller      : cedarShareController,
          controllerAs    : 'share',
          restrict        : 'E',
          scope           : {
            show: '='
          },
          templateUrl     : 'scripts/search-browse/cedar-share.directive.html'
        };

        return directive;

        cedarShareController.$inject = [
          '$location',
          '$timeout',
          '$scope',
          '$rootScope',
          '$translate',
          '$modal',
          'CedarUser',
          'resourceService',
          'UIMessageService',
          'UISettingsService',
          'AuthorizedBackendService',
          'CONST'
        ];

        function cedarShareController($location, $timeout, $scope, $rootScope, $translate, $modal, CedarUser, resourceService,
                                       UIMessageService, UISettingsService,
                                       AuthorizedBackendService, CONST) {
          var vm = this;

          // share
          vm.openShare = openShare;
          vm.saveShare = saveShare;
          vm.getNode = getNode;
          vm.canBeOwner = canBeOwner;
          vm.canUpdate = canUpdate;
          vm.addShare = addShare;
          vm.removeShare = removeShare;
          vm.updateNodePermission = updateNodePermission;
          vm.getName = getName;
          vm.selectedUserId = null;
          vm.giveUserPermission = 'read';
          vm.selectedGroupId = null;
          vm.giveGroupPermission = 'read';
          vm.selectedNodeId = null;
          vm.giveNodePermission = 'read';
          vm.userIsOriginalOwner = false;
          vm.userIsOriginalWriter = false;
          vm.everybodyIsOriginalWriter = false;
          vm.resourceUsers = null;
          vm.resourceGroups = null;
          vm.resourcePermissions = null;
          vm.resourceNodes = null;

          //vm.modalInstance = $modal.open('scripts/search-browse/cedar-share.directive.html');
          //
          //vm.modalInstance.opened.then(function() {
          //  console.log("OPENED!");
          //});

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
            var node = vm.shareSelectedNode;
            if (node != null) {
              var perms = node.currentUserPermissions;
              if (perms != null) {
                return perms.indexOf("write") != -1;
              }
            }
            return false;
          };

          vm.canChangeOwner = function () {
            var node = vm.shareSelectedNode;
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




          $scope.hideModal = function (id) {
            //jQuery('#' + id).modal('hide');
            console.log('hideodal');
          };

          $scope.openModal = function (id) {
            //jQuery('#' + id).modal('open');
            console.log('openModal');
          };


          //*********** ENTRY POINT
          init();

          function init() {
            console.log('vm.shareResource');
            console.log(vm.shareResource);
            console.log($modal);
          }

          function getSelection() {
            return vm.shareSelectedNode;
          }

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

          // get the node for this id
          function getNode(id) {
            if (vm.shareResourceNodes) {
              for (var i = 0; i < vm.shareResourceNodes.length; i++) {
                if (vm.shareResourceNodes[i].id === id) {
                  return vm.shareResourceNodes[i];
                }
              }
            }
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

          // initialize the share dialog
          function openShare(resource) {
            console.log('openShare');
            vm.selectedNodeId = null;
            vm.giveNodePermission = 'read';
            vm.userIsOriginalOwner = false;
            vm.userIsOriginalWriter = false;
            vm.everybodyIsOriginalWriter = false;
            vm.resourceUsers = null;
            vm.resourceGroups = null;
            vm.resourceNodes = null;
            vm.resourcePermissions = null;
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
                },
                function (error) {
                  UIMessageService.showBackendError('SERVER.' + resource.nodeType.toUpperCase() + '.load.error', error);
                }
            );
          };

          // get all the users and groups on the system
          function getNodes() {
            console.log('getNodes');

            // get the users
            resourceService.getUsers(
                function (response) {
                  vm.resourceUsers = response.users;
                  console.log(vm.resourceUsers);


                  // get groups
                  resourceService.getGroups(
                      function (response) {
                        vm.resourceGroups = response.groups;
                        console.log(vm.resourceGroups);

                        vm.resourceNodes = [];
                        vm.resourceNodes = vm.resourceNodes.concat(vm.resourceUsers);
                        vm.resourceNodes = vm.resourceNodes.concat(vm.resourceGroups);
                        for (var i = 0; i < vm.resourceNodes.length; i++) {
                          vm.resourceNodes[i].name = getName(vm.resourceNodes[i]);
                        }
                        vm.resourceNodes.sort(dynamicSort("name"));
                        if (vm.resourceNodes.length > 0) {
                          vm.selectedNodeId = vm.resourceNodes[0].id;
                        }


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
            console.log('updateNodePermisison');
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
                  share.permission = vm.giveNodePermission;
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




        }
      }

    }
);
