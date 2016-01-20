'use strict';

var CreateTemplateController = function ($rootScope, $scope, $q, $routeParams, $timeout, $location, $translate,
                                         $filter, HeaderService, UrlService, StagingService, DataTemplateService, FieldTypeService,
                                         TemplateElementService, TemplateService, UIMessageService, DataManipulationService, ClientSideValidationService,
                                         DataUtilService, CONST) {
  // Set Page Title variable when this controller is active
  $rootScope.pageTitle = 'Template Designer';
  // Create staging area to create/edit fields before they get added to $scope.form.properties
  $scope.staging = {};
  // Setting default false flag for $scope.favorite
  //$scope.favorite = false;
  // Setting form preview setting to false by default
  $scope.formPreview = false;
  // Configure mini header
  var pageId = CONST.pageId.TEMPLATE;
  var applicationMode = CONST.applicationMode.CREATOR;
  HeaderService.configure(pageId, applicationMode);
  StagingService.configure(pageId);
  $rootScope.applicationRole = 'creator';

  TemplateElementService.getAllTemplateElementsSummary().then(function (data) {
    $scope.elementList = data;
  });

  $scope.fieldTypes = FieldTypeService.getFieldTypes();

  // Load existing form if $routeParams.id parameter is supplied
  if ($routeParams.id) {
    // Fetch existing form and assign to $scope.form property
    TemplateService.getTemplate($routeParams.id).then(function (response) {
      $scope.form = response;
      // Set form preview to true so the preview is viewable onload
      $scope.formPreview = true;
      HeaderService.dataContainer.currentObjectScope = $scope.form;
    });
  } else {
    // If we're not loading an existing form then let's create a new empty $scope.form property
    $scope.form = DataTemplateService.getTemplate();
    HeaderService.dataContainer.currentObjectScope = $scope.form;
  }

  // *** proxied functions
  $scope.isPropertiesEmpty = function () {
    return DataUtilService.isPropertiesEmpty($scope.form);
  };

  $scope.addFieldToStaging = function (fieldType) {
    return StagingService.addFieldToStaging($scope, fieldType);
  };

  $scope.addFieldToForm = function (field) {
    return StagingService.addFieldToScopeAndStaging($scope, $scope.form, field);
  };

  // *** functions from data manipulation service
  $scope.addOption = DataManipulationService.addOption;

  $scope.addElementToStaging = function (elementId) {
    StagingService.addElement();
    StagingService.addElementWithId($scope, elementId);
  };

  /*$scope.addExistingElement = function (element) {
    // Fetch existing element json data
    //FormService.element(element).then(function(response) {
    // Convert response.data.title string to an acceptable object key string
    //var titleKey = $rootScope.getFieldName(element.properties._ui.title);

    // Add existing element to the $scope.element.properties object with it's title converted to an object key
    var titleKey = $rootScope.getFieldName(element.properties._ui.title);
    // Adding corresponding property type to @context
    $scope.form.properties["@context"].properties[titleKey] = {};
    $scope.form.properties["@context"].properties[titleKey].enum =
      new Array($rootScope.schemasBase + titleKey);
    $scope.form.properties["@context"].required.push(titleKey);

    // Embed existing element into $scope.form.properties object
    $scope.form.properties[titleKey] = element;
    //});
  };*/

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
    // Broadcast the reset event which will trigger the emptying of formFields formFieldsOrder
    $scope.$broadcast('resetForm');
  };

  // Setting $scope variable to toggle for whether this template is a favorite
  //$scope.toggleFavorite = function() {
  //  $scope.favorite = $scope.favorite === true ? false : true;
  //  $scope.form.favorite = $scope.favorite;
  //};

  $scope.saveTemplate = function () {
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
      // Delete this preview form, so that it does not listen/emit some related events.
      delete $scope.previewForm;

      // If maxItems is N, then remove maxItems
      DataManipulationService.removeUnnecessaryMaxItems($scope.form.properties);

      // Broadcast the initialize Page Array event which will trigger the creation of the $scope.form._ui 'pages' array
      $scope.$broadcast('initPageArray');
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
          $scope.templateErrorMessages.push('Problem creating the template.');
          console.log(err);
        });
      }
      // Update template
      else {
        var id = $scope.form['@id'];
        //--//delete $scope.form['@id'];
        TemplateService.updateTemplate(id, $scope.form).then(function (response) {
          UIMessageService.flashSuccess('SERVER.TEMPLATE.update.success', {"title": response.data.properties._ui.title},
            'GENERIC.Updated');
        }).catch(function (err) {
          $scope.templateErrorMessages.push('Problem updating the template.');
          console.log(err);
        });
      }
    }
  };

  // Event listener for when the pages array is finished building
  $scope.$on('finishPageArray', function (event, orderArray) {
    // Assigning array returned to $scope.form._ui.pages property
    $scope.form._ui.pages = orderArray;
    // Console.log full working form example on save
    //console.log($scope.form);
    // Database service save() call could go here
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

CreateTemplateController.$inject = ["$rootScope", "$scope", "$q", "$routeParams", "$timeout", "$location", "$translate",
  "$filter", "HeaderService", "UrlService", "StagingService", "DataTemplateService", "FieldTypeService",
  "TemplateElementService", "TemplateService", "UIMessageService", "DataManipulationService", "ClientSideValidationService",
  "DataUtilService", "CONST"];
angularApp.controller('CreateTemplateController', CreateTemplateController);