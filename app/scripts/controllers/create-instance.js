'use strict';

var CreateInstanceController = function ($rootScope, $scope, $routeParams, $location, HeaderService, UrlService,
                                         TemplateService, TemplateInstanceService, UIMessageService,
                                         AuthorizedBackendService, CONST) {
  // set Page Title variable when this controller is active
  $rootScope.pageTitle = 'Metadata Editor';

  // Giving $scope access to window.location for checking active state
  $scope.$location = $location;

  AuthorizedBackendService.doCall(
      TemplateService.getAllTemplatesSummary(),
      function (response) {
        $scope.templateList = response.data;
      },
      function (err) {
        UIMessageService.showBackendError('SERVER.TEMPLATES.load.error', err);
      }
  );

  // Configure mini header
  var pageId = CONST.pageId.RUNTIME;
  var applicationMode = CONST.applicationMode.RUNTIME;
  HeaderService.configure(pageId, applicationMode);
  $rootScope.applicationRole = 'instantiator';


  // Create empty form object
  // Create empty currentPage array
  // Default to page 1 on load (array index 0)
  // Create empty pages Array
  // Create empty instance object
  $scope.template = {},
      $scope.currentPage = [],
      $scope.pageIndex = 0,
      $scope.pagesArray = [],
      $scope.instance = {
        //'@context': {},
        //'@type': {}
      };

  // Get/read form with given id from $routeParams
  $scope.getForm = function () {
    AuthorizedBackendService.doCall(
        TemplateService.getTemplate($routeParams.template_id),
        function (response) {
          // Assign returned form object from FormService to $scope.form
          $scope.template = response.data;
          // $scope.initializePagination kicks off paging with form.pages array
          $scope.initializePagination(response.data._ui.pages);
          HeaderService.dataContainer.currentObjectScope = $scope.template;
        },
        function (err) {
          UIMessageService.showBackendError('SERVER.TEMPLATE.load.error', err);
        }
    );
  };

  // Get/read submission with given submission_id from $routeParams
  $scope.getInstance = function () {
    AuthorizedBackendService.doCall(
        TemplateInstanceService.getTemplateInstance($routeParams.id),
        function (instanceResponse) {
          // FormService.populatedTemplate returns an existing instance, assign it to our local $scope.instance
          $scope.instance = instanceResponse.data;
          //$scope.$broadcast('loadExistingModel', response);
          // Get and load the template document this instance will populate from (will be blank form template)
          AuthorizedBackendService.doCall(
              TemplateService.getTemplate(instanceResponse.data._templateId),
              function (templateResponse) {
                // Assign returned form object from FormService to $scope.form
                $scope.template = templateResponse.data;
                // $scope.initializePagination kicks off paging with form.pages array
                $scope.initializePagination(templateResponse.data._ui.pages);
              },
              function (templateErr) {
                UIMessageService.showBackendError('SERVER.TEMPLATE.load-for-instance.error', templateErr);
              }
          );
        },
        function (instanceErr) {
          UIMessageService.showBackendError('SERVER.INSTANCE.load.error', instanceErr);
        }
    );
  };

  // Create new instance
  if (!angular.isUndefined($routeParams.template_id)) {
    $scope.getForm();
  }
  // Edit existing instance
  if (!angular.isUndefined($routeParams.id)) {
    // Loading empty form if given an ID in the $routeParams.id url path
    $scope.getInstance();
  }

  // Inject pages array from FormService into $scope variable
  // and render the first page of fields/elements by default
  $scope.initializePagination = function (pages) {
    $scope.pagesArray = pages;
    $scope.currentPage = $scope.pagesArray[$scope.pageIndex];
  };

  // Load the previous page of the form
  $scope.previousPage = function () {
    $scope.pageIndex--;
    $scope.currentPage = $scope.pagesArray[$scope.pageIndex];
  };

  // Load the next page of the form
  $scope.nextPage = function () {
    $scope.pageIndex++;
    $scope.currentPage = $scope.pagesArray[$scope.pageIndex];
  };

  // Load an arbitrary page number attached to the index of it via runtime.html template
  $scope.setCurrentPage = function (page) {
    $scope.pageIndex = page;
    $scope.currentPage = $scope.pagesArray[$scope.pageIndex];
  };

  // Stores the data (populated template) into the database
  $scope.savePopulatedTemplate = function () {
    $scope.runtimeErrorMessages = [];
    $scope.runtimeSuccessMessages = [];
    // Broadcast submitForm event to form-directive.js which will assign the form $scope.model to $scope.instance of this controller
    $scope.$broadcast('submitForm');
    // Create instance if there are no required field errors
    if ($rootScope.isEmpty($scope.emptyRequiredFields) && $rootScope.isEmpty(
            $scope.invalidFieldValues) && $scope.instance['@id'] == undefined) {
      // '@id' and 'template_id' haven't been populated yet, create now
      $scope.instance['_templateId'] = $routeParams.template_id;
      // Create info field that will store information used by the UI
      $scope.instance._ui = {};
      $scope.instance._ui['templateTitle'] = $scope.template.properties._ui.title + ' instance';
      $scope.instance._ui['templateDescription'] = $scope.template.properties._ui.description;
      $scope.instance._ui['creationDate'] = new Date();
      // Make create instance call
      AuthorizedBackendService.doCall(
          TemplateInstanceService.saveTemplateInstance($scope.instance),
          function (response) {
            // confirm message
            UIMessageService.flashSuccess('SERVER.INSTANCE.create.success', null, 'GENERIC.Created');
            // Reload page with element id
            var newId = response.data['@id'];
            $location.path(UrlService.getInstanceEdit(newId));
          },
          function (err) {
            UIMessageService.showBackendError('SERVER.INSTANCE.create.error', err);
          }
      );
    }
    // Update instance
    else if ($rootScope.isEmpty($scope.emptyRequiredFields) && $rootScope.isEmpty($scope.invalidFieldValues)) {
      AuthorizedBackendService.doCall(
          TemplateInstanceService.updateTemplateInstance($scope.instance['@id'], $scope.instance),
          function (response) {
            UIMessageService.flashSuccess('SERVER.INSTANCE.update.success', null, 'GENERIC.Updated');
          },
          function (err) {
            UIMessageService.showBackendError('SERVER.INSTANCE.update.error', err);
          }
      );
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

  // Initialize array for fields that are not conform to value_constraint
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

CreateInstanceController.$inject = ["$rootScope", "$scope", "$routeParams", "$location", "HeaderService", "UrlService",
                                    "TemplateService", "TemplateInstanceService", "UIMessageService",
                                    "AuthorizedBackendService", "CONST"];
angularApp.controller('CreateInstanceController', CreateInstanceController);