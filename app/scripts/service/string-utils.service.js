'use strict';

define([
  'angular',
], function (angular) {
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
        if (plainText.length > maxLength) {
          var trimmedText = plainText.substr(0, maxLength);
          //re-trim if we are in the middle of a word
          trimmedText = trimmedText.substr(0, Math.min(trimmedText.length, trimmedText.lastIndexOf(" ")));
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
      if (maxLength && shortId.length > maxLength) {
        var start = shortId.length - maxLength;
        shortId = '...' + shortId.substr(start, shortId.length - 1);
      }
      return shortId;
    }

    return service;
  };

});
