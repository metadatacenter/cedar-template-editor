'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.service.resourceService', [])
    .service('resourceService', resourceService);

  resourceService.$inject = [
    '$http',
    '$timeout',
    'AuthorizedBackendService',
    'Cedar',
    'HttpBuilderService',
    'UISettingsService',
    'UrlService'
  ];

  function resourceService($http, $timeout, authorizedBackendService, cedar, httpBuilderService, uiSettingsService, urlService) {

    var searchTerm = null;
    var service = {
      getResources: getResources,
      searchResources: searchResources
    };
    return service;

    function getResources(options = {}, successCallback, errorCallback) {
      var homeDir = cedar.getHome();
      var resourceTypes = options.resourceTypes || uiSettingsService.getResourceTypeFilters().map(function(obj) { return obj.resourceType });
      var url = urlService.folders() + '?path=' + homeDir + '&resource_types=' + resourceTypes.join(',');
      if (options.sort) {
        url += '&sort=' + options.sort;
      }
      if (options.limit) {
        url += '&limit=' + options.limit;
      }
      if (options.offset) {
        url += '&offset=' + options.offset;
      }

      authorizedBackendService.doCall(
        httpBuilderService.get(url),
        function(response) {
          successCallback(response.data);
        },
        errorCallback
      );
    }

    function searchResources(searchTerm, options = {}, successCallback, errorCallback) {
      this.searchTerm = searchTerm;
      var resourceTypes = options.resourceTypes || uiSettingsService.getResourceTypeFilters().map(function(obj) { return obj.resourceType });
      var url = urlService.search() + '?search_term=' + searchTerm + '&resource_types=' + resourceTypes.join(',');
      if (options.sort) {
        url += '&sort=' + options.sort;
      }
      if (options.limit) {
        url += '&limit=' + options.limit;
      }
      if (options.offset) {
        url += '&offset=' + options.offset;
      }
      
      // dummy data
      var dummyData = {
        "totalCount": 456,
        "currentOffset": 0,
        "paging": {
          //same structure as in the case of folder view
        },
        "resources": [
          {
            "id":"0239092a-9ce7-45cf-8efc-ebfdd3e95ed4",
            "type":null,
            "resourceType":"field",
            "path":"/Users/394c230b-ed59-4959-95b7-e7195fcb5aa6/Search 0",
            "name":"Search 0",
            "description":"Description Search 0",
            "createdOn":"2016-04-14T22:07:04Z",
            "lastUpdatedOn":"2016-04-14T22:07:04Z",
            "createdBy": {
              "id":"cb90e316-faed-4591-b9de-52ea3cd02915",
              "name":"User Name 0"
            },
            "lastUpdatedBy": {
              "id":"cb90e316-faed-4591-b9de-52ea3cd02915",
              "name":"User Name 0"
            }
          },
          {
            "id":"0239092a-9ce7-45cf-8efc-ebfdd3e95ed4",
            "type":null,
            "resourceType":"field",
            "path":"/Users/394c230b-ed59-4959-95b7-e7195fcb5aa6/Search 1",
            "name":"Search 1",
            "description":"Description Search 1",
            "createdOn":"2016-04-14T22:07:04Z",
            "lastUpdatedOn":"2016-04-14T22:07:04Z",
            "createdBy": {
              "id":"cb90e316-faed-4591-b9de-52ea3cd02915",
              "name":"User Name 0"
            },
            "lastUpdatedBy": {
              "id":"cb90e316-faed-4591-b9de-52ea3cd02915",
              "name":"User Name 0"
            }
          }
        ],
        "facets": {
          //same structure as in the case of facet call
        }
      };
      successCallback(dummyData);
      return;

      authorizedBackendService.doCall(
        httpBuilderService.get(url),
        function(response) {
          successCallback(response.data);
        },
        errorCallback
      );
    }

  }

});
