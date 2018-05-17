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

      //TODO MJD
      /*
       console.log("MJD:")
       console.log("UISettingsService initialized");
       console.log("Use UISettingsService.getSettingsMenuItems() to get the list of menu items:");
       console.log(this.getSettingsMenuItems());
       console.log("Use UISettingsService.getListViewHeaders() to get the list of menu items:");
       console.log(this.getListViewHeaders());
       console.log("Use UISettingsService.getPopulateAForm() to get the list of menu items:");
       console.log(this.getPopulateAForm());
       console.log("Use UISettingsService.getResourceTypeFilters() to get the list of menu items:");
       console.log(this.getResourceTypeFilters());
       console.log("Use UISettingsService.getOrderOptions() to get the list of menu items:");
       console.log(this.getOrderOptions());
       */
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

    return service;

  };

});
