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
      return $filter('date')(value * 1000, 'short');
    };
  };

});
