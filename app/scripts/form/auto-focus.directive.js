'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.form.autoFocusDirective', [])
      .directive('autoFocus', autoFocusDirective);

  autoFocusDirective.$inject = ['$timeout'];

  /**
   * focus and select all input
   */
  function autoFocusDirective($timeout) {


    // make the timeout 500;  0 doesn't seem to work for template and element titles
    return {
      restrict: 'AC',
      link    : function (_scope, _element) {
        $timeout(function () {
          _element[0].focus();
          _element[0].setSelectionRange(0, _element[0].value.length);
        }, 500);
      }
    };
  }
});
