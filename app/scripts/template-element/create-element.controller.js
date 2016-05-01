'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.templateElement.createElementController', [])
    .controller('CreateElementController', CreateElementController);

  CreateElementController.$inject = ["$rootScope", "$scope", "$routeParams", "$timeout", "$location", "$translate",
                                     "$filter", "HeaderService", "UrlService", "StagingService", "DataTemplateService",
                                     "FieldTypeService", "TemplateElementService", "UIMessageService",
                                     "DataManipulationService", "DataUtilService", "AuthorizedBackendService", "CONST"];


  function CreateElementController($rootScope, $scope, $routeParams, $timeout, $location, $translate, $filter,
                                   HeaderService, UrlService, StagingService, DataTemplateService, FieldTypeService,
                                   TemplateElementService, UIMessageService, DataManipulationService, DataUtilService,
                                   AuthorizedBackendService, CONST) {

    // Set page title variable when this controller is active
    $rootScope.pageTitle = 'Element Designer';
    // Setting default false flag for $scope.favorite
    //$scope.favorite = false;
    // Empty $scope object used to store values that get converted to their json-ld counterparts on the $scope.element object
    $scope.volatile = {};
    // Setting form preview setting to false by default
    //$scope.form = {};

    // Configure mini header
    var pageId = CONST.pageId.ELEMENT;
    var applicationMode = CONST.applicationMode.CREATOR;
    HeaderService.configure(pageId, applicationMode);
    StagingService.configure(pageId);
    $rootScope.applicationRole = 'creator';

    AuthorizedBackendService.doCall(
      TemplateElementService.getAllTemplateElementsSummary(),
      function (response) {
        $scope.elementList = response.data;
      },
      function (err) {
        UIMessageService.showBackendError('SERVER.ELEMENTS.load.error', err);
      }
    );

    $scope.fieldTypes = FieldTypeService.getFieldTypes();
    $scope.hideRootElement = true;

    $scope.primaryFieldTypes = [];
    $scope.dynamicFieldTypesEven = [];
    $scope.dynamicFieldTypesOdd = [];
    $scope.staticFieldTypesEven = [];
    $scope.staticFieldTypesOdd = [];
    var evenD = true;
    var evenS = true;
    for (var i = 0; i < $scope.fieldTypes.length; i++) {
      if ($scope.fieldTypes[i].primaryField) {
        $scope.primaryFieldTypes.push($scope.fieldTypes[i]);
      } else {
        if ($scope.fieldTypes[i].staticField) {
          if (evenS) {
            $scope.staticFieldTypesEven.push($scope.fieldTypes[i]);
          } else {
            $scope.staticFieldTypesOdd.push($scope.fieldTypes[i]);
          }
          evenS = !evenS;
        } else {
          if (evenD) {
            $scope.dynamicFieldTypesEven.push($scope.fieldTypes[i]);
          } else {
            $scope.dynamicFieldTypesOdd.push($scope.fieldTypes[i]);
          }
          evenD = !evenD;
        }
      }
    }

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
            $scope.form.properties = $scope.form.properties || {};
            $scope.form.properties[key] = $scope.element;
            $scope.form._ui = $scope.form._ui || {};
            $scope.form._ui.order = $scope.form._ui.order || [];
            $scope.form._ui.order.push(key);
            $rootScope.jsonToSave = $scope.element;
          },
          function (err) {
            UIMessageService.showBackendError('SERVER.ELEMENT.load.error', err);
          }
        );
      } else {
        // If we're not loading an existing element then let's create a new empty $scope.element property
        $scope.element = DataTemplateService.getElement();
        HeaderService.dataContainer.currentObjectScope = $scope.element;

        var key = $scope.element["@id"] || DataManipulationService.generateGUID();
        $rootScope.keyOfRootElement = key;
        $scope.form.properties = $scope.form.properties || {};
        $scope.form.properties[key] = $scope.element;
        $scope.form._ui = $scope.form._ui || {};
        $scope.form._ui.order = $scope.form._ui.order || [];
        $scope.form._ui.order.push(key);
        $rootScope.jsonToSave = $scope.element;
      }
    };
    getElement();

    var populateCreatingFieldOrElement = function () {
      $scope.invalidFieldStates = {};
      $scope.invalidElementStates = {};
      $scope.$broadcast('saveForm');
    }

    var dontHaveCreatingFieldOrElement = function () {
      return $rootScope.isEmpty($scope.invalidFieldStates) && $rootScope.isEmpty($scope.invalidElementStates);
    }

    // *** proxied functions
    // Return true if element.properties object only contains default values
    $scope.isPropertiesEmpty = function () {
      return DataUtilService.isPropertiesEmpty($scope.element);
    };

    // Add newly configured field to the element object
    $scope.addFieldToElement = function (fieldType) {
      populateCreatingFieldOrElement();
      if (dontHaveCreatingFieldOrElement()) {
        StagingService.addFieldToElement($scope.element, fieldType);
      }
      $scope.showMenuPopover = false;
    };

    $scope.addElementToElement = function (element) {
      populateCreatingFieldOrElement();
      if (dontHaveCreatingFieldOrElement()) {
        StagingService.addElementToElement($scope.element, element["@id"]);
        $scope.$broadcast("form:update");
      }
    };

    $scope.backToFolder = function() {
      var params = $location.search();
      $location.url(UrlService.getFolderContents(params.folderId));
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
      // Broadcast the reset event which will trigger the emptying of formFields formFieldsOrder
      $scope.$broadcast('resetForm');
    };

    $scope.cancelElement = function () {
      getElement();
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
      // delete $scope.element._ui.is_root;

      // If Element Name is blank, produce error message
      if (!$scope.element._ui.title.length) {
        $scope.elementErrorMessages.push($translate.instant("VALIDATION.elementNameEmpty"));
      }
      // If Element Description is blank, produce error message
      if (!$scope.element._ui.description.length) {
        $scope.elementErrorMessages.push($translate.instant("VALIDATION.elementDescriptionEmpty"));
      }
      // If there are no Element level error messages
      if ($scope.elementErrorMessages.length == 0) {
        // Build element 'order' array via $broadcast call
        // $scope.$broadcast('initOrderArray');
        // Console.log full working form example on save, just to show demonstration of something happening
        //console.log('saving element...');
        //console.log($scope.element);

        // If maxItems is N, then remove maxItems
        DataManipulationService.removeUnnecessaryMaxItems($scope.element.properties);

        // create a copy of the element and strip out the _tmp fields before saving it
        // var copiedElement = $scope.stripTmpFields();

        // Save element
        // Check if the element is already stored into the DB
        if ($routeParams.id == undefined) {
          var queryParams = $location.search();
          $scope.element['parentId'] = queryParams.folderId;
          AuthorizedBackendService.doCall(
            TemplateElementService.saveTemplateElement(queryParams.folderId, $scope.element),
            function (response) {
              // confirm message
              UIMessageService.flashSuccess('SERVER.ELEMENT.create.success',
                                            {"title": response.data._ui.title},
                                            'GENERIC.Created');
              // Reload page with element id
              var newId = response.data['@id'];
              $location.path(UrlService.getElementEdit(newId));
            },
            function (err) {
              UIMessageService.showBackendError('SERVER.ELEMENT.create.error', err);
            }
          );
        }
        // Update element
        else {
          var id = $scope.element['@id'];
          //--//delete $scope.element['@id'];
          AuthorizedBackendService.doCall(
            TemplateElementService.updateTemplateElement(id, $scope.element),
            function (response) {
              angular.extend($scope.element, response.data);
              UIMessageService.flashSuccess('SERVER.ELEMENT.update.success', {"title": response.data.title},
                                            'GENERIC.Updated');
            },
            function (err) {
              UIMessageService.showBackendError('SERVER.ELEMENT.update.error', err);
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

    // This function watches for changes in the _ui.title field and autogenerates the schema title and description fields
    $scope.$watch('element._ui.title', function (v) {
      if (!angular.isUndefined($scope.element)) {
        var title = $scope.element._ui.title;
        if (title.length > 0) {
          var capitalizedTitle = $filter('capitalizeFirst')(title);
          $scope.element.title = $translate.instant(
            "GENERATEDVALUE.elementTitle",
            {title: capitalizedTitle}
          );
          $scope.element.description = $translate.instant(
            "GENERATEDVALUE.elementDescription",
            {title: capitalizedTitle}
          );
        } else {
          $scope.element.title = "";
          $scope.element.description = "";
        }
      }
    });

    // This function watches for changes in the form and defaults the title and description fields
    $scope.$watch('$scope.element', function (v) {
      if ($scope.element && $rootScope.schemaOf($scope.element)) {
        var noName = $translate.instant("VALIDATION.noNameField");
        if (!$rootScope.schemaOf($scope.element)._ui.title) {
          $rootScope.schemaOf($scope.element)._ui.title = noName;
        }
        if (!$rootScope.schemaOf($scope.element)._ui.description) {
          $rootScope.schemaOf($scope.element)._ui.description = noName;
        }
      }
    });

    // create a copy of the form with the _tmp fields stripped out
    $scope.stripTmpFields = function () {

      var copiedForm = jQuery.extend(true, {}, $scope.form);
      if (copiedForm) {
        DataManipulationService.stripTmps(copiedForm);
      }
      return copiedForm;
    };
  }

});
