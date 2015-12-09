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
      if ($scope.field.properties._ui.requiredValue) {
        var allRequiredFieldsAreFilledIn = true;
        var min = $scope.field.minItems || 1;

        if (angular.isArray($scope.model)) {
          if ($scope.model.length < min) {
            allRequiredFieldsAreFilledIn = false;
          } else {
            angular.forEach($scope.model, function(valueElement) {
              if (!valueElement || !valueElement._value) {
                allRequiredFieldsAreFilledIn = false;
              } else if (angular.isArray(valueElement._value)) {
                var hasValue = false;
                angular.forEach(valueElement._value, function(ve) {
                  hasValue = hasValue || !!ve;
                });

                if (!hasValue) {
                  allRequiredFieldsAreFilledIn = false;
                }
              } else if (angular.isObject(valueElement._value)) {
                if ($rootScope.isEmpty(valueElement._value)) {
                  allRequiredFieldsAreFilledIn = false;
                } else if ($scope.field.properties._ui.dateType == "date-range") {
                  if (!valueElement._value.start || !valueElement._value.end) {
                    allRequiredFieldsAreFilledIn = false;
                  }
                } else {
                  // Require at least one checkbox is checked.
                  var hasValue = false;
                  angular.forEach(valueElement._value, function(value, key) {
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
          if (!$scope.model || !$scope.model._value) {
            allRequiredFieldsAreFilledIn = false;
          } else if (angular.isArray($scope.model._value)) {
            var hasValue = false;
            angular.forEach($scope.model._value, function(ve) {
              hasValue = hasValue || !!ve;
            });

            if (!hasValue) {
              allRequiredFieldsAreFilledIn = false;
            }
          } else if (angular.isObject($scope.model._value)) {
            if ($rootScope.isEmpty($scope.model._value)) {
              allRequiredFieldsAreFilledIn = false;
            } else if ($scope.field.properties._ui.dateType == "date-range") {
              if (!$scope.model._value.start || !$scope.model._value.end) {
                allRequiredFieldsAreFilledIn = false;
              }
            } else {
              // Require at least one checkbox is checked.
              var hasValue = false;
              angular.forEach($scope.model._value, function(value, key) {
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
          $scope.$emit('emptyRequiredField', ['add', $scope.field.properties._ui.title, $scope.uuid]);
        }
      }

      // If field is required and is not empty, check to see if it needs to be removed from empty fields array
      if ($scope.field.properties._ui.requiredValue && allRequiredFieldsAreFilledIn) {
        //remove from emptyRequiredField array
        $scope.$emit('emptyRequiredField', ['remove', $scope.field.properties._ui.title, $scope.uuid]);
      }

      var allFieldsAreValid = true;
      if ($rootScope.hasValueConstraint($scope.field.properties._valueConstraints)) {

        if (angular.isArray($scope.model)) {
          angular.forEach($scope.model, function(valueElement) {
            if (angular.isArray(valueElement.value)) {
              angular.forEach(valueElement.value, function(ve) {
                if (!$rootScope.isValueConformedToConstraint(ve, $scope.field["@id"], $scope.field.properties._valueConstraints)) {
                  allFieldsAreValid = false;
                }
              });
            } else if (angular.isObject(valueElement.value)) {
              if (!$rootScope.isValueConformedToConstraint(valueElement.value, $scope.field["@id"], $scope.field.properties._valueConstraints)) {
                allFieldsAreValid = false;
              }
            }
          });
        } else {
          if (angular.isArray($scope.model.value)) {
            angular.forEach($scope.model.value, function(ve) {
              if (!$rootScope.isValueConformedToConstraint(ve, $scope.field["@id"], $scope.field.properties._valueConstraints)) {
                allFieldsAreValid = false;
              }
            });
          } else if (angular.isObject($scope.model.value)) {
            if (!$rootScope.isValueConformedToConstraint($scope.model.value, $scope.field["@id"], $scope.field.properties._valueConstraints)) {
              allFieldsAreValid = false;
            }
          }
        }

        if (!allFieldsAreValid) {
          // add this field instance the the invalidFieldValues array
          $scope.$emit('invalidFieldValues', ['add', $scope.field.properties._ui.title, $scope.uuid]);
        }
      }

      if (allFieldsAreValid) {
        //remove from emptyRequiredField array
        $scope.$emit('invalidFieldValues', ['remove', $scope.field.properties._ui.title, $scope.uuid]);
      }
    });

    var field = $scope.field.properties._ui
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
                $scope.model[i]["_value"] = angular.copy(field.default_option);
              }
            } else {
              for (var i = 0; i < min; i++) {
                if (['checkbox'].indexOf(field.inputType) >= 0 ||
                    ['date'].indexOf(field.inputType) >= 0 && field.dateType == "date-range") {
                  $scope.model[i]['_value'] = {};
                } else if (['list'].indexOf(field.inputType) >= 0) {
                  $scope.model[i]['_value'] = [];
                } else {
                  $scope.model[i]['_value'] = "";
                }
              }
            }
          } else {
            angular.forEach($scope.model, function(m, i) {
              if (!("_value" in m)) {
                if (field.default_option) {
                  $scope.model[i]["_value"] = angular.copy(field.default_option);
                } else {
                  if (['checkbox'].indexOf(field.inputType) >= 0 ||
                      ['date'].indexOf(field.inputType) >= 0 && field.dateType == "date-range") {
                    $scope.model[i]['_value'] = {};
                  } else if (['list'].indexOf(field.inputType) >= 0) {
                    $scope.model[i]['_value'] = [];
                  } else {
                    $scope.model[i]['_value'] = "";
                  }
                }
              }
              $scope.setValueType();
            });
          }
        } else {
          if (!("_value" in $scope.model)) {
            if (field.default_option) {
              $scope.model["_value"] = angular.copy(field.default_option);
            } else {
              if (['checkbox'].indexOf(field.inputType) >= 0 ||
                  ['date'].indexOf(field.inputType) >= 0 && field.dateType == "date-range") {
                $scope.model['_value'] = {};
              } else if (['list'].indexOf(field.inputType) >= 0) {
                $scope.model['_value'] = [];
              } else {
                $scope.model['_value'] = "";
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
      var inputType = 'element';
      if ($scope.field.properties._ui.inputType) {
        inputType = $scope.field.properties._ui.inputType;
      }
      return './views/directive-templates/field-' + $scope.directory + '/' + inputType + '.html';
    }

    $scope.addMoreInput = function() {
      if ($scope.field.minItems && (!$scope.field.maxItems || $scope.model.length < $scope.field.maxItems)) {
        var seed = angular.copy($scope.model[0]);

        if (field.default_option) {
          seed["_value"] = angular.copy(field.default_option);
        } else {
          if (['checkbox'].indexOf(field.inputType) >= 0 ||
              ['date'].indexOf(field.inputType) >= 0 && field.dateType == "date-range") {
            seed['_value'] = {};
          } else if (['list'].indexOf(field.inputType) >= 0) {
            seed['_value'] = [];
          } else {
            seed['_value'] = "";
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

    if ($scope.directory == "render" &&
        $scope.field.properties._ui.inputType == "textfield" &&
        $rootScope.hasValueConstraint($scope.field.properties._valueConstraints)) {
      if ($rootScope.isArray($scope.model)) {
        $scope.modelValue = [];
        angular.forEach($scope.model, function(m, i) {
          // TODO: Push valid value if m is present.
          if (m._value) {
            $scope.modelValue.push({_value: {"@id": m._value, label: m._valueLabel}});
          } else {
            $scope.modelValue.push({});
          }
        });
      } else {
        if ($scope.model._value) {
          $scope.modelValue = {_value: {"@id": $scope.model._value, label: $scope.model._valueLabel}};
        } else {
          $scope.modelValue = {};
        }
      }

      $scope.$watch("modelValue", function(newValue, oldValue) {
        if ($rootScope.isArray($scope.model)) {
          angular.forEach($scope.modelValue, function(m, i) {
            if (m && m._value && m._value["@id"]) {
              $scope.model[i]._value = m._value["id"];
              $scope.model[i]._valueLabel = m._value.label;
            } else {
              delete $scope.model[i]._value;
              delete $scope.model[i]._valueLabel;
            }
          });
        } else {
          if (newValue && newValue._value && newValue._value["@id"]) {
            $scope.model._value = newValue._value["@id"];
            $scope.model._valueLabel = newValue._value.label;
          } else if (oldValue) {
            delete $scope.model._value;
            delete $scope.model._valueLabel;
          }
        }
      }, true);
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
      option: '&',
      ngDisabled: "="
    },
    controller: function($scope, $element) {

      var addPopover = function($scope) {
        //Initializing Bootstrap Popover fn for each item loaded
        setTimeout(function() {
          if ($element.find('#field-value-tooltip').length > 0) {
            $element.find('#field-value-tooltip').popover();
          } else if ($element.find('[data-toggle="popover"]').length > 0) {
            $element.find('[data-toggle="popover"]').popover();
          }
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

