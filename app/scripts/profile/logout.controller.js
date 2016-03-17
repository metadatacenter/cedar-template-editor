'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.profile.logoutController', [])
      .controller('LogoutController', LogoutController);

  LogoutController.$inject = ["UserService"];

  function LogoutController(UserService) {
    var redirectUri = location.href;
    var hashPos = redirectUri.indexOf("/logout");
    if (hashPos >= 0) {
      redirectUri = redirectUri.substr(0, hashPos);
    }
    //console.log(redirectUri);
    UserService.doLogout({
      "redirectUri": redirectUri
    });
  };

});