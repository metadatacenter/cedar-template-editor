'use strict';

define([
  'angular', 'CedarValidationPolicy',
], function (angular, policy) {
  angular.module('cedar.templateEditor.service.stringUtilsService', [])
      .service('StringUtilsService', StringUtilsService);

  StringUtilsService.$inject = ['$rootScope'];

  function StringUtilsService() {

    var service = {
      serviceId: "StringUtilsService"
    };

    service.init = function () {
      // Code to initialize service
    };

    service.getShortText = function getShortText(text, maxLength, finalString, emptyString) {
      if (text && text.length > 0) {
        // Converts html to plain text if needed
        var tag = document.createElement('div');
        tag.innerHTML = text;
        var plainText = tag.innerText;
        var shortened = policy.DisplayText.take(plainText, maxLength);
        if (shortened !== plainText) {
          var trimmedText = shortened;
          //re-trim if we are in the middle of a word
          var space = trimmedText.lastIndexOf(" ");
          if (space > 0) trimmedText = trimmedText.slice(0, space);
          return trimmedText + finalString;
        }
        else {
          return plainText;
        }
      }
      else {
        return emptyString;
      }
    }

    service.getShortId = function(uri, maxLength) {
      var lastFragment = uri.substr(uri.lastIndexOf('/') + 1);
      var shortId = lastFragment.substr(lastFragment.lastIndexOf('#') + 1);
      if (maxLength) {
        var shortened = policy.DisplayText.take(shortId, maxLength, true);
        if (shortened !== shortId) shortId = '...' + shortened;
      }
      return shortId;
    }

    return service;
  };

});
