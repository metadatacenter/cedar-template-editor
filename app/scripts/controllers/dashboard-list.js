'use strict';

var DashboardListController = function ($rootScope, $scope, $routeParams, $location, HeaderService, UrlService, TemplateService, TemplateElementService, TemplateInstanceService, CONST) {

  // Load all items depending on $routeParams.type parameter supplied
  $scope.listTemplateElements = function () {
    // set Page Title variable when this is active
    $rootScope.pageTitle = 'Elements Listing';
    $scope.sectionTitle = 'Template Elements';
    $scope.createLink = '/elements/create';

    TemplateElementService.getAllTemplateElementsSummary().then(function (data) {
      $scope.allTemplateElements = data;
    });
  };

  $scope.listTemplates = function () {
    // set Page Title variable when this is active
    $rootScope.pageTitle = 'Templates Listing';
    $scope.sectionTitle = 'Metadata Templates';
    $scope.createLink = '/templates/create';

    TemplateService.getAllTemplatesSummary().then(function (data) {
      $scope.allTemplates = data;
    });
  };

  $scope.listTemplateInstances = function () {
    // set Page Title variable when this is active
    $rootScope.pageTitle = 'Populated Templates';
    $scope.sectionTitle = 'Populated Templates';
    $scope.createLink = '/instances/create';

    TemplateInstanceService.getAllTemplateInstancesSummary().then(function (data) {
      $scope.allTemplateInstances = data;
    });
  };

  // Remove template
  $scope.removeTemplate = function (id) {
    TemplateService.removeTemplate(id).then(function (response) {
      // Reload templates
      $scope.listTemplates();
    }).catch(function (err) {
      console.log(err);
    });
  }

  // Remove element
  $scope.removeElement = function (id) {
    TemplateElementService.removeTemplateElement(id).then(function (response) {
      // Reload elements
      $scope.listTemplateElements();
    }).catch(function (err) {
      console.log(err);
    });
  }

  // Remove populated template
  $scope.removeInstance = function (id) {
    TemplateInstanceService.removeTemplateInstance(id).then(function (response) {
      // Reload template instances
      $scope.listTemplateInstances();
    }).catch(function (err) {
      console.log(err);
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


DashboardListController.$inject = ["$rootScope", "$scope", "$routeParams", "$location", "HeaderService", "UrlService", "TemplateService", "TemplateElementService", "TemplateInstanceService", "CONST"];
angularApp.controller('DashboardListController', DashboardListController);