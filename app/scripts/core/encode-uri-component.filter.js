'use strict';

define([
  'angular',
], function(angular) {
  angular.module('cedar.templateEditor.core.encodeURIComponentFilter', [])
    .filter('encodeURIComponent', encodeURIComponent);

  encodeURIComponent.$inject = ['$window'];

  function encodeURIComponent($window) {
    return $window.encodeURIComponent;
  };

});
