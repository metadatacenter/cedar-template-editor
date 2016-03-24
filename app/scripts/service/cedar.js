'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.service.cedar', [])
      .service('Cedar', Cedar);

  Cedar.$inject = ["$rootScope"];

  function Cedar($rootScope) {

    var service = {};

    function getAppData() {
      return $rootScope.appData;
    };

    service.init = function () {
      $rootScope.appData = new AppData();
    };

    service.setAuthProfile = function (parsedToken) {
      getAppData().authUserProfile = {
        "id"   : parsedToken.sub,
        "email": parsedToken.email
      };
    };

    service.setCedarProfile = function (profile) {
      getAppData().cedarUserProfile = profile;
    };

    service.isCedarProfileAvailable = function() {
      return getAppData().cedarUserProfile != null;
    }

    service.getUserId = function () {
      return getAppData().authUserProfile.id;
    };

    service.getEmail = function () {
      return getAppData().authUserProfile.email;
    };

    service.getScreenName = function() {
      return getAppData().cedarUserProfile.screenName;
    };

    service.getApiKeys = function() {
      return getAppData().cedarUserProfile.apiKeys;
    };

    service.getRoles = function() {
      return getAppData().cedarUserProfile.roles;
    };

    service.getPermissions = function() {
      return getAppData().cedarUserProfile.permissions;
    };

    service.getHome = function() {
      return getAppData().homePath;
    };

    return service;
  };
});
