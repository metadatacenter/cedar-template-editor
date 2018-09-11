'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.templateField.createFieldController', [])
      .controller('CreateFieldController', CreateFieldController);

  CreateFieldController.$inject = ["$rootScope", "$scope", "$routeParams", "$timeout", "$location", "$translate",
                                   "$filter", "HeaderService", "StagingService", "DataTemplateService",
                                   "FieldTypeService", "TemplateFieldService", "resourceService", "UIMessageService",
                                   "DataManipulationService", "UIUtilService", "AuthorizedBackendService",
                                   "FrontendUrlService", "QueryParamUtilsService", "CONST", "CedarUser"];


  function CreateFieldController($rootScope, $scope, $routeParams, $timeout, $location, $translate, $filter,
                                 HeaderService, StagingService, DataTemplateService, FieldTypeService,
                                 TemplateFieldService, resourceService, UIMessageService, DataManipulationService,
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
        var isPublished = DataManipulationService.isPublished($scope.details);

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


    // validate the resource
    var checkValidation = function (node) {

      if (node) {
        return resourceService.validateResource(
            node, CONST.resourceType.FIELD,
            function (response) {

              var json = angular.toJson(response);
              var status = response.validates == "true";
              UIUtilService.logValidation(status, json);

              $timeout(function () {
                $rootScope.$broadcast("form:validation", {state: status});
              });

            },
            function (error) {
              UIMessageService.showBackendError('SERVER.FOLDER.load.error', error);
            }
        );
      }
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
      console.log('addField', fieldType);

      populateCreatingFieldOrElement();
      if (dontHaveCreatingFieldOrElement()) {

        $scope.field = StagingService.addFieldToField(fieldType);


        $rootScope.keyOfRootElement = dms.generateGUID();
        dms.setId($scope.field,  $rootScope.keyOfRootElement);
        $scope.form = $scope.field;
        $rootScope.rootElement = $scope.form;
        $rootScope.jsonToSave = $scope.field;
        $scope.fieldSchema = dms.schemaOf($scope.field);
        HeaderService.dataContainer.currentObjectScope = $scope.field;


        dms.setTitle($scope.field, $scope.fieldTitle || $translate.instant("VALIDATION.noNameField"));
        dms.setDescription($scope.field, $scope.fieldDescription || $translate.instant("VALIDATION.noDescriptionField"));

        UIUtilService.setDirty(true);

        dms.createDomIds($scope.field);

        $scope.toggleMore();

        $timeout(function () {
          checkValidation($scope.form);
        },1000);

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


              var copiedForm = jQuery.extend(true, {}, $scope.field);
              checkValidation(copiedForm);

              HeaderService.dataContainer.currentObjectScope = $scope.field;

              $scope.form = $scope.field;
              var key = dms.getId($scope.field);
              $rootScope.keyOfRootElement = key;
              $rootScope.rootElement = $scope.form;
              $rootScope.jsonToSave = $scope.field;
              $rootScope.documentTitle = dms.getTitle($scope.form);

              UIUtilService.setStatus($scope.form[CONST.publication.STATUS]);
              UIUtilService.setVersion($scope.form[CONST.publication.VERSION]);
              UIUtilService.setTotalMetadata(0);
              UIUtilService.setVisibleMetadata(0);

              dms.createDomIds($scope.field);
              $scope.fieldSchema = dms.schemaOf($scope.field);
              $scope.setClean();

              // TODO details don't work yet
              getDetails($scope.field['@id']);
            },
            function (err) {
              UIMessageService.showBackendError('SERVER.FIELD.load.error', err);
              $rootScope.goToHome();
            }
        );
      } else {
        $scope.addField('textfield');
        // // If we're not loading an existing field then let's create a new empty field
        // $scope.field = DataTemplateService.getContainerField();
        // checkValidation($scope.field);
        // $scope.setClean();
        //
        // HeaderService.dataContainer.currentObjectScope = $scope.field;
        //
        // $scope.form = $scope.field;
        // var key = dms.generateGUID();
        // $rootScope.keyOfRootElement = key;
        // $rootScope.rootElement = $scope.form;
        // $rootScope.jsonToSave = $scope.field;
        // dms.createDomIds($scope.field);
        // $scope.fieldSchema = dms.schemaOf($scope.field);


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
      $scope.fieldSchema = dms.schemaOf($scope.field);
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
        UIUtilService.logValidation(response.headers("CEDAR-Validation-Status"));

        // confirm message
        var title = dms.getTitle(response.data);
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
        dms.removeUnnecessaryMaxItems(dms.propertiesOf($scope.field));
        dms.defaultSchemaTitleAndDescription($scope.field);

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
          var id = dms.getId($scope.field);

          $rootScope.jsonToSave = $scope.field;

          var copiedForm = jQuery.extend(true, {}, $scope.field);
          if (copiedForm) {
            // strip the temps from the copied form only, and save the copy
            dms.stripTmps(copiedForm);


            AuthorizedBackendService.doCall(
                TemplateFieldService.updateTemplateField(id, copiedForm),
                function (response) {

                  UIUtilService.logValidation(response.headers("CEDAR-Validation-Status"));
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
      if (args[2] != dms.getId($scope.field)) {
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

    // This function watches for changes in the form and defaults the title and description fields
    $scope.$watch('$scope.field', function (v) {
      if (dms.schemaOf($scope.field)) {
        if (!dms.getTitle($scope.field)) {
          dms.setTitle($scope.field, $translate.instant("VALIDATION.noNameField"));
        }
        if (!dms.getDescription($scope.field)) {
          dms.setDescription($scope.field, $translate.instant("VALIDATION.noDescriptionField"));
        }
      }
    });

    $scope.$watch('field["schema:identifier"]', function (identifier) {
      if (!angular.isUndefined($scope.field) && !identifier) {
        dms.removeIdentifier($scope.field);
      }
    });

    $scope.$watch('field["schema:name"]', function (v) {
      if (!angular.isUndefined($scope.field)) {
        var title = dms.getTitle($scope.field);
        if (title && title.length > 0) {
          var capitalizedTitle = $filter('capitalizeFirst')(title);
          $scope.field.title = $translate.instant(
              "GENERATEDVALUE.fieldTitle",
              {title: capitalizedTitle}
          );
          $scope.field.description = $translate.instant(
              "GENERATEDVALUE.fieldDescription",
              {title: capitalizedTitle, version: window.cedarVersion}
          );
        } else {
          $scope.field.title = "";
          $scope.field.description = "";
        }
        $rootScope.documentTitle = title;
      }
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

    $scope.showModal = function (id) {
      jQuery("#" + id).modal('show');
    };

    $scope.$on("field:controlledTermAdded", function () {
      jQuery("#control-options-field-field").modal('hide');
    });

    // init

    getField();
  }
});
