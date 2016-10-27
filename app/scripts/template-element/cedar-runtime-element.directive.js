'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.templateElement.cedarRuntimeElement', [])
      .directive('cedarRuntimeElement', cedarRuntimeElement);

  cedarRuntimeElement.$inject = ['$rootScope', 'DataManipulationService', 'DataUtilService',
                                 'SpreadsheetService'];

  function cedarRuntimeElement($rootScope, DataManipulationService, DataUtilService, SpreadsheetService) {

    var directive = {
      restrict   : 'EA',
      scope      : {
        key          : '=',
        element      : '=',
        delete       : '&',
        model        : '=',
        isRootElement: "=",
        depth:'='
      },
      templateUrl: 'scripts/template-element/cedar-runtime-element.directive.html',
      link       : linker
    };

    return directive;

    function linker(scope, el, attrs) {

      scope.elementId = DataManipulationService.idOf(scope.element) || DataManipulationService.generateGUID();
      scope.uuid = DataManipulationService.generateTempGUID();
      scope.showCardinality = false;
      scope.selectedTab = 0;
      scope.expanded = false;



      var resetElement = function (el, settings) {
        angular.forEach(el, function (model, key) {
          if (settings[key] && settings[key].minItems && angular.isArray(model)) {
            model.splice(settings[key].minItems, model.length);
          }
          if (!DataUtilService.isSpecialKey(key)) {
            if (key == '@value') {
              if (angular.isArray(model)) {
                if ($rootScope.schemaOf(settings)._ui.inputType == "list") {
                  model.splice(0, model.length);
                } else {
                  for (var i = 0; i < model.length; i++) {
                    if (typeof(model[i]['@value']) == "string") {
                      model[i]['@value'] = "";
                    } else if (angular.isArray(model[i]['@value'])) {
                      model[i]['@value'] = [];
                    } else if (angular.isObject(model[i]['@value'])) {
                      model[i]['@value'] = {};
                    }
                  }
                }
              } else if (typeof(model) == "string") {
                el[key] = "";
              } else if (angular.isArray(model)) {
                el[key] = [];
              } else if (angular.isObject(model)) {
                el[key] = {};
              }
            } else {
              if (settings[key]) {
                resetElement(model, settings[key]);
              } else {
                // This case el is an array
                angular.forEach(model, function (v, k) {
                  if (k == '@value') {
                    if (angular.isArray(v)) {
                      if ($rootScope.schemaOf(settings)._ui.inputType == "list") {
                        v.splice(0, v.length);
                      } else {
                        for (var i = 0; i < v.length; i++) {

                          if (typeof(v[i]['@value']) == "string") {
                            v[i]['@value'] = "";
                          } else if (angular.isArray(v[i]['@value'])) {
                            v[i]['@value'] = [];
                          } else if (angular.isObject(v[i]['@value'])) {
                            v[i]['@value'] = {};
                          }

                        }
                      }
                    } else if (typeof(v) == "string") {
                      model[k] = "";
                    } else if (angular.isArray(v)) {
                      model[k] = [];
                    } else if (angular.isObject(v)) {
                      model[k] = {};
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

      scope.selectTab = function (index) {
        scope.selectedTab = index;
      }

      scope.isNested = function () {
        return DataManipulationService.isNested(scope.element);
      };

      scope.getNestingDepth = function () {
        return scope.depth;
      };

      scope.getNestingMargin = function () {
        return 'margin-left: ' + scope.depth * 20 + 'px';
      }


      scope.getParentTitle = function () {
        return 'parent';
      };

      scope.getTitle = function () {
        return DataManipulationService.getFieldSchema(scope.element)._ui.title;
      };

      scope.addElement = function () {

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
          scope.selectedTab = scope.model.length - 1;
        }
      };

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

      scope.toggleExpanded = function () {
        scope.expanded = !scope.expanded
      };

      scope.isExpanded = function () {
        return scope.expanded;
      };

      scope.removeChild = function (fieldOrElement) {
        // fieldOrElement must contain the schema level
        fieldOrElement = $rootScope.schemaOf(fieldOrElement);

        var selectedKey;
        var props = $rootScope.propertiesOf(scope.element);
        angular.forEach(props, function (value, key) {
          if (value["@id"] == fieldOrElement["@id"]) {
            selectedKey = key;
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
        }
      };

      scope.isCardinal = function () {
        return DataManipulationService.isCardinalElement(scope.element);
      };

      scope.canDeselect = function (fieldOrElement) {
        return DataManipulationService.canDeselect(fieldOrElement);
      };

      scope.canSelect = function (select) {
        if (select)
          DataManipulationService.canSelect(scope.element);
      };

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

      scope.isMultiple = function () {
        return $rootScope.isArray(scope.model);
      };

      scope.getDomId = function (e) {
        var s = $rootScope.schemaOf(e);
        console.log(s);
        return DataManipulationService.getDomId(s);
      }

      scope.nextChild = function (fieldOrElement) {

        console.log('nextChild');
        if (fieldOrElement) {}

        var id = $rootScope.schemaOf(fieldOrElement)["@id"];
        var title = $rootScope.schemaOf(fieldOrElement)._ui.title;
        var selectedKey;
        var props = scope.element.properties;

        // find the field or element in the form's properties
        angular.forEach(props, function (value, key) {
          if ($rootScope.schemaOf(value)["@id"] == id) {
            selectedKey = key;
          }
        });

        if (selectedKey) {

          // and the order array
          var order = $rootScope.schemaOf(scope.element)._ui.order;
          var idx = order.indexOf(selectedKey);

          idx += 1;
          if (idx < order.length) {
            var nextKey = order[idx];
            return props[nextKey];
          } else {
            console.log('go up one level');
          }
        }
        return null;
      };

      scope.$on('setActive', function (event, args) {
        var id = args[0];
        var value = args[1];

        if (id === $rootScope.schemaOf(scope.element)['@id']) {
          scope.setActive(true);
        }
      });

      scope.activeFieldOrElement;

      // set this element active by choosing the next field or element in this element
      scope.setActive = function () {

        var next;

        console.log('setActive ' + scope.activeFieldOrElement);
        if (scope.activeFieldOrElement) {
          next = scope.nextChild(scope.activeFieldOrElement);
        } else {
          // get the first child and set it active
          var props = scope.element.properties;
          var order = $rootScope.schemaOf(scope.element)._ui.order;
          next = props[order[0]];

        }

        if (next) {
          var id = $rootScope.schemaOf(next)['@id'];
          console.log('broadcast setActive ' + id);
          $rootScope.$broadcast("setActive", [id]);
        }
      };


    }

  };

});
