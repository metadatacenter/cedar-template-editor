'use strict';

define([
  'angular'
], function(angular) {
  angular.module('cedar.templateEditor.controlTerm.cedarControlTermValueSetPickerDirective', [])
    .directive('cedarControlTermValueSetPicker', cedarControlTermValueSetPickerDirective);

  cedarControlTermValueSetPickerDirective.$inject = [];

  function cedarControlTermValueSetPickerDirective() {

    var directive = {
      bindToController: {
        currentOntology: '=',
        currentValueSet: '=',
        includeCreateClass: '=',
        resetCallback: '=?',
        selectedValueResult: '=',
      },
      controller: cedarControlTermValueSetPickerDirectiveController,
      controllerAs: 'cctvspdc',
      restrict: 'E',
      scope: {},
      templateUrl: 'scripts/control-term/cedar-control-term-value-set-picker.directive.html'
    };

    return directive;

    cedarControlTermValueSetPickerDirectiveController.$inject = [
      '$q',
      '$rootScope',
      '$scope',
      'controlTermDataService',
      'controlTermService'
    ];

    function cedarControlTermValueSetPickerDirectiveController($q, $rootScope, $scope, controlTermDataService, controlTermService) {
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

        // Get selected class details from the links.self endpoint provided.
        controlTermDataService.getClassDetails(subtree.links.self).then(function(response) {
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
        if (!vm.bioportalValueSetsFilter && ontology.resultType == 'Value Set') {
          return false;
        }
        if (!vm.bioportalOntologiesFilter && ontology.resultType == 'Ontology') {
          return false;
        }
        if (!vm.isSearchingOntologies) {
          return ontology;
        }

        if (vm.ontologySearchRegexp) {
          name = ontology.name;
          if (ontology.resultType == 'Value Set') {
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

      /**
       * This function should select a value search or browse value result and populate
       * all the associated data necessary to display the class details and related info.
       *
       * TODO: at least that ^^ was the intent -- it's been misbehaving recently, but
       * should be working for ontology classes...
       */
      function selectValueResult(result) {
        var acronym;

        vm.selectedValueResult = result;
        vm.valuesTreeVisibility = true;

        if (result.resultType == 'Ontology' || result.resultType == 'Ontology Class') {
          vm.browsingSection = 'ontology';
          if (result.resultType == 'Ontology') {
            vm.currentOntology = {
              'details': { 'ontology': result }
            };
            controlTermService.loadOntologyRootClasses(vm.currentOntology.details.ontology, vm);
          } else {
            vm.currentOntology = {
              'details': { 'ontology': controlTermService.getOntologyByAcronym(controlTermDataService.getOntologyAcronym(result)) }
            };
            controlTermService.loadTreeOfClass(result, vm);
          }
        } else if (result.resultType == 'Value Set' || result.resultType == 'Value Set Class') {
          vm.browsingSection = 'value_set';
          vm.searchPreloader = true;
          assignClassDetails(result);
          acronym = controlTermDataService.getOntologyAcronym(result);

          if (result.resultType == 'Value Set') {
            vm.currentValueSet = result;
          } else {
            // get the parent
            controlTermDataService.getClassParents('NLMVS', result['@id']).then(function(response) {
              vm.currentValueSet = response[0];
            });
          }

          vm.currentValueSetId = result["@id"];
          if (result.resultType == 'Value Set Class') {
            vm.currentValueSetId = result.resultParentId;
          }
          controlTermDataService.getClassValueSet(acronym, vm.currentValueSetId).then(function(valueSetClasses) {
            vm.valueSetClasses = valueSetClasses;
            angular.forEach(vm.valueSetClasses, function(valueSetClass) {
              valueSetClass.resultType = 'Value Set Class';
            });
            vm.searchPreloader = false;
          });
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
        angular.forEach($rootScope.valueSets, function(valueSet) {
          valueSet.resultType = valueSet.resultType || 'Value Set';
          // TODO: all the sources are obviously the same Ontology due to data organization;
          //   confirm with client where Source field should come from for value sets
          var valueSetOntology = controlTermService.getOntologyByAcronym(controlTermDataService.getOntologyAcronym(valueSet));
          valueSet.resultSource = valueSetOntology.name;
          browseResults.push(valueSet);
        });
        angular.forEach($rootScope.ontologies, function(ontology) {
          ontology.resultType = ontology.resultType || "Ontology";
          browseResults.push(ontology);
        });

        // Sort by title
        browseResults.sort(controlTermService.sortBrowseResults);
        vm.searchResults = browseResults;
      }

      function valuesCreateClass() {
        vm.valuesActionSelection = 'create';
      }

      function valuesSearch(event) {
        if (event) {
          event.preventDefault();
        }

        vm.searchResults = [];
        vm.searchNoResults = false;
        vm.valuesActionSelection = 'search';

        if(vm.valuesSearchTerms == '') {
          vm.searchPreloader = false;
          return;
        } else {
          vm.searchPreloader = true;
        }

        // search all
        if (vm.bioportalOntologiesFilter && vm.bioportalValueSetsFilter) {
          controlTermDataService.searchOntologyClassesValueSetsAndValueSetClasses(vm.valuesSearchTerms).then(function(response) {
            var maxLen = response.collection.length;

            vm.searchPreloader = false;

            if(maxLen > 0) {
              var searchResults = [];
              for (var i = 0; i < maxLen; i++) {
                var result = response.collection[i];
                var acronym = controlTermDataService.getOntologyAcronym(result);
                if (acronym != 'NLMVS') {
                  result.resultType = 'Ontology Class';
                  result.resultSource = acronym;
                } else {
                  result.resultType = 'Value Set'; // default to value set
                  result.resultSource = response.collection[i].prefLabel;
                  loadParentAndDetermineValueSetForValuesSearchResult(result);
                }
                searchResults.push(result);
              }
              vm.searchResults = searchResults;
            } else {
              vm.searchNoResults = true;
            }
          });

        } else {
          // search ontologies
          if (vm.bioportalOntologiesFilter) {
            controlTermDataService.searchClass(vm.valuesSearchTerms).then(function(response) {
              var maxLen = response.collection.length;
              if (maxLen > 20) {
                maxLen = 20;
              }

              vm.searchPreloader = false;

              if(maxLen > 0) {
                var searchResults = [];
                for(var i = 0; i < maxLen; i++) {
                  var result = response.collection[i];
                  result.resultType = 'Ontology Class';
                  var acronym = result.links.ontology.slice(39);
                  var ontology = controlTermService.getOntologyByAcronym(acronym);
                  if (ontology) {
                    result.resultSource = ontology.name;
                  }

                  searchResults.push(result);
                }
                vm.searchResults = searchResults;
              } else {
                vm.searchNoResults = true;
              }
            });
          }
          // search value sets
          else if (vm.bioportalValueSetsFilter) {
            controlTermDataService.searchValueSetsAndValues(vm.valuesSearchTerms).then(function(response) {
              var maxLen = response.collection.length;
              if (maxLen > 20) {
                maxLen = 20;
              }

              vm.searchPreloader = false;

              if(maxLen > 0) {
                var searchResults = [];
                for (var i = 0; i < maxLen; i++) {
                  var result = response.collection[i];
                  result.resultType = 'Value Set'; // default to value set
                  result.resultSource = response.collection[i].prefLabel;
                  loadParentAndDetermineValueSetForValuesSearchResult(result);
                  searchResults.push(result);
                }
                vm.searchResults = searchResults;
              } else {
                vm.searchNoResults = true;
              }
            });
          }
        }
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

      /**
       * Private functions.
       */

      /**
       * Lookup ontology class details and assign them as a property of the object.
       */
      function assignClassDetails(ontologyClass) {
        if (!ontologyClass.classDetails) {
          var selfUrl = ontologyClass.links.self;
          if (!selfUrl) {
            selfUrl = ontologyClass.links.ontology + "/classes/" + encodeURIComponent(ontologyClass["@id"]);
          }

          controlTermDataService.getClassDetails(selfUrl).then(function(response) {
            vm.selectedValueResult.classDetails = response;
          });
        }
      }

      function loadParentAndDetermineValueSetForValuesSearchResult (valueSet) {
        var acronym = valueSet.links.ontology.slice(39);
        controlTermDataService.getClassParents(acronym, valueSet['@id']).then(function(response) {
          if (!(status in response)) {
            if (angular.isArray(response) && response.length > 0) {
              valueSet.resultType = 'Value Set Class';
              // take the first result assuming there will be only one parent for value sets
              valueSet.resultSource = response[0].prefLabel;
              valueSet.resultParentId = response[0]['@id'];
            }
          }
        });
      };

    }
  }
});