'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.templateElement.cedarTemplateElementDirective', [])
      .directive('cedarTemplateElement', cedarTemplateElementDirective);

  cedarTemplateElementDirective.$inject = ['$rootScope', 'DataManipulationService', 'DataUtilService',
                                           'SpreadsheetService', '$timeout'];

  function cedarTemplateElementDirective($rootScope, DataManipulationService, DataUtilService, SpreadsheetService, $timeout) {

    var directive = {
      restrict   : 'EA',
      scope      : {
        key          : '=',
        element      : '=',
        delete       : '&',
        model        : '=',
        isRootElement: "="
      },
      templateUrl: 'scripts/template-element/cedar-template-element.directive.html',
      link       : linker
    };

    return directive;

    function linker(scope, element, attrs) {
      scope.elementId = DataManipulationService.idOf(scope.element) || DataManipulationService.generateGUID();

      var resetElement = function (el, settings) {
        angular.forEach(el, function (model, key) {
          if (settings[key] && settings[key].minItems && angular.isArray(model)) {
            model.splice(settings[key].minItems, model.length);
          }

          if (!DataUtilService.isSpecialKey(key)) {
            if (key == "_value") {
              if (angular.isArray(model)) {
                if ($rootScope.schemaOf(settings)._ui.inputType == "list") {
                  if ($rootScope.schemaOf(settings)._ui.defaultOption) {
                    el[key] = angular.copy($rootScope.schemaOf(settings)._ui.defaultOption);
                  } else {
                    model.splice(0, model.length);
                  }
                } else {
                  for (var i = 0; i < model.length; i++) {
                    if ($rootScope.schemaOf(settings)._ui.defaultOption) {
                      model[i]["_value"] = angular.copy($rootScope.schemaOf(settings)._ui.defaultOption);
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
                if ($rootScope.schemaOf(settings)._ui.defaultOption) {
                  el[key] = angular.copy($rootScope.schemaOf(settings)._ui.defaultOption);
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
                angular.forEach(model, function (v, k) {
                  if (k == "_value") {
                    if (angular.isArray(v)) {
                      if ($rootScope.schemaOf(settings)._ui.inputType == "list") {
                        if ($rootScope.schemaOf(settings)._ui.defaultOption) {
                          model[k] = angular.copy($rootScope.schemaOf(settings)._ui.defaultOption);
                        } else {
                          v.splice(0, v.length);
                        }
                      } else {
                        for (var i = 0; i < v.length; i++) {
                          if ($rootScope.schemaOf(settings)._ui.defaultOption) {
                            v[i]["_value"] = angular.copy($rootScope.schemaOf(settings)._ui.defaultOption);
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
                      if ($rootScope.schemaOf(settings)._ui.defaultOption) {
                        model[k] = angular.copy($rootScope.schemaOf(settings)._ui.defaultOption);
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

      var parseElement = function () {
        if (!$rootScope.isRuntime() && scope.element) {
          if (angular.isArray(scope.model)) {
            angular.forEach(scope.model, function (m) {
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
        if (scope.element && $rootScope.schemaOf(scope.element)._ui && $rootScope.schemaOf(scope.element)._ui.title) {
          scope.state = "completed";
        } else {
          scope.state = "creating";
        }
      }

      scope.selectedTab = scope.selectedTab || 0;
      scope.selectTab = function (index) {
        scope.selectedTab = index;
      }

      scope.isEditState = function () {
        return (DataManipulationService.isEditState(scope.element));
      };

      scope.isNested = function () {
        return (DataManipulationService.isNested(scope.element));
      };

      // add a multiple cardinality element



      // add a multiple cardinality element
      scope.selectedTab = 0;
      scope.addElement = function () {
        console.log('addElement');
        if ($rootScope.isRuntime()) {
          if ((!scope.element.maxItems || scope.model.length < scope.element.maxItems)) {
            var seed = {};
            console.log(scope.model);
            if (scope.model.length > 0) {
              seed = angular.copy(scope.model[0]);
              console.log(seed);
              resetElement(seed, scope.element);
             console.log (angular.isArray(scope.model));
              scope.model.push(seed);
            } else {
              console.log ('else ' +angular.isArray(scope.model));
              console.log (scope.model);
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
            scope.selectedTab = scope.model.length - 1;
          }
        }
      };

      // remove a multiple cardinality element
      scope.removeElement = function (index) {
        if (scope.model.length > scope.element.minItems) {
          scope.model.splice(index, 1);
          if (index + 1 > scope.model.length) {
            scope.selectedTab = scope.model.length - 1;
          }
        }
      };

      scope.switchToSpreadsheet = function () {
        SpreadsheetService.switchToSpreadsheetElement(scope, element);
      };

      scope.switchExpandedState = function (domId) {
        console.log('switchExpandedState');
        $rootScope.toggleElement(domId);
      };


      scope.removeChild = function (fieldOrElement) {
        // fieldOrElement must contain the schema level
        fieldOrElement = $rootScope.schemaOf(fieldOrElement);
        var selectedKey;
        var props = $rootScope.propertiesOf(scope.element);
        angular.forEach(props, function (value, key) {
          if (DataManipulationService.isCardinalElement(value)) {
            if (value.items["@id"] == fieldOrElement["@id"]) {
              selectedKey = key;
            }
          } else {
            if (value["@id"] == fieldOrElement["@id"]) {
              selectedKey = key;
            }
          }
        });

        if (selectedKey) {
          delete props[selectedKey];

          var idx = $rootScope.schemaOf(scope.element)._ui.order.indexOf(selectedKey);
          $rootScope.schemaOf(scope.element)._ui.order.splice(idx, 1);

          if ($rootScope.isElement(fieldOrElement)) {
            scope.$emit("invalidElementState",
                ["remove", $rootScope.schemaOf(fieldOrElement)._ui.title, fieldOrElement["@id"]]);
          } else {
            scope.$emit("invalidFieldState",
                ["remove", $rootScope.schemaOf(fieldOrElement)._ui.title, fieldOrElement["@id"]]);
          }
        } else {
          console.log("Error: can't find field or element to delete");
          console.log(fieldOrElement);
        }
      };

      // is the cardinality details table open?
      scope.showCardinality = false;

      scope.isCardinal = function () {
        return DataManipulationService.isCardinalElement(scope.element);
      };

      // try to deselect this element
      scope.canDeselect = function (element) {
        console.log('try to deselect this element ');
        return DataManipulationService.canDeselect(element);
      };

      // try to select this element
      scope.canSelect = function (select, event) {
        console.log('try to select this element ' + select);
        var result = select;
        if (select) {
          if (DataManipulationService.canSelect(scope.element)) {
            console.log('stopPropagation');
            event.stopPropagation();
          }
          //$scope.toggleControlledTerm('none');
          result = true;
        }
        return result;
      };

      // when element is deseleted, look at errors and parse if none
      scope.$on('deselect', function (event, element, errorMessages) {
        if (element == scope.element) {
          scope.errorMessages = errorMessages;
          if (errorMessages.length == 0) parseElement();
        }
      });

      // watch for this elements's select
      scope.$on('select', function (event, args) {
        var element = args[0];
        var errors = args[1];

        if (element == scope.element) {

          $timeout(function () {

            var title = angular.element('#' + $rootScope.getDomId(scope.element) + "-edit-title");
            if (title) {
              title.select();
            }
          });
        }
      });



      scope.renameChildKey = function (child, newKey) {
        if (!child) {
          return;
        }

        var childId = DataManipulationService.idOf(child);

        if (!childId || /^tmp\-/.test(childId)) {
          var p = $rootScope.propertiesOf(scope.element);
          if (p[newKey] && p[newKey] == child) {
            return;
          }

          newKey = DataManipulationService.getAcceptableKey(p, newKey);
          angular.forEach(p, function (value, key) {
            if (!value) {
              return;
            }

            var idOfValue = DataManipulationService.idOf(value);
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

              var idx = $rootScope.schemaOf(scope.element)._ui.order.indexOf(key);
              $rootScope.schemaOf(scope.element)._ui.order[idx] = newKey;
            }
          });
        }
      }

      scope.uuid = DataManipulationService.generateTempGUID();

      // try to deselect this field
      scope.canDeselect = function (field) {
        return DataManipulationService.canDeselect(field, scope.renameChildKey);
      };

      scope.$on('saveForm', function (event) {
      if (scope.isEditState() && !scope.canDeselect(scope.element)) {

          scope.$emit("invalidElementState",
              ["add", $rootScope.schemaOf(scope.element)._ui.title, scope.element["@id"]]);
        } else {
          scope.$emit("invalidElementState",
              ["remove", $rootScope.schemaOf(scope.element)._ui.title, scope.element["@id"]]);
        }
      });

      scope.$watchCollection("element.properties['@context'].properties", function () {
        parseElement();
      });

      scope.$watchCollection("element.properties", function () {
        parseElement();
      });

      scope.$watchCollection("element.items.properties", function () {
        parseElement();
      });

      scope.duplicate = function () {
        console.log('duplicate element');
      };
    }

  };

});
