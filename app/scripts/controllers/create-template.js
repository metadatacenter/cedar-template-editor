'use strict';

angularApp.controller('CreateTemplateController', function ($rootScope, $scope, $http) {

  // Set Page Title variable when this controller is active
  $rootScope.pageTitle = 'Template Creator';

  // Create staging area to create/edit fields before they get added to $scope.form.properties
  $scope.staging = {};

  // Create empty $scope.form object
  $scope.form = {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "@id": "",
    "title": "",
    "description": "",
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

    // put field into fields staging object
    $scope.staging[field.properties.value.id] = field;
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
    return $http.get('/static-data/elements/'+element+'.json').then(function(response) {
      // Convert response.data.title string to an acceptable object key string
      var titleKey = $rootScope.underscoreText(response.data.title);
      // Embed existing element into $scope.form.properties object
      $scope.form.properties[titleKey] = response.data;
    });
  };

  // Delete field from $scope.staging object
  $scope.deleteField = function (field){
    // Remove field instance from $scope.staging
    delete $scope.staging[field.properties.value.id];
  };

  // Reverts to empty form and removes all previously added fields/elements
  $scope.reset = function() {
    angular.forEach($scope.form.properties, function(value, key) {
      if ($rootScope.ignoreKey(key)) {
        delete $scope.form.properties[key];  
        delete $scope.$$childHead.formFields[key];
      }
    });
  };

  // Setting $scope variable to toggle for whether this template is a favorite
  $scope.favorite = false;

  $scope.toggleFavorite = function() {
    $scope.favorite = $scope.favorite === true ? false : true;
  }
});
