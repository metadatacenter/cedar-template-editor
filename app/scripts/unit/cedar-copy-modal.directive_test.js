'use strict';

define(['app', 'angular'], function (app) {

  describe('cedar-copy-modal.directive_test.js:', function () {

    var $rootScope;
    var $compile;
    var $controller;
    var $httpBackend;
    var UIMessageService;
    var resourceService;
    var UISettingsService;
    var UrlService;
    var QueryParamUtilsService;
    var $timeout;
    var CedarUser;
    var appData = {
      CedarUserProfile: {
        uiPreferences: {
          folderView         : {
            currentFolderId: null,
            sortBy         : "createdOnTS",
            sortDirection  : "asc",
            viewMode       : "grid"
          },
          infoPanel          : {
            opened: false
          },
          metadataEditor     : {
            metadataJsonViewer: false,
            templateViewer    : false
          },
          resourceTypeFilters: {
            template: false,
            element : false,
            field   : false,
            instance: false
          },
          templateEditor     : {
            templateViewer: false
          }
        }
      }
    };

    // Load the module that contains the templates that were loaded with html2js
    beforeEach(module('my.templates'));
    // Load other modules
    beforeEach(module(app.name));
    beforeEach(module('cedar.templateEditor.modal.cedarCopyModalDirective'));
    beforeEach(module('cedar.templateEditor.service.uIMessageService'));
    beforeEach(module('cedar.templateEditor.service.resourceService'));
    beforeEach(module('cedar.templateEditor.service.uISettingsService'));
    beforeEach(module('cedar.templateEditor.service.queryParamUtilsService'));
    // we need to register our alternative version of CedarUser, before we call inject.
    beforeEach(angular.mock.module(function ($provide) {
      $provide.service('CedarUser', function mockCedarUser() {
        var cedarUser = {
          init            : function () {
            return true
          },
          setAuthProfile  : function () {
            return true
          },
          setCedarProfile : function () {
            return true
          },
          getUIPreferences: function () {
            return appData.CedarUserProfile.uiPreferences
          },
          getHomeFolderId : function () {
            return null
          },
          isSortByName    : function () {
            return false
          },
          isSortByCreated : function () {
            return true
          },
          isSortByUpdated : function () {
            return false
          },
          isListView      : function () {
            return true
          },
          isGridView      : function () {
            return false
          },
          getSort         : function () {
            return appData.CedarUserProfile.uiPreferences.folderView.sortBy;
          },
        };
        return cedarUser;
      });
    }));
    beforeEach(module('cedar.templateEditor.modal.cedarCopyModalDirective', function ($provide) {
      $provide.factory('cedarInfiniteScrollDirective', function () {
        return {};
      });
    }));

    beforeEach(inject(
        function (_$rootScope_, _$compile_, _$controller_, _$httpBackend_, _$timeout_,
                  _UIMessageService_, _UrlService_, _resourceService_, _UISettingsService_, _QueryParamUtilsService_,
                  _CedarUser_) {
          $rootScope = _$rootScope_.$new(); // create new scope
          $compile = _$compile_;
          $controller = _$controller_;
          $httpBackend = _$httpBackend_;
          UIMessageService = _UIMessageService_;
          resourceService = _resourceService_;
          UrlService = _UrlService_;
          UISettingsService = _UISettingsService_;
          QueryParamUtilsService = _QueryParamUtilsService_;
          $timeout = _$timeout_;
          CedarUser = _CedarUser_;
        }));

    beforeEach(function () {

      $httpBackend.whenGET('resources/i18n/locale-en.json').respond(function (method, url, data) {
        var request = new XMLHttpRequest();
        request.open('GET', 'resources/i18n/locale-en.json', false);
        request.send(null);
        return [request.status, request.response, {}];
      });
      $httpBackend.whenGET('config/url-service.conf.json?v=undefined').respond(function (method, url, data) {
        var request = new XMLHttpRequest();
        request.open('GET', 'config/url-service.conf.json?v=undefined', false);
        request.send(null);
        return [request.status, request.response, {}];
      });
      $httpBackend.whenGET('img/plus.png').respond(function (method, url, data) {
        var request = new XMLHttpRequest();
        request.open('GET', 'img/plus.png', false);
        request.send(null);
        return [request.status, request.response, {}];
      });
      $httpBackend.whenGET('img/close_modal.png').respond(function (method, url, data) {
        var request = new XMLHttpRequest();
        request.open('GET', 'img/close_modal.png', false);
        request.send(null);
        return [request.status, request.response, {}];
      });
      $httpBackend.whenGET('img/close_modal.png').respond(function (method, url, data) {
        var request = new XMLHttpRequest();
        request.open('GET', 'img/close_modal.png', false);
        request.send(null);
        return [request.status, request.response, {}];
      });

      $httpBackend.whenGET('https://messaging.staging.metadatacenter.net/summary').respond(
          function (method, url, data) {
            var data = {"total": 7, "unread": 1, "notnotified": 0};
            var newElement = angular.fromJson(data);
            return [200, data, {}];
          });

      $httpBackend.whenGET('https://messaging.metadatacenter.orgx/summary').respond(
          function (method, url, data) {
            var data = {"total": 7, "unread": 1, "notnotified": 0};
            var newElement = angular.fromJson(data);
            return [200, data, {}];
          });

      var url1 =  UrlService.base()  + '/folders/https%3A%2F%2Frepo.metadatacenter.orgx%2Ffolders%2F22e37611-192e-4faa-aa6d-4b1dcad3b898/contents?limit=500&offset=0&resource_types=template,element,instance,folder&sort=-createdOnTS';
      $httpBackend.whenGET(url1).respond(
          function (method, url1, data) {
            //noinspection JSDuplicatedDeclaration
            var response = {};
            return [200, response, {}];
          });
      var url2 = UrlService.base()  + '/folders/https%3A%2F%2Frepo.metadatacenter.orgx%2Ffolders%2Ff55c5f4b-1ee6-4839-8836-fcb7509cecfe/contents?limit=500&offset=0&resource_types=template,element,instance,folder&sort=-createdOnTS';
      $httpBackend.whenGET(url2).respond(
          function (method, url2, data) {
            //noinspection JSDuplicatedDeclaration
            var response =
                {"request": {
                  "limit": 500,
                  "offset": 0,
                  "sort": ["-lastUpdatedOnTS"],
                  "q": null,
                  "resource_types": ["element", "instance", "template", "folder"],
                  "derived_from_id": null
                },
                  "totalCount": 1,
                  "currentOffset": 0,
                  "paging": {
                    "last": "http://127.0.0.1:9008/folders/https%3A%2F%2Frepo.metadatacenter.orgx%2Ffolders%2Ff55c5f4b-1ee6-4839-8836-fcb7509cecfe/contents?resource_types=element%2Cinstance%2Ctemplate%2Cfolder&sort=-lastUpdatedOnTS&offset=0&limit=500",
                    "first": "http://127.0.0.1:9008/folders/https%3A%2F%2Frepo.metadatacenter.orgx%2Ffolders%2Ff55c5f4b-1ee6-4839-8836-fcb7509cecfe/contents?resource_types=element%2Cinstance%2Ctemplate%2Cfolder&sort=-lastUpdatedOnTS&offset=0&limit=500"
                  },
                  "resources": [ {
                    "nodeType": "template",
                    "createdOnTS": 1502146462,
                    "lastUpdatedOnTS": 1502146462,
                    "name": "test",
                    "description": "Description",
                    "displayName": "test",
                    "path": null,
                    "parentPath": null,
                    "displayPath": null,
                    "displayParentPath": null,
                    "ownedBy": "https://metadatacenter.org/users/467ac575-c434-42ae-b991-e254adc8023e",
                    "currentUserPermissions": [],
                    "createdByUserName": null,
                    "lastUpdatedByUserName": null,
                    "ownedByUserName": null,
                    "@id": "https://repo.metadatacenter.orgx/templates/ccfc1135-5f90-4f53-94c1-0a5a8cf02f77",
                    "pav:createdOn": "2017-08-07T15:54:22-0700",
                    "pav:lastUpdatedOn": "2017-08-07T15:54:22-0700",
                    "pav:createdBy": "https://metadatacenter.org/users/467ac575-c434-42ae-b991-e254adc8023e",
                    "oslc:modifiedBy": "https://metadatacenter.org/users/467ac575-c434-42ae-b991-e254adc8023e",
                    "@context": {
                      "schema": "http://schema.org/",
                      "pav": "http://purl.org/pav/",
                      "oslc": "http://open-services.net/ns/core#"
                    },
                    "nodeType": "template"
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
                };


            return [200, response, {}];
          });
    });

    describe('In a template,', function () {
      describe('a copy modal ', function () {

        var $copyScope;
        var copyDirective;
        var copyButton = "#copy-modal .modal-footer .clear-save button";
        var xGoAway = "#copy-modal #copy-modal-header.modal-header .button.close";
        var copyTitle = "#copy-modal #copyModalHeader .modal-title a";
        var BackToParent = "#copy-modal #copyModalHeader .arrow-click";
        var $parentScope;

        beforeEach(function () {
          // create a new, isolated scope and a new directive
          $copyScope = $rootScope.$new();

          var copyModalVisible = false;
          var resourceTypes = {"template": true, "element": true, "instance": true};
          var currentFolderId = 'https://repo.metadatacenter.orgx/folders/f55c5f4b-1ee6-4839-8836-fcb7509cecfe';
          var currentPath = '';
          var resource = {
            "nodeType": "template",
            "createdOnTS": 1502146462,
            "lastUpdatedOnTS": 1502146462,
            "name": "test",
            "description": "Description",
            "displayName": "test",
          };

          copyDirective = '<cedar-copy-modal  modal-visible="copyModalVisible" class="modal fade" id="copy-modal"tabindex="-1" role="dialog" aria-labelledby="copyModalHeader" data-keyboard="true" data-backdrop="static" copy-resource="resource"> </cedar-copy-modal>';
          copyDirective = $compile(copyDirective)($copyScope);
          $copyScope.$digest();

          copyModalVisible = true;
          $rootScope.$broadcast('copyModalVisible',
              [copyModalVisible, resource, currentPath, currentFolderId,
               resourceTypes,
               CedarUser.getSort()]);

          $httpBackend.flush();
        });
 
        it("should have a copy button ", function () {
          var elm = copyDirective[0];
          expect(elm.querySelector(copyButton)).toBeDefined();
        });


        // TODO folder title is not showing in copyTitleElement
        it("should have header with the current folder name, back arrow and and go away x  ", function () {
          var elm = copyDirective[0];
          expect(elm.querySelector(xGoAway)).toBeDefined();
          expect(elm.querySelector(BackToParent)).toBeDefined();

          expect(elm.querySelector(copyTitle)).toBeDefined();
          var copyTitleElement = angular.element(elm.querySelectorAll(copyTitle)[0]);
          console.log('title', copyTitleElement.val());

          var backToParentElement = angular.element(elm.querySelectorAll(BackToParent)[0]);
          backToParentElement.triggerHandler('click');

          expect(elm.querySelector(copyTitle)).toBeDefined();
          var copyTitleElement = angular.element(elm.querySelectorAll(copyTitle)[0]);
          console.log('title', copyTitleElement.val());

        });

      });
    });


  });
});
