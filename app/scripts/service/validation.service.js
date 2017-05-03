'use strict';


define([
  'angular',
  'json!config/validation-service.conf.json'
], function (angular, config) {
  angular.module('cedar.templateEditor.service.validationService', [])
      .service('ValidationService', ValidationService);

  ValidationService.$inject = [];

  function ValidationService() {

    var validationTypes = [];

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

    service.getUrl = function (type) {
      var result = validationTypes.filter(function (e) {
        if (e.type == type) {
          return e.url;
        }
      });
      return result;
    };


  service.init();

    return service;
  };

});
