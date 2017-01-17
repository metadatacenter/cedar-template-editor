function NoauthUserHandler() {

  this.doLogin = function () {
    console.log("NoauthUserHandler:login()");
  };

  this.doLogout = function (options) {
    console.log("NoauthUserHandler:doLogout()");
  };

  this.getToken = function () {
    return null;
  };

  this.getRefreshToken = function () {
    return null;
  };

  this.getParsedToken = function () {
    return {
      "name": "Unauthenticated User",
      "sub": "111-2222-33333",
      "email": "user@domain.edu",
      "realm_access": {
        "roles": [
          "virtual role 1",
          "virtual role 2",
          "virtual role 3"
        ]
      }
    }
  };

  this.getTokenValiditySeconds = function () {
    return Math.POSITIVE_INFINITY;
  };

  this.refreshToken = function (minValidity, successCallback, errorCallback) {
    console.log("NoauthUserHandler:refreshToken()");
  };

  this.initUserHandler = function (successCallback, failureCallback) {
    console.log("NoauthUserHandler:init()");
    successCallback(true);
  };
}