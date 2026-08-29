'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.service.previousRouteService', [])
      .service('PreviousRouteService', PreviousRouteService);

  PreviousRouteService.$inject = ['$rootScope', '$location', '$window', 'QueryParamUtilsService', 'CedarUser'];

  /**
   * Tracks the last "workspace" location so back/logo navigation returns the user to where they were
   * in CEDAR - never to another utility page. The utility pages (profile, settings, privacy, logout)
   * are skipped, so cycling among them still takes you back to the dashboard/editor you came from.
   */
  function PreviousRouteService($rootScope, $location, $window, QueryParamUtilsService, CedarUser) {

    var service = {
      serviceId: "PreviousRouteService"
    };

    // Pages that should never be a "back" target.
    var UTILITY_PATHS = ['/profile', '/settings', '/privacy', '/logout'];

    function isUtilityPath(path) {
      if (!path) {
        return false;
      }
      for (var i = 0; i < UTILITY_PATHS.length; i++) {
        if (path === UTILITY_PATHS[i] || path.indexOf(UTILITY_PATHS[i] + '/') === 0) {
          return true;
        }
      }
      return false;
    }

    var currentUrl = $location.url();
    var currentPath = $location.path();
    // The most recent non-utility location we navigated away from.
    var lastWorkspaceUrl = null;

    // Listen on $locationChangeSuccess (not $routeChangeSuccess): folder-to-folder navigation on the
    // dashboard only changes the folderId query param (reloadOnSearch:false) and fires $routeUpdate,
    // NOT $routeChangeSuccess - so with the latter, currentUrl only refreshed on a full route change
    // or a browser reload, and "back" from a utility page returned to the folder at last reload.
    // $locationChangeSuccess fires on every URL change, so currentUrl always reflects the real spot.
    $rootScope.$on('$locationChangeSuccess', function () {
      var newUrl = $location.url();
      if (newUrl === currentUrl) {
        return;
      }
      // If the page we are leaving was a real (non-utility) location, remember it as the back target.
      if (!isUtilityPath(currentPath)) {
        lastWorkspaceUrl = currentUrl;
      }
      currentUrl = newUrl;
      currentPath = $location.path();
    });

    service.hasPrevious = function () {
      return !!lastWorkspaceUrl && lastWorkspaceUrl !== $location.url();
    };

    service.getPreviousUrl = function () {
      return lastWorkspaceUrl;
    };

    /**
     * Navigate back to the last workspace location (folder / search / sharing / hash all preserved),
     * skipping any profile/settings/privacy pages. Falls back to the dashboard when there is no such
     * location yet (e.g. a cold deep-link), preserving whatever state is on the current URL.
     */
    service.goBack = function () {
      if (service.hasPrevious()) {
        $location.url(lastWorkspaceUrl);
        $window.scrollTo(0, 0);
        return;
      }

      // Create-instance performs a full reload before showing the saved instance, so the in-memory
      // route history above is intentionally empty. Carry the exact originating Workspace URL
      // across that reload, but accept it only when it remains on this monolith's origin.
      var returnTo = QueryParamUtilsService.getReturnTo();
      if (returnTo) {
        try {
          var candidate = new $window.URL(returnTo, $window.location.href);
          if (candidate.origin === $window.location.origin && !candidate.username && !candidate.password) {
            $window.location.assign(candidate.href);
            return;
          }
        } catch (error) {
          // Invalid and cross-origin return URLs deliberately fall through to the safe dashboard.
        }
      }

      var hash = $location.hash();
      var queryParams = {};
      var sharing = QueryParamUtilsService.getSharing();
      if (sharing) {
        queryParams['sharing'] = sharing;
      }
      var search = QueryParamUtilsService.getQueryParameter('search');
      var searchCategory = QueryParamUtilsService.getQueryParameter('searchCategory');
      if (search) {
        queryParams['search'] = search;
      }
      if (searchCategory) {
        queryParams['searchCategory'] = searchCategory;
      }
      // Only pin a folder when we are not restoring a search view (search is folder-independent).
      if (!search && !searchCategory) {
        var folderId = QueryParamUtilsService.getFolderId() || CedarUser.getHomeFolderId();
        if (folderId) {
          queryParams['folderId'] = folderId;
        }
      }
      var url = $rootScope.util.buildUrl('/dashboard', queryParams);
      if (hash) {
        url += '#' + hash;
      }
      $location.url(url);
      $window.scrollTo(0, 0);
    };

    return service;
  }

});
