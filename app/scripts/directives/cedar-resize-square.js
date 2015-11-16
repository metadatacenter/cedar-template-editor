'use strict';

var cedarResizeSquare = function ($window, $document, $timeout) {

  function link($scope, $element, attrs) {

    var resizeTimer;
    var resizeTimer0;

    //var counter = 0;

    $scope.onResizeFunction = function () {
      //console.log("resize-height: onResizeFunction, scopeId: " + $scope.$id + " counter: " + counter);
      //counter++;
      var widthCalc = $element.width();
      //console.log("width:" + widthCalc + ":" + (widthCalc == 0));
      //console.log($element);
      if (widthCalc == 0) {
        //console.log("onResize was 0, trigger new event:" + $scope.$id);
        $timeout.cancel(resizeTimer0);
        resizeTimer0 = $timeout(function () {
          var w = angular.element($window);
          w.triggerHandler('resize')
        }, 250);
      } else {
        $element.height(widthCalc);
      }
    };

    angular.element($window).bind('resize', function () {
      //console.log("resize-height: resize");
      $timeout.cancel(resizeTimer);
      resizeTimer = $timeout(function () {
        $scope.onResizeFunction();
      }, 1250);
    });

    $scope.$on("$destroy", function () {
      //console.log("resize-height: destroy, scopeId:" + $scope.$id);
      $timeout.cancel(resizeTimer);
      $timeout.cancel(resizeTimer0);
    });

    // Call to the function when the page is first loaded
    $document.ready(function () {
      $scope.onResizeFunction();
    });
  }

  return {
    link: link
  };

};

cedarResizeSquare.$inject = ['$window', '$document', '$timeout'];
angularApp.directive('cedarResizeSquare', cedarResizeSquare);