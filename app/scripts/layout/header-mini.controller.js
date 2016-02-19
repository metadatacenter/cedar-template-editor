'use strict';

define([
  'angular'
], function(angular) {
  angular.module('cedar.templateEditor.layout.headerMiniController', [])
    .controller('HeaderCtrlMini', function ($scope, HeaderService) {
      $scope.dataContainer = HeaderService.dataContainer;
    });
});
