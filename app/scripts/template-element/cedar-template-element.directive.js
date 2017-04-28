'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.templateElement.cedarTemplateElementDirective', [])
      .directive('cedarTemplateElement', cedarTemplateElementDirective);

  cedarTemplateElementDirective.$inject = ['$rootScope', 'DataManipulationService', 'DataUtilService',
                                           'SpreadsheetService','UIUtilService'];

  function cedarTemplateElementDirective($rootScope, DataManipulationService, DataUtilService, SpreadsheetService, UIUtilService) {

    var directive = {
      restrict   : 'EA',
      scope      : {
        key          : '=',
        element      : '=',
        delete       : '&',
        model        : '=',
        labels       : '=',
        relabel      : '=',
        isRootElement: "@",
        isEditData   : "=",
        nested       : '@'
      },
      templateUrl: 'scripts/template-element/cedar-template-element.directive.html',
      link       : linker
    };

    return directive;



    function linker(scope, element, attrs) {


      scope.isRoot =function() {
        return scope.isRootElement == 'true';
      };

      scope.isNested =function() {
        return scope.nested == 'true';
      };

      scope.isEditState = function() {
        return DataManipulationService.isEditState(scope.element);
      };

      scope.isSelectable = function() {
        return !scope.isRoot() && !$rootScope.isRuntime() && !scope.isNested();
      };

      // try to select this element
      scope.canSelect = function (select) {
        if (select) {
          DataManipulationService.canSelect(scope.element);
        }
      };

      scope.canEditProperty =function() {

        var result  =
            !scope.isRoot() &&
            !$rootScope.isRuntime() &&
            !scope.isNested() &&
            DataManipulationService.isEditState(scope.element);

        return result;
      };


      scope.elementId = DataManipulationService.idOf(scope.element) || DataManipulationService.generateGUID();

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
                  }
                  else if (k == '_valueLabel') {
                    delete model[k];
                  }
                  else if (k !== '@type') {
                    if (settings[k]) {
                      resetElement(v, settings[k]);
                    }
                  }
                });
              }
            }
          }
        });
      };

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
      };

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
      };

      scope.isEditState = function () {
        return (DataManipulationService.isEditState(scope.element));
      };


      // add a multiple cardinality element
      scope.selectedTab = 0;
      scope.addElement = function () {
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
        $rootScope.toggleElement(domId);
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

          // remove property label for this element
          delete $rootScope.schemaOf(scope.element)._ui.propertyLabels[selectedKey];

          if ($rootScope.isElement(fieldOrElement)) {
            scope.$emit("invalidElementState",
                ["remove", $rootScope.schemaOf(fieldOrElement)._ui.title, fieldOrElement["@id"]]);
          } else {
            scope.$emit("invalidFieldState",
                ["remove", $rootScope.schemaOf(fieldOrElement)._ui.title, fieldOrElement["@id"]]);
          }

          // Remove it from the top-level 'required' array
          scope.element = DataManipulationService.removeKeyFromRequired(scope.element, selectedKey);
        }
      };

      // is the cardinality details table open?
      scope.showCardinality = false;

      scope.isCardinal = function () {
        return DataManipulationService.isCardinalElement(scope.element);
      };

      // try to deselect this element
      scope.canDeselect = function (element) {
        return DataManipulationService.canDeselect(element);
      };

      // when element is deseleted, look at errors and parse if none
      scope.$on('deselect', function (event, element, errorMessages) {
        if (element == scope.element) {
          scope.errorMessages = errorMessages;
          if (errorMessages.length == 0) parseElement();
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

              // Rename key in the 'order' array
              scope.element._ui.order = DataManipulationService.renameItemInArray(scope.element._ui.order, key, newKey);

              // Rename key in the 'required' array
              scope.element.required = DataManipulationService.renameItemInArray(scope.element.required, key, newKey);
            }
          });
        }
      };


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




      scope.defaultMinMax = function () {
        scope.element.minItems = 1;
        scope.element.maxItems = 0;
      };


      scope.clearMinMax = function () {
        delete scope.element.minItems;
        delete scope.element.maxItems;
      };

      scope.isMultiple = function () {
        return scope.element.minItems != null;
      };


      //
      // controlled terms modal
      //

      // create an id for the controlled terms modal
      scope.getModalId = function (type) {
        return UIUtilService.getModalId(DataManipulationService.getId(scope.element), type);
      };

      // show the controlled terms modal
      scope.showModal = function (type) {
        UIUtilService.showModal(DataManipulationService.getId(scope.element), type);
      };

      // show the controlled terms modal
      scope.hideModal = function (type) {
        UIUtilService.hideModal(DataManipulationService.getId(scope.element), type);
      };

      // update the property for a field in the element
      scope.$on("property:propertyAdded", function (event, args) {
        var property = args[0];   // property value
        var id = args[1];         // field id

        var props = scope.element.properties;
        var fieldProp;
        for (var prop in props) {
          if (props[prop]['@id'] === id) {
            var fieldProp = prop;
            break;
          }
        }
        if (fieldProp) {
          scope.element.properties['@context'].properties[fieldProp]['enum'][0] = property;
        }

        // hide the modal
        scope.hideModal('property');
      });


    }

  };

});
