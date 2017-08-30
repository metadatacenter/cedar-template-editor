'use strict';


define([
  'angular'
], function(angular) {
  angular.module('cedar.templateEditor.service.dataUtilService', [])
    .service('DataUtilService', DataUtilService);

  DataUtilService.$inject = ["$rootScope"];

  function DataUtilService($rootScope) {

    var specialKeyPattern = /(^@)|(^_)|(^schema:)|(^pav:)|(^oslc:)/i;
    var elementType = "https://schema.metadatacenter.org/core/TemplateElement";

    var service = {
      serviceId: "DataUtilService"
    };

    // Return true if testScope.properties object only contains default values
    service.isPropertiesEmpty = function (testScope) {
      if (!angular.isUndefined(testScope) && testScope.properties) {
        var keys = Object.keys(testScope.properties);
        for (var i = 0; i < keys.length; i++) {
          if (!this.isSpecialKey(keys[i])) {
            return false;
          }
        }
        return true;
      }
    };

    // Return true if the key is of json-ld type '@' or if it corresponds to any of the reserved fields
    service.isSpecialKey = function (key) {
      return specialKeyPattern.test(key);
    };

    service.isElement = function (value) {
      return value && value['@type'] && value['@type'] == elementType;
    };

    // Escapes JSON special characters
    service.escapeSpecialChars = function (string) {
      return string
          .replace(/[\\]/g, '\\\\')
          .replace(/[\"]/g, '\\\"')
          .replace(/[\/]/g, '\\/')
          .replace(/[\b]/g, '\\b')
          .replace(/[\f]/g, '\\f')
          .replace(/[\n]/g, '\\n')
          .replace(/[\r]/g, '\\r')
          .replace(/[\t]/g, '\\t');
    };

    // Escapes JSON special characters, as well as '.', '/', and ':'.
    service.removeSpecialChars = function (string) {
      return string
          .replace(/[\\]/g, '')
          .replace(/[\"]/g, '')
          .replace(/[\/]/g, '')
          .replace(/[\b]/g, '')
          .replace(/[\f]/g, '')
          .replace(/[\n]/g, '')
          .replace(/[\r]/g, '')
          .replace(/[\t]/g, '')
          .replace(/[.]/g, '')
          .replace(/[/]/g, '')
          .replace(/[:]/g, '')
    };

    // Generate simple hash (more options at http://erlycoder.com/49/javascript-hash-functions-to-convert-string-into-integer-hash-)
    service.hashCode = function(str) {
      var hash = 0;
      if (str.length == 0) return hash;
      for (i = 0; i < str.length; i++) {
        var char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
      }
      return hash;
    }

    return service;
  };

});
