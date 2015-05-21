'use strict';

var pattern = /^@/i;

angularApp.directive('elementDirective', function () {
    return {
      controller: function($scope){
        // Returning false if the object key value passed into the element-directive belongs to json-ld '@'
        $scope.ignoreKey = function(key) {
          var result = pattern.test(key);
          return !result;
        }
      },
      templateUrl: './views/directive-templates/element/element.html',
      restrict: 'EA',
      scope: {
          element:'='
      }
    };
  });
