'use strict';

angularApp.controller('DashboardListController', function ($rootScope, $scope, FormService, $routeParams) {

  $scope.itemList = [];
  // Setting type via $routeParams ('elements', or 'templates')
  $scope.itemType = $routeParams.type;

	// Load all items depending on $routeParams.type parameter supplied
  $scope.listElements = function() {
    // set Page Title variable when this is active
    $rootScope.pageTitle = 'Elements Listing';
    $scope.sectionTitle = 'Template Elements';

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

    // Retrieve list of form templates using FormService
    FormService.formList().then(function(response) {
      // Sort by the 'favorites' boolean parameter
      $scope.itemList = $rootScope.sortBoolean(response, 'favorite');
    });
  };

  $scope.listSubmissions = function() {
    console.log('list all submissions');
    // set Page Title variable when this is active
    $rootScope.pageTitle = 'Submissions Listing';
    $scope.sectionTitle = 'Data Submission';
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
});
