'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.profile.settingsController', [])
      .controller('SettingsController', SettingsController);

  SettingsController.$inject = ["$rootScope", "$scope", "$location", "$window", "HeaderService", "UIUtilService", "UISettingsService", "CedarUser", "QueryParamUtilsService", "PreviousRouteService"];

  function SettingsController($rootScope, $scope, $location,$window, HeaderService, UIUtilService, UISettingsService, CedarUser, QueryParamUtilsService, PreviousRouteService) {

    $rootScope.pageTitle = 'Settings';

    // ---- About CEDAR ----
    $scope.cedarVersion = $window.cedarVersion;
    // UI-only build/cache-busting modifier (not part of the released version number).
    $scope.cedarVersionModifier = $window.cedarVersionModifier;
    // CEE (embeddable editor) version — set as a global by the CEE bundle at load time.
    // Shows the ACTUALLY loaded bundle; 'unknown' means a CEE older than this exposure.
    $scope.ceeVersion = $window.cedarEmbeddableEditorVersion || 'unknown';

    // ---- New Metadata Editor UI toggle ----
    $scope.useMetadataEditorV2 = CedarUser.useMetadataEditorV2() || false;

    $scope.toggleMetadataEditorV2 = function () {
      UISettingsService.saveUseMetadataEditorV2(CedarUser.toggleMetadataEditorV2());
    }

    // ---- Preferred date format ----
    // Values are moment.js-style tokens; the label carries a live example of today's date.
    function example(token) {
      return (window.moment ? window.moment().format(token) : token) + '  (' + token + ')';
    }

    // US style first - it is the default used throughout the UI.
    $scope.dateFormats = [
      {value: 'MM/DD/YYYY',   label: example('MM/DD/YYYY') + ' — US default'},
      {value: 'YYYY-MM-DD',   label: example('YYYY-MM-DD')},
      {value: 'DD/MM/YYYY',   label: example('DD/MM/YYYY')},
      {value: 'MM/DD/YY',     label: example('MM/DD/YY')},
      {value: 'DD/MM/YY',     label: example('DD/MM/YY')},
      {value: 'DD.MM.YYYY',   label: example('DD.MM.YYYY')},
      {value: 'D MMM YYYY',   label: example('D MMM YYYY')},
      {value: 'MMM D, YYYY',  label: example('MMM D, YYYY')},
      {value: 'ddd, D MMM YYYY', label: example('ddd, D MMM YYYY')}
    ];

    $scope.preferredDateFormat = CedarUser.getPreferredDateFormat();

    $scope.savePreferredDateFormat = function () {
      CedarUser.setPreferredDateFormat($scope.preferredDateFormat);
      UISettingsService.savePreferredDateFormat($scope.preferredDateFormat);
    };

    $scope.goToDashboardOrBack = function () {
      UIUtilService.activeLocator = null;
      UIUtilService.activeZeroLocator = null;
      PreviousRouteService.goBack();
    };

  }

});
