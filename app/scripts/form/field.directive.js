'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.form.fieldDirective', [])
      .directive('fieldDirective', fieldDirective);

  // TODO: refactor to cedarFieldDirective <cedar-field-directive>


  fieldDirective.$inject = ["$rootScope", "$sce", "$document", "$translate", "SpreadsheetService",
                            "DataManipulationService", "FieldTypeService", "controlledTermDataService"];

  function fieldDirective($rootScope, $sce, $document, $translate, SpreadsheetService, DataManipulationService,
                          FieldTypeService, controlledTermDataService) {

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
                if (!valueElement || !valueElement._value) {
                  allRequiredFieldsAreFilledIn = false;
                } else if (angular.isArray(valueElement._value)) {
                  var hasValue = false;
                  angular.forEach(valueElement._value, function (ve) {
                    hasValue = hasValue || !!ve;
                  });

                  if (!hasValue) {
                    allRequiredFieldsAreFilledIn = false;
                  }
                } else if (angular.isObject(valueElement._value)) {
                  if ($rootScope.isEmpty(valueElement._value)) {
                    allRequiredFieldsAreFilledIn = false;
                  } else if (DataManipulationService.getFieldSchema($scope.field)._ui.dateType == "date-range") {
                    if (!valueElement._value.start || !valueElement._value.end) {
                      allRequiredFieldsAreFilledIn = false;
                    }
                  } else {
                    // Require at least one checkbox is checked.
                    var hasValue = false;
                    angular.forEach(valueElement._value, function (value, key) {
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
              angular.forEach($scope.model._value, function (ve) {
                hasValue = hasValue || !!ve;
              });

              if (!hasValue) {
                allRequiredFieldsAreFilledIn = false;
              }
            } else if (angular.isObject($scope.model._value)) {
              if ($rootScope.isEmpty($scope.model._value)) {
                allRequiredFieldsAreFilledIn = false;
              } else if (DataManipulationService.getFieldSchema($scope.field)._ui.dateType == "date-range") {
                if (!$scope.model._value.start || !$scope.model._value.end) {
                  allRequiredFieldsAreFilledIn = false;
                }
              } else {
                // Require at least one checkbox is checked.
                var hasValue = false;
                angular.forEach($scope.model._value, function (value, key) {
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
              if (angular.isArray(valueElement._value)) {
                angular.forEach(valueElement._value, function (ve) {
                  if (!$rootScope.isValueConformedToConstraint(ve, $scope.field["@id"],
                          $rootScope.schemaOf($scope.field)._valueConstraints)) {
                    allFieldsAreValid = false;
                  }
                });
              } else if (angular.isObject(valueElement._value)) {
                if (!$rootScope.isValueConformedToConstraint(valueElement._value, $scope.field["@id"],
                        $rootScope.schemaOf($scope.field)._valueConstraints)) {
                  allFieldsAreValid = false;
                }
              }
            });
          } else {
            if (angular.isArray($scope.model._value)) {
              angular.forEach($scope.model._value, function (ve) {
                if (!$rootScope.isValueConformedToConstraint(ve, $scope.field["@id"],
                        $rootScope.schemaOf($scope.field)._valueConstraints)) {
                  allFieldsAreValid = false;
                }
              });
            } else if (angular.isObject($scope.model._value)) {
              if (!$rootScope.isValueConformedToConstraint($scope.model._value, $scope.field["@id"],
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

      var field = DataManipulationService.getFieldSchema($scope.field)._ui
      // Checking each field to see if required, will trigger flag for use to see there is required fields
      if (field.required) {
        $scope.$emit('formHasRequiredFields');
      }

      // Added by cedar
      if ($scope.directory == 'render') {
        if ($scope.model) {
          if ($rootScope.isArray($scope.model)) {
            if ($scope.model.length == 0) {
              var min = $scope.field.minItems || 0;

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
              angular.forEach($scope.model, function (m, i) {
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
          while (schema._ui.options.length < MIN_OPTIONS) {
            var emptyOption = {
              "text": name || ""
            };
            schema._ui.options.push(emptyOption);
          }

          // and they all have text fields filled in
          for (var i = 0; i < schema._ui.options.length; i++) {
            if (schema._ui.options[i].text.length == 0) {
              schema._ui.options[i].text = $translate.instant("VALIDATION.noNameField");
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
          angular.forEach(field._ui.options, function (value, index) {
            // If any 'option' title text is left empty, create error message
            if (!value.text.length && unmetConditions.indexOf(optionMessage) == -1) {
              unmetConditions.push(optionMessage);
            }
          });
        }
        // If field type is 'radio' or 'pick from a list' there must be more than one option created
        if ((field._ui.inputType == 'radio' || field._ui.inputType == 'list') && field._ui.options && (field._ui.options.length <= 1)) {
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
                angular.forEach($scope.model, function (m, i) {
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

      /* Value Recommendation functionality */
      // Load values when opening an instance
      if ($scope.model) {
        $scope.modelValueRecommendation = {'_value': {'value': $scope.model._value}}
      }

      $scope.updateModelWhenChangeSelection = function (modelvr) {
        // This variable will be used at textfield.html
        $scope.modelValueRecommendation = modelvr;
        if ($rootScope.isArray($scope.model)) {
          angular.forEach(modelvr, function (m, i) {
            if (m && m._value & m._value.value) {
              $scope.model[i]._value = m._value.value;
            } else {
              delete $scope.model[i]._value;
            }
          });
        } else {
          var newValue = modelvr._value.value;
          $scope.model._value = newValue;
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
            $scope.model._value = select.search;
            $scope.modelValueRecommendation._value.value = select.search;
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
          if ($scope.addedFields.get(item).definitions && $scope.addedFields.get(item).definitions.length > 0) {
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