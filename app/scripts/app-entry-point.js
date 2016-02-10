function continueWithAngularApp() {
  // bootstrap dummy app
  var element = angular.element('<div></div>');
  angular.bootstrap(element);
  var $injector = element.injector();
  var $http = $injector.get('$http');

  // preload files, bootstrap CEDAR
  window.cedarBootstrap = new CedarBootstrap($http);
  window.cedarBootstrap.preload();
}

function successInitKeycloak(authenticated) {
  console.log("Keycloak init success. Authenticated: " + authenticated);
  if (!authenticated) {
    window.keycloakBootstrap.doLogin();
  } else {
    /*console.log("Parsed token");
    console.log(window.keycloakBootstrap.getParsedToken());
    console.log("Realm roles");
    console.log(window.keycloakBootstrap.getParsedToken()['realm_access']['roles']);
    console.log("Token validity");
    console.log(window.keycloakBootstrap.getTokenValiditySeconds() + " seconds");
    window.keycloakBootstrap.readUserDetails(successReadUserDetails);*/
    //console.log(window.keycloakBootstrap.getParsedToken());
    continueWithAngularApp();
  }
}

function failInitKeycloak() {
  alert("There was an error initializing the application!");
}

/*function successReadUserDetails(data) {
  console.log("Logged in user data available");
  console.log(data);
  continueWithAngularApp();
}*/

angular.element(document).ready(function (doc) {
  window.keycloakBootstrap = new KeycloakBootstrap();
  window.keycloakBootstrap.init(successInitKeycloak, failInitKeycloak);
});



