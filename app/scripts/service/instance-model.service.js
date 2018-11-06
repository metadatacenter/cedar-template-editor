'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.service.instanceModelService', [])
      .service('instanceModelService', instanceModelService);

  instanceModelService.$inject = [];

  //
  // This service contains functions manipulate the template, element and field schema model.
  //
  function instanceModelService() {

    var service = {
      serviceId: "instanceModelService"
    };

    //
    // constrained values
    //

    service.hasConstrainedValue = function (model) {
      return model['@id'];
    };

    service.getConstrainedTermId = function (model) {
      return model['@id'];
    };

    service.getConstrainedLabel = function (model) {
      return model['rdfs:label'];
    };

    service.getConstrainedNotation = function (model) {
      return model['skos:notation'];
    };

    service.setConstrainedValue = function (model, termId, label, notation) {
      if (termId) model['@id'] = termId;
      if (label) model['rdfs:label'] = label;
      if (notation) model['skos:notation'] = notation;
      return model;
    };

    service.removeConstrainedValue = function(model) {
      delete model['@id'];
      delete model['rdfs:label'];
      delete model['skos:notation'];
    };



    return service;
  };

});
