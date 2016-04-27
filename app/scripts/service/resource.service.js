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
    'CedarUser',
    'HttpBuilderService',
    'UISettingsService',
    'UrlService'
  ];

  function resourceService($http, $timeout, authorizedBackendService, cedarUser, httpBuilderService, uiSettingsService, urlService) {

    var searchTerm = null;
    var service = {
      createFolder: createFolder,
      deleteFolder: deleteFolder,
      getFacets: getFacets,
      getFolder: getFolder,
      getResources: getResources,
      searchResources: searchResources
    };
    return service;

    /**
     * Service methods.
     */

    function createFolder(name, path, description, successCallback, errorCallback) {
      var url = urlService.folders();
      var payload = {
        path: path,
        name: name,
        description: description
      };
      authorizedBackendService.doCall(
        httpBuilderService.post(url, payload),
        function(response) {
          successCallback(response.data);
        },
        errorCallback
      );
    }

    function deleteFolder(folderId, successCallback, errorCallback) {
      var url = urlService.folders() + '/' + folderId;
      authorizedBackendService.doCall(
        httpBuilderService.delete(url),
        function(response) {
          debugger;
          successCallback(response.data);
        },
        errorCallback
      );
    }

    function getFacets(successCallback, errorCallback) {
      var dummyData = {
        facets: {
          "author": {
            "totalCount": 245,
            "nodes": [
              {
                "label": "Author 1",
                "key": "authorIdFromIndex1",
                "numberOfMatches": 6,
                "selected": true,
                "hasChildren": false
              },
              {
                "label": "Author 2",
                "key": "authorIdFromIndex2",
                "numberOfMatches": 7,
                "selected": false,
                "hasChildren": false
              },
              {
                "label": "Author 3",
                "key": "authorIdFromIndex3",
                "numberOfMatches": 8,
                "selected": false,
                "hasChildren": false
              }
            ]
          },
          "status": {
            "totalCount": 3,
            "nodes": [
              {
                "label": "Draft",
                "key": "draft",
                "numberOfMatches": 20,
                "selected": false,
                "hasChildren": false
              },
              {
                "label": "Complete",
                "key": "complete",
                "numberOfMatches": 255,
                "selected": false,
                "hasChildren": false
              },
              {
                "label": "Reviewed",
                "key": "reviewed",
                "numberOfMatches": 10,
                "selected": false,
                "hasChildren": false
              }
            ]
          },
          "term": {
            "totalCount": 8,
            "nodes": [
              {
                "label": "CTO",
                "key": "CTO",
                "numberOfMatches": 3,
                "selected": false,
                "hasChildren": false
              },
              {
                "label": "ICD",
                "key": "ICD",
                "numberOfMatches": 10,
                "selected": false,
                "hasChildren": false
              },
              {
                "label": "SNOMED-CT",
                "key": "SNOMED-CT",
                "numberOfMatches": 6,
                "selected": false,
                "hasChildren": true,
                "nodes" :[
                  {
                    "label": "Influenza",
                    "key": "INF",
                    "numberOfMatches": 6,
                    "hasChildren": true,
                    "nodes" :[
                      {
                        "label": "bronchitis",
                        "key": "BRONCH",
                        "numberOfMatches": 6,
                        "selected": false,
                        "hasChildren": false
                      }
                    ]
                  }
                ]
              }
            ]
          }
        }
      }
      var response = { data: dummyData };
      successCallback(response.data);
      return;

      var url = UrlService.facets();
      authorizedBackendService.doCall(
        httpBuilderService.get(url),
        function(response) {
          successCallback(response.data);
        },
        errorCallback
      );
    }

    function getFolder(folderId, options = {}, successCallback, errorCallback) {
      var resourceTypes = options.resourceTypes || uiSettingsService.getResourceTypeFilters().map(function(obj) { return obj.resourceType });
      var url = urlService.folders() + '/' + encodeURIComponent(folderId);

      authorizedBackendService.doCall(
        httpBuilderService.get(url),
        function(response) {
          successCallback(response.data);
        },
        errorCallback
      );
    }

    function getResources(options = {}, successCallback, errorCallback) {
      var resourceTypes = options.resourceTypes || uiSettingsService.getResourceTypeFilters().map(function(obj) { return obj.resourceType });
      var url = urlService.folders();
      if (options.path) {
        url += '/contents?path=' + options.path + '&';
      }
      if (options.folderId) {
        url += '/' + encodeURIComponent(options.folderId) + '/contents?';
      }
      url += 'resource_types=' + resourceTypes.join(',');
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
      var url = urlService.search() + '?';

      // if (searchTerm) {
      //   url += 'search_term=' + searchTerm + '&';
      // }
      // url += 'resource_types=' + resourceTypes.join(',');
      // if (options.sort) {
      //   url += '&sort=' + options.sort;
      // }
      // if (options.limit) {
      //   url += '&limit=' + options.limit;
      // }
      // if (options.offset) {
      //   url += '&offset=' + options.offset;
      // }

      url += 'q=dummy';

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
