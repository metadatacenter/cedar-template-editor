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
        var acronym = controlTermService.getAcronym(subtree);
        var classId = subtree['@id'];
        // Get selected class details from the links.self endpoint provided.
        controlTermDataService.getClassDetails(acronym, classId).then(function(response) {
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

        if (result.type == 'Ontology' || result.type == 'OntologyClass') {
          vm.browsingSection = 'ontology';
          if (result.type == 'Ontology') {
            vm.currentOntology = {
              'details': { 'ontology': result }
            };
            controlTermService.loadOntologyRootClasses(vm.currentOntology.details.ontology, vm);
          } else {
            vm.currentOntology = {
              'details': { 'ontology': controlTermDataService.getOntologyById(controlTermDataService.getAcronym(result)) }
            };
            controlTermService.loadTreeOfClass(result, vm);
          }
        } else if (result.type == 'ValueSet' || result.type == 'Value') {
          vm.browsingSection = 'value_set';
          vm.searchPreloader = true;
          assignValueSetDetails(result);
          acronym = controlTermDataService.getAcronym(result);

          if (result.type == 'ValueSet') {
            vm.currentValueSet = result;
          } else {
            // get the parent
            controlTermDataService.getClassParents('NLMVS', result['@id']).then(function(response) {
              vm.currentValueSet = response[0];
            });
          }

          vm.currentValueSetId = result["@id"];
          if (result.type == 'Value') {
            vm.currentValueSetId = result.resultParentId;
          }
          controlTermDataService.getClassValueSet(acronym, vm.currentValueSetId).then(function(valueSetClasses) {
            vm.valueSetClasses = valueSetClasses;
            angular.forEach(vm.valueSetClasses, function(valueSetClass) {
              valueSetClass.type = 'Value';
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
        //angular.forEach($rootScope.valueSets, function(valueSet) {
        //  valueSet.resultType = valueSet.resultType || 'Value Set';
        //  // TODO: all the sources are obviously the same Ontology due to data organization;
        //  //   confirm with client where Source field should come from for value sets
        //  var valueSetOntology = controlTermService.getOntologyByAcronym(controlTermDataService.getOntologyAcronym(valueSet));
        //  valueSet.resultSource = valueSetOntology.name;
        //  browseResults.push(valueSet);
        //});
        //angular.forEach($rootScope.ontologies, function(ontology) {
        //  ontology.resultType = ontology.resultType || "Ontology";
        //  browseResults.push(ontology);
        //});
        //
        //// Sort by title
        //browseResults.sort(controlTermService.sortBrowseResults);
        //vm.searchResults = browseResults;

        /*** My code ***/

        $q.all({
          ontologies: controlTermDataService.getAllOntologies(),
          valueSets : controlTermDataService.getAllValueSets()
        }).then(function(result) {
          angular.forEach(result.valueSets, function(valueSet) {
            //valueSet.resultType = valueSet.resultType || 'ValueSet';
            // TODO: all the sources are obviously the same Ontology due to data organization;
            //   confirm with client where Source field should come from for value sets
            //var valueSetOntology = controlTermService.getOntologyByAcronym(controlTermDataService.getOntologyAcronym(valueSet));
            //valueSet.resultSource = valueSetOntology.name;
            browseResults.push(valueSet);
          });
          angular.forEach(result.ontologies, function(ont) {
            //ontology.resultType = ontology.resultType || "Ontology";
            //ont.resultType = ont.type;
            browseResults.push(ont);
          });

          // Sort by title
          browseResults.sort(controlTermService.sortBrowseResults);
          vm.searchResults = browseResults;
        });





        /*** End of My code ***/

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
                var acronym = controlTermDataService.getAcronym(result);
                if (acronym != 'NLMVS') {
                  result.type = 'OntologyClass';
                  result.resultSource = acronym;
                } else {
                  result.type = 'ValueSet'; // default to value set
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
                  result.type = 'OntologyClass';
                  var acronym = result.links.ontology.slice(39);
                  var ontology = controlTermDataService.getOntologyById(acronym);
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
                  result.type = 'ValueSet'; // default to value set
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
          //var selfUrl = controlTermService.getSelfUrl(ontologyClass);
          var acronym = controlTermDataService.getAcronym(ontologyClass);
          var classId = ontologyClass['@id'];
          console.log(">>>>>>>ONTOLOGY CLASS");
          console.log(ontologyClass);
          controlTermDataService.getClassById(acronym, classId).then(function(response) {
            vm.selectedValueResult.classDetails = response;
          });
        }
      }

      function assignValueSetDetails(valueSet) {
        console.log(">>>>>>>VALUE SET");
        console.log(valueSet);
        //if (!ontologyClass.classDetails) {
        var acronym = controlTermDataService.getAcronym(valueSet);
        //var valueSetId = valueSet['@id'];
          //var selfUrl = controlTermService.getSelfUrl(valueSet);
          //controlTermDataService.getValueSetById(valueSet.id).then(function(response) {
          //  vm.selectedValueResult.classDetails = response;
          //});
        vm.selectedValueResult.classDetails = controlTermDataService.getValueSetById(valueSet.id);
        //}
      }

      function loadParentAndDetermineValueSetForValuesSearchResult (valueSet) {
        var acronym = valueSet.links.ontology.slice(39);
        controlTermDataService.getClassParents(acronym, valueSet['@id']).then(function(response) {
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

    }
  }
});