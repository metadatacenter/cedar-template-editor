'use strict';

var AuthorizedBackendService = function ($http, $timeout, UIMessageService) {

  var service = {
    serviceId: "AuthorizedBackendService"
  };

  service.getConfig = function () {
    return {
      "headers": {
        "Authorization": "bearer " + window.keycloakBootstrap.getToken(),
      }
    };
  };

  service.doCall = function (promiseMethodFactory, thenFunction, catchFunction) {
    console.log("AuthorizedBackendService.doCall");
    console.log('Token validity:' + window.keycloakBootstrap.getTokenValiditySeconds() + ' seconds');
    promiseMethodFactory().then(function (response) {
      console.log("THEN");
      thenFunction(response);
    }).catch(function (err) {
      console.log("CATCH");
      console.log(err);
      if (err.data.errorSubType == "authException") {
        var suggestedAction = err.data.suggestedAction;
        console.log("suggestedAction:" + suggestedAction);

        if (suggestedAction == "logout") {
          UIMessageService.acknowledgedExecution(
              function () {
                $timeout(function () {
                  window.keycloakBootstrap.doLogout()
                });
              },
              'GENERIC.Warning',
              'AUTHORIZATION-ERROR.suggestedAction.logout',
              'GENERIC.Ok'
          );
          return;
        } else if (suggestedAction == "requestRole") {
          UIMessageService.showWarning(
              'GENERIC.Warning',
              'AUTHORIZATION-ERROR.suggestedAction.requestRole',
              'GENERIC.Ok',
              err.data.errorParams
          );
          return;
        } else if (suggestedAction == "refreshToken") {
          console.log("DO refresh token");
          window.keycloakBootstrap.refreshToken(null,
              function (refreshed) {
                if (refreshed) {
                  console.log("REFRESHED");
                  console.log(window.keycloakBootstrap.getParsedToken());
                  console.log("DO it again:");
                  //$timeout(function () {
                  promiseMethodFactory().then(function (response) {
                    console.log("THEN SECOND TIME");
                    thenFunction(response);
                  }).catch(function (err) {
                    console.log("CATCH SECOND TIME");
                    console.log(err);
                    catchFunction(err);
                  });
                  //});
                } else {
                  console.log('Token not refreshed, valid for ' + window.keycloakBootstrap.getTokenValiditySeconds() + ' seconds');
                }
              },
              function () {
                console.log('Failed to refresh token');
                UIMessageService.acknowledgedExecution(
                    function () {
                      $timeout(function () {
                        window.keycloakBootstrap.doLogout()
                      });
                    },
                    'GENERIC.Warning',
                    'AUTHORIZATION-ERROR.suggestedAction.logout',
                    'GENERIC.Ok'
                );
                return;
              }
          );
          return;
        }
      }
      catchFunction(err);
    });
  };

  return service;

};

AuthorizedBackendService.$inject = ["$http", "$timeout", "UIMessageService"];
angularApp.service('AuthorizedBackendService', AuthorizedBackendService);