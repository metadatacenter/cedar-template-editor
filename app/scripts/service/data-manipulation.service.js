'use strict';
/*global cedarBootstrap */

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.service.dataManipulationService', [])
      .service('DataManipulationService', DataManipulationService);

  DataManipulationService.$inject = ['DataTemplateService', 'DataUtilService'];

  function DataManipulationService(DataTemplateService, DataUtilService) {

    var config = null;
    var schemaBase = null;

    // Base path to generate field ids
    // TODO: fields will be saved as objects on server, they will get their id there
    // TODO: need to assign a temporary id, which will be replaced on server side
    var idBasePath = null;

    var service = {
      serviceId: "DataManipulationService"
    };

    service.init = function () {
      config = cedarBootstrap.getBaseConfig(this.serviceId);
      schemaBase = config.schemaBase;
      idBasePath = config.idBasePath;
    };

    // Function that generates a basic field definition
    service.generateField = function (fieldType) {
      var valueType = "string";
      if (fieldType == "numeric") {
        valueType = "number";
      } else if (fieldType == "checkbox") {
        valueType = "object";
      } else if (fieldType == "list") {
        valueType = "array";
      }
      var field = DataTemplateService.getField(this.generateTempGUID());
      field.properties._ui.inputType = fieldType;
      field.properties._ui.createdAt = Date.now();
      field.properties._value.type = valueType;
      return field;
    };

    // Function that generates the @context for an instance, based on the schema @context definition
    service.generateInstanceContext = function (schemaContext) {
      var context = {};
      angular.forEach(schemaContext.properties, function (value, key) {
        context[key] = value.enum[0];
      });
      return context;
    };


    // Function that generates the @type for an instance, based on the schema @type definition
    service.generateInstanceType = function (schemaType) {
      // If there is no type defined at the schema level
      if (angular.isUndefined(schemaType.oneOf[0].enum)) {
        return null;
      } else {
        if (schemaType.oneOf[0].enum.length === 0) {
          return null;
          // If only one type has been defined, a string is returned
        } else if (schemaType.oneOf[0].enum.length == 1) {
          return schemaType.oneOf[0].enum[0];
          // If more than one types have been defined for the template/element/field, an array is returned
        } else {
          return schemaType.oneOf[0].enum;
        }
      }
    };

    service.cardinalizeField = function (field) {

      if (field.minItems == 1 && field.maxItems == 1 || !field.minItems && !field.maxItems) {
        return false;
      }
      //if (!field.maxItems ||                  // special 'N' case
      //    (field.maxItems && field.maxItems > 1) || // has maxItems of more than 1
      //    (field.maxItems && field.maxItems == 1 && field.minItems == 0) || // has maxItems of more than 1 and min 0
      //    (field.minItems && field.minItems > 1)) { // has minItems of more than 1
      field.items = {
        'type'                : field.type,
        '@id'                 : field['@id'],
        '$schema'             : field.$schema,
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

    service.isCardinalElement = function (element) {
      return element.type == 'array';
    };

    // If Max Items is N, its value will be 0, then need to remove it from schema
    // if Min and Max are both 1, remove them
    service.removeUnnecessaryMaxItems = function (properties) {
      angular.forEach(properties, function (value, key) {
        if (!DataUtilService.isSpecialKey(key)) {

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

          if (value.minItems == 1 && value.maxItems == 1) {
            delete value.minItems;
            delete value.maxItems;
          }
        }
      });
    };

    service.getFieldProperties = function (field) {
      if (field) {
        if (field.type == 'array' && field.items && field.items.properties) {
          return field.items.properties;
        } else {
          return field.properties;
        }
      }
    };

    service.addOption = function (field) {
      var emptyOption = {
        "text": ""
      };
      field.properties._ui.options.push(emptyOption);
    };

    service.generateCardinalities = function (min, max) {
      var results = [];
      for (var i = min; i <= max; i++) {
        results.push({value: i, label: i});
      }

      return results;
    };

    // TODO: remove this if not needed
    // Generating a RFC4122 version 4 compliant GUID
    service.generateGUID = function () {
      var d = Date.now();
      var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
      });
      return guid;
    };

    service.generateTempGUID = function () {
      return "tmp-" + Date.now() + "-" + (window.performance.now() | 0);
    }

    service.elementIsMultiInstance = function (element) {
      //return element.hasOwnProperty('minItems') && !angular.isUndefined(element.minItems);
      return element.hasOwnProperty('maxItems') && !angular.isUndefined(element.maxItems) && element.maxItems != 1;
    };

    // Transform string to obtain JSON field name
    service.getFieldName = function (string) {
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

    service.getEnumOf = function (fieldName) {
      return schemaBase + fieldName
    }

    service.generateFieldContextProperties = function (fieldName) {
      var c = {};
      c.enum = new Array(service.getEnumOf(schemaBase + fieldName));
      return c;
    };

    service.getAcceptableKey = function (obj, suggestedKey) {
      if (!obj || typeof(obj) != "object") {
        return;
      }

      var key = suggestedKey;
      if (obj[key]) {
        var idx = 1;
        while (obj["" + key + idx]) {
          idx += 1;
        }

        key = "" + key + idx;
      }

      return key;
    }

    service.addKeyToObject = function (obj, key, value) {
      if (!obj || typeof(obj) != "object") {
        return;
      }

      key = service.getAcceptableKey(obj, key);
      obj[key] = value;
      return obj;
    }

    service.renameKeyOfObject = function (obj, currentKey, newKey) {
      if (!obj || !obj[currentKey]) {
        return;
      }

      newKey = service.getAcceptableKey(obj, newKey);
      Object.defineProperty(obj, newKey, Object.getOwnPropertyDescriptor(obj, currentKey));
      delete obj[currentKey];

      return obj;
    }

    return service;
  };

});
