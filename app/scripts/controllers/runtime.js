'use strict';

var RuntimeController = function($rootScope, $scope, FormService, $routeParams, $location, HeaderService, HEADER_MINI) {
	// set Page Title variable when this controller is active
	$rootScope.pageTitle = 'Runtime Template';

	// Giving $scope access to window.location for checking active state
	$scope.$location = $location;

	// Using form service to load list of existing elements to embed into new element
  FormService.formList().then(function(response) {
    $scope.formList = response;
  });
	// Configure mini header
	HeaderService.configure("RUNTIME", "runtime");


	// Create empty form object
	// Create empty currentPage array
	// Default to page 1 on load (array index 0)
	// Create empty pages Array
	// Create empty instance object
  $scope.form = {},
  $scope.currentPage = [],
  $scope.pageIndex = 0,
  $scope.pagesArray = [],
  $scope.instance = {
  	//'@context': {},
  	//'@type': {}
  };

	// Get/read form with given id from $routeParams
	$scope.getForm = function() {
		FormService.form($routeParams.template_id).then(function(form) {
			// Assign returned form object from FormService to $scope.form
			$scope.form = form;
			// $scope.initializePagination kicks off paging with form.pages array
			$scope.initializePagination(form.pages);
			HeaderService.dataContainer.currentObjectScope = $scope.form;
		});
	};

	// Get/read submission with given submission_id from $routeParams
	$scope.getSubmission = function() {
		FormService.populatedTemplate($routeParams.id).then(function(response) {
			// FormService.populatedTemplate returns an existing instance, assign it to our local $scope.instance
			$scope.instance = response;
			//$scope.$broadcast('loadExistingModel', response);
			// Get and load the template document this instance will populate from (will be blank form template)
			FormService.form(response.template_id).then(function(form) {
				// Assign returned form object from FormService to $scope.form
				$scope.form = form;
				// $scope.initializePagination kicks off paging with form.pages array
				$scope.initializePagination(form.pages);
			});
		}).catch(function(err) {
			$scope.runtimeErrorMessages.push('Problem retrieving the populated template instance.');
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
		// Broadcast submitForm event to form-directive.js which will assign the form $scope.model to $scope.instance of this controller
		$scope.$broadcast('submitForm');
		// Create instance if there are no required field errors
		if ($rootScope.isEmpty($scope.emptyRequiredFields) && $scope.instance['@id'] == undefined) {
			// '@id' and 'template_id' haven't been populated yet, create now
			$scope.instance['@id'] = $rootScope.idBasePath + $rootScope.generateGUID();
			$scope.instance['template_id'] = $routeParams.template_id;
			// Create info field that will store information used by the UI
			$scope.instance.info = {};
			$scope.instance.info['template_title'] = $scope.form.properties.info.title + ' instance';
			$scope.instance.info['template_description'] = $scope.form.properties.info.description;
			$scope.instance.info['creation_date'] = new Date();
			// Make create instance call
			FormService.savePopulatedTemplate($scope.instance).then(function(response) {
				$scope.runtimeSuccessMessages.push('The populated template has been saved.');
			}).catch(function(err) {
				$scope.runtimeErrorMessages.push('Problem saving the populated template.');
				console.log(err);
			});
		}
		// Update instance
		else if ($rootScope.isEmpty($scope.emptyRequiredFields)) {
			FormService.updatePopulatedTemplate($scope.instance['@id'], $scope.instance).then(function(response) {
				$scope.runtimeSuccessMessages.push('The populated template has been updated.');
			}).catch(function(err) {
				$scope.runtimeErrorMessages.push('Problem updating the populated template.');
				console.log(err);
			});
		}
	}

	// Initialize array for required fields left empty that fail required empty check
	$scope.emptyRequiredFields = {};
	// Event listener waiting for emptyRequiredField $emit from field-directive.js
	$scope.$on('emptyRequiredField', function (event, args) {
		if (args[0] == 'add') {
			$scope.emptyRequiredFields[args[2]] = args[1];
		}
		if (args[0] == 'remove') {
			delete $scope.emptyRequiredFields[args[2]];
		}
	});
};

RuntimeController.$inject = ["$rootScope", "$scope", "FormService", "$routeParams", "$location", "HeaderService", "HEADER_MINI"];
angularApp.controller('RuntimeController', RuntimeController);