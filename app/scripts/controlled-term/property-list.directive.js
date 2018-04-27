'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.controlledTerm.propertyListDirective', [])
      .directive('propertyList', propertyListDirective);

  propertyListDirective.$inject = ["DataManipulationService","StringUtilsService"];

  /**
   * display the assigned property for the field
   *
   */
  function propertyListDirective(DataManipulationService,StringUtilsService) {

    return {
      restrict   : 'E',
      scope      : {
        field     : '=',
        form      : '=',
        dialogOpen: '='
      },
      templateUrl: 'scripts/controlled-term/property-list.directive.html',
      link       : function (scope, element, attrs) {

        scope.location = ["mode", "propertyId", "propertyLabel", 'propertyDescription', "fieldId","propertySource","propertyType"];
        scope.value = ["properties", "", "", "", DataManipulationService.getId(scope.field),"", ""];


        scope.isPropertyMode = function (args) {
          return args && (args[scope.location.indexOf('mode')] === 'property');
        };

        scope.isField = function(args) {
          return args && (args[scope.location.indexOf('fieldId')] === DataManipulationService.getId(scope.field));
        };

        scope.getPropertyId = function () {
          return DataManipulationService.getPropertyId(scope.form, scope.field);
        };

        scope.getShortId = function(uri, maxLength) {
          return StringUtilsService.getShortId(uri, maxLength);
        };

        scope.getLabel = function () {
          return scope.value[scope.location.indexOf('propertyLabel')];
        };

        scope.getType = function () {
          return scope.value[scope.location.indexOf('propertyType')];
        };

        scope.getSource = function () {
          return scope.value[scope.location.indexOf('propertySource')];
        };

        scope.getDescription = function () {
          return scope.value[scope.location.indexOf('propertyDescription')];
        };

        scope.hasPropertyId = function () {
          return DataManipulationService.getPropertyId(scope.form, scope.field).length > 0;
        };

        scope.deleteProperty = function () {
          DataManipulationService.deletePropertyId(scope.form, scope.field);
          DataManipulationService.updateProperty('', '', '', DataManipulationService.getId(scope.field), scope.form);
        };

        // update terms when field changes
        // scope.$watch("field", function(newValue, oldValue) {
        //   if (newValue !== undefined) {
        //     if (scope.hasPropertyId()) {
        //       console.log('update Property List')
        //     }
        //   }
        // });

        // update the property for a field with controlled terms modal selection
        scope.$on("property:propertyAdded", function (event, args) {

          if (scope.isPropertyMode(args) && scope.isField(args)) {

            scope.value[scope.location.indexOf('propertyId')] = args[scope.location.indexOf('propertyId')];
            scope.value[scope.location.indexOf('propertyLabel')] = args[scope.location.indexOf('propertyLabel')];
            scope.value[scope.location.indexOf('propertyDescription')] = args[scope.location.indexOf('propertyDescription')];
            scope.value[scope.location.indexOf('propertySource')] = args[scope.location.indexOf('propertySource')];
            scope.value[scope.location.indexOf('propertyType')] = args[scope.location.indexOf('propertyType')];

            DataManipulationService.updateProperty(args[scope.location.indexOf('propertyId')],
                args[scope.location.indexOf('propertyLabel')], args[scope.location.indexOf('propertyDescription')],
                args[scope.location.indexOf('fieldId')], scope.form);

          }
        });

      }
    }
  }
});

