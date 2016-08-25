'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.form.fieldDirective', [])
      .directive('fieldDirective', fieldDirective);

  // TODO: refactor to cedarFieldDirective <cedar-field-directive>


  fieldDirective.$inject = ["$rootScope", "$sce", "$document", "$translate", "SpreadsheetService",
                            "DataManipulationService", "FieldTypeService", "controlledTermDataService",
                            "StringUtilsService"];

  function fieldDirective($rootScope, $sce, $document, $translate, SpreadsheetService, DataManipulationService,
                          FieldTypeService, controlledTermDataService, StringUtilsService) {

    var linker = function ($scope, $element, attrs) {

      var MIN_OPTIONS = 2;

      var setDirectory = function () {
        var p = $rootScope.propertiesOf($scope.field);
        var state = p._tmp && p._tmp.state || "completed";
        if ((state == "creating") && !$scope.preview && !$rootScope.isRuntime()) {
          $scope.directory = "create";
        } else {
          $scope.directory = "render";
        }
      };

      setDirectory();

      $scope.console = function (value) {
        console.log(value);
      };

      $scope.setValueType = function () {
        var properties = $rootScope.propertiesOf($scope.field);
        var typeEnum = properties['@type'].oneOf[0].enum;
        if (angular.isDefined(typeEnum) && angular.isArray(typeEnum)) {
          if (typeEnum.length == 1) {
            $scope.model['@type'] = properties['@type'].oneOf[0].enum[0];
          } else {
            $scope.model['@type'] = properties['@type'].oneOf[0].enum;
          }
        }
      };

      var parseField = function () {
        if (!$rootScope.isRuntime() && $scope.field) {
          // $scope.model = $scope.model || {};
          // $rootScope.findChildren($rootScope.propertiesOf($scope.field), $scope.model);
          var min = $scope.field.minItems || 0;

          if (!DataManipulationService.isCardinalElement($scope.field)) {
            $scope.model = {};
          } else {
            $scope.model = [];
            for (var i = 0; i < min; i++) {
              var obj = {};
              $scope.model.push(obj);
            }
          }
          var p = $rootScope.propertiesOf($scope.field);
          // Add @type information to instance at the field level
          if (p && !angular.isUndefined(p['@type'])) {
            var type = DataManipulationService.generateInstanceType(p['@type']);

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
      };

      // When form submit event is fired, check field for simple validation
      $scope.$on('submitForm', function (event) {
        //console.log('submitForm');

        // If field is required and is empty, emit failed emptyRequiredField event
        if ($rootScope.schemaOf($scope.field)._valueConstraints && $rootScope.schemaOf($scope.field)._valueConstraints.requiredValue) {
          var allRequiredFieldsAreFilledIn = true;
          var min = $scope.field.minItems || 0;

          if (angular.isArray($scope.model)) {
            if ($scope.model.length < min) {
              allRequiredFieldsAreFilledIn = false;
            } else {
              angular.forEach($scope.model, function (valueElement) {
                if (!valueElement || !valueElement['@value']) {
                  allRequiredFieldsAreFilledIn = false;
                } else if (angular.isArray(valueElement['@value'])) {
                  var hasValue = false;
                  angular.forEach(valueElement['@value'], function (ve) {
                    hasValue = hasValue || !!ve;
                  });

                  if (!hasValue) {
                    allRequiredFieldsAreFilledIn = false;
                  }
                } else if (angular.isObject(valueElement['@value'])) {
                  if ($rootScope.isEmpty(valueElement['@value'])) {
                    allRequiredFieldsAreFilledIn = false;
                  } else if (DataManipulationService.getFieldSchema($scope.field)._ui.dateType == "date-range") {
                    if (!valueElement['@value'].start || !valueElement['@value'].end) {
                      allRequiredFieldsAreFilledIn = false;
                    }
                  } else {
                    // Require at least one checkbox is checked.
                    var hasValue = false;
                    angular.forEach(valueElement['@value'], function (value, key) {
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
            if (!$scope.model || !$scope.model['@value']) {
              allRequiredFieldsAreFilledIn = false;
            } else if (angular.isArray($scope.model['@value'])) {
              var hasValue = false;
              angular.forEach($scope.model['@value'], function (ve) {
                hasValue = hasValue || !!ve;
              });

              if (!hasValue) {
                allRequiredFieldsAreFilledIn = false;
              }
            } else if (angular.isObject($scope.model['@value'])) {
              if ($rootScope.isEmpty($scope.model['@value'])) {
                allRequiredFieldsAreFilledIn = false;
              } else if (DataManipulationService.getFieldSchema($scope.field)._ui.dateType == "date-range") {
                if (!$scope.model['@value'].start || !$scope.model['@value'].end) {
                  allRequiredFieldsAreFilledIn = false;
                }
              } else {
                // Require at least one checkbox is checked.
                var hasValue = false;
                angular.forEach($scope.model['@value'], function (value, key) {
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
            $scope.$emit('emptyRequiredField',
                ['add', DataManipulationService.getFieldSchema($scope.field)._ui.title, $scope.uuid]);
          }
        }

        // If field is required and is not empty, check to see if it needs to be removed from empty fields array
        if ($rootScope.schemaOf($scope.field)._valueConstraints && $rootScope.schemaOf($scope.field)._valueConstraints.requiredValue && allRequiredFieldsAreFilledIn) {
          //remove from emptyRequiredField array
          $scope.$emit('emptyRequiredField',
              ['remove', DataManipulationService.getFieldSchema($scope.field)._ui.title, $scope.uuid]);
        }

        var allFieldsAreValid = true;
        if ($rootScope.hasValueConstraint($rootScope.schemaOf($scope.field)._valueConstraints)) {

          if (angular.isArray($scope.model)) {
            angular.forEach($scope.model, function (valueElement) {
              if (angular.isArray(valueElement['@value'])) {
                angular.forEach(valueElement['@value'], function (ve) {
                  if (!$rootScope.isValueConformedToConstraint(ve, $scope.field["@id"],
                          $rootScope.schemaOf($scope.field)._valueConstraints)) {
                    allFieldsAreValid = false;
                  }
                });
              } else if (angular.isObject(valueElement['@value'])) {
                if (!$rootScope.isValueConformedToConstraint(valueElement['@value'], $scope.field["@id"],
                        $rootScope.schemaOf($scope.field)._valueConstraints)) {
                  allFieldsAreValid = false;
                }
              }
            });
          } else {
            if (angular.isArray($scope.model['@value'])) {
              angular.forEach($scope.model['@value'], function (ve) {
                if (!$rootScope.isValueConformedToConstraint(ve, $scope.field["@id"],
                        $rootScope.schemaOf($scope.field)._valueConstraints)) {
                  allFieldsAreValid = false;
                }
              });
            } else if (angular.isObject($scope.model['@value'])) {
              if (!$rootScope.isValueConformedToConstraint($scope.model['@value'], $scope.field["@id"],
                      $rootScope.schemaOf($scope.field)._valueConstraints)) {
                allFieldsAreValid = false;
              }
            }
          }

          if (!allFieldsAreValid) {
            // add this field instance the the invalidFieldValues array
            $scope.$emit('invalidFieldValues',
                ['add', DataManipulationService.getFieldSchema($scope.field)._ui.title, $scope.uuid]);
          }
        }

        if (allFieldsAreValid) {
          //remove from emptyRequiredField array
          $scope.$emit('invalidFieldValues',
              ['remove', DataManipulationService.getFieldSchema($scope.field)._ui.title, $scope.uuid]);
        }
      });

      $scope.$on("saveForm", function () {
        //var p = $rootScope.propertiesOf($scope.field);
        if ($scope.isEditState() && !$scope.canDeselect($scope.field)) {
          $scope.$emit("invalidFieldState",
              ["add", DataManipulationService.getFieldSchema($scope.field)._ui.title, $scope.field["@id"]]);
        } else {
          $scope.$emit("invalidFieldState",
              ["remove", DataManipulationService.getFieldSchema($scope.field)._ui.title, $scope.field["@id"]]);
        }
      });

      var field = DataManipulationService.getFieldSchema($scope.field)

      // This function creates the defaultOptions field when default options are selected. If the user does not select
      // any default options, the field will not be shown.
      $scope.initializeDefaultOptions = function () {
        console.log('Initial result');
        console.log(field._valueConstraints.defaultOptions);
        if (!(field._valueConstraints.defaultOptions.constructor === Array)) {
          var tmp = field._valueConstraints.defaultOptions;
          field._valueConstraints.defaultOptions = [];
          for (var value in tmp) {
            field._valueConstraints.defaultOptions.push(value);
          }
        }
        console.log(field._valueConstraints.defaultOptions);
      }

      // Sets the value of the variable that stores the ng-model for the checkbox/radio/list field
      $scope.setSelectedOptionsModel = function() {
        $rootScope.selectedOptionsModel = {};
        if (field._valueConstraints.defaultOptions) {
          for (var i=0; i<field._valueConstraints.defaultOptions.length; i++) {
            var index = field._valueConstraints.defaultOptions[i];
            $rootScope.selectedOptionsModel[index] = true;
          }
        }
        console.log($rootScope.selectedOptionsModel);
      }

      // Sets the defaultOptions based on the selectedOptionsModel variable
      $scope.setDefaultOptions = function() {
        // Reset defaultOptions or remove it if necessary
        field._valueConstraints.defaultOptions = [];
        for (var defaultOptionIndex in $rootScope.defaultOptionsModel) {
          if ($rootScope.defaultOptionsModel[defaultOptionIndex] == true) {
            field._valueConstraints.defaultOptions.push(parseInt(defaultOptionIndex));
          }
        }
        // If empty, remove it
        if (field._valueConstraints.defaultOptions.length == 0) {
          delete field._valueConstraints.defaultOptions;
        }
      }

      // Sets the instance @value fields based on the selectedOptionsModel variable
      $scope.setValues = function () {
        $scope.model = [];
        var noOptionsSelected = true;
        for (var defaultOptionIndex in $rootScope.selectedOptionsModel) {
          if ($rootScope.selectedOptionsModel[defaultOptionIndex] == true) {
            noOptionsSelected = false;
            $scope.model.push({'@value': field._valueConstraints.literals[defaultOptionIndex].label})
          }
        }
        if (noOptionsSelected) {
          // Default value
          $scope.model = [{'@value': null}];
        }
      }

      // Checking each field to see if required, will trigger flag for use to see there is required fields
      if (field._valueConstraints.requiredValue) {
        $scope.$emit('formHasRequiredfield._uis');
      }

      if ($scope.directory == 'render') {
        if ($scope.model) {
          // It is an Array
          if ($rootScope.isArray($scope.model)) {
            if ($scope.model.length == 0) {
              var min = $scope.field._ui.minItems || 0;

              if (field._valueConstraints.defaultOptions) {
                for (var i = 0; i < min; i++) {
                  $scope.model[i] = [];
                  for (var j = 0; j < field._valueConstraints.defaultOptions.length; j++) {
                    var v = new Object();
                    v['@value'] = field._valueConstraints.literals[field._valueConstraints.defaultOptions[j]];
                    $scope.model[i].push(v);
                  }
                }
              } else {
                for (var i = 0; i < min; i++) {
                  if (['checkbox'].indexOf(field._ui.inputType) >= 0 ||
                      ['date'].indexOf(field._ui.inputType) >= 0 && field._ui.dateType == "date-range") {
                    $scope.model[i]['@value'] = {};
                  } else if (['list'].indexOf(field._ui.inputType) >= 0) {
                    $scope.model[i]['@value'] = [];
                  } else {
                    $scope.model[i]['@value'] = "";
                  }
                }
              }
            } else {
              angular.forEach($scope.model, function (m, i) {
                if (!('@value' in m)) {
                  if (field._valueConstraints.defaultOptions) {
                    $scope.model[i]['@value'] = angular.copy(field._valueConstraints.defaultOptions);
                  } else {
                    if (['checkbox'].indexOf(field._ui.inputType) >= 0 ||
                        ['date'].indexOf(field._ui.inputType) >= 0 && field._ui.dateType == "date-range") {
                      $scope.model[i]['@value'] = {};
                    } else if (['list'].indexOf(field._ui.inputType) >= 0) {
                      $scope.model[i]['@value'] = [];
                    } else {
                      $scope.model[i]['@value'] = "";
                    }
                  }
                }
                $scope.setValueType();
              });
            }
            // It is not an array
          } else {
            if (!('@value' in $scope.model)) {
              if (field._valueConstraints.defaultOptions) {
                if (field._valueConstraints.defaultOptions.length == 1) {
                  $scope.model['@value'] = field._valueConstraints.literals[field._valueConstraints.defaultOptions[0]].label;
                }
                else if (field._valueConstraints.defaultOptions.length > 1) {
                  $scope.model = [];
                  for (var i = 0; i < field._valueConstraints.defaultOptions.length; i++) {
                    var v = new Object();
                    v['@value'] = field._valueConstraints.literals[field._valueConstraints.defaultOptions[i]].label;
                    $scope.model.push(v);
                  }
                }
              } else {
                //if (['checkbox'].indexOf(field._ui.inputType) >= 0 || ['date'].indexOf(field._ui.inputType) >= 0 && field._ui.dateType == "date-range") {
                if (['checkbox'].indexOf(field._ui.inputType) >= 0 || ['date'].indexOf(field._ui.inputType) >= 0 && field._ui.dateType == "date-range") {
                  $scope.model['@value'] = {};
                //} else if (['list'].indexOf(field._ui.inputType) >= 0) {
                //  $scope.model['@value'] = [];
                } else {
                  $scope.model['@value'] = "";
                }
              }
            }
          }
          $scope.setValueType();
        }
      }

      $scope.setDefaults = function (field) {
        var schema = $rootScope.schemaOf(field);

        // default title
        if (!schema._ui.title) {
          schema._ui.title = $translate.instant("VALIDATION.noNameField");
        }

        // default description
        if (!schema._ui.description) {
          schema._ui.description = $translate.instant("VALIDATION.noDescriptionField");
        }

        // if this is radio, checkbox or list,  add at least two options and set default values
        if (schema._ui.inputType == "radio" || schema._ui.inputType == "checkbox" || schema._ui.inputType == "list") {

          // make sure we have the minimum number of options
          while (schema._valueConstraints.literals.length < MIN_OPTIONS) {
            var emptyOption = {
              "label": name || ""
            };
            schema._valueConstraints.literals.push(emptyOption);
          }

          // and they all have text fields filled in
          for (var i = 0; i < schema._valueConstraints.literals.length; i++) {
            if (schema._valueConstraints.literals[i].label.length == 0) {
              schema._valueConstraints.literals[i].label = $translate.instant("VALIDATION.noNameField");
            }
          }
        }
      };

      $scope.uuid = DataManipulationService.generateTempGUID();

      // Retrieve appropriate field template file
      $scope.getTemplateUrl = function () {
        var inputType = 'element';
        var schema = $rootScope.schemaOf($scope.field);

        if (schema._ui.inputType) {
          inputType = schema._ui.inputType;
        }
        return 'scripts/form/field-' + $scope.directory + '/' + inputType + '.html';
      };

      $scope.addMoreInput = function () {
        if ((!$scope.field.maxItems || $scope.model.length < $scope.field.maxItems)) {
          var seed = {};
          if ($scope.model.length > 0) {
            seed = angular.copy($scope.model[0]);
          }

          if (field._valueConstraints.defaultOptions) {
            seed['@value'] = angular.copy(field._valueConstraints.defaultOptions);
          } else {
            if (['checkbox'].indexOf(field._ui.inputType) >= 0 ||
                ['date'].indexOf(field._ui.inputType) >= 0 && field._ui.dateType == "date-range") {
              seed['@value'] = {};
            } else if (['list'].indexOf(field._ui.inputType) >= 0) {
              seed['@value'] = [];
            } else {
              seed['@value'] = "";
            }
          }

          $scope.model.push(seed);
        }
      };

      $scope.removeInput = function (index) {
        var min = $scope.field.minItems || 0;
        if ($scope.model.length > min) {
          $scope.model.splice(index, 1);
        }
      };

      $scope.switchToSpreadsheet = function () {
        SpreadsheetService.switchToSpreadsheetField($scope, $element);
      };

      $scope.$watch("modelValue", function (newValue, oldValue) {

        if ($rootScope.isArray($scope.model)) {
          angular.forEach($scope.modelValue, function (m, i) {
            if (m && m['@value'] && m['@value']["@id"]) {
              $scope.model[i]['@value'] = m['@value']["id"];
              $scope.model[i]._valueLabel = m['@value'].label;
            } else {
              delete $scope.model[i]['@value'];
              delete $scope.model[i]._valueLabel;
            }
          });
        } else {
          if (newValue && newValue['@value'] && newValue['@value']["@id"]) {
            $scope.model['@value'] = newValue['@value']["@id"];
            $scope.model._valueLabel = newValue['@value'].label;
          } else if (oldValue) {
            delete $scope.model['@value'];
            delete $scope.model._valueLabel;
          }
        }

      }, true);

      // look for errors
      $scope.checkFieldConditions = function (field) {
        field = $rootScope.schemaOf(field);

        var unmetConditions = [],
            extraConditionInputs = ['checkbox', 'radio', 'list'];

        // Field title is required, if it's empty create error message
        if (!field._ui.title) {
          unmetConditions.push('"Enter Field Title" input cannot be left empty.');
        }

        // If field is within multiple choice field types
        if (extraConditionInputs.indexOf(field._ui.inputType) !== -1) {
          var optionMessage = '"Enter Option" input cannot be left empty.';
          angular.forEach(field._valueConstraints.literals, function (value, index) {
            // If any 'option' title text is left empty, create error message
            if (!value.label.length && unmetConditions.indexOf(optionMessage) == -1) {
              unmetConditions.push(optionMessage);
            }
          });
        }
        // If field type is 'radio' or 'pick from a list' there must be more than one option created
        if ((field._ui.inputType == 'radio' || field._ui.inputType == 'list') && field._valueConstraints.literals && (field._valueConstraints.literals.length <= 1)) {
          unmetConditions.push('Multiple Choice fields must have at least two possible options');
        }
        // Return array of error messages
        return unmetConditions;
      };

      // try to select this field
      $scope.canSelect = function (select) {
        var result = select;
        if (select) {
          result = DataManipulationService.canSelect($scope.field);
          //$scope.toggleControlledTerm('none');
        }
        return result;
      };

      // try to deselect this field
      $scope.canDeselect = function (field) {
        return DataManipulationService.canDeselect(field, $scope.renameChildKey);
      };

      // watch for this field's deselect
      $scope.$on('deselect', function (event, args) {
        var field = args[0];
        var errors = args[1];

        if (field == $scope.field) {
          $scope.errorMessages = errors;
          if ($scope.errorMessages.length == 0) parseField();
        }
      });

      /**
       * Use the fieldType to determine if the field supports using controlled terms
       * @returns {boolean} hasControlledTerms
       */
      $scope.hasControlledTerms = function () {
        var fieldTypes = FieldTypeService.getFieldTypes();
        var inputType = 'element';
        if (DataManipulationService.getFieldSchema($scope.field)._ui.inputType) {
          inputType = DataManipulationService.getFieldSchema($scope.field)._ui.inputType;
          for (var i = 0; i < fieldTypes.length; i++) {
            if (fieldTypes[i].cedarType === inputType) {
              return fieldTypes[i].hasControlledTerms;
            }
          }
        }
        return false;
      };

      /**
       * Use the fieldType to determine if the field supports multiple instances
       * @returns {boolean} allowsMultiple
       */
      $scope.allowsMultiple = function () {
        var inputType = $rootScope.schemaOf($scope.field)._ui.inputType;
        var fieldTypes = FieldTypeService.getFieldTypes();
        for (var i = 0; i < fieldTypes.length; i++) {
          if (fieldTypes[i].cedarType === inputType) {
            return fieldTypes[i].allowsMultiple;
          }
        }
      };

      $scope.hasDateRange = function () {
        var inputType = $rootScope.schemaOf($scope.field)._ui.inputType;
        return (inputType === "date");
      };

      /**
       * Turn my field into a youtube iframe.
       * @param field
       * @returns {string} html
       */
      $scope.getYouTubeEmbedFrame = function (field) {

        var width = 560;
        var height = 315;
        var content = $rootScope.propertiesOf(field)._content.replace(/<(?:.|\n)*?>/gm, '');

        if ($rootScope.propertiesOf(field)._size && $rootScope.propertiesOf(field)._size.width && Number.isInteger($rootScope.propertiesOf(field)._size.width)) {
          width = $rootScope.propertiesOf(field)._size.width;
        }
        if ($rootScope.propertiesOf(field)._size && $rootScope.propertiesOf(field)._size.height && Number.isInteger($rootScope.propertiesOf(field)._size.height)) {
          height = $rootScope.propertiesOf(field)._size.height;
        }

        // if I say trust as html, then better make sure it is safe first
        return $sce.trustAsHtml('<iframe width="' + width + '" height="' + height + '" src="https://www.youtube.com/embed/' + content + '" frameborder="0" allowfullscreen></iframe>');

      };

      $scope.$watch("field", function (newField, oldField) {
        setDirectory();
      }, true);

      $scope.$watch("model", function () {
        if ($scope.directory == "render" &&
            DataManipulationService.getFieldSchema($scope.field)._ui.inputType == "textfield" &&
            $rootScope.hasValueConstraint($rootScope.schemaOf($scope.field)._valueConstraints)) {
          if ($rootScope.isArray($scope.model)) {
            $scope.modelValue = [];
            angular.forEach($scope.model, function (m, i) {
              // TODO: Push valid value if m is present.
              if (m['@value']) {
                $scope.modelValue.push({'@value': {"@id": m['@value'], label: m._valueLabel}});
              } else {
                $scope.modelValue.push({});
              }
            });
          } else {
            if ($scope.model && $scope.model['@value']) {
              $scope.modelValue = {'@value': {"@id": $scope.model['@value'], label: $scope.model._valueLabel}};
            } else {
              $scope.modelValue = {};
            }
          }
        }

        $scope.isEditState = function () {
          return (DataManipulationService.isEditState($scope.field));
        };

        $scope.isNested = function () {
          return (DataManipulationService.isNested($scope.field));
        };

        $scope.addOption = function () {
          return (DataManipulationService.addOption($scope.field));
        };

        // If a default value is set from the field item configuration, set $scope.model to its value
        if ($scope.directory == 'render') {

          if ($scope.model) {
            if ($rootScope.isArray($scope.model)) {
              if ($scope.model.length == 0) {
                var min = $scope.field.minItems || 0;

                if (field._valueConstraints.defaultOptions) {
                  for (var i = 0; i < min; i++) {
                    $scope.model[i]['@value'] = angular.copy(field._valueConstraints.defaultOptions);
                  }
                } else {
                  for (var i = 0; i < min; i++) {
                    if (['checkbox'].indexOf(field._ui.inputType) >= 0 ||
                        ['date'].indexOf(field._ui.inputType) >= 0 && field._ui.dateType == "date-range") {
                      $scope.model[i]['@value'] = {};
                    } else if (['list'].indexOf(field._ui.inputType) >= 0) {
                      $scope.model[i]['@value'] = [];
                    } else {
                      $scope.model[i]['@value'] = "";
                    }
                  }
                }
              } else {
                angular.forEach($scope.model, function (m, i) {
                  if (!('@value' in m)) {
                    if (field._valueConstraints.defaultOptions) {
                      $scope.model[i]['@value'] = angular.copy(field._valueConstraints.defaultOptions);
                    } else {
                      if (['checkbox'].indexOf(field._ui.inputType) >= 0 ||
                          ['date'].indexOf(field._ui.inputType) >= 0 && field._ui.dateType == "date-range") {
                        $scope.model[i]['@value'] = {};
                      } else if (['list'].indexOf(field._ui.inputType) >= 0) {
                        $scope.model[i]['@value'] = [];
                      } else {
                        $scope.model[i]['@value'] = "";
                      }
                    }
                  }
                  $scope.setValueType();
                });
              }
            } else {
              if (!('@value' in $scope.model)) {
                if (field._valueConstraints.defaultOptions) {
                  $scope.model['@value'] = angular.copy(field._valueConstraints.defaultOptions);
                } else {
                  if (['checkbox'].indexOf(field._ui.inputType) >= 0 ||
                      ['date'].indexOf(field._ui.inputType) >= 0 && field._ui.dateType == "date-range") {
                    $scope.model['@value'] = {};
                  } else if (['list'].indexOf(field._ui.inputType) >= 0) {
                    $scope.model['@value'] = [];
                  } else {
                    $scope.model['@value'] = "";
                  }
                }
              }
            }
            $scope.setValueType();
          }
        }
      }, true);

      /* Value Recommendation functionality */
      // Load values when opening an instance
      if ($scope.model) {
        $scope.modelValueRecommendation = {'@value': {'value': $scope.model['@value']}}
      }

      $scope.updateModelWhenChangeSelection = function (modelvr) {
        // This variable will be used at textfield.html
        $scope.modelValueRecommendation = modelvr;
        if ($rootScope.isArray($scope.model)) {
          angular.forEach(modelvr, function (m, i) {
            if (m && m['@value'] & m['@value'].value) {
              $scope.model[i]['@value'] = m['@value'].value;
            } else {
              delete $scope.model[i]['@value'];
            }
          });
        } else {
          var newValue = modelvr['@value'].value;
          $scope.model['@value'] = newValue;
        }
      };

      $scope.isFirstRefresh = true;
      $scope.setIsFirstRefresh = function (isFirstRefresh) {
        $scope.isFirstRefresh = isFirstRefresh;
      };

      $scope.updateModelWhenRefresh = function (select) {
        if (!$scope.isFirstRefresh) {
          if ($rootScope.isArray($scope.model)) {
            // TODO
          } else {
            $scope.model['@value'] = select.search;
            $scope.modelValueRecommendation['@value'].value = select.search;
          }
        }
      };

      // Updates the search using the selected value
      $scope.updateSearch = function (select) {
        if (select.selected.value) {
          select.search = select.selected.value;
        }
      };
      /* end of Value Recommendation functionality */


      /* start of controlled terms functionality */

      $scope.addedFields = new Map();
      $scope.addedFieldKeys = [];


      /**
       * build a map with the added field controlled term id as the key and the details for that class as the value
       */
      $scope.setAddedFieldMap = function () {


        var fields = DataManipulationService.getFieldControlledTerms($scope.field);

        if (fields) {

          // create a new map to avoid any duplicates coming from the modal
          var myMap = new Map();

          // move the keys into the new map
          for (var i = 0; i < fields.length; i++) {
            var key = fields[i];
            if (myMap.has(key)) {

              // here is a duplicate, so delete it
              DataManipulationService.deleteFieldControlledTerm(key, $scope.field);
            } else {
              myMap.set(key, "");
            }
          }

          // copy over any responses from the old map
          myMap.forEach(function (value, key) {

            if ($scope.addedFields.has(key)) {
              myMap.set(key, $scope.addedFields.get(key));
            }
          }, myMap);


          // get any missing responses
          myMap.forEach(function (value, key) {
            if (myMap.get(key) == "") {
              setResponse(key, DataManipulationService.parseOntologyName(key),
                  DataManipulationService.parseClassLabel(key));
            }
          }, myMap);


          // fill up the key array
          $scope.addedFieldKeys = [];
          myMap.forEach(function (value, key) {
            $scope.addedFieldKeys.push(key);
          }, myMap);

          // hang on to the new map
          $scope.addedFields = myMap;

        }
        else {
          // If there are no controlled terms for the field type defined in the model, the map will be empty
          $scope.addedFields = new Map();
          $scope.addedFieldKeys = [];
        }
      };


      /**
       * get the class details from the server.
       * @param item
       * @param ontologyName
       * @param className
       */
      var setResponse = function (item, ontologyName, className) {

        // Get selected class details from the links.self endpoint provided.
        controlledTermDataService.getClassById(ontologyName, className).then(function (response) {
          $scope.addedFields.set(item, response);
        });
      };

      /**
       * get the ontology name from the addedFields map
       * @param item
       * @returns {string}
       */
      $scope.getOntologyName = function (item) {
        var result = "";
        if ($scope.addedFields && $scope.addedFields.has(item)) {
          result = $scope.addedFields.get(item).ontology;
        }
        return result;
      };

      /**
       * get the class description from the addedFields map
       * @param item
       * @returns {string}
       */
      $scope.getPrefLabel = function (item) {
        var result = "";
        if ($scope.addedFields && $scope.addedFields.has(item)) {
          result = $scope.addedFields.get(item).prefLabel;
        }
        return result;
      };

      $scope.showModal = function (id) {
        jQuery("#" + id).modal('show');
      };

      /**
       * get the class description from the the addedFields map
       * @param item
       * @returns {string}
       */
      $scope.getClassDescription = function (item) {
        var result = "";
        if ($scope.addedFields && $scope.addedFields.has(item)) {
          if ($scope.addedFields.get(item).definitions && $scope.addedFields.get(item).definitions.length > 0) {
            result = $scope.addedFields.get(item).definitions[0];
          }
        }
        return result;
      };

      $scope.getClassId = function (item) {
        var result = "";
        if ($scope.addedFields && $scope.addedFields.has(item)) {
          if ($scope.addedFields.get(item).id) {
            result = $scope.addedFields.get(item).id;
          }
        }
        return result;
      };


      $scope.deleteFieldAddedItem = function (itemDataId) {
        DataManipulationService.deleteFieldControlledTerm(itemDataId, $scope.field);
        // adjust the map
        $scope.setAddedFieldMap();
      };

      $scope.parseOntologyCode = function (source) {
        return DataManipulationService.parseOntologyCode(source);
      };

      $scope.parseOntologyName = function (dataItemsId) {
        return DataManipulationService.parseOntologyName(dataItemsId);
      };

      $scope.deleteFieldAddedBranch = function (branch) {
        DataManipulationService.deleteFieldAddedBranch(branch, $scope.field);
      };

      $scope.deleteFieldAddedClass = function (ontologyClass) {
        DataManipulationService.deleteFieldAddedClass(ontologyClass, $scope.field);
      };

      $scope.deleteFieldAddedOntology = function (ontology) {
        DataManipulationService.deleteFieldAddedOntology(ontology, $scope.field);
      };

      $scope.deleteFieldAddedValueSet = function (valueSet) {
        DataManipulationService.deleteFieldAddedValueSet(valueSet, $scope.field);
      };

      $scope.getOntologyCode = function (ontology) {
        var ontologyDetails = controlledTermDataService.getOntologyByLdId(ontology);
      };

      // use the document height as the modal height
      $scope.getModalHeight = function () {
        return "height: " + $document.height() + 'px';
      };

      //TODO this event resets modal state and closes modal
      $scope.$on("field:controlledTermAdded", function () {

        jQuery("#" + $scope.getModalId(true)).modal('hide');
        jQuery("#" + $scope.getModalId(false)).modal('hide');

        // build the added fields map in this case
        $scope.setAddedFieldMap();

      });

      // which details tab is open?
      $scope.showControlledTermsValues = false;
      $scope.showControlledTermsField = false;
      $scope.showCardinality = false;
      $scope.showRequired = false;
      $scope.showRange = false;
      $scope.isTabActive = function (item) {
        return ($scope.showControlledTermsField && item == "field") ||
            ($scope.showControlledTermsValues && item == "values") ||
            ($scope.showCardinality && item == "cardinality") ||
            ($scope.showRange && item == "range") ||
            ($scope.showRequired && item == "required");
      };

      $scope.initDateSingle = function () {
        if (!$rootScope.schemaOf($scope.field)._ui.dateType) {
          $rootScope.schemaOf($scope.field)._ui.dateType = 'single-date';
        }
      };


      /**
       * only have one of these three divs open at a time
       * @param item
       */
      $scope.toggleControlledTerm = function (item) {

        $scope.showControlledTermsValues = (item === 'values') ? !$scope.showControlledTermsValues : false;
        $scope.showControlledTermsField = (item === 'field') ? !$scope.showControlledTermsField : false;
        $scope.showCardinality = (item === 'cardinality') ? !$scope.showCardinality : false;
        $scope.showRequired = (item === 'required') ? !$scope.showRequired : false;
        $scope.showRange = (item === 'range') ? !$scope.showRange : false;
        //$rootScope.schemaOf($scope.field)._ui.is_cardinal_field = $scope.showCardinality;

        $scope.setAddedFieldMap();
      };

      $scope.getModalId = function (isField) {
        var fieldOrValue = isField ? "field" : "values";
        var fieldId = $scope.field['@id'] || $scope.field.items['@id'];
        var id = fieldId.substring(fieldId.lastIndexOf('/') + 1);
        return "control-options-" + id + "-" + fieldOrValue;
      };

      /* end of controlled terms functionality */

      $scope.clearMinMax = function () {
        delete $scope.field.minItems;
        delete $scope.field.maxItems;
      };

      $scope.selectField = function () {
        console.log('selectField');
      };

      $scope.getShortText = function (text, maxLength, finalString, emptyString) {
        return StringUtilsService.getShortText(text, maxLength, finalString, emptyString);
      };

      $scope.getShortId = function (uri, maxLength) {
        return StringUtilsService.getShortId(uri, maxLength);
      }


    };

    return {
      templateUrl: 'scripts/form/field.directive.html',
      restrict   : 'EA',
      scope      : {
        field         : '=',
        model         : '=',
        renameChildKey: "=",
        preview       : "=",
        delete        : '&',
        ngDisabled    : "="
      },
      controller : function ($scope, $element) {
        var addPopover = function ($scope) {
          //Initializing Bootstrap Popover fn for each item loaded
          setTimeout(function () {
            if ($element.find('#field-value-tooltip').length > 0) {
              $element.find('#field-value-tooltip').popover();
            } else if ($element.find('[data-toggle="popover"]').length > 0) {
              $element.find('[data-toggle="popover"]').popover();
            }
          }, 1000);
        };

        addPopover($scope);

      },
      replace    : true,
      link       : linker
    };

  }

});