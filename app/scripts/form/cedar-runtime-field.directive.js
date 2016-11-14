'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.form.cedarRuntimeField', [])
      .directive('cedarRuntimeField', cedarRuntimeField);


  cedarRuntimeField.$inject = ["$rootScope", "$sce", "$document", "$translate", "$filter", "$location", "$anchorScroll",
                               "$window", '$timeout',
                               "SpreadsheetService",
                               "DataManipulationService", "FieldTypeService", "controlledTermDataService",
                               "StringUtilsService"];

  function cedarRuntimeField($rootScope, $sce, $document, $translate, $filter, $location, $anchorScroll, $window,
                             $timeout,
                             SpreadsheetService,
                             DataManipulationService,
                             FieldTypeService, controlledTermDataService, StringUtilsService) {


    var linker = function ($scope, $element, attrs) {


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

        if ($scope.getInputType() == 'checkbox') {
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
        else if ($scope.getInputType() == 'radio') {
          $scope.optionsUI = {option: null};
          for (var i = 0; i < field._valueConstraints.literals.length; i++) {
            var literal = field._valueConstraints.literals[i];
            if (literal.selectedByDefault == true) {
              $scope.optionsUI.option = literal.label;
            }
          }
        }
        else if ($scope.getInputType() == 'list') {
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
      $scope.updateModelFromUI = function (valueElement) {
        console.log('updateModelFromUI');
        console.log(valueElement);
        if (!valueElement || !$rootScope.isArray(valueElement)) {
          valueElement = [];
        }
        else {
          // Remove all elements from the 'model' array. Note that using $scope.model = []
          // is dangerous because we have references to the original array
          valueElement.splice(0, $scope.model.length);
        }

        if ($scope.getInputType() == 'checkbox') {
          for (var option in $scope.optionsUI) {
            if ($scope.optionsUI[option] == true) {
              valueElement.push({'@value': option});
            }
          }
        }
        else if ($scope.getInputType() == 'radio') {
          // If 'updateModelFromUI' was invoked from the UI (option is not null)
          if ($scope.optionsUI.option != null) {
            valueElement.push({'@value': $scope.optionsUI.option});
          }
        }
        else if ($scope.getInputType() == 'list') {
          // Update model
          for (var i = 0; i < $scope.optionsUI.options.length; i++) {
            valueElement.push({'@value': $scope.optionsUI.options[i]});
          }
        }
        // Default value
        if (valueElement.length == 0) {
          valueElement.push({'@value': null});
        }

        console.log(valueElement);
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
      $scope.updateUIFromModel = function (valueElement) {
        console.log('updateUIFromModel');
        console.log(valueElement);

        if ($scope.getInputType() == 'checkbox') {
          $scope.optionsUI = {};
          for (var item in valueElement) {
            var valueLabel = valueElement[item]['@value'];
            $scope.optionsUI[valueLabel] = true;
          }
        }
        else if ($scope.getInputType() == 'radio') {
          $scope.optionsUI = {option: null};
          // Note that for this element only one selected option is possible
          if (valueElement[0]['@value'] != null) {
            $scope.optionsUI.option = valueElement[0]['@value'];
          }
        }
        else if ($scope.getInputType() == 'list') {
          $scope.optionsUI = {options: []};
          for (var item in valueElement) {
            var valueLabel = valueElement[item]['@value'];
            $scope.optionsUI.options.push(valueLabel);
          }
        }
        console.log($scope.optionsUI);

      };

      $scope.console = function (obj) {
        console.log(obj);
      };

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
      $scope.initializeSelectionField = function (valueElement) {
        console.log('initializeSelectionField');
        if ($scope.isMultiAnswer()) {
          $scope.updateUIFromModel(valueElement);
        }
        console.log(valueElement);
      };

      // Initializes model for fields constrained using controlled terms
      $scope.initializeControlledField = function () {
        // If modelValue has not been initialized
        if (!$scope.modelValue) {

          if ($scope.getInputType() == "textfield" &&
              $rootScope.hasValueConstraint($rootScope.schemaOf($scope.field)._valueConstraints)) {

            $scope.updateUIFromModelControlledField();
          }
        }
      }

      // Sets the default @value for non-selection fields (i.e., text, paragraph, date, email, numeric, phone)
      $scope.setDefaultValueIfEmpty = function (m) {
        console.log('setDefaultValueIfEmpty');

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
        console.log($scope.model);
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

          // add another instance in the model
          $scope.model.push({'@value': null});

          // activate the new instance
          $timeout($scope.setActive($scope.model.length - 1, true), 100);
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
        if (extraConditionInputs.indexOf($scope.getInputType()) !== -1) {
          var optionMessage = '"Enter Option" input cannot be left empty.';
          angular.forEach(field._valueConstraints.literals, function (value, index) {
            // If any 'option' title text is left empty, create error message
            if (!value.label.length && unmetConditions.indexOf(optionMessage) == -1) {
              unmetConditions.push(optionMessage);
            }
          });
        }
        // If field type is 'radio' or 'pick from a list' there must be more than one option created
        if (($scope.getInputType() == 'radio' || $scope.getInputType() == 'list') && field._valueConstraints.literals && (field._valueConstraints.literals.length <= 1)) {
          unmetConditions.push('Multiple Choice fields must have at least two possible options');
        }
        // Return array of error messages
        return unmetConditions;
      };


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
        var inputType = $scope.getInputType();
        var fieldTypes = FieldTypeService.getFieldTypes();
        for (var i = 0; i < fieldTypes.length; i++) {
          if (fieldTypes[i].cedarType === inputType) {
            return fieldTypes[i].allowsMultiple;
          }
        }
      };

      $scope.hasDateRange = function () {
        return ( $scope.getInputType() === "date");
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


      // Used just for text fields whose values have been constrained using controlled terms
      $scope.$watch("model", function () {

        $scope.isEditState = function () {
          return (DataManipulationService.isEditState($scope.field));
        };

        $scope.isNested = function () {
          return (DataManipulationService.isNested($scope.field));
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
        if ($scope.getInputType() == 'date') {
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

      $scope.getShortText = function (text, maxLength, finalString, emptyString) {
        return StringUtilsService.getShortText(text, maxLength, finalString, emptyString);
      };

      $scope.getShortId = function (uri, maxLength) {
        return StringUtilsService.getShortId(uri, maxLength);
      }


      // get the field title
      $scope.getTitle = function () {
        return DataManipulationService.getFieldSchema($scope.field)._ui.title;
      };

      // Retrieve appropriate field template file
      $scope.getFieldUrl = function () {
        var inputType = 'element';
        var schema = $rootScope.schemaOf($scope.field);

        if (schema._ui.inputType) {
          inputType = schema._ui.inputType;
        }
        return 'scripts/form/runtime-field' + '/' + inputType + '.html';
      };

      $scope.getInputType = function () {
        return $rootScope.schemaOf($scope.field)._ui.inputType;
      };

      // is the field multiple cardinality?
      $scope.isMultiple = function () {
        return $scope.field.items;
      };

      $scope.isRequired = function () {
        return $rootScope.schemaOf($scope.field)._valueConstraints.requiredValue;
      };

      // is this a checkbox, radio or list question
      $scope.isMultiAnswer = function () {
        return (($scope.getInputType() == 'checkbox') || ($scope.getInputType() == 'radio') || ($scope.getInputType() == 'list'));
      };

      $scope.getDescription = function () {
        return $rootScope.schemaOf($scope.field)._ui.description;
      };


      $scope.goToElement = function (id, offset) {
        // set the location.hash to the id of
        // the element you wish to scroll to.
        console.log('goToElement ' + ('anchor' + id));

        $location.hash('anchor' + id);
        $anchorScroll();
        $anchorScroll.yOffset = offset;

      };


      $scope.getLocator = function (index) {
        return DataManipulationService.getLocator($scope.field, index, $scope.path);
      };

      $scope.getId = function () {
        return $rootScope.schemaOf($scope.field)['@id'];
      };


      $scope.isActive = function (index) {

        return DataManipulationService.isActive(DataManipulationService.getLocator($scope.field, index, $scope.path));
      };

      $scope.isInactive = function (index) {

        return DataManipulationService.isInactive(DataManipulationService.getLocator($scope.field, index, $scope.path));
      };


      // watch for this field's active state
      $scope.$on('setActive', function (event, args) {
        var id = args[0];
        var index = args[1];
        var path = args[2];
        var value = args[3];

        console.log('$on setActive id=' + id + ' index=' + index + ' path=' + path + ' scope.path=' + $scope.path + ' value=' + value)


        if (id === $scope.getId() && path === $scope.path) {

          console.log('$on setActive found id=' + id + ' index=' + index + ' path=' + path + ' scope.path=' + $scope.path + ' value=' + value);
          $scope.setActive(index, value);
        }
      });

      $scope.setActive = function (index, value) {
        console.log('setActive index ' + index + ' value ' + value);


        var active = (typeof value === "undefined") ? true : value;
        DataManipulationService.setActive($scope.field, index, $scope.path, active);

        var locator = $scope.getLocator(index);
        console.log('locator ' + locator);
        var inputType = $scope.getInputType();
        var tag = 'input';
        if (inputType === 'textarea') {
          tag = 'textarea';
        }
        if (inputType === 'list') {
          tag = 'select';
        }

        if (active) {
          $scope.scrollTo(locator, tag);

        } else {
          jQuery("#" + locator + ' ' + tag).blur();
        }
      };

      // scroll within the template-container to the field with id locator
      $scope.scrollTo = function (locator, tag) {
        console.log('scrollTo ' + locator + ' ' + tag);

        var target = angular.element('#' + locator);
        if (target && target.offset()) {
          console.log('have target');

          $scope.setHeight = function () {
            console.log('setHeight');

            var window = angular.element($window);
            var windowHeight = $(window).height();
            var targetTop = $("#" + locator).offset().top;
            var targetHeight = $("#" + locator).outerHeight(true);
            var scrollTop = jQuery('.template-container').scrollTop();
            var newTop = scrollTop + targetTop - ( windowHeight - targetHeight ) / 2;
            jQuery('.template-container').animate({scrollTop: newTop}, 'slow');
            jQuery("#" + locator + ' ' + tag).focus().select();
          };
          $timeout($scope.setHeight, 100);
        }
      };

      $scope.getNesting = function () {

        var path = $scope.path || '';
        var arr = path.split('-');
        var result = [];
        for (var i = 0; i < arr.length; i++) {
          result.push(i);
        }
        return result;
      };

      $scope.getNestingCount = function () {

        var path = $scope.path || '';
        var arr = path.split('-');
        return arr.length;
      };

      $scope.getNestingStyle = function (index) {

        return 'left:' + (-15 * (index - 1)) + 'px';
      };


      $scope.onSubmit = function (index) {
        console.log('onSubmit');

        // go to next index
        if ($scope.isMultiple() && (index + 1 < $scope.model.length)) {
          $scope.setActive(index + 1, true);

        } else {

          // or go to parent's next field
          $scope.$parent.nextChild($scope.field, index, $scope.path);

        }
      };

      $scope.hasValueConstraint = function () {
        return $rootScope.hasValueConstraint($rootScope.schemaOf(field)._valueConstraints);
      };

      $scope.getLiterals = function () {
        return $rootScope.schemaOf(field)._valueConstraints.literals;
      };


      // allows us to look a the model as an array whether it is or not
      $scope.valueArray;
      $scope.setValueArray = function () {

        $scope.valueArray = [];
        if ($scope.isMultiAnswer()) {

          $scope.valueArray.push($scope.model);

        } else if ($scope.model instanceof Array) {

          $scope.valueArray = $scope.model;

        } else {

          if (!$scope.model) {
            $scope.model = {};
          }

          $scope.valueArray = [];
          $scope.valueArray.push($scope.model);

        }
      };

      $scope.setValueArray();

      $scope.getValueSelection = function(value) {
        if (value) {
          return value['@value'][0];
        }
      }


    };

    return {
      templateUrl: 'scripts/form/cedar-runtime-field.directive.html',
      restrict   : 'EA',
      scope      : {
        field         : '=',
        model         : '=',
        renameChildKey: "=",
        preview       : "=",
        delete        : '&',
        ngDisabled    : "=",
        path          : '='
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

})
;