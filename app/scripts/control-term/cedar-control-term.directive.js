'use strict';

define([
  'angular'
], function(angular) {
  angular.module('cedar.templateEditor.controlTerm.cedarControlTermDirective', [])
    .directive('cedarControlTerm', cedarControlTermDirective);

  cedarControlTermDirective.$inject = ['$timeout'];
  
  function cedarControlTermDirective($timeout) {
    var directive = {
      restrict: 'A',
      replace: true,
      scope: {
        field: '=',
        options: '='
      },
      templateUrl: 'scripts/control-term/cedar-control-term.directive.html',
      controller: 'ControlTermController'
    };

    return directive;
  };

});
