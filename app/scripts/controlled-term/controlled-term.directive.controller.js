'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.controlledTerm.controlledTermDirectiveController', [])
      .controller('controlledTermDirectiveController', controlledTermDirectiveController);

  controlledTermDirectiveController.$inject = [
    '$element',
    '$http',
    '$q',
    '$rootScope',
    '$scope',
    '$timeout',
    'controlledTermDataService',
    'controlledTermService',
    'provisionalClassService',
    'DataManipulationService'
  ];

  /**
   * Controller for the functionality of adding controlled terms to fields and elements.
   */
  function controlledTermDirectiveController($element, $http, $q, $rootScope, $scope, $timeout,
                                             controlledTermDataService, controlledTermService, provisionalClassService,
                                             DataManipulationService) {
    var vm = this;


    vm.setInitialFieldConstraints = setInitialFieldConstraints;
    vm.addBranchToValueConstraint = addBranchToValueConstraint;
    vm.addClass = addClass;
    vm.addProperty = addProperty;
    vm.addedFieldItems = [];
    vm.addOntologyClassesToValueConstraint = addOntologyClassesToValueConstraint;
    vm.addOntologyClassToValueConstraint = addOntologyClassToValueConstraint;
    vm.addOntologyToValueConstraint = addOntologyToValueConstraint;
    vm.addValueConstraint = addValueConstraint;
    vm.addValueSetToValueConstraint = addValueSetToValueConstraint;
    vm.currentOntology = null;
    vm.currentValueSet = null;
    vm.deleteFieldAddedBranch = deleteFieldAddedBranch;
    vm.deleteFieldAddedClass = deleteFieldAddedClass;
    vm.deleteFieldAddedItem = deleteFieldAddedItem;
    vm.deleteFieldAddedOntology = deleteFieldAddedOntology;
    vm.deleteFieldAddedValueSet = deleteFieldAddedValueSet;
    vm.depthOptions = null;
    vm.isLoadingClassDetails = false;
    vm.selectFieldFilter = selectFieldFilter;
    vm.selectValueFilter = selectValueFilter;
    vm.stagedBranchesValueConstraints = [];
    vm.stagedOntologyClassValueConstraintData = [];
    vm.stagedOntologyClassValueConstraints = [];
    vm.stagedOntologyValueConstraints = [];
    vm.stagedValueSetValueConstraints = [];
    vm.stageBranchValueConstraint = stageBranchValueConstraint;
    vm.stageOntologyClassSiblingsValueConstraint = stageOntologyClassSiblingsValueConstraint;
    vm.stageOntologyClass = stageOntologyClass;
    vm.stageOntologyClassValueConstraint = stageOntologyClassValueConstraint;
    vm.stageOntologyValueConstraint = stageOntologyValueConstraint;
    vm.stageValueConstraintAction = null;
    vm.stageValueSetValueConstraint = stageValueSetValueConstraint;
    vm.startOver = startOver;
    vm.treeVisible = false;
    vm.valueConstraint = {
      'ontologies'    : [],
      'valueSets'     : [],
      'classes'       : [],
      'branches'      : [],
      'multipleChoice': false
    };

    //General
    vm.controlledTerm = {};
    vm.filterSelection = vm.options && vm.options.filterSelection || ""
    vm.modalId = vm.options && vm.options.modalId || "";


    vm.setInitialFieldConstraints();

    $('body').on('click', '.detail-view-tab a', function (e) {
      e.preventDefault();
      $(this).tab('show');
    });

    /**
     * Scope functions.
     */

    function addProperty(property) {
      if (vm.filterSelection === 'properties') {
        var id = DataManipulationService.getId(vm.field);

        // tell the form to update the property for this field
        $rootScope.$broadcast('property:propertyAdded', [property, id]);
      }

    };

    function addBranchToValueConstraint() {
      var alreadyAdded, constraint, i, j;
      for (i = 0; i < vm.stagedBranchesValueConstraints.length; i++) {
        constraint = vm.stagedBranchesValueConstraints[i];
        alreadyAdded = false;
        for (j = 0; j < vm.valueConstraint.branches.length; j++) {
          if (vm.valueConstraint.branches[j]['uri'] == constraint['uri']) {
            alreadyAdded = true;
            break;
          }
        }
        if (!alreadyAdded) {
          var newConstraint = angular.copy(constraint);
          if (newConstraint.maxDepth) {
            newConstraint.maxDepth = parseInt(newConstraint.maxDepth);
          } else {
            newConstraint.maxDepth = 1;
          }
          vm.valueConstraint.branches.push(newConstraint);
        }
      }
      vm.stagedBranchesValueConstraints = [];

      assignValueConstraintToField();
      vm.startOver();
    };

    function closeDialog() {

    }


    function addClass(selection, ontology) {

      // has this selection been added yet?
      var alreadyAdded = false;
      for (var i = 0, len = vm.addedFieldItems.length; i < len; i += 1) {
        if (vm.addedFieldItems[i]['@id'] == selection['@id']) {
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
        vm.addedFieldItems.push({
          prefLabel          : selection.prefLabel,
          ontologyDescription: ontology.info.name + " (" + ontology.info.id + ")",
          ontology           : ontology,
          class              : selection,
          "@id"              : selection["@id"]
        });

        /**
         * Add ontology type to JSON.
         */
        var properties = $rootScope.propertiesOf(vm.field);
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
      vm.startOver();

      //$element.parents("#" + vm.modalId).modal({show: false, backdrop: "static"});
      //$element.parents(".controlled-terms-modal-vm.filterSelector").hide();


      // TODO broadcast the action for now because parent scope is not working
      $rootScope.$broadcast('field:controlledTermAdded');

    }

    /**
     * Add value constraint depending on enabled action
     */
    function addValueConstraint(action) {
      if (!action || action == 'add_class') {
        addOntologyClassToValueConstraint(vm.stagedOntologyClassValueConstraints[0]);
      }
      else if (action == 'add_children') {
        addBranchToValueConstraint();
      }
      else if (action == 'add_ontology') {
        addOntologyToValueConstraint();
      }
      else if (action == 'add_entire_value_set') {
        addValueSetToValueConstraint();
      }
      // Updates the field schema according to whether the field is controlled or not
      DataManipulationService.initializeSchema(vm.field);
    }

    /**
     * Add ontology classes to value constraint to field values info definition.
     */
    function addOntologyClassesToValueConstraint() {
      var alreadyAdded, constraint, i, j;
      for (i = 0; i < vm.stagedOntologyClassValueConstraints.length; i++) {
        constraint = vm.stagedOntologyClassValueConstraints[i];
        alreadyAdded = false;
        for (j = 0; j < vm.valueConstraint.classes.length; j++) {
          if (vm.valueConstraint.classes[j]['uri'] == constraint['uri']) {
            alreadyAdded = true;
            break;
          }
        }
        if (!alreadyAdded) {
          if (constraint.label == '') {
            constraint.label = vm.stagedOntologyClassValueConstraintData[i].label;
          }
          vm.valueConstraint.classes.push(angular.copy(constraint));
        }
      }
      vm.stagedOntologyClassValueConstraints = [];
      vm.stagedOntologyClassValueConstraintData = [];
      assignValueConstraintToField();

      vm.startOver();
    };

    /**
     * Add ontology class to value constraint to field values _ui definition.
     */
    function addOntologyClassToValueConstraint(constraint) {
      var alreadyAdded = false;

      for (var j = 0; j < vm.valueConstraint.classes.length; j++) {
        if (vm.valueConstraint.classes[j]['uri'] == constraint['uri']) {
          alreadyAdded = true;
          break;
        }
      }

      if (!alreadyAdded && constraint) {
        if (constraint.label == '' && !constraint.provisionalClass) {
          var i = vm.stagedOntologyClassValueConstraints.indexOf(constraint);
          constraint.label = vm.stagedOntologyClassValueConstraintData[i].label;
        }
        vm.valueConstraint.classes.push(angular.copy(constraint));
      }

      vm.stagedOntologyClassValueConstraints = [];
      vm.stagedOntologyClassValueConstraintData = [];
      assignValueConstraintToField();
      vm.startOver();
    };

    function addOntologyToValueConstraint() {
      var alreadyAdded, constraint, i, j;
      for (i = 0; i < vm.stagedOntologyValueConstraints.length; i++) {
        constraint = vm.stagedOntologyValueConstraints[i];
        alreadyAdded = false;
        for (j = 0; j < vm.valueConstraint.ontologies.length; j++) {
          if (vm.valueConstraint.ontologies[j]['uri'] == constraint['uri']) {
            alreadyAdded = true;
            break;
          }
        }
        if (!alreadyAdded) {
          vm.valueConstraint.ontologies.push(angular.copy(constraint));
        }
      }
      vm.stagedOntologyValueConstraints = [];
      assignValueConstraintToField();
      vm.startOver();
    }

    function addValueSetToValueConstraint() {
      var alreadyAdded, constraint, i, j;
      for (i = 0; i < vm.stagedValueSetValueConstraints.length; i++) {
        constraint = vm.stagedValueSetValueConstraints[i];
        alreadyAdded = false;
        for (j = 0; j < vm.valueConstraint.valueSets.length; j++) {
          if (vm.valueConstraint.valueSets[j]['uri'] == constraint['uri']) {
            alreadyAdded = true;
            break;
          }
        }
        if (!alreadyAdded) {
          vm.valueConstraint.valueSets.push(angular.copy(constraint));
        }
      }
      vm.stagedValueSetValueConstraints = [];

      assignValueConstraintToField();
      vm.startOver();
    };

    function deleteFieldAddedBranch(branch) {
      for (var i = 0, len = vm.valueConstraint.branches.length; i < len; i += 1) {
        if (vm.valueConstraint.branches[i]['uri'] == branch['uri']) {
          vm.valueConstraint.branches.splice(i, 1);
          break;
        }
      }
    };

    function deleteFieldAddedClass(ontologyClass) {
      for (var i = 0, len = vm.valueConstraint.classes.length; i < len; i += 1) {
        if (vm.valueConstraint.classes[i] == ontologyClass) {
          vm.valueConstraint.classes.splice(i, 1);
          break;
        }
      }
    };

    function deleteFieldAddedItem(itemData) {
      var properties = $rootScope.propertiesOf(vm.field);
      for (var i = 0, len = vm.addedFieldItems.length; i < len; i += 1) {
        if (vm.addedFieldItems[i] == itemData) {
          var itemDataId = itemData["@id"];
          var idx = properties["@type"].oneOf[0].enum.indexOf(itemDataId);

          if (idx >= 0) {
            properties["@type"].oneOf[0].enum.splice(idx, 1);
            if (properties["@type"].oneOf[0].enum.length == 0) {
              delete properties["@type"].oneOf[0].enum;
            }
          }

          idx = properties['@type'].oneOf[1].items.enum.indexOf(itemDataId);

          if (idx >= 0) {
            properties['@type'].oneOf[1].items.enum.splice(idx, 1);
            if (properties["@type"].oneOf[1].items.enum.length == 0) {
              delete properties["@type"].oneOf[1].items.enum;
            }
          }

          vm.addedFieldItems.splice(i, 1);
          break;
        }
      }
    };

    function deleteFieldAddedOntology(ontology) {
      for (var i = 0, len = vm.valueConstraint.ontologies.length; i < len; i += 1) {
        if (vm.valueConstraint.ontologies[i]['uri'] == ontology['uri']) {
          vm.valueConstraint.ontologies.splice(i, 1);
          break;
        }
      }
    };

    function deleteFieldAddedValueSet(valueSet) {
      for (var i = 0, len = vm.valueConstraint.valueSets.length; i < len; i += 1) {
        if (vm.valueConstraint.valueSets[i]['uri'] == valueSet['uri']) {
          vm.valueConstraint.valueSets.splice(i, 1);
          break;
        }
      }
    };

    function stageOntologyValueConstraint() {
      vm.stagedOntologyValueConstraints = [];
      var existed = false;
      angular.forEach(vm.stagedOntologyValueConstraints, function (ontologyValueConstraint) {
        existed = existed || ontologyValueConstraint.uri == vm.currentOntology.info["@id"];
      });

      if (!existed) {
        vm.stagedOntologyValueConstraints.push({
          'numTerms': vm.currentOntology.info.details.numberOfClasses,
          'metricsAvailable': vm.currentOntology.info.details.metricsAvailable,
          'acronym' : vm.currentOntology.info.id,
          'name'    : vm.currentOntology.info.name,
          'uri'     : vm.currentOntology.info['@id']
        });
      }

      vm.stageValueConstraintAction = "add_ontology";
    };

    /**
     * Reset to the beginning where you select field or value filter.
     */
    function startOver() {
      vm.filterSelection = vm.options && vm.options.filterSelection || "";
      vm.modalId = vm.options && vm.options.modalId || "";
      vm.currentOntology = null;
      vm.selectedValueResult = null;
      vm.currentValueSet = null;
      vm.stagedOntologyClassValueConstraints = [];
      vm.stagedOntologyValueConstraints = [];
      vm.stageValueConstraintAction = null;
      vm.selectedClass = null;
      vm.classDetails = null;
      vm.selectedProperty = null;
      vm.propertyDetails = null;

      //Init field/value tooltip
      setTimeout(function () {
        angular.element('#field-value-tooltip').popover();
      }, 500);
    };

    /**
     * Set field as primary search/browse parameter.
     */
    function selectFieldFilter(event) {
      angular.element('#field-value-tooltip').popover('hide');
      vm.filterSelection = "field";
    };

    function selectValueFilter() {
      angular.element('#field-value-tooltip').popover('hide');
      vm.filterSelection = "values";
    };

    // Default values for depth options select field
    vm.depthOptions = [
      {value: '0', name: 'All'},
      {value: '1', name: '1'},
      {value: '2', name: '2'},
      {value: '3', name: '3'},
      {value: '4', name: '4'},
      {value: '5', name: '5'}
    ]

    function stageBranchValueConstraint(selection) {
      vm.stagedBranchesValueConstraints = [];
      var existed = false;
      angular.forEach(vm.stagedBranchesValueConstraints, function (branchValueConstraint) {
        existed = existed || branchValueConstraint && branchValueConstraint.uri == selection["@id"];
      });

      if (!existed) {
        vm.stagedBranchesValueConstraints.push({
          'source'  : vm.currentOntology.info.name + ' (' + vm.currentOntology.info.id + ')',
          'acronym' : vm.currentOntology.info.id,
          'uri'     : selection['@id'],
          'name'    : selection.prefLabel,
          'maxDepth': vm.depthOptions[0].value
        });
      }
      vm.stageValueConstraintAction = "add_children";
    }

    function stageOntologyClassSiblingsValueConstraint(selection) {
      vm.stagedOntologyClassValueConstraints = [];
      var acronym = vm.currentOntology.info.id;
      controlledTermDataService.getClassParents(acronym, selection['@id']).then(function (response) {
        if (response && angular.isArray(response) && response.length > 0) {
          controlledTermDataService.getClassChildren(acronym, response[0]['@id']).then(function (childResponse) {
            angular.forEach(childResponse, function (child) {
              vm.stageOntologyClass(child);
            });
            vm.stageValueConstraintAction = "add_siblings";
          });
        } else {
          controlledTermDataService.getRootClasses(acronym).then(function (childResponse) {
            angular.forEach(childResponse, function (child) {
              vm.stageOntologyClass(child);
            });
            vm.stageValueConstraintAction = "add_siblings";
          });
        }
      });
      vm.stageValueConstraintAction = "add_siblings";
    };

    function stageOntologyClassValueConstraint(selection, type) {
      vm.stageValueConstraintAction = "add_class";
      vm.stagedOntologyClassValueConstraints = [];
      stageOntologyClass(selection, type);
    };

    function stageOntologyClass(selection, type) {
      if (selection && vm.currentOntology) {
        if (type === undefined) {
          type = 'OntologyClass';
        }
        var klass = {
          'uri'      : selection['@id'],
          'prefLabel': selection.prefLabel,
          'type'     : type,
          'label'    : selection.prefLabel
          //'default'  : false
        };
        if (type == 'OntologyClass') {
          klass['source'] = vm.currentOntology.info.id;
        } else {
          klass['source'] = vm.currentValueSet.prefLabel;
        }
        vm.stagedOntologyClassValueConstraints.push(klass);
        //vm.stagedOntologyClassValueConstraintData.push({
        //  'label': selection.prefLabel
        //});
      }
    };

    function stageValueSetValueConstraint() {
      vm.stagedValueSetValueConstraints = [];
      vm.stagedValueSetValueConstraints.push({
        'name'        : vm.currentOntology.vs.prefLabel,
        'vsCollection': vm.currentOntology.info.id,
        'uri'         : vm.currentOntology.vs['@id'],
        'numTerms'    : vm.currentOntology.tree.length
      });
      vm.stageValueConstraintAction = "add_entire_value_set";
    };

    vm.bioportalFilterResultLabel = function () {
      if (vm.controlledTerm.bioportalValueSetsFilter && vm.controlledTerm.bioportalOntologiesFilter) {
        return 'ontologies and value sets';
      }
      if (vm.controlledTerm.bioportalValueSetsFilter) {
        return 'value sets';
      }
      return 'ontologies';
    };

    /**
     * Watch functions.
     */

    $scope.$on(
        'ctdc:init',
        function (event, args) {
          vm.setInitialFieldConstraints();
        }
    );

    $scope.$on(
        'cedar.templateEditor.controlledTerm.provisionalClassController.provisionalClassSaved',
        function (event, args) {
          addClass(args.class, args.ontology);
        }
    );

    $scope.$on(
        'cedar.templateEditor.controlledTerm.propertyCreated',
        function (event, args) {
          if (vm.filterSelection === 'properties') {

            // tell the form to update the property for this field
            var property = args[0];
            var id = DataManipulationService.getId(vm.field);

            $rootScope.$broadcast('property:propertyAdded', [property, id]);
          }
        }
    );


    $scope.$on(
        'cedar.templateEditor.controlledTerm.provisionalClassController.provisionalClassSavedAsOntologyValueConstraint',
        function (event, args) {
          var constraint = {
            'uri'      : args.class['@id'],
            'prefLabel': args.class.prefLabel,
            'type'     : 'OntologyClass',
            'label'    : args.class.prefLabel,
            //'default': false,
            'source'   : args.ontology.details.ontology.acronym,
            //'provisionalClass': true,
          };
          addOntologyClassToValueConstraint(constraint);
        }
    );

    $scope.$on(
        'cedar.templateEditor.controlledTerm.provisionalClassController.provisionalValueSetSavedAsValueSetValueConstraint',
        function (event, args) {
          /**
           * Get values for the current value set and compute an estimate by multiplying number
           * of pages by values per page.
           *
           * TODO: request terminology API to supply this value more easily.
           */
          provisionalClassService.getValueSetValues(args.valueSet['@id']).then(function (valuesResponse) {
            var numChildren = valuesResponse.pageCount * valuesResponse.pageSize;
            var constraint = {
              'numChildren' : numChildren,
              'name'        : args.valueSet.prefLabel,
              'vsCollection': args.valueSet.vsCollection,
              'uri'         : args.valueSet['@id'],
            };
            vm.valueConstraint.valueSets.push(constraint);
            assignValueConstraintToField();
          });
        }
    );

    $scope.$watch("field", function (newValue, oldValue) {
      var i, classId, acronym, properties;
      if (vm.field) {
        properties = $rootScope.propertiesOf(vm.field);
      }

      if (newValue !== undefined) {
        if (properties && properties['@type'] &&
            properties['@type']['oneOf'] && properties['@type']['oneOf'][0] &&
            properties['@type']['oneOf'][0]['enum']) {
          for (i = 0; i < properties['@type']['oneOf'][0]['enum'].length; i++) {
            classId = properties['@type']['oneOf'][0]['enum'][i];
            // TODO: fix the following call
            controlledTermDataService.getClassById(classId).then(function (response) {
              if (response) {
                // get ontology details
                acronym = getAcronym(response);
                controlledTermDataService.getOntologyDetails(acronym).then(function (ontologyResponse) {
                  vm.addedFieldItems.push({
                    prefLabel          : response.prefLabel,
                    ontologyDescription: ontologyResponse.ontology.name + ' (' + acronym + ')',
                    '@id'              : classId
                  });
                });
              }
            });
          }
        }

      }
    });

    // Reset element's ontology
    $scope.$watch("field.properties['@type'].oneOf[0].enum", function (newVal, oldVal) {
      if (oldVal && oldVal.length > 0 && (!newVal || newVal.length == 0)) {
        vm.addedFieldItems = [];
      }
    }, true);

    $scope.$watch("field.items.properties['@type'].oneOf[0].enum", function (newVal, oldVal) {
      if (oldVal && oldVal.length > 0 && (!newVal || newVal.length == 0)) {
        vm.addedFieldItems = [];
      }
    }, true);

    $element.parents(".controlled-terms-modal").modal({show: false, backdrop: "static"});
    $element.parents(".controlled-terms-modal").on("hide.bs.modal", function () {
      $timeout(function () {
        $scope.$apply(function () {
          vm.startOver();
        });
      });
    });

    $element.parents(".controlled-terms-modal").on("show.bs.modal", function () {
      $timeout(function () {
        jQuery(window).scrollTop(0);
      });
    });

    $element.parents(".controlled-terms-modal").on("shown.bs.modal", function () {
      var windowHeight = jQuery(window).height();
      var modalHeight = $element.parents(".controlled-terms-modal .modal-content").outerHeight();
      var topPosition = (windowHeight - modalHeight) / 2;
      if (topPosition < 0) {
        topPosition = 0;
      }
      $element.parents(".controlled-terms-modal").css("top", topPosition);
    });

    // If the selected class changes, the constraints need to be updated
    $scope.$watch(function () {
          return vm.selectedClass;
        },
        function (value) {
          if (!value) {
            vm.stageValueConstraintAction = 'add_class';
          }
          else {
            if (value.type == "OntologyClass") {
              if (value.hasChildren) {
                vm.stageBranchValueConstraint(value);
              }
              else {
                vm.stageOntologyClassValueConstraint(value);
              }
            }
            else if (value.type == "Value") {
              vm.stageOntologyClassValueConstraint(value);
            }
            else if (value.type == "ValueSet") {
              vm.stageValueConstraintAction = 'add_entire_value_set';
            }
          }
          // The 'true' parameter below ensures that the selectedClass is watched 'by value'. That means that if any of
          // its parameters changes, the watcher will be called. This is important because the hasChildren parameter
          // is not immediately updated. By
        }, true);

    // If the selected property changes, the constraints need to be updated
    $scope.$watch(function () {
          return vm.selectedProperty;
        },
        function (value) {
          //if (!value) {
          //  // 'add class' selected by default
          //  vm.stageValueConstraintAction = 'add_class';
          //}
          //else {
          //  if (value.type == "OntologyClass" || value.type == "Value") {
          //    vm.stageValueConstraintAction = 'add_class';
          //    vm.stageOntologyClassValueConstraint(value);
          //  }
          //  else if (value.type == "ValueSet") {
          //    vm.stageValueConstraintAction = 'add_entire_value_set';
          //  }
          //}
        });

    // If the selected ontology changes, the constraints need to be updated
    $scope.$watch(function () {
          return vm.currentOntology;
        },
        function (value) {
          if (!vm.selectedClass || vm.stageValueConstraintAction == 'add_ontology') {
            if (value && value.info && value.info.details) {
              vm.stageOntologyValueConstraint();
            }
            if (!vm.selectedClass) {
              vm.stageValueConstraintAction = 'add_ontology'
            }
          }

          if (vm.selectedClass && vm.stageValueConstraintAction == 'add_entire_value_set') {
            if (vm.currentOntology.vs) {
              vm.stageValueSetValueConstraint();
            }
          }
        });

    /**
     * Private functions.
     */

    function assignValueConstraintToField() {
      $rootScope.schemaOf(vm.field)._valueConstraints =
          angular.extend($rootScope.schemaOf(vm.field)._valueConstraints, vm.valueConstraint)

      delete vm.stageValueConstraintAction;
      vm.stagedOntologyValueConstraints = [];
      vm.stagedOntologyClassValueConstraints = [];
      vm.stagedOntologyClassValueConstraintData = [];
      vm.stagedValueSetValueConstraints = [];
      vm.stagedBranchesValueConstraints = [];
      vm.startOver();

      // TODO broadcast the action so dialog is closed and ontology picker is reset
      $rootScope.$broadcast('field:controlledTermAdded');

    }

    function setInitialFieldConstraints() {
      if (vm.field) {
        vm.valueConstraint = angular.copy($rootScope.schemaOf(vm.field)._valueConstraints) || {};
        vm.valueConstraint.ontologies = vm.valueConstraint.ontologies || [];
        vm.valueConstraint.valueSets = vm.valueConstraint.valueSets || [];
        vm.valueConstraint.classes = vm.valueConstraint.classes || [];
        vm.valueConstraint.branches = vm.valueConstraint.branches || [];
        vm.valueConstraint.multipleChoice = false;
      }
    };

  };

});
