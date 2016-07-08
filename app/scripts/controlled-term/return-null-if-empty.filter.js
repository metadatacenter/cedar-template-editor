'use strict';

define([
  'angular',
], function(angular) {
  angular.module('cedar.templateEditor.controlledTerm.returnNullIfEmptyFilter', [])
    .filter('returnNullIfEmpty', returnNullIfEmptyFilter);

  function returnNullIfEmptyFilter() {
    return function(text) {
      return text == (undefined || 0) ? "-" : text;
    }
  }

});