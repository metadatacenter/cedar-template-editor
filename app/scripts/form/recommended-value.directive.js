'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.form.recommendedValue', [])
      .directive('recommendedValue', recommendedValue);


  recommendedValue.$inject = ["$rootScope", "$q", "DataManipulationService", "UIUtilService", "ValueRecommenderService", "autocompleteService", "schemaService"];

  function recommendedValue($rootScope, $q, DataManipulationService, UIUtilService, ValueRecommenderService, autocompleteService, schemaService) {


    var linker = function ($scope, $element, attrs) {

      $scope.valueRecommendationResults = ValueRecommenderService.valueRecommendationResults;

      $scope.order = function (arr) {
        return arr;
      };

      $scope.updatePopulatedFields = function(field, valueLabel, valueType) {
        console.log('*** updatePopulatedFields')
        ValueRecommenderService.updatePopulatedFields(field, valueLabel, valueType);
      };

      $scope.getValueRecommendationResults = ValueRecommenderService.getValueRecommendationResults;

      $scope.updateValueRecommendationResults = function(field, query) {
        console.log('*** updateValueRecommendationResults')
        // We call BioPortal and wait for all the promises to complete
        let promises = autocompleteService.updateFieldAutocomplete(field, query);
        $q.all(promises).then(values => {
          ValueRecommenderService.updateValueRecommendationResults(field, query);
        });
      };

      $scope.updateFieldAutocomplete = function(field, query) {
        autocompleteService.updateFieldAutocomplete(field, query || '*');
      };

      $scope.getNoResultsMsg = ValueRecommenderService.getNoResultsMsg;

      $scope.valueElement = $scope.$parent.valueArray;
      $scope.isFirstRefresh = true;

      $scope.modelValueRecommendation;

      // does this field have a value constraint?
      $scope.hasValueConstraint = function () {
        return DataManipulationService.hasValueConstraint($scope.field);
      };

      $scope.getId = function () {
        return DataManipulationService.getId($scope.field);
      };

      // is this field required?
      $scope.isRequired = function () {
        return DataManipulationService.isRequired($scope.field);
      };

      if ($scope.hasValueConstraint() && $scope.isRequired()) {
        $scope.$emit('formHasRequiredfield._uis');
      }

      // Used just for text fields whose values have been constrained using controlled terms
      $scope.$watch("model", function () {

        $scope.isEditState = function () {
          return (UIUtilService.isEditState($scope.field));
        };

        $scope.isNested = function () {
          return (DataManipulationService.isNested($scope.field));
        };

        $scope.addOption = function () {
          return (DataManipulationService.addOption($scope.field));
        };

      }, true);

      $scope.updateModelWhenChangeSelection = function (modelvr, index) {
        console.log('*** updateModelWhenChangeSelection')
        if (modelvr[index] && modelvr[index].valueInfo) {
          // URI
          if (modelvr[index].valueInfo.valueType) {
            // Array
            if ($rootScope.isArray($scope.model)) {
              $scope.model[index]['@id'] = modelvr[index].valueInfo.valueType;
              $scope.model[index]['rdfs:label'] = modelvr[index].valueInfo.valueLabel;
              delete $scope.model[index]['@value'];
            }
            // Single object
            else {
              $scope.model['@id'] = modelvr[index].valueInfo.valueType;
              $scope.model['rdfs:label'] = modelvr[index].valueInfo.valueLabel;
              delete $scope.model['@value'];
            }
          }
          // Free text
          else {
            // Array
            if ($rootScope.isArray($scope.model)) {
              $scope.model[index]['@value'] = modelvr[index].valueInfo.valueLabel;
              delete $scope.model[index]['rdfs:label'];
            }
            // Single object
            else {
              $scope.model['@value'] = modelvr[index].valueInfo.valueLabel;
              delete $scope.model['rdfs:label'];
            }
          }
        }
        // Value is undefined
        else {
          // Array
          if ($rootScope.isArray($scope.model)) {
            delete $scope.model[index]['@id'];
            delete $scope.model[index]['@value'];
            delete $scope.model[index]['rdfs:label'];
          }
          // Single object
          else {
            delete $scope.model['@id'];
            delete $scope.model['@value'];
            delete $scope.model['rdfs:label'];
          }
        }
      };

      $scope.initializeValueRecommendationField = function () {
        console.log('*** initializeValueRecommendationField')
        autocompleteService.clearResults($scope.getId($scope.field)); // clear ontology terms cache for the field
        var fieldValue = DataManipulationService.getValueLocation($scope.field);
        $scope.isFirstRefresh = true;
        $scope.modelValueRecommendation = [];
        // If $scope.model is an Array
        if ($rootScope.isArray($scope.model)) {
          angular.forEach($scope.model, function (m, i) {
            $scope.modelValueRecommendation.push($scope.getModelVR(m, fieldValue));
          })
        }
        // If $scope.model is a single object
        else {
          $scope.modelValueRecommendation.push($scope.getModelVR($scope.model, fieldValue));
        }
      };

      // Generates modelValueRecommendation from a given model
      $scope.getModelVR = function (model, fieldValue) {
        // if controlled value
        if ($scope.isControlledValue(model)) {
          return {
            'valueInfo': {
              'valueLabel': model['rdfs:label'],
              'valueType': model[fieldValue]
            }
          };
        }
        // if plain text value
        else {
          return {
            'valueInfo': {'valueLabel': model[fieldValue]}
          };
        }
      };

      $scope.isControlledValue = function(model) {
        var isControlled = false;
        if (model['rdfs:label']) {
          isControlled = true;
        }
        else if (model['@type'] && model['@type'] == '@id') {
          isControlled = true;
        }
        return isControlled;
      };

      $scope.clearSearch = function (select) {
        select.search = '';
      };

      $scope.setIsFirstRefresh = function (value) {
        $scope.isFirstRefresh = value;
      };

      // Updates the model as the user types into the field
      $scope.updateModelWhenRefresh = function (field, select, modelvr, index) {
        console.log('*** updateModelWhenRefresh')
        console.log('modelvr: ')
        console.log(modelvr)
        console.log('select.search: ' + select.search)
        console.log('select.selected:')
        console.log(select.selected)
        if (!$scope.isFirstRefresh && !schemaService.isConstrained(field)) {
          // Check that there are no controlled terms selected
          if (select.selected && select.selected.valueType) {
            // If the user entered a new value
            //if (select.search != modelvr[index].valueInfo.valueLabel) {
              var modelValue;
              if (select.search == "" || select.search == undefined) {
                modelValue = null;
              }
              else {
                modelValue = select.search;
              }
              if ($rootScope.isArray($scope.model)) {
                $scope.model[index]['@value'] = modelValue;
              }
              else {
                $scope.model['@value'] = modelValue;
              }
              console.log('modelValue: ' + modelValue)
              modelvr[index].valueInfo.valueLabel = modelValue;
            //}
          }
        }
      };

      $scope.calculateUIScore = function (score) {
        var s = Math.floor(score * 100);
        if (s < 1) {
          return "<1%";
        }
        else {
          return s.toString() + "%";
        }
      };

      $scope.initializeValueRecommendationField();
    };

    return {
      templateUrl: 'scripts/form/recommended-value.directive.html',
      restrict   : 'EA',
      scope      : {
        field: '=',
        model: '=',
        index: '=',

      },
      controller : function ($scope, $element) {
      },
      replace    : true,
      link       : linker
    };
  }
});