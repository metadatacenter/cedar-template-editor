'use strict';

angularApp.directive('elementDirective', function () {
    return {
        templateUrl: './views/directive-templates/element/element.html',
        restrict: 'EA',
        scope: {
            element:'='
        }
    };
  });
