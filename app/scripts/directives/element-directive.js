'use strict';

angularApp.directive('elementDirective', function () {
  return {
    templateUrl: './views/directive-templates/element-directive.html',
    restrict: 'EA',
    scope: {
      key:'=',
      element:'=',
      delete: '&'
    }
  };
});
