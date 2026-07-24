'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.profile.settingsController', [])
      .controller('SettingsController', SettingsController);

  SettingsController.$inject = ["$rootScope", "$scope", "$location", "$window", "HeaderService", "UIUtilService", "UISettingsService", "CedarUser", "QueryParamUtilsService", "PreviousRouteService"];

  function SettingsController($rootScope, $scope, $location,$window, HeaderService, UIUtilService, UISettingsService, CedarUser, QueryParamUtilsService, PreviousRouteService) {

    $rootScope.pageTitle = 'Settings';

    $scope.useMetadataEditorV2 = CedarUser.useMetadataEditorV2() || false;

    $scope.toggleMetadataEditorV2 = function () {
      UISettingsService.saveUseMetadataEditorV2(CedarUser.toggleMetadataEditorV2());
    }

    $scope.goToDashboardOrBack = function () {
      UIUtilService.activeLocator = null;
      UIUtilService.activeZeroLocator = null;
      PreviousRouteService.goBack();
    };

  }

});
