'use strict';

define([
  'angular',
  'json!config/data-manipulation-service.conf.json'
], function (angular, config) {
  angular.module('cedar.templateEditor.service.localStorageService', [])
      .service('LocalStorageService', LocalStorageService);

  LocalStorageService.$inject = ['$window'];

  function LocalStorageService($window) {

    var service = {
      serviceId: "LocalStorageService"
    };

    service.init = function () {
    };

    service.set = function (key, value) {
      $window.localStorage[key] = value;
    };

    service.get = function (key, defaultValue) {
      return $window.localStorage[key] || defaultValue || false;
    };

    service.setObject = function (key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    };

    service.getObject = function (key, defaultValue) {
      if ($window.localStorage[key] != undefined) {
        return JSON.parse($window.localStorage[key]);
      } else {
        return defaultValue || false;
      }
    };

    service.remove = function (key) {
      $window.localStorage.removeItem(key);
    };

    service.clear = function () {
      $window.localStorage.clear();
    };

    return service;
  };
});