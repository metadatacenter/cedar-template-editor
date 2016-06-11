'use strict';

define([
  'angular'
], function(angular) {
  angular.module('cedar.templateEditor.layout.cedarStickyLeftMenuDirective', [])
    .directive('cedarStickyLeftMenu', cedarStickyLeftMenuDirective);

  cedarStickyLeftMenuDirective.$inject = ["$window", "$document", "$rootScope", "$timeout", "HeaderService"];

  function cedarStickyLeftMenuDirective($window, $document, $rootScope, $timeout, HeaderService) {

    function link(scope, element, attrs) {

      var resizeTimer;
      var w = angular.element($window);
      var initialOffset = element.offset().top;

      var windowScroll = function () {
        console.log('windowScroll' + $window.innerWidth +" " + $window.pageYOffset + " " + HeaderService.getScrollLimit() + " " + HeaderService.getStickyThreshold());
        if ($window.innerWidth >= 768 && ($window.pageYOffset > HeaderService.getScrollLimit() + HeaderService.getStickyThreshold() )) {
          element.addClass('sticky');
          element.width(element.parent().width());
        } else {
          element.removeClass('sticky');
        }
        element.addClass('sticky');
      }

      var onResizeFunction = function () {
        console.log('resize');
        element.width(element.parent().width());
      }

      var windowResize = function () {
        $timeout.cancel(resizeTimer);
        resizeTimer = $timeout(function () {
          onResizeFunction();
        }, 0);
      }

      w.bind('scroll', windowScroll);
      w.bind('resize', windowResize);

      scope.$on('$destroy', function () {
        w.off('scroll', windowScroll);
        w.off('resize', windowResize);
      });

      // Call to the function when the page is first loaded
      $document.ready(function () {
        windowResize();
        windowScroll();
      });
    }

    return {
      restrict: 'A',
      scope: {},
      link: link
    };
  };

});
