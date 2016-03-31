'use strict';

define([
  'angular',
  'json!config/user-service.conf.json'
], function (angular, config) {
  angular.module('cedar.templateEditor.service.userService', [])
    .service('UserService', UserService);

  UserService.$inject = ['$rootScope', 'Cedar'];

  function UserService($rootScope, Cedar) {

    var userHandler = null;

    var service = {
      serviceId: "UserService"
    };

    service.init = function (callback) {
      var pt = this.getParsedToken(config);
      Cedar.setAuthProfile(pt);

      callback();
    };

    service.injectUserHandler = function (userHandler) {
      this.userHandler = userHandler;
      // proxy functions from handler
      for (var methodName in userHandler) {
        if ("function" === typeof userHandler[methodName]) {
          this[methodName] = userHandler[methodName];
        }
      }
    };

    return service;
  };

});
