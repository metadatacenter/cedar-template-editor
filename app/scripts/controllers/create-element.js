'use strict';

angularApp.controller('CreateElementController', function ($rootScope, $scope, $dialog, FormService, $http) {

  // Set page title variable when this controller is active
  $rootScope.pageTitle = 'Element Creator';

  // Create staging area to create/edit fields before they get added to the element
  $scope.staging = {};

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

  // Generating a RFC4122 version 4 compliant GUID
  $scope.generateGUID = function() {
    var d = Date.now();
    var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return guid;
  };

  // Add new field into staging area
  $scope.addFieldToStaging = function(fieldType){

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
          "id" : $scope.generateGUID(),
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
  }

  // Add newly configured field to the element object
  $scope.addFieldToElement = function(field) {
    // Converting title for irregular character handling
    var underscoreTitle = $rootScope.underscoreText(field.properties.value.title);

    $scope.element.properties[underscoreTitle] = field;
  };

  // Add existing element to the element object
  $scope.embedExistingElement = function(element) {
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

    // Remove field instance from the staging area
    delete $scope.staging[value.id];

    // If field has been added to the element.properties object, remove this also
    if($scope.element.properties[underscoreTitle]) {
      delete $scope.element.properties[underscoreTitle];
    }
  };

});
