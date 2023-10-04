'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.templateField.createFieldController', [])
      .controller('CreateFieldController', CreateFieldController);

  CreateFieldController.$inject = ["$rootScope", "$scope", "$routeParams", "$timeout", "$location", "$translate",
                                   "$filter", "HeaderService", "StagingService", "DataTemplateService", "schemaService",
                                   "FieldTypeService", "TemplateFieldService", "resourceService", "ValidationService","UIMessageService",
                                   "DataManipulationService", "UIUtilService", "AuthorizedBackendService",
                                   "FrontendUrlService", "QueryParamUtilsService", "CONST", "CedarUser"];


  function CreateFieldController($rootScope, $scope, $routeParams, $timeout, $location, $translate, $filter,
                                 HeaderService, StagingService, DataTemplateService, schemaService,FieldTypeService,
                                 TemplateFieldService, resourceService, ValidationService,UIMessageService,
                                 DataManipulationService,
                                 UIUtilService, AuthorizedBackendService, FrontendUrlService, QueryParamUtilsService,
                                 CONST,CedarUser) {

    // shortcut
    var dms = DataManipulationService;

    // Set page title variable when this controller is active
    $rootScope.pageTitle = 'Field Designer';
    var pageId = CONST.pageId.FIELD;
    HeaderService.configure(pageId);
    StagingService.configure(pageId);

    $rootScope.showSearch = false;

    // property class popup
    $scope.viewType = 'popup';

    // first class field
    $scope.isField = true;
    $scope.field;
    $scope.form = {};
    $scope.saveButtonDisabled = false;
    $scope.fieldTitle = null;
    $scope.fieldDescription = null;
    $scope.fieldIdentifier = null;

    // for the field type picker
    $scope.primaryFieldTypes = FieldTypeService.getPrimaryFieldTypes();
    $scope.otherFieldTypes = FieldTypeService.getOtherFieldTypes();
    $scope.moreIsOpen = false;

    // field details - can read or write
    $scope.details;
    $scope.cannotWrite;
    $scope.lockReason = '';


    $scope.canWrite = function () {
      if (!$scope.details) {
        return true;
      }
      else {
        // Check write permission
        var writePermission = resourceService.canWrite($scope.details);

        // Check publication status
        var isPublished = schemaService.isPublished($scope.details);

        // Result
        var canWrite = writePermission && !isPublished;
        $scope.cannotWrite = !canWrite;
        return canWrite;
      }
    };

    // is this field locked?
    $scope.checkLocking = function () {
      return $scope.canWrite();
    };

    // This function watches for changes in the _ui.title field and autogenerates the schema title and description fields
    $scope.$watch('cannotWrite', function () {
      UIUtilService.setLocked($scope.cannotWrite, $scope.lockReason);
    });

    $scope.setClean = function () {
      $rootScope.$broadcast('form:clean');
      //UIUtilService.setDirty(false);
    };

    var getDetails = function (id) {
      resourceService.getResourceDetailFromId(
          id, CONST.resourceType.FIELD,
          function (response) {
            $scope.details = response;
            $scope.canWrite();
          },
          function (error) {
            UIMessageService.showBackendError('SERVER.' + 'FIELD' + '.load.error', error);
          }
      );
    };

    var populateCreatingFieldOrElement = function () {
      $scope.invalidFieldStates = {};
      $scope.invalidElementStates = {};
      $rootScope.$broadcast('saveForm');
      //dms.updateKeys($scope.form);
    };

    var dontHaveCreatingFieldOrElement = function () {
      return $rootScope.isEmpty($scope.invalidFieldStates) && $rootScope.isEmpty($scope.invalidElementStates);
    };

    // *** proxied functions
    // Return true if element.properties object only contains default values
    $scope.isPropertiesEmpty = function () {
      //return DataUtilService.isPropertiesEmpty($scope.field);
      return false;
    };

    // Add newly configured field to the element object
    $scope.addField = function (fieldType) {

      var title = schemaService.getTitle($scope.field);
      var description = schemaService.getDescription($scope.field);
      var identifier = schemaService.getIdentifier($scope.field);
      
      populateCreatingFieldOrElement();
      if (dontHaveCreatingFieldOrElement()) {

        $scope.field = StagingService.addFieldToField(fieldType);

        $scope.form = $scope.field;
        $rootScope.rootElement = $scope.form;
        $rootScope.jsonToSave = $scope.field;

        $scope.fieldSchema = schemaService.schemaOf($scope.field);
        HeaderService.dataContainer.currentObjectScope = $scope.field;

        schemaService.setTitle($scope.field, title || $translate.instant("VALIDATION.noNameField"));
        schemaService.setDescription($scope.field, description || $translate.instant("VALIDATION.noDescriptionField"));
        if (identifier) {
          schemaService.setIdentifier($scope.field, identifier );
        }

        if ($rootScope.keyOfRootElement) {
          schemaService.setId($scope.field, $rootScope.keyOfRootElement);
        }

        UIUtilService.setDirty(true);
        ValidationService.checkValidation();

        dms.createDomIds($scope.field);
        $rootScope.$broadcast('field:reset');

      }
      $scope.showMenuPopover = false;
    };

    var getField = function () {

      $scope.form = {};
      // Load existing field if $routeParams.id parameter is supplied
      if ($routeParams.id) {
        // Fetch existing field and assign to $scope.field property
        AuthorizedBackendService.doCall(
            TemplateFieldService.getTemplateField($routeParams.id),
            function (response) {

              $scope.field = response.data;



              $scope.form = $scope.field;
              $rootScope.keyOfRootElement = schemaService.getId($scope.field);
              $rootScope.rootElement = $scope.form;
              $rootScope.jsonToSave = $scope.field;

              $scope.fieldSchema = schemaService.schemaOf($scope.field);
              HeaderService.dataContainer.currentObjectScope = $scope.field;
              $rootScope.documentTitle = schemaService.getTitle($scope.form);

              UIUtilService.setStatus($scope.form[CONST.publication.STATUS]);
              UIUtilService.setVersion($scope.form[CONST.publication.VERSION]);
              UIUtilService.setTotalMetadata(0);
              UIUtilService.setVisibleMetadata(0);

              dms.createDomIds($scope.field);
              $scope.setClean();
              ValidationService.checkValidation();

              // TODO details don't work yet
              getDetails($scope.field['@id']);

              if ($rootScope.keyOfRootElement) {
                schemaService.setId($scope.field, $rootScope.keyOfRootElement);
              }

            },
            function (err) {
              UIMessageService.showBackendError('SERVER.FIELD.load.error', err);
              $rootScope.goToHome();
            }
        );
      } else {
        $scope.addField('textfield');
      }
    };



    $scope.toggleMore = function () {
      $scope.moreIsOpen = !$scope.moreIsOpen;
    };

    $scope.backToFolder = function () {
      $location.url(FrontendUrlService.getFolderContents(QueryParamUtilsService.getFolderId()));
    };

    // Reverts to empty form and removes all previously added fields/elements
    $scope.reset = function () {
      UIMessageService.confirmedExecution(
          function () {
            $timeout(function () {
              $scope.doReset();
              // StagingService.resetPage();
            });
          },
          'GENERIC.AreYouSure',
          'ELEMENTEDITOR.clear.confirm',
          'GENERIC.YesClearIt'
      );
    };

    $scope.doReset = function () {
      $scope.field = angular.copy($scope.field);
      $scope.fieldSchema = schemaService.schemaOf($scope.field);
      // Broadcast the reset event which will trigger the emptying of formFields formFieldsOrder
      $rootScope.$broadcast('form:reset');
    };

    $scope.saveField = function () {
      populateCreatingFieldOrElement();
      if (dontHaveCreatingFieldOrElement()) {
        UIMessageService.conditionalOrConfirmedExecution(
            StagingService.isEmpty(),
            function () {
              $scope.doSaveField();
            },
            'GENERIC.AreYouSure',
            'ELEMENTEDITOR.save.nonEmptyStagingConfirm',
            'GENERIC.YesSaveIt'
        );
      }
    };

    $rootScope.$on("form:clear", function () {
      $scope.form = {};
      $scope.field = null;

    });

    // Saves the field in the database
    $scope.doSaveField = function () {

      var doSave = function(response) {
        ValidationService.logValidation(response.headers("CEDAR-Validation-Status"));

        // confirm message
        var title = schemaService.getTitle(response.data);
        UIMessageService.flashSuccess('SERVER.FIELD.create.success',
            {"title": title},
            'GENERIC.Created');
        // Reload page with field id
        var newId = response.data['@id'];
        dms.createDomIds(response.data);
        $location.path(FrontendUrlService.getFieldEdit(newId));
        $scope.setClean();
      };


      // First check to make sure Field Name, Field Description are not blank
      $scope.fieldErrorMessages = [];
      $scope.fieldSuccessMessages = [];


      // If there are no Field level error messages
      if ($scope.fieldErrorMessages.length == 0) {

        // If maxItems is N, then remove maxItems
        schemaService.removeUnnecessaryMaxItems(dms.propertiesOf($scope.field));
        schemaService.defaultSchemaTitleAndDescription($scope.field);

        this.disableSaveButton();
        var owner = this;

        // Check if the field is already stored into the DB
        if ($routeParams.id == undefined) {
          dms.stripTmps($scope.field);
          //dms.updateKeys($scope.field);

          AuthorizedBackendService.doCall(
              TemplateFieldService.saveTemplateField(QueryParamUtilsService.getFolderId(), $scope.field),
              function (response) {
                doSave(response);
              },
              function (err) {
                if (err.data.errorKey == "noWriteAccessToFolder") {
                  AuthorizedBackendService.doCall(
                      TemplateFieldService.saveTemplateField(CedarUser.getHomeFolderId(), $scope.field),
                      function (response) {
                        doSave(response);
                        UIMessageService.flashWarning('SERVER.INSTANCE.create.homeFolder');
                      },
                      function (err) {
                        UIMessageService.showBackendError('SERVER.FIELD.create.error', err);
                        owner.enableSaveButton();
                      });
                } else {
                  UIMessageService.showBackendError('SERVER.FIELD.create.error', err);
                  owner.enableSaveButton();
                }
              }
          );
        }

        // Update field
        else {
          var id = schemaService.getId($scope.field);

          $rootScope.jsonToSave = $scope.field;

          var copiedForm = jQuery.extend(true, {}, $scope.field);
          if (copiedForm) {
            // strip the temps from the copied form only, and save the copy
            dms.stripTmps(copiedForm);

            AuthorizedBackendService.doCall(
                TemplateFieldService.updateTemplateField(id, copiedForm),
                function (response) {

                  ValidationService.logValidation(response.headers("CEDAR-Validation-Status"));
                  UIMessageService.flashSuccess('SERVER.FIELD.update.success', {"title": response.data.title},
                      'GENERIC.Updated');

                  owner.enableSaveButton();
                  $scope.setClean();

                },
                function (err) {
                  UIMessageService.showBackendError('SERVER.FIELD.update.error', err);
                  owner.enableSaveButton();
                }
            );
          }
        }
      }
    };

    $scope.invalidFieldStates = {};
    $scope.invalidFieldStates = {};
    $scope.$on('invalidFieldState', function (event, args) {
      if (args[2] != schemaService.getId($scope.field)) {
        if (args[0] == 'add') {
          $scope.invalidFieldStates[args[2]] = args[1];
        }
        if (args[0] == 'remove') {
          delete $scope.invalidFieldStates[args[2]];
        }
      }
    });
    $scope.$on('invalidFieldState', function (event, args) {
      if (args[0] == 'add') {
        $scope.invalidFieldStates[args[2]] = args[1];
      }
      if (args[0] == 'remove') {
        delete $scope.invalidFieldStates[args[2]];
      }
    });



    $scope.$watch('field["schema:identifier"]', function (identifier) {
      if (!angular.isUndefined($scope.field)) {
        if (!identifier) {
          schemaService.removeIdentifier($scope.field);
          $scope.fieldIdentifier = null;
        }
        else {
          $scope.fieldIdentifier = identifier;
        }
      }
    });

    $scope.$watch('field["schema:description"]', function (description) {
      $scope.fieldDescription = description;
    });


    $scope.toRDF = function () {
      var jsonld = require('jsonld');
      var copiedForm = jQuery.extend(true, {}, $rootScope.jsonToSave);
      if (copiedForm) {
        jsonld.toRDF(copiedForm, {format: 'application/nquads'}, function (err, nquads) {
          $rootScope.jsonToRDF = nquads;
          return nquads;
        });
      }
    };

    // create a copy of the form with the _tmp fields stripped out
    $scope.stripTmpFields = function () {
      var copiedForm = jQuery.extend(true, {}, $rootScope.jsonToSave);
      if (copiedForm) {
        dms.stripTmps(copiedForm);
        //dms.updateKeys(copiedForm);
      }
      return copiedForm;
    };

    $scope.cancelField = function () {
      $location.url(FrontendUrlService.getFolderContents(QueryParamUtilsService.getFolderId()));
    };

    $scope.addFieldFromPicker = function () {
      if ($scope.pickerResource) {
        $scope.addFieldToField($scope.pickerResource);
      }
      $scope.hideSearchBrowsePicker();
    };

    $scope.selectFieldFromPicker = function (resource) {
      $scope.pickerResource = resource;
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
    // controlled terms modal
    //

    $scope.showModal = function (type, searchScope) {
      var options = {"filterSelection":type, "searchScope": searchScope, "modalId":"controlled-term-modal", "model": $scope.form, "id":schemaService.getId($scope.form), "q": schemaService.getTitle($scope.form),'source': null,'termType': null, 'term': null, "advanced": false, "permission": ["read","write"]};
      UIUtilService.showModal(options);
    };

    $scope.$on("field:controlledTermAdded", function (event,args) {
      if (schemaService.getId($scope.form) == args[1]) {
        UIUtilService.hideModal();
        UIUtilService.setDirty(true);
      }
    });

    // init

    $rootScope.keyOfRootElement = null;
    getField();
  }
});
