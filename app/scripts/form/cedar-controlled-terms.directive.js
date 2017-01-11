'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.form.cedarControlledDirective', [])
      .directive('controlled', cedarControlledDirective);


  cedarControlledDirective.$inject = ['$rootScope', '$timeout'];


  function cedarControlledDirective($rootScope, $timeout) {

    return {
      restrict: 'A',
      scope   : {
        field: '='
      },
      link    : function ($scope, $element, attrs) {

        // update local $scope.model to value of $parent.model if available
        if ($scope.$parent.model != undefined) {
          $scope.model = $scope.$parent.model;
        }

      }
    };


  };

});