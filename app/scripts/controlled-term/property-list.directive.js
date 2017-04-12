'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.controlledTerm.propertyListDirective', [])
      .directive('propertyList', propertyListDirective);

  propertyListDirective.$inject = ["DataManipulationService","controlledTermDataService", "StringUtilsService"];

  /**
   * display a list of properties
   *
   */
  function propertyListDirective( DataManipulationService, controlledTermDataService, StringUtilsService) {

    return {
      restrict: 'E',
      scope   : {
        field         : '='
      },
      templateUrl     : 'scripts/controlled-term/property-list.directive.html',
      link    : function (scope, element, attrs) {


        scope.property = null;

        //// new property added
        //scope.$on("property:propertyAdded", function () {
        //  console.log('property:propertyAdded');
        //  scope.property = scope.getProperties();
        //});


        scope.getProperties = function () {
          //return DataManipulationService.getProperty(scope.field);
        };

        scope.deleteProperty = function () {
         // DataManipulationService.deleteProperty(scope.field);
        };

        scope.getShortText = function (text, maxLength, finalString, emptyString) {
          return StringUtilsService.getShortText(text, maxLength, finalString, emptyString);
        };

        scope.getShortId = function (uri, maxLength) {
          return StringUtilsService.getShortId(uri, maxLength);
        };

        scope.getDescription = function () {
        };

        scope.getId = function () {
        };

        // table or popup view
        scope.isTableView = function() {
          return true;
        }


      }
    }
  }
});

