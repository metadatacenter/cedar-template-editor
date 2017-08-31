'use strict';

define(['app', 'angularMocks'], function(app) {
  describe('create-element.controller_test.js', function() {
    beforeEach(module('cedar.templateEditor'));

    var $rootScope;
    var $compile;
    var $controller;
    var $httpBackend;
    var $templateCache;
    var $timeout;
    var CedarUser;
    var appData = applicationData.getConfig();
    var cedarUser = cedarUserData.getConfig(appData);

    var DataManipulationService;
    var StagingService;
    var TemplateElementService;
    var DataUtilService;
    var SpreadsheetService;
    var UIUtilService;
    var UrlService;
    var UIMessageService;
    var resourceService;
    var UISettingsService;
    var resourceService;
    var QueryParamUtilsService;

    beforeEach(inject(function(_$rootScope_, _$controller_) {
      // The injector unwraps the underscores (_) from around the parameter names when matching
      $controller = _$controller_;
      $rootScope = _$rootScope_;
    }));

    describe('CreateElementController', function() {
      it('sets the pageTitle to "Element Designer"', function() {
        var $scope = $rootScope.$new();
        var controller = $controller('CreateElementController', { $scope: $scope });
        expect($scope.pageTitle).toEqual('Element Designer');
      });
    });
  });
});