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
      getFacets: getFacets,
      getResources: getResources,
      searchResources: searchResources
    };
    return service;

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
