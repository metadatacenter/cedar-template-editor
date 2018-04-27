'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.controlledTerm.cedarValueListDirective', [])
      .directive('cedarValueList', cedarValueListDirective);

  cedarValueListDirective.$inject = ["DataManipulationService","controlledTermDataService"];

  /**
   * display a list of field types for the node
   *
   * @param DataManipulationService
   * @param controlledTermDataService
   * @param StringUtilsService
   * @returns {{restrict: string, scope: {field: string}, templateUrl: string, link: Function}}
   */
  function cedarValueListDirective( DataManipulationService, controlledTermDataService) {

    return {
      restrict: 'E',
      scope   : {
        field         : '='
      },
      templateUrl     : 'scripts/controlled-term/cedar-value-list.directive.html',
      link    : function (scope, element, attrs) {

        scope.location = ["fieldId"];
        scope.value = [DataManipulationService.getId(scope.field)];

        scope.valueConstraint = DataManipulationService.getValueConstraint(scope.field);
        scope.hasVC = DataManipulationService.hasValueConstraint(scope.field);

        scope.isField = function(args) {
          return args && (args[scope.location.indexOf('fieldId')] === DataManipulationService.getId(scope.field));
        };

        scope.$on("value:controlledTermAdded", function (event,args) {
          if (scope.isField(args)) {
            console.log('value:controlledTermAdded',scope.field);
            scope.valueConstraint = DataManipulationService.getValueConstraint(scope.field);
            scope.hasVC = DataManipulationService.hasValueConstraint(scope.field);
          }
        });

      }
    }
  }
});

