'use strict';

define([
  'angular'
], function(angular) {
  angular.module('cedar.templateEditor.dashboard.roleSelectorController', [])
    .controller('RoleSelectorController', RoleSelectorController);
  
  RoleSelectorController.$inject = ['$rootScope', '$scope', 'HeaderService', 'CONST'];
  
  function RoleSelectorController($rootScope, $scope, HeaderService, CONST) {

    $rootScope.pageTitle = 'Role Selector';

    // Inject constants
    $scope.CONST = CONST;

    var pageId = CONST.pageId.ROLESELECTOR;
    var applicationMode = CONST.applicationMode.DEFAULT;
    HeaderService.configure(pageId, applicationMode);
  };
});
