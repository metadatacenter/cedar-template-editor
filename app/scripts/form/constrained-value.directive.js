'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.form.constrainedValue', [])
      .directive('constrainedValue', constrainedValue);


  constrainedValue.$inject = ["$rootScope", "DataManipulationService"];

  function constrainedValue($rootScope, DataManipulationService) {


    var linker = function ($scope, $element, attrs) {

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

      // is the field multiple cardinality?
      $scope.isMultipleCardinality = function () {
        return DataManipulationService.isMultipleCardinality($scope.field);
      };

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

      // Updates the model for fields whose values have been constrained using controlled terms
      $scope.updateModelFromUIControlledField = function () {
        // Multiple fields
        if ($scope.isMultipleCardinality()) {
          if ($scope.modelValue.length > 0) {
            angular.forEach($scope.modelValue, function (m, i) {
              if (m && m['termInfo'] && m['termInfo']['@id']) {
                $scope.model[i] = {
                  "@id"      : m['termInfo']['@id'],
                  _valueLabel: m['termInfo'].label
                };
              } else {
                delete $scope.model[i]['termInfo']
              }
            });
          }
          else {
            // Default value
            $scope.model = [{'@id': null}];
          }

        }
        // Single fields
        else {
          if ($scope.modelValue[0]['termInfo']) {
            $scope.model['@id'] = $scope.modelValue[0]['termInfo']['@id'];
            $scope.model._valueLabel = $scope.modelValue[0]['termInfo']['label'];
          } else {
            $scope.model['@id'] = null;
            delete $scope.model['_valueLabel'];
          }
        }
      };

      $scope.updateUIFromModelControlledField = function () {
        if ($rootScope.isArray($scope.model)) {
          $scope.modelValue = [];
          angular.forEach($scope.model, function (m, i) {
            $scope.modelValue[i] = {};
            $scope.modelValue[i]['termInfo'] = {
              '@id': m['termInfo'],
              label: m._valueLabel
            };
          });
        }
        else {
          $scope.modelValue = [];
          $scope.modelValue[0] = {};
          $scope.modelValue[0]['termInfo'] = {
            '@id': $scope.model['termInfo'],
            label: $scope.model._valueLabel
          };
        }
      };

      // Initializes model for fields constrained using controlled terms
      $scope.updateUIFromModelControlledField();

      // Load values when opening an instance
      // if ($scope.model) {
      //   $scope.modelValueRecommendation = {'@id': {'value': $scope.model['termInfo']}}
      // }
    };

    return {
      templateUrl: 'scripts/form/constrained-value.directive.html',
      restrict   : 'EA',
      scope      : {
        field  : '=',
        model  : '=',
        index  : '=',

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

})
;