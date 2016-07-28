'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.controlledTerm.cedarControlledTermValueSetPickerDirective', [])
      .directive('cedarControlledTermValueSetPicker', cedarControlledTermValueSetPickerDirective);

  cedarControlledTermValueSetPickerDirective.$inject = [];

  function cedarControlledTermValueSetPickerDirective() {

    var directive = {
      bindToController: {
        currentOntology    : '=',
        currentValueSet    : '=',
        includeCreateClass : '=',
        resetCallback      : '=?',
        selectedValueResult: '=',
      },
      controller      : cedarControlledTermValueSetPickerDirectiveController,
      controllerAs    : 'cctvspdc',
      restrict        : 'E',
      scope           : {},
      templateUrl     : 'scripts/controlled-term/cedar-controlled-term-value-set-picker.directive.html'
    };

    return directive;

    cedarControlledTermValueSetPickerDirectiveController.$inject = [
      '$q',
      '$rootScope',
      '$scope',
      'controlledTermDataService',
      'controlledTermService'
    ];

    function cedarControlledTermValueSetPickerDirectiveController($q, $rootScope, $scope, controlledTermDataService,
                                                               controlledTermService) {
      var vm = this;

      vm.bioportalOntologiesFilter = true;
      vm.bioportalValueSetsFilter = true;
      vm.browsingSection = null;
      vm.checkIfSelected = checkIfSelected;
      vm.classDetails = null;
      vm.currentValueSetId = null;
      vm.fieldCreateValueSet = fieldCreateValueSet;
      vm.getClassDetails = getClassDetails;
      vm.hideValuesTree = hideValuesTree;
      vm.isBrowsing = isBrowsing;
      vm.isCreatingValueSet = isCreatingValueSet;
      vm.isOntologyNameMatched = isOntologyNameMatched;
      vm.isSearching = isSearching;
      vm.isSearchingOntologies = false;
      vm.ontologySearch = ontologySearch;
      vm.ontologySearchRegexp = null;
      vm.ontologySearchTerms = null;
      vm.prepareForOntologySearch = prepareForOntologySearch;
      vm.reset = reset;
      vm.searchNoResults = false;
      vm.searchPreloader = false;
      vm.searchResults = [];
      vm.selectValueResult = selectValueResult;
      vm.showCreateForm = showCreateForm;
      vm.startValuesSearch = startValuesSearch;
      vm.valuesActionSelection = null;
      vm.valuesBrowse = valuesBrowse;
      vm.valuesCreateClass = valuesCreateClass;
      vm.valuesSearch = valuesSearch;
      vm.valuesSearchTerms = '';
      vm.valueSetClasses = null;
      vm.valuesTreeVisibility = false;
      vm.toUiType = toUiType;

      /**
       * Scope funcitons.
       */

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
        var st = vm.selectedValueResult['@id'];

        return spl == st;
      }

      function fieldCreateValueSet() {
        vm.valuesActionSelection = 'create';
      }

      /**
       * This function is passed as a callback down through class tree
       * and child tree directives.
       */
      function getClassDetails(subtree) {
        vm.selectedValueResult = subtree;
        var acronym = controlledTermService.getAcronym(subtree);
        var classId = subtree['@id'];
        // Get selected class details from the links.self endpoint provided.
        controlledTermDataService.getClassById(acronym, classId).then(function (response) {
          vm.classDetails = response;
        });
      }

      function hideValuesTree() {
        vm.valuesTreeVisibility = false;
        vm.selectedValueResult = null;
      }

      function isBrowsing() {
        return vm.valuesActionSelection == 'browse';
      }

      function isCreatingValueSet() {
        return vm.valuesActionSelection == 'create';
      }

      function isOntologyNameMatched(ontology) {
        var name;
        if (!vm.bioportalValueSetsFilter && ontology.type == 'ValueSet') {
          return false;
        }
        if (!vm.bioportalOntologiesFilter && ontology.type == 'Ontology') {
          return false;
        }
        if (!vm.isSearchingOntologies) {
          return ontology;
        }

        if (vm.ontologySearchRegexp) {
          name = ontology.name;
          if (ontology.type == 'ValueSet') {
            name = ontology.prefLabel;
          }
          return vm.ontologySearchRegexp.test(name);
        } else {
          return ontology;
        }
      }

      function isSearching() {
        return vm.valuesActionSelection == 'search'
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

      function reset() {
        vm.bioportalOntologiesFilter = true;
        vm.bioportalValueSetsFilter = true;
        vm.valuesActionSelection = null;
        vm.valuesTreeVisibility = false;
        vm.selectedValueResult = null;
        vm.classDetails = null;
        vm.searchPreloader = false;
        vm.searchResults = [];

        if (typeof vm.resetCallback === "function") {
          vm.resetCallback();
        }
      };

      //TODO change to some other method of resetting state
      $scope.$on("field:controlledTermAdded", function () {
        reset();
      });

      /**
       * This function should select a value search or browse value result and populate
       * all the associated data necessary to display the class details and related info.
       */
      function selectValueResult(result) {
        vm.selectedValueResult = result;
        vm.valuesTreeVisibility = true;
        // Ontology
        if (result.type == 'Ontology') {
          vm.browsingSection = 'ontology';
          var ontology = controlledTermDataService.getOntologyById(controlledTermService.getLastFragmentOfUri(result.id));
          if (result.type == 'Ontology') {
            vm.currentOntology = {
              'details': {'ontology': result}
            };
            controlledTermService.loadOntologyRootClasses(vm.currentOntology.details.ontology, vm);
          }
        }
        // Ontology Class
        if (result.type == 'OntologyClass') {
          vm.browsingSection = 'ontology';
          var ontology = controlledTermDataService.getOntologyById(controlledTermService.getLastFragmentOfUri(result.sourceId));
          vm.currentOntology = {
            'details': {'ontology': ontology}
          };
          controlledTermService.loadTreeOfClass(result, vm);

          // Set the hasChildren property, which will be used to decide if the 'Children' tab will be shown
          controlledTermDataService.getClassById(ontology.id, result['@id']).then(function (cls) {
            result.hasChildren = cls.hasChildren;
          });
        }
        // Value Set or value
        else if (result.type == 'ValueSet' || result.type == 'Value') {
          var id;
          if (result.sourceId) {
            id = result.sourceId;
          }
          else {
            id = result.vsCollection;
          }
          var acronym = controlledTermService.getLastFragmentOfUri(id);
          vm.browsingSection = 'value_set';
          vm.searchPreloader = true;
          assignValueSetDetails(result);
          // Value Set
          if (result.type == 'ValueSet') {
            vm.currentValueSet = result;
            vm.currentValueSetId = result['@id'];
            controlledTermDataService.getValuesInValueSet(acronym, vm.currentValueSetId).then(function (valueSetClasses) {
              vm.valueSetClasses = valueSetClasses;
              angular.forEach(vm.valueSetClasses, function (valueSetClass) {
                valueSetClass.type = 'Value';
              });
              vm.searchPreloader = false;
            });
            // Value
          } else {
            // Get the value set that contains the value
            controlledTermDataService.getClassParents(acronym, result['@id']).then(function (response) {
              vm.currentValueSet = response[0];
              vm.currentValueSetId = vm.currentValueSet["@id"];
              controlledTermDataService.getValuesInValueSet(acronym,
                  vm.currentValueSetId).then(function (valueSetClasses) {
                vm.valueSetClasses = valueSetClasses;
                angular.forEach(vm.valueSetClasses, function (valueSetClass) {
                  valueSetClass.type = 'Value';
                });
                vm.searchPreloader = false;
              });
            });
          }
        }

      };

      function showCreateForm() {
        vm.showCreate = true;
      };

      function startValuesSearch() {
        vm.valuesActionSelection = 'search';
      }

      function valuesBrowse(event) {
        if (event) {
          event.preventDefault();
        }

        vm.valuesActionSelection = "browse";
        var browseResults = [];

        $q.all({
          ontologies: controlledTermDataService.getAllOntologies(),
          valueSets : controlledTermDataService.getAllValueSets()
        }).then(function (result) {
          angular.forEach(result.valueSets, function (valueSet) {
            browseResults.push(valueSet);
          });
          angular.forEach(result.ontologies, function (ont) {
            browseResults.push(ont);
          });

          // Sort by title
          browseResults.sort(controlledTermService.sortBrowseResults);
          vm.searchResults = browseResults;
        });

      }

      function valuesCreateClass() {
        vm.valuesActionSelection = 'create';
      }

      function valuesSearch(event) {
        if (event) {
          event.preventDefault();
        }

        vm.searchNoResults = false;
        vm.valuesActionSelection = 'search';

        if (vm.valuesSearchTerms == '') {
          vm.searchPreloader = false;
          return;
        } else {
          vm.searchPreloader = true;
        }

        vm.searchResults = [];
        vm.tmpSearchResults = [];

        bpSearch(vm.valuesSearchTerms, vm.bioportalOntologiesFilter,
            vm.bioportalValueSetsFilter).then(function (response) {
              vm.searchPreloader = false;
              vm.tmpSearchResults = response.collection;

              if (vm.tmpSearchResults.length > 0) {
                for (var i = 0; i < vm.tmpSearchResults.length; i++) {
                  var type = vm.tmpSearchResults[i].type;
                  var sourceId = vm.tmpSearchResults[i].source;
                  var sourceName;
                  var ignoreResult = false;
                  if (type == 'OntologyClass') {
                    var ontology = controlledTermDataService.getOntologyByLdId(sourceId);
                    if (ontology == undefined) {
                      ignoreResult = true;
                    }
                    else {
                      sourceName = ontology.name + ' (' + ontology.id + ')';
                    }
                  }
                  else if (type == 'ValueSet') {
                    sourceName = controlledTermService.getLastFragmentOfUri(sourceId);
                  }
                  else if (type == 'Value') {
                    sourceName = controlledTermService.getLastFragmentOfUri(sourceId);
                  }
                  if (!ignoreResult) {
                    vm.searchResults.push({
                      '@id'     : vm.tmpSearchResults[i]['@id'],
                      prefLabel : vm.tmpSearchResults[i].prefLabel,
                      type      : type,
                      sourceName: sourceName,
                      sourceId  : sourceId
                    });
                  }
                }
              }
            });
      }

      function bpSearch(query, ontologiesFilter, valueSetsFilter) {
        // Search All (Classes, Value Sets and Values)
        if (ontologiesFilter && valueSetsFilter) {
          return controlledTermDataService.searchClassesValueSetsAndValues(query).then(function (response) {
            return response;
          });
        }
        // Search Classes
        else if (ontologiesFilter) {
          return controlledTermDataService.searchClasses(query).then(function (response) {
            return response;
          });
        }
        // Search Value Sets and Values
        else if (valueSetsFilter) {
          return controlledTermDataService.searchValueSetsAndValues(query).then(function (response) {
            return response;
          });
        }
      }

      /**
       * Watch functions.
       */

      $scope.$watch(function (scope) {
        return vm.ontologySearchTerms;
      }, function () {
        if (vm.ontologySearchTerms) {
          vm.ontologySearchRegexp = new RegExp(vm.ontologySearchTerms, "i");
        } else {
          vm.ontologySearchRegexp = null;
        }
      });

      /**
       * Private functions.
       */

      /**
       * Lookup ontology class details and assign them as a property of the object.
       */
      function assignClassDetails(ontologyClass) {
        if (!ontologyClass.classDetails) {
          //var selfUrl = controlledTermService.getSelfUrl(ontologyClass);
          var acronym = controlledTermDataService.getAcronym(ontologyClass);
          var classId = ontologyClass['@id'];
          controlledTermDataService.getClassById(acronym, classId).then(function (response) {
            vm.selectedValueResult.classDetails = response;
          });
        }
      }

      function assignValueSetDetails(valueSet) {
        //var acronym = controlledTermService.getLastFragmentOfUri(valueSet.sourceId);
        vm.selectedValueResult.classDetails = controlledTermDataService.getValueSetByLdId(valueSet['@id']);
      }

      function loadParentAndDetermineValueSetForValuesSearchResult(valueSet) {
        var acronym = valueSet.ontology.slice(39);
        controlledTermDataService.getClassParents(acronym, valueSet['@id']).then(function (response) {
          if (!(status in response)) {
            if (angular.isArray(response) && response.length > 0) {
              valueSet.type = 'Value';
              // take the first result assuming there will be only one parent for value sets
              valueSet.resultSource = response[0].prefLabel;
              valueSet.resultParentId = response[0]['@id'];
            }
          }
        });
      };

      function toUiType(type) {
        if (type == 'OntologyClass') {
          return 'Class';
        }
        if (type == 'ValueSet') {
          return 'Value Set';
        }
        if (type == 'Value') {
          return 'Value';
        }
        if (type == 'Ontology') {
          return 'Ontology';
        }
      }
    }
  }
});