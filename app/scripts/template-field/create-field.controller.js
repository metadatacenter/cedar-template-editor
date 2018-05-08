'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.templateField.createFieldController', [])
      .controller('CreateFieldController', CreateFieldController);

  CreateFieldController.$inject = ["$rootScope", "$scope", "$routeParams", "$timeout", "$location", "$translate",
                                     "$filter", "HeaderService", "StagingService", "DataTemplateService",
                                     "FieldTypeService", "TemplateFieldService", "resourceService", "UIMessageService",
                                     "DataManipulationService", "DataUtilService", "UIUtilService", "AuthorizedBackendService",
                                     "FrontendUrlService", "QueryParamUtilsService", "CONST"];


  function CreateFieldController($rootScope, $scope, $routeParams, $timeout, $location, $translate, $filter,
                                   HeaderService, StagingService, DataTemplateService, FieldTypeService,
                                   TemplateFieldService, resourceService, UIMessageService, DataManipulationService,
                                   DataUtilService,UIUtilService,
                                   AuthorizedBackendService, FrontendUrlService, QueryParamUtilsService, CONST) {

    var dms = DataManipulationService;

    $rootScope.showSearch = true;
    $rootScope.searchBrowseModalId = "search-browse-modal";
    $rootScope.finderModalId = "finder-modal";

    // Set page title variable when this controller is active
    $rootScope.pageTitle = 'Field Designer';
    // Setting default false flag for $scope.favorite
    //$scope.favorite = false;
    // Empty $scope object used to store values that get converted to their json-ld counterparts on the $scope.element object
    $scope.volatile = {};
    // Setting form preview setting to false by default
    //$scope.form = {};
    $scope.viewType = 'popup';

    $scope.isField = true;
    $scope.field;
    $scope.form = {};

    // template details
    $scope.details;
    $scope.cannotWrite;
    $scope.lockReason = '';



    // can we write to this template?  if no details, then new element
    $scope.canWrite = function () {
      var result =  !$scope.details || resourceService.canWrite($scope.details);
      $scope.cannotWrite  =!result;
      return result;
      $scope.lockReason = 'no write permission';
    };

    // This function watches for changes in the _ui.title field and autogenerates the schema title and description fields
    $scope.$watch('cannotWrite', function () {
      $rootScope.setLocked($scope.cannotWrite, $scope.lockReason);
    });

    $scope.showCreateEditForm = true;

    var pageId = CONST.pageId.ELEMENT;
    HeaderService.configure(pageId);
    StagingService.configure(pageId);

    $scope.primaryFieldTypes = FieldTypeService.getPrimaryFieldTypes();
    $scope.otherFieldTypes = FieldTypeService.getOtherFieldTypes();


    $scope.saveButtonDisabled = false;

    $scope.setClean = function() {
      $rootScope.$broadcast('form:clean');
      $rootScope.setDirty(false);
    };



    // validate the resource
    var checkValidation = function (node) {

      if (node) {
        return resourceService.validateResource(
            node, CONST.resourceType.ELEMENT,
            function (response) {

              var json = angular.toJson(response);
              var status = response.validates == "true";
              UIUtilService.logValidation(status, json);

              $timeout(function () {
                $rootScope.$broadcast("form:validation", { state: status });
              });

            },
            function (error) {
              UIMessageService.showBackendError('SERVER.FOLDER.load.error', error);
            }
        );
      }
    };

    $scope.checkLocking = function () {
      var result = !$scope.hasInstances && ( !$scope.details || resourceService.canWrite($scope.details));
      $scope.cannotWrite = !result;
      return result;
    };

    // TODO this call does not work yet
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

    var getField = function () {
      $scope.form = {};
      // Load existing field if $routeParams.id parameter is supplied
      if ($routeParams.id) {
        // Fetch existing element and assign to $scope.element property
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

              dms.createDomIds($scope.field);
              $scope.fieldSchema = dms.schemaOf($scope.field);
              $scope.setClean();

              // TODO details don't work yet
              //getDetails($scope.field['@id']);
            },
            function (err) {
              UIMessageService.showBackendError('SERVER.FIELD.load.error', err);
              $rootScope.goToHome();
            }
        );
      } else {
        // If we're not loading an existing element then let's create a new empty $scope.element property
        $scope.field = DataTemplateService.getContainerField();


         $rootScope.setValidation(true);

        HeaderService.dataContainer.currentObjectScope = $scope.field;

        $scope.form = $scope.field;
        var key = dms.generateGUID();
        $rootScope.keyOfRootElement = key;
        $rootScope.rootElement = $scope.form;
        $rootScope.jsonToSave = $scope.field;
        dms.createDomIds($scope.field);
        $scope.fieldSchema = dms.schemaOf($scope.field);
        $scope.setClean();

      }
    };
    if ($routeParams.id) {
      getField();
    }



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
      console.log('addField',fieldType);

      populateCreatingFieldOrElement();
      if (dontHaveCreatingFieldOrElement()) {
        // $scope.getField(fieldType);
        $scope.field = StagingService.addFieldToField(fieldType);
        dms.setId($scope.field, $routeParams.id);
        $scope.form = $scope.field;



        $rootScope.setValidation(true);

        HeaderService.dataContainer.currentObjectScope = $scope.field;

        $scope.form = $scope.field;
        var key = dms.generateGUID();
        $rootScope.keyOfRootElement = key;

        $rootScope.rootElement = $scope.form;
        $rootScope.jsonToSave = $scope.field;
        dms.createDomIds($scope.field);
        $scope.fieldSchema = dms.schemaOf($scope.field);

        $scope.toggleMore();
        $timeout(function () {
          $rootScope.$broadcast("form:dirty");
        });

      }
      $scope.showMenuPopover = false;
    };


    $scope.moreIsOpen = false;
    $scope.toggleMore = function() {
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
      console.log('root form:clear');
      $scope.form  = {};
      $scope.field = null;

    });

    // Stores the field into the database
    $scope.doSaveField = function () {

      console.log('doSaveField',$routeParams.id, dms.getId($scope.field), $scope.field);

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

                UIUtilService.logValidation(response.headers("CEDAR-Validation-Status"));

                // confirm message
                var title = dms.getTitle(response.data);
                UIMessageService.flashSuccess('SERVER.FIELD.create.success',
                    {"title": title},
                    'GENERIC.Created');
                // Reload page with field id
                var newId = response.data['@id'];
                console.log('response',response.data);
                dms.createDomIds(response.data);
                $location.path(FrontendUrlService.getFieldEdit(newId));

                $scope.setClean();
              },
              function (err) {
                UIMessageService.showBackendError('SERVER.FIELD.create.error', err);
                owner.enableSaveButton();
              }
          );
        }

        // Update field
        else {
          var id = dms.getId($scope.field);
          console.log('update field',id);

          $rootScope.jsonToSave = $scope.field;

          var copiedForm = jQuery.extend(true, {}, $scope.field);
          if (copiedForm) {
            // strip the temps from the copied form only, and save the copy
            DataManipulationService.stripTmps(copiedForm);

            console.log('update field',id, copiedForm);

            AuthorizedBackendService.doCall(
                TemplateFieldService.updateTemplateField(id, copiedForm),
                function (response) {

                  UIUtilService.logValidation(response.headers("CEDAR-Validation-Status"));

                  // dms.createDomIds(response.data);
                  // angular.extend($scope.field, response.data);

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
              {title: capitalizedTitle, version:window.cedarVersion}
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
        jsonld.toRDF(copiedForm, {format: 'application/nquads'}, function(err, nquads) {
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

    $scope.fieldSearch = function () {
      jQuery("body").trigger("click");
      jQuery("#" + $scope.searchBrowseModalId).modal("show");
    }

    $scope.addFieldFromPicker = function () {
      if ($scope.pickerResource) {
        $scope.addFieldToField($scope.pickerResource);
      }
      $scope.hideSearchBrowsePicker();
    };

    $scope.pickFieldFromPicker = function (resource) {
      $scope.addFieldtToField(resource);
      $scope.hideSearchBrowsePicker();
    };

    $scope.selectFieldFromPicker = function (resource) {
      $scope.pickerResource = resource;
    };

    $scope.showSearchBrowsePicker = function () {
      $scope.pickerResource = null;
    };

    $scope.hideSearchBrowsePicker = function () {
      jQuery("#" + $scope.searchBrowseModalId).modal('hide')
    };

    //
    // finder
    //

    $scope.showFinderModal = function () {
      // open and activate the modal
      $scope.finderModalVisible = true;
      $rootScope.$broadcast('finderModalVisible');
    };

    $scope.hideFinder = function () {
      jQuery("#finder-modal").modal('hide')
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
      console.log('showModal',id);
      jQuery("#" + id).modal('show');
    };

    //TODO this event resets modal state and closes modal
    $scope.$on("field:controlledTermAdded", function () {
      jQuery("#control-options-field-field").modal('hide');
    });




  }

});
