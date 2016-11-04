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
        depth:'=',
        path:'='
      },
      templateUrl: 'scripts/template-element/cedar-runtime-element.directive.html',
      link       : linker
    };

    return directive;

    function linker(scope, el, attrs) {

      scope.elementId = DataManipulationService.idOf(scope.element) || DataManipulationService.generateGUID();
      scope.uuid = DataManipulationService.generateTempGUID();
      scope.expanded = [];



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


      scope.isNested = function () {
        return DataManipulationService.isNested(scope.element);
      };

      scope.getNestingDepth = function () {
        return scope.depth;
      };

      scope.getNestingMargin = function () {
        return 'margin-left: ' + 15 + 'px';
      }

      scope.getNesting = function()  {

        var path = scope.path || '';
        var arr = path.split('-');
        var result = [];
        for (var i=0;i<arr.length;i++) {
          result.push(i);
        }
        console.log(result);
        return result;
      };

      scope.getNestingCount = function()  {

        var path = scope.path || '';
        var arr = path.split('-');
        return arr.length;
      };

      scope.getNestingStyle = function(index)  {

        return 'left:' + (-15 * (index)) + 'px';
      };


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
        }
      };

      scope.getId = function (index) {
        return DataManipulationService.getId(scope.element);
      };

      // get the dom id
      scope.getLocator = function (index) {
        return DataManipulationService.getLocator(scope.element, index, scope.path);
      };

      scope.removeElement = function (index) {
        if (scope.model.length > scope.element.minItems) {
          scope.model.splice(index, 1);
        }
      };

      scope.switchToSpreadsheet = function () {
        SpreadsheetService.switchToSpreadsheetElement(scope, element);
      };

      scope.toggleExpanded = function (index) {
        scope.expanded[index] = !scope.expanded[index];
      };

      scope.isExpanded = function (index) {
        return scope.expanded[index];
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

      // allows us to look a the model as an array whether it is or not
      scope.valueArray;
      scope.setValueArray = function () {

        scope.valueArray = [];
        if (scope.model instanceof Array) {

          scope.valueArray = scope.model;

        } else {

          if (!scope.model) {
            scope.model = {};
          }

          scope.valueArray = [];
          scope.valueArray.push(scope.model);

        }
      };
      scope.setValueArray();


      scope.nextChild = function (field) {

        var id = $rootScope.schemaOf(field)["@id"];
        var props = $rootScope.schemaOf(scope.$parent.element).properties;
        var order = $rootScope.schemaOf(scope.$parent.element)._ui.order;
        var selectedKey;

        console.log('nextChild of ' + id);
        console.log(props);
        console.log(order);

        // find the field or element in the form's properties
        angular.forEach(props, function (value, key) {
          if ($rootScope.schemaOf(value)["@id"] == id) {
            selectedKey = key;
          }
        });

        if (selectedKey) {

          console.log('selectedKey ' + selectedKey);

          var idx = order.indexOf(selectedKey);

          idx += 1;
          if (idx < order.length) {
            var nextKey = order[idx];
            console.log('nextChild is next sibling ' + nextKey);
            return props[nextKey];
          } else {
            console.log('nextChild is up one level to ' + DataManipulationService.getId(scope.$parent.element));
            return scope.$parent.element;
          }
        }
        console.log('nextChild no next child available');
        return null;
      };


      // watch for this field's active state
      scope.$on('setActive', function (event, args) {
        var id = args[0];
        var index = args[1];
        var path = args[2];
        var value = args[3];

        if (id === scope.getId() && path === scope.path) {
          console.log('on setActive '+scope.getTitle() + ' ' + index + ' ' + (id === scope.getId()) +(path === scope.path) +   path +  ' ' + scope.path);
          var props = $rootScope.schemaOf(scope.element).properties;
          var order = $rootScope.schemaOf(scope.element)._ui.order;
          var nextKey = order[0];
          var next= props[nextKey];
          $rootScope.$broadcast("setActive", [DataManipulationService.getId(next), 0,  scope.path, true]);

        }
      });


      scope.setActive = function (index, value) {
        console.log('setActive ' + index + value);
        DataManipulationService.setActive(scope.element, index, scope.path, value);
      };


    }

  };

});
