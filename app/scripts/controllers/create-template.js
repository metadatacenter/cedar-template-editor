'use strict';

angularApp.controller('CreateTemplateController', function ($rootScope, $scope, $http) {

  // Set Page Title variable when this controller is active
  $rootScope.pageTitle = 'Template Creator';

  // Create staging area to create/edit fields before they get added to $scope.form.properties
  $scope.staging = {};

  // Setting $scope variable to toggle for whether this template is a favorite
  $scope.favorite = false;
  $scope.toggleFavorite = function() {
    $scope.favorite = $scope.favorite === true ? false : true;
    $scope.form.favorite = $scope.favorite;
  }

  // Create empty $scope.form object
  $scope.form = {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "@id": "",
    "title": "",
    "description": "",
    "favorite": $scope.favorite,
    "guid": $rootScope.generateGUID(),
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

  // Return true if form.properties object only contains default values
  $scope.isPropertiesEmpty = function() {
    return  Object.keys($scope.form.properties).length > 3 ? false : true;
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
  //$scope.addExistingElement = function(element) {
  //  // Fetch existing element json data
  //  return $http.get('/static-data/elements/'+element+'.json').then(function(response) {
  //    // Convert response.data.title string to an acceptable object key string
  //    var titleKey = $rootScope.underscoreText(response.data.title);
  //    // Embed existing element into $scope.form.properties object
  //    $scope.form.properties[titleKey] = response.data;
  //  });
  //};
  $scope.addExistingElement = function(element) {
    var titleKey = $rootScope.underscoreText(element.title);
    // Embed existing element into $scope.form.properties object
    $scope.form.properties[titleKey] = element;
  };

  // Function to load existing elements from database
  $scope.loadElements = function() {
    $http.get('http://localhost:9000/template_elements').
      success(function(data) {
        $scope.elements = data;
      }).
      error(function(data, status, headers, config) {
        // Do something
      });
  }

  // Load existing elements
  $scope.loadElements();

  // Alerts
  $scope.resetAlerts = function() {
    $scope.alerts = [];
  }

  $scope.addAlert = function(type, msg) {
    $scope.alerts.push({type: type, msg: msg});
  };

  $scope.closeAlert = function(index) {
    $scope.alerts.splice(index, 1);
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

  // Stores the template into the database
  $scope.store = function() {
    $scope.resetAlerts();
    // Check that the element name is not empty
    if ($scope.form.title.length == 0) {
      $scope.addAlert('danger', 'Please provide a name for the Template.');
    }
    else {
      var json = angular.toJson($scope.form);
      console.log(json);
      $http.post('http://localhost:9000/templates', json).
        success(function(data) {
          $scope.addAlert('success', 'The template \"' + data.title + '\" has been created.');
        }).
        error(function(data, status, headers, config) {
          $scope.addAlert('danger', "Problem creating the template.");
        });
    }
  };
  
});
