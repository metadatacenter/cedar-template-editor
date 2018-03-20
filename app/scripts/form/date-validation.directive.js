'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.form.dateValidation', [])

      .directive('dateValidation', dateValidation);

  dateValidation.$inject = ["$rootScope",  "$document", "$translate", "$filter", "$location",
                        "$window", '$timeout'];

  function dateValidation($rootScope,  $document, $translate, $filter, $location, $window,
                      $timeout) {

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

      $scope.parseDate = function (value) {
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
    };

    return {
      require: 'ngModel',
      controller : function ($scope, $element) {
      },
      replace    : true,
      link       : linker
    };
  }
});