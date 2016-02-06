'use strict';

var CreateTemplateController = function ($rootScope, $scope, $routeParams, $timeout, $location, $translate, $filter,
                                         HeaderService, UrlService, StagingService, DataTemplateService,
                                         FieldTypeService, TemplateElementService, TemplateService, UIMessageService,
                                         DataManipulationService, DataUtilService, CONST) {
  // Set Page Title variable when this controller is active
  $rootScope.pageTitle = 'Template Designer';

  // Configure mini header
  var pageId = CONST.pageId.TEMPLATE;
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

  // Load existing form if $routeParams.id parameter is supplied
  if ($routeParams.id) {
    // Fetch existing form and assign to $scope.form property
    TemplateService.getTemplate($routeParams.id).then(function(response) {
      $scope.form = response.data;
      HeaderService.dataContainer.currentObjectScope = $scope.form;
    }).catch(function (err) {
      UIMessageService.showBackendError('SERVER.TEMPLATE.load.error', err);
    });
  } else {
    // If we're not loading an existing form then let's create a new empty $scope.form property
    $scope.form = DataTemplateService.getTemplate();
    HeaderService.dataContainer.currentObjectScope = $scope.form;
  }

  var populateCreatingFieldOrElement = function () {
    $scope.invalidFieldStates = {};
    $scope.invalidElementStates = {};
    $scope.$broadcast('saveForm');
  }

  var hasCreatingFieldOrElement = function () {
    return $rootScope.isEmpty($scope.invalidFieldStates) && $rootScope.isEmpty($scope.invalidElementStates);
  }

  $scope.isPropertiesEmpty = function () {
    return DataUtilService.isPropertiesEmpty($scope.form);
  };

  // Add newly configured field to the element object
  $scope.addFieldToTemplate = function (fieldType) {
    StagingService.addFieldToForm($scope.form, fieldType)
  };

  $scope.addElementToTemplate = function(element) {
    StagingService.addElementToForm($scope.form, element["@id"])
    $rootScope.$broadcast("form:update");
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
    $scope.$broadcast('resetForm');
  };

  $scope.saveTemplate = function () {
    populateCreatingFieldOrElement();
    if (hasCreatingFieldOrElement()) {
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
  }

  // Stores the template into the database
  $scope.doSaveTemplate = function () {
    // First check to make sure Template Name, Template Description are not blank
    $scope.templateErrorMessages = [];
    $scope.templateSuccessMessages = [];
    // If Template Name is blank, produce error message
    if (!$scope.form.properties._ui.title.length) {
      $scope.templateErrorMessages.push($translate.instant("VALIDATION.templateNameEmpty"));
    }
    // If Template Description is blank, produce error message
    if (!$scope.form.properties._ui.description.length) {
      $scope.templateErrorMessages.push($translate.instant("VALIDATION.templateDescriptionEmpty"));
    }
    // If there are no Template level error messages
    if ($scope.templateErrorMessages.length == 0) {
      // If maxItems is N, then remove maxItems
      DataManipulationService.removeUnnecessaryMaxItems($scope.form.properties);

      // Save template
      if ($routeParams.id == undefined) {
        TemplateService.saveTemplate($scope.form).then(function (response) {
          // confirm message
          UIMessageService.flashSuccess('SERVER.TEMPLATE.create.success', {"title": response.data._ui.title},
              'GENERIC.Created');
          // Reload page with template id
          var newId = response.data['@id'];
          $location.path(UrlService.getTemplateEdit(newId));
        }).catch(function (err) {
          UIMessageService.showBackendError('SERVER.TEMPLATE.create.error', err);
        });
      }
      // Update template
      else {
        var id = $scope.form['@id'];
        //--//delete $scope.form['@id'];
        TemplateService.updateTemplate(id, $scope.form).then(function (response) {
          $scope.form = response.data;
          UIMessageService.flashSuccess('SERVER.TEMPLATE.update.success', {"title": response.data.properties._ui.title},
              'GENERIC.Updated');
        }).catch(function (err) {
          UIMessageService.showBackendError('SERVER.TEMPLATE.update.error', err);
        });
      }
    }
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

  // This function watches for changes in the properties._ui.title field and autogenerates the schema title and description fields
  $scope.$watch('form.properties._ui.title', function (v) {
    if (!angular.isUndefined($scope.form)) {
      var title = $scope.form.properties._ui.title;
      if (title.length > 0) {
        var capitalizedTitle = $filter('capitalizeFirst')(title);
        $scope.form.title = $translate.instant("GENERATEDVALUE.templateTitle", {title: capitalizedTitle});
        $scope.form.description = $translate.instant("GENERATEDVALUE.templateDescription", {title: capitalizedTitle});
      }
      else {
        $scope.form.title = "";
        $scope.form.description = "";
      }
    }
  });
};

CreateTemplateController.$inject = ["$rootScope", "$scope", "$routeParams", "$timeout", "$location", "$translate",
  "$filter", "HeaderService", "UrlService", "StagingService", "DataTemplateService", "FieldTypeService",
  "TemplateElementService", "TemplateService", "UIMessageService", "DataManipulationService", "DataUtilService",
  "CONST"];
angularApp.controller('CreateTemplateController', CreateTemplateController);
