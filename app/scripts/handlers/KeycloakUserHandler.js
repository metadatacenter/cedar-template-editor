function KeycloakUserHandler() {

  const keycloak = Keycloak({
    "realm"   : "CEDAR",
    "url"     : window.location.origin.replaceAll('/cedar.', '/auth.'),
    "clientId": "cedar-angular-app"
  });

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
    return keycloak.updateToken(minValidity).then(function (refreshed) {
      return successCallback(refreshed);
    }).catch(function () {
      return errorCallback();
    });
  };

  this.initUserHandler = function (successCallback, failureCallback) {
    return keycloak.init({
          onLoad: 'check-sso',
          silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html'
        }).then(function (authenticated) {
      return successCallback(authenticated);
    }).catch(function () {
      return failureCallback();
    });
  };
}
