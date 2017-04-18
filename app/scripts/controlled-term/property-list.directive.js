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
        form : '='
      },
      templateUrl: 'scripts/controlled-term/property-list.directive.html',
      link       : function (scope, element, attrs) {

        scope.getProperty = function () {
          return DataManipulationService.getProperty(scope.form, scope.field);
        };

        scope.hasProperty = function () {
          var property = DataManipulationService.getProperty(scope.form, scope.field);
          return (property && property.length > 0);
        };

        scope.deleteProperty = function () {
          DataManipulationService.deleteProperty(scope.form, scope.field);
        };


      }
    }
  }
});

