'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.service.authorizedBackendService', [])
      .service('AuthorizedBackendService', AuthorizedBackendService);

  AuthorizedBackendService.$inject = ["$http", "$timeout", "UIMessageService", "UserService"];

  function AuthorizedBackendService($http, $timeout, UIMessageService, UserService) {

    var service = {
      serviceId: "AuthorizedBackendService"
    };

    service.getConfig = function () {
      var token = UserService.getToken();
      return {
        "headers": {
          "Authorization": token == null ? "" : "Bearer " + token,
        }
      };
    };

    service.getHttpPromise = function (httpConfigObject) {
      var hco = angular.extend({}, httpConfigObject, this.getConfig());
      return $http(hco);
    };

    service.notifyAndLogout = function () {
      UIMessageService.acknowledgedExecution(
          function () {
            $timeout(function () {
              UserService.doLogout();
            });
          },
          'GENERIC.Warning',
          'AUTHORIZATION-ERROR.suggestedAction.logout',
          'GENERIC.Ok'
      );
    };

    service.handleAuthException = function (errorResponse) {
      var suggestedAction = errorResponse.data.suggestedAction;
      console.log("suggestedAction:" + suggestedAction);

      if (suggestedAction == "logout") {
        this.notifyAndLogout();
        return true;
      } else if (suggestedAction == "requestRole") {
        UIMessageService.showWarning(
            'GENERIC.Warning',
            'AUTHORIZATION-ERROR.suggestedAction.requestRole',
            'GENERIC.Ok',
            errorResponse.data.errorParams
        );
        return true;
      }
      return false;
    };

    service.getTokenValidityMessage = function () {
      return 'Token validity:' + UserService.getTokenValiditySeconds() + ' seconds';
    }

    service.doCall = function (httpConfigObject, thenFunction, catchFunction) {
      //console.log("AuthorizedBackendService.doCall:" + httpConfigObject.url);
      //console.log(this.getTokenValidityMessage());
      var owner = this;

      return owner.getHttpPromise(httpConfigObject).then(function (response) {
        if (thenFunction) {
          return thenFunction(response);
        }
        return response;
      }).catch(function (err) {
        //console.log("Original backend call failed:");
        //console.log(err);
        if ("data" in err && err.data !== null) {
          if (err.data.errorSubType == "authException") {
            var handled = owner.handleAuthException(err);
            if (handled) {
              return;
            }
            var suggestedAction = err.data.suggestedAction;

            if (suggestedAction == "refreshToken") {
              console.log("DO refresh token");
              UserService.refreshToken(null,
                  function (refreshed) {
                    if (refreshed) {
                      console.log("Token successfully refreshed");
                      //console.log(UserService.getParsedToken());
                      console.log("Execute original call once again");
                      owner.getHttpPromise(httpConfigObject).then(function (response) {
                        if (thenFunction) {
                          return thenFunction(response);
                        }
                        return response;
                      }).catch(function (err) {
                        console.log("Second backend call failed:");
                        console.log(err);
                        if (catchFunction) {
                          return catchFunction(err);
                        }
                        return err;
                      });
                    } else {
                      console.log(this.getTokenValidityMessage());
                    }
                  },
                  function () {
                    console.log('Failed to refresh token');
                    owner.notifyAndLogout();
                    return;
                  }
              );
              return;
            }
          }
        }
        // original catch function
        if (catchFunction) {
          return catchFunction(err);
        }
        return err;
      });
    };

    return service;
  };

});
