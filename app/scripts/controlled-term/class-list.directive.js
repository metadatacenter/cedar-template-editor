'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.controlledTerm.classListDirective', [])
      .directive('classList', classListDirective);

  classListDirective.$inject = ["DataManipulationService","controlledTermDataService", "StringUtilsService"];

  /**
   * display a list of field types for the node
   *
   * @param DataManipulationService
   * @param controlledTermDataService
   * @param StringUtilsService
   * @returns {{restrict: string, scope: {field: string}, templateUrl: string, link: Function}}
   */
  function classListDirective( DataManipulationService, controlledTermDataService, StringUtilsService) {

    return {
      restrict: 'E',
      scope   : {
        field         : '=',
        viewType      : '=',
        dialogOpen    : '='
      },
      templateUrl     : 'scripts/controlled-term/class-list.directive.html',
      link    : function (scope, element, attrs) {

        scope.addedFieldKeys = [];
        scope.addedFields = new Map();
        scope.terms = null;

        // update terms when field changes
        scope.$watch("field", function(newValue, oldValue) {
          if (newValue !== undefined && Object.keys(newValue).length != 0) {
            var newTerms = DataManipulationService.getFieldControlledTerms(newValue);
            if (oldValue === undefined || newTerms !== scope.terms) {
              scope.getType();
            }
          }
        });

        // new class added
        scope.$on("field:controlledTermAdded", function (event,args) {
          if (args[1] == DataManipulationService.getId(scope.field)) {
            scope.getType();
          }

        });

        var setResponse = function (item, ontologyName, className) {
          // Get selected class details from the links.self endpoint provided.
          controlledTermDataService.getClassById(ontologyName, className).then(function (response) {
            scope.addedFields.set(item, response);
          });
        };

        scope.deleteFieldAddedItem = function (itemDataId) {
          DataManipulationService.deleteFieldControlledTerm(itemDataId, scope.field);
          scope.getType();
        };

        // build the map of terms
        scope.getType = function() {

          scope.terms = DataManipulationService.getFieldControlledTerms(scope.field);

          if (scope.terms) {

            // create a new map to avoid any duplicates coming from the modal
            var myMap = new Map();

            // move the keys into the new map
            for (var i = 0; i < scope.terms.length; i++) {
              var key = scope.terms[i];
              if (myMap.has(key)) {

                // here is a duplicate, so delete it
                DataManipulationService.deleteFieldControlledTerm(key, scope.field);
              } else {
                myMap.set(key, "");
              }
            }

            // copy over any responses from the old map
            myMap.forEach(function (value, key) {

              if (scope.addedFields.has(key)) {
                myMap.set(key, scope.addedFields.get(key));
              }
            }, myMap);


            // get any missing responses
            myMap.forEach(function (value, key) {
              if (myMap.get(key) == "") {
                setResponse(key, DataManipulationService.parseOntologyName(key), key);
              }
            }, myMap);


            // fill up the key array
            scope.addedFieldKeys = [];
            myMap.forEach(function (value, key) {
              scope.addedFieldKeys.push(key);
            }, myMap);

            // hang on to the new map
            scope.addedFields = myMap;

          }
          else {
            // If there are no controlled terms for the field type defined in the model, the map will be empty
            scope.addedFields = new Map();
            scope.addedFieldKeys = [];
          }
        };

        scope.getShortText = function (text, maxLength, finalString, emptyString) {
          return StringUtilsService.getShortText(text, maxLength, finalString, emptyString);
        };

        scope.getShortId = function (uri, maxLength) {
          return StringUtilsService.getShortId(uri, maxLength);
        };

        scope.getClassDescription = function (item) {
          var result = "";
          if (scope.addedFields && scope.addedFields.has(item)) {
            if (scope.addedFields.get(item).definitions && scope.addedFields.get(item).definitions.length > 0) {
              result = scope.addedFields.get(item).definitions[0];
            }
          }
          return result;
        };

        scope.getClassId = function (item) {
          var result = "";
          if (scope.addedFields && scope.addedFields.has(item)) {
            if (scope.addedFields.get(item).id) {
              result = scope.addedFields.get(item).id;
            }
          }
          return result;
        };

        scope.getPrefLabel = function (item) {
          var result = "";
          if (scope.addedFields && scope.addedFields.has(item)) {
            result = scope.addedFields.get(item).prefLabel;
          }
          return result;
        };

        scope.parseOntologyCode = function (source) {
          return DataManipulationService.parseOntologyCode(source);
        };

        scope.parseOntologyName = function (dataItemsId) {
          return DataManipulationService.parseOntologyName(dataItemsId);
        };

        // table or popup view
        scope.isTableView = function() {
          return scope.viewType && scope.viewType !== 'popup'
        }
      }
    }
  }
});

