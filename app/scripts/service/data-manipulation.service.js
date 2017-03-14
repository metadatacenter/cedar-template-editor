'use strict';

define([
  'angular',
  'json!config/data-manipulation-service.conf.json'
], function (angular, config) {
  angular.module('cedar.templateEditor.service.dataManipulationService', [])
      .service('DataManipulationService', DataManipulationService);

  DataManipulationService.$inject = ['DataTemplateService', 'DataUtilService', 'UrlService', 'FieldTypeService',
                                     '$rootScope', "ClientSideValidationService", "$translate"];

  function DataManipulationService(DataTemplateService, DataUtilService, UrlService, FieldTypeService, $rootScope,
                                   ClientSideValidationService, $translate) {

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
      var valueType = ["string", "null"];
      if ((fieldType == "checkbox") || (fieldType == "list") || (fieldType == "radio")) {
        valueType = ["array", "null"];
      }

      var field;
      if (FieldTypeService.isStaticField(fieldType)) {
        field = DataTemplateService.getStaticField(this.generateTempGUID());
      } else {
        field = DataTemplateService.getField(this.generateTempGUID());
        field.properties['@value'].type = valueType;
      }
      field._ui.inputType = fieldType;

      // Constrain the @type of @value according to the field type
      var valueAtType = null;
      if (fieldType == 'date' || fieldType == 'numeric') {
        valueAtType = { };
        valueAtType.type = 'string';
        if (fieldType == 'date') {
          valueAtType.enum = ['xsd:dateTime'];
          // Make @type required
          field.required.push('@type');
        }
        else if (fieldType == 'numeric') {
          valueAtType.enum = ['xsd:decimal'];
          // Make @type required
          field.required.push('@type');
        }
        delete field.properties['@type'];
        field.properties['@type'] = valueAtType;
      }

      return field;
    };

    // Function that generates a basic field definition
    service.isStaticField = function (field) {
      var schema = $rootScope.schemaOf(field);
      var type =  schema._ui.inputType;
      return FieldTypeService.isStaticField(type);
    };

    // Function that generates the @context for an instance, based on the schema @context definition
    service.generateInstanceContext = function (schemaContext) {
      var context = {};
      angular.forEach(schemaContext.properties, function (value, key) {
        if (value.type == "object") {
          context[key] = {};
          angular.forEach(schemaContext.properties[key].properties, function (value2, key2) {
            if (value2.enum) {
              context[key][key2] = value2.enum[0];
            }
          });
        }
        else {
          if (value.enum) {
            context[key] = value.enum[0];
          }
        }
      });
      return context;
    };

    // Function that generates the @type for a field in an instance, based on the schema @type definition
    service.generateInstanceType = function (schemaType, valueConstraints) {
      var enumeration = {};
      var format = null;
      var instanceType = null;
      if (angular.isUndefined(schemaType.oneOf)) {
        enumeration = schemaType.enum;
        format = schemaType.format;
      }
      else {
        enumeration = schemaType.oneOf[0].enum;
        format = schemaType.oneOf[0].format;
      }
      // If there is no type defined at the schema level
      if (angular.isUndefined(enumeration)) {
        if (format == 'uri') {
          // If the value has been constrained to ontology terms, @type must be set to @id
          if ($rootScope.hasValueConstraint(valueConstraints)) {
            instanceType = '@id';
          }
        }
      } else {
          // If only one type has been defined, it is returned
        if (enumeration.length == 1) {
          instanceType = enumeration[0];
          // If more than one types have been defined for the template/element/field, an array is returned
        } else {
          instanceType =  enumeration;
        }
      }
      return instanceType;
    };

    // If necessary, updates the field schema according to whether the field is controlled or not
    service.initializeSchema = function(field) {
      var fieldSchema = $rootScope.schemaOf(field);
      // If regular field
      if(!service.hasValueConstraint(field)) {
        if (fieldSchema.required[0] != "@value") {
          fieldSchema.required = [];
          fieldSchema.required.push("@value")
        }
        if (angular.isUndefined(fieldSchema.properties["@value"])) {
          var valueField = {};
          valueField.type = [];
          valueField.type.push("string");
          valueField.type.push("null");
          fieldSchema.properties["@value"] = valueField;
          delete fieldSchema.properties["@id"];
        }
      }
      // If controlled field
      else {
        if (fieldSchema.required[0] != "@id") {
          fieldSchema.required = [];
          fieldSchema.required.push("@id")
        }
        if (angular.isUndefined(fieldSchema.properties["@id"])) {
          var idField = {};
          idField.type = [];
          idField.type.push("string");
          idField.type.push("null");
          idField.format = "uri";
          fieldSchema.properties["@id"] = idField;
          delete fieldSchema.properties["@value"];
        }
      }
    }

    // This function initializes the value field to null (either @id or @value) if it has not been initialized yet.
    // It only applies to non-selection fields (i.e., text, paragraph, date, email, numeric, phone)
    service.initializeValue = function (field, model) {
      console.log('Model')
      console.log(model)
      if ($rootScope.isRuntime()) {
        var fieldValue = service.getFieldValue(field);
        if (!$rootScope.isArray(model)) {
          if (!model) {
            model = {};
          }
          if (model.hasOwnProperty(fieldValue)) {
            // If empty string
            if ((model[fieldValue] != null) && (model[fieldValue].length == 0)) {
              model[fieldValue] = null;
            }
          }
          else {
            model[fieldValue] = null;
          }
        }
        else {
          for (var i = 0; i < model.length; i++) {
            service.initializeValue(field, model[i]);
          }
        }
      }
    }

    // This function initializes the value @type field if it has not been initialized yet
    service.initializeValueType = function (field, model) {
      var fieldSchema = $rootScope.schemaOf(field);
      var properties = fieldSchema.properties;
      if (properties && !angular.isUndefined(properties['@type'])) {
        var fieldType = service.generateInstanceType(properties['@type'],
            fieldSchema._valueConstraints);
        if (fieldType) {
          // It is not an array
          if (field.type == 'object') {
            // If the @type has not been defined yet, define it
            if (angular.isUndefined(model['@type'])) {
              // No need to set the type if it is xsd:string. It is the type by default
              if (fieldType != "xsd:string") {
                model['@type'] = fieldType;
              }
            }
          }
          // It is an array
          else if (field.type == 'array') {
            for (var i = 0; i < model.length; i++) {
              // If there is an item in the array for which the @type has not been defined, define it
              if (angular.isUndefined(model[i]['@type'])) {
                // No need to set the type if it is xsd:string. It is the type by default
                if (fieldType != "xsd:string") {
                  model[i]['@type'] = fieldType;
                }
              }
            }
          }
        }
      }
    };

    // Returns the appropriate field to store the value (i.e., @id or @value,
    // depending on whether the field has been constrained to ontology terms or not
    service.getFieldValue = function(field) {
      var fieldValue = "@value";
      if (service.hasValueConstraint(field)) {
        fieldValue = "@id";
      }
      return fieldValue;
    }

    // resolve min or max as necessary and cardinalize or uncardinalize field
    service.setMinMax = function (field) {
      if (!field.hasOwnProperty('minItems') || typeof field.minItems == 'undefined' || field.minItems < 0) {
        delete field.minItems;
        delete field.maxItems;
      } else if (field.hasOwnProperty('maxItems') && field.maxItems < 0) {
        delete field.maxItems;
      }

      if (!service.uncardinalizeField(field)) {
        service.cardinalizeField(field);
      }
    };

    service.cardinalizeField = function (field) {
      if (typeof(field.minItems) != 'undefined' && !field.items) {

        field.items = {
          '$schema'             : field.$schema,
          'type'                : field.type,
          '@id'                 : field['@id'],
          '@type'               : field['@type'],
          '@context'            : field['@context'],
          'title'               : $translate.instant("GENERATEDVALUE.fieldTitle", {title: field._ui.title}),
          'description'         : $translate.instant("GENERATEDVALUE.fieldDescription",
              {title: field._ui.title, version:window.cedarVersion}),
          '_ui'                 : field._ui,
          '_valueConstraints'   : field._valueConstraints,
          'properties'          : field.properties,
          'required'            : field.required,
          'additionalProperties': field.additionalProperties,
          'pav:createdOn'       : field['pav:createdOn'],
          'pav:createdBy'       : field['pav:createdBy'],
          'pav:lastUpdatedOn'   : field['pav:lastUpdatedOn'],
          'oslc:modifiedBy'     : field['oslc:modifiedBy']
        };
        field.type = 'array';

        delete field.$schema;
        delete field['@id'];
        delete field['@type'];
        delete field['@context'];
        delete field.properties;
        delete field.title;
        delete field.description;
        delete field._ui;
        delete field._valueConstraints;
        delete field.required;
        delete field.additionalProperties;
        delete field['pav:createdOn'];
        delete field['pav:createdBy'];
        delete field['pav:lastUpdatedOn'];
        delete field['oslc:modifiedBy'];

        return true;
      } else {
        return false;
      }
    };

    service.uncardinalizeField = function (field) {
      if (typeof field.minItems == 'undefined' && field.items) {

        field.$schema = field.items.$schema;
        field.type = 'object';
        field['@id'] = field.items["@id"];
        field['@type'] = field.items["@type"];
        field['@context'] = field.items["@context"];
        field.title = field.items.title;
        field.description = field.items.description;
        field._ui = field.items._ui;
        field._valueConstraints = field.items._valueConstraints;
        field.properties = field.items.properties;
        field.required = field.items.required;
        field.additionalProperties = field.items.additionalProperties;
        field['pav:createdOn'] = field.items['pav:createdOn'];
        field['pav:createdBy'] = field.items['pav:createdBy'];
        field['pav:lastUpdatedOn'] = field.items['pav:lastUpdatedOn'];
        field['oslc:modifiedBy'] = field.items['oslc:modifiedBy'];

        delete field.items;
        delete field.maxItems;


        return true;
      } else {
        return false;
      }
    };

    service.isCardinalElement = function (element) {
      return element.type == 'array';
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

    // set a title and description in the object if there is none
    service.defaultTitleAndDescription = function (obj) {
      if (!obj.title || !obj.title.length) {
        obj.title = $translate.instant("GENERIC.Untitled");
      }
      if (!obj.description || !obj.description.length) {
        obj.description = $translate.instant("GENERIC.Description");
      }
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

    // Returns the field schema. If the field is defined as an array, this function will return field.items, because the schema is defined at that level.
    service.getFieldSchema = function (field) {
      if (field) {
        if (field.type == 'array' && field.items) {
          return field.items;
        } else {
          return field;
        }
      }
    };

    // is this a nested field?
    service.isNested = function (field) {
      var p = $rootScope.propertiesOf(field);
      p._tmp = p._tmp || {};
      return (p._tmp.nested || false);
    };

    // are we editing this field?
    service.isEditState = function (field) {
      var p = $rootScope.propertiesOf(field);
      p._tmp = p._tmp || {};
      return (p._tmp.state == "creating");
    };

    // set as selected
    service.setSelected = function (field) {
      var p = $rootScope.propertiesOf(field);
      p._tmp = p._tmp || {};
      p._tmp.state = "creating";

      $rootScope.selectedFieldOrElement = field;
    };

    // is this an array of fields or elements?
    service.isMultiple = function (obj) {
      return $rootScope.isArray(obj);
    };

    // is the field multiple cardinality?
    service.isMultipleCardinality = function (fieldOrElement) {
      return fieldOrElement.items;
    };

    service.cardinalityString = function (fieldOrElement) {
      var result  = '';
      if (service.isMultipleCardinality(fieldOrElement)) {
        result = '[' +  fieldOrElement.minItems + '...' +  (fieldOrElement.maxItems || 'N') + ']';
      }
      return result;
    };


    // what is the max cardinality?
    service.getMaxItems = function (fieldOrElement) {
      return fieldOrElement.maxItems;
    };

    // what is the min cardinality?
    service.getMinItems = function (fieldOrElement) {
      return fieldOrElement.minItems;
    };


    // is this field required?
    service.isRequired = function (fieldOrElement) {
      return $rootScope.schemaOf(fieldOrElement)._valueConstraints.requiredValue;
    };

    // is the previous field static?
    service.isDateRange = function (fieldOrElement) {
      return DataManipulationService.getFieldSchema(fieldOrElement)._ui.dateType == "date-range";
    };



    service.hasNext = function (fieldOrElement) {
      return true;
    };

    // set this field instance active
    service.setActive = function (field, index, path, value) {
      if (value) {
        $rootScope.activeLocator = service.getLocator(field, index, path);
      } else {
        $rootScope.activeLocator = null;
      }

    };

    // is this field active
    service.isActive = function (locator) {
      return ($rootScope.activeLocator === locator);
    };

    // is some other field active
    service.isInactive = function (locator) {
      return ($rootScope.activeLocator && $rootScope.activeLocator != locator);
    };

    // add an option to this field
    service.addOption = function (field) {
      var emptyOption = {
        "label": ""
      };
      field._valueConstraints.literals.push(emptyOption);
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
        return service.getFieldSchema(fieldOrElement)['@id'];
      }
    };

    /**
     * Add path for every field in the template
     */
    service.addPathInfo = function (template, path) {
      var properties = $rootScope.propertiesOf(template);
      angular.forEach(properties, function (value, name) {
        if (!DataUtilService.isSpecialKey(name)) {
          // We can tell we've reached an element level by its '@type' property
          if ($rootScope.schemaOf(value)['@type'] == 'https://schema.metadatacenter.org/core/TemplateElement') {
            //console.log(name);
            if (path == null) {
              service.addPathInfo(value, name);
            }
            else {
              service.addPathInfo(value, path + '.' + name);
            }
          }
          // If it is a template field
          else {
            // If it is not a static field
            if (!value._ui || !value._ui.inputType || !FieldTypeService.isStaticField(value._ui.inputType)) {

              var fieldPath = path;
              if (fieldPath == null || fieldPath.length == 0) {
                fieldPath = name;
              }
              else {
                fieldPath = fieldPath + '.' + name;
              }
              properties[name]['_path'] = fieldPath;
            }
          }
        }
      });
    };


    /**
     * strip tmps for node and children
     * @param node
     */
    service.stripTmps = function (node) {
      service.stripTmpIfPresent(node);

      if (node.type == 'array') {
        node = node.items;
      }

      angular.forEach(node.properties, function (value, key) {
        if (!DataUtilService.isSpecialKey(key)) {
          service.stripTmps(value);
        }
      });
    };

    /**
     * remove the _tmp field from the node and its properties
     * @param node
     */
    service.stripTmpIfPresent = function (node) {

      if (node.hasOwnProperty("_tmp")) {
        delete node._tmp;
      }

      var p = $rootScope.propertiesOf(node);
      if (p && p.hasOwnProperty("_tmp")) {
        delete p._tmp;
      }

    };


    service.createOrder = function (node, order) {

      if (node.hasOwnProperty("@id")) {
        order.push(node['@id']);
      }

      angular.forEach(node.properties, function (value, key) {
        if (!DataUtilService.isSpecialKey(key)) {
          service.createOrder(value, order);
        }
      });
      return order;
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


    // get the id of the node
    service.getNodeId = function (node) {
      var nodeId = node['@id'] || node.items['@id'];
      return nodeId.substring(nodeId.lastIndexOf('/') + 1);
    };

    service.getId = function (fieldOrElement) {
      return $rootScope.schemaOf(fieldOrElement)['@id'];
    };

    // what is the icon for this field?
    service.getIconClass = function (fieldOrElement) {
      var result = '';
      var fieldType = '';
      var schema = $rootScope.schemaOf(fieldOrElement);
      if (schema._ui.inputType) {
        fieldType = schema._ui.inputType;
        result = FieldTypeService.getFieldIconClass(fieldType);
      }
      return result;
    };

    service.getType = function (fieldOrElement) {
      var schema = $rootScope.schemaOf(fieldOrElement);
      return schema['@type'];
    };

    // Retrieve appropriate input type
    service.getInputType = function (fieldOrElement) {
      //return $rootScope.schemaOf($scope.field)._ui.inputType;
      var inputType = 'element';
      var schema = $rootScope.schemaOf(fieldOrElement);

      if (schema._ui.inputType) {
        inputType = schema._ui.inputType;
      }
      return inputType;
    };

    // is this a checkbox, radio or list question?
    service.isMultiAnswer = function (fieldOrElement) {
      var inputType = service.getInputType(fieldOrElement);
      return ((inputType == 'checkbox') || (inputType == 'radio') || (inputType == 'list'));
    };

    // is this a youTube field?
    service.isYouTube = function (field) {
      return field && $rootScope.schemaOf(field)._ui.inputType === 'youtube';
    };

    // is this richText?
    service.isRichText = function (field) {
      return field && $rootScope.schemaOf(field)._ui.inputType === 'richtext';
    };

    // is this an image?
    service.isImage = function (field) {
      return field && $rootScope.schemaOf(field)._ui.inputType === 'image';
    };

    service.getContent = function (fieldOrElement) {
      var schema = $rootScope.schemaOf(fieldOrElement);
      return schema.properties['_content'];
    };

    service.getTitle = function (fieldOrElement) {
      return service.getFieldSchema(fieldOrElement)._ui.title;
    };

    service.getDescription = function (fieldOrElement) {
      return service.getFieldSchema(fieldOrElement)._ui.description;
    };

    // does this field have a value constraint?
    service.hasValueConstraint = function (fieldOrElement) {
      return $rootScope.hasValueConstraint($rootScope.schemaOf(fieldOrElement)._valueConstraints);
    };

    // get the value constraint literal values
    service.getLiterals = function (fieldOrElement) {
      return $rootScope.schemaOf(fieldOrElement)._valueConstraints.literals;
    };

    service.isMultipleChoice = function (fieldOrElement) {
      return $rootScope.schemaOf(fieldOrElement)._valueConstraints.multipleChoice;
    };

    service.nextSibling = function (field, parent) {
      console.log('nextSibling');

      if (field && parent) {

        var id = service.getFieldSchema(field)["@id"];
        var props = service.getFieldSchema(parent).properties;
        var order = service.getFieldSchema(parent)._ui.order;
        var selectedKey;

        console.log('id' + id);


        angular.forEach(props, function (value, key) {
          var valueId = service.getFieldSchema(value)["@id"];
          if (valueId) {
            if (service.getFieldSchema(value)["@id"] == id) {
              selectedKey = key;
            }
          }
        });

        console.log('selectedKey ' + selectedKey);

        if (selectedKey) {
          var idx = order.indexOf(selectedKey);
          idx += 1;
          var found = false;
          while (idx < order.length && !found) {
            var nextKey = order[idx];
            var next = props[nextKey];
            found = !service.isStaticField(next);
            idx += 1;
          }
          if (found) {
            console.log('found');
            return next;
          } else {
            console.log('not found');

          }
        }
      }
    };

    // get the locator for the node's dom object
    service.getLocator = function (node, index, path) {
      return 'dom-' + service.getNodeId(node) + '-' + (path || 0).toString() + '-' + (index || 0).toString();
    };

    // look to see if this node has been identified by angular as an invalid pattern
    service.isValidPattern = function (node, index, path) {
      var locator = service.getLocator(node, index, path) + '.ng-invalid';
      var target = jQuery('#' + locator);
      return (target.length == 0);
    };

    // get the value of the dom object for this node
    service.getDomValue = function (node, index, path) {
      var result;
      var locator = service.getLocator(node, index, path);
      var target = jQuery('#' + locator);
      if (target.length > 0) {
        result = target[0].value;
      }
      return result;
    };


    /**
     * add a domId to the node if there is not one present
     * @param node
     */
    service.defaultTitle = function (node) {

      node._ui.title = $translate.instant("GENERIC.Untitled");

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

    service.newGetDomId = function (node) {


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


    /**
     * get the controlled terms list for field types
     * @returns {Array}
     */
    service.getFieldControlledTerms = function (node) {

      var properties = service.getFieldProperties(node);
      return properties['@type'].oneOf[1].items['enum'];

    };

    /**
     * parse the ontology code from the source
     * @param itemData
     * @returns {*}
     */
    service.parseOntologyCode = function (itemData) {
      var re = new RegExp('\((.+)\)');
      var m;
      var result;
      if ((m = re.exec(itemData)) !== null) {
        if (m.index === re.lastIndex) {
          re.lastIndex++;
        }
        result = m[1];
      }
      return result;
    };

    /**
     * parse the class from the selfUrl
     * @param itemData
     * @returns {*}
     */
    service.parseClassLabel = function (itemData) {
      var re = new RegExp('\/classes\/(.+)');
      var m;
      var result;
      if ((m = re.exec(itemData)) !== null) {
        if (m.index === re.lastIndex) {
          re.lastIndex++;
        }
        result = m[1];
      }
      // Decode the class URI
      result = decodeURIComponent(result);
      return result;
    };


    /**
     * parse the ontology code from the selfUrl
     * @param itemData
     * @returns {*}
     */
    service.parseOntologyName = function (itemData) {
      var re = new RegExp('\/ontologies\/(.+)\/classes\/');
      var m;
      var result;
      if ((m = re.exec(itemData)) !== null) {
        if (m.index === re.lastIndex) {
          re.lastIndex++;
        }
        result = m[1];
      }
      return result;
    };

    /**
     * delete both the oneOf copies of the class id for the question type
     * @param itemDataId
     */
    service.deleteFieldControlledTerm = function (itemDataId, node) {
      var properties = service.getFieldProperties(node);
      var idx = properties["@type"].oneOf[0].enum.indexOf(itemDataId);

      if (idx >= 0) {
        properties["@type"].oneOf[0].enum.splice(idx, 1);
        if (properties["@type"].oneOf[0].enum.length == 0) {
          delete properties["@type"].oneOf[0].enum;
        }
      }

      idx = properties['@type'].oneOf[1].items.enum.indexOf(itemDataId);

      if (idx >= 0) {
        properties['@type'].oneOf[1].items.enum.splice(idx, 1);
        if (properties["@type"].oneOf[1].items.enum.length == 0) {
          delete properties["@type"].oneOf[1].items.enum;
        }
      }
      service.initializeSchema(node);
    };

    /**
     * delete the branch in valueConstraints
     * @param branch
     */
    service.deleteFieldAddedBranch = function (branch, node) {

      var valueConstraints = $rootScope.schemaOf(node)._valueConstraints;
      for (var i = 0, len = valueConstraints.branches.length; i < len; i += 1) {
        if (valueConstraints.branches[i]['uri'] == branch['uri']) {
          valueConstraints.branches.splice(i, 1);
          break;
        }
      }
      service.initializeSchema(node);
    };

    /**
     * delete the ontologyCLass in valueConstraints
     * @param ontologyClass
     */
    service.deleteFieldAddedClass = function (ontologyClass, node) {

      var valueConstraints = $rootScope.schemaOf(node)._valueConstraints;
      for (var i = 0, len = valueConstraints.classes.length; i < len; i += 1) {
        if (valueConstraints.classes[i] == ontologyClass) {
          valueConstraints.classes.splice(i, 1);
          break;
        }
      }
      service.initializeSchema(node);
    };


    /**
     * delete the ontology in valueConstraints
     * @param ontology
     */
    service.deleteFieldAddedOntology = function (ontology, node) {

      var valueConstraints = $rootScope.schemaOf(node)._valueConstraints;
      for (var i = 0, len = valueConstraints.ontologies.length; i < len; i += 1) {
        if (valueConstraints.ontologies[i]['uri'] == ontology['uri']) {
          valueConstraints.ontologies.splice(i, 1);
          break;
        }
      }
      service.initializeSchema(node);
    };

    /**
     * delete the valueSet in valueConstraints
     * @param valueSet
     */
    service.deleteFieldAddedValueSet = function (valueSet, node) {

      var valueConstraints = $rootScope.schemaOf(node)._valueConstraints;
      for (var i = 0, len = valueConstraints.valueSets.length; i < len; i += 1) {
        if (valueConstraints.valueSets[i]['uri'] == valueSet['uri']) {
          valueConstraints.valueSets.splice(i, 1);
          break;
        }
      }
      service.initializeSchema(node);
    };

    // deselect any current selected items, then select this one
    service.canSelect = function (field) {
      var result = true;
      if (!service.isEditState(field)) {
        if ($rootScope.selectedFieldOrElement && service.isEditState($rootScope.selectedFieldOrElement)) {
          result = service.canDeselect($rootScope.selectedFieldOrElement);
        }
        if (result) service.setSelected(field);
      }
      return result;
    };

    // When user clicks Save button, we will switch field or element from creating state to completed state
    service.canDeselect = function (field, renameChildKey) {

      if (!field) {
        return;
      }

      service.setMinMax(field);
      service.setDefaults(field);

      var errorMessages = jQuery.merge(service.checkFieldConditions(field),
          ClientSideValidationService.checkFieldCardinalityOptions(field));

      // don't continue with errors
      if (errorMessages.length == 0) {
        delete $rootScope.propertiesOf(field)._tmp;

        if (renameChildKey) {
          var key = service.getFieldName(service.getFieldSchema(field)._ui.title);
          renameChildKey(field, key);
        }

        var event = service.isElement(field) ? "invalidElementState" : "invalidFieldState";
        $rootScope.$emit(event,
            ["remove", $rootScope.schemaOf(field)._ui.title, field["@id"]]);
      }

      $rootScope.$broadcast("deselect", [field, errorMessages]);

      return errorMessages.length == 0;
    };

    var MIN_OPTIONS = 2;
    service.setDefaults = function (field) {
      var schema = $rootScope.schemaOf(field);

      // default title
      if (!schema._ui.title || !schema._ui.title.length) {
        schema._ui.title = $translate.instant("GENERIC.Untitled");
      }

      // default description
      //if (!schema._ui.description || !schema._ui.description.length) {
      //  schema._ui.description = $translate.instant("GENERIC.Description");
      //}

      // if this is radio, checkbox or list,  add at least two options and set default values
      if (schema._ui.inputType == "radio" || schema._ui.inputType == "checkbox" || schema._ui.inputType == "list") {

        // make sure we have the minimum number of options
        while (schema._valueConstraints.literals.length < MIN_OPTIONS) {
          var emptyOption = {
            "label": name || ""
          };
          schema._valueConstraints.literals.push(emptyOption);
        }

        // and they all have text fields filled in
        for (var i = 0; i < schema._valueConstraints.literals.length; i++) {
          if (schema._valueConstraints.literals[i].label.length == 0) {
            schema._valueConstraints.literals[i].label = $translate.instant("VALIDATION.noNameField") + "-" + i;
          }
        }
      }
    };

    // look for errors in field or element
    service.checkFieldConditions = function (field) {
      var schema = $rootScope.schemaOf(field);

      var unmetConditions = [],
          extraConditionInputs = ['checkbox', 'radio', 'list'];

      // Field title is required, if it's empty create error message
      if (!schema._ui.title) {
        unmetConditions.push('"Enter Title" input cannot be left empty.');
      }

      // If field is within multiple choice field types
      if (extraConditionInputs.indexOf(schema._ui.inputType) !== -1) {
        var optionMessage = '"Enter Option" input cannot be left empty.';
        angular.forEach(schema._valueConstraints.literals, function (value, index) {
          // If any 'option' title text is left empty, create error message
          if (!value.label.length && unmetConditions.indexOf(optionMessage) == -1) {
            unmetConditions.push(optionMessage);
          }
        });
      }
      // If field type is 'radio' or 'pick from a list' there must be more than one option created
      if ((schema._ui.inputType == 'radio' || schema._ui.inputType == 'list') && schema._valueConstraints.literals && (schema._valueConstraints.literals.length <= 1)) {
        unmetConditions.push('Multiple Choice fields must have at least two possible options');
      }
      // Return array of error messages
      return unmetConditions;
    };

    service.isElement = function (value) {
      if (value && value['@type'] && value['@type'] == "https://schema.metadatacenter.org/core/TemplateElement") {
        return true;
      }
      else {
        return false;
      }
    };

    return service;
  };

});
