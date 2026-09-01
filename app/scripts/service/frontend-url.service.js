'use strict';

define([
  'angular',
  'json!config/url-service.conf.json'
], function (angular, config) {
  angular.module('cedar.templateEditor.service.frontendUrlService', [])
      .service('FrontendUrlService', FrontendUrlService);

  FrontendUrlService.$inject = [];

  function FrontendUrlService() {

    let openViewBase = null;
    let dataciteDOIBase = null
    let downloadBase = null
    let monitoringBase = null

    let service = {
      serviceId: "FrontendUrlService"
    };

    function withQuery(url, params) {
      var query = Object.keys(params || {}).filter(function (key) {
        return params[key] !== null && params[key] !== undefined && params[key] !== '';
      }).map(function (key) {
        return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
      }).join('&');
      return query ? url + '?' + query : url;
    }

    service.init = function () {
      openViewBase = config.openViewBase;
      dataciteDOIBase = config.dataciteDOIBase;
      downloadBase = config.downloadBase;
      monitoringBase = config.monitoringFrontend;
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

    service.getInstanceCreate = function (id, folderId, returnTo) {
      return withQuery('/instances/create/' + id, {folderId: folderId, returnTo: returnTo});
    };

    service.getInstanceEdit = function (id, folderId, returnTo) {
      return withQuery('/instances/edit/' + id, {folderId: folderId, returnTo: returnTo});
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

    service.getSpecialFolders = function (folderId) {
      return '/dashboard?viewMode=view-special-folders&folderId=' + folderId;
    };

    service.getSharedWithEverybody = function (folderId) {
      return '/dashboard?sharing=shared-with-everybody&folderId=' + folderId;
    };

    service.getMessaging = function (folderId) {
      return '/messaging?folderId=' + encodeURIComponent(folderId);
    };

    service.openField = function (id) {
      return openViewBase + '/template-fields/' + encodeURIComponent(id);
    };

    service.openElement = function (id) {
      return openViewBase + '/template-elements/' + encodeURIComponent(id);
    };

    service.openTemplate = function (id) {
      return openViewBase + '/templates/' + encodeURIComponent(id);
    };

    service.openInstance = function (id) {
      return openViewBase + '/template-instances/' + encodeURIComponent(id);
    };

    service.openFolder = function (id) {
      return openViewBase + '/folders/' + encodeURIComponent(id);
    };

    service.dataciteTemplate = function (id) {
      return dataciteDOIBase + '/' + encodeURIComponent(id);
    };

    service.dataciteInstance = function (id) {
      return dataciteDOIBase + '/' + encodeURIComponent(id);
    };

    service.downloadResource = function (id) {
      return downloadBase + '/' + encodeURIComponent(id);
    };

    // The CEDAR monitoring dashboard: a separate CEDAR frontend on the same Keycloak realm,
    // so it opens in a new tab but the user stays signed in.
    service.getMonitoring = function () {
      return monitoringBase;
    };

    return service;
  }

});
