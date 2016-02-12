'use strict';

var StagingService = function ($rootScope, TemplateElementService, DataManipulationService, ClientSideValidationService,
                               UIMessageService, $timeout, CONST) {

  var service = {
    serviceId        : "StagingService",
    pageId           : null,
    stagingObjectType: CONST.stagingObject.NONE,
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
          newElement.minItems = 1;
          newElement.maxItems = 1;
          $scope.staging[newElement['@id']] = newElement;
          $timeout(function () {
            var fieldName = DataManipulationService.getFieldName(newElement.properties._ui.title);
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
    field.minItems = 1;
    field.maxItems = 1;

    // If fieldtype can have multiple options, additional parameters on field object are necessary
    var optionInputs = ["radio", "checkbox", "list"];

    if (optionInputs.indexOf(fieldType) > -1) {
      field.properties._ui.options = [
        {
          "text": ""
        }
      ];
    }
    // empty staging object (only one field should be configurable at a time)
    $scope.staging = {};
    // put field into fields staging object
    $scope.staging[field['@id']] = field;
  };

  // Add newly configured field to the the $scope.form or $scope.element
  service.addFieldToScopeAndStaging = function ($scope, targetObject, field) {
    // Setting return value from $scope.checkFieldConditions to array which will display error messages if any
    $scope.stagingErrorMessages = ClientSideValidationService.checkFieldConditions(field.properties);
    $scope.stagingErrorMessages = jQuery.merge($scope.stagingErrorMessages,
        ClientSideValidationService.checkFieldCardinalityOptions(field));

    if ($scope.stagingErrorMessages.length == 0) {
      // Converting title for irregular character handling
      var fieldName = DataManipulationService.getFieldName(field.properties._ui.title);
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

StagingService.$inject = ["$rootScope", "TemplateElementService", "DataManipulationService",
                          "ClientSideValidationService",
                          "UIMessageService", "$timeout", "CONST"];
angularApp.service('StagingService', StagingService);