'use strict';

var positionJsonTools = function ($window, $timeout) {

  function link($scope, $element, attrs) {

    var resizeTimer;

    $scope.onRepositionFunction = function () {
      var a = angular.element('#headerCtrl');
      var x = a.offset().left + a.width();
      if (x == 0) {
        //console.log("x is zero:");
        var a2 = angular.element('#headerCtrlMini');
        x = a2.offset().left + a2.width();
      }
      if (x == 0) {
        //console.log("x2 is zero:");
        var w = angular.element($window);
        $timeout(function () {
          w.triggerHandler('resize')
        }, 250);
      } else {
        var css = 'position:fixed;top:10px;left:' + (x + 40) + 'px;';
        //console.log("set css to:" + css);
        var t = angular.element('#jsonTools');
        t.css('position', 'fixed').css('top', '5px').css('left', (x + 40) + 'px');
      }
    };

    angular.element($window).bind('resize', function () {
      $timeout.cancel(resizeTimer);
      resizeTimer = $timeout(function () {
        $scope.onRepositionFunction();
      }, 500);
    });

    // Call to the function when the page is first loaded
    $scope.onRepositionFunction();

  }

  return {
    link: link
  };

};

positionJsonTools.$inject = ['$window', '$timeout'];
angularApp.directive('positionJsonTools', positionJsonTools);