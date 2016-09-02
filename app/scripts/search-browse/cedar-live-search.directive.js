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

        console.log('cedarLiveSearch');console.log(attr);
        if (attr.ngOptions && / in /.test(attr.ngOptions)) {
          scope.$watch(attr.ngOptions.split(' in ')[1], function() {
            scope.$applyAsync(function () {
              element.selectpicker('refresh');
            });
          }, true);
        }

      }
    };
  }
});
