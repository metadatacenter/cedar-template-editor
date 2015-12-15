'use strict';

var CreateTemplateController = function($rootScope, $scope, $q, $routeParams, $timeout, $location, FormService, HeaderService, UrlService, StagingService, DataTemplateService, CONST, HEADER_MINI, LS) {
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

  // Using form service to load list of existing elements to embed into new form
  FormService.elementList().then(function(response) {
    $scope.elementList = response;
  });

  // Load existing form if $routeParams.id parameter is supplied
  if ($routeParams.id) {
    // Fetch existing form and assign to $scope.form property
    FormService.form($routeParams.id).then(function(response) {
      $scope.form = response;
      // Set form preview to true so the preview is viewable onload
      $scope.formPreview = true;
      HeaderService.dataContainer.currentObjectScope = $scope.form;
    });
  } else {
    // If we're not loading an existing form then let's create a new empty $scope.form property
    $scope.form = DataTemplateService.getTemplate($rootScope.idBasePath + $rootScope.generateGUID());
    HeaderService.dataContainer.currentObjectScope = $scope.form;
  }

  // Return true if form.properties object only contains default values
  //$scope.isPropertiesEmpty = function() {
  //  if ($scope.form) {
  //    return Object.keys($scope.form.properties).length > 3 ? false : true;
  //  }
  //};
  $scope.isPropertiesEmpty = function() {
    if (!angular.isUndefined($scope.form)) {
      var keys = Object.keys($scope.form.properties);
      for (var i = 0; i < keys.length; i++) {
        if ($rootScope.ignoreKey(keys[i]) == false) {
          return false;
        }
      }
      return true;
    }
  };

  // Add new field into $scope.staging object
  $scope.addFieldToStaging = function(fieldType) {
    StagingService.addField();
    var field = $rootScope.generateField(fieldType);
    field.minItems = 1;
    field.maxItems = 1;

    // If fieldtype can have multiple options, additional parameters on field object are necessary
    var optionInputs = ["radio", "checkbox", "list"];

    if (optionInputs.indexOf(fieldType) > -1) {
      field.properties._ui.options = [
        {
          "text": ""
        }
      ];
    }
    // empty staging object (only one field should be configurable at a time)
    $scope.staging = {};
    // put field into fields staging object
    $scope.staging[field['@id']] = field;

  };

  $scope.addElementToStaging = function(element) {
    StagingService.addElement();
    var clonedElement = angular.copy(element);
    $scope.staging = {};
    $scope.staging[element['@id']] = clonedElement;
    clonedElement.minItems = 1;
    clonedElement.maxItems = 1;

    $scope.previewForm = {};
    $timeout(function() {
      var fieldName = $rootScope.getFieldName(clonedElement.properties._ui.title);

      $scope.previewForm.properties = {};
      $scope.previewForm.properties[fieldName] = clonedElement;
    });
  };

  // Function to add additional options for radio, checkbox, and list fieldTypes
  $scope.addOption = function(field) {
    //console.log(field.properties.value);
    var emptyOption = {
      "text": ""
    };

    field.properties._ui.options.push(emptyOption);
  };

  // Add newly configured field to the the $scope.form.properties object
  $scope.addFieldToForm = function(field) {
    // Setting return value from $scope.checkFieldConditions to array which will display error messages if any
    $scope.stagingErrorMessages = $scope.checkFieldConditions(field.properties);
    $scope.stagingErrorMessages = jQuery.merge($scope.stagingErrorMessages, $rootScope.checkFieldCardinalityOptions(field));

    if ($scope.stagingErrorMessages.length == 0) {
      // Converting title for irregular character handling
      var fieldName = $rootScope.getFieldName(field.properties._ui.title);
      // Adding corresponding property type to @context
      $scope.form.properties["@context"].properties[fieldName] = {};
      $scope.form.properties["@context"].properties[fieldName].enum =
        new Array($rootScope.schemasBase + fieldName);
      $scope.form.properties["@context"].required.push(fieldName);

      var fieldId = field["@id"];

      // Evaluate cardinality
      $rootScope.cardinalizeField(field);

      // Adding field to the element.properties object
      $scope.form.properties[fieldName] = field;

      // Lastly, remove this field from the $scope.staging object
      delete $scope.staging[fieldId];
      StagingService.moveIntoPlace();
    }
  };

  $scope.checkFieldConditions = function(field) {
    // Empty array to push 'error messages' into
    var unmetConditions = [],
      extraConditionInputs = ['checkbox', 'radio', 'list'];

    // Field title is already required, if it's empty create error message
    if (!field._ui.title.length) {
      unmetConditions.push('"Enter Field Title" input cannot be left empty.');
    }
    // If field is within multiple choice field types
    if (extraConditionInputs.indexOf(field._ui.inputType) !== -1) {
      var optionMessage = '"Enter Option" input cannot be left empty.';
      angular.forEach(field.options, function(value, index) {
        // If any 'option' title text is left empty, create error message
        if (!value.text.length && unmetConditions.indexOf(optionMessage) == -1) {
          unmetConditions.push(optionMessage);
        }
      });
    }
    // If field type is 'radio' or 'pick from a list' there must be more than one option created
    if ((field._ui.inputType == 'radio' || field._ui.inputType == 'list') && field.options && (field.options.length <= 1)) {
      unmetConditions.push('Multiple Choice fields must have at least two possible options');
    }
    // Return array of error messages
    return unmetConditions;
  };

  $scope.addExistingElement = function(element) {
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
  };

  // Delete field from $scope.staging object
  $scope.deleteField = function(field) {
    // Remove field instance from $scope.staging
    delete $scope.staging[field['@id']];
    // Empty the Error Messages array if present
    if ($scope.stagingErrorMessages) {
      $scope.stagingErrorMessages = [];
    }
    StagingService.removeObject();
  };

  // Reverts to empty form and removes all previously added fields/elements
  $scope.reset = function() {
    swal({
        title: "Are you sure?",
        text: LS.templateEditor.clear.confirm,
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, clear it!",
        closeOnConfirm: true,
        customClass: 'cedarSWAL',
        confirmButtonColor: null
      },
      function (isConfirm) {
        if (isConfirm) {
          $timeout(function () {
            $scope.doReset();
            StagingService.resetPage();
          });
        }
      });
  };

  $scope.doReset = function() {
    // Loop through $scope.form.properties object and delete each field leaving default json-ld syntax in place
    angular.forEach($scope.form.properties, function(value, key) {
      if (!$rootScope.ignoreKey(key)) {
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
    if (!StagingService.isEmpty()) {
      swal({
          title: "Are you sure?",
          text: LS.templateEditor.save.nonEmptyStagingConfirm,
          type: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes, save it!",
          closeOnConfirm: true,
          customClass: 'cedarSWAL',
          confirmButtonColor: null
        },
        function (isConfirm) {
          if (isConfirm) {
            $scope.doSaveTemplate();
          }
        });
    } else {
      $scope.doSaveTemplate();
    }
  }

  // Stores the template into the database
  $scope.doSaveTemplate = function() {
    // First check to make sure Template Name, Template Description are not blank
    $scope.templateErrorMessages = [];
    $scope.templateSuccessMessages = [];
    // If Template Name is blank, produce error message
    if (!$scope.form.properties._ui.title.length) {
      $scope.templateErrorMessages.push('Template Name input cannot be left empty.');
    }
    // If Template Description is blank, produce error message
    if (!$scope.form.properties._ui.description.length) {
      $scope.templateErrorMessages.push('Template Description input cannot be left empty.');
    }
    // If there are no Template level error messages
    if ($scope.templateErrorMessages.length == 0) {
      // Delete this preview form, so that it does not listen/emit some related events.
      delete $scope.previewForm;

      // If maxItems is N, then remove maxItems
      $rootScope.removeUnnecessaryMaxItems($scope.form.properties);

      // Broadcast the initialize Page Array event which will trigger the creation of the $scope.form._ui 'pages' array
      $scope.$broadcast('initPageArray');
      // Save template
      if ($routeParams.id == undefined) {
        FormService.saveTemplate($scope.form).then(function(response) {
          $scope.templateSuccessMessages.push('The template \"' + response.data.properties._ui.title + '\" has been created.');
          var newId = response.data['@id'];
          $timeout(function () {
            $location.path(UrlService.getTemplateEdit(newId));
          }, 500);
        }).catch(function(err) {
          $scope.templateErrorMessages.push('Problem creating the template.');
          console.log(err);
        });
      }
      // Update template
      else {
        var id = $scope.form['@id'];
        delete $scope.form['@id'];
        FormService.updateTemplate(id, $scope.form).then(function(response) {
          $scope.templateSuccessMessages.push('The template \"' + response.data.properties._ui.title + '\" has been updated.');
        }).catch(function(err) {
          $scope.templateErrorMessages.push('Problem updating the template.');
          console.log(err);
        });
      }
    }
  };

  // Event listener for when the pages array is finished building
  $scope.$on('finishPageArray', function(event, orderArray) {
    // Assigning array returned to $scope.form._ui.pages property
    $scope.form._ui.pages = orderArray;
    // Console.log full working form example on save
    console.log($scope.form);
    // Database service save() call could go here
  });

  // This function watches for changes in the properties._ui.title field and autogenerates the schema title and description fields
  $scope.$watch('form.properties._ui.title', function(v) {
    if (!angular.isUndefined($scope.form)) {
      var title = $scope.form.properties._ui.title;
      if (title.length > 0) {
        $scope.form.title = $rootScope.capitalizeFirst($scope.form.properties._ui.title) + ' template schema';
        $scope.form.description = $rootScope.capitalizeFirst($scope.form.properties._ui.title) + ' template schema autogenerated by the CEDAR Template Editor';
      }
      else {
        $scope.form.title = "";
        $scope.form.description = "";

      }
    }
  });

};

CreateTemplateController.$inject = ["$rootScope", "$scope", "$q", "$routeParams", "$timeout", "$location", "FormService", "HeaderService", "UrlService", "StagingService", "DataTemplateService", "CONST", "HEADER_MINI", "LS"];
angularApp.controller('CreateTemplateController', CreateTemplateController);