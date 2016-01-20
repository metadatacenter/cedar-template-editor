'use strict';

var elementDirective = function($rootScope, SpreadsheetService, DataUtilService) {
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

          if (!DataUtilService.isSpecialKey(key)) {
            if (key == "_value") {
              if (angular.isArray(model)) {
                if (settings.properties._ui.inputType == "list") {
                  if (settings.properties._ui.defaultOption) {
                    el[key] = angular.copy(settings.properties._ui.defaultOption);
                  } else {
                    model.splice(0, model.length);
                  }
                } else {
                  for (var i = 0; i < model.length; i++) {
                    if (settings.properties._ui.defaultOption) {
                      model[i]["_value"] = angular.copy(settings.properties._ui.defaultOption);
                    } else {
                      if (typeof(model[i]["_value"]) == "string") {
                        model[i]["_value"] = "";
                      } else if (angular.isArray(model[i]["_value"])) {
                        model[i]["_value"] = [];
                      } else if (angular.isObject(model[i]["_value"])) {
                        model[i]["_value"] = {};
                      }
                    }
                  }
                }
              } else {
                if (settings.properties._ui.defaultOption) {
                  el[key] = angular.copy(settings.properties._ui.defaultOption);
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
                  if (k == "_value") {
                    if (angular.isArray(v)) {
                      if (settings.properties._ui.inputType == "list") {
                        if (settings.properties._ui.defaultOption) {
                          model[k] = angular.copy(settings.properties._ui.defaultOption);
                        } else {
                          v.splice(0, v.length);
                        }
                      } else {
                        for (var i = 0; i < v.length; i++) {
                          if (settings.properties._ui.defaultOption) {
                            v[i]["_value"] = angular.copy(settings.properties._ui.defaultOption);
                          } else {
                            if (typeof(v[i]["_value"]) == "string") {
                              v[i]["_value"] = "";
                            } else if (angular.isArray(v[i]["_value"])) {
                              v[i]["_value"] = [];
                            } else if (angular.isObject(v[i]["_value"])) {
                              v[i]["_value"] = {};
                            }
                          }
                        }
                      }
                    } else {
                      if (settings.properties._ui.defaultOption) {
                        model[k] = angular.copy(settings.properties._ui.defaultOption);
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
                  } else if (k !== '@type') {
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
        //console.log("TOGGLE");
        //console.log(scope.model.parent);
        SpreadsheetService.switchToSpreadsheetElement(scope, element);
      }

      scope.switchExpandedState = function () {
        angular.element('.elementTotalContent', element).toggle();
        angular.element(".visibilitySwitch", element).toggle();
        angular.element(".spreadsheetSwitchLink", element).toggle();
      }
    }
  };
};

elementDirective.$inject = ["$rootScope", "SpreadsheetService", "DataUtilService"];
angularApp.directive('elementDirective', elementDirective);