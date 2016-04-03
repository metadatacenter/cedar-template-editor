'use strict';

define([
  'angular'
], function(angular) {
  angular.module('cedar.templateEditor.service.uIUtilService', [])
    .service('UIUtilService', UIUtilService);

  UIUtilService.$inject = ["$window", "$timeout", 'md5'];

  function UIUtilService($window, $timeout, md5) {

    var service = {
      serviceId: "UIUtilService"
    };

    service.scrollToAnchor = function (hash) {
      $timeout(function () {
        var target = angular.element('#' + hash);
        var y = target.offset().top;
        $window.scrollTo(0, y - 95);
      }, 250);
    };

    /**
     * scroll to a field or element
     * @param fieldOrElement
     */
    service.scrollToFieldOrElement = function (fieldOrElement) {
      $timeout(function () {
        var target = angular.element('#' + service.getId(fieldOrElement));
        var y = target.offset().top;
        $window.scrollTo(0, y - 95);
      }, 250);
    };

    /**
     * create a predictable id for the field or element
     * @param fieldOrElement
     * @returns {string} id of field or element
     */
    service.getId = function (fieldOrElement) {
      var id = null;
      if (fieldOrElement) {
        if (fieldOrElement.items) {
          id = fieldOrElement.items['@id'];
        } else if (fieldOrElement['@id']) {
          id = fieldOrElement['@id'];
        }
      }
      return 'id' + md5.createHash(id);
    };

    service.console = function (txt, label) {
      console.log(label + ' ' + JSON.stringify(txt, null, 2));
    };

    return service;
  };

});