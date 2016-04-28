'use strict';

define([
  'angular',
  'json!config/url-service.conf.json'
], function (angular, config) {
  angular.module('cedar.templateEditor.service.urlService', [])
      .service('UrlService', UrlService);

  UrlService.$inject = [];

  function UrlService() {

    var apiService = null;
    var userService = null;
    var terminologyService = null;
    var resourceService = null;
    var valueRecommenderService = null;
    var schemaService = null;

    var service = {
      serviceId: "UrlService"
    };

    service.init = function () {
      apiService = config.cedarRestAPI;
      userService = config.userRestAPI;
      terminologyService = config.terminologyRestAPI;
      resourceService = config.resourceRestAPI;
      valueRecommenderService = config.valueRecommenderRestAPI;
      schemaService = config.schemaRestAPI;
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
      return this.templatesOld() + '?summary=true' + '&limit=' + limit + '&offset=' + offset;
    };

    service.getAllTemplatesSummary = function () {
      return this.getDefaultTemplatesSummary(300, 0);
    };

    service.getDefaultTemplateElementsSummary = function (limit, offset) {
      return this.templateElementsOld() + '?summary=true' + '&limit=' + limit + '&offset=' + offset;
    };

    service.getAllTemplateElementsSummary = function () {
      return this.getDefaultTemplateElementsSummary(300, 0);
    };

    service.getDefaultTemplateInstancesSummary = function (limit, offset) {
      return this.templateInstancesOld() + '?summary=true' + '&limit=' + limit + '&offset=' + offset;
    };

    service.getAllTemplateInstancesSummary = function () {
      return this.getDefaultTemplateInstancesSummary(300, 0);
    };

    service.base = function () {
      return resourceService;
    };

    service.oldBase = function () {
      return apiService;
    };

    service.templates = function () {
      return this.base() + '/templates';
    };

    service.templatesOld = function () {
      return this.oldBase() + '/templates';
    };

    service.getTemplate = function (id) {
      return this.templates() + '/' + encodeURIComponent(id);
    };

    service.postTemplate = function (folderId) {
      return this.templates() + '?folderId=' + encodeURIComponent(folderId);
    };

    service.templateElements = function () {
      return this.base() + '/template-elements';
    };

    service.templateElementsOld = function () {
      return this.oldBase() + '/template-elements';
    };

    service.getTemplateElement = function (id) {
      return this.templateElements() + '/' + encodeURIComponent(id);
    };

    service.postTemplateElement = function (folderId) {
      return this.templateElements() + '?folderId=' + encodeURIComponent(folderId);
    };

    service.templateInstances = function () {
      return this.base() + '/template-instances';
    };

    service.templateInstancesOld = function () {
      return this.oldBase() + '/template-instances';
    };

    service.getTemplateInstance = function (id) {
      return this.templateInstances() + '/' + encodeURIComponent(id);
    };

    service.postTemplateInstance = function (folderId) {
      return this.templateInstances() + '?folderId=' + encodeURIComponent(folderId);
    };

    service.users = function () {
      return userService + '/users';
    };

    service.getUser = function (id) {
      return this.users() + '/' + encodeURIComponent(id);
    };

    service.terminology = function () {
      return terminologyService;
    };

    service.valueRecommender = function () {
      return valueRecommenderService;
    };

    service.getValueRecommendation = function () {
      return this.valueRecommender() + '/recommend';
    };

    service.hasInstances = function (templateId) {
      return this.valueRecommender() + '/has-instances?template_id=' + templateId;
    };

    service.resourceBase = function () {
      return resourceService;
    };

    service.getFolderContents = function(id) {
      return '/folder?id=' + encodeURIComponent(id);
    };

    service.getFolder = function (id) {
      return this.folders() + encodeURIComponent(id);
    };

    service.folders = function () {
      return this.resourceBase() + "/folders";
    };

    service.search = function () {
      return this.resourceBase() + "/search";
    };

    service.facets = function () {
      return this.resourceBase() + "/facets";
    };

    service.resources = function () {
      return this.resourceBase() + "/resources";
    };

    service.schemaBase = function () {
      return schemaService;
    };

    service.schemaProperties = function () {
      return this.schemaBase() + "/properties";
    };

    service.schemaProperty = function (propertyName) {
      return this.schemaProperties() + "/" + propertyName;
    };

    return service;
  };

});
