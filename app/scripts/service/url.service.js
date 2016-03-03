'use strict';

define([
  'angular'
], function(angular) {
  angular.module('cedar.templateEditor.service.urlService', [])
    .service('UrlService', UrlService);

  UrlService.$inject = [];

  function UrlService() {

    var config = null;
    var apiService = null;
    var userService = null;

    var service = {
      serviceId: "UrlService"
    };

    service.init = function () {
      config = cedarBootstrap.getBaseConfig(this.serviceId);
      apiService = config.cedarRestAPI;
      userService = config.userRestAPI;
    };

    service.getRoleSelector = function () {
      return "/role-selector/";
    };

    service.getTemplateEdit = function (id) {
      return "/templates/edit/" + id;
    };

    service.getElementEdit = function (id) {
      return "/elements/edit/" + id;
    };

    service.getInstanceEdit = function (id) {
      return "/instances/edit/" + id;
    };

    service.getDefaultTemplatesSummary = function (limit, offset) {
      return this.templates() + '?summary=true' + '&limit=' + limit + '&offset=' + offset;
    };

    service.getAllTemplatesSummary = function () {
      return this.templates() + '?summary=true';
    };

    service.getDefaultTemplateElementsSummary = function (limit, offset) {
      return this.templateElements() + '?summary=true' + '&limit=' + limit + '&offset=' + offset;
    };

    service.getAllTemplateElementsSummary = function () {
      return this.templateElements() + '?summary=true';
    };

    service.getDefaultTemplateInstancesSummary = function (limit, offset) {
      return this.templateInstances() + '?summary=true' + '&limit=' + limit + '&offset=' + offset;
    };

    service.getAllTemplateInstancesSummary = function () {
      return this.templateInstances() + '?summary=true';
    };

    service.templates = function () {
      return apiService + '/templates';
    };

    service.getTemplate = function (id) {
      return this.templates() + '/' + encodeURIComponent(id);
    };

    service.templateElements = function () {
      return apiService + '/template-elements';
    };

    service.getTemplateElement = function (id) {
      return this.templateElements() + '/' + encodeURIComponent(id);
    };

    service.templateInstances = function () {
      return apiService + '/template-instances';
    };

    service.getTemplateInstance = function (id) {
      return this.templateInstances() + '/' + encodeURIComponent(id);
    };

    service.users = function () {
      return userService + '/users';
    };

    service.getUser = function (id) {
      return this.users() + '/' + encodeURIComponent(id);
    };

    return service;
  };

});
