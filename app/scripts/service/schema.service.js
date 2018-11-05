'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.service.schemaService', [])
      .service('schemaService', schemaService);

  schemaService.$inject = [];

  //
  // This service contains functions manipulate the template, element and field schema model.
  //
  function schemaService() {

    var service = {
      serviceId: "schemaService"
    };

   // Service functions...

    // Returns the field schema. If the field is defined as an array, this function will return field.items, because the schema is defined at that level.
    service.schemaOf = function (field) {
      if (field) {
        if (field.type == 'array' && field.items) {
          return field.items;
        } else {
          return field;
        }
      }
    };

    //
    // valueConstraints
    //

    service.getValueConstraints = function (field) {
      return service.schemaOf(field)._valueConstraints;
    };

    service.setValueConstraints = function (field, constraints) {
      service.schemaOf(field)._valueConstraints = constraints;
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


    return service;
  };

});
