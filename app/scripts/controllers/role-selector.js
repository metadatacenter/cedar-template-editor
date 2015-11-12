'use strict';

var RoleSelectorController = function ($rootScope, $scope, FormService, HeaderService, CONST) {

  $rootScope.pageTitle = 'Role Selector';

  // Inject constants
  $scope.CONST = CONST;

  var pageId = CONST.pageId.ROLESELECTOR;
  var applicationMode = CONST.applicationMode.DEFAULT;
  HeaderService.configure(pageId, applicationMode);
};

RoleSelectorController.$inject = ["$rootScope", "$scope", "FormService", "HeaderService", "CONST"];
angularApp.controller('RoleSelectorController', RoleSelectorController);