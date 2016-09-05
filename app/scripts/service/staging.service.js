'use strict';

define([
  'angular'
], function (angular) {
  // TODO: required by template module; more?
  angular.module('cedar.templateEditor.service.stagingService', [])
      .service('StagingService', StagingService);

  StagingService.$inject = ["$rootScope", "$document", "TemplateElementService", "DataManipulationService",
                            "ClientSideValidationService", "UIMessageService", "$timeout", "AuthorizedBackendService",
                            "CONST"];

  function StagingService($rootScope, $document, TemplateElementService, DataManipulationService,
                          ClientSideValidationService,
                          UIMessageService, $timeout, AuthorizedBackendService, CONST) {

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
      console.debug('addFieldToStaging' + fieldType);
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

      // Adding corresponding property type to @context
      form.properties["@context"].properties[fieldName] = DataManipulationService.generateFieldContextProperties(fieldName);
      form.properties["@context"].required.push(fieldName);

      // Evaluate cardinality
      DataManipulationService.cardinalizeField(field);

      // Adding field to the element.properties object
      form.properties[fieldName] = field;
      form._ui.order = form._ui.order || [];
      form._ui.order.push(fieldName);

      DataManipulationService.addDomIdIfNotPresent(field, divId);
      callback(field);

      return field;
    };

    service.addElementToForm = function (form, elementId, divId, callback) {
      AuthorizedBackendService.doCall(
          TemplateElementService.getTemplateElement(elementId),
          function (response) {
            var clonedElement = response.data;
            //clonedElement.minItems = 1;
            //clonedElement.maxItems = 1;

            var elProperties = DataManipulationService.getFieldProperties(clonedElement);
            DataManipulationService.setSelected(clonedElement);
            //elProperties._tmp = elProperties._tmp || {};
            //elProperties._tmp.state = "creating";

            // Converting title for irregular character handling
            var elName = DataManipulationService.getFieldName(clonedElement._ui.title);
            elName = DataManipulationService.getAcceptableKey(form.properties, elName);

            // Adding corresponding property type to @context
            form.properties["@context"].properties[elName] = DataManipulationService.generateFieldContextProperties(elName);
            form.properties["@context"].required.push(elName);

            // Evaluate cardinality
            DataManipulationService.cardinalizeField(clonedElement);

            // Adding field to the element.properties object
            form.properties[elName] = clonedElement;
            form._ui.order = form._ui.order || [];
            form._ui.order.push(elName);

            DataManipulationService.addDomIdIfNotPresent(clonedElement, divId);
            callback(clonedElement);

          },
          function (err) {
            UIMessageService.showBackendError('SERVER.ELEMENT.load.error', err);
          }
      );
    };

    service.addFieldToElement = function (element, fieldType) {
      var field = DataManipulationService.generateField(fieldType);
      DataManipulationService.setSelected(field);
      //field.properties._tmp = field.properties._tmp || {};
      //field.properties._tmp.state = "creating";

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

      // Adding corresponding property type to @context
      element.properties["@context"].properties[fieldName] = DataManipulationService.generateFieldContextProperties(fieldName);
      element.properties["@context"].required.push(fieldName);

      // Evaluate cardinality
      DataManipulationService.cardinalizeField(field);

      // Adding field to the element.properties object
      element.properties[fieldName] = field;
      element._ui.order.push(fieldName);
    };

    service.addElementToElement = function (element, elementId) {
      AuthorizedBackendService.doCall(
          TemplateElementService.getTemplateElement(elementId),
          function (response) {
            var el = response.data;
            //el.minItems = 0;
            //el.maxItems = 1;

            var elProperties = DataManipulationService.getFieldProperties(el);
            DataManipulationService.setSelected(el);
            //elProperties._tmp = elProperties._tmp || {};
            //elProperties._tmp.state = "creating";

            var elName = DataManipulationService.getFieldName(el._ui.title);
            elName = DataManipulationService.getAcceptableKey(element.properties, elName);

            element.properties["@context"].properties[elName] = DataManipulationService.generateFieldContextProperties(elName);
            element.properties["@context"].required.push(elName);

            // Evaluate cardinality
            DataManipulationService.cardinalizeField(el);

            // Adding field to the element.properties object
            element.properties[elName] = el;
            element._ui.order.push(elName);
          },
          function (err) {
            UIMessageService.showBackendError('SERVER.ELEMENT.load.error', err);
          }
      );
    }

    // Add newly configured field to the the $scope.form or $scope.element
    service.addFieldToScopeAndStaging = function ($scope, targetObject, field) {
      // Setting return value from $scope.checkFieldConditions to array which will display error messages if any
      $scope.stagingErrorMessages = ClientSideValidationService.checkFieldConditions(field);
      $scope.stagingErrorMessages = jQuery.merge($scope.stagingErrorMessages,
          ClientSideValidationService.checkFieldCardinalityOptions(field));

      if ($scope.stagingErrorMessages.length == 0) {
        // Converting title for irregular character handling
        var fieldName = DataManipulationService.getFieldName($rootScope.schemaOf(field)._ui.title);
        // Adding corresponding property type to @context
        targetObject.properties["@context"].properties[fieldName] = DataManipulationService.generateFieldContextProperties(
            fieldName);
        targetObject.properties["@context"].required.push(fieldName);
        targetObject.required.push(fieldName);

        // Evaluate cardinality
        DataManipulationService.cardinalizeField(field);

        // Adding field to the element.properties object
        targetObject.properties[fieldName] = field;

        // Lastly, remove this field from the $scope.staging object
        $scope.staging = {};
        this.moveIntoPlace();
      }
    };

    return service;
  };

});
