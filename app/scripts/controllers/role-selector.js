'use strict';

var RoleSelectorController = function ($rootScope, $scope, FormService, HeaderService, CONST) {

  $rootScope.pageTitle = 'Role Selector';
  var pageId = CONST.pageId.ROLESELECTOR;
  HeaderService.configure(pageId, "default");
};

RoleSelectorController.$inject = ["$rootScope", "$scope", "FormService", "HeaderService", "CONST"];
angularApp.controller('RoleSelectorController', RoleSelectorController);