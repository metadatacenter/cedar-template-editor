'use strict';

angularApp.controller('CreateTemplateController', function($rootScope, $scope, $q, $routeParams, FormService) {

  // Set Page Title variable when this controller is active
  $rootScope.pageTitle = 'Template Creator';
  // Create staging area to create/edit fields before they get added to $scope.form.properties
  $scope.staging = {};
  // Setting default false flag for $scope.favorite
  //$scope.favorite = false;
  // Setting form preview setting to false by default
  $scope.formPreview = false;

  // Using form service to load list of existing elements to embed into new form
  FormService.elementList().then(function(response) {
    $scope.elementList = response;
  });

  // Load existing form if $routeParams.id parameter is supplied
  if ($routeParams.id) {
    // Fetch existing form and assign to $scope.form property
    FormService.form($routeParams.id).then(function(response) {
      $scope.form = response;
      // Set form preview to true so the preview is viewable onload
      $scope.formPreview = true;
    });
  } else {
    // If we're not loading an existing form then let's create a new empty $scope.form property
    $scope.form = {
      "$schema": "http://json-schema.org/draft-04/schema#",
      "@id": $rootScope.idBasePath + $rootScope.generateGUID(),
      "title": "",
      "description": "",
      //"favorite": $scope.favorite,
      //"guid": $rootScope.generateGUID(),
      "pages": [],
      "type": "object",
      "properties": {
        "@context": {
          "properties": {
            "value": {
              "enum": ["https://schema.org/value"]
            },
          },
          "required": ["value"],
          "additionalProperties": false
        },
        "@id": {
          "type": "string",
          "format": "uri"
        },
        "@type": {
          "oneOf": [
            {
              "type": "string",
              "format": "uri"
            },
            {
              "type": "array",
              "minItems": 1,
              "items": {
                "type": "string",
                "format": "uri"
              },
              "uniqueItems": true
            }
          ]
        },
        "template_id" : {
          "type": "string",
          "format": "uri"
        },
        "info": {
          "title": "",
          "description": "",
        },
      },
      "required": [
        "@id", "template_id"
      ],
      "additionalProperties": false
    };
  }

  // Return true if form.properties object only contains default values
  //$scope.isPropertiesEmpty = function() {
  //  if ($scope.form) {
  //    return Object.keys($scope.form.properties).length > 3 ? false : true;
  //  }
  //};
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

  // Add new field into $scope.staging object
  $scope.addFieldToStaging = function(fieldType) {

    var field = $rootScope.generateField(fieldType);

    // If fieldtype can have multiple options, additional parameters on field object are necessary
    var optionInputs = ["radio", "checkbox", "list"];

    if (optionInputs.indexOf(fieldType) > -1) {
      field.properties.info.options = [
        {
          "text": ""
        }
      ];
    }
    // empty staging object (only one field should be configurable at a time)
    $scope.staging = {};
    // put field into fields staging object
    $scope.staging[field['@id']] = field;

  };

  $scope.addElementToStaging = function(element) {
    $scope.staging = {};
    $scope.staging[element['@id']] = element;
  };

  // Function to add additional options for radio, checkbox, and list fieldTypes
  $scope.addOption = function(field) {
    //console.log(field.properties.value);
    var emptyOption = {
      "text": ""
    };

    field.properties.info.options.push(emptyOption);
  };

  // Add newly configured field to the the $scope.form.properties object
  $scope.addFieldToForm = function(field) {
    // Setting return value from $scope.checkFieldConditions to array which will display error messages if any
    $scope.stagingErrorMessages = $scope.checkFieldConditions(field.properties);

    if ($scope.stagingErrorMessages.length == 0) {
      // Converting title for irregular character handling
      var underscoreTitle = $rootScope.underscoreText(field.properties.info.title);
      // Adding corresponding property type to @context
      $scope.form.properties["@context"].properties[underscoreTitle] = {};
      $scope.form.properties["@context"].properties[underscoreTitle].enum =
        new Array($rootScope.schemasBase + underscoreTitle);
      $scope.form.properties["@context"].required.push(underscoreTitle);

      // Evaluate cardinality
      $rootScope.cardinalizeField(field);

      // Adding field to the element.properties object
      $scope.form.properties[underscoreTitle] = field;

      // Lastly, remove this field from the $scope.staging object
      delete $scope.staging[field['@id']];
    }
  };

  $scope.checkFieldConditions = function(field) {
    // Empty array to push 'error messages' into
    var unmetConditions = [],
      extraConditionInputs = ['checkbox', 'radio', 'list'];

    // Field title is already required, if it's empty create error message
    if (!field.info.title.length) {
      unmetConditions.push('"Enter Field Title" input cannot be left empty.');
    }
    // If field is within multiple choice field types
    if (extraConditionInputs.indexOf(field.info.input_type) !== -1) {
      var optionMessage = '"Enter Option" input cannot be left empty.';
      angular.forEach(field.options, function(value, index) {
        // If any 'option' title text is left empty, create error message
        if (!value.text.length && unmetConditions.indexOf(optionMessage) == -1) {
          unmetConditions.push(optionMessage);
        }
      });
    }
    // If field type is 'radio' or 'pick from a list' there must be more than one option created
    if ((field.info.input_type == 'radio' || field.info.input_type == 'list') && field.options && (field.options.length <= 1)) {
      unmetConditions.push('Multiple Choice fields must have at least two possible options');
    }
    // Return array of error messages
    return unmetConditions;
  };

  $scope.addExistingElement = function(element) {
    // Fetch existing element json data
    //FormService.element(element).then(function(response) {
    // Convert response.data.title string to an acceptable object key string
    var titleKey = $rootScope.underscoreText(element.properties.info.title);

    // Add existing element to the $scope.element.properties object with it's title converted to an object key
    var titleKey = $rootScope.underscoreText(element.properties.info.title);
    // Adding corresponding property type to @context
    $scope.form.properties["@context"].properties[titleKey] = {};
    $scope.form.properties["@context"].properties[titleKey].enum =
      new Array($rootScope.schemasBase + titleKey);
    $scope.form.properties["@context"].required.push(titleKey);

    // Embed existing element into $scope.form.properties object
    $scope.form.properties[titleKey] = element;
    //});
  };

  // Delete field from $scope.staging object
  $scope.deleteField = function(field) {
    // Remove field instance from $scope.staging
    delete $scope.staging[field['@id']];
    // Empty the Error Messages array if present
    if ($scope.stagingErrorMessages) {
      $scope.stagingErrorMessages = [];
    }
  };

  // Reverts to empty form and removes all previously added fields/elements
  $scope.reset = function() {
    // Loop through $scope.form.properties object and delete each field leaving default json-ld syntax in place
    angular.forEach($scope.form.properties, function(value, key) {
      if (!$rootScope.ignoreKey(key)) {
        delete $scope.form.properties[key];
      }
    });
    // Broadcast the reset event which will trigger the emptying of formFields formFieldsOrder 
    $scope.$broadcast('resetForm');
  };

  // Setting $scope variable to toggle for whether this template is a favorite
  //$scope.toggleFavorite = function() {
  //  $scope.favorite = $scope.favorite === true ? false : true;
  //  $scope.form.favorite = $scope.favorite;
  //};

  // Stores the template into the database
  $scope.saveTemplate = function() {
    // First check to make sure Template Name, Template Description are not blank
    $scope.templateErrorMessages = [];
    $scope.templateSuccessMessages = [];
    // If Template Name is blank, produce error message
    if (!$scope.form.properties.info.title.length) {
      $scope.templateErrorMessages.push('Template Name input cannot be left empty.');
    }
    // If Template Description is blank, produce error message
    if (!$scope.form.properties.info.description.length) {
      $scope.templateErrorMessages.push('Template Description input cannot be left empty.');
    }
    // If there are no Template level error messages
    if ($scope.templateErrorMessages.length == 0) {
      // Broadcast the initialize Page Array event which will trigger the creation of the $scope.form 'pages' array
      $scope.$broadcast('initPageArray');
      // Save template
      if ($routeParams.id == undefined) {
        FormService.saveTemplate($scope.form).then(function(response) {
          $scope.templateSuccessMessages.push('The template \"' + response.data.properties.info.title + '\" has been created.');
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
          $scope.templateSuccessMessages.push('The template \"' + response.data.properties.info.title + '\" has been updated.');
        }).catch(function(err) {
          $scope.templateErrorMessages.push('Problem updating the template.');
          console.log(err);
        });
      }
    }
  };

  // Event listener for when the pages array is finished building
  $scope.$on('finishPageArray', function(event, orderArray) {
    // Assigning array returned to $scope.form.pages property
    $scope.form.pages = orderArray;
    // Console.log full working form example on save
    console.log($scope.form);
    // Database service save() call could go here
  });

  // This function watches for changes in the properties.info.title field and autogenerates the schema title and description fields
  $scope.$watch('form.properties.info.title', function(v){
    if (!angular.isUndefined($scope.form)) {
      var title = $scope.form.properties.info.title;
      if (title.length > 0) {
        $scope.form.title = $rootScope.capitalizeFirst($scope.form.properties.info.title) + ' template schema';
        $scope.form.description = $rootScope.capitalizeFirst($scope.form.properties.info.title) + ' template schema autogenerated by the CEDAR Template Editor';
      }
      else {
        $scope.form.title = "";
        $scope.form.description = "";

      }
    }
  });

});
