'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.service.userService', [])
      .service('UserService', UserService);

  UserService.$inject = ['$rootScope'];

  function UserService($rootScope) {

    var config = null;
    var userHandler = null;

    var service = {
      serviceId: "UserService"
    };

    service.init = function () {
      config = cedarBootstrap.getBaseConfig(this.serviceId);

      var pt = this.getParsedToken(config);
      $rootScope.currentUser = {
        "name" : pt.name,
        "id"   : pt.sub,
        "email": pt.email,
        "roles": pt.realm_access.roles
      };
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

});
