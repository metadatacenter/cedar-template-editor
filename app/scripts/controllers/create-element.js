'use strict';

angularApp.controller('CreateElementController', function ($rootScope, $scope, $http) {

  // Set page title variable when this controller is active
  $rootScope.pageTitle = 'Element Creator';

  // Create staging area to create/edit fields before they get added to the element
  $scope.staging = {};

  // Empty $scope object used to store values that get converted to their json-ld counterparts on the $scope.element object
  $scope.volatile = {};

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

  // Return true if element.properties object only contains default values
  $scope.isPropertiesEmpty = function() {
    return  Object.keys($scope.element.properties).length > 1 ? false : true;
  };

  // Add new field into $scope.staging object
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

  // Add newly configured field to the element object
  $scope.addFieldToElement = function(field) {
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
      // Add existing element to the $scope.element.properties object with it's title converted to an object key
      var titleKey = $rootScope.underscoreText(response.data.title);
      $scope.element.properties[titleKey] = response.data;
    });
  };

  // Delete field from $scope.staging object
  $scope.deleteField = function (field){
    // Remove field instance from $scope.staging
    delete $scope.staging[field.properties.value.id];
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
