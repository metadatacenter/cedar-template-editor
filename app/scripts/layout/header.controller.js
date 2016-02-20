'use strict';

define([
  'angular'
], function(angular) {
  angular.module('cedar.templateEditor.layout.headerController', [])
    .controller('HeaderCtrl', function ($scope, $location) {
      $scope.$location = $location;
    });
});
