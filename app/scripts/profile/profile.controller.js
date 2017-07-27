'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.profile.profileController', [])
      .controller('ProfileController', ProfileController);

  ProfileController.$inject = ["$rootScope", "$scope", "UrlService", "HeaderService", "UserService", "CONST"];

  function ProfileController($rootScope, $scope, UrlService, HeaderService, UserService, CONST) {

    $rootScope.pageTitle = 'Profile';

    // Inject constants
    $scope.CONST = CONST;

    var pageId = CONST.pageId.PROFILE;
    HeaderService.configure(pageId);

    $scope.getTokenValidity = function () {
      return UserService.getTokenValiditySeconds();
    };

    $scope.urlService = UrlService;
  }

});
