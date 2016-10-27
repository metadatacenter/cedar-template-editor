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
    'UrlService',
    'UIMessageService'
  ];

  function HeaderController($rootScope, $location, $window, $timeout, UrlService, UIMessageService) {

    var vm = this;

    vm.path = $location.path();

    vm.confirmBack = function () {
      console.log('confirmBack');

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
      var params = $location.search();
      var path = $location.path();
      var baseUrl = '/dashboard';
      if (path != baseUrl) {
        var queryParams = {};
        if (params.folderId) {
          queryParams['folderId'] = params.folderId;
        }
        /*if (params.search) {
          queryParams['search'] = params.search;
        }*/
      }
      var url = $rootScope.util.buildUrl(baseUrl, queryParams);
      $location.url(url);
      $window.scrollTo(0, 0);

    };

    vm.search = function (searchTerm) {
      if (vm.isDashboard()) {
        var params = $location.search();
        var baseUrl = '/dashboard';
        var queryParams = {};
        if (params.folderId) {
          queryParams['folderId'] = params.folderId;
        }
        queryParams['search'] = searchTerm;
        var url = $rootScope.util.buildUrl(baseUrl, queryParams);
        $location.url(url);
      }
      vm.searchTerm = searchTerm;
      $rootScope.$broadcast('search', vm.searchTerm || '');
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
      //console.log('isTemplate' + ($location.path() === "/templates"));
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

    //*********** ENTRY POINT

    vm.isPrivacy = function () {
      return ($location.path() === "/privacy");
    };


    $rootScope.$on('$locationChangeStart', function (event, next, current) {

   

      vm.path = $location.path();
      $rootScope.setHeader();

      if ($rootScope.isDirty()) {

        event.preventDefault();
        vm.confirmBack();

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
