'use strict';

define(['angular', 'angularMocks'], function () {
  describe('resource access dialog:', function () {
    var template;

    beforeEach(module('my.templates'));

    beforeEach(inject(function ($templateCache) {
      template = $templateCache.get('scripts/modal/cedar-share-modal.directive.html?v=karma');
    }));

    it('keeps the dialog content mounted while Bootstrap controls visibility', function () {
      expect(template).toContain('<div class="modal-content">');
      expect(template).not.toContain('ng-if="dc.shareModalVisible"');
    });

    it('uses one flow for adding users and groups', function () {
      expect(template).toContain('Add users or groups');
      expect(template).toContain('User or group');
      expect(template).toContain('Users and groups with direct access');
      expect(template).not.toContain('people');
      expect(template).toContain('share-principal-kind share-principal-type');
    });

    it('keeps ownership separate from ordinary role grants', function () {
      expect(template).toContain('share-owner-section');
      expect(template).toContain('Transfer ownership');
      expect(template.indexOf('share-owner-section')).toBeGreaterThan(template.indexOf('share-access-section'));
      expect(template.indexOf('Transfer ownership')).toBeGreaterThan(template.indexOf('share-owner-section'));
      expect(template).not.toContain("value=\"owner\"");
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
