'use strict';

define([
  'angular'
], function(angular) {
  // TODO: required by staging service; more?
  angular.module('cedar.templateEditor.service.clientSideValidationService', [])
    .service('ClientSideValidationService', ClientSideValidationService);

  ClientSideValidationService.$inject = ['$translate','DataManipulationService','schemaService'];

  function ClientSideValidationService($translate, DataManipulationService,schemaService) {

    var service = {
      serviceId: "ClientSideValidationService"
    };

    service.checkFieldConditions = function (field) {
      // Empty array to push 'error messages' into
      var unmetConditions      = [],
      extraConditionInputs = ['checkbox', 'radio', 'list'];

      var schema = schemaService.schemaOf(field);
      var title = schemaService.getTitle(field);
      var inputType = schemaService.getInputType(field);
      var literals = schemaService.getLiterals(field); // field._valueConstraints.literals


      // Field title is already required, if it's empty create error message
      if (!title || !title.length) {
        unmetConditions.push($translate.instant("VALIDATION.fieldTitleEmpty"));
      }

      // If field is within multiple choice field types
      if (extraConditionInputs.indexOf(inputType) !== -1) {
        var optionMessage = $translate.instant("VALIDATION.optionEmpty");
        angular.forEach(literals, function (value, index) {
          // If any 'option' title text is left empty, create error message
          if (!value.label.length && unmetConditions.indexOf(optionMessage) == -1) {
            unmetConditions.push(optionMessage);
          }
        });
      }
      // If field type is 'radio' or 'pick from a list' there must be more than one option created
      if ((inputType == 'radio' || inputType == 'list') && literals && (literals.length <= 1)) {
        unmetConditions.push($translate.instant("VALIDATION.multipleChoiceTooFew"));
      }
      // Return array of error messages
      return unmetConditions;
    };

    service.checkFieldCardinalityOptions = function (field) {
      var unmetConditions = [];
      var minItems = schemaService.getMinItems(field);
      var maxItems = schemaService.getMaxItems(field);

      if (minItems && maxItems &&
          parseInt(minItems) > parseInt(maxItems)) {
        unmetConditions.push($translate.instant('VALIDATION.minBiggerThanMax'));
      }

      return unmetConditions;
    };

    return service;
  };

});
