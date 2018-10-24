'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.form.constrainedDefault', [])
      .directive('constrainedDefault', constrainedDefault);


  constrainedDefault.$inject = ["DataManipulationService", "UIUtilService", "autocompleteService", '$q'];

  function constrainedDefault(DataManipulationService, UIUtilService, autocompleteService, $q) {


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
      $scope.updateModelFromUIControlledField = function (modelValue) {
        console.log('updateModelFromUIControlledField', modelValue, $scope.model);
        if (modelValue && modelValue.termInfo) {
          var termId = modelValue.termInfo['@id'];
          var termLabel = modelValue.termInfo.label;
          var termNotation;
          // If 'notation' is there, use it. The 'notation' attribute is used in the CADSR-VS ontology to represent the
          // value that needs to be stored, which is different from the value that is shown on the UI.
          if (modelValue.termInfo.notation) {
            termNotation = modelValue.termInfo.notation;
          }


          $scope.model['@id'] = termId;
          $scope.model['rdfs:label'] = termLabel;
          if (termNotation) {
            $scope.model['skos:notation'] = termNotation;
          }


        }
        // Value is undefined
        else {

          delete $scope.model['@id'];
          delete $scope.model['rdfs:label'];
          delete $scope.model['skos:notation'];

        }
      };

      $scope.updateUIFromModelControlledField = function () {
        console.log('updateUIFromModelControlledField');
        // "defaultValue": {
        //   "@id": "http://purl.bioontology.org/ontology/LNC/LP256429-4",
        //       "rdfs:label": "Duffy group &#x7C; Red Blood Cells"
        // }

        if (dms.hasValueConstraint($scope.field)) {

          if (!dms.getValueConstraint($scope.field).hasOwnProperty('defaultValue')) {
            dms.getValueConstraint($scope.field)['defaultValue'] = {
                "@id": "http://purl.bioontology.org/ontology/LNC/LP256429-4",
                "rdfs:label": "Duffy group &#x7C; Red Blood Cells"
            };
          }

          $scope.modelValue = dms.getValueConstraint($scope.field);

          console.log('updateUIFromModelControlledField', $scope.modelValue);
        }

      };

      // Initializes model for fields constrained using controlled terms
      $scope.updateUIFromModelControlledField();
    };

    return {
      templateUrl: 'scripts/form/constrained-default.directive.html',
      restrict   : 'EA',
      scope      : {
        field: '=',
        model: '='

      },
      controller : function ($scope, $element) {
      },
      replace    : true,
      link       : linker
    };

  }

})
;