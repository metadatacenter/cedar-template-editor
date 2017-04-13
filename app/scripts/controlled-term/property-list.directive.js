'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.controlledTerm.propertyListDirective', [])
      .directive('propertyList', propertyListDirective);

  propertyListDirective.$inject = ["$rootScope", "DataManipulationService","controlledTermDataService", "StringUtilsService"];

  /**
   * display a list of assigned properties for the field
   *
   */
  function propertyListDirective( $rootScope, DataManipulationService, controlledTermDataService, StringUtilsService) {

    return {
      restrict: 'E',
      scope   : {
        field         : '=',
        isOpen        : '='
      },
      templateUrl     : 'scripts/controlled-term/property-list.directive.html',
      link    : function (scope, element, attrs) {


        scope.property;
        console.log("isOpen  " + scope.isOpen);

        scope.getProperty = function () {
          scope.isOpen = false;
          return DataManipulationService.getProperty($rootScope.jsonToSave, scope.field);
        };

        scope.deleteProperty = function () {
         // DataManipulationService.deleteProperty(scope.field);
        };

        // update terms when field changes
        scope.$watch("isOpen", function(newValue, oldValue) {
          console.log("isOpen changed " + scope.isOpen);
        });

        // // update terms when field changes
        // scope.$watch("field", function(newValue, oldValue) {
        //   scope.property = scope.getProperty();
        //   console.log("field changed " + scope.property);
        // });

      }
    }
  }
});

