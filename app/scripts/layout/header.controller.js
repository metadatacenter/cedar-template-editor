'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.layout.headerController', [])
      .controller('HeaderCtrl', HeaderController);

  HeaderController.$inject = [
    '$rootScope',
    '$location',
    '$window',
    '$timeout',
    '$document',
    '$translate',
    'QueryParamUtilsService',
    'UIMessageService',
    'UIProgressService',
    'UIUtilService',
    'CedarUser',
    'FrontendUrlService',
    'MessagingService'
  ];

  function HeaderController($rootScope, $location, $window, $timeout, $document, $translate,QueryParamUtilsService,
                            UIMessageService, UIProgressService, UIUtilService,CedarUser, FrontendUrlService,MessagingService) {

    var vm = this;
    vm.path = $location.path();
    vm.searchTerm = $location.search().search;
    vm.confirmedBack = true;

    $window.onbeforeunload = function (event) {
      if (vm.isDirty() && !vm.confirmedBack) {
        return "You have some unsaved changes";
      }
    };

    vm.isDirty = function() {
      return UIUtilService.isDirty();
    };

    vm.documentState =  UIUtilService.documentState;

    vm.isLocked =  function() {
      return UIUtilService.isLocked();
    };

    vm.documentState = UIUtilService.documentState;
    vm.valid = UIUtilService.isValid;

    vm.validTip = function() {
      return $translate.instant('Document is ' + (UIUtilService.isValid() ? "valid": "invalid"));
    };

    vm.validIcon = function() {
      return UIUtilService.isValid() ? 'fa-check' : 'fa-exclamation-triangle';
    };

    vm.dirtyCleanTip = function() {
      return $translate.instant((UIUtilService.isDirty() ? "Save required": "No save required"));
    };

    vm.lockUnlockTip = function() {
      return $translate.instant('Document is ' + (UIUtilService.isLocked() ? "locked": "unlocked"));
    };

    // vm.windowHistoryBack = function() {
    //   vm.confirmedBack = false;
    //   $window.history.back();
    // };

    vm.confirmBack = function () {
      vm.confirmedBack = true;

      if (UIUtilService.isLocked() || !UIUtilService.isDirty()) {
        vm.goToDashboardOrBack();
      } else {

        UIMessageService.confirmedExecution(
            function () {
              $timeout(function () {
                vm.goToDashboardOrBack();
                UIUtilService.setDirty(false);
                UIUtilService.setValidation(true);
              });
            },
            'GENERIC.AreYouSure',
            'DASHBOARD.back',
            'GENERIC.YesGoBack'
        );
      }
    };

    vm.goToDashboardOrBack = function () {
      vm.searchTerm = null;
      UIUtilService.activeLocator = null;
      UIUtilService.activeZeroLocator = null;
      var path = $location.path();
      var hash = $location.hash();
      var baseUrl = '/dashboard';
      if (path != baseUrl) {
        var queryParams = {};
        var sharing = QueryParamUtilsService.getSharing();
        if (sharing) {
          queryParams['sharing'] = sharing;
        }
        var folderId = QueryParamUtilsService.getFolderId() || CedarUser.getHomeFolderId();
        if (folderId) {
          queryParams['folderId'] = folderId;
        }
        /*if (params.search) {
         queryParams['search'] = params.search;
         }*/
      }
      var url = $rootScope.util.buildUrl(baseUrl, queryParams);
      if (hash) {
        url += '#' + hash;
      }
      $location.url(url);
      $window.scrollTo(0, 0);

    };

    vm.goToHome = function () {
      vm.searchTerm = null;
      UIUtilService.activeLocator = null;
      UIUtilService.activeZeroLocator = null;
      var path = $location.path();
      var hash = $location.hash();
      var baseUrl = '/dashboard';
      if (path != baseUrl) {
        var queryParams = {};
        var folderId = CedarUser.getHomeFolderId();
        if (folderId) {
          queryParams['folderId'] = folderId;
        }
      }
      var url = $rootScope.util.buildUrl(baseUrl, queryParams);
      if (hash) {
        url += '#' + hash;
      }
      $location.url(url);
      $window.scrollTo(0, 0);

    };
    // share this with root
    $rootScope.goToHome = vm.goToHome;

    vm.search = function (searchTerm) {
      if (vm.isDashboard()) {
        vm.searchTerm = searchTerm;
        var baseUrl = '/dashboard';
        var queryParams = {};
        var folderId = QueryParamUtilsService.getFolderId();
        if (folderId) {
          queryParams['folderId'] = folderId;
        }
        queryParams['search'] = searchTerm;
        // Add timestamp to make the search work when the user searches for the same term multiple times. Without the
        // timestamp, the URL will not change and therefore $location.url will not trigger a new search.
        queryParams['t'] = Date.now();
        queryParams['fromSearchBox'] = true;
        var url = $rootScope.util.buildUrl(baseUrl, queryParams);
        $location.url(url);
        if (searchTerm) {
          UIProgressService.start();
        }
      }
    };

    vm.openMessaging = function() {
      $location.url(FrontendUrlService.getMessaging(QueryParamUtilsService.getFolderId()));
    };

    vm.hasUnreadMessages = function() {
      return MessagingService.unreadCount > 0;
    };

    vm.getUnreadMessageCount = function() {
      return Math.min(MessagingService.unreadCount, 9);
    };

    vm.toggleUserMenuDropdown = function() {

      var menuDropdown = document.getElementById('user-menu-dropdown');
      var menuUser = document.getElementById('user-menu-dropdown-trigger');

      if (menuDropdown && menuUser ) {
        if (menuDropdown.style.display == "block") {

          menuDropdown.style.setProperty("display", "none");
          $window.onclick = null;
          //$scope.$apply();

        } else {

          menuDropdown.style.setProperty("display", "block");
          var menuRect = menuUser.getBoundingClientRect();
          var dropdownRect = menuDropdown.getBoundingClientRect();
          menuDropdown.style.setProperty("left", (menuRect.x  - dropdownRect.width) + "px");
          menuDropdown.style.setProperty("top", (menuRect.y + menuRect.height) + "px");

          $window.onclick = function (event) {

            // make sure we are hitting something else
            if (event.target.id != 'user-menu-dropdown' && event.target.id != 'user-menu-dropdown-trigger' ) {

              menuDropdown.style.setProperty("display", "none");
              $window.onclick = null;
              //$scope.$apply();
            }
          };
        }
      }
    };

    vm.showSearch = function () {
      return $rootScope.showSearch;
    };

    vm.isDashboard = function () {
      return (vm.path === "/dashboard");
    };

    vm.isMessaging = function () {
      return (vm.path === "/messaging");
    };

    vm.getDocumentTitle = function () {
      return $rootScope.documentTitle;
    };

    vm.formatDocumentTitle = function () {
      return UIUtilService.formatTitleString($rootScope.documentTitle);
    };

    vm.formatDocumentTitleFull = function () {
      return UIUtilService.formatTitleStringFull($rootScope.documentTitle);
    };

    vm.getPageTitle = function () {
      return $rootScope.pageTitle;
    };

    vm.getResourceType = function () {
      var result;
      var base = vm.path.split('/');
      if (base && base[1]){

      switch (base[1]) {
        case "templates":
          result = 'template';
          break;
        case "elements":
          result = 'element';
          break;
        case "fields":
          result = 'field';
          break;
        case "instances":
          result = 'metadata';
          break;
      }
      }
      return result;
    };

    vm.isTemplate = function () {
      return (vm.path === "/templates");
    };

    vm.isElement = function () {
      return (vm.path === "/elements");
    };

    vm.isField = function () {
      return (vm.path === "/fields");
    };

    vm.isMetadata = function () {
      return (vm.path === "/instances");
    };

    vm.isProfile = function () {
      return (vm.path === "/profile");
    };

    vm.isPrivacy = function () {
      return (vm.path === "/privacy");
    };

    vm.isSettings = function () {
      return (vm.path === "/settings");
    };

    vm.isRuntime = function() {
      return UIUtilService.isRuntime();
    };

    vm.isShowOutput = function() {
      return UIUtilService.isShowOutput();
    };

    vm.toggleShowOutput = function() {
      return UIUtilService.toggleShowOutput();
    };

    vm.scrollToAnchor = function(hash) {
      UIUtilService.scrollToAnchor(hash);
    };

    vm.isPrivacy = function () {
      return ($location.path() === "/privacy");
    };

    vm.isSettings = function () {
      return ($location.path() === "/settings");
    };

    $rootScope.$on('$routeChangeStart', function (event, next, current) {
      if (vm.isDirty() && !vm.confirmedBack && next.$$route.originalPath.startsWith('/dashboard')) {
        event.preventDefault();
        vm.confirmBack();
      }
      vm.confirmedBack = true;
    });

    // clear the modal fade on location change
    $rootScope.$on('$locationChangeStart', function (event, newUrl, oldUrl) {

      // Select open modal(s)
      var $openModalSelector = jQuery(".modal.fade.in");
      if (($openModalSelector.data('bs.modal') || {}).isShown == true) {
        // Close open modal(s)
        $openModalSelector.modal("hide");
        // Prevent page transition
        event.preventDefault();
      }

      if (vm.isDirty() && !vm.confirmedBack && newUrl.toString().startsWith('/dashboard')) {
        event.preventDefault();
        vm.confirmBack();
      }
      vm.confirmedBack = true;
    });

    $rootScope.$on('$locationChangeSuccess', function (event, next, current) {

      vm.searchTerm = $location.search().search;
      vm.path = $location.path();
      vm.resourceType = vm.getResourceType();
      $rootScope.setHeader();
      $document.unbind('keypress');
      $document.unbind('keyup');
      vm.confirmedBack = ($location.path() == '/dashboard');

    });



  }
});
