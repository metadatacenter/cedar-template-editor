'use strict';

angularApp.controller('DashboardController', function ($rootScope, $scope, $http) {

	// set Page Title variable when this controller is active
	$rootScope.pageTitle = 'Dashboard';

	// Create $scope arrays to load defaults elements/templates into
  $scope.elementDefaults = [];
  $scope.templateDefaults = [];

  // Define function to make async request to location of json objects and assign proper
  // scope array with returned list of data
  $scope.getDefaults = function(fileName, scopeArray) {
    $http.get('/static-data/dashboard/' + fileName + '.json').then(function(response) {
      $scope[scopeArray] = response.data;
    }).catch(function(err) {
      console.log(err);
    });
  };
  // Call getDefaults with parameters
  $scope.getDefaults('metadata-templates', 'templateDefaults');
  $scope.getDefaults('template-elements', 'elementDefaults');
});
