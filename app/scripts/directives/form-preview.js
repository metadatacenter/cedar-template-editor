'use strict';

angularApp.directive('formPreview', function ($rootScope) {
  return {
    controller: function($scope){

      // Initializing array to loop through to call field-directive
      $scope.formFields = [];

      // Object alternative to $scope.formFields - will be used to group elements as fieldset in form preview
      $scope.formFieldsObject = {};

      $scope.parseForm = function(form) {
        // Loop through form.properties object looking for Elements
        angular.forEach(form.properties, function(value, key) {
          if ($rootScope.ignoreKey(key)) {
            // The 'value' property is how we distinguish if this is a field level element or an embedded element
            if(value.properties.hasOwnProperty('value')) {
              // Field level reached, create new object in $scope.formFields;
              $scope.fieldLevelReached(key, value.properties.value);
            } else {
              // Not field level, loop through next set of properties looking for 'value' property
              angular.forEach(value.properties, function(subvalue, subkey) {
                if ($rootScope.ignoreKey(subkey)) {
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

        // This params object is how we will render input fields from the object of parameters
        fieldObject.field = params;

        // This fieldLevelReached function will run every time to properties object is updated so we will
        // use the map function to only add the field if it does not already exist
        var position = $scope.formFields.map(function(e) { return e.field.id; }).indexOf(params.id);
        if (position === -1) {
          $scope.formFields.push(fieldObject);
        }
        
        if (parentKey !== undefined) {
          $scope.formFieldsObject[parentKey] = $scope.formFieldsObject[parentKey] || [];
          $scope.formFieldsObject[parentKey].push(fieldObject);
        } else {
          $scope.formFieldsObject[key] = $scope.formFieldsObject[key] || [];
          $scope.formFieldsObject[key].push(fieldObject);
        }
        //console.log($scope.formFieldsObject); still needs work, duplicate entries are being created

      };

      // Using Angular's $watch function to call $sceop.parseForm on form.properties initial population and on update
      $scope.$watch('form.properties', function () {
        $scope.parseForm($scope.form);
      }, true);
    },
    templateUrl: './views/directive-templates/form/form-preview.html',
    restrict: 'E',
    scope: {
        form:'='
    }
  };
});
