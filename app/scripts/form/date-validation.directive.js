'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.form.dateValidation', [])

      .directive('dateValidation', dateValidation);

  dateValidation.$inject = ["$rootScope", "$document", "$translate", "$filter", "$location", "$window", '$timeout'];

  function dateValidation($rootScope, $document, $translate, $filter, $location, $window, $timeout) {

    var linker = function ($scope, $element, attrs, mCtrl) {

      function dateValidation(value) {
        var result = $scope.parseDate(value);
        mCtrl.$setValidity('date', result);
        return result || value;
      }

      mCtrl.$parsers.push(dateValidation);

      $scope.$on('runDateValidation', function () {
        mCtrl.$setValidity('date', $scope.parseDate(mCtrl.$modelValue));
      });

      $scope.$on('runTimeValidation', function () {
        mCtrl.$setValidity('time', $scope.parseTime(mCtrl.$modelValue));
      });

      $scope.parseDate = function (value) {
        console.log('parseDate', value);
        var result = false;
        if (value && value.length > 0) {

          var date = new Date(value);
          var year = date.getFullYear();
          var month = date.getMonth() + 1;
          var day = date.getDate();

          if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
            result = year + '-' + month + '-' + day;
          }
        }
        return result;
      };

      $scope.parseTime = function (value) {
        console.log('parseTime', value);
        var result = false;
        if (value && value.length > 0) {

          var date = new Date(value);
          var hour = date.getHours();
          var minute = date.getMinutes();
          var second = date.getSeconds();

          if (!isNaN(hour) && !isNaN(minute) && !isNaN(second)) {
            result = hour + ':' + minute + ':' + second;
          }
        }
        return result;
      };

    };

    return {
      require   : 'ngModel',
      controller: function ($scope, $element) {
      },
      replace   : true,
      link      : linker
    };
  }
});
