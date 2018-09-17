'use strict';

define([
  'angular',
  'cedar/template-editor/controlled-term/controlled-term.directive.controller'
], function(angular) {
  angular.module('cedar.templateEditor.controlledTerm.controlledTermDirective', [
    'cedar.templateEditor.controlledTerm.controlledTermDirectiveController',
  ]).directive('controlledTerm', controlledTermDirective);

  controlledTermDirective.$inject = ['$timeout'];
  
  function controlledTermDirective($timeout) {

    var directive = {
      bindToController: {
        // field: '=',
        // options: '='
      },
      controller: 'controlledTermDirectiveController',
      controllerAs: 'ctdc',
      restrict: 'A',
      replace: true,
      scope: {},
      templateUrl: 'scripts/controlled-term/controlled-term.directive.html',
    };

    return directive;
  };

});
