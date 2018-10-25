'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.form.constrainedValue', [])
      .directive('constrainedValue', constrainedValue);


  constrainedValue.$inject = ["DataManipulationService", "UIUtilService", "autocompleteService", '$q'];

  function constrainedValue(DataManipulationService, UIUtilService, autocompleteService, $q) {


    var linker = function ($scope, $element, attrs) {

      var dms = DataManipulationService;
      $scope.autocompleteResultsCache = autocompleteService.autocompleteResultsCache;
      $scope.updateFieldAutocomplete = autocompleteService.updateFieldAutocomplete;
      $scope.mods = dms.getMods($scope.field);


      // does this field have a value constraint?
      $scope.hasValueConstraint = function () {
        return dms.hasValueConstraint($scope.field);
      };

      $scope.applyMods = function (list) {
        // apply mods to a duplicate of the list
        var dup = list.slice();
        for (let i = 0; i < $scope.mods.length; i++) {
          let mod = $scope.mods[i];
          let from = dup.findIndex(item => item['@id'] === mod['@id']);
          if (from != -1) {
            // delete it at from
            let entry = dup.splice(from, 1);
            if (mod.to != -1 && mod.action == 'move') {
              // insert it at to
              dup.splice(mod.to, 0, entry[0]);
            }
          }
        }
        return dup;
      };

      $scope.order = function (arr) {
        if (arr) {
          var dup = $scope.applyMods(arr);
          return dup;
        }
      };

      // is this field required?
      $scope.isRequired = function () {
        return dms.isRequired($scope.field);
      };

      $scope.getId = function () {
        return dms.getId($scope.field);
      };

      if ($scope.hasValueConstraint() && $scope.isRequired()) {
        $scope.$emit('formHasRequiredfield._uis');
      }

      // is the field multiple cardinality?
      $scope.isMultipleCardinality = function () {
        return dms.isMultipleCardinality($scope.field);
      };

      // Used just for text fields whose values have been constrained using controlled terms
      $scope.$watch("model", function () {

        $scope.isEditState = function () {
          return (UIUtilService.isEditState($scope.field));
        };

        $scope.isNested = function () {
          return (dms.isNested($scope.field));
        };

        $scope.addOption = function () {
          return (dms.addOption($scope.field));
        };

      }, true);

      // Updates the model for fields whose values have been constrained using controlled terms
      // $scope.updateModelFromUIControlledField = function (modelValue, index) {
      //   console.log('updateModelFromUIControlledField', modelValue, index);
      //   if (modelValue[index] && modelValue[index].termInfo) {
      //     var termId = modelValue[index].termInfo['@id'];
      //     var termLabel = modelValue[index].termInfo.label;
      //     var termNotation;
      //     // If 'notation' is there, use it. The 'notation' attribute is used in the CADSR-VS ontology to represent the
      //     // value that needs to be stored, which is different from the value that is shown on the UI.
      //     if (modelValue[index].termInfo.notation) {
      //       termNotation = modelValue[index].termInfo.notation;
      //     }
      //     // Array
      //     if (angular.isArray($scope.model)) {
      //       $scope.model[index]['@id'] = termId;
      //       $scope.model[index]['rdfs:label'] = termLabel;
      //       if (termNotation) {
      //         $scope.model[index]['skos:notation'] = termNotation;
      //       }
      //     }
      //     // Single object
      //     else {
      //       $scope.model['@id'] = termId;
      //       $scope.model['rdfs:label'] = termLabel;
      //       if (termNotation) {
      //         $scope.model['skos:notation'] = termNotation;
      //       }
      //     }
      //   }
      //   // Value is undefined
      //   else {
      //     // Array
      //     if (angular.isArray($scope.model)) {
      //       delete $scope.model[index]['@id'];
      //       delete $scope.model[index]['rdfs:label'];
      //       delete $scope.model[index]['skos:notation'];
      //     }
      //     // Single object
      //     else {
      //       delete $scope.model['@id'];
      //       delete $scope.model['rdfs:label'];
      //       delete $scope.model['skos:notation'];
      //     }
      //   }
      // };

      $scope.initValue = function () {
        if (dms.hasUserDefinedDefaultValue($scope.field)) {
          if (!$scope.model[$scope.index].hasOwnProperty('@id')) {
            $scope.model[$scope.index] = dms.getUserDefinedDefaultValue($scope.field);
            $scope.model[$scope.index]['rdfs:label'] = $scope.model[$scope.index]['label'];
          }
        }
      };

      $scope.onchange = function () {
        // console.log($scope.model);
        // if ($scope.model[$scope.index].hasOwnProperty('@id')) {
        //   $scope.model[$scope.index]['rdfs:label'] = $scope.model[$scope.index]['label'];
        // }
      };


      $scope.initValue();

    };

    return {
      templateUrl: 'scripts/form/constrained-value.directive.html',
      restrict   : 'EA',
      scope      : {
        field: '=',
        model: '=',
        index: '='


      },
      controller : function ($scope, $element) {
      },
      replace    : true,
      link       : linker
    };

  }

})
;