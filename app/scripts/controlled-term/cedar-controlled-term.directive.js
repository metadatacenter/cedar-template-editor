'use strict';

define([
  'angular',
  'cedar/template-editor/controlled-term/controlled-term.directive.controller'
], function(angular) {
  angular.module('cedar.templateEditor.controlledTerm.cedarControlledTermDirective', [
    'cedar.templateEditor.controlledTerm.controlledTermDirectiveController',
  ]).directive('cedarControlledTerm', cedarControlledTermDirective);

  cedarControlledTermDirective.$inject = ['$timeout'];
  
  function cedarControlledTermDirective($timeout) {

    var directive = {
      bindToController: {
        field: '=',
        options: '='
      },
      controller: 'controlledTermDirectiveController',
      controllerAs: 'ctdc',
      restrict: 'A',
      replace: true,
      scope: {},
      templateUrl: 'scripts/controlled-term/cedar-controlled-term.directive.html',
    };

    return directive;
  };

});
