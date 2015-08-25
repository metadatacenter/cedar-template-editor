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
	// Create empty instance object
  $scope.form = {},
  $scope.currentPage = [],
  $scope.pageIndex = 0,
  $scope.pagesArray = [],
  $scope.instance = {};

	// Get/read form with given id from $routeParams
	$scope.getForm = function() {
		FormService.form($routeParams.template_id).then(function(form) {
			// Assign returned form object from FormService to $scope.form
			$scope.form = form;
			//delete $scope.form['@id'];
			// $scope.initializePagination kicks off paging with form.pages array
			$scope.initializePagination(form.pages);
		});
	};

	// Get/read submission with given submission_id from $routeParams
	$scope.getSubmission = function() {
		FormService.populatedTemplate($routeParams.id).then(function(response) {
			// $broadcast existing model data down to form-directive.js child $scope
			$scope.$broadcast('loadExistingModel', response)
			// Get and load the template document this instance will populate from (will be blank form template)
			FormService.form(response.template_id).then(function(form) {
				// Assign returned form object from FormService to $scope.form
				$scope.form = form;
				// $scope.initializePagination kicks off paging with form.pages array
				$scope.initializePagination(form.pages);
			});
		});
	};

	// Create new instance
	if (!angular.isUndefined($routeParams.template_id)) {
		$scope.getForm();
	}
	// Edit existing instance
	if (!angular.isUndefined($routeParams.id)) {
		// Loading empty form if given an ID in the $routeParams.id url path
		$scope.getSubmission();
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

	// Stores the data (populated template) into the database
	$scope.savePopulatedTemplate = function() {
		$scope.runtimeErrorMessages = [];
		$scope.runtimeSuccessMessages = [];
		// The child will be in charge of assigning a value (or updated values) to $scope.instance (in form-directive.js)
		$scope.submitForm();

		// Create instance
		if ($scope.instance['@id'] == undefined) {
			// '@id' and 'template_id' haven't been populated yet, create now
			$scope.instance['@id'] = $rootScope.idBasePath + $rootScope.generateGUID();
			$scope.instance['template_id'] = $routeParams.template_id;
			// Make create instance call
			FormService.savePopulatedTemplate($scope.instance).then(function(response) {
				$scope.runtimeSuccessMessages.push('The populated template has been saved.');
			}).catch(function(err) {
				$scope.runtimeErrorMessages.push('Problem saving the populated template.');
				console.log(err);
			});
		}
		// Update instance
		else {
			FormService.updatePopulatedTemplate($scope.instance['@id'], $scope.instance).then(function(response) {
				$scope.runtimeSuccessMessages.push('The populated template has been updated.');
			}).catch(function(err) {
				$scope.runtimeErrorMessages.push('Problem updating the populated template.');
				console.log(err);
			});
		}
	}

	// Placeholder function to display rendered form with model input
	//$scope.saveForm = function() {
	//	$scope.form['submission_id'] = $rootScope.generateGUID();
	//	console.log($scope.form);
	//};

	// Placeholder function to log form serialization output
	$scope.submitForm = function() {
		return $scope.$broadcast('submitForm');
	};

	// Initialize array for required fields left empty that fail required empty check
	$scope.emptyRequiredFields = [];
	// Event listener waiting for emptyRequiredField $emit from field-directive.js
	$scope.$on('emptyRequiredField', function (event, args) {
		if ($scope.emptyRequiredFields.indexOf(args) == -1) {
			$scope.emptyRequiredFields.push(args);
		}
	});
});
