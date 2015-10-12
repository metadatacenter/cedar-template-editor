'use strict';

angularApp.directive('elementDirective', function () {
  return {
    templateUrl: './views/directive-templates/element-directive.html',
    restrict: 'EA',
    scope: {
      key:'=',
      element:'=',
      delete: '&',
      preview: '=',
      model: '='
    },
    link: function(scope) {
      scope.selectedTab = scope.selectedTab || 0;
      scope.selectTab = function(index) {
        scope.selectedTab = index;
      }
      scope.addElement = function() {
        if (scope.model.length < scope.element.maxItems) {
          var seed = angular.copy(scope.model[0]);
          angular.forEach(seed, function(model, key) {
            for (var i = 0; i < model.length; i++) {
              if (typeof(model[i] == "string")) {
                model[i]["value"] = "";
              } else {
                model[i]["value"] = {};
              }
            }
          });

          scope.model.push(seed);
        }
      }
    }
  };
});
