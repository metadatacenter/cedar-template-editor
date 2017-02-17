'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.core.selectOnClickDirective', [])
      .directive('selectOnClick', selectOnClick);

  selectOnClick.$inject = ['$window'];

  function selectOnClick($window) {

    var directive = {
      restrict: 'EA',
      link    : linker
    };

    return directive;

    function linker(scope, element, attrs) {
      element.bind('click', function () {
        if (!$window.getSelection().toString()) {
          this.setSelectionRange(0, this.value.length)
        }
      });
    }

  };

});
