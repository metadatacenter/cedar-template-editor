'use strict';

var DashboardController = function ($rootScope, $scope, $routeParams, $location, HeaderService, UrlService,
                                    TemplateService, TemplateElementService, TemplateInstanceService, UIMessageService, CONST) {

  // Remove template
  $scope.deleteTemplate = function (id) {
    TemplateService.deleteTemplate(id).then(function (response) {
      // Reload templates
      $scope.loadDefaultTemplates();
      UIMessageService.flashSuccess('SERVER.TEMPLATE.delete.success', null, 'GENERIC.Deleted');
    }).catch(function (err) {
      UIMessageService.showBackendError('SERVER.TEMPLATE.delete.error', err);
    });
  };

  // Remove element
  $scope.deleteElement = function (id) {
    TemplateElementService.deleteTemplateElement(id).then(function (response) {
      // Reload elements
      $scope.loadDefaultTemplateElements();
      UIMessageService.flashSuccess('SERVER.ELEMENT.delete.success', null, 'GENERIC.Deleted');
    }).catch(function (err) {
      UIMessageService.showBackendError('SERVER.ELEMENT.delete.error', err);
    });
  };

  // Remove populated template
  $scope.deleteInstance = function (id) {
    TemplateInstanceService.deleteTemplateInstance(id).then(function (response) {
      // Reload instances
      $scope.loadDefaultTemplateInstances();
      UIMessageService.flashSuccess('SERVER.INSTANCE.delete.success', null, 'GENERIC.Deleted');
    }).catch(function (err) {
      UIMessageService.showBackendError('SERVER.INSTANCE.delete.error', err);
    });
  };

  $scope.loadDefaultTemplateElements = function () {
    TemplateElementService.getDefaultTemplateElementsSummary().then(function (response) {
      $scope.defaultElements = response.data;
    }).catch(function (err) {
      UIMessageService.showBackendError('SERVER.ELEMENTS.load.error', err);
    });
  };

  $scope.loadDefaultTemplates = function () {
    TemplateService.getDefaultTemplatesSummary().then(function (response) {
      $scope.defaultTemplates = response.data;
    }).catch(function (err) {
      UIMessageService.showBackendError('SERVER.TEMPLATES.load.error', err);
    });
  };

  $scope.loadDefaultTemplateInstances = function () {
    TemplateInstanceService.getDefaultTemplateInstancesSummary().then(function (response) {
      $scope.defaultInstances = response.data;
    }).catch(function (err) {
      UIMessageService.showBackendError('SERVER.INSTANCES.load.error', err);
    });
  };

  // ************************************************************************************

  // set Page Title variable when this controller is active
  $rootScope.pageTitle = 'Dashboard';

  // Create $scope arrays to load defaults elements/templates into
  $scope.defaultElements = [];
  $scope.defaultTemplates = [];
  $scope.defaultInstances = [];

  // Inject constants
  $scope.CONST = CONST;

  var currentRole = $rootScope.applicationRole;
  var currentApplicationMode = $rootScope.applicationMode;
  if ($routeParams.role) {
    if ($routeParams.role == 'as-creator') {
      currentRole = 'creator';
      currentApplicationMode = CONST.applicationMode.CREATOR;
    } else if ($routeParams.role == 'as-instantiator') {
      currentRole = 'instantiator';
      currentApplicationMode = CONST.applicationMode.RUNTIME;
    }
  }
  if (currentApplicationMode == CONST.applicationMode.DEFAULT) {
    $location.path(UrlService.getRoleSelector());
    return;
  }

  // Configure mini header
  var pageId = CONST.pageId.DASHBOARD;
  HeaderService.configure(pageId, currentApplicationMode);
  $rootScope.applicationRole = currentRole;


  // get default listings
  if (currentApplicationMode == CONST.applicationMode.CREATOR) {
    $scope.loadDefaultTemplateElements();
    $scope.loadDefaultTemplates();
  } else if (currentApplicationMode == CONST.applicationMode.RUNTIME) {
    $scope.loadDefaultTemplateInstances();
  }

};

DashboardController.$inject = ["$rootScope", "$scope", "$routeParams", "$location", "HeaderService", "UrlService",
  "TemplateService", "TemplateElementService", "TemplateInstanceService", "UIMessageService", "CONST"];
angularApp.controller('DashboardController', DashboardController);