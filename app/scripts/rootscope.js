/*jslint node: true */
/*global angular */
var angularRun = function($rootScope, BioPortalService) {

  // Define global pageTitle variable for use
  //$rootScope.pageTitle;

  // Templates, Template Elements and Instances base paths
  $rootScope.idBasePath = "https://repo.metadatacenter.org/";

  // Schemas (classes and properties) base path
  // Classes use Pascal casing (e.g. StudyType)
  // Properties use Camel casing (e.g. hasName)
  $rootScope.schemasBase = "https://metadatacenter.org/schemas/";

  $rootScope.defaultPropertiesBase = $rootScope.schemasBase;

  $rootScope.isArray = angular.isArray;

  $rootScope.applicationMode = 'default';
  $rootScope.applicationRole = 'instantiator';
  $rootScope.pageId = null;

  // Global utility functions

  // Simple function to check if an object is empty
  $rootScope.isEmpty = function(obj) {
    return Object.keys(obj).length === 0;
  };

  // Transform string to obtain JSON field name
  $rootScope.getFieldName = function(string) {
    // Using Camel case format
    return string.replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
      return index === 0 ? letter.toLowerCase() : letter.toUpperCase();
    }).replace(/\s+/g, '');

    //// Using underscore format
    //return string
    //  .replace(/'|"|(|)/g, '')
    //  .replace(/ +/g, "_")
    //  .toLowerCase();
  };

  // Capitalize first letter
  $rootScope.capitalizeFirst = function(string) {
    string = string.toLowerCase();
    return string.substring(0,1).toUpperCase() + string.substring(1);
  };

  // Returning true if the object key value in the properties object is of json-ld type '@' or if it corresponds to any of the reserved fields
  $rootScope.ignoreKey = function(key) {
    //var pattern = /^@/i,
    var pattern = /(^@)|(^info$)|(^template_id$)/i,
      result = pattern.test(key);

    return result;
  };

  // Generating a RFC4122 version 4 compliant GUID
  $rootScope.generateGUID = function() {
    var d = Date.now();
    var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return guid;
  };

  // Sorting function that moves boolean values with true to the front of the sort
  $rootScope.sortBoolean = function(array, bool) {
    return array.sort(function(a, b) {
      var x = a[bool],
        y = b[bool];
      return ((x == y) ? -1 : ((x === true) ? -1 : 1));
    });
  };

  // Function that generates a basic field definition
  $rootScope.generateField = function(fieldType) {
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
    var field = {
      "$schema": "http://json-schema.org/draft-04/schema#",
      "@id": $rootScope.idBasePath + $rootScope.generateGUID(),
      "type": "object",
      "properties": {
        "@type": {
          "oneOf": [
            {
              "type": "string",
              "format": "uri"//,
              //"enum": []
            },
            {
              "type": "array",
              "minItems": 1,
              "items": {
                "type": "string",
                "format": "uri"//,
                //"enum": []
              },
              "uniqueItems": true
            }
          ]
        },
        "info": {
          "title": "",
          //"id": $rootScope.generateGUID(),
          "description": "",
          "input_type": fieldType,
          "required_value": false,
          "created_at": Date.now()
        },
        "value": {
          "type": valueType,
        }
      },
      "required": [
        "value"
      ],
      "additionalProperties": false
    };
    return field;
  };

  // Function that generates the @context for an instance, based on the schema @context definition
  $rootScope.generateInstanceContext = function(schemaContext) {
    var context = {};
    angular.forEach(schemaContext.properties, function(value, key) {
      context[key] = value.enum[0];
    });
   return context;
  };

  // Function that generates the @type for an instance, based on the schema @type definition
  $rootScope.generateInstanceType = function(schemaType) {
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

  $rootScope.checkFieldCardinalityOptions = function(field) {
    var unmetConditions = [];

    if (field.minItems && field.maxItems &&
        parseInt(field.minItems) > parseInt(field.maxItems)) {
      unmetConditions.push('Min cannot be greater than Max.');
    }

    return unmetConditions;
  };

  $rootScope.getFieldProperties = function(field) {
    if (field.type == 'array' && field.items && field.items.properties) {
      return field.items.properties;
    } else {
      return field.properties;
    }
  };

  $rootScope.cardinalizeField = function(field) {
    if (field.minItems == 1 && field.maxItems == 1 || !field.minItems && !field.maxItems) {
      return false;
    }
    if (!field.maxItems ||                  // special 'N' case
        (field.maxItems && field.maxItems > 1) || // has maxItems of more than 1
        (field.minItems && field.minItems > 1)) { // has minItems of more than 1
      field.items = {
        'type': field.type,
        '@id': field['@id'],
        '$schema': field.schema,
        'title': field.properties.info.title,
        'description': field.properties.description,
        'properties': field.properties,
        'required': field.required,
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
    }
    return false;
  };

  $rootScope.isCardinalElement = function(element) {
    return element.minItems && element.maxItems != 1;
  };

  // If Max Items is N, its value will be 0, then need to remove it from schema
  // if Min and Max are both 1, remove them
  $rootScope.removeUnnecessaryMaxItems = function(properties) {
    angular.forEach(properties, function(value, key) {
      if (!$rootScope.ignoreKey(key)) {
        if (!value.maxItems) {
          delete value.maxItems;
        }
        if (value.minItems &&
            value.minItems == 1 &&
            value.maxItems &&
            value.maxItems == 1) {
          delete value.minItems;
          delete value.maxItems;
        }
      }
    });
  };

  $rootScope.console = function(txt, label) {
    console.log(label + ' ' + JSON.stringify(txt,null,2));
  };

  $rootScope.isRuntime = function() {
    return $rootScope.pageId == 'RUNTIME';
  }

  $rootScope.elementIsMultiInstance = function(element) {
    return element.hasOwnProperty('minItems') && element.minItems != null;
  }

  var generateCardinalities = function(max) {
    var results = [];
    for (var i = 1; i <= max; i++) {
      results.push({value: i, label: i});
    }

    return results;
  };

  var minCardinalities = generateCardinalities(8);
  var maxCardinalities = generateCardinalities(8);
  maxCardinalities.push({value: 0, label: "N"});

  $rootScope.minCardinalities = minCardinalities;
  $rootScope.maxCardinalities = maxCardinalities;

  $rootScope.isKeyVisible = function(keyCode) {
    if (keyCode > 45 && keyCode < 112 && [91, 92, 93].indexOf(keyCode) == -1 || keyCode >= 186 && keyCode <= 222 || [8, 32, 173].indexOf(keyCode) >= 0) {
      return true;
    } else {
      return false;
    }
  };

  $rootScope.hasValueConstraint = function(info) {
    var vcst = info && info.value_constraint;
    var result = vcst && (vcst.ontologies && vcst.ontologies.length > 0 ||
                    vcst.value_sets && vcst.value_sets.length > 0 ||
                    vcst.classes && vcst.classes.length > 0 ||
                    vcst.branches && vcst.branches.length > 0);

    return result;
  }

  $rootScope.fieldAutocompleteCache = {};
  $rootScope.predefinedConstraintValues = function(id, info) {
    if ($rootScope.fieldAutocompleteCache[id] != null) {
      return $rootScope.fieldAutocompleteCache[id];
    }
    $rootScope.fieldAutocompleteCache[id] = [{label: 'Loading...'}];
    var results = [];
    var vcst = info.value_constraint;

    if (vcst.classes.length > 0) {
      angular.forEach(vcst.classes, function(klass) {
        results.push({uri: klass.uri, label: klass.label});
      });
    }

    for (var i = 0; i < vcst.value_sets.length; i++) {
      BioPortalService.getClassChildren('NLMVS', vcst.value_sets[i]['uri']).then(function(childResponse) {
        for (var j = 0; j < childResponse.length; j++) {
          results.push(
            {
              '@id': childResponse[j]['@id'],
              'label': childResponse[j]['prefLabel']
            }
          );
        }
      });
    }

    if (vcst.ontologies.length > 0) {
      angular.forEach(vcst.ontologies, function(klass) {
        results.push({uri: klass.uri, label: klass.label});
      });
    }

    if (vcst.branches.length > 0) {
      angular.forEach(vcst.branches, function(klass) {
        results.push({uri: klass.uri, label: klass.label});
      });
    }

    $rootScope.fieldAutocompleteCache[id] = results;
    return $rootScope.fieldAutocompleteCache[id];
  }

  $rootScope.excludedValueConstraint = function(id, info) {
    if ($rootScope.excludedValues && $rootScope.excludedValues[id]) {
      return $rootScope.excludedValues[id];
    }

    var results = [];
    var vcst = info.value_constraint;

    if (vcst.classes.length > 0) {
      angular.forEach(vcst.classes, function(klass) {
        jQuery.merge(results, klass.exclusions || []);
      });
    }

    if (vcst.value_sets.length > 0) {
      angular.forEach(vcst.value_sets, function(klass) {
        jQuery.merge(results, klass.exclusions || []);
      });
    }

    if (vcst.ontologies.length > 0) {
      angular.forEach(vcst.ontologies, function(klass) {
        jQuery.merge(results, klass.exclusions || []);
      });
    }

    if (vcst.branches.length > 0) {
      angular.forEach(vcst.branches, function(klass) {
        jQuery.merge(results, klass.exclusions || []);
      });
    }

    $rootScope.excludedValues = $rootScope.excludedValues || {};
    $rootScope.excludedValues[id] = results;

    return results;
  }

  $rootScope.isValueConformedToConstraint = function(value, id, info) {
    var predefinedValues = $rootScope.fieldAutocompleteCache[id];
    var excludedValues = $rootScope.excludedValueConstraint(id, info);
    var isValid = false;
    var jsonString = JSON.stringify(value);

    angular.forEach(predefinedValues, function(val) {
      if (!isValid) {
        // IMPORTANT: this campare only valid if the 2 objects are simple
        // and all properties are in the same order.
        isValid = JSON.stringify(val) == jsonString;
      }
    });

    isValid = excludedValues.indexOf(value.uri) == -1;

    return isValid;
  }
};

angularRun.$inject = ['$rootScope', 'BioPortalService'];
angularApp.run(angularRun);
