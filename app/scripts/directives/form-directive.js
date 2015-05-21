'use strict';

var pattern = /^@/i;

angularApp.directive('formDirective', function () {
  return {
    controller: function($scope){

      // Returning false if the object key value in the properties object is of json-ld type '@'
      $scope.ignoreKey = function(key) {
        var result = pattern.test(key);
        return !result;
      }

      // Initializing the empty model to submit data to
      $scope.model = {
        "@context": {}
      };
      // Initializing array to loop through to call field-directive
      $scope.formFields = [];

      $scope.parseForm = function(form) {
        // Loop through form.properties object looking for Elements
        angular.forEach(form.properties, function(value, key) {
          if ($scope.ignoreKey(key)) {
            // Elements found marked as [key]
            $scope.model[key] = {};
            // The 'value' property is how we distinguish if this is a field level element or an embedded element
            if(value.properties.hasOwnProperty('value')) {
              // Field level reached, create new object in $scope.formFields;
              $scope.fieldLevelReached(key, value.properties.value);
            } else {
              // Not field level, loop through next set of properties looking for 'value' property
              angular.forEach(value.properties, function(subvalue, subkey) {
                if ($scope.ignoreKey(subkey)) {
                  // Elements found marked as [subkey], embedding within existing [key] paramter
                  $scope.model[key][subkey] = {};
                  // Check if we've found field level properties object
                  if(subvalue.properties.hasOwnProperty('value')) {
                    // Field level reached, create new object in $scope.formFields;
                    $scope.fieldLevelReached(subkey, subvalue.properties.value, key);
                  }
                }
              });
            }
          }
        });
      };

      $scope.fieldLevelReached = function(key, params, parentKey) {
        // Create new empty object to stuff with properties
        var fieldObject = {};
        // Binding newly created fieldObject model to the $scope.model object for Angular's 2 way binding
        fieldObject.model = $scope.model[key];

        // If field element is nested within a parent element, we need an additional layer of definition
        if (parentKey !== undefined) {
          fieldObject.model = $scope.model[parentKey][key];
        }

        // This params object is how we will render input fields from the object of parameters
        fieldObject.field = params;
        $scope.formFields.push(fieldObject);
      };

      // Using Angular's $watch function to signal the parseForm fn once the getForm promise is fulfilled
      $scope.$watch('form', function () {
        if($scope.form.properties) {
          $scope.parseForm($scope.form);
        }
      });
    },
    templateUrl: './views/directive-templates/form/form.html',
    restrict: 'E',
    scope: {
        form:'='
    }
  };
});
