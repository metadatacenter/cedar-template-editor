'use strict';

define(['angular'], function (angular) {
  angular.module('cedar.templateEditor.groups.controller', [])
      .controller('GroupsController', GroupsController);

  GroupsController.$inject = ['$rootScope', 'CedarUser', 'resourceService', 'UIMessageService', 'PreviousRouteService'];

  function GroupsController($rootScope, CedarUser, resourceService, UIMessageService, PreviousRouteService) {
    var vm = this;

    vm.groups = [];
    vm.users = [];
    vm.activeTab = 'manage';
    vm.selectedGroup = null;
    vm.groupSearch = '';
    vm.createdGroup = null;
    vm.newGroupName = '';
    vm.newMember = null;
    vm.editName = '';
    vm.editDescription = '';

    vm.getUserName = getUserName;
    vm.getGroupOptionLabel = getGroupOptionLabel;
    vm.goBack = goBack;
    vm.selectTab = selectTab;
    vm.selectGroup = selectGroup;
    vm.createGroup = createGroup;
    vm.saveGroupDetails = saveGroupDetails;
    vm.deleteSelectedGroup = deleteSelectedGroup;
    vm.addMember = addMember;
    vm.removeMember = removeMember;
    vm.updateGroupAdministrator = updateGroupAdministrator;
    vm.canAdministerSelectedGroup = canAdministerSelectedGroup;
    vm.isOnlyGroupAdministrator = isOnlyGroupAdministrator;
    vm.availableMembers = availableMembers;

    $rootScope.pageTitle = 'Groups';
    loadGroups();

    function goBack() {
      PreviousRouteService.goBack();
    }

    function getUserName(user) {
      if (!user) {
        return '';
      }
      return ((user.firstName || '') + ' ' + (user.lastName || '')).trim() || 'Unnamed user';
    }

    function selectTab(tab) {
      if (tab === 'manage' || tab === 'create') {
        vm.activeTab = tab;
        if (tab === 'manage' && vm.createdGroup && vm.selectedGroup &&
            vm.selectedGroup['@id'] === vm.createdGroup['@id']) {
          vm.selectedGroup = null;
          vm.groupSearch = '';
          vm.newMember = null;
        }
        if (tab === 'create' && vm.createdGroup &&
            (!vm.selectedGroup || vm.selectedGroup['@id'] !== vm.createdGroup['@id'])) {
          selectGroup(vm.createdGroup);
        }
      }
    }

    function groupName(group) {
      if (!group) {
        return '';
      }
      return group.specialGroup ? 'Everyone' : group['schema:name'];
    }

    function getGroupOptionLabel(group) {
      var name = groupName(group);
      var description = group && (group['schema:description'] || '').trim();
      return description ? name + ' - ' + description : name;
    }

    function sortByName(items, nameFunction) {
      items.sort(function (left, right) {
        return nameFunction(left).localeCompare(nameFunction(right));
      });
    }

    function loadGroups() {
      resourceService.getUsers(function (response) {
        vm.users = response.users || [];
        for (var i = 0; i < vm.users.length; i++) {
          vm.users[i].name = getUserName(vm.users[i]);
        }
        sortByName(vm.users, getUserName);
      }, function (error) {
        UIMessageService.showBackendError('SERVER.USERS.load.error', error);
      });

      resourceService.getGroups(function (response) {
        vm.groups = response.groups || [];
        for (var i = 0; i < vm.groups.length; i++) {
          vm.groups[i].name = groupName(vm.groups[i]);
        }
        sortByName(vm.groups, groupName);
      }, function (error) {
        UIMessageService.showBackendError('SERVER.GROUPS.load.error', error);
      });
    }

    function selectGroup(group) {
      if (!group) {
        return;
      }
      resourceService.getGroup(group['@id'], function (current) {
        vm.selectedGroup = current;
        vm.groupSearch = '';
        vm.selectedGroup.name = groupName(current);
        vm.editName = groupName(current);
        vm.editDescription = current['schema:description'] || '';
        loadMembers(current);
      }, function (error) {
        UIMessageService.showBackendError('SERVER.GROUPS.load.error', error);
      });
    }

    function loadMembers(group) {
      resourceService.getGroupMembers(group, function (response) {
        group.users = response.users || [];
        sortByName(group.users, function (entry) {
          return getUserName(entry.user);
        });
      }, function (error) {
        UIMessageService.showBackendError('SERVER.GROUPS.load.error', error);
      });
    }

    function createGroup() {
      var name = (vm.newGroupName || '').trim();
      if (!name) {
        return;
      }
      resourceService.createGroup(name, '', function (created) {
        created.name = groupName(created);
        vm.createdGroup = created;
        vm.groups.push(created);
        sortByName(vm.groups, groupName);
        vm.newGroupName = '';
        selectGroup(created);
        UIMessageService.flashSuccess('SERVER.GROUPS.create.success', {title: name}, 'GENERIC.Created');
      }, function (error) {
        UIMessageService.showBackendError('SERVER.GROUPS.create.error', error);
      });
    }

    function canAdministerSelectedGroup() {
      var group = vm.selectedGroup;
      var currentUserId = CedarUser.getUserFullId();
      if (!group || group.specialGroup || !angular.isArray(group.users)) {
        return false;
      }
      return group.users.some(function (entry) {
        return entry.administrator && entry.user && entry.user['@id'] === currentUserId;
      });
    }

    function isOnlyGroupAdministrator(member) {
      if (!member || !member.administrator || !vm.selectedGroup || !angular.isArray(vm.selectedGroup.users)) {
        return false;
      }
      return vm.selectedGroup.users.filter(function (entry) {
        return entry.administrator;
      }).length === 1;
    }

    function saveGroupDetails() {
      if (!canAdministerSelectedGroup()) {
        return;
      }
      var name = (vm.editName || '').trim();
      if (!name) {
        return;
      }
      vm.selectedGroup['schema:name'] = name;
      vm.selectedGroup['schema:description'] = (vm.editDescription || '').trim();
      resourceService.updateGroup(vm.selectedGroup, function () {
        vm.selectedGroup.name = name;
        sortByName(vm.groups, groupName);
        UIMessageService.flashSuccess('SERVER.GROUPS.update.success', {title: name}, 'GENERIC.Updated');
      }, function (error) {
        UIMessageService.showBackendError('SERVER.GROUPS.update.error', error);
      });
    }

    function deleteSelectedGroup() {
      if (!canAdministerSelectedGroup()) {
        return;
      }
      UIMessageService.confirmedExecution(function () {
        var group = vm.selectedGroup;
        var name = groupName(group);
        resourceService.deleteGroup(group, function () {
          var index = vm.groups.indexOf(group);
          if (index !== -1) {
            vm.groups.splice(index, 1);
          }
          if (vm.createdGroup && vm.createdGroup['@id'] === group['@id']) {
            vm.createdGroup = null;
          }
          vm.selectedGroup = null;
          UIMessageService.flashSuccess('SERVER.GROUPS.delete.success', {title: name}, 'GENERIC.Deleted');
        }, function (error) {
          UIMessageService.showBackendError('SERVER.GROUPS.delete.error', error);
        });
      }, 'GENERIC.AreYouSure', 'DASHBOARD.share.confirmDeleteGroup', 'GENERIC.Remove');
    }

    function availableMembers() {
      if (!vm.selectedGroup || !angular.isArray(vm.selectedGroup.users)) {
        return vm.users;
      }
      return vm.users.filter(function (user) {
        return !vm.selectedGroup.users.some(function (entry) {
          return entry.user && entry.user['@id'] === user['@id'];
        });
      });
    }

    function addMember() {
      if (!vm.newMember || !canAdministerSelectedGroup()) {
        return;
      }
      vm.selectedGroup.users.push({
        user: vm.newMember,
        administrator: false,
        member: true
      });
      vm.newMember = null;
      saveMembers();
    }

    function removeMember(member) {
      if (!canAdministerSelectedGroup() || isOnlyGroupAdministrator(member)) {
        return;
      }
      var index = vm.selectedGroup.users.indexOf(member);
      if (index !== -1) {
        vm.selectedGroup.users.splice(index, 1);
        saveMembers();
      }
    }

    function updateGroupAdministrator(member) {
      if (!member || !vm.selectedGroup || vm.selectedGroup.specialGroup) {
        return;
      }

      // ng-change runs after Angular has changed the checkbox. Restore the saved state while the
      // confirmation is open, then apply the requested state only when the user confirms it.
      var makeAdministrator = !!member.administrator;
      member.administrator = !makeAdministrator;
      if (!canAdministerSelectedGroup() || (!makeAdministrator && isOnlyGroupAdministrator(member))) {
        return;
      }

      UIMessageService.confirmedExecution(function () {
        member.administrator = makeAdministrator;
        saveMembers();
      }, makeAdministrator ?
          'DASHBOARD.groups.confirmAdministratorAssignTitle' :
          'DASHBOARD.groups.confirmAdministratorRemoveTitle', makeAdministrator ?
          'DASHBOARD.groups.confirmAdministratorAssign' :
          'DASHBOARD.groups.confirmAdministratorRemove', 'GENERIC.Ok', {
        user: getUserName(member.user),
        group: groupName(vm.selectedGroup)
      });
    }

    function saveMembers() {
      var group = vm.selectedGroup;
      resourceService.updateGroupMembers(group, function () {
        UIMessageService.flashSuccess('SERVER.GROUPS.update.success', {title: groupName(group)}, 'GENERIC.Updated');
      }, function (error) {
        // Membership changes are optimistic in the UI. Reload the server representation on failure
        // so an unsaved row or administrator change is not presented as current state.
        if (vm.selectedGroup === group) {
          loadMembers(group);
        }
        UIMessageService.showBackendError('SERVER.GROUPS.update.error', error);
      });
    }
  }
});
