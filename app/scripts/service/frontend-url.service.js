'use strict';

define([
  'angular',
  'json!config/url-service.conf.json'
], function (angular, config) {
  angular.module('cedar.templateEditor.service.frontendUrlService', [])
      .service('FrontendUrlService', FrontendUrlService);

  FrontendUrlService.$inject = [];

  function FrontendUrlService() {

    var openMetadataBase = null;

    var service = {
      serviceId: "FrontendUrlService"
    };

    service.init = function () {
      openMetadataBase = config.openMetadataBase;
    };

    service.getTemplateEdit = function (id) {
      return "/templates/edit/" + id;
    };

    service.getElementEdit = function (id) {
      return "/elements/edit/" + id;
    };

    service.getFieldEdit = function (id) {
      return "/fields/edit/" + id;
    };

    service.getInstanceCreate = function (id, folderId) {
      return '/instances/create/' + id + '?folderId=' + encodeURIComponent(folderId);
    };

    service.getInstanceEdit = function (id) {
      return "/instances/edit/" + id;
    };

    service.getFolderContents = function (folderId) {
      return '/dashboard?folderId=' + encodeURIComponent(folderId);
    };

    service.getMyWorkspace = function () {
      return '/dashboard';
    };

    service.getSearchAll = function (folderId) {
      return '/dashboard?search=*&folderId=' + folderId;
    };

    service.getSharedWithMe = function (folderId) {
      return '/dashboard?sharing=shared-with-me&folderId=' + folderId;
    };

    service.getMessaging = function (folderId) {
      return '/messaging?folderId=' + encodeURIComponent(folderId);
    };

    service.openField = function (id) {
      return openMetadataBase + '/template-fields/' + encodeURIComponent(id);
    };

    service.openElement = function (id) {
      return openMetadataBase + '/template-elements/' + encodeURIComponent(id);
    };

    service.openTemplate = function (id) {
      return openMetadataBase + '/templates/' + encodeURIComponent(id);
    };

    service.openInstance = function (id) {
      return openMetadataBase + '/template-instances/' + encodeURIComponent(id);
    };

    return service;
  }

});
