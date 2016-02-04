'use strict';

angularApp.controller('LogoutController', function () {
  var redirectUri = location.href;
  var hashPos = redirectUri.indexOf("#");
  if (hashPos >= 0) {
    redirectUri = redirectUri.substr(0, hashPos);
  }
  console.log(redirectUri);
  window.keycloakBootstrap.doLogout({
    "redirectUri": redirectUri
  });
});
