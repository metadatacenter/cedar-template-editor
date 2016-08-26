'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.searchBrowse.cedarInfiniteScrollDirective', [])
      .directive('cedarInfiniteScroll', cedarInfiniteScrollDirective);

  cedarInfiniteScrollDirective.$inject = ['$timeout'];

  /**
   * load more data when you are scrolled to the bottom
   */
  function cedarInfiniteScrollDirective($timeout) {


    return {
      restrict: 'AC',
      link    : function (scope, element, attr) {


        var visibleHeight = element.height();
        var threshold = 60;

        element.scroll(function() {
          var scrollableHeight = element.prop('scrollHeight');
          var hiddenContentHeight = scrollableHeight - visibleHeight;

          if (hiddenContentHeight - element.scrollTop() <= threshold) {
            // Scroll is at the bottom. Loading more rows
            scope.$apply(attr.loadMore);

          }
        });

      }
    };
  }
});
