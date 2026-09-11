'use strict';
define(['angular', 'angularMocks',
  'cedar/template-editor/modal/cedar-new-folder-modal.directive',
  'cedar/template-editor/modal/cedar-rename-modal.directive',
  'cedar/template-editor/modal/cedar-move-modal.directive'
], function () {
  describe('Workspace mutation dialogs:', function () {
    var services, backend, messages, scope, instantiate;
    beforeEach(module('cedar.templateEditor.modal.cedarNewFolderModalDirective',
      'cedar.templateEditor.modal.cedarRenameModalDirective',
      'cedar.templateEditor.modal.cedarMoveModalDirective'));
    beforeEach(module(function ($provide) {
      $provide.value('CedarUser', {});
      $provide.value('DataManipulationService', {getTitle: function () { return 'name'; }});
    }));
    beforeEach(inject(function ($injector, $controller, $rootScope, $timeout) {
      scope = $rootScope.$new();
      services = {
        createFolder: jasmine.createSpy('createFolder'),
        moveResource: jasmine.createSpy('moveResource'),
        canMoveInto: function () { return true; },
        renameNode: function () { return {}; }
      };
      backend = {doCall: jasmine.createSpy('doCall')};
      messages = {flashSuccess: angular.noop, showBackendError: angular.noop};
      instantiate = function (name) {
        return $controller($injector.get(name + 'Directive')[0].controller, {
          $scope: scope, $uibModal: {}, $timeout: $timeout, CedarUser: {},
          resourceService: services, UIMessageService: messages,
          AuthorizedBackendService: backend, TemplateInstanceService: {},
          TemplateElementService: {}, TemplateService: {}, CONST: {},
          $translate: {}, UISettingsService: {}, $anchorScroll: angular.noop
        });
      };
    }));
    it('does not create duplicate folders while pending and allows retry after failure', function () {
      var vm = instantiate('cedarNewFolderModal');
      vm.folder.name = 'new folder';
      vm.newFolder(); vm.newFolder();
      expect(services.createFolder.calls.count()).toBe(1);
      services.createFolder.calls.mostRecent().args[4]({status: 500});
      vm.newFolder();
      expect(services.createFolder.calls.count()).toBe(2);
    });
    it('does not send overlapping rename requests and releases the lock on success', function () {
      var vm = instantiate('cedarRenameModal');
      vm.renameResource = {'@id': 'one', resourceType: 'folder', 'schema:name': 'renamed'};
      vm.updateResource(); vm.updateResource();
      expect(backend.doCall.calls.count()).toBe(1);
      backend.doCall.calls.mostRecent().args[1]({data: {}});
      expect(vm.mutationPending).toBe(false);
    });
    it('does not move a resource twice while pending and allows retry after a conflict', function () {
      var vm = instantiate('cedarMoveModal');
      vm.moveResource = {'@id': 'one'};
      vm.selectedDestination = {'@id': 'destination'};
      vm.currentFolderId = 'origin';
      vm.updateResource(); vm.updateResource();
      expect(services.moveResource.calls.count()).toBe(1);
      expect(vm.moveDisabled()).toBe(true);
      services.moveResource.calls.mostRecent().args[3]({status: 412});
      vm.updateResource();
      expect(services.moveResource.calls.count()).toBe(2);
    });
  });
});
