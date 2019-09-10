'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.categoryTree.categoryTreeController', [])
      .controller('categoryTreeController', function ($scope, categoryTreeHelper) {
        $scope.categoryTreeHelper = categoryTreeHelper;
      })
});
