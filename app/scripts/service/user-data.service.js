'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.service.userDataService', [])
      .service('UserDataService', UserDataService);

  UserDataService.$inject = ['UrlService', 'HttpBuilderService', 'AuthorizedBackendService',
                             'UIMessageService', 'Cedar'];

  function UserDataService(UrlService, HttpBuilderService, AuthorizedBackendService, UIMessageService,
                           Cedar) {

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
          service.getUser(Cedar.getUserId()),
          function (response) {
            //console.log("USER was read:");
            //console.log(response);
            Cedar.setCedarProfile(response.data);
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
          service.createUser(Cedar.getUserId()),
          function (response) {
            Cedar.setCedarProfile(response.data);
          },
          function (err) {
            UIMessageService.showBackendError('SERVER.USER.create.error', err);
          }
      );
    };

    return service;
  };

});
