'use strict';

define([
  'angular', 'flow'
], function (angular, flow) {
  angular.module('cedar.templateEditor.templateInstance.createInstanceController', [])
      .controller('CreateInstanceController', CreateInstanceController);

  CreateInstanceController.$inject = ["$translate", "$rootScope", "$scope", "$routeParams", "$location",
                                      "HeaderService", "TemplateService", "resourceService", "TemplateInstanceService",
                                      "UIMessageService", "AuthorizedBackendService", "CONST", "$timeout",
                                      "QueryParamUtilsService", "FrontendUrlService", "ValidationService",
                                      "ValueRecommenderService", "UIUtilService", "DataManipulationService",
                                      "CedarUser"];

  function CreateInstanceController($translate, $rootScope, $scope, $routeParams, $location,
                                    HeaderService, TemplateService, resourceService, TemplateInstanceService,
                                    UIMessageService, AuthorizedBackendService, CONST, $timeout,
                                    QueryParamUtilsService, FrontendUrlService, ValidationService,
                                    ValueRecommenderService, UIUtilService, DataManipulationService, CedarUser) {

    // Get/read template with given id from $routeParams
    $scope.getTemplate = function () {
      AuthorizedBackendService.doCall(
          TemplateService.getTemplate($routeParams.templateId),
          function (response) {
            // Assign returned form object from FormService to $scope.form
            $scope.form = response.data;
            UIUtilService.setStatus($scope.form[CONST.publication.STATUS]);
            UIUtilService.setVersion($scope.form[CONST.publication.VERSION]);
            $rootScope.jsonToSave = $scope.form;
            $rootScope.rootElement = $scope.form;
            HeaderService.dataContainer.currentObjectScope = $scope.form;
            $rootScope.documentTitle = $scope.form['schema:name'];

            // Initialize value recommender service
            ValueRecommenderService.init($routeParams.templateId, $scope.form);

          },
          function (err) {
            // var message = (err.data.errorKey == 'noReadAccessToResource') ? $translate.instant(
            //     'REST_ERROR.noReadAccessToResource') : $translate.instant('SERVER.TEMPLATE.load.error');

            UIMessageService.acknowledgedExecution(
                function () {
                  $timeout(function () {
                    $rootScope.goToHome();
                  });
                },
                'GENERIC.Warning',
                $translate.instant(err.data.message),
                'GENERIC.Ok');
          });

    };

    $scope.details;
    $scope.cannotWrite;

// $scope.isShowOutput = function () {
//   return UIUtilService.isShowOutput();
// };
//
// $scope.toggleShowOutput = function() {
//   return UIUtilService.toggleShowOutput();
// };
//
// $scope.scrollToAnchor = function(hash) {
//   UIUtilService.scrollToAnchor(hash);
// };
//
// $scope.getShowOutputTab = function () {
//   return UIUtilService.getShowOutputTab();
// };
//
// $scope.setShowOutputTab = function (index) {
//   return UIUtilService.setShowOutputTab(index);
// };
//
// $scope.toggleShowOutputTab = function (index) {
//   return UIUtilService.toggleShowOutputTab(index);
// };

// create a copy of the form with the _tmp fields stripped out
    $scope.cleanForm = function () {
      var copiedForm = jQuery.extend(true, {}, $scope.instance);
      if (copiedForm) {
        DataManipulationService.stripTmps(copiedForm);
      }

      UIUtilService.toRDF();
      $scope.RDF = UIUtilService.getRDF();
      $scope.RDFError = UIUtilService.getRDFError();
      return copiedForm;
    };


    $scope.canWrite = function () {
      var result = !$scope.details || resourceService.canWrite($scope.details);
      $scope.cannotWrite = !result;
      return result;
    };

// This function watches for changes in the _ui.title field and autogenerates the schema title and description fields
    $scope.$watch('cannotWrite', function () {
      UIUtilService.setLocked($scope.cannotWrite);
    });

    var getDetails = function (id) {
      resourceService.getResourceDetailFromId(
          id, CONST.resourceType.INSTANCE,
          function (response) {
            $scope.details = response;
            $scope.canWrite();
          },
          function (error) {
            UIMessageService.showBackendError('SERVER.INSTANCE.load.error', error);
          }
      );
    };

// validate the resource
    var checkValidation = function (node) {

      if (node) {
        return resourceService.validateResource(
            node, CONST.resourceType.INSTANCE,
            function (response) {

              var json = angular.toJson(response);
              var status = response.validates == "true";
              UIUtilService.logValidation(status, json);

              $timeout(function () {
                $rootScope.$broadcast("form:validation", {state: status});
              });

            },
            function (error) {
              UIMessageService.showBackendError('SERVER.INSTANCE.load.error', error);
            }
        );
      }
    };

// Get/read instance with given id from $routeParams
// Also read the template for it
    $scope.getInstance = function () {
      AuthorizedBackendService.doCall(
          TemplateInstanceService.getTemplateInstance($routeParams.id),
          function (instanceResponse) {
            $scope.instance = instanceResponse.data;
            checkValidation($scope.instance);
            UIUtilService.instanceToSave = $scope.instance;
            $scope.isEditData = true;
            $rootScope.documentTitle = $scope.instance['schema:name'];
            getDetails($scope.instance['@id']);


            AuthorizedBackendService.doCall(
                TemplateService.getTemplate(instanceResponse.data['schema:isBasedOn']),
                function (templateResponse) {
                  // Assign returned form object from FormService to $scope.form
                  $scope.form = templateResponse.data;
                  $rootScope.jsonToSave = $scope.form;
                  // Initialize value recommender service
                  var templateId = instanceResponse.data['schema:isBasedOn'];
                  ValueRecommenderService.init(templateId, $scope.form);
                  UIUtilService.setStatus($scope.form[CONST.publication.STATUS]);
                  UIUtilService.setVersion($scope.form[CONST.publication.VERSION]);
                },
                function (templateErr) {
                  UIMessageService.showBackendError('SERVER.TEMPLATE.load-for-instance.error', templateErr);
                }
            );
          },
          function (instanceErr) {
            UIMessageService.showBackendError('SERVER.INSTANCE.load.error', instanceErr);
            $rootScope.goToHome();
          }
      );
    };


// Stores the data (instance) into the databases
    $scope.saveInstance = function () {

      var doSave = function (response) {
        UIUtilService.logValidation(response.headers("CEDAR-Validation-Status"));
        UIMessageService.flashSuccess('SERVER.INSTANCE.create.success', null, 'GENERIC.Created');

        //$rootScope.$broadcast("form:clean");
        UIUtilService.setDirty(false);
        $rootScope.$broadcast("form:validation", {state: true});

        $timeout(function () {
          var newId = response.data['@id'];
          $location.path(FrontendUrlService.getInstanceEdit(newId));
        });

        $timeout(function () {
          // don't show validation errors until after any redraws are done
          // thus, call this within a timeout
          $rootScope.$broadcast('submitForm');
        }, 1000);

      };

      var doUpdate = function (response) {
        UIUtilService.logValidation(response.headers("CEDAR-Validation-Status"));
        UIMessageService.flashSuccess('SERVER.INSTANCE.update.success', null, 'GENERIC.Updated');
        $rootScope.$broadcast("form:clean");
        $rootScope.$broadcast('submitForm');
        owner.enableSaveButton();
      };

      this.disableSaveButton();
      var owner = this;

      $scope.runtimeErrorMessages = [];
      $scope.runtimeSuccessMessages = [];

      if ($scope.instance['@id'] == undefined) {
        // '@id' and 'templateId' haven't been populated yet, create now
        // $scope.instance['@id'] = $rootScope.idBasePath + $rootScope.generateGUID();
        $scope.instance['schema:isBasedOn'] = $routeParams.templateId;
        // Create fields that will store information used by the UI
        $scope.instance['schema:name'] = $scope.form['schema:name'] + $translate.instant("GENERATEDVALUE.instanceTitle")
        $scope.instance['schema:description'] = $scope.form['schema:description'] + $translate.instant(
            "GENERATEDVALUE.instanceDescription");
        // Make create instance call
        AuthorizedBackendService.doCall(
            TemplateInstanceService.saveTemplateInstance(
                (QueryParamUtilsService.getFolderId() || CedarUser.getHomeFolderId()), $scope.instance),
            function (response) {
              doSave(response);
            },
            function (err) {

              if (err.data.errorKey == "noWriteAccessToFolder") {
                AuthorizedBackendService.doCall(
                    TemplateInstanceService.saveTemplateInstance(CedarUser.getHomeFolderId(), $scope.instance),
                    function (response) {

                      doSave(response);
                      UIMessageService.flashWarning('SERVER.INSTANCE.create.homeFolder');

                    },
                    function (err) {
                      UIMessageService.showBackendError('SERVER.INSTANCE.create.error', err);
                      owner.enableSaveButton();
                    }
                );

              } else {
                UIMessageService.showBackendError('SERVER.INSTANCE.create.error', err);
                owner.enableSaveButton();
              }
            }
        );
      }
      // Update instance
      else {
        AuthorizedBackendService.doCall(
            TemplateInstanceService.updateTemplateInstance($scope.instance['@id'], $scope.instance),
            function (response) {
              doUpdate(response);
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
    UIUtilService.instanceToSave = $scope.instance;


// Create new instance
    if (!angular.isUndefined($routeParams.templateId)) {
      $scope.getTemplate();
    }

// Edit existing instance
    if (!angular.isUndefined($routeParams.id)) {
      $scope.getInstance();
    }

// Initialize array for required fields left empty that fail required empty check


    // keep track of validation errors on metadata
    $scope.validationErrors = {};
    $scope.$on('validationError', function (event, args) {
      var operation = args[0];
      var title = args[1];
      var id = args[2];
      var error = args[3];
      var key = id;

      if (operation == 'add') {
        $scope.validationErrors[error] = $scope.validationErrors[error] || {};
        $scope.validationErrors[error][key] = {};
        $scope.validationErrors[error][key].title = title;
      }

      if (operation == 'remove') {
        if ($scope.validationErrors[error] && $scope.validationErrors[error][key]) {
          delete $scope.validationErrors[error][key];

          if (!$scope.hasKeys($scope.validationErrors[error])) {
            delete $scope.validationErrors[error];
          }
        }
      }
    });

    $scope.getValidationHeader = function (key) {
      return $translate.instant('VALIDATION.groupHeader.' + key);
    };

    $scope.hasKeys = function (value) {
      return Object.keys(value).length;
    };


// cancel the form and go back to folder
    $scope.cancelTemplate = function () {
      $location.url(FrontendUrlService.getFolderContents(QueryParamUtilsService.getFolderId()));
    };

    $scope.enableSaveButton = function () {
      console.log('enableSaveButton');
      $timeout(function () {
        $scope.saveButtonDisabled = false;
      }, 1000);
    };

    $scope.disableSaveButton = function () {
      $scope.saveButtonDisabled = true;
    };

//
// custom validation services
//

    $scope.isValidationTemplate = function (action) {
      var result;
      if ($rootScope.documentTitle) {
        result = ValidationService.isValidationTemplate($rootScope.documentTitle, action);
      }
      return result;
    };

    $scope.doValidation = function () {
      var type = ValidationService.isValidationTemplate($rootScope.documentTitle, 'validation');
      if (type) {
        $scope.$broadcast('external-validation', [type]);
      }
    };


// // open the airr submission modal
// $scope.flowModalVisible = false;
// $scope.showFlowModal = function () {
//   $scope.flowModalVisible = true;
//   $scope.$broadcast('flowModalVisible', [$scope.flowModalVisible, $rootScope.instanceToSave]);
// };

  }
  ;

})
;
