'use strict';

angularApp.directive('resizeHeight', function ($window) {

  function link($scope, $element, attrs) {

    var widthCalc,
        resizeTimer;

    $scope.onResizeFunction = function() {
      widthCalc = $element.width();
      $element.height(widthCalc);
    };

    // Call to the function when the page is first loaded
    $scope.onResizeFunction();

    angular.element($window).bind('resize', function() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function() {

        // Run code here, resizing has "stopped"
        $scope.onResizeFunction();  
      }, 250);
    });
  }

  return {
    link: link
  };

});
