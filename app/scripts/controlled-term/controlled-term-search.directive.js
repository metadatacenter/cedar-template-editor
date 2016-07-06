'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.controlledTerm.controlledTermSearchDirective', [])
      .directive('controlledTermSearch', controlledTermSearchDirective);

  controlledTermSearchDirective.$inject = [];

  function controlledTermSearchDirective() {
    var directive = {
      bindToController: {
        fieldName    : '=',
        searchMode   : '=',
        selectedClass: '=',
        currentOntology    : '=',
        //currentValueSet    : '=',
        //includeCreateClass : '=',
        resetCallback: '=?',
        //selectedValueResult: '=',
        isLoadingClassDetails: '='
      },
      controller      : controlledTermSearchDirectiveController,
      controllerAs    : 'tsc',
      restrict        : 'E',
      scope           : {},
      templateUrl     : 'scripts/controlled-term/controlled-term-search.directive.html'
    };

    return directive;

    controlledTermSearchDirectiveController.$inject = [
      '$q',
      '$rootScope',
      '$scope',
      'controlledTermDataService'
    ];

    function controlledTermSearchDirectiveController($q, $rootScope, $scope, controlledTermService, controlledTermDataService) {
      /* Variable declarations */
      var vm = this;
      vm.action = 'search';
      vm.loadingOntologies = false;
      vm.ontologySearchRegexp = null;
      vm.resultsFound = null;
      vm.searchFinished = null;
      vm.searchOntologiesResults = [];
      vm.searchScope = 'classes'; // Default search scope
      vm.selectedResultId = null;
      vm.showSearchPreloader = false;
      vm.showEmptyQueryMsg = false;
      vm.treeVisible = false;

      /* Function declarations */
      vm.changeSearchScope = changeSearchScope;
      vm.changeTreeVisibility = changeTreeVisibility;
      vm.checkIfSelected = checkIfSelected;
      vm.getShortId = getShortId;
      vm.isEmptySearchQuery = isEmptySearchQuery;
      vm.isFieldTypesMode = isFieldTypesMode;
      vm.isFieldValuesMode = isFieldValuesMode;
      vm.isOntologyNameMatched = isOntologyNameMatched;
      vm.getDefaultSearchQuery = getDefaultSearchQuery;
      vm.getClassDetails = getClassDetails;
      vm.hideTree = hideTree;
      //vm.getSearchPlaceholderMessage = getSearchPlaceholderMessage;
      vm.isCurrentOntology = isCurrentOntology;
      vm.isSearchingClasses = isSearchingClasses;
      vm.isSearchingOntologies = isSearchingOntologies;
      vm.reset = reset;
      vm.search = search;
      vm.selectFieldClass = selectFieldClass;
      vm.selectFieldOntology = selectFieldOntology;
      vm.showTree = showTree;
      vm.startSearch = startSearch;
      vm.endSearch = endSearch;

      /**
       * Search-related functions
       */

      function search(event) {
        reset(true, true);
        if (isEmptySearchQuery() == false) {
          vm.showEmptyQueryMsg = false;
          if (isSearchingClasses()) {
            searchClasses();
          }
        }
        else {
          vm.showEmptyQueryMsg = true;
        }
      }

      function startSearch() {
        vm.searchFinished = false;
        vm.resultsFound = null;
        vm.showEmptyQueryMsg = false;
        vm.showSearchPreloader = true;
        vm.action = 'search';
      }

      function endSearch() {
        vm.searchFinished = true;
        //if (isEmptySearchQuery()) {
        //  vm.action = null;
        //}
      }

      function searchClasses() {
        startSearch();
        vm.searchClassesResults = [];
        var maxResults = 500;
        controlledTermDataService.searchClasses(vm.searchQuery, maxResults).then(function (response) {
          if (response.collection.length > 0) {
            var tArry = [], i;
            for (i = 0; i < response.collection.length; i += 1) {
              var ontology = controlledTermDataService.getOntologyByLdId(response.collection[i].source);
              // Ignore results for which the ontology was not found in the cache
              if (ontology) {
                tArry.push({
                  resultId : i,
                  prefLabel: response.collection[i].prefLabel,
                  details  : response.collection[i],
                  ontology : ontology
                });
              }
            }
            vm.searchClassesResults = tArry;
            vm.resultsFound = true;
          } else {
            console.log("search results found false");
            vm.resultsFound = false;
          }

          // Hide 'Searching...' message
          vm.showSearchPreloader = false;
          endSearch();
        });
      }

      //function searchOntologies() {
      //  //vm.isSearchingOntologies = true;
      //  //vm.searchOntologiesResults = controlledTermDataService.getAllOntologies();
      //}

      function searchValueSets() {
        //vm.searchOntologiesResults = controlledTermDataService.getAllOntologies();
      }

      function getDefaultSearchQuery() {
        return isFieldTypesMode() ? vm.fieldName : '';
      }

      function changeSearchScope() {
        reset(true, false);
        if (isSearchingOntologies()) {
          loadOntologies();
        }
      }

      /**
       * Reset
       */
      function reset(keepSearchScope, keepSearchQuery) {
        if (!keepSearchScope) {
          vm.searchScope = 'classes'; // Default search scope
        }
        if (!keepSearchQuery) {
          vm.searchQuery = '';
        }
        vm.action = 'search';
        vm.ontologySearchRegexp = null;
        vm.resultsFound = null;
        vm.searchClassesResults = [];
        vm.searchFinished = null;
        vm.selectedResultId = null;
        vm.showEmptyQueryMsg = false;
        vm.showSearchPreloader = false;
        vm.treeVisible = false;

        if (typeof vm.resetCallback === "function") {
          vm.resetCallback();
        }
      }

      /**
       * Other useful functions
       */

      function isFieldTypesMode() {
        return vm.searchMode == 'field' ? true : false;
      }

      function isFieldValuesMode() {
        return vm.searchMode == 'values' ? true : false;
      }

      function isSearchingClasses() {
        return vm.searchScope == 'classes' ? true : false;
      }

      function isSearchingOntologies() {
        return vm.searchScope == 'ontologies' ? true : false;
      }

      function isEmptySearchQuery() {
        return (vm.searchQuery == '' || vm.searchQuery == null) ? true : false;
      }

      //function getSearchPlaceholderMessage() {
      //  if (isSearchingTerms()) {
      //    console.log("terms")
      //    return "Search for terms in BioPortal";
      //  }
      //  else if (isSearchingOntologies()) {
      //    console.log("ontologies")
      //    return "Search for ontologies in BioPortal";
      //  }
      //  else if (isSearchingValueSets()) {
      //    console.log("value-sets")
      //    return "Search for value sets in BioPortal";
      //  }
      //}

      /**
       * Ontology-related functions
       */

      function loadOntologies() {
        if (vm.searchOntologiesResults.length == 0) {
          vm.searchOntologiesResults = controlledTermDataService.getAllOntologies();
        }
      }

      function selectFieldClass(selection, resultId) {
        // Set the basic fields for the selected class and ontology in order to show the info of the selected class while the rest of details are being loaded
        vm.treeVisible = false;
        vm.selectedClass = {};
        vm.currentOntology = {};
        vm.currentOntology.info = {};
        vm.selectedClass.prefLabel = selection.prefLabel;
        vm.currentOntology.info.id = selection.ontology.id;
        vm.selectedResultId = resultId;
        controlledTermService.loadTreeOfClass(selection.details, vm);
      }

      function selectFieldOntology(selection) {
        controlledTermService.loadOntologyRootClasses(selection, vm);
      }

      function isCurrentOntology() {
        return vm.currentOntology && vm.currentOntology != '';
      }

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

      /* Used in ontology tree directive. */
      /* This function is passed as a callback down through class tree and child tree directives */
      function checkIfSelected(subtree) {
        if (!subtree) {
          return false;
        }

        var spl = subtree["@id"];
        var st;
        if (vm.selectedClass && vm.selectedClass["@id"]) {
          st = vm.selectedClass["@id"];
        }
        
        return spl == st;
      }

      function showTree() {
        vm.treeVisible = true;
      }

      function changeTreeVisibility() {
        vm.treeVisible = !vm.treeVisible;
      }

      function fieldCreateClass() {
        vm.currentAction = 'create';
      }

      /* This function is passed as a callback down through class tree and child tree directives */
      function getClassDetails(subtree) {
        var acronym = controlledTermService.getAcronym(subtree);
        var classId = subtree['@id'];

        // Get selected class details from the links.self endpoint provided.
        vm.selectedClass = subtree;

        controlledTermDataService.getClassById(acronym, classId).then(function (response) {
          vm.classDetails = response;
        });
      }

      /* Hide Ontology Tree and Details */
      function hideTree() {
        vm.treeVisible = false;
        vm.currentOntology = '';
        vm.classDetails = '';
      };

      /**
       * Watch functions
       */

      /* Ensures that the fieldName search query is updated when the field name is updated */
      $scope.$watch(function () {
            return vm.fieldName;
          },
          function (value) {
            vm.fieldName = value;
            vm.searchQuery = getDefaultSearchQuery();
          });

      $scope.$watch(function () {
            return vm.searchQuery;
          },
          function () {
            if (vm.searchQuery) {
              vm.ontologySearchRegexp = new RegExp(vm.searchQuery, "i");
            } else {
              vm.searchQuery = null;
            }
          });


      /**
       * Util functions
       */

      function getShortId(uri) {
        var lastFragment = uri.substr(uri.lastIndexOf('/') + 1);
        var shortId = lastFragment.substr(lastFragment.lastIndexOf('#') + 1);
        return shortId;
      }
    }
  }
});

