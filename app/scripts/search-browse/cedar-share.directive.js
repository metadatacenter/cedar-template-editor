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

    function cedarShareController($location, $timeout, $scope, $rootScope, $translate, $modal, CedarUser,
                                  resourceService,
                                  UIMessageService, UISettingsService,
                                  AuthorizedBackendService, CONST) {
      var vm = this;

      // share
      vm.openShare = openShare;
      vm.saveShare = saveShare;
      vm.getNode = getNode;
      vm.canBeOwner = canBeOwner;
      vm.addShare = addShare;
      vm.removeShare = removeShare;
      vm.updateUserPermission = updateUserPermission;
      vm.updateGroupPermission = updateGroupPermission;
      vm.groupTypeaheadOnSelect = groupTypeaheadOnSelect;
      vm.addUserToGroup = addUserToGroup;
      vm.removePersonFromGroup = removePersonFromGroup;
      vm.canWriteGroup = canWriteGroup;
      vm.addGroup = addGroup;
      vm.getName = getName;
      vm.getSelectedGroup = getSelectedGroup;
      vm.hasSelectedGroup = hasSelectedGroup;
      vm.selectedUserId = null;
      vm.giveUserPermission = 'read';
      vm.selectedGroupId = null;
      vm.giveGroupPermission = 'read';
      vm.selectedNodeId = null;
      vm.giveNodePermission = 'read';
      vm.resourceUsers = null;
      vm.resourceGroups = null;
      vm.resourcePermissions = null;
      vm.resourceNodes = null;
      vm.showGroups = false;
      vm.showGroupMembers = true;
      vm.selectedResource = null;
      vm.typeaheadGroup = null;
      vm.typeaheadUser = null;
      vm.newGroupName = null;


      vm.autoCompleteUserId = null;

      //TODO remove when we have real data
      vm.fillDummyGroups = function (response) {
        var group = response[0];
        var dummyGroups = response;
        for (var i = 0; i < 10; i++) {
          var newGroup = jQuery.extend(true, {}, group);
          newGroup.id = newGroup.id + i;
          newGroup.displayName = newGroup.displayName + i;
          dummyGroups.push(newGroup);
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
              vm.selectedResource = response;
            },
            function (error) {
              UIMessageService.showBackendError('SERVER.' + resource.nodeType.toUpperCase() + '.load.error', error);
            }
        );
      };

      vm.canRead = function () {
        var node = getSelectedNode();
        if (node != null) {
          var perms = node.currentUserPermissions;
          if (perms != null) {
            return perms.indexOf("read") != -1;
          }
        }
        return false;
      };

      vm.canWrite = function () {
        var node = getSelectedNode();
        if (node != null) {
          var perms = node.currentUserPermissions;
          if (perms != null) {
            return perms.indexOf("write") != -1;
          }
        }
        return false;
      };

      function getSelectedNode() {
        return vm.selectedResource;
      }

      vm.canChangeOwner = function () {
        var node = getSelectedNode();
        if (node != null) {
          var perms = node.currentUserPermissions;
          if (perms != null) {
            return perms.indexOf("changeowner") != -1;
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
        jQuery('#' + id).modal('hide');
        console.log('hidemodal');
      };

      $scope.openModal = function (id) {
        jQuery('#' + id).modal('open');
        console.log('openModal');
      };

      function getSelection() {
        return vm.shareResource;
      }

      // is the node's owner the same as the current owner
      function isOwner(node) {
        if (vm.resourcePermissions && vm.resourcePermissions.owner && node) {
          return vm.resourcePermissions.owner.id === node.id;
        }
        return false;
      }

      // can ownership be assigned on this node by the current user
      function canBeOwner(id) {
        var node = getNode(id);
        return id && node && node.nodeType === 'user' && vm.canChangeOwner();
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
        vm.getResourceDetails(resource);
        vm.selectedNodeId = null;
        vm.selectedUserId = null;
        vm.selectedGroupId = null;
        vm.giveNodePermission = 'read';
        vm.resourceUsers = null;
        vm.resourceGroups = null;
        vm.resourceNodes = null;
        vm.resourcePermissions = null;
        vm.showGroups = false;
        vm.newGroupName = '';
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
                    vm.fillDummyGroups(vm.resourceGroups);
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


        // remove the share permission on this node
        function removeShare(node, resource) {
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
        function updateUserPermission(id) {
          if (id) {
            var node = getNode(id);
            if (node.nodeType === 'group' && vm.giveNodePermission === 'own') {
              vm.giveNodePermission = 'read';
            }
          }
        }

        // when selected user changes, reset selected permisison
        function addUserToGroup() {
          console.log('addUserToGroup ');
          console.log(vm.typeaheadUser);
          console.log(vm.typeaheadGroup);
        }

        // when selected user changes, reset selected permisison
        function updateGroupPermission(id) {
          if (id) {
            var node = getNode(id);
            if (node.nodeType === 'group' && vm.giveNodePermission === 'own') {
              vm.giveNodePermission = 'read';
            }
          }
        }

        // update the permission for this node
        function updateShare(node, permission, resource) {

          for (var i = 0; i < vm.resourcePermissions.shares.length; i++) {
            if (node.id === vm.resourcePermissions.shares[i].node.id) {
              vm.resourcePermissions.shares[i].permission = permission;
              saveShare(resource);
              return true;
            }
          }
          return false;
        }

        function addShare(id, permission, domId, resource) {
          console.log('addShare ' + id);

          var node = getNode(id);
          var share = {};
          if (node) {

            if (permission === 'own') {

              var owner = vm.resourcePermissions.owner;

              if (owner.id != id) {

                // make the node the owner
                removeShare(node, resource);

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
              if (!isOwner(node) && !updateShare(node, permission, resource)) {

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

        function groupTypeaheadOnSelect(item, model, label) {
          console.log('groupTypeaheadOnSelect ');
          console.log(item);
          console.log(model);
          console.log(label);

        }

        function removePersonFromGroup() {
          console.log('removePersonFromGroup');
        }

        function canWriteGroup() {
          return true;

        }

        // TODO add a new group by calling server, when done rebuild group selectors
        function addGroup(name) {

          var group = vm.resourceGroups[0];
          var newGroup = jQuery.extend(true, {}, group);
          newGroup.id = newGroup.id + 'new';
          newGroup.displayName = name;
          vm.resourceGroups.push(newGroup);


          // select the new group
          vm.typeaheadGroup = newGroup;
          vm.typeaheadGroup.name = getName(newGroup);
          vm.newGroupName = '';


          // resource nodes is the users and groups combined
          vm.resourceNodes = [];
          vm.resourceNodes = vm.resourceNodes.concat(vm.resourceUsers);
          vm.resourceNodes = vm.resourceNodes.concat(vm.resourceGroups);
          vm.selectedNodeId = initNodes(vm.resourceNodes);

          $timeout(function () {
            $scope.$apply();
          });


        }

        function hasSelectedGroup() {
          return vm.typeaheadGroup != null;
        }

        function getSelectedGroup() {
          return vm.typeaheadGroup;
        }

        $scope.$on('share-modal', function (event, resource) {
          vm.shareResource = resource;
          openShare(resource);
        });


      }
    }

  }

  )
  ;
