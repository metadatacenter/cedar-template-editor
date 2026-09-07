'use strict';

define(['angular', 'angularMocks', 'text!resources/i18n/locale-en.json'], function (angular, angularMocks, localeText) {
  describe('resource access dialog:', function () {
    var template;
    var pickerTemplate;

    beforeEach(module('my.templates'));

    beforeEach(inject(function ($templateCache) {
      template = $templateCache.get('scripts/modal/cedar-share-modal.directive.html?v=karma');
      pickerTemplate = $templateCache.get('scripts/search-browse/cedar-search-browse-picker.directive.html?v=karma');
    }));

    it('keeps the dialog content mounted while Bootstrap controls visibility', function () {
      expect(template).toContain('<div class="modal-content">');
      expect(template).not.toContain('ng-if="dc.shareModalVisible"');
      expect(pickerTemplate).toContain('cedar-share-modal cedar-modal-show modal-visible="dc.shareModalVisible" class="modal"');
      expect(pickerTemplate).not.toContain('cedar-share-modal cedar-modal-show modal-visible="dc.shareModalVisible" class="modal fade"');
    });

    it('uses one flow for adding users and groups', function () {
      expect(template).toContain('<h4>Permissions</h4>');
      expect(template).toContain('Add users or groups');
      expect(template).toContain('User or group');
      expect(template).toContain('Access on this resource');
      expect(template).not.toContain('people');
      expect(template).toContain('<span class="share-access-header-type">Type</span>');
      expect(template).toContain('share-principal-kind share-principal-type');
    });

    it('uses role vocabulary everywhere permissions are presented', function () {
      var locale = JSON.parse(localeText);

      expect(template).toContain('value="viewer">Viewer</option>');
      expect(template).toContain('value="editor">Editor</option>');
      expect(template).toContain('value="manager">Manager</option>');
      expect(locale.DASHBOARD.info.ReadPermission).toBe('Viewer');
      expect(locale.DASHBOARD.info.WritePermission).toBe('Manager');
    });

    it('keeps ownership separate from ordinary role grants', function () {
      expect(template).toContain('share-access-header-owner');
      expect(template).toContain('share-owner-access-row');
      expect(template).toContain('type="checkbox" checked disabled');
      expect(template).toContain('<span class="share-role-static" aria-label="Ownership is separate from roles"></span>');
      expect(template).toContain('aria-label="The owner cannot be removed"');
      expect(template).toContain('share.requestOwnershipTransfer(sh.node, share.shareResource, $event)');
      expect(template).toContain("sh.node.resourceType === 'group'");
      expect(template).not.toContain('share-transfer-link');
      expect(template).not.toContain('share-transfer-panel');
      expect(template).not.toContain("value=\"owner\"");
    });

    it('uses the same compact bin action as the group member list', function () {
      expect((template.match(/class="fa fa-trash"/g) || []).length).toBe(2);
      expect(template).not.toContain('class="fa fa-times"');
    });

    it('explains folder inheritance without embedding group administration', function () {
      expect(template).toContain('Access granted here also applies to the resources this folder contains.');
      expect(template).not.toContain('enter new group name');
      expect(template).not.toContain("share.model.show == 'groups'");
      expect(template).not.toContain('Manage groups');
      expect(template).toContain('aria-label="Done"');
    });
  });
});
