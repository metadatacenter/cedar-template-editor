'use strict';

function sortByKey(array, key) {
  return array.sort(function(a, b) {
      var x = a[key]; var y = b[key];
      return ((x < y) ? -1 : ((x > y) ? 1 : 0));
  });
}

function sortBoolean(array, bool) {
  return array.sort(function(a, b) {
    var x = a[bool],
        y = b[bool];
    return ((x == y) ? -1 : ((x == true) ? -1 : 1));
  });
}

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
      // Sort by the 'favorites' boolean parameter
      var sortFavorites = sortBoolean(response.data, 'favorite');
      // Slicing the top 3 out into new array and returning to the template
      $scope[scopeArray] = sortFavorites.slice(0,3);
    }).catch(function(err) {
      console.log(err);
    });
  };
  // Call getDefaults with parameters
  $scope.getDefaults('metadata-templates', 'templateDefaults');
  $scope.getDefaults('template-elements', 'elementDefaults');
});
