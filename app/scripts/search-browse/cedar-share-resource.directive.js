'use strict';

define([
      'angular',
      'cedar/template-editor/service/cedar-user'
    ], function (angular) {
      angular.module('cedar.templateEditor.searchBrowse.cedarShareResourceDirective', [
        'cedar.templateEditor.service.cedarUser'
      ]).directive('cedarShareResource', cedarShareResourceDirective);

      cedarShareResourceDirective.$inject = ['CedarUser'];

      function cedarShareResourceDirective(CedarUser, cedarLiveSearchDirective) {

        var directive = {
          controller  : cedarShareResourceController,
          controllerAs: 'sc',
          //transclude  : true,
          restrict    : 'E',
          scope       : {},
          templateUrl : 'scripts/search-browse/cedar-share-resource.directive.html'
        };

        return directive;

        cedarShareResourceController.$inject = [
          '$location',
          '$timeout',
          '$scope',
          '$translate',
          'CedarUser',
          'resourceService',
          'UIMessageService',
          'CONST'
        ];

        function cedarShareResourceController($location, $timeout, $scope, $translate, CedarUser, resourceService,
                                              UIMessageService, CONST) {
          var vm = this;

          vm.openShare = openShare;
          vm.saveShare = saveShare;
          vm.getNode = getNode;
          vm.canBeOwner = canBeOwner;
          vm.addShare = addShare;
          vm.withShare = withShare;
          vm.removeShare = removeShare;
          vm.newOwner = newOwner;
          vm.getName = getName;

          vm.selectedUserId = null;
          vm.giveUserPermission = 'read';
          vm.selectedGroupId = null;
          vm.giveGroupPermission = 'read';
          vm.owner = 'own';
          vm.userIsOriginalOwner = false;
          // from server
          vm.resourceUsers = null;
          vm.resourceGroups = null;
          vm.resourcePermissions = null;

          // share...

          function userIsOwner() {

            var userId = CedarUser.getUserId();
            var ownerId = null;

            if (vm.resourcePermissions) {
              ownerId = vm.resourcePermissions.owner.id.substr(vm.resourcePermissions.owner.id.lastIndexOf('/') + 1);
            }

            return (ownerId === userId);
          }


          function canBeOwner(id) {
            var node = getNode(id);
            return id && node && node.nodeType === 'user' && vm.userIsOriginalOwner;
          }

          function newOwner(node, domId) {
            addShare(node.id, 'own', domId);
          }

          function withShare() {
            if (vm.resourcePermissions) {
              return vm.resourcePermissions.userPermissions;
            }
          }


          function dynamicSort(property) {
            var sortOrder = 1;
            if (property[0] === "-") {
              sortOrder = -1;
              property = property.substr(1);
            }
            return function (a, b) {
              var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
              return result * sortOrder;
            }
          }


          function updateShare(node, permission) {

            for (var i = 0; i < vm.resourcePermissions.userPermissions.length; i++) {
              if (node.id === vm.resourcePermissions.userPermissions[i].user.id) {
                vm.resourcePermissions.userPermissions[i].permission = permission;
                return true;
              }
            }
            for (var i = 0; i < vm.resourcePermissions.groupPermissions.length; i++) {
              if (node.id === vm.resourcePermissions.groupPermissions[i].group.id) {
                vm.resourcePermissions.groupPermissions[i].permission = permission;
                return true;
              }
            }
            return false;
          }


          function getNode(id) {
            var all = [];
            if (vm.resourceUsers) {
              all = all.concat(vm.resourceUsers);
            }
            if (vm.resourceGroups) {
              all = all.concat(vm.resourceGroups);
            }
            for (var i = 0; i < all.length; i++) {
              if (all[i].id === id) {
                return all[i];
              }
            }
          }

          function isUser(node) {
            return (node && node.nodeType === 'user');
          }

          function openShare(resource) {
            vm.selectedUserId = null;
            vm.giveUserPermission = 'read';
            vm.selectedGroupId = null;
            vm.giveGroupPermission = 'read';
            vm.owner = 'own';
            vm.userIsOriginalOwner = false;

            vm.resourceUsers = null;
            vm.resourceGroups = null;
            vm.resourcePermissions = null;

            getUsers();
            getGroups();
            getPermissions(resource);
          };

          function saveShare(resource) {
            setPermissions(resource);
          };

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
                },
                function (error) {
                  UIMessageService.showBackendError('SERVER.' + resource.nodeType.toUpperCase() + '.load.error', error);
                }
            );
          };

          function setPermissions(resource) {

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

          function isOwner(node) {
            if (vm.resourcePermissions && vm.resourcePermissions.owner && node) {
              return vm.resourcePermissions.owner.id === node.id;
            }
            return false;

          }

          function removeShare(node) {
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


          function getName(node) {
            if (node) {
              return node.firstName + ' ' + node.lastName + ' (' + node.email + ')';
            }

          }

          function addShare(id, permission, domId, nodeType) {

            var node = getNode(id);
            var share = {};
            if (node) {

              if (permission === 'own') {


                // make the node the owner
                removeShare(node);
                var owner = vm.resourcePermissions.owner;
                vm.resourcePermissions.owner = node;

                share.permission = 'write';
                share.user = owner;
                vm.resourcePermissions.userPermissions.push(share);

              } else {
                // can we just update it

                if (!isOwner(node) && !updateShare(node, permission)) {

                  if (nodeType === 'group') {
                    // create the new share for this group
                    share.permission = vm.giveGroupPermission;
                    share.group = node;
                    vm.resourcePermissions.groupPermissions.push(share);

                  } else {
                    // create the new share for this user
                    share.permission = vm.giveUserPermission;
                    share.user = node;
                    vm.resourcePermissions.userPermissions.push(share);
                  }
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
