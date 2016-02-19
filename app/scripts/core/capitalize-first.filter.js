'use strict';

define([
  'angular',
], function(angular) {
  angular.module('cedar.templateEditor.core.capitalizeFirstFilter', [])
    .filter('capitalizeFirst', capitalizeFirst);

  capitalizeFirst.$inject = [];

  function capitalizeFirst() {
    // Capitalize first letter
    return function (string) {
      string = string.toLowerCase();
      return string.substring(0, 1).toUpperCase() + string.substring(1);
    };
  };

});
