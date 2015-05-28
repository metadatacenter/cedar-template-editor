'use strict';

angularApp.controller('CreateElementController', function ($rootScope, $scope, $dialog, FormService, $http) {

  // Set page title variable when this controller is active
  $rootScope.pageTitle = 'Element Creator';

  // Create staging area to create/edit fields before they get added to the element
  $scope.staging = {};

  // Empty $scope object used to store values that get converted to their json-ld counterparts on the $scope.element object
  $scope.volatile = {};

  // $scope variable used to tell if any elements or fields have been added to the form yet
  $scope.anyProperties = false;

  // Create empty element object
  $scope.element = {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "@id": "",
    "@type": "",
    "title": "",
    "description": "",
    "guid": $rootScope.generateGUID(),
    "type": "object",
    "properties": {
      "@type": {
        "enum": []
      }
    },
    "required": [
      "@type"
    ],
    "additionalProperties": false
  };

  // Add new field into staging area
  $scope.addFieldToStaging = function(fieldType){

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
    }

    // put field into fields staging object
    $scope.staging[field.properties.value.id] = field;
  };

  // Add newly configured field to the element object
  $scope.addFieldToElement = function(field) {

    // Change anyProperties boolean now that a field has been added to the form
    $scope.anyProperties = true;

    // Converting title for irregular character handling
    var underscoreTitle = $rootScope.underscoreText(field.properties.value.title);
    // Adding field to the element.properties object
    $scope.element.properties[underscoreTitle] = field;

    // Lastly, remove this field from the $scope.staging object
    delete $scope.staging[field.properties.value.id];
  };

  // Add existing element to the element object
  $scope.addExistingElement = function(element) {
    // Fetch existing element json data
    return $http.get('/static-data/elements/'+element+'.json').then(function(response) {
      // Loop through properties object skipping json-LD schematics and grab each field
      angular.forEach(response.data.properties, function(object, key) {
        if ($rootScope.ignoreKey(key)) {
          // Add each field from existing element to new element staging area
          $scope.staging[object.properties.value.id] = object;
        }
      });
    });
  };

  // Delete field from $scope.staging object and also $scope.element.properties object
  $scope.deleteField = function (field){

    var value = field.properties.value,
        underscoreTitle = $rootScope.underscoreText(value.title);

    // Remove field instance from $scope.staging
    delete $scope.staging[value.id];

    // If field has been added to the $scope.element.properties object, remove this also
    if($scope.element.properties[underscoreTitle]) {
      delete $scope.element.properties[underscoreTitle];
    }
  };

  // Helper function for converting $scope.volatile values to json-ld '@' keys
  $scope.convertVolatile = function() {
    for (var key in $scope.volatile) {
      if ($scope.volatile.hasOwnProperty(key)) {
        $scope.element['@' + key] = $scope.volatile[key];
      }
    }
  };

});
