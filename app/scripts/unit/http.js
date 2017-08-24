'use strict';

var http = {

      httpBackend: null,

      init: function ($httpBackend) {
        this.httpBackend = $httpBackend;
      },

      getFile: function (dest) {
        // returns the appropriate file content when requested
        this.httpBackend.whenGET(dest).respond(function (method, url, data) {
          var request = new XMLHttpRequest();
          request.open('GET', dest, false);
          request.send(null);
          return [request.status, request.response, {}];
        });
      },

      getUrl: function (base, service, location) {
        var url = base.replace('resource', service) + location;
        var result = this.config[location];
        console.log('getUrl', location, result);

        this.httpBackend.whenGET(url).respond(
            function (method, url, data) {
              var newElement = angular.fromJson(result);
              return [200, result, {}];
            });
      },


      config: {
        "/summary"                                                                                                                                                                                      : {
          "total"      : 7,
          "unread"     : 1,
          "notnotified": 0
        },
        "/folders/https%3A%2F%2Frepo.metadatacenter.orgx%2Ffolders%2F22e37611-192e-4faa-aa6d-4b1dcad3b898/contents?limit=500&offset=0&resource_types=template,element,instance,folder&sort=-createdOnTS": {},
        "/template-elements/https%3A%2F%2Frepo.metadatacenter.orgx%2Ftemplate-elements%2F7ce9f613-ff0b-427b-a007-4d3b0cbe1fbb"                                                                          : {},
        "/folders/https%3A%2F%2Frepo.metadatacenter.orgx%2Ffolders%2Ff55c5f4b-1ee6-4839-8836-fcb7509cecfe/contents?limit=500&offset=0&resource_types=template,element,instance,folder&sort=-createdOnTS": {
          "request"          : {
            "limit"          : 500,
            "offset"         : 0,
            "sort"           : [
              "-lastUpdatedOnTS"
            ],
            "q"              : null,
            "resource_types" : [
              "element",
              "instance",
              "template",
              "folder"
            ],
            "derived_from_id": null
          },
          "totalCount"       : 1,
          "currentOffset"    : 0,
          "paging"           : {
            "last" : "http://127.0.0.1:9008/folders/https%3A%2F%2Frepo.metadatacenter.orgx%2Ffolders%2Ff55c5f4b-1ee6-4839-8836-fcb7509cecfe/contents?resource_types=element%2Cinstance%2Ctemplate%2Cfolder&sort=-lastUpdatedOnTS&offset=0&limit=500",
            "first": "http://127.0.0.1:9008/folders/https%3A%2F%2Frepo.metadatacenter.orgx%2Ffolders%2Ff55c5f4b-1ee6-4839-8836-fcb7509cecfe/contents?resource_types=element%2Cinstance%2Ctemplate%2Cfolder&sort=-lastUpdatedOnTS&offset=0&limit=500"
          },
          "resources"        : [
            {
              "nodeType"              : "template",
              "createdOnTS"           : 1502146462,
              "lastUpdatedOnTS"       : 1502146462,
              "name"                  : "test",
              "description"           : "Description",
              "displayName"           : "test",
              "path"                  : null,
              "parentPath"            : null,
              "displayPath"           : null,
              "displayParentPath"     : null,
              "ownedBy"               : "https://metadatacenter.org/users/467ac575-c434-42ae-b991-e254adc8023e",
              "currentUserPermissions": [],
              "createdByUserName"     : null,
              "lastUpdatedByUserName" : null,
              "ownedByUserName"       : null,
              "@id"                   : "https://repo.metadatacenter.orgx/templates/ccfc1135-5f90-4f53-94c1-0a5a8cf02f77",
              "pav:createdOn"         : "2017-08-07T15:54:22-0700",
              "pav:lastUpdatedOn"     : "2017-08-07T15:54:22-0700",
              "pav:createdBy"         : "https://metadatacenter.org/users/467ac575-c434-42ae-b991-e254adc8023e",
              "oslc:modifiedBy"       : "https://metadatacenter.org/users/467ac575-c434-42ae-b991-e254adc8023e",
              "@context"              : {
                "schema": "http://schema.org/",
                "pav"   : "http://purl.org/pav/",
                "oslc"  : "http://open-services.net/ns/core#"
              },
              "nodeType"              : "template"
            }
          ],
          "pathInfo"         : [
            {
              "nodeType"              : "folder",
              "createdOnTS"           : 1499799926,
              "lastUpdatedOnTS"       : 1499799926,
              "name"                  : "/",
              "description"           : "CEDAR Root Folder",
              "displayName"           : "/",
              "path"                  : null,
              "parentPath"            : null,
              "displayPath"           : null,
              "displayParentPath"     : null,
              "ownedBy"               : "https://metadatacenter.org/users/2d083642-f6b2-40af-ae62-2935be65f218",
              "currentUserPermissions": [],
              "createdByUserName"     : null,
              "lastUpdatedByUserName" : null,
              "ownedByUserName"       : null,
              "@id"                   : "https://repo.metadatacenter.orgx/folders/4bd43fee-5921-4672-bd07-1be05efe5399",
              "pav:createdOn"         : "2017-07-11T12:05:26-0700",
              "pav:lastUpdatedOn"     : "2017-07-11T12:05:26-0700",
              "pav:createdBy"         : "https://metadatacenter.org/users/2d083642-f6b2-40af-ae62-2935be65f218",
              "oslc:modifiedBy"       : "https://metadatacenter.org/users/2d083642-f6b2-40af-ae62-2935be65f218",
              "isUserHome"            : false,
              "isSystem"              : true,
              "isRoot"                : true,
              "@context"              : {
                "schema": "http://schema.org/",
                "pav"   : "http://purl.org/pav/",
                "oslc"  : "http://open-services.net/ns/core#"
              },
              "nodeType"              : "folder"
            },
            {
              "nodeType"              : "folder",
              "createdOnTS"           : 1499799926,
              "lastUpdatedOnTS"       : 1499799926,
              "name"                  : "Users",
              "description"           : "CEDAR Users",
              "displayName"           : "Users",
              "path"                  : null,
              "parentPath"            : null,
              "displayPath"           : null,
              "displayParentPath"     : null,
              "ownedBy"               : "https://metadatacenter.org/users/2d083642-f6b2-40af-ae62-2935be65f218",
              "currentUserPermissions": [],
              "createdByUserName"     : null,
              "lastUpdatedByUserName" : null,
              "ownedByUserName"       : null,
              "@id"                   : "https://repo.metadatacenter.orgx/folders/22e37611-192e-4faa-aa6d-4b1dcad3b898",
              "pav:createdOn"         : "2017-07-11T12:05:26-0700",
              "pav:lastUpdatedOn"     : "2017-07-11T12:05:26-0700",
              "pav:createdBy"         : "https://metadatacenter.org/users/2d083642-f6b2-40af-ae62-2935be65f218",
              "oslc:modifiedBy"       : "https://metadatacenter.org/users/2d083642-f6b2-40af-ae62-2935be65f218",
              "isUserHome"            : false,
              "isSystem"              : true,
              "isRoot"                : false,
              "@context"              : {
                "schema": "http://schema.org/",
                "pav"   : "http://purl.org/pav/",
                "oslc"  : "http://open-services.net/ns/core#"
              },
              "nodeType"              : "folder"
            },
            {
              "nodeType"              : "folder",
              "createdOnTS"           : 1499799927,
              "lastUpdatedOnTS"       : 1499799927,
              "name"                  : "Test User 2",
              "description"           : "Home folder of Test User 2",
              "displayName"           : "Test User 2",
              "path"                  : null,
              "parentPath"            : null,
              "displayPath"           : null,
              "displayParentPath"     : null,
              "ownedBy"               : "https://metadatacenter.org/users/467ac575-c434-42ae-b991-e254adc8023e",
              "currentUserPermissions": [],
              "createdByUserName"     : null,
              "lastUpdatedByUserName" : null,
              "ownedByUserName"       : null,
              "@id"                   : "https://repo.metadatacenter.orgx/folders/f55c5f4b-1ee6-4839-8836-fcb7509cecfe",
              "pav:createdOn"         : "2017-07-11T12:05:27-0700",
              "pav:lastUpdatedOn"     : "2017-07-11T12:05:27-0700",
              "pav:createdBy"         : "https://metadatacenter.org/users/467ac575-c434-42ae-b991-e254adc8023e",
              "oslc:modifiedBy"       : "https://metadatacenter.org/users/467ac575-c434-42ae-b991-e254adc8023e",
              "isUserHome"            : true,
              "isSystem"              : false,
              "isRoot"                : false,
              "@context"              : {
                "schema": "http://schema.org/",
                "pav"   : "http://purl.org/pav/",
                "oslc"  : "http://open-services.net/ns/core#"
              },
              "nodeType"              : "folder"
            }
          ],
          "nodeListQueryType": "folder-content"
        }
      }
    }
;


