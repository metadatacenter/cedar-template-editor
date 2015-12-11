'use strict';

angularApp.directive('formDirective', function ($rootScope, $document, $timeout) {
  return {
    templateUrl: './views/directive-templates/form-render.html',
    restrict: 'E',
    scope: {
      page:'=',
      form:'=',
      model: '='
    },
    controller: function($scope) {
      // $scope.formFields object to loop through to call field-directive
      $scope.formFields = {};
      // $scope.formFieldsOrder array to loop over for proper ordering of items/elements
      $scope.formFieldsOrder = [];
      // Initializaing checkSubmission as false
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
        var ctx;
        angular.forEach(iterator, function(value, name) {
          // Add @context information to instance
          if (name == '@context') {
            ctx = $rootScope.generateInstanceContext(value);
          }
        });

        angular.forEach(iterator, function(value, name) {
          // Add @context information to instance
          if (name == '@context') {
            parentModel['@context'] = $rootScope.generateInstanceContext(value);
          }
          // Add @type information to instance
          else if (name == '@type') {
            var type = $rootScope.generateInstanceType(value);
            if (type != null)
              parentModel['@type'] = type;
          }

          if (!$rootScope.ignoreKey(name)) {
            // We can tell we've reached an element level by its 'order' property
            if (value.hasOwnProperty('order')) {
              // Handle position and nesting within $scope.formFields
              parentObject[name] = {};
              // Push 'order' array through into parse object
              parentObject[name]['order'] = value.order;
              parentObject[name].minItems = value.minItems;
              parentObject[name].maxItems = value.maxItems;

              var min = value.minItems || 1;

                // Handle position and nesting within $scope.model if it does not exist
              if (parentModel[name] == undefined) {
                if (!$rootScope.isCardinalElement(value)) {
                  parentModel[name] = {};
                } else {
                  parentModel[name] = [];
                  for (var i = 0; i < min; i++) {
                    parentModel[name].push({});
                  }
                }
              }
              // Place top level element into $scope.formFieldsOrder
              $scope.pushIntoOrder(name, parentKey);

              if (angular.isArray(parentModel[name])) {
                for (var i = 0; i < min; i++) {
                  // Indication of nested element or nested fields reached, recursively call function
                  $scope.parseForm($rootScope.getFieldProperties(value), parentObject[name], parentModel[name][i], name);
                }
              } else {
                $scope.parseForm($rootScope.getFieldProperties(value), parentObject[name], parentModel[name], name);
              }
            } else {
              var min = value.minItems || 1;

              if (value.type == 'array' && value.items && value.items.properties) {
                // copy over the properties from the items object
                value.properties = value.items.properties;
              }

              // Field level reached, assign to $scope.formFields object
              parentObject[name] = value;

              // Assign empty field instance model to $scope.model only if it does not exist
              if (parentModel[name] == undefined) {
                if (!$rootScope.isCardinalElement(value)) {
                  parentModel[name] = {};
                } else {
                  parentModel[name] = [];
                  for (var i = 0; i < min; i++) {
                    var obj = {};
                    // if (ctx && ctx.value) {
                    //   obj["@context"] = {value: ctx.value};
                    // }

                    parentModel[name].push(obj);
                  }
                }
              }

              // Place field into $scope.formFieldsOrder
              $scope.pushIntoOrder(name, parentKey);

              // Add @type information to instance at the field level
              if (!angular.isUndefined(value.properties['@type'])) {
                var type = $rootScope.generateInstanceType(value.properties['@type']);

                if (type) {
                  if (angular.isArray(parentModel[name])) {
                    for (var i = 0; i < min; i++) {
                      parentModel[name][i]["@type"] = type || "";
                    }
                  } else {
                    parentModel[name]["@type"] = type || "";
                  }
                }
              }
            }
          }
        });
      };

      // Angular's $watch function to call $scope.parseForm on form.properties initial population and on update
      $scope.$watch('form.properties', function () {
        var model;
        if ($rootScope.isEmpty($scope.model)) {
          model = $scope.model;
        } else {
          model = {};
        }

        $scope.parseForm($scope.form.properties, $scope.formFields, model);
      }, true);

      // Angular $watch function to run the Bootstrap Popover initialization on new form elements when they load
      $scope.$watch('page', function () {
        $scope.addPopover();
      });

      // Watching for the 'submitForm' event to be $broadcast from parent 'CreateInstanceController'
      $scope.$on('submitForm', function(event) {
        // Make the model (populated template) available to the parent
        $scope.$parent.instance = $scope.model;
        $scope.checkSubmission = true;
      });

      $scope.$on('formHasRequiredFields', function(event) {
        $scope.form.requiredFields = true;
      });
    }
  };
});
