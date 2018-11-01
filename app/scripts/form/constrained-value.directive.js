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

      $scope.isRequiredError = function () {
        var isEmpty = function(obj) {
          for(var key in obj) {
            if(obj.hasOwnProperty(key))
              return false;
          }
          return true;
        };
        return dms.isRequired($scope.field) && isEmpty($scope.modelValue[$scope.index].termInfo);
      };

      // initialize with the default value
      let initValue = function () {
        if (dms.hasUserDefinedDefaultValue($scope.field)) {
          var id = $scope.modelValue[$scope.index]['termInfo']['@id'];
          if (!id || id.length == 0) {
            $scope.modelValue[$scope.index]['termInfo'] = dms.getUserDefinedDefaultValue($scope.field);
            $scope.updateModelFromUIControlledField($scope.modelValue, $scope.index);
          }
        }
      };

      // apply the user's sorted ordering
      let applyMods = function (list) {
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

      // order the results based on user preferences
      $scope.order = function (arr) {
        if (arr) {
          var dup = applyMods(arr);
          return dup;
        }
      };

      // get the resource identifier
      $scope.getId = function () {
        return dms.getId($scope.field);
      };
      
      // Updates the model for fields whose values have been constrained using controlled terms
      $scope.updateModelFromUIControlledField = function (modelValue, index) {
        if (modelValue[index] && modelValue[index].termInfo) {
          var termId = modelValue[index].termInfo['@id'];
          var termLabel = modelValue[index].termInfo['rdfs:label'];
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
              '@id'       : m['@id'],
              'rdfs:label': m['rdfs:label']
            };
          });
        }
        else {
          $scope.modelValue = [];
          $scope.modelValue[0] = {};
          $scope.modelValue[0]['termInfo'] = {
            '@id'       : $scope.model['@id'],
            'rdfs:label': $scope.model['rdfs:label']
          };
        }
      };

      // Initializes model for fields constrained using controlled terms
      $scope.updateUIFromModelControlledField();
      initValue();

    };

    return {
      templateUrl: 'scripts/form/constrained-value.directive.html',
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