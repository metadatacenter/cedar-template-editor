'use strict';

define([
  'angular', 'flow', 'CedarModelTypescriptLibrary'
], function (angular, flow) {
  angular.module('cedar.templateEditor.templateInstance.createInstanceController', [])
      .controller('CreateInstanceController', CreateInstanceController);

  CreateInstanceController.$inject = ["$translate", "$rootScope", "$scope", "$routeParams", "$location",
    "HeaderService", "TemplateService", "resourceService", "TemplateInstanceService",
    "UIMessageService", "AuthorizedBackendService", "CONST", "$timeout",
    "QueryParamUtilsService", "FrontendUrlService", "ValidationService",
    "ValueRecommenderService", "UIUtilService", "DataManipulationService",
    "CedarUser", "UrlService", "CedarModelTypescriptLibrary", "CeeConfigService", "CeeDirtyTrackerService"];

  function CreateInstanceController($translate, $rootScope, $scope, $routeParams, $location,
                                    HeaderService, TemplateService, resourceService, TemplateInstanceService,
                                    UIMessageService, AuthorizedBackendService, CONST, $timeout,
                                    QueryParamUtilsService, FrontendUrlService, ValidationService,
                                    ValueRecommenderService, UIUtilService, DataManipulationService, CedarUser, UrlService,
                                    CedarModelTypescriptLibrary, CeeConfigService, CeeDirtyTrackerService) {

    let vm = this;
    vm.useCee = CedarUser.useMetadataEditorV2();

    // The metadata's own name, edited here rather than only through the Workbench's Rename. New
    // metadata starts from the name this page has always generated, the template's name followed
    // by "metadata", and keeps it unless the user types another. `savedInstanceName` is the name
    // the stored artifact carries, so a change to the field can count towards the dirty state.
    vm.instanceName = null;
    let savedInstanceName = null;

    const generatedInstanceName = function () {
      return $scope.form['schema:name'] + $translate.instant('GENERATEDVALUE.instanceTitle');
    };

    // The name that is saved: the field's text, or the generated one when the field is blank.
    const chosenInstanceName = function () {
      const typed = (vm.instanceName || '').trim();
      return typed.length > 0 ? typed : generatedInstanceName();
    };

    const instanceNameDirty = function () {
      return savedInstanceName != null && chosenInstanceName() !== savedInstanceName;
    };

    vm.instanceNameChanged = function () {
      if (instanceNameDirty()) {
        UIUtilService.setDirty(true);
      }
    };

    const ceeElement = function () {
      return document.querySelector('cedar-embeddable-editor');
    };

    const rememberCeeCleanState = function () {
      const cee = ceeElement();
      if (cee) {
        CeeDirtyTrackerService.markClean(cee.currentMetadata);
      }
    };

    if(vm.useCee){
      CeeDirtyTrackerService.reset();
      $scope.ceeConfig = angular.copy(CeeConfigService.getConfig());
    }

    // The embeddable editor takes one configuration and reports every later assignment as
    // ignored, so read-only mode has to be settled before the first one. It is known only once
    // the resource details arrive, which is after this controller is constructed and can be
    // after the artifact itself has loaded — so the artifact waits here until the editor is
    // configured, rather than the configuration chasing it.
    let ceeConfigured = false;
    let pendingCeeArtifact = null;
    let ceeWaitTicks = 20;

    const configureCee = function () {
      if (ceeConfigured || !vm.useCee) {
        return;
      }
      const cee = ceeElement();
      if (!cee) {
        // The details can answer before the element has been rendered. Waiting for it beats
        // configuring nothing, which would leave the artifact queued and the page blank.
        if (ceeWaitTicks-- > 0) {
          $timeout(configureCee, 0);
        }
        return;
      }
      $scope.ceeConfig.readOnlyMode = $scope.cannotWrite === true;
      cee.config = angular.copy($scope.ceeConfig);
      ceeConfigured = true;
      if (pendingCeeArtifact) {
        const artifact = pendingCeeArtifact;
        pendingCeeArtifact = null;
        presentInCee(artifact);
      }
    };

    const presentInCee = function (artifact) {
      if (!vm.useCee) {
        return;
      }
      if (!ceeConfigured) {
        pendingCeeArtifact = artifact;
        return;
      }
      const cee = ceeElement();
      if (!cee) {
        return;
      }
      if (artifact.instanceObject) {
        cee.templateAndInstanceObject = artifact;
      } else {
        cee.templateObject = artifact.templateObject;
      }
      rememberCeeCleanState();
      UIUtilService.setDirty(false);
    };

    // Get/read template with given id from $routeParams
    $scope.getTemplate = function () {
      AuthorizedBackendService.doCall(
          TemplateService.getTemplate(UrlService.fixSingleSlashHttps($routeParams.templateId)),
          function (response) {
            if(response.data){
              presentInCee({templateObject: response.data});
            }
            $scope.form = response.data;
            vm.instanceName = generatedInstanceName();
            savedInstanceName = vm.instanceName;
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
    $scope.lockReason = null;

    let jsonReaders = CedarModelTypescriptLibrary.CedarJsonReaders.getStrict();
    $scope.instanceReader = jsonReaders.getTemplateInstanceReader();
    let yamlWriters = CedarModelTypescriptLibrary.CedarYamlWriters.getStrict();
    $scope.instanceWriter = yamlWriters.getTemplateInstanceWriter();


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
      $scope.lockReason = result ? null : 'TEMPLATEEDITOR.lock.noWritePermission';
      return result;
    };

    // An instance the user cannot save must not accept edits either, which is what read-only
    // mode asks of the embeddable editor.
    const applyReadOnlyState = function () {
      UIUtilService.setLocked($scope.cannotWrite, $scope.lockReason);
      configureCee();
    };

    // This function watches for changes in the _ui.title field and autogenerates the schema title and description fields
    $scope.$watch('cannotWrite', function () {
      UIUtilService.setLocked($scope.cannotWrite, $scope.lockReason);
    });

    $scope.copyJson2Clipboard = function (json) {
        navigator.clipboard.writeText(json).then(function(){
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

    $scope.getYamlRepresentation = function () {
      const copiedForm = jQuery.extend(true, {}, $scope.instance);
      if (copiedForm) {
        DataManipulationService.stripTmps(copiedForm);
      }
      let jsonTemplateInstanceReaderResult = $scope.instanceReader.readFromObject(copiedForm);
      return $scope.instanceWriter.getAsYamlString(jsonTemplateInstanceReaderResult.instance);
    };

    $scope.copyYaml2Clipboard = function () {
      navigator.clipboard.writeText(this.getYamlRepresentation()).then(function(){
        UIMessageService.flashSuccess('METADATAEDITOR.YamlCopied', {"title": "METADATAEDITOR.YamlCopied"}, 'GENERIC.Copied');
        $scope.$apply();
      }).catch((err)=>{
        UIMessageService.flashWarning('METADATAEDITOR.YamlCopyFail', {"title": "METADATAEDITOR.YamlCopyFail"}, 'GENERIC.Error');
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
              applyReadOnlyState();
            },
            function (error) {
              $scope.cannotWrite = true;
              $scope.lockReason = 'TEMPLATEEDITOR.lock.noWritePermission';
              applyReadOnlyState();
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
            UIUtilService.instanceToSave = $scope.instance;
            ValidationService.checkValidation();
            $scope.isEditData = true;
            $rootScope.documentTitle = $scope.instance['schema:name'];
            vm.instanceName = $scope.instance['schema:name'];
            savedInstanceName = vm.instanceName;
            getDetails($scope.instance['@id']);

            AuthorizedBackendService.doCall(
                TemplateService.getTemplate(instanceResponse.data['schema:isBasedOn']),
                function (templateResponse) {
                  // Assign returned form object from FormService to $scope.form
                  $scope.form = templateResponse.data;

                  presentInCee({templateObject: $scope.form, instanceObject: $scope.instance});

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
        // Raised on the page this save is about to navigate to, not on this one. A toast is a node
        // in the document that made it, and the `window.location.assign` below discards this
        // document a digest later — so a plain flash here was created and thrown away before it
        // painted, and the confirmation was never seen.
        UIMessageService.flashAfterReload('success', 'SERVER.INSTANCE.create.success', 'GENERIC.Created');

        //$rootScope.$broadcast("form:clean");

        UIUtilService.setDirty(false);
        $rootScope.$broadcast(CONST.eventId.form.VALIDATION, {state: true});

        $timeout(function () {
          var newId = response.data['@id'];
          var editUrl = FrontendUrlService.getInstanceEdit(
              newId, QueryParamUtilsService.getFolderId(), QueryParamUtilsService.getReturnTo());
          if (vm.useCee) {
            // The embeddable editor does not re-initialize across a client-side route change — set on
            // the element mid-teardown, it is left stuck "CEDAR Embeddable Editor initializing…". Load
            // the edit view with a full navigation so the editor boots once, cleanly, with the saved
            // instance (same path a fresh open takes).
            window.location.assign(editUrl);
          } else {
            $location.url(editUrl);
          }
        });

        $timeout(function () {
          // don't show validation errors until after any redraws are done
          // thus, call this within a timeout
          $rootScope.$broadcast('submitForm');
        }, 1000);

      };

      const doUpdate = function (response) {
        ValidationService.logValidation(response.headers("CEDAR-Validation-Status"));
        savedInstanceName = $scope.instance['schema:name'];
        vm.instanceName = savedInstanceName;
        $rootScope.documentTitle = savedInstanceName;
        UIMessageService.flashSuccess('SERVER.INSTANCE.update.success', null, 'GENERIC.Updated');
        $rootScope.$broadcast("form:clean");
        $rootScope.$broadcast('submitForm');
        owner.enableSaveButton();
      };

      this.disableSaveButton();
      const owner = this;

      $scope.runtimeErrorMessages = [];
      $scope.runtimeSuccessMessages = [];

      if(vm.useCee){
        const cee = document.querySelector('cedar-embeddable-editor');
        // CEE returns a serialized copy, so representation-local metadata such as the validator
        // from the instance GET is deliberately absent. Carry that validator onto the copy used
        // for this save; AuthorizedBackendService consumes it as If-Match and angular.toJson omits
        // the $$ property from the stored artifact body.
        const cedarEtag = $scope.instance && $scope.instance.$$cedarEtag;
        $scope.instance = cee.currentMetadata;
        if (cedarEtag != null) {
          $scope.instance.$$cedarEtag = cedarEtag;
        }
      }


      // A not-yet-created instance carries no IRI. The embeddable editor (metadata editor V2)
      // now emits an explicit `@id: null` rather than omitting the key, so test for both null and
      // undefined here — otherwise a brand-new instance takes the update path below and calls
      // getTemplateInstance(null), which crashes in fixSingleSlashHttps. Create accepts a null @id.
      if ($scope.instance['@id'] == null) {
        // '@id' and 'templateId' haven't been populated yet, create now
        // $scope.instance['@id'] = $rootScope.idBasePath + $rootScope.generateGUID();
        $scope.instance['schema:isBasedOn'] = UrlService.fixSingleSlashHttps($routeParams.templateId);
        // Create fields that will store information used by the UI
        $scope.instance['schema:name'] = chosenInstanceName();
        $scope.instance['schema:description'] = $scope.form['schema:description'] + $translate.instant("GENERATEDVALUE.instanceDescription");

        // Make create instance call
        AuthorizedBackendService.doCall(
            TemplateInstanceService.saveTemplateInstance(
                (QueryParamUtilsService.getFolderId() || CedarUser.getHomeFolderId()), $scope.instance),
            function (response) {
              doSave(response);
              rememberCeeCleanState();
              UIUtilService.setDirty(false);
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
        $scope.instance['schema:name'] = chosenInstanceName();
        AuthorizedBackendService.doCall(
            TemplateInstanceService.updateTemplateInstance($scope.instance['@id'], $scope.instance),
            function (response) {
              doUpdate(response);
              rememberCeeCleanState();
              UIUtilService.setDirty(false);
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


// Create new instance. Nothing carries a permission yet, so the editor is configured here.
    if (!angular.isUndefined($routeParams.templateId)) {
      $timeout(configureCee, 0);
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

    $timeout(() => {
      const cee = ceeElement();
      if (!cee) return;
      cee.addEventListener('change', () => {
        // Older CEE bundles still emit unstructured control events. Preserve
        // their conservative behaviour until the explicit mutation contract is
        // present, but use the saved baseline whenever this page established one.
        const dirty = CeeDirtyTrackerService.hasBaseline()
            ? CeeDirtyTrackerService.isDirty(cee.currentMetadata)
            : true;
        UIUtilService.setDirty(dirty || instanceNameDirty());
        $scope.$evalAsync();
      });
    }, 0);


// // open the airr submission modal
// $scope.flowModalVisible = false;
// $scope.showFlowModal = function () {
//   $scope.flowModalVisible = true;
//   $scope.$broadcast('flowModalVisible', [$scope.flowModalVisible, $rootScope.instanceToSave]);
// };

  }
});
