'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.form.fieldCreate.cardinalitySelector', [])
      .directive('cardinalitySelector', cardinalitySelector);

  cardinalitySelector.$inject = ['$translate','CONST'];

  /**
   * a selector dropdown for min or max cardinality
   */
  function cardinalitySelector($translate, CONST) {


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

        // build the model for the selector
        $scope.init = function () {
          $scope.model = [];

          // set the range
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
            $scope.model[i].label = $translate.instant('GENERIC.' + $scope.cardinalityLabels[v]) ;
            v++;
          }

          // add the unlimited option for max
          if ($scope.type == 'max') {
            $scope.model[i] = {};
            $scope.model[i].value = '0';
            $scope.model[i].label = $translate.instant('GENERIC.' + $scope.zeros[$scope.type]);
          }

          // set the value and label
          $scope.cardinality.value = $scope.getValue();
          $scope.cardinality.label = $scope.getLabel();
        };

        $scope.getValue = function() {
          return ($scope.type == 'min' ? $scope.cardinality.value = $scope.minItems || 0 : $scope.cardinality.value = $scope.maxItems || 0);
        };

        $scope.getLabel = function() {
          return $translate.instant('GENERIC.' + $scope.minMax[$scope.type]) +  ' ' + ($scope.cardinality.value == 0 ? $translate.instant('GENERIC.' + $scope.zeros[$scope.type]) : $translate.instant('GENERIC.' + $scope.cardinalityLabels[$scope.cardinality.value]));
        };

        // update selected value
        $scope.update = function (value) {

          var v = (typeof value == 'string') ? parseInt(value) : value;
          $scope.cardinality.value = v;

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

        // called on close and open
        $scope.toggled = function (value) {
        };


      }

    }
  }
});

