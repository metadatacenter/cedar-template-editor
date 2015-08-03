'use strict';

angularApp.directive('formPreview', function ($rootScope, $document, $timeout) {
  return {
    controller: function($scope){

      // $scope.formFields object to loop through to call field-directive
      $scope.formFields = {};
      // $scope.formFieldsOrder array to loop over for proper ordering of items/elements
      if ($scope.form.order) {
        // If form already has order array, set iterator to existing array (loading pre-existing element)
        $scope.formFieldsOrder = $scope.form.order;
      } else {
        // form has no order array, (ie. loading a new instance, with no existing fields)
        $scope.formFieldsOrder = [];
      }

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

      $scope.pushIntoOrder = function(key, parentKey) {
        // If parent key does not exist
        // and key does not exist in the array
        if (!parentKey && $scope.formFieldsOrder.indexOf(key) == -1) {
          $scope.formFieldsOrder.push(key);
        }
      };

      $scope.parseForm = function(iterator, parentObject, parentKey) {
        angular.forEach(iterator, function(value, name) {
          if ($rootScope.ignoreKey(name)) {
            if (value.hasOwnProperty('guid')) {
              // Acknowledge position and nesting
              parentObject[name] = {};
              // Push 'order' array through into parse object
              parentObject[name]['order'] = value.order;
              $scope.pushIntoOrder(name, parentKey);
              // Indication of nested element or nested fields reached, recursively call function
              $scope.parseForm(value.properties, parentObject[name], name);
            } else {
              // Field level reached, assign to $scope.formFields object 
              parentObject[name] = value.properties.value;
              $scope.pushIntoOrder(name, parentKey);
            }
          }
        });
      };

      // Listening for event from parent $scope to reset the form
      $scope.$on('resetForm', function (event) {
        $scope.formFields = {};
        $scope.formFieldsOrder = [];
        $scope.$emit('finishOrderArray', $scope.formFieldsOrder);
      });

      // Listening for event from parent $scope to build the element order array
      $scope.$on('initOrderArray', function (event) {
        $scope.$emit('finishOrderArray', $scope.formFieldsOrder);
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

      // Using Angular's $watch function to call $scope.parseForm on form.properties initial population and on update
      $scope.$watch('form.properties', function () {
        $scope.addPopover();
        $scope.parseForm($scope.form.properties, $scope.formFields);
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
