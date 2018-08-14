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
                               "ValueRecommenderService", "uibDateParser", "CONST"];

  function cedarRuntimeField($rootScope, $sce, $document, $translate, $filter, $location, $window,
                             $timeout, SpreadsheetService, DataManipulationService, UIUtilService, autocompleteService,
                             ValueRecommenderService, uibDateParser, CONST) {


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
      $scope.CONST = CONST;

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

      $scope.getPropertyLabel = function () {
        if ($scope.labels && $scope.fieldKey && $scope.labels[$scope.fieldKey]) {
          return $scope.labels[$scope.fieldKey];
        }
      };

      $scope.getPropertyDescription = function () {
        if ($scope.descriptions && $scope.fieldKey && $scope.descriptions[$scope.fieldKey]) {
          return $scope.descriptions[$scope.fieldKey];
        }
      };

      $scope.hasPropertyDescription = function () {
        return $scope.descriptions && $scope.fieldKey && $scope.descriptions[$scope.fieldKey];
      };

      // get the field description
      $scope.getDescription = function (field) {
        return dms.getDescription(field || $scope.field);
      };

      $scope.hasDescription = function () {
        var description = dms.getDescription($scope.field);
        return description && description.length > 0;
      };

      $scope.getLabel = function () {
        return $scope.getPropertyLabel() || $scope.getTitle();
      };

      $scope.getHelp = function () {
        return $scope.getPropertyDescription() || $scope.getDescription();
      };

      $scope.hasHelp = function () {
        return $scope.hasPropertyDescription() || $scope.hasDescription();
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
      $scope.getValueString = function (valueElement, attributeValueElement) {
        var result = '';
        if (dms.isAttributeValueType($scope.field)) {
          if (valueElement) {
            for (var i = 0; i < valueElement.length; i++) {
              result += valueElement[i]['@value'] + (attributeValueElement[i]['@value'] ? '=' + attributeValueElement[i]['@value'] : '') + ', ';
            }
          }

        } else {
          var location = dms.getValueLabelLocation($scope.field, valueElement);
          if (valueElement) {
            for (var i = 0; i < valueElement.length; i++) {
              if (valueElement[i][location]) {
                result += valueElement[i][location] + ', ';
              }
            }
          }
        }
        return result.trim().replace(/,\s*$/, "");
      };

      // string together field values
      $scope.getValue = function () {

        if ($scope.isRegular() && $scope.isListView()) {
          return $scope.valueArray[$scope.index]['@value'];
        }
        if ($scope.isRegular() && !$scope.isListView()) {
          return $scope.getValueString($scope.valueArray);
        }
        if ($scope.isConstrained() && $scope.isListView()) {
          return $scope.valueArray[$scope.index]['rdfs:label'];
        }
        if ($scope.isConstrained() && $scope.isListView()) {
          return $scope.valueArray[$scope.index]['rdfs:label'];
        }
        if ($scope.isConstrained() && !$scope.isListView()) {
          return $scope.getValueString($scope.valueArray);
        }
        if ($scope.isRecommended() && $scope.isListView()) {
          //TODO: pick rdfs:label or @value depending on the existing field value
          return $scope.valueArray[$scope.index]['rdfs:label'];
        }
        if ($scope.isRecommended() && !$scope.isListView()) {
          return $scope.getValueString($scope.valueArray);
        }
      };


      // // strip midnight off the date time string
      // $scope.formatDateTime = function (value) {
      //
      //   var result = value;
      //   if (value) {
      //
      //     var index = value.indexOf($scope.midnight);
      //     if (index != -1) {
      //       result = value.substring(0, index);
      //     }
      //   }
      //   return result;
      // };

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
        $scope.setActive(0, true);
        if (dms.getMaxItems($scope.field)) {
          // create all the rows if the maxItems is a fixed number
          $scope.createExtraRows();
        }

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
        //$scope.expanded[0] = false;
        SpreadsheetService.destroySpreadsheet($scope);
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
        $scope.viewState = UIUtilService.toggleView($scope.viewState, $scope.setActive);
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

        if (dms.isDateType($scope.field)) {
          $scope.setDateValue(index);

          $timeout(function () {
            $rootScope.$broadcast('runDateValidation');
          }, 0);

        }

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
          if ($scope.isMultipleCardinality() && !dms.isMultipleChoiceField($scope.field)) {

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
        // Doesn't work for multi-input fields like attribute-value
        // if (keyEvent.type === 'keyup' && keyEvent.which === 9) {
        //   keyEvent.preventDefault();
        //   $scope.onSubmit(index);
        // }
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
        } else if (dms.isAttributeValueType($scope.field)) {
          $scope.valueArray = [];
          for (var i = 0; i < $scope.model.length; i++) {
            $scope.valueArray.push({'@value': $scope.model[i]})
          }
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

      // an array of attribute names for attribute-value types
      $scope.setAttributeValueArray = function () {


        var parentModel = $scope.parentModel || $scope.$parent.model;
        var parentInstance = $scope.parentInstance;
        var parent = parentModel[parentInstance] || parentModel;


        if (dms.isAttributeValueType($scope.field)) {
          $scope.attributeValueArray = [];
          for (var i = 0; i < $scope.valueArray.length; i++) {
            var attributeName = $scope.valueArray[i]['@value'];
            $scope.attributeValueArray.push(
                {'@value': (parent.hasOwnProperty(attributeName) ? parent[attributeName]['@value'] : '')});
          }
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
      $scope.updateModelFromUI = function (newValue, oldValue, isAttributeName) {

        var fieldValue = $scope.getValueLocation();
        var inputType = $scope.getInputType();
        var attributeName;

        if (dms.isDateType($scope.field)) {
          var str = $scope.toXSDDate(newValue);
          if ($scope.model.length > 0) {
            $scope.model[$scope.index]['@value'] = str;
          } else {
            $scope.model['@value'] = str;
          }
        }

        if (dms.isAttributeValueType($scope.field)) {
          var parentModel = $scope.parentModel || $scope.$parent.model;
          var parentInstance = $scope.parentInstance;
          var parent = parentModel[parentInstance] || parentModel;

          if ($scope.model.length > 0) {

            if (isAttributeName) {

              // attribute name, first make it unique in the parent

              attributeName = $scope.getNewAttributeName(newValue, parent);
              if (!$scope.isDuplicateAttribute(attributeName, parent)) {

                $scope.valueArray[$scope.index]['@value'] = attributeName;

                if (Array.isArray(parentModel)) {
                  for (var i = 0; i < parentModel.length; i++) {

                    // update all the instances
                    parentModel[i][$scope.fieldKey][$scope.index] = attributeName;

                    // update attribute name in the parent

                    parentModel[i][attributeName] = {'@value': null};
                    if (oldValue && parentModel[i][oldValue]) {
                      parentModel[i][attributeName]['@value'] = parentModel[i][oldValue]['@value'];
                      delete parentModel[i][oldValue];
                    }

                  }
                } else {

                  // update attribute name in the attribute-value field and in the parent
                  parentModel[$scope.fieldKey][$scope.index] = attributeName;
                  parentModel[attributeName] = {'@value': null};
                  if (oldValue && parentModel[oldValue]) {
                    delete parentModel[oldValue];
                  }

                  //update attribute name in attribute-value field
                  //$scope.model[$scope.index]['@value'] = attributeName;


                }
              }
            } else {

              // attribute value, update value in parent model
              var attributeName = $scope.valueArray[$scope.index]['@value'];

              if (attributeName && parent[attributeName]) {
                parent[attributeName]['@value'] = newValue;
              } else {
                console.log('Error: cannot update attribute value', attributeName, parent);
              }
            }

          } else {
            // not handling scope.model as object
          }

        }

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
              $scope.model[fieldValue] = $scope.optionsUI.listSingleSelect.label;
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


        if (dms.isDateType($scope.field)) {
          var date = new Date($scope.valueArray[$scope.index]['@value']);
          $scope.date.dt = date;
        }

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
              // For this field type only one selected option is possible
              if ($scope.model) {
                $scope.optionsUI.listSingleSelect = {"label": $scope.model[valueLocation]};
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
        if (dms.isAttributeValueType($scope.field)) {
          $scope.copyAttributeValueField($scope.parentModel, $scope.parentInstance);
        } else {
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
        }
      };

      $scope.isDuplicateAttribute = function (name, model) {
        return model.hasOwnProperty(name);
      };

      $scope.getNewAttributeName = function (oldName, model) {
        if (!oldName || oldName.length == 0 || $scope.isDuplicateAttribute(oldName, model)) {

          var newName = $scope.fieldKey;
          var offset = $scope.index;
          var i = offset--;
          do {
            i++;
          } while ($scope.isDuplicateAttribute(newName + i, model) && i < 10000);
          return newName + i;
        } else {
          return oldName;
        }
      };

      $scope.copyAttributeValueField = function (parentModel, parentInstance) {

        var parentModel = $scope.parentModel || $scope.$parent.model;
        var parentInstance = $scope.parentInstance;
        var parent = parentModel[parentInstance] || parentModel;


        var maxItems = dms.getMaxItems($scope.field);
        if ((!maxItems || $scope.model.length < maxItems)) {

          // there is no attribute name defined, so give it a default name
          if (!$scope.valueArray[$scope.index]['@value']) {
            $scope.updateModelFromUI($scope.fieldKey, '', true);
          }

          // create a unique attribute name for the copy
          var attributeValue = $scope.attributeValueArray[$scope.index]['@value'];
          var oldAttributeName = $scope.valueArray[$scope.index]['@value'];
          var newAttributeName = $scope.getNewAttributeName(oldAttributeName, parent);

          if (!$scope.isDuplicateAttribute(newAttributeName, parent)) {


            if (Array.isArray(parentModel)) {
              for (var i = 0; i < parentModel.length; i++) {

                // create the obj in the attribute-value field
                parentModel[i][$scope.fieldKey].splice($scope.index + 1, 0, newAttributeName);

                // create the new field at the parent level
                var valueObject = {};
                valueObject["@value"] = attributeValue;
                parentModel[i][newAttributeName] = valueObject;
              }
            } else {

              // create the obj in the attribute-value field
              parentModel[$scope.fieldKey].splice($scope.index + 1, 0, newAttributeName);

              // create the new field at the parent level
              var valueObject = {};
              valueObject["@value"] = attributeValue;
              parentModel[newAttributeName] = valueObject;
            }

            // activate the new instance
            $timeout(function () {
              $scope.setValueArray();
              $scope.setAttributeValueArray();
              $scope.setActive($scope.index + 1, true);
            }, 100);

          }
        }
      };

      // add more instances to a multiple cardinality field if multiple and not at the max limit
      $scope.addMoreInput = function () {
        if (dms.isAttributeValueType($scope.field)) {
          var parentModel = $scope.parentModel || $scope.$parent.model;
          var parentInstance = $scope.parentInstance;
          var parent = parentModel[parentInstance] || parentModel;

          var attributeName = $scope.getNewAttributeName('', parent);
          if (!$scope.isDuplicateAttribute(attributeName, parent)) {

            if (Array.isArray(parentModel)) {
              for (var i = 0; i < parentModel.length; i++) {

                parentModel[i][$scope.fieldKey][$scope.index] = attributeName;
                parentModel[i][attributeName] = {'@value': null};
              }
            } else {

              parentModel[$scope.fieldKey][$scope.index] = attributeName;
              parentModel[attributeName] = {'@value': null};
            }
            $scope.setValueArray();
            $scope.setAttributeValueArray();
            $scope.setActive($scope.model.length - 1, true);

          }

        } else {
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
        }
        $scope.pageMinMax();

      };

      // remove the value of field at index
      $scope.removeInput = function (index) {

        var minItems = dms.getMinItems($scope.field) || 0;
        if ($scope.model.length > minItems) {

          // attribute-value pairs propagate and have unique attributes
          if (dms.isAttributeValueType($scope.field)) {
            var attributeName = $scope.model[index];
            if (Array.isArray($scope.parentModel)) {
              for (var i = 0; i < $scope.parentModel.length; i++) {

                // remove the instance and the unique attribute
                delete $scope.parentModel[i][attributeName];
                $scope.parentModel[i][$scope.fieldKey].splice(index, 1);
              }
            } else {
              // remove the instance and the unique attribute
              delete $scope.parentModel[attributeName];
              $scope.parentModel[$scope.fieldKey].splice(index, 1);
            }
            $scope.valueArray.splice(index, 1);
            $scope.attributeValueArray.splice(index, 1);
          } else {
            // remove the instance
            $scope.model.splice(index, 1);
          }
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

      // spreadsheet view will use the 0th instance
      $scope.zeroedLocator = function (value) {
        var result = '';
        if (value) {
          var result = value.replace(/-([^-]*)$/, '-0');
        }
        return result;
      };

      // watch for changes in the selection for spreadsheet view to get out of spreadsheet mode
      $scope.$watch(
          function () {
            return ( UIUtilService.activeLocator);
          },
          function (newValue, oldValue) {

            if ($scope.zeroedLocator(newValue) != $scope.zeroedLocator(oldValue) && $scope.getLocator(
                    0) == $scope.zeroedLocator(oldValue) && $scope.isSpreadsheetView()) {
              $scope.toggleView();
            }
          }
      );

      // make sure there are at least 10 entries in the spreadsheet
      $scope.createExtraRows = function () {
        var maxItems = dms.getMaxItems($scope.field);
        while (($scope.model.length < 10 || $scope.model.length < maxItems)) {
          $scope.addMoreInput();
        }
      };

      // delete extra blank rows
      $scope.deleteExtraRows = function () {
        var location = dms.getValueLocation($scope.field);
        var min = dms.getMinItems($scope.field) || 0;
        if (angular.isArray($scope.model)) {

          loop:for (var i = $scope.model.length; i > min; i--) {
            var valueElement = $scope.model[i - 1];
            if (valueElement[location] == null || valueElement[location].length === 0) {
              $scope.removeInput(i - 1);
            } else {
              break loop;
            }
          }
          f
        }
      };

      $scope.isHidden = function () {
        return dms.isHidden($scope.field);
      };

      $scope.initValue = function () {
        if (dms.hasDefault($scope.field)) {
          var location = dms.getValueLocation($scope.field);
          var value = dms.getDefault($scope.field);
          if (angular.isArray($scope.model)) {
            angular.forEach($scope.model, function (model) {
              model[location] = model[location] || value;
            });
          } else {
            $scope.model[location] = $scope.model[location] || value;
          }
        }
      };

      $scope.hasModel = function () {
        return $scope.model && $scope.model.length > 0;
      };

      //
      // date picker  date parser
      //

      $scope.date = {
        dt             : '',
        language       : navigator.language,
        format         : CONST.dateFormats[navigator.language] || 'dd/MM/yyyy',
        opened         : false,
        altInputFormats: ['MM/dd/yyyy', 'MM-dd-yyyy']
      };

      // always store the xsd:date format
      $scope.toXSDDate = function (value) {
        if ($scope.isInvalidDate(value)) {
          return null;
        } else {
          return $filter('date')(new Date(value), 'MM-dd-yyyy');
        }
      };

      $scope.setDateValue = function (index) {
        if ($scope.valueArray && $scope.valueArray[index] && $scope.valueArray[index]['@value']) {
          var date = new Date($scope.valueArray[index]['@value']);
          date.setMinutes(date.getTimezoneOffset());
          $scope.date.dt = date;
        } else {
          $scope.date.dt = null;
        }
      };

      $scope.dateFormat = function (value) {
        if (value) {
          var date = new Date(value);
          return date.toLocaleDateString(navigator.language);
        }
      };

      $scope.isInvalidDate = function (value) {
        var date = uibDateParser.parse(value);
        return date == null;
      };

      //
      // initialization
      //

      $scope.setValueArray();
      $scope.setAttributeValueArray();


      $scope.viewState = UIUtilService.createViewState($scope.field, $scope.switchToSpreadsheet,
          $scope.cleanupSpreadsheet);

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
        parentKey     : '=',
        parentModel   : '=',
        parentInstance: '=',
        labels        : '=',
        descriptions  : '='

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