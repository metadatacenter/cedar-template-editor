'use strict';

define([
  'angular'
], function(angular) {
  angular.module('cedar.templateEditor.controlTerm.controlTermDirectiveController', [])
    .controller('controlTermDirectiveController', controlTermDirectiveController);

  controlTermDirectiveController.$inject = [
    '$element',
    '$http',
    '$q',
    '$rootScope',
    '$scope',
    '$timeout',
    'controlTermDataService',
    'controlTermService',
    'provisionalClassService'
  ];

  /**
   * Controller for the functionality of adding controlled terms to fields and elements.
   */
  function controlTermDirectiveController($element, $http, $q, $rootScope, $scope, $timeout, controlTermDataService, controlTermService, provisionalClassService) {
    var vm = this;

    vm.addBranchToValueConstraint = addBranchToValueConstraint;
    vm.addClass = addClass;
    vm.addedFieldItems = [];
    vm.addOntologyClassesToValueConstraint = addOntologyClassesToValueConstraint;
    vm.addOntologyClassToValueConstraint = addOntologyClassToValueConstraint;
    vm.addOntologyToValueConstraint = addOntologyToValueConstraint;
    vm.addValueSetToValueConstraint = addValueSetToValueConstraint;
    vm.currentOntology = null;
    vm.currentValueSet = null;
    vm.deleteFieldAddedBranch = deleteFieldAddedBranch;
    vm.deleteFieldAddedClass = deleteFieldAddedClass;
    vm.deleteFieldAddedItem = deleteFieldAddedItem;
    vm.deleteFieldAddedOntology = deleteFieldAddedOntology;
    vm.deleteFieldAddedValueSet = deleteFieldAddedValueSet;
    vm.isLoadingClassDetails = false;
    vm.loadAllOntologies = loadAllOntologies;
    vm.loadAllValueSets = loadAllValueSets;
    vm.selectFieldFilter = selectFieldFilter;
    vm.selectValueFilter = selectValueFilter;
    vm.stagedBranchesValueConstraints = [];
    vm.stagedOntologyClassValueConstraintData = [];
    vm.stagedOntologyClassValueConstraints = [];
    vm.stagedOntologyValueConstraints = [];
    vm.stagedValueSetValueConstraints = [];
    vm.stageBranchValueConstraint = stageBranchValueConstraint;
    vm.stageOntologyClassSiblingsValueConstraint = stageOntologyClassSiblingsValueConstraint;
    vm.stageOntologyClassValueConstraint = stageOntologyClassValueConstraint;
    vm.stageOntologyValueConstraint = stageOntologyValueConstraint;
    vm.stageValueConstraintAction = null;
    vm.stageValueSetValueConstraint = stageValueSetValueConstraint;
    vm.startOver = startOver;
    vm.valueConstraint = {
      'ontologies': [],
      'valueSets': [],
      'classes': [],
      'branches': [],
      'multipleChoice': false
    };

    //General
    vm.controlTerm = {};
    vm.filterSelection = vm.options && vm.options.filterSelection || "";

    vm.loadAllOntologies();
    vm.loadAllValueSets();
    setInitialFieldConstraints();

    $('body').on('click', '.detail-view-tab a', function (e) {
      e.preventDefault();
      $(this).tab('show');
    });

    /**
     * Scope functions.
     */

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

    function addClass(selection, ontology) {
      var alreadyAdded = false;
      for(var i = 0, len = vm.addedFieldItems.length; i < len; i+= 1) {
        if(vm.addedFieldItems[i].prefLabel == selection.prefLabel) {
          alreadyAdded = true;
          break;
        }
      }

      if(alreadyAdded == false) {
        vm.addedFieldItems.push({
          prefLabel: selection.prefLabel,
          ontologyDescription: ontology.details.ontology.name+" ("+ontology.details.ontology.acronym+")",
          ontology: ontology,
          class: selection,
          "@id": selection["@id"]
        });

        /**
         * Add ontology type to JSON.
         */
        var properties = $rootScope.propertiesOf(vm.field);
        if (angular.isArray(properties['@type'].oneOf[0].enum)) {
          properties['@type'].oneOf[0].enum.push(selection.links.self);
          properties['@type'].oneOf[1].items.enum.push(selection.links.self);
        } else {
          properties['@type'].oneOf[0].enum = [selection.links.self];
          properties['@type'].oneOf[1].items.enum = [selection.links.self];
        }

        vm.startOver();
      } else {
        alert(selection.prefLabel+' has already been added.');
      }
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

      if (!alreadyAdded) {
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
      for (var i = 0, len = vm.valueConstraint.branches.length; i < len; i+= 1) {
        if (vm.valueConstraint.branches[i]['uri'] == branch['uri']) {
          vm.valueConstraint.branches.splice(i,1);
          break;
        }
      }
    };

    function deleteFieldAddedClass(ontologyClass) {
      for (var i = 0, len = vm.valueConstraint.classes.length; i < len; i+= 1) {
        if (vm.valueConstraint.classes[i] == ontologyClass) {
          vm.valueConstraint.classes.splice(i,1);
          break;
        }
      }
    };

    function deleteFieldAddedItem(itemData) {
      var properties = $rootScope.propertiesOf(vm.field);
      for (var i = 0, len = vm.addedFieldItems.length; i < len; i+= 1) {
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

          vm.addedFieldItems.splice(i,1);
          break;
        }
      }
    };

    function deleteFieldAddedOntology(ontology) {
      for (var i = 0, len = vm.valueConstraint.ontologies.length; i < len; i+= 1) {
        if (vm.valueConstraint.ontologies[i]['uri'] == ontology['uri']) {
          vm.valueConstraint.ontologies.splice(i,1);
          break;
        }
      }
    };

    function deleteFieldAddedValueSet(valueSet) {
      for (var i = 0, len = vm.valueConstraint.valueSets.length; i < len; i+= 1) {
        if (vm.valueConstraint.valueSets[i]['uri'] == valueSet['uri']) {
          vm.valueConstraint.valueSets.splice(i,1);
          break;
        }
      }
    };

    /**
     * Cache entire list of ontologies on the client so we don't have to make
     * additional API calls for ontological information in things like search
     * results.
     */
    function loadAllOntologies() {
      $rootScope.ontologies = $rootScope.ontologies || [];
      if ($rootScope.ontologies.length == 0) {
        $rootScope.ontologies = $http.get('/cache/ontologies.json').
          success(function(response) {
            $rootScope.ontologies = response;
          }).
          error(function(response) {
            alert('There was an error loading the ontologies from cache.');
          });
      }
    }

    /**
     * Cache entire list of value sets on the client for control
     * term browsing.
     */
    function loadAllValueSets() {
      $rootScope.valueSets = $rootScope.valueSets || [];
      if ($rootScope.valueSets.length == 0) {
        $rootScope.valueSets = $http.get('/cache/value-sets.json').
          success(function(response) {
            $rootScope.valueSets = response;
          }).
          error(function(response) {
            alert('There was an error loading the value sets from cache.');
          });
      }
    }

    function stageOntologyValueConstraint() {
      var existed = false;
      angular.forEach(vm.stagedOntologyValueConstraints, function(ontologyValueConstraint) {
        existed = existed || ontologyValueConstraint.uri == vm.currentOntology.details.ontology["@id"];
      });

      if (!existed) {
        vm.stagedOntologyValueConstraints.push({
          'numChildren': vm.currentOntology.size.classes,
          'acronym': vm.currentOntology.details.ontology.acronym,
          'name': vm.currentOntology.details.ontology.name,
          'uri': vm.currentOntology.details.ontology['@id']
        });
      }

      vm.stageValueConstraintAction = "add_ontology";
    };

    /**
     * Reset to the beginning where you select field or value filter.
     */
    function startOver() {
      vm.filterSelection = vm.options && vm.options.filterSelection || "";
      vm.currentOntology = null;
      vm.selectedValueResult = null;
      vm.currentValueSet = null;
      vm.stagedOntologyClassValueConstraints = [];
      vm.stageValueConstraintAction = null;
      vm.selectedClass1 = null;
      vm.selectedClass2 = null;
      vm.classDetails = null;

      //Init field/value tooltip
      setTimeout(function() {
        angular.element('#field-value-tooltip').popover();
      }, 500);
    };

    var loadCategoriesForOntology = function(ontology) {
      controlTermDataService.getOntologyCategories(ontology.acronym, true).then(function(response) {
        if (!(status in response)) {
          ontology.categories = response;
          var names = [];
          angular.forEach(response, function(c) {
            names.push(c.name);
          });

          ontology.categoriesNames = names.join(", ");
        }
      });
    }

    var loadMetricsForOntology = function(ontology) {
      controlTermDataService.getOntologySize(ontology.acronym, true).then(function(response) {
        if (!(status in response)) {
          ontology.metrics = response;
        }
      });
    }

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

    function stageBranchValueConstraint(selection) {
      var existed = false;
      angular.forEach(vm.stagedBranchesValueConstraints, function(branchValueConstraint) {
        existed = existed || branchValueConstraint && branchValueConstraint.uri == selection["@id"];
      });

      if (!existed) {
        vm.stagedBranchesValueConstraints.push({
          'source': vm.currentOntology.details.ontology.name + ' (' + vm.currentOntology.details.ontology.acronym + ')',
          'acronym': vm.currentOntology.details.ontology['acronym'],
          'uri': selection['@id'],
          'name': selection.prefLabel,
          'maxDepth': null
        });
      }

      vm.stageValueConstraintAction = "add_children";
    }

    function stageOntologyClassSiblingsValueConstraint(selection) {
      vm.stagedOntologyClassValueConstraints = [];
      controlTermDataService.getClassParents(controlTermDataService.getOntologyAcronym(selection), selection['@id']).then(function(response) {
        var acronym = vm.currentOntology.details.ontology.acronym;
        if (response && angular.isArray(response) && response.length > 0) {
          controlTermDataService.getClassChildren(acronym, response[0]['@id']).then(function(childResponse) {
            angular.forEach(childResponse, function(child) {
              vm.stageOntologyClassValueConstraint(child);
            });
            vm.stageValueConstraintAction = "add_siblings";
          });
        } else {
          controlTermDataService.getOntologyTreeRoot(acronym).then(function(childResponse) {
            angular.forEach(childResponse, function(child) {
              vm.stageOntologyClassValueConstraint(child);
            });
            vm.stageValueConstraintAction = "add_siblings";
          });
        }
      });
      vm.stageValueConstraintAction = "add_siblings";
    };

    function stageOntologyClassValueConstraint(selection, type) {
      if (type === undefined) {
        type = 'Ontology Class';
      }
      var klass = {
        'uri': selection['@id'],
        'prefLabel': selection.prefLabel,
        'type': type,
        'label': '',
        'default': false
      };
      if (type == 'Ontology Class') {
        klass['source'] = vm.currentOntology.details.ontology.name + ' (' + vm.currentOntology.details.ontology.acronym + ')';
      } else {
        klass['source'] = vm.currentValueSet.prefLabel;
      }
      vm.stagedOntologyClassValueConstraints.push(klass);
      vm.stagedOntologyClassValueConstraintData.push({
        'label': selection.prefLabel
      });

      vm.stageValueConstraintAction = "add_class";
    };

    function stageValueSetValueConstraint(selection) {
      vm.stagedValueSetValueConstraints.push({
        'numChildren': vm.currentValueSet.numChildren,
        'name': vm.currentValueSet.prefLabel,
        'uri': vm.currentValueSet['@id']
      });

      vm.stageValueConstraintAction = "add_entire_value_set";
    };

    vm.bioportalFilterResultLabel = function() {
      if (vm.controlTerm.bioportalValueSetsFilter && vm.controlTerm.bioportalOntologiesFilter) {
        return 'ontologies and value sets';
      }
      if (vm.controlTerm.bioportalValueSetsFilter) {
        return 'value sets';
      }
      return 'ontologies';
    };

    /**
     * Watch functions.
     */

    $scope.$on(
      'cedar.templateEditor.controlTerm.provisionalClassController.provisionalClassSaved',
      function(event, args) {
        addClass(args.class, args.ontology);
      }
    );

    $scope.$on(
      'cedar.templateEditor.controlTerm.provisionalClassController.provisionalClassSavedAsOntologyValueConstraint',
      function(event, args) {
        var constraint = {
          'uri': args.class['@id'],
          'prefLabel': args.class.prefLabel,
          'type': 'Ontology Class',
          'label': args.class.prefLabel,
          'default': false,
          'source': args.ontology.details.ontology.name + ' (' + args.ontology.details.ontology.acronym + ')',
          'provisionalClass': true,
        };
        addOntologyClassToValueConstraint(constraint);
      }
    );

    $scope.$on(
      'cedar.templateEditor.controlTerm.provisionalClassController.provisionalValueSetSavedAsValueSetValueConstraint',
      function (event, args) {
        /**
         * Get values for the current value set and compute an estimate by multiplying number
         * of pages by values per page.
         *
         * TODO: request terminology API to supply this value more easily.
         */
        provisionalClassService.getValueSetValues(args.valueSet['@id']).then(function(valuesResponse) {
          var numChildren = valuesResponse.pageCount * valuesResponse.pageSize;
          var constraint = {
            'numChildren': numChildren,
            'name': args.valueSet.prefLabel,
            'uri': args.valueSet['@id'],
          };
          vm.valueConstraint.valueSets.push(constraint);
          assignValueConstraintToField();
        });
      }
    );

    $scope.$watch("field", function(newValue, oldValue) {
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
            controlTermDataService.getClassDetails(classId).then(function(response) {
              if (response) {
                // get ontology details
                acronym = getOntologyAcronym(response);
                controlTermDataService.getOntologyDetails(acronym).then(function(ontologyResponse) {
                  vm.addedFieldItems.push({
                    prefLabel: response.prefLabel,
                    ontologyDescription: ontologyResponse.ontology.name + ' (' + acronym + ')',
                    '@id': classId
                  });
                });
              }
            });
          }
        }

        // setInitialFieldConstraints();
      }
    });

    // Reset element's ontology
    $scope.$watch("field.properties['@type'].oneOf[0].enum", function(newVal, oldVal) {
      if (oldVal && oldVal.length > 0 && (!newVal || newVal.length == 0)) {
        vm.addedFieldItems = [];
      }
    }, true);

    $scope.$watch("field.items.properties['@type'].oneOf[0].enum", function(newVal, oldVal) {
      if (oldVal && oldVal.length > 0 && (!newVal || newVal.length == 0)) {
        vm.addedFieldItems = [];
      }
    }, true);

    $element.parents(".controlled-terms-modal").modal({show: false, backdrop: "static"});
    $element.parents(".controlled-terms-modal").on("hide.bs.modal", function() {
      $timeout(function() {
        $scope.$apply(function() {
          vm.startOver();
        });
      });
    });

    $element.parents(".controlled-terms-modal").on("show.bs.modal", function() {
      $timeout(function() {
        jQuery(window).scrollTop(0);
      });
    });

    $element.parents(".controlled-terms-modal").on("shown.bs.modal", function() {
      var windowHeight = jQuery(window).height();
      var modalHeight = $element.parents(".controlled-terms-modal .modal-content").outerHeight();
      var topPosition = (windowHeight - modalHeight)/2;
      if (topPosition < 0) {
        topPosition = 0;
      }
      $element.parents(".controlled-terms-modal").css("top", topPosition);
    });

    /**
     * Private functions.
     */

    function assignValueConstraintToField() {
      $rootScope.propertiesOf(vm.field)._valueConstraints =
        angular.extend(vm.valueConstraint, $rootScope.propertiesOf(vm.field)._valueConstraints)
      delete vm.stageValueConstraintAction;
      vm.stagedOntologyValueConstraints = [];
      vm.stagedOntologyClassValueConstraints = [];
      vm.stagedOntologyClassValueConstraintData = [];
      vm.stagedValueSetValueConstraints = [];
      vm.stagedBranchesValueConstraints = [];
      vm.startOver();
    }

    function setInitialFieldConstraints() {
      if (vm.field) {
        var properties = $rootScope.propertiesOf(vm.field);

        vm.valueConstraint = angular.copy(properties._valueConstraints) || {};
        vm.valueConstraint.ontologies = vm.valueConstraint.ontologies || [];
        vm.valueConstraint.valueSets = vm.valueConstraint.valueSets || [];
        vm.valueConstraint.classes = vm.valueConstraint.classes || [];
        vm.valueConstraint.branches = vm.valueConstraint.branches || [];
        vm.valueConstraint.multipleChoice = vm.valueConstraint.multipleChoice || [];
      }
    };

  };

});