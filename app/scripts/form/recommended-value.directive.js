'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.form.recommendedValue', [])
      .directive('recommendedValue', recommendedValue);


  recommendedValue.$inject = ["$rootScope", "DataManipulationService"];

  function recommendedValue($rootScope, DataManipulationService) {


    var linker = function ($scope, $element, attrs) {

      $scope.valueElement = $scope.$parent.valueArray;
      $scope.isFirstRefresh = true;

      // does this field have a value constraint?
      $scope.hasValueConstraint = function () {
        return DataManipulationService.hasValueConstraint($scope.field);
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
          return (DataManipulationService.isEditState($scope.field));
        };

        $scope.isNested = function () {
          return (DataManipulationService.isNested($scope.field));
        };

        $scope.addOption = function () {
          return (DataManipulationService.addOption($scope.field));
        };

      }, true);

      // if ($scope.model) {
      //   var fieldValue = DataManipulationService.getFieldValue($scope.field);
      //   $scope.modelValueRecommendation = {valueInfo: {'value': $scope.model[fieldValue]}}
      // }

      $scope.updateModelWhenChangeSelection = function (modelvr, index) {
        if (modelvr[index] && modelvr[index].valueInfo && modelvr[index].valueInfo.valueUri) {
          if ($rootScope.isArray($scope.model)) {
            $scope.model[index]['@id'] = modelvr[index].valueInfo.valueUri;
            $scope.model[index]['_valueLabel'] = modelvr[index].valueInfo.value;
            delete $scope.model[index]['@value'];
          }
          else {
            $scope.model['@id'] = modelvr[index].valueInfo.valueUri;
            $scope.model['_valueLabel'] = modelvr[index].valueInfo.value;
            delete $scope.model['@value'];
          }
        }
        else {
          if ($rootScope.isArray($scope.model)) {
            $scope.model[index]['@value'] = modelvr[index].valueInfo.value;
            delete $scope.model[index]['_valueLabel'];
          }
          else {
            $scope.model['@value'] = modelvr[index].valueInfo.value;
            delete $scope.model['_valueLabel'];
          }
        }
      };

      $scope.initializeValueRecommendationField = function () {
        var fieldValue = DataManipulationService.getFieldValue($scope.field);
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
      }

      // Generates modelValueRecommendation from a given model
      $scope.getModelVR = function (model, fieldValue) {
        // if controlled value
        if ($scope.isControlledValue(model)) {
          return {
            'valueInfo': {
              'value'   : model._valueLabel,
              'valueUri': model[fieldValue]
            }
          };
        }
        // if plain text value
        else {
          return {
            'valueInfo': {'value': model[fieldValue]}
          };
        }
      }

      $scope.isControlledValue = function(model) {
        var isControlled = false;
        if (model['_valueLabel']) {
          isControlled = true;
        }
        else if (model['@type'] && model['@type'] == '@id') {
          isControlled = true;
        }
        return isControlled;
      }

      $scope.clearSearch = function (select) {
        select.search = '';
      };

      $scope.setIsFirstRefresh = function (value) {
        $scope.isFirstRefresh = value;
      };

      $scope.updateModelWhenRefresh = function (select, modelvr, index) {
        if (!$scope.isFirstRefresh) {
          // Check that there are no controlled terms selected
          if (select.selected.valueUri == null) {
            // If the user entered a new value
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
              modelvr[index].valueInfo.value = modelValue;
            }
          }
        }
      };

      // $scope.clearSelection = function ($event, select) {
      //   var fieldValue = DataManipulationService.getFieldValue($scope.field);
      //   $event.stopPropagation();
      //   $scope.modelValueRecommendation = {
      //     valueInfo: {'value': null, 'valueUri': null},
      //   }
      //   select.selected = undefined;
      //   select.search = "";
      //   $scope.model[fieldValue] = null;
      //   delete $scope.model['_valueLabel'];
      // };

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
        var addPopover = function ($scope) {
          //Initializing Bootstrap Popover fn for each item loaded
          setTimeout(function () {
            if ($element.find('#field-value-tooltip').length > 0) {
              $element.find('#field-value-tooltip').popover();
            } else if ($element.find('[data-toggle="popover"]').length > 0) {
              $element.find('[data-toggle="popover"]').popover();
            }
          }, 1000);
        };
        addPopover($scope);
      },
      replace    : true,
      link       : linker
    };
  }
});