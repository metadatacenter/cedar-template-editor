'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.service.authorizedBackendService', [])
      .service('AuthorizedBackendService', AuthorizedBackendService);

  AuthorizedBackendService.$inject = ["$http", "$timeout", "UIMessageService", "UserService", "$window"];

  function AuthorizedBackendService($http, $timeout, UIMessageService, UserService, $window) {

    function hasHeader(headers, name) {
      for (var key in headers) {
        if (headers.hasOwnProperty(key) && key.toLowerCase() === name.toLowerCase()) {
          return true;
        }
      }
      return false;
    }

    var service = {
      serviceId: "AuthorizedBackendService"
    };

    service.getConfig = function (httpConfigObject) {
      var token = UserService.getToken();
      var config = {
        "headers": {
          "Authorization"          : token == null ? "" : "Bearer " + token,
          "CEDAR-Client-Session-Id": $window.cedarClientSessionId,
          "CEDAR-Debug"            : true
        }
      };
      if (httpConfigObject != null) {
        if (httpConfigObject.hasOwnProperty("headers")) {
          for (var key in httpConfigObject.headers) {
            config.headers[key] = httpConfigObject.headers[key];
          }
        }
      }
      return config;
    };

    service.getHttpPromise = function (httpConfigObject) {
      var hco = angular.extend({}, httpConfigObject, this.getConfig(httpConfigObject));
      // Keep the validator on the representation that produced the edit. A URL-global "latest"
      // cache would let a second in-page editor silently borrow the first editor's newer ETag.
      var artifact = hco.cedarArtifact;
      delete hco.cedarArtifact;
      var conditionalMethod = hco.method != null &&
          ['PUT', 'PATCH', 'DELETE'].indexOf(hco.method.toUpperCase()) !== -1;
      if (conditionalMethod && artifact != null &&
          artifact.$$cedarEtag != null &&
          !hasHeader(hco.headers, 'If-Match')) {
        hco.headers['If-Match'] = artifact.$$cedarEtag;
      }
      return $http(hco).then(function (response) {
        var etag = response.headers('ETag');
        if (etag != null) {
          if (response.data != null && angular.isObject(response.data)) {
            response.data.$$cedarEtag = etag;
          }
          if (artifact != null) {
            artifact.$$cedarEtag = etag;
          }
        }
        return response;
      });
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

      if (suggestedAction == "logoutImmediately") {
        UserService.doLogout();
      } else if (suggestedAction == "logout" || suggestedAction == "provideAuthorizationHeader") {
        this.notifyAndLogout();
        return true;
      } else if (suggestedAction == "requestRole") {
        UIMessageService.showWarning(
            'GENERIC.Warning',
            'AUTHORIZATION-ERROR.suggestedAction.requestRole',
            'GENERIC.Ok',
            errorResponse.data.parameters
        );
        return true;
      }
      return false;
    };

    service.getTokenValidityMessage = function () {
      return 'Token validity:' + UserService.getTokenValiditySeconds() + ' seconds';
    };

    service.doCall = function (httpConfigObject, thenFunction, catchFunction) {
      //console.log(this.getTokenValidityMessage());
      var owner = this;

      return owner.getHttpPromise(httpConfigObject).then(function (response) {
        return thenFunction(response);
      }).catch(function (err) {
        //console.log("Original backend call failed:");
        //console.log(err);
        if ("data" in err && err.data !== null) {
          if (err.data.errorType == "authorization") {
            var handled = owner.handleAuthException(err);
            if (handled) {
              return;
            }
            var suggestedAction = err.data.suggestedAction;

            if (suggestedAction == "refreshToken") {
              console.log("DO refresh token");
              return UserService.refreshToken(null,
                  function (refreshed) {
                    if (refreshed) {
                      console.log("Token successfully refreshed");
                      //console.log(UserService.getParsedToken());
                      console.log("Execute original call once again");
                      return owner.getHttpPromise(httpConfigObject).then(function (response) {
                        return thenFunction(response);
                      }).catch(function (err) {
                        console.log("Second backend call failed:");
                        console.log(err);
                        return catchFunction(err);
                      });
                    } else {
                      console.log("Token was not refreshed");
                      console.log(owner.getTokenValidityMessage());
                      owner.notifyAndLogout();
                      return;
                    }
                  },
                  function () {
                    console.log('Failed to refresh token');
                    owner.notifyAndLogout();
                    return;
                  }
              );
            }
          }
        }
        // original catch function
        return catchFunction(err);
      });
    };

    return service;
  }

});
