'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.service.schemaService', [])
      .service('schemaService', schemaService);

  schemaService.$inject = ['FieldTypeService','$translate','DataUtilService'];

  //
  // This service contains functions manipulate the template, element and field schema model.
  //
  function schemaService(FieldTypeService,$translate,DataUtilService) {

    var service = {
      serviceId: "schemaService"
    };

   // Service functions...

    // Returns the field schema. If the field is defined as an array, this function will return field.items, because the schema is defined at that level.
    service.schemaOf = function (field) {
      if (field) {
        if (field.type === 'array' && field.items) {
          return field.items;
        } else {
          return field;
        }
      }
    };

    //
    // id, title, description ....
    //

    service.getId = function (node) {
      if (node) return service.schemaOf(node)['@id'];
    };

    service.setId = function (node, id) {
      return service.schemaOf(node)['@id'] = id;
    };

    service.getTitle = function (node) {
      if (node) return service.schemaOf(node)['schema:name'];
    };

    service.hasTitle = function (node) {
      return service.getTitle(node) && service.getTitle(node).length > 0 ;
    };

    service.setTitle = function (node, value) {
      if (node) service.schemaOf(node)['schema:name'] = value;
    };

    service.getDescription = function (node) {
      if (node) return service.schemaOf(node)['schema:description'];
    };

    service.hasDescription = function (node) {
      return service.getDescription(node) && service.getDescription(node).length > 0;
    };

    service.setDescription = function (node, value) {
      if (node) service.schemaOf(node)['schema:description'] = value;
    };

    // node title and description
    service.getPreferredLabel = function (node) {
      if (node) return service.schemaOf(node)['skos:prefLabel'];
    };

    service.hasPreferredLabel = function (node) {
      return service.schemaOf(node).hasOwnProperty('skos:prefLabel') && service.schemaOf(
          node)['skos:prefLabel'].length > 0;
    };

    service.setPreferredLabel = function (node, value) {
      if (node) service.schemaOf(node)['skos:prefLabel'] = value;
    };

    service.removePreferredLabel = function (node) {
      if (node) delete schema['skos:prefLabel'];
    };

    service.titleLocation = function () {
      return 'schema:name';
    };

    service.descriptionLocation = function () {
      return 'schema:description';
    };

    // node title and description
    service.getTitle = function (node) {
      if (node) return service.schemaOf(node)['schema:name'];
    };

    service.hasTitle = function (node) {
      if (node) {
        return service.schemaOf(node).hasOwnProperty('schema:name') && service.schemaOf(
            node)['schema:name'].length > 0;
      }
    };

    service.setTitle = function (node, value) {
      if (node) service.schemaOf(node)['schema:name'] = value;
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

    service.hasPreferredLabel = function (node) {
      return node && service.schemaOf(node).hasOwnProperty('skos:prefLabel') && service.schemaOf(
          node)['skos:prefLabel'].length > 0;
    };

    service.getPreferredLabel = function (node) {
      if (service.hasPreferredLabel(node)) return service.schemaOf(node)['skos:prefLabel'];
    };

    service.setPreferredLabel = function (node, value) {
      if (node) service.schemaOf(node)['skos:prefLabel'] = value;
    };

    service.removePreferredLabel = function (node) {
      if (node) {
        delete service.schemaOf(node)['skos:prefLabel'];
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

    service.getIdentifier = function (node) {
      return node && service.schemaOf(node)['schema:identifier'];
    };

    service.setIdentifier = function (node, value) {
      service.schemaOf(node)['schema:identifier'] = value;
    };

    service.removeIdentifier = function (node) {
      if (service.schemaOf(node)) {
        delete service.schemaOf(node)['schema:identifier'];
      }
    };

    service.setSchemaTitle = function (node, value) {
      service.schemaOf(node).title = value;
    };

    service.setSchemaDescription = function (node, value) {
      service.schemaOf(node).description = value;
    };

    service.setFieldSchemaTitleAndDescription = function (field, fieldTitle) {
      service.setSchemaTitle(field,
          $translate.instant("GENERATEDVALUE.fieldTitle", {title: fieldTitle, version: window.cedarVersion}));
      service.setSchemaDescription(field,
          $translate.instant("GENERATEDVALUE.fieldDescription", {title: fieldTitle, version: window.cedarVersion}));
    };

    service.defaultSchemaTitleAndDescription = function (node) {
      if (!node.title || !node.title.length) {
        node.title = $translate.instant("GENERIC.Untitled");
      }
      if (!node.description || !node.description.length) {
        node.description = $translate.instant("GENERIC.Description");
      }
    };

    service.getContent = function (node) {
      return service.schemaOf(node)._ui._content;
    };

    service.getSize = function (node) {
      return service.schemaOf(node)._ui._size;
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

    service.getCardinalityAsString = function (node) {
      let min = "1";
      let max = "N";
      if (service.getMinItems(node) != null) {
        min = service.getMinItems(node);
      }
      if (service.getMaxItems(node) != null) {
        max = service.getMaxItems(node);
      }
      return "(" + min + ".." + max + ")";
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
      if (typeof(field.minItems) != 'undefined' && !field.items) {

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
          'schema:name'         : field['schema:name'],
          'schema:description'  : field['schema:description'],
        };
        if (hasVersion) {
          field.items['pav:version'] = field['pav:version'];
          field.items['bibo:status'] = field['bibo:status'];
        }
        if (field['skos:prefLabel']) {
          field.items['skos:prefLabel'] = field['skos:prefLabel'];
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
        delete field['schema:name'];
        delete field['schema:description'];
        delete field['skos:prefLabel'];
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
        if (field.items['skos:prefLabel']) {
          field['skos:prefLabel'] = field.items['skos:prefLabel'];
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
        }
        else {
          node.minItems = 1;
          node._valueConstraints.multipleChoice = true;
          service.cardinalizeField(node);
        }
      }
      else { // set multipleChoice to false
        if (node.items) {
          delete node.minItems;
          node.items._valueConstraints.multipleChoice = false;
          service.uncardinalizeField(node);
        }
        else {
          node._valueConstraints.multipleChoice = false;
        }
      }
    };


    //
    // versioning
    //

    // is a draft if status is draft or has no status
    service.isDraft = function (node) {
      return node &&  service.schemaOf(node)['bibo:status'] === 'bibo:draft';
    };

    // is published if has status and it is published
    service.isPublished = function (node) {
      return node &&  service.schemaOf(node)['bibo:status'] === 'bibo:published';
    };

    service.hasVersion = function (node) {
      return node && service.schemaOf(node).hasOwnProperty('pav:version');
    };

    service.getVersion = function (node) {
      if (service.hasVersion(node)) {
        return service.schemaOf(node)['pav:version'];
      }
    };

    service.getTemporalType = function (node) {
      return node && service.schemaOf(node)._valueConstraints.temporalType;
    };


    //
    // inputType
    //

    service.getInputType = function (node) {
      return node && service.schemaOf(node)._ui.inputType;
    };

    service.setInputType = function (node, value) {
      service.schemaOf(node)._ui.inputType = value;
    };

    // Function that generates a basic field definition
    service.isStaticField = function (node) {
      return node && FieldTypeService.isStaticField(service.getInputType(node));
    };

    // is this a numeric field?
    service.isNumericField = function (node) {
      return (service.getInputType(node) === 'numeric');
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

    service.isDateTimeType = function (node) {
      return (service.getInputType(node) === 'temporal');
    };

    service.hasTimeComponent = function (node) {
      return service.isDateTimeType(node) && (service.getTemporalType(node) == 'xsd:dateTime' || service.getTemporalType(node) == 'xsd:time');
    };

    service.hasDateComponent = function (node) {
      return service.isDateTimeType(node) && (service.getTemporalType(node) == 'xsd:dateTime' || service.getTemporalType(node) == 'xsd:date');
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
      if (node && service.hasValueConstraints(node)) return (service.getInputType(node) === 'list') && (service.getValueConstraints(node).multipleChoice);
    };

    // is this a checkbox, radio or list question?
    service.isMultiAnswer = function (node) {
      const inputType = service.getInputType(node);
      return service.isCheckboxListRadioType(inputType);
    };

    service.isCheckboxListRadioType = function (inputType) {
      return ((inputType === 'checkbox') || (inputType === 'radio') || (inputType === 'list'));
    };

    service.isCheckboxListRadio = function (node) {
      const inputType = service.getInputType(node);
      return ((inputType === 'checkbox') || (inputType === 'radio') || (inputType === 'list'));
    };

    // is this a multiple choice list?
    service.isMultipleChoice = function (node) {
      if (node && service.hasValueConstraints(node)) return service.getValueConstraints(node).multipleChoice;
    };

    // is this a checkbox, or a multiple choice list field?
    service.isMultipleChoiceField = function (node) {
      return ((service.getInputType(node) === 'checkbox') || (service.isMultipleChoice(node)));
    };

    // is this a radio, or a sigle-choice ?
    service.isSingleChoiceListField = function (node) {
      const inputType = service.getInputType(node);
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

    // get order array
    service.getOrder = function (node) {
      if (node) return service.schemaOf(node)._ui.order;
    };

    // returns the properties of a template, element, or field schema
    service.propertiesOf = function (node) {
      if (node) return service.schemaOf(node).properties;
    };


    //
    // valueConstraints
    //

    service.getValueConstraints = function (field) {
      return service.schemaOf(field)._valueConstraints;
    };

    service.hasValueConstraints = function (field) {
      return service.schemaOf(field)._valueConstraints;
    };

    service.setValueConstraints = function (field, constraints) {
      service.schemaOf(field)._valueConstraints = constraints;
    };

    service.isConstrained = function (node) {
      let result = false;

      const vcst = service.schemaOf(node)._valueConstraints;
      if (vcst) {
        const hasOntologies = vcst.ontologies && vcst.ontologies.length > 0;
        const hasValueSets = vcst.valueSets && vcst.valueSets.length > 0;
        const hasClasses = vcst.classes && vcst.classes.length > 0;
        const hasBranches = vcst.branches && vcst.branches.length > 0;
        result = hasOntologies || hasValueSets || hasClasses || hasBranches;
      }

      return result;
    };


    service.hasDefaultValueConstraint = function (field) {
      return service.getValueConstraints(field) && service.getValueConstraints(field).defaultValue;
    };

    service.getDefaultValueConstraint = function (field) {
      if (service.hasDefaultValueConstraint(field)) {
        return service.getValueConstraints(field).defaultValue;
      }
    };

    service.removeDefaultValueConstraint = function (constraints) {
      if (constraints) {
        delete constraints.defaultValue;
      }
    };

    service.getDefaultValueConstraintTermId = function (field) {
      if (service.hasDefaultValueConstraint(field)) {
        return service.getDefaultValueConstraint(field)['termUri'];
      }
    };

    service.getDefaultValueConstraintLabel = function (field) {
      if (service.hasDefaultValueConstraint(field)) {
        return service.getDefaultValueConstraint(field)['rdfs:label'];
      }
    };

    service.getDefaultValueConstraintNotation = function (field) {
      if (service.hasDefaultValueConstraint(field)) {
        return service.getDefaultValueConstraint(field)['skos:notation'];
      }
    };

    service.setDefaultValueConstraint = function (field, termId, label, notation, value) {
      let constraints = service.getValueConstraints(field) || {};
      constraints.defaultValue = constraints.defaultValue || {};

      if (termId) constraints.defaultValue['termUri'] = termId;
      if (label) constraints.defaultValue['rdfs:label'] = label;
      if (notation) constraints.defaultValue['skos:notation'] = notation;
      if (value) constraints.defaultValue['@value'] = value;

      service.setValueConstraints(field, constraints);
    };

    // get the value constraint literal values
    service.getLiterals = function (node) {
      if (node && service.hasValueConstraints(node)) return service.getValueConstraints(node).literals;
    };

    // is this a required field or element?
    service.isRequired = function (node) {
      if (node && service.getValueConstraints(node)) return service.getValueConstraints(node).requiredValue;
    };

    service.setRequired = function (node, value) {
      service.getValueConstraints(node).requiredValue = value;
    };

    // min/max string length
    service.hasMinLength = function (node) {
      return service.getValueConstraints(node).hasOwnProperty('minLength');
    };

    service.getMinLength = function (node) {
      return service.hasMinLength(node) && service.getValueConstraints(node).minLength;
    };

    service.hasMaxLength = function (node) {
      return service.getValueConstraints(node).hasOwnProperty('maxLength');
    };

    service.getMaxLength = function (node) {
      return service.hasMaxLength(node) && service.getValueConstraints(node).maxLength;
    };

    // min/max numeric value
    service.hasMinValue = function (node) {
      return node && service.hasValueConstraints(node) && service.getValueConstraints(node).hasOwnProperty('minValue');
    };

    service.getMinValue = function (node) {
      if (service.hasMinValue(node)) {
        return service.getValueConstraints(node).minValue;
      }
    };

    service.hasMaxValue = function (node) {
      return node && service.hasValueConstraints(node) && service.getValueConstraints(node).hasOwnProperty('maxValue')
    };

    service.getMaxValue = function (node) {
      if (service.hasMaxValue(node)) {
        return service.getValueConstraints(node).maxValue;
      }
    };

    service.hasDecimalPlace = function (node) {
      return node && service.hasValueConstraints(node) && service.getValueConstraints(node).hasOwnProperty('decimalPlace');
    };

    service.getDecimalPlace = function (node) {
      return node && service.hasDecimalPlace(node) && service.getValueConstraints(node).decimalPlace;
    };

    service.hasNumberType = function (node) {
      return service.getValueConstraints(node).hasOwnProperty('numberType');
    };

    service.getNumberType = function (node) {
      return service.hasNumberType(node) && service.getValueConstraints(node).numberType;
    };

    service.hasDateTimeType = function (node) {
      return service.getValueConstraints(node).hasOwnProperty('temporalType');
    };

    service.getDateTimeType = function (node) {
      return service.hasDateTimeType(node) && service.getValueConstraints(node).temporalType;
    };

    service.hasUnitOfMeasure = function (node) {
      return service.getValueConstraints(node).hasOwnProperty('unitOfMeasure');
    };

    service.getUnitOfMeasure = function (node) {
      return service.hasUnitOfMeasure(node) && service.getValueConstraints(node).unitOfMeasure;
    };

    service.clearActions = function (node) {
      delete service.schemaOf(node)._valueConstraints.actions;
    };

    service.setActions = function (node,  actions) {
      if (node && actions) {
        service.schemaOf(node)._valueConstraints.actions = actions;
      }
    };

    service.getActions = function (node) {
      let result = [];
      if (node) {
        if (service.schemaOf(node)._valueConstraints.hasOwnProperty('actions')) {
          result= service.schemaOf(node)._valueConstraints.actions;
        }
      }
      return result;
    };

    return service;
  }

});
