'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.form.constrainedDefault', [])
      .directive('constrainedDefault', constrainedDefault);


  constrainedDefault.$inject = ["DataManipulationService", "UIUtilService", "schemaService", "autocompleteService",
                                'CONST'];

  function constrainedDefault(DataManipulationService, UIUtilService, schemaService, autocompleteService, CONST) {


    var linker = function ($scope, $element, attrs) {

      var dms = DataManipulationService;
      $scope.autocompleteResultsCache = autocompleteService.autocompleteResultsCache;
      $scope.updateFieldAutocomplete = autocompleteService.updateFieldAutocomplete;
      $scope.data;


      // order the drop down values
      $scope.order = function (arr) {
        if (arr) {
          var dup = dms.applyActions(arr, schemaService.getActions($scope.field));
          return dup;
        }
      };

      // get resource id
      $scope.getId = function () {
        return dms.getId($scope.field);
      };

      // keep model up-to-date with changes in the data
      $scope.onChange = function () {
        if ($scope.data.termInfo) {

          // if we have something put it into the model
          schemaService.setDefaultValueConstraint($scope.field,
              $scope.data.termInfo['@id'],
              $scope.data.termInfo['rdfs:label'],
              $scope.data.termInfo['skos:notation']);

        } else {

          // otherwise delete the default value
          schemaService.removeDefaultValueConstraint($scope.model);
        }
      };


      //
      // initialize the data model that the dropdown will use
      //

      $scope.data = {termInfo: null};
      if (schemaService.hasDefaultValueConstraint($scope.field)) {
        $scope.data.termInfo = {};
        $scope.data.termInfo['@id'] = schemaService.getDefaultValueConstraintTermId($scope.field);
        $scope.data.termInfo['rdfs:label'] = schemaService.getDefaultValueConstraintLabel($scope.field);
        $scope.data.termInfo['skos:notation'] = schemaService.getDefaultValueConstraintNotation($scope.field);
      }
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

});