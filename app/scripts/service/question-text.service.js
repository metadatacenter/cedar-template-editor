'use strict';


define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.service.questionTextService', [])
      .service('QuestionTextService', QuestionTextService);

  QuestionTextService.$inject = ["$rootScope", "schemaService"];

  function QuestionTextService($rootScope, schemaService) {

    let service = {
      serviceId: "QuestionTextService"
    };

    service.getCandidateLabels = function(schema) {
      return schemaService.getAlternateLabels(schema);
    };

    // Updates the preferred label with the new label entered by the user (only for unpublished fields)
    service.updateModelWhenTyping = function (schema, value, isPublished) {
      if (!isPublished) {
        if (value.length > 0 && value != schemaService.getPreferredLabel(schema)) {
          schemaService.setPreferredLabel(schema, value);
        }
      }
      else {
        // Do nothing. For published fields, we don't allow typing a new preferred label
      }
    };

    return service;
  }

});