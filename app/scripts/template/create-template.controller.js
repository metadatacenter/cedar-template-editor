'use strict';

define([
      'angular'
    ], function (angular) {
      angular.module('cedar.templateEditor.template.createTemplateController', [])
          .controller('CreateTemplateController', CreateTemplateController);

      CreateTemplateController.$inject = ["$rootScope", "$scope", "$routeParams", "$timeout", "$location", "$translate",
                                          "$filter", "TrackingService", "HeaderService", "StagingService",
                                          "DataTemplateService", "FieldTypeService",
                                          "TemplateService", "UIMessageService", "UIUtilService", "DataManipulationService",
                                          "controlledTermDataService", "StringUtilsService",
                                          "DataUtilService", "AuthorizedBackendService",
                                          "FrontendUrlService", "QueryParamUtilsService", "CONST"];

      function CreateTemplateController($rootScope, $scope, $routeParams, $timeout, $location, $translate, $filter,
                                        TrackingService, HeaderService, StagingService, DataTemplateService,
                                        FieldTypeService, TemplateService, UIMessageService,
                                        UIUtilService, DataManipulationService, controlledTermDataService, StringUtilsService,
                                        DataUtilService, AuthorizedBackendService,
                                        FrontendUrlService, QueryParamUtilsService, CONST) {

        $rootScope.showSearch = false;

        // Set Page Title variable when this controller is active
        $rootScope.pageTitle = 'Template Designer';
        $rootScope.searchBrowseModalId = "search-browse-modal";
        $rootScope.finderModalId = "finder-modal";

        var pageId = CONST.pageId.TEMPLATE;
        HeaderService.configure(pageId);
        StagingService.configure(pageId);
        $scope.primaryFieldTypes = FieldTypeService.getPrimaryFieldTypes();
        $scope.otherFieldTypes = FieldTypeService.getOtherFieldTypes();
        $scope.saveButtonDisabled = false;
        $scope.viewType = 'popup';

        var getTemplate = function () {
          // Load existing form if $routeParams.id parameter is supplied
          if ($routeParams.id) {
            // Fetch existing form and assign to $scope.form property
            AuthorizedBackendService.doCall(
                TemplateService.getTemplate($routeParams.id),
                function (response) {
                  $scope.form = response.data;
                  HeaderService.dataContainer.currentObjectScope = $scope.form;

                  $rootScope.keyOfRootElement = $scope.form["@id"];
                  $rootScope.rootElement = $scope.form;
                  $rootScope.jsonToSave = $scope.form;
                  DataManipulationService.createDomIds($scope.form);
                  //$scope.getType();
                  $scope.$broadcast('form:clean');


                },
                function (err) {
                  UIMessageService.showBackendError('SERVER.TEMPLATE.load.error', err);
                }
            );
          } else {
            // If we're not loading an existing form then let's create a new empty $scope.form property
            $scope.form = DataTemplateService.getTemplate();
            HeaderService.dataContainer.currentObjectScope = $scope.form;
            $rootScope.keyOfRootElement = $scope.form["@id"];
            $rootScope.rootElement = $scope.form;
            $rootScope.jsonToSave = $scope.form;
            DataManipulationService.createDomIds($scope.form);
            //$scope.getType();
            $scope.$broadcast('form:clean');
          }
        };
        getTemplate();

        var populateCreatingFieldOrElement = function () {
          $scope.invalidFieldStates = {};
          $scope.invalidElementStates = {};
          $scope.$broadcast('saveForm');

          TrackingService.eventTrack('saveForm', {category: 'creating', label: 'saveForm'});
          TrackingService.pageTrack();
        };

        var dontHaveCreatingFieldOrElement = function () {
          return $rootScope.isEmpty($scope.invalidFieldStates) && $rootScope.isEmpty($scope.invalidElementStates);
        };

        $scope.isPropertiesEmpty = function () {
          return DataUtilService.isPropertiesEmpty($scope.form);
        };

        // Add newly configured field to the element object
        $scope.addField = function (fieldType) {
          populateCreatingFieldOrElement();
          if (dontHaveCreatingFieldOrElement()) {
            var domId = DataManipulationService.createDomId();
            StagingService.addFieldToForm($scope.form, fieldType, domId, function (el) {
              // now we are sure that the element was successfully added
              UIUtilService.scrollToDomId(domId);
              $rootScope.$broadcast("form:dirty");
              $scope.toggleMore();
            });
          }
        };

        $scope.moreIsOpen = false;
        $scope.toggleMore = function () {
          $scope.moreIsOpen = !$scope.moreIsOpen;
        };

        $scope.getTitle = function (node) {
          return DataManipulationService.getTitle(node);
        };

        $scope.addElementToTemplate = function (element) {
          populateCreatingFieldOrElement();
          if (dontHaveCreatingFieldOrElement()) {

            DataManipulationService.createDomIds(element);

            var domId = DataManipulationService.createDomId();
            StagingService.addElementToForm($scope.form, element["@id"], domId, function (e) {

              // now we are sure that the element was successfully added, scroll to it and hide its nested contents
              UIUtilService.scrollToDomId(domId);

            });
            $rootScope.$broadcast("form:update", element);
          }
        };

        // which details tab is open?
        $scope.showCardinality = false;
        $scope.isTabActive = function (item) {
          return ($scope.showCardinality && item == "cardinality");
        };
        $scope.toggleTab = function (item) {
          $scope.showCardinality = !$scope.showCardinality;
        };


        // Function to add additional options for radio, checkbox, and list fieldTypes
        $scope.addOption = DataManipulationService.addOption;

        // Reverts to empty form and removes all previously added fields/elements
        $scope.reset = function () {
          UIMessageService.confirmedExecution(
              function () {
                $timeout(function () {
                  $scope.doReset();
                  StagingService.resetPage();
                });
              },
              'GENERIC.AreYouSure',
              'TEMPLATEEDITOR.clear.confirm',
              'GENERIC.YesClearIt'
          );
        };

        $scope.doReset = function () {
          // Loop through $scope.form.properties object and delete each field leaving default json-ld syntax in place
          angular.forEach($scope.form.properties, function (value, key) {
            if (!DataUtilService.isSpecialKey(key)) {
              delete $scope.form.properties[key];
            }
          });
          $scope.form._ui.order = [];
          // Broadcast the reset event which will trigger the emptying of formFields formFieldsOrder
          $scope.$broadcast('form:reset');
        };

        $scope.saveTemplate = function () {
          populateCreatingFieldOrElement();
          if (dontHaveCreatingFieldOrElement()) {
            UIMessageService.conditionalOrConfirmedExecution(
                StagingService.isEmpty(),
                function () {
                  $scope.doSaveTemplate();
                },
                'GENERIC.AreYouSure',
                'TEMPLATEEDITOR.save.nonEmptyStagingConfirm',
                'GENERIC.YesSaveIt'
            );
          }
        };

        $scope.logValidation = function (validationStatus, validationReport) {

          var report = JSON.parse(validationReport);
          for (var i = 0; i < report.warnings.length; i++) {
            console.log(
                'Validation Warning: ' + report.warnings[i].message + ' at location ' + report.warnings[i].location);
          }
          for (var i = 0; i < report.errors.length; i++) {
            console.log('Validation Error: ' + report.errors[i].message + ' at location ' + report.errors[i].location);
          }
        };

        // Stores the template into the database
        $scope.doSaveTemplate = function () {
          this.disableSaveButton();
          var owner = this;

          // First check to make sure Template Name, Template Description are not blank
          $scope.templateErrorMessages = [];
          $scope.templateSuccessMessages = [];

          // If Template Name is blank, produce error message
          if (!$scope.form._ui.title.length) {
           $scope.templateErrorMessages.push($translate.instant("VALIDATION.templateNameEmpty"));
            owner.enableSaveButton();
          }
          // If Template Description is blank, produce error message
          // if (!$scope.form._ui.description.length) {
          //  $scope.templateErrorMessages.push($translate.instant("VALIDATION.templateDescriptionEmpty"));
          // }

          // If there are no Template level error messages
          if ($scope.templateErrorMessages.length == 0) {
            // If maxItems is N, then remove maxItems
            DataManipulationService.removeUnnecessaryMaxItems($scope.form.properties);
            DataManipulationService.defaultSchemaTitleAndDescription($scope.form);

            // Saving the template for the first time
            if ($routeParams.id == undefined) {

              DataManipulationService.stripTmps($scope.form);

              AuthorizedBackendService.doCall(
                  TemplateService.saveTemplate(QueryParamUtilsService.getFolderId(), $scope.form),
                  function (response) {

                    $scope.logValidation(response.headers("CEDAR-Validation-Status"),
                        response.headers("CEDAR-Validation-Report"));

                    // confirm message
                    UIMessageService.flashSuccess('SERVER.TEMPLATE.create.success', {"title": response.data._ui.title},
                        'GENERIC.Created');

                    // Reload page with template id
                    DataManipulationService.createDomIds(response.data);
                    var newId = response.data['@id'];
                    $location.path(FrontendUrlService.getTemplateEdit(newId));

                    $scope.$broadcast('form:clean');
                  },
                  function (err) {
                    UIMessageService.showBackendError('SERVER.TEMPLATE.create.error', err);
                    owner.enableSaveButton();
                  }
              );
            }
            // Updating an existing template
            else {
              var id = $scope.form['@id'];
              DataManipulationService.stripTmps($scope.form);

              AuthorizedBackendService.doCall(
                  TemplateService.updateTemplate(id, $scope.form),
                  function (response) {

                    $scope.logValidation(response.headers("CEDAR-Validation-Status"),
                        response.headers("CEDAR-Validation-Report"));

                    $rootScope.jsonToSave = response.data;
                    DataManipulationService.createDomIds(response.data);
                    $scope.form = response.data;

                    UIMessageService.flashSuccess('SERVER.TEMPLATE.update.success',
                        {"title": response.data._ui.title}, 'GENERIC.Updated');
                    owner.enableSaveButton();

                    $scope.$broadcast('form:clean');
                  },
                  function (err) {
                    UIMessageService.showBackendError('SERVER.TEMPLATE.update.error', err);
                    owner.enableSaveButton();
                  }
              );
            }
          }
        };

        // close all the first order elements
        var closeAllElements = function () {
          angular.forEach($scope.form._ui.order, function (key, index) {
            var node = $scope.form.properties[key];
            var schema = DataManipulationService.schemaOf(node);
            if (DataUtilService.isElement(schema)) {
              UIUtilService.toggleElement(DataManipulationService.getDomId(node));
            }
          });
        };

        $scope.invalidFieldStates = {};
        $scope.invalidElementStates = {};

        $scope.$on('invalidFieldState', function (event, args) {
          if (args[0] == 'add') {
            $scope.invalidFieldStates[args[2]] = args[1];
          }
          if (args[0] == 'remove') {
            delete $scope.invalidFieldStates[args[2]];
          }
        });

        $scope.$on('invalidElementState', function (event, args) {
          if (args[0] == 'add') {
            $scope.invalidElementStates[args[2]] = args[1];
          }
          if (args[0] == 'remove') {
            delete $scope.invalidElementStates[args[2]];
          }
        });

        //
        //
        // // This function watches for changes in the _ui.title field and autogenerates the schema title and description fields
        // $scope.$watch('saveButtonDisabled', function (v) {
        //   console.log('watch saveButtonDisabled');
        // });


        // This function watches for changes in the _ui.title field and autogenerates the schema title and description fields
        $scope.$watch('form._ui.title', function (v) {

          if (!angular.isUndefined($scope.form)) {
            var title = $scope.form._ui.title;
            if (title.length > 0) {
              var capitalizedTitle = $filter('capitalizeFirst')(title);
              $scope.form.title = $translate.instant("GENERATEDVALUE.templateTitle", {title: capitalizedTitle});
              $scope.form.description = $translate.instant("GENERATEDVALUE.templateDescription",
                  {title: capitalizedTitle, version: window.cedarVersion});
            } else {
              $scope.form._ui.title = "";
              $scope.form._ui.description = "";
            }
            $rootScope.documentTitle = title;
          }
        });

        // This function watches for changes in the form and defaults the title and description fields
        $scope.$watch('form', function (v) {
          if ($scope.form && $rootScope.schemaOf($scope.form)) {
            if (!$rootScope.schemaOf($scope.form)._ui.title) {
              $rootScope.schemaOf($scope.form)._ui.title = $translate.instant("VALIDATION.noNameField");
            }
            if (!$rootScope.schemaOf($scope.form)._ui.description) {
              $rootScope.schemaOf($scope.form)._ui.description = $translate.instant("VALIDATION.noDescriptionField");
            }
          }
          $scope.toRDF();
        });

        // create a copy of the form with the _tmp fields stripped out
        $scope.stripTmpFields = function () {
          var copiedForm = jQuery.extend(true, {}, $rootScope.jsonToSave);
          if (copiedForm) {
            DataManipulationService.stripTmps(copiedForm);
          }
          return copiedForm;
        };


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

        // cancel the form and go back to the current folder
        $scope.cancelTemplate = function () {
          $location.url(FrontendUrlService.getFolderContents(QueryParamUtilsService.getFolderId()));
        };


        $scope.elementSearch = function () {
          jQuery("body").trigger("click");
          jQuery("#" + $scope.searchBrowseModalId).modal("show");
        };

        $scope.addElementFromPicker = function () {
          if ($scope.pickerResource) {
            $scope.addElementToTemplate($scope.pickerResource);
          }
          $scope.hideSearchBrowsePicker();
        };

        $scope.pickElementFromPicker = function (resource) {
          $scope.addElementToTemplate(resource);
          $scope.hideSearchBrowsePicker();
        };

        $scope.selectElementFromPicker = function (resource) {
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
          $scope.$broadcast('finderModalVisible');
        };

        $scope.hideFinder = function () {
          jQuery("#finder-modal").modal('hide');
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

        //TODO this event resets modal state and closes modal
        $scope.$on("field:controlledTermAdded", function () {
          jQuery("#control-options-template-field").modal('hide');
        });

        // update the property for a field
        $scope.$on("property:propertyAdded", function (event, args) {

          var property = args[0];
          var id = args[1];

          var props = DataManipulationService.propertiesOf($scope.form);

          var fieldProp;
          for (var prop in props) {
            if (DataManipulationService.schemaOf(props[prop])['@id'] === id) {
              fieldProp = prop;
              break;
            }
          }
          if (fieldProp) {
            $scope.form.properties['@context'].properties[fieldProp]['enum'][0] = property;
          }
        });

      }

    }
);
