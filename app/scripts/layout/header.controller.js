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
    'QueryParamUtilsService',
    'UIMessageService',
    'UIProgressService',
    'UIUtilService'
  ];

  function HeaderController($rootScope, $location, $window, $timeout, $document, QueryParamUtilsService,
                            UIMessageService, UIProgressService, UIUtilService) {

    var vm = this;

    vm.path = $location.path();

    vm.confirmBack = function () {

      if (!$rootScope.isDirty()) {

        vm.goToDashboardOrBack();

      } else {

        UIMessageService.confirmedExecution(
            function () {
              $timeout(function () {
                vm.goToDashboardOrBack();
                $rootScope.setDirty(false);
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
      var path = $location.path();
      var hash = $location.hash();
      var baseUrl = '/dashboard';
      if (path != baseUrl) {
        var queryParams = {};
        var folderId = QueryParamUtilsService.getFolderId();
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
        var url = $rootScope.util.buildUrl(baseUrl, queryParams);
        $location.url(url);
        if (searchTerm) {
          UIProgressService.start();
        }
      }
    };

    vm.showSearch = function () {
      return $rootScope.showSearch;
    };

    vm.isDashboard = function () {
      return (vm.path === "/dashboard");
    };

    vm.getDocumentTitle = function () {
      return $rootScope.documentTitle;
    };

    vm.getPageTitle = function () {
      return $rootScope.pageTitle;
    };

    vm.isTemplate = function () {
      return (vm.path === "/templates");
    };

    vm.isElement = function () {
      return (vm.path === "/elements");
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

    //*********** ENTRY POINT

    vm.isPrivacy = function () {
      return ($location.path() === "/privacy");
    };

    // clear the modal fade on location change
    $rootScope.$on('$locationChangeStart', function (event, newUrl, oldUrl) {
      // Select open modal(s)
      var $openModalSelector = $(".modal.fade.in");
      if (($openModalSelector.data('bs.modal') || {}).isShown == true) {
        // Close open modal(s)
        $openModalSelector.modal("hide");
        // Prevent page transition
        event.preventDefault();
      }
    });

    $rootScope.$on('$locationChangeSuccess', function (event, next, current) {

      vm.searchTerm = $location.search().search;
      vm.path = $location.path();
      $rootScope.setHeader();
      $document.unbind('keypress');
      $document.unbind('keyup');

      if ($rootScope.isDirty()) {

        event.preventDefault();
        //vm.confirmBack();

        $timeout(function () {

          vm.path = $location.path();
          $rootScope.setHeader();

        });
      }

    });

    //*********** ENTRY POINT

    vm.searchTerm = $location.search().search;

  }
});
