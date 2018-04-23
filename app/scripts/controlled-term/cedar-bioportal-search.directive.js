'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.controlledTerm.cedarBioportalSearch', [])
      .directive('cedarBioportalSearch', cedarBioportalSearch);

  cedarBioportalSearch.$inject = ["DataManipulationService","controlledTermDataService", "StringUtilsService"];


  function cedarBioportalSearch( DataManipulationService, controlledTermDataService, StringUtilsService) {

    return {
      restrict: 'E',
      scope   : {
        mode     : '=',
        tsc      : '=',
        ctdc     : '='
      },
      templateUrl     : 'scripts/controlled-term/cedar-bioportal-search.directive.html',
      link    : function (scope, element, attrs) {

        /* Variable declarations */
        var vm = this;

      }
    }
  }
});

