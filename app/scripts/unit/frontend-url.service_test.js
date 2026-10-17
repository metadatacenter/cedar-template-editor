'use strict';

define([
  'angular', 'angularMocks', 'cedar/template-editor/service/frontend-url.service'
], function () {
  describe('CEE host navigation:', function () {
    beforeEach(module('cedar.templateEditor.service.frontendUrlService'));
    beforeEach(module(function ($provide) {
      $provide.value('$window', {
        URL: window.URL,
        location: {href: 'https://cedar.example/instances/create/template', origin: 'https://cedar.example'}
      });
    }));

    it('normalizes routed artifact identifiers', inject(function (FrontendUrlService) {
      expect(FrontendUrlService.decodeRouteIdentifier('https%3A%2F%2Frepo.example%2Finstances%2F1'))
          .toBe('https://repo.example/instances/1');
      expect(FrontendUrlService.decodeRouteIdentifier('https:/repo.example/instances/1'))
          .toBe('https://repo.example/instances/1');
    }));

    it('returns to a local workspace and rejects external return addresses', inject(function (FrontendUrlService) {
      expect(FrontendUrlService.getWorkspaceReturn('/dashboard?search=example', 'folder'))
          .toBe('https://cedar.example/dashboard?search=example');
      expect(FrontendUrlService.getWorkspaceReturn('https://elsewhere.example/', 'folder/1'))
          .toBe('/dashboard?folderId=folder%2F1');
      expect(FrontendUrlService.getWorkspaceReturn(null, null)).toBe('/dashboard');
    }));

    // Cancelling an editor opened without a folder, for example from OpenView, returns to the dashboard
    // without naming a folder, so the dashboard opens the home folder instead of asking for one called undefined.
    it('leaves a missing folder identifier out of every dashboard and messaging address', inject(function (FrontendUrlService) {
      [undefined, null, ''].forEach(function (missing) {
        expect(FrontendUrlService.getFolderContents(missing)).toBe('/dashboard');
        expect(FrontendUrlService.getSearchAll(missing)).toBe('/dashboard?search=*');
        expect(FrontendUrlService.getSharedWithMe(missing)).toBe('/dashboard?sharing=shared-with-me');
        expect(FrontendUrlService.getSharedWithEverybody(missing)).toBe('/dashboard?sharing=shared-with-everybody');
        expect(FrontendUrlService.getSpecialFolders(missing)).toBe('/dashboard?viewMode=view-special-folders');
        expect(FrontendUrlService.getMessaging(missing)).toBe('/messaging');
        expect(FrontendUrlService.getWorkspaceReturn(null, missing)).toBe('/dashboard');
      });
      var folder = 'https://repo.example/folders/1';
      expect(FrontendUrlService.getFolderContents(folder)).toBe('/dashboard?folderId=' + encodeURIComponent(folder));
      expect(FrontendUrlService.getSearchAll(folder)).toBe('/dashboard?search=*&folderId=' + encodeURIComponent(folder));
      expect(FrontendUrlService.getMessaging(folder)).toBe('/messaging?folderId=' + encodeURIComponent(folder));
    }));
  });
});
