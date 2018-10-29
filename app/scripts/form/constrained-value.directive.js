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

      // initialize with the default value
      let initValue = function () {
        if (dms.hasUserDefinedDefaultValue($scope.field)) {
          if (!$scope.model[$scope.index].hasOwnProperty('@id')) {
            $scope.model[$scope.index] = dms.getUserDefinedDefaultValue($scope.field);
            $scope.model[$scope.index]['rdfs:label'] = $scope.model[$scope.index]['label'];
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

      // TODO get rid of the extra values in some other way
      $scope.onChange = function (m) {
        delete m['@idRelated'];
        delete m['id'];
        delete m['label'];
        delete m['notation'];
        delete m['sourceUri'];
        delete m['type'];
        delete m['vsCollection'];
      };

      // get the resource identifier
      $scope.getId = function () {
        return dms.getId($scope.field);
      };

      //
      // init
      //

      initValue();

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
});