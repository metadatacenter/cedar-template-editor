'use strict';

angularApp.directive('resizeHeight', function ($window) {

  function link($scope, $element, attrs) {

    var widthCalc;

    $scope.onResizeFunction = function() {
      widthCalc = $element.width();
      $element.height(widthCalc);
    };

    // Call to the function when the page is first loaded
    $scope.onResizeFunction();

    angular.element($window).bind('resize', function() {
      $scope.onResizeFunction();
    });
  }

  return {
    link: link
  };

});
