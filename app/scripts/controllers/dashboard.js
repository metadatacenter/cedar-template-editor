'use strict';

angularApp.controller('DashboardController', function ($rootScope, $scope, FormService) {

	// set Page Title variable when this controller is active
	$rootScope.pageTitle = 'Dashboard';

	// Create $scope arrays to load defaults elements/templates into
  $scope.elementDefaults = [];
  $scope.templateDefaults = [];
  $scope.submissionDefaults = [];

  // Define function to make async request to location of json objects and assign proper
  // scope array with returned list of data
  $scope.getDefaults = function(type, scopeArray) {
    FormService[type]().then(function(response) {
      // Sort by the 'favorites' boolean parameter
      var sortFavorites = $rootScope.sortBoolean(response, 'favorite');
      // Slicing the top 3 out into new array and returning to the template
      $scope[scopeArray] = sortFavorites.slice(0,3);
    }).catch(function(err) {
      console.log(err);
    });
  };
  // Call getDefaults with parameters
  $scope.getDefaults('formList', 'templateDefaults');
  $scope.getDefaults('elementList', 'elementDefaults');

  // Submissions have a bit different requirements so they get their own function
  $scope.getSubmissions = function() {
    FormService.populatedTemplatesList().then(function(response) {
      $scope.submissionDefaults = response;
    }).catch(function(err) {
      console.log(err);
    });
  };
  $scope.getSubmissions();
});
