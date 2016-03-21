'use strict';


define([
  'angular',
  'json!config/u-i-settings-service.conf.json'
], function (angular, config) {
  angular.module('cedar.templateEditor.service.uISettingsService', [])
      .service('UISettingsService', UISettingsService);

  UISettingsService.$inject = [];

  function UISettingsService() {

    var settingsMenu = null;
    var listView = null;
    var populateAForm = null;
    var resourceTypeFilters = null;
    var orderDropdown = null;

    var service = {
      serviceId: "UISettingsService"
    };

    service.init = function () {
      settingsMenu = config.settingsMenu;
      listView = config.listView;
      populateAForm = config.populateAForm;
      resourceTypeFilters = config.resourceTypeFilters;
      orderDropdown = config.orderDropdown;

      //TODO MJD
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
      console.log("Use UISettingsService.getOrderDropdown() to get the list of menu items:");
      console.log(this.getOrderDropdown());
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

    service.getOrderDropdown = function () {
      return orderDropdown;
    };

    return service;

  };

});
