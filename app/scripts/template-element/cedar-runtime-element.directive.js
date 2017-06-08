'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.templateElement.cedarRuntimeElement', [])
      .directive('cedarRuntimeElement', cedarRuntimeElement);

  cedarRuntimeElement.$inject = ['$rootScope', '$timeout', '$window', 'DataManipulationService', 'DataUtilService',
                                 'SpreadsheetService'];

  function cedarRuntimeElement($rootScope, $timeout, $window, DataManipulationService, DataUtilService,
                               SpreadsheetService) {

    var directive = {
      restrict   : 'EA',
      scope      : {
        parentKey    : '=',
        fieldKey     : '=',
        element      : '=',
        delete       : '&',
        model        : '=',
        labels       : "=",
        relabel      : '=',
        isRootElement: "=",
        path         : '=',
        uid          : '='
      },
      templateUrl: 'scripts/template-element/cedar-runtime-element.directive.html',
      link       : linker
    };

    return directive;

    function linker(scope, el, attrs) {

      scope.elementId = DataManipulationService.idOf(scope.element) || DataManipulationService.generateGUID();
      scope.uuid = DataManipulationService.generateTempGUID();
      scope.expanded = [];
      scope.multipleStates = ['expanded', 'paged', 'spreadsheet'];
      scope.multipleState = 'paged';
      scope.index = 0;
      scope.pageMin = 0;
      scope.pageMax = 0;
      scope.pageRange = 6;


      scope.getTitle = function () {
        return DataManipulationService.getTitle(scope.element);
      };

      scope.getId = function (index) {
        return DataManipulationService.getId(scope.element);
      };

      scope.canDeselect = function (node) {
        return DataManipulationService.canDeselect(node);
      };

      scope.canSelect = function (select) {
        if (select)
          DataManipulationService.canSelect(scope.element);
      };

      scope.getLocator = function (index) {
        return DataManipulationService.getLocator(scope.element, index, scope.path, scope.uid);
      };

      scope.isField = function () {
        return false;
      };

      scope.isElement = function () {
        return true;
      };

      scope.isCardinal = function () {
        return DataManipulationService.isCardinalElement(scope.element);
      };

      scope.isMultiple = function () {
        return DataManipulationService.isMultiple(scope.model);
      };

      // is this field actively being edited?
      scope.isActive = function (index) {
        return DataManipulationService.isActive(scope.getLocator(index));
      };

      scope.isInactive = function (index) {
        return DataManipulationService.isInactive(scope.getLocator(index));
      };

      scope.isNested = function () {
        return DataManipulationService.isNested(scope.element);
      };

      scope.cardinalityString = function () {
        return DataManipulationService.cardinalityString(scope.element);
      };

      scope.getPropertyLabel = function () {
        if (scope.labels && scope.fieldKey) {
          return scope.labels[scope.fieldKey];
        } else {
          console.log("error: no propertyLabels");
          return scope.getTitle();
        }
      };

      // make a copy of element at index, insert it after index
      scope.copyElement = function (index) {
        var fromIndex = (typeof index === 'undefined') ? scope.index : index;
        if ((!scope.element.maxItems || scope.model.length < scope.element.maxItems)) {
          if (scope.model.length > 0) {
            var seed = {};
            seed = angular.copy(scope.model[fromIndex]);
            // delete the @id field of the template-element-instance. The backend will need to generate a new one
            delete seed['@id'];
            scope.model.splice(fromIndex + 1, 0, seed);
          }
          // activate the new instance
          scope.setActive(fromIndex + 1, true);
        }
      };

      // add a new empty element at the end of the array
      scope.addElement = function () {
        if ((!scope.element.maxItems || scope.model.length < scope.element.maxItems)) {
          var seed = {};
          scope.model.push(seed);
          if (angular.isArray(scope.model)) {
            angular.forEach(scope.model, function (m) {
              $rootScope.findChildren($rootScope.propertiesOf(scope.element), m);
            });
          } else {
            $rootScope.findChildren($rootScope.propertiesOf(scope.element), scope.model);
          }
          // activate the new instance
          var index = scope.model.length - 1;
          scope.setActive(index, true);
        }
      };

      // remove the element at index
      scope.removeElement = function (index) {
        if (scope.model.length > scope.element.minItems) {
          scope.model.splice(index, 1);
          if (scope.model.length === 0) {
            scope.toggleExpanded(0);
          }
        }
      };

      scope.switchToSpreadsheet = function () {
        SpreadsheetService.switchToSpreadsheetElement(scope, scope.element, function () {
          scope.addMoreInput();
        });
      };

      scope.toggleExpanded = function (index) {
        console.log('toggleExpanded');
        scope.expanded[index] = !scope.expanded[index];
        if (scope.expanded[index]) {
          scope.setActive(index, true);
        }
      };

      scope.isExpanded = function (index) {
        return scope.expanded[index];
      };

      scope.setExpanded = function (index, value) {
        return scope.expanded[index] = value;
      };

      scope.unExpand = function (index) {
        scope.expanded[index] = false;
        scope.setActive(index, false);
      };

      // can we recursively expand this element, i.e. does it have nested elements?
      scope.isExpandable = function () {

        var schema = $rootScope.schemaOf(scope.element);
        var result = false;
        var props = $rootScope.propertiesOf(scope.element);
        angular.forEach(props, function (value, key) {

          var valueSchema = $rootScope.schemaOf(value);
          var valueId = valueSchema["@id"];

          if ($rootScope.isElement(valueSchema)) {
            result = true;
          }
        });
        return result;
      };

      scope.expandAll = function () {

        // expand all the items in the valueArray
        if (scope.valueArray.length == 0) {
          scope.addMoreInput();
        } else {
          for (var i = 0; i < scope.valueArray.length; i++) {
            scope.expanded[i] = true;
            scope.setActive(0, true);
          }
        }

        // let these draw, then send out expandAll to the newly drawn elements
        $timeout(function () {
          var schema = $rootScope.schemaOf(scope.element);
          var selectedKey;
          var props = $rootScope.propertiesOf(scope.element);
          angular.forEach(props, function (value, key) {

            var valueSchema = $rootScope.schemaOf(value);
            var valueId = valueSchema["@id"];

            if ($rootScope.isElement(valueSchema)) {
              scope.$broadcast("expandAll", [valueId]);
            }
          });

        }, 0);
      };

      scope.$on('expandAll', function (event, args) {
        var id = args[0];

        // only look at first level elements
        if (id === scope.getId()) {

          scope.expandAll();
        }
      });

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

          // remove it from the order array
          var idx = $rootScope.schemaOf(scope.element)._ui.order.indexOf(selectedKey);
          $rootScope.schemaOf(scope.element)._ui.order.splice(idx, 1);

          // remove it from the property Labels?
          console.log('delete property labels?');
          console.log($rootScope.schemaOf(scope.element)._ui.propertyLabels[selectedKey]);
          //delete $rootScope.schemaOf(scope.element)._ui.propertyLabels[selectedKey];

          if ($rootScope.isElement(fieldOrElement)) {
            scope.$emit("invalidElementState",
                ["remove", $rootScope.schemaOf(fieldOrElement)._ui.title, fieldOrElement["@id"]]);
          } else {
            scope.$emit("invalidFieldState",
                ["remove", $rootScope.schemaOf(fieldOrElement)._ui.title, fieldOrElement["@id"]]);
          }
        }
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
      };

      // allows us to look a the model as an array
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

      // watch for this field's active state
      scope.$on('setActive', function (event, args) {
        var id = args[0];
        var index = args[1];
        var path = args[2];
        var fieldKey = args[3];
        var parentKey = args[4];
        var value = args[5];
        var uid = args[6];

        if (id === scope.getId() && path == scope.path && fieldKey == scope.fieldKey && parentKey == scope.parentKey && uid == scope.uid) {
          scope.setActive(index, value);
          //scope.expanded[index] = true;

          $timeout(function () {

            scope.$apply();

            var props = $rootScope.schemaOf(scope.element).properties;
            var order = $rootScope.schemaOf(scope.element)._ui.order;
            var nextKey = order[0];
            var next = props[nextKey];
            $rootScope.$broadcast("setActive",
                [DataManipulationService.getId(next), 0, scope.path + '-' + index, nextKey, scope.fieldKey, true,
                 scope.uid + '-' + nextKey]);

          }, 0);
        }
      });

      scope.onSetActive = function (i) {
        var id = scope.getId();
        var index = i;
        var path = scope.path;
        var fieldKey = scope.fieldKey;
        var parentKey = scope.parentKey;
        var value = true;

        scope.setActive(index, value);

        $timeout(function () {

          scope.$apply();

          var props = $rootScope.schemaOf(scope.element).properties;
          var order = $rootScope.schemaOf(scope.element)._ui.order;
          var nextKey = order[0];
          var next = props[nextKey];
          $rootScope.$broadcast("setActive",
              [DataManipulationService.getId(next), 0, scope.path + '-' + index, nextKey, scope.fieldKey, true,
               scope.uid + '-' + nextKey]);

        }, 0);
      };

      scope.pageMinMax = function () {
        scope.pageMax = Math.min(scope.valueArray.length, scope.index + scope.pageRange);
        scope.pageMin = Math.max(0, scope.pageMax - scope.pageRange);
      };
      scope.pageMinMax();

      scope.addMoreInput = function () {
        scope.addElement();
        scope.pageMinMax();
      };

      scope.setActive = function (index, value) {
        DataManipulationService.setActive(scope.element, index, scope.path, scope.uid, value);
        if (value) {
          scope.index = index;
          scope.pageMinMax();
        }
        scope.expanded[index] = value;
      };

      // set the index active
      scope.selectPage = function (i) {
        scope.setActive(i, true);
      };

      // set the active index
      scope.setIndex = function (value) {
        scope.index = value;
      };

      scope.showMultiple = function (state) {
        return (scope.multipleState === state);
      };

      scope.toggleMultiple = function () {
        var i = scope.multipleStates.indexOf(scope.multipleState);
        var oldState = scope.multipleState;
        i = (i + 1) % scope.multipleStates.length;
        scope.multipleState = scope.multipleStates[i];

        if (scope.multipleState === 'spreadsheet' || oldState === 'spreadsheet') {

          $timeout(function () {
            // create or destroy the spreadsheet
            scope.switchToSpreadsheet();
            scope.$apply();
          }, 0);

        }

        //$timeout(function () {
        //  scope.$apply();
        //}, 100);
        return scope.multipleState;
      };

      // find the next sibling to activate
      scope.activateNextSiblingOf = function (fieldKey, parentKey, i) {
        var found = false;

        // is there another sibling
        if (!found) {
          var order = $rootScope.schemaOf(scope.element)._ui.order;
          var props = $rootScope.schemaOf(scope.element).properties;
          var idx = order.indexOf(fieldKey);

          idx += 1;
          while (idx < order.length && !found) {
            var nextKey = order[idx];
            var next = props[nextKey];
            found = !DataManipulationService.isStaticField(next);
            idx += 1;
          }
          if (found) {
            var next = props[nextKey];
            $rootScope.$broadcast("setActive",
                [DataManipulationService.getId(next), 0, scope.path + '-' + scope.index, nextKey, parentKey, true,
                 scope.uid + '-' + nextKey]);
          }
        }

        // is the element multiple
        if (!found) {
          if (scope.isMultiple()) {
            if (typeof(i) == 'undefined') {
              if (scope.index + 1 < scope.model.length) {
                scope.onSetActive(scope.index + 1, true);
                found = true;
              }
            } else {
              if (i < scope.model.length) {
                scope.onSetActive(i, true);
                found = true;
              }
            }
          }
        }

        // does the element have a sibling
        if (!found) {
          scope.$parent.activateNextSiblingOf(scope.fieldKey, scope.parentKey);
        }
      }
    }
  };
});
