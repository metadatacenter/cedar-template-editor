'use strict';

angularApp.controller('DashboardListController', function ($rootScope, $scope, FormService, $routeParams) {

  $scope.itemList = [];
  // Setting type via $routeParams ('elements', or 'templates')
  $scope.itemType = $routeParams.type;
  // Submissions have slightly different use cases then elements, or templates, need a different $scope
  $scope.submissions = [];

	// Load all items depending on $routeParams.type parameter supplied
  $scope.listElements = function() {
    // set Page Title variable when this is active
    $rootScope.pageTitle = 'Elements Listing';
    $scope.sectionTitle = 'Template Elements';
    $scope.createLink = '/elements/create';
    // Retrieve list of elements using FormService
    FormService.elementList().then(function(response) {
      // Sort by the 'favorites' boolean parameter
      $scope.itemList = $rootScope.sortBoolean(response, 'favorite');
    });
  };

  $scope.listTemplates = function() {
    // set Page Title variable when this is active
    $rootScope.pageTitle = 'Templates Listing';
    $scope.sectionTitle = 'Metadata Templates';
    $scope.createLink = '/templates/create';
    // Retrieve list of form templates using FormService
    FormService.formList().then(function(response) {
      // Sort by the 'favorites' boolean parameter
      $scope.itemList = $rootScope.sortBoolean(response, 'favorite');
    });
  };

  $scope.listSubmissions = function() {
    // set Page Title variable when this is active
    $rootScope.pageTitle = 'Populated Templates';
    $scope.sectionTitle = 'Populated Templates';
    $scope.createLink = '/templates/runtime';
    // Retrieve list of form submissions using FormService
    FormService.populatedTemplatesList().then(function(response) {
      // Return list of submissions from FormService
      $scope.submissions = response;
    });
  };

  switch($routeParams.type) {
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

  // Remove template, element or populated template
  $scope.remove = function(id) {
    switch ($routeParams.type) {
      case 'elements':
        FormService.removeElement(id).then(function(response) {
          $scope.listElements();
        }).catch(function(err) {
          console.log(err);
        });
        break;
      case 'templates':
        FormService.removeTemplate(id).then(function(response) {
          // Reload templates
          $scope.listTemplates();
        }).catch(function(err) {
          console.log(err);
        });
        break;
      case 'submissions':
        FormService.removePopulatedTemplate(id).then(function(response) {
          // Reload populated templates
          $scope.listSubmissions();
        }).catch(function(err) {
          console.log(err);
        });
        break;
    }
  }
});
