'use strict';

var fieldDirective = function($rootScope, $http, $compile, $document, SpreadsheetService) {
  var linker = function($scope, $element, attrs) {

    $scope.setValueType = function() {
      var typeEnum = $scope.field.properties['@type'].oneOf[0].enum;
      if (angular.isDefined(typeEnum) && angular.isArray(typeEnum)) {
        if (typeEnum.length == 1) {
          $scope.model['@type'] = $scope.field.properties['@type'].oneOf[0].enum[0];
        } else {
          $scope.model['@type'] = $scope.field.properties['@type'].oneOf[0].enum;
        }
      }
    }

    // When form submit event is fired, check field for simple validation
    $scope.$on('submitForm', function (event) {
      // If field is required and is empty, emit failed emptyRequiredField event
      if ($scope.field.properties.info.required_value) {
        var allRequiredFieldsAreFilledIn = true;
        var min = $scope.field.minItems || 1;

        if (angular.isArray($scope.model)) {
          if ($scope.model.length < min) {
            allRequiredFieldsAreFilledIn = false;
          } else {
            angular.forEach($scope.model, function(valueElement) {
              if (!valueElement || !valueElement.value) {
                allRequiredFieldsAreFilledIn = false;
              } else if (angular.isArray(valueElement.value)) {
                var hasValue = false;
                angular.forEach(valueElement.value, function(ve) {
                  hasValue = hasValue || !!ve;
                });

                if (!hasValue) {
                  allRequiredFieldsAreFilledIn = false;
                }
              } else if (angular.isObject(valueElement.value)) {
                if ($rootScope.isEmpty(valueElement.value)) {
                  allRequiredFieldsAreFilledIn = false;
                } else if ($scope.field.properties.info.date_type == "date-range") {
                  if (!valueElement.value.start || !valueElement.value.end) {
                    allRequiredFieldsAreFilledIn = false;
                  }
                } else {
                  // Require at least one checkbox is checked.
                  var hasValue = false;
                  angular.forEach(valueElement.value, function(value, key) {
                    hasValue = hasValue || value;
                  });

                  if (!hasValue) {
                    allRequiredFieldsAreFilledIn = false;
                  }
                }
              }
            });
          }
        } else {
          // allRequiredFieldsAreFilledIn = false;
          if (!$scope.model || !$scope.model.value) {
            allRequiredFieldsAreFilledIn = false;
          } else if (angular.isArray($scope.model.value)) {
            var hasValue = false;
            angular.forEach($scope.model.value, function(ve) {
              hasValue = hasValue || !!ve;
            });

            if (!hasValue) {
              allRequiredFieldsAreFilledIn = false;
            }
          } else if (angular.isObject($scope.model.value)) {
            if ($rootScope.isEmpty($scope.model.value)) {
              allRequiredFieldsAreFilledIn = false;
            } else if ($scope.field.properties.info.date_type == "date-range") {
              if (!$scope.model.value.start || !$scope.model.value.end) {
                allRequiredFieldsAreFilledIn = false;
              }
            } else {
              // Require at least one checkbox is checked.
              var hasValue = false;
              angular.forEach($scope.model.value, function(value, key) {
                hasValue = hasValue || value;
              });

              if (!hasValue) {
                allRequiredFieldsAreFilledIn = false;
              }
            }
          }
        }

        if (!allRequiredFieldsAreFilledIn) {
          // add this field instance the the emptyRequiredField array
          $scope.$emit('emptyRequiredField', ['add', $scope.field.properties.info.title, $scope.uuid]);
        }
      }

      // If field is required and is not empty, check to see if it needs to be removed from empty fields array
      if ($scope.field.properties.info.required_value && allRequiredFieldsAreFilledIn) {
        //remove from emptyRequiredField array
        $scope.$emit('emptyRequiredField', ['remove', $scope.field.properties.info.title, $scope.uuid]);
      }
    });

    var field = $scope.field.properties.info
    // Checking each field to see if required, will trigger flag for use to see there is required fields
    if (field.required) {
      $scope.$emit('formHasRequiredFields');
    }

    // If a default value is set from the field item configuration, set $scope.model to its value
    if ($scope.directory == 'render') {
      if ($scope.model) {
        if ($rootScope.isArray($scope.model)) {
          if ($scope.model.length == 0) {
            var min = $scope.field.minItems || 1;

            if (field.default_option) {
              for (var i = 0; i < min; i++) {
                $scope.model[i]["value"] = angular.copy(field.default_option);
              }
            } else {
              for (var i = 0; i < min; i++) {
                if (['checkbox'].indexOf(field.input_type) >= 0 ||
                    ['date'].indexOf(field.input_type) >= 0 && field.date_type == "date-range") {
                  $scope.model[i]['value'] = {};
                } else if (['list'].indexOf(field.input_type) >= 0) {
                  $scope.model[i]['value'] = [];
                } else {
                  $scope.model[i]['value'] = "";
                }
              }
            }
          } else {
            angular.forEach($scope.model, function(m, i) {
              if (!("value" in m)) {
                if (field.default_option) {
                  $scope.model[i]["value"] = angular.copy(field.default_option);
                } else {
                  if (['checkbox'].indexOf(field.input_type) >= 0 ||
                      ['date'].indexOf(field.input_type) >= 0 && field.date_type == "date-range") {
                    $scope.model[i]['value'] = {};
                  } else if (['list'].indexOf(field.input_type) >= 0) {
                    $scope.model[i]['value'] = [];
                  } else {
                    $scope.model[i]['value'] = "";
                  }
                }
              }
              $scope.setValueType();
            });
          }
        } else {
          if (!("value" in $scope.model)) {
            if (field.default_option) {
              $scope.model["value"] = angular.copy(field.default_option);
            } else {
              if (['checkbox'].indexOf(field.input_type) >= 0 ||
                  ['date'].indexOf(field.input_type) >= 0 && field.date_type == "date-range") {
                $scope.model['value'] = {};
              } else if (['list'].indexOf(field.input_type) >= 0) {
                $scope.model['value'] = [];
              } else {
                $scope.model['value'] = "";
              }
            }
          }
        }
        $scope.setValueType();
      }
    }

    $scope.uuid = $rootScope.generateGUID();
    
    // Retrive appropriate field template file
    $scope.getTemplateUrl = function() {
      var input_type = 'element';
      if ($scope.field.properties.info.input_type) {
        input_type = $scope.field.properties.info.input_type;
      }
      return './views/directive-templates/field-' + $scope.directory + '/' + input_type + '.html';
    }

    $scope.addMoreInput = function() {
      if ($scope.field.minItems && (!$scope.field.maxItems || $scope.model.length < $scope.field.maxItems)) {
        var seed = angular.copy($scope.model[0]);

        if (field.default_option) {
          seed["value"] = angular.copy(field.default_option);
        } else {
          if (['checkbox'].indexOf(field.input_type) >= 0 ||
              ['date'].indexOf(field.input_type) >= 0 && field.date_type == "date-range") {
            seed['value'] = {};
          } else if (['list'].indexOf(field.input_type) >= 0) {
            seed['value'] = [];
          } else {
            seed['value'] = "";
          }
        }

        $scope.model.push(seed);
      }
    }

    $scope.removeInput = function(index) {
      if ($scope.model.length > $scope.field.minItems) {
        $scope.model.splice(index, 1);
      }
    }

    $scope.switchToSpreadsheet = function () {
      SpreadsheetService.switchToSpreadsheetField($scope, $element);
    }

  }

  return {
    templateUrl: './views/directive-templates/field-directive.html',
    restrict: 'EA',
    scope: {
      directory: '@',
      field: '=',
      model: '=',
      preview: "=",
      delete: '&',
      add: '&',
      option: '&'
    },
    controller: function($scope) {

      var addPopover = function($scope) {
        //Initializing Bootstrap Popover fn for each item loaded
        setTimeout(function() {
          angular.element('#field-value-tooltip').popover();
        }, 1000);
      };

      addPopover($scope);

    },
    replace: true,
    link: linker
  };

};

fieldDirective.$inject = ["$rootScope", "$http", "$compile", "$document", "SpreadsheetService"];
angularApp.directive('fieldDirective', fieldDirective);

