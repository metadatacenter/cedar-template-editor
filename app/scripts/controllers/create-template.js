'use strict';

angularApp.controller('CreateTemplateController', function ($rootScope, $scope, $q, $routeParams, FormService) {

  // Set Page Title variable when this controller is active
  $rootScope.pageTitle = 'Template Creator';
  // Create staging area to create/edit fields before they get added to $scope.form.properties
  $scope.staging = {};
  // Setting default false flag for $scope.favorite
  $scope.favorite = false;

  // Load existing form if $routeParams.id parameter is supplied
  if ($routeParams.id) {
    // Fetch existing form and assign to $scope.form property
    FormService.form($routeParams.id).then(function(response) {
      $scope.form = response;
    });
  } else {
    // If we're not loading an existing form then let's create a new empty $scope.form property
    $scope.form = {
      "$schema": "http://json-schema.org/draft-04/schema#",
      "@id": "",
      "title": "",
      "description": "",
      "favorite": $scope.favorite,
      "guid": $rootScope.generateGUID(),
      "pages": [],
      "type": "object",
      "properties": {
        "@context": {
          "type": [
            "object",
            "string",
            "array",
            "null"
          ]
        },
        "@id": {
          "type": "string",
          "format": "uri"
        },
        "@type": {
          "enum": [
            "http://metadatacenter.org/schemas/BasicStudyDesign"
          ]
        }
      },
      "required": [
        "@context",
        "@id",
        "@type"
      ],
      "additionalProperties" : false
    };
  }

  // Return true if form.properties object only contains default values
  $scope.isPropertiesEmpty = function() {
    if ($scope.form) {
      return  Object.keys($scope.form.properties).length > 3 ? false : true;
    }
  };

  // Add new field into $scope.staging object
  $scope.addFieldToStaging = function(fieldType) {

    var field = {
      "$schema": "http://json-schema.org/draft-04/schema#",
      "@id": "",
      "type": "object",
      "properties": {
        "@type": {
          "enum": []
        },
        "value": {
          "type": "string",
          "id" : $rootScope.generateGUID(),
          "title" : "",
          "description": "",
          "input_type" : fieldType,
          "required" : false,
          "created_at": Date.now()
        }
      },
      "required": [
        "@type",
        "value"
      ],
      "additionalProperties": false
    };

    // If fieldtype can have multiple options, additional parameters on field object are necessary
    var optionInputs = ["radio", "checkbox", "list"];

    if (optionInputs.indexOf(fieldType) > -1) {
      field.properties.value.options = [
        {
          "text": ""
        }
      ];
    }

    // put field into fields staging object
    $scope.staging[field.properties.value.id] = field;
  };

  // Function to add additional options for radio, checkbox, and list fieldTypes
  $scope.addOption = function(field) {
    //console.log(field.properties.value);
    var emptyOption = {
      "text": ""
    };

    field.properties.value.options.push(emptyOption);
  };

  // Add newly configured field to the the $scope.form.properties object
  $scope.addFieldToForm = function(field) {
    // Converting title for irregular character handling
    var underscoreTitle = $rootScope.underscoreText(field.properties.value.title);
    // Adding field to the element.properties object
    $scope.form.properties[underscoreTitle] = field;

    // Lastly, remove this field from the $scope.staging object
    delete $scope.staging[field.properties.value.id];
  };

  // Add existing element into the $scope.form.properties object
  $scope.addExistingElement = function(element) {
    // Fetch existing element json data
    FormService.element(element).then(function(response) {
      // Convert response.data.title string to an acceptable object key string
      var titleKey = $rootScope.underscoreText(response.title);
      // Embed existing element into $scope.form.properties object
      $scope.form.properties[titleKey] = response;
    });
  };

  // Delete field from $scope.staging object
  $scope.deleteField = function (field){
    // Remove field instance from $scope.staging
    delete $scope.staging[field.properties.value.id];
  };

  // Reverts to empty form and removes all previously added fields/elements
  $scope.reset = function() {
    // Reset both the form formFields object and formFieldsOrder array to empty 
    $scope.$$childTail.formFields = {};
    $scope.$$childTail.formFieldsOrder = [];
    // Loop through $scope.form.properties object and delete each field leaving default json-ld syntax in place
    angular.forEach($scope.form.properties, function(value, key) {
      if ($rootScope.ignoreKey(key)) {
        delete $scope.form.properties[key];  
      }
    });
  };

  $scope.addToPages = function() {
    var orderArray = [],
        dimension = 0;
    // Return promise so $scope.saveTemplate can submit $scope.form once $scope.form.pages array is properly filled
    return $q(function(resolve, reject) {
      // loop through $scope.$$childTail.formFieldsOrder and build pages array
      angular.forEach($scope.$$childTail.formFieldsOrder, function(field, index) {
        // If item added is of type Page Break, jump into next page array for storage of following fields
        if ($scope.form.properties[field].properties.value && $scope.form.properties[field].properties.value.input_type == 'page-break') {
          dimension ++;
        }
        // Push field key into page array
        orderArray[dimension] = orderArray[dimension] || [];
        orderArray[dimension].push(field);
      });
      // Resolve promise
      resolve(orderArray);
    });
  };

  $scope.saveTemplate = function() {
    $scope.addToPages().then(function(result) {
      // Assigning array returned from $scope.addToPages to $scope.form.pages property
      $scope.form.pages = result;
      // Console.log full working form example on save
      console.log($scope.form);
      // Database service save() call could go here
    });
  };

  // Setting $scope variable to toggle for whether this template is a favorite
  $scope.toggleFavorite = function() {
    $scope.favorite = $scope.favorite === true ? false : true;
    $scope.form.favorite = $scope.favorite;
  }
});
