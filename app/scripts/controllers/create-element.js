'use strict';

var CreateElementController = function ($rootScope, $scope, $routeParams, $timeout, $location, $translate, $filter,
                                        HeaderService, UrlService, StagingService, DataTemplateService,
                                        FieldTypeService, TemplateElementService, UIMessageService,
                                        DataManipulationService, DataUtilService, CONST) {
  // Set page title variable when this controller is active
  $rootScope.pageTitle = 'Element Designer';
  // Setting default false flag for $scope.favorite
  //$scope.favorite = false;
  // Empty $scope object used to store values that get converted to their json-ld counterparts on the $scope.element object
  $scope.volatile = {};
  // Setting form preview setting to false by default
  $scope.form = {};

  // Configure mini header
  var pageId = CONST.pageId.ELEMENT;
  var applicationMode = CONST.applicationMode.CREATOR;
  HeaderService.configure(pageId, applicationMode);
  StagingService.configure(pageId);
  $rootScope.applicationRole = 'creator';

  TemplateElementService.getAllTemplateElementsSummary().then(function (response) {
    $scope.elementList = response.data;
  }).catch(function (err) {
    UIMessageService.showBackendError('SERVER.ELEMENTS.load.error', err);
  });

  $scope.fieldTypes = FieldTypeService.getFieldTypes();

  // Load existing element if $routeParams.id parameter is supplied
  if ($routeParams.id) {
    // Fetch existing element and assign to $scope.element property
    TemplateElementService.getTemplateElement($routeParams.id).then(function (response) {
      $scope.element = response.data;
      // Set form preview to true so the preview is viewable onload
      $scope.formPreview = true;
      HeaderService.dataContainer.currentObjectScope = $scope.element;

      var key = $scope.element["@id"];
      $scope.element.properties._ui.is_root = true;
      $scope.form.properties = $scope.form.properties || {};
      $scope.form.properties[key] = $scope.element;
      $scope.form._ui = $scope.form._ui || {};
      $scope.form._ui.order = $scope.form._ui.order || [];
      $scope.form._ui.order.push(key);
      $rootScope.jsonToSave = $scope.element;
    }).catch(function (err) {
      UIMessageService.showBackendError('SERVER.ELEMENT.load.error', err);
    });
  } else {
    // If we're not loading an existing element then let's create a new empty $scope.element property
    $scope.element = DataTemplateService.getElement();
    HeaderService.dataContainer.currentObjectScope = $scope.element;

    var key = $scope.element["@id"]
    $scope.element.properties._ui.is_root = true;
    $scope.form.properties = $scope.form.properties || {};
    $scope.form.properties[key] = $scope.element;
    $scope.form._ui = $scope.form._ui || {};
    $scope.form._ui.order = $scope.form._ui.order || [];
    $scope.form._ui.order.push(key);
    $rootScope.jsonToSave = $scope.element;
  }

  // *** proxied functions
  // Return true if element.properties object only contains default values
  $scope.isPropertiesEmpty = function () {
    return DataUtilService.isPropertiesEmpty($scope.element);
  };

  $scope.addFieldToStaging = function (fieldType) {
    return StagingService.addFieldToStaging($scope, fieldType);
  };

  $scope.addFieldToElement = function (field) {
    StagingService.addFieldToElement($scope.element, fieldType);
  };

  // *** functions from data manipulation service
  $scope.addOption = DataManipulationService.addOption;
  $scope.addElementToStaging = function (elementId) {
    StagingService.addElement();
    StagingService.addElementWithId($scope, elementId);
  };

  $scope.addElementToElement = function (element) {
    StagingService.addElementToElement();
    $scope.$broadcast("form:update");
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
  }

  $scope.saveElement = function () {
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

  // Stores the element into the database
  $scope.doSaveElement = function () {
    // First check to make sure Element Name, Element Description are not blank
    $scope.elementErrorMessages = [];
    $scope.elementSuccessMessages = [];
    delete $scope.element.properties._ui.is_root;

    // If Element Name is blank, produce error message
    if (!$scope.element.properties._ui.title.length) {
      $scope.elementErrorMessages.push($translate.instant("VALIDATION.elementNameEmpty"));
    }
    // If Element Description is blank, produce error message
    if (!$scope.element.properties._ui.description.length) {
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

      // Save element
      // Check if the element is already stored into the DB
      if ($routeParams.id == undefined) {
        TemplateElementService.saveTemplateElement($scope.element).then(function (response) {
          // confirm message
          UIMessageService.flashSuccess('SERVER.ELEMENT.create.success', {"title": response.data.properties._ui.title},
              'GENERIC.Created');
          // Reload page with element id
          var newId = response.data['@id'];
          $location.path(UrlService.getElementEdit(newId));
        }).catch(function (err) {
          UIMessageService.showBackendError('SERVER.ELEMENT.create.error', err);
        });
      }
      // Update element
      else {
        var id = $scope.element['@id'];
        //--//delete $scope.element['@id'];
        TemplateElementService.updateTemplateElement(id, $scope.element).then(function (response) {
          $scope.element = response.data;
          UIMessageService.flashSuccess('SERVER.ELEMENT.update.success', {"title": response.data.title},
              'GENERIC.Updated');
        }).catch(function (err) {
          UIMessageService.showBackendError('SERVER.ELEMENT.update.error', err);
        });
      }
    }
  }

  // This function watches for changes in the properties._ui.title field and autogenerates the schema title and description fields
  $scope.$watch('element.properties._ui.title', function (v) {
    if (!angular.isUndefined($scope.element)) {
      var title = $scope.element.properties._ui.title;
      if (title.length > 0) {
        var capitalizedTitle = $filter('capitalizeFirst')(title);
        $scope.element.title = $translate.instant("GENERATEDVALUE.elementTitle", {title: capitalizedTitle});
        $scope.element.description = $translate.instant("GENERATEDVALUE.elementDescription", {title: capitalizedTitle});
      } else {
        $scope.element.title = "";
        $scope.element.description = "";
      }
    }
  });
};

CreateElementController.$inject = ["$rootScope", "$scope", "$routeParams", "$timeout", "$location", "$translate",
  "$filter", "HeaderService", "UrlService", "StagingService", "DataTemplateService", "FieldTypeService",
  "TemplateElementService", "UIMessageService", "DataManipulationService", "DataUtilService", "CONST"];
angularApp.controller('CreateElementController', CreateElementController);
