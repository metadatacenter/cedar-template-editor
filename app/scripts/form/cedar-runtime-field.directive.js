'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.form.cedarRuntimeField', [])
      .directive('cedarRuntimeField', cedarRuntimeField);


  cedarRuntimeField.$inject = ["$rootScope", "$sce", "$document", "$translate", "$filter", "$location",
                               "$window", '$timeout',
                               "SpreadsheetService",
                               "DataManipulationService", "UIUtilService"];

  function cedarRuntimeField($rootScope, $sce, $document, $translate, $filter, $location, $window,
                             $timeout, SpreadsheetService, DataManipulationService, UIUtilService) {


    var linker = function ($scope, $element, attrs) {

      $scope.directory = 'runtime';
      $scope.midnight = $translate.instant('GENERIC.midnight');
      $scope.uuid = DataManipulationService.generateTempGUID();
      $scope.data = {
        model: null
      };
      $scope.multipleStates = ['expanded', 'paged'];
      $scope.multipleState = 'paged';
      $scope.index = 0;
      $scope.pageMin = 0;
      $scope.pageMax = 0;
      $scope.pageRange = 6;
      $scope.valueArray;
      $scope.urlRegex = '^((https?|ftp)://)?([a-z]+[.])?[a-z0-9-]+([.][a-z]{1,4}){1,2}(/.*[?].*)?$';


      //
      // model support and manipulation
      //

      // get the field title
      $scope.getTitle = function (field) {
        return DataManipulationService.getTitle(field);
      };

      // get the field description
      $scope.getDescription = function () {
        return DataManipulationService.getDescription($scope.field);
      };

      // get the field id
      $scope.getId = function () {
        return DataManipulationService.getId($scope.field);
      };

      $scope.cardinalityString = function () {
        return DataManipulationService.cardinalityString($scope.field);
      };

      // what is the content
      $scope.getContent = function (field) {
        return DataManipulationService.getContent(field);
      };

      // does this field have a value constraint?
      $scope.hasValueConstraint = function () {
        return DataManipulationService.hasValueConstraint($scope.field);
      };

      // get the value constraint literal values
      $scope.getLiterals = function () {
        return DataManipulationService.getLiterals($scope.field);
      };

      // Retrieve appropriate field template file
      $scope.getFieldUrl = function () {
        return 'scripts/form/runtime-field' + '/' + DataManipulationService.getInputType($scope.field) + '.html';
      };

      // what kind of field is this?
      $scope.getInputType = function () {
        return DataManipulationService.getInputType($scope.field);
      };

      $scope.isMultipleChoice = function () {
        return DataManipulationService.isMultipleChoice($scope.field);
      };

      // is the field multiple cardinality?
      $scope.isMultipleCardinality = function () {
        return DataManipulationService.isMultipleCardinality($scope.field);
      };

      // is this field required?
      $scope.isRequired = function () {
        return DataManipulationService.isRequired($scope.field);
      };

      // is this a checkbox, radio or list question?
      $scope.isMultiAnswer = function () {
        return DataManipulationService.isMultiAnswer($scope.field);
      };

      // what is the dom id for this field?
      $scope.getLocator = function (index) {
        return DataManipulationService.getLocator($scope.field, index, $scope.path, $scope.uid);
      };

      // is this field actively being edited?
      $scope.isActive = function (index) {
        return DataManipulationService.isActive($scope.getLocator(index));
      };

      $scope.isInactive = function (index) {
        return DataManipulationService.isInactive($scope.getLocator(index));
      };

      // is this a youTube field?
      $scope.isYouTube = function (field) {
        return DataManipulationService.isYouTube(field);
      };

      // is this richText?
      $scope.isRichText = function (field) {
        return DataManipulationService.isRichText(field);
      };

      // is this a static image?
      $scope.isImage = function (field) {
        return DataManipulationService.isImage(field);
      };

      // is the previous field static?
      $scope.isPreviousStatic = function () {
        return $scope.previous && DataManipulationService.isStaticField($scope.previous);
      };

      // has recommendations?
      $scope.isRecommended = function () {
        return $rootScope.vrs.getIsValueRecommendationEnabled($rootScope.schemaOf($scope.field));
      };

      // has value constraints?
      $scope.isConstrained = function () {
        return $scope.hasValueConstraint() && !$scope.isRecommended();
      };

      // has neither recommendations or value constraints
      $scope.isRegular = function () {
        return !$scope.isConstrained() && !$scope.isRecommended();
      };

      $scope.getYouTubeEmbedFrame = function (field) {
        return UIUtilService.getYouTubeEmbedFrame(field);
      };

      // string together field values
      $scope.getValueString = function (valueElement) {
        var location = DataManipulationService.getValueLabelLocation($scope.field);
        var result = '';
        if (valueElement) {
          for (var i = 0; i < valueElement.length; i++) {
            if (valueElement[i][location]) {
              result += valueElement[i][location] + ', ';
            }
          }
        }
        return result.trim().replace(/,\s*$/, "");
      };

      // strip midnight off the date time string
      $scope.formatDateTime = function (value) {

        var result = value;
        if (value) {

          var index = value.indexOf($scope.midnight);
          if (index != -1) {
            result = value.substring(0, index);
          }
        }
        return result;
      };

      // can this be expanded
      $scope.isExpandable = function () {
        return false;
      };

      // is this a field
      $scope.isField = function () {
        return true;
      };

      // is this an element
      $scope.isElement = function () {
        return false;
      };

      //
      // field display
      //

      $scope.pageMinMax = function () {
        $scope.pageMax = Math.min($scope.valueArray.length, $scope.index + $scope.pageRange);
        $scope.pageMin = Math.max(0, $scope.pageMax - $scope.pageRange);
      };

      $scope.selectPage = function (i) {

        $scope.onSubmit($scope.index, i);
      };

      // expand all nested values
      $scope.expandAll = function () {
      };

      // show this field as a spreadsheet
      $scope.switchToSpreadsheet = function () {

        SpreadsheetService.switchToSpreadsheetField($scope, $element);
      };

      $scope.showMultiple = function (state) {
        return ($scope.multipleState === state);
      };

      $scope.toggleMultiple = function () {
        var index = $scope.multipleStates.indexOf($scope.multipleState);
        index = (index + 1) % $scope.multipleStates.length;
        $scope.multipleState = $scope.multipleStates[index];
        if ($scope.multipleState === 'spreadsheet') {
          setTimeout(function () {
            $scope.switchToSpreadsheet();
          }, 0);
        }
        return $scope.multipleState;
      };

      //
      // model values
      //

      // and array of values for multi-instance fields
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

      // This function initializes the value field (or fields) to null (either @id or @value) if it has not been initialized yet.
      // It also initializes optionsUI
      $scope.initializeValue = function (field) {
        if ($rootScope.isRuntime()) {
          if (!$scope.hasBeenInitialized) {
            $scope.model = DataManipulationService.initializeModel(field, $scope.model, false);
            // If we are creating a new instance, the model is still completely empty. If there are any default values,
            // we set them. It's important to do this only if the model is empty to avoid overriding values of existing
            // instances with default values.
            // The model is initialized with default options when parsing the form (see form.directive.js).

            // If the model has not been initialized yet by setting default values, initialize values
            DataManipulationService.initializeValue(field, $scope.model);
            if (DataManipulationService.isMultiAnswer(field)) {
              // Load selected values from the model to the UI, if any
              $scope.updateUIFromModel(field);
            }
          }
          $scope.hasBeenInitialized = true;
        }
      };

      // This function is used to uncheck radio buttons
      $scope.uncheck = function (field, label) {
        if (field._ui.inputType == 'radio') {
          if ($scope.optionsUI.radioPreviousOption == label) {
            // Uncheck
            $scope.optionsUI.radioOption = null;
            $scope.optionsUI.radioPreviousOption = null;
            $scope.updateModelFromUI(field);
          }
          else {
            $scope.optionsUI.radioPreviousOption = label;
          }
        }
      };

      // Sets the instance @value fields based on the options selected at the UI
      $scope.updateModelFromUI = function (field) {
        var fieldValue = DataManipulationService.getValueLocation(field);

        if (DataManipulationService.isMultiAnswer(field)) {
          // Reset model
          $scope.model = DataManipulationService.initializeModel(field, $scope.model, true);

          if (field._ui.inputType == 'checkbox') {
            // Insert the value at the right position in the model. optionsUI is an object, not an array,
            // so the right order in the model is not ensured.
            // The following lines ensure that each option is inserted into the right place
            var orderedOptions = DataManipulationService.getLiterals(field);
            for (var i = 0; i < orderedOptions.length; i++) {
              var option = orderedOptions[i].label;
              if ($scope.optionsUI[option]) {
                var newValue = {};
                newValue[fieldValue] = $scope.optionsUI[option];
                $scope.model.push(newValue);
              }
            }
            // Default value
            if ($scope.model.length == 0) {
              DataManipulationService.initializeValue(field, $scope.model);
            }
          }
          else if (field._ui.inputType == 'radio') {
            $scope.model[fieldValue] = $scope.optionsUI.radioOption;
          }
          else if (field._ui.inputType == 'list') {
            // Multiple-choice list
            if (DataManipulationService.isMultipleChoice(field)) {
              for (var i = 0; i < $scope.optionsUI.listMultiSelect.length; i++) {
                var newValue = {};
                newValue[fieldValue] = $scope.optionsUI.listMultiSelect[i];
                $scope.model.push(newValue);
              }
            }
            // Single-choice list
            else {
              var newValue = {};
              $scope.model[fieldValue] = $scope.optionsUI.listSingleSelect;
            }
            // Remove the empty string created by the "Nothing selected" option (if it exists)
            DataManipulationService.removeEmptyStrings(field, $scope.model);
            // If the model is empty, set default value
            DataManipulationService.initializeValue(field, $scope.model);
          }
        }
      };

      // Set the UI with the values from the model
      $scope.updateUIFromModel = function (field) {
        var fieldValue = DataManipulationService.getValueLocation(field);

        if (DataManipulationService.isMultiAnswer(field)) {
          $scope.optionsUI = {};
        }
        if (field._ui.inputType == 'checkbox') {
          for (var i = 0; i < $scope.model.length; i++) {
            var value = $scope.model[i][fieldValue];
            $scope.optionsUI[value] = value;
          }
        }
        else if (field._ui.inputType == 'radio') {
          // For this field type only one selected option is possible
          if ($scope.model) {
            $scope.optionsUI.radioOption = $scope.model[fieldValue];
          }
        }
        else if (field._ui.inputType == 'list') {
          // Multi-choice list
          if (DataManipulationService.isMultipleChoice(field)) {
            $scope.optionsUI.listMultiSelect = [];
            for (var i = 0; i < $scope.model.length; i++) {
              $scope.optionsUI.listMultiSelect.push($scope.model[i][fieldValue]);
            }
          }
          // Single-choice list
          else {
            // For this field type only one selected option is possible
            if ($scope.model.length > 0) {
              $scope.optionsUI.listSingleSelect = $scope.model[0][fieldValue];
            }
          }
        }
      };

      // This function initializes the value @type field if it has not been initialized yet
      $scope.initializeValueType = function (field) {
        DataManipulationService.initializeValueType(field, $scope.model);
      };

      // if the field is empty, delete the @id field. Note that in JSON-LD @id cannot be null.
      $scope.checkForEmpty = function () {
        var location = DataManipulationService.getValueLocation($scope.field);
        var obj = $scope.valueArray[$scope.index];
        if (!obj[location] || obj[location].length === 0) {
          delete obj[location];
        }
      };

      // add more instances to a multiple cardinality field if possible by copying the selected instance
      $scope.copyField = function () {
        var fieldValue = DataManipulationService.getValueLocation($scope.field);
        var maxItems = DataManipulationService.getMaxItems($scope.field);
        if ((!maxItems || $scope.model.length < maxItems)) {

          // copy selected instance in the model and insert immediately after
          var obj = {};
          obj[fieldValue] = $scope.valueArray[$scope.index][fieldValue];
          $scope.model.splice($scope.index + 1, 0, obj);

          // activate the new instance
          $timeout($scope.setActive($scope.index + 1, true), 100);
        }
      };

      // add more instances to a multiple cardinality field if possible
      $scope.addMoreInput = function () {
        var fieldValue = DataManipulationService.getValueLocation($scope.field);
        var maxItems = DataManipulationService.getMaxItems($scope.field);
        if ((!maxItems || $scope.model.length < maxItems)) {

          // add another instance in the model
          var obj = {};
          obj[fieldValue] = DataManipulationService.getDefaultValue(fieldValue) || DataManipulationService.getDefault($scope.field);
          $scope.model.push(obj);

          // activate the new instance
          $timeout($scope.setActive($scope.model.length - 1, true), 100);
        }
      };

      // remove the value of field at index
      $scope.removeInput = function (index) {
        var minItems = DataManipulationService.getMinItems($scope.field) || 0;
        if ($scope.model.length > minItems) {
          $scope.model.splice(index, 1);
        }
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

      // set this field and index active
      $scope.setActive = function (index, value) {

        // off or on
        var active = (typeof value === "undefined") ? true : value;
        var locator = $scope.getLocator(index);
        var current = DataManipulationService.isActive(locator);

        if (active !== current) {

          // if zero cardinality,  add a new item
          if (active && $scope.isMultipleCardinality() && $scope.model.length <= 0) {
            $scope.addMoreInput();
          }

          // set it active or inactive
          DataManipulationService.setActive($scope.field, index, $scope.path, $scope.uid, active);

          if (active) {

            $scope.index = index;
            $scope.pageMinMax();

            // set the parent active index
            if ($scope.path) {
              var indices = $scope.path.split('-');
              var last = indices[indices.length - 1];
              $scope.$parent.setIndex(parseInt(last));
            }

            // scroll it into the center of the screen and listen for shift-enter
            $scope.scrollToLocator(locator, ' .select');
            $document.unbind('keypress');
            $document.bind('keypress', function (e) {
              $scope.isSubmit(e, index);
            });
            $document.unbind('keyup');
            $document.bind('keyup', function (e) {
              $scope.isSubmit(e, index);
            });

          } else {
            // set blur and force a redraw
            jQuery("#" + locator).blur();

            setTimeout(function () {
              $scope.$apply();
            }, 0);

          }
        }
      };

      // scroll within the template to the field with the locator, focus and select the tag
      $scope.scrollToLocator = function (locator, tag) {

        $scope.setHeight = function () {

          // apply any changes first before examining dom elements
          $scope.$apply();

          var window = angular.element($window);
          var windowHeight = $(window).height();
          var target = jQuery("#" + locator);
          if (target) {

            var targetTop = target.offset().top;
            var targetHeight = target.outerHeight(true);
            var scrollTop = jQuery('.template-container').scrollTop();
            var newTop = scrollTop + targetTop - ( windowHeight - targetHeight ) / 2;

            jQuery('.template-container').animate({scrollTop: newTop}, 'fast');

            // focus and maybe select the tag
            if (tag) {
              var e = jQuery("#" + locator + ' ' + tag);
              if (e.length) {
                e[0].focus();
                if (!e.is('select')) {
                  e[0].select();
                }
              }
            }
          }
        };

        $timeout($scope.setHeight, 100);

      };

      // submit this edit
      $scope.onSubmit = function (index, next) {
        var found = false;

        if ($scope.isActive(index)) {

          DataManipulationService.setActive($scope.field, index, $scope.path, false);

          // is there a next one to set active
          if ($scope.isMultipleCardinality()) {

            if (typeof(next) == 'undefined') {
              if (index + 1 < $scope.model.length) {
                $scope.setActive(index + 1, true);
                found = true;
              }
            } else {
              if (next < $scope.model.length) {
                $scope.setActive(next, true);
                found = true;
              }
            }
          }

          if (!found) {
            $scope.$parent.activateNextSiblingOf($scope.fieldKey, $scope.parentKey);
          }
        }
      };

      // is this a submit?  shift-enter qualifies as a submit for any field
      $scope.isSubmit = function (keyEvent, index) {
        if (keyEvent.type === 'keypress' && keyEvent.which === 13 && keyEvent.ctrlKey) {
          $scope.onSubmit(index);
        }
        if (keyEvent.type === 'keyup' && keyEvent.which === 9) {
          keyEvent.preventDefault();
          $scope.onSubmit(index);
        }
      };


      //
      // watches
      //

      // form has been submitted, look for errors
      $scope.$on('submitForm', function (event) {
        // where is the value
        var location = DataManipulationService.getValueLocation($scope.field);

        // If field is required and is empty, emit failed emptyRequiredField event
        if ($rootScope.schemaOf($scope.field)._valueConstraints && $rootScope.schemaOf(
                $scope.field)._valueConstraints.requiredValue) {
          var allRequiredFieldsAreFilledIn = true;
          var min = $scope.field.minItems || 0;

          if (angular.isArray($scope.model)) {
            if ($scope.model.length < min) {
              allRequiredFieldsAreFilledIn = false;
            } else {
              angular.forEach($scope.model, function (valueElement) {


                if (!valueElement || !valueElement[location]) {
                  allRequiredFieldsAreFilledIn = false;
                } else if (angular.isArray(valueElement[location])) {
                  var hasValue = false;
                  angular.forEach(valueElement[location], function (ve) {
                    hasValue = hasValue || !!ve;
                  });

                  if (!hasValue) {
                    allRequiredFieldsAreFilledIn = false;
                  }
                } else if (angular.isObject(valueElement[location])) {
                  if ($rootScope.isEmpty(valueElement[location])) {
                    allRequiredFieldsAreFilledIn = false;
                  } else if (DataManipulationService.getFieldSchema($scope.field)._ui.dateType == "date-range") {
                    if (!valueElement[location].start || !valueElement[location].end) {
                      allRequiredFieldsAreFilledIn = false;
                    }
                  } else {
                    // Require at least one checkbox is checked.
                    var hasValue = false;
                    angular.forEach(valueElement[location], function (value, key) {
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
            if (!$scope.model || !$scope.model[location]) {
              allRequiredFieldsAreFilledIn = false;
            } else if (angular.isArray($scope.model[location])) {
              var hasValue = false;
              angular.forEach($scope.model[location], function (ve) {
                hasValue = hasValue || !!ve;
              });

              if (!hasValue) {
                allRequiredFieldsAreFilledIn = false;
              }
            } else if (angular.isObject($scope.model[location])) {
              if ($rootScope.isEmpty($scope.model[location])) {
                allRequiredFieldsAreFilledIn = false;
              } else if (DataManipulationService.getFieldSchema($scope.field)._ui.dateType == "date-range") {
                if (!$scope.model[location].start || !$scope.model[location].end) {
                  allRequiredFieldsAreFilledIn = false;
                }
              } else {
                // Require at least one checkbox is checked.
                var hasValue = false;
                angular.forEach($scope.model[location], function (value, key) {
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
              ['remove', $scope.getTitle($scope.field), $scope.uuid]);
        }


        var allFieldsAreValid = true;
        if (angular.isArray($scope.model)) {
          for (var i = 0; i < $scope.model.length; i++) {
            if (!DataManipulationService.isValidPattern($scope.field, i, $scope.path, $scope.uid)) {
              $scope.model[i][location] = DataManipulationService.getDomValue($scope.field, i, $scope.path, $scope.uid);
              allFieldsAreValid = false;
            }
          }

        } else {
          if (!DataManipulationService.isValidPattern($scope.field, 0, $scope.path, $scope.uid)) {
            $scope.model[location] = DataManipulationService.getDomValue($scope.field, 0, $scope.path, $scope.uid);
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

      // form has been saved, look for errors
      $scope.$on("saveForm", function () {

        var id = DataManipulationService.getId($scope.field);
        var title = DataManipulationService.getTitle($scope.field);
        var action = ($scope.isEditState() && !$scope.canDeselect($scope.field)) ? 'add' : 'remove';

        $scope.$emit("invalidFieldState", [action, title, id]);

      });

      // watch for a request to set this field active
      $scope.$on('setActive', function (event, args) {

        var id = args[0];
        var index = args[1];
        var path = args[2];
        var fieldKey = args[3];
        var parentKey = args[4];
        var value = args[5];
        var uid = args[6];

        if (id === $scope.getId() && path == $scope.path && fieldKey == $scope.fieldKey && parentKey == $scope.parentKey && uid == $scope.uid) {
          $scope.setActive(index, value);
        }
      });

      $scope.setInactive = function (index) {
        $scope.setActive(index, false);
      };

      $scope.setActiveMaybe = function (index) {
        if (!$scope.isActive(index)) {
          $scope.setActive(index, true);
        }
      };

      $scope.isHidden = function() {
        return DataManipulationService.isHidden($scope.field);
      };

      $scope.initValue = function() {
        if (DataManipulationService.hasDefault($scope.field)) {
          var location = DataManipulationService.getValueLocation($scope.field);
          var value = DataManipulationService.getDefault($scope.field);
          if (angular.isArray($scope.model)) {
            angular.forEach($scope.model, function (model) {
              model[location] = model[location] || value;
            });
          } else {
            $scope.model[location] = $scope.model[location] || value;
          }
        }
      };

      //
      // initialization
      //

      $scope.setValueArray();

      $scope.initValue();


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
        path          : '=',
        previous      : '=',
        uid           : '=',
        fieldKey      : '=',
        parentKey     : '='

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