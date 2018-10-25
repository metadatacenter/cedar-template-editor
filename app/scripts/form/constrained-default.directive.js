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

      // apply user mods to the drop down list
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

      // order the drop down values
      $scope.order = function (arr) {
        if (arr) {
          var dup = $scope.applyMods(arr);
          return dup;
        }
      };

      // get resource id
      $scope.getId = function () {
        return dms.getId($scope.field);
      };

      $scope.model.defaultValue = $scope.model.defaultValue || {};


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