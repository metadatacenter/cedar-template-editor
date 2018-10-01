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

    var dms = DataManipulationService;
    var validationTypes = [];
    var resourceType = {
      'https://schema.metadatacenter.org/core/Template'       : 'template',
      'https://schema.metadatacenter.org/core/TemplateField'  : 'field',
      'https://schema.metadatacenter.org/core/TemplateElement': 'element',
    };

    var service = {
      serviceId: "ValidationService"
    };

    service.init = function () {
      validationTypes = config;
    };

    service.getValidationTypes = function () {
      return validationTypes;
    };

    service.isValidationTemplate = function (value, action) {
      var result;
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

    // service.getUrl = function (type) {
    //   var result = validationTypes.filter(function (e) {
    //     console.log(e.type + ' ' + type);
    //     if (e.type == type) {
    //       console.log(e.url);
    //       return e.url;
    //     }
    //   });
    //   return result;
    // };

    // validate the json that will be saved
    service.checkValidation = function () {

      var node = jQuery.extend(true, {}, $rootScope.jsonToSave);
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
        var r;

        try {
          r = JSON.parse(report);
        } catch (e) {
          console.log(e); // error in the above string!
        }


        if (r) {
          if (r.warnings) {
            for (var i = 0; i < r.warnings.length; i++) {
              console.log(
                  'Validation Warning: ' + r.warnings[i].message + ' at location ' + r.warnings[i].location);
            }
          }
          if (r.errors) {
            for (var i = 0; i < r.errors.length; i++) {
              console.log('Validation Error: ' + r.errors[i].message + ' at location ' + r.errors[i].location);
            }
          }
        }
      }

    };

    service.init();

    return service;
  };

});
