'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.templateInstance.createInstanceController', [])
      .controller('CreateInstanceController', CreateInstanceController);

  CreateInstanceController.$inject = ["$translate", "$rootScope", "$scope", "$routeParams", "$location",
                                      "HeaderService", "TemplateService", "TemplateInstanceService",
                                      "UIMessageService", "AuthorizedBackendService", "CONST", "$timeout",
                                      "QueryParamUtilsService", "FrontendUrlService"];

  function CreateInstanceController($translate, $rootScope, $scope, $routeParams, $location,
                                    HeaderService, TemplateService, TemplateInstanceService,
                                    UIMessageService, AuthorizedBackendService, CONST, $timeout,
                                    QueryParamUtilsService, FrontendUrlService) {

    // Get/read template with given id from $routeParams
    $scope.getTemplate = function () {
      AuthorizedBackendService.doCall(
          TemplateService.getTemplate($routeParams.templateId),
          function (response) {
            // Assign returned form object from FormService to $scope.form
            $scope.form = response.data;
            $rootScope.jsonToSave = $scope.form;
            $rootScope.rootElement = $scope.form;
            HeaderService.dataContainer.currentObjectScope = $scope.form;
            $rootScope.documentTitle = $scope.form._ui.title;

            // Initialize value recommender service
            $rootScope.vrs.init($routeParams.templateId, $scope.form);

          },
          function (err) {
            UIMessageService.showBackendError('SERVER.TEMPLATE.load.error', err);
          }
      );
    };

    // Get/read instance with given id from $routeParams
    // Also read the template for it
    $scope.getInstance = function () {
      AuthorizedBackendService.doCall(
          TemplateInstanceService.getTemplateInstance($routeParams.id),
          function (instanceResponse) {
            $scope.instance = instanceResponse.data;
            $rootScope.instanceToSave = $scope.instance;
            $scope.isEditData = true;
            $rootScope.documentTitle = $scope.instance['schema:name'];
            AuthorizedBackendService.doCall(
                TemplateService.getTemplate(instanceResponse.data['schema:isBasedOn']),
                function (templateResponse) {
                  // Assign returned form object from FormService to $scope.form
                  $scope.form = templateResponse.data;
                  $rootScope.jsonToSave = $scope.form;
                  // Initialize value recommender service
                  var templateId = instanceResponse.data['schema:isBasedOn'];
                  $rootScope.vrs.init(templateId, $scope.form);
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

    // Stores the data (instance) into the databases
    $scope.saveInstance = function () {
      this.disableSaveButton();
      var owner = this;

      $scope.runtimeErrorMessages = [];
      $scope.runtimeSuccessMessages = [];


      // Create instance if there are no required field errors
      //if ($rootScope.isEmpty($scope.emptyRequiredFields) && $rootScope.isEmpty($scope.invalidFieldValues) && $scope.instance['@id'] == undefined) {
      if ($scope.instance['@id'] == undefined) {
        // '@id' and 'templateId' haven't been populated yet, create now
        // $scope.instance['@id'] = $rootScope.idBasePath + $rootScope.generateGUID();
        $scope.instance['schema:isBasedOn'] = $routeParams.templateId;
        // Create fields that will store information used by the UI
        $scope.instance['schema:name'] = $scope.form._ui.title + $translate.instant("GENERATEDVALUE.instanceTitle")
        $scope.instance['schema:description'] = $scope.form._ui.description + $translate.instant(
                "GENERATEDVALUE.instanceDescription");
        // Make create instance call
        AuthorizedBackendService.doCall(
            TemplateInstanceService.saveTemplateInstance(QueryParamUtilsService.getFolderId(), $scope.instance),
            function (response) {
              UIMessageService.flashSuccess('SERVER.INSTANCE.create.success', null, 'GENERIC.Created');
              // Reload page with element id
              var newId = response.data['@id'];
              $location.path(FrontendUrlService.getInstanceEdit(newId));
              $rootScope.$broadcast("form:clean");

              $timeout(function () {
                // don't show validation errors until after any redraws are done
                // thus, call this within a timeout
                $rootScope.$broadcast('submitForm');
              }, 1000);

            },
            function (err) {
              UIMessageService.showBackendError('SERVER.INSTANCE.create.error', err);
              owner.enableSaveButton();
            }
        );
      }
      // Update instance
      //else if ($rootScope.isEmpty($scope.emptyRequiredFields) && $rootScope.isEmpty($scope.invalidFieldValues)) {
      else {
        AuthorizedBackendService.doCall(
            TemplateInstanceService.updateTemplateInstance($scope.instance['@id'], $scope.instance),
            function (response) {
              UIMessageService.flashSuccess('SERVER.INSTANCE.update.success', null, 'GENERIC.Updated');
              owner.enableSaveButton();
              $rootScope.$broadcast("form:clean");
              $rootScope.$broadcast('submitForm');
            },
            function (err) {
              UIMessageService.showBackendError('SERVER.INSTANCE.update.error', err);
              owner.enableSaveButton();
            }
        );
      }
    };

    //*********** ENTRY POINT

    $rootScope.showSearch = false;

    // set Page Title variable when this controller is active
    $rootScope.pageTitle = 'Metadata Editor';

    // Giving $scope access to window.location for checking active state
    $scope.$location = $location;

    $scope.saveButtonDisabled = false;

    var pageId = CONST.pageId.RUNTIME;
    HeaderService.configure(pageId);

    // Create empty form object
    // Create empty instance object
    $scope.form = {};
    $scope.instance = {};
    $rootScope.instanceToSave = $scope.instance;

    // Create new instance
    if (!angular.isUndefined($routeParams.templateId)) {
      $scope.getTemplate();
    }

    // Edit existing instance
    if (!angular.isUndefined($routeParams.id)) {
      $scope.getInstance();
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

    // Initialize array for validation errors
    $scope.validationErrors = {};
    // Event listener waiting for validationError $emit from form-directive.js
    $scope.$on('validationError', function (event, args) {
      if (args[0] == 'add') {
        $scope.validationErrors[args[2]] = args[1];
      }
      if (args[0] == 'remove') {
        // remove all of them
        $scope.validationErrors = {};
        //delete $scope.validationErrors[args[2]];
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

    // cancel the form and go back to folder
    $scope.cancelTemplate = function () {
      $location.url(FrontendUrlService.getFolderContents(QueryParamUtilsService.getFolderId()));
    };

    $scope.enableSaveButton = function () {
      $timeout(function () {
        $scope.saveButtonDisabled = false;
      }, 1000);
    };

    $scope.disableSaveButton = function () {
      $scope.saveButtonDisabled = true;
    };

    $scope.isBiosampleTemplate = function () {
      return ($rootScope.documentTitle && $rootScope.documentTitle.toLowerCase().indexOf('biosample') > -1);
    };

    $scope.isAIRRTemplate = function () {
      return ($rootScope.documentTitle && $rootScope.documentTitle.toLowerCase().indexOf('airr template') > -1);
    };

    $scope.airrValidation = function () {
      $scope.$broadcast('airrValidation');
    };

    $scope.biosampleValidation = function () {
      $scope.$broadcast('biosampleValidation');
    };

    // open the airr submission modal
    $scope.airrSubmissionModalVisible = false;

    $scope.showAirrSubmissionModal = function () {
      $scope.airrSubmissionModalVisible = true;
      $scope.$broadcast('airrSubmissionModalVisible', [$scope.airrSubmissionModalVisible, $rootScope.instanceToSave]);
    };

  };

});
