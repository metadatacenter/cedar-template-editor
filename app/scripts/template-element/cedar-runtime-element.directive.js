'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.templateElement.cedarRuntimeElement', [])
      .directive('cedarRuntimeElement', cedarRuntimeElement);

  cedarRuntimeElement.$inject = ['$rootScope', '$timeout', '$window', 'UIUtilService', 'DataManipulationService',
                                 'DataUtilService', 'schemaService',
                                 'SpreadsheetService'];

  function cedarRuntimeElement($rootScope, $timeout, $window, UIUtilService, DataManipulationService, DataUtilService,
                               schemaService, SpreadsheetService) {

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

      scope.schemaService = schemaService;

      // scope.elementId = DataManipulationService.idOf(scope.element) || DataManipulationService.generateGUID();
      // scope.uuid = DataManipulationService.generateTempGUID();

      // state of the view
      scope.expanded = [];
      scope.viewState;
      scope.index = 0;


      // pager's min, max, and range
      scope.pageMin = 0;
      scope.pageMax = 0;
      scope.pageRange = 6;

      // allows us to look a the model as an array
      scope.valueArray;

      // hide the details of the element schema by calling DataManipulationService
      var dms = DataManipulationService;

      //
      //  basic schema getters and setters
      //

      // get the element title
      scope.getTitle = function () {
        return schemaService.getTitle(scope.element);
      };

      // get the element id
      scope.getId = function () {
        return schemaService.getId(scope.element);
      };

      // does the element contain this property
      scope.hasProperty = function (key) {
        return dms.hasProperty(scope.element, key);
      };

      // get the child node for this property
      scope.getChildNode = function (key) {
        return dms.getChildNode(scope.element, key);
      };

      // is the child an element?
      scope.isChildElement = function (key) {
        return DataUtilService.isElement(dms.getChildNode(scope.element, key))
      };

      // get the order array
      scope.getOrder = function () {
        return schemaService.getOrder(scope.element);
      };

      // get the property labels from the element
      scope.getPropertyLabels = function () {
        return dms.getPropertyLabels(scope.element);
      };

      // get the dom locator
      scope.getLocator = function (idx) {
        return UIUtilService.getLocator(scope.element, idx || 0, scope.path, scope.uid);
      };

      // is this a field?
      scope.isField = function () {
        return false;
      };

      // is this an element?
      scope.isElement = function () {
        return true;
      };


      scope.isHidden = function (node) {
        return schemaService.isHidden(node);
      };

      scope.isCardinal = function () {
        return schemaService.isCardinalElement(scope.element);
      };


      // is the model multiple?
      scope.isMultiple = function () {
        return angular.isArray(scope.model);
      };

      // get the cardinality string, i.e.  1..N
      scope.cardinalityString = function () {
        return UIUtilService.cardinalityString(scope.element);
      };

      // switch into full screen mode for a spreadsheet
      scope.fullscreen = function () {
        UIUtilService.fullscreen(scope.getLocator());
      };


      // turn on spreadsheet view
      scope.switchToSpreadsheet = function () {
        scope.setActive(0, true);
        if (schemaService.getMaxItems(scope.element)) {
          // create all the rows if the maxItems is a fixed number
          scope.createExtraRows();
        }
        $timeout(function () {
          SpreadsheetService.switchToSpreadsheet(scope, scope.element, 0, function () {
            return false;
          }, function () {
            scope.addMoreInput();
          }, function () {
            scope.removeElement(scope.model.length - 1);
          }, function () {
            scope.createExtraRows();
          }, function () {
            scope.deleteExtraRows();
          })
        });
      };

      scope.cleanupSpreadsheet = function () {
        scope.deleteExtraRows();
        //scope.expanded[0] = false;
        SpreadsheetService.destroySpreadsheet(scope);
        // scope.setValueArray();
      };


      scope.isTabView = function () {
        return UIUtilService.isTabView(scope.viewState);
      };

      scope.isListView = function () {
        return UIUtilService.isListView(scope.viewState);
      };

      scope.isSpreadsheetView = function () {
        return UIUtilService.isSpreadsheetView(scope.viewState);
      };

      // toggle through the list of view states
      scope.toggleView = function () {
        scope.viewState = UIUtilService.toggleView(scope.viewState);
      };

      scope.zeroedLocator = function (value) {
        var result = '';
        if (value) {
          var result = value.replace(/-([^-]*)$/, '-0');
        }
        return result;
      };

      // watch for changes in the selection for spreadsheet view to get out of spreadsheet mode
      scope.$watch(
          function () {
            return (UIUtilService.activeLocator);
          },
          function (newValue, oldValue) {

            if (scope.zeroedLocator(newValue) != scope.zeroedLocator(oldValue) && scope.getLocator(
                0) == scope.zeroedLocator(oldValue) && scope.isSpreadsheetView()) {
              scope.toggleView();
            }
          }
      );


      // make sure there are at least 10 entries in the spreadsheet
      scope.createExtraRows = function () {
        var maxItems = schemaService.getMaxItems(scope.element);
        var max = maxItems ? maxItems : 10;
        while ((scope.model.length < max)) {
          scope.addMoreInput();
        }
      };

      scope.addMoreInput = function () {
        scope.addElement();
        scope.pageMinMax();
      };

      scope.deleteExtraRows = function () {

        if (angular.isArray(scope.model)) {

          var min = schemaService.getMinItems(scope.element) || 1;

          outer: for (var i = scope.model.length; i > min; i--) {
            var valueElement = scope.model[i - 1];
            // are all the fields empty for this cardinal element instance i?
            var empty = true;
            loop: for (var prop in valueElement) {
              if (!DataUtilService.isSpecialKey(prop) && !prop.startsWith('$$')) {

                var node = valueElement[prop];
                if (Object.getOwnPropertyNames(node).length > 0) {
                  if (node.hasOwnProperty(
                      '@value') && (node['@value'] != null && node['@value'] != '') || (node.hasOwnProperty(
                      '@id') && (node['@id'] != null && node['@id'] != ''))) {
                    empty = false;
                    break loop;
                  }
                }

              }
            }
            if (empty) {
              scope.removeElement(i - 1);
            } else {
              break outer;
            }
          }
        }
      };


      //
      // control element visibility
      //

      // toggle visibility at this index and activate if visible
      scope.toggleExpanded = function (idx) {
        //console.log('toggleExpanded', idx);

        if (scope.model.length == 0) {
          scope.addElement()
          scope.expanded[0] = true;
          scope.setActive(0, scope.expanded[0]);
        }
        else {
          scope.expanded[idx] = !scope.expanded[idx];
          scope.setActive(idx, scope.expanded[idx]);
        }
      };

      // is this index viewable?
      scope.isExpanded = function (idx) {
        return scope.expanded[idx];
      };

      // set the view at this index
      scope.setExpanded = function (idx, value) {
        return scope.expanded[idx] = value;
      };

      // close the view at this index
      scope.unExpand = function (idx) {
        scope.expanded[idx] = false;
        scope.setActive(idx, false);
      };

      // can we recursively expand this element, i.e. does it have nested elements?
      scope.isExpandable = function () {
        var result = false;
        var props = schemaService.propertiesOf(scope.element);
        angular.forEach(props, function (value, key) {
          if (DataUtilService.isElement(schemaService.schemaOf(value))) {
            result = true;
          }
        });
        return result;
      };

      // expand all the nodes and their children
      scope.expandAll = function () {

        // expand all the items in the valueArray (if the array is not empty)
        if (scope.valueArray.length > 0) {
          for (var i = 0; i < scope.valueArray.length; i++) {
            scope.expanded[i] = true;
            scope.setActive(0, true);
          }

          // let these draw, then send out expandAll to the newly drawn elements
          $timeout(function () {
            var props = schemaService.propertiesOf(scope.element);
            angular.forEach(props, function (value, key) {
              if (DataUtilService.isElement(schemaService.schemaOf(value))) {
                scope.$broadcast("expandAll", [schemaService.getId(value)]);
              }
            });
          });
        }
      };

      // listen for requests to expand this element
      scope.$on('expandAll', function (event, args) {
        var id = args[0];

        // only look at first level elements
        if (id === scope.getId()) {

          scope.expandAll();
        }
      });

      //
      //  toolbar functions
      //

      // get the property label for the fieldKey, labels and fieldKey are passed into this scope
      scope.getPropertyLabel = function () {
        if (scope.labels && scope.fieldKey && scope.labels[scope.fieldKey]) {
          return scope.labels[scope.fieldKey];
        } else {
          return scope.getTitle();
        }
      };

      scope.getPreferredLabel = function () {
        return schemaService.getPreferredLabel(scope.element);
      };

      scope.getLabel = function () {
        return scope.getPreferredLabel() || scope.getPropertyLabel() || scope.getTitle();
      };


      // make a copy of element at index, insert it after index
      scope.copyElement = function (index) {
        if (scope.isMultiple()) {
          var fromIndex = (typeof index === 'undefined') ? scope.index : index;
          var maxItems = schemaService.getMaxItems(scope.element);
          if ((!maxItems || scope.model.length < maxItems)) {
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
        }
      };

      // Adds a new empty element to the array
      scope.addElement = function () {
        var maxItems = schemaService.getMaxItems(scope.element);
          if ((!maxItems || scope.model.length < maxItems)) {
            var seed = {};
            var properties = schemaService.propertiesOf(scope.element);
            scope.model.push(seed);
            angular.forEach(scope.model, function (m) {
              dms.findChildren(properties, m, true);
            });
          }
          scope.setActive(scope.index + 1, true);
      };

      // remove the element at index
      scope.removeElement = function (index) {
        if (scope.isMultiple()) {
          if (scope.model.length > schemaService.getMinItems(scope.element)) {
            scope.model.splice(index, 1);
          }
        }
      };

      scope.isSectionBreak = function (item) {
        var properties = schemaService.propertiesOf(scope.element);
        var node = properties[item];
        return node && schemaService.isSectionBreak(node);
      };

      scope.isStaticField = function (item) {
        var properties = schemaService.propertiesOf(scope.element);
        var node = properties[item];
        return node && schemaService.isStaticField(node);
      };

      // a field is displayable if it is not static or it is a section break
      // static fields get rolled into the field below them and displayed as a header
      // section breaks get displayed as an unclickable div of text in the form
      scope.isDisplayable = function (item) {
        var properties = schemaService.propertiesOf(scope.element);
        var node = properties[item];
        return node && (schemaService.isSectionBreak(node) || !schemaService.isStaticField(node));
      };

      scope.addRow = function () {
        if (scope.isSpreadsheetView()) {
          SpreadsheetService.addRow(scope);
        } else {
          scope.addElement();
        }
      };


      // toolbar pager min and max
      scope.pageMinMax = function () {
        scope.pageMax = Math.min(scope.valueArray.length, scope.index + scope.pageRange);
        scope.pageMin = Math.max(0, scope.pageMax - scope.pageRange);
      };

      // set the index active
      scope.selectPage = function (idx) {
        scope.setActive(idx, true);
      };

      //
      //  passed to child scope
      //

      // rename the property key of this child
      scope.renameChildKey = function (child, newKey) {
        dms.renameChildKey(scope.element, child, newKey);
      };

      // TODO this needs to be refactored to move schema details to dms
      // remove child node from element
      scope.removeChild = function (node) {

        var selectedKey;
        var schema = schemaService.schemaOf(node);
        var id = schemaService.getId(node);
        var title = schemaService.getTitle(node);
        var props = schemaService.propertiesOf(scope.element);
        angular.forEach(props, function (value, key) {
          if (schemaService.getId(value) == id) {
            selectedKey = key;
          }
        });

        if (selectedKey) {
          delete props[selectedKey];

          // remove it from the order array
          var idx = schemaService.schemaOf(scope.element)._ui.order.indexOf(selectedKey);
          schemaService.schemaOf(scope.element)._ui.order.splice(idx, 1);


          if (UIUtilService.isElement(schema)) {

            scope.$emit("invalidElementState", ["remove", title, id]);
          } else {
            scope.$emit("invalidFieldState", ["remove", title, id]);
          }
        }
      };


      //
      //  activate or deactivate - set edit state
      //

      // is this index actively being edited?
      scope.isActive = function (idx) {
        var index = scope.isSpreadsheetView() ? 0 : idx;
        return UIUtilService.isActive(scope.getLocator(index));
      };

      // is this not being edited?
      scope.isInactive = function (idx) {
        return UIUtilService.isInactive(scope.getLocator(idx));
      };

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

          $timeout(function () {

            scope.$apply();

            var props = schemaService.schemaOf(scope.element).properties;
            var order = schemaService.schemaOf(scope.element)._ui.order;
            var nextKey = order[0];
            var next = props[nextKey];
            $rootScope.$broadcast("setActive",
                [DataManipulationService.getId(next), 0, scope.path + '-' + index, nextKey, scope.fieldKey, true,
                 scope.uid + '-' + nextKey]);

          }, 0);
        }
      });

      scope.onSetActive = function (idx) {

        scope.setActive(idx, true);
        $timeout(function () {

          scope.$apply();

          var props = schemaService.propertiesOf(scope.element);
          var order = schemaService.getOrder(scope.element);
          var nextKey = order[0];
          var next = props[nextKey];

          $rootScope.$broadcast("setActive",
              [schemaService.getId(next), 0, scope.path + '-' + idx, nextKey, scope.fieldKey, true,
               scope.uid + '-' + nextKey]);

        }, 0);
      };

      scope.setActive = function (idx, value) {

        var index = scope.isSpreadsheetView() ? 0 : idx;
        UIUtilService.setActive(scope.element, index, scope.path, scope.uid, value);
        if (value) {
          scope.index = index;
          scope.pageMinMax();
          scope.expanded[index] = value;
        }
      };

      // set the active index
      scope.setIndex = function (idx) {
        scope.index = idx;
      };

      scope.isCardinalElement = function(element) {
        return schemaService.isCardinalElement(element);
      }

      // Returns the cardinality of an element
      scope.getCardinality = function(element) {
        return schemaService.getCardinalityAsString(element);
      }

      // find the next sibling to activate
      scope.activateNextSiblingOf = function (fieldKey, parentKey, i) {
        var found = false;

        // is there another sibling
        if (!found) {
          var order = schemaService.schemaOf(scope.element)._ui.order;
          var props = schemaService.schemaOf(scope.element).properties;
          var idx = order.indexOf(fieldKey);

          idx += 1;
          while (idx < order.length && !found) {
            var nextKey = order[idx];
            var next = props[nextKey];
            found = !schemaService.isStaticField(next);
            idx += 1;
          }
          if (found) {
            var next = props[nextKey];
            $rootScope.$broadcast("setActive",
                [schemaService.getId(next), 0, scope.path + '-' + scope.index, nextKey, parentKey, true,
                 scope.uid + '-' + nextKey]);
          }
        }

        // is the element multiple
        if (!found) {
          if (scope.isMultiple()) {
            if (typeof (i) == 'undefined') {
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


      //
      //  initialization
      //

      scope.setValueArray();
      scope.expandAll();
      scope.nest = (scope.path + '').split('-').length;

      scope.pageMinMax();

      scope.viewState = UIUtilService.createViewState(scope.element, scope.switchToSpreadsheet,
          scope.cleanupSpreadsheet);

    }
  };
});
