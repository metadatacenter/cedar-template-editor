'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.service.cedarUser', [])
      .service('CedarUser', CedarUser);

  CedarUser.$inject = ["$rootScope"];

  /**
   * manage the user preferences singleton object
   *
   * @param $rootScope
   * @returns {{}}
   * @constructor
   */
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
        "@id"   : parsedToken.sub,
        "email": parsedToken.email
      };
    };

    service.setCedarProfile = function (profile) {
      getAppData().cedarUserProfile = profile;
    };

    service.isCedarProfileAvailable = function () {
      return getAppData().cedarUserProfile != null;
    };

    service.getUserId = function () {
      return getAppData().authUserProfile['@id'];
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

    service.hasPermission = function (permissionName) {
      return getAppData().cedarUserProfile.permissions.indexOf(permissionName) !== -1;
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

    service.getInfo = function () {
      return service.getUIPreferences().infoPanel.opened;
    };

    service.getView = function () {
      return service.getUIPreferences().folderView.viewMode;
    };

    service.isGridView = function () {
      return service.getUIPreferences().folderView.viewMode === 'grid';
    };

    service.isListView = function () {
      return service.getUIPreferences().folderView.viewMode === 'list';
    };


    service.getResourceType = function (type) {
      return service.getUIPreferences().resourceTypeFilters[type];
    };

    service.toggleResourceType = function(type) {
      var value = !service.getResourceType(type);
      service.saveUIPreference('resourceTypeFilters', type, value);
      return value;
    };

    service.toggleView = function () {
      var value = service.isGridView() ? 'list' : 'grid';
      service.saveUIPreference('folderView', 'viewMode', value);
      return value;
    };

    // TBD infoPanel.activeTab   'info' or 'version' or 'share'

    service.isInfoOpen = function () {
      return service.getUIPreferences().infoPanel.opened;
    };

    service.getInfoTab = function () {
      return service.getUIPreferences().infoPanel.activeTab;
    };

    service.isVersionTab = function () {
      return service.getUIPreferences().infoPanel.activeTab == 'version';
    };

    service.isCategoryTab = function () {
      return service.getUIPreferences().infoPanel.activeTab == 'category';
    };

    service.isInfoTab = function () {
      return service.getUIPreferences().infoPanel.activeTab == 'info';
    };

    service.isShareTab = function () {
      return service.getUIPreferences().infoPanel.activeTab == 'share';
    };

    service.toggleInfo = function () {
      service.saveUIPreference('infoPanel', 'opened', !service.isInfoOpen());
      return service.isInfoOpen();
    };

    service.toggleInfoTab = function (tab) {
      service.saveUIPreference('infoPanel', 'activeTab', tab);
      return service.getInfoTab();
    };

    service.isGridView = function () {
      return service.getUIPreferences().folderView.viewMode === 'grid';
    };

    service.getSort = function () {
      return service.getUIPreferences().folderView.sortBy;
    };

    service.isSortByName = function () {
      return service.getSort() === 'name';
    };

    service.isSortByUpdated = function () {
      return service.getSort() === 'lastUpdatedOnTS';
    };

    service.isSortByCreated = function () {
      return service.getSort() === 'createdOnTS';
    };

    service.getSort = function () {
      return service.getUIPreferences().folderView.sortBy;
    };

    service.setSort = function (prefValue) {
      service.saveUIPreference('folderView', 'sortBy', prefValue);
      return service.getSort();
    };

    service.setSortByName = function () {
      service.saveUIPreference('folderView', 'sortBy', 'name');
      return service.getSort();
    };

    service.setSortByCreated = function () {
      service.saveUIPreference('folderView', 'sortBy', 'createdOnTS');
      return service.getSort();
    };

    service.setSortByUpdated = function () {
      service.saveUIPreference('folderView', 'sortBy', 'lastUpdatedOnTS');
      return service.getSort();
    };

    service.setStatus = function (status) {
      service.saveUIPreference('resourcePublicationStatusFilter', 'publicationStatus', status);
    };

    service.getStatus = function (version) {
      return service.getUIPreferences().resourcePublicationStatusFilter.publicationStatus;
    };

    service.setVersion = function (version) {
      service.saveUIPreference('resourceVersionFilter', 'version', version);
    };

    service.getVersion = function (version) {
      return service.getUIPreferences().resourceVersionFilter.version;
    };

    service.useMetadataEditorV2 = function () {
      return service.getUIPreferences().useMetadataEditorV2;
    }

    service.toggleMetadataEditorV2 = function () {
      getAppData().cedarUserProfile.uiPreferences['useMetadataEditorV2'] = !service.useMetadataEditorV2();
      return service.useMetadataEditorV2();
    }

    service.getMetadataEditorV2Settings = function () {
      return getAppData().cedarUserProfile.uiPreferences.metadataEditorV2;
    }

    service.setMetadataEditorV2Settings = function (settings) {
      getAppData().cedarUserProfile.uiPreferences['metadataEditorV2'] = settings;
    }

    return service;
  };
});
