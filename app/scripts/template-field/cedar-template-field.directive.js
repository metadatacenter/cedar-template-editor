'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.templateField.cedarTemplateFieldDirective', [])
      .directive('cedarTemplateField', cedarTemplateFieldDirective);

  cedarTemplateFieldDirective.$inject = ['$rootScope', 'DataManipulationService', 'DataUtilService',
                                           'SpreadsheetService', 'UIUtilService'];

  function cedarTemplateFieldDirective($rootScope, DataManipulationService, DataUtilService, SpreadsheetService,
                                         UIUtilService) {

    var directive = {
      restrict   : 'EA',
      scope      : {
        key           : '=',
        field       : '=',
        delete        : '&',
        model         : '=',
        isEditData    : "=",
        renameChildKey: "=",
        parentElement : '=',
        nested        : '='
      },
      templateUrl: 'scripts/template-field/cedar-template-field.directive.html',
      link       : linker
    };

    return directive;


    function linker(scope, element, attrs) {


      var dms = DataManipulationService;

      scope.directiveName = 'cedarTemplateField';
      scope.fieldSchema = dms.schemaOf(scope.field);

      scope.isFirstLevel = function () {
        return (scope.$parent.directiveName === 'form');
      };

      scope.getKeyFromId = function () {
        return dms.getKeyFromId(scope.field);
      };

      scope.isRoot = function () {
        return !dms.getId(scope.field) || (dms.getId(scope.field) === $rootScope.keyOfRootElement);
      };

      scope.getTitle = function () {
        return dms.getTitle(scope.field);
      };

      scope.hasDescription = function () {
        return scope.field && dms.getDescription(scope.field).length > 0;
      };

      scope.getDescription = function () {
        return dms.getDescription(scope.field);
      };

      scope.getId = function () {
        return dms.getId(scope.field);
      };

      scope.getDomId = function (node) {
        return dms.getDomId(node);
      };

      scope.isNested = function () {
        return scope.nested == true;
      };

      scope.isSortable = function () {
        return !scope.isNested() && !scope.isRoot();
      };

      scope.isEditState = function () {
        return UIUtilService.isEditState(scope.field);
      };

      scope.isSelectable = function () {
        return !scope.isNested() && !scope.isRoot();
      };

      // try to select this field
      scope.canSelect = function (selectable) {
        if (selectable) {
          UIUtilService.canSelect(scope.field);
        }
      };

      scope.canEditProperty = function () {

        var result =
            !scope.isRoot() &&
            !UIUtilService.isRuntime() &&
            !scope.isNested() &&
            UIUtilService.isEditState(scope.field);

        return result;
      };

      scope.fieldId = dms.idOf(scope.field) || dms.generateGUID();

      var resetField = function (el, settings) {
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
                resetField(model, settings[key]);
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
                      resetField(v, settings[k]);
                    }
                  }
                });
              }
            }
          }
        });
      };

      scope.getPropertyLabel = function () {
        return dms.getPropertyLabels(scope.parentElement)[scope.key];
      };

      scope.getProperty = function () {
        return dms.getProperty(scope.parentElement, scope.element);
      };

      var setLabels = function () {
        if (scope.parentElement) {
          scope.labels = dms.getPropertyLabels(scope.parentElement);
        }
      };

      var parseField = function () {
        if (!UIUtilService.isRuntime() && scope.field) {
          if (angular.isArray(scope.model)) {
            angular.forEach(scope.model, function (m) {
              dms.findChildren(dms.propertiesOf(scope.field), m);
            });
          } else {
            dms.findChildren(dms.propertiesOf(scope.field), scope.model);
          }
        }
      };

      if (!UIUtilService.isRuntime()) {
        if (!scope.model) {
          if (scope.field.items) {
            scope.model = [];
          } else {
            scope.model = {};
          }
        }

        parseField();
        setLabels();
      }

      if (!scope.state) {
        if (scope.field && dms.schemaOf(scope.field)._ui && dms.getTitle(scope.field)) {
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
        return (UIUtilService.isEditState(scope.field));
      };


      // add a multiple cardinality field
      scope.selectedTab = 0;
      scope.addField = function () {
        if (UIUtilService.isRuntime()) {
          if ((!scope.field.maxItems || scope.model.length < scope.field.maxItems)) {
            var seed = {};

            if (scope.model.length > 0) {
              seed = angular.copy(scope.model[0]);
              resetField(seed, scope.field);
              scope.model.push(seed);
            } else {

              scope.model.push(seed);
              if (angular.isArray(scope.model)) {
                angular.forEach(scope.model, function (m) {
                  dms.findChildren(dms.propertiesOf(scope.field), m);
                });
              } else {
                dms.findChildren(dms.propertiesOf(scope.field), scope.model);
              }
              resetField(seed, scope.field);
            }
            scope.selectedTab = scope.model.length - 1;
          }
        }
      };

      // remove a multiple cardinality field
      scope.removeField = function (index) {
        if (scope.model.length > scope.field.minItems) {
          scope.model.splice(index, 1);
          if (index + 1 > scope.model.length) {
            scope.selectedTab = scope.model.length - 1;
          }
        }
      };

      scope.switchToSpreadsheet = function () {
        SpreadsheetService.switchToSpreadsheetField(scope, field);
      };

      scope.isExpanded = function () {
        return dms.isExpanded(scope.field);
      };

      scope.switchExpandedState = function () {
        dms.setExpanded(scope.field, !dms.isExpanded(scope.field));
        //UIUtilService.toggleField(scope.getDomId(scope.field));
      };

      scope.removeChild = function (node) {
        dms.removeChild(scope.parentElement, node);
        scope.$emit("invalidEFieldState",
            ["remove", scope.getTitle(), scope.getId()]);

      };

      // remove the field from the form
      scope.ckDelete = function () {
        dms.removeChild(scope.parentElement, scope.field);
        scope.$emit("invalidFieldState",
            ["remove", scope.getTitle(), scope.getId()]);
      };

      // is the cardinality details table open?
      scope.showCardinality = false;

      scope.isCardinal = function () {
        return dms.isCardinalField(scope.field);
      };

      // try to deselect this element
      scope.canDeselect = function (element) {
        return UIUtilService.canDeselect(element);
      };

      // when field is deseleted, look at errors and parse if none
      scope.$on('deselect', function (event, field, errorMessages) {
        if (field == scope.field) {
          scope.errorMessages = errorMessages;
          if (errorMessages.length == 0) parseField();
        }
      });

      // try to deselect this field
      scope.canDeselect = function (field) {
        return UIUtilService.canDeselect(field, scope.renameChildKey);
      };

      scope.fieldIsMultiInstance = function (node) {
        return dms.fieldIsMultiInstance(node);
      };

      scope.$on('saveForm', function (event) {
        // if (scope.isFirstLevel()) {
        //   var schema = dms.schemaOf($rootScope.jsonToSave);
        //   dms.relabel(schema, scope.key, scope.labels[scope.key]);
        // }

        if (scope.isEditState() && !scope.canDeselect(scope.field)) {

          scope.$emit("invalidFieldState",
              ["add", scope.getTitle(), scope.getId()]);
        } else {
          scope.$emit("invalidFieldState",
              ["remove", scope.getTitle(), scope.getId()]);
        }
      });

      scope.$watchCollection("field.properties['@context'].properties", function () {
        parseFieldt();
      });

      scope.$watchCollection("field.properties", function () {
        setLabels();
        parseField();
      });

      scope.$watchCollection("field.items.properties", function () {
        setLabels();
        parseField();
      });


      scope.defaultMinMax = function () {
        scope.field.minItems = 1;
        scope.field.maxItems = 0;
      };


      scope.clearMinMax = function () {
        delete scope.field.minItems;
        delete scope.field.maxItems;
      };

      scope.isMultiple = function () {
        return scope.field.minItems != null;
      };

      scope.isCardinalField = function () {
        return dms.isCardinalField(scope.field);
      };

      scope.getIconClass = function () {
        return 'fa fa-sitemap';
      };


      //
      // controlled terms modal
      //



      // create an id for the controlled terms modal
      scope.getModalId = function (type) {
        return UIUtilService.getModalId(scope.getId(), type);
      };

      // show the controlled terms modal
      scope.showModal = function (type, searchScope) {
        console.log('showModal field',type,searchScope);
        var options = {"filterSelection":type, "searchScope": searchScope, "modalId":"controlled-term-modal", "model": scope.element, "id":scope.getId(), "q": scope.getTitle(),'source': null,'termType': null, 'term': null, "advanced": false, "permission": ["read","write"]};
        UIUtilService.showModal(options);
      };

      // show the controlled terms modal
      scope.hideModal = function () {
        UIUtilService.hideModal();
      };

      scope.$on("property:propertyAdded", function (event, args) {

        var id = args[1];
        if (scope.getId() == id) {

          scope.hideModal();

          var propertyId = args[0];
          var propertyLabel = args[2];
          var propertyDescription = args[3];
          console.log('property:propertyAdded',propertyId, propertyLabel, propertyDescription);

          dms.updateProperty(propertyId, propertyLabel, propertyDescription, id, scope.parentElement);
        }
      });


      // get the propertyLabel for this node from its parent
      scope.getPropertyLabel = function () {
        return dms.getPropertyLabels(scope.parentElement)[scope.key];
      };

      // get the propertyId for this node from its parent
      scope.getPropertyId = function () {
        return dms.getPropertyId(scope.parentElement, scope.field);
      };

      // get the propertyId for this node from its parent
      scope.hasPropertyId = function () {
        return dms.getPropertyId(scope.parentElement, scope.field).length > 0;
      };

      // scope.hasProperty = function () {
      //   return (scope.parentElement && scope.element && dms.getProperty(scope.parentElement, scope.element));
      // };

      // delete propertyId and propertyLabel for this node
      scope.deleteProperty = function () {
        dms.deletePropertyId(scope.parentElement, scope.field);
        dms.updateProperty('', '', '', scope.getId(), scope.parentElement);
      };

      scope.getMinItems = function () {
        return dms.getMinItems(scope.field);
      };

      scope.getMaxItems = function () {
        return dms.getMaxItems(scope.field);
      };

    }

  };

});
