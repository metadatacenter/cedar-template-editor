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

function successInitUserHandler(authenticated) {
  console.log("User handler init success. Authenticated: " + authenticated);
  if (!authenticated) {
    window.bootstrapUserHandler.doLogin();
  } else {
    continueWithAngularApp();
  }
}

function failInitUserHandler() {
  alert("There was an error initializing the application!");
}

// -------------------------- ENTRY POINT --------------------------------------
angular.element(document).ready(function (doc) {
  // use this for live servers
  window.bootstrapUserHandler = new KeycloakUserHandler();
  // use this for unauthorized access during development
  //window.bootstrapUserHandler = new NoauthUserHandler();

  window.bootstrapUserHandler.init(successInitUserHandler, failInitUserHandler);
});



