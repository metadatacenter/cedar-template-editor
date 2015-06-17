'use strict';

angularApp.directive('formPreview', function ($rootScope, $document, $timeout) {
  return {
    controller: function($scope){

      // $scope.formFields object to loop through to call field-directive
      $scope.formFields = {};
      $scope.formFieldsOrder = [];

      $scope.addPopover = function() {
        //Initializing Bootstrap Popover fn for each item loaded
        $timeout(function() {
          angular.element('[data-toggle="popover"]').popover();
        }, 1000);
      };

      $document.on('click', function(e) {
        // Check if Popovers exist and close on click anywhere but the popover toggle icon
        if( angular.element(e.target).data('toggle') !== 'popover' && angular.element('.popover').length ) {
          angular.element('[data-toggle="popover"]').popover('hide');
        }
      });

      $scope.removeField = function(key) {
        // Remove selected field from $scope.formFields
        delete $scope.formFields[key];

        // Remove selected field from the $scope.form object itself also
        delete $scope.form.properties[key];

        // Remove selected field instance from the $scope.formFieldsOrder array also
        var index = $scope.formFieldsOrder.indexOf(key);
        if (index > -1) {
          $scope.formFieldsOrder.splice(index, 1);
        }
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
                  } else {
                    // Case for element with embedded elements - third level of nesting 
                    angular.forEach(subvalue.properties, function(tertiaryValue, tertiaryKey) {
                      if ($rootScope.ignoreKey(tertiaryKey)) {
                        // Check if we've found field level properties object
                        if (tertiaryValue.properties.hasOwnProperty('value')) {
                          // Field level reached, create new object in $scope.formFields;
                          $scope.fieldLevelReached(tertiaryKey, tertiaryValue.properties.value, subkey);
                        }
                      }
                    });
                  }
                }
              });
            }
          }
        });
      };

      $scope.fieldLevelReached = function(key, params, parentKey) {
        
        if (parentKey !== undefined) {
          // If these are nested fields the parent key will be the element they belong to,
          // this element key is needed for proper grouping in the rendering preview
          $scope.formFields[parentKey] = $scope.formFields[parentKey] || {};
          $scope.formFields[parentKey][key] = params;

          // $scope.formFieldsOrder will be used for sorting order of $scope.formFields
          if ($scope.formFieldsOrder.indexOf(parentKey) == -1) {
            $scope.formFieldsOrder.push(parentKey);
          }
        } else {
          // These are field level objects with no parent element grouping
          $scope.formFields[key] = $scope.formFields[key] || {};
          $scope.formFields[key] = params;

          // $scope.formFieldsOrder will be used for sorting order of $scope.formFields
          if ($scope.formFieldsOrder.indexOf(key) == -1) {
            $scope.formFieldsOrder.push(key);
          }
        }
      };

      // Listening for event from parent $scope to reset the form
      $scope.$on('resetForm', function (event) {
        $scope.formFields = {};
        $scope.formFieldsOrder = [];
      });

      // Listening for event from parent $scope to reset the form
      $scope.$on('initPageArray', function (event) {
        var orderArray = [],
            dimension = 0;
        // loop through $scope.formFieldsOrder and build pages array
        angular.forEach($scope.formFieldsOrder, function(field, index) {
          // If item added is of type Page Break, jump into next page array for storage of following fields
          if ($scope.form.properties[field].properties.value && $scope.form.properties[field].properties.value.input_type == 'page-break') {
            dimension ++;
          }
          // Push field key into page array
          orderArray[dimension] = orderArray[dimension] || [];
          orderArray[dimension].push(field);
        });
        // $emit properly formatted pages array back to parent $scope as orderArray
        $scope.$emit('finishPageArray', orderArray);
      });

      // Using Angular's $watch function to call $sceop.parseForm on form.properties initial population and on update
      $scope.$watch('form.properties', function () {
        $scope.parseForm($scope.form);
        $scope.addPopover();
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
