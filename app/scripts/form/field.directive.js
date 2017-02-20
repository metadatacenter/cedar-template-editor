'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.form.fieldDirective', [])
      .directive('fieldDirective', fieldDirective);

  // TODO: refactor to cedarFieldDirective <cedar-field-directive>


  fieldDirective.$inject = ["$rootScope", "$sce", "$document", "$translate", "$filter", "$timeout",
                            "SpreadsheetService",
                            "DataManipulationService", "FieldTypeService", "controlledTermDataService",
                            "StringUtilsService"];

  function fieldDirective($rootScope, $sce, $document, $translate, $filter, $timeout, SpreadsheetService,
                          DataManipulationService,
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
          // if (p && !angular.isUndefined(p['@type'])) {
          //   var type = DataManipulationService.generateInstanceType(p['@type']);
          //
          //   if (type) {
          //     if (angular.isArray($scope.model)) {
          //       for (var i = 0; i < min; i++) {
          //         $scope.model[i]["@type"] = type || "";
          //       }
          //     } else {
          //       $scope.model["@type"] = type || "";
          //     }
          //   }
          // }
        }
      };

      // When form submit event is fired, check field for simple validation
      $scope.$on('submitForm', function (event) {

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
        if ($rootScope.schemaOf($scope.field)._valueConstraints &&
            $rootScope.schemaOf($scope.field)._valueConstraints.requiredValue && allRequiredFieldsAreFilledIn) {
          //remove from emptyRequiredField array
          $scope.$emit('emptyRequiredField',
              ['remove', DataManipulationService.getFieldSchema($scope.field)._ui.title, $scope.uuid]);
        }


        var allFieldsAreValid = true;
        if (angular.isArray($scope.model)) {
          for (var i = 0; i < $scope.model.length; i++) {
            if (!DataManipulationService.isValidPattern($scope.field, i)) {
              $scope.model[i]['@value'] = DataManipulationService.getDomValue($scope.field, i);
              allFieldsAreValid = false;
            }
          }

        } else {
          if (!DataManipulationService.isValidPattern($scope.field, 0)) {
            $scope.model['@value'] = DataManipulationService.getDomValue($scope.field, 0);
            allFieldsAreValid = false;

          }
        }

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
        }

        $scope.$emit('invalidFieldValues',
            [allFieldsAreValid ? 'remove' : 'add', DataManipulationService.getFieldSchema($scope.field)._ui.title,
             $scope.uuid]);

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

      var field = DataManipulationService.getFieldSchema($scope.field);

      // Checking each field to see if required, will trigger flag for use to see there is required fields
      if (field._valueConstraints && field._valueConstraints.requiredValue) {
        $scope.$emit('formHasRequiredfield._uis');
      }

      // If selectedByDefault is false, it is removed from the model
      $scope.cleanSelectedByDefault = function (index) {
        if (field._valueConstraints.literals[index].selectedByDefault == false) {
          delete field._valueConstraints.literals[index].selectedByDefault;
        }
      }

      // Sets the default options for the 'radio' button based on the options selected at the UI
      $scope.radioModelToDefaultOptions = function (index) {
        for (var i = 0; i < field._valueConstraints.literals.length; i++) {
          if (i != index) {
            delete field._valueConstraints.literals[i].selectedByDefault;
          }
        }
      }

      // Sets UI selections based on the default options
      $scope.defaultOptionsToUI = function () {
        if (field._ui.inputType == 'checkbox') {
          $scope.optionsUI = {};
          for (var i = 0; i < field._valueConstraints.literals.length; i++) {
            var literal = field._valueConstraints.literals[i];
            if (literal.selectedByDefault == true) {
              $scope.optionsUI[literal.label] = true;
            }
            else {
              $scope.optionsUI[literal.label] = false;
            }
          }
        }
        else if (field._ui.inputType == 'radio') {
          $scope.optionsUI = {option: null};
          for (var i = 0; i < field._valueConstraints.literals.length; i++) {
            var literal = field._valueConstraints.literals[i];
            if (literal.selectedByDefault == true) {
              $scope.optionsUI.option = literal.label;
            }
          }
        }
        else if (field._ui.inputType == 'list') {
          // We use an object here instead of a primitive to ensure two-way data binding with the UI element (ng-model)
          $scope.optionsUI = {options: []};
          for (var i = 0; i < field._valueConstraints.literals.length; i++) {
            var literal = field._valueConstraints.literals[i];
            if (literal.selectedByDefault == true) {
              $scope.optionsUI.options.push(literal.label);
            }
          }
        }
      }

      // Sets the instance @value fields based on the options selected at the UI
      $scope.updateModelFromUI = function () {
        if (!$scope.model || !$rootScope.isArray($scope.model)) {
          $scope.model = [];
        }
        else {
          // Remove all elements from the 'model' array. Note that using $scope.model = []
          // is dangerous because we have references to the original array
          $scope.model.splice(0, $scope.model.length);
        }
        if (field._ui.inputType == 'checkbox') {
          for (var option in $scope.optionsUI) {
            if ($scope.optionsUI[option] == true) {
              $scope.model.push({'@value': option});
            }
          }
        }
        else if (field._ui.inputType == 'radio') {
          // If 'updateModelFromUI' was invoked from the UI (option is not null)
          if ($scope.optionsUI.option != null) {
            $scope.model.push({'@value': $scope.optionsUI.option});
          }
        }
        else if (field._ui.inputType == 'list') {
          // Update model
          for (var i = 0; i < $scope.optionsUI.options.length; i++) {
            $scope.model.push({'@value': $scope.optionsUI.options[i]});
          }
        }
        // Default value
        if ($scope.model.length == 0) {
          $scope.model.push({'@value': null});
        }
      }

      // Updates the model for fields whose values have been constrained using controlled terms
      $scope.updateModelFromUIControlledField = function () {
        // Multiple fields
        if ($rootScope.isArray($scope.modelValue)) {
          if ($scope.modelValue.length > 0) {
            angular.forEach($scope.modelValue, function (m, i) {
              if (m && m['@value'] && m['@value']['@id']) {
                $scope.model[i] = {
                  "@value"   : m['@value']['@id'],
                  _valueLabel: m['@value'].label
                };
              }
            });
          }
          else {
            // Default value
            $scope.model = [{'@value': null}];
          }
        }
        // Single fields
        else {
          if ($scope.modelValue && $scope.modelValue['@value'] && $scope.modelValue['@value']["@id"]) {
            $scope.model['@value'] = $scope.modelValue['@value']["@id"];
            $scope.model._valueLabel = $scope.modelValue['@value'].label;
          } else {
            $scope.model['@value'] = null;
          }
        }
      }

      // Set the UI with the values (@value) from the model
      $scope.updateUIFromModel = function () {
        if (field._ui.inputType == 'checkbox') {
          $scope.optionsUI = {};
          for (var item in $scope.model) {
            var valueLabel = $scope.model[item]['@value'];
            $scope.optionsUI[valueLabel] = true;
          }
        }
        else if (field._ui.inputType == 'radio') {
          $scope.optionsUI = {option: null};
          // Note that for this element only one selected option is possible
          if ($scope.model[0]['@value'] != null) {
            $scope.optionsUI.option = $scope.model[0]['@value'];
          }
        }
        else if (field._ui.inputType == 'list') {
          $scope.optionsUI = {options: []};
          for (var item in $scope.model) {
            var valueLabel = $scope.model[item]['@value'];
            $scope.optionsUI.options.push(valueLabel);
          }
        }
      }

      $scope.updateUIFromModelControlledField = function () {
        if ($rootScope.isArray($scope.model)) {
          $scope.modelValue = [];
          angular.forEach($scope.model, function (m, i) {
            $scope.modelValue[i] = {};
            $scope.modelValue[i]['@value'] = {
              '@id': m['@value'],
              label: m._valueLabel
            };
          });
        }
        else {
          $scope.modelValue = {};
          $scope.modelValue['@value'] = {
            '@id': $scope.model['@value'],
            label: $scope.model._valueLabel
          };
        }
      }

      // Initializes model for selection fields (checkbox, radio and list).
      $scope.initializeSelectionField = function () {
        if ($scope.directory == "render") {
          if ((field._ui.inputType == 'checkbox')
              || (field._ui.inputType == 'radio')
              || (field._ui.inputType == 'list')) {
            // If we are populating a template, we need to initialize the model with the default values (if they exist)
            // Note that $scope.isEditData = false means that we are populating the template
            if ($scope.isEditData == null || $scope.isEditData == false) {
              $scope.defaultOptionsToUI();
              $scope.updateModelFromUI();
            }
            // If we are editing an instance we need to load the values stored into the model
            else {
              $scope.updateUIFromModel();
            }
          }
        }
      }

      // Initializes model for fields constrained using controlled terms
      $scope.initializeControlledField = function () {
        // If modelValue has not been initialized
        if (!$scope.modelValue) {
          var isMultiple = false;
          if ($scope.field.items) {
            isMultiple = true;
          }
          if ($scope.directory == "render") {
            if ($rootScope.schemaOf($scope.field)._ui.inputType == "textfield" &&
                $rootScope.hasValueConstraint($rootScope.schemaOf($scope.field)._valueConstraints)) {
              // We are populating the template
              if ($scope.isEditData == null || $scope.isEditData == false) {
                if (isMultiple) {
                  $scope.modelValue = []
                }
                else {
                  $scope.modelValue = {};
                }
              }
              // We are editing an instance
              else {
                $scope.updateUIFromModelControlledField();
              }
            }
          }
        }
      }

      // Sets the default @value for non-selection fields (i.e., text, paragraph, date, email, numeric, phone)
      $scope.setDefaultValueIfEmpty = function (m) {
        if ($rootScope.isRuntime()) {
          if (!$rootScope.isArray(m)) {
            if (!m) {
              m = {};
            }
            if (m.hasOwnProperty('@value')) {
              // If empty string
              if ((m['@value'] != null) && (m['@value'].length == 0)) {
                m['@value'] = null;
              }
            }
            else {
              m['@value'] = null;
            }
          }
          else {
            for (var i = 0; i < m.length; i++) {
              $scope.setDefaultValueIfEmpty(m[i]);
            }
          }
        }
      }

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
          $scope.model.push({'@value': null});
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

      /**
       * Use the fieldType to determine if the field supports value recommendation
       * @returns {boolean} allowsValueRecommendation
       */
      $scope.allowsValueRecommendation = function () {
        var inputType = $rootScope.schemaOf($scope.field)._ui.inputType;
        var fieldTypes = FieldTypeService.getFieldTypes();
        for (var i = 0; i < fieldTypes.length; i++) {
          if (fieldTypes[i].cedarType === inputType) {
            return fieldTypes[i].allowsValueRecommendation;
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
        // Update schema title and description if necessary
        if (oldField.type == 'object' && newField.type == 'object') {
          if (newField._ui.title != oldField._ui.title) {
            var capitalizedTitle = $filter('capitalizeFirst')(newField._ui.title);
            newField.title = $translate.instant("GENERATEDVALUE.fieldTitle", {title: capitalizedTitle});
            newField.description = $translate.instant("GENERATEDVALUE.fieldDescription", {title: capitalizedTitle});
          }
        }
        setDirectory();
      }, true);

      // Used just for text fields whose values have been constrained using controlled terms
      $scope.$watch("model", function () {

        $scope.isEditState = function () {
          return (DataManipulationService.isEditState($scope.field));
        };

        $scope.isNested = function () {
          return $scope.nested;
          //return (DataManipulationService.isNested($scope.field));
        };

        $scope.addOption = function () {
          return (DataManipulationService.addOption($scope.field));
        };

      }, true);

      /* Value Recommendation functionality */

      // Load values when opening an instance
      if ($scope.model) {
        $scope.modelValueRecommendation = {'@value': {'value': $scope.model['@value']}}
      }

      $scope.initializeValueRecommendationField = function () {
        $scope.modelValueRecommendation = {};
        if ($scope.model) {
          if ($scope.model['_valueLabel']) {
            $scope.modelValueRecommendation['@value'] = {
              'value'   : $scope.model._valueLabel,
              'valueUri': $scope.model['@value'],
            };
          }
          else {
            $scope.modelValueRecommendation['@value'] = {
              'value': $scope.model['@value']
            };
          }
        }
      };

      $scope.updateModelWhenChangeSelection = function (modelvr) {
        // This variable will be used at textfield.html
        $scope.modelValueRecommendation = modelvr;
        if ($rootScope.isArray($scope.model)) {
          angular.forEach(modelvr, function (m, i) {
            if (m && m['@value'] & m['@value'].value) {
              $scope.model[i]['@value'] = m['@value'].value;
              if (m['@value'].valueUri) {
                $scope.model[i]['_valueLabel'] = m['@value'].valueUri;
              }
            } else {
              delete $scope.model[i]['@value'];
            }
          });
        } else {
          if (modelvr['@value'].valueUri) {
            $scope.model['@value'] = modelvr['@value'].valueUri;
            $scope.model['_valueLabel'] = modelvr['@value'].value;
          }
          else {
            $scope.model['@value'] = modelvr['@value'].value;
            delete $scope.model['_valueLabel'];
          }
        }
      };

      $scope.isFirstRefresh = true;
      $scope.setIsFirstRefresh = function (isFirstRefresh) {
        $scope.isFirstRefresh = isFirstRefresh;
      };

      $scope.updateModelWhenRefresh = function (select, modelvr) {
        if (!$scope.isFirstRefresh) {
          // Check that there are no controlled terms selected
          if (select.selected.valueUri == null) {
            if ($rootScope.isArray($scope.model)) {
              // TODO
            } else {
              // If the user entered a new value
              if (select.search != modelvr['@value'].value) {
                var modelValue;
                if (select.search == "" || select.search == undefined) {
                  modelValue = null;
                }
                else {
                  modelValue = select.search;
                }
                $scope.model['@value'] = modelValue;
                delete $scope.model['_valueLabel'];
                $scope.modelValueRecommendation['@value'].value = modelValue;
              }
            }
          }
        }
      };

      // Updates the search using the selected value
      //$scope.updateSearch = function (select) {
      //  if (select.selected.value) {
      //    select.search = select.selected.value;
      //  }
      //};

      $scope.clearSearch = function (select) {
        select.search = '';
      };

      $scope.clearSelection = function ($event, select) {
        $event.stopPropagation();
        $scope.modelValueRecommendation = {
          '@value': {'value': null, 'valueUri': null},
        }
        select.selected = undefined;
        select.search = "";
        $scope.model['@value'] = null;
        delete $scope.model['_valueLabel'];
      };

      $scope.calculateUIScore = function (score) {
        var s = Math.floor(score * 100);
        if (s < 1) {
          return "<1%";
        }
        else {
          return s.toString() + "%";
        }
      };

      //$scope.calculateUIScore = function(score) {
      //  return score.toFixed(2);
      //};

      $scope.getRecommendationType = function (type) {
        if (type == 'CONTEXT_INDEPENDENT') {
          return '*';
        }
        else {
          return '';
        }
      };

      $scope.removeValueRecommendationField = function (field) {
        delete field._ui.valueRecommendationEnabled;
      }

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
      $scope.showValueRecommendation = false;
      $scope.isTabActive = function (item) {
        return ($scope.showControlledTermsField && item == "field") ||
            ($scope.showControlledTermsValues && item == "values") ||
            ($scope.showCardinality && item == "cardinality") ||
            ($scope.showRange && item == "range") ||
            ($scope.showRequired && item == "required") ||
            ($scope.showValueRecommendation && item == "value-recommendation")
            ;
      };

      $scope.initDateSingle = function () {
        if ($rootScope.schemaOf($scope.field)._ui.inputType == 'date') {
          $rootScope.schemaOf($scope.field)._ui.dateType = 'single-date';
        }
        else {
          delete $rootScope.schemaOf($scope.field)._ui.dateType;
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
        $scope.showValueRecommendation = (item === 'value-recommendation') ? !$scope.showValueRecommendation : false;
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
      };

      $scope.getId = function (index) {
        return DataManipulationService.getLocator($scope.field, 0, index);
      };


      // for cardinality selectors
      $scope.cardinality = {
        min  : null,
        max  : null,
        mins : [{
          value: '0',
          label: 'none'
        }, {
          value: '1',
          label: 'one'
        }, {
          value: '2',
          label: 'two'
        }, {
          value: '3',
          label: 'three'
        }, {
          value: '4',
          label: 'four'
        }, {
          value: '5',
          label: 'five'
        }, {
          value: '6',
          label: 'six'
        }, {
          value: '7',
          label: 'seven'
        }, {
          value: '8',
          label: 'eight'
        }],
        maxes: [{
          value: '1',
          label: 'one'
        }, {
          value: '2',
          label: 'two'
        }, {
          value: '3',
          label: 'three'
        }, {
          value: '4',
          label: 'four'
        }, {
          value: '5',
          label: 'five'
        }, {
          value: '6',
          label: 'six'
        }, {
          value: '7',
          label: 'seven'
        }, {
          value: '8',
          label: 'eight'
        }, {
          value: '0',
          label: 'unlimited'
        }]
      };


      $scope.isMultiple = function () {
        return $scope.field.minItems != null;
      };

      $scope.initMultiple = function () {
        if ($scope.isMultiple()) {
          $scope.cardinality.min = $scope.field.minItems.toString();
          $scope.cardinality.max = typeof $scope.field.maxItems === 'undefined' ? '0' : $scope.field.maxItems.toString();
        }
      };

      $scope.updateMultiple = function () {
        $scope.field.minItems = parseInt($scope.cardinality.min);
        $scope.field.maxItems = parseInt($scope.cardinality.max);
        if ($scope.field.maxItems && $scope.field.maxItems < $scope.field.minItems) {
          $scope.field.maxItems = 0;
          $scope.cardinality.max = '0';
        }
      };

      $scope.defaultMinMax = function () {
        $scope.field.minItems = 1;
        $scope.field.maxItems = 0;
      };


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
        ngDisabled    : "=",
        isEditData    : "=",
        nested:'='
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