'use strict';

angularApp.directive('formDirective', function ($rootScope, $document, $timeout) {
  return {
    templateUrl: './views/directive-templates/form-render.html',
    restrict: 'E',
    scope: {
      pageIndex:'=',
      form:'=',
      isEditData: "=",
      model: '='
    },
    controller: function($scope) {
      $scope.formFieldsOrder = [];
      $scope.model = $scope.model || {};

      // Initializaing checkSubmission as false
      $scope.checkSubmission = false;
      $scope.pageIndex = $scope.pageIndex || 0;

      $scope.currentPage = [],
      $scope.pageIndex = 0,
      $scope.pagesArray = [];

      var paginate = function() {
        if ($scope.form && $scope.form._ui && $scope.form._ui.order) {
          var orderArray = [];
          var dimension = 0;

          angular.forEach($scope.form._ui.order, function(field, index) {
            // If item added is of type Page Break, jump into next page array for storage of following fields
            if ($scope.form.properties[field].properties &&
                $scope.form.properties[field].properties._ui &&
                $scope.form.properties[field].properties._ui.inputType == 'page-break') {
              dimension ++;
            }
            // Push field key into page array
            orderArray[dimension] = orderArray[dimension] || [];
            orderArray[dimension].push(field);
          });

          $scope.pagesArray = orderArray;
        }
      }

      $scope.removeChild = function(fieldOrElement) {
        var selectedKey;
        var props = $scope.form.properties;
        angular.forEach(props, function(value, key) {
          if (value["@id"] == fieldOrElement["@id"]) {
            selectedKey = key;
          }
        });

        if (selectedKey) {
          delete props[selectedKey];

          // Don't reset formFieldsOrder in $watch form.properties, it causes performance and usage issue.
          var idx = $scope.formFieldsOrder.indexOf(selectedKey);
          $scope.formFieldsOrder.splice(idx, 1);
        }
      };

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

    	// Load the previous page of the form
    	$scope.previousPage = function() {
    	  $scope.pageIndex --;
    	  $scope.currentPage = $scope.pagesArray[$scope.pageIndex];
    	};

    	// Load the next page of the form
    	$scope.nextPage = function() {
    	  $scope.pageIndex ++;
    	  $scope.currentPage = $scope.pagesArray[$scope.pageIndex];
    	};

    	// Load an arbitrary page number attached to the index of it via runtime.html template
    	$scope.setCurrentPage = function(page) {
    	  $scope.pageIndex = page;
    	  $scope.currentPage = $scope.pagesArray[$scope.pageIndex];
    	};

      var startParseForm = function() {
        if ($scope.form) {
          var model;
          if ($rootScope.isRuntime()) {
            if ($scope.isEditData) {
              model = {};
            } else {
              model = $scope.model;
            }
          } else {
            model = $scope.model;
          }

          $scope.parseForm($scope.form.properties, model);
          paginate();
        }
      };

      $scope.parseForm = function(iterator, parentModel, parentKey) {
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
            if (value._ui && value._ui.order) {
              var min = value.minItems || 1;

              // Handle position and nesting within $scope.model if it does not exist
              if (!$rootScope.isCardinalElement(value)) {
                parentModel[name] = {};
              } else {
                parentModel[name] = [];
                for (var i = 0; i < min; i++) {
                  parentModel[name].push({});
                }
              }

              if (angular.isArray(parentModel[name])) {
                for (var i = 0; i < min; i++) {
                  // Indication of nested element or nested fields reached, recursively call function
                  $scope.parseForm($rootScope.getFieldProperties(value), parentModel[name][i], name);
                }
              } else {
                $scope.parseForm($rootScope.getFieldProperties(value), parentModel[name], name);
              }
            } else {
              var min = value.minItems || 1;

              // Assign empty field instance model to $scope.model only if it does not exist
              if (parentModel[name] == undefined) {
                if (!$rootScope.isCardinalElement(value)) {
                  parentModel[name] = {};
                } else {
                  parentModel[name] = [];
                  for (var i = 0; i < min; i++) {
                    var obj = {};
                    parentModel[name].push(obj);
                  }
                }
              }

              var p = $rootScope.propertiesOf(value);

              // Add @type information to instance at the field level
              if (!angular.isUndefined(p['@type'])) {
                var type = $rootScope.generateInstanceType(p['@type']);

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
        startParseForm();
      });

      $scope.$on("form:update", function() {
        startParseForm();
      });

      // Angular $watch function to run the Bootstrap Popover initialization on new form elements when they load
      $scope.$watch('page', function () {
        $scope.addPopover();
      });

      // Watching for the 'submitForm' event to be $broadcast from parent 'RuntimeController'
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
