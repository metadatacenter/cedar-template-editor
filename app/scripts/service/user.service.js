'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.service.userService', [])
      .service('UserService', UserService);

  UserService.$inject = ['CedarUser', 'HttpBuilderService', 'UrlService'];

  function UserService(CedarUser, HttpBuilderService, UrlService) { 

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
      CedarUser.setAuthProfile(this.getParsedToken());
      CedarUser.setCedarProfile(userHandler.cedarUserProfile);
    };

    service.updateOwnUser = function (instance) {
      return HttpBuilderService.put(UrlService.getUser(CedarUser.getUserId()), angular.toJson(instance));
    };

    return service;
  };

});
