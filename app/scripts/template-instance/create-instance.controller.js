'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.templateInstance.createInstanceController', [])
      .controller('CreateInstanceController', CreateInstanceController);

  CreateInstanceController.$inject = ["$rootScope", "$scope", "$routeParams", "$location", "HeaderService",
                                      "UrlService", "TemplateService", "TemplateInstanceService", "UIMessageService",
                                      "AuthorizedBackendService", "CONST"];

  function CreateInstanceController($rootScope, $scope, $routeParams, $location, HeaderService, UrlService,
                                    TemplateService, TemplateInstanceService, UIMessageService,
                                    AuthorizedBackendService, CONST) {

    $rootScope.showSearch = false;

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
    // Create empty instance object
    $scope.form = {};
    $scope.instance = {};

    // Get/read form with given id from $routeParams
    $scope.getForm = function () {
      AuthorizedBackendService.doCall(
          TemplateService.getTemplate($routeParams.templateId),
          function (response) {
            // Assign returned form object from FormService to $scope.form
            $scope.form = response.data;
            HeaderService.dataContainer.currentObjectScope = $scope.form;
            $rootScope.documentTitle = $scope.form._ui.title;
          },
          function (err) {
            UIMessageService.showBackendError('SERVER.TEMPLATE.load.error', err);
          }
      );
    };

    // Get/read submission with given submission_id from $routeParams
    $scope.getSubmission = function () {
      AuthorizedBackendService.doCall(
          TemplateInstanceService.getTemplateInstance($routeParams.id),
          function (instanceResponse) {
            $scope.instance = instanceResponse.data;
            $scope.isEditData = true;
            AuthorizedBackendService.doCall(
                TemplateService.getTemplate(instanceResponse.data._templateId),
                function (templateResponse) {
                  // Assign returned form object from FormService to $scope.form
                  $scope.form = templateResponse.data;

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
    if (!angular.isUndefined($routeParams.templateId)) {
      $scope.getForm();
    }
    // Edit existing instance
    if (!angular.isUndefined($routeParams.id)) {
      // Loading empty form if given an ID in the $routeParams.id url path
      $scope.getSubmission();
    }

    // Stores the data (populated template) into the databases
    $scope.savePopulatedTemplate = function () {
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
        $scope.instance._ui['templateTitle'] = $scope.form._ui.title + ' instance';
        $scope.instance._ui['templateDescription'] = $scope.form._ui.description;
        // Make create instance call
        var queryParams = $location.search();
        $scope.instance['parentId'] = queryParams.folderId;
        AuthorizedBackendService.doCall(
            TemplateInstanceService.saveTemplateInstance(queryParams.folderId, $scope.instance),
            function (response) {
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

    // Initialize value recommender service
    $rootScope.vrs.init($routeParams.templateId);

    // cancel the form and go back to folder
    $scope.cancelTemplate = function () {
      var params = $location.search();
      $location.url(UrlService.getFolderContents(params.folderId));
    };

    // This function watches for changes in the _ui.title field and autogenerates the schema title and description fields
    $scope.$watch('form._ui.title', function (v) {
      if (!angular.isUndefined($scope.form)) {
        $rootScope.documentTitle = $scope.form._ui.title;
      }
    });

  };

});
