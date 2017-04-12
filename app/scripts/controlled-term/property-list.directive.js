'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.controlledTerm.propertyListDirective', [])
      .directive('propertyList', propertyListDirective);

  propertyListDirective.$inject = ["DataManipulationService","controlledTermDataService", "StringUtilsService"];

  /**
   * display a list of field types for the node
   *
   * @param DataManipulationService
   * @param controlledTermDataService
   * @param StringUtilsService
   * @returns {{restrict: string, scope: {field: string}, templateUrl: string, link: Function}}
   */
  function propertyListDirective( DataManipulationService, controlledTermDataService, StringUtilsService) {

    return {
      restrict: 'E',
      scope   : {
        field         : '='
      },
      templateUrl     : 'scripts/controlled-term/property-list.directive.html',
      link    : function (scope, element, attrs) {




      }
    }
  }
});

