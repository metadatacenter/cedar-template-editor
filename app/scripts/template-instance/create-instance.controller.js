'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.templateInstance.createInstanceController', [])
      .controller('CreateInstanceController', CreateInstanceController);

  CreateInstanceController.$inject = ["$translate", "$rootScope", "$scope", "$routeParams", "$location",
                                      "HeaderService", "UrlService", "TemplateService", "TemplateInstanceService",
                                      "UIMessageService", "AuthorizedBackendService", "StagingService", "CONST"];

  function CreateInstanceController($translate, $rootScope, $scope, $routeParams, $location, HeaderService, UrlService,
                                    TemplateService, TemplateInstanceService, UIMessageService,
                                    AuthorizedBackendService, StagingService, CONST) {

    // Get/read template with given id from $routeParams
    $scope.getTemplate = function () {
      AuthorizedBackendService.doCall(
          TemplateService.getTemplate($routeParams.templateId),
          function (response) {
            // Assign returned form object from FormService to $scope.form
            $scope.form = response.data;
            HeaderService.dataContainer.currentObjectScope = $scope.form;
            $rootScope.documentTitle = $scope.form._ui.title;
            StagingService.setModelObject($scope.form);
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
            $scope.isEditData = true;
            $rootScope.documentTitle = $scope.instance._ui.title;
            StagingService.setDataObject($scope.instance);
            AuthorizedBackendService.doCall(
                TemplateService.getTemplate(instanceResponse.data._templateId),
                function (templateResponse) {
                  // Assign returned form object from FormService to $scope.form
                  $scope.form = templateResponse.data;
                  StagingService.setModelObject($scope.form);
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
        $scope.instance._ui['title'] = $translate.instant("GENERATEDVALUE.instanceTitle",
            {title: $scope.form._ui.title});
        $scope.instance._ui['description'] = $translate.instant("GENERATEDVALUE.instanceDescription",
            {description: $scope.form._ui.description});
        // Make create instance call
        var queryParams = $location.search();
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
    };

    // cancel the form and go back to folder
    $scope.cancelTemplate = function () {
      var params = $location.search();
      $location.url(UrlService.getFolderContents(params.folderId));
    };

    //*********** EVENT HANDLERS

    // Event listener waiting for emptyRequiredField $emit from field-directive.js
    $scope.$on('invalidFieldValues', function (event, args) {
      if (args[0] == 'add') {
        $scope.invalidFieldValues[args[2]] = args[1];
      }
      if (args[0] == 'remove') {
        delete $scope.invalidFieldValues[args[2]];
      }
    });

    // Event listener waiting for emptyRequiredField $emit from field-directive.js
    $scope.$on('emptyRequiredField', function (event, args) {
      if (args[0] == 'add') {
        $scope.emptyRequiredFields[args[2]] = args[1];
      }
      if (args[0] == 'remove') {
        delete $scope.emptyRequiredFields[args[2]];
      }
    });

    //*********** ENTRY POINT

    $rootScope.showSearch = false;

    $rootScope.pageTitle = 'Metadata Editor';

    // Giving $scope access to window.location for checking active state
    $scope.$location = $location;

    var pageId = CONST.pageId.RUNTIME;
    HeaderService.configure(pageId);

    // Create empty form object
    // Create empty instance object
    $scope.form = {};
    $scope.instance = {};
    StagingService.setModelObject($scope.form);
    StagingService.setDataObject($scope.instance);

    // Initialize array for required fields left empty that fail required empty check
    $scope.emptyRequiredFields = {};

    // Initialize array for fields that are not conform to valueConstraints
    $scope.invalidFieldValues = {};

    // Initialize value recommender service
    $rootScope.vrs.init($routeParams.templateId);


    // Create new instance
    if (!angular.isUndefined($routeParams.templateId)) {
      $scope.getTemplate();
    }

    // Edit existing instance
    if (!angular.isUndefined($routeParams.id)) {
      $scope.getInstance();
    }


  };

});
