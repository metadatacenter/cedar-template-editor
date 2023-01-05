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
    "CedarUser", "UrlService"];

  function CreateInstanceController($translate, $rootScope, $scope, $routeParams, $location,
                                    HeaderService, TemplateService, resourceService, TemplateInstanceService,
                                    UIMessageService, AuthorizedBackendService, CONST, $timeout,
                                    QueryParamUtilsService, FrontendUrlService, ValidationService,
                                    ValueRecommenderService, UIUtilService, DataManipulationService, CedarUser, UrlService) {

    // Get/read template with given id from $routeParams
    $scope.getTemplate = function () {
      AuthorizedBackendService.doCall(
          TemplateService.getTemplate(UrlService.fixSingleSlashHttps($routeParams.templateId)),
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
            ValueRecommenderService.init(UrlService.fixSingleSlashHttps($routeParams.templateId), $scope.form);

          },
          function (err) {
            console.log('err', err);
            const message = (err.data.errorKey === 'noReadAccessToArtifact') ? 'Whoa!' : $translate.instant('SERVER.TEMPLATE.load.error');

            UIMessageService.acknowledgedExecution(
                function () {
                  $timeout(function () {
                    $rootScope.goToHome();
                  });
                },
                'GENERIC.Warning',
                message,
                'GENERIC.Ok');
          });

    };

    $scope.details;
    $scope.cannotWrite;


// create a copy of the form with the _tmp fields stripped out
    $scope.cleanForm = function () {
      const copiedForm = jQuery.extend(true, {}, $scope.instance);
      if (copiedForm) {
        DataManipulationService.stripTmps(copiedForm);
      }

      UIUtilService.toRDF();
      $scope.RDF = UIUtilService.getRDF();
      $scope.RDFError = UIUtilService.getRDFError();
      return copiedForm;
    };


    $scope.canWrite = function () {
      const result = !$scope.details || resourceService.canWrite($scope.details);
      $scope.cannotWrite = !result;
      return result;
    };

    // This function watches for changes in the _ui.title field and autogenerates the schema title and description fields
    $scope.$watch('cannotWrite', function () {
      UIUtilService.setLocked($scope.cannotWrite);
    });

    $scope.copyJson2Clipboard = function () {
        navigator.clipboard.writeText(JSON.stringify($rootScope.jsonToSave)).then(function(){
            UIMessageService.flashSuccess('METADATAEDITOR.JsonLDCopied', {"title": "METADATAEDITOR.JsonLDCopied"}, 'GENERIC.Copied');
            $scope.$apply();
        }).catch((err)=>{
            UIMessageService.flashWarning('METADATAEDITOR.JsonLDCopyFail', {"title": "METADATAEDITOR.JsonLDCopyFail"}, 'GENERIC.Error');
            console.error(err);
            $scope.$apply();
        });
      };

      $scope.copyRdf2Clipboard = function (rdf) {
          navigator.clipboard.writeText(rdf).then(function(){
              UIMessageService.flashSuccess('METADATAEDITOR.RdfCopied', {"title": "METADATAEDITOR.RdfCopied"}, 'GENERIC.Copied');
              $scope.$apply();
          }).catch((err)=>{
              UIMessageService.flashWarning('METADATAEDITOR.RdfCopyFail', {"title": "METADATAEDITOR.RdfCopyFail"}, 'GENERIC.Error');
              console.error(err);
              $scope.$apply();
          });
      };

    const getDetails = function (id) {
      if (id) {
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
      }
    };


    // Get/read instance with given id from $routeParams
    // Also read the template for it
    $scope.getInstance = function () {
      AuthorizedBackendService.doCall(
          TemplateInstanceService.getTemplateInstance($routeParams.id),
          function (instanceResponse) {
            $scope.instance = instanceResponse.data;
            ValidationService.checkValidation();
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
                  const templateId = instanceResponse.data['schema:isBasedOn'];
                  ValueRecommenderService.init(templateId, $scope.form);
                  UIUtilService.setStatus($scope.form[CONST.publication.STATUS]);
                  UIUtilService.setVersion($scope.form[CONST.publication.VERSION]);
                },
                function (err) {
                  // UIMessageService.showBackendError('SERVER.TEMPLATE.load-for-instance.error', templateErr);
                  const message = (err.data.errorKey === 'noReadAccessToArtifact') ? $translate.instant(
                      'SERVER.TEMPLATE.load.error-template') : $translate.instant('SERVER.TEMPLATE.load.error');
                  UIMessageService.acknowledgedExecution(
                      function () {
                        $timeout(function () {
                          $rootScope.goToHome();
                        });
                      },
                      'GENERIC.Warning',
                      message,
                      'GENERIC.Ok');

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

      const doSave = function (response) {
        ValidationService.logValidation(response.headers("CEDAR-Validation-Status"));
        UIMessageService.flashSuccess('SERVER.INSTANCE.create.success', null, 'GENERIC.Created');

        //$rootScope.$broadcast("form:clean");
        UIUtilService.setDirty(false);
        $rootScope.$broadcast(CONST.eventId.form.VALIDATION, {state: true});

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

      const doUpdate = function (response) {
        ValidationService.logValidation(response.headers("CEDAR-Validation-Status"));
        UIMessageService.flashSuccess('SERVER.INSTANCE.update.success', null, 'GENERIC.Updated');
        $rootScope.$broadcast("form:clean");
        $rootScope.$broadcast('submitForm');
        owner.enableSaveButton();
      };

      this.disableSaveButton();
      const owner = this;

      $scope.runtimeErrorMessages = [];
      $scope.runtimeSuccessMessages = [];

      if ($scope.instance['@id'] === undefined) {
        // '@id' and 'templateId' haven't been populated yet, create now
        // $scope.instance['@id'] = $rootScope.idBasePath + $rootScope.generateGUID();
        $scope.instance['schema:isBasedOn'] = UrlService.fixSingleSlashHttps($routeParams.templateId);
        // Create fields that will store information used by the UI
        $scope.instance['schema:name'] = $scope.form['schema:name'] + $translate.instant("GENERATEDVALUE.instanceTitle")
        $scope.instance['schema:description'] = $scope.form['schema:description'] + $translate.instant("GENERATEDVALUE.instanceDescription");
        // Make create instance call
        AuthorizedBackendService.doCall(
            TemplateInstanceService.saveTemplateInstance(
                (QueryParamUtilsService.getFolderId() || CedarUser.getHomeFolderId()), $scope.instance),
            function (response) {
              doSave(response);
            },
            function (err) {

              if (err.data.errorKey === "noWriteAccessToFolder") {
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

    const pageId = CONST.pageId.RUNTIME;
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
      const operation = args[0];
      const title = args[1];
      const id = args[2];
      const error = args[3];
      const key = id;

      if (operation === 'add') {
        $scope.validationErrors[error] = $scope.validationErrors[error] || {};
        $scope.validationErrors[error][key] = {};
        $scope.validationErrors[error][key].title = title;
      }

      if (operation === 'remove') {
        if ($scope.validationErrors[error] && $scope.validationErrors[error][key]) {
          delete $scope.validationErrors[error][key];

          if (!$scope.hasKeys($scope.validationErrors[error])) {
            delete $scope.validationErrors[error];
          }
        }
      }
    });

    $scope.resetValidationErrors = function () {
      $scope.validationErrors = {};
    };

    $scope.getValidationHeader = function (key) {
      if (key !== 'undefined') { // Note that here 'undefined' is a string
        return $translate.instant('VALIDATION.groupHeader.' + key);
      }
    };

    $scope.hasKeys = function (value) {
      return Object.keys(value).length;
    };


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

//
// custom validation services
//

    $scope.isValidationTemplate = function (action) {
      let result;
      if ($rootScope.documentTitle) {
        result = ValidationService.isValidationTemplate($rootScope.documentTitle, action);
      }
      return result;
    };

    $scope.doValidation = function () {
      const type = ValidationService.isValidationTemplate($rootScope.documentTitle, 'validation');
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

})
;
