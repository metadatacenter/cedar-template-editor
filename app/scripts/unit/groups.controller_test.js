'use strict';

define([
  'angular',
  'angularMocks',
  'cedar/template-editor/groups/groups.controller'
], function () {
  describe('GroupsController:', function () {
    var $controller;
    var $rootScope;
    var controller;
    var updateGroupMembers;
    var getGroupMembers;
    var showBackendError;
    var flashSuccess;
    var confirmedExecution;
    var createGroup;
    var deleteGroup;
    var goBack;
    var groupPageTemplate;
    var groupDetailsTemplate;

    var currentUser = {'@id': 'https://repo.metadatacenter.org/users/user-one', firstName: 'Ada', lastName: 'Lovelace'};
    var anotherUser = {'@id': 'https://repo.metadatacenter.org/users/user-two', firstName: 'Grace', lastName: 'Hopper'};

    beforeEach(module('cedar.templateEditor.groups.controller'));
    beforeEach(module('my.templates'));

    beforeEach(inject(function (_$controller_, _$rootScope_, $templateCache) {
      $controller = _$controller_;
      $rootScope = _$rootScope_;
      groupPageTemplate = $templateCache.get('scripts/groups/groups.html?v=karma');
      groupDetailsTemplate = $templateCache.get('scripts/groups/group-details.html?v=karma');
      updateGroupMembers = jasmine.createSpy('updateGroupMembers');
      getGroupMembers = jasmine.createSpy('getGroupMembers').and.callFake(function (group, success) {
        success({users: [
          {user: currentUser, administrator: true, member: true}
        ]});
      });
      showBackendError = jasmine.createSpy('showBackendError');
      flashSuccess = jasmine.createSpy('flashSuccess');
      confirmedExecution = jasmine.createSpy('confirmedExecution').and.callFake(function (operation) {
        operation();
      });
      deleteGroup = jasmine.createSpy('deleteGroup').and.callFake(function (group, success) {
        success();
      });
      goBack = jasmine.createSpy('goBack');
      createGroup = jasmine.createSpy('createGroup').and.callFake(function (name, description, success) {
        success({'@id': 'new-group', 'schema:name': name});
      });

      controller = $controller('GroupsController', {
        $rootScope: $rootScope,
        CedarUser: {
          getUserId: function () {
            return 'user-one';
          },
          getUserFullId: function () {
            return currentUser['@id'];
          }
        },
        resourceService: {
          getUsers: function (success) {
            success({users: [anotherUser, currentUser]});
          },
          getGroups: function (success) {
            success({groups: [{'schema:name': 'Everybody', specialGroup: true}]});
          },
          getGroup: function (id, success) {
            success({'@id': id, 'schema:name': 'Researchers'});
          },
          createGroup: createGroup,
          deleteGroup: deleteGroup,
          getGroupMembers: getGroupMembers,
          updateGroupMembers: updateGroupMembers
        },
        UIMessageService: {
          showBackendError: showBackendError,
          flashSuccess: flashSuccess,
          confirmedExecution: confirmedExecution
        },
        PreviousRouteService: {
          goBack: goBack
        }
      });
    }));

    it('introduces groups as their own account-level page', function () {
      expect($rootScope.pageTitle).toBe('Groups');
      expect(controller.activeTab).toBe('manage');
      expect(controller.users[0].name).toBe('Ada Lovelace');
      expect(controller.users[1].name).toBe('Grace Hopper');
      expect(controller.groups[0].name).toBe('Everyone');
    });

    it('does not expose email addresses in the group member list', function () {
      expect(groupDetailsTemplate).not.toContain('member.user.email');
      expect(controller.getUserName({email: 'private@example.org'})).toBe('Unnamed user');
    });

    it('returns through the shared application back navigation', function () {
      expect(groupPageTemplate).toContain('ng-click="groups.goBack()"');

      controller.goBack();

      expect(goBack).toHaveBeenCalled();
    });

    it('separates group management from group creation', function () {
      controller.selectTab('create');
      expect(controller.activeTab).toBe('create');
      controller.selectTab('manage');
      expect(controller.activeTab).toBe('manage');
    });

    it('adds a description to a group choice only when one is present', function () {
      expect(groupPageTemplate).toContain('groups.getGroupOptionLabel(group)');
      expect(controller.getGroupOptionLabel({
        'schema:name': 'Researchers',
        'schema:description': 'Genomics team'
      })).toBe('Researchers - Genomics team');
      expect(controller.getGroupOptionLabel({
        'schema:name': 'Researchers',
        'schema:description': '   '
      })).toBe('Researchers');
    });

    it('stays on the creation tab after creating a group', function () {
      controller.selectTab('create');
      controller.newGroupName = 'New researchers';

      controller.createGroup();

      expect(createGroup).toHaveBeenCalled();
      expect(controller.activeTab).toBe('create');
      expect(controller.newGroupName).toBe('');
      expect(controller.createdGroup.name).toBe('New researchers');
      expect(controller.selectedGroup['@id']).toBe('new-group');
      expect(controller.canAdministerSelectedGroup()).toBe(true);
    });

    it('does not carry a newly created group into the management tab', function () {
      controller.selectTab('create');
      controller.newGroupName = 'New researchers';
      controller.createGroup();

      controller.selectTab('manage');

      expect(controller.activeTab).toBe('manage');
      expect(controller.selectedGroup).toBeNull();
      expect(controller.createdGroup.name).toBe('New researchers');
    });

    it('shows the complete group editor on the creation tab', function () {
      expect(groupPageTemplate).toContain('groups-created-group');
      expect(groupPageTemplate).toContain("'scripts/groups/group-details.html'");
      expect(groupPageTemplate).not.toContain('Manage {{groups.createdGroup.name}}');
      expect(groupPageTemplate).toContain('groups-primary-action');
      expect(groupDetailsTemplate).toContain('groups.saveGroupDetails()');
      expect(groupDetailsTemplate).toContain('groups.addMember()');
      expect(groupDetailsTemplate).toContain('groups.updateGroupAdministrator(member)');
      expect(groupDetailsTemplate).toContain('groups.deleteSelectedGroup()');
      expect((groupDetailsTemplate.match(/groups-primary-action/g) || []).length).toBe(2);
      expect(groupDetailsTemplate).toContain('groups-remove-member-wrapper');
      expect(groupDetailsTemplate).toContain('Assign another Group Administrator before removing this member.');
      expect((groupDetailsTemplate.match(/fa fa-trash/g) || []).length).toBe(2);
    });

    it('keeps group search separate from the selected group details', function () {
      controller.groupSearch = 'Researchers';
      controller.selectGroup({'@id': 'group-one'});

      expect(controller.groupSearch).toBe('');
      expect(controller.selectedGroup['schema:name']).toBe('Researchers');
    });

    it('reports a refused member list as not visible rather than as empty', function () {
      getGroupMembers.and.callFake(function (group, success, error) {
        error({status: 403});
      });

      controller.selectGroup({'@id': 'group-one'});

      // Leaving users unset is the point: an empty array renders as "this group has no members",
      // which would be a different and untrue claim about a group whose roster is simply not ours
      // to see.
      expect(controller.selectedGroup.users).toBeUndefined();
      expect(controller.selectedGroup.$$membersRestricted).toBe(true);
      expect(controller.canAdministerSelectedGroup()).toBe(false);
      expect(showBackendError).not.toHaveBeenCalled();
    });

    it('still reports a member list that failed for any other reason', function () {
      getGroupMembers.and.callFake(function (group, success, error) {
        error({status: 500});
      });

      controller.selectGroup({'@id': 'group-one'});

      expect(showBackendError).toHaveBeenCalled();
      expect(controller.selectedGroup.$$membersRestricted).not.toBe(true);
    });

    it('recognizes the signed-in user as a Group Administrator by CEDAR user ID', function () {
      controller.selectedGroup = {
        users: [
          {user: currentUser, administrator: true, member: true}
        ]
      };

      expect(controller.canAdministerSelectedGroup()).toBe(true);
      controller.selectedGroup.users[0].administrator = false;
      expect(controller.canAdministerSelectedGroup()).toBe(false);
    });

    it('does not remove the only Group Administrator', function () {
      var administrator = {user: currentUser, administrator: true, member: true};
      controller.selectedGroup = {
        'schema:name': 'Researchers',
        users: [administrator]
      };

      expect(controller.isOnlyGroupAdministrator(administrator)).toBe(true);
      controller.removeMember(administrator);

      expect(controller.selectedGroup.users).toEqual([administrator]);
      expect(updateGroupMembers).not.toHaveBeenCalled();
    });

    it('restores the only Group Administrator if its checkbox is cleared', function () {
      var administrator = {user: currentUser, administrator: false, member: true};
      controller.selectedGroup = {
        'schema:name': 'Researchers',
        users: [administrator]
      };

      controller.updateGroupAdministrator(administrator);

      expect(administrator.administrator).toBe(true);
      expect(updateGroupMembers).not.toHaveBeenCalled();
    });

    it('keeps the previous administrator state when assignment is cancelled', function () {
      var member = {user: anotherUser, administrator: false, member: true};
      controller.selectedGroup = {
        'schema:name': 'Researchers',
        users: [
          {user: currentUser, administrator: true, member: true},
          member
        ]
      };
      confirmedExecution.and.callFake(function () {});

      member.administrator = true;
      controller.updateGroupAdministrator(member);

      expect(member.administrator).toBe(false);
      expect(updateGroupMembers).not.toHaveBeenCalled();
      expect(confirmedExecution).toHaveBeenCalledWith(jasmine.any(Function),
          'DASHBOARD.groups.confirmAdministratorAssignTitle',
          'DASHBOARD.groups.confirmAdministratorAssign', 'GENERIC.Ok', {
            user: 'Grace Hopper',
            group: 'Researchers'
          });
    });

    it('confirms and saves removal of a Group Administrator', function () {
      var member = {user: anotherUser, administrator: true, member: true};
      controller.selectedGroup = {
        'schema:name': 'Researchers',
        users: [
          {user: currentUser, administrator: true, member: true},
          member
        ]
      };
      updateGroupMembers.and.callFake(function (group, success) {
        success({});
      });

      member.administrator = false;
      controller.updateGroupAdministrator(member);

      expect(member.administrator).toBe(false);
      expect(confirmedExecution).toHaveBeenCalledWith(jasmine.any(Function),
          'DASHBOARD.groups.confirmAdministratorRemoveTitle',
          'DASHBOARD.groups.confirmAdministratorRemove', 'GENERIC.Ok', {
            user: 'Grace Hopper',
            group: 'Researchers'
          });
      expect(updateGroupMembers).toHaveBeenCalled();
      expect(flashSuccess).toHaveBeenCalledWith(
          'SERVER.GROUPS.update.success', {title: 'Researchers'}, 'GENERIC.Updated');
    });

    it('requires confirmation before deleting a group and leaves it intact on cancel', function () {
      var group = {'@id': 'group-one', users: [
        {user: currentUser, administrator: true, member: true}
      ]};
      controller.selectedGroup = group;
      confirmedExecution.and.stub();

      controller.deleteSelectedGroup();

      expect(confirmedExecution).toHaveBeenCalledWith(jasmine.any(Function),
          'GENERIC.AreYouSure', 'DASHBOARD.share.confirmDeleteGroup', 'GENERIC.Remove');
      expect(deleteGroup).not.toHaveBeenCalled();
      expect(controller.selectedGroup).toBe(group);

      confirmedExecution.calls.mostRecent().args[0]();
      expect(deleteGroup).toHaveBeenCalledWith(group, jasmine.any(Function), jasmine.any(Function));
    });

    it('does not delete a different group when selection changes during confirmation', function () {
      controller.selectedGroup = {'@id': 'group-one', users: [
        {user: currentUser, administrator: true, member: true}
      ]};
      confirmedExecution.and.stub();
      controller.deleteSelectedGroup();
      controller.selectedGroup = {'@id': 'group-two', users: [
        {user: currentUser, administrator: true, member: true}
      ]};

      confirmedExecution.calls.mostRecent().args[0]();

      expect(deleteGroup).not.toHaveBeenCalled();
      expect(controller.selectedGroup['@id']).toBe('group-two');
    });

    it('uses the group-specific message after deleting a group', function () {
      var group = {
        'schema:name': 'Researchers',
        users: [
          {user: currentUser, administrator: true, member: true}
        ]
      };
      controller.groups = [group];
      controller.selectedGroup = group;

      controller.deleteSelectedGroup();

      expect(deleteGroup).toHaveBeenCalledWith(group, jasmine.any(Function), jasmine.any(Function));
      expect(flashSuccess).toHaveBeenCalledWith('SERVER.GROUPS.delete.success', {title: 'Researchers'}, 'GENERIC.Deleted');
    });

    it('adds only users who are not already members', function () {
      controller.selectedGroup = {
        'schema:name': 'Researchers',
        users: [
          {user: currentUser, administrator: true, member: true}
        ]
      };
      updateGroupMembers.and.callFake(function (group, success) {
        success({});
      });

      expect(controller.availableMembers()).toEqual([anotherUser]);
      controller.newMember = anotherUser;
      controller.addMember();

      expect(controller.selectedGroup.users.length).toBe(2);
      expect(controller.selectedGroup.users[1].administrator).toBe(false);
      expect(updateGroupMembers).toHaveBeenCalled();
      expect(flashSuccess).toHaveBeenCalledWith('SERVER.GROUPS.update.success', {title: 'Researchers'}, 'GENERIC.Updated');
    });

    it('shows the updated toast after removing a member', function () {
      var otherMember = {user: anotherUser, administrator: false, member: true};
      controller.selectedGroup = {
        'schema:name': 'Researchers',
        users: [
          {user: currentUser, administrator: true, member: true},
          otherMember
        ]
      };
      updateGroupMembers.and.callFake(function (group, success) {
        success({});
      });

      controller.removeMember(otherMember);

      expect(controller.selectedGroup.users.length).toBe(1);
      expect(updateGroupMembers).toHaveBeenCalled();
      expect(flashSuccess).toHaveBeenCalledWith(
          'SERVER.GROUPS.update.success', {title: 'Researchers'}, 'GENERIC.Updated');
    });

    it('waits for each membership save before accepting another edit', function () {
      var first = {user: anotherUser, administrator: false, member: true};
      var second = {user: {'@id': 'third-user'}, administrator: false, member: true};
      controller.selectedGroup = {users: [
        {user: currentUser, administrator: true, member: true}, first, second
      ]};

      controller.removeMember(first);
      controller.removeMember(second);
      controller.newMember = anotherUser;
      controller.addMember();
      second.administrator = true;
      controller.updateGroupAdministrator(second);

      expect(updateGroupMembers.calls.count()).toBe(1);
      expect(controller.selectedGroup.users.length).toBe(2);
      expect(second.administrator).toBe(false);
      updateGroupMembers.calls.mostRecent().args[1]({});
      controller.removeMember(second);
      expect(updateGroupMembers.calls.count()).toBe(2);
      expect(controller.selectedGroup.users.length).toBe(1);
    });

    it('blocks further edits until a failed save has reloaded membership', function () {
      var member = {user: anotherUser, administrator: false, member: true};
      var group = {users: [
        {user: currentUser, administrator: true, member: true}, member
      ]};
      controller.selectedGroup = group;
      getGroupMembers.and.stub();
      controller.removeMember(member);
      updateGroupMembers.calls.mostRecent().args[2]({status: 412});
      controller.newMember = anotherUser;
      controller.addMember();
      expect(updateGroupMembers.calls.count()).toBe(1);
      getGroupMembers.calls.mostRecent().args[1]({users: group.users});
      controller.addMember();
      expect(updateGroupMembers.calls.count()).toBe(2);
    });

    it('reloads membership when an optimistic member update fails', function () {
      controller.selectedGroup = {
        users: [
          {user: currentUser, administrator: true, member: true}
        ]
      };
      updateGroupMembers.and.callFake(function (group, success, error) {
        error({status: 412});
      });
      getGroupMembers.and.callFake(function (group, success) {
        success({users: [
          {user: currentUser, administrator: true, member: true}
        ]});
      });

      controller.newMember = anotherUser;
      controller.addMember();

      expect(getGroupMembers).toHaveBeenCalledWith(controller.selectedGroup, jasmine.any(Function), jasmine.any(Function));
      expect(controller.selectedGroup.users.length).toBe(1);
      expect(showBackendError).toHaveBeenCalled();
    });
  });
});
