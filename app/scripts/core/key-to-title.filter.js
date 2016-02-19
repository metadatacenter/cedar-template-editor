'use strict';

define([
  'angular',
], function(angular) {
  angular.module('cedar.templateEditor.core.keyToTitleFilter', [])
    .filter('keyToTitle', keyToTitle);

  keyToTitle.$inject = [];

  function keyToTitle() {
    return function (input) {
      // Caml case to spaces
      input = input.replace(/([A-Z]+)/g, " $1").replace(/([A-Z][a-z])/g, " $1");
      input = input.replace(/_/g, ' ').toUpperCase();
      return input;
    };
  };

});
