'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.form.cedarPager', [])
      .directive('cedarPager', cedarPager);


  cedarPager.$inject = ["$rootScope", "$sce", "$document", "$translate", "$filter", "$location",
                        "$window", '$timeout'];

  function cedarPager($rootScope, $sce, $document, $translate, $filter, $location, $window,
                             $timeout) {


    var linker = function ($scope, $element, attrs) {

      $scope.pagingIndex = $scope.index+1;

      $scope.$watch("index", function (newIndex, oldIndex) {
        $scope.pagingIndex = $scope.index+1;
      }, true);

      $scope.$watch("min", function (newMin, oldMin) {
        $scope.pagingIndex = $scope.index+1;
      }, true);

      $scope.$watch("max", function (newMax, oldMax) {
        $scope.pagingIndex = $scope.index+1;
      }, true);


    };

    return {
      templateUrl: 'scripts/form/cedar-pager.directive.html',
      restrict   : 'EA',
      scope      : {
        values: '=',
        index : '=',
        min   : "=",
        max   : "=",
        select: '=',
        range:  '='

      },
      controller : function ($scope, $element) {

      },
      replace    : true,
      link       : linker
    };

  }

})
;