'use strict';


define([
  'angular',
  'json!config/u-i-settings-service.conf.json'
], function (angular, config) {
  angular.module('cedar.templateEditor.service.uISettingsService', [])
      .service('UISettingsService', UISettingsService);

  UISettingsService.$inject = ['AuthorizedBackendService', 'UserService', 'UIMessageService'];

  function UISettingsService(AuthorizedBackendService, UserService, UIMessageService) {

    var settingsMenu = null;
    var listView = null;
    var populateAForm = null;
    var resourceTypeFilters = null;
    var orderDropdown = null;
    var workspaceView = null;
    var selectedResource = null;

    var service = {
      serviceId: "UISettingsService"
    };

    service.init = function () {
      settingsMenu = config.settingsMenu;
      listView = config.listView;
      populateAForm = config.populateAForm;
      resourceTypeFilters = config.resourceTypeFilters;
      orderDropdown = config.orderDropdown;
      workspaceView = config.workspaceView;
    };

    service.getSelected = function () {
      return selectedResource;
    };

    service.setSelected = function (value) {
      selectedResource = value;
    };

    service.resetSelected = function () {
      selectedResource = null;
    };

    service.hasSelected = function () {
      return selectedResource != null;
    };

    service.getSettingsMenuItems = function () {
      return settingsMenu;
    };

    service.getListViewHeaders = function () {
      return listView.headers;
    };

    service.getPopulateAForm = function () {
      return populateAForm;
    };

    service.getResourceTypeFilters = function () {
      return resourceTypeFilters;
    };

    service.getOrderOptions = function () {
      return orderDropdown;
    };

    service.getRequestLimit = function () {
      return workspaceView.requestLimit;
    };

    service.saveUIPreference = function (prefPath, prefValue) {
      var putData = {};
      putData['uiPreferences.' + prefPath] = prefValue;
      AuthorizedBackendService.doCall(
          UserService.updateOwnUser(putData),
          function (response) {
          },
          function (err) {
            UIMessageService.showBackendError('SERVER.UIPREFERENCES.update.error', err);
          }
      );
    };

    service.saveUIPreferences = function (partialPutData) {
      var putData = {};
      for(var suffix in partialPutData) {
        putData['uiPreferences.' + suffix] = partialPutData[suffix];
      }
      AuthorizedBackendService.doCall(
          UserService.updateOwnUser(putData),
          function (response) {
          },
          function (err) {
            UIMessageService.showBackendError('SERVER.UIPREFERENCES.update.error', err);
          }
      );
    };

    service.saveView = function(prefValue) {
      service.saveUIPreference('folderView.viewMode', prefValue);
    };

    service.saveInfo = function(prefValue) {
      service.saveUIPreference('infoPanel.opened', prefValue);
    };

    service.saveInfoTab = function(prefValue) {
      service.saveUIPreference('infoPanel.activeTab', prefValue);
    };

    service.saveResourceType = function(type, prefValue) {
      service.saveUIPreference('resourceTypeFilters.' + type, prefValue);
    };

    service.saveSort = function(prefValue) {
      service.saveUIPreference('folderView.sortBy', prefValue);
    };

    service.saveSortByName = function() {
      service.saveUIPreference('folderView.sortBy', 'name');
    };

    service.saveSortByCreated = function() {
      service.saveUIPreference('folderView.sortBy', 'createdOnTS');
    };

    service.saveSortByUpdated = function() {
      service.saveUIPreference('folderView.sortBy', 'lastUpdatedOnTS');
    };

    service.saveStatus = function(prefValue) {
      service.saveUIPreference('resourcePublicationStatusFilter.publicationStatus', prefValue);
    };

    service.saveVersion = function(prefValue) {
      service.saveUIPreference('resourceVersionFilter.version', prefValue);
    };

    service.saveUseMetadataEditorV2= function(prefValue) {
      service.saveUIPreference('useMetadataEditorV2', prefValue);
    };

    return service;

  };

});
