'use strict';

define([
  'angular',
  'angularMocks',
  'cedar/template-editor/modal/cedar-share-modal.directive'
], function () {
  describe('resource access dialog controller:', function () {
    var controller;
    var scope;
    var resource;
    var owner;
    var candidate;
    var group;
    var permissions;
    var transferResourceOwnership;
    var setResourceShare;
    var confirmedExecution;
    var flashSuccess;
    var refreshWorkspace;

    beforeEach(module('cedar.templateEditor.modal.cedarShareModalDirective', function ($provide) {
      $provide.value('CedarUser', {
        getUserFullId: function () {
          return owner['@id'];
        }
      });
    }));

    beforeEach(inject(function ($controller, $injector, $rootScope, $timeout) {
      resource = {'@id': 'template-one', 'schema:name': 'Study', resourceType: 'template'};
      owner = {'@id': 'user-one', firstName: 'Ada', lastName: 'Lovelace', resourceType: 'user'};
      candidate = {'@id': 'user-two', firstName: 'Grace', lastName: 'Hopper', resourceType: 'user'};
      group = {'@id': 'group-one', 'schema:name': 'Researchers', resourceType: 'group'};
      permissions = {
        owner: owner,
        userPermissions: [{user: candidate, role: 'viewer'}],
        groupPermissions: [{group: group, role: 'viewer'}]
      };

      transferResourceOwnership = jasmine.createSpy('transferResourceOwnership');
      setResourceShare = jasmine.createSpy('setResourceShare').and.callFake(function (selected, updated, success) {
        success(updated);
      });
      confirmedExecution = jasmine.createSpy('confirmedExecution');
      flashSuccess = jasmine.createSpy('flashSuccess');
      refreshWorkspace = jasmine.createSpy('refreshWorkspace');

      scope = $rootScope.$new();
      scope.$on('refreshWorkspace', refreshWorkspace);

      var directive = $injector.get('cedarShareModalDirective')[0];
      controller = $controller(directive.controller, {
        $timeout: $timeout,
        $scope: scope,
        $translate: {},
        $uibModal: {},
        CedarUser: {getUserFullId: function () { return owner['@id']; }},
        resourceService: {
          canView: function () { return true; },
          canEdit: function () { return true; },
          canTransferOwnership: function () { return true; },
          canManageGrants: function () { return true; },
          getResourceReport: function (selected, success) { success(selected); },
          getUsers: function (success) { success({users: [owner, candidate]}); },
          getGroups: function (success) { success({groups: [group]}); },
          getResourceShare: function (selected, success) { success(permissions); },
          setResourceShare: setResourceShare,
          transferResourceOwnership: transferResourceOwnership
        },
        UIMessageService: {
          confirmedExecution: confirmedExecution,
          flashSuccess: flashSuccess,
          showBackendError: jasmine.createSpy('showBackendError')
        },
        UISettingsService: {},
        AuthorizedBackendService: {},
        CONST: {}
      });

      scope.$broadcast('shareModalVisible', [true, resource]);
    }));

    it('requires confirmation before transferring ownership to a directly granted user', function () {
      var event = {
        preventDefault: jasmine.createSpy('preventDefault'),
        stopPropagation: jasmine.createSpy('stopPropagation')
      };

      controller.requestOwnershipTransfer(candidate, resource, event);

      expect(event.preventDefault).toHaveBeenCalled();
      expect(event.stopPropagation).toHaveBeenCalled();
      expect(transferResourceOwnership).not.toHaveBeenCalled();
      expect(confirmedExecution).toHaveBeenCalledWith(
          jasmine.any(Function),
          'DASHBOARD.share.confirmOwnershipTitle',
          'DASHBOARD.share.confirmOwnership',
          'GENERIC.Ok',
          {owner: 'Grace Hopper'});
    });

    it('closes and refreshes after transfer because the former owner may lose access', function () {
      confirmedExecution.and.callFake(function (operation) {
        operation();
      });
      transferResourceOwnership.and.callFake(function (selected, newOwnerId, currentPermissions, success) {
        success({
          owner: candidate,
          userPermissions: [],
          groupPermissions: [{group: group, role: 'viewer'}]
        });
      });

      controller.requestOwnershipTransfer(candidate, resource);

      expect(transferResourceOwnership).toHaveBeenCalledWith(
          resource, candidate['@id'], permissions, jasmine.any(Function), jasmine.any(Function));
      expect(controller.modalVisible).toBe(false);
      expect(refreshWorkspace).toHaveBeenCalledWith(
          jasmine.any(Object), [null]);
      expect(flashSuccess).toHaveBeenCalledWith(
          'SERVER.RESOURCE.access.ownership.success',
          {owner: 'Grace Hopper', resource: 'Study'},
          'GENERIC.Updated');
    });

    it('never offers ownership to a group', function () {
      controller.requestOwnershipTransfer(group, resource);

      expect(confirmedExecution).not.toHaveBeenCalled();
      expect(transferResourceOwnership).not.toHaveBeenCalled();
    });

    it('shows an access-updated toast after role and removal changes', function () {
      controller.addShare(candidate['@id'], 'editor', 'shared-users', resource);
      controller.removeShare(group, resource);

      expect(setResourceShare.calls.count()).toBe(2);
      expect(flashSuccess.calls.count()).toBe(2);
      expect(flashSuccess).toHaveBeenCalledWith(
          'SERVER.RESOURCE.access.update.success',
          {resource: 'Study'},
          'GENERIC.Updated');
    });
  });
});
