'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.searchBrowse.cedarLiveSearchDirective', [])
      .directive('cedarLiveSearch', cedarLiveSearchDirective);

  cedarLiveSearchDirective.$inject = ['$timeout'];

  /**
   * refresh selector on async load of options
   */
  function cedarLiveSearchDirective($timeout) {


    return {
      restrict: 'AC',
      link    : function (scope, element, attr) {

        if (attr.selectModel) {
          scope.$watch(attr.selectModel, function() {
                 scope.$applyAsync(function () {
                   element.selectpicker('refresh');
                 });
          }, true);
        }
      }
    };
  }
});
