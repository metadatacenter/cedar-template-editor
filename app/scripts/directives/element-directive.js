'use strict';

var elementDirective = function($rootScope, SpreadsheetService) {
  return {
    templateUrl: './views/directive-templates/element-directive.html',
    restrict: 'EA',
    scope: {
      key:'=',
      element:'=',
      delete: '&',
      model: '='
    },
    link: function(scope, element, attrs) {
      scope.elementId = $rootScope.idOf(scope.element) || $rootScope.generateGUID();
      var resetElement = function(el, settings) {
        angular.forEach(el, function(model, key) {
          if (settings[key] && settings[key].minItems && angular.isArray(model)) {
            model.splice(settings[key].minItems, model.length);
          }

          if (!$rootScope.ignoreKey(key)) {
            if (key == "_value") {
              if (angular.isArray(model)) {
                if ($rootScope.propertiesOf(settings)._ui.inputType == "list") {
                  if ($rootScope.propertiesOf(settings)._ui.defaultOption) {
                    el[key] = angular.copy($rootScope.propertiesOf(settings)._ui.defaultOption);
                  } else {
                    model.splice(0, model.length);
                  }
                } else {
                  for (var i = 0; i < model.length; i++) {
                    if ($rootScope.propertiesOf(settings)._ui.defaultOption) {
                      model[i]["_value"] = angular.copy($rootScope.propertiesOf(settings)._ui.defaultOption);
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
                if ($rootScope.propertiesOf(settings)._ui.defaultOption) {
                  el[key] = angular.copy($rootScope.propertiesOf(settings)._ui.defaultOption);
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
                      if ($rootScope.propertiesOf(settings)._ui.inputType == "list") {
                        if ($rootScope.propertiesOf(settings)._ui.defaultOption) {
                          model[k] = angular.copy($rootScope.propertiesOf(settings)._ui.defaultOption);
                        } else {
                          v.splice(0, v.length);
                        }
                      } else {
                        for (var i = 0; i < v.length; i++) {
                          if ($rootScope.propertiesOf(settings)._ui.defaultOption) {
                            v[i]["_value"] = angular.copy($rootScope.propertiesOf(settings)._ui.defaultOption);
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
                      if ($rootScope.propertiesOf(settings)._ui.defaultOption) {
                        model[k] = angular.copy($rootScope.propertiesOf(settings)._ui.defaultOption);
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

      scope.model = scope.model || {};
      scope.state = scope.state || "creating";
      scope.selectedTab = scope.selectedTab || 0;
      scope.selectTab = function(index) {
        scope.selectedTab = index;
      }
      scope.addElement = function() {
        if ($rootScope.isRuntime()) {
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
        element.find('.elementTotalContent').first().toggle();
        element.find(".visibilitySwitch").toggle();
        element.find(".spreadsheetSwitchLink").toggle();
      }

      scope.removeChild = function(fieldOrElement) {
        var selectedKey;
        var props = $rootScope.propertiesOf(scope.element);
        angular.forEach(props, function(value, key) {
          if (value["@id"] == fieldOrElement["@id"]) {
            selectedKey = key;
          }
        });

        if (selectedKey) {
          delete props[selectedKey];

          var idx = scope.element._ui.order.indexOf(selectedKey);
          scope.element._ui.order.splice(idx, 1);
        }
      };

      // When user clicks Save button, we will switch element from creating state to completed state
      scope.add = function() {
        var p = $rootScope.propertiesOf(scope.element);
        if (!p._ui.is_cardinal_field) {
          scope.element.minItems = 1;
          scope.element.maxItems = 1;
        }

        if (scope.element.maxItems == 1) {
          if (scope.element.items) {
            $rootScope.uncardinalizeField(scope.element);
          }
        } else {
          if (!scope.element.items) {
            $rootScope.cardinalizeField(scope.element);
          }
        }

        $rootScope.propertiesOf(scope.element)._ui.state = "completed";
        scope.$emit("form:update");
      };

      // When user clicks edit, the element state will be switched to creating;
      scope.edit = function() {
        $rootScope.propertiesOf(scope.element)._ui.state = "creating";
      };
    }
  };
};

elementDirective.$inject = ["$rootScope", "SpreadsheetService"];
angularApp.directive('elementDirective', elementDirective);
