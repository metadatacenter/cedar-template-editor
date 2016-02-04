function KeycloakBootstrap() {

  var keycloak = Keycloak();

  this.doLogin = function () {
    keycloak.login();
  };

  this.doLogout = function (options) {
    keycloak.logout(options);
  };

  this.readUserDetails = function (successCallback) {
    if (keycloak.refreshToken === null) {
      // not logged in
      console.log("not logged in");
    } else {
      $.ajax({
        url: "http://template.metadatacenter.orgx/user-details",
        headers: {
          'Cedar-Refresh-Auth-Token': keycloak.refreshToken
        }
      }).done(function (data) {
        // logged in, data available
        successCallback(data);
      });
    }
  };

  this.init = function (successCallback, failureCallback) {
    keycloak.init().success(function (authenticated) {
      successCallback(authenticated);
    }).error(function () {
      failureCallback();
    });
  };
}