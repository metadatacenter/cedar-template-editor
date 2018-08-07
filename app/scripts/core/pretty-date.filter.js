'use strict';

define([
  'angular',
], function(angular) {
  angular.module('cedar.templateEditor.core.prettyDateFilter', [])
    .filter('prettyDate', prettyDate);

  prettyDate.$inject = ['$filter'];

  function prettyDate($filter) {
    return function(value) {
      if (value == null) {
        return '';
      }
      var today = new Date();
      var v = new Date(value);
      if (today.getMonth() == v.getMonth() && today.getYear() == v.getYear() && today.getDay() == v.getDay()) {
        return $filter('date')(value, 'shortTime');
      }
      // if (today.getYear() == v.getYear()) {
      //   return $filter('date')(value, 'MMM d');
      // }
      return $filter('date')(value, 'shortDate');
    };
  };

});
