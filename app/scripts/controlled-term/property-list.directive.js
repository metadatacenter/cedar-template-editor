'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.controlledTerm.propertyListDirective', [])
      .directive('propertyList', propertyListDirective);

  propertyListDirective.$inject = ["DataManipulationService"];

  /**
   * display the assigned property for the field
   *
   */
  function propertyListDirective(DataManipulationService) {

    return {
      restrict   : 'E',
      scope      : {
        field: '=',
        form : '=',
        dialogOpen: '='
      },
      templateUrl: 'scripts/controlled-term/property-list.directive.html',
      link       : function (scope, element, attrs) {

        scope.getPropertyId = function () {
          return DataManipulationService.getPropertyId(scope.form, scope.field);
        };

        scope.hasPropertyId = function () {
          return DataManipulationService.getPropertyId(scope.form, scope.field).length > 0;
        };

        scope.deleteProperty = function () {
          DataManipulationService.deletePropertyId(scope.form, scope.field);
          DataManipulationService.updateProperty('', '', '', DataManipulationService.getId(scope.field), scope.form);
          scope.dialogOpen = false;
        };


      }
    }
  }
});

