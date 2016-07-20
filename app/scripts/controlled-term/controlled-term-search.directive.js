'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.controlledTerm.controlledTermSearchDirective', ['ngTagsInput'])
      .directive('controlledTermSearch', controlledTermSearchDirective);

  controlledTermSearchDirective.$inject = [];

  function controlledTermSearchDirective() {
    var directive = {
      bindToController: {
        fieldName    : '=',
        searchMode   : '=', // Search modes: field, values
        selectedClass: '=',
        currentOntology    : '=',
        //currentValueSet    : '=',
        //includeCreateClass : '=',
        resetCallback: '=?',
        //selectedValueResult: '=',
        isLoadingClassDetails: '=',
        treeVisible: '='
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
      vm.action = 'search'; // Possible actions: search, create
      vm.allOntologies = [];
      vm.isCreatingMappings = false;
      vm.isLoadingOntologyDetails = false;
      vm.loadingOntologies = false;
      vm.ontologiesFound = [];
      vm.ontologySearchRegexp = null;
      vm.resultsFound = null;
      vm.searchFinished = null;
      vm.searchScope = 'classes'; // Default search scope
      vm.searchOptionsVisible = false;
      vm.selectedResultId = null;
      vm.selectedOntologies = [];
      vm.showSearchPreloader = false;
      vm.showEmptyQueryMsg = false;

      /* Function declarations */
      vm.changeSearchScope = changeSearchScope;
      vm.changeSearchOptionsVisibility = changeSearchOptionsVisibility;
      vm.changeTreeVisibility = changeTreeVisibility;
      vm.checkIfSelected = checkIfSelected;
      vm.getShortId = getShortId;
      vm.getTypeForUi = getTypeForUi;
      vm.isCreating = isCreating;
      vm.isEmptySearchQuery = isEmptySearchQuery;
      vm.isFieldTypesMode = isFieldTypesMode;
      vm.isFieldValuesMode = isFieldValuesMode;
      vm.isSearching = isSearching;
      vm.getDefaultSearchQuery = getDefaultSearchQuery;
      vm.getClassDetails = getClassDetails;
      vm.hideTree = hideTree;
      vm.isCurrentOntology = isCurrentOntology;
      vm.isSearchingClasses = isSearchingClasses;
      vm.isSearchingOntologies = isSearchingOntologies;
      vm.onTextClick = onTextClick;
      vm.reset = reset;
      vm.search = search;
      vm.searchOntologies = searchOntologies;
      vm.selectResult = selectResult;
      vm.selectOntology = selectOntology;
      vm.showTree = showTree;
      vm.startSearch = startSearch;
      vm.switchToCreate = switchToCreate;
      vm.switchToSearch = switchToSearch;
      vm.endSearch = endSearch;

      /**
       * Search-related functions
       */

      function search(event) {
        reset(true, true, true);
        if (isEmptySearchQuery() == false) {
          vm.showEmptyQueryMsg = false;
          var searchClasses = true;
          var searchValues = true;
          if (isFieldTypesMode()) {
            searchValues = false;
          }
          else if (isFieldValuesMode()) {
            // Do nothing, the variables have already the appropriate values
          }
          startSearch();
          vm.searchResults = [];
          var maxResults = 500;
          var sources = "";
          if ((vm.selectedOntologies && vm.selectedOntologies.length > 0)) {
            var selectedOntologiesIds = [];
            vm.selectedOntologies.forEach(function (ontology) {
              selectedOntologiesIds.push(ontology.id);
            });
            sources = selectedOntologiesIds.join(",");
          }
          bioportalSearch(vm.searchQuery, sources, maxResults, searchClasses, searchValues).then(function (response) {
            if (response.collection && response.collection.length > 0) {
              var tArry = [], i;
              for (var i = 0; i < response.collection.length; i += 1) {
                var source = null;
                if (response.collection[i].type == "OntologyClass") {
                  source = controlledTermDataService.getOntologyByLdId(response.collection[i].source);
                }
                else if (response.collection[i].type == "Value") {
                  source = controlledTermDataService.getVsCollectionByLdId(response.collection[i].source);
                }
                // Ignore results for which the ontology or value set collection was not found in the cache
                if (source) {
                  tArry.push({
                    resultId : i,
                    prefLabel: response.collection[i].prefLabel,
                    details  : response.collection[i],
                    source   : source
                  });
                }
              }
              vm.searchResults = tArry;
              vm.resultsFound = true;
            } else {
              vm.resultsFound = false;
            }
            // Hide 'Searching...' message
            vm.showSearchPreloader = false;
            endSearch();
          });
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

      function bioportalSearch(query, sources, maxResults, searchClasses, searchValues) {
        if (searchClasses) {
          if (!searchValues) {
            return controlledTermDataService.searchClasses(query, sources, maxResults).then(function (response) {
              return response;
            });
          }
          // Search for classes and values
          else {
            return controlledTermDataService.searchClassesAndValues(query, sources, maxResults).then(function (response) {
              return response;
            });
          }
        }
      };

      function getDefaultSearchQuery() {
        return isFieldTypesMode() ? vm.fieldName : '';
      }

      function changeSearchScope() {
        reset(true, true, true);
        if (isSearchingOntologies()) {
          loadOntologies(vm.searchQuery);
          //searchRegexp(vm.searchQuery);
        }
        else if (isSearchingClasses()) {
          search();
        }
      }

      /**
       * Reset
       */
      function reset(keepSearchScope, keepSearchQuery, keepSelectedOntologies) {
        if (!keepSearchScope) {
          vm.searchScope = 'classes'; // Default search scope
        }
        if (!keepSearchQuery) {
          vm.searchQuery = '';
        }
        if (!keepSelectedOntologies) {
          vm.selectedOntologies = [];
        }
        vm.action = 'search';
        vm.ontologySearchRegexp = null;
        vm.resultsFound = null;
        vm.searchResults = [];
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

      function isSearching() {
        return (vm.action == 'search') ? true : false;
      }

      function isSearchingClasses() {
        return (vm.action == 'search' && vm.searchScope == 'classes') ? true : false;
      }

      function isSearchingOntologies() {
        return (vm.action == 'search' && vm.searchScope == 'ontologies') ? true : false;
      }

      function isCreating() {
        return (vm.action == 'create') ? true : false;
      }

      function isEmptySearchQuery() {
        return (vm.searchQuery == '' || vm.searchQuery == null) ? true : false;
      }

      /**
       * Ontology-related functions
       */

      function loadOntologies(searchQuery) {
        vm.treeVisible = false;
        vm.searchFinished = false;
        vm.showSearchPreloader = true;
        if (vm.allOntologies.length == 0) {
          vm.allOntologies = controlledTermDataService.getAllOntologies();
        }
        if (searchQuery) {
          vm.ontologiesFound = vm.allOntologies.filter(function (ontology) {
            return ontology.fullName.toLowerCase().indexOf(searchQuery.toLowerCase()) != -1;
          });
        }
        else {
          vm.ontologiesFound = vm.allOntologies;
        }
        vm.showSearchPreloader = false;
        vm.searchFinished = true;
        return vm.ontologiesFound;
      }

      function searchOntologies(searchQuery) {
        loadOntologies(searchQuery);
        return vm.ontologiesFound;
      }

      //*********

      function selectResult(selection, resultId) {
        // Set the basic fields for the selected class and ontology in order to show the info of the selected class while the rest of details are being loaded
        vm.selectedClass = {};
        vm.currentOntology = {};
        vm.currentOntology.info = {};
        vm.selectedClass.prefLabel = selection.prefLabel;
        vm.currentOntology.info.id = selection.source.id;
        vm.selectedResultId = resultId;
        if (selection.details.type == 'OntologyClass') {
          controlledTermService.loadTreeOfClass(selection.details, vm);
        }
        else if (selection.details.type == 'Value') {
          controlledTermService.loadTreeOfValue(selection.details, vm);
        }
        //if (vm.searchMode == 'values') {
        //  controlledTermDataService.getClassById(vm.currentOntology.info.id, selection['@id']).then(function (cls) {
        //    vm.selectedClass.hasChildren = cls.hasChildren;
        //  });
        //}
      }

      function selectOntology(selection) {
        vm.isLoadingOntologyDetails = true;
        vm.selectedClass = null;
        vm.classDetails = null;
        vm.treeVisible = true;
        controlledTermService.loadOntologyRootClasses(selection, vm).then(function(response) {
          vm.isLoadingOntologyDetails = false;
        });
      }

      //*********

      //function selectFieldClass(selection, resultId) {
      //  // Set the basic fields for the selected class and ontology in order to show the info of the selected class while the rest of details are being loaded
      //  //vm.treeVisible = false;
      //  vm.selectedClass = {};
      //  vm.currentOntology = {};
      //  vm.currentOntology.info = {};
      //  vm.selectedClass.prefLabel = selection.prefLabel;
      //  vm.currentOntology.info.id = selection.source.id;
      //  vm.selectedResultId = resultId;
      //  controlledTermService.loadTreeOfClass(selection.details, vm);
      //}
      //
      //function selectFieldOntology(selection) {
      //  vm.treeVisible = true;
      //  controlledTermService.loadOntologyRootClasses(selection, vm);
      //}

      function isCurrentOntology() {
        return vm.currentOntology && vm.currentOntology != '';
      }

      //function isOntologyNameMatched(ontology) {
      //  var name;
      //  if (!vm.isSearchingOntologies) {
      //    return ontology;
      //  }
      //  if (vm.ontologySearchRegexp) {
      //    name = ontology.name + " " + ontology.id;
      //    return vm.ontologySearchRegexp.test(name);
      //  } else {
      //    return ontology;
      //  }
      //}

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

      function changeSearchOptionsVisibility() {
        vm.searchOptionsVisible = !vm.searchOptionsVisible;
      }

      function changeTreeVisibility() {
        vm.treeVisible = !vm.treeVisible;
      }

      function switchToCreate() {
        reset(false, false, false);
        vm.action = 'create';
      }

      function switchToSearch() {
        reset(false, false, false);
        vm.action = 'search';
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
            if (isSearchingClasses()) {
              if (vm.searchQuery) {
                search()
              }
            }
            else if (isSearchingOntologies()) {
              loadOntologies(vm.searchQuery);
              //searchRegexp(vm.searchQuery);
            }
          });

      /**
       * Util functions
       */

      function getShortId(uri, maxLength) {
        var lastFragment = uri.substr(uri.lastIndexOf('/') + 1);
        var shortId = lastFragment.substr(lastFragment.lastIndexOf('#') + 1);
        if (maxLength && shortId.length > maxLength) {
          var start = shortId.length - maxLength;
          shortId = '...' + shortId.substr(start, shortId.length-1);
        }
        return shortId;
      }

      function getTypeForUi(type) {
        if (type == 'OntologyClass') {
          return ('Class');
        }
        else if (type == 'Ontology') {
          return ('Ontology');
        }
        else if (type == 'ValueSet') {
          return ('Value Set');
        }
        else if (type == 'Value') {
          return ('Value');
        }
      }

      //function searchRegexp(searchQuery) {
      //  if (searchQuery) {
      //    // Remove illegal characters
      //    searchQuery = searchQuery.replace(/[|&;$%@"<>()+,]/g, "");
      //    vm.ontologySearchRegexp = new RegExp(searchQuery, "i");
      //  }
      //  else {
      //    vm.ontologySearchRegexp = null;
      //  }
      //}

      function onTextClick(event) {
        event.target.select();
      }
    }
  }
});

