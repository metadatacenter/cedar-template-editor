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
      return schemaService.getAllLabels(schema);
    };

    // Updates the preferred label with the new label entered by the user
    service.updateModelWhenTyping = function (schema, value) {
      if (value.length > 0 && value != schemaService.getPreferredLabel(schema)) {
        schemaService.setPreferredLabel(schema, value);
      }
    };

    return service;
  }

});