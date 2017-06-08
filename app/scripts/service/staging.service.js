'use strict';

define([
  'angular'
], function (angular) {
  // TODO: required by template module; more?
  angular.module('cedar.templateEditor.service.stagingService', [])
      .service('StagingService', StagingService);

  StagingService.$inject = ["$rootScope", "$document", "TemplateElementService", "DataManipulationService",
                            "ClientSideValidationService", "UIMessageService", "FieldTypeService", "$timeout", "AuthorizedBackendService",
                            "CONST"];

  function StagingService($rootScope, $document, TemplateElementService, DataManipulationService,
                          ClientSideValidationService,
                          UIMessageService, FieldTypeService, $timeout, AuthorizedBackendService, CONST) {

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
      return this.stagingObjectType == CONST.stagingObject.NONE;
    };

    service.updateStatus = function () {
      $rootScope.stagingVisible = (this.stagingObjectType != CONST.stagingObject.NONE);
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
              var fieldName = DataManipulationService.getFieldName(newElement._ui.title);
              $scope.previewForm.properties = {};
              $scope.previewForm.properties[fieldName] = newElement;
            });
          },
          function (err) {
            UIMessageService.showBackendError('SERVER.ELEMENT.load.error', err);
          }
      );
    };

    // Add new field into $scope.staging object
    service.addFieldToStaging = function ($scope, fieldType) {
      this.addField();
      var field = DataManipulationService.generateField(fieldType);
      field.minItems = 0;
      field.maxItems = 1;

      // If fieldtype can have multiple options, additional parameters on field object are necessary
      var optionInputs = ["radio", "checkbox", "list"];

      if (optionInputs.indexOf(fieldType) > -1) {
        field._valueConstraints.literals = [
          {
            "label": ""
          }
        ];
        if (fieldType == 'radio') {
          field._valueConstraints.multipleChoice = false;
        }
        else if (fieldType == 'checkbox') {
          field._valueConstraints.multipleChoice = true;
        }
      }
      // empty staging object (only one field should be configurable at a time)
      $scope.staging = {};
      // put field into fields staging object
      $scope.staging[field['@id']] = field;
    };

    service.addFieldToForm = function (form, fieldType, divId, callback) {
      var field = DataManipulationService.generateField(fieldType);
      DataManipulationService.setSelected(field);

      var optionInputs = ["radio", "checkbox", "list"];
      if (optionInputs.indexOf(fieldType) > -1) {
        field._valueConstraints.literals = [
          {
            "label": ""
          }
        ];
        if (fieldType == 'radio') {
          field._valueConstraints.multipleChoice = false;
        }
        else if (fieldType == 'checkbox') {
          field._valueConstraints.multipleChoice = true;
        }
      }

      // Converting title for irregular character handling
      var fieldName = DataManipulationService.generateGUID(); //field['@id'];

      // Adding corresponding property type to @context (only if the field is not static)
      if (!FieldTypeService.isStaticField(fieldType)) {
        form.properties["@context"].properties[fieldName] = DataManipulationService.generateFieldContextProperties(fieldName);
        form.properties["@context"].required.push(fieldName);
      }

      // Evaluate cardinality
      DataManipulationService.cardinalizeField(field);

      // Add field to the form.properties object
      form.properties[fieldName] = field;

      // Add field to the form.required array if it's not static
      if (!DataManipulationService.isStaticField(field)) {
        form = DataManipulationService.addKeyToRequired(form, fieldName);
      }

      form._ui.order = form._ui.order || [];
      form._ui.order.push(fieldName);

      form._ui.propertyLabels = form._ui.propertyLabels || {};

      DataManipulationService.addDomIdIfNotPresent(field, divId);
      callback(field);

      return field;
    };

    service.addElementToForm = function (form, elementId, divId, callback) {
      AuthorizedBackendService.doCall(
          TemplateElementService.getTemplateElement(elementId),
          function (response) {
            var clonedElement = response.data;
            DataManipulationService.setSelected(clonedElement);

            // Converting title for irregular character handling
            var elName = DataManipulationService.getFieldName(clonedElement._ui.title);
            elName = DataManipulationService.getAcceptableKey(form.properties, elName);

            // Adding corresponding property type to @context
            form.properties["@context"].properties[elName] = DataManipulationService.generateFieldContextProperties(elName);
            form.properties["@context"].required.push(elName);

            // Evaluate cardinality
            DataManipulationService.cardinalizeField(clonedElement);

            // Add field to the element.properties object
            form.properties[elName] = clonedElement;

            // Add element to the form.required array
            form = DataManipulationService.addKeyToRequired(form, elName);

            form._ui.order = form._ui.order || [];
            form._ui.order.push(elName);

            form._ui.propertyLabels = form._ui.propertyLabels || {};
            form._ui.propertyLabels[elName] = elName;


            DataManipulationService.addDomIdIfNotPresent(clonedElement, divId);
            callback(clonedElement);

          },
          function (err) {
            UIMessageService.showBackendError('SERVER.ELEMENT.load.error', err);
          }
      );
    };

    service.addClonedElementToForm = function (form, elementId, clonedElement, divId, callback) {

            DataManipulationService.setSelected(clonedElement);

            // Converting title for irregular character handling
            var elName = DataManipulationService.getFieldName(clonedElement._ui.title);
            elName = DataManipulationService.getAcceptableKey(form.properties, elName);

            // Adding corresponding property type to @context
            form.properties["@context"].properties[elName] = DataManipulationService.generateFieldContextProperties(elName);
            form.properties["@context"].required.push(elName);

            // Evaluate cardinality
            DataManipulationService.cardinalizeField(clonedElement);

            // Add field to the element.properties object
            form.properties[elName] = clonedElement;

            // Add element to the form.required array
            form = DataManipulationService.addKeyToRequired(form, elName);

            form._ui.order = form._ui.order || [];
            form._ui.order.push(elName);

            form._ui.propertyLabels = form._ui.propertyLabels || {};
            form._ui.propertyLabels[elName] = elName;


            DataManipulationService.addDomIdIfNotPresent(clonedElement, divId);
            callback(clonedElement);

            return clonedElement;

    };

    service.addFieldToElement = function (element, fieldType) {
      var field = DataManipulationService.generateField(fieldType);
      DataManipulationService.setSelected(field);

      var optionInputs = ["radio", "checkbox", "list"];
      if (optionInputs.indexOf(fieldType) > -1) {
        field._valueConstraints.literals = [
          {
            "label": ""
          }
        ];
      }

      // Converting title for irregular character handling
      var fieldName = DataManipulationService.generateGUID(); //field['@id'];

      // Adding corresponding property type to @context (only if the field is not static)
      if (!FieldTypeService.isStaticField(fieldType)) {
        element.properties["@context"].properties[fieldName] = DataManipulationService.generateFieldContextProperties(fieldName);
        element.properties["@context"].required.push(fieldName);
      }
      // Evaluate cardinality
      DataManipulationService.cardinalizeField(field);

      // Adding field to the element.properties object
      element.properties[fieldName] = field;

      // Add field to the element.required array it it's not static
      if (!DataManipulationService.isStaticField(field)) {
        element = DataManipulationService.addKeyToRequired(element, fieldName);
      }

      element._ui.order.push(fieldName);

      element._ui.propertyLabels = element._ui.propertyLabels || {};

      return field;
    };

    service.addElementToElement = function (element, elementId) {
      AuthorizedBackendService.doCall(
          TemplateElementService.getTemplateElement(elementId),
          function (response) {
            var el = response.data;
            DataManipulationService.setSelected(el);

            var elName = DataManipulationService.getFieldName(el._ui.title);
            elName = DataManipulationService.getAcceptableKey(element.properties, elName);

            element.properties["@context"].properties[elName] = DataManipulationService.generateFieldContextProperties(elName);
            element.properties["@context"].required.push(elName);

            // Evaluate cardinality
            DataManipulationService.cardinalizeField(el);

            // Add field to the element.properties object
            element.properties[elName] = el;

            // Add element to the element.required array
            element = DataManipulationService.addKeyToRequired(element, elName);

            element._ui.order.push(elName);

            element._ui.propertyLabels = element._ui.propertyLabels || {};
            element._ui.propertyLabels[elName] = elName;

           DataManipulationService.createDomIds(element);
          },
          function (err) {
            UIMessageService.showBackendError('SERVER.ELEMENT.load.error', err);
          }
      );
    }

    // Add newly configured field to the the $scope.form or $scope.element
    // service.addFieldToScopeAndStaging = function ($scope, targetObject, field) {
    //   // Setting return value from $scope.checkFieldConditions to array which will display error messages if any
    //   $scope.stagingErrorMessages = ClientSideValidationService.checkFieldConditions(field);
    //   $scope.stagingErrorMessages = jQuery.merge($scope.stagingErrorMessages,
    //       ClientSideValidationService.checkFieldCardinalityOptions(field));
    //
    //   if ($scope.stagingErrorMessages.length == 0) {
    //     // Converting title for irregular character handling
    //     var fieldName = DataManipulationService.getFieldName($rootScope.schemaOf(field)._ui.title);
    //     // Adding corresponding property type to @context
    //     targetObject.properties["@context"].properties[fieldName] = DataManipulationService.generateFieldContextProperties(
    //         fieldName);
    //     targetObject.properties["@context"].required.push(fieldName);
    //     targetObject.required.push(fieldName);
    //
    //     // Evaluate cardinality
    //     DataManipulationService.cardinalizeField(field);
    //
    //     // Adding field to the element.properties object
    //     targetObject.properties[fieldName] = field;
    //
    //     // Lastly, remove this field from the $scope.staging object
    //     $scope.staging = {};
    //     this.moveIntoPlace();
    //   }
    // };

    return service;
  };

});
