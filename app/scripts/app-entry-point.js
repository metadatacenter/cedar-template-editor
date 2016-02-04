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
    window.keycloakBootstrap.readUserDetails(successReadUserDetails);
  }
}

function failInitKeycloak() {
  alert("There was an error initializing the application!");
}

function successReadUserDetails(data) {
  console.log("Logged in user data available");
  console.log(data);
  continueWithAngularApp();
}

angular.element(document).ready(function (doc) {
  window.keycloakBootstrap = new KeycloakBootstrap();
  window.keycloakBootstrap.init(successInitKeycloak, failInitKeycloak);
});



