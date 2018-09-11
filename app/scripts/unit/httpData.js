'use strict';

var httpData = {

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
          "request"          : {
            "limit"          : 100,
            "offset"         : 0,
            "sort"           : ["createdOnTS"],
            "q"              : null,
            "resource_types" : ["element", "folder"],
            "derived_from_id": null
          },
          "totalCount"       : 10,
          "currentOffset"    : 0,
          "paging"           : {
            "last" : "http://127.0.0.1:9008/folders/https%3A%2F%2Frepo.metadatacenter.orgx%2Ffolders%2Ff55c5f4b-1ee6-4839-8836-fcb7509cecfe/contents?resource_types=element%2Cfolder&sort=createdOnTS&offset=0&limit=100",
            "first": "http://127.0.0.1:9008/folders/https%3A%2F%2Frepo.metadatacenter.orgx%2Ffolders%2Ff55c5f4b-1ee6-4839-8836-fcb7509cecfe/contents?resource_types=element%2Cfolder&sort=createdOnTS&offset=0&limit=100"
          },
          "resources"        : [{
            "nodeType"              : "folder",
            "createdOnTS"           : 1502146452,
            "lastUpdatedOnTS"       : 1502146452,
            "schema:name"                  : "testing",
            "schema:description"           : "schema:description",
            "path"                  : null,
            "parentPath"            : null,
            "ownedBy"               : "https://metadatacenter.org/users/467ac575-c434-42ae-b991-e254adc8023e",
            "currentUserPermissions": [],
            "createdByUserName"     : null,
            "lastUpdatedByUserName" : null,
            "ownedByUserName"       : null,
            "@id"                   : "https://repo.metadatacenter.orgx/folders/e074d1ee-b365-4321-abb5-01a4102cb06c",
            "pav:createdOn"         : "2017-08-07T15:54:12-0700",
            "pav:lastUpdatedOn"     : "2017-08-07T15:54:12-0700",
            "pav:createdBy"         : "https://metadatacenter.org/users/467ac575-c434-42ae-b991-e254adc8023e",
            "oslc:modifiedBy"       : "https://metadatacenter.org/users/467ac575-c434-42ae-b991-e254adc8023e",
            "isUserHome"            : false,
            "isSystem"              : false,
            "isRoot"                : false,
            "@context"              : {
              "schema": "http://schema.org/",
              "pav"   : "http://purl.org/pav/",
              "bibo"  : "http://purl.org/ontology/bibo/",
              "oslc"  : "http://open-services.net/ns/core#"
            }
          }, {
            "nodeType"              : "element",
            "createdOnTS"           : 1499810129,
            "lastUpdatedOnTS"       : 1499810129,
            "schema:name"                  : "element",
            "schema:description"           : "schema:description",
            "path"                  : null,
            "parentPath"            : null,
            "ownedBy"               : "https://metadatacenter.org/users/467ac575-c434-42ae-b991-e254adc8023e",
            "currentUserPermissions": [],
            "createdByUserName"     : null,
            "lastUpdatedByUserName" : null,
            "ownedByUserName"       : null,
            "@id"                   : "https://repo.metadatacenter.orgx/template-elements/204c00ac-b13b-4c4e-bc4e-d4568e5f44c3",
            "pav:createdOn"         : "2017-07-11T14:55:29-0700",
            "pav:lastUpdatedOn"     : "2017-07-11T14:55:29-0700",
            "pav:createdBy"         : "https://metadatacenter.org/users/467ac575-c434-42ae-b991-e254adc8023e",
            "oslc:modifiedBy"       : "https://metadatacenter.org/users/467ac575-c434-42ae-b991-e254adc8023e",
            "@context"              : {
              "schema": "http://schema.org/",
              "pav"   : "http://purl.org/pav/",
              "bibo"  : "http://purl.org/ontology/bibo/",
              "oslc"  : "http://open-services.net/ns/core#"
            }
          }, {
            "nodeType"              : "element",
            "createdOnTS"           : 1499810169,
            "lastUpdatedOnTS"       : 1499814624,
            "schema:name"                  : "parent element",
            "schema:description"           : "schema:description",
            "path"                  : null,
            "parentPath"            : null,
            "ownedBy"               : "https://metadatacenter.org/users/467ac575-c434-42ae-b991-e254adc8023e",
            "currentUserPermissions": [],
            "createdByUserName"     : null,
            "lastUpdatedByUserName" : null,
            "ownedByUserName"       : null,
            "@id"                   : "https://repo.metadatacenter.orgx/template-elements/1dea391f-18a1-4185-86d2-68cd971afa43",
            "pav:createdOn"         : "2017-07-11T14:56:09-0700",
            "pav:lastUpdatedOn"     : "2017-07-11T16:10:24-0700",
            "pav:createdBy"         : "https://metadatacenter.org/users/467ac575-c434-42ae-b991-e254adc8023e",
            "oslc:modifiedBy"       : "https://metadatacenter.org/users/467ac575-c434-42ae-b991-e254adc8023e",
            "@context"              : {
              "schema": "http://schema.org/",
              "pav"   : "http://purl.org/pav/",
              "bibo"  : "http://purl.org/ontology/bibo/",
              "oslc"  : "http://open-services.net/ns/core#"
            }
          }, {
            "nodeType"              : "element",
            "createdOnTS"           : 1499814283,
            "lastUpdatedOnTS"       : 1499814288,
            "schema:name"                  : "Untitled",
            "schema:description"           : "schema:description",
            "path"                  : null,
            "parentPath"            : null,
            "ownedBy"               : "https://metadatacenter.org/users/467ac575-c434-42ae-b991-e254adc8023e",
            "currentUserPermissions": [],
            "createdByUserName"     : null,
            "lastUpdatedByUserName" : null,
            "ownedByUserName"       : null,
            "@id"                   : "https://repo.metadatacenter.orgx/template-elements/8e43ee1b-9ab5-4cac-81b8-906e47de5a96",
            "pav:createdOn"         : "2017-07-11T16:04:43-0700",
            "pav:lastUpdatedOn"     : "2017-07-11T16:04:48-0700",
            "pav:createdBy"         : "https://metadatacenter.org/users/467ac575-c434-42ae-b991-e254adc8023e",
            "oslc:modifiedBy"       : "https://metadatacenter.org/users/467ac575-c434-42ae-b991-e254adc8023e",
            "@context"              : {
              "schema": "http://schema.org/",
              "pav"   : "http://purl.org/pav/",
              "bibo"  : "http://purl.org/ontology/bibo/",
              "oslc"  : "http://open-services.net/ns/core#"
            }
          }, {
            "nodeType"              : "element",
            "createdOnTS"           : 1500699258,
            "lastUpdatedOnTS"       : 1500699258,
            "schema:name"                  : "Untitled",
            "schema:description"           : "schema:description",
            "path"                  : null,
            "parentPath"            : null,
            "ownedBy"               : "https://metadatacenter.org/users/467ac575-c434-42ae-b991-e254adc8023e",
            "currentUserPermissions": [],
            "createdByUserName"     : null,
            "lastUpdatedByUserName" : null,
            "ownedByUserName"       : null,
            "@id"                   : "https://repo.metadatacenter.orgx/template-elements/93d931b7-3e2d-40b0-a396-90329959bb08",
            "pav:createdOn"         : "2017-07-21T21:54:18-0700",
            "pav:lastUpdatedOn"     : "2017-07-21T21:54:18-0700",
            "pav:createdBy"         : "https://metadatacenter.org/users/467ac575-c434-42ae-b991-e254adc8023e",
            "oslc:modifiedBy"       : "https://metadatacenter.org/users/467ac575-c434-42ae-b991-e254adc8023e",
            "@context"              : {
              "schema": "http://schema.org/",
              "pav"   : "http://purl.org/pav/",
              "bibo"  : "http://purl.org/ontology/bibo/",
              "oslc"  : "http://open-services.net/ns/core#"
            }
          }, {
            "nodeType"              : "element",
            "createdOnTS"           : 1501279403,
            "lastUpdatedOnTS"       : 1501279440,
            "schema:name"                  : "one",
            "schema:description"           : "schema:description",
            "path"                  : null,
            "parentPath"            : null,
            "ownedBy"               : "https://metadatacenter.org/users/467ac575-c434-42ae-b991-e254adc8023e",
            "currentUserPermissions": [],
            "createdByUserName"     : null,
            "lastUpdatedByUserName" : null,
            "ownedByUserName"       : null,
            "@id"                   : "https://repo.metadatacenter.orgx/template-elements/6adcfb0b-a275-43c9-9716-864e967e9fd4",
            "pav:createdOn"         : "2017-07-28T15:03:23-0700",
            "pav:lastUpdatedOn"     : "2017-07-28T15:04:00-0700",
            "pav:createdBy"         : "https://metadatacenter.org/users/467ac575-c434-42ae-b991-e254adc8023e",
            "oslc:modifiedBy"       : "https://metadatacenter.org/users/467ac575-c434-42ae-b991-e254adc8023e",
            "@context"              : {
              "schema": "http://schema.org/",
              "pav"   : "http://purl.org/pav/",
              "bibo"  : "http://purl.org/ontology/bibo/",
              "oslc"  : "http://open-services.net/ns/core#"
            }
          }, {
            "nodeType"              : "element",
            "createdOnTS"           : 1501279412,
            "lastUpdatedOnTS"       : 1501279421,
            "schema:name"                  : "one again",
            "schema:description"           : "schema:description",
            "path"                  : null,
            "parentPath"            : null,
            "ownedBy"               : "https://metadatacenter.org/users/467ac575-c434-42ae-b991-e254adc8023e",
            "currentUserPermissions": [],
            "createdByUserName"     : null,
            "lastUpdatedByUserName" : null,
            "ownedByUserName"       : null,
            "@id"                   : "https://repo.metadatacenter.orgx/template-elements/81ee7cee-0f3c-4c1c-b375-3329e7838af9",
            "pav:createdOn"         : "2017-07-28T15:03:32-0700",
            "pav:lastUpdatedOn"     : "2017-07-28T15:03:41-0700",
            "pav:createdBy"         : "https://metadatacenter.org/users/467ac575-c434-42ae-b991-e254adc8023e",
            "oslc:modifiedBy"       : "https://metadatacenter.org/users/467ac575-c434-42ae-b991-e254adc8023e",
            "@context"              : {
              "schema": "http://schema.org/",
              "pav"   : "http://purl.org/pav/",
              "bibo"  : "http://purl.org/ontology/bibo/",
              "oslc"  : "http://open-services.net/ns/core#"
            }
          }, {
            "nodeType"              : "element",
            "createdOnTS"           : 1501279497,
            "lastUpdatedOnTS"       : 1501279497,
            "schema:name"                  : "Untitled",
            "schema:description"           : "schema:description",
            "path"                  : null,
            "parentPath"            : null,
            "ownedBy"               : "https://metadatacenter.org/users/467ac575-c434-42ae-b991-e254adc8023e",
            "currentUserPermissions": [],
            "createdByUserName"     : null,
            "lastUpdatedByUserName" : null,
            "ownedByUserName"       : null,
            "@id"                   : "https://repo.metadatacenter.orgx/template-elements/cb3d3560-cb3a-4934-a202-d1c5c0768e4f",
            "pav:createdOn"         : "2017-07-28T15:04:57-0700",
            "pav:lastUpdatedOn"     : "2017-07-28T15:04:57-0700",
            "pav:createdBy"         : "https://metadatacenter.org/users/467ac575-c434-42ae-b991-e254adc8023e",
            "oslc:modifiedBy"       : "https://metadatacenter.org/users/467ac575-c434-42ae-b991-e254adc8023e",
            "@context"              : {
              "schema": "http://schema.org/",
              "pav"   : "http://purl.org/pav/",
              "bibo"  : "http://purl.org/ontology/bibo/",
              "oslc"  : "http://open-services.net/ns/core#"
            }
          }, {
            "nodeType"              : "element",
            "createdOnTS"           : 1501285535,
            "lastUpdatedOnTS"       : 1501285535,
            "schema:name"                  : "inner",
            "schema:description"           : "schema:description",
            "path"                  : null,
            "parentPath"            : null,
            "ownedBy"               : "https://metadatacenter.org/users/467ac575-c434-42ae-b991-e254adc8023e",
            "currentUserPermissions": [],
            "createdByUserName"     : null,
            "lastUpdatedByUserName" : null,
            "ownedByUserName"       : null,
            "@id"                   : "https://repo.metadatacenter.orgx/template-elements/380ced27-cc3b-4c49-ba02-9aeafc591a8e",
            "pav:createdOn"         : "2017-07-28T16:45:35-0700",
            "pav:lastUpdatedOn"     : "2017-07-28T16:45:35-0700",
            "pav:createdBy"         : "https://metadatacenter.org/users/467ac575-c434-42ae-b991-e254adc8023e",
            "oslc:modifiedBy"       : "https://metadatacenter.org/users/467ac575-c434-42ae-b991-e254adc8023e",
            "@context"              : {
              "schema": "http://schema.org/",
              "pav"   : "http://purl.org/pav/",
              "bibo"  : "http://purl.org/ontology/bibo/",
              "oslc"  : "http://open-services.net/ns/core#"
            }
          }, {
            "nodeType"              : "element",
            "createdOnTS"           : 1501285549,
            "lastUpdatedOnTS"       : 1501285580,
            "schema:name"                  : "parent",
            "schema:description"           : "schema:description",
            "path"                  : null,
            "parentPath"            : null,
            "ownedBy"               : "https://metadatacenter.org/users/467ac575-c434-42ae-b991-e254adc8023e",
            "currentUserPermissions": [],
            "createdByUserName"     : null,
            "lastUpdatedByUserName" : null,
            "ownedByUserName"       : null,
            "@id"                   : "https://repo.metadatacenter.orgx/template-elements/ef324924-21b0-4eed-a389-b9ec7c880401",
            "pav:createdOn"         : "2017-07-28T16:45:49-0700",
            "pav:lastUpdatedOn"     : "2017-07-28T16:46:20-0700",
            "pav:createdBy"         : "https://metadatacenter.org/users/467ac575-c434-42ae-b991-e254adc8023e",
            "oslc:modifiedBy"       : "https://metadatacenter.org/users/467ac575-c434-42ae-b991-e254adc8023e",
            "@context"              : {
              "schema": "http://schema.org/",
              "pav"   : "http://purl.org/pav/",
              "bibo"  : "http://purl.org/ontology/bibo/",
              "oslc"  : "http://open-services.net/ns/core#"
            }
          }],
          "pathInfo"         : [{
            "nodeType"              : "folder",
            "createdOnTS"           : 1499799926,
            "lastUpdatedOnTS"       : 1499799926,
            "schema:name"                  : "/",
            "schema:description"           : "CEDAR Root Folder",
            "path"                  : null,
            "parentPath"            : null,
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
              "bibo"  : "http://purl.org/ontology/bibo/",
              "oslc"  : "http://open-services.net/ns/core#"
            }
          }, {
            "nodeType"              : "folder",
            "createdOnTS"           : 1499799926,
            "lastUpdatedOnTS"       : 1499799926,
            "schema:name"                  : "Users",
            "schema:description"           : "CEDAR Users",
            "path"                  : null,
            "parentPath"            : null,
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
              "bibo"  : "http://purl.org/ontology/bibo/",
              "oslc"  : "http://open-services.net/ns/core#"
            }
          }, {
            "nodeType"              : "folder",
            "createdOnTS"           : 1499799927,
            "lastUpdatedOnTS"       : 1499799927,
            "schema:name"                  : "Test User 2",
            "schema:description"           : "Home folder of Test User 2",
            "path"                  : null,
            "parentPath"            : null,
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
              "bibo"  : "http://purl.org/ontology/bibo/",
              "oslc"  : "http://open-services.net/ns/core#"
            }
          }],
          "nodeListQueryType": "folder-content"
        },
        "/template-elements/https%3A%2F%2Frepo.metadatacenter.orgx%2Ftemplate-elements%2F7ce9f613-ff0b-427b-a007-4d3b0cbe1fbb"                                                                          : {'displayName': 'foo'},
        "/folders/https%3A%2F%2Frepo.metadatacenter.orgx%2Ffolders%2Ff55c5f4b-1ee6-4839-8836-fcb7509cecfe/contents?limit=100&offset=0&publication_status=all&resource_types=template,element,instance,folder&sort=-createdOnTS&version=all": {
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
              "schema:name"                  : "test",
              "schema:description"           : "schema:description",
              "path"                  : null,
              "parentPath"            : null,
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
                "bibo"  : "http://purl.org/ontology/bibo/",
                "oslc"  : "http://open-services.net/ns/core#"
              }
            }
          ],
          "pathInfo"         : [
            {
              "nodeType"              : "folder",
              "createdOnTS"           : 1499799926,
              "lastUpdatedOnTS"       : 1499799926,
              "schema:name"                  : "/",
              "schema:description"           : "CEDAR Root Folder",
              "path"                  : null,
              "parentPath"            : null,
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
                "bibo"  : "http://purl.org/ontology/bibo/",
                "oslc"  : "http://open-services.net/ns/core#"
              }
            },
            {
              "nodeType"              : "folder",
              "createdOnTS"           : 1499799926,
              "lastUpdatedOnTS"       : 1499799926,
              "schema:name"                  : "Users",
              "schema:description"           : "CEDAR Users",
              "path"                  : null,
              "parentPath"            : null,
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
                "bibo"  : "http://purl.org/ontology/bibo/",
                "oslc"  : "http://open-services.net/ns/core#"
              }
            },
            {
              "nodeType"              : "folder",
              "createdOnTS"           : 1499799927,
              "lastUpdatedOnTS"       : 1499799927,
              "schema:name"                  : "Test User 2",
              "schema:description"           : "Home folder of Test User 2",
              "path"                  : null,
              "parentPath"            : null,
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
                "bibo"  : "http://purl.org/ontology/bibo/",
                "oslc"  : "http://open-services.net/ns/core#"
              }
            }
          ],
          "nodeListQueryType": "folder-content"
        },
        "/folders/https%3A%2F%2Frepo.metadatacenter.orgx%2Ffolders%2Ff55c5f4b-1ee6-4839-8836-fcb7509cecfe/contents?limit=100&offset=0&publication_status=all&resource_types=element,folder&sort=-createdOnTS&version=all"                  : {
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
              "schema:name"                  : "test",
              "schema:description"           : "schema:description",
              "path"                  : null,
              "parentPath"            : null,
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
                "bibo"  : "http://purl.org/ontology/bibo/",
                "oslc"  : "http://open-services.net/ns/core#"
              }
            }
          ],
          "pathInfo"         : [
            {
              "nodeType"              : "folder",
              "createdOnTS"           : 1499799926,
              "lastUpdatedOnTS"       : 1499799926,
              "schema:name"                  : "/",
              "schema:description"           : "CEDAR Root Folder",
              "path"                  : null,
              "parentPath"            : null,
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
                "bibo"  : "http://purl.org/ontology/bibo/",
                "oslc"  : "http://open-services.net/ns/core#"
              }
            },
            {
              "nodeType"              : "folder",
              "createdOnTS"           : 1499799926,
              "lastUpdatedOnTS"       : 1499799926,
              "schema:name"                  : "Users",
              "schema:description"           : "CEDAR Users",
              "path"                  : null,
              "parentPath"            : null,
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
                "bibo"  : "http://purl.org/ontology/bibo/",
                "oslc"  : "http://open-services.net/ns/core#"
              }
            },
            {
              "nodeType"              : "folder",
              "createdOnTS"           : 1499799927,
              "lastUpdatedOnTS"       : 1499799927,
              "schema:name"                  : "Test User 2",
              "schema:description"           : "Home folder of Test User 2",
              "path"                  : null,
              "parentPath"            : null,
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
                "bibo"  : "http://purl.org/ontology/bibo/",
                "oslc"  : "http://open-services.net/ns/core#"
              }
            }
          ],
          "nodeListQueryType": "folder-content"
        },
        "/folders/https%3A%2F%2Frepo.metadatacenter.orgx%2Ffolders%2F80e366b2-c8fb-4de5-b899-7d46c770d2f4/contents?limit=100&offset=0&publication_status=all&resource_types=element,field,instance,template,folder&sort=name&version=all"  : {
          "request"          : {
            "limit"          : 100,
            "offset"         : 0,
            "sort"           : ["name"],
            "q"              : null,
            "resource_types" : ["element", "instance", "template", "folder"],
            "derived_from_id": null
          }
          ,
          "totalCount"       : 1,
          "currentOffset"    : 0,
          "paging"           : {
            "last" : "http://127.0.0.1:9008/folders/https%3A%2F%2Frepo.metadatacenter.orgx%2Ffolders%2F80e366b2-c8fb-4de5-b899-7d46c770d2f4/contents?resource_types=element%2Cinstance%2Ctemplate%2Cfolder&sort=name&offset=0&limit=100",
            "first": "http://127.0.0.1:9008/folders/https%3A%2F%2Frepo.metadatacenter.orgx%2Ffolders%2F80e366b2-c8fb-4de5-b899-7d46c770d2f4/contents?resource_types=element%2Cinstance%2Ctemplate%2Cfolder&sort=name&offset=0&limit=100"
          }
          ,
          "resources"        : [{
            "nodeType"              : "template",
            "createdOnTS"           : 1512434377,
            "lastUpdatedOnTS"       : 1512434393,
            "schema:name"                  : "t2",
            "schema:description"           : null,
            "path"                  : null,
            "parentPath"            : null,
            "ownedBy"               : "https://metadatacenter.org/users/84c0e798-fd6a-4615-bd41-738baba31ea4",
            "currentUserPermissions": [],
            "createdByUserName"     : null,
            "lastUpdatedByUserName" : null,
            "ownedByUserName"       : null,
            "@id"                   : "https://repo.metadatacenter.orgx/templates/43ea9e95-5d1b-474b-b200-0f2e196d1058",
            "pav:createdOn"         : "2017-12-04T16:39:37-0800",
            "pav:lastUpdatedOn"     : "2017-12-04T16:39:53-0800",
            "pav:createdBy"         : "https://metadatacenter.org/users/84c0e798-fd6a-4615-bd41-738baba31ea4",
            "oslc:modifiedBy"       : "https://metadatacenter.org/users/84c0e798-fd6a-4615-bd41-738baba31ea4",
            "@context"              : {
              "schema": "http://schema.org/",
              "pav"   : "http://purl.org/pav/",
              "bibo"  : "http://purl.org/ontology/bibo/",
              "oslc"  : "http://open-services.net/ns/core#"
            }
          }],
          "pathInfo"         : [{
            "nodeType"              : "folder",
            "createdOnTS"           : 1511895931,
            "lastUpdatedOnTS"       : 1511895931,
            "schema:name"                  : "/",
            "schema:description"           : "CEDAR Root Folder",
            "path"                  : null,
            "parentPath"            : null,
            "ownedBy"               : "https://metadatacenter.org/users/ab2a9696-291f-4705-b5e6-6c262266c506",
            "currentUserPermissions": [],
            "createdByUserName"     : null,
            "lastUpdatedByUserName" : null,
            "ownedByUserName"       : null,
            "@id"                   : "https://repo.metadatacenter.orgx/folders/a4d9694b-74cb-4938-8c7d-59986021b35f",
            "pav:createdOn"         : "2017-11-28T11:05:31-0800",
            "pav:lastUpdatedOn"     : "2017-11-28T11:05:31-0800",
            "pav:createdBy"         : "https://metadatacenter.org/users/ab2a9696-291f-4705-b5e6-6c262266c506",
            "oslc:modifiedBy"       : "https://metadatacenter.org/users/ab2a9696-291f-4705-b5e6-6c262266c506",
            "isUserHome"            : false,
            "isSystem"              : true,
            "isRoot"                : true,
            "@context"              : {
              "schema": "http://schema.org/",
              "pav"   : "http://purl.org/pav/",
              "bibo"  : "http://purl.org/ontology/bibo/",
              "oslc"  : "http://open-services.net/ns/core#"
            }
          }, {
            "nodeType"              : "folder",
            "createdOnTS"           : 1511895931,
            "lastUpdatedOnTS"       : 1511895931,
            "schema:name"                  : "Users",
            "schema:description"           : "CEDAR Users",
            "path"                  : null,
            "parentPath"            : null,
            "ownedBy"               : "https://metadatacenter.org/users/ab2a9696-291f-4705-b5e6-6c262266c506",
            "currentUserPermissions": [],
            "createdByUserName"     : null,
            "lastUpdatedByUserName" : null,
            "ownedByUserName"       : null,
            "@id"                   : "https://repo.metadatacenter.orgx/folders/80a3dbf6-a840-48e9-8542-2fd31f475861",
            "pav:createdOn"         : "2017-11-28T11:05:31-0800",
            "pav:lastUpdatedOn"     : "2017-11-28T11:05:31-0800",
            "pav:createdBy"         : "https://metadatacenter.org/users/ab2a9696-291f-4705-b5e6-6c262266c506",
            "oslc:modifiedBy"       : "https://metadatacenter.org/users/ab2a9696-291f-4705-b5e6-6c262266c506",
            "isUserHome"            : false,
            "isSystem"              : true,
            "isRoot"                : false,
            "@context"              : {
              "schema": "http://schema.org/",
              "pav"   : "http://purl.org/pav/",
              "bibo"  : "http://purl.org/ontology/bibo/",
              "oslc"  : "http://open-services.net/ns/core#"
            }
          }, {
            "nodeType"              : "folder",
            "createdOnTS"           : 1511895932,
            "lastUpdatedOnTS"       : 1511895932,
            "schema:name"                  : "Test User 1",
            "schema:description"           : "Home folder of Test User 1",
            "path"                  : null,
            "parentPath"            : null,
            "ownedBy"               : "https://metadatacenter.org/users/84c0e798-fd6a-4615-bd41-738baba31ea4",
            "currentUserPermissions": [],
            "createdByUserName"     : null,
            "lastUpdatedByUserName" : null,
            "ownedByUserName"       : null,
            "@id"                   : "https://repo.metadatacenter.orgx/folders/80e366b2-c8fb-4de5-b899-7d46c770d2f4",
            "pav:createdOn"         : "2017-11-28T11:05:32-0800",
            "pav:lastUpdatedOn"     : "2017-11-28T11:05:32-0800",
            "pav:createdBy"         : "https://metadatacenter.org/users/84c0e798-fd6a-4615-bd41-738baba31ea4",
            "oslc:modifiedBy"       : "https://metadatacenter.org/users/84c0e798-fd6a-4615-bd41-738baba31ea4",
            "isUserHome"            : true,
            "isSystem"              : false,
            "isRoot"                : false,
            "@context"              : {
              "schema": "http://schema.org/",
              "pav"   : "http://purl.org/pav/",
              "bibo"  : "http://purl.org/ontology/bibo/",
              "oslc"  : "http://open-services.net/ns/core#"
            }
          }],
          "nodeListQueryType": "folder-content"
        },
        "/folders/https%3A%2F%2Frepo.metadatacenter.orgx%2Ffolders%2F80a3dbf6-a840-48e9-8542-2fd31f475861/contents?limit=100&offset=0&publication_status=all&resource_types=element,field,instance,template,folder&sort=name&version=all"  : {
          "request"          : {
            "limit"          : 100,
            "offset"         : 0,
            "sort"           : ["name"],
            "q"              : null,
            "resource_types" : ["element", "instance", "template", "folder"],
            "derived_from_id": null
          },
          "totalCount"       : 4,
          "currentOffset"    : 0,
          "paging"           : {
            "last" : "http://127.0.0.1:9008/folders/https%3A%2F%2Frepo.metadatacenter.orgx%2Ffolders%2F80a3dbf6-a840-48e9-8542-2fd31f475861/contents?resource_types=element%2Cinstance%2Ctemplate%2Cfolder&sort=name&offset=0&limit=100",
            "first": "http://127.0.0.1:9008/folders/https%3A%2F%2Frepo.metadatacenter.orgx%2Ffolders%2F80a3dbf6-a840-48e9-8542-2fd31f475861/contents?resource_types=element%2Cinstance%2Ctemplate%2Cfolder&sort=name&offset=0&limit=100"
          },
          "resources"        : [{
            "nodeType"              : "folder",
            "createdOnTS"           : 1511895932,
            "lastUpdatedOnTS"       : 1511895932,
            "schema:name"                  : "CEDAR Admin",
            "schema:description"           : "Home folder of CEDAR Admin",
            "path"                  : null,
            "parentPath"            : null,
            "ownedBy"               : "https://metadatacenter.org/users/ab2a9696-291f-4705-b5e6-6c262266c506",
            "currentUserPermissions": [],
            "createdByUserName"     : null,
            "lastUpdatedByUserName" : null,
            "ownedByUserName"       : null,
            "@id"                   : "https://repo.metadatacenter.orgx/folders/64647077-5bcb-4e1d-aee4-2dce39a73e68",
            "pav:createdOn"         : "2017-11-28T11:05:32-0800",
            "pav:lastUpdatedOn"     : "2017-11-28T11:05:32-0800",
            "pav:createdBy"         : "https://metadatacenter.org/users/ab2a9696-291f-4705-b5e6-6c262266c506",
            "oslc:modifiedBy"       : "https://metadatacenter.org/users/ab2a9696-291f-4705-b5e6-6c262266c506",
            "isUserHome"            : true,
            "isSystem"              : false,
            "isRoot"                : false,
            "@context"              : {
              "schema": "http://schema.org/",
              "pav"   : "http://purl.org/pav/",
              "bibo"  : "http://purl.org/ontology/bibo/",
              "oslc"  : "http://open-services.net/ns/core#"
            }
          }, {
            "nodeType"              : "folder",
            "createdOnTS"           : 1511895932,
            "lastUpdatedOnTS"       : 1511895932,
            "schema:name"                  : "Debra Willrett",
            "schema:description"           : "Home folder of Debra Willrett",
            "path"                  : null,
            "parentPath"            : null,
            "ownedBy"               : "https://metadatacenter.org/users/d39cf7ae-3d7a-4eb5-9669-f57e2ac02423",
            "currentUserPermissions": [],
            "createdByUserName"     : null,
            "lastUpdatedByUserName" : null,
            "ownedByUserName"       : null,
            "@id"                   : "https://repo.metadatacenter.orgx/folders/6649b825-a667-4b70-b561-b6380112d65f",
            "pav:createdOn"         : "2017-11-28T11:05:32-0800",
            "pav:lastUpdatedOn"     : "2017-11-28T11:05:32-0800",
            "pav:createdBy"         : "https://metadatacenter.org/users/d39cf7ae-3d7a-4eb5-9669-f57e2ac02423",
            "oslc:modifiedBy"       : "https://metadatacenter.org/users/d39cf7ae-3d7a-4eb5-9669-f57e2ac02423",
            "isUserHome"            : true,
            "isSystem"              : false,
            "isRoot"                : false,
            "@context"              : {
              "schema": "http://schema.org/",
              "pav"   : "http://purl.org/pav/",
              "bibo"  : "http://purl.org/ontology/bibo/",
              "oslc"  : "http://open-services.net/ns/core#"
            }
          }, {
            "nodeType"              : "folder",
            "createdOnTS"           : 1511895932,
            "lastUpdatedOnTS"       : 1511895932,
            "schema:name"                  : "Test User 1",
            "schema:description"           : "Home folder of Test User 1",
            "path"                  : null,
            "parentPath"            : null,
            "ownedBy"               : "https://metadatacenter.org/users/84c0e798-fd6a-4615-bd41-738baba31ea4",
            "currentUserPermissions": [],
            "createdByUserName"     : null,
            "lastUpdatedByUserName" : null,
            "ownedByUserName"       : null,
            "@id"                   : "https://repo.metadatacenter.orgx/folders/80e366b2-c8fb-4de5-b899-7d46c770d2f4",
            "pav:createdOn"         : "2017-11-28T11:05:32-0800",
            "pav:lastUpdatedOn"     : "2017-11-28T11:05:32-0800",
            "pav:createdBy"         : "https://metadatacenter.org/users/84c0e798-fd6a-4615-bd41-738baba31ea4",
            "oslc:modifiedBy"       : "https://metadatacenter.org/users/84c0e798-fd6a-4615-bd41-738baba31ea4",
            "isUserHome"            : true,
            "isSystem"              : false,
            "isRoot"                : false,
            "@context"              : {
              "schema": "http://schema.org/",
              "pav"   : "http://purl.org/pav/",
              "bibo"  : "http://purl.org/ontology/bibo/",
              "oslc"  : "http://open-services.net/ns/core#"
            }
          }, {
            "nodeType"              : "folder",
            "createdOnTS"           : 1511895932,
            "lastUpdatedOnTS"       : 1511895932,
            "schema:name"                  : "Test User 2",
            "schema:description"           : "Home folder of Test User 2",
            "path"                  : null,
            "parentPath"            : null,
            "ownedBy"               : "https://metadatacenter.org/users/68dded17-153c-4660-b51f-ca48dfb8ae32",
            "currentUserPermissions": [],
            "createdByUserName"     : null,
            "lastUpdatedByUserName" : null,
            "ownedByUserName"       : null,
            "@id"                   : "https://repo.metadatacenter.orgx/folders/402f209a-adf3-4215-8016-593a909d82c7",
            "pav:createdOn"         : "2017-11-28T11:05:32-0800",
            "pav:lastUpdatedOn"     : "2017-11-28T11:05:32-0800",
            "pav:createdBy"         : "https://metadatacenter.org/users/68dded17-153c-4660-b51f-ca48dfb8ae32",
            "oslc:modifiedBy"       : "https://metadatacenter.org/users/68dded17-153c-4660-b51f-ca48dfb8ae32",
            "isUserHome"            : true,
            "isSystem"              : false,
            "isRoot"                : false,
            "@context"              : {
              "schema": "http://schema.org/",
              "pav"   : "http://purl.org/pav/",
              "bibo"  : "http://purl.org/ontology/bibo/",
              "oslc"  : "http://open-services.net/ns/core#"
            }
          }],
          "pathInfo"         : [{
            "nodeType"              : "folder",
            "createdOnTS"           : 1511895931,
            "lastUpdatedOnTS"       : 1511895931,
            "schema:name"                  : "/",
            "schema:description"           : "CEDAR Root Folder",
            "path"                  : null,
            "parentPath"            : null,
            "ownedBy"               : "https://metadatacenter.org/users/ab2a9696-291f-4705-b5e6-6c262266c506",
            "currentUserPermissions": [],
            "createdByUserName"     : null,
            "lastUpdatedByUserName" : null,
            "ownedByUserName"       : null,
            "@id"                   : "https://repo.metadatacenter.orgx/folders/a4d9694b-74cb-4938-8c7d-59986021b35f",
            "pav:createdOn"         : "2017-11-28T11:05:31-0800",
            "pav:lastUpdatedOn"     : "2017-11-28T11:05:31-0800",
            "pav:createdBy"         : "https://metadatacenter.org/users/ab2a9696-291f-4705-b5e6-6c262266c506",
            "oslc:modifiedBy"       : "https://metadatacenter.org/users/ab2a9696-291f-4705-b5e6-6c262266c506",
            "isUserHome"            : false,
            "isSystem"              : true,
            "isRoot"                : true,
            "@context"              : {
              "schema": "http://schema.org/",
              "pav"   : "http://purl.org/pav/",
              "bibo"  : "http://purl.org/ontology/bibo/",
              "oslc"  : "http://open-services.net/ns/core#"
            }
          }, {
            "nodeType"              : "folder",
            "createdOnTS"           : 1511895931,
            "lastUpdatedOnTS"       : 1511895931,
            "schema:name"                  : "Users",
            "schema:description"           : "CEDAR Users",
            "path"                  : null,
            "parentPath"            : null,
            "ownedBy"               : "https://metadatacenter.org/users/ab2a9696-291f-4705-b5e6-6c262266c506",
            "currentUserPermissions": [],
            "createdByUserName"     : null,
            "lastUpdatedByUserName" : null,
            "ownedByUserName"       : null,
            "@id"                   : "https://repo.metadatacenter.orgx/folders/80a3dbf6-a840-48e9-8542-2fd31f475861",
            "pav:createdOn"         : "2017-11-28T11:05:31-0800",
            "pav:lastUpdatedOn"     : "2017-11-28T11:05:31-0800",
            "pav:createdBy"         : "https://metadatacenter.org/users/ab2a9696-291f-4705-b5e6-6c262266c506",
            "oslc:modifiedBy"       : "https://metadatacenter.org/users/ab2a9696-291f-4705-b5e6-6c262266c506",
            "isUserHome"            : false,
            "isSystem"              : true,
            "isRoot"                : false,
            "@context"              : {
              "schema": "http://schema.org/",
              "pav"   : "http://purl.org/pav/",
              "bibo"  : "http://purl.org/ontology/bibo/",
              "oslc"  : "http://open-services.net/ns/core#"
            }
          }],
          "nodeListQueryType": "folder-content"
        },
        "/folders/https%3A%2F%2Frepo.metadatacenter.orgx%2Ffolders%2Fa4d9694b-74cb-4938-8c7d-59986021b35f/contents?limit=100&offset=0&publication_status=all&resource_types=element,field,instance,template,folder&sort=name&version=all"  : {
          "request"          : {
            "limit"          : 100,
            "offset"         : 0,
            "sort"           : ["name"],
            "q"              : null,
            "resource_types" : ["element", "instance", "template", "folder"],
            "derived_from_id": null
          },
          "totalCount"       : 0,
          "currentOffset"    : 0,
          "paging"           : {
            "last" : "http://127.0.0.1:9008/folders/https%3A%2F%2Frepo.metadatacenter.orgx%2Ffolders%2F64647077-5bcb-4e1d-aee4-2dce39a73e68/contents?resource_types=element%2Cinstance%2Ctemplate%2Cfolder&sort=name&offset=0&limit=100",
            "first": "http://127.0.0.1:9008/folders/https%3A%2F%2Frepo.metadatacenter.orgx%2Ffolders%2F64647077-5bcb-4e1d-aee4-2dce39a73e68/contents?resource_types=element%2Cinstance%2Ctemplate%2Cfolder&sort=name&offset=0&limit=100"
          },
          "resources"        : [],
          "pathInfo"         : [{
            "nodeType"              : "folder",
            "createdOnTS"           : 1511895931,
            "lastUpdatedOnTS"       : 1511895931,
            "schema:name"                  : "/",
            "schema:description"           : "CEDAR Root Folder",
            "path"                  : null,
            "parentPath"            : null,
            "ownedBy"               : "https://metadatacenter.org/users/ab2a9696-291f-4705-b5e6-6c262266c506",
            "currentUserPermissions": [],
            "createdByUserName"     : null,
            "lastUpdatedByUserName" : null,
            "ownedByUserName"       : null,
            "@id"                   : "https://repo.metadatacenter.orgx/folders/a4d9694b-74cb-4938-8c7d-59986021b35f",
            "pav:createdOn"         : "2017-11-28T11:05:31-0800",
            "pav:lastUpdatedOn"     : "2017-11-28T11:05:31-0800",
            "pav:createdBy"         : "https://metadatacenter.org/users/ab2a9696-291f-4705-b5e6-6c262266c506",
            "oslc:modifiedBy"       : "https://metadatacenter.org/users/ab2a9696-291f-4705-b5e6-6c262266c506",
            "isUserHome"            : false,
            "isSystem"              : true,
            "isRoot"                : true,
            "@context"              : {
              "schema": "http://schema.org/",
              "pav"   : "http://purl.org/pav/",
              "bibo"  : "http://purl.org/ontology/bibo/",
              "oslc"  : "http://open-services.net/ns/core#"
            }
          }, {
            "nodeType"              : "folder",
            "createdOnTS"           : 1511895931,
            "lastUpdatedOnTS"       : 1511895931,
            "schema:name"                  : "Users",
            "schema:description"           : "CEDAR Users",
            "path"                  : null,
            "parentPath"            : null,
            "ownedBy"               : "https://metadatacenter.org/users/ab2a9696-291f-4705-b5e6-6c262266c506",
            "currentUserPermissions": [],
            "createdByUserName"     : null,
            "lastUpdatedByUserName" : null,
            "ownedByUserName"       : null,
            "@id"                   : "https://repo.metadatacenter.orgx/folders/80a3dbf6-a840-48e9-8542-2fd31f475861",
            "pav:createdOn"         : "2017-11-28T11:05:31-0800",
            "pav:lastUpdatedOn"     : "2017-11-28T11:05:31-0800",
            "pav:createdBy"         : "https://metadatacenter.org/users/ab2a9696-291f-4705-b5e6-6c262266c506",
            "oslc:modifiedBy"       : "https://metadatacenter.org/users/ab2a9696-291f-4705-b5e6-6c262266c506",
            "isUserHome"            : false,
            "isSystem"              : true,
            "isRoot"                : false,
            "@context"              : {
              "schema": "http://schema.org/",
              "pav"   : "http://purl.org/pav/",
              "bibo"  : "http://purl.org/ontology/bibo/",
              "oslc"  : "http://open-services.net/ns/core#"
            }
          }, {
            "nodeType"              : "folder",
            "createdOnTS"           : 1511895932,
            "lastUpdatedOnTS"       : 1511895932,
            "schema:name"                  : "CEDAR Admin",
            "schema:description"           : "Home folder of CEDAR Admin",
            "path"                  : null,
            "parentPath"            : null,
            "ownedBy"               : "https://metadatacenter.org/users/ab2a9696-291f-4705-b5e6-6c262266c506",
            "currentUserPermissions": [],
            "createdByUserName"     : null,
            "lastUpdatedByUserName" : null,
            "ownedByUserName"       : null,
            "@id"                   : "https://repo.metadatacenter.orgx/folders/64647077-5bcb-4e1d-aee4-2dce39a73e68",
            "pav:createdOn"         : "2017-11-28T11:05:32-0800",
            "pav:lastUpdatedOn"     : "2017-11-28T11:05:32-0800",
            "pav:createdBy"         : "https://metadatacenter.org/users/ab2a9696-291f-4705-b5e6-6c262266c506",
            "oslc:modifiedBy"       : "https://metadatacenter.org/users/ab2a9696-291f-4705-b5e6-6c262266c506",
            "isUserHome"            : true,
            "isSystem"              : false,
            "isRoot"                : false,
            "@context"              : {
              "schema": "http://schema.org/",
              "pav"   : "http://purl.org/pav/",
              "bibo"  : "http://purl.org/ontology/bibo/",
              "oslc"  : "http://open-services.net/ns/core#"
            }
          }],
          "nodeListQueryType": "folder-content"
        },
        '/folders/https%3A%2F%2Frepo.metadatacenter.orgx%2Ffolders%2F64647077-5bcb-4e1d-aee4-2dce39a73e68/contents?limit=100&offset=0&publication_status=all&resource_types=element,field,instance,template,folder&sort=name&version=all'  : {
          "request": {
            "limit": 100,
            "offset": 0,
            "sort": ["name"],
            "q": null,
            "resource_types": ["element", "instance", "template", "folder"],
            "derived_from_id": null
          },
          "totalCount": 0,
          "currentOffset": 0,
          "paging": {
            "last": "http://127.0.0.1:9008/folders/https%3A%2F%2Frepo.metadatacenter.orgx%2Ffolders%2F64647077-5bcb-4e1d-aee4-2dce39a73e68/contents?resource_types=element%2Cinstance%2Ctemplate%2Cfolder&sort=name&offset=0&limit=100",
            "first": "http://127.0.0.1:9008/folders/https%3A%2F%2Frepo.metadatacenter.orgx%2Ffolders%2F64647077-5bcb-4e1d-aee4-2dce39a73e68/contents?resource_types=element%2Cinstance%2Ctemplate%2Cfolder&sort=name&offset=0&limit=100"
          },
          "resources": [],
          "pathInfo": [{
            "nodeType": "folder",
            "createdOnTS": 1511895931,
            "lastUpdatedOnTS": 1511895931,
            "schema:name": "/",
            "schema:description": "CEDAR Root Folder",
            "path": null,
            "parentPath": null,
            "ownedBy": "https://metadatacenter.org/users/ab2a9696-291f-4705-b5e6-6c262266c506",
            "currentUserPermissions": [],
            "createdByUserName": null,
            "lastUpdatedByUserName": null,
            "ownedByUserName": null,
            "@id": "https://repo.metadatacenter.orgx/folders/a4d9694b-74cb-4938-8c7d-59986021b35f",
            "pav:createdOn": "2017-11-28T11:05:31-0800",
            "pav:lastUpdatedOn": "2017-11-28T11:05:31-0800",
            "pav:createdBy": "https://metadatacenter.org/users/ab2a9696-291f-4705-b5e6-6c262266c506",
            "oslc:modifiedBy": "https://metadatacenter.org/users/ab2a9696-291f-4705-b5e6-6c262266c506",
            "isUserHome": false,
            "isSystem": true,
            "isRoot": true,
            "@context": {
              "schema": "http://schema.org/",
              "pav": "http://purl.org/pav/",
              "bibo": "http://purl.org/ontology/bibo/",
              "oslc": "http://open-services.net/ns/core#"
            }
          }, {
            "nodeType": "folder",
            "createdOnTS": 1511895931,
            "lastUpdatedOnTS": 1511895931,
            "schema:name": "Users",
            "schema:description": "CEDAR Users",
            "path": null,
            "parentPath": null,
            "ownedBy": "https://metadatacenter.org/users/ab2a9696-291f-4705-b5e6-6c262266c506",
            "currentUserPermissions": [],
            "createdByUserName": null,
            "lastUpdatedByUserName": null,
            "ownedByUserName": null,
            "@id": "https://repo.metadatacenter.orgx/folders/80a3dbf6-a840-48e9-8542-2fd31f475861",
            "pav:createdOn": "2017-11-28T11:05:31-0800",
            "pav:lastUpdatedOn": "2017-11-28T11:05:31-0800",
            "pav:createdBy": "https://metadatacenter.org/users/ab2a9696-291f-4705-b5e6-6c262266c506",
            "oslc:modifiedBy": "https://metadatacenter.org/users/ab2a9696-291f-4705-b5e6-6c262266c506",
            "isUserHome": false,
            "isSystem": true,
            "isRoot": false,
            "@context": {
              "schema": "http://schema.org/",
              "pav": "http://purl.org/pav/",
              "bibo": "http://purl.org/ontology/bibo/",
              "oslc": "http://open-services.net/ns/core#"
            }
          }, {
            "nodeType": "folder",
            "createdOnTS": 1511895932,
            "lastUpdatedOnTS": 1511895932,
            "schema:name": "CEDAR Admin",
            "schema:description": "Home folder of CEDAR Admin",
            "path": null,
            "parentPath": null,
            "ownedBy": "https://metadatacenter.org/users/ab2a9696-291f-4705-b5e6-6c262266c506",
            "currentUserPermissions": [],
            "createdByUserName": null,
            "lastUpdatedByUserName": null,
            "ownedByUserName": null,
            "@id": "https://repo.metadatacenter.orgx/folders/64647077-5bcb-4e1d-aee4-2dce39a73e68",
            "pav:createdOn": "2017-11-28T11:05:32-0800",
            "pav:lastUpdatedOn": "2017-11-28T11:05:32-0800",
            "pav:createdBy": "https://metadatacenter.org/users/ab2a9696-291f-4705-b5e6-6c262266c506",
            "oslc:modifiedBy": "https://metadatacenter.org/users/ab2a9696-291f-4705-b5e6-6c262266c506",
            "isUserHome": true,
            "isSystem": false,
            "isRoot": false,
            "@context": {
              "schema": "http://schema.org/",
              "pav": "http://purl.org/pav/",
              "bibo": "http://purl.org/ontology/bibo/",
              "oslc": "http://open-services.net/ns/core#"
            }
          }],
          "nodeListQueryType": "folder-content"
        }
      }
    }
;


