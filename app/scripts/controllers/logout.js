'use strict';

var LogoutController = function (UserService) {
  var redirectUri = location.href;
  var hashPos = redirectUri.indexOf("#");
  if (hashPos >= 0) {
    redirectUri = redirectUri.substr(0, hashPos);
  }
  //console.log(redirectUri);
  UserService.doLogout({
    "redirectUri": redirectUri
  });
};

LogoutController.$inject = ["UserService"];
angularApp.controller('LogoutController', LogoutController);