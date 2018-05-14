'use strict';

define([
      'angular',
      'cedar/template-editor/service/cedar-user',
    ], function (angular) {
      angular.module('cedar.templateEditor.modal.cedarControlledTermsModalDirective', [
        'cedar.templateEditor.service.cedarUser'
      ]).directive('cedarControlledTermsModal', cedarControlledTermsModalDirective);

      cedarControlledTermsModalDirective.$inject = ['CedarUser', 'DataManipulationService'];

      function cedarControlledTermsModalDirective(CedarUser, DataManipulationService) {

        var directive = {
          bindToController: {
            modalVisible: '='
          },
          controller      : cedarControlledTermsModalDirective,
          controllerAs    : 'ctm',
          restrict        : 'E',
          templateUrl     : 'scripts/modal/cedar-controlled-terms-modal.directive.html'
        };

        return directive;

        cedarControlledTermsModalDirective.$inject = [
          '$scope',
          '$uibModal',
          '$rootScope',
          'CedarUser',
          '$timeout',
          '$translate',
          'resourceService',
          'UIMessageService',
          'UISettingsService',
          'CONST'
        ];

        function cedarControlledTermsModalDirective($scope, $uibModal, $rootScope, CedarUser, $timeout, $translate,
                                                    resourceService,
                                                    UIMessageService, UISettingsService,
                                                    CONST) {
          var vm = this;
          vm.switchScope = switchScope;
          vm.allowsProperty = allowsProperty;
          vm.allowsField = allowsField;
          vm.allowsValue = allowsValue;
          vm.isFieldPropertiesMode = isFieldPropertiesMode;
          vm.isFieldTypesMode = isFieldTypesMode;
          vm.isFieldValuesMode = isFieldValuesMode;
          vm.setFieldValuesMode = setFieldValuesMode;
          vm.setFieldPropertiesMode = setFieldPropertiesMode;
          vm.startOver = startOver;
          vm.addProperty = addProperty;
          vm.addClass = addClass;
          vm.dms = DataManipulationService;

          vm.model = {
            "field"                            : null,
            "salt"                             : null,
            "mode"                             : null,
            "scope"                            : null,
            "range"                            : [],
            "action"                           : null,
            "selectedClass"                    : null,
            "currentOntology"                  : null,
            "selections"                       : false,
            "view_tab"                         : null,
            "propertyUri"                      : null,
            "propertyLabel":null,
            "propertyDescription":null,
            "addPropertyUri":null,
            "stageValueConstraintAction"       : null,
            "stageOntologyClassValueConstraint": null,
            "stageBranchValueConstraint"       : null,
            "stageOntologyValueConstraint"     : null,
            "addedFieldItems"                  : []
          }
          ;


          // on modal close, scroll to the top the cheap way
          function hideModal() {
            document.getElementById('controlledTermsModalContent').scrollTop = 0;
            vm.modalVisible = false;
          };


          function switchScope(scope, action) {
            vm.model.action = action;
            $rootScope.$broadcast("cedar.templateEditor.controlledTerm.switchScope",
                [vm.model.scope, vm.model.action]);
          };

          function allowsProperty() {
            return vm.model.range && vm.model.range.includes("property");
          };

          function allowsField() {
            return vm.model.range && vm.model.range.includes("field");
          };

          function allowsValue() {
            return vm.model.range && vm.model.range.includes("value");
          };

          function isFieldPropertiesMode() {
            return vm.model.mode == 'property';
          };

          function isFieldTypesMode() {
            return vm.model.mode == 'field';
          };

          function isFieldValuesMode() {
            return vm.model.mode == 'value';
          };

          function setFieldPropertiesMode() {
            vm.model.mode = 'property';
            vm.model.scope = 'properties';
            vm.model.action = 'search';
          };

          function setFieldTypesMode() {
            vm.model.mode = 'field';
            vm.model.scope = 'classes';
            vm.model.action = 'search';
          };

          function setFieldValuesMode() {
            vm.model.mode = 'value';
            vm.model.scope = 'classes';
            vm.model.action = 'search';
          };

          function startOver() {
            vm.model.currentOntology = null;
            vm.model.selectedClass = null;
            vm.model.propertyUri = null;
            vm.model.propertyLabel = null;
            vm.model.propertyDescription = null;
          };

          function addProperty(property, label, definition, source, type) {
            vm.dms.updateProperty(property, label, definition, vm.dms.getId(vm.model.field), vm.model.parent);
          };

          function addPropertyUri() {
            console.log('addPropertyUri',vm.model.propertyUri);
            vm.dms.updateProperty(vm.model.propertyUri, vm.model.propertyLabel, vm.model.propertyDescription, vm.dms.getId(vm.model.field), vm.model.parent);
          }

          function addClass(selection, ontology) {
            console.log('addClass', selection, ontology);

            var mode = vm.model.mode;
            var label = selection.prefLabel;
            var definition = selection.definition;
            var type = selection.type;
            var fieldId = vm.dms.getId(vm.model.field);

            // has this selection been added yet?
            var alreadyAdded = false;
            for (var i = 0, len = vm.model.addedFieldItems.length; i < len; i += 1) {
              if (vm.model.addedFieldItems[i]['@id'] == selection['@id']) {
                alreadyAdded = true;
                break;
              }
            }

            if (alreadyAdded == false) {

              // do we have info about this ontology?
              if (!ontology.info) {
                ontology.info = {};
                ontology.info.name = ontology.details.ontology.name;
                ontology.info.id = ontology.details.ontology.acronym;
              }

              // get details from the service
              var ontologyDetails = controlledTermDataService.getOntologyByLdId(ontology.info.id);

              // add this new selection
              vm.model.addedFieldItems.push({
                prefLabel          : selection.prefLabel,
                ontologyDescription: ontology.info.name + " (" + ontology.info.id + ")",
                ontology           : ontology,
                class              : selection,
                "@id"              : selection["@id"]
              });

              /**
               * Add ontology type to JSON.
               */
              var properties = vm.dms.propertiesOf(vm.model.field);
              var selfUrl = controlledTermService.getSelfUrl(selection);
              //var selfUrl = selection['@id'];
              if (angular.isArray(properties['@type'].oneOf[0].enum)) {
                properties['@type'].oneOf[0].enum.push(selfUrl);
                properties['@type'].oneOf[1].items.enum.push(selfUrl);
              } else {
                properties['@type'].oneOf[0].enum = [selfUrl];
                properties['@type'].oneOf[1].items.enum = [selfUrl];
              }
            }

            // "mode", "classId", "classLabel", 'classDescription', "fieldId","classSource","classType"
            $rootScope.$broadcast('field:controlledTermAdded', [mode, classId, label, definition, fieldId, type]);

          };


          // modal open or closed
          $rootScope.$on('controlledTermsModalVisible', function (event, params) {


            var visible = params[0];
            var mode = params[1];
            var scope = params[2];
            var range = params[3];
            var action = params[4];
            var field = params[5];
            var parent = params[6];
            var salt = params[7];

            if (visible) {
              vm.modalVisible = true;
              vm.model.mode = mode;
              vm.model.scope = scope;
              vm.model.range = range;
              vm.model.action = action;
              vm.model.field = field;
              vm.model.parent = parent;
              vm.model.salt = salt;

              vm.model.selectedClass = null;
              vm.model.view_tab = 'search';
              vm.model.selections = null;
              vm.model.propertyUri = null;
              vm.model.propertyDescription = null;
              vm.model.propertyLabel = null;
              vm.model.addPropertyUri = addPropertyUri;
              vm.model.stageValueConstraintAction = null;
              vm.model.stageOntologyClassValueConstraint = null;
              vm.model.stageBranchValueConstraint = null;
              vm.model.stageOntologyValueConstraint = null;
              vm.model.addedFieldItems = [];

              console.log('controlledTermsModalVisible', vm.model);
            }
          });

        }
      }
    }
);
