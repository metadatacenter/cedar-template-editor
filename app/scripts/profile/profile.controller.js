'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.profile.profileController', [])
      .controller('ProfileController', ProfileController);

  ProfileController.$inject = ["$rootScope", "$scope", "$window", "HeaderService", "UserService", "CONST"];

  function ProfileController($rootScope, $scope, $window, HeaderService, UserService, CONST) {

    $rootScope.pageTitle = 'Profile';

    // Inject constants
    $scope.CONST = CONST;

    var pageId = CONST.pageId.PROFILE;
    var applicationMode = CONST.applicationMode.DEFAULT;
    HeaderService.configure(pageId, applicationMode);

    $scope.getTokenValidity = function () {
      return UserService.getTokenValiditySeconds();
    }
  };

});
