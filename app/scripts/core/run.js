/*jslint node: true */
/*global define */
'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.core.run', [])
      .run(cedarTemplateEditorCoreRun);

  cedarTemplateEditorCoreRun.$inject = ['$rootScope', 'controlTermService', '$location', '$timeout', '$window', '$sce',
                                        '$translate', 'DataTemplateService', 'DataManipulationService',
                                        'FieldTypeService', 'UrlService', 'HeaderService', 'UIUtilService',
                                        'UserService', 'UserDataService', 'RichTextConfigService', 'CONST',
                                        'controlTermDataService', 'provisionalClassService', 'Cedar'];

  function cedarTemplateEditorCoreRun($rootScope, controlTermService, $location, $timeout, $window, $sce, $translate,
                                      DataTemplateService, DataManipulationService, FieldTypeService, UrlService,
                                      HeaderService, UIUtilService, UserService, UserDataService, RichTextConfigService,
                                      CONST, controlTermDataService, provisionalClassService, Cedar) {

    $rootScope.isArray = angular.isArray;

    $rootScope.applicationMode = CONST.applicationMode.DEFAULT;
    $rootScope.applicationRole = 'instantiator';
    $rootScope.pageId = null;

    $rootScope.sortableOptions = {
      handle: ".sortable-handler"
    };

    // Global utility functions

    // Simple function to check if an object is empty
    $rootScope.isEmpty = function (obj) {
      return !obj || Object.keys(obj).length === 0;
    };

    // Transform string to obtain JSON field name
    $rootScope.getFieldName = function (string) {
      // Using Camel case format
      return string.replace(/(?:^\w|[A-Z]|\b\w)/g, function (letter, index) {
        return index === 0 ? letter.toLowerCase() : letter.toUpperCase();
      }).replace(/\s+/g, '');

      //// Using underscore format
      //return string
      //  .replace(/'|"|(|)/g, '')
      //  .replace(/ +/g, "_")
      //  .toLowerCase();
    };

    // Capitalize first letter
    $rootScope.capitalizeFirst = function (string) {
      string = string.toLowerCase();
      return string.substring(0, 1).toUpperCase() + string.substring(1);
    };

    // Returning true if the object key value in the properties object is of json-ld type '@' or if it corresponds to any of the reserved fields
    $rootScope.ignoreKey = function (key) {
      //var pattern = /^@/i,
      var pattern = /(^@)|(^_ui$)|(^templateId$)/i,
          result = pattern.test(key);

      return result;
    };

    // Generating a RFC4122 version 4 compliant GUID
    $rootScope.generateGUID = function () {
      var d = Date.now();
      var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
      });
      return guid;
    };

    // Sorting function that moves boolean values with true to the front of the sort
    $rootScope.sortBoolean = function (array, bool) {
      return array.sort(function (a, b) {
        var x = a[bool],
            y = b[bool];
        return ((x == y) ? -1 : ((x === true) ? -1 : 1));
      });
    };

    // Function that generates a basic field definition
    $rootScope.generateField = function (fieldType) {
      var valueType = "string";
      if (fieldType == "numeric") {
        valueType = "number";
      }
      else if (fieldType == "checkbox") {
        valueType = "object";
      }
      else if (fieldType == "list") {
        valueType = "array";
      }
      var field = DataTemplateService.getField($rootScope.idBasePath + $rootScope.generateGUID());
      field.properties._ui.inputType = fieldType;
      field.properties._ui.createdAt = Date.now();
      field.properties._value.type = valueType;
      return field;
    };

    // Function that generates the @context for an instance, based on the schema @context definition
    $rootScope.generateInstanceContext = function (schemaContext) {
      var context = {};
      angular.forEach(schemaContext.properties, function (value, key) {
        context[key] = value.enum[0];
      });
      return context;
    };

    // Function that generates the @type for an instance, based on the schema @type definition
    $rootScope.generateInstanceType = function (schemaType) {
      // If there is no type defined at the schema level
      if (angular.isUndefined(schemaType.oneOf[0].enum))
        return null;
      else {
        if (schemaType.oneOf[0].enum.length === 0)
          return null;
        // If only one type has been defined, a string is returned
        else if (schemaType.oneOf[0].enum.length == 1)
          return schemaType.oneOf[0].enum[0];
        // If more than one types have been defined for the template/element/field, an array is returned
        else
          return schemaType.oneOf[0].enum;
      }
    };

    $rootScope.checkFieldCardinalityOptions = function (field) {
      var unmetConditions = [];

      if (field.minItems && field.maxItems &&
          parseInt(field.minItems) > parseInt(field.maxItems)) {
        unmetConditions.push('Min cannot be greater than Max.');
      }

      return unmetConditions;
    };

    $rootScope.cardinalizeField = function (field) {

      if (field.minItems == 1 && field.maxItems == 1 || !field.minItems && !field.maxItems) {
        return false;
      }
      //if (!field.maxItems ||                  // special 'N' case
      //    (field.maxItems && field.maxItems > 1) || // has maxItems of more than 1
      //    (field.minItems && field.minItems > 1)) { // has minItems of more than 1
      field.items = {
        'type'                : field.type,
        '@id'                 : field['@id'],
        '$schema'             : field.schema,
        'title'               : field.properties._ui.title,
        'description'         : field.properties._ui.description,
        'properties'          : field.properties,
        'required'            : field.required,
        'additionalProperties': field.additionalProperties
      };
      field.type = 'array';

      delete field.$schema;
      delete field['@id'];
      delete field.properties;
      delete field.title;
      delete field.description;
      delete field.required;
      delete field.additionalProperties;

      return true;
      //}
      //return false;
    };

    $rootScope.propertiesOf = function (fieldOrElement) {
      return DataManipulationService.getFieldProperties(fieldOrElement);
    };

    $rootScope.idOf = function (fieldOrElement) {
      if (fieldOrElement) {
        if (fieldOrElement.items) {
          return fieldOrElement.items["@id"];
        } else {
          return fieldOrElement["@id"];
        }
      }
    };

    $rootScope.uncardinalizeField = function (field) {

      if (field.maxItems != 1 || !field.items) {
        return false;
      }

      field.type = 'object';

      field.$schema = field.items.$schema;
      field['@id'] = field.items["@id"];
      field.properties = field.items.properties;
      field.required = field.items.required;
      field.additionalProperties = field.items.additionalProperties;

      delete field.items;
      delete field.maxItems;
      delete field.minItems;

      return true;
    };

    $rootScope.isCardinalElement = function (element) {
      //return element.minItems && element.maxItems != 1;
      return !element.maxItems || element.minItems < element.maxItems;
    };

    // If Max Items is N, its value will be 0, then need to remove it from schema
    // if Min and Max are both 1, remove them
    $rootScope.removeUnnecessaryMaxItems = function (properties) {
      angular.forEach(properties, function (value, key) {
        if (!$rootScope.ignoreKey(key)) {


          //if (!value.maxItems) {
          //  delete value.maxItems;
          //}
          //if (value.minItems &&
          //    value.minItems == 1 &&
          //    value.maxItems &&
          //    value.maxItems == 1) {
          //  delete value.minItems;
          //  delete value.maxItems;
          //}
        }
      });
    };

    $rootScope.console = function (txt, label) {
      console.log(label + ' ' + JSON.stringify(txt, null, 2));
    };

    $rootScope.isRuntime = function () {
      return $rootScope.pageId == 'RUNTIME';
    };

    $rootScope.elementIsMultiInstance = DataManipulationService.elementIsMultiInstance;

    $rootScope.isField = function (value) {
      return value && value.properties && value.properties._ui && value.properties._ui.inputType;
    };

    $rootScope.isElement = function (value) {
      return value && value._ui;
    };

    $rootScope.findChildren = function (iterator, parentModel, parentKey, level) {
      var ctx, min, type, i;
      angular.forEach(iterator, function (value, name) {
        // Add @context information to instance
        if (name == '@context') {
          ctx = $rootScope.generateInstanceContext(value);
        }
      });

      angular.forEach(iterator, function (value, name) {
        // Add @context information to instance
        if (name == '@context') {
          parentModel['@context'] = $rootScope.generateInstanceContext(value);
        }
        // Add @type information to instance
        else if (name == '@type') {
          type = $rootScope.generateInstanceType(value);
          if (type) {
            parentModel['@type'] = type;
          }
        }

        if (!$rootScope.ignoreKey(name)) {
          // We can tell we've reached an element level by its 'order' property
          if (value._ui && value._ui.order) {

            min = value.minItems || 0;

            if ($rootScope.isCardinalElement(value)) {
              parentModel[name] = [];
              for (i = 0; i < min; i++) {
                parentModel[name].push({});
              }
            } else {
              parentModel[name] = {};
            }
          } else {
            min = value.minItems || 0;

            // Assign empty field instance model to $scope.model only if it does not exist
            if (!parentModel[name]) {
              if (!$rootScope.isCardinalElement(value)) {
                parentModel[name] = {};
              } else {
                parentModel[name] = [];
                for (i = 0; i < min; i++) {
                  var obj = {};
                  parentModel[name].push(obj);
                }
              }
            }

            var p = $rootScope.propertiesOf(value);

            // Add @type information to instance at the field level
            if (p && !angular.isUndefined(p['@type'])) {
              type = $rootScope.generateInstanceType(p['@type']);

              if (type) {
                if (angular.isArray(parentModel[name])) {
                  for (i = 0; i < min; i++) {
                    parentModel[name][i]["@type"] = type || "";
                  }
                } else {
                  parentModel[name]["@type"] = type || "";
                }
              }
            }
          }
        }
      });
    };

    $rootScope.assignOrder = function (fieldOrElement, parentElement) {
      var order = 1;
      angular.forEach(parentElement, function (value, key) {
        if ($rootScope.isElement(value) || $rootScope.isField(value)) {
          order += 1;
        }
      });

      fieldOrElement.properties._ui.order = order;
    };

    $rootScope.scrollToAnchor = UIUtilService.scrollToAnchor;

    var minCardinalities = DataManipulationService.generateCardinalities(0, 8);
    var maxCardinalities = DataManipulationService.generateCardinalities(1, 8);
    maxCardinalities.push({value: 0, label: "N"});

    $rootScope.minCardinalities = minCardinalities;
    $rootScope.maxCardinalities = maxCardinalities;

    // BioPortal term selection integration code.
    // TODO: separate the calls, create a service for these
    $rootScope.isKeyVisible = function (keyCode) {
      if (keyCode > 45 && keyCode < 112 && [91, 92, 93].indexOf(keyCode) == -1 ||
          keyCode >= 186 && keyCode <= 222 ||
          [8, 32, 173].indexOf(keyCode) >= 0) {
        return true;
      } else {
        return false;
      }
    };

    $rootScope.hasValueConstraint = function (vcst) {
      var result = vcst && (vcst.ontologies && vcst.ontologies.length > 0 ||
          vcst.valueSets && vcst.valueSets.length > 0 ||
          vcst.classes && vcst.classes.length > 0 ||
          vcst.branches && vcst.branches.length > 0);

      return result;
    };

    $rootScope.autocompleteResultsCache = {};

    $rootScope.sortAutocompleteResults = function (field_id) {
      $rootScope.autocompleteResultsCache[field_id].results.sort(function (a, b) {
        var labelA = a.label.toLowerCase();
        var labelB = b.label.toLowerCase();
        if (labelA < labelB)
          return -1;
        if (labelA > labelB)
          return 1;
        return 0;
      });
    };

    $rootScope.removeAutocompleteResultsForSource = function (field_id, source_uri) {
      // remove results for this source
      for (var i = $rootScope.autocompleteResultsCache[field_id].results.length - 1; i >= 0; i--) {
        if ($rootScope.autocompleteResultsCache[field_id].results[i].sourceUri === source_uri) {
          $rootScope.autocompleteResultsCache[field_id].results.splice(i, 1);
        }
      }
    };

    $rootScope.processAutocompleteClassResults = function (field_id, field_type, source_uri, response) {
      var i, j, found;
      // we do a complicated method to find the changed results to reduce flicker :-/
      for (j = $rootScope.autocompleteResultsCache[field_id].results.length - 1; j >= 0; j--) {
        if ($rootScope.autocompleteResultsCache[field_id].results[j].sourceUri != source_uri) {
          // we only care about the ones from this source
          continue;
        }
        found = false;
        for (i = 0; i < response.collection.length; i++) {
          if (response.collection[i]['@id'] == $rootScope.autocompleteResultsCache[field_id].results[j]['@id']) {
            // this option still in the result set -- mark it
            response.collection[i].found = true;
            found = true;
          }
        }
        if (!found) {
          // need to remove this option
          $rootScope.autocompleteResultsCache[field_id].results.splice(j, 1);
        }
      }
      for (i = 0; i < response.collection.length; i++) {
        if (!response.collection[i].found) {
          $rootScope.autocompleteResultsCache[field_id].results.push(
              {
                '@id'      : response.collection[i]['@id'],
                'label'    : response.collection[i].prefLabel,
                'type'     : field_type,
                'sourceUri': source_uri
              }
          );
        }
      }
      if ($rootScope.autocompleteResultsCache[field_id].results.length === 0) {
        $rootScope.autocompleteResultsCache[field_id].results.push({
          'label': $translate.instant('GENERIC.NoResults')
        });
      } else {
        for (i = 0; i < $rootScope.autocompleteResultsCache[field_id].results.length; i++) {
          if ($rootScope.autocompleteResultsCache[field_id].results[i].label == $translate.instant('GENERIC.NoResults')) {
            $rootScope.autocompleteResultsCache[field_id].results.splice(i, 1);
            break;
          }
        }
        $rootScope.sortAutocompleteResults(field_id);
      }
    };

    $rootScope.updateFieldAutocomplete = function (field, term) {
      if (term === '') {
        term = '*';
      }
      var results = [];
      var properties = $rootScope.propertiesOf(field);
      var vcst = properties._valueConstraints;
      var field_id = field['@id'];

      if (angular.isUndefined($rootScope.autocompleteResultsCache[field_id])) {
        $rootScope.autocompleteResultsCache[field_id] = {
          'results': []
        };
      }

      if (vcst.classes.length > 0) {
        $rootScope.removeAutocompleteResultsForSource(field_id, 'template');
        angular.forEach(vcst.classes, function (klass) {
          if (term == '*') {
            $rootScope.autocompleteResultsCache[field_id].results.push(
                {
                  '@id'      : klass.uri,
                  'label'    : klass.label,
                  'type'     : 'Ontology Class',
                  'sourceUri': 'template'
                }
            );
          } else {
            if (klass && klass.label && klass.label.toLowerCase().indexOf(term.toLowerCase()) !== -1) {
              $rootScope.autocompleteResultsCache[field_id].results.push(
                  {
                    '@id'      : klass.uri,
                    'label'    : klass.label,
                    'type'     : 'Ontology Class',
                    'sourceUri': 'template'
                  }
              );
            }
          }
        });
        if (term !== '*') {
          if ($rootScope.autocompleteResultsCache[field_id].results.length === 0) {
            $rootScope.autocompleteResultsCache[field_id].results.push({
              'label'    : $translate.instant('GENERIC.NoResults'),
              'sourceUri': 'template'
            });
          }
        }
      }

      if (vcst.valueSets.length > 0) {
        angular.forEach(vcst.valueSets, function (valueSet) {
          if (term == '*') {
            $rootScope.removeAutocompleteResultsForSource(field_id, valueSet.uri);
          }
          controlTermDataService.autocompleteValueSetClasses(term, valueSet.uri).then(function (childResponse) {
            $rootScope.processAutocompleteClassResults(field_id, 'Value Set Class', valueSet.uri, childResponse);
          });
        });
      }

      if (vcst.ontologies.length > 0) {
        angular.forEach(vcst.ontologies, function (ontology) {
          if (term == '*') {
            $rootScope.removeAutocompleteResultsForSource(field_id, ontology.uri);
          }
          controlTermDataService.autocompleteOntology(term, ontology.acronym).then(function (childResponse) {
            $rootScope.processAutocompleteClassResults(field_id, 'Ontology Class', ontology.uri, childResponse);
          });
        });
      }

      if (vcst.branches.length > 0) {
        angular.forEach(vcst.branches, function (branch) {
          if (term == '*') {
            $rootScope.removeAutocompleteResultsForSource(field_id, branch.uri);
          }
          controlTermDataService.autocompleteOntologySubtree(term, branch.acronym, branch.uri, branch.maxDepth).then(
              function (childResponse) {
                $rootScope.processAutocompleteClassResults(field_id, 'Ontology Class', branch.uri, childResponse);
              }
          );
        });
      }
    };

    $rootScope.excludedValueConstraint = function (id, vcst) {
      if ($rootScope.excludedValues && $rootScope.excludedValues[id]) {
        return $rootScope.excludedValues[id];
      }

      var results = [];

      if (vcst.classes.length > 0) {
        angular.forEach(vcst.classes, function (klass) {
          jQuery.merge(results, klass.exclusions || []);
        });
      }

      if (vcst.valueSets.length > 0) {
        angular.forEach(vcst.valueSets, function (klass) {
          jQuery.merge(results, klass.exclusions || []);
        });
      }

      if (vcst.ontologies.length > 0) {
        angular.forEach(vcst.ontologies, function (klass) {
          jQuery.merge(results, klass.exclusions || []);
        });
      }

      if (vcst.branches.length > 0) {
        angular.forEach(vcst.branches, function (klass) {
          jQuery.merge(results, klass.exclusions || []);
        });
      }

      $rootScope.excludedValues = $rootScope.excludedValues || {};
      $rootScope.excludedValues[id] = results;

      return results;
    };

    $rootScope.isValueConformedToConstraint = function (value, id, vcst) {
      var predefinedValues = $rootScope.autocompleteResultsCache[id].results;
      var excludedValues = $rootScope.excludedValueConstraint(id, vcst);
      var isValid = false;
      var jsonString = JSON.stringify(value);

      angular.forEach(predefinedValues, function (val) {
        if (!isValid) {
          // IMPORTANT: this compare only valid if the 2 objects are simple
          // and all properties are in the same order.
          isValid = JSON.stringify(val) == jsonString;
        }
      });

      isValid = excludedValues.indexOf(value.uri) == -1;

      return isValid;
    };

    $rootScope.isOntology = function (obj) {
      return obj && obj["@type"] && obj["@type"].indexOf("Ontology") > 0;
    };

    $rootScope.lengthOfValueConstraint = function (valueConstraint) {
      return (valueConstraint.classes || []).length +
          (valueConstraint.valueSets || []).length +
          (valueConstraint.ontologies || []).length +
          (valueConstraint.branches || []).length;
    };

    $rootScope.getUnescapedContent = function (field) {
      return $sce.trustAsHtml($rootScope.propertiesOf(field)._content);
    };

    Cedar.init();
    $rootScope.cedar = Cedar;
    DataTemplateService.init();
    FieldTypeService.init();
    UrlService.init();
    provisionalClassService.init();
    controlTermDataService.init();
    DataManipulationService.init();
    HeaderService.init();

    UserService.injectUserHandler($window.bootstrapUserHandler);
    UserService.init(function () {
      UserDataService.readUserDetails();
    });

    $rootScope.editorOptions = RichTextConfigService.getConfig("default");


  };

});