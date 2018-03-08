'use strict';

define(['app', 'angular'], function (app) {

  describe('cedar-move-modal.directive_test.js:', function () {

    var $rootScope;
    var $compile;
    var $controller;
    var $httpBackend;
    var UIMessageService;
    var UrlService;
    var resourceService;
    var UISettingsService;
    var QueryParamUtilsService;
    var $timeout;
    var appData = applicationData.getConfig();
    var cedarUser = cedarUserData.getConfig(appData);

    // Load the module that contains the templates that were loaded with html2js
    beforeEach(module('my.templates'));
    // Load other modules
    beforeEach(module(app.name));
    beforeEach(module('cedar.templateEditor.modal.cedarMoveModalDirective'));
    beforeEach(module('cedar.templateEditor.service.uIMessageService'));
    beforeEach(module('cedar.templateEditor.service.resourceService'));
    beforeEach(module('cedar.templateEditor.service.uISettingsService'));
    beforeEach(module('cedar.templateEditor.service.queryParamUtilsService'));
    beforeEach(angular.mock.module(function ($provide) {
      $provide.service('UserService', function mockUserService() {
        var userHandler = null;
        var service = {serviceId: "UserService"};
        service.getToken = function () {
        };
        service.injectUserHandler = function (userHandler) {
        };
        service.updateOwnUser = function (instance) {
        };
        return service;
      });
    }));
    // we need to register our alternative version of CedarUser, before we call inject.
    beforeEach(angular.mock.module(function ($provide) {
      $provide.service('CedarUser', function mockCedarUser() {
        return cedarUser;
      });
    }));
    beforeEach(module('cedar.templateEditor.modal.cedarMoveModalDirective', function ($provide) {
      $provide.factory('cedarInfiniteScrollDirective', function () {
        return {};
      });
    }));

    beforeEach(inject(
        function (_$rootScope_, _$compile_, _$controller_, _$httpBackend_, _$timeout_,
                  _UIMessageService_, _UrlService_, _resourceService_, _UISettingsService_, _QueryParamUtilsService_) {
          $rootScope = _$rootScope_.$new(); // create new scope
          $compile = _$compile_;
          $controller = _$controller_;
          $httpBackend = _$httpBackend_;
          UIMessageService = _UIMessageService_;
          UrlService = _UrlService_;
          resourceService = _resourceService_;
          UISettingsService = _UISettingsService_;
          QueryParamUtilsService = _QueryParamUtilsService_;
          $timeout = _$timeout_;
        }));

    beforeEach(function () {
      httpData.init($httpBackend);
      httpData.getFile('resources/i18n/locale-en.json');
      httpData.getFile('config/url-service.conf.json?v=undefined');
      httpData.getFile('img/plus.png');
      httpData.getUrl(UrlService.base(), 'messaging', '/summary');
      httpData.getUrl(UrlService.base(), 'resource', '/folders/https%3A%2F%2Frepo.metadatacenter.orgx%2Ffolders%2F80e366b2-c8fb-4de5-b899-7d46c770d2f4/contents?limit=100&offset=0&resource_types=element,field,instance,template,folder&sort=name');
      httpData.getUrl(UrlService.base(), 'resource', '/folders/https%3A%2F%2Frepo.metadatacenter.orgx%2Ffolders%2F80a3dbf6-a840-48e9-8542-2fd31f475861/contents?limit=100&offset=0&resource_types=element,field,instance,template,folder&sort=name');
      httpData.getUrl(UrlService.base(), 'resource', '/folders/https%3A%2F%2Frepo.metadatacenter.orgx%2Ffolders%2Fa4d9694b-74cb-4938-8c7d-59986021b35f/contents?limit=100&offset=0&resource_types=element,field,instance,template,folder&sort=name');
      httpData.getUrl(UrlService.base(), 'resource', '/folders/https%3A%2F%2Frepo.metadatacenter.orgx%2Ffolders%2F64647077-5bcb-4e1d-aee4-2dce39a73e68/contents?limit=100&offset=0&resource_types=element,field,instance,template,folder&sort=name');
    });


    describe('In a template,', function () {
      describe('a move modal ', function () {


        var moveDirective;
        var moveElement;
        var $moveScope;
        var moveButton = "div.modal-content .modal-footer .clear-save button";
        var xGoAway = "div.modal-content .modal-header button.close";
        var folderTitle = "#folder-title";
        var contentsResourceTitle = ".contents-resource-title";
        var contentsFolderTitle = ".contents-folder-title";
        var forwardArrow = "#moveModalContent .arrow-click";
        var backArrow = "div.modal-content  h4.modal-title.back-to-parent";
        var homeIcon = "div.modal-content  h4.modal-title.back-to-home";
        var moveModalVisible = true;
        var controller;



        beforeEach(function () {
          // create a new, isolated scope and a new directive
          $moveScope = $rootScope.$new();
          $moveScope.moveModalVisible= false;
          $moveScope.resource= {
            '@id'                   : "https://repo.metadatacenter.orgx/templates/43ea9e95-5d1b-474b-b200-0f2e196d1058",
            'currentUserPermissions': [],
            'schema:name'           : 't2'
          };
          $moveScope.currentPath  = {
            '@id'                   : "https://repo.metadatacenter.orgx/folders/80e366b2-c8fb-4de5-b899-7d46c770d2f4",
            'createdByUserName'     : null,
            'createdOnTS'           : 1511895932,
            'currentUserPermissions': [],
            'schema:description'    : "Home folder of Test User 1",
            'schema:name'           : "Test User 1",
            displayPath             : null,
            isRoot                  : false,
            isSystem                : false,
            isUserHome              : true,
            lastUpdatedByUserName   : null,
            lastUpdatedOnTS         : 1511895932,
            name                    : "Test User 1",
            nodeType                : "folder",
            modifiedBy              : "https://metadatacenter.org/users/84c0e798-fd6a-4615-bd41-738baba31ea4",
            ownedBy                 : "https://metadatacenter.org/users/84c0e798-fd6a-4615-bd41-738baba31ea4",
            createdBy               : "https://metadatacenter.org/users/84c0e798-fd6a-4615-bd41-738baba31ea4",
            createdOn               : "2017-11-28T11:05:32-0800",
            lastUpdatedOn           : "2017-11-28T11:05:32-0800"
          };
          $moveScope.currentFolderId = "https://repo.metadatacenter.orgx/folders/80e366b2-c8fb-4de5-b899-7d46c770d2f4";
          $moveScope.resourceTypes   = {'element': true, 'field': true, 'instance': true, template: true};
          $moveScope.sortOptionField = "name";

          moveDirective = '<cedar-move-modal  modal-visible="$moveScope.moveModalVisible" move-resource="$moveScope.resource" ></cedar-move-modal>';

          moveElement = angular.element(moveDirective);
          moveDirective = $compile(moveElement)($moveScope);
          $moveScope.$digest();

          // open the dialog
          $moveScope.moveModalVisible= true;
          $moveScope.$broadcast('moveModalVisible',
              [$moveScope.moveModalVisible, $moveScope.resource, $moveScope.currentPath,
               $moveScope.currentFolderId, $moveScope.currentFolderId, $moveScope.resourceTypes,
               $moveScope.sortOptionField]);

          // flush the timeout and pending requests
          $timeout.flush();
          $httpBackend.flush();
        });


        // critical
        it("should show a header with user name as title, move button, go away button and parent arrow", function () {
          var elm = moveDirective[0];
          expect(elm.querySelector(moveButton)).toBeDefined();
          expect(elm.querySelector(xGoAway)).toBeDefined();
          expect(elm.querySelector(folderTitle)).toBeDefined();
          expect(elm.querySelector(backArrow)).toBeDefined();
          expect(elm.querySelector(homeIcon)).toBeDefined();
        });
        it('should go to parent folder when clicking back arrow and to child folder when clicking the forward arrow', function () {
          var elm = moveDirective[0];
          var backElement = angular.element(elm.querySelector(backArrow));
          backElement.triggerHandler('click');

          $timeout.flush();
          $httpBackend.flush();
          $moveScope.$apply();

          elm = moveDirective[0];
          expect(elm.querySelector(folderTitle).firstChild.nodeValue).toEqual('Users');
          expect(elm.querySelectorAll(contentsFolderTitle).length).toEqual(4);
          expect(elm.querySelector(contentsFolderTitle).firstChild.nodeValue.trim()).toEqual('CEDAR Admin');

          // now go forward to the first directory listed
          var forwardElement = angular.element(elm.querySelector(forwardArrow));
          forwardElement.triggerHandler('click');

          $timeout.flush();
          $httpBackend.flush();
          $moveScope.$apply();

          elm = moveDirective[0];
          expect(elm.querySelector(folderTitle).firstChild.nodeValue).toEqual('CEDAR Admin');
          expect(elm.querySelectorAll(contentsFolderTitle).length).toEqual(0);

        });
        it('should go to parent folder when clicking back arrow and to home folder when clicking the home icon', function () {
          var elm = moveDirective[0];
          var backElement = angular.element(elm.querySelector(backArrow));
          backElement.triggerHandler('click');

          $timeout.flush();
          $httpBackend.flush();
          $moveScope.$apply();

          elm = moveDirective[0];
          expect(elm.querySelector(folderTitle).firstChild.nodeValue).toEqual('Users');
          expect(elm.querySelectorAll(contentsFolderTitle).length).toEqual(4);
          expect(elm.querySelector(contentsFolderTitle).firstChild.nodeValue.trim()).toEqual('CEDAR Admin');

          // now go forward to the first directory listed
          var homeElement = angular.element(elm.querySelector(homeIcon));
          homeElement.triggerHandler('click');

          $timeout.flush();
          $httpBackend.flush();
          $moveScope.$apply();

          elm = moveDirective[0];
          expect(elm.querySelector(folderTitle).firstChild.nodeValue).toEqual('Test User 1');
          expect(elm.querySelectorAll(contentsFolderTitle).length).toEqual(0);

        });

      });
    });


  });
})
;
