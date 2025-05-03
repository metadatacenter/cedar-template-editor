'use strict';

define([
  'angular'
], function (angular) {
  // TODO: required by template module; more?
  angular.module('cedar.templateEditor.service.stagingService', [])
      .service('StagingService', StagingService);

  StagingService.$inject = ["$rootScope", "$document", "TemplateElementService", "TemplateFieldService",
                            "DataManipulationService",'schemaService',
                            "UIUtilService", "$translate",
                            "ClientSideValidationService", "UIMessageService", "FieldTypeService", "$timeout",
                            "AuthorizedBackendService", "DataTemplateService",
                            "CONST"];

  function StagingService($rootScope, $document, TemplateElementService, TemplateFieldService,
                          DataManipulationService,schemaService, UIUtilService, $translate,
                          ClientSideValidationService, UIMessageService, FieldTypeService, $timeout,
                          AuthorizedBackendService, DataTemplateService, CONST) {

    var dms = DataManipulationService;
    var service = {
      serviceId        : "StagingService",
      pageId           : null,
      stagingObjectType: CONST.stagingObject.NONE
    };

    service.configure = function (pageId) {
      this.pageId = pageId;
      this.stagingObjectType = CONST.stagingObject.NONE;
      this.updateStatus();
    };

    service.addField = function () {
      this.stagingObjectType = CONST.stagingObject.FIELD;
      this.updateStatus();
    };

    service.addElement = function () {
      this.stagingObjectType = CONST.stagingObject.ELEMENT;
      this.updateStatus();
    };

    service.removeObject = function () {
      this.stagingObjectType = CONST.stagingObject.NONE;
      this.updateStatus();
    };

    service.moveIntoPlace = function () {
      this.stagingObjectType = CONST.stagingObject.NONE;
      this.updateStatus();
    };

    service.resetPage = function () {
      this.stagingObjectType = CONST.stagingObject.NONE;
      this.updateStatus();
    };

    service.isEmpty = function () {
      return this.stagingObjectType === CONST.stagingObject.NONE;
    };

    service.updateStatus = function () {
      $rootScope.stagingVisible = (this.stagingObjectType !== CONST.stagingObject.NONE);
    };

    service.addElementWithId = function ($scope, elementId) {
      $scope.staging = {};
      $scope.previewForm = {};

      AuthorizedBackendService.doCall(
          TemplateElementService.getTemplateElement(elementId),
          function (response) {
            var newElement = response.data;
            newElement.minItems = 0;
            newElement.maxItems = 1;
            $scope.staging[newElement['@id']] = newElement;
            $timeout(function () {
              var title = DataManipulationService.getTitle(newElement);
              var fieldName = DataManipulationService.getFieldName(title);
              $scope.previewForm.properties = {};
              $scope.previewForm.properties[fieldName] = newElement;
            });
          },
          function (err) {
            UIMessageService.showBackendError('SERVER.ELEMENT.load.error', err);
          }
      );
    };

    service.addFieldToForm = function (form, fieldType, firstClassField, divId, callback) {
      let field = DataManipulationService.generateField(fieldType, firstClassField);
      UIUtilService.setSelected(field);

      // is it a checkbox, list, or radio field?
      if (schemaService.isCheckboxListRadioType(fieldType)) {
        if (fieldType === 'checkbox') { // multiple choice field (checkbox)
          field.items._valueConstraints.multipleChoice = true;
          field.items._valueConstraints.literals = [
            {
              "label": ""
            }
          ];
        }
        else { // single choice field (radio or single-choice list)
          field._valueConstraints.multipleChoice = false;
          field._valueConstraints.literals = [
            {
              "label": ""
            }
          ];
        }
      } else if (fieldType === 'boolean') {
        field._valueConstraints.multipleChoice = false;
        field._valueConstraints.labels = {
          'true': $translate.instant('FIELDS.FIELD_TYPE.boolean.True'),
          'false': $translate.instant('FIELDS.FIELD_TYPE.boolean.False'),
          'null': $translate.instant('FIELDS.FIELD_TYPE.boolean.Null')
        };
        field._valueConstraints.defaultValue = 'false';
      }

      // Converting title for irregular character handling
      let fieldName = DataManipulationService.generateGUID(); //field['@id'];

      // Adding corresponding property type to @context (only if the field is not static)
      if (!FieldTypeService.isStaticField(fieldType)) {
        var randomPropertyName = DataManipulationService.generateGUID();
        form.properties["@context"].properties[fieldName] = DataManipulationService.generateFieldContextProperties(
            randomPropertyName);
      }

      // Evaluate cardinality
      if (!DataManipulationService.firstClassField(form, field)) {
        schemaService.cardinalizeField(field);
      }

      // Add field to the form.properties object
      form.properties[fieldName] = field;

      // Add field to the form.required array if it's not static
      if (!schemaService.isStaticField(field) && !schemaService.isAttributeValueType(field)) {
        form = DataManipulationService.addKeyToRequired(form, fieldName);
      }

      form._ui.order = form._ui.order || [];
      form._ui.order.push(fieldName);

      form._ui.propertyLabels = form._ui.propertyLabels || {};
      form._ui.propertyLabels[fieldName] = "Untitled";
      form._ui.propertyDescriptions = form._ui.propertyDescriptions || {};
      form._ui.propertyDescriptions[fieldName] = "Help Text";

      DataManipulationService.addDomIdIfNotPresent(field, divId);
      callback(field);

      DataManipulationService.updateAdditionalProperties(form);

      return field;
    };

    service.addElementToForm = function (form, elementId, divId, callback) {
      AuthorizedBackendService.doCall(
          TemplateElementService.getTemplateElement(elementId),
          function (response) {
            var clonedElement = response.data;
            UIUtilService.setSelected(clonedElement);

            // Converting title for irregular character handling
            var title = DataManipulationService.getTitle(clonedElement);
            var description = DataManipulationService.getDescription(clonedElement);
            var elName = DataManipulationService.getFieldName(title);
            elName = DataManipulationService.getAcceptableKey(form.properties, elName);

            // Adding corresponding property type to @context
            var randomPropertyName = DataManipulationService.generateGUID();
            form.properties["@context"].properties[elName] = DataManipulationService.generateFieldContextProperties(randomPropertyName);
            form.properties["@context"].required = form.properties["@context"].required || [];
            form.properties["@context"].required.push(elName);

            // Evaluate cardinality
            schemaService.cardinalizeField(clonedElement);

            // Add field to the element.properties object
            form.properties[elName] = clonedElement;

            // Add element to the form.required array
            form = DataManipulationService.addKeyToRequired(form, elName);

            // push to order array
            form._ui.order = form._ui.order || [];
            form._ui.order.push(elName);

            // add to property label and description
            form._ui.propertyLabels = form._ui.propertyLabels || {};
            form._ui.propertyLabels[elName] = title;
            form._ui.propertyDescriptions = form._ui.propertyDescriptions || {};
            form._ui.propertyDescriptions[elName] = description;


            DataManipulationService.addDomIdIfNotPresent(clonedElement, divId);
            callback(clonedElement);


          },
          function (err) {
            UIMessageService.showBackendError('SERVER.ELEMENT.load.error', err);
          }
      );
    };

    service.addStandAloneFieldToForm = function (form, elementId, divId, callback) {

      AuthorizedBackendService.doCall(
          TemplateFieldService.getTemplateField(elementId),
          function (response) {
            var clonedElement = response.data;
            UIUtilService.setSelected(clonedElement);

            // Converting title for irregular character handling
            var title = DataManipulationService.getTitle(clonedElement);
            var description = DataManipulationService.getDescription(clonedElement);
            var elName = DataManipulationService.getFieldName(title);
            elName = DataManipulationService.getAcceptableKey(form.properties, elName);



            // Adding corresponding property type to @context
            var randomPropertyName = DataManipulationService.generateGUID();
            form.properties["@context"].properties[elName] = DataManipulationService.generateFieldContextProperties(
                randomPropertyName);

            form.properties["@context"].required = form.properties["@context"].required || [];
            form.properties["@context"].required.push(elName);


            // Evaluate cardinality
            if (dms.isCheckboxType(clonedElement) || dms.isListMultiAnswerType(clonedElement) ) {
              clonedElement.minItems = 1;
            }
            schemaService.cardinalizeField(clonedElement);

            // Add field to the element.properties object
            form.properties[elName] = clonedElement;

            // Add element to the form.required array
            form = DataManipulationService.addKeyToRequired(form, elName);

            form._ui.order = form._ui.order || [];
            form._ui.order.push(elName);

            form._ui.propertyLabels = form._ui.propertyLabels || {};
            form._ui.propertyLabels[elName] = title;
            form._ui.propertyDescriptions = form._ui.propertyDescriptions || {};
            form._ui.propertyDescriptions[elName] = description;



            DataManipulationService.addDomIdIfNotPresent(clonedElement, divId);
            callback(clonedElement);


          },
          function (err) {
            UIMessageService.showBackendError('SERVER.ELEMENT.load.error', err);
          }
      );
    };

    service.addClonedElementToForm = function (form, elementId, clonedElement, divId, callback) {

      UIUtilService.setSelected(clonedElement);

      // Converting title for irregular character handling
      var title = DataManipulationService.getTitle(clonedElement);
      var description = DataManipulationService.getDescription(clonedElement);
      var elName = DataManipulationService.getFieldName(title);
      elName = DataManipulationService.getAcceptableKey(form.properties, elName);

      // Adding corresponding property type to @context
      var randomPropertyName = DataManipulationService.generateGUID();
      form.properties["@context"].properties[elName] = DataManipulationService.generateFieldContextProperties(
          randomPropertyName);
      form.properties["@context"].required.push(elName);

      // Evaluate cardinality
      schemaService.cardinalizeField(clonedElement);

      // Add field to the element.properties object
      form.properties[elName] = clonedElement;

      // Add element to the form.required array
      form = DataManipulationService.addKeyToRequired(form, elName);

      form._ui.order = form._ui.order || [];
      form._ui.order.push(elName);

      form._ui.propertyLabels = form._ui.propertyLabels || {};
      form._ui.propertyLabels[elName] = title;
      form._ui.propertyDescriptions = form._ui.propertyDescriptions || {};
      form._ui.propertyDescriptions[elName] = description;


      DataManipulationService.addDomIdIfNotPresent(clonedElement, divId);
      callback(clonedElement);

      return clonedElement;

    };

    service.addFieldToElement = function (element, fieldType) {
      var field = DataManipulationService.generateField(fieldType);
      UIUtilService.setSelected(field);

      // is it a checkbox, list, or radio field?
      if (schemaService.isCheckboxListRadioType(fieldType)) {
        if (fieldType === 'checkbox') { // multiple choice field (checkbox)
          field.items._valueConstraints.multipleChoice = true;
          field.items._valueConstraints.literals = [
            {
              "label": ""
            }
          ];
        }
        else { // single choice field (radio or single-choice list)
          field._valueConstraints.multipleChoice = false;
          field._valueConstraints.literals = [
            {
              "label": ""
            }
          ];
        }
      }

      // Converting title for irregular character handling
      var fieldName = DataManipulationService.generateGUID(); //field['@id'];

      // Adding corresponding property type to @context (only if the field is not static)
      if (!FieldTypeService.isStaticField(fieldType)) {
        var randomPropertyName = DataManipulationService.generateGUID();
        element.properties["@context"].properties[fieldName] = DataManipulationService.generateFieldContextProperties(
            randomPropertyName);
        if (!element.properties["@context"].required) {
          element.properties["@context"].required = []
        }
        element.properties["@context"].required.push(fieldName);
      }

      // Evaluate cardinality
      schemaService.cardinalizeField(field);

      // Adding field to the element.properties object
      element.properties[fieldName] = field;

      // Add field to the element.required array if it's not static
      if (!DataManipulationService.isStaticField(field) && !schemaService.isAttributeValueType(field)) {
        element = DataManipulationService.addKeyToRequired(element, fieldName);
      }

      element._ui.order.push(fieldName);

      element._ui.propertyLabels = element._ui.propertyLabels || {};
      element._ui.propertyLabels[fieldName] = "Untitled";
      element._ui.propertyDescriptions = element._ui.propertyDescriptions || {};
      element._ui.propertyDescriptions[fieldName] = "Help Text";

      DataManipulationService.updateAdditionalProperties(element);

      return field;
    };

    // add a field to a firstClassField container
    service.addFieldToField = function (fieldType) {

      var field = DataManipulationService.generateField(fieldType, true);
      UIUtilService.setSelected(field);

      //is it a checkbox, list, or radio field?
      if (schemaService.isCheckboxListRadioType(fieldType)) {

        field._valueConstraints.multipleChoice = false;
        field._valueConstraints.literals = [
          {
            "label": ""
          }
        ];
      }

      if (schemaService.isCheckboxType(field)) {
        field._valueConstraints.multipleChoice = true;
      }

      return field;
    };

    return service;
  }

});
