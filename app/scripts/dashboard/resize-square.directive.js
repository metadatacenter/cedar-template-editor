'use strict';

define([
  'angular'
], function(angular) {
  angular.module('cedar.templateEditor.dashboard.resizeSquareDirective', [])
    .directive('cedarResizeSquare', cedarResizeSquare);

  cedarResizeSquare.$inject = ['$window', '$document', '$timeout'];

  function cedarResizeSquare($window, $document, $timeout) {

    function link(scope, element, attrs) {

      var resizeTimer;
      var resizeTimer0;
      var w = angular.element($window);

      var onResizeFunction = function () {
        var widthCalc = element.width();
        if (widthCalc == 0) {
          $timeout.cancel(resizeTimer0);
          resizeTimer0 = $timeout(function () {
            w.triggerHandler('resize')
          }, 250);
        } else {
          element.height(widthCalc);
        }
      };

      var windowResize = function () {
        $timeout.cancel(resizeTimer);
        resizeTimer = $timeout(function () {
          onResizeFunction();
        }, 1250);
      }

      w.on('resize', windowResize);

      scope.$on("$destroy", function () {
        $timeout.cancel(resizeTimer);
        $timeout.cancel(resizeTimer0);
        w.off('resize', windowResize);
      });

      // Call to the function when the page is first loaded
      $document.ready(function () {
        onResizeFunction();
      });
    }

    return {
      restrict: 'A',
      link: link
    };

  };

});
