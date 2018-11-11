'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.form.constrainedValue', [])
      .directive('constrainedValue', constrainedValue);

  constrainedValue.$inject = ["DataManipulationService", "UIUtilService", "schemaService", "instanceModelService",
                              "autocompleteService", "CONST"];

  //
  // Updates the model for fields whose values have been constrained using controlled terms
  //
  function constrainedValue(DataManipulationService, UIUtilService, schemaService, instanceModelService,
                            autocompleteService, CONST) {

    var linker = function ($scope, $element, attrs) {

      var dms = DataManipulationService;
      $scope.autocompleteResultsCache = autocompleteService.autocompleteResultsCache;
      $scope.updateFieldAutocomplete = autocompleteService.updateFieldAutocomplete;
      $scope.data;

      // is this a required field?
      $scope.isRequiredError = function () {
        var isEmpty = function (obj) {
          for (var key in obj) {
            if (obj.hasOwnProperty(key))
              return false;
          }
          return true;
        };
        return schemaService.isRequired($scope.field) && isEmpty($scope.data.termInfo);
      };

      // order the results based on user preferences
      $scope.order = function (arr) {
        if (arr) {
          var dup = dms.applyActions(arr, schemaService.getActions($scope.field));
          return dup;
        }
      };

      // get the resource identifier
      $scope.getId = function () {
        return schemaService.getId($scope.field);
      };

      // update model with changed data from UI
      $scope.onChange = function () {

        if ($scope.data.termInfo && $scope.data.termInfo['@id']) {

          // got something, put it in the instance
          instanceModelService.setConstrainedValue($scope.model,  $scope.data.termInfo['@id'], $scope.data.termInfo['label'], $scope.data.termInfo['notation']);

        } else {

          // nothing, delete properties
          instanceModelService.removeConstrainedValue($scope.model);

        }
      };


      //
      // initialize the data model that the controlled term dropdown will use to collect user actions
      //

      $scope.data = {termInfo: {}};

      // is there already a value defined?
      if (instanceModelService.hasConstrainedValue($scope.model)) {

        let termId = instanceModelService.getConstrainedTermId($scope.model);
        let label = instanceModelService.getConstrainedLabel($scope.model);
        let notation = instanceModelService.getConstrainedNotation($scope.model);

        // and in our data model
        $scope.data.termInfo['@id'] = termId;
        $scope.data.termInfo['label'] = label;
        $scope.data.termInfo['notation'] = notation;

      } else {
        // does it have a default value
        if (schemaService.hasDefaultValueConstraint($scope.field)) {

          let termId = schemaService.getDefaultValueConstraintTermId($scope.field);
          let label = schemaService.getDefaultValueConstraintLabel($scope.field);
          let notation = schemaService.getDefaultValueConstraintNotation($scope.field);

          // put it in our instance
          instanceModelService.setConstrainedValue($scope.model, termId, label, notation);

          // and in our data model
          $scope.data.termInfo['@id'] = termId;
          $scope.data.termInfo['label'] = label;
          $scope.data.termInfo['notation'] = notation;
        }
      }
    };

    return {
      templateUrl: 'scripts/form/constrained-value.directive.html',
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