'use strict';

define([
  'angular'
], function(angular) {
  angular.module('cedar.templateEditor.controlTerm.cedarControlTermOntologyPickerDirective', [])
    .directive('cedarControlTermOntologyPicker', cedarControlTermOntologyPickerDirective);

  cedarControlTermOntologyPickerDirective.$inject = [];

  function cedarControlTermOntologyPickerDirective(controlTermService, $compile) {

    var directive = {
      restrict: 'E',
      scope: {
        controlTerm: '='
      },
      templateUrl: 'scripts/control-term/cedar-control-term-ontology-picker.directive.html'
    };

    return directive;

  }

});