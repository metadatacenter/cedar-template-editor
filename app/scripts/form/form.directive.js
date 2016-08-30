'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.form.formDirective', [])
      .directive('formDirective', formDirective);

  // TODO: refactor to cedarFormDirective <cedar-form-directive>

  formDirective.$inject = ['$rootScope', '$document', '$timeout', 'DataManipulationService', 'DataUtilService'];

  function formDirective($rootScope, $document, $timeout, DataManipulationService, DataUtilService) {
    return {
      templateUrl: 'scripts/form/form.directive.html',
      restrict   : 'E',
      scope      : {
        pageIndex      : '=',
        form           : '=',
        isEditData     : "=",
        model          : '=',
        hideRootElement: "="
      },
      controller : function ($scope) {

        $scope.model = $scope.model || {};

        // Initializing checkSubmission as false
        $scope.checkSubmission = false;
        $scope.pageIndex = $scope.pageIndex || 0;

        $scope.currentPage = [],
            $scope.pageIndex = 0,
            $scope.pagesArray = [];


        var paginate = function () {
          if ($scope.form) {
            var orderArray = [];
            var dimension = 0;

            $scope.form._ui = $scope.form._ui || {};
            $scope.form._ui.order = $scope.form._ui.order || [];

            // This code is to allow render previous templates (Before inline_edit). We can remove this later
            if (!$scope.form._ui.order.length) {
              angular.forEach($scope.form.properties, function (value, key) {
                if (value.properties || value.items && value.items.properties) {
                  $scope.form._ui.order.push(key);
                }
              });
            }

            angular.forEach($scope.form._ui.order, function (field, index) {
              // If item added is of type Page Break, jump into next page array for storage of following fields
              if ($scope.form.properties[field].properties &&
                  $scope.form.properties[field]._ui &&
                  $scope.form.properties[field]._ui.inputType == 'page-break') {
                dimension++;
              }
              // Push field key into page array
              orderArray[dimension] = orderArray[dimension] || [];
              orderArray[dimension].push(field);
            });

            $scope.pagesArray = orderArray;
          }
        }

        $scope.removeChild = function (fieldOrElement) {
          var id = $rootScope.schemaOf(fieldOrElement)["@id"];
          var title = $rootScope.schemaOf(fieldOrElement)._ui.title;
          var selectedKey;
          var props = $scope.form.properties;

          // find the field or element in the form's properties
          angular.forEach(props, function (value, key) {
            if ($rootScope.schemaOf(value)["@id"] == id) {
              selectedKey = key;
            }
          });

          // if it is there, delete it
          if (selectedKey) {

            // delete it from the template's properties
            delete props[selectedKey];

            // and the order array
            var idx = $scope.form._ui.order.indexOf(selectedKey);
            $scope.form._ui.order.splice(idx, 1);
            $scope.$emit("invalidElementState", ["remove", title, id]);
          }
        };

        $scope.renameChildKey = function (child, newKey) {
          if (!child) {
            return;
          }

          var childId = DataManipulationService.idOf(child);
          if (!childId || /^tmp\-/.test(childId)) {
            var p = $scope.form.properties;
            if (p[newKey] && p[newKey] == child) {
              return;
            }

            newKey = DataManipulationService.getAcceptableKey(p, newKey);
            angular.forEach(p, function (value, key) {
              if (!value) {
                return;
              }

              var idOfValue = DataManipulationService.idOf(value);
              if (idOfValue && idOfValue == childId) {
                DataManipulationService.renameKeyOfObject(p, key, newKey);

                if (p["@context"] && p["@context"].properties) {
                  DataManipulationService.renameKeyOfObject(p["@context"].properties, key, newKey);

                  if (p["@context"].properties[newKey] && p["@context"].properties[newKey].enum) {
                    p["@context"].properties[newKey].enum[0] = DataManipulationService.getEnumOf(newKey);
                  }
                }

                if (p["@context"].required) {
                  var idx = p["@context"].required.indexOf(key);
                  p["@context"].required[idx] = newKey;
                }

                var idx = $scope.form._ui.order.indexOf(key);
                $scope.form._ui.order[idx] = newKey;
              }
            });
          }
        }

        $scope.addPopover = function () {
          //Initializing Bootstrap Popover fn for each item loaded
          $timeout(function () {
            angular.element('[data-toggle="popover"]').popover();
          }, 1000);
        };

        $document.on('click', function (e) {
          // Check if Popovers exist and close on click anywhere but the popover toggle icon
          if (angular.element(e.target).data('toggle') !== 'popover' && angular.element('.popover').length) {
            angular.element('[data-toggle="popover"]').popover('hide');
          }
        });

        // Load the previous page of the form
        $scope.previousPage = function () {
          $scope.pageIndex--;
          $scope.currentPage = $scope.pagesArray[$scope.pageIndex];
        };

        // Load the next page of the form
        $scope.nextPage = function () {
          $scope.pageIndex++;
          $scope.currentPage = $scope.pagesArray[$scope.pageIndex];
        };

        // Load an arbitrary page number attached to the index of it via runtime.html template
        $scope.setCurrentPage = function (page) {
          $scope.pageIndex = page;
          $scope.currentPage = $scope.pagesArray[$scope.pageIndex];
        };

        var startParseForm = function () {
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

            if ($rootScope.isRuntime()) {
              $scope.parseForm($scope.form.properties, model);
            } else {
              $rootScope.findChildren($scope.form.properties, model);
            }

            paginate();
          }
        };

        $scope.deselectAll = function () {
          console.log("deselectAll");
        }

        $scope.parseForm = function (iterator, parentModel, parentKey) {
          var ctx;
          angular.forEach(iterator, function (value, name) {
            // Add @context information to instance
            if (name == '@context') {
              ctx = DataManipulationService.generateInstanceContext(value);
            }
          });

          angular.forEach(iterator, function (value, name) {
            // Add @context information to instance
            if (name == '@context') {
              parentModel['@context'] = DataManipulationService.generateInstanceContext(value);
            }
            // Add @type information to instance
            else if (name == '@type') {
              var type = DataManipulationService.generateInstanceType(value);
              if (type != null)
                parentModel['@type'] = type;
            }

            if (!DataUtilService.isSpecialKey(name)) {
              // We can tell we've reached an element level by its '@type' property
              if ($rootScope.schemaOf(value)['@type'] == 'https://schema.metadatacenter.org/core/TemplateElement') {
                var min = value.minItems || 0;

                // Handle position and nesting within $scope.model if it does not exist
                if (!DataManipulationService.isCardinalElement(value)) {
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
                    $scope.parseForm($rootScope.propertiesOf(value), parentModel[name][i], name);
                  }
                } else {
                  $scope.parseForm($rootScope.propertiesOf(value), parentModel[name], name);
                }
              } else {
                var min = value.minItems || 0;

                // Assign empty field instance model to $scope.model only if it does not exist
                if (parentModel[name] == undefined) {
                  // Not multiple instance
                  if (!DataManipulationService.isCardinalElement(value)) {
                    // Selection fields store an array of values
                    if ((value._ui.inputType == 'radio') || (value._ui.inputType == 'checkbox') || (value._ui.inputType == 'list')) {
                      parentModel[name] = [];
                    }
                    // All other fields
                    else {
                      parentModel[name] = {};
                    }
                    // Multiple instance
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
                if (p && !angular.isUndefined(p['@type'])) {
                  var type = DataManipulationService.generateInstanceType(p['@type']);

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
          //positionToolbar();
        });

        $scope.$on("form:update", function () {
          startParseForm();
        });

        // Angular $watch function to run the Bootstrap Popover initialization on new form elements when they load
        $scope.$watch('page', function () {
          $scope.addPopover();
        });

        // Watching for the 'submitForm' event to be $broadcast from parent 'RuntimeController'
        $scope.$on('submitForm', function (event) {
          // Make the model (populated template) available to the parent
          $scope.$parent.instance = $scope.model;
          $scope.checkSubmission = true;
        });

        $scope.$on('formHasRequiredFields', function (event) {
          $scope.form.requiredFields = true;
        });

      }
    };
  };

});
