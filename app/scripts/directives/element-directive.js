'use strict';

angularApp.directive('elementDirective', function () {
    return {
        templateUrl: './views/directive-templates/element/element.html',
        restrict: 'E',
        scope: {
            element:'='
        }
    };
  });
