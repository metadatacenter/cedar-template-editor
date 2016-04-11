'use strict';

define([
  'angular',
  'json!config/user-service.conf.json'
], function (angular, config) {
  angular.module('cedar.templateEditor.service.userService', [])
      .service('UserService', UserService);

  UserService.$inject = ['Cedar'];

  function UserService(Cedar) {

    var userHandler = null;

    var service = {
      serviceId: "UserService"
    };

    service.injectUserHandler = function (userHandler) {
      this.userHandler = userHandler;
      // proxy functions from handler
      for (var methodName in userHandler) {
        if ("function" === typeof userHandler[methodName]) {
          this[methodName] = userHandler[methodName];
        }
      }
      Cedar.setAuthProfile(this.getParsedToken(config));
      Cedar.setCedarProfile(userHandler.cedarUserProfile);
    };

    return service;
  };

});
