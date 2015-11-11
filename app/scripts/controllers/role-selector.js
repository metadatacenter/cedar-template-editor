'use strict';

var RoleSelectorController = function ($rootScope, $scope, FormService, HeaderService, CONST) {

  $rootScope.pageTitle = 'Role Selector';
  var pageId = CONST.pageId.ROLESELECTOR;
  var applicationMode = CONST.applicationMode.DEFAULT;
  HeaderService.configure(pageId, applicationMode);
};

RoleSelectorController.$inject = ["$rootScope", "$scope", "FormService", "HeaderService", "CONST"];
angularApp.controller('RoleSelectorController', RoleSelectorController);