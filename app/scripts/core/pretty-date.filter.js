'use strict';

define([
  'angular',
], function(angular) {
  angular.module('cedar.templateEditor.core.prettyDateFilter', [])
    .filter('prettyDate', prettyDate);

  prettyDate.$inject = ['$filter', '$rootScope'];

  function prettyDate($filter, $rootScope) {
    return function(value) {
      if (value == null) {
        return '';
      }
      var today = new Date();
      var v = new Date(value);
      if (today.getMonth() == v.getMonth() && today.getYear() == v.getYear() && today.getDay() == v.getDay()) {
        return $filter('date')(value, 'shortTime');
      }
      // Honor the user's preferred date format (moment.js tokens, e.g. 'MMM D, YYYY').
      // CedarUser is exposed on $rootScope in core/run.js; fall back to the locale shortDate.
      var fmt = ($rootScope.cedarUser && $rootScope.cedarUser.getPreferredDateFormat)
        ? $rootScope.cedarUser.getPreferredDateFormat()
        : null;
      if (fmt && window.moment) {
        return window.moment(v).format(fmt);
      }
      return $filter('date')(value, 'shortDate');
    };
  };

});
