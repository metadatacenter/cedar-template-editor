'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.service.userDataService', [])
      .service('UserDataService', UserDataService);

  UserDataService.$inject = ['$rootScope', 'UrlService', 'HttpBuilderService', 'AuthorizedBackendService',
                             'UIMessageService'];

  function UserDataService($rootScope, UrlService, HttpBuilderService, AuthorizedBackendService, UIMessageService) {

    var config = null;

    var service = {
      serviceId: "UserDataService"
    };

    service.getUser = function (id) {
      return HttpBuilderService.get(UrlService.getUser(id));
    };

    service.createUser = function (id) {
      return HttpBuilderService.post(UrlService.users());
    };

    service.readUserDetails = function () {
      AuthorizedBackendService.doCall(
          service.getUser($rootScope.currentUser.id),
          function (response) {
            //console.log("USER was read:");
            //console.log(response);
            $rootScope.currentUser.apiKeys = response.data.apiKeys;
          },
          function (err) {
            if (err.status == 404) {
              service.createDefaultUserProfile();
            } else {
              UIMessageService.showBackendError('SERVER.USER.read.error', err);
            }
          }
      );
    };

    service.createDefaultUserProfile = function () {
      AuthorizedBackendService.doCall(
          service.createUser($rootScope.currentUser.id),
          function (response) {
            //console.log("USER was created:");
            //console.log(response);
            $rootScope.currentUser.apiKeys = response.data.apiKeys;
          },
          function (err) {
            UIMessageService.showBackendError('SERVER.USER.create.error', err);
          }
      );
    }

    return service;
  };

});
