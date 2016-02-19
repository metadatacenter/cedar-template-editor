'use strict';

define([
  'angular'
], function(angular) {
  angular.module('cedar.templateEditor.controlTerm.nameOfFieldDirective', [])
    .directive('nameOfField', nameOfFieldDirective);
 
  // TODO: refactor to cedarNameOfField <cedar-name-of-field>

  nameOfFieldDirective.$inject = [];
 
  function nameOfFieldDirective() {
    return {
      restrict: 'A',
      replace: true,
      scope: {
        field: "="
      },
      templateUrl: 'scripts/control-term/name-of-field.directive.html',
      link: function ($scope, $element, attrs) {

      }
    };
  }

});
