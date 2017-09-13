'use strict';

define(['app', 'angular'], function (app) {

  describe('cedar-copy-modal.directive_test.js:', function () {

    var $rootScope;
    var $compile;
    var $controller;
    var $httpBackend;
    var $templateCache;
    var $timeout;
    var CedarUser;
    var appData = applicationData.getConfig();
    var cedarUser = cedarUserData.getConfig(appData);

    var UIMessageService;
    var resourceService;
    var UISettingsService;
    var UrlService;
    var QueryParamUtilsService;


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
      httpData.init($httpBackend);
      httpData.getFile('resources/i18n/locale-en.json');
      httpData.getFile('config/url-service.conf.json?v=undefined');
      httpData.getFile('img/plus.png');
      httpData.getFile('img/close_modal.png');
      httpData.getUrl(UrlService.base(), 'messaging', '/summary');
      httpData.getUrl(UrlService.base(), 'resource', '/folders/https%3A%2F%2Frepo.metadatacenter.orgx%2Ffolders%2Ff55c5f4b-1ee6-4839-8836-fcb7509cecfe/contents?limit=100&offset=0&resource_types=folder&sort=createdOnTS');
      httpData.getUrl(UrlService.base(), 'resource', '/folders/https%3A%2F%2Frepo.metadatacenter.orgx%2Ffolders%2F22e37611-192e-4faa-aa6d-4b1dcad3b898/contents?limit=500&offset=0&resource_types=template,element,instance,folder&sort=-createdOnTS');
      httpData.getUrl(UrlService.base(), 'resource', '/folders/https%3A%2F%2Frepo.metadatacenter.orgx%2Ffolders%2Ff55c5f4b-1ee6-4839-8836-fcb7509cecfe/contents?limit=500&offset=0&resource_types=template,element,instance,folder&sort=-createdOnTS');
    });

    describe('In a template,', function () {
      describe('a copy modal ', function () {

        var $copyScope;
        var copyDirective;
        var copyButton = "#copy-modal .modal-footer .clear-save button.confirm";
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


        // TODO folder title is not showing in copyTitleElement
        xit("should have header with the current folder name, back arrow and and go away x  ", function () {
          var elm = copyDirective[0];
          expect(elm.querySelector(xGoAway)).toBeDefined();
          expect(elm.querySelector(BackToParent)).toBeDefined();
          expect(elm.querySelector(copyButton)).toBeDefined();

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
