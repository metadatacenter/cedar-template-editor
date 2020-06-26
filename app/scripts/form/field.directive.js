'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.form.fieldDirective', [])
      .directive('fieldDirective', fieldDirective);


  fieldDirective.$inject = ["$rootScope", "$sce", "$translate", "$filter",
    "SpreadsheetService", "CONST",
    "DataManipulationService", "schemaService", "FieldTypeService", "controlledTermDataService",
    "StringUtilsService", "UIUtilService", "ValidationService"];

  function fieldDirective($rootScope, $sce, $translate, $filter, SpreadsheetService, CONST,
                          DataManipulationService, schemaService,
                          FieldTypeService, controlledTermDataService, StringUtilsService, UIUtilService, ValidationService) {


    let linker = function ($scope, $element, attrs) {

      $scope.termsModalVisible = false;
      $scope.errorMessages = null;
      const tabSet = ["options", "values", "cardinality", "range", "required", "value-recommendation", "hidden", "field"];
      $scope.activeTab = null;
      $scope.viewType = 'table';
      $scope.uuid = DataManipulationService.generateTempGUID();
      $scope.isFirstRefresh = true;
      $scope.status = {
        isopen: false
      };
      $scope.numberTypes = [
        {id: "xsd:decimal", label: "Any numbers"},
        {id: "xsd:long", label: "Long integer numbers"},
        {id: "xsd:int", label: "Integer numbers"},
        {id: "xsd:double", label: "Double-precision real numbers"},
        {id: "xsd:float", label: "Single-precision real numbers"}
      ];

      $scope.dateTimeTypes = [
        {id: "xsd:dateTime", label: "DateTime"},
        {id: "xsd:date", label: "Date"},
        {id: "xsd:time", label: "Time"}
      ];

      $scope.datePrecisionFormats = [
        {id: "Day", label: "Day (YYYY-MM-DD)"},
        {id: "Month", label: "Month (YYYY-MM)"},
        {id: "Year", label: "Year (YYYY)"}
      ];

      $scope.timePrecisionFormats = [
        {id: "Second", label: "Second (hh:mm:ss)"},
        {id: "DecimalSecond", label: "DecimalSecond (hh:mm:ss.sss...s)"},
        {id: "Minute", label: "Minute (hh:mm)"},
        {id: "Hour", label: "Hour (hh)"}
      ];

      $scope.timeEnableTimezoneOptions = [
        {id: true, label: "Allow Timezone Information"},
        {id: false, label: "Do not allow Timezone Information"}
      ];

      $scope.timeEnableAmPmOptions = [
        {id: true, label: "Use AM/PM Input"},
        {id: false, label: "Use 24H Input"}
      ];

      let dms = DataManipulationService;


      //
      // model and ui support
      //

      $scope.isRuntime = function () {
        return UIUtilService.isRuntime();
      };

      //
      // schema service for template, element, and field access
      //

      $scope.getTitle = function () {
        return schemaService.getTitle($scope.field);
      };

      $scope.hasTitle = function () {
        return schemaService.hastTitle($scope.field);
      };

      $scope.getValueConstraint = function () {
        return schemaService.getValueConstraints($scope.field);
      };

      $scope.getValueConstraints = function () {
        return schemaService.getValueConstraints($scope.field);
      };

      // has value constraints?
      $scope.isConstrained = function () {
        return schemaService.isConstrained($scope.field);
      };

      $scope.isDraft = function () {
        return schemaService.isDraft($scope.field);
      };

      $scope.isPublished = function () {
        return schemaService.isPublished($scope.field);
      };

      $scope.hasVersion = function () {
        return schemaService.hasVersion($scope.field);
      };

      $scope.getVersion = function () {
        return schemaService.getVersion($scope.field);
      };

      $scope.isEditable = function () {
        return !schemaService.hasVersion($scope.field) || schemaService.isDraft($scope.field);
      };

      $scope.getHidden = function () {
        return schemaService.getHidden($scope.field);
      };

      $scope.allowsHidden = function () {
        return schemaService.allowsHidden($scope.field) && !dms.isRootNode($scope.parentElement, $scope.field);
      };

      // is this multiple cardinality?
      $scope.isHidden = function () {
        return schemaService.isHidden($scope.field);
      };

      // is this multiple cardinality?
      $scope.setHidden = function (value) {
        schemaService.setHidden($scope.field, value);
      };

      $scope.getIdentifier = function () {
        return schemaService.getIdentifier($scope.field);
      };


      $scope.isSelectable = function () {
        return !$scope.isNested();
      };

      $scope.isSortable = function () {
        return $scope.isSelectable();
      };


      $scope.isRootNode = function () {
        return dms.isRootNode($scope.parentElement, $scope.field);
      };


      $scope.isRoot = function () {
        return false;
      };

      $scope.isEditState = function () {
        return (UIUtilService.isEditState($scope.field));
      };

      $scope.isNested = function () {
        return $scope.nested;
      };

      $scope.getShortText = function (text, maxLength, finalString, emptyString) {
        return StringUtilsService.getShortText(text, maxLength, finalString, emptyString);
      };

      $scope.getShortId = function (uri, maxLength) {
        return StringUtilsService.getShortId(uri, maxLength);
      };


      // is this multiple cardinality?
      $scope.isMultiple = function () {
        return schemaService.isCardinalElement($scope.field);
      };

      // is this multiple cardinality?
      $scope.isCardinalElement = function () {
        return schemaService.isCardinalElement($scope.field);
      };

      // get the field icon
      $scope.getIconClass = function () {
        return FieldTypeService.getFieldIconClass(schemaService.getInputType($scope.field));
      };

      $scope.getCount = function () {
        const min = schemaService.getMinItems($scope.field) || 0;
        return new Array(Math.max(1, min));
      };

      $scope.getMinItems = function () {
        return schemaService.getMinItems($scope.field);
      };

      $scope.getMaxItems = function () {
        return schemaService.getMaxItems($scope.field);
      };

      // is this multiple cardinality?
      $scope.hasMin = function () {
        return $scope.field.hasOwnProperty('minItems');
      };

      $scope.isRequired = function () {
        return schemaService.isRequired($scope.field);
      };

      $scope.setRequired = function (value) {
        schemaService.setRequired($scope.field, value);
        if (value && $scope.isMultiple() && schemaService.getMinItems($scope.field) === 0) {
          $scope.field.minItems = 1;
        }
      };

      $scope.getDomId = function (node) {
        return dms.getDomId(node);
      };


      $scope.getPropertyDescription = function () {
        const descriptions = dms.getPropertyDescriptions($scope.parentElement);
        return descriptions ? descriptions[$scope.fieldKey] : false;
      };

      $scope.hasPropertyDescription = function () {
        const descriptions = dms.getPropertyDescriptions($scope.parentElement);
        return descriptions && descriptions[$scope.fieldKey] && descriptions[$scope.fieldKey].length > 0;
      };

      $scope.getDescription = function () {
        return schemaService.getDescription($scope.field);
      };

      $scope.hasMinLength = function () {
        return schemaService.hasMinLength($scope.field);
      };

      $scope.getMinLength = function () {
        return schemaService.getMinLength($scope.field);
      };

      $scope.hasMaxLength = function () {
        return schemaService.hasMaxLength($scope.field);
      };

      $scope.getMaxLength = function () {
        return schemaService.getMaxLength($scope.field);
      };

      $scope.hasDescription = function () {
        return schemaService.hasDescription($scope.field);
      };

      $scope.getLabel = function () {
        return $scope.getTitle() || $scope.getPropertyLabel();
      };

      $scope.getHelp = function () {
        return $scope.getPropertyDescription() || $scope.getDescription();
      };

      $scope.hasHelp = function () {
        return $scope.hasDescription() || $scope.hasPropertyDescription();
      };

      $scope.hasValueConstraint = function () {
        return schemaService.hasValueConstraints($scope.field);
      };

      $scope.isNumericField = function () {
        return schemaService.isNumericField($scope.field);
      };

      $scope.isTextField = function () {
        return schemaService.isTextFieldType($scope.field);
      };

      $scope.isTemporalField = function () {
        return schemaService.isTemporalType($scope.field);
      };

      $scope.hasTimeComponent = function () {
        return schemaService.hasTimeComponent($scope.field);
      };

      $scope.hasDateComponent = function () {
        return schemaService.hasDateComponent($scope.field);
      };

      $scope.hasOptions = function () {
        return $scope.isNumericField() || $scope.isTextField() || $scope.isTemporalField();
      };

      $scope.canViewTerms = function () {
        const allowed = $scope.allowsControlledTerms();
        const noVersion = !$scope.hasVersion();
        const versionAndTermsOrRoot = $scope.hasVersion() && ($scope.hasValueConstraint() || $scope.isRootNode());
        return allowed && (noVersion || versionAndTermsOrRoot);
      };

      $scope.canAddTerms = function () {
        const noVersion = !$scope.hasVersion();
        const draftAndRoot = $scope.isDraft() && $scope.isRootNode();
        return noVersion || draftAndRoot;
      };

      $scope.getLiterals = function () {
        return schemaService.getLiterals($scope.field);
      };

      // default the cardinality to 1..N
      $scope.defaultMinMax = function () {
        schemaService.defaultMinMax($scope.field);
      };

      // clear any current cardinality
      $scope.clearMinMax = function () {
        schemaService.clearMinMax($scope.field);
      };

      // is this a static field?
      $scope.isStatic = function () {
        return FieldTypeService.isStaticField(schemaService.getInputType($scope.field));
      };

      $scope.getContent = function (field) {
        return dms.getContent(field || $scope.field);
      };

      $scope.getUnescapedContent = function (field) {
        return dms.getContent(field || $scope.field);
      };

      $scope.setDirty = function () {
        UIUtilService.setDirty(true);
      };

      // check for delete;  we should have a parentElement
      $scope.ckDelete = function () {
        if ($scope.parentElement) {
          $scope.setDirty();

          if (dms.isRootNode($scope.parentElement, $scope.field)) {
            $rootScope.$broadcast("form:clear");

          } else {
            dms.removeChild($scope.parentElement, $scope.field, $scope.fieldKey);
            ValidationService.checkValidation();
            $scope.$emit("invalidElementState", ["remove", dms.getTitle($scope.field), dms.getId($scope.field)]);
          }
        }
      };

      // try to select this field
      $scope.canSelect = function (select) {
        let result = select;
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
      $scope.allowsRequired = function () {
        const result = FieldTypeService.getFieldTypes().filter(function (obj) {
          return obj.cedarType === schemaService.getInputType($scope.field);
        });
        return result.length > 0 && result[0].allowsRequired && !dms.isRootNode($scope.parentElement, $scope.field);
      };

      // does this field allow multiple cardinality?
      $scope.allowsMultiple = function () {
        const result = FieldTypeService.getFieldTypes().filter(function (obj) {
          return obj.cedarType === schemaService.getInputType($scope.field);
        });
        return result.length > 0 && result[0].allowsMultiple && !dms.isRootNode($scope.parentElement, $scope.field);
      };

      // does the field support value recommendation?
      $scope.allowsValueRecommendation = function () {
        const result = FieldTypeService.getFieldTypes().filter(function (obj) {
          return obj.cedarType === schemaService.getInputType($scope.field);
        });
        return result.length > 0 && result[0].allowsValueRecommendation;
      };

      // does the field support using controlled terms
      $scope.allowsControlledTerms = function () {
        const result = FieldTypeService.getFieldTypes().filter(function (obj) {
          return obj.cedarType === schemaService.getInputType($scope.field);
        });
        return result.length > 0 && result[0].hasControlledTerms;
      };

      $scope.hasValueConstraint = function () {
        return dms.hasValueConstraint($scope.field);
      };

      // for now, turn this option off. does the field support using instance type term
      $scope.hasInstanceType = function () {
        // var result = FieldTypeService.getFieldTypes().filter(function (obj) {
        //   return obj.cedarType == schemaService.getInputType($scope.field);
        // });
        // return result.length > 0 && result[0].hasInstanceTerm;
        return false;
      };

      // does the field support using instance type term
      $scope.getInstanceType = function () {
        return dms.getFieldControlledTerms($scope.field);
      };

      // Retrieve appropriate field templates
      $scope.getTemplateUrl = function () {
        return 'scripts/form/field-' + $scope.directory + '/' + schemaService.getInputType(
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
        const maxItems = schemaService.getMaxItems($scope.field);
        if ((!maxItems || $scope.model.length < maxItems)) {
          $scope.model.push({'@value': null});
          $scope.setDirty();
        }
      };

      $scope.removeInput = function (index) {
        const minItems = schemaService.getMinItems($scope.field) || 0;
        if ($scope.model.length > minItems) {
          $scope.model.splice(index, 1);
          $scope.setDirty();
        }
      };

      $scope.relabelField = function (newTitle) {
        dms.relabelField($scope.getForm(), $scope.fieldKey, newTitle);
      };

      //
      // controlled terms modal
      //


      // create an id for the controlled terms modal
      $scope.getModalId = function (type) {
        return UIUtilService.getModalId(dms.getId($scope.field), type);
      };

      $scope.getId = function () {
        return dms.getId($scope.field);
      };


      //
      // watchers
      //

      // watch for this field's deselect
      $scope.$on('deselect', function (event, args) {

        let field = args[0];
        let errors = args[1];

        if (field === $scope.field) {
          $scope.errorMessages = errors;
          if ($scope.errorMessages.length === 0) parseField();
        }
      });

      // update schema title and description if necessary
      $scope.$watch("field", function (newField, oldField) {

        // set the schema title for the field with autogenerated values
        if (dms.getTitle(newField) !== dms.getTitle(oldField)) {
          schemaService.setFieldSchemaTitleAndDescription(newField, dms.getTitle(newField));
        }

        $scope.fieldSchema = dms.schemaOf($scope.field);

        setDirectory();
      }, true);

      // Used just for text fields whose values have been constrained using controlled terms
      $scope.$watch("model", function () {


        $scope.addOption = function () {
          return (dms.addOption($scope.field));
        };

      }, true);

      // Used to update schema:name when the field label (stored in propertyLabels) changes
      $scope.$watch("fieldLabel[fieldLabelKey]", function () {
        if (!angular.isUndefined($scope.fieldLabelKey) && !angular.isUndefined(
            $scope.fieldLabel[$scope.fieldLabelKey])) {
          if ($scope.isEditable()) {
            dms.setTitle($scope.field, $scope.fieldLabel[$scope.fieldLabelKey]);
          }
        }
      }, true);

      // Used to update schema:description when the field description (stored in propertyDescriptions) changes
      $scope.$watch("fieldDescription[fieldDescriptionKey]", function () {
        if (!angular.isUndefined($scope.fieldDescriptionKey) && !angular.isUndefined(
            $scope.fieldDescription) && !angular.isUndefined($scope.fieldDescription[$scope.fieldDescriptionKey])) {
          if ($scope.isEditable()) {
            dms.setDescription($scope.field, $scope.fieldDescription[$scope.fieldDescriptionKey]);
          }
        }
      }, true);

      $scope.isFirstLevel = function () {
        return ($scope.$parent.directiveName === 'form');
      };

      // try to deselect the field if it is active
      $scope.$on("saveForm", function () {
        //console.log('on saveForm', $scope.isFirstLevel());
        //update keys to new titles if necessary
        // if ($scope.isFirstLevel()) {
        //   $scope.relabelField($scope.getTitle());
        // }

        const action = $scope.isEditState() && !$scope.canDeselect($scope.field) ? 'add' : 'remove';
        $scope.$emit("invalidFieldState",
            [action, dms.getTitle($scope.field), dms.getId($scope.field)]);
      });

      //
      // initialization
      //

      const setDirectory = function () {
        const schema = dms.schemaOf($scope.field);
        const state = schema._tmp && schema._tmp.state || "completed";
        if ((state === "creating") && !$scope.preview && !UIUtilService.isRuntime()) {
          $scope.directory = "create";
        } else {
          $scope.directory = "render";
        }
      };
      setDirectory();

      //var field = dms.schemaOf($scope.field);

      // Checking each field to see if required, will trigger flag for use to see there is required fields
      if ($scope.hasValueConstraint() && schemaService.isRequired($scope.field)) {
        $scope.$emit('formHasRequiredfield._uis');
      }

      // Load values when opening an instance
      if ($scope.model) {
        const fieldValue = dms.getValueLocation($scope.field);
        $scope.modelValueRecommendation = {valueInfo: {'value': $scope.model[fieldValue]}}
      }

      const parseField = function () {
        //console.log("**ParseField")
        if ($scope.field) {
          const min = schemaService.getMinItems($scope.field) || 0;
          if (!schemaService.isCardinalElement($scope.field)) {
            $scope.model = {};
          } else {
            $scope.model = [];
            for (let i = 0; i < min; i++) {
              const obj = {};
              $scope.model.push(obj);
            }
          }
        }
      };


      // If selectedByDefault is false, it is removed from the model
      $scope.cleanSelectedByDefault = function (index) {
        const literals = dms.getLiterals($scope.field);
        if (literals[index].selectedByDefault === false) {
          delete literals[index].selectedByDefault;
        }
      };

      // Sets the default options for the 'radio' button based on the options selected at the UI
      $scope.radioModelToDefaultOptions = function (index) {
        const literals = dms.getLiterals($scope.field);
        for (let i = 0; i < literals.length; i++) {
          if (i !== index) {
            delete literals[i].selectedByDefault;
          }
        }
      };

      // Sets UI selections based on the default options
      $scope.defaultOptionsToUI = function () {
        if (schemaService.isMultiAnswer($scope.field)) {
          const literals = dms.getLiterals($scope.field);
          if (schemaService.isCheckboxType($scope.field)) {
            $scope.optionsUI = {};
            for (let i = 0; i < literals.length; i++) {
              let literal = literals[i];
              if (literal.selectedByDefault === true) {
                $scope.optionsUI[literal.label] = true;
              } else {
                $scope.optionsUI[literal.label] = false;
              }
            }
          } else if (schemaService.isRadioType($scope.field)) {
            $scope.optionsUI = {option: null};
            for (let i = 0; i < literals.length; i++) {
              let literal = literals[i];
              if (literal.selectedByDefault === true) {
                $scope.optionsUI.option = literal.label;
              }
            }
          } else if (schemaService.isListType($scope.field)) {
            // We use an object here instead of a primitive to ensure two-way data binding with the UI element (ng-model)
            $scope.optionsUI = {options: []};
            for (let i = 0; i < literals.length; i++) {
              let literal = literals[i];
              if (literal.selectedByDefault === true) {
                $scope.optionsUI.options.push(literal.label);
              }
            }
          }
        }
      };

      // Sets the number type based on the item stored at the model
      $scope.setNumberTypeFromModel = function () {
        let schema = dms.schemaOf($scope.field);
        if (schema._valueConstraints) {
          let typeId = schema._valueConstraints.numberType;
          if (!typeId) {
            typeId = "xsd:decimal";
            schema._valueConstraints.numberType = typeId;
          }
          const getNumericLabel = function (id) {
            for (let i = 0; i < $scope.numberTypes.length; i++) {
              const type = $scope.numberTypes[i];
              if (type.id === id) {
                return type.label;
              }
            }
          };
          $scope.selectedNumberType = {
            id   : typeId,
            label: getNumericLabel(typeId)
          }
        }
      };

      // Sets the number type based on the item selected at the UI
      $scope.setNumberTypeFromUI = function (item) {
        dms.schemaOf($scope.field)._valueConstraints.numberType = item.id;
      };

      // Sets the dateTime type based on the item stored at the model
      $scope.setDateTimeTypeFromModel = function () {
        let schema = dms.schemaOf($scope.field);
        if (schema._valueConstraints) {
          let typeId = schema._valueConstraints.temporalType;
          if (!typeId) {
            typeId = "xsd:dateTime";
            schema._valueConstraints.temporalType = typeId;
          }
          const getDateTimeLabel = function (id) {
            for (let i = 0; i < $scope.dateTimeTypes.length; i++) {
              const type = $scope.dateTimeTypes[i];
              if (type.id === id) {
                return type.label;
              }
            }
          };
          $scope.selectedDateTimeType = {
            id   : typeId,
            label: getDateTimeLabel(typeId)
          }
        }
      };

      // Sets the date precision format based on the item stored at the model
      $scope.setDatePrecisionFormatFromModel = function () {
        let schema = dms.schemaOf($scope.field);
        if (schema._valueConstraints) {
          let typeId = schema._valueConstraints.xsdDateFinestGranularity;
          if (!typeId) {
            typeId = "Day";
            schema._valueConstraints.xsdDateFinestGranularity = typeId;
          }
          const getDatePrecisionFormatLabel = function (id) {
            for (let i = 0; i < $scope.datePrecisionFormats.length; i++) {
              const type = $scope.datePrecisionFormats[i];
              if (type.id === id) {
                return type.label;
              }
            }
          };
          $scope.selectedDatePrecisionFormat = {
            id   : typeId,
            label: getDatePrecisionFormatLabel(typeId)
          }
        }
      };

      // Sets the time precision format based on the item stored at the model
      $scope.setTimePrecisionFormatFromModel = function () {
        let schema = dms.schemaOf($scope.field);
        if (schema._valueConstraints) {
          let typeId = schema._valueConstraints.xsdTimeFinestGranularity;
          if (!typeId) {
            typeId = "Second";
            schema._valueConstraints.xsdTimeFinestGranularity = typeId;
          }
          const getTimePrecisionFormatLabel = function (id) {
            for (let i = 0; i < $scope.timePrecisionFormats.length; i++) {
              const type = $scope.timePrecisionFormats[i];
              if (type.id === id) {
                return type.label;
              }
            }
          };
          $scope.selectedTimePrecisionFormat = {
            id   : typeId,
            label: getTimePrecisionFormatLabel(typeId)
          }
        }
      };

      // Sets the timezone enable based on the item stored at the model
      $scope.setTimeEnableTimezoneFromModel = function () {
        let schema = dms.schemaOf($scope.field);
        if (schema._valueConstraints) {
          let typeId = schema._valueConstraints.xsdTimeZoneEnable;
          if (typeof typeId === "undefined") {
            typeId = true;
            schema._valueConstraints.xsdTimeZoneEnable = typeId;
          }
          const getTimeEnableTimezoneLabel = function (id) {
            for (let i = 0; i < $scope.timeEnableTimezoneOptions.length; i++) {
              const type = $scope.timeEnableTimezoneOptions[i];
              if (type.id === id) {
                return type.label;
              }
            }
          };
          $scope.selectedTimeEnableTimezone = {
            id   : typeId,
            label: getTimeEnableTimezoneLabel(typeId)
          }
        }
      };

      // Sets the ampm enable based on the item stored at the model
      $scope.setTimeEnableAmPmFromModel = function () {
        let schema = dms.schemaOf($scope.field);
        if (schema._valueConstraints) {
          let typeId = schema._ui.inputTimeDisplayAmPm;
          if (typeof typeId === "undefined") {
            typeId = true;
            schema._ui.inputTimeDisplayAmPm = typeId;
          }
          const getTimeEnableAmPmLabel = function (id) {
            for (let i = 0; i < $scope.timeEnableAmPmOptions.length; i++) {
              const type = $scope.timeEnableAmPmOptions[i];
              if (type.id === id) {
                return type.label;
              }
            }
          };
          $scope.selectedTimeEnableAmPm = {
            id   : typeId,
            label: getTimeEnableAmPmLabel(typeId)
          }
        }
      };

      // Sets the dateTime type based on the item selected at the UI
      $scope.setDateTimeTypeFromUI = function (item) {
        dms.schemaOf($scope.field)._valueConstraints.temporalType = item.id;
        $scope.cleanupExtraSchemaKeys();
      };

      // Sets the date precision format based on the item selected at the UI
      $scope.setDatePrecisionFormatFromUI = function (item) {
        dms.schemaOf($scope.field)._valueConstraints.xsdDateFinestGranularity = item.id;
        $scope.cleanupExtraSchemaKeys();
      };

      // Sets the time precision format based on the item selected at the UI
      $scope.setTimePrecisionFormatFromUI = function (item) {
        dms.schemaOf($scope.field)._valueConstraints.xsdTimeFinestGranularity = item.id;
        $scope.cleanupExtraSchemaKeys();
      };

      $scope.cleanupExtraSchemaKeys = function(item) {
        if (!$scope.hasTimeComponent($scope.field)) {
          let schema = dms.schemaOf($scope.field);
          delete schema._valueConstraints.xsdTimeFinestGranularity;
          delete schema._valueConstraints.xsdTimeZoneEnable;
          delete schema._ui.inputTimeDisplayAmPm;
        }
        if (!$scope.hasDateComponent($scope.field)) {
          let schema = dms.schemaOf($scope.field);
          delete schema._valueConstraints.xsdDateFinestGranularity;
        }
      };

      // Sets the time enable microseconds based on the item selected at the UI
      $scope.setTimeEnableTimezoneFromUI = function (item) {
        dms.schemaOf($scope.field)._valueConstraints.xsdTimeZoneEnable = item.id;
      };

      // Sets the time enable microseconds based on the item selected at the UI
      $scope.setTimeEnableAmPmFromUI = function (item) {
        dms.schemaOf($scope.field)._ui.inputTimeDisplayAmPm = item.id;
      };

      // Sets the instance @value fields based on the options selected at the UI
      $scope.updateModelFromUI = function () {


        if (!$scope.model || !angular.isArray($scope.model)) {
          $scope.model = [];
        } else {
          // Remove all elements from the 'model' array. Note that using $scope.model = []
          // is dangerous because we have references to the original array
          $scope.model.splice(0, $scope.model.length);
        }
        if (schemaService.isCheckboxType($scope.field)) {
          for (const option in $scope.optionsUI) {
            if ($scope.optionsUI[option] === true) {
              $scope.model.push({'@value': option});
            }
          }
        } else if (schemaService.isRadioType($scope.field)) {
          // If 'updateModelFromUI' was invoked from the UI (option is not null)
          if ($scope.optionsUI.option != null) {
            $scope.model.push({'@value': $scope.optionsUI.option});
          }
        } else if (schemaService.isListType($scope.field)) {
          // Update model
          for (let i = 0; i < $scope.optionsUI.options.length; i++) {
            $scope.model.push({'@value': $scope.optionsUI.options[i]});
          }
        }
        // Default value
        if ($scope.model.length === 0) {
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
                  "@value"    : m['@value']['@id'],
                  "rdfs:label": m['@value'].label
                };
              }
            });
          } else {
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
        var inputType = schemaService.getInputType($scope.field);
        if (inputType === 'checkbox') {
          $scope.optionsUI = {};
          for (const item in $scope.model) {
            const valueLabel = $scope.model[item]['@value'];
            $scope.optionsUI[valueLabel] = true;
          }
        } else if (inputType === 'radio') {
          $scope.optionsUI = {option: null};
          // Note that for this element only one selected option is possible
          if ($scope.model[0]['@value'] != null) {
            $scope.optionsUI.option = $scope.model[0]['@value'];
          }
        } else if (inputType === 'list') {
          $scope.optionsUI = {options: []};
          for (const item in $scope.model) {
            const valueLabel = $scope.model[item]['@value'];
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
        } else {
          $scope.modelValue = {};
          $scope.modelValue['@value'] = {
            '@id': $scope.model['@value'],
            label: $scope.model['rdfs:label']
          };
        }
      };

      // Initializes model for selection fields (checkbox, radio and list).
      $scope.initializeSelectionField = function () {
        const inputType = schemaService.getInputType($scope.field);
        if (schemaService.isMultiAnswer($scope.field)) {
          // If we are populating a template, we need to initialize the model with the default values (if they exist)
          // Note that $scope.isEditData = false means that we are populating the template
          if ($scope.isEditData === null || $scope.isEditData === false) {
            $scope.defaultOptionsToUI();
            $scope.updateModelFromUI();
          }
          // If we are editing an instance we need to load the values stored into the model
          else {
            $scope.updateUIFromModel();
          }
        }
      };

      $scope.isMultipleChoice = function (field) {
        return schemaService.isMultipleChoice(field);
      };

      $scope.isMultiAnswer = function (field) {
        return schemaService.isMultiAnswer(field);
      };

      $scope.isCheckboxListRadio = function () {
        return schemaService.isCheckboxListRadio($scope.field);
      };

      // $scope.setMultipleChoice = function (field, multipleChoice) {
      //   dms.setMultipleChoice(field, multipleChoice);
      // };

      $scope.setMultipleChoice = function (field, multipleChoice) {
        if (!dms.isRootNode($scope.parentElement, field)) {
          schemaService.setMultipleChoice(field, multipleChoice);
        } else if (schemaService.isListType(field) || schemaService.isCheckboxType(field)) {
          field._valueConstraints.multipleChoice = multipleChoice;
        }
      };

      // Initializes model for fields constrained using controlled terms
      $scope.initializeControlledField = function () {
        // If modelValue has not been initialized
        if (!$scope.modelValue) {
          let isMultiple = false;
          if ($scope.field.items) {
            isMultiple = true;
          }
          if ($scope.directory === "render") {
            if ($rootScope.schemaOf($scope.field)._ui.inputType === "textfield" && $scope.hasValueConstraint()) {
              // We are populating the template
              if ($scope.isEditData == null || $scope.isEditData === false) {
                if (isMultiple) {
                  $scope.modelValue = []
                } else {
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

      // // Sets the default @value for non-selection fields (i.e., text, paragraph, date, email, numeric, phone)
      // $scope.setDefaultValueIfEmpty = function (m) {
      //   console.log('setDefaultValueIfEmpty',UIUtilService.isRuntime())
      //   if (UIUtilService.isRuntime()) {
      //     if (!$rootScope.isArray(m)) {
      //       if (!m) {
      //         m = {};
      //       }
      //       if (m.hasOwnProperty('@value')) {
      //         // If empty string
      //         if ((m['@value'] != null) && (m['@value'].length == 0)) {
      //           m['@value'] = null;
      //         }
      //       }
      //       else {
      //         m['@value'] = null;
      //       }
      //     }
      //     else {
      //       for (var i = 0; i < m.length; i++) {
      //         $scope.setDefaultValueIfEmpty(m[i]);
      //       }
      //     }
      //   }
      // };

      $scope.initializeValueRecommendationField = function () {
        const fieldValue = dms.getValueLocation($scope.field);
        $scope.modelValueRecommendation = {};
        if ($scope.model) {
          if ($scope.model['rdfs:label']) {
            $scope.modelValueRecommendation.valueInfo = {
              'value'   : $scope.model['rdfs:label'],
              'valueUri': $scope.model[fieldValue]
            };
          } else {
            $scope.modelValueRecommendation.valueInfo = {
              'value': $scope.model[fieldValue]
            };
          }
        }
      };

      $scope.updateModelWhenChangeSelection = function (modelvr) {
        const fieldValue = dms.getValueLocation($scope.field);
        // This variable will be used at textfield.html
        $scope.modelValueRecommendation = modelvr;
        if (angular.isArray($scope.model)) {
          angular.forEach(modelvr, function (m, i) {
            if (m && m.valueInfo && m.valueInfo.value) {
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
          } else {
            $scope.model[fieldValue] = modelvr.valueInfo.value;
            delete $scope.model['rdfs:label'];
          }
        }
      };

      $scope.setIsFirstRefresh = function (isFirstRefresh) {
        $scope.isFirstRefresh = isFirstRefresh;
      };

      $scope.updateModelWhenRefresh = function (select, modelvr) {
        const fieldValue = dms.getValueLocation($scope.field);
        if (!$scope.isFirstRefresh) {
          // Check that there are no controlled terms selected
          if (select.selected.valueUri == null) {
            if ($rootScope.isArray($scope.model)) {
              // TODO
            } else {
              // If the user entered a new value
              if (select.search !== modelvr.valueInfo.value) {
                let modelValue;
                if (select.search === "" || select.search === undefined) {
                  modelValue = null;
                } else {
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
        const fieldValue = dms.getValueLocation($scope.field);
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
        const s = Math.floor(score * 100);
        if (s < 1) {
          return "<1%";
        } else {
          return s.toString() + "%";
        }
      };

      $scope.getRecommendationType = function (type) {
        if (type === 'CONTEXT_INDEPENDENT') {
          return '*';
        } else {
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

        let fields = dms.getFieldControlledTerms($scope.field);
        if (fields) {

          // create a new map to avoid any duplicates coming from the modal
          let myMap = new Map();

          // move the keys into the new map
          for (let i = 0; i < fields.length; i++) {
            const key = fields[i];
            if (myMap.has(key)) {

              // here is a duplicate, so delete it
              dms.deleteFieldControlledTerm(key, $scope.field);
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
            if (myMap.get(key) === "") {
              setResponse(key, dms.parseOntologyName(key),
                  dms.parseClassLabel(key));
            }
          }, myMap);


          // fill up the key array
          $scope.addedFieldKeys = [];
          myMap.forEach(function (value, key) {
            $scope.addedFieldKeys.push(key);
          }, myMap);

          // hang on to the new map
          $scope.addedFields = myMap;

        } else {
          // If there are no controlled terms for the field type defined in the model, the map will be empty
          $scope.addedFields = new Map();
          $scope.addedFieldKeys = [];
        }
      };

      // get the class details from the server
      const setResponse = function (item, ontologyName, className) {

        // Get selected class details from the links.self endpoint provided.
        controlledTermDataService.getClassById(ontologyName, className).then(function (response) {
          $scope.addedFields.set(item, response);
        });
      };

      // get the ontology name from the addedFields map
      $scope.getOntologyName = function (item) {
        let result = "";
        if ($scope.addedFields && $scope.addedFields.has(item)) {
          result = $scope.addedFields.get(item).ontology;
        }
        return result;
      };

      // get the class description from the addedFields map
      $scope.getPrefLabel = function (item) {
        let result = "";
        if ($scope.addedFields && $scope.addedFields.has(item)) {
          result = $scope.addedFields.get(item).prefLabel;
        }
        return result;
      };

      // get the class description from the the addedFields map
      $scope.getClassDescription = function (item) {
        let result = "";
        if ($scope.addedFields && $scope.addedFields.has(item)) {
          if ($scope.addedFields.get(item).definitions && $scope.addedFields.get(item).definitions.length > 0) {
            result = $scope.addedFields.get(item).definitions[0];
          }
        }
        return result;
      };

      $scope.getClassId = function (item) {
        let result = "";
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

      // $scope.getOntologyCode = function (ontology) {
      //   const ontologyDetails = controlledTermDataService.getOntologyByLdId(ontology);
      // };

      $scope.getPropertyLabel = function () {
        const labels = dms.getPropertyLabels($scope.parentElement);
        return (labels && labels[$scope.fieldKey]) ? labels[$scope.fieldKey] : '';
      };

      // $scope.getLabel = function () {
      //   return $scope.getPropertyLabel() || $scope.getTitle();
      // };

      $scope.getPreferredLabel = function (field) {
        return dms.getPreferredLabel(field || $scope.field);
      };

      $scope.getLabel = function () {
        return $scope.getPreferredLabel() || $scope.getPropertyLabel() || $scope.getTitle();
      };

      $scope.getPropertyDescription = function () {
        const descriptions = dms.getPropertyDescriptions($scope.parentElement);
        return descriptions && descriptions[$scope.fieldKey];
      };

      $scope.getPropertyId = function () {
        return dms.getPropertyId($scope.parentElement, $scope.field);
      };

      $scope.hasPropertyId = function () {
        return dms.getPropertyId($scope.parentElement, $scope.field).length > 0;
      };

      $scope.deleteProperty = function () {
        dms.deletePropertyId($scope.parentElement, $scope.field);
        dms.updateProperty('', '', '', $scope.getId(), $scope.parentElement);
      };


      // show the controlled terms modal
      $scope.showModalReadOnly = function (type, searchScope, termType, term) {
        let q = term.prefLabel || term.name;
        if (searchScope === 'value-sets') {
          q = term.uri.substr(term.uri.lastIndexOf('/') + 1);
        }
        const source = term.acronym || term.source;
        const options = {
          "filterSelection": type,
          "searchScope"    : searchScope,
          "modalId"        : "controlled-term-modal",
          "model"          : $scope.field,
          "id"             : $scope.getId(),
          'q'              : q,
          'source'         : source,
          'termType'       : termType,
          'term'           : term,
          "advanced"       : true,
          "permission"     : ["read"]
        };
        UIUtilService.showModal(options);
      };


      // show the controlled terms modal
      $scope.showModal = function (type, searchScope) {
        const options = {
          "filterSelection": type,
          "searchScope"    : searchScope,
          "modalId"        : "controlled-term-modal",
          "model"          : $scope.field,
          "id"             : $scope.getId(),
          "q"              : $scope.getLabel(),
          'source'         : null,
          'termType'       : null,
          'term'           : null,
          "advanced"       : false,
          "permission"     : ["read", "write"]
        };
        UIUtilService.showModal(options);
      };

      // show the controlled terms modal
      $scope.hideModal = function () {
        UIUtilService.hideModal();
      };

      // controlled terms modal has an outcome
      $scope.$on("field:controlledTermAdded", function (event, args) {
        if ($scope.getId() === args[1]) {
          UIUtilService.hideModal(args);
          UIUtilService.setDirty(true);
          $scope.setAddedFieldMap();
        }
      });


      // update the property for a field with controlled terms modal selection
      $scope.$on("property:propertyAdded", function (event, args) {
        if ($scope.getId() === args[1]) {
          UIUtilService.hideModal();
          const id = args[1];
          const propertyId = args[0];
          const propertyLabel = args[2];
          const propertyDescription = args[3];
          dms.updateProperty(propertyId, propertyLabel, propertyDescription, id, $scope.parentElement);
        }
      });


      // open the terms modal
      $scope.showTermsModal = function () {
        $scope.termsModalVisible = true;
        $rootScope.$broadcast('termsModalVisible', [$scope.termsModalVisible, $scope.field]);
      };


      /* end of controlled terms functionality */

      //
      // init
      //

      $scope.$watch('fieldSchema["skos:prefLabel"]', function (prefLabel) {
        if (prefLabel == '') {
          dms.removePreferredLabel($scope.field);
        }
      });

      $scope.init = function () {

        $scope.fieldSchema = dms.schemaOf($scope.field);
        if (dms.isRootNode($scope.parentElement, $scope.field)) {
          $scope.fieldLabelKey = CONST.model.NAME;
          $scope.fieldDescriptionKey = CONST.model.DESCRIPTION;
          $scope.fieldLabel = $scope.field;
          $scope.fieldDescription = $scope.field;

        } else {
          $scope.fieldLabelKey = $scope.fieldKey;
          $scope.fieldDescriptionKey = $scope.fieldKey;
          $scope.fieldLabel = dms.getPropertyLabels($scope.parentElement);
          $scope.fieldDescription = dms.getPropertyDescriptions($scope.parentElement);
        }

      };

      $scope.init();
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
        const addPopover = function () {
          //Initializing Bootstrap Popover fn for each item loaded
          setTimeout(function () {
            if ($element.find('#field-value-tooltip').length > 0) {
              $element.find('#field-value-tooltip').popover();
            } else if ($element.find('[data-toggle="popover"]').length > 0) {
              $element.find('[data-toggle="popover"]').popover();
            }
          }, 1000);
        };

        //addPopover($scope);

      },
      replace    : true,
      link       : linker
    };

  }

});