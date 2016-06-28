'use strict';

define([
  'angular',
  'cedar/template-editor/controlled-term/provisional-class.controller'
], function (angular) {
  angular.module('cedar.templateEditor.controlledTerm.cedarControlledTermOntologyPickerDirective', [
    'cedar.templateEditor.controlledTerm.provisionalClassController'
  ]).directive('cedarControlledTermOntologyPicker', cedarControlledTermOntologyPickerDirective);

  cedarControlledTermOntologyPickerDirective.$inject = ['controlledTermService'];

  function cedarControlledTermOntologyPickerDirective(controlledTermService) {

    var directive = {
      bindToController: {
        fieldName            : '=',
        classDetails         : '=',
        currentOntology      : '=',
        includeCreateClass   : '=',
        isLoadingClassDetails: '=',
        resetCallback        : '=?',
        selectedClass1       : '=',
        selectedClass2       : '=',
      },
      controller      : cedarControlledTermOntologyPickerController,
      controllerAs    : 'cctopdc',
      restrict        : 'E',
      scope           : {},
      templateUrl     : 'scripts/controlled-term/cedar-controlled-term-ontology-picker.directive.html'
    };

    return directive;

    cedarControlledTermOntologyPickerDirectiveController.$inject = [
      '$q',
      '$rootScope',
      '$scope',
      'controlledTermDataService',
      'controlledTermService',
      'provisionalClassService'
    ];

    function cedarControlledTermOntologyPickerController($q, $rootScope, $scope, controlledTermDataService,
                                                         controlledTermService) {
      var vm = this;

      vm.changeSearchScope = changeSearchScope;
      vm.checkIfSelected = checkIfSelected;
      vm.classDetails = null;
      vm.currentAction = null;
      vm.endSearch = endSearch;
      vm.currentAction = null;
      //vm.fieldBrowse = fieldBrowse;
      vm.fieldCreateClass = fieldCreateClass;
      vm.searchQuery = '';
      vm.fieldTreeVisibility = false;
      vm.getClassDetails = getClassDetails;
      vm.hideFieldTree = hideFieldTree;
      vm.isCreatingClass = isCreatingClass;
      vm.isCurrentOntology = isCurrentOntology;
      vm.isOntologyNameMatched = isOntologyNameMatched;
      vm.isSearching = isSearching;
      vm.isSearchingOntologies = isSearchingOntologies;
      vm.isSearchingClasses = isSearchingClasses;
      vm.ontologySearch = ontologySearch;
      vm.ontologySearchRegexp = null;
      vm.ontologySearchTerms = null;
      vm.prepareForOntologySearch = prepareForOntologySearch;
      vm.reset = reset;
      vm.search = search;
      vm.searchClasses = searchClasses;
      vm.searchOntologies = searchOntologies;
      vm.searchScope = 'classes';
      vm.searchClassesNoResults = false;
      vm.searchPreloader = false;
      vm.searchClassesResults = [];
      vm.searchOntologiesResults = [];
      vm.selectFieldClass = selectFieldClass;
      vm.selectFieldOntology = selectFieldOntology;
      vm.startSearch = startSearch;

      /**
       * Search
       */

      function search(event) {
        if (event) {
          event.preventDefault();
        }
        // Search for ontology classes
        if (vm.searchScope == 'classes') {
          searchClasses();
        }
        // Search for ontologies
        else if (vm.searchScope == 'ontologies') {
          searchOntologies();
        }
      }

      function startSearch() {
        vm.currentAction = 'search';
      }

      function endSearch() {
        if (!vm.searchQuery) {
          vm.currentAction = null;
        }
      }

      function ontologySearch() {
        vm.isSearchingOntologies = true;
      }

      /* Search for ontology classes */
      function searchClasses() {
        vm.searchClassesResults = [];
        vm.searchClassesNoResults = false;

        if (vm.searchQuery == '') {
          vm.searchPreloader = false;
          return;
        } else {
          vm.searchPreloader = true;
        }

        controlledTermDataService.searchClasses(vm.searchQuery).then(function (response) {
          if (response.collection.length > 0) {
            var tArry = [], i;
            for (i = 0; i < response.collection.length; i += 1) {
              var ontology = controlledTermDataService.getOntologyByLdId(response.collection[i].source);
              // Ignore results for which the ontology was not found in the cache
              if (ontology) {
                tArry.push({
                  prefLabel: response.collection[i].prefLabel,
                  details  : response.collection[i],
                  ontology : ontology
                });
              }
            }
            vm.searchClassesResults = tArry;
          } else {
            vm.searchClassesNoResults = true;
          }
          vm.searchClassesResults = tArry;

          // Hide 'Searching...' message
          vm.searchPreloader = false;
        });
      }

      /* Search for ontologies */
      function searchOntologies() {
        //vm.searchOntologiesResults = controlledTermDataService.getAllOntologies();
      }

      function changeSearchScope() {
        reset(vm.searchScope);
      }

      /**
       * Used in ontology tree directive.
       *
       * This function is passed as a callback down through class tree
       * and child tree directives.
       */
      function checkIfSelected(subtree) {
        if (!subtree) {
          return false;
        }

        var spl = subtree["@id"];
        var st;
        if (vm.selectedClass1 && vm.selectedClass1["@id"]) {
          st = vm.selectedClass1["@id"];
        }

        if (vm.selectedClass2 && vm.selectedClass2["@id"]) {
          st = vm.selectedClass2["@id"];
        }

        return spl == st;
      }

      function fieldCreateClass() {
        vm.currentAction = 'create';
      }

      /**
       * This function is passed as a callback down through class tree
       * and child tree directives.
       */
      function getClassDetails(subtree) {
        var acronym = controlledTermService.getAcronym(subtree);
        var classId = subtree['@id'];

        // Get selected class details from the links.self endpoint provided.
        vm.selectedClass2 = subtree;

        controlledTermDataService.getClassById(acronym, classId).then(function (response) {
          vm.classDetails = response;
        });
      }

      /**
       * Hide ontology tree and details screen
       */
      function hideFieldTree() {
        vm.fieldTreeVisibility = false;
        vm.currentOntology = '';
        vm.classDetails = '';
      };

      function isOntologyNameMatched(ontology) {
        var name;
        if (!vm.isSearchingOntologies) {
          return ontology;
        }

        if (vm.ontologySearchRegexp) {
          name = ontology.name;
          return vm.ontologySearchRegexp.test(name);
        } else {
          return ontology;
        }
      }

      function isSearching() {
        return vm.currentAction == 'search';
      }

      function reset(searchScope) {
        if (searchScope == 'undefined') {
          vm.searchScope = 'classes';
        }
        else {
          vm.searchScope = searchScope;
        }

        vm.searchOntologiesResults = [];
        vm.searchClassesResults = [];
        if (searchScope == 'ontologies') {
          vm.searchOntologiesResults = controlledTermDataService.getAllOntologies();
          console.log('ontologies loaded');
        }

        vm.searchQuery = '';
        vm.currentAction = null;
        vm.classDetails = null;
        vm.selectedClass1 = null;
        vm.selectedClass2 = null;
        vm.fieldTreeVisibility = false;
        vm.searchPreloader = false;

        if (typeof vm.resetCallback === "function") {
          vm.resetCallback();
        }
      };

      //TODO change to some other method of resetting state
      $scope.$on("field:controlledTermAdded", function () {
        reset();
      });

      function selectFieldClass(selection) {
        controlledTermService.loadTreeOfClass(selection, vm);
      }

      function selectFieldOntology(selection) {
        controlledTermService.loadOntologyRootClasses(selection, vm);
      }

      function prepareForOntologySearch(event) {
        if ($rootScope.isKeyVisible(event.keyCode)) {
          vm.isSearchingOntologies = false;
        }

        event.keyCode == 13 && vm.ontologySearch();
      }


      /** Util methods **/

      function isSearchingClasses() {
        return vm.searchScope == 'classes';
      }

      function isSearchingOntologies() {
        return vm.searchScope == 'ontologies'
      }

      function isCreatingClass() {
        return vm.currentAction == 'create';
      }

      function isCurrentOntology() {
        return vm.currentOntology && vm.currentOntology != '';
      }

      /**
       * Watch functions.
       */

      $scope.$watch(function (scope) {
        return vm.searchQuery;
      }, function () {
        if (vm.searchQuery) {
          vm.ontologySearchRegexp = new RegExp(vm.searchQuery, "i");
        } else {
          vm.searchQuery = null;
        }
      });


    }

  }

});
