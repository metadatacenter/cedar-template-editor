'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.form.cedarRuntimeField', [])
      .directive('cedarRuntimeField', cedarRuntimeField);


  cedarRuntimeField.$inject = ["$rootScope", "$sce", "$document", "$translate", "$filter", "$location",
                               "$window", '$timeout',
                               "SpreadsheetService",
                               "DataManipulationService", "FieldTypeService", "controlledTermDataService",
                               "StringUtilsService"];

  function cedarRuntimeField($rootScope, $sce, $document, $translate, $filter, $location, $window,
                             $timeout,
                             SpreadsheetService,
                             DataManipulationService,
                             FieldTypeService, controlledTermDataService, StringUtilsService) {


    var linker = function ($scope, $element, attrs) {

      $scope.directory = 'runtime';



      // set the @type field in the model
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

      // add more instances to a multiple cardinality field
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



      /**
       *
       * beginning of controlled and  recommended stuff
       *
       */

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
        if ($scope.isMultiple()) {
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
          $scope.model['@value'] = $scope.modelValue[0]['@value']['@id'];
          $scope.model._valueLabel = $scope.modelValue[0]['@value']['label'];
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
          $scope.modelValue = [];
          $scope.modelValue[0] = {};
          $scope.modelValue[0]['@value'] = {
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

          // We are populating the template
          if (!$scope.model) {
            $scope.modelValue = [];
          }
          // We are editing an instance
          else {
            $scope.updateUIFromModelControlledField();
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

      $scope.myconsole = function (msg) {
        console.log(msg);
      };


      // Load values when opening an instance
      if ($scope.model) {
        $scope.modelValueRecommendation = {'@value': {'value': $scope.model['@value']}}
      }

      $scope.updateModelWhenChangeSelection = function (modelvr) {
        console.log('updateModelWhenChangeSelection');
        console.log(modelvr);

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
          console.log('not an array');
          //var newValue = modelvr['@value'].value;
          $scope.model['@value'] = modelvr['@value'].valueUri;
          $scope.model['_valueLabel'] = modelvr['@value'].value;

        }
        console.log($scope.model);
      };

      $scope.initializeValueRecommendationField = function () {
        console.log('initializeValueRecommendationField');
        console.log($scope.modelValueRecommendation);
        console.log($scope.model);
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

        console.log($scope.modelValueRecommendation);
      };

      $scope.clearSearch = function (select) {
        select.search = '';
      };

      $scope.isFirstRefresh = true;
      $scope.setIsFirstRefresh = function (isFirstRefresh) {
        $scope.isFirstRefresh = isFirstRefresh;
      };

      $scope.updateModelWhenRefresh = function (select, modelvr) {
        if (!$scope.isFirstRefresh) {
          // Check that there are no controlled terms selected
          if (select.selected.valueUri == null) {

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

      // Updates the search using the selected value
      $scope.updateSearch = function (select) {
        if (select.selected.value) {
          select.search = select.selected.value;
        }
      };

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

      /*
       *
       * end of controlled terms functionality
       *
       *
       */


      $scope.clearMinMax = function () {
        delete $scope.field.minItems;
        delete $scope.field.maxItems;
      };

      $scope.getShortText = function (text, maxLength, finalString, emptyString) {
        return StringUtilsService.getShortText(text, maxLength, finalString, emptyString);
      };

      $scope.getShortId = function (uri, maxLength) {
        return StringUtilsService.getShortId(uri, maxLength);
      };

      // get the field title
      $scope.getTitle = function () {
        return DataManipulationService.getFieldSchema($scope.field)._ui.title;
      };

      $scope.getDescription = function () {
        return DataManipulationService.getFieldSchema($scope.field)._ui.description;
      };

      $scope.getIconClass = function () {
        var result = '';
        var fieldType = '';


        var schema = $rootScope.schemaOf($scope.field);
        if (schema._ui.inputType) {
          fieldType = schema._ui.inputType;
          result =  FieldTypeService.getFieldIconClass(fieldType);
        }
        return result;
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

      // string together the values for a checkbox, list or radio item
      $scope.getValueString = function (valueElement) {
        var result = '';
        for (var i = 0; i < valueElement.length; i++) {
          result += valueElement[i]['@value'];
          if (i < valueElement.length - 1) {
            result += ', ';
          }
        }
        return result;
      };

      // watch for this field's active state
      $scope.$on('setActive', function (event, args) {
        var id = args[0];
        var index = args[1];
        var path = args[2];
        var value = args[3];

        if (id === $scope.getId() && path == $scope.path) {
          $scope.setActive(index, value);
        }
      });

      $scope.setActive = function (index, value) {

        // off or on
        var active = (typeof value === "undefined") ? true : value;
        var locator = $scope.getLocator(index);

        // if zero cardinality,  add a new item
        if ($scope.isMultiple() && $scope.model.length <= 0) {
          $scope.addMoreInput();
        }

        // set it active or inactive
        DataManipulationService.setActive($scope.field, index, $scope.path, active);

        if (active) {
          $scope.scrollTo(locator, ' .select');

        } else {
          jQuery("#" + locator ).blur();
        }
      };

      // scroll within the template-container to the field with id locator
      $scope.scrollTo = function (locator, tag) {

        var target = angular.element('#' + locator);
        if (target && target.offset()) {

          $scope.setHeight = function () {

            var window = angular.element($window);
            var windowHeight = $(window).height();
            var targetTop = $("#" + locator).offset().top;
            var targetHeight = $("#" + locator).outerHeight(true);
            var scrollTop = jQuery('.template-container').scrollTop();
            var newTop = scrollTop + targetTop - ( windowHeight - targetHeight ) / 2;
            jQuery('.template-container').animate({scrollTop: newTop}, 'slow');

            // select and focus the tag
            if (tag) {
              var e = jQuery(tag);
              if (e.length) {
                console.log(e);

                console.log(jQuery.type(e));
                e[0].focus();
                if (!e.is('select')) {
                  e[0].select();
                }
              }
            }
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

        // go to next index
        if ($scope.isMultiple() && (index + 1 < $scope.model.length)) {
          $scope.setActive(index + 1, true);

        } else {

          // or go to parent's next field
          $scope.$parent.nextChild($scope.field, index, $scope.path);

        }
      };

      // is this a submit?  shift-enter qualified as a submit for any field
      $scope.isSubmit = function (keyEvent, index) {
        console.log('isSubmit');

        if (keyEvent.which === 13 && keyEvent.shiftKey) {
          $scope.onSubmit(index);
        }
      };

      $scope.hasValueConstraint = function () {
        return $rootScope.hasValueConstraint($rootScope.schemaOf(field)._valueConstraints);
      };

      $scope.getLiterals = function () {
        return $rootScope.schemaOf(field)._valueConstraints.literals;
      };


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

      $scope.getValueSelection = function (value) {
        if (value) {
          return value['@value'][0];
        }
      }

      $scope.isRegular = function () {
        return !$scope.isConstrained() && !$scope.isRecommended();
      };

      $scope.isConstrained = function () {
        return $scope.hasValueConstraint() && !$scope.isRecommended();
      };

      $scope.isRecommended = function () {
        return $rootScope.vrs.getIsValueRecommendationEnabled($rootScope.schemaOf($scope.field));
      };

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