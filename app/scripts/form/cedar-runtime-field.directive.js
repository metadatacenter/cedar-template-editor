'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.form.cedarRuntimeField', [])
      .directive('cedarRuntimeField', cedarRuntimeField);


  cedarRuntimeField.$inject = ["$rootScope", "$sce", "$document", "$translate", "$filter", "$location",
                               "$window", '$timeout',
                               "SpreadsheetService",
                               "DataManipulationService", "UIUtilService", "autocompleteService",
                               "ValueRecommenderService"];

  function cedarRuntimeField($rootScope, $sce, $document, $translate, $filter, $location, $window,
                             $timeout, SpreadsheetService, DataManipulationService, UIUtilService, autocompleteService,
                             ValueRecommenderService) {


    var linker = function ($scope, $element, attrs) {

      $scope.directory = 'runtime';
      $scope.midnight = $translate.instant('GENERIC.midnight');
      $scope.uuid = DataManipulationService.generateTempGUID();
      $scope.data = {
        model: null
      };
      $scope.viewState;
      $scope.index = 0;
      $scope.pageMin = 0;
      $scope.pageMax = 0;
      $scope.pageRange = 6;
      $scope.valueArray;
      $scope.urlRegex = '^((https?|ftp)://)?([a-z]+[.])?[a-z0-9-]+([.][a-z]{1,4}){1,2}(/.*[?].*)?$';

      var dms = DataManipulationService;


      $scope.multipleDemo = {};
      $scope.multipleDemo.colors = ['Red', 'Green'];
      $scope.multipleDemo.availableColors = ['Red', 'Green', 'Blue', 'Yellow', 'Magenta', 'Maroon', 'Umbra',
                                             'Turquoise'];


      //
      // model access
      //

      // get the field title
      $scope.getTitle = function (field) {
        return dms.getTitle(field || $scope.field);
      };

      // get the field description
      $scope.getDescription = function (field) {
        return dms.getDescription(field || $scope.field);
      };

      $scope.getContent = function (field) {
        return dms.getContent(field || $scope.field);
      };


      // get the field id
      $scope.getId = function () {
        return dms.getId($scope.field);
      };

      // get the field id
      $scope.getLiterals = function () {
        return dms.getLiterals($scope.field);
      };

      $scope.cardinalityString = function () {
        return UIUtilService.cardinalityString($scope.field);
      };

      // Retrieve appropriate field template file
      $scope.getFieldUrl = function () {
        return 'scripts/form/runtime-field' + '/' + $scope.getInputType() + '.html';
      };

      // is the field multiple cardinality?
      $scope.isMultipleCardinality = function () {
        return dms.isCardinalElement($scope.field);
      };


      $scope.isMultiple = function () {
        // We consider that checkboxes and multi-choice lists are not 'multiple'
        return (dms.isCardinalElement($scope.field) && !dms.isMultipleChoiceField($scope.field));
      };


      // what is the dom id for this field?
      $scope.getLocator = function (index) {
        return UIUtilService.getLocator($scope.field, index || 0, $scope.path, $scope.uid);
      };

      // is this field actively being edited?
      $scope.isActive = function (index) {
        return UIUtilService.isActive($scope.getLocator(index));
      };

      $scope.isInactive = function (index) {
        return UIUtilService.isInactive($scope.getLocator(index));
      };

      // is this a youTube field?
      $scope.isYouTube = function (field) {
        return dms.isYouTube(field || $scope.field);
      };

      $scope.getYouTubeEmbedFrame = function (field) {
        return UIUtilService.getYouTubeEmbedFrame(field || $scope.field);
      };

      // is this richText?
      $scope.isRichText = function (field) {
        return dms.isRichText(field || $scope.field);
      };

      $scope.getUnescapedContent = function (field) {
        return field._ui._content;
      };

      // is this a section break?
      $scope.isSectionBreak = function (field) {
        console.log('isSectionBreak', dms.isSectionBreak(field || $scope.field), $scope.field);
        return dms.isSectionBreak(field || $scope.field);
      };

      // is this a static image?
      $scope.isImage = function (field) {
        return dms.isImage(field || $scope.field);
      };

      // is the previous field static?
      $scope.isStatic = function (field) {
        return dms.isStaticField(field || $scope.field);
      };

      $scope.isPreviousStatic = function () {
        return $scope.isStatic($scope.previous);
      };

      // string together field values
      $scope.getValueString = function (valueElement) {
        var location = dms.getValueLabelLocation($scope.field, valueElement);
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

        SpreadsheetService.switchToSpreadsheet($scope, $scope.field, 0, function () {
          return true;
        }, function () {
          $scope.addMoreInput();
        }, function () {
          $scope.removeInput($scope.model.length - 1);
        }, function () {
          $scope.createExtraRows();
        }, function () {
          $scope.deleteExtraRows();
        })
      };

      $scope.cleanupSpreadsheet = function () {
        $scope.deleteExtraRows();
      };

      $scope.isTabView = function () {
        return UIUtilService.isTabView($scope.viewState);
      };

      $scope.isListView = function () {
        return UIUtilService.isListView($scope.viewState);
      };

      $scope.isSpreadsheetView = function () {
        return UIUtilService.isSpreadsheetView($scope.viewState);
      };

      // toggle through the list of view states
      $scope.toggleView = function () {
        $scope.viewState = UIUtilService.toggleView($scope.viewState, $scope.switchToSpreadsheet);
      };

      $scope.toggleActive = function (index) {
        $scope.setActive(index, !$scope.isActive(index));
      };

      $scope.setInactive = function (index) {
        $scope.setActive(index, false);
      };

      $scope.fullscreen = function () {
        UIUtilService.fullscreen($scope.getLocator(0));
      };

      // set this field and index active
      $scope.setActive = function (idx, value) {
        var active = (typeof value === "undefined") ? true : value;
        var index = $scope.isSpreadsheetView() ? 0 : idx;

        // if zero cardinality,  add a new item
        if (active && $scope.isMultipleCardinality() && $scope.model.length <= 0) {
          $scope.addMoreInput();
        }

        // set it active or inactive
        UIUtilService.setActive($scope.field, index, $scope.path, $scope.uid, active);

        if (active) {

          $scope.index = index;
          $scope.pageMinMax();

          // set the parent active index
          if ($scope.path) {
            var indices = $scope.path.split('-');
            var last = indices[indices.length - 1];
            $scope.$parent.setIndex(parseInt(last));
          }

          if (!$scope.isSpreadsheetView()) {
            var zeroedIndex = $scope.isSpreadsheetView() ? 0 : index;
            var zeroedLocator = $scope.getLocator(zeroedIndex);

            // scroll it into the center of the screen and listen for shift-enter
            $scope.scrollToLocator(zeroedLocator, ' .select');
            $document.unbind('keypress');
            $document.bind('keypress', function (e) {
              $scope.isSubmit(e, index);
            });
            $document.unbind('keyup');
            $document.bind('keyup', function (e) {
              $scope.isSubmit(e, index);
            });
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
          if (target && target.offset()) {

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
                  if (typeof e[0].select == 'function') {
                    e[0].select();
                  }
                  //e[0].select();
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

          UIUtilService.setActive($scope.field, index, $scope.path, false);

          // is there a next one to set active (except for checkboxes and multi-choice lists, for which we don't add new array items)
          if ($scope.isMultipleCardinality() && !DataManipulationService.isMultipleChoiceField($scope.field)) {

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

      $scope.addRow = function () {
        if ($scope.isSpreadsheetView()) {
          SpreadsheetService.addRow($scope);
        } else {
          $scope.addMoreInput();
        }
      };

      //
      // model values
      //

      // does this field have a value constraint?
      $scope.hasValueConstraint = function () {
        return dms.hasValueConstraint($scope.field);
      };

      // is this field required?
      $scope.isRequired = function () {
        return dms.isRequired($scope.field);
      };

      // is this a checkbox, radio or list question?
      $scope.isMultiAnswer = function () {
        return dms.isMultiAnswer($scope.field);
      };

      // is this a checkbox, radio or list question?
      $scope.isMultipleChoice = function () {
        return dms.isMultipleChoice($scope.field);
      };

      // is this a checkbox, radio or list question?
      $scope.getInputType = function () {
        return dms.getInputType($scope.field);
      };

      // is this a checkbox, radio or list question?
      $scope.getValueLocation = function () {
        return dms.getValueLocation($scope.field);
      };

      // has recommendations?
      $scope.isRecommended = function () {
        return ValueRecommenderService.getIsValueRecommendationEnabled($scope.field);
      };

      // has value constraints?
      $scope.isConstrained = function () {
        return dms.hasValueConstraint($scope.field) && !$scope.isRecommended();
      };

      // has neither recommendations or value constraints
      $scope.isRegular = function () {
        return !$scope.isConstrained() && !$scope.isRecommended();
      };

      // an array of values for multi-instance fields
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

      // initializes the value @type field if it has not been initialized yet
      $scope.initializeValueType = function () {
        dms.initializeValueType($scope.field, $scope.model);
      };

      // initializes the value field (or fields) to null (either @id or @value) if it has not been initialized yet.
      // It also initializes optionsUI
      $scope.initializeValue = function () {
        if (!$scope.hasBeenInitialized) {
          // If we are creating a new instance, the model is still completely empty. If there are any default values,
          // we set them. It's important to do this only if the model is empty to avoid overriding values of existing
          // instances with default values.
          // The model is initialized with default options when parsing the form (see form.directive.js).
          $scope.model = dms.initializeModel($scope.field, $scope.model, false);
          // If the model has not been initialized yet by setting default values, initialize values
          dms.initializeValue($scope.field, $scope.model);
          // Load selected values from the model to the UI, if any
          $scope.updateUIFromModel();
        }
        $scope.hasBeenInitialized = true;
      };

      // uncheck radio buttons
      $scope.uncheck = function (label) {
        if (dms.isRadioType($scope.field)) {
          if ($scope.optionsUI.radioPreviousOption == label) {
            // Uncheck
            $scope.optionsUI.radioOption = null;
            $scope.optionsUI.radioPreviousOption = null;
            $scope.updateModelFromUI();
          }
          else {
            $scope.optionsUI.radioPreviousOption = label;
          }
        }
      };

      $scope.multiple = {};

      // set the instance @value fields based on the options selected at the UI
      $scope.updateModelFromUI = function () {
        var fieldValue = $scope.getValueLocation();
        var inputType = $scope.getInputType();


        if ($scope.isMultiAnswer()) {
          // Reset model
          $scope.model = dms.initializeModel($scope.field, $scope.model, true);

          if (inputType == 'checkbox') {
            // Insert the value at the right position in the model. optionsUI is an object, not an array,
            // so the right order in the model is not ensured.
            // The following lines ensure that each option is inserted into the right place
            var orderedOptions = dms.getLiterals($scope.field);
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
              dms.initializeValue($scope.field, $scope.model);
            }
          }
          else if (inputType == 'radio') {
            $scope.model[fieldValue] = $scope.optionsUI.radioOption;
          }
          else if (inputType == 'list') {
            // Multiple-choice list
            if ($scope.isMultipleChoice()) {
              for (var i = 0; i < $scope.optionsUI.listMultiSelect.length; i++) {
                $scope.model.push({'@value': $scope.optionsUI.listMultiSelect[i].label});
              }
            }
            // Single-choice list
            else {
              $scope.model = {'@value': $scope.optionsUI.listSingleSelect.label};
            }
            // Remove the empty string created by the "Nothing selected" option (if it exists)
            dms.removeEmptyStrings($scope.field, $scope.model);
            // If the model is empty, set default value
            dms.initializeValue($scope.field, $scope.model);
          }
        }
      };

      // set the UI with the values from the model
      $scope.updateUIFromModel = function () {

        if ($scope.isMultiAnswer()) {
          $scope.optionsUI = {};
          var valueLocation = $scope.getValueLocation();

          if (dms.isCheckboxType($scope.field)) {
            for (var i = 0; i < $scope.model.length; i++) {
              var value = $scope.model[i][valueLocation];
              $scope.optionsUI[value] = value;
            }
          }
          else if (dms.isRadioType($scope.field)) {
            // For this field type only one selected option is possible
            if ($scope.model) {
              $scope.optionsUI.radioOption = $scope.model[valueLocation];
            }
          }
          else if (dms.isListType($scope.field)) {
            if ($scope.isMultipleChoice()) {
              $scope.optionsUI.listMultiSelect = [];
              for (var i = 0; i < $scope.model.length; i++) {
                var v = $scope.model[i][valueLocation];
                if (v) {
                  $scope.optionsUI.listMultiSelect.push({"label": $scope.model[i][valueLocation]});
                }

              }
            } else {
              if ($scope.model.length > 0) {
                $scope.optionsUI.listSingleSelect = {"label": $scope.model[0][valueLocation]};
              }
            }
          }
        }
      };

      // if the field is empty, delete the @id field. Note that in JSON-LD @id cannot be null.
      $scope.checkForEmpty = function () {
        var location = $scope.getValueLocation();
        var obj = $scope.valueArray[$scope.index];
        if (!obj[location] || obj[location].length === 0) {
          delete obj[location];
        }
      };

      // add more instances to a multiple cardinality field if possible by copying the selected instance
      $scope.copyField = function () {
        var valueLocation = $scope.getValueLocation();
        var maxItems = dms.getMaxItems($scope.field);
        if ((!maxItems || $scope.model.length < maxItems)) {

          // copy selected instance in the model and insert immediately after
          var obj = {};
          obj[valueLocation] = $scope.valueArray[$scope.index][valueLocation];
          $scope.model.splice($scope.index + 1, 0, obj);

          // activate the new instance
          $timeout($scope.setActive($scope.index + 1, true), 100);
        }
      };

      // add more instances to a multiple cardinality field if multiple and not at the max limit
      $scope.addMoreInput = function () {
        if ($scope.isMultipleCardinality()) {
          var valueLocation = $scope.getValueLocation();
          var maxItems = dms.getMaxItems($scope.field);
          if ((!maxItems || $scope.model.length < maxItems)) {
            // add another instance in the model
            var obj = {};
            obj[valueLocation] = dms.getDefaultValue(valueLocation, $scope.field);
            $scope.model.push(obj);

            // activate the new instance
            $scope.setActive($scope.model.length - 1, true);
          }

        }
        $scope.pageMinMax();

      };

      // remove the value of field at index
      $scope.removeInput = function (index) {
        var minItems = dms.getMinItems($scope.field) || 0;
        if ($scope.model.length > minItems) {
          $scope.model.splice(index, 1);
        }
      };

      //
      // watches
      //

      // form has been submitted, look for errors
      $scope.$on('submitForm', function (event) {
        var location = dms.getValueLocation($scope.field);
        var min = dms.getMinItems($scope.field) || 0;
        var valueConstraint = dms.getValueConstraint($scope.field);
        var id = $scope.getId();
        //var id = $scope.getId() + '-' + $scope.index;

        // If field is required and is empty, emit failed emptyRequiredField event
        if ($scope.hasValueConstraint() && $scope.isRequired()) {
          var allRequiredFieldsAreFilledIn = true;

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
                } else if (angular.isObject(valueElement)) {
                  if ($rootScope.isEmpty(valueElement[location])) {
                    allRequiredFieldsAreFilledIn = false;
                  } else if (dms.isDateRange($scope.field)) {
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
              } else if (dms.isDateRange($scope.field)) {
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
                ['add', $scope.getTitle(), $scope.uuid]);
          }
        }

        // If field is required and is not empty, check to see if it needs to be removed from empty fields array
        if ($scope.hasValueConstraint() && $scope.isRequired() && allRequiredFieldsAreFilledIn) {
          //remove from emptyRequiredField array
          $scope.$emit('emptyRequiredField',
              ['remove', $scope.getTitle(), $scope.uuid]);
        }

        var allFieldsAreValid = true;
        if (angular.isArray($scope.model)) {
          for (var i = 0; i < $scope.model.length; i++) {
            if (!UIUtilService.isValidPattern($scope.field, i, $scope.path, $scope.uid)) {
              $scope.model[i][location] = dms.getDomValue($scope.field, i, $scope.path, $scope.uid);
              allFieldsAreValid = false;
            }
          }

        } else {
          if (!UIUtilService.isValidPattern($scope.field, 0, $scope.path, $scope.uid)) {
            $scope.model[location] = dms.getDomValue($scope.field, 0, $scope.path, $scope.uid);
            allFieldsAreValid = false;
          }
        }

        if ($scope.hasValueConstraint()) {

          if (angular.isArray($scope.model)) {
            angular.forEach($scope.model, function (valueElement, index) {
              if (angular.isArray(valueElement)) {
                angular.forEach(valueElement, function (ve, index) {
                  if (!autocompleteService.isValueConformedToConstraint(ve, location, id, valueConstraint, index)) {
                    allFieldsAreValid = false;
                  }
                });
              } else {
                if (angular.isObject(valueElement)) {
                  if (!autocompleteService.isValueConformedToConstraint(valueElement, location, id, valueConstraint,
                          index)) {
                    allFieldsAreValid = false;
                  }
                }
              }
            });
          } else {
            if (angular.isArray($scope.model)) {
              angular.forEach($scope.model, function (ve) {
                if (!autocompleteService.isValueConformedToConstraint(ve, location, id, valueConstraint, index)) {
                  allFieldsAreValid = false;
                }
              });
            } else {
              if (angular.isObject($scope.model)) {
                if (!autocompleteService.isValueConformedToConstraint($scope.model, location, id, valueConstraint, 0)) {
                  allFieldsAreValid = false;
                }
              }
            }
          }
        }

        $scope.$emit('invalidFieldValues',
            [allFieldsAreValid ? 'remove' : 'add', $scope.getTitle(), $scope.uuid]);

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


      // watch for changes in the selection for spreadsheet view to create and destroy the spreadsheet
      $scope.$watch(
          function () {
            return ( $rootScope.activeLocator);
          },
          function (newValue, oldValue) {


            if ($scope.isSpreadsheetView()) {

              // spreadsheet view will use the 0th instance
              var zeroedLocator = function (value) {
                var result = '';
                if (value) {
                  var result = value.replace(/-([^-]*)$/, '-0');
                }
                return result;
              };

              $timeout(function () {
                var zeroLocator = $scope.getLocator(0);
                if (zeroLocator === zeroedLocator(oldValue)) {
                  SpreadsheetService.destroySpreadsheet($scope);
                  $scope.$apply();
                }
                if (zeroLocator === zeroedLocator(newValue)) {
                  $scope.switchToSpreadsheet();
                  $scope.$apply();
                }
              }, 0);
            }
          }
      );

      $scope.createExtraRows = function() {
        // make sure there are at least 10 entries in the spreadsheet
        var maxItems = dms.getMaxItems($scope.field);
        while (($scope.model.length < 10 || $scope.model.length < maxItems)) {
          $scope.addMoreInput();
        }
      };

      $scope.deleteExtraRows = function() {
        // delete extra blank rows
        var location = dms.getValueLocation($scope.field);
        var min = dms.getMinItems($scope.field) || 0;
        if (angular.isArray($scope.model)) {

          loop:for (var i = $scope.model.length; i > min; i--) {
            var valueElement = $scope.model[i-1];
            if (valueElement[location] == null || valueElement[location].length === 0) {
              $scope.removeInput(i-1);
            } else {
              break loop;
            }
          }
        }
      };

      $scope.isHidden = function () {
        return DataManipulationService.isHidden($scope.field);
      };

      $scope.initValue = function () {
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


      $scope.viewState = UIUtilService.createViewState($scope.field, $scope.switchToSpreadsheet, $scope.cleanupSpreadsheet);


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

})
;