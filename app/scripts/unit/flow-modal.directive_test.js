'use strict';

define(['app', 'angular'], function (app) {

  describe('flow-modal.directive_test.js:', function () {

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
    beforeEach(module('cedar.templateEditor.searchBrowse.flowModal'));
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
      httpData.getUrl(UrlService.base(), 'messaging', '/summary');
      httpData.getUrl(UrlService.base(), 'resource', '/folders/https%3A%2F%2Frepo.metadatacenter.orgx%2Ffolders%2F80e366b2-c8fb-4de5-b899-7d46c770d2f4/contents?limit=100&offset=0&resource_types=element,field,instance,template,folder&sort=name');
      httpData.getUrl(UrlService.base(), 'resource', '/folders/https%3A%2F%2Frepo.metadatacenter.orgx%2Ffolders%2F80a3dbf6-a840-48e9-8542-2fd31f475861/contents?limit=100&offset=0&resource_types=element,field,instance,template,folder&sort=name');
      httpData.getUrl(UrlService.base(), 'resource', '/folders/https%3A%2F%2Frepo.metadatacenter.orgx%2Ffolders%2Fa4d9694b-74cb-4938-8c7d-59986021b35f/contents?limit=100&offset=0&resource_types=element,field,instance,template,folder&sort=name');
      httpData.getUrl(UrlService.base(), 'resource', '/folders/https%3A%2F%2Frepo.metadatacenter.orgx%2Ffolders%2F64647077-5bcb-4e1d-aee4-2dce39a73e68/contents?limit=100&offset=0&resource_types=element,field,instance,template,folder&sort=name');
    });

    describe('In a workspace,', function () {
      describe('a flow modal ', function () {

        var $flowScope;
        var flowDirective;
        var flowElement;
        var submitButton = "#flow-modal .modal-footer .btn.ng-scope.btn-save";
        var closeButton = "#flow-modal .modal-footer .btn.done.ng-scope.btn-clear";

        beforeEach(function () {
          // create a new, isolated scope and a new directive
          $flowScope = $rootScope.$new();
          $flowScope.isTest= true;

          flowDirective = '<flow-modal  modal-visible="flowModalVisible" class="modal fade"  id="flow-modal" tabindex="-1" role="dialog" aria-labelledby="flowModalHeader" data-keyboard="true" data-backdrop="static" > </flow-modal>';

          flowElement = angular.element(flowDirective);
          flowDirective = $compile(flowElement)($flowScope);
          $flowScope.$digest();

          // open the dialog
          $flowScope.flowModalVisible= true;
          $flowScope.$broadcast('flowModalVisible',
              [$flowScope.flowModalVisible, $flowScope.instanceId, $flowScope.name]);

          // flush the timeout and pending requests
          $timeout.flush();
          $httpBackend.flush();
        });

        it("should show a header, submit and close", function () {
          var elm = flowDirective[0];
          expect(elm.querySelector(submitButton)).toBeDefined();
          expect(elm.querySelector(closeButton)).toBeDefined();
          expect($flowScope.flowModalVisible).toBeTruthy();
        });

      });
    });
  });
});
