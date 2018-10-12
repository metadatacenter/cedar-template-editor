'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.form.constrainedValue', [])
      .directive('constrainedValue', constrainedValue);


  constrainedValue.$inject = [ "DataManipulationService", "UIUtilService","autocompleteService"];

  function constrainedValue( DataManipulationService, UIUtilService, autocompleteService) {


    var linker = function ($scope, $element, attrs) {

      $scope.autocompleteResultsCache = autocompleteService.autocompleteResultsCache;
      $scope.updateFieldAutocomplete = autocompleteService.updateFieldAutocomplete;
      $scope.sortOrder = DataManipulationService.getSortOrder($scope.field);


      // does this field have a value constraint?
      $scope.hasValueConstraint = function () {
        return DataManipulationService.hasValueConstraint($scope.field);
      };

      $scope.order = function (arr) {
        var result = arr;
        if (arr)  {
          if ($scope.sortOrder) {
            let sortArray = $scope.sortOrder.split(', ');
            let sortList = [];
            for (let i = 0; i < sortArray.length; i++) {
              let index = arr.findIndex(item => item['@id'] === sortArray[i]);
              sortList.push(arr[index]);
            }
            result = sortList;
          }
        }
        return result;
      };

      // is this field required?
      $scope.isRequired = function () {
        return DataManipulationService.isRequired($scope.field);
      };

      $scope.getId = function () {
        return DataManipulationService.getId($scope.field);
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
          var termId = modelValue[index].termInfo['@id'];
          var termLabel = modelValue[index].termInfo.label;
          var termNotation;
          // If 'notation' is there, use it. The 'notation' attribute is used in the CADSR-VS ontology to represent the
          // value that needs to be stored, which is different from the value that is shown on the UI.
          if (modelValue[index].termInfo.notation) {
            termNotation = modelValue[index].termInfo.notation;
          }
          // Array
          if (angular.isArray($scope.model)) {
            $scope.model[index]['@id'] = termId;
            $scope.model[index]['rdfs:label'] = termLabel;
            if (termNotation) {
              $scope.model[index]['skos:notation'] = termNotation;
            }
          }
          // Single object
          else {
            $scope.model['@id'] = termId;
            $scope.model['rdfs:label'] = termLabel;
            if (termNotation) {
              $scope.model['skos:notation'] = termNotation;
            }
          }
        }
        // Value is undefined
        else {
          // Array
          if (angular.isArray($scope.model)) {
            delete $scope.model[index]['@id'];
            delete $scope.model[index]['rdfs:label'];
            delete $scope.model[index]['skos:notation'];
          }
          // Single object
          else {
            delete $scope.model['@id'];
            delete $scope.model['rdfs:label'];
            delete $scope.model['skos:notation'];
          }
        }
      };

      $scope.updateUIFromModelControlledField = function () {
        if (angular.isArray($scope.model)) {
          $scope.modelValue = [];
          angular.forEach($scope.model, function (m, i) {
            $scope.modelValue[i] = {};
            $scope.modelValue[i]['termInfo'] = {
              '@id': m['termInfo'],
              label: m['rdfs:label']
            };
          });
        }
        else {
          $scope.modelValue = [];
          $scope.modelValue[0] = {};
          $scope.modelValue[0]['termInfo'] = {
            '@id': $scope.model['termInfo'],
            label: $scope.model['rdfs:label']
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