'use strict';

var elementDirective = function($rootScope, SpreadsheetService) {
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
    link: function(scope, element, attrs) {
      var resetElement = function(el, settings) {
        angular.forEach(el, function(model, key) {
          if (settings[key] && settings[key].minItems && angular.isArray(model)) {
            model.splice(settings[key].minItems, model.length);
          }

          if (!$rootScope.ignoreKey(key)) {
            if (key == "value") {
              if (angular.isArray(model)) {
                if (settings.properties.info.input_type == "list") {
                  if (settings.properties.info.default_option) {
                    el[key] = angular.copy(settings.properties.info.default_option);
                  } else {
                    model.splice(0, model.length);
                  }
                } else {
                  for (var i = 0; i < model.length; i++) {
                    if (settings.properties.info.default_option) {
                      model[i]["value"] = angular.copy(settings.properties.info.default_option);
                    } else {
                      if (typeof(model[i]["value"]) == "string") {
                        model[i]["value"] = "";
                      } else if (angular.isArray(model[i]["value"])) {
                        model[i]["value"] = [];
                      } else if (angular.isObject(model[i]["value"])) {
                        model[i]["value"] = {};
                      }
                    }
                  }
                }
              } else {
                if (settings.properties.info.default_option) {
                  el[key] = angular.copy(settings.properties.info.default_option);
                } else {
                  if (typeof(model) == "string") {
                    el[key] = "";
                  } else if (angular.isArray(model)) {
                    el[key] = [];
                  } else if (angular.isObject(model)) {
                    el[key] = {};
                  }
                }
              }
            } else {
              if (settings[key]) {
                resetElement(model, settings[key]);
              } else {
                // This case el is an array
                angular.forEach(model, function(v, k) {
                  if (k == "value") {
                    if (angular.isArray(v)) {
                      if (settings.properties.info.input_type == "list") {
                        if (settings.properties.info.default_option) {
                          model[k] = angular.copy(settings.properties.info.default_option);
                        } else {
                          v.splice(0, v.length);
                        }
                      } else {
                        for (var i = 0; i < v.length; i++) {
                          if (settings.properties.info.default_option) {
                            v[i]["value"] = angular.copy(settings.properties.info.default_option);
                          } else {
                            if (typeof(v[i]["value"]) == "string") {
                              v[i]["value"] = "";
                            } else if (angular.isArray(v[i]["value"])) {
                              v[i]["value"] = [];
                            } else if (angular.isObject(v[i]["value"])) {
                              v[i]["value"] = {};
                            }
                          }
                        }
                      }
                    } else {
                      if (settings.properties.info.default_option) {
                        model[k] = angular.copy(settings.properties.info.default_option);
                      } else {
                        if (typeof(v) == "string") {
                          model[k] = "";
                        } else if (angular.isArray(v)) {
                          model[k] = [];
                        } else if (angular.isObject(v)) {
                          model[k] = {};
                        }
                      }
                    }
                  } else {
                    if (settings[k]) {
                      resetElement(v, settings[k]);
                    }
                  }
                });
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
          if (scope.element.minItems && (!scope.element.maxItems || scope.model.length < scope.element.maxItems)) {
            var seed = angular.copy(scope.model[0]);

            resetElement(seed, scope.element);
            scope.model.push(seed);
          }
        }
      }

      scope.removeElement = function(index) {
        if (scope.model.length > scope.element.minItems) {
          scope.model.splice(index, 1);

          if (scope.selectedTab == index) {
            scope.selectedTab = 0;
          }
        }
      }

      scope.switchToSpreadsheet = function () {
        SpreadsheetService.switchToSpreadsheetElement(scope, element);
      }

      scope.switchExpandedState = function () {
        var originalContent = angular.element('.elements', element);
        originalContent.toggle();
        angular.element(".visibilitySwitch").toggle();
      }
    }
  };
};

elementDirective.$inject = ["$rootScope", "SpreadsheetService"];
angularApp.directive('elementDirective', elementDirective);