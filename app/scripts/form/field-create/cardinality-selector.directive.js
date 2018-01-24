'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.form.fieldCreate.cardinalitySelector', [])
      .directive('cardinalitySelector', cardinalitySelector);

  cardinalitySelector.$inject = [];

  /**
   * a selector dropdown for min or max cardinality
   */
  function cardinalitySelector() {


    // make the timeout 500;  0 doesn't work for template and element titles
    return {
      restrict   : 'E',
      scope      : {
        minItems: '=',
        maxItems: '=',
        type    : '=',
        required: '='
      },
      templateUrl: 'scripts/form/field-create/cardinality-selector.directive.html',
      link       : function ($scope, $element, attrs) {

        $scope.cardinalityLabels = ['none', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight'];
        $scope.zeros = {'min':'none', 'max':'unlimited'};
        $scope.minMax = {'min':'Min', 'max':'Max'};
        $scope.model = [];

        $scope.cardinality = {
          value: 0,
          min  : $scope.minItems,
          max  : $scope.maxItems,
          label : ''
        };


        $scope.$watch("minItems", function (newValue, oldValue) {
          $scope.init();
        }, true);

        $scope.$watch("maxItems", function (newValue, oldValue) {
          $scope.init();
        }, true);

        $scope.$watch("required", function (newValue, oldValue) {
          $scope.init();
        }, true);


        $scope.init = function () {
          $scope.model = [];

          if ($scope.type == 'min') {
            $scope.cardinality.min = $scope.required ? 1 : 0;
            $scope.cardinality.max = $scope.maxItems ? $scope.maxItems + 1 : 8;

          } else  {
            $scope.cardinality.min = $scope.minItems ? $scope.minItems : 1;
            $scope.cardinality.max = 8;
          }

          var length = $scope.cardinality.max - $scope.cardinality.min;
          var v = $scope.cardinality.min;
          for (var i = 0; i < length; i++) {
            $scope.model[i] = {};
            $scope.model[i].value = v.toString();
            $scope.model[i].label = $scope.cardinalityLabels[v];
            v++;
          }

          if ($scope.type == 'min') {
            if ($scope.required && $scope.cardinality.value == 0) {
              $scope.cardinality.value = 1;
            }
          } else {
            $scope.model[i] = {};
            $scope.model[i].value = '0';
            $scope.model[i].label = 'unlimited';
          }


          // set the label on the dropdown button
          $scope.cardinality.label = $scope.getLabel();
        };

        $scope.getLabel = function() {

          var value = $scope.cardinalityLabels[$scope.cardinality.value];
          var result = $scope.minMax[$scope.type] +  ' ' + ($scope.cardinality.value == 0 ? $scope.zeros[$scope.type] : value);
          return result;
        }

        // update selected value
        $scope.update = function (value) {
          $scope.cardinality.value = value;

          var v = parseInt(value);
          if ($scope.type == 'min') {
            $scope.minItems = v;
            if ($scope.minItems > $scope.maxItems) {
              $scope.maxItems = v;
            }
          } else {
            $scope.maxItems = v;
            if ($scope.minItems > $scope.maxItems) {
              $scope.mminItems = v;
            }
          }

          $scope.init();
        };

        // called on close and open of dropdown
        $scope.toggled = function (value) {
        };

        // initialize directive
        $scope.init();

      }

    }
  }
});

