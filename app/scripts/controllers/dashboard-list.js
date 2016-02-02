'use strict';

var DashboardListController = function ($rootScope, $scope, $routeParams, $location, $translate, HeaderService, UrlService,
                                        TemplateService, TemplateElementService, TemplateInstanceService, UIMessageService, CONST) {

  // Load all items depending on $routeParams.type parameter supplied
  $scope.listTemplateElements = function () {
    // set Page Title variable when this is active
    $rootScope.pageTitle = $translate.instant('PAGES.DASHBOARDLIST-ELEMENT.pageTitle');
    $scope.sectionTitle = $translate.instant('PAGES.DASHBOARDLIST-ELEMENT.sectionTitle');
    $scope.createLink = '/elements/create';

    TemplateElementService.getAllTemplateElementsSummary().then(function (response) {
      $scope.allTemplateElements = response.data;
    }).catch(function (err) {
      UIMessageService.showBackendError('SERVER.ELEMENTS.load.error', err);
    });
  };

  $scope.listTemplates = function () {
    // set Page Title variable when this is active
    $rootScope.pageTitle = $translate.instant('PAGES.DASHBOARDLIST-TEMPLATE.pageTitle');
    $scope.sectionTitle = $translate.instant('PAGES.DASHBOARDLIST-TEMPLATE.sectionTitle');
    $scope.createLink = '/templates/create';

    TemplateService.getAllTemplatesSummary().then(function (response) {
      $scope.allTemplates = response.data;
    }).catch(function (err) {
      UIMessageService.showBackendError('SERVER.TEMPLATES.load.error', err);
    });
  };

  $scope.listTemplateInstances = function () {
    // set Page Title variable when this is active
    $rootScope.pageTitle = $translate.instant('PAGES.DASHBOARDLIST-INSTANCE.pageTitle');
    $scope.sectionTitle = $translate.instant('PAGES.DASHBOARDLIST-INSTANCE.sectionTitle');
    $scope.createLink = '/instances/create';

    TemplateInstanceService.getAllTemplateInstancesSummary().then(function (response) {
      $scope.allTemplateInstances = response.data;
    }).catch(function (err) {
      UIMessageService.showBackendError('SERVER.INSTANCES.load.error', err);
    });
  };

  // Remove template
  $scope.deleteTemplate = function (id) {
    TemplateService.deleteTemplate(id).then(function (response) {
      // Reload templates
      $scope.listTemplates();
      UIMessageService.flashSuccess('SERVER.TEMPLATE.delete.success', null, 'GENERIC.Deleted');
    }).catch(function (err) {
      UIMessageService.showBackendError('SERVER.TEMPLATE.delete.error', err);
    });
  }

  // Remove element
  $scope.deleteElement = function (id) {
    TemplateElementService.deleteTemplateElement(id).then(function (response) {
      // Reload elements
      $scope.listTemplateElements();
      UIMessageService.flashSuccess('SERVER.ELEMENT.delete.success', null, 'GENERIC.Deleted');
    }).catch(function (err) {
      UIMessageService.showBackendError('SERVER.ELEMENT.delete.error', err);
    });
  }

  // Remove populated template
  $scope.deleteInstance = function (id) {
    TemplateInstanceService.deleteTemplateInstance(id).then(function (response) {
      // Reload template instances
      $scope.listTemplateInstances();
      UIMessageService.flashSuccess('SERVER.INSTANCE.delete.success', null, 'GENERIC.Deleted');
    }).catch(function (err) {
      UIMessageService.showBackendError('SERVER.INSTANCE.delete.error', err);
    });
  }

  // ************************************************************************************

  $scope.allTemplates = [];
  $scope.allTemplateElements = [];
  $scope.allTemplateInstances = [];

  // Setting type via $routeParams ('elements', or 'templates', or 'instances')
  $scope.itemType = $routeParams.type;

  // Inject constants
  $scope.CONST = CONST;

  // Configure mini header
  var pageId = CONST.pageId.DASHBOARDLIST;
  var currentApplicationMode = $rootScope.applicationMode;

  switch ($scope.itemType) {
    case 'elements':
      currentApplicationMode == CONST.applicationMode.CREATOR;
      $scope.listTemplateElements();
      break;
    case 'templates':
      currentApplicationMode == CONST.applicationMode.CREATOR;
      $scope.listTemplates();
      break;
    case 'instances':
      currentApplicationMode == CONST.applicationMode.RUNTIME;
      $scope.listTemplateInstances();
      break;
  }

  if (currentApplicationMode == CONST.applicationMode.DEFAULT) {
    $location.path(UrlService.getRoleSelector());
    return;
  }
  HeaderService.configure(pageId, currentApplicationMode);

};


DashboardListController.$inject = ["$rootScope", "$scope", "$routeParams", "$location", "$translate", "HeaderService", "UrlService",
  "TemplateService", "TemplateElementService", "TemplateInstanceService", "UIMessageService", "CONST"];
angularApp.controller('DashboardListController', DashboardListController);