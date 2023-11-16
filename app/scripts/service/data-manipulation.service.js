'use strict';

define([
      'angular',
      'json!config/data-manipulation-service.conf.json'
    ], function (angular, config) {
      angular.module('cedar.templateEditor.service.dataManipulationService', [])
          .service('DataManipulationService', DataManipulationService);

      DataManipulationService.$inject = ['DataTemplateService', 'DataUtilService', 'UrlService', 'FieldTypeService',
                                         'schemaService', '$rootScope', "$translate", "$sce", 'CONST'];

      function DataManipulationService(DataTemplateService, DataUtilService, UrlService, FieldTypeService, schemaService,
                                       $rootScope,
                                       $translate, $sce, CONST) {

        // Base path to generate field ids
        // TODO: fields will be saved as objects on server, they will get their id there
        // TODO: need to assign a temporary id, which will be replaced on server side
        let idBasePath = null;


        const service = {
          serviceId: "DataManipulationService"
        };

        service.init = function () {
          idBasePath = config.idBasePath;
        };

        //
        // constants
        //

        const cedarFieldType = 'https://schema.metadatacenter.org/core/TemplateField';

        //
        // basics
        //

        service.cedarFieldType = function () {
          return cedarFieldType;
        };

        service.getFieldProperties = function (field) {
          if (field) {
            if (field.type === 'array' && field.items && field.items.properties) {
              return field.items.properties;
            } else {
              return field.properties;
            }
          }
        };

        // Returns the field schema. If the field is defined as an array, this function will return field.items, because the schema is defined at that level.
        service.getFieldSchema = function (field) {
          if (field) {
            if (field.type === 'array' && field.items) {
              return field.items;
            } else {
              return field;
            }
          }
        };

        // Returns the field schema. If the field is defined as an array, this function will return field.items, because the schema is defined at that level.
        service.schemaOf = function (node) {
          return service.getFieldSchema(node);
        };


        // returns the properties of a template, element, or field schema
        service.propertiesOf = function (node) {
          if (node) {
            return service.schemaOf(node).properties;
          }
        };


        // does the node have this property in its property array?
        service.hasProperty = function (node, key) {
          return node && service.propertiesOf(node).hasOwnProperty(key)
        };

        service.getPropertyNode = function (node, key) {
          if (service.hasProperty(node, key)) {
            return service.propertiesOf(node)[key];
          }
        };

        service.getType = function (node) {
          var schema = service.schemaOf(node);
          if (schema) {
            return schema['@type']
          }
        };

        service.getKeyFromId = function (node) {
          if (node && service.getId(node)) {
            var id = service.getId(node);
            return id.substring(id.lastIndexOf("/") + 1);
          }
        };

        // is a draft if status is draft or has no status
        service.isDraft = function (node) {
          var schema = service.schemaOf(node);
          var hasBiboStatus = schema.hasOwnProperty('bibo:status');
          return hasBiboStatus && schema['bibo:status'] === 'bibo:draft';
        };

        // is published if has status and it is published
        service.isPublished = function (node) {
          var schema = service.schemaOf(node);
          var hasBiboStatus = schema.hasOwnProperty('bibo:status');
          return hasBiboStatus && schema['bibo:status'] === 'bibo:published';
        };

        service.getId = function (node) {
          return service.schemaOf(node)['@id'];
        };

        service.setId = function (node, id) {
          return service.schemaOf(node)['@id'] = id;
        };


        service.idOf = function (node) {
          return node && service.schemaOf(node)['@id'];
        };

        // is this a required field or element?
        service.isRequired = function (node) {

          if (service.schemaOf(node)._valueConstraints) {
            return service.schemaOf(node)._valueConstraints.requiredValue;
          }
        };

        service.setRequired = function (node, value) {
          service.schemaOf(node)._valueConstraints.requiredValue = value;
        };

        service.getContent = function (node) {
          return service.schemaOf(node)._ui._content;
        };

        service.getSize = function (node) {
          return service.schemaOf(node)._ui._size;
        };

        service.hasVersion = function (node) {
          return service.schemaOf(node).hasOwnProperty('pav:version');
        };

        service.getVersion = function (node) {
          if (service.hasVersion(node)) {
            return service.schemaOf(node)['pav:version'];
          }
        };

        // node title and description
        service.getPreferredLabel = function (node) {
          if (service.schemaOf(node)) {
            return service.schemaOf(node)[CONST.model.PREFLABEL];
          }
        };

        service.hasPreferredLabel = function (node) {
          return service.schemaOf(node).hasOwnProperty(CONST.model.PREFLABEL) && service.schemaOf(
              node)[CONST.model.PREFLABEL].length > 0;
        };

        service.setPreferredLabel = function (node, value) {
          var schema = service.schemaOf(node);
          if (schema) {
            service.schemaOf(node)[CONST.model.PREFLABEL] = value;
          }
        };

        service.removePreferredLabel = function (node) {
          var schema = service.schemaOf(node);
          if (schema) {
            delete schema[CONST.model.PREFLABEL];
          }
        };

        service.titleLocation = function () {
          return CONST.model.NAME;
        };

        // node title and description
        service.getTitle = function (node) {
          if (service.schemaOf(node)) {
            return service.schemaOf(node)[CONST.model.NAME];
          }
        };

        service.hasTitle = function (node) {
          return service.schemaOf(node).hasOwnProperty(CONST.model.NAME) && service.schemaOf(
              node)[CONST.model.NAME].length > 0;
        };

        service.setTitle = function (node, value) {
          var schema = service.schemaOf(node);
          if (schema) {
            service.schemaOf(node)[CONST.model.NAME] = value;
          }
        };

        service.defaultTitle = function (node) {
          if (!service.hasTitle(node)) {
            service.setTitle(node, $translate.instant("GENERIC.Untitled"));
          }
        };

        // set a title and description in the object if there is none
        service.defaultTitleAndDescription = function (obj) {
          if (obj) {
            if (!obj.title || !obj.title.length) {
              obj.title = $translate.instant("GENERIC.Untitled");
            }
            if (!obj.description || !obj.description.length) {
              obj.description = $translate.instant("GENERIC.Description");
            }
          }
        };

        service.descriptionLocation = function () {
          return CONST.model.DESCRIPTION;
        };

        service.getDescription = function (node) {
          if (service.schemaOf(node)) {
            return service.schemaOf(node)[CONST.model.DESCRIPTION];
          }
        };

        service.hasDescription = function (node) {
          return service.schemaOf(node).hasOwnProperty(CONST.model.DESCRIPTION) && service.schemaOf(
              node)[CONST.model.DESCRIPTION].length > 0;
        };

        service.setDescription = function (node, value) {
          let schema = service.schemaOf(node);
          if (schema) {
            if (value == null) {
              value = ""; // Our model does not allow a 'null' description
            }
            service.schemaOf(node)[CONST.model.DESCRIPTION] = value;
          }
        };

        service.getIdentifier = function (node) {
          if (service.schemaOf(node)) {
            return service.schemaOf(node)[CONST.model.IDENTIFIER];
          }
        };

        service.setIdentifier = function (node, value) {
          if (service.schemaOf(node)) {
            service.schemaOf(node)[CONST.model.IDENTIFIER] = value;
          }
        };

        service.removeIdentifier = function (node) {
          if (service.schemaOf(node)) {
            delete service.schemaOf(node)[CONST.model.IDENTIFIER];
          }
        };

        // min/max string length
        service.hasMinLength = function (node) {
          return service.getValueConstraint(node).hasOwnProperty('minLength');
        };

        service.getMinLength = function (node) {
          return service.hasMinLength(node) && service.getValueConstraint(node).minLength;
        };

        service.hasMaxLength = function (node) {
          return service.getValueConstraint(node).hasOwnProperty('maxLength');
        };

        service.getMaxLength = function (node) {
          return service.hasMaxLength(node) && service.getValueConstraint(node).maxLength;
        };

        service.hasRegex = function (node) {
          return service.getValueConstraint(node).hasOwnProperty('regex');
        };

        service.getRegex = function (node) {
          return service.hasRegex(node) && service.getValueConstraint(node).regex;
        };

        // min/max numeric value
        service.hasMinValue = function (node) {
          return service.getValueConstraint(node).hasOwnProperty('minValue');
        };

        service.getMinValue = function (node) {
          return service.hasMinValue(node) && service.getValueConstraint(node).minValue;
        };

        service.hasMaxValue = function (node) {
          return service.getValueConstraint(node).hasOwnProperty('maxValue')
        };

        service.getMaxValue = function (node) {
          return service.hasMaxValue(node) && service.getValueConstraint(node).maxValue;
        };

        // decimal places
        service.hasDecimalPlace = function (node) {
          return service.getValueConstraint(node).hasOwnProperty('decimalPlace');
        };

        service.getDecimalPlace = function (node) {
          return service.hasDecimalPlace(node) && service.getValueConstraint(node).decimalPlace;
        };

        // number type
        service.hasNumberType = function (node) {
          return service.getValueConstraint(node).hasOwnProperty('numberType');
        };

        service.getNumberType = function (node) {
          return service.hasNumberType(node) && service.getValueConstraint(node).numberType;
        };

        // dateTime type
        service.hasNumberType = function (node) {
          if (service.getValueConstraint(node) !== undefined) {
            return service.getValueConstraint(node).hasOwnProperty('numberType');
          } else {
            return false;
          }
        };

        service.getNumberType = function (node) {
          return service.hasNumberType(node) && service.getValueConstraint(node).numberType;
        };

        // unit of measure
        service.hasUnitOfMeasure = function (node) {
          return service.getValueConstraint(node).hasOwnProperty('unitOfMeasure');
        };

        service.getUnitOfMeasure = function (node) {
          return service.hasUnitOfMeasure(node) && service.getValueConstraint(node).unitOfMeasure;
        };

        // schema title and description
        service.setSchemaTitle = function (node, value) {
          service.schemaOf(node).title = value;
        };

        service.setSchemaDescription = function (node, value) {
          service.schemaOf(node).description = value;
        };

        service.defaultSchemaTitleAndDescription = function (node) {
          if (!node.title || !node.title.length) {
            node.title = $translate.instant("GENERIC.Untitled");
          }
          if (!node.description || !node.description.length) {
            node.description = $translate.instant("GENERIC.Description");
          }
        };

        service.setFieldSchemaTitleAndDescription = function (field, fieldTitle) {
          service.setSchemaTitle(field,
              $translate.instant("GENERATEDVALUE.fieldTitle", {title: fieldTitle, version: window.cedarVersion}));
          service.setSchemaDescription(field,
              $translate.instant("GENERATEDVALUE.fieldDescription", {title: fieldTitle, version: window.cedarVersion}));
        };

        //
        // inputType
        //

        // what is the field inputType?
        service.getInputType = function (node) {
          var result = null;
          var schema = service.schemaOf(node);
          if (schema && schema._ui && schema._ui.inputType) {
            result = schema._ui.inputType;
          }
          return result;
        };

        service.setInputType = function (node, value) {
          service.schemaOf(node)._ui.inputType = value;
        };

        // Function that generates a basic field definition
        service.isStaticField = function (node) {
          if (node) {
            return FieldTypeService.isStaticField(service.getInputType(node));
          }
        };

        // is this a numeric field?
        service.isNumericField = function (node) {
          return (service.getInputType(node) === 'numeric');
        };

        // is this a date field?
        service.isDateField = function (node) {
          return service.getInputType(node) === 'temporal' && service.schemaOf(node)._valueConstraints.temporalType === 'xsd:date';
        };

        service.isDateTimeField = function (node) {
          return service.getInputType(node) === 'temporal' && service.schemaOf(node)._valueConstraints.temporalType === 'xsd:dateTime';
        };

        service.isTimeField = function (node) {
          return service.getInputType(node) === 'temporal' && service.schemaOf(node)._valueConstraints.temporalType === 'xsd:time';
        };

        // is this a date range?
        service.isDateRange = function (node) {
          return service.isDateField(node) && service.schemaOf(node)._ui.dateType === "date-range";
        };

        service.isAttributeValueType = function (node) {
          return (service.getInputType(node) === 'attribute-value');
        };

        service.isTextFieldType = function (node) {
          return (service.getInputType(node) === 'textfield');
        };

        service.isDateType = function (node) {
          return (service.getInputType(node) === 'temporal');
        };

        service.isLinkType = function (node) {
          return (service.getInputType(node) === 'link');
        };

        service.isCheckboxType = function (node) {
          return (service.getInputType(node) === 'checkbox');
        };

        service.isRadioType = function (node) {
          return (service.getInputType(node) === 'radio');
        };

        service.isListType = function (node) {
          return (service.getInputType(node) === 'list');
        };

        service.isListMultiAnswerType = function (node) {
          return (service.getInputType(node) === 'list') && (service.schemaOf(node)._valueConstraints.multipleChoice);
        };

        // is this a checkbox, radio or list question?
        service.isMultiAnswer = function (node) {
          var inputType = service.getInputType(node);
          return service.isCheckboxListRadioType(inputType);
        };

        service.isCheckboxListRadioType = function (inputType) {
          return ((inputType === 'checkbox') || (inputType === 'radio') || (inputType === 'list'));
        };

        service.isCheckboxListRadio = function (node) {
          var inputType = service.getInputType(node);
          return ((inputType === 'checkbox') || (inputType === 'radio') || (inputType === 'list'));
        };


        // is this a multiple choice list?
        // service.isMultipleChoice = function (node) {
        //   if (service.schemaOf(node)._valueConstraints) {
        //     return service.schemaOf(node)._valueConstraints.multipleChoice;
        //   }
        // };

        // is this a multiple choice list?
        service.isMultipleChoice = function (node) {
          if (service.schemaOf(node)._valueConstraints) {
            return service.schemaOf(node)._valueConstraints.multipleChoice;
          } else if (service.schemaOf(node).items && service.schemaOf(node)._valueConstraints) {
            return service.schemaOf(node).items._valueConstraints.multipleChoice;
          }
        };

        // is this a checkbox, or a multiple choice list field?
        service.isMultipleChoiceField = function (node) {
          return ((service.getInputType(node) === 'checkbox') || (service.isMultipleChoice(node)));
        };

        // is this a radio, or a sigle-choice ?
        service.isSingleChoiceListField = function (node) {
          var inputType = service.getInputType(node);
          return ((inputType === 'radio') || ((inputType === 'list') && !service.isMultipleChoice(node)));
        };

        // is this a youTube field?
        service.isYouTube = function (node) {
          return (service.getInputType(node) === 'youtube');
        };

        // is this richText?
        service.isRichText = function (node) {
          return (service.getInputType(node) === 'richtext');
        };

        // Used in richtext.html
        service.getUnescapedContent = function (node) {
          return $sce.trustAsHtml(service.getContent(node));
        };

        // is this an image?
        service.isImage = function (node) {
          return (service.getInputType(node) === 'image');
        };

        // is this a section break?
        service.isSectionBreak = function (node) {
          return (service.getInputType(node) === 'section-break');
        };

        // is this a page break?
        service.isPageBreak = function (node) {
          return (service.getInputType(node) === 'page-break');
        };

        //
        //  cardinality
        //

        service.getMaxItems = function (node) {
          return node.maxItems;
        };

        service.getMinItems = function (node) {
          return node.minItems;
        };

        service.defaultMinMax = function (node) {
          node.minItems = 1;
          node.maxItems = 0;
        };

        service.clearMinMax = function (node) {
          delete node.minItems;
          delete node.maxItems;
        };

        service.isCardinalElement = function (node) {
          return node.type === 'array';
        };

        service.elementIsMultiInstance = function (element) {
          return element.hasOwnProperty('minItems') && !angular.isUndefined(element.minItems);
        };

        // is the field multiple cardinality?
        service.isMultipleCardinality = function (node) {
          return node.items;
        };

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
          var hasVersion = service.hasVersion(field);
          if (typeof (field.minItems) != 'undefined' && !field.items) {

            field.items = {
              '$schema'             : field.$schema,
              'type'                : field.type,
              '@id'                 : field['@id'],
              '@type'               : field['@type'],
              '@context'            : field['@context'],
              'title'               : $translate.instant("GENERATEDVALUE.fieldTitle", {title: field['schema:name']}),
              'description'         : $translate.instant("GENERATEDVALUE.fieldDescription",
                  {title: field['schema:name'], version: window.cedarVersion}),
              '_ui'                 : field._ui,
              '_valueConstraints'   : field._valueConstraints,
              'properties'          : field.properties,
              'required'            : field.required,
              'additionalProperties': field.additionalProperties,
              'pav:createdOn'       : field['pav:createdOn'],
              'pav:createdBy'       : field['pav:createdBy'],
              'pav:lastUpdatedOn'   : field['pav:lastUpdatedOn'],
              'oslc:modifiedBy'     : field['oslc:modifiedBy'],
              'schema:schemaVersion': field['schema:schemaVersion'],
              'schema:name'         : field[CONST.model.NAME],
              'schema:description'  : field[CONST.model.DESCRIPTION],
            };
            if (hasVersion) {
              field.items['pav:version'] = field['pav:version'];
              field.items['bibo:status'] = field['bibo:status'];
            }
            if (field[CONST.model.PREFLABEL]) {
              field.items[CONST.model.PREFLABEL] = field[CONST.model.PREFLABEL];
            }

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
            delete field['schema:schemaVersion'];
            delete field[CONST.model.NAME];
            delete field[CONST.model.DESCRIPTION];
            delete field[CONST.model.PREFLABEL];
            delete field['pav:version'];
            delete field['bibo:status'];

            return true;
          } else {
            return false;
          }
        };

        service.uncardinalizeField = function (field) {
          var hasVersion = service.hasVersion(field);

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
            field['schema:schemaVersion'] = field.items['schema:schemaVersion'];
            field['schema:name'] = field.items['schema:name'];
            field['schema:description'] = field.items['schema:description'];
            if (hasVersion) {
              field['pav:version'] = field.items['pav:version'];
              field['bibo:status'] = field.items['bibo:status'];
            }
            if (field.items[CONST.model.PREFLABEL]) {
              field[CONST.model.PREFLABEL] = field.items[CONST.model.PREFLABEL];
            }

            delete field.items;
            delete field.maxItems;

            return true;
          } else {
            return false;
          }
        };

        // If Max Items is N, its value will be 0, then need to remove it from schema
        // if Min and Max are both 1, remove them
        service.removeUnnecessaryMaxItems = function (properties) {
          angular.forEach(properties, function (value, key) {
            if (!DataUtilService.isSpecialKey(key)) {
              if ((value.minItems === 1 && value.maxItems === 1)) {
                delete value.minItems;
                delete value.maxItems;
              }
              if (value.maxItems === 0) {
                delete value.maxItems;
              }
            }
          });
        };

        // sets the multiple choice option to true or false
        service.setMultipleChoice = function (node, newMultipleChoiceValue) {
          if (newMultipleChoiceValue === true) { // set multipleChoice to true
            if (node.items) {
              node.items._valueConstraints.multipleChoice = true;
            } else {
              node.minItems = 1;
              node._valueConstraints.multipleChoice = true;
              service.cardinalizeField(node);
            }
          } else { // set multipleChoice to false
            if (node.items) {
              delete node.minItems;
              node.items._valueConstraints.multipleChoice = false;
              service.uncardinalizeField(node);
            } else {
              node._valueConstraints.multipleChoice = false;
            }
          }
        };

        service.getSortOrder = function (node) {
          return service.schemaOf(node)._valueConstraints.actions;
        };

        service.clearSortOrder = function (node) {
          delete service.schemaOf(node)._valueConstraints.actions;
        };

        service.setSortOrder = function (node, actions) {
          if (node && actions) {
            service.schemaOf(node)._valueConstraints.actions = actions;
          }
        };

        service.getActions = function (node) {
          var result = [];
          if (node) {
            if (service.schemaOf(node)._valueConstraints.hasOwnProperty('actions')) {
              result = service.schemaOf(node)._valueConstraints.actions;
            }
          }
          return result;
        };

        // update the key values to reflect the property or name
        // this does not look at nested fields and elements, just top level
        service.updateKeys = function (parent) {
          angular.forEach(service.propertiesOf(parent), function (node, key) {
            if (!DataUtilService.isSpecialKey(key)) {
              service.updateKey(key, node, parent);
            }
          });
        };

        service.updateKey = function (key, node, parent) {
          if (!service.isRootNode(parent, node) && !service.hasVersion(node)) {
            var title = service.getTitle(node);
            var labels = service.getPropertyLabels(parent);
            var label = labels && labels[key];
            var descriptions = service.getPropertyDescriptions(parent);
            var description = descriptions && descriptions[key];
            service.relabel(parent, key, title, label, description);
          }
        };

        // Relabel the element key with a new value from the propertyLabels
        service.relabel = function (parent, key, title, label, description) {

          if (key !== title) {
            var schema = service.schemaOf(parent);
            var properties = service.propertiesOf(parent);
            var newKey = service.getAcceptableKey(properties, label, key);

            angular.forEach(properties, function (value, k) {
              if (value && key === k) {
                service.relabelField(schema, key, newKey, label, description);
              }
            });
          }
        };

        // Relabel the field key with the field title
        service.relabelField = function (schema, key, newKey, label, description) {
          if (!label) {
            console.log('Error: relabelField missing label');
          }
          if (key !== newKey) {

            // get the new key
            var properties = service.propertiesOf(schema);
            //var newKey = service.getAcceptableKey(properties, service.getFieldName(newTitle), key);

            // Rename the key at the schema.properties level
            service.renameKeyOfObject(properties, key, newKey);

            // Rename the key in the @context
            if (properties["@context"] && properties["@context"].properties) {
              service.renameKeyOfObject(properties["@context"].properties, key, newKey);
            }
            if (properties["@context"] && properties["@context"].required) {
              var idx = properties["@context"].required.indexOf(key);
              properties["@context"].required[idx] = newKey;
            }

            // Rename the key in the 'order' array
            if (schema._ui.order) {
              schema._ui.order = service.renameItemInArray(schema._ui.order, key, newKey);
            }

            // Rename key in the 'required' array
            if (schema.required) {
              schema.required = service.renameItemInArray(schema.required, key, newKey);
            }

            // Rename key in the 'propertyLabels' array
            if (schema['_ui']['propertyLabels']) {
              delete schema['_ui']['propertyLabels'][key];
              schema['_ui']['propertyLabels'][newKey] = label;
            }

            // Rename key in the 'propertyDescriptions' array
            if (schema['_ui']['propertyDescriptions']) {
              delete schema['_ui']['propertyDescriptions'][key];
              schema['_ui']['propertyDescriptions'][newKey] = description;
            }
          }
        };

        service.isElement = function (node) {
          return DataUtilService.isElement(service.schemaOf(node));
        };

        //
        // _tmp fields
        //

        // strip _tmp fields for node and children
        service.stripTmps = function (node) {

          service.stripTmpIfPresent(node);

          if (node.type === 'array') {
            node = node.items;
          }

          angular.forEach(node.properties, function (value, key) {
            if (!DataUtilService.isSpecialKey(key)) {
              service.stripTmps(value);
            }
          });
        };

        // remove the _tmp field from the node and its properties
        service.stripTmpIfPresent = function (node) {

          if (node.hasOwnProperty("_tmp")) {
            delete node._tmp;
          }

          var schema = service.schemaOf(node);
          if (schema && schema.hasOwnProperty("_tmp")) {
            delete schema._tmp;
          }

        };


        service.createDomIds = function (node) {
          var schema = service.schemaOf(node);
          service.addDomIdIfNotPresent(schema, service.createDomId());
          var prop = service.propertiesOf(schema);
          angular.forEach(prop, function (value, key) {
            if (!DataUtilService.isSpecialKey(key)) {
              service.createDomIds(value);
            }
          });
        };

        service.addDomIdIfNotPresent = function (node, id) {
          node._tmp = node._tmp || {};
          if (!node._tmp.domId) {
            node._tmp.domId = id;
          }
          return node._tmp.domId;
        };

        service.getDomId = function (node) {
          var domId = service.createDomId();
          if (node) {
            var schema = service.schemaOf(node);
            schema._tmp = schema._tmp || {};
            if (schema._tmp.domId) {
              domId = schema._tmp.domId;
            } else {
              schema._tmp.domId = domId;
            }
          }
          return domId;
        };

        service.createDomId = function () {
          return 'id' + Math.random().toString().replace(/\./g, '');
        };

        // is this a nested field?
        service.isNested = function (field) {
          const schema = service.schemaOf(field);
          schema._tmp = schema._tmp || {};
          return (schema._tmp.nested || false);
        };

        // set the _tmp.expanded
        service.setExpanded = function (node, value) {
          const schema = service.schemaOf(node);
          schema._tmp = schema._tmp || {};
          schema._tmp.expanded = value;
        };

        // check the _tmp.expanded
        service.isExpanded = function (node) {
          const schema = service.schemaOf(node);
          schema._tmp = schema._tmp || {};
          if (!schema._tmp.hasOwnProperty('expanded')) {
            // schema._tmp.expanded = !DataUtilService.isElement(node);
            schema._tmp.expanded = true;
          }
          return (schema._tmp.expanded || false);
        };

        // set the _tmp.state
        service.setTmpState = function (node, value) {
          const schema = service.schemaOf(node);
          schema._tmp = schema._tmp || {};
          schema._tmp.state = value;
        };

        service.clearEditState = function (node, value) {
          const schema = service.schemaOf(node);
          schema._tmp = schema._tmp || {};
          delete schema._tmp.state;
        };

        // check the _tmp.state
        service.isTmpState = function (node, value) {
          const schema = service.schemaOf(node);
          schema._tmp = schema._tmp || {};
          return (schema._tmp.state === value);
        };

        //
        //  order
        //

        // get order array
        service.getOrder = function (node) {
          return service.schemaOf(node)._ui.order;
        };


        // get order array that can be used to build the spreadsheet columns
        service.getFlatSpreadsheetOrder = function (node, model) {

          const result = [];
          service.schemaOf(node)._ui.order.forEach(function (key) {
            const field = service.schemaOf(service.propertiesOf(node)[key]);

            if (service.isAttributeValueType(field)) {

              if (Array.isArray(model)) {
                for (let i = 0; i < model[0][key].length; i++) {
                  if (model[0][key][i]) {
                    result.push(model[0][key][i]);
                  }
                }
              } else {
                result.push(key);
              }
            } else if (!service.isStaticField(field) && !service.isElement(field) && !service.isMultipleChoiceField(
                field)) {
              result.push(key);
            }
          });
          return result;
        };

        //
        //  propertyId and propertyLabels
        //


        service.firstClassField = function (node) {
          return service.hasVersion(node);
        };

        service.isRootNode = function (parent, child) {
          return parent && child && service.getId(child) === service.getId(parent);
        };


        // get the non-CEDAR propertyId for this node
        service.getPropertyId = function (parent, node) {
          let result = '';
          if (parent && node && (service.getId(node) !== service.getId(parent))) {

            var property;
            var prop;
            var schema = service.schemaOf(parent);
            var props = service.propertiesOf(parent);
            var id = service.getId(node);
            for (prop in props) {
              if (service.schemaOf(props[prop])['@id'] === id) {
                // only return non-cedar property values
                if (schema.properties['@context'].properties[prop]) {
                  property = schema.properties['@context'].properties[prop]['enum'][0];

                  if (property.indexOf(UrlService.schemaProperties()) === -1) {
                    result = property;
                  }
                  break;
                }
              }
            }
          }
          return result;
        };

        // delete the non-CEDAR propertyId by using a CEDAR property
        service.deletePropertyId = function (parent, node) {
          if (parent && node && (service.getId(node) !== service.getId(parent))) {
            const id = service.getId(node);
            const props = service.propertiesOf(parent);
            const schema = service.schemaOf(parent);
            for (let prop in props) {
              if (service.getId(props[prop]) === id) {
                const randomPropertyName = service.generateGUID();
                if (schema.properties['@context'].properties[prop]) {
                  schema.properties['@context'].properties[prop]['enum'][0] = service.getEnumOf(randomPropertyName);
                  break;
                }
              }
            }
          }
        };

        // get the propertyLabel out of this node
        service.getPropertyLabels = function (node) {
          if (node) {
            return service.schemaOf(node)['_ui']['propertyLabels'];
          }
        };

        // get the propertyLabel out of this node
        service.getPropertyDescriptions = function (node) {
          if (node) {
            return service.schemaOf(node)['_ui']['propertyDescriptions'];
          }
        };


        //
        //  children
        //


        service.getChildNode = function (parentNode, childKey) {
          return service.propertiesOf(parentNode)[childKey];
        };


        //
        //  generate stuff
        //

        // Generating a RFC4122 version 4 compliant GUID
        service.generateGUID = function () {
          let d = Date.now();
          let guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
          });
          return guid;
        };

        service.generateTempGUID = function () {
          return "tmp-" + Date.now() + "-" + (window.performance.now() | 0);
        };

        // Function that generates a basic field definition
        service.generateField = function (inputType, container) {
          const valueType = ["string", "null"];


          var field;

          if (container) {
            field = DataTemplateService.getContainerField(null);
            field._ui.inputType = inputType;
          } else if (FieldTypeService.isStaticField(inputType)) {
            field = DataTemplateService.getStaticField(this.generateTempGUID());
            field._ui.inputType = inputType;
          } else if (FieldTypeService.isAttributeValueField(inputType)) {
            field = DataTemplateService.getAttributeValueField(this.generateTempGUID());
          } else {
            field = DataTemplateService.getField(this.generateTempGUID());
            field.properties['@value'].type = valueType;
            field._ui.inputType = inputType;
          }
          //field._ui.inputType = inputType;

          // Constrain the @type of @value according to the field type
          let valueAtType = null;
          if (inputType === 'date' || inputType === 'numeric') {
            valueAtType = {};
            valueAtType.type = 'string';
            valueAtType.format = 'uri';
            if (inputType === 'date') {
              //valueAtType.enum = ['xsd:dateTime'];
              // Make @type required
              field.required.push('@type');
            } else if (inputType === 'numeric') {
              //valueAtType.enum = ['xsd:decimal'];
              // Make @type required
              field.required.push('@type');
            }
            delete field.properties['@type'];
            field.properties['@type'] = valueAtType;
          }

          if (!container && (inputType === "checkbox")) {
            field.minItems = 1;
            service.cardinalizeField(field);
          }

          // The value of the link field is a URI, and note that @id cannot be null
          if (inputType === "link") {
            // Define the @id field
            var idField = {};
            idField.type = "string";
            idField.format = "uri";
            field.properties["@id"] = idField;
            delete field.properties["@value"];

            // @id is not required because "@id":"null" is not valid. If there is no value, the object will be empty
            delete field.required
          }

          // // The value of the link field is a URI, and note that @id cannot be null
          // if (inputType == "attribute-value") {
          //   //field.properties["schema:isBasedOn"] = {"@type": "@id"};
          //   // field.minItems = 0;
          //   // service.cardinalizeField(field);
          // }

          // Set default schema title and description
          const defaultTitle = $translate.instant("GENERIC.Untitled");
          service.setFieldSchemaTitleAndDescription(field, defaultTitle);

          return field;

        };


        // Function that generates a basic field definition
        service.isStaticField = function (field) {
          const schema = service.schemaOf(field);
          const type = schema._ui.inputType;
          return FieldTypeService.isStaticField(type);
        };


        // Function that generates the @context for an instance, based on the schema @context definition
        service.generateInstanceContext = function (schemaContext) {
          const context = {};
          angular.forEach(schemaContext.properties, function (value, key) {
            if (value.type === "object") {
              context[key] = {};
              angular.forEach(schemaContext.properties[key].properties, function (value2, key2) {
                if (value2.enum) {
                  context[key][key2] = value2.enum[0];
                }
              });
            } else {
              if (value.enum) {
                context[key] = value.enum[0];
              }
            }
          });
          return context;
        };

        // Function that generates the @type for a field in an instance, based on the schema @type definition
        service.generateInstanceType = function (schemaType) {
          let instanceType = null;
          let enumeration = {};
          if (angular.isUndefined(schemaType.oneOf)) {
            enumeration = schemaType.enum;

          } else {
            enumeration = schemaType.oneOf[0].enum;
          }
          // If the type is defined at the schema level
          if (angular.isDefined(enumeration)) {
            // If only one type has been defined, it is returned
            if (enumeration.length === 1) {
              instanceType = enumeration[0];
              // If more than one type have been defined for the template/element/field, an array is returned
            } else {
              instanceType = enumeration;
            }
          }
          return instanceType;
        };

        service.generateInstanceTypeForDateField = function () {
          return "xsd:date";
        };

        service.generateInstanceTypeForDateTimeField = function () {
          return "xsd:dateTime";
        };

        service.generateInstanceTypeForTimeField = function () {
          return "xsd:time";
        };

        service.generateInstanceTypeForNumericField = function (node) {
          return service.getNumberType(service.schemaOf(node));
        };

        // returns the properties of a template, element, or field schema
        service.getProperties = function (node) {
          return service.schemaOf(node).properties;
        };

        // If necessary, updates the field schema according to whether the field is controlled or not
        service.initializeSchema = function (field) {
          const fieldSchema = service.schemaOf(field);
          // If regular field
          if (!service.hasValueConstraint(fieldSchema)) {
            if (!fieldSchema.required || fieldSchema.required[0] !== "@value") {
              fieldSchema.required = [];
              fieldSchema.required.push("@value")
            }
            if (angular.isUndefined(fieldSchema.properties["@value"])) {
              const valueField = {};
              valueField.type = [];
              valueField.type.push("string");
              valueField.type.push("null");
              fieldSchema.properties["@value"] = valueField;
              delete fieldSchema.properties["@id"];
            }
          }
          // If controlled field
          else {
            // @id is not required because "@id":"null" is not valid. If there is no value, the object will be empty
            delete fieldSchema.required;
            if (angular.isUndefined(fieldSchema.properties["@id"])) {
              const idField = {};
              idField.type = "string";
              idField.format = "uri";
              fieldSchema.properties["@id"] = idField;
              delete fieldSchema.properties["@value"];
            }
          }
        };

        // This function initializes the model to array or object, depending on the field type. The 'force' parameter forces
        // the initialization even if the model is defined and contains items
        service.initializeModel = function (field, model, force) {
          // Checkbox or multiple-choice list
          if (service.isMultipleChoiceField(field)) {
            if (!model || !$rootScope.isArray(model)) {
              model = [];
            } else if (force) {
              // Remove all elements from the 'model' array if not empty. Note that using $scope.model = []
              // may not work because there are references to the original array
              model.splice(0);
            }
          }
          // Radio or single-choice list. They store only one value.
          else if (service.isSingleChoiceListField(field)) {
            if (!model || $rootScope.isArray(model)) {
              model = {};
            }
          }
          return model;
        };

        // This function initializes the @value field (in the model) to null if it has not been initialized yet.
        // For text fields, it may also set it to a default value set by the user when creating the template. Note that
        // the @id field can't be initialized to null. In JSON-LD, @id must be a string, so we don't initialize it.
        service.initializeValue = function (field, model) {

          if (service.isAttributeValueType(field)) {
          } else {
            const fieldValue = service.getValueLocation(field);
            if (fieldValue === "@value") {

              const defaultValue = service.getDefaultValue(fieldValue, field);

              // Not an array
              if (!$rootScope.isArray(model)) {
                if (!model) {
                  model = {};
                }
                // Value field has been defined
                if (model.hasOwnProperty(fieldValue)) {
                  // If undefined value or empty string
                  if ((angular.isUndefined(
                      model[fieldValue])) || ((model[fieldValue]) && (model[fieldValue].length === 0))) {
                    model[fieldValue] = defaultValue;
                  }
                }
                // Value field has not been defined
                else {
                  model[fieldValue] = defaultValue;
                }
              }
              // An array
              else {
                // Length is 0
                if (model.length === 0) {
                  model.push({});
                  model[0][fieldValue] = defaultValue;
                }
                // If length > 0
                else {
                  for (var i = 0; i < model.length; i++) {
                    service.initializeValue(field, model[i]);
                  }
                }
              }
            }
          }

        };

        service.getDefaultValue = function (fieldValue, field) {
          if (fieldValue === "@value") {
            // If the template contains a user-defined default value, we use it as the default value for the field
            if (service.schemaOf(field)._ui.inputType === "textfield" && service.hasUserDefinedDefaultValue(field)) {
              return service.getUserDefinedDefaultValue(field);
            }
            if (service.isAttributeValueType(field)) {
              return service.getTitle(field);
            }
            // Otherwise, we return the default value, which is 'null'
            else {
              return null;
            }
          }
          // Otherwise don't return anything because the @id field can't be initialized to null
        };

        // Sets the default selections for multi-answer fields
        service.defaultOptionsToModel = function (field, model) {
          let i;
          if (service.isMultiAnswer(field)) {
            const literals = service.getLiterals(field);
            const fieldValue = service.getValueLocation(field);
            // Checkbox or multi-choice  list
            if (service.isMultipleChoiceField(field)) {
              for (i = 0; i < literals.length; i++) {
                if (literals[i].selectedByDefault) {
                  var newValue = {};
                  newValue[fieldValue] = literals[i].label;
                  model.push(newValue);
                }
              }
            }
            // Radio or single-choice list
            else if (service.isSingleChoiceListField(field)) {
              for (i = 0; i < literals.length; i++) {
                if (literals[i].selectedByDefault) {
                  model[fieldValue] = literals[i].label;
                  break;
                }
              }
            }
          }
        };


        // Removes empty strings from the model. This function is used to remove the empty string generated by the
        // 'Nothing selected' option in single-selection fields
        service.removeEmptyStrings = function (field, model) {
          const fieldValue = service.getValueLocation(field);
          if ($rootScope.isArray(model)) {
            for (let i = model.length - 1; i >= 0; i--) {
              if (model[i][fieldValue] === "") {
                model.splice(i, 1);
              }
            }
          } else {
            if (model[fieldValue] === "") {
              delete model[fieldValue];
            }
          }
        };

        // Initializes the value @type field in the model based on the fieldType.
        // Note that for 'date' and 'numeric' fields, the field schema is flexible, allowing any string as a type.
        // Users may want to manually create instances that use different date or numeric types (e.g., xsd:integer).
        // As a consequence, we cannot use the @type definition from the schema to generate the @type for the instance
        // field. We 'manually' generate those types.
        service.initializeValueType = function (field, model) {
          let fieldType;
          if (service.isNumericField(field)) {
            fieldType = service.generateInstanceTypeForNumericField(field);
          } else if (service.isDateField(field)) {
            fieldType = service.generateInstanceTypeForDateField();
          } else if (service.isDateTimeField(field)) {
            fieldType = service.generateInstanceTypeForDateTimeField();
          } else if (service.isTimeField(field)) {
            fieldType = service.generateInstanceTypeForTimeField();
          } else {
            const properties = service.propertiesOf(field);
            if (properties && !angular.isUndefined(properties['@type'])) {
              fieldType = service.generateInstanceType(properties['@type']);
            }
          }
          if (fieldType) {
            // It is not an array
            if (field.type === 'object') {
              // If the @type has not been defined yet, define it
              if (angular.isUndefined(model['@type'])) {
                // No need to set the type if it is xsd:string. It is the type by default
                if (fieldType !== "xsd:string") {
                  model['@type'] = fieldType;
                }
              }
            }
            // It is an array
            else if (field.type === 'array') {
              for (let i = 0; i < model.length; i++) {
                // If there is an item in the array for which the @type has not been defined, define it
                if (angular.isUndefined(model[i]['@type'])) {
                  // No need to set the type if it is xsd:string. It is the type by default
                  if (fieldType !== "xsd:string") {
                    model[i]['@type'] = fieldType;
                  }
                }
              }
            }
          }

        };

        // get the location of the value and null it
        service.resetValue = function (field) {
          let fieldValue = service.getValueLocation(field);
          field[fieldValue] = null;

          return result;
        };


        // where is the value of this field, @id or @value?
        service.getValueLocation = function (field) {
          // usually it is in  @value
          let fieldValue = "@value";
          // but these three put it @id
          if (service.getFieldControlledTerms(field) || service.hasValueConstraint(field) || service.isLinkType(field)) {
            fieldValue = "@id";
          }
          return fieldValue;
        };

        // where is the value that we show the user?
        service.getValueLabelLocation = function (field, valueNode) {
          // the printable value is usually in @value
          let location = "@value";
          // but a link puts it in @id
          if (service.isLinkType(field)) {
            location = "@id";
            // and the constraint puts it rdfs:label
          } else if (service.hasValueConstraint(field)) {
            location = "rdfs:label";
            // The following condition allows the Metadata Editor to work with instances of the BioSample template. These
            // instances were automatically generated from GEO data. According to the BioSample template, the optional attribute
            // element must contain Name and Value attributes with plain text values. However, we automatically generated
            // some instances that contain controlled terms. In those cases, we want our UI to show the controlled term label.
          } else if (valueNode && valueNode.length > 0 && valueNode[0]['rdfs:label']) {
            location = "rdfs:label"
          }
          return location;
        };

        // Generates a nice field name
        service.getFieldName = function (rawFieldName) {
          if (rawFieldName && rawFieldName.length > 0) {
            return DataUtilService.removeSpecialChars(rawFieldName);
          }
        };

        service.getEnumOf = function (propertyName) {
          return UrlService.schemaProperty(propertyName);
        };

        // don't modify the property unless it contains the Cedar schema base url
        // a user might have defined a specific property for this field
        service.getPropertyOf = function (propertyId, property) {
          if (property.indexOf(UrlService.schemaBase()) > -1) {
            return UrlService.schemaProperty(propertyId);
          } else {
            return property;
          }

        };

        service.generateFieldContextProperties = function (fieldName) {
          let c = {};
          c.enum = new Array(service.getEnumOf(fieldName));
          return c;
        };

        service.getAcceptableKey = function (obj, suggestedKey, currentKey) {

          if (!obj || typeof (obj) != "object") {
            return;
          }

          if (currentKey === suggestedKey) {
            return currentKey;
          }

          let key = suggestedKey;

          if (obj[key]) { // if the object already contains the suggested key, generate an acceptable key
            let idx = 1;
            let newKey = "" + key + idx;
            while (obj[newKey]) {
              if (currentKey === newKey) {
                break; // currentKey is an acceptable key
              }
              idx += 1;
              newKey = "" + key + idx;
            }
            key = newKey;
          }

          return key;
        };

        service.addKeyToObject = function (obj, key, value) {
          if (!obj || typeof (obj) != "object") {
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

        // Add path for every field in the template
        service.addPathInfo = function (template, path) {
          const properties = service.propertiesOf(template);
          angular.forEach(properties, function (value, name) {
            if (!DataUtilService.isSpecialKey(name)) {
              // We can tell we've reached an element level by its '@type' property
              if (service.schemaOf(value)['@type'] === 'https://schema.metadatacenter.org/core/TemplateElement') {
                if (path == null) {
                  service.addPathInfo(value, name);
                } else {
                  service.addPathInfo(value, path + '.' + name);
                }
              }
              // If it is a template field
              else {
                // If it is not a static field
                if (!value._ui || !value._ui.inputType || !FieldTypeService.isStaticField(value._ui.inputType)) {

                  var fieldPath = path;
                  if (fieldPath == null || fieldPath.length === 0) {
                    fieldPath = name;
                  } else {
                    fieldPath = fieldPath + '.' + name;
                  }
                  properties[name]['_path'] = fieldPath;
                }
              }
            }
          });
        };

        // create the order array for node and children
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

        // Add a field or element name to the top-level 'required' array in a template or element
        service.addKeyToRequired = function (templateOrElement, key) {
          // Initialize schema.required if it's undefined
          if (angular.isUndefined(templateOrElement.required)) {
            templateOrElement.required = [];
          }
          // Check that the key is not already present in the required array
          if (templateOrElement.required.indexOf(key) === -1) {
            templateOrElement.required.push(key);
          }
          return templateOrElement;
        };

        // Remove a field or element name from the top-level 'required' array in a template or element
        service.removeKeyFromRequired = function (templateOrElement, key) {
          // If the required field is undefined, there is nothing to remove
          if (angular.isUndefined(templateOrElement.required)) {
            return templateOrElement;
          }
          // Remove element from the array
          var index = templateOrElement.required.indexOf(key);
          if (index > -1) {
            templateOrElement.required.splice(index, 1);
          }
          // If the required field is empty, delete it. Note that empty 'required' seem to be valid in JSON Schema, however
          // (http://json-schema.org/latest/json-schema-validation.html#rfc.section.6.17)
          if (templateOrElement.required.length === 0) {
            delete templateOrElement.required;
          }
          return templateOrElement;
        };

        service.removeKeyFromContext = function (schema, key) {
          if (schema.properties["@context"] && schema.properties["@context"].properties) {
            delete schema.properties["@context"].properties[key];
          }
          if (schema.properties["@context"].required) {
            var index = schema.properties["@context"].required.indexOf(key);
            if (index >= 0) {
              schema.properties["@context"].required.splice(index, 1);
            }
            // If the required field is empty, delete it. Note that empty 'required' seem to be valid in JSON Schema, however
            // (http://json-schema.org/latest/json-schema-validation.html#rfc.section.6.17)
            if (schema.properties["@context"].required.length === 0) {
              delete schema.properties["@context"].required;
            }
          }
        };

        // Rename an array item
        service.renameItemInArray = function (array, name, newName) {
          var index = array.indexOf(name);
          if (index > -1) {
            array[index] = newName;
          }
          return array;
        };

        // rename the key of a child in the form
        service.renameChildKey = function (parent, child, newKey) {

          if (!child) {
            return;
          }
          var parentSchema = service.schemaOf(parent);
          var childId = service.idOf(child);
          if (!childId || /^tmp\-/.test(childId)) {
            var p = service.propertiesOf(parent);
            if (p[newKey] && p[newKey] === child) {
              return;
            }
            newKey = service.getAcceptableKey(p, newKey);
            angular.forEach(p, function (value, key) {
              if (!value) {
                return;
              }
              var idOfValue = service.idOf(value);
              if (idOfValue && idOfValue === childId) {

                service.renameKeyOfObject(p, key, newKey);
                if (p["@context"] && p["@context"].properties) {
                  service.renameKeyOfObject(p["@context"].properties, key, newKey);
                  if (p["@context"].properties[newKey] && p["@context"].properties[newKey].enum) {
                    var propertyId = service.generateGUID();
                    p["@context"].properties[newKey].enum[0] = service.getPropertyOf(propertyId,
                        p["@context"].properties[newKey].enum[0]);
                  }
                }
                if (p["@context"].required) {
                  var idx = p["@context"].required.indexOf(key);
                  p["@context"].required[idx] = newKey;
                }
                // Rename key in the 'order' array
                parentSchema._ui.order = service.renameItemInArray(parentSchema._ui.order, key, newKey);
                // Rename key in the 'required' array
                parentSchema.required = service.renameItemInArray(parentSchema.required, key, newKey);
                // Rename key in the 'propertyLabels' array
                delete parentSchema._ui.propertyLabels[key];
                parentSchema._ui.propertyLabels[newKey] = newKey;
                delete parentSchema._ui.propertyDescriptions[key];
                parentSchema._ui.propertyDescriptions[newKey] = newKey;

              }
            });
          }
        };

        // update the property id for a field inside a template or element
        // set the field title and description to property label and definition
        service.updateProperty = function (propertyId, propertyLabel, propertyDescription, fieldId, parent) {

          const props = service.propertiesOf(parent);
          const schema = service.schemaOf(parent);
          let fieldProp;
          for (let prop in props) {
            if (service.getId(props[prop]) === fieldId) {
              fieldProp = prop;
              break;
            }
          }
          if (fieldProp) {
            // set the property as the field title and description
            const field = service.schemaOf(props[fieldProp]);
            const label = service.getTitle(field) || propertyLabel;
            const description = service.getDescription(field) || propertyDescription;

            // title and description
            service.setTitle(field, label);
            service.setDescription(field, description);

            // property label
            service.getPropertyLabels(parent)[fieldProp] = propertyLabel;

            // property id
            if (!propertyId || propertyId.length < 1) {
              service.deletePropertyId(parent, field);
            } else {
              props['@context'].properties[fieldProp]['enum'][0] = propertyId;
            }
          }
        };


        //
        // value constraints
        //

        // does this field have a value constraint?
        service.hasValueConstraint = function (node) {
          var result = false;

          var vcst = service.schemaOf(node)._valueConstraints;
          if (vcst) {
            var hasOntologies = vcst.ontologies && vcst.ontologies.length > 0;
            var hasValueSets = vcst.valueSets && vcst.valueSets.length > 0;
            var hasClasses = vcst.classes && vcst.classes.length > 0;
            var hasBranches = vcst.branches && vcst.branches.length > 0;
            result = hasOntologies || hasValueSets || hasClasses || hasBranches;
          }

          return result;
        };

        // does this field have a value constraint?

        service.getValueConstraint = function (node) {
          return service.schemaOf(node)._valueConstraints;
        };

        // get the value constraint literal values
        service.getLiterals = function (node) {
          var valueConstraints = service.schemaOf(node)._valueConstraints;
          if (valueConstraints) {
            return valueConstraints.literals;
          }

        };

        // checks if the literal has been set to 'selected by default'
        service.isSelectedByDefault = function (literal) {
          if (literal.selectedByDefault) {
            return true;
          } else {
            return false;
          }
        };

        // returns the position of a particular literal in the literals array
        service.indexOfLiteral = function (field, literal) {
          var literals = service.getLiterals(field);
          for (var i = 0; i < literals.length; i++) {
            if (literals[i] === literal) {
              return i;
            }
          }
          return null;
        };


        // add an option to this field
        service.addOption = function (node) {
          var emptyOption = {
            "label": ""
          };
          service.schemaOf(node)._valueConstraints.literals.push(emptyOption);
        };

        service.defaultOptions = function (node, value) {
          let MIN_OPTIONS = 2;
          if (service.getInputType(node) == 'checkbox') {
            MIN_OPTIONS = 1;
          }

          let schema = service.schemaOf(node);

          // make sure we have the minimum number of options
          while (schema._valueConstraints.literals.length < MIN_OPTIONS) {
            const emptyOption = {
              "label": name || ""
            };
            schema._valueConstraints.literals.push(emptyOption);
          }

          // and they all have text fields filled in
          for (let i = 0; i < schema._valueConstraints.literals.length; i++) {
            if (schema._valueConstraints.literals[i].label.length == 0) {
              schema._valueConstraints.literals[i].label = value + "-" + i;
            }
          }

        };


        //
        // controlled terms
        //

        // has recommendations?
        service.valueRecommendationEnabled = function (node) {
          return service.schemaOf(node)._ui.valueRecommendationEnabled;
        };

        // get the controlled terms list for field types
        service.getFieldControlledTerms = function (node) {
          if (service.isStaticField(node) || service.isAttributeValueType(node)) { // static or attribute value fields
            return null;
          } else { // regular fields
            var properties = service.propertiesOf(node);
            if (properties['@type'] && properties['@type'].oneOf && properties['@type'].oneOf[1]) {
              return properties['@type'].oneOf[1].items['enum'];
            } else {
              return null;
            }
          }
        };

        // parse the ontology code from the source
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

        // parse the class from the selfUrl
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

        // parse the ontology code from the selfUrl
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

        // delete both the oneOf copies of the class id for the question type
        service.deleteFieldControlledTerm = function (itemDataId, node) {
          var properties = service.propertiesOf(node);
          var idx = properties["@type"].oneOf[0].enum.indexOf(itemDataId);

          if (idx >= 0) {
            properties["@type"].oneOf[0].enum.splice(idx, 1);
            if (properties["@type"].oneOf[0].enum.length === 0) {
              delete properties["@type"].oneOf[0].enum;
            }
          }

          idx = properties['@type'].oneOf[1].items.enum.indexOf(itemDataId);

          if (idx >= 0) {
            properties['@type'].oneOf[1].items.enum.splice(idx, 1);
            if (properties["@type"].oneOf[1].items.enum.length === 0) {
              delete properties["@type"].oneOf[1].items.enum;
            }
          }
          service.initializeSchema(node);
        };

        // delete the branch in valueConstraints
        service.deleteFieldAddedBranch = function (branch, node) {

          var valueConstraints = service.schemaOf(node)._valueConstraints;
          for (var i = 0, len = valueConstraints.branches.length; i < len; i += 1) {
            if (valueConstraints.branches[i]['uri'] === branch['uri']) {
              valueConstraints.branches.splice(i, 1);
              break;
            }
          }
          service.initializeSchema(node);
        };

        // get the ontologyCLass in valueConstraints
        service.getFieldAddedClassByUri = function (uri, node) {
          var valueConstraints = service.schemaOf(node)._valueConstraints;
          for (var i = 0, len = valueConstraints.classes.length; i < len; i += 1) {
            if (valueConstraints.classes[i].uri === uri) {
              return valueConstraints.classes[i];
            }
          }
        };

        // delete the ontologyCLass in valueConstraints
        service.deleteFieldAddedClass = function (ontologyClass, node) {

          var valueConstraints = service.schemaOf(node)._valueConstraints;
          for (var i = 0, len = valueConstraints.classes.length; i < len; i += 1) {
            if (valueConstraints.classes[i] === ontologyClass) {
              valueConstraints.classes.splice(i, 1);
              break;
            }
          }
          service.initializeSchema(node);
        };

        // delete the ontology in valueConstraints
        service.deleteFieldAddedOntology = function (ontology, node) {

          var valueConstraints = service.schemaOf(node)._valueConstraints;
          for (var i = 0, len = valueConstraints.ontologies.length; i < len; i += 1) {
            if (valueConstraints.ontologies[i]['uri'] === ontology['uri']) {
              valueConstraints.ontologies.splice(i, 1);
              break;
            }
          }
          service.initializeSchema(node);
        };

        // delete the valueSet in valueConstraints
        service.deleteFieldAddedValueSet = function (valueSet, node) {

          var valueConstraints = service.schemaOf(node)._valueConstraints;
          for (var i = 0, len = valueConstraints.valueSets.length; i < len; i += 1) {
            if (valueConstraints.valueSets[i]['uri'] === valueSet['uri']) {
              valueConstraints.valueSets.splice(i, 1);
              break;
            }
          }
          service.initializeSchema(node);
        };


        service.removeValueRecommendationField = function (node) {
          delete service.schemaOf(node)._ui.valueRecommendationEnabled;
        };


        // TODO this clears the @value fields, but does not work if the values are elsewhere as they are for some field types, but this is not being called currently
        // reset the element by removing the current values
        service.resetElement = function (el, settings) {
          angular.forEach(el, function (model, key) {
            if (settings[key] && settings[key].minItems && angular.isArray(model)) {
              model.splice(settings[key].minItems, model.length);
            }
            if (!DataUtilService.isSpecialKey(key)) {
              if (key === '@value') {
                if (angular.isArray(model)) {
                  if (service.schemaOf(settings)._ui.inputType === "list") {
                    model.splice(0, model.length);
                  } else {
                    for (var i = 0; i < model.length; i++) {
                      if (typeof (model[i]['@value']) == "string") {
                        model[i]['@value'] = "";
                      } else if (angular.isArray(model[i]['@value'])) {
                        model[i]['@value'] = [];
                      } else if (angular.isObject(model[i]['@value'])) {
                        model[i]['@value'] = {};
                      }
                    }
                  }
                } else if (typeof (model) == "string") {
                  el[key] = "";
                } else if (angular.isArray(model)) {
                  el[key] = [];
                } else if (angular.isObject(model)) {
                  el[key] = {};
                }
              } else {
                if (settings[key]) {
                  service.resetElement(model, settings[key]);
                } else {
                  // This case el is an array
                  angular.forEach(model, function (v, k) {
                    if (k === '@value') {
                      if (angular.isArray(v)) {
                        if (service.schemaOf(settings)._ui.inputType === "list") {
                          v.splice(0, v.length);
                        } else {
                          for (var i = 0; i < v.length; i++) {

                            if (typeof (v[i]['@value']) == "string") {
                              v[i]['@value'] = "";
                            } else if (angular.isArray(v[i]['@value'])) {
                              v[i]['@value'] = [];
                            } else if (angular.isObject(v[i]['@value'])) {
                              v[i]['@value'] = {};
                            }

                          }
                        }
                      } else if (typeof (v) == "string") {
                        model[k] = "";
                      } else if (angular.isArray(v)) {
                        model[k] = [];
                      } else if (angular.isObject(v)) {
                        model[k] = {};
                      }
                    } else if (k !== '@type') {
                      if (settings[k]) {
                        service.resetElement(v, settings[k]);
                      }
                    }
                  });
                }
              }
            }
          });
        };


        service.removeChild = function (parent, child, childKey) {
          if (!service.isRootNode(parent, child)) {


            var id = service.getId(child);
            var props = service.propertiesOf(parent);

            if (childKey && props[childKey]) {
              // Remove the key
              delete props[childKey];

              // Remove it from the order array
              var idx = service.getOrder(parent).indexOf(childKey);
              service.getOrder(parent).splice(idx, 1);

              // Remove the property label (for elements)
              if (service.getPropertyLabels(parent)[childKey]) {
                delete service.getPropertyLabels(parent)[childKey];
              }
              if (service.getPropertyDescriptions(parent)[childKey]) {
                delete service.getPropertyDescriptions(parent)[childKey];
              }

              // Remove it from the top-level 'required' array
              service.removeKeyFromRequired(parent, childKey);

              // Remove it from the context
              service.removeKeyFromContext(service.schemaOf(parent), childKey);

            }
            return childKey;
          }
        };

        // Used in cedar-template-element.directive.js, form.directive
        service.findChildren = function (iterator, parentModel, populateNestedElements) {

          angular.forEach(iterator, function (value, name) {

            // Add @context information to instance
            if (name === '@context') {
              parentModel['@context'] = service.generateInstanceContext(value);
            }

            let min = value.minItems || 0;

            if (!DataUtilService.isSpecialKey(name)) {
              // We can tell we've reached an element level by its '@type' property
              if (service.schemaOf(value)['@type'] === 'https://schema.metadatacenter.org/core/TemplateElement') {

                if (service.isCardinalElement(value)) {
                  if (!parentModel[name] || angular.isObject(parentModel[name])) {
                    parentModel[name] = [];
                  }

                  for (let i = 0; i < min - parentModel[name].length; i++) {
                    parentModel[name].push({});
                  }

                  parentModel[name].splice(min, parentModel[name].length);
                } else {
                  if (!parentModel[name] || angular.isArray(parentModel[name])) {
                    parentModel[name] = {};
                  }
                }

                if (populateNestedElements) { // recursive call
                  let properties = schemaService.propertiesOf(service.schemaOf(value));
                  service.findChildren(properties, parentModel[name], true);
                }

              } else { // It is not an element
                // Assign empty field instance model to $scope.model only if it does not exist
                if (!parentModel[name]) {
                  // Not multiple instance
                  if (!service.isCardinalElement(value)) {
                    // Multiple choice fields (checkbox and multi-choice list) store an array of values
                    if (service.isMultipleChoiceField(value)) {
                      parentModel[name] = [];
                    }
                    // All other fields, including the radio field and the list field with single option
                    else {
                      parentModel[name] = {};
                    }
                    // Multiple instance
                  } else {
                    parentModel[name] = [];
                    for (let i = 0; i < min; i++) {
                      let obj = {};
                      parentModel[name].push(obj);
                    }
                  }
                }
              }
            }
          });
        };

        service.hasUserDefinedDefaultValue = function (field) {
          const schema = service.schemaOf(field);
          if (schema._valueConstraints && schema._valueConstraints.defaultValue) {
            return true;
          } else {
            return false;
          }
        };

        service.getUserDefinedDefaultValue = function (field) {
          if (service.hasUserDefinedDefaultValue(field)) {
            return service.schemaOf(field)._valueConstraints.defaultValue;
          } else {
            return null;
          }
        };

        // does this field allow the hidden attribute?
        service.allowsHidden = function (node) {
          return (service.schemaOf(node)._ui.inputType === 'textfield');
        };

        // does this field allow the hidden attribute?
        service.allowsDefault = function (node) {
          return (service.schemaOf(node)._ui.inputType === 'textfield');
        };

        // is this field hidden?
        service.isHidden = function (node) {
          return service.schemaOf(node)._ui.hidden || false;
        };

        // toggle the hidden field attribute
        service.setHidden = function (node, value) {
          service.schemaOf(node)._ui.hidden = value;
        };


        service.applyActions = function (list, actions) {
          // apply mods to a duplicate of the list

          var dup = list.slice();

          if (actions) {
            for (let i = 0; i < actions.length; i++) {
              let action = actions[i];
              let from = dup.findIndex(item => item['@id'] === action['termUri']);
              if (from !== -1) {
                // delete it at from
                let entry = dup.splice(from, 1);
                if (action.to !== -1 && action.action === 'move') {
                  // insert it at to
                  dup.splice(action.to, 0, entry[0]);
                }
              }
            }
          }
          return dup;
        };

        return service;
      }

    }
)
;
