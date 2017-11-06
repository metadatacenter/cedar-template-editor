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
        service.getToken = function() {};
        service.injectUserHandler = function (userHandler) {};
        service.updateOwnUser = function (instance) {};
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
        function (_$rootScope_, _$compile_, _$controller_, _$httpBackend_,_$timeout_,
                  _UIMessageService_,_UrlService_, _resourceService_, _UISettingsService_, _QueryParamUtilsService_) {
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
      httpData.getFile('img/close_modal.png');
      httpData.getUrl(UrlService.base(), 'messaging', '/summary');
    });

    describe('In a template,', function () {
      describe('a move modal ', function () {

        var $moveScope;
        var moveDirective;
        var moveButton = "#move-modal .modal-footer .clear-save button";
        var xGoAway = "#move-modal #move-modal-header.modal-header .button.close";
        var moveTitle = "#move-modal #move-modal-header .modal-title";



        beforeEach(function () {
          // create a new, isolated scope and a new directive
          $moveScope = $rootScope.$new();
          moveDirective = '<cedar-move-modal  modal-visible="moveModalVisible" ></cedar-move-modal>';
          moveDirective = $compile(moveDirective)($moveScope);
          $moveScope.$digest();
        });

        it("should have a move button and close x ", function () {
          var elm = moveDirective[0];
          expect(elm.querySelector(moveButton)).toBeDefined();
          expect(elm.querySelector(xGoAway)).toBeDefined();
        });

        it("should have a header with the current folder name ", function () {
          var elm = moveDirective[0];
          expect(elm.querySelector(moveTitle)).toBeDefined();
          console.log(elm.querySelector(moveTitle));
        });


      });
    });


  });
});
