'use strict';

var fieldDirective = function($rootScope, $http, $compile, $document, SpreadsheetService, DataManipulationService) {
  var linker = function($scope, $element, attrs) {

    var setDirectory = function() {
      var state = $rootScope.propertiesOf($scope.field)._ui.state || "creating";

      if ((state == "creating" || state == "editing") && !$scope.preview) {
        $scope.directory = "create";
      } else {
        $scope.directory = "render";
      }
    }
    setDirectory();

    $scope.setValueType = function() {
      var properties = $rootScope.propertiesOf($scope.field);
      var typeEnum = properties['@type'].oneOf[0].enum;
      if (angular.isDefined(typeEnum) && angular.isArray(typeEnum)) {
        if (typeEnum.length == 1) {
          $scope.model['@type'] = properties['@type'].oneOf[0].enum[0];
        } else {
          $scope.model['@type'] = properties['@type'].oneOf[0].enum;
        }
      }
    }

    var parseField = function() {
      if (!$rootScope.isRuntime() && $scope.field) {
        // $scope.model = $scope.model || {};
        // $rootScope.findChildren($rootScope.propertiesOf($scope.field), $scope.model);

        var min = $scope.field.minItems || 1;

        if (!$rootScope.isCardinalElement($scope.field)) {
          $scope.model = {};
        } else {
          $scope.model = [];
          for (var i = 0; i < min; i++) {
            var obj = {};
            $scope.model.push(obj);
          }
        }

        var p = $rootScope.propertiesOf($scope.field);
        if (!p) {
          console.log("Line 48 ", $scope.field);
        }

        // Add @type information to instance at the field level
        if (p && !angular.isUndefined(p['@type'])) {
          var type = $rootScope.generateInstanceType(p['@type']);

          if (type) {
            if (angular.isArray($scope.model)) {
              for (var i = 0; i < min; i++) {
                $scope.model[i]["@type"] = type || "";
              }
            } else {
              $scope.model["@type"] = type || "";
            }
          }
        }
      }
    }

    // When form submit event is fired, check field for simple validation
    $scope.$on('submitForm', function (event) {
      // If field is required and is empty, emit failed emptyRequiredField event
      if ($rootScope.propertiesOf($scope.field)._valueConstraints.requiredValue) {
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
                } else if ($rootScope.propertiesOf($scope.field)._ui.dateType == "date-range") {
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
            } else if ($rootScope.propertiesOf($scope.field)._ui.dateType == "date-range") {
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
          $scope.$emit('emptyRequiredField', ['add', $rootScope.propertiesOf($scope.field)._ui.title, $scope.uuid]);
        }
      }

      // If field is required and is not empty, check to see if it needs to be removed from empty fields array
      if ($rootScope.propertiesOf($scope.field)._valueConstraints.requiredValue && allRequiredFieldsAreFilledIn) {
        //remove from emptyRequiredField array
        $scope.$emit('emptyRequiredField', ['remove', $rootScope.propertiesOf($scope.field)._ui.title, $scope.uuid]);
      }

      var allFieldsAreValid = true;
      if ($rootScope.hasValueConstraint($rootScope.propertiesOf($scope.field)._valueConstraints)) {

        if (angular.isArray($scope.model)) {
          angular.forEach($scope.model, function(valueElement) {
            if (angular.isArray(valueElement._value)) {
              angular.forEach(valueElement._value, function(ve) {
                if (!$rootScope.isValueConformedToConstraint(ve, $scope.field["@id"], $rootScope.propertiesOf($scope.field)._valueConstraints)) {
                  allFieldsAreValid = false;
                }
              });
            } else if (angular.isObject(valueElement._value)) {
              if (!$rootScope.isValueConformedToConstraint(valueElement._value, $scope.field["@id"], $rootScope.propertiesOf($scope.field)._valueConstraints)) {
                allFieldsAreValid = false;
              }
            }
          });
        } else {
          if (angular.isArray($scope.model._value)) {
            angular.forEach($scope.model._value, function(ve) {
              if (!$rootScope.isValueConformedToConstraint(ve, $scope.field["@id"], $rootScope.propertiesOf($scope.field)._valueConstraints)) {
                allFieldsAreValid = false;
              }
            });
          } else if (angular.isObject($scope.model._value)) {
            if (!$rootScope.isValueConformedToConstraint($scope.model._value, $scope.field["@id"], $rootScope.propertiesOf($scope.field)._valueConstraints)) {
              allFieldsAreValid = false;
            }
          }
        }

        if (!allFieldsAreValid) {
          // add this field instance the the invalidFieldValues array
          $scope.$emit('invalidFieldValues', ['add', $rootScope.propertiesOf($scope.field)._ui.title, $scope.uuid]);
        }
      }

      if (allFieldsAreValid) {
        //remove from emptyRequiredField array
        $scope.$emit('invalidFieldValues', ['remove', $rootScope.propertiesOf($scope.field)._ui.title, $scope.uuid]);
      }
    });

    var field = $rootScope.propertiesOf($scope.field)._ui
    // Checking each field to see if required, will trigger flag for use to see there is required fields
    if (field.required) {
      $scope.$emit('formHasRequiredFields');
    }

    // Added by cedar
    if ($scope.directory == 'render') {
      if ($scope.model) {
        if ($rootScope.isArray($scope.model)) {
          if ($scope.model.length == 0) {
            var min = $scope.field.minItems || 1;

            if (field.defaultOption) {
              for (var i = 0; i < min; i++) {
                $scope.model[i]["_value"] = angular.copy(field.defaultOption);
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
                if (field.defaultOption) {
                  $scope.model[i]["_value"] = angular.copy(field.defaultOption);
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
            if (field.defaultOption) {
              $scope.model["_value"] = angular.copy(field.defaultOption);
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

    $scope.uuid = DataManipulationService.generateTempGUID();

    // Retrive appropriate field template file
    $scope.getTemplateUrl = function() {
      var inputType = 'element';
      if ($rootScope.propertiesOf($scope.field)._ui.inputType) {
        inputType = $rootScope.propertiesOf($scope.field)._ui.inputType;
      }

      return 'views/directive-templates/field-' + $scope.directory + '/' + inputType + '.html';
    }

    $scope.addMoreInput = function() {
      if ($scope.field.minItems && (!$scope.field.maxItems || $scope.model.length < $scope.field.maxItems)) {
        var seed = angular.copy($scope.model[0]);

        if (field.defaultOption) {
          seed["_value"] = angular.copy(field.defaultOption);
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

    $scope.checkFieldConditions = function (properties) {
      var unmetConditions = [],
        extraConditionInputs = ['checkbox', 'radio', 'list'];

      // Field title is already required, if it's empty create error message
      if (!properties._ui.title) {
        unmetConditions.push('"Enter Field Title" input cannot be left empty.');
      }

      // If field is within multiple choice field types
      if (extraConditionInputs.indexOf(properties._ui.inputType) !== -1) {
        var optionMessage = '"Enter Option" input cannot be left empty.';
        angular.forEach(properties._ui.options, function (value, index) {
          // If any 'option' title text is left empty, create error message
          if (!value.text.length && unmetConditions.indexOf(optionMessage) == -1) {
            unmetConditions.push(optionMessage);
          }
        });
      }
      // If field type is 'radio' or 'pick from a list' there must be more than one option created
      if ((properties._ui.inputType == 'radio' || properties._ui.inputType == 'list') && properties._ui.options && (properties._ui.options.length <= 1)) {
        unmetConditions.push('Multiple Choice fields must have at least two possible options');
      }
      // Return array of error messages
      return unmetConditions;
    };

    // Switch from creating to completed.
    $scope.add = function() {
      var p = $rootScope.propertiesOf($scope.field);
      $scope.errorMessages = $scope.checkFieldConditions(p);
      $scope.errorMessages = jQuery.merge($scope.errorMessages, $rootScope.checkFieldCardinalityOptions($scope.field));

      if ($scope.errorMessages.length == 0) {

        if (!p._ui.is_cardinal_field) {
          $scope.field.minItems = 1;
          $scope.field.maxItems = 1;
        }

        if ($scope.field.maxItems == 1) {
          if ($scope.field.items) {
            $rootScope.uncardinalizeField($scope.field);
          }
        } else {
          if (!$scope.field.items) {
            $rootScope.cardinalizeField($scope.field);
          }
        }

        $rootScope.propertiesOf($scope.field)._ui.state = "completed";
        parseField();
      }
    };

    // Function to add additional options for radio, checkbox, and list fieldTypes
    $scope.option = function () {
      var emptyOption = {
        "text": ""
      };

      $rootScope.propertiesOf($scope.field)._ui.options.push(emptyOption);
    };

    $scope.edit = function() {
      $rootScope.propertiesOf($scope.field)._ui.state = "creating";
    };

    $scope.$watch("field", function() {
      setDirectory();
    }, true);

    $scope.$watch("model", function() {
      if ($scope.directory == "render" &&
          $rootScope.propertiesOf($scope.field)._ui.inputType == "textfield" &&
          $rootScope.hasValueConstraint($rootScope.propertiesOf($scope.field)._valueConstraints)) {
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
          if ($scope.model && $scope.model._value) {
            $scope.modelValue = {_value: {"@id": $scope.model._value, label: $scope.model._valueLabel}};
          } else {
            $scope.modelValue = {};
          }
        }
      }

      // If a default value is set from the field item configuration, set $scope.model to its value
      if ($scope.directory == 'render') {
        if ($scope.model) {
          if ($rootScope.isArray($scope.model)) {
            if ($scope.model.length == 0) {
              var min = $scope.field.minItems || 1;

              if (field.defaultOption) {
                for (var i = 0; i < min; i++) {
                  $scope.model[i]["_value"] = angular.copy(field.defaultOption);
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
                  if (field.defaultOption) {
                    $scope.model[i]["_value"] = angular.copy(field.defaultOption);
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
              if (field.defaultOption) {
                $scope.model["_value"] = angular.copy(field.defaultOption);
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
    }, true);
  }

  return {
    templateUrl: 'views/directive-templates/field-directive.html',
    restrict: 'EA',
    scope: {
      field: '=',
      model: '=',
      preview: "=",
      delete: '&',
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

fieldDirective.$inject = ["$rootScope", "$http", "$compile", "$document", "SpreadsheetService", "DataManipulationService"];
angularApp.directive('fieldDirective', fieldDirective);
