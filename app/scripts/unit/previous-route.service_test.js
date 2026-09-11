'use strict';

define([
  'angular',
  'angularMocks',
  'cedar/template-editor/service/previous-route.service'
], function () {

  describe('PreviousRouteService back navigation:', function () {
    var PreviousRouteService;
    var $location;
    var $rootScope;

    var DASHBOARD = '/dashboard?folderId=folder-1';
    var TEMPLATE = '/templates/edit/template-1';
    var ELEMENT = '/elements/edit/element-1';
    var CREATE = '/instances/create/template-1?folderId=folder-1';
    var EDIT = '/instances/edit/instance-1?folderId=folder-1';

    beforeEach(module('cedar.templateEditor.service.previousRouteService'));

    beforeEach(module(function ($provide) {
      $provide.value('QueryParamUtilsService', {
        // Null keeps goBack() off the full-reload branch, which would navigate the test runner.
        getReturnTo: function () {
          return null;
        },
        getSharing: function () {
          return null;
        },
        getQueryParameter: function () {
          return null;
        },
        getFolderId: function () {
          return 'folder-1';
        }
      });
      $provide.value('CedarUser', {
        getHomeFolderId: function () {
          return 'home-folder';
        }
      });
    }));

    // Put the browser on the dashboard before the service exists: it captures the current location
    // when it is constructed, and registers the listener that fills the stack from there on.
    beforeEach(inject(function (_$location_, _$rootScope_, $httpParamSerializer) {
      $location = _$location_;
      $rootScope = _$rootScope_;
      $rootScope.util = {
        buildUrl: function (url, params) {
          var serialized = $httpParamSerializer(params);
          return serialized.length > 0 ? url + '?' + serialized : url;
        }
      };
      $location.url(DASHBOARD);
      $rootScope.$digest();
    }));

    beforeEach(inject(function (_PreviousRouteService_) {
      PreviousRouteService = _PreviousRouteService_;
    }));

    function goTo(url) {
      $location.url(url);
      $rootScope.$digest();
    }

    function goBack() {
      PreviousRouteService.goBack();
      $rootScope.$digest();
    }

    it('walks the stack back instead of bouncing between the last two locations', function () {
      goTo(TEMPLATE);
      goTo(ELEMENT);

      goBack();
      expect($location.url()).toBe(TEMPLATE);

      // The regression: a second press used to return to the element the first press left.
      goBack();
      expect($location.url()).toBe(DASHBOARD);
    });

    it('keeps the folder when it falls through to the dashboard', function () {
      goTo(TEMPLATE);

      goBack();
      expect($location.url()).toBe(DASHBOARD);

      goBack();
      expect($location.url()).toBe(DASHBOARD);
      expect(PreviousRouteService.hasPrevious()).toBe(false);
    });

    it('never offers a utility page as a back target', function () {
      goTo(TEMPLATE);
      goTo('/settings');

      goBack();
      expect($location.url()).toBe(TEMPLATE);
    });

    // A first save rewrites the create address to the edit one with history.replaceState, which
    // AngularJS does not see: the next location change would record the create address as a back
    // target, and the back arrow would offer a create form for metadata that now exists.
    it('does not record an address the page replaced under it', function () {
      goTo(CREATE);
      PreviousRouteService.supersedeCurrent();
      goTo(EDIT);

      expect(PreviousRouteService.getPreviousUrl()).toBe(DASHBOARD);
      goBack();
      expect($location.url()).toBe(DASHBOARD);
    });

    it('records the address that replaced it once the user moves on', function () {
      goTo(CREATE);
      PreviousRouteService.supersedeCurrent();
      goTo(EDIT);
      goTo(TEMPLATE);

      goBack();
      expect($location.url()).toBe(EDIT);
    });

    // The flag belongs to the rewrite that set it. A back press that never saw a location change
    // consumes it, so the next ordinary navigation is still remembered.
    it('does not let an unused rewrite swallow the next back target', function () {
      goTo(CREATE);
      PreviousRouteService.supersedeCurrent();
      goBack();
      expect($location.url()).toBe(DASHBOARD);

      goTo(TEMPLATE);
      goBack();
      expect($location.url()).toBe(DASHBOARD);
    });

    it('reports no previous location for a cold deep link', function () {
      expect(PreviousRouteService.hasPrevious()).toBe(false);
      expect(PreviousRouteService.getPreviousUrl()).toBeNull();
    });
  });
});
