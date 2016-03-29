'use strict';

define([
  'angular'
], function(angular) {
  angular.module('cedar.templateEditor.templateElement.cedarTemplateElementDirective', [])
    .directive('cedarTemplateElement', cedarTemplateElementDirective);
  
  cedarTemplateElementDirective.$inject = ['$rootScope', 'DataManipulationService', 'DataUtilService', 'SpreadsheetService'];

  function cedarTemplateElementDirective($rootScope, DataManipulationService, DataUtilService, SpreadsheetService) {

    var directive = {
      restrict: 'EA',
      scope: {
        key:'=',
        element:'=',
        delete: '&',
        model: '=',
        isRootElement: "="
      },
      templateUrl: 'scripts/template-element/cedar-template-element.directive.html',
      link: linker
    };

    return directive;

    function linker(scope, element, attrs) {
      scope.elementId = $rootScope.idOf(scope.element) || $rootScope.generateGUID();

      var resetElement = function(el, settings) {
        angular.forEach(el, function(model, key) {
          if (settings[key] && settings[key].minItems && angular.isArray(model)) {
            model.splice(settings[key].minItems, model.length);
          }

          if (!DataUtilService.isSpecialKey(key)) {
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

      var parseElement = function() {
        if (!$rootScope.isRuntime() && scope.element) {
          if (angular.isArray(scope.model)) {
            angular.forEach(scope.model, function(m) {
              $rootScope.findChildren($rootScope.propertiesOf(scope.element), m);
            });
          } else {
            $rootScope.findChildren($rootScope.propertiesOf(scope.element), scope.model);
          }
        }
      }

      if (!$rootScope.isRuntime()) {
        if (!scope.model) {
          if (scope.element.items) {
            scope.model = [];
          } else {
            scope.model = {};
          }
        }

        parseElement();
      }

      if (!scope.state) {
        var p = $rootScope.propertiesOf(scope.element);
        if (p && p._ui && p._ui.title) {
          scope.state = "completed";
        } else {
          scope.state = "creating";
        }
      }

      scope.selectedTab = scope.selectedTab || 0;
      scope.selectTab = function(index) {
        scope.selectedTab = index;
      }

      scope.addElement = function() {
        if ($rootScope.isRuntime()) {
          if ((!scope.element.maxItems || scope.model.length < scope.element.maxItems)) {
            var seed = {};
            if (scope.model.length > 0) {
              seed = angular.copy(scope.model[0]);
              resetElement(seed, scope.element);
              scope.model.push(seed);
            } else {
              scope.model.push(seed);
              if (angular.isArray(scope.model)) {
                angular.forEach(scope.model, function (m) {
                  $rootScope.findChildren($rootScope.propertiesOf(scope.element), m);
                });
              } else {
                $rootScope.findChildren($rootScope.propertiesOf(scope.element), scope.model);
              }
              resetElement(seed, scope.element);
            }
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

          if ($rootScope.isElement(fieldOrElement)) {
            scope.$emit("invalidElementState",
                        ["remove", $rootScope.propertiesOf(fieldOrElement)._ui.title, fieldOrElement["@id"]]);
          } else {
            scope.$emit("invalidFieldState",
                        ["remove", $rootScope.propertiesOf(fieldOrElement)._ui.title, fieldOrElement["@id"]]);
          }
        }
      };

      // When user clicks Save button, we will switch element from creating state to completed state
      scope.add = function() {
        var p = $rootScope.propertiesOf(scope.element);
        if (!p._ui.is_cardinal_field) {
          scope.element.minItems = 1;
          scope.element.maxItems = 1;
        }

        if (typeof scope.element.maxItems == 'undefined') {
          scope.element.maxItems = 1;
        }
        if (typeof scope.element.minItems == 'undefined') {
          scope.element.minItems = 1;
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

        delete $rootScope.propertiesOf(scope.element)._tmp;
        scope.$emit("invalidElementState",
                    ["remove", $rootScope.propertiesOf(scope.element)._ui.title, scope.element["@id"]]);
        parseElement();
      };

      // When user clicks edit, the element state will be switched to creating;
      scope.edit = function() {
        var p = $rootScope.propertiesOf(scope.element);
        p._tmp = p._tmp || {};
        p._tmp.state = "creating";
      };

      scope.renameChildKey = function(child, newKey) {
        if (!child) {
          return;
        }

        var childId = $rootScope.idOf(child);

        if (!childId || /^tmp\-/.test(childId)) {
          var p = $rootScope.propertiesOf(scope.element);
          if (p[newKey] && p[newKey] == child) {
            return;
          }

          newKey = DataManipulationService.getAcceptableKey(p, newKey);
          angular.forEach(p, function(value, key) {
            if (!value) {
              return;
            }

            var idOfValue = $rootScope.idOf(value);
            if (idOfValue && idOfValue == childId) {
              DataManipulationService.renameKeyOfObject(p, key, newKey);

              if (p["@context"] && p["@context"].properties) {
                DataManipulationService.renameKeyOfObject(p["@context"].properties, key, newKey);

                if (p["@context"].properties[newKey] && p["@context"].properties[newKey].enum) {
                  p["@context"].properties[newKey].enum[0] = DataManipulationService.getEnumOf(newKey);
                }
              }

              if (p["@context"].required) {
                var idx = p["@context"].required.indexOf(key);
                p["@context"].required[idx] = newKey;
              }

              var idx = scope.element._ui.order.indexOf(key);
              scope.element._ui.order[idx] = newKey;
            }
          });
        }
      }

      scope.uuid = DataManipulationService.generateTempGUID();

      scope.$on('saveForm', function (event) {
        var p = $rootScope.propertiesOf(scope.element);
        if (p._tmp && p._tmp.state == "creating") {
          scope.$emit("invalidElementState",
                      ["add", $rootScope.propertiesOf(scope.element)._ui.title, scope.element["@id"]]);
        } else {
          scope.$emit("invalidElementState",
                      ["remove", $rootScope.propertiesOf(scope.element)._ui.title, scope.element["@id"]]);
        }
      });

      scope.$watchCollection("element.properties['@context'].properties", function() {
        parseElement();
      });

      scope.$watchCollection("element.properties", function() {
        parseElement();
      });

      scope.$watchCollection("element.items.properties", function() {
        parseElement();
      });

    }

  };

});