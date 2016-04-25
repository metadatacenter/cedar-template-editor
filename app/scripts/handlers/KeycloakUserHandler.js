function KeycloakUserHandler() {

  var keycloak = Keycloak();

  this.doLogin = function () {
    keycloak.login();
  };

  this.doLogout = function (options) {
    keycloak.logout(options);
  };

  this.getToken = function () {
    return keycloak.token;
  };

  this.getRefreshToken = function () {
    return keycloak.refreshToken;
  };

  this.getParsedToken = function () {
    return keycloak.tokenParsed;
  };

  this.getTokenValiditySeconds = function() {
    return Math.round(keycloak.tokenParsed.exp + keycloak.timeSkew - new Date().getTime() / 1000);
  };

  this.refreshToken = function (minValidity, successCallback, errorCallback) {
    keycloak.updateToken(minValidity).success(function (refreshed) {
      successCallback(refreshed);
    }).error(function () {
      errorCallback();
    });
  };

  this.initUserHandler = function (successCallback, failureCallback) {
    keycloak.init().success(function (authenticated) {
      successCallback(authenticated);
    }).error(function () {
      failureCallback();
    });
  };
}