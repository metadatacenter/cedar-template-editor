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
    'UrlService',
    'CONST'
  ];

  function resourceService($http, $timeout, authorizedBackendService, cedarUser, httpBuilderService, uiSettingsService, urlService, CONST) {

    var searchTerm = null;
    var service = {
      createFolder: createFolder,
      deleteFolder: deleteFolder,
      deleteResource: deleteResource,
      getFacets: getFacets,
      getResourceDetail: getResourceDetail,
      getResources: getResources,
      searchResources: searchResources,
      updateFolder: updateFolder
    };
    return service;

    /**
     * Service methods.
     */

    function createFolder(parentFolderId, name, description, successCallback, errorCallback) {
      var url = urlService.folders();
      var payload = {
        folderId: parentFolderId,
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

    function deleteResource(resource, successCallback, errorCallback) {
      var url;
      var id = resource['@id'];
      switch (resource.resourceType) {
      case CONST.resourceType.FOLDER:
        url = urlService.getFolder(id);
        break;
      case CONST.resourceType.TEMPLATE:
        url = urlService.getTemplate(id);
        break;
      case CONST.resourceType.ELEMENT:
        url = urlService.getTemplateElement(id);
        break;
      case CONST.resourceType.INSTANCE:
        url = urlService.getTemplateInstance(id);
        break;
      }
      authorizedBackendService.doCall(
        httpBuilderService.delete(url),
        function(response) {
          successCallback(response.data);
        },
        errorCallback
      );
    }

    function deleteFolder(folderId, successCallback, errorCallback) {
      var url = urlService.folders() + '/' + encodeURIComponent(folderId);
      authorizedBackendService.doCall(
        httpBuilderService.delete(url),
        function(response) {
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
                        "label": "Influenza Type A",
                        "key": "INFA",
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

    function getResourceDetail(resource, successCallback, errorCallback) {
      var url;
      var id = resource['@id'];
      switch (resource.resourceType) {
      case CONST.resourceType.FOLDER:
        url = urlService.folders() + '/' + encodeURIComponent(id);
        break;
      case CONST.resourceType.ELEMENT:
        url = urlService.getTemplateElement(id) + '/details';
        break;
      case CONST.resourceType.TEMPLATE:
        url = urlService.getTemplate(id) + '/details';
        break;
      case CONST.resourceType.INSTANCE:
        url = urlService.getTemplateInstance(id) + '/details';
        break;
      }
      authorizedBackendService.doCall(
        httpBuilderService.get(url),
        function(response) {
          successCallback(response.data);
        },
        errorCallback
      );
    };

    function getResources(options, successCallback, errorCallback) {
      if (options == null) {
        options = {};
      }
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

    function searchResources(searchTerm, options, successCallback, errorCallback) {
      if (options == null) {
        options = {};
      }
      this.searchTerm = searchTerm;
      var resourceTypes = options.resourceTypes || uiSettingsService.getResourceTypeFilters().map(function(obj) { return obj.resourceType });
      var url = urlService.search() + '?';

      if (searchTerm == 'null') {
        searchTerm = '';
      }

      if (searchTerm) {
        url += 'q=' + searchTerm + '&';
      }
      url += 'resource_types=' + resourceTypes.join(',');
      if ('sort' in options) {
        url += '&sort=' + options.sort;
      }
      if ('limit' in options) {
        url += '&limit=' + options.limit;
      }
      if ('offset' in options) {
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

    function updateFolder(folder, successCallback, errorCallback) {
      var url = urlService.getFolder(folder['@id']);

      authorizedBackendService.doCall(
        httpBuilderService.put(url, angular.toJson(folder)),
        function(response) {
          successCallback(response.data);
        },
        errorCallback
      );

    }

  }

});
