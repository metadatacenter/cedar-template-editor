'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.form.fieldDirective', [])
      .directive('fieldDirective', fieldDirective);


  fieldDirective.$inject = ["$rootScope", "$sce", "$translate", "$filter",
                            "SpreadsheetService",
                            "DataManipulationService", "FieldTypeService", "controlledTermDataService",
                            "StringUtilsService", "UIUtilService"];

  function fieldDirective($rootScope, $sce, $translate, $filter, SpreadsheetService,
                          DataManipulationService,
                          FieldTypeService, controlledTermDataService, StringUtilsService, UIUtilService) {


    var linker = function ($scope, $element, attrs) {

      $scope.errorMessages;
      //var tabSet = ["field", "values", "cardinality", "range", "required", "value-recommendation"];
      var tabSet = ["values", "cardinality", "range", "required", "value-recommendation","hidden","field"];
      $scope.activeTab;
      $scope.viewType = 'table';
      $scope.uuid = DataManipulationService.generateTempGUID();
      $scope.isFirstRefresh = true;
      $scope.status = {
        isopen: false
      };

      var dms = DataManipulationService;

      //
      // model and ui support
      //

      $scope.isRuntime = function () {
        return UIUtilService.isRuntime();
      };

      $scope.getShortText = function (text, maxLength, finalString, emptyString) {
        return StringUtilsService.getShortText(text, maxLength, finalString, emptyString);
      };

      $scope.getShortId = function (uri, maxLength) {
        return StringUtilsService.getShortId(uri, maxLength);
      };


      $scope.getHidden = function () {
        return DataManipulationService.getHidden($scope.field);
      };

      $scope.allowsHidden = function () {
        return DataManipulationService.allowsHidden($scope.field);
      };

      // is this multiple cardinality?
      $scope.isHidden = function () {
        return DataManipulationService.isHidden($scope.field);
      };

      // is this multiple cardinality?
      $scope.setHidden = function (value) {
        DataManipulationService.setHidden($scope.field, value);
      };

      // is this multiple cardinality?
      $scope.isMultiple = function () {
        return dms.isCardinalElement($scope.field);
      };

      // is this multiple cardinality?
      $scope.hasMin = function () {
        return $scope.field.hasOwnProperty('minItems');
      };

      $scope.isRequired = function () {
        return dms.isRequired($scope.field);
      };

      $scope.getDomId = function (node) {
        return dms.getDomId(node);
      };

      $scope.getTitle = function () {
        return dms.getTitle($scope.field);
      };

      $scope.getDescription = function () {
        return dms.getDescription($scope.field);
      };

      $scope.hasValueConstraint = function () {
        return dms.hasValueConstraint($scope.field);
      };


      $scope.getLiterals = function () {
        return dms.getLiterals($scope.field);
      };

      // default the cardinality to 1..N
      $scope.defaultMinMax = function () {
        dms.defaultMinMax($scope.field);
      };

      // clear any current cardinality
      $scope.clearMinMax = function () {
        dms.clearMinMax($scope.field);
      };

      // is this a static field?
      $scope.isStatic = function () {
        return FieldTypeService.isStaticField(dms.getInputType($scope.field));
      };

      // check for delete;  we should have a parentElement
      $scope.ckDelete = function () {
        if ($scope.parentElement) {
          DataManipulationService.removeChild($scope.parentElement, $scope.field);
          $scope.$emit("invalidElementState",
              ["remove", dms.getTitle($scope.field), dms.getId($scope.field)]);
        }
      };

      // try to select this field
      $scope.canSelect = function (select) {
        var result = select;
        if (select) {
          result = UIUtilService.canSelect($scope.field);
        }
        return result;
      };

      // try to deselect this field
      $scope.canDeselect = function (field) {
        return UIUtilService.canDeselect(field, $scope.renameChildKey);
      };

      $scope.getForm = function () {
        return $rootScope.jsonToSave;
      };

      // is the field toggled open?
      $scope.toggled = function (open) {
        $scope.status.isopen = open;
      };

      // does this field allow multiple cardinality?
      $scope.allowsMultiple = function () {
        var result = FieldTypeService.getFieldTypes().filter(function (obj) {
          return obj.cedarType == dms.getInputType($scope.field);
        });
        return result.length > 0 && result[0].allowsMultiple;
      };

      // does the field support value recommendation?
      $scope.allowsValueRecommendation = function () {
        var result = FieldTypeService.getFieldTypes().filter(function (obj) {
          return obj.cedarType == dms.getInputType($scope.field);
        });
        return result.length > 0 && result[0].allowsValueRecommendation;
      };

      // does the field support using controlled terms
      $scope.hasControlledTerms = function () {
        var result = FieldTypeService.getFieldTypes().filter(function (obj) {
          return obj.cedarType == dms.getInputType($scope.field);
        });
        return result.length > 0 && result[0].hasControlledTerms;
      };

      // does the field support using instance type term
      $scope.hasInstanceType = function () {
        var result = FieldTypeService.getFieldTypes().filter(function (obj) {
          return obj.cedarType == dms.getInputType($scope.field);
        });
        return result.length > 0 && result[0].hasInstanceTerm;
      };

      // does the field support using instance type term
      $scope.getInstanceType = function () {
       return dms.getFieldControlledTerms($scope.field);
      };

      // Retrieve appropriate field templates
      $scope.getTemplateUrl = function () {
        return 'scripts/form/field-' + $scope.directory + '/' + dms.getInputType(
                $scope.field) + '.html';
      };

      $scope.switchToSpreadsheet = function () {
        SpreadsheetService.switchToSpreadsheetField($scope, $element);
      };

      $scope.getYouTubeEmbedFrame = function (field) {
        return UIUtilService.getYouTubeEmbedFrame(field);
      };

      $scope.isTabActive = function (item) {
        return $scope.activeTab === item;
      };

      $scope.setTab = function (item) {
        if (tabSet.indexOf(item) > -1) {
          $scope.activeTab = item;
          $scope.setAddedFieldMap();
        }
      };

      $scope.addMoreInput = function () {
        var maxItems = dms.getMaxItems($scope.field);
        if ((!maxItems || $scope.model.length < maxItems)) {
          $scope.model.push({'@value': null});
        }
      };

      $scope.removeInput = function (index) {
        var minItems = dms.getMinItems($scope.field) || 0;
        if ($scope.model.length > minItems) {
          $scope.model.splice(index, 1);
        }
      };

      $scope.relabelField = function(newTitle) {
        DataManipulationService.relabelField($scope.getForm(), $scope.fieldKey, newTitle);
      }

      //
      // controlled terms modal
      //

      $scope.modalType;
      // create an id for the controlled terms modal
      $scope.getModalId = function (type) {
        return UIUtilService.getModalId(dms.getId($scope.field), type);
      };

      // show the controlled terms modal
      $scope.showModal = function (type) {
        if (type) {
          $scope.modalType = type;
          UIUtilService.showModal(dms.getId($scope.field), type);
        }
      };

      // show the controlled terms modal
      $scope.hideModal = function () {
        if ($scope.modalType) {
          UIUtilService.hideModal(dms.getId($scope.field), $scope.modalType);
        }
      };

      // controlled terms modal has an outcome
      $scope.$on("field:controlledTermAdded", function () {
        $scope.hideModal();

        // build the added fields map in this case
        $scope.setAddedFieldMap();

      });

      // controlled terms modal has an outcome
      $scope.$on("property:propertyAdded", function () {
        $scope.hideModal();
      });

      //
      // watches
      //

      // watch for this field's deselect
      $scope.$on('deselect', function (event, args) {
        var field = args[0];
        var errors = args[1];

        if (field == $scope.field) {
          $scope.errorMessages = errors;
          if ($scope.errorMessages.length == 0) parseField();
        }
      });

      // update schema title and description if necessary
      $scope.$watch("field", function (newField, oldField) {


        // default the title and description if necessary
        DataManipulationService.defaultTitleAndDescription(newField._ui);

        // set the schema title for the field with autogenerated values
        if (DataManipulationService.getTitle(newField) != DataManipulationService.getTitle(oldField)) {
          var capitalizedTitle = $filter('capitalizeFirst')(DataManipulationService.getTitle(newField));
          DataManipulationService.setSchemaTitle(newField,
              $translate.instant("GENERATEDVALUE.fieldTitle", {title: capitalizedTitle}).trim());
          dms.setSchemaDescription(newField,
              $translate.instant("GENERATEDVALUE.fieldDescription", {title: capitalizedTitle}).trim());
        }

        setDirectory();
      }, true);

      // Used just for text fields whose values have been constrained using controlled terms
      $scope.$watch("model", function () {

        $scope.isEditState = function () {
          return (UIUtilService.isEditState($scope.field));
        };

        $scope.isNested = function () {
          return $scope.nested;
          //return (DataManipulationService.isNested($scope.field));
        };

        $scope.addOption = function () {
          return (dms.addOption($scope.field));
        };

      }, true);

      // try to deselect the field if it is active
      $scope.$on("saveForm", function () {
        var action = $scope.isEditState() && !$scope.canDeselect($scope.field) ? 'add' : 'remove';
        $scope.$emit("invalidFieldState",
            [action, dms.getTitle($scope.field), dms.getId($scope.field)]);
      });

      //
      // initialization
      //

      var setDirectory = function () {
        var schema = dms.schemaOf($scope.field);
        var state = schema._tmp && schema._tmp.state || "completed";
        if ((state == "creating") && !$scope.preview && !UIUtilService.isRuntime()) {
          $scope.directory = "create";
        } else {
          $scope.directory = "render";
        }
      };
      setDirectory();

      //var field = dms.schemaOf($scope.field);

      // Checking each field to see if required, will trigger flag for use to see there is required fields
      if ($scope.hasValueConstraint() && dms.isRequired($scope.field)) {
        $scope.$emit('formHasRequiredfield._uis');
      }

      // Load values when opening an instance
      if ($scope.model) {
        var fieldValue = dms.getValueLocation($scope.field);
        $scope.modelValueRecommendation = {valueInfo: {'value': $scope.model[fieldValue]}}
      }

      var parseField = function () {
        if ($scope.field) {
          var min = dms.getMinItems($scope.field) || 0;
          if (!dms.isCardinalElement($scope.field)) {
            $scope.model = {};
          } else {
            $scope.model = [];
            for (var i = 0; i < min; i++) {
              var obj = {};
              $scope.model.push(obj);
            }
          }
        }
      };


      // If selectedByDefault is false, it is removed from the model
      $scope.cleanSelectedByDefault = function (index) {
        var literals = dms.getLiterals($scope.field);
        if (literals[index].selectedByDefault == false) {
          delete literals[index].selectedByDefault;
        }
      }

      // Sets the default options for the 'radio' button based on the options selected at the UI
      $scope.radioModelToDefaultOptions = function (index) {
        var literals = dms.getLiterals($scope.field);
        for (var i = 0; i < literals.length; i++) {
          if (i != index) {
            delete literals[i].selectedByDefault;
          }
        }
      };

      // Sets UI selections based on the default options
      $scope.defaultOptionsToUI = function () {
        if (dms.isMultiAnswer($scope.field)) {
          var literals = dms.getLiterals($scope.field);
          if (dms.isCheckboxType($scope.field)) {
            $scope.optionsUI = {};
            for (var i = 0; i < literals.length; i++) {
              var literal = literals[i];
              if (literal.selectedByDefault == true) {
                $scope.optionsUI[literal.label] = true;
              }
              else {
                $scope.optionsUI[literal.label] = false;
              }
            }
          }
          else if (dms.isRadioType($scope.field)) {
            $scope.optionsUI = {option: null};
            for (var i = 0; i < literals.length; i++) {
              var literal = literals[i];
              if (literal.selectedByDefault == true) {
                $scope.optionsUI.option = literal.label;
              }
            }
          }
          else if (dms.isListType($scope.field)) {
            // We use an object here instead of a primitive to ensure two-way data binding with the UI element (ng-model)
            $scope.optionsUI = {options: []};
            for (var i = 0; i < literals.length; i++) {
              var literal = literals[i];
              if (literal.selectedByDefault == true) {
                $scope.optionsUI.options.push(literal.label);
              }
            }
          }
        }
      };

      // Sets the instance @value fields based on the options selected at the UI
      $scope.updateModelFromUI = function () {

        if (!$scope.model || !angular.isArray($scope.model)) {
          $scope.model = [];
        }
        else {
          // Remove all elements from the 'model' array. Note that using $scope.model = []
          // is dangerous because we have references to the original array
          $scope.model.splice(0, $scope.model.length);
        }
        if (dms.isCheckboxType($scope.field)) {
          for (var option in $scope.optionsUI) {
            if ($scope.optionsUI[option] == true) {
              $scope.model.push({'@value': option});
            }
          }
        }
        else if (dms.isRadioType($scope.field)) {
          // If 'updateModelFromUI' was invoked from the UI (option is not null)
          if ($scope.optionsUI.option != null) {
            $scope.model.push({'@value': $scope.optionsUI.option});
          }
        }
        else if (dms.isListType($scope.field)) {
          // Update model
          for (var i = 0; i < $scope.optionsUI.options.length; i++) {
            $scope.model.push({'@value': $scope.optionsUI.options[i]});
          }
        }
        // Default value
        if ($scope.model.length == 0) {
          $scope.model.push({'@value': null});
        }
      };

      // Updates the model for fields whose values have been constrained using controlled terms
      $scope.updateModelFromUIControlledField = function () {
        // Multiple fields
        if (angular.isArray($scope.modelValue)) {
          if ($scope.modelValue.length > 0) {
            angular.forEach($scope.modelValue, function (m, i) {
              if (m && m['@value'] && m['@value']['@id']) {
                $scope.model[i] = {
                  "@value"   : m['@value']['@id'],
                  "rdfs:label" : m['@value'].label
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
            $scope.model['rdfs:label'] = $scope.modelValue['@value'].label;
          } else {
            $scope.model['@value'] = null;
          }
        }
      };

      // Set the UI with the values (@value) from the model
      $scope.updateUIFromModel = function () {
        var inputType = dms.getInputType($scope.field);
        if (inputType == 'checkbox') {
          $scope.optionsUI = {};
          for (var item in $scope.model) {
            var valueLabel = $scope.model[item]['@value'];
            $scope.optionsUI[valueLabel] = true;
          }
        }
        else if (inputType == 'radio') {
          $scope.optionsUI = {option: null};
          // Note that for this element only one selected option is possible
          if ($scope.model[0]['@value'] != null) {
            $scope.optionsUI.option = $scope.model[0]['@value'];
          }
        }
        else if (inputType == 'list') {
          $scope.optionsUI = {options: []};
          for (var item in $scope.model) {
            var valueLabel = $scope.model[item]['@value'];
            $scope.optionsUI.options.push(valueLabel);
          }
        }
      };

      $scope.updateUIFromModelControlledField = function () {
        if (angular.isArray($scope.model)) {
          $scope.modelValue = [];
          angular.forEach($scope.model, function (m, i) {
            $scope.modelValue[i] = {};
            $scope.modelValue[i]['@value'] = {
              '@id': m['@value'],
              label: m['rdfs:label']
            };
          });
        }
        else {
          $scope.modelValue = {};
          $scope.modelValue['@value'] = {
            '@id': $scope.model['@value'],
            label: $scope.model['rdfs:label']
          };
        }
      };

      // Initializes model for selection fields (checkbox, radio and list).
      $scope.initializeSelectionField = function () {
        var inputType = dms.getInputType($scope.field);
        if (dms.isMultiAnswer($scope.field)) {
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
      };

      $scope.isMultipleChoice = function(field) {
        return DataManipulationService.isMultipleChoice(field);
      };

      $scope.isMultiAnswer = function(field) {
        return DataManipulationService.isMultiAnswer(field);
      };

      $scope.setMultipleChoice = function(field, multipleChoice) {
        DataManipulationService.setMultipleChoice(field, multipleChoice);
      };

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
                $scope.hasValueConstraint()) {
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
      };

      // Sets the default @value for non-selection fields (i.e., text, paragraph, date, email, numeric, phone)
      $scope.setDefaultValueIfEmpty = function (m) {
        if (UIUtilService.isRuntime()) {
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
      };

      $scope.initializeValueRecommendationField = function () {
        var fieldValue = DataManipulationService.getValueLocation($scope.field);
        $scope.modelValueRecommendation = {};
        if ($scope.model) {
          if ($scope.model['rdfs:label']) {
            $scope.modelValueRecommendation.valueInfo = {
              'value'   : $scope.model['rdfs:label'],
              'valueUri': $scope.model[fieldValue]
            };
          }
          else {
            $scope.modelValueRecommendation.valueInfo = {
              'value': $scope.model[fieldValue]
            };
          }
        }
      };

      $scope.updateModelWhenChangeSelection = function (modelvr) {
        var fieldValue = dms.getValueLocation($scope.field);
        // This variable will be used at textfield.html
        $scope.modelValueRecommendation = modelvr;
        if (angular.isArray($scope.model)) {
          angular.forEach(modelvr, function (m, i) {
            if (m && m.valueInfo & m.valueInfo.value) {
              $scope.model[i][fieldValue] = m.valueInfo.value;
              if (m.valueInfo.valueUri) {
                $scope.model[i]['rdfs:label'] = m.valueInfo.valueUri;
              }
            } else {
              delete $scope.model[i][fieldValue];
            }
          });
        } else {
          if (modelvr.valueInfo.valueUri) {
            $scope.model[fieldValue] = modelvr.valueInfo.valueUri;
            $scope.model['rdfs:label'] = modelvr.valueInfo.value;
          }
          else {
            $scope.model[fieldValue] = modelvr.valueInfo.value;
            delete $scope.model['rdfs:label'];
          }
        }
      };

      $scope.setIsFirstRefresh = function (isFirstRefresh) {
        $scope.isFirstRefresh = isFirstRefresh;
      };

      $scope.updateModelWhenRefresh = function (select, modelvr) {
        var fieldValue = dms.getValueLocation($scope.field);
        if (!$scope.isFirstRefresh) {
          // Check that there are no controlled terms selected
          if (select.selected.valueUri == null) {
            if ($rootScope.isArray($scope.model)) {
              // TODO
            } else {
              // If the user entered a new value
              if (select.search != modelvr.valueInfo.value) {
                var modelValue;
                if (select.search == "" || select.search == undefined) {
                  modelValue = null;
                }
                else {
                  modelValue = select.search;
                }
                $scope.model[fieldValue] = modelValue;
                delete $scope.model['rdfs:label'];
                $scope.modelValueRecommendation.valueInfo.value = modelValue;
              }
            }
          }
        }
      };

      $scope.clearSearch = function (select) {
        select.search = '';
      };

      $scope.clearSelection = function ($event, select) {
        var fieldValue = dms.getValueLocation($scope.field);
        $event.stopPropagation();
        $scope.modelValueRecommendation = {
          valueInfo: {'value': null, 'valueUri': null},
        };
        select.selected = undefined;
        select.search = "";
        $scope.model[fieldValue] = dms.getDefaultValue(fieldValue, $scope.field);
        delete $scope.model['rdfs:label'];
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

      $scope.getRecommendationType = function (type) {
        if (type == 'CONTEXT_INDEPENDENT') {
          return '*';
        }
        else {
          return '';
        }
      };

      $scope.removeValueRecommendationField = function (field) {
        dms.removeValueRecommendationField(field);
      };

      /* end of Value Recommendation functionality */


      /* start of controlled terms functionality */

      $scope.addedFields = new Map();
      $scope.addedFieldKeys = [];

      // build a map with the added field controlled term id as the key and the details for that class as the value
      $scope.setAddedFieldMap = function () {

        var fields = dms.getFieldControlledTerms($scope.field);
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

      // get the class details from the server
      var setResponse = function (item, ontologyName, className) {

        // Get selected class details from the links.self endpoint provided.
        controlledTermDataService.getClassById(ontologyName, className).then(function (response) {
          $scope.addedFields.set(item, response);
        });
      };

      // get the ontology name from the addedFields map
      $scope.getOntologyName = function (item) {
        var result = "";
        if ($scope.addedFields && $scope.addedFields.has(item)) {
          result = $scope.addedFields.get(item).ontology;
        }
        return result;
      };

      // get the class description from the addedFields map
      $scope.getPrefLabel = function (item) {
        var result = "";
        if ($scope.addedFields && $scope.addedFields.has(item)) {
          result = $scope.addedFields.get(item).prefLabel;
        }
        return result;
      };

      // get the class description from the the addedFields map
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
        dms.deleteFieldControlledTerm(itemDataId, $scope.field);
        $scope.setAddedFieldMap();
      };

      $scope.parseOntologyCode = function (source) {
        return dms.parseOntologyCode(source);
      };

      $scope.parseOntologyName = function (dataItemsId) {
        return dms.parseOntologyName(dataItemsId);
      };

      $scope.deleteFieldAddedBranch = function (branch) {
        dms.deleteFieldAddedBranch(branch, $scope.field);
      };

      $scope.deleteFieldAddedClass = function (ontologyClass) {
        dms.deleteFieldAddedClass(ontologyClass, $scope.field);
      };

      $scope.deleteFieldAddedOntology = function (ontology) {
        dms.deleteFieldAddedOntology(ontology, $scope.field);
      };

      $scope.deleteFieldAddedValueSet = function (valueSet) {
        dms.deleteFieldAddedValueSet(valueSet, $scope.field);
      };

      $scope.getOntologyCode = function (ontology) {
        var ontologyDetails = controlledTermDataService.getOntologyByLdId(ontology);
      };

      /* end of controlled terms functionality */

    };

    return {
      templateUrl: 'scripts/form/field.directive.html',
      restrict   : 'EA',
      scope      : {
        fieldKey      : '=',
        field         : '=',
        parentElement : '=',
        model         : '=',
        renameChildKey: "=",
        preview       : "=",
        delete        : '&',
        isEditData    : "=",
        nested        : '='
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