'use strict';

define([
  'angular',
], function(angular) {
  angular.module('cedar.templateEditor.controlTerm.returnNullIfEmptyFilter', [])
    .filter('returnNullIfEmpty', returnNullIfEmptyFilter);

  function returnNullIfEmptyFilter() {
    return function(text) {
      return text == (undefined || 0) ? "-" : text;
    }
  }

});