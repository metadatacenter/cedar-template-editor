'use strict';

angularApp.directive('formDirective', function ($rootScope) {
  return {
    controller: function($scope){

      // Initializing the empty model to submit data to
      $scope.model = {
        "@context": {}
      };
      // Initializing array to loop through to call field-directive
      $scope.formFields = [];

      $scope.formFieldsObject = {};

      $scope.parseForm = function(form) {
        // Loop through form.properties object looking for Elements
        angular.forEach(form.properties, function(value, key) {
          if ($rootScope.ignoreKey(key)) {
            // Elements found marked as [key]
            $scope.model[key] = {};
            // The 'value' property is how we distinguish if this is a field level element or an embedded element
            if(value.properties.hasOwnProperty('value')) {
              // Field level reached, create new object in $scope.formFields;
              console.log(key);
              $scope.fieldLevelReached(key, value.properties.value);
            } else {
              // Not field level, loop through next set of properties looking for 'value' property
              angular.forEach(value.properties, function(subvalue, subkey) {
                if ($rootScope.ignoreKey(subkey)) {
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
        console.log($scope.formFields);
        
        if (parentKey !== undefined) {
          $scope.formFieldsObject[parentKey] = $scope.formFieldsObject[parentKey] || [];
          $scope.formFieldsObject[parentKey].push(fieldObject);
        } else {
          $scope.formFieldsObject[key] = $scope.formFieldsObject[key] || [];
          $scope.formFieldsObject[key].push(fieldObject);
        }
        
        console.log($scope.formFieldsObject);

      };

      // Using Angular's $watch function to call $sceop.parseForm on form.properties initial population and on update
      $scope.$watch('form.properties', function () {
        $scope.parseForm($scope.form);
      }, true);
    },
    templateUrl: './views/directive-templates/form/form.html',
    restrict: 'E',
    scope: {
        form:'='
    }
  };
});
