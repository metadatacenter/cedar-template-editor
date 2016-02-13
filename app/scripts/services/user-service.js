'use strict';

var UserService = function () {

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
  }

  return service;
};

UserService.$inject = [];
angularApp.service('UserService', UserService);