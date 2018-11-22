'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.form.recommendedValue', [])
      .directive('recommendedValue', recommendedValue);


  recommendedValue.$inject = ["$rootScope", "DataManipulationService", "UIUtilService", "ValueRecommenderService", "autocompleteService"];

  function recommendedValue($rootScope, DataManipulationService, UIUtilService, ValueRecommenderService, autocompleteService) {


    var linker = function ($scope, $element, attrs) {

      $scope.valueRecommendationResults = ValueRecommenderService.valueRecommendationResults;

      $scope.order = function (arr) {
        // if (arr) {
        //   var dup = $scope.applyMods(arr);
        //   return dup;
        // }
        return arr;
      };

      $scope.updatePopulatedFields = function(field, valueLabel, valueType) {
        ValueRecommenderService.updatePopulatedFields(field, valueLabel, valueType);
      };

      $scope.getValueRecommendationResults = ValueRecommenderService.getValueRecommendationResults;

      $scope.updateValueRecommendationResults = function(node, query) {
        ValueRecommenderService.updateValueRecommendationResults(node, query);
      };

      $scope.updateFieldAutocomplete = function(field, term) {
        autocompleteService.updateFieldAutocomplete(field, term || '*');
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
        console.log('Initializing value recommendation field')
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
        console.log('modelValueRecommendation')
        console.log($scope.modelValueRecommendation)
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

      $scope.updateModelWhenRefresh = function (select, modelvr, index) {
        console.log('Updating model when refresh')
        if (!$scope.isFirstRefresh) {
          // Check that there are no controlled terms selected
          if (select.selected.valueUri == null) {
            // If the user entered a new value
            console.log(index)
            console.log(modelvr)
            if (select.search != modelvr[index].valueInfo.value) {
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
              modelvr[index].valueInfo.valueLabel = modelValue;
            }
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