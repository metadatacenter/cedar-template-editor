'use strict';

var CreateInstanceController = function ($rootScope, $scope, $routeParams, $location, HeaderService, UrlService, TemplateService, TemplateInstanceService, UIMessageService, CONST) {
  // set Page Title variable when this controller is active
	$rootScope.pageTitle = 'Metadata Editor';

	// Giving $scope access to window.location for checking active state
	$scope.$location = $location;

  TemplateService.getAllTemplatesSummary().then(function (response) {
    $scope.templateList = response.data;
  }).catch(function (err) {
    UIMessageService.showBackendError('SERVER.TEMPLATES.load.error', err);
  });

	// Configure mini header
  var pageId = CONST.pageId.RUNTIME;
  var applicationMode = CONST.applicationMode.RUNTIME;
	HeaderService.configure(pageId, applicationMode);
  $rootScope.applicationRole = 'instantiator';


	// Create empty form object
	// Create empty instance object
  $scope.form = {},
  $scope.instance = {
  	//'@context': {},
  	//'@type': {}
  };

	// Get/read form with given id from $routeParams
	$scope.getForm = function() {
		TemplateService.getTemplate($routeParams.templateId).then(function(response) {
			// Assign returned form object from FormService to $scope.form
			$scope.form = response.data;
			HeaderService.dataContainer.currentObjectScope = $scope.form;
		});
	};

	// Get/read submission with given submission_id from $routeParams
	$scope.getSubmission = function() {
		TemplateInstanceService.getTemplateInstance($routeParams.id).then(function(response) {
			// FormService.populatedTemplate returns an existing instance, assign it to our local $scope.instance
			$scope.instance = response.data;
      $scope.isEditData = true;

			// Get and load the template document this instance will populate from (will be blank form template)
			TemplateService.getTemplate($scope.instance._templateId).then(function(rsp) {
				// Assign returned form object from FormService to $scope.form
				$scope.form = rsp.data;
			});
		}).catch(function(err) {
			$scope.runtimeErrorMessages.push('Problem retrieving the populated template instance.');
		});
	};

	// Create new instance
	if (!angular.isUndefined($routeParams.templateId)) {
		$scope.getForm();
	}
	// Edit existing instance
	if (!angular.isUndefined($routeParams.id)) {
		// Loading empty form if given an ID in the $routeParams.id url path
		$scope.getSubmission();
	}

	// Stores the data (populated template) into the database
	$scope.savePopulatedTemplate = function() {
		$scope.runtimeErrorMessages = [];
		$scope.runtimeSuccessMessages = [];
		// Broadcast submitForm event to form-directive.js which will assign the form $scope.model to $scope.instance of this controller
		$scope.$broadcast('submitForm');
		// Create instance if there are no required field errors
		if ($rootScope.isEmpty($scope.emptyRequiredFields) && $rootScope.isEmpty($scope.invalidFieldValues) && $scope.instance['@id'] == undefined) {
			// '@id' and 'templateId' haven't been populated yet, create now
			// $scope.instance['@id'] = $rootScope.idBasePath + $rootScope.generateGUID();
			$scope.instance['_templateId'] = $routeParams.templateId;
			// Create _ui field that will store information used by the UI
			$scope.instance._ui = {};
			$scope.instance._ui['templateTitle'] = $scope.form.properties._ui.title + ' instance';
			$scope.instance._ui['templateDescription'] = $scope.form.properties._ui.description;
			$scope.instance._ui['creationDate'] = new Date();
			// Make create instance call
			TemplateInstanceService.saveTemplateInstance($scope.instance).then(function(response) {
				UIMessageService.flashSuccess('SERVER.INSTANCE.create.success', null, 'GENERIC.Created');
        var newId = response.data['@id'];
       $location.path(UrlService.getInstanceEdit(newId));
			}).catch(function(err) {
				UIMessageService.showBackendError('SERVER.INSTANCE.create.error', err);
			});
		}
		// Update instance
		else if ($rootScope.isEmpty($scope.emptyRequiredFields) && $rootScope.isEmpty($scope.invalidFieldValues)) {
			TemplateInstanceService.updateTemplateInstance($scope.instance['@id'], $scope.instance).then(function(response) {
				UIMessageService.flashSuccess('SERVER.INSTANCE.update.success', null, 'GENERIC.Updated');
			}).catch(function(err) {
				UIMessageService.showBackendError('SERVER.INSTANCE.update.error', err);
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

	// Initialize array for fields that are not conform to valueConstraints
	$scope.invalidFieldValues = {};
	// Event listener waiting for emptyRequiredField $emit from field-directive.js
	$scope.$on('invalidFieldValues', function (event, args) {
		if (args[0] == 'add') {
			$scope.invalidFieldValues[args[2]] = args[1];
		}
		if (args[0] == 'remove') {
			delete $scope.invalidFieldValues[args[2]];
		}
	});
};

CreateInstanceController.$inject = ["$rootScope", "$scope", "$routeParams", "$location", "HeaderService", "UrlService", "TemplateService", "TemplateInstanceService", "UIMessageService", "CONST"];
angularApp.controller('CreateInstanceController', CreateInstanceController);
