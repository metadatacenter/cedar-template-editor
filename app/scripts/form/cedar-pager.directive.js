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


      $scope.nextPage = function () {
        if ($scope.index + 1 < $scope.values.length) {
          $scope.select($scope.index + 1);
        }
      };

      $scope.previousPage = function () {
        if ($scope.index > 0) {
          $scope.select($scope.index - 1);
        }
      };

      $scope.firstPage = function () {
        if ($scope.index > 0) {
          $scope.select(0);
        }
      };

      $scope.lastPage = function () {
        var last = $scope.values.length;
        if ($scope.index !== last - 1) {
          $scope.select(last - 1);
        }
      };


    };

    return {
      templateUrl: 'scripts/form/cedar-pager.directive.html',
      restrict   : 'EA',
      scope      : {
        values: '=',
        index     : '=',
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