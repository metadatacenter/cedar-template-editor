'use strict';

angularApp.directive('formPreview', function ($rootScope) {
  return {
    controller: function($scope){

      // $scope.formFields object to loop through to call field-directive
      $scope.formFields = {};

      $scope.removeField = function(key) {
        // Remove selected field from $scope.formFields
        delete $scope.formFields[key];

        // Remove selected field from the $scope.form object itself also
        delete $scope.form.properties[key];
      };

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
        
        if (parentKey !== undefined) {
          // If these are nested fields the parent key will be the element they belong to,
          // this element key is needed for proper grouping in the rendering preview
          $scope.formFields[parentKey] = $scope.formFields[parentKey] || {};
          $scope.formFields[parentKey][key] = fieldObject.field;
        } else {
          // These are field level objects with no parent element grouping
          $scope.formFields[key] = $scope.formFields[key] || {};
          $scope.formFields[key] = fieldObject.field;
        }
      };

      // Using Angular's $watch function to call $sceop.parseForm on form.properties initial population and on update
      $scope.$watch('form.properties', function () {
        $scope.parseForm($scope.form);
      }, true);
    },
    templateUrl: './views/directive-templates/form-preview.html',
    restrict: 'EA',
    scope: {
        form:'=',
        delete: '&'
    }
  };
});
