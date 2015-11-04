'use strict';

var RoleSelectorController = function ($rootScope, $scope, FormService, HeaderService) {

  $rootScope.pageTitle = 'Role Selector';

  HeaderService.configure("ROLESELECTOR", "default");
};

RoleSelectorController.$inject = ["$rootScope", "$scope", "FormService", "HeaderService"];
angularApp.controller('RoleSelectorController', RoleSelectorController);