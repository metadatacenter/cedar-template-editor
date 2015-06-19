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
          //console.log($scope.formFieldsOrder);
        }
      };

      $scope.parseForm = function(iterator, parentObject, parentKey) {
        angular.forEach(iterator, function(value, name) {
          if ($rootScope.ignoreKey(name)) {
            if (value.hasOwnProperty('guid')) {
              // Acknowledge position and nesting
              parentObject[name] = {};
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

      // Angular's $watch function to call $scope.parseForm on form.properties initial population and on update
      $scope.$watch('form.properties', function () {
        $scope.addPopover();
        $scope.parseForm($scope.form.properties, $scope.formFields);
      }, true);

      // Angular $watch function to run the Bootstrap Popover initialization on new form elements when they load
      $scope.$watch('page', function () {
        $scope.addPopover();
      });
    }
  };
});
