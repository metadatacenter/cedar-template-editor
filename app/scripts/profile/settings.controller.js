'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.profile.settingsController', [])
      .controller('SettingsController', SettingsController);

  SettingsController.$inject = ["$rootScope", "$scope", "$location", "$window", "HeaderService","UIUtilService", "CedarUser", "QueryParamUtilsService"];

  function SettingsController($rootScope, $scope, $location,$window, HeaderService, UIUtilService, CedarUser, QueryParamUtilsService) {

    $rootScope.pageTitle = 'Settings';

    $scope.useNew = CedarUser.useNewUI() || false;

    $scope.toggleNewUI = function () {
      CedarUser.toggleNewUI();
    }

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


  }

});
