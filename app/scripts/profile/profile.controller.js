'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.profile.profileController', [])
      .controller('ProfileController', ProfileController);

  ProfileController.$inject = ["$rootScope", "$scope", "$location", "$window","UrlService", "HeaderService", "UserService", "CONST","UIUtilService", "CedarUser", "QueryParamUtilsService"];

  function ProfileController($rootScope, $scope, $location,$window, UrlService, HeaderService, UserService, CONST, UIUtilService, CedarUser, QueryParamUtilsService) {

    $rootScope.pageTitle = 'Profile';

    // Inject constants
    $scope.CONST = CONST;

    var pageId = CONST.pageId.PROFILE;
    HeaderService.configure(pageId);

    $scope.getTokenValidity = function () {
      return UserService.getTokenValiditySeconds();
    };

    $scope.goToDashboardOrBack = function () {
      //vm.searchTerm = null;
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

    $scope.urlService = UrlService;
  }

});
