'use strict';

angularApp.controller('CreateElementController', function ($rootScope, $scope, $routeParams, FormService) {

  // Set page title variable when this controller is active
  $rootScope.pageTitle = 'Element Creator';
  // Create staging area to create/edit fields before they get added to the element
  $scope.staging = {};
  // Create staging area for cardinaltiy
  $scope.cardStaging = {};
  // Setting default false flag for $scope.favorite
  //$scope.favorite = false;
  // Empty $scope object used to store values that get converted to their json-ld counterparts on the $scope.element object
  $scope.volatile = {};
  // Setting form preview setting to false by default
  $scope.formPreview = false;

  // Min/max items cardinatliy
  $scope.minItems = 0;
  $scope.maxItems = 0;
  $scope.numCardItems = 0;
  $scope.numItems = 0; // multi list tracking
  $scope.thisGUID = 0;

  var titleList = [];

  $scope.elementID = $rootScope.idBasePath + $rootScope.generateGUID();

  // Using form service to load list of existing elements to embed into new element
  FormService.elementList().then(function(response) {
    $scope.elementList = response;
  });

  // Load existing element if $routeParams.id parameter is supplied
  if ($routeParams.id) {
    // Fetch existing element and assign to $scope.element property
    FormService.element($routeParams.id).then(function(response) {
      $scope.element = response;
      // Set form preview to true so the preview is viewable onload
      $scope.formPreview = true;
    });
  } else {

    var initElement = {
      // "f1": {

        // "$schema": "http://json-schema.org/draft-04/schema#",
        // "@id": $rootScope.idBasePath + $rootScope.generateGUID(),

        "type": "array",
        "items" : [],
        "minItems" : 1,
        "maxItems" : 1
      // }
    };

    $scope.elements = {
      // "f1": {
      //   "type": "array",
      //   "items" : [],
      //   "minItems" : 0,
      //   "maxItems" : 0
      // }
    };

    // If we're not loading an existing element then let's create a new empty $scope.element property
    $scope.element = {
      "$schema": "http://json-schema.org/draft-04/schema#",
      "@id": $rootScope.idBasePath + $rootScope.generateGUID(),
      //"@type": "",
      "title": "",
      "description": "",
      //"favorite": $scope.favorite,
      "order": [],
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
        "@type": {
          "oneOf": [
            {
              "type": "string",
              "format": "uri",
              "enum": []
            },
            {
              "type": "array",
              "minItems": 1,
              "items": {
                "type": "string",
                "format": "uri",
                "enum": []
              },
              "uniqueItems": true
            }
          ]
        },
        "info": {
          "title": "",
          "description": "",
        },
      },
      "additionalProperties": false
    };
  }



  // Return true if element.properties object only contains default values
  //$scope.isPropertiesEmpty = function() {
  //  if ($scope.element) {
  //    return Object.keys($scope.element.properties).length > 1 ? false : true;
  //  }
  //};
  $scope.isPropertiesEmpty = function() {
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

  // Add new field into $scope.staging object
  $scope.addFieldToStaging = function(fieldType) {
    console.log("elements before" + JSON.stringify($scope.elements,null,2))
    var field = $rootScope.generateField(fieldType);
    // If fieldtype can have multiple options, additional parameters on field object are necessary
    var optionInputs = ["@fio", "checkbox", "list"];

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


  /**
   * Add an empty element json array to our elements list
   */
  $scope.addInitElement = function(title) {
    console.log('num items: ' + $scope.numItems );
    $scope.numItems++;
    // $scope.elements['f' + ($scope.numItems)] = angular.copy(initElement);
    $scope.elements[title] = angular.copy(initElement);
  }



  // Function to add additional options for @fio, checkbox, and list fieldTypes
  $scope.addOption = function(field) {
    console.log('addOption (field): ' + JSON.stringify(field.properties.value, null, 2));
    var emptyOption = {
      "text": ""
    };

    field.properties.info.options.push(emptyOption);
  };

  // Add newly configured field to the element object
  $scope.addFieldToElement = function(field) {
    // Setting return value from $scope.checkFieldConditions to array which will display error messages if any
    $scope.stagingErrorMessages = $scope.checkFieldConditions(field.properties);

    if ($scope.stagingErrorMessages.length == 0) {
      // Converting title for irregular character handling
      var underscoreTitle = $rootScope.underscoreText(field.properties.info.title);
      // Adding corresponding property type to @context
      $scope.element.properties["@context"].properties[underscoreTitle] = {};
      $scope.element.properties["@context"].properties[underscoreTitle].enum =
        new Array($rootScope.schemasBase + underscoreTitle);
      $scope.element.properties["@context"].required.push(underscoreTitle);
      // Adding field to the element.properties object
      $scope.element.properties[underscoreTitle] = field;

      titleList.push(underscoreTitle);
      console.log('test: ' + JSON.stringify(underscoreTitle,null,2));


      $scope.addInitElement(underscoreTitle);

      // console.log('staging: ' + JSON.stringify($scope.staging,null,2));
      // $scope.elements['f' + $scope.numItems].maxItems = $scope.maxItems;
      // $scope.elements['f' + $scope.numItems].minItems = $scope.minItems;
      // $scope.elements['f' + ($scope.numItems)].items = angular.copy($scope.staging);

      $scope.elements[underscoreTitle].maxItems = $scope.maxItems;
      $scope.elements[underscoreTitle].minItems = $scope.minItems;
      $scope.elements[underscoreTitle].items = angular.copy($scope.staging);

      // Lastly, remove this field from the $scope.staging object
      delete $scope.staging[field['@id']];

    }
  };

  $scope.checkFieldConditions = function(field) {
    // Empty array to push 'error messages' into
    var unmetConditions = [],
        extraConditionInputs = ['checkbox', '@fio', 'list'];

    // Field title is already required, if it's empty create error message
    if (!field.info.title.length) {
      unmetConditions.push('"Enter Field Title" input cannot be left empty.');
    }

    // If field is within multiple choice field types
    if (extraConditionInputs.indexOf(field.info.input_type) !== -1 ) {
      var optionMessage = '"Enter Option" input cannot be left empty.';
      angular.forEach(field.info.options, function(value, index) {
        // If any 'option' title text is left empty, create error message
        if (!value.text.length && unmetConditions.indexOf(optionMessage) == -1) {
          unmetConditions.push(optionMessage);
        }
      });
    }
    // If field type is '@fio' or 'pick from a list' there must be more than one option created
    if ((field.info.input_type == '@fio' || field.info.input_type == 'list') && field.info.options && (field.info.options.length <= 1)) {
      unmetConditions.push('Multiple Choice fields must have at least two possible options');
    }
    // Return array of error messages
    return unmetConditions;
  };

  // Add existing element to the element object
  //$scope.addExistingElement = function(element) {
  //  // Fetch existing element json data
  //  return $http.get('/static-data/elements/' + element + '.json').then(function(response) {
  //    // Add existing element to the $scope.element.properties object with it's title converted to an object key
  //    var titleKey = $rootScope.underscoreText(response.data.title);
  //    $scope.element.properties[titleKey] = response.data;
  //  });
  //};
  $scope.addExistingElement = function(element) {
    console.log('ading existing element: ' + JSON.stringify(element,null,2));
    // Fetch existingelement json data
    //FormService.element(element).then(function(response) {

    // Add existing element to the $scope.element.properties object with it's title converted to an object key
    var titleKey = $rootScope.underscoreText(element.properties.info.title);
    // Adding corresponding property type to @context
    $scope.element.properties["@context"].properties[titleKey] = {};
    $scope.element.properties["@context"].properties[titleKey].enum =
      new Array($rootScope.schemasBase + titleKey);
    $scope.element.properties["@context"].required.push(titleKey);

    // Add existing element to the $scope.element.properties object
    $scope.element.properties[titleKey] = element;
    //});

    console.log('scope element: ' + JSON.stringify($scope.element,null,2));
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

  // Helper function for converting $scope.volatile values to json-ld '@' keys
  $scope.convertVolatile = function() {
    for (var key in $scope.volatile) {
      if ($scope.volatile.hasOwnProperty(key)) {
        $scope.element['@' + key] = $scope.volatile[key];
      }
    }
  };

  // Reverts to empty form and removes all previously added fields/elements
  $scope.reset = function() {
    // Loop through $scope.element.properties object and delete each field leaving default json-ld syntax in place
    angular.forEach($scope.element.properties, function(value, key) {
      if (!$rootScope.ignoreKey(key)) {
        delete $scope.element.properties[key];
      }
    });
    // Broadcast the reset event which will trigger the emptying of formFields formFieldsOrder
    $scope.$broadcast('resetForm');
  };

  // Setting $scope variable to toggle for whether this template is a favorite
  //$scope.toggleFavorite = function() {
  //  $scope.favorite = $scope.favorite === true ? false : true;
  //  $scope.element.favorite = $scope.favorite;
  //};

  // Stores the element into the database
  $scope.saveElement = function() {
    // First check to make sure Element Name, Element Description are not blank
    $scope.elementErrorMessages = [];
    $scope.elementSuccessMessages = [];
    // If Element Name is blank, produce error message
    if (!$scope.element.properties.info.title.length) {
      $scope.elementErrorMessages.push('Element Name input cannot be left empty.');
    }
    // If Element Description is blank, produce error message
    if (!$scope.element.properties.info.description.length) {
      $scope.elementErrorMessages.push('Element Description input cannot be left empty.');
    }
    // If there are no Element level error messages
    if ($scope.elementErrorMessages.length == 0) {
      // Build element 'order' array via $broadcast call
      $scope.$broadcast('initOrderArray');
      // Console.log full working form example on save, just to show demonstration of something happening
      console.log('saving element...');
      console.log(JSON.stringify($scope.element,null,2));
      // Save element
      // Check if the element is already stored into the DB
      if ($routeParams.id == undefined) {


    //////////
        // remove old fields
        for (var i=0; i < titleList.length; i++) {
          delete $scope.element.properties[titleList[i]];
          console.log('deleted: ' + titleList[i]);
        }
        // merge new elements structure to the properties object
        $scope.element.properties = $rootScope.merge($scope.element.properties, $scope.elements);
        console.log(JSON.stringify($scope.element.properties,null,2));
    //////////

        console.log('element: ' + JSON.stringify($scope.element,null,2));

        // FormService.saveElement($scope.elements).then(function(response) {
        FormService.saveElement($scope.element).then(function(response) {
          console.log(response);
          $scope.elementSuccessMessages.push('The element \"' + response.data.properties.info.title + '\" has been created.');
          // Reload element list
          FormService.elementList().then(function(response) {
            $scope.elementList = response;
          });
        }).catch(function(err) {
          $scope.elementErrorMessages.push("Problem creating the element.");
          console.log(err);
        });
      }
      // Update element
      else {
        var id = $scope.element['@id'];
        delete $scope.element['@id'];
        FormService.updateElement(id, $scope.element).then(function(response) {
          $scope.elementSuccessMessages.push('The element \"' + response.data.title + '\" has been updated.');
        }).catch(function(err) {
          $scope.elementErrorMessages.push("Problem updating the element.");
          console.log(err);
        });
      }
    }
  }

  // Build $scope.element.order array
  $scope.$on('finishOrderArray', function(event, orderArray) {
    $scope.element.order = orderArray;
  });

  // This function watches for changes in the properties.info.title field and autogenerates the schema title and description fields
  // $scope.$watch('element.properties.info.title', function(v){
  //   if (!angular.isUndefined($scope.element)) {
  //     var title = $scope.element.properties.info.title;
  //     if (title.length > 0) {
  //       $scope.element.title = $rootScope.capitalizeFirst(title) + ' element schema';
  //       $scope.element.description = $rootScope.capitalizeFirst(title) + ' element schema autogenerated by the CEDAR Template Editor';
  //     }
  //     else {
  //       $scope.element.title = "";
  //       $scope.element.description = "";
  //
  //     }
  //   }
  // });

});
