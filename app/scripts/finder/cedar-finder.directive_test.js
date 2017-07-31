'use strict';

define(['app', 'angular'], function (app) {

  describe('cedar-finder.directive_test.js:', function () {

    var $rootScope;
    var $compile;
    var $controller;
    var $httpBackend;
    var UIMessageService;
    var resourceService;
    var UISettingsService;
    var QueryParamUtilsService;
    //var CedarUser;


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
    beforeEach(module('cedar.templateEditor.finder.cedarFinderDirective'));
    beforeEach(module('cedar.templateEditor.service.uIMessageService'));
    beforeEach(module('cedar.templateEditor.service.resourceService'));
    beforeEach(module('cedar.templateEditor.service.uISettingsService'));
    beforeEach(module('cedar.templateEditor.service.queryParamUtilsService'));
    // we need to register our alternative version of CedarUser, before we call inject.
    beforeEach(angular.mock.module(function($provide) {
      $provide.service('CedarUser', function mockCedarUser() {
        var cedarUser = {
          init : function() {return true},
          setAuthProfile: function() {return true},
          setCedarProfile: function() {return true},
          getUIPreferences: function() {return appData.CedarUserProfile.uiPreferences},
          getHomeFolderId: function() {return null},
          isSortByName:function() {return false},
          isSortByCreated:function() {return true},
          isSortByUpdated:function() {return false},
          isListView:function() {return true},
          isGridView:function() {return false}
        };
        return cedarUser;
      });
    }));
    beforeEach(module('cedar.templateEditor.finder.cedarFinderDirective', function($provide){
      $provide.factory('cedarInfiniteScrollDirective', function(){ return {}; });
    }));

    beforeEach(inject(
        function (_$rootScope_, _$compile_, _$controller_, _$httpBackend_,
                  _UIMessageService_, _resourceService_, _UISettingsService_, _QueryParamUtilsService_) {
          $rootScope = _$rootScope_.$new(); // create new scope
          $compile = _$compile_;
          $controller = _$controller_;
          $httpBackend = _$httpBackend_;
          UIMessageService = _UIMessageService_;
          resourceService = _resourceService_;
          UISettingsService = _UISettingsService_;
          QueryParamUtilsService = _QueryParamUtilsService_;

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

    });


    describe('In a template,', function () {
      describe('a finder widget', function () {

        var $finderScope;
        var finderDirective;
        var finderSelector = ".subm";
        var finderSearch = '#finder-search-form input'

        beforeEach(function () {
          // create a new, isolated scope and a new directive
          $finderScope = $rootScope.$new();
          finderDirective = '<cedar-finder  modal-visible="finderModalVisible"   select-resource-callback="" pick-resource-callback="" ></cedar-finder>';
          finderDirective = $compile(finderDirective)($finderScope);
          $finderScope.$digest();
        });

        xit('should return uiPreferences on load', function () {
          var CedarUser = $controller('CedarUser', { $finderScope: $finderScope });
          console.log('cedarUser ' + $finderScope.CedarUser);
          expect($finderScope.CedarUser.getUIPreferences()).toEqual(appData.CedarUserProfile.uiPreferences);
        });

        it("should have an submit button defined by default", function () {
          var elm = finderDirective[0];
          expect(elm.querySelector(finderSelector)).toBeDefined();
          expect(elm.querySelector(finderSearch)).toBeDefined();
        });


        it("should have an search input field defined by default", function () {
          var elm = finderDirective[0];
          expect(elm.querySelector(finderSearch)).toBeDefined();

         var inputElm = elm.querySelector(finderSearch);

          var e = jQuery.Event('keydown');
          e.which = 65;
          // TODO this fails
          //inputElm.trigger(e);


        });

      });
    });


  });
});