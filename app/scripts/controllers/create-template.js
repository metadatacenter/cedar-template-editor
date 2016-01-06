'use strict';

var CreateTemplateController = function($rootScope, $scope, $q, $routeParams, $timeout, $location, FormService, HeaderService, UrlService, StagingService, DataTemplateService, CONST, HEADER_MINI, LS) {
  // Set Page Title variable when this controller is active
  $rootScope.pageTitle = 'Template Designer';

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
      HeaderService.dataContainer.currentObjectScope = $scope.form;
    });
  } else {
    // If we're not loading an existing form then let's create a new empty $scope.form property
    $scope.form = DataTemplateService.getTemplate($rootScope.idBasePath + $rootScope.generateGUID());
    HeaderService.dataContainer.currentObjectScope = $scope.form;
  }

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

  // Add newly configured field to the element object
  $scope.addFieldToTemplate = function (fieldType) {
    // StagingService.addField();
    var field = $rootScope.generateField(fieldType);
    field.minItems = 1;
    field.maxItems = 1;
    field.properties._ui.state = "creating";

    var optionInputs = ["radio", "checkbox", "list"];
    if (optionInputs.indexOf(fieldType) > -1) {
      field.properties._ui.options = [
        {
          "text": ""
        }
      ];
    }

    // Converting title for irregular character handling
    var fieldName = $rootScope.generateGUID(); //field['@id'];

    // Adding corresponding property type to @context
    $scope.form.properties["@context"].properties[fieldName] = {};
    $scope.form.properties["@context"].properties[fieldName].enum =
      new Array($rootScope.schemasBase + fieldName);
    $scope.form.properties["@context"].required.push(fieldName);

    // Evaluate cardinality
    $rootScope.cardinalizeField(field);

    // Adding field to the element.properties object
    $scope.form.properties[fieldName] = field;
    $scope.form._ui.order = $scope.form._ui.order || [];
    $scope.form._ui.order.push(fieldName);
  };

  $scope.addElementToTemplate = function(element) {
    var clonedElement = angular.copy(element);
    clonedElement.minItems = 1;
    clonedElement.maxItems = 1;
    $rootScope.propertiesOf(clonedElement)._ui.state = "creating";

    // Converting title for irregular character handling
    var elName = $rootScope.getFieldName(clonedElement.properties._ui.title);
    // Adding corresponding property type to @context
    $scope.form.properties["@context"].properties[elName] = {};
    $scope.form.properties["@context"].properties[elName].enum =
      new Array($rootScope.schemasBase + elName);
    $scope.form.properties["@context"].required.push(elName);

    // Evaluate cardinality
    $rootScope.cardinalizeField(clonedElement);

    // Adding field to the element.properties object
    $scope.form.properties[elName] = clonedElement;
    $scope.form._ui.order = $scope.form._ui.order || [];
    $scope.form._ui.order.push(elName);
  };

  // Function to add additional options for radio, checkbox, and list fieldTypes
  $scope.addOption = function(field) {
    var emptyOption = {
      "text": ""
    };

    field.properties._ui.options.push(emptyOption);
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
      // If maxItems is N, then remove maxItems
      $rootScope.removeUnnecessaryMaxItems($scope.form.properties);

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
