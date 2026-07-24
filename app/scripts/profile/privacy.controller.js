'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.profile.privacyController', [])
      .controller('PrivacyController', PrivacyController);

  PrivacyController.$inject = ["$rootScope", "$scope", "$location", "$window", "HeaderService", "CONST","UIUtilService", "CedarUser", "QueryParamUtilsService", "PreviousRouteService"];

  function PrivacyController($rootScope, $scope, $location,$window, HeaderService, CONST, UIUtilService, CedarUser, QueryParamUtilsService, PreviousRouteService) {

    $rootScope.pageTitle = 'Privacy';

    // Inject constants
    $scope.CONST = CONST;

    var pageId = CONST.pageId.PRIVACY;
    HeaderService.configure(pageId);

    $scope.goToDashboardOrBack = function () {
      UIUtilService.activeLocator = null;
      UIUtilService.activeZeroLocator = null;
      PreviousRouteService.goBack();
    };


  }

});
