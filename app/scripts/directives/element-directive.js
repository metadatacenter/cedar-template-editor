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
      model: '=',
      nestedElement: "="
    },
    link: function(scope) {
      var resetElement = function(el, settings) {
        angular.forEach(el, function(model, key) {
          if (settings[key] && settings[key].minItems && angular.isArray(model)) {
            model.splice(settings[key].minItems, model.length);
          }

          if (angular.isArray(model)) {
            for (var i = 0; i < model.length; i++) {
              if (typeof(model[i]["value"]) == "string") {
                model[i]["value"] = "";
              } else if (angular.isArray(model[i]["value"])) {
                model[i]["value"] = [];
              } else if (angular.isObject(model[i]["value"])) {
                model[i]["value"] = {};
              } else if (model[i]["value"] === undefined) {
                resetElement(model[i], settings[key]);
              }
            }
          }
        });
      }

      scope.selectedTab = scope.selectedTab || 0;
      scope.selectTab = function(index) {
        scope.selectedTab = index;
      }
      scope.addElement = function() {
        if (!scope.preview) {
          if (scope.element.maxItems == "N" || scope.model.length < scope.element.maxItems) {
            var seed = angular.copy(scope.model[0]);

            resetElement(seed, scope.element);
            scope.model.push(seed);
          }
        }
      }

      scope.removeElement = function(index) {
        if (scope.model.length > scope.element.minItems) {
          scope.model.splice(index, 1);
        }
      }
    }
  };
});
