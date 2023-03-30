'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.profile.logoutController', [])
      .controller('LogoutController', LogoutController);

  LogoutController.$inject = ["UserService"];

  function LogoutController(UserService) {
    let redirectUri = location.href;
    const hashPos = redirectUri.indexOf("/logout");
    if (hashPos >= 0) {
      redirectUri = redirectUri.substring(0, hashPos + 1);
    }
    UserService.doLogout({
      "redirectUri": redirectUri
    });
  }

});
