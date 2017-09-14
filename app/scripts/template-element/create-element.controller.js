'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.templateElement.createElementController', [])
      .controller('CreateElementController', CreateElementController);

  CreateElementController.$inject = ["$rootScope", "$scope", "$routeParams", "$timeout", "$location", "$translate",
                                     "$filter", "HeaderService", "StagingService", "DataTemplateService",
                                     "FieldTypeService", "TemplateElementService", "UIMessageService",
                                     "DataManipulationService", "DataUtilService", "AuthorizedBackendService",
                                     "FrontendUrlService", "QueryParamUtilsService", "CONST"];


  function CreateElementController($rootScope, $scope, $routeParams, $timeout, $location, $translate, $filter,
                                   HeaderService, StagingService, DataTemplateService, FieldTypeService,
                                   TemplateElementService, UIMessageService, DataManipulationService, DataUtilService,
                                   AuthorizedBackendService, FrontendUrlService, QueryParamUtilsService, CONST) {

    var dms = DataManipulationService;

    $rootScope.showSearch = true;
    $rootScope.searchBrowseModalId = "search-browse-modal";
    $rootScope.finderModalId = "finder-modal";

    // Set page title variable when this controller is active
    $rootScope.pageTitle = 'Element Designer';
    // Setting default false flag for $scope.favorite
    //$scope.favorite = false;
    // Empty $scope object used to store values that get converted to their json-ld counterparts on the $scope.element object
    $scope.volatile = {};
    // Setting form preview setting to false by default
    //$scope.form = {};
    $scope.viewType = 'popup';

    $scope.showCreateEditForm = true;

    var pageId = CONST.pageId.ELEMENT;
    HeaderService.configure(pageId);
    StagingService.configure(pageId);

    $scope.primaryFieldTypes = FieldTypeService.getPrimaryFieldTypes();
    $scope.otherFieldTypes = FieldTypeService.getOtherFieldTypes();


    $scope.saveButtonDisabled = false;

    var getElement = function () {
      $scope.form = {};
      // Load existing element if $routeParams.id parameter is supplied
      if ($routeParams.id) {
        // Fetch existing element and assign to $scope.element property
        AuthorizedBackendService.doCall(
            TemplateElementService.getTemplateElement($routeParams.id),
            function (response) {
              $scope.element = response.data;
              HeaderService.dataContainer.currentObjectScope = $scope.element;

              var key = $scope.element["@id"];
              $rootScope.keyOfRootElement = key;
              $rootScope.rootElement = $scope.form;
              $scope.form.properties = $scope.form.properties || {};
              $scope.form.properties[key] = $scope.element;
              $scope.form._ui = $scope.form._ui || {};
              $scope.form._ui.order = $scope.form._ui.order || [];
              $scope.form._ui.order.push(key);

              $scope.form._ui.propertyLabels = $scope.form._ui.propertyLabels || {};

              $rootScope.jsonToSave = $scope.element;
              $rootScope.documentTitle = dms.getTitle($scope.form);
              dms.createDomIds($scope.element);

              $scope.elementSchema = dms.schemaOf($scope.element);

              $scope.$broadcast('form:clean');
            },
            function (err) {
              UIMessageService.showBackendError('SERVER.ELEMENT.load.error', err);
            }
        );
      } else {
        // If we're not loading an existing element then let's create a new empty $scope.element property
        $scope.element = DataTemplateService.getElement();
        HeaderService.dataContainer.currentObjectScope = $scope.element;

        var key = $scope.element["@id"] || dms.generateGUID();
        $rootScope.keyOfRootElement = key;
        $rootScope.rootElement = $scope.form;
        $scope.form.properties = $scope.form.properties || {};
        $scope.form.properties[key] = $scope.element;
        $scope.form._ui = $scope.form._ui || {};
        $scope.form._ui.order = $scope.form._ui.order || [];
        $scope.form._ui.order.push(key);

        $scope.form._ui.propertyLabels = $scope.form._ui.propertyLabels || {};

        $rootScope.jsonToSave = $scope.element;
        dms.createDomIds($scope.element);

        $scope.elementSchema = dms.schemaOf($scope.element);

        $scope.$broadcast('form:clean');
      }
    };
    getElement();

    var populateCreatingFieldOrElement = function () {
      $scope.invalidFieldStates = {};
      $scope.invalidElementStates = {};
      $scope.$broadcast('saveForm');

      //dms.updateKeys($scope.form);
    };

    var dontHaveCreatingFieldOrElement = function () {
      return $rootScope.isEmpty($scope.invalidFieldStates) && $rootScope.isEmpty($scope.invalidElementStates);
    };

    // *** proxied functions
    // Return true if element.properties object only contains default values
    $scope.isPropertiesEmpty = function () {
      return DataUtilService.isPropertiesEmpty($scope.element);
    };

    // Add newly configured field to the element object
    $scope.addField = function (fieldType) {
      populateCreatingFieldOrElement();
      if (dontHaveCreatingFieldOrElement()) {
        StagingService.addFieldToElement($scope.element, fieldType);
        $scope.$broadcast("form:dirty");
        $scope.toggleMore();
      }
      $scope.showMenuPopover = false;
    };


    $scope.moreIsOpen = false;
    $scope.toggleMore = function() {
      $scope.moreIsOpen = !$scope.moreIsOpen;
    };

    $scope.addElementToElement = function (element) {
      populateCreatingFieldOrElement();
      if (dontHaveCreatingFieldOrElement()) {
        dms.createDomIds(element);
        StagingService.addElementToElement($scope.element, element["@id"]);
        $scope.$broadcast("form:update");
      }
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
      $scope.element = angular.copy($scope.resetElement);
      $scope.elementSchema = dms.schemaOf($scope.element);
      // Broadcast the reset event which will trigger the emptying of formFields formFieldsOrder
      $scope.$broadcast('form:reset');
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

    $scope.saveElement = function () {
      populateCreatingFieldOrElement();
      if (dontHaveCreatingFieldOrElement()) {
        UIMessageService.conditionalOrConfirmedExecution(
            StagingService.isEmpty(),
            function () {
              $scope.doSaveElement();
            },
            'GENERIC.AreYouSure',
            'ELEMENTEDITOR.save.nonEmptyStagingConfirm',
            'GENERIC.YesSaveIt'
        );
      }
    };

    // Stores the element into the database
    $scope.doSaveElement = function () {

      // First check to make sure Element Name, Element Description are not blank
      $scope.elementErrorMessages = [];
      $scope.elementSuccessMessages = [];

      // If Element Name is blank, produce error message
      var title = dms.getTitle($scope.element);
      if (!title.length) {
        $scope.elementErrorMessages.push($translate.instant("VALIDATION.elementNameEmpty"));
      }

      // If there are no Element level error messages
      if ($scope.elementErrorMessages.length == 0) {

        // If maxItems is N, then remove maxItems
        dms.removeUnnecessaryMaxItems($scope.element.properties);
        dms.defaultSchemaTitleAndDescription($scope.element);

        this.disableSaveButton();
        var owner = this;

        // Check if the element is already stored into the DB
        if ($routeParams.id == undefined) {
          dms.stripTmps($scope.element);
          dms.updateKeys($scope.element);

          AuthorizedBackendService.doCall(
              TemplateElementService.saveTemplateElement(QueryParamUtilsService.getFolderId(), $scope.element),
              function (response) {



                $scope.logValidation(response.headers("CEDAR-Validation-Status"),
                    response.headers("CEDAR-Validation-Report"));

                // confirm message
                var title = dms.getTitle(response.data);
                UIMessageService.flashSuccess('SERVER.ELEMENT.create.success',
                    {"title": title},
                    'GENERIC.Created');
                // Reload page with element id
                var newId = response.data['@id'];
                dms.createDomIds(response.data);
                $location.path(FrontendUrlService.getElementEdit(newId));

                $scope.$broadcast('form:clean');
              },
              function (err) {
                UIMessageService.showBackendError('SERVER.ELEMENT.create.error', err);
                owner.enableSaveButton();
              }
          );
        }
        // Update element
        else {
          var id = $scope.element['@id'];
          dms.stripTmps($scope.element);
          dms.updateKeys($scope.element);

          AuthorizedBackendService.doCall(
              TemplateElementService.updateTemplateElement(id, $scope.element),
              function (response) {

                $scope.logValidation(response.headers("CEDAR-Validation-Status"),
                    response.headers("CEDAR-Validation-Report"));

                dms.createDomIds(response.data);
                angular.extend($scope.element, response.data);
                $rootScope.jsonToSave = $scope.element;
                UIMessageService.flashSuccess('SERVER.ELEMENT.update.success', {"title": response.data.title},
                    'GENERIC.Updated');

                owner.enableSaveButton();
                $scope.$broadcast('form.clean');

              },
              function (err) {
                UIMessageService.showBackendError('SERVER.ELEMENT.update.error', err);
                owner.enableSaveButton();
              }
          );
        }
      }
    }

    $scope.invalidFieldStates = {};
    $scope.invalidElementStates = {};
    $scope.$on('invalidFieldState', function (event, args) {
      if (args[2] != $scope.element["@id"]) {
        if (args[0] == 'add') {
          $scope.invalidFieldStates[args[2]] = args[1];
        }
        if (args[0] == 'remove') {
          delete $scope.invalidFieldStates[args[2]];
        }
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

    // This function watches for changes in the title field and autogenerates the schema title and description fields
    $scope.$watch('element["schema:name"]', function (v) {
      if (!angular.isUndefined($scope.element)) {
        var title = dms.getTitle($scope.element);
        if (title && title.length > 0) {
          var capitalizedTitle = $filter('capitalizeFirst')(title);
          $scope.element.title = $translate.instant(
              "GENERATEDVALUE.elementTitle",
              {title: capitalizedTitle}
          );
          $scope.element.description = $translate.instant(
              "GENERATEDVALUE.elementDescription",
              {title: capitalizedTitle, version:window.cedarVersion}
          );
        } else {
          $scope.element.title = "";
          $scope.element.description = "";
        }
        $rootScope.documentTitle = title;
      }
    });

    // This function watches for changes in the form and defaults the title and description fields
    $scope.$watch('$scope.element', function (v) {
      if (dms.schemaOf($scope.element)) {
        if (!dms.getTitle($scope.element)) {
          dms.setTitle($scope.element, $translate.instant("VALIDATION.noNameElement"));
        }
        if (!dms.getDescription($scope.element)) {
          dms.setDescription($scope.element, $translate.instant("VALIDATION.noDescriptionElement"));
        }
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
      console.log('stripTmpFields');
      var copiedForm = jQuery.extend(true, {}, $rootScope.jsonToSave);
      if (copiedForm) {
        dms.stripTmps(copiedForm);
        dms.updateKeys(copiedForm);
      }
      return copiedForm;
    };

    $scope.cancelElement = function () {
      $location.url(FrontendUrlService.getFolderContents(QueryParamUtilsService.getFolderId()));
    };

    $scope.elementSearch = function () {
      jQuery("body").trigger("click");
      jQuery("#" + $scope.searchBrowseModalId).modal("show");
    }

    $scope.addElementFromPicker = function () {
      if ($scope.pickerResource) {
        $scope.addElementToElement($scope.pickerResource);
      }
      $scope.hideSearchBrowsePicker();
    };

    $scope.pickElementFromPicker = function (resource) {
      $scope.addElementToElement(resource);
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
      jQuery("#finder-modal").modal('hide')
    };


    // $scope.addElementFromFinder = function () {
    //   if ($scope.finderResource) {
    //     $scope.addElementToTemplate($scope.finderResource);
    //   }
    //   $scope.hideFinder();
    // };
    //
    // $scope.showFinder = function () {
    //   $scope.finderResource = null;
    // };



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
      jQuery("#control-options-element-field").modal('hide');
    });

    // update the property for a field in the element
    $scope.$on("property:propertyAdded", function (event, args) {

      var property = args[0];   // property value
      var id = args[1];         // field id

      var props = $scope.element.properties;
      var fieldProp;
      for (var prop in props) {
        if (props[prop]['@id'] === id) {
          var fieldProp = prop;
          break;
        }
      }
      if (fieldProp) {
        $scope.element.properties['@context'].properties[fieldProp]['enum'][0] = property;
      }
    });

  }

});
