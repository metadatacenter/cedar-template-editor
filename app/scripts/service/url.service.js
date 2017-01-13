'use strict';

define([
  'angular',
  'json!config/url-service.conf.json'
], function (angular, config) {
  angular.module('cedar.templateEditor.service.urlService', [])
      .service('UrlService', UrlService);

  UrlService.$inject = [];

  function UrlService() {

    var userService = null;
    var terminologyService = null;
    var resourceService = null;
    var valueRecommenderService = null;
    var schemaService = null;
    var groupService = null;
    var biosampleService = null;

    var service = {
      serviceId: "UrlService"
    };

    service.init = function () {
      userService = config.userRestAPI;
      terminologyService = config.terminologyRestAPI;
      resourceService = config.resourceRestAPI;
      valueRecommenderService = config.valueRecommenderRestAPI;
      schemaService = config.schemaRestAPI;
      groupService = config.groupRestAPI;
      biosampleService = config.biosampleRestAPI;
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

    service.getInstanceCreate = function (id, folderId) {
      return '/instances/create/' + id + '?folderId=' + encodeURIComponent(folderId);
    };

    service.getInstanceEdit = function (id) {
      return "/instances/edit/" + id;
    };

    service.base = function () {
      return resourceService;
    };

    service.templates = function () {
      return this.base() + '/templates';
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

    service.getTemplateElement = function (id) {
      return this.templateElements() + '/' + encodeURIComponent(id);
    };

    service.postTemplateElement = function (folderId) {
      return this.templateElements() + '?folderId=' + encodeURIComponent(folderId);
    };

    service.templateInstances = function () {
      return this.base() + '/template-instances';
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

    service.groupBase = function () {
      return groupService;
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

    service.getSearchPath = function (term) {
      return '/dashboard?search=' + encodeURIComponent(term);
    };

    service.getFolderContents = function (folderId) {
      return '/dashboard?folderId=' + encodeURIComponent(folderId);
    };

    service.getFolder = function (id) {
      return this.folders() + '/' + encodeURIComponent(id);
    };

    service.folders = function () {
      return this.resourceBase() + "/folders";
    };

    service.search = function () {
      return this.resourceBase() + "/search";
    };

    service.sharedWithMe = function () {
      return this.resourceBase() + "/view/shared-with-me";
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

    service.copyResourceToFolder = function () {
      return this.resourceBase() + "/command/copy-resource-to-folder";
    };

    service.moveNodeToFolder = function () {
      return this.resourceBase() + "/command/move-node-to-folder";
    };

    service.getUsers = function () {
      return this.resourceBase() + "/users";
    };

    service.getGroups = function () {
      return this.groupBase() + "/groups";
    };

    service.templateElementPermission = function (id) {
      return this.resourceBase() + '/template-elements/' + encodeURIComponent(id) + "/permissions";
    };

    service.templatePermission = function (id) {
      return this.resourceBase() + '/templates/' + encodeURIComponent(id) + "/permissions";
    };

    service.templateInstancePermission = function (id) {
      return this.resourceBase() + '/template-instances/' + encodeURIComponent(id) + "/permissions";
    };

    service.folderPermission = function (id) {
      return this.resourceBase() + '/folders/' + encodeURIComponent(id) + "/permissions";
    };

    service.getGroup = function (id) {
      return this.getGroups() + '/' + encodeURIComponent(id);
    };

    service.getGroupMembers = function (id) {
      return  this.getGroups() +  '/' + encodeURIComponent(id)  + "/users";
    };

    service.biosampleValidation = function (instance) {
      return biosampleService + '/validate';
    };

    service.getMyWorkspace = function () {
      return '/dashboard';
    };

    service.getSearchAll = function (folderId) {
      return '/dashboard?search=&folderId=' + folderId;
    };

    service.getSharedWithMe = function (folderId) {
      return '/dashboard?sharing=shared-with-me&folderId=' + folderId;
    };

    return service;
  };

});
