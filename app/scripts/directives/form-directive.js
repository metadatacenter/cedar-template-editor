'use strict';

angularApp.directive('formDirective', function ($rootScope, $document, $timeout) {
  return {
    templateUrl: './views/directive-templates/form-render.html',
    restrict: 'E',
    scope: {
      page:'=',
      form:'='
    },
    controller: function($scope) {
      // Initializing the empty model to submit data to
      $scope.model = {
        "@context": {}
      };

      // $scope.formFields object to loop through to call field-directive
      $scope.formFields = {};
      // $scope.formFieldsOrder array to loop over for proper ordering of items/elements
      $scope.formFieldsOrder = [];

      $scope.checkSubmission = false;

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

      $scope.pushIntoOrder = function(key, parentKey) {
        // If parent key does not exist
        // and key does not exist in the array
        if (!parentKey && $scope.formFieldsOrder.indexOf(key) == -1) {
          $scope.formFieldsOrder.push(key);
        }
      };

      $scope.parseForm = function(iterator, parentObject, parentModel, parentKey) {
        angular.forEach(iterator, function(value, name) {
          if ($rootScope.ignoreKey(name)) {
            if (value.hasOwnProperty('_id')) {
            //if (value.hasOwnProperty('guid')) {
              // Handle position and nesting within $scope.formFields
              parentObject[name] = {};
              // Push 'order' array through into parse object
              parentObject[name]['order'] = value.order;
              // Handle position and nesting within $scope.model
              parentModel[name] = {};
              // Place top level element into $scope.formFieldsOrder
              $scope.pushIntoOrder(name, parentKey);
              // Indication of nested element or nested fields reached, recursively call function
              $scope.parseForm(value.properties, parentObject[name], parentModel[name], name);
            } else {
              // Field level reached, assign to $scope.formFields object 
              parentObject[name] = value.properties.value;
              // Assign field instance model to $scope.model 
              parentModel[name] = value.properties.value.model;
              // Place field into $scope.formFieldsOrder
              $scope.pushIntoOrder(name, parentKey);
            }
          }
        });
      };

      // Angular's $watch function to call $scope.parseForm on form.properties initial population and on update
      $scope.$watch('form.properties', function () {
        $scope.parseForm($scope.form.properties, $scope.formFields, $scope.model);
      }, true);

      // Angular $watch function to run the Bootstrap Popover initialization on new form elements when they load
      $scope.$watch('page', function () {
        $scope.addPopover();
      });

      // Watching for the 'submitForm' event to be $broadcast from parent 'RuntimeController'
      $scope.$on('submitForm', function(event) {
        console.log('submitting form...');

        // Make the model (populated template) available to the parent
        $scope.$parent.model = $scope.model;

        console.log($scope.model);
        $scope.checkSubmission = true;

      });

      $scope.$on('formHasRequiredFields', function(event) {
        $scope.form.requiredFields = true;
      });
    }
  };
});
