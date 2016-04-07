'use strict';

define([
  'angular',
  'json!config/data-manipulation-service.conf.json'
], function (angular, config) {
  angular.module('cedar.templateEditor.service.dataManipulationService', [])
      .service('DataManipulationService', DataManipulationService);

  DataManipulationService.$inject = ['DataTemplateService', 'DataUtilService', 'UrlService', 'FieldTypeService'];

  function DataManipulationService(DataTemplateService, DataUtilService, UrlService, FieldTypeService) {

    // Base path to generate field ids
    // TODO: fields will be saved as objects on server, they will get their id there
    // TODO: need to assign a temporary id, which will be replaced on server side
    var idBasePath = null;

    var service = {
      serviceId: "DataManipulationService"
    };

    service.init = function () {
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
      var field;
      if (FieldTypeService.isStaticField(fieldType)) {
        field = DataTemplateService.getStaticField(this.generateTempGUID());
      } else {
        field = DataTemplateService.getField(this.generateTempGUID());
        field.properties._value.type = valueType;
      }
      field.properties._ui.inputType = fieldType;
      //field.properties._value.type = valueType;
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
      if (typeof(field.minItems) == 'undefined' || field.maxItems == 1) {
        return false;
      }
      field.items = {
        'type'                : field.type,
        '@id'                 : field['@id'],
        '@type'               : field['@type'],
        '@context'            : field['@context'],
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
      delete field['@type'];
      delete field['@context'];
      delete field.properties;
      delete field.title;
      delete field.description;
      delete field.required;
      delete field.additionalProperties;

      return true;
    };

    service.uncardinalizeField = function (field) {
      if (typeof field.minItems == 'undefined' || (field.minItems == 1 && field.maxItems == 1)) {

        field.type = 'object';

        field.$schema = field.items.$schema;
        field['@id'] = field.items["@id"];
        field['@type'] = field.items["@type"];
        field['@context'] = field.items["@context"];
        field.properties = field.items.properties;
        field.required = field.items.required;
        field.additionalProperties = field.items.additionalProperties;

        delete field.items;
        delete field.maxItems;
        delete field.minItems;

        return true;
      } else {
        return false;
      }
    };

    service.isCardinalElement = function (element) {
      return element.type == 'array';
      // Alternative implementation from $rootScope
      //return typeof element.minItems != 'undefined';
    };

    // If Max Items is N, its value will be 0, then need to remove it from schema
    // if Min and Max are both 1, remove them
    service.removeUnnecessaryMaxItems = function (properties) {
      angular.forEach(properties, function (value, key) {
        if (!DataUtilService.isSpecialKey(key)) {
          if ((value.minItems == 1 && value.maxItems == 1)) {
            delete value.minItems;
            delete value.maxItems;
          }
          if (value.maxItems == 0) {
            delete value.maxItems;
          }
        }
      });
    };

    service.getDivId = function (node) {

      var elProperties = service.getFieldProperties(node);
      return elProperties._tmp.divId;

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
    };

    service.elementIsMultiInstance = function (element) {
      return element.hasOwnProperty('minItems') && !angular.isUndefined(element.minItems);
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
      return UrlService.schemaProperty(fieldName);
    };

    service.generateFieldContextProperties = function (fieldName) {
      var c = {};
      c.enum = new Array(service.getEnumOf(fieldName));
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
    };

    service.addKeyToObject = function (obj, key, value) {
      if (!obj || typeof(obj) != "object") {
        return;
      }

      key = service.getAcceptableKey(obj, key);
      obj[key] = value;
      return obj;
    };

    service.renameKeyOfObject = function (obj, currentKey, newKey) {
      if (!obj || !obj[currentKey]) {
        return;
      }

      newKey = service.getAcceptableKey(obj, newKey);
      Object.defineProperty(obj, newKey, Object.getOwnPropertyDescriptor(obj, currentKey));
      delete obj[currentKey];

      return obj;
    };

    service.idOf = function (fieldOrElement) {
      if (fieldOrElement) {
        if (fieldOrElement.items) {
          return fieldOrElement.items["@id"];
        } else {
          return fieldOrElement["@id"];
        }
      }
    };

    /**
     * create domIds for node and children
     * @param node
     */
    service.createDomIds = function (node) {

      service.addDomIdIfNotPresent(node, service.createDomId());

      angular.forEach(node.properties, function (value, key) {
        if (!DataUtilService.isSpecialKey(key)) {
          service.createDomIds(value);
        }
      });
    };

    /**
     * add a domId to the node if there is not one present
     * @param node
     */
    service.addDomIdIfNotPresent = function (node, id) {

      if (!node.hasOwnProperty("_tmp")) {
        node._tmp = {};
      }
      if (!node._tmp.hasOwnProperty("domId")) {
        node._tmp.domId = id;
      }

      return node._tmp.domId;

    };

    /**
     * get the domId of the node if there is one present
     * @param node
     */
    service.getDomId = function (node) {

      var domId = null;

      if (node.hasOwnProperty("_tmp")) {
        domId = node._tmp.domId;
      }

      return domId;


    };


    /**
     * make a unique string that we can use for dom ids
     */
    service.createDomId = function () {
      return 'id' + Math.random().toString().replace(/\./g, '');
    };

    return service;
  };

});
