'use strict';

define([
  'angular',
  'cedar/template-editor/control-term/control-term.directive.controller'
], function(angular) {
  angular.module('cedar.templateEditor.controlTerm.cedarControlTermDirective', [
    'cedar.templateEditor.controlTerm.controlTermDirectiveController',
  ]).directive('cedarControlTerm', cedarControlTermDirective);

  cedarControlTermDirective.$inject = ['$timeout'];
  
  function cedarControlTermDirective($timeout) {

    var directive = {
      bindToController: {
        field: '=',
        options: '='
      },
      controller: 'controlTermDirectiveController',
      controllerAs: 'ctdc',
      restrict: 'A',
      replace: true,
      scope: {},
      templateUrl: 'scripts/control-term/cedar-control-term.directive.html',
    };

    return directive;
  };

});
