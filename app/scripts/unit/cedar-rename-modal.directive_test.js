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
    var QueryParamUtilsService;
    var $timeout;
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
          }
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
        function (_$rootScope_, _$compile_, _$controller_, _$httpBackend_,_$timeout_,
                  _UIMessageService_, _resourceService_, _UISettingsService_, _QueryParamUtilsService_) {
          $rootScope = _$rootScope_.$new(); // create new scope
          $compile = _$compile_;
          $controller = _$controller_;
          $httpBackend = _$httpBackend_;
          UIMessageService = _UIMessageService_;
          resourceService = _resourceService_;
          UISettingsService = _UISettingsService_;
          QueryParamUtilsService = _QueryParamUtilsService_;
          $timeout = _$timeout_;
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
    });

    describe('In a template,', function () {
      describe('a copy modal ', function () {

        var $copyScope;
        var copyDirective;
        var copyButton = "#copy-modal .modal-footer .clear-save button";
        var xGoAway = "#copy-modal #copy-modal-header.modal-header .button.close";
        var copyTitle = "#copy-modal #copy-modal-header .modal-title";



        beforeEach(function () {
          // create a new, isolated scope and a new directive
          $copyScope = $rootScope.$new();
          copyDirective = '<cedar-copy-modal  modal-visible="copyModalVisible" ></cedar-copy-modal>';
          copyDirective = $compile(copyDirective)($copyScope);
          $copyScope.$digest();
        });

        it("should have a move button and close x ", function () {
          var elm = copyDirective[0];
          expect(elm.querySelector(copyButton)).toBeDefined();
          expect(elm.querySelector(xGoAway)).toBeDefined();
        });

        it("should have a header with the current folder name ", function () {
          var elm = copyDirective[0];
          expect(elm.querySelector(copyTitle)).toBeDefined();
          console.log(elm.querySelector(copyTitle));
        });


      });
    });


  });
});
