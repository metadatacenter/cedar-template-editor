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

    var currentUser = {'@id': 'user-one', firstName: 'Ada', lastName: 'Lovelace'};
    var anotherUser = {'@id': 'user-two', firstName: 'Grace', lastName: 'Hopper'};

    beforeEach(module('cedar.templateEditor.groups.controller'));

    beforeEach(inject(function (_$controller_, _$rootScope_) {
      $controller = _$controller_;
      $rootScope = _$rootScope_;
      updateGroupMembers = jasmine.createSpy('updateGroupMembers');

      controller = $controller('GroupsController', {
        $rootScope: $rootScope,
        CedarUser: {
          getUserId: function () {
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
          updateGroupMembers: updateGroupMembers
        },
        UIMessageService: {}
      });
    }));

    it('introduces groups as their own account-level page', function () {
      expect($rootScope.pageTitle).toBe('Groups');
      expect(controller.users[0].name).toBe('Ada Lovelace');
      expect(controller.users[1].name).toBe('Grace Hopper');
      expect(controller.groups[0].name).toBe('Everyone');
    });

    it('distinguishes a Group Administrator from an ordinary member', function () {
      controller.selectedGroup = {
        users: [
          {user: currentUser, administrator: true, member: true}
        ]
      };

      expect(controller.canAdministerSelectedGroup()).toBe(true);
      controller.selectedGroup.users[0].administrator = false;
      expect(controller.canAdministerSelectedGroup()).toBe(false);
    });

    it('adds only users who are not already members', function () {
      controller.selectedGroup = {
        users: [
          {user: currentUser, administrator: true, member: true}
        ]
      };

      expect(controller.availableMembers()).toEqual([anotherUser]);
      controller.newMember = anotherUser;
      controller.addMember();

      expect(controller.selectedGroup.users.length).toBe(2);
      expect(controller.selectedGroup.users[1].administrator).toBe(false);
      expect(updateGroupMembers).toHaveBeenCalled();
    });
  });
});
