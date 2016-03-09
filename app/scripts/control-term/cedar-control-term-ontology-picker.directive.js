'use strict';

define([
  'angular',
  'cedar/template-editor/control-term/provisional-class.controller'
], function(angular) {
  angular.module('cedar.templateEditor.controlTerm.cedarControlTermOntologyPickerDirective', [
    'cedar.templateEditor.controlTerm.provisionalClassController'
  ]).directive('cedarControlTermOntologyPicker', cedarControlTermOntologyPickerDirective);

  cedarControlTermOntologyPickerDirective.$inject = [];

  function cedarControlTermOntologyPickerDirective() {

    var directive = {
      bindToController: {
        classDetails: '=',
        currentOntology: '=',
        includeCreateClass: '=',
        isLoadingClassDetails: '=',
        resetCallback: '=?',
        selectedClass1: '=',
        selectedClass2: '=',
      },
      controller: cedarControlTermOntologyPickerController,
      controllerAs: 'cctopdc',
      restrict: 'E',
      scope: {},
      templateUrl: 'scripts/control-term/cedar-control-term-ontology-picker.directive.html'
    };

    return directive;

    cedarControlTermOntologyPickerDirectiveController.$inject = [
      '$q',
      '$rootScope',
      '$scope',
      'controlTermDataService',
      'controlTermService',
      'provisionalClassService'
    ];

    function cedarControlTermOntologyPickerController($q, $rootScope, $scope, controlTermDataService, controlTermService, provisionalClassService) {
      var vm = this;

      vm.checkIfSelected = checkIfSelected;
      vm.classDetails = null;
      vm.endFieldSearch = endFieldSearch;
      vm.fieldActionSelection = null;
      vm.fieldBrowse = fieldBrowse;
      vm.fieldCreateClass = fieldCreateClass;
      vm.fieldSearch = fieldSearch;
      vm.fieldSearchTerms = '';
      vm.fieldTreeVisibility = false;
      vm.getClassDetails = getClassDetails;
      vm.getOntologySummary = getOntologySummary;
      vm.hideFieldTree = hideFieldTree;
      vm.isBrowsing = isBrowsing;
      vm.isCreatingClass = isCreatingClass;
      vm.isCurrentOntology = isCurrentOntology;
      vm.isOntologyNameMatched = isOntologyNameMatched;
      vm.isSearching = isSearching;
      vm.isSearchingOntologies = null;
      vm.ontologySearch = ontologySearch;
      vm.ontologySearchRegexp = null;
      vm.ontologySearchTerms = null;
      vm.prepareForOntologySearch = prepareForOntologySearch;
      vm.reset = reset;
      vm.searchNoResults = false;
      vm.searchPreloader = false;
      vm.searchResults = [];
      vm.selectFieldClass = selectFieldClass;
      vm.selectFieldOntology = selectFieldOntology;
      vm.startFieldSearch = startFieldSearch;

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

      function endFieldSearch() {
        if (!vm.fieldSearchTerms) {
          vm.fieldActionSelection = null;
        }
      }

      function fieldCreateClass() {
        vm.fieldActionSelection = 'create';
      }

      function fieldBrowse(event) {
        if (event) {
          event.preventDefault();
        }

        vm.fieldActionSelection = 'browse';
        vm.searchResults = $rootScope.ontologies;
      }

      function fieldSearch(event) {
        if (event) {
          event.preventDefault();
        }

        vm.searchResults = [];
        vm.searchNoResults = false;

        if (vm.fieldSearchTerms == '') {
          vm.searchPreloader = false;
          return;
        } else {
          vm.searchPreloader = true;
        }

        var self = this;
        controlTermDataService.searchClass(vm.fieldSearchTerms).then(function(response) {
          var maxLen = response.collection.length;
          if (maxLen > 20) {
            maxLen = 20;
          }

          vm.searchPreloader = false;

          if (maxLen > 0) {
            var tArry = [], i;
            for( i = 0; i < maxLen; i += 1 ) {
              tArry.push({
                class: response.collection[i].prefLabel,
                ontology: response.collection[i].links.ontology,
                collection: response.collection[i]
              });
            }
            vm.searchResults = tArry;
          } else {
            vm.searchNoResults = true;
          }
          vm.searchResults = tArry;
        });
      }

      /**
       * This function is passed as a callback down through class tree
       * and child tree directives.
       */
      function getClassDetails(subtree) {
        // Get selected class details from the links.self endpoint provided.
        vm.selectedClass2 = subtree;
        controlTermDataService.getClassDetails(subtree.links.self).then(function(response) {
          vm.classDetails = response;
        });
      }

      function getOntologySummary(ontologyUri) {
        var acronym = ontologyUri.slice(39);
        var ontology = controlTermService.getOntologyByAcronym(acronym);
        if (ontology) {
          return ontology.name + ' (' + acronym + ')';
        } else {
          return ontologyUri;
        }
      }

      /**
       * Hide ontology tree and details screen
       */
      function hideFieldTree() {
        vm.fieldTreeVisibility = false;
        vm.currentOntology = '';
        vm.classDetails = '';
      };

      function isBrowsing() {
        return vm.fieldActionSelection == 'browse';
      }

      function isCreatingClass() {
        return vm.fieldActionSelection == 'create';
      }

      function isCurrentOntology() {
        return vm.currentOntology != '';
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

      function isSearching() {
        return vm.fieldActionSelection == 'search';
      }

      function reset() {
        vm.fieldActionSelection = null;
        vm.fieldSearchTerms = '';
        vm.classDetails = null;
        vm.selectedClass1 = { prefLabel: '' };
        vm.selectedClass2 = { prefLabel: '' };
        vm.fieldTreeVisibility = false;
        vm.searchPreloader = false;
        vm.searchResults = [];

        if (typeof vm.resetCallback === "function") {
          vm.resetCallback();
        }
      };

      function selectFieldClass(selection) {
        controlTermService.loadTreeOfClass(selection, vm);
      }

      function selectFieldOntology(selection) {
        controlTermService.loadOntologyRootClasses(selection, vm);
      }

      function startFieldSearch() {
        vm.fieldActionSelection = 'search';
      }

      function ontologySearch() {
        vm.isSearchingOntologies = true;
      }

      function prepareForOntologySearch(event) {
        if ($rootScope.isKeyVisible(event.keyCode)) {
          vm.isSearchingOntologies = false;
        }

        event.keyCode == 13 && vm.ontologySearch();
      }

      /**
       * Watch functions.
       */

      $scope.$watch(function(scope) { return vm.ontologySearchTerms; }, function() {
        if (vm.ontologySearchTerms) {
          vm.ontologySearchRegexp = new RegExp(vm.ontologySearchTerms, "i");
        } else {
          vm.ontologySearchRegexp = null;
        }
      });

    }

  }

});
