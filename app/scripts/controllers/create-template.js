'use strict';

angularApp.controller('CreateTemplateController', function ($rootScope, $scope, FormService, $http) {

  // Set Page Title variable when this controller is active
  $rootScope.pageTitle = 'Template Creator';

  // Create staging area to create/edit fields before they get added to $scope.form.properties
  $scope.staging = {};

  // Temporary variable on $scope used to tell if any elements or fields have been added to the form yet
  $scope.anyProperties = false;

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

  // Add new field into $scope.staging object
  $scope.addFieldToStaging = function(fieldType) {};

  // Add newly configured field to the the $scope.form.properties object
  $scope.addFieldToForm = function(field) {

    // Change anyProperties boolean now that a field has been added to the form
    $scope.anyProperties = true;
  };

  // Add existing element into the $scope.form.properties object
  $scope.addExistingElement = function(element) {
    // Fetch existing element json data
    return $http.get('/static-data/elements/'+element+'.json').then(function(response) {
      // Convert response.data.title string to an acceptable object key string
      var titleKey = $rootScope.underscoreText(response.data.title);
      // Embed existing element into $scope.form.properties object
      $scope.form.properties[titleKey] = response.data;
      // Change anyProperties boolean now that an element has been added to the form
      $scope.anyProperties = true;
    });
  };

  // Delete field from $scope.staging object and also $scope.form.properties object
  $scope.deleteField = function() {};

  // Reverts to empty form and removes all previously added fields/elements
  $scope.reset = function() {};
});
