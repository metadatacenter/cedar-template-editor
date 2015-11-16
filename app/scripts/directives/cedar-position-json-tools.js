'use strict';

var cedarPositionJsonTools = function ($window, $document, $timeout) {

  function link(scope, $element, attrs) {

    var repositionTimer;
    var w = angular.element($window);
    var headerCtrl = angular.element('#headerCtrl');
    var headerCtrlMini = angular.element('#headerCtrlMini');
    var tools = angular.element('#jsonTools');

    var onRepositionFunction = function () {
      var x = headerCtrl.offset().left + headerCtrl.width();
      if (x == 0) {
        x = headerCtrlMini.offset().left + headerCtrlMini.width();
      }
      if (x == 0) {
        $timeout(function () {
          w.triggerHandler('resize')
        }, 250);
      } else {
        tools.css('position', 'fixed').css('top', '5px').css('left', (x + 40) + 'px').css('display', 'block');
      }
    };

    var windowResize = function () {
      $timeout.cancel(repositionTimer);
      repositionTimer = $timeout(function () {
        onRepositionFunction();
      }, 250);
    }

    w.bind('resize', windowResize);

    scope.$on("$destroy", function () {
      $timeout.cancel(repositionTimer);
      w.off('resize', windowResize);
    });

    // Call to the function when the page is first loaded
    $document.ready(function () {
      onRepositionFunction();
    });
  }

  return {
    link: link
  };

};

cedarPositionJsonTools.$inject = ['$window', '$document', '$timeout'];
angularApp.directive('cedarPositionJsonTools', cedarPositionJsonTools);