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
  $scope.form.title = 'Fill out Template';

  // Get/read form with given id from $routeParams
  $scope.getForm = function() {
		FormService.form($routeParams.id).then(function(form) {
			// Assing returned form object from FormService to $scope.form
			$scope.form = form;
			// $scope.initializePagination kicks off paging with form.pages array
			$scope.initializePagination(form.pages);
		});
	};

	// Get/read submission with given submission_id from $routeParams
  $scope.getSubmission = function() {
		FormService.populatedTemplate($routeParams.submission_id).then(function(form) {
			// Assing returned form object from FormService to $scope.form
			$scope.form = form;
			// $scope.initializePagination kicks off paging with form.pages array
			$scope.initializePagination(form.pages);
		});
	};

	if ($routeParams.id && $routeParams.submission_id) {
		// Load the form with existing submission information via $routeParams.submission_id url parameter
		$scope.getSubmission();
	} else if ($routeParams.id && !$routeParams.submission_id) {
		// Loading empty form if given an ID in the $routeParams.id url path
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

	// Alerts
	$scope.resetAlerts = function() {
		$scope.alerts = [];
	}

	$scope.addAlert = function(type, msg) {
		$scope.alerts.push({type: type, msg: msg});
	};

	$scope.closeAlert = function(index) {
		$scope.alerts.splice(index, 1);
	};

	// Stores the data (populated template) into the database
	$scope.savePopulatedTemplate = function() {
		$scope.resetAlerts();
		// The child will be in charge of assigning a value to $scope.model (see form-directive.js)
		$scope.submitForm();
		// Save populated template
		if ($routeParams.submission_id == undefined) {
			// TODO: The following lines store the template filled out with data. We should save the data ($scope.model) separated from the template
			// Create a new property (template_id) to store the id of the template. The _id property will store the populated template id
			$scope.form.template_id = $scope.form._id;
			delete $scope.form._id;
			FormService.savePopulatedTemplate($scope.form).then(function(response) {
				//FormService.savePopulatedTemplate($scope.model).then(function(response) {
				$scope.addAlert('success', 'The populated template has been saved.');
			}).catch(function(err) {
				$scope.addAlert('danger', "Problem saving the populated template.");
				console.log(err);
			});
		}
		// Update populated template
		else {
			var id = $scope.form._id.$oid;
			delete $scope.form._id;
			FormService.updatePopulatedTemplate(id, $scope.form).then(function(response) {
				$scope.addAlert('success', 'The populated template has been updated.');
			}).catch(function(err) {
				$scope.addAlert('danger', "Problem updating the populated template.");
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
		$scope.$broadcast('submitForm');
	};

	// Initialize array for fields left empty that fail validation
	$scope.failedValidation = [];
	// Event listener waiting for validationVail $emit from field-directive.js
	$scope.$on('validationFail', function (event, args) {
		if ($scope.failedValidation.indexOf(args) == -1) {
			$scope.failedValidation.push(args);
		}
	});
});
