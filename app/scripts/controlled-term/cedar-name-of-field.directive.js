'use strict';

define([
  'angular'
], function(angular) {
  angular.module('cedar.templateEditor.controlledTerm.cedarNameOfFieldDirective', [])
    .directive('cedarNameOfField', cedarNameOfFieldDirective);
 
  cedarNameOfFieldDirective.$inject = [];
 
  function cedarNameOfFieldDirective() {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {
        field: '='
      },
      templateUrl: 'scripts/controlled-term/cedar-name-of-field.directive.html'
    };

    return directive;
  }

});
