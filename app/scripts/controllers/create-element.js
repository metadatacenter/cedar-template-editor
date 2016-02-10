'use strict';

var CreateElementController = function ($rootScope, $scope, $routeParams, $timeout, $location, $translate, $filter,
                                        HeaderService, UrlService, StagingService, DataTemplateService,
                                        FieldTypeService, TemplateElementService, UIMessageService,
                                        DataManipulationService, DataUtilService, AuthorizedBackendService, CONST) {
  // Set page title variable when this controller is active
  $rootScope.pageTitle = 'Element Designer';
  // Create staging area to create/edit fields before they get added to the element
  $scope.staging = {};
  // Setting default false flag for $scope.favorite
  //$scope.favorite = false;
  // Empty $scope object used to store values that get converted to their json-ld counterparts on the $scope.element object
  $scope.volatile = {};
  // Setting form preview setting to false by default
  $scope.formPreview = false;
  // Configure mini header
  var pageId = CONST.pageId.ELEMENT;
  var applicationMode = CONST.applicationMode.CREATOR;
  HeaderService.configure(pageId, applicationMode);
  StagingService.configure(pageId);
  $rootScope.applicationRole = 'creator';

  AuthorizedBackendService.doCall(
      function () {
        return TemplateElementService.getAllTemplateElementsSummary();
      },
      function (response) {
        $scope.elementList = response.data;
      },
      function (err) {
        UIMessageService.showBackendError('SERVER.ELEMENTS.load.error', err);
      }
  );

  $scope.fieldTypes = FieldTypeService.getFieldTypes();

  // Load existing element if $routeParams.id parameter is supplied
  if ($routeParams.id) {
    // Fetch existing element and assign to $scope.element property
    AuthorizedBackendService.doCall(
        function () {
          return TemplateElementService.getTemplateElement($routeParams.id);
        },
        function (response) {
          $scope.element = response.data;
          // Set form preview to true so the preview is viewable onload
          $scope.formPreview = true;
          HeaderService.dataContainer.currentObjectScope = $scope.element;
        },
        function (err) {
          UIMessageService.showBackendError('SERVER.ELEMENT.load.error', err);
        }
    );
  } else {
    // If we're not loading an existing element then let's create a new empty $scope.element property
    $scope.element = DataTemplateService.getElement();
    HeaderService.dataContainer.currentObjectScope = $scope.element;
  }

  // *** proxied functions
  $scope.isPropertiesEmpty = function () {
    return DataUtilService.isPropertiesEmpty($scope.element);
  };

  $scope.addFieldToStaging = function (fieldType) {
    return StagingService.addFieldToStaging($scope, fieldType);
  };

  $scope.addFieldToElement = function (field) {
    return StagingService.addFieldToScopeAndStaging($scope, $scope.element, field);
  };

  // *** functions from data manipulation service
  $scope.addOption = DataManipulationService.addOption;

  /*$scope.addExistingElement = function (element) {
   // Fetch existing element json data
   //FormService.element(element).then(function(response) {

   // Add existing element to the $scope.element.properties object with it's title converted to an object key
   var fieldName = $rootScope.getFieldName(element.properties._ui.title);
   // Adding corresponding property type to @context
   $scope.element.properties["@context"].properties[fieldName] = {};
   $scope.element.properties["@context"].properties[fieldName].enum =
   new Array($rootScope.schemasBase + fieldName);
   $scope.element.properties["@context"].required.push(fieldName);

   // Add existing element to the $scope.element.properties object
   $scope.element.properties[fieldName] = element;
   //});
   };*/

  $scope.addElementToStaging = function (elementId) {
    StagingService.addElement();
    StagingService.addElementWithId($scope, elementId);
  };

  // Delete field from $scope.staging object
  $scope.deleteField = function (field) {
    // Remove field instance from $scope.staging
    delete $scope.staging[field['@id']];
    // Empty the Error Messages array if present
    if ($scope.stagingErrorMessages) {
      $scope.stagingErrorMessages = [];
    }
    StagingService.removeObject();
  };

  // Helper function for converting $scope.volatile values to json-ld '@' keys
  $scope.convertVolatile = function () {
    for (var key in $scope.volatile) {
      if ($scope.volatile.hasOwnProperty(key)) {
        $scope.element['@' + key] = $scope.volatile[key];
      }
    }
  };

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
        'ELEMENTEDITOR.clear.confirm',
        'GENERIC.YesClearIt'
    );
  };

  $scope.doReset = function () {
    $scope.element = angular.copy($scope.resetElement);
    // Broadcast the reset event which will trigger the emptying of formFields formFieldsOrder
    $scope.$broadcast('resetForm');
  }

  // Setting $scope variable to toggle for whether this template is a favorite
  //$scope.toggleFavorite = function() {
  //  $scope.favorite = $scope.favorite === true ? false : true;
  //  $scope.element.favorite = $scope.favorite;
  //};

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
      $scope.$broadcast('initOrderArray');
      // Console.log full working form example on save, just to show demonstration of something happening
      //console.log('saving element...');
      //console.log($scope.element);

      // If maxItems is N, then remove maxItems
      DataManipulationService.removeUnnecessaryMaxItems($scope.element.properties);

      // Save element
      // Check if the element is already stored into the DB
      if ($routeParams.id == undefined) {
        AuthorizedBackendService.doCall(
            function () {
              return TemplateElementService.saveTemplateElement($scope.element);
            },
            function (response) {
              // confirm message
              UIMessageService.flashSuccess('SERVER.ELEMENT.create.success',
                  {"title": response.data.properties._ui.title},
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
            function () {
              return TemplateElementService.updateTemplateElement(id, $scope.element);
            },
            function (response) {
              $scope.element = response.data;
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

  // Build $scope.element._ui.order array
  $scope.$on('finishOrderArray', function (event, orderArray) {
    $scope.element._ui.order = orderArray;
  });

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
                                   "$filter", "HeaderService", "UrlService", "StagingService", "DataTemplateService",
                                   "FieldTypeService", "TemplateElementService", "UIMessageService",
                                   "DataManipulationService", "DataUtilService", "AuthorizedBackendService", "CONST"];
angularApp.controller('CreateElementController', CreateElementController);