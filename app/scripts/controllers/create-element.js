'use strict';

var CreateElementController = function ($rootScope, $scope, $routeParams, $timeout, $location, FormService, HeaderService, UrlService, StagingService, DataTemplateService, CONST, HEADER_MINI, LS) {
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

  // Using form service to load list of existing elements to embed into new element
  FormService.elementList().then(function (response) {
    $scope.elementList = response;
  });

  // Load existing element if $routeParams.id parameter is supplied
  if ($routeParams.id) {
    // Fetch existing element and assign to $scope.element property
    FormService.element($routeParams.id).then(function (response) {
      $scope.element = response;
      HeaderService.dataContainer.currentObjectScope = $scope.element;

      var key = $scope.element["@id"];
      $scope.element.properties._ui.is_root = true;
      $scope.form.properties = $scope.form.properties || {};
      $scope.form.properties[key] = $scope.element;
      $scope.form._ui = $scope.form._ui || {};
      $scope.form._ui.order = $scope.form._ui.order || [];
      $scope.form._ui.order.push(key);
      $rootScope.jsonToSave = $scope.element;
    });
  } else {
    // If we're not loading an existing element then let's create a new empty $scope.element property
    $scope.element = DataTemplateService.getElement($rootScope.idBasePath + $rootScope.generateGUID());
    $scope.resetElement = angular.copy($scope.element);
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

  // Return true if element.properties object only contains default values
  $scope.isPropertiesEmpty = function () {
    if (!angular.isUndefined($scope.element)) {
      var keys = Object.keys($scope.element.properties);
      for (var i = 0; i < keys.length; i++) {
        if ($rootScope.ignoreKey(keys[i]) == false) {
          return false;
        }
      }
      return true;
    }
  };

  // Add newly configured field to the element object
  $scope.addFieldToElement = function (fieldType) {
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
    $scope.element.properties["@context"].properties[fieldName] = {};
    $scope.element.properties["@context"].properties[fieldName].enum =
      new Array($rootScope.schemasBase + fieldName);
    $scope.element.properties["@context"].required.push(fieldName);

    // Evaluate cardinality
    $rootScope.cardinalizeField(field);

    // Adding field to the element.properties object
    $scope.element.properties[fieldName] = field;
    $scope.element._ui.order.push(fieldName);

    // Lastly, remove this field from the $scope.staging object
    $scope.staging = {};
    // StagingService.moveIntoPlace();
  };

  $scope.addElementToElement = function (element) {
    // StagingService.addElement();
    var el = angular.copy(element);
    el.minItems = 1;
    el.maxItems = 1;
    $rootScope.propertiesOf(el)._ui.state = "creating";

    // Converting title for irregular character handling
    var elName = $rootScope.generateGUID(); //field['@id'];

    $scope.element.properties["@context"].properties[elName] = {};
    $scope.element.properties["@context"].properties[elName].enum = new Array($rootScope.schemasBase + elName);
    $scope.element.properties["@context"].required.push(elName);

    // Evaluate cardinality
    $rootScope.cardinalizeField(el);

    // Adding field to the element.properties object
    $scope.element.properties[elName] = el;
    $scope.element._ui.order.push(elName);
    $scope.$broadcast("form:update");
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
    swal({
        title: "Are you sure?",
        text: LS.elementEditor.clear.confirm,
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
            // StagingService.resetPage();
          });
        }
      });
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
    if (!StagingService.isEmpty()) {
      swal({
          title: "Are you sure?",
          text: LS.elementEditor.save.nonEmptyStagingConfirm,
          type: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes, save it!",
          closeOnConfirm: true,
          customClass: 'cedarSWAL',
          confirmButtonColor: null
        },
        function (isConfirm) {
          if (isConfirm) {
            $scope.doSaveElement();
          }
        });
    } else {
      $scope.doSaveElement();
    }
  }

  // Stores the element into the database
  $scope.doSaveElement = function () {
    // First check to make sure Element Name, Element Description are not blank
    $scope.elementErrorMessages = [];
    $scope.elementSuccessMessages = [];
    delete $scope.element.properties._ui.is_root;

    // If Element Name is blank, produce error message
    if (!$scope.element.properties._ui.title.length) {
      $scope.elementErrorMessages.push('Element Name input cannot be left empty.');
    }
    // If Element Description is blank, produce error message
    if (!$scope.element.properties._ui.description.length) {
      $scope.elementErrorMessages.push('Element Description input cannot be left empty.');
    }
    // If there are no Element level error messages
    if ($scope.elementErrorMessages.length == 0) {
      // Build element 'order' array via $broadcast call
      $scope.$broadcast('initOrderArray');
      // Console.log full working form example on save, just to show demonstration of something happening
      console.log('saving element...');
      console.log($scope.element);

      // If maxItems is N, then remove maxItems
      $rootScope.removeUnnecessaryMaxItems($scope.element.properties);

      // Save element
      // Check if the element is already stored into the DB
      if ($routeParams.id == undefined) {
        FormService.saveElement($scope.element).then(function (response) {
          console.log(response);
          $scope.elementSuccessMessages.push('The element \"' + response.data.properties._ui.title + '\" has been created.');
          // Reload element list
          FormService.elementList().then(function (response) {
            $scope.elementList = response;
          });
          var newId = response.data['@id'];
          //console.log("Reload element for id: " + newId);
          //console.log("URL:" + UrlService.getElementEdit(newId));
          $timeout(function () {
            $location.path(UrlService.getElementEdit(newId));
          }, 500);
        }).catch(function (err) {
          $scope.elementErrorMessages.push("Problem creating the element.");
          console.log(err);
        });
      }
      // Update element
      else {
        var id = $scope.element['@id'];
        delete $scope.element['@id'];
        FormService.updateElement(id, $scope.element).then(function (response) {
          $scope.elementSuccessMessages.push('The element \"' + response.data.title + '\" has been updated.');
        }).catch(function (err) {
          $scope.elementErrorMessages.push("Problem updating the element.");
          console.log(err);
        });
      }
    }
  }

  // This function watches for changes in the properties._ui.title field and autogenerates the schema title and description fields
  $scope.$watch('element.properties._ui.title', function (v) {
    if (!angular.isUndefined($scope.element)) {
      var title = $scope.element.properties._ui.title;
      if (title.length > 0) {
        $scope.element.title = $rootScope.capitalizeFirst(title) + ' element schema';
        $scope.element.description = $rootScope.capitalizeFirst(title) + ' element schema autogenerated by the CEDAR Template Editor';
      }
      else {
        $scope.element.title = "";
        $scope.element.description = "";

      }
    }
  });
};

CreateElementController.$inject = ["$rootScope", "$scope", "$routeParams", "$timeout", "$location", "FormService", "HeaderService", "UrlService", "StagingService", "DataTemplateService", "CONST", "HEADER_MINI", "LS"];
angularApp.controller('CreateElementController', CreateElementController);
