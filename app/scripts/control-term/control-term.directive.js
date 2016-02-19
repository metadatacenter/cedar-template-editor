'use strict';

define([
  'angular'
], function(angular) {
  angular.module('cedar.templateEditor.controlTerm.controlTermDirective', [])
    .directive('controlTerm', controlTermDirective);

  // TODO: refactor to cedarControlTerm <cedar-control-term>

  controlTermDirective.$inject = ['$timeout'];
  
  function controlTermDirective($timeout) {
    return {
      restrict: 'A',
      replace: true,
      scope: {
        field: '=',
        options: "="
      },
      templateUrl: "scripts/control-term/control-term.directive.html",
      controller: "ControlTermController"
    };
  };

});
