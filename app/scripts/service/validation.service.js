'use strict';

define([
  'angular',
  'json!config/validation-service.conf.json'
], function (angular, config) {
  angular.module('cedar.templateEditor.service.validationService', [])
      .service('ValidationService', ValidationService);

  ValidationService.$inject = ["$rootScope", "$timeout", "DataManipulationService", "resourceService",
    "UIMessageService", "CONST"];

  function ValidationService($rootScope, $timeout, DataManipulationService, resourceService, UIMessageService, CONST) {

    const dms = DataManipulationService;
    let validationTypes = [];
    const resourceType = {
      'https://schema.metadatacenter.org/core/Template'           : 'template',
      'https://schema.metadatacenter.org/core/TemplateField'      : 'field',
      'https://schema.metadatacenter.org/core/StaticTemplateField': 'field',
      'https://schema.metadatacenter.org/core/TemplateElement'    : 'element',
    };

    let service = {
      serviceId: "ValidationService"
    };

    service.init = function () {
      validationTypes = config;
    };

    service.getValidationTypes = function () {
      return validationTypes;
    };

    service.isValidationTemplate = function (value, action) {
      let result;
      if (value) {
        var template = value.toLowerCase();
        validationTypes.forEach(function (item, index, array) {
          if (template.indexOf(item.template) > -1) {
            if (item.action.includes(action)) {
              result = item.type;
            }
          }
        });
      }
      return result;
    };

    // validate the json that will be saved
    service.checkValidation = function (data) {
      const cee = document.querySelector('cedar-embeddable-editor');
      let node = jQuery.extend(true, {}, data);
      // let node = jQuery.extend(true, {}, $rootScope.jsonToSave);
      if (node) {
        dms.stripTmps(node);
        dms.updateKeys(node);

        if (node['@type'] && resourceType[node['@type']]) {
          return resourceService.validateResource(
              node, resourceType[node['@type']],
              function (response) {
                service.logValidation(response.validates, angular.toJson(response));
              },
              function (error) {
                UIMessageService.showBackendError('SERVER.FOLDER.load.error', error);
              }
          );
        }
      }
    };

    // report validation status, errors and warnings
    service.logValidation = function (status, report) {

      // tell everybody about the validation status
      $rootScope.$broadcast(CONST.eventId.form.VALIDATION, {state: status});

      // try to parse the report
      if (report) {
        let r;

        try {
          r = JSON.parse(report);
        } catch (e) {
          console.log(e); // error in the above string!
        }


        if (r) {
          if (r.warnings) {
            for (let wi = 0; wi < r.warnings.length; wi++) {
              console.log(
                  'Validation Warning: ' + r.warnings[wi].message + ' at location ' + r.warnings[wi].location);
            }
          }
          if (r.errors) {
            for (let ei = 0; ei < r.errors.length; ei++) {
              console.log('Validation Error: ' + r.errors[ei].message + ' at location ' + r.errors[ei].location);
            }
          }
        }
      }

    };

    service.init();

    return service;
  }

});
