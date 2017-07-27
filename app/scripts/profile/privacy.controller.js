'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.profile.privacyController', [])
      .controller('PrivacyController', PrivacyController);

  PrivacyController.$inject = ["$rootScope", "$scope", "HeaderService", "CONST"];

  function PrivacyController($rootScope, $scope, HeaderService, CONST) {

    $rootScope.pageTitle = 'Privacy';

    // Inject constants
    $scope.CONST = CONST;

    var pageId = CONST.pageId.PRIVACY;
    HeaderService.configure(pageId);

  }

});
