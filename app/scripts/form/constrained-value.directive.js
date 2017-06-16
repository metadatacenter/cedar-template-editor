'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.form.constrainedValue', [])
      .directive('constrainedValue', constrainedValue);


  constrainedValue.$inject = ["$rootScope", "DataManipulationService", "UIUtilService"];

  function constrainedValue($rootScope, DataManipulationService, UIUtilService) {


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
          return (UIUtilService.isEditState($scope.field));
        };

        $scope.isNested = function () {
          return (DataManipulationService.isNested($scope.field));
        };

        $scope.addOption = function () {
          return (DataManipulationService.addOption($scope.field));
        };

      }, true);

      // Updates the model for fields whose values have been constrained using controlled terms
      $scope.updateModelFromUIControlledField = function (modelValue, index) {
        if (modelValue[index] && modelValue[index].termInfo) {
          // Array
          if ($rootScope.isArray($scope.model)) {
            $scope.model[index]['@id'] = modelValue[index].termInfo['@id'];
            $scope.model[index]['_valueLabel'] = modelValue[index].termInfo.label;
          }
          // Single object
          else {
            $scope.model['@id'] = modelValue[index].termInfo['@id'];
            $scope.model['_valueLabel'] = modelValue[index].termInfo.label;
          }
        }
        // Value is undefined
        else {
          // Array
          if ($rootScope.isArray($scope.model)) {
            delete $scope.model[index]['@id'];
            delete $scope.model[index]['_valueLabel'];
          }
          // Single object
          else {
            delete $scope.model['@id'];
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