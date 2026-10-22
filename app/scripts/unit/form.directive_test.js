'use strict';

define(['app', 'angular'], function (app) {

  // The form directive renders the root of whatever the Designer edits. A template or element lists
  // its children in _ui.order, and the directive supplies the list where one is missing. A field
  // has no children, and the meta-schema forbids an order in a field's _ui, so the server refuses
  // a standalone field saved with one.
  describe('form.directive_test.js:', function () {

    var $rootScope;
    var $compile;
    var $controller;
    var $httpBackend;
    var DataManipulationService;
    var UrlService;

    beforeEach(module('my.templates'));
    beforeEach(module(app.name));
    beforeEach(angular.mock.module(function ($provide) {
      $provide.service('UserService', function mockUserService() {
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

    beforeEach(inject(
        function (_$rootScope_, _$compile_, _$controller_, _$httpBackend_, _DataManipulationService_, _UrlService_) {
          $rootScope = _$rootScope_.$new();
          $compile = _$compile_;
          $controller = _$controller_;
          $httpBackend = _$httpBackend_;
          DataManipulationService = _DataManipulationService_;
          UrlService = _UrlService_;
        }));

    beforeEach(function () {
      httpData.init($httpBackend);
      httpData.getFile('resources/i18n/locale-en.json');
      httpData.getFile('img/plus.png');
      httpData.getUrl(UrlService.base(), 'messaging', '/summary');
    });

    // Create the root with the controller that owns it, optionally adjust it, then render it
    function render(controllerName, adjust) {
      var $scope = $rootScope.$new(true);
      $controller(controllerName, {$rootScope: $rootScope, $scope: $scope});
      if (adjust) {
        adjust($scope.form);
      }
      $compile("<form-directive form='form' model='instance' page-index='0'></form-directive>")($scope);
      $scope.$digest();
      return $scope.form;
    }

    it('leaves a standalone field without an order', function () {
      var field = render('CreateFieldController');
      expect(DataManipulationService.getType(field)).toEqual(DataManipulationService.cedarFieldType());
      expect(field._ui.order).toBeUndefined();
    });

    it('gives a template without an order one', function () {
      var template = render('CreateTemplateController', function (form) {
        delete form._ui.order;
      });
      expect(template._ui.order).toEqual(jasmine.any(Array));
    });
  });
});
