'use strict';

angularApp.controller('RuntimeController', function ($rootScope, $scope, FormService, $routeParams, $location) {

	// set Page Title variable when this controller is active
	$rootScope.pageTitle = 'Runtime Template';

	// Giving $scope access to window.location for checking active state
	$scope.$location = $location;

	// Using form service to load list of existing elements to embed into new element
  FormService.formList().then(function(response) {
    $scope.formList = response;
  });

	// Create empty form object
	// Create empty currentPage array
	// Default to page 1 on load (array index 0)
	// Create empty pages Array
  $scope.form = {},
  $scope.currentPage = [],
  $scope.pageIndex = 0,
  $scope.pagesArray = [];

  // Get/read form with given id from $routeParams
  $scope.getForm = function() {
		FormService.form($routeParams.id).then(function(form) {
			// Assing returned form object from FormService to $scope.form
			$scope.form = form;
			// $scope.initializePagination kicks off paging with form.pages array
			$scope.initializePagination(form.pages);
		});
	};
	
	// Only loading form if given an ID in the $routeParams.id url path
	if ($routeParams.id) {
		$scope.getForm();
	}

	// Inject pages array from FormService into $scope variable
	// and render the first page of fields/elements by default
	$scope.initializePagination = function(pages) {
		$scope.pagesArray = pages;
		$scope.currentPage = $scope.pagesArray[$scope.pageIndex];
	};

	// Load the previous page of the form
	$scope.previousPage = function() {
		$scope.pageIndex --;
		$scope.currentPage = $scope.pagesArray[$scope.pageIndex];
	};

	// Load the next page of the form
	$scope.nextPage = function() {
		$scope.pageIndex ++;
		$scope.currentPage = $scope.pagesArray[$scope.pageIndex];
	};

	// Load an arbitrary page number attached to the index of it via runtime.html template
	$scope.setCurrentPage = function(page) {
		$scope.pageIndex = page;
		$scope.currentPage = $scope.pagesArray[$scope.pageIndex];
	};

	// Placeholder function to display rendered form with model input
	$scope.saveForm = function() {
		console.log($scope.form);
	};

	// Placeholder function to log form serialization output
	$scope.submitForm = function() {
		console.log($scope.$$childTail.model);
	};
});
