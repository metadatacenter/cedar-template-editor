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
        "/folders/https%3A%2F%2Frepo.metadatacenter.orgx%2Ffolders%2Ff55c5f4b-1ee6-4839-8836-fcb7509cecfe/contents?limit=100&offset=0&resource_types=folder&sort=createdOnTS"                           : {
          "request": {
            "limit": 100,
            "offset": 0,
            "sort": ["createdOnTS"],
            "q": null,
            "resource_types": ["element", "folder"],
            "derived_from_id": null
          },
          "totalCount": 10,
          "currentOffset": 0,
          "paging": {
            "last": "http://127.0.0.1:9008/folders/https%3A%2F%2Frepo.metadatacenter.orgx%2Ffolders%2Ff55c5f4b-1ee6-4839-8836-fcb7509cecfe/contents?resource_types=element%2Cfolder&sort=createdOnTS&offset=0&limit=100",
            "first": "http://127.0.0.1:9008/folders/https%3A%2F%2Frepo.metadatacenter.orgx%2Ffolders%2Ff55c5f4b-1ee6-4839-8836-fcb7509cecfe/contents?resource_types=element%2Cfolder&sort=createdOnTS&offset=0&limit=100"
          },
          "resources": [{
            "nodeType": "folder",
            "createdOnTS": 1502146452,
            "lastUpdatedOnTS": 1502146452,
            "name": "testing",
            "description": "description",
            "displayName": "testing",
            "path": null,
            "parentPath": null,
            "displayPath": null,
            "displayParentPath": null,
            "ownedBy": "https://metadatacenter.org/users/467ac575-c434-42ae-b991-e254adc8023e",
            "currentUserPermissions": [],
            "createdByUserName": null,
            "lastUpdatedByUserName": null,
            "ownedByUserName": null,
            "@id": "https://repo.metadatacenter.orgx/folders/e074d1ee-b365-4321-abb5-01a4102cb06c",
            "pav:createdOn": "2017-08-07T15:54:12-0700",
            "pav:lastUpdatedOn": "2017-08-07T15:54:12-0700",
            "pav:createdBy": "https://metadatacenter.org/users/467ac575-c434-42ae-b991-e254adc8023e",
            "oslc:modifiedBy": "https://metadatacenter.org/users/467ac575-c434-42ae-b991-e254adc8023e",
            "isUserHome": false,
            "isSystem": false,
            "isRoot": false,
            "@context": {
              "schema": "http://schema.org/",
              "pav": "http://purl.org/pav/",
              "oslc": "http://open-services.net/ns/core#"
            },
            "nodeType": "folder"
          }, {
            "nodeType": "element",
            "createdOnTS": 1499810129,
            "lastUpdatedOnTS": 1499810129,
            "name": "element",
            "description": "Description",
            "displayName": "element",
            "path": null,
            "parentPath": null,
            "displayPath": null,
            "displayParentPath": null,
            "ownedBy": "https://metadatacenter.org/users/467ac575-c434-42ae-b991-e254adc8023e",
            "currentUserPermissions": [],
            "createdByUserName": null,
            "lastUpdatedByUserName": null,
            "ownedByUserName": null,
            "@id": "https://repo.metadatacenter.orgx/template-elements/204c00ac-b13b-4c4e-bc4e-d4568e5f44c3",
            "pav:createdOn": "2017-07-11T14:55:29-0700",
            "pav:lastUpdatedOn": "2017-07-11T14:55:29-0700",
            "pav:createdBy": "https://metadatacenter.org/users/467ac575-c434-42ae-b991-e254adc8023e",
            "oslc:modifiedBy": "https://metadatacenter.org/users/467ac575-c434-42ae-b991-e254adc8023e",
            "@context": {
              "schema": "http://schema.org/",
              "pav": "http://purl.org/pav/",
              "oslc": "http://open-services.net/ns/core#"
            },
            "nodeType": "element"
          }, {
            "nodeType": "element",
            "createdOnTS": 1499810169,
            "lastUpdatedOnTS": 1499814624,
            "name": "parent element",
            "description": "Description",
            "displayName": "parent element",
            "path": null,
            "parentPath": null,
            "displayPath": null,
            "displayParentPath": null,
            "ownedBy": "https://metadatacenter.org/users/467ac575-c434-42ae-b991-e254adc8023e",
            "currentUserPermissions": [],
            "createdByUserName": null,
            "lastUpdatedByUserName": null,
            "ownedByUserName": null,
            "@id": "https://repo.metadatacenter.orgx/template-elements/1dea391f-18a1-4185-86d2-68cd971afa43",
            "pav:createdOn": "2017-07-11T14:56:09-0700",
            "pav:lastUpdatedOn": "2017-07-11T16:10:24-0700",
            "pav:createdBy": "https://metadatacenter.org/users/467ac575-c434-42ae-b991-e254adc8023e",
            "oslc:modifiedBy": "https://metadatacenter.org/users/467ac575-c434-42ae-b991-e254adc8023e",
            "@context": {
              "schema": "http://schema.org/",
              "pav": "http://purl.org/pav/",
              "oslc": "http://open-services.net/ns/core#"
            },
            "nodeType": "element"
          }, {
            "nodeType": "element",
            "createdOnTS": 1499814283,
            "lastUpdatedOnTS": 1499814288,
            "name": "Untitled",
            "description": "Description",
            "displayName": "Untitled",
            "path": null,
            "parentPath": null,
            "displayPath": null,
            "displayParentPath": null,
            "ownedBy": "https://metadatacenter.org/users/467ac575-c434-42ae-b991-e254adc8023e",
            "currentUserPermissions": [],
            "createdByUserName": null,
            "lastUpdatedByUserName": null,
            "ownedByUserName": null,
            "@id": "https://repo.metadatacenter.orgx/template-elements/8e43ee1b-9ab5-4cac-81b8-906e47de5a96",
            "pav:createdOn": "2017-07-11T16:04:43-0700",
            "pav:lastUpdatedOn": "2017-07-11T16:04:48-0700",
            "pav:createdBy": "https://metadatacenter.org/users/467ac575-c434-42ae-b991-e254adc8023e",
            "oslc:modifiedBy": "https://metadatacenter.org/users/467ac575-c434-42ae-b991-e254adc8023e",
            "@context": {
              "schema": "http://schema.org/",
              "pav": "http://purl.org/pav/",
              "oslc": "http://open-services.net/ns/core#"
            },
            "nodeType": "element"
          }, {
            "nodeType": "element",
            "createdOnTS": 1500699258,
            "lastUpdatedOnTS": 1500699258,
            "name": "Untitled",
            "description": "Description",
            "displayName": "Untitled",
            "path": null,
            "parentPath": null,
            "displayPath": null,
            "displayParentPath": null,
            "ownedBy": "https://metadatacenter.org/users/467ac575-c434-42ae-b991-e254adc8023e",
            "currentUserPermissions": [],
            "createdByUserName": null,
            "lastUpdatedByUserName": null,
            "ownedByUserName": null,
            "@id": "https://repo.metadatacenter.orgx/template-elements/93d931b7-3e2d-40b0-a396-90329959bb08",
            "pav:createdOn": "2017-07-21T21:54:18-0700",
            "pav:lastUpdatedOn": "2017-07-21T21:54:18-0700",
            "pav:createdBy": "https://metadatacenter.org/users/467ac575-c434-42ae-b991-e254adc8023e",
            "oslc:modifiedBy": "https://metadatacenter.org/users/467ac575-c434-42ae-b991-e254adc8023e",
            "@context": {
              "schema": "http://schema.org/",
              "pav": "http://purl.org/pav/",
              "oslc": "http://open-services.net/ns/core#"
            },
            "nodeType": "element"
          }, {
            "nodeType": "element",
            "createdOnTS": 1501279403,
            "lastUpdatedOnTS": 1501279440,
            "name": "one",
            "description": "Description",
            "displayName": "one",
            "path": null,
            "parentPath": null,
            "displayPath": null,
            "displayParentPath": null,
            "ownedBy": "https://metadatacenter.org/users/467ac575-c434-42ae-b991-e254adc8023e",
            "currentUserPermissions": [],
            "createdByUserName": null,
            "lastUpdatedByUserName": null,
            "ownedByUserName": null,
            "@id": "https://repo.metadatacenter.orgx/template-elements/6adcfb0b-a275-43c9-9716-864e967e9fd4",
            "pav:createdOn": "2017-07-28T15:03:23-0700",
            "pav:lastUpdatedOn": "2017-07-28T15:04:00-0700",
            "pav:createdBy": "https://metadatacenter.org/users/467ac575-c434-42ae-b991-e254adc8023e",
            "oslc:modifiedBy": "https://metadatacenter.org/users/467ac575-c434-42ae-b991-e254adc8023e",
            "@context": {
              "schema": "http://schema.org/",
              "pav": "http://purl.org/pav/",
              "oslc": "http://open-services.net/ns/core#"
            },
            "nodeType": "element"
          }, {
            "nodeType": "element",
            "createdOnTS": 1501279412,
            "lastUpdatedOnTS": 1501279421,
            "name": "one again",
            "description": "Description",
            "displayName": "one again",
            "path": null,
            "parentPath": null,
            "displayPath": null,
            "displayParentPath": null,
            "ownedBy": "https://metadatacenter.org/users/467ac575-c434-42ae-b991-e254adc8023e",
            "currentUserPermissions": [],
            "createdByUserName": null,
            "lastUpdatedByUserName": null,
            "ownedByUserName": null,
            "@id": "https://repo.metadatacenter.orgx/template-elements/81ee7cee-0f3c-4c1c-b375-3329e7838af9",
            "pav:createdOn": "2017-07-28T15:03:32-0700",
            "pav:lastUpdatedOn": "2017-07-28T15:03:41-0700",
            "pav:createdBy": "https://metadatacenter.org/users/467ac575-c434-42ae-b991-e254adc8023e",
            "oslc:modifiedBy": "https://metadatacenter.org/users/467ac575-c434-42ae-b991-e254adc8023e",
            "@context": {
              "schema": "http://schema.org/",
              "pav": "http://purl.org/pav/",
              "oslc": "http://open-services.net/ns/core#"
            },
            "nodeType": "element"
          }, {
            "nodeType": "element",
            "createdOnTS": 1501279497,
            "lastUpdatedOnTS": 1501279497,
            "name": "Untitled",
            "description": "Description",
            "displayName": "Untitled",
            "path": null,
            "parentPath": null,
            "displayPath": null,
            "displayParentPath": null,
            "ownedBy": "https://metadatacenter.org/users/467ac575-c434-42ae-b991-e254adc8023e",
            "currentUserPermissions": [],
            "createdByUserName": null,
            "lastUpdatedByUserName": null,
            "ownedByUserName": null,
            "@id": "https://repo.metadatacenter.orgx/template-elements/cb3d3560-cb3a-4934-a202-d1c5c0768e4f",
            "pav:createdOn": "2017-07-28T15:04:57-0700",
            "pav:lastUpdatedOn": "2017-07-28T15:04:57-0700",
            "pav:createdBy": "https://metadatacenter.org/users/467ac575-c434-42ae-b991-e254adc8023e",
            "oslc:modifiedBy": "https://metadatacenter.org/users/467ac575-c434-42ae-b991-e254adc8023e",
            "@context": {
              "schema": "http://schema.org/",
              "pav": "http://purl.org/pav/",
              "oslc": "http://open-services.net/ns/core#"
            },
            "nodeType": "element"
          }, {
            "nodeType": "element",
            "createdOnTS": 1501285535,
            "lastUpdatedOnTS": 1501285535,
            "name": "inner",
            "description": "Description",
            "displayName": "inner",
            "path": null,
            "parentPath": null,
            "displayPath": null,
            "displayParentPath": null,
            "ownedBy": "https://metadatacenter.org/users/467ac575-c434-42ae-b991-e254adc8023e",
            "currentUserPermissions": [],
            "createdByUserName": null,
            "lastUpdatedByUserName": null,
            "ownedByUserName": null,
            "@id": "https://repo.metadatacenter.orgx/template-elements/380ced27-cc3b-4c49-ba02-9aeafc591a8e",
            "pav:createdOn": "2017-07-28T16:45:35-0700",
            "pav:lastUpdatedOn": "2017-07-28T16:45:35-0700",
            "pav:createdBy": "https://metadatacenter.org/users/467ac575-c434-42ae-b991-e254adc8023e",
            "oslc:modifiedBy": "https://metadatacenter.org/users/467ac575-c434-42ae-b991-e254adc8023e",
            "@context": {
              "schema": "http://schema.org/",
              "pav": "http://purl.org/pav/",
              "oslc": "http://open-services.net/ns/core#"
            },
            "nodeType": "element"
          }, {
            "nodeType": "element",
            "createdOnTS": 1501285549,
            "lastUpdatedOnTS": 1501285580,
            "name": "parent",
            "description": "Description",
            "displayName": "parent",
            "path": null,
            "parentPath": null,
            "displayPath": null,
            "displayParentPath": null,
            "ownedBy": "https://metadatacenter.org/users/467ac575-c434-42ae-b991-e254adc8023e",
            "currentUserPermissions": [],
            "createdByUserName": null,
            "lastUpdatedByUserName": null,
            "ownedByUserName": null,
            "@id": "https://repo.metadatacenter.orgx/template-elements/ef324924-21b0-4eed-a389-b9ec7c880401",
            "pav:createdOn": "2017-07-28T16:45:49-0700",
            "pav:lastUpdatedOn": "2017-07-28T16:46:20-0700",
            "pav:createdBy": "https://metadatacenter.org/users/467ac575-c434-42ae-b991-e254adc8023e",
            "oslc:modifiedBy": "https://metadatacenter.org/users/467ac575-c434-42ae-b991-e254adc8023e",
            "@context": {
              "schema": "http://schema.org/",
              "pav": "http://purl.org/pav/",
              "oslc": "http://open-services.net/ns/core#"
            },
            "nodeType": "element"
          }],
          "pathInfo": [{
            "nodeType": "folder",
            "createdOnTS": 1499799926,
            "lastUpdatedOnTS": 1499799926,
            "name": "/",
            "description": "CEDAR Root Folder",
            "displayName": "/",
            "path": null,
            "parentPath": null,
            "displayPath": null,
            "displayParentPath": null,
            "ownedBy": "https://metadatacenter.org/users/2d083642-f6b2-40af-ae62-2935be65f218",
            "currentUserPermissions": [],
            "createdByUserName": null,
            "lastUpdatedByUserName": null,
            "ownedByUserName": null,
            "@id": "https://repo.metadatacenter.orgx/folders/4bd43fee-5921-4672-bd07-1be05efe5399",
            "pav:createdOn": "2017-07-11T12:05:26-0700",
            "pav:lastUpdatedOn": "2017-07-11T12:05:26-0700",
            "pav:createdBy": "https://metadatacenter.org/users/2d083642-f6b2-40af-ae62-2935be65f218",
            "oslc:modifiedBy": "https://metadatacenter.org/users/2d083642-f6b2-40af-ae62-2935be65f218",
            "isUserHome": false,
            "isSystem": true,
            "isRoot": true,
            "@context": {
              "schema": "http://schema.org/",
              "pav": "http://purl.org/pav/",
              "oslc": "http://open-services.net/ns/core#"
            },
            "nodeType": "folder"
          }, {
            "nodeType": "folder",
            "createdOnTS": 1499799926,
            "lastUpdatedOnTS": 1499799926,
            "name": "Users",
            "description": "CEDAR Users",
            "displayName": "Users",
            "path": null,
            "parentPath": null,
            "displayPath": null,
            "displayParentPath": null,
            "ownedBy": "https://metadatacenter.org/users/2d083642-f6b2-40af-ae62-2935be65f218",
            "currentUserPermissions": [],
            "createdByUserName": null,
            "lastUpdatedByUserName": null,
            "ownedByUserName": null,
            "@id": "https://repo.metadatacenter.orgx/folders/22e37611-192e-4faa-aa6d-4b1dcad3b898",
            "pav:createdOn": "2017-07-11T12:05:26-0700",
            "pav:lastUpdatedOn": "2017-07-11T12:05:26-0700",
            "pav:createdBy": "https://metadatacenter.org/users/2d083642-f6b2-40af-ae62-2935be65f218",
            "oslc:modifiedBy": "https://metadatacenter.org/users/2d083642-f6b2-40af-ae62-2935be65f218",
            "isUserHome": false,
            "isSystem": true,
            "isRoot": false,
            "@context": {
              "schema": "http://schema.org/",
              "pav": "http://purl.org/pav/",
              "oslc": "http://open-services.net/ns/core#"
            },
            "nodeType": "folder"
          }, {
            "nodeType": "folder",
            "createdOnTS": 1499799927,
            "lastUpdatedOnTS": 1499799927,
            "name": "Test User 2",
            "description": "Home folder of Test User 2",
            "displayName": "Test User 2",
            "path": null,
            "parentPath": null,
            "displayPath": null,
            "displayParentPath": null,
            "ownedBy": "https://metadatacenter.org/users/467ac575-c434-42ae-b991-e254adc8023e",
            "currentUserPermissions": [],
            "createdByUserName": null,
            "lastUpdatedByUserName": null,
            "ownedByUserName": null,
            "@id": "https://repo.metadatacenter.orgx/folders/f55c5f4b-1ee6-4839-8836-fcb7509cecfe",
            "pav:createdOn": "2017-07-11T12:05:27-0700",
            "pav:lastUpdatedOn": "2017-07-11T12:05:27-0700",
            "pav:createdBy": "https://metadatacenter.org/users/467ac575-c434-42ae-b991-e254adc8023e",
            "oslc:modifiedBy": "https://metadatacenter.org/users/467ac575-c434-42ae-b991-e254adc8023e",
            "isUserHome": true,
            "isSystem": false,
            "isRoot": false,
            "@context": {
              "schema": "http://schema.org/",
              "pav": "http://purl.org/pav/",
              "oslc": "http://open-services.net/ns/core#"
            },
            "nodeType": "folder"
          }],
          "nodeListQueryType": "folder-content"
        },
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


