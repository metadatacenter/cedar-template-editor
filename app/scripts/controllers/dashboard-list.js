'use strict';

var DashboardListController = function ($rootScope, $scope, $routeParams, $location, FormService, HeaderService, UrlService, CONST) {

  // Load all items depending on $routeParams.type parameter supplied
  $scope.listElements = function () {
    // set Page Title variable when this is active
    $rootScope.pageTitle = 'Elements Listing';
    $scope.sectionTitle = 'Template Elements';
    $scope.createLink = '/elements/create';
    // Retrieve list of elements using FormService
    FormService.elementList().then(function (response) {
      // Sort by the 'favorites' boolean parameter
      $scope.itemList = $rootScope.sortBoolean(response, 'favorite');
    });
  };

  $scope.listTemplates = function () {
    // set Page Title variable when this is active
    $rootScope.pageTitle = 'Templates Listing';
    $scope.sectionTitle = 'Metadata Templates';
    $scope.createLink = '/templates/create';
    // Retrieve list of form templates using FormService
    FormService.formList().then(function (response) {
      // Sort by the 'favorites' boolean parameter
      $scope.itemList = $rootScope.sortBoolean(response, 'favorite');
    });
  };

  $scope.listSubmissions = function () {
    // set Page Title variable when this is active
    $rootScope.pageTitle = 'Populated Templates';
    $scope.sectionTitle = 'Populated Templates';
    $scope.createLink = '/instances/create';
    // Retrieve list of form submissions using FormService
    FormService.populatedTemplatesList().then(function (response) {
      // Return list of submissions from FormService
      $scope.submissions = response;
    });
  };

  // Remove template
  $scope.removeTemplate = function (id) {
    FormService.removeTemplate(id).then(function (response) {
      // Reload templates
      $scope.listTemplates();
    }).catch(function (err) {
      console.log(err);
    });
  }

  // Remove element
  $scope.removeElement = function (id) {
    FormService.removeElement(id).then(function (response) {
      // Reload elements
      $scope.listElements();
    }).catch(function (err) {
      console.log(err);
    });
  }

  // Remove populated template
  $scope.removeInstance = function (id) {
    FormService.removePopulatedTemplate(id).then(function (response) {
      // Reload populated templates
      $scope.listSubmissions();
    }).catch(function (err) {
      console.log(err);
    });
  }

  // ************************************************************************************

  $scope.itemList = [];
  // Setting type via $routeParams ('elements', or 'templates')
  $scope.itemType = $routeParams.type;
  // Submissions have slightly different use cases then elements, or templates, need a different $scope
  $scope.submissions = [];

  // Inject constants
  $scope.CONST = CONST;

  // Configure mini header
  var pageId = CONST.pageId.DASHBOARDLIST;
  var currentApplicationMode = $rootScope.applicationMode;
  if (currentApplicationMode == CONST.applicationMode.DEFAULT) {
    $location.path(UrlService.getRoleSelector());
    return;
  }
  HeaderService.configure(pageId, currentApplicationMode);


  switch ($scope.itemType) {
    case 'elements':
      $scope.listElements();
      break;
    case 'templates':
      $scope.listTemplates();
      break;
    case 'submissions':
      $scope.listSubmissions();
      break;
  }

};


DashboardListController.$inject = ["$rootScope", "$scope", "$routeParams", "$location", "FormService", "HeaderService", "UrlService", "CONST"];
angularApp.controller('DashboardListController', DashboardListController);