'use strict';

angularApp.controller('CreateElementController', function ($rootScope, $scope, $dialog, FormService) {

    // Set page title variable when this controller is active
    $rootScope.pageTitle = 'Element Creator';

    // Create empty element object
    $scope.element = {
      "$schema": "",
      "@id": "",
      "title": "",
      "type": "object",
      "description": "",
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

    // add new field drop-down:
    $scope.addField = {};
    $scope.addField.lastAddedID = 0;

    // Create staging area to create/edit fields before they get added to the element
    $scope.staging = {};

    // Simple function to check if an object is empty
    $scope.isEmpty = function(obj) {
      return Object.keys(obj).length;
    };

    // Helper function
    $scope.underscoreText = function(string) {
      return string.replace(/ +/g,"_").toLowerCase();
    };

    // Add new field into staging area
    $scope.addFieldToStaging = function(fieldType){
      // incr field_id counter
      $scope.addField.lastAddedID++;

      var field = {

        "$schema": "",
        "@id": "",
        "type": "object",
        "properties": {
          "@type": {
            "enum": []
          },
          "value": {
            "type": "string",
            "id" : $scope.addField.lastAddedID,
            "title" : "",
            "description": "",
            "input_type" : fieldType,
            "required" : false,
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
    }

    // Add newly configured field to the Element object
    $scope.addFieldToElement = function(field) {
      // Converting title for irregular character handling
      var underscoreTitle = $scope.underscoreText(field.properties.value.title);

      $scope.element.properties[underscoreTitle] = field;
    };

    // Delete field from $scope.staging object and also $scope.element.properties object
    $scope.deleteField = function (field){

      var value = field.properties.value,
          underscoreTitle = $scope.underscoreText(value.title);

      // Remove field instance from the staging area
      delete $scope.staging[value.id];

      // If field has been added to the element.properties object, remove this also
      if($scope.element.properties[underscoreTitle]) {
        delete $scope.element.properties[underscoreTitle];
      }
    }

});
