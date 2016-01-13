'use strict';

var DashboardController = function ($rootScope, $scope, $routeParams, $location, HeaderService, UrlService, TemplateService, TemplateElementService, TemplateInstanceService, CONST) {

  // Remove template
  $scope.removeTemplate = function (id) {
    TemplateService.removeTemplate(id).then(function (response) {
      // Reload templates
      $scope.loadDefaultTemplates();
    }).catch(function (err) {
      console.log(err);
    });
  };

  // Remove element
  $scope.removeElement = function (id) {
    TemplateElementService.removeTemplateElement(id).then(function (response) {
      // Reload elements
      $scope.loadDefaultTemplateElements();
    }).catch(function (err) {
      console.log(err);
    });
  };

  // Remove populated template
  $scope.removeInstance = function (id) {
    TemplateInstanceService.removeTemplateInstance(id).then(function (response) {
      // Reload instances
      $scope.loadDefaultTemplateInstances();
    }).catch(function (err) {
      console.log(err);
    });
  };

  $scope.loadDefaultTemplateElements = function () {
    TemplateElementService.getDefaultTemplateElementsSummary().then(function (data) {
      $scope.defaultElements = data;
    });
  };

  $scope.loadDefaultTemplates = function () {
    TemplateService.getDefaultTemplatesSummary().then(function (data) {
      $scope.defaultTemplates = data;
    });
  };

  $scope.loadDefaultTemplateInstances = function () {
    TemplateInstanceService.getDefaultTemplateInstancesSummary().then(function (data) {
      $scope.defaultInstances = data;
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
  }  else if (currentApplicationMode == CONST.applicationMode.RUNTIME) {
    $scope.loadDefaultTemplateInstances();
  }

};

DashboardController.$inject = ["$rootScope", "$scope", "$routeParams", "$location", "HeaderService", "UrlService", "TemplateService", "TemplateElementService", "TemplateInstanceService", "CONST"];
angularApp.controller('DashboardController', DashboardController);