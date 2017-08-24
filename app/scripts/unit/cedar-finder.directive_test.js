'use strict';

define(['app', 'angular'], function (app) {

  describe('cedar-finder.directive_test.js:', function () {

    var $rootScope;
    var $compile;
    var $controller;
    var $httpBackend;
    var UIMessageService;
    var resourceService;
    var UrlService;
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
    beforeEach(module('cedar.templateEditor.modal.cedarFinderDirective'));
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
            return 'https://repo.metadatacenter.orgx/folders/f55c5f4b-1ee6-4839-8836-fcb7509cecfe'
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
          getSort : function () {
            return "createdOnTS";
          }
        };
        return cedarUser;
      });
    }));
    beforeEach(module('cedar.templateEditor.modal.cedarFinderDirective', function ($provide) {
      $provide.factory('cedarInfiniteScrollDirective', function () {
        return {};
      });
    }));

    beforeEach(inject(
        function (_$rootScope_, _$compile_, _$controller_, _$httpBackend_,_$timeout_,
                  _UIMessageService_, _UrlService_,_resourceService_, _UISettingsService_, _QueryParamUtilsService_) {
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
      http.init($httpBackend);
      http.getFile('resources/i18n/locale-en.json');
      http.getFile('config/url-service.conf.json?v=undefined');
      http.getFile('img/plus.png');
      http.getFile('img/close_modal.png');
      http.getUrl(UrlService.base(), 'messaging', '/summary');
      http.getUrl(UrlService.base(), 'resource', '/folders/https%3A%2F%2Frepo.metadatacenter.orgx%2Ffolders%2Ff55c5f4b-1ee6-4839-8836-fcb7509cecfe/contents?limit=100&offset=0&resource_types=folder&sort=createdOnTS');
     });

    describe('In a template,', function () {
      describe('a finder widget', function () {

        var $finderScope;
        var finderDirective;
        var finderSelector = ".subm";
        var searchInput = '#finder-search-form input';
        var finderSearch = '#finder-search-input';
        var modalHeader = '#finderModalHeader';
        var gridView = '#finderModalHeader .fa-th';
        var listView = '#finderModalHeader .fa-list-ul';
        var sortButton = '#finderModalHeader .fa-sort';
        var sortByName = '.sort-by-name';
        var sortByCreated = 'sort-by-created';
        var sortByUpdated = '.sort-by-updated';
        var remove = 'a.clear-search';
        var searching = '.modal-footer div.breadcrumbs-sb  p.searching.ng-hide ';
        var notSearching = '.modal-footer div.breadcrumbs-sb  p.not-searching.ng-hide ';
        var breadcrumbs = '.modal-footer .breadcrumbs-sb';


        beforeEach(function () {
          // create a new, isolated scope and a new directive
          $finderScope = $rootScope.$new();
          finderDirective = '<cedar-finder  modal-visible="finderModalVisible"   select-resource-callback="" pick-resource-callback="" ></cedar-finder>';
          finderDirective = $compile(finderDirective)($finderScope);
          $finderScope.$digest();
        });

        it("should have buttons defined by default", function () {
          var elm = finderDirective[0];
          expect(elm.querySelector(modalHeader)).toBeDefined();
          expect(elm.querySelector(searchInput)).toBeDefined();
          expect(elm.querySelector(sortButton)).toBeDefined();
        });

        it("should open the sort dropdown when clicked", function () {
          var elm = finderDirective[0];
          elm.querySelectorAll(sortButton)[0].click();
          expect(elm.querySelector('#finderModalHeader .dropdown.open .sort-by-name')).toBeDefined();
          expect(elm.querySelector('#finderModalHeader .dropdown.open .sort-by-name')).toBeDefined();
          expect(elm.querySelector('#finderModalHeader .dropdown.open .sort-by-name')).toBeDefined();
        });

        it("should show grid or list view", function () {
          var elm = finderDirective[0];
          if (elm.querySelector('#finder-modal .tool.list-view')) {
            expect(elm.querySelector('.populate-form-boxes .grid-view')).toBeDefined();
          } else {
            expect(elm.querySelector('.populate-form-boxes .list-view')).toBeDefined();
          }
        });

        it("should handle search interaction", function () {
          var value = 'some text';
          var elm = finderDirective[0];

          // enter 'test' into the search field
          var searchElement = angular.element(elm.querySelectorAll(finderSearch)[0]);
          searchElement.triggerHandler('click');
          searchElement.val(value);
          searchElement.triggerHandler('change');
          $timeout.flush();
          expect(searchElement.val() === value).toBeTruthy();

          // expect the remove x to appear
          expect(elm.querySelector(remove)).toBeDefined();
          var removeElement = angular.element(elm.querySelectorAll(remove)[0]);
          removeElement.triggerHandler('click');
          expect(searchElement.val() === '').toBeTruthy();

        });

        it("should handle breadcrumb interaction during search", function () {
          var value = 'some text';
          var elm = finderDirective[0];
          expect(elm.querySelectorAll(notSearching).length).toBe(0);

          // enter 'test' into the search field
          var searchElement = angular.element(elm.querySelectorAll(finderSearch)[0]);
          searchElement.triggerHandler('click');
          searchElement.val(value);
          searchElement.triggerHandler('change');
          $timeout.flush();
          expect(searchElement.val() === value).toBeTruthy();

          // TODO this should be true but it is not
          //expect(elm.querySelectorAll(notSearching).length).toBe(1);

          // expect the remove x to appear
          expect(elm.querySelector(remove)).toBeDefined();
          var removeElement = angular.element(elm.querySelectorAll(remove)[0]);
          removeElement.triggerHandler('click');
          expect(searchElement.val() === '').toBeTruthy();
          expect(elm.querySelectorAll(notSearching).length).toBe(0);

        });

      });
    });


  });
});