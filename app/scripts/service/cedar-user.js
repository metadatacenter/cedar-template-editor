'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.service.cedarUser', [])
      .service('CedarUser', CedarUser);

  CedarUser.$inject = ["$rootScope"];

  function CedarUser($rootScope) {

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

    service.isCedarProfileAvailable = function () {
      return getAppData().cedarUserProfile != null;
    }

    service.getUserId = function () {
      return getAppData().authUserProfile.id;
    };

    service.getEmail = function () {
      return getAppData().authUserProfile.email;
    };

    service.getFirstName = function () {
      return getAppData().cedarUserProfile.firstName;
    };

    service.getLastName = function () {
      return getAppData().cedarUserProfile.lastName;
    };

    service.getHomeFolderId = function () {
      return getAppData().cedarUserProfile.homeFolderId;
    };

    service.getHomeFolderIdEncoded = function () {
      return window.encodeURIComponent(getAppData().cedarUserProfile.homeFolderId);
    };

    service.getApiKeys = function () {
      return getAppData().cedarUserProfile.apiKeys;
    };

    service.getRoles = function () {
      return getAppData().cedarUserProfile.roles;
    };

    service.getPermissions = function () {
      return getAppData().cedarUserProfile.permissions;
    };

    service.getHomeFolderId = function () {
      return getAppData().cedarUserProfile.homeFolderId;
    };

    service.getPermissions = function () {
      return getAppData().cedarUserProfile.permissions;
    };

    service.getCurrentFolderId = function () {
      return getAppData().navigation.currentFolderId;
    };

    service.setCurrentFolderId = function (value) {
      getAppData().navigation.currentFolderId = value;
    };

    service.getUIPreferences = function () {
      return getAppData().cedarUserProfile.uiPreferences;
    };

    service.saveUIPreference = function (name, property ,value) {
      getAppData().cedarUserProfile.uiPreferences[name][property] = value;
    };

    return service;
  };
});
