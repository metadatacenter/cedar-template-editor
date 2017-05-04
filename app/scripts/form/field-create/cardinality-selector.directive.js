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
      restrict: 'E',
      scope   : {
        minItems: '=',
        maxItems: '=',
        minOrMax: '='
      },
      templateUrl : 'scripts/form/field-create/cardinality-selector.directive.html',
      link    : function ($scope, $element, attrs) {

        $scope.cardinality = {
          min : {
            isopen: false,
            value: null,
            arr: [{
              value: '0',
              label: 'none'
            }, {
              value: '1',
              label: 'one'
            }, {
              value: '2',
              label: 'two'
            }, {
              value: '3',
              label: 'three'
            }, {
              value: '4',
              label: 'four'
            }, {
              value: '5',
              label: 'five'
            }, {
              value: '6',
              label: 'six'
            }, {
              value: '7',
              label: 'seven'
            }, {
              value: '8',
              label: 'eight'
            }]
          },
          max : {
            isopen: false,
            value: null,
            arr: [{
              value: '0',
              label: 'unlimited'
            }, {
              value: '1',
              label: 'one'
            }, {
              value: '2',
              label: 'two'
            }, {
              value: '3',
              label: 'three'
            }, {
              value: '4',
              label: 'four'
            }, {
              value: '5',
              label: 'five'
            }, {
              value: '6',
              label: 'six'
            }, {
              value: '7',
              label: 'seven'
            }, {
              value: '8',
              label: 'eight'
            }]
          }
        };

        $scope.$watch("minItems", function (newValue, oldValue) {
          $scope.init();
        }, true);

        $scope.$watch("maxItems", function (newValue, oldValue) {
          $scope.init();
        },true);

        // don't let min get larger than max
        $scope.init = function() {
          if ($scope.minItems != null) {
            $scope.cardinality.min.value = $scope.minItems.toString();
            $scope.cardinality.max.value = typeof $scope.maxItems === 'undefined' ? '0' : $scope.maxItems.toString();
          }
        };

        // generate the label
        $scope.getCardinalityLabel = function () {
          var result = $scope.minOrMax == 'min' ? 'Min' : 'Max';
          if ($scope.cardinality[$scope.minOrMax].value !== null) {
            var obj = $scope.cardinality[$scope.minOrMax].arr.map(function (a) {
              return a.label;
            });
            result = result + ' ' + obj[$scope.cardinality[$scope.minOrMax].value];
          }
          return result;
        };

        // update minItems and maxItems for each change
        $scope.update = function (value) {
          $scope.cardinality[$scope.minOrMax].value = value;
          $scope.cardinality[$scope.minOrMax].isopen = false;

          $scope.minItems = parseInt($scope.cardinality.min.value);
          $scope.maxItems = parseInt($scope.cardinality.max.value);
          if ($scope.maxItems && $scope.maxItems < $scope.minItems) {
            $scope.maxItems = 0;
            $scope.cardinality.max.value = '0';
          }
        };

        // initialize directive
        $scope.init();

      }

    }
  }
});

