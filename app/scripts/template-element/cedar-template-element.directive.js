'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.templateElement.cedarTemplateElementDirective', [])
      .directive('cedarTemplateElement', cedarTemplateElementDirective);

  cedarTemplateElementDirective.$inject = ['$rootScope', 'DataManipulationService', 'DataUtilService',
                                           'SpreadsheetService', 'UIUtilService'];

  function cedarTemplateElementDirective($rootScope, DataManipulationService, DataUtilService, SpreadsheetService,
                                         UIUtilService) {

    var directive = {
      restrict   : 'EA',
      scope      : {
        key          : '=',
        element      : '=',
        delete       : '&',
        model        : '=',
        isEditData   : "=",
        parentElement: '=',
        nested       : '='
      },
      templateUrl: 'scripts/template-element/cedar-template-element.directive.html',
      link       : linker
    };

    return directive;


    function linker(scope, element, attrs) {


      var dms = DataManipulationService;

      scope.directiveName = 'cedarTemplateElement';
      scope.elementSchema = dms.schemaOf(scope.element);

      scope.isFirstLevel = function () {
        return (scope.$parent.directiveName === 'form');
      };

      scope.getKeyFromId = function () {
        return dms.getKeyFromId(scope.element);
      };

      scope.isRoot = function () {
        return !dms.getId(scope.element)  || (dms.getId(scope.element) === $rootScope.keyOfRootElement);
      };

      scope.getTitle = function () {
        return dms.getTitle(scope.element);
      };

      scope.getId = function () {
        return dms.getId(scope.element);
      };

      scope.getDomId = function (node) {
        return dms.getDomId(node);
      };

      scope.isNested = function () {
        return scope.nested == true;
      };

      scope.isSortable = function() {
        return !scope.isNested() && !scope.isRoot();
      };

      scope.isEditState = function () {
        return UIUtilService.isEditState(scope.element);
      };

      scope.isSelectable = function () {
        return !scope.isNested() && !scope.isRoot();
      };

      // try to select this element
      scope.canSelect = function (selectable) {
        if (selectable) {
          UIUtilService.canSelect(scope.element);
        }
      };

      scope.canEditProperty = function () {

        var result =
            !scope.isRoot() &&
            !UIUtilService.isRuntime() &&
            !scope.isNested() &&
            UIUtilService.isEditState(scope.element);

        return result;
      };

      scope.elementId = dms.idOf(scope.element) || dms.generateGUID();

      var resetElement = function (el, settings) {
        angular.forEach(el, function (model, key) {
          if (settings[key] && settings[key].minItems && angular.isArray(model)) {
            model.splice(settings[key].minItems, model.length);
          }
          if (!DataUtilService.isSpecialKey(key)) {
            if (key == '@value') {
              if (angular.isArray(model)) {
                if (dms.schemaOf(settings)._ui.inputType == "list") {
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
                      if (dms.schemaOf(settings)._ui.inputType == "list") {
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
                  else if (k == 'rdfs:label') {
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

      var setLabels = function() {
        if (scope.parentElement) {
          scope.labels = dms.getPropertyLabels(scope.parentElement);
        }
      };

      var parseElement = function () {
        if (!UIUtilService.isRuntime() && scope.element) {
          if (angular.isArray(scope.model)) {
            angular.forEach(scope.model, function (m) {
              dms.findChildren(dms.propertiesOf(scope.element), m);
            });
          } else {
            dms.findChildren(dms.propertiesOf(scope.element), scope.model);
          }
        }
      };

      if (!UIUtilService.isRuntime()) {
        if (!scope.model) {
          if (scope.element.items) {
            scope.model = [];
          } else {
            scope.model = {};
          }
        }

        parseElement();
        setLabels();
      }

      if (!scope.state) {
        if (scope.element && dms.schemaOf(scope.element)._ui && dms.getTitle(scope.element)) {
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
        return (UIUtilService.isEditState(scope.element));
      };


      // add a multiple cardinality element
      scope.selectedTab = 0;
      scope.addElement = function () {
        if (UIUtilService.isRuntime()) {
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
                  dms.findChildren(dms.propertiesOf(scope.element), m);
                });
              } else {
                dms.findChildren(dms.propertiesOf(scope.element), scope.model);
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

      scope.isExpanded = function () {
        return dms.isExpanded(scope.element);
      };

      scope.switchExpandedState = function () {
        dms.setExpanded(scope.element, !dms.isExpanded(scope.element));
        //UIUtilService.toggleElement(scope.getDomId(scope.element));
      };

      scope.removeChild = function (node) {
        dms.removeChild(scope.parentElement, node);
        scope.$emit("invalidElementState",
            ["remove", scope.getTitle(), scope.getId()]);

      };

      // is the cardinality details table open?
      scope.showCardinality = false;

      scope.isCardinal = function () {
        return dms.isCardinalElement(scope.element);
      };

      // try to deselect this element
      scope.canDeselect = function (element) {
        return UIUtilService.canDeselect(element);
      };

      // when element is deseleted, look at errors and parse if none
      scope.$on('deselect', function (event, element, errorMessages) {
        if (element == scope.element) {
          scope.errorMessages = errorMessages;
          if (errorMessages.length == 0) parseElement();
        }
      });

      // rename the key of a child in the form
      scope.renameChildKey = function (child, newKey) {
        dms.renameChildKey(scope.element, child, newKey);
      };

      // try to deselect this field
      scope.canDeselect = function (field) {
        return UIUtilService.canDeselect(field, scope.renameChildKey);
      };

      scope.elementIsMultiInstance = function (node) {
        return dms.elementIsMultiInstance(node);
      };

      scope.$on('saveForm', function (event) {
        // if (scope.isFirstLevel()) {
        //   var schema = dms.schemaOf($rootScope.jsonToSave);
        //   dms.relabel(schema, scope.key, scope.labels[scope.key]);
        // }

        if (scope.isEditState() && !scope.canDeselect(scope.element)) {

          scope.$emit("invalidElementState",
              ["add", scope.getTitle(), scope.getId()]);
        } else {
          scope.$emit("invalidElementState",
              ["remove", scope.getTitle(), scope.getId()]);
        }
      });

      scope.$watchCollection("element.properties['@context'].properties", function () {
        parseElement();
      });

      scope.$watchCollection("element.properties", function () {
        setLabels();
        parseElement();
      });

      scope.$watchCollection("element.items.properties", function () {
        setLabels();
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

      scope.modalType;
      // create an id for the controlled terms modal
      scope.getModalId = function (type) {
        return UIUtilService.getModalId(scope.getId(), type);
      };

      // show the controlled terms modal
      scope.showModal = function (type) {
        if (type) {
          scope.modalType = type;
          UIUtilService.showModal(scope.getId(), type);
        }
      };

      // show the controlled terms modal
      scope.hideModal = function () {
        if (scope.modalType) {
          UIUtilService.hideModal(scope.getId(), scope.modalType);
        }
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
          console.log('on property:propertyAdded',property);
          scope.element.properties['@context'].properties[fieldProp]['enum'][0] = property;
        }

        // hide the modal
        scope.hideModal();
      });


    }

  };

});
