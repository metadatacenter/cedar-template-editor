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
    var getResourceShare;
    var getResourceReport;
    var getGroups;
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

      getResourceReport = jasmine.createSpy('getResourceReport').and.callFake(function (selected, success) { success(selected); });
      getGroups = jasmine.createSpy('getGroups').and.callFake(function (success) { success({groups: [group]}); });
      getResourceShare = jasmine.createSpy('getResourceShare').and.callFake(function (selected, success) {
        success(permissions);
      });
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
          getResourceReport: getResourceReport,
          getUsers: function (success) { success({users: [owner, candidate]}); },
          getGroups: getGroups,
          getResourceShare: getResourceShare,
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

    it('removes a grant using its ID even when the caller has a separate object', function () {
      controller.removeShare({'@id': group['@id']}, resource);
      expect(controller.shares.length).toBe(1);
      expect(controller.shares[0].node['@id']).toBe(candidate['@id']);
      // Removing access does not delete the group: it becomes available to add again.
      expect(controller.availablePrincipals()).toContain(group);
      expect(setResourceShare).toHaveBeenCalled();
    });

    it('clears the previous resource and grants while a new dialog is loading', function () {
      getResourceShare.and.stub();
      getResourceReport.and.stub();
      var next = {'@id': 'template-two', 'schema:name': 'Next', resourceType: 'template'};
      scope.$broadcast('shareModalVisible', [true, next]);
      expect(controller.shares).toBeNull();
      expect(controller.selectedResource).toBeNull();
      expect(controller.getResourceName()).toBe('Next');
      expect(controller.availablePrincipals()).toEqual([]);
      expect(controller.permissionsBusy()).toBe(true);
    });

    it('ignores old detail and directory responses after reopening the dialog', function () {
      getResourceReport.and.stub();
      getGroups.and.stub();
      scope.$broadcast('shareModalVisible', [true, resource]);
      var oldDetails = getResourceReport.calls.mostRecent().args[1];
      var oldGroups = getGroups.calls.mostRecent().args[0];
      var next = {'@id': 'template-two', 'schema:name': 'Next', resourceType: 'template'};
      scope.$broadcast('shareModalVisible', [true, next]);
      getResourceReport.calls.mostRecent().args[1](next);
      getGroups.calls.mostRecent().args[0]({groups: []});
      oldDetails(resource);
      oldGroups({groups: [group]});
      expect(controller.selectedResource).toBe(next);
      expect(controller.resourceGroups).toEqual([]);
      expect(controller.resourceNodes).not.toContain(group);
    });

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

    it('waits for a grant save before removing another grant or transferring ownership', function () {
      setResourceShare.and.stub();
      controller.removeShare(group, resource);
      controller.removeShare(candidate, resource);
      controller.addShare(candidate['@id'], 'manager', 'shared-users', resource);
      controller.requestOwnershipTransfer(candidate, resource);
      expect(setResourceShare.calls.count()).toBe(1);
      expect(controller.shares.length).toBe(1);
      expect(controller.shares[0].role).toBe('viewer');
      expect(confirmedExecution).not.toHaveBeenCalled();
      setResourceShare.calls.mostRecent().args[2]();
      controller.removeShare(candidate, resource);
      expect(setResourceShare.calls.count()).toBe(2);
    });

    it('blocks grant writes while ownership is being transferred', function () {
      confirmedExecution.and.callFake(function (operation) { operation(); });
      controller.requestOwnershipTransfer(candidate, resource);
      controller.removeShare(group, resource);
      controller.addShare(candidate['@id'], 'editor', 'shared-users', resource);
      expect(setResourceShare).not.toHaveBeenCalled();
      expect(controller.shares.length).toBe(2);
    });

    it('rechecks a pending ownership confirmation if a grant save has started', function () {
      controller.requestOwnershipTransfer(candidate, resource);
      setResourceShare.and.stub();
      controller.removeShare(group, resource);
      confirmedExecution.calls.mostRecent().args[0]();
      expect(transferResourceOwnership).not.toHaveBeenCalled();
    });

    it('waits for the recovery read after a rejected grant save', function () {
      setResourceShare.and.stub();
      getResourceShare.and.stub();
      controller.removeShare(group, resource);
      setResourceShare.calls.mostRecent().args[3]({status: 412});
      controller.removeShare(candidate, resource);
      expect(setResourceShare.calls.count()).toBe(1);
      getResourceShare.calls.mostRecent().args[1](permissions);
      controller.removeShare(candidate, resource);
      expect(setResourceShare.calls.count()).toBe(2);
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
