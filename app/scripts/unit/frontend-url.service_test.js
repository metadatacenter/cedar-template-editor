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
  });
});
