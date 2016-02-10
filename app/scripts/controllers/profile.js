'use strict';

var ProfileController = function ($rootScope, $scope, $window, HeaderService, CONST) {

  $rootScope.pageTitle = 'Profile';

  // Inject constants
  $scope.CONST = CONST;

  var pageId = CONST.pageId.PROFILE;
  var applicationMode = CONST.applicationMode.DEFAULT;
  HeaderService.configure(pageId, applicationMode);

  $scope.getTokenValidity = function() {
    return $window.keycloakBootstrap.getTokenValiditySeconds();
  }
};

ProfileController.$inject = ["$rootScope", "$scope", "$window", "HeaderService", "CONST"];
angularApp.controller('ProfileController', ProfileController);