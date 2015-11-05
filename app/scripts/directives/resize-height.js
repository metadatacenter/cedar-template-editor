'use strict';

var resizeHeight = function ($window, $timeout) {

  function link($scope, $element, attrs) {

    var resizeTimer;

    $scope.onResizeFunction = function () {
      var widthCalc = $element.width();
      //console.log("width is:" + widthCalc);
      if (widthCalc == 0) {
        var w = angular.element($window);
        $timeout(function(){ w.triggerHandler('resize') });
      } else {
        $element.height(widthCalc);
      }
    };

    angular.element($window).bind('resize', function () {
      $timeout.cancel(resizeTimer);
      resizeTimer = $timeout(function () {
        $scope.onResizeFunction();
      }, 1250);
    });

    // Call to the function when the page is first loaded
    $scope.onResizeFunction();

  }

  return {
    link: link
  };

};

resizeHeight.$inject = ['$window', '$timeout'];
angularApp.directive('resizeHeight', resizeHeight);