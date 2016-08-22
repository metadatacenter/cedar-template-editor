'use strict';

define([
  'angular'
], function(angular) {
  // TODO: required by staging service; more?
  angular.module('cedar.templateEditor.service.clientSideValidationService', [])
    .service('ClientSideValidationService', ClientSideValidationService);

  ClientSideValidationService.$inject = ['$translate'];

  function ClientSideValidationService($translate) {

    var service = {
      serviceId: "ClientSideValidationService"
    };

    service.checkFieldConditions = function (field) {
      // Empty array to push 'error messages' into
      var unmetConditions      = [],
      extraConditionInputs = ['checkbox', 'radio', 'list'];

      // Field title is already required, if it's empty create error message
      if (!field._ui.title.length) {
        unmetConditions.push($translate.instant("VALIDATION.fieldTitleEmpty"));
      }

      // If field is within multiple choice field types
      if (extraConditionInputs.indexOf(field._ui.inputType) !== -1) {
        var optionMessage = $translate.instant("VALIDATION.optionEmpty");
        angular.forEach(field._valueConstraints.literals, function (value, index) {
          // If any 'option' title text is left empty, create error message
          if (!value.label.length && unmetConditions.indexOf(optionMessage) == -1) {
            unmetConditions.push(optionMessage);
          }
        });
      }
      // If field type is 'radio' or 'pick from a list' there must be more than one option created
      if ((field._ui.inputType == 'radio' || field._ui.inputType == 'list') && field._valueConstraints.literals && (field._valueConstraints.literals.length <= 1)) {
        unmetConditions.push($translate.instant("VALIDATION.multipleChoiceTooFew"));
      }
      // Return array of error messages
      return unmetConditions;
    };

    service.checkFieldCardinalityOptions = function (field) {
      var unmetConditions = [];

      if (field.minItems && field.maxItems &&
          parseInt(field.minItems) > parseInt(field.maxItems)) {
        unmetConditions.push($translate.instant('VALIDATION.minBiggerThanMax'));
      }

      return unmetConditions;
    };

    return service;
  };

});
