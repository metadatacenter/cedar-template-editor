'use strict';

define([
  'angular',
  'angularMocks',
  'cedar/template-editor/service/http-builder.service',
  'cedar/template-editor/service/resource.service'
], function () {

  describe('resourceService permission model:', function () {
    var service;
    var requests;

    beforeEach(module('cedar.templateEditor.service.httpBuilderService'));
    beforeEach(module('cedar.templateEditor.service.resourceService', function ($provide) {
      requests = [];
      $provide.value('AuthorizedBackendService', {
        doCall: function (request, success) {
          requests.push(request);
          success({data: {}});
        }
      });
      $provide.value('UISettingsService', {});
      $provide.value('UIUtilService', {});
      $provide.value('DataManipulationService', {});
      $provide.value('CedarUser', {});
      $provide.value('UrlService', {
        getTemplate: function () {
          return '/templates/resource-one';
        }
      });
      $provide.value('CONST', {resourceType: {TEMPLATE: 'template'}});
    }));

    beforeEach(inject(function (_resourceService_) {
      service = _resourceService_;
    }));

    it('keeps Editor separate from Manager and ownership', function () {
      var editor = {currentUserPermissions: {
        role: 'editor',
        capabilities: ['readResource', 'updateResource', 'deleteResource'],
        availableActions: ['copyFromResource'],
        canEdit: false
      }};
      var destination = {currentUserPermissions: {
        role: 'editor',
        capabilities: ['readResource', 'listFolderContents', 'createInFolder', 'copyIntoFolder', 'moveIntoFolder'],
        availableActions: []
      }};
      expect(service.canView(editor)).toBe(true);
      expect(service.canEdit(editor)).toBe(true);
      expect(service.canCreate(editor)).toBe(false);
      expect(service.canCopy(editor)).toBe(true);
      expect(service.canDelete(editor)).toBe(true);
      expect(service.canMove(editor)).toBe(false);
      expect(service.canManageGrants(editor)).toBe(false);
      expect(service.canTransferOwnership(editor)).toBe(false);
      expect(service.canCreate(destination)).toBe(true);
      expect(service.canCopyInto(destination)).toBe(true);
      expect(service.canCopy(destination)).toBe(false);
    });

    it('uses the dedicated conditional ownership-transfer endpoint', function () {
      service.transferResourceOwnership(
          {'@id': 'resource-one', resourceType: 'template'}, 'user-two', {$$cedarEtag: '"7"'},
          angular.noop, angular.noop);
      expect(requests[0].method).toBe('PATCH');
      expect(requests[0].url).toBe('/templates/resource-one/permissions');
      expect(requests[0].data).toEqual({newOwnerId: 'user-two'});
      expect(requests[0].headers['If-Match']).toBe('"7"');
    });
  });
});
