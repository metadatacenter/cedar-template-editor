'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.form.fieldToolbar', [])
      .directive('fieldToolbar', fieldToolbar);


  fieldToolbar.$inject = ['UIUtilService', 'DataManipulationService', 'DataUtilService'];

  function fieldToolbar(UIUtilService, DataManipulationService, DataUtilService) {


    var linker = function ($scope, $element, attrs) {


    };

    return {
      templateUrl: 'scripts/form/field-toolbar.directive.html',
      restrict   : 'EA',
      scope      : {
        field     : "=",
        model     : '=',
        index     : '=',
        viewState : '=',
        remove    : "=",
        add       : "=",
        copy      : "=",
        setActive : '=',
        getLocator: '=',
        expandAll : '=',
        values    : '=',
        min       : '=',
        max       : '=',
        select    : '=',
        range     : '=',
        paging    : '=',
        getHelp      : '=',
        hasHelp: '='
      },
      controller : function ($scope, $element) {

      },
      replace    : true,
      link       : function (scope, element, attrs) {


        scope.isField = function () {
          return !DataUtilService.isElement(DataManipulationService.schemaOf(scope.field));
        };

        scope.isListView = function () {
          return UIUtilService.isListView(scope.viewState);
        };

        scope.isTabView = function () {
          return UIUtilService.isTabView(scope.viewState);
        };

        scope.isMultiple = function () {
          // We consider that checkboxes and multi-choice lists are not 'multiple'
          return (DataManipulationService.isCardinalElement(
              scope.field) && !DataManipulationService.isMultipleChoiceField(scope.field));
        };


        scope.isAttributeValueType = function () {
          return DataManipulationService.isAttributeValueType(scope.field);
        };

        scope.isSpreadsheetView = function () {
          return UIUtilService.isSpreadsheetView(scope.viewState);
        };

        scope.toggleView = function () {
          console.log('toggleView',scope.viewState);
          return UIUtilService.toggleView(scope.viewState);
        };

        scope.cardinalityString = function () {
          return UIUtilService.cardinalityString(scope.field);
        };

        scope.isExpandable = function () {
          return UIUtilService.isExpandable(scope.field);
        };

        // get the field description
        scope.getDescription = function () {
          return DataManipulationService.getDescription(scope.field);
        };

        // has a field description?
        scope.hasDescription = function () {
          return scope.field && DataManipulationService.getDescription(scope.field).length > 0;
        };

        // can we add more?
        scope.canAdd = function () {
          if (scope.field) {
            var maxItems = DataManipulationService.getMaxItems(scope.field);
            return scope.add && DataManipulationService.isElement(
                    scope.field) && scope.isMultiple() && (!maxItems || scope.model.length < maxItems);
          }
        };

        // can we add more?
        scope.canCopy = function () {
          if (scope.field) {
            var maxItems = DataManipulationService.getMaxItems(scope.field);
            return scope.copy && scope.isMultiple() && (!maxItems || scope.model.length < maxItems);
          }
        };

        // can we delete?
        scope.canDelete = function () {
          if (scope.field) {
            var minItems = DataManipulationService.getMinItems(scope.field);
            return scope.remove && scope.isMultiple() && scope.model.length > minItems;
          }
        };

        scope.fullscreen = function () {
          UIUtilService.fullscreen(scope.getLocator(0));
        };


      }
    }
  }
});