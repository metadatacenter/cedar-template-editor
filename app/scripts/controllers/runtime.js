'use strict';

angularApp.controller('RuntimeController', function ($rootScope, $scope, FormService, $routeParams, $location, $http) {

	// set Page Title variable when this controller is active
	$rootScope.pageTitle = 'Runtime Template';

	// Giving $scope access to window.location for checking active state
	$scope.$location = $location;

  $scope.form = {};

  // Get/read form with given id from $routeParams
  $scope.getForm = function() {
		FormService.form($routeParams.id).then(function(form) {
			$scope.form = form;
		});
	};
	
	if ($routeParams.id) {
		$scope.getForm();
	}

	// Function to load existing templates from database
	$scope.loadTemplates = function() {
		$http.get('http://localhost:9000/templates').
			success(function(data) {
				$scope.templates = data;
			}).
			error(function(data, status, headers, config) {
				// Do something
			});
	}

	// Load templates
	$scope.loadTemplates();

});
