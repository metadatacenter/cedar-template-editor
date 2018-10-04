'use strict';


define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.service.dataUtilService', [])
      .service('DataUtilService', DataUtilService);

  DataUtilService.$inject = ["$rootScope"];

  function DataUtilService($rootScope) {

    var specialKeyPattern = /(^@)|(^_)|(^schema:)|(^pav:)|(^rdfs:)|(^oslc:)/i;
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
      //console.log('isElement', value, value['@type']);
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

    // Removes special characters
    service.removeSpecialChars = function (string) {
      return string
          .replace(/[.]/g, '') // '.'  is not accepted by MongoDB
          .replace(/^[$]/g, ''); // '$' at the beginning of the field name is not accepted by MongoDB
    };

    // Generate simple hash (source: http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/)
    service.getHashCode = function (str) {
      var hash = 0, i, chr;
      if (str.length === 0) return hash;
      for (i = 0; i < str.length; i++) {
        chr = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
      }
      return hash;
    }

    return service;
  };

});
