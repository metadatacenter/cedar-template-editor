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
        const result = $scope.parseDate(value);
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
        let result = false;
        if (value && value.length > 0) {

          const date = new Date(value);
          const year = date.getFullYear();
          const month = date.getMonth() + 1;
          const day = date.getDate();

          if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
            result = year + '-' + month + '-' + day;
          }
        }
        return result;
      };

      $scope.parseTime = function (value) {
        console.log('parseTime', value);
        let result = false;
        if (value && value.length > 0) {

          const date = new Date(value);
          const hour = date.getHours();
          const minute = date.getMinutes();
          const second = date.getSeconds();

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
