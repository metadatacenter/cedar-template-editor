'use strict';

define(['app', 'angular'], function (app) {

  describe('a-test.directive_test.js:', function () {

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
    var UserService;

    NoauthUserHandler.getParsedToken = function () {
      return {
        "name": "Unauthenticated User",
        "sub": "111-2222-33333",
        "email": "user@domain.edu",
        "realm_access": {
          "roles": [
            "virtual role 1",
            "virtual role 2",
            "virtual role 3"
          ]
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
        return cedarUser;
      });
    }));
    // beforeEach(module('cedar.templateEditor.modal.cedarCopyModalDirective', function ($provide) {
    //   $provide.factory('cedarInfiniteScrollDirective', function () {
    //     return {};
    //   });
    // }));

    beforeEach(inject(
        function (_$rootScope_, _$compile_, _$controller_, _$httpBackend_, _$timeout_,
                  _UIMessageService_, _UrlService_, _resourceService_, _UISettingsService_, _QueryParamUtilsService_,
                  _CedarUser, UserService_) {
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
          UserService = _UserService_;
        }));

    beforeEach(function () {
      // httpData.init($httpBackend);
      // httpData.getFile('resources/i18n/locale-en.json');
      // httpData.getFile('config/url-service.conf.json?v=undefined');
      // httpData.getFile('img/plus.png');
      // httpData.getFile('img/close_modal.png');
      // httpData.getUrl(UrlService.base(), 'messaging', '/summary');
      // httpData.getUrl(UrlService.base(), 'resource', '/folders/https%3A%2F%2Frepo.metadatacenter.orgx%2Ffolders%2Ff55c5f4b-1ee6-4839-8836-fcb7509cecfe/contents?limit=100&offset=0&resource_types=folder&sort=createdOnTS');
      // httpData.getUrl(UrlService.base(), 'resource', '/folders/https%3A%2F%2Frepo.metadatacenter.orgx%2Ffolders%2F22e37611-192e-4faa-aa6d-4b1dcad3b898/contents?limit=500&offset=0&resource_types=template,element,instance,folder&sort=-createdOnTS');
      // httpData.getUrl(UrlService.base(), 'resource', '/folders/https%3A%2F%2Frepo.metadatacenter.orgx%2Ffolders%2Ff55c5f4b-1ee6-4839-8836-fcb7509cecfe/contents?limit=500&offset=0&resource_types=template,element,instance,folder&sort=-createdOnTS');
    });

    describe('In a template,', function () {
      describe('an initial test ', function () {

        var $copyScope;

        beforeEach(function () {
          $copyScope = $rootScope.$new();
          UserService.init();
          UserService.injectUserHandler(NoauthUserHandler);
        });


        it("should begin with a truthy test ", function () {
          expect(true).toBeTruthy()

        });

      });
    });


  });
});
