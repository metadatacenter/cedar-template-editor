'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.searchBrowse.cedarInfiniteScrollDirective', [])
      .directive('cedarInfiniteScroll', cedarInfiniteScrollDirective);

  cedarInfiniteScrollDirective.$inject = ['$timeout','$window'];

  /**
   * load more data when you are scrolled to the bottom
   */
  function cedarInfiniteScrollDirective($timeout,$window) {


    return {
      restrict: 'AC',
      link    : function (scope, element, attr) {


        var visibleHeight = element.height();
        var threshold = 60 + visibleHeight/10;

        function resize() {
          var scrollableHeight = element.prop('scrollHeight');
          var hiddenContentHeight = scrollableHeight - visibleHeight;

          if (hiddenContentHeight - element.scrollTop() <= threshold) {
            // Scroll is at the bottom. Loading more rows
            scope.$apply(attr.loadMore);
          }
        }

        element.scroll(function() {
          resize();
        });

        //scope.width = $window.innerWidth;

        angular.element($window).bind('resize', function(){
          visibleHeight = element.height();
          resize();
        });

      }
    };
  }
});
