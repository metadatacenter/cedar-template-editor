'use strict';

define([
      'angular',
      'cedar/template-editor/controlled-term/provisional-class.controller'
    ], function (angular) {
      angular.module('cedar.templateEditor.controlledTerm.controlledTermSearchDirective',
          ['ngTagsInput', 'uiSwitch', 'cedar.templateEditor.controlledTerm.provisionalClassController'])
          .directive('controlledTermSearch', controlledTermSearchDirective);

      controlledTermSearchDirective.$inject = ["StringUtilsService"];

      function controlledTermSearchDirective(StringUtilsService) {
        var directive = {
          bindToController: {
            model: '=',

            isLoadingClassDetails: '=',
            isCreatingMappings   : '=',
            isCreatingVs         : '=',
            treeVisible          : '=',
            creatingObject       : '=',
            mappingObject        : '=',

            resetCallback      : '=?',
            addPropertyCallback: '=?',
            addClassCallback   : '=?',
            addValueCallback   : '=?',
            addValueSetCallback: '=?',
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
          '$timeout',
          'controlledTermDataService'
        ];

        function controlledTermSearchDirectiveController($q, $rootScope, $scope, $timeout, controlledTermService,
                                                         controlledTermDataService) {
          /* Variable declarations */
          var vm = this;

          //vm.action = vm.action || 'search'; // Possible actions: search, create
          vm.allOntologies = [];

          // vm.isCreatingValue = true;
          // vm.isCreatingValueSet = false;
          vm.isLoadingOntologyDetails = false;
          vm.loadingOntologies = false;
          vm.ontologiesFound = [];
          vm.ontologySearchRegexp = null;
          vm.resultsFound = null;
          vm.searchFinished = null;

          vm.searchOptionsVisible = false;
          vm.selectedResultId = null;
          vm.selectedOntologies = [];
          vm.showSearchPreloader = false;
          vm.showEmptyQueryMsg = false;


          vm.model.scope = (vm.model.mode == 'property' ? 'properties' : 'classes');

          vm.isopen = true;


          /* Function declarations */
          vm.changeSearchScope = changeSearchScope;
          vm.changeSearchOptionsVisibility = changeSearchOptionsVisibility;
          vm.changeTreeVisibility = changeTreeVisibility;
          vm.checkIfSelected = checkIfSelected;
          vm.getShortId = getShortId;
          vm.getTypeForUi = getTypeForUi;
          vm.isCreating = isCreating;
          vm.isEmptySearchQuery = isEmptySearchQuery;
          vm.isFieldPropertiesMode = isFieldPropertiesMode;
          vm.isFieldTypesMode = isFieldTypesMode;
          vm.isFieldValuesMode = isFieldValuesMode;
          vm.setFieldPropertiesMode = setFieldPropertiesMode;
          vm.setFieldTypesMode = setFieldTypesMode;
          vm.setFieldValuesMode = setFieldValuesMode;
          vm.isSearching = isSearching;
          vm.isTypeClass = isTypeClass;
          vm.isTypeProperty = isTypeProperty;
          vm.getDefaultSearchQuery = getDefaultSearchQuery;
          vm.getClassDetails = getClassDetails;
          vm.getPropertyDetails = getPropertyDetails;
          vm.getShortText = getShortText;
          vm.hideTree = hideTree;
          vm.isCurrentOntology = isCurrentOntology;
          vm.isSearchingClasses = isSearchingClasses;
          vm.isSearchingOntologies = isSearchingOntologies;
          vm.isSearchingValueSets = isSearchingValueSets;
          vm.isSearchingProperties = isSearchingProperties;
          vm.onTextClick = onTextClick;
          vm.reset = reset;
          vm.search = search;
          vm.searchOntologies = searchOntologies;
          vm.selectResult = selectResult;
          vm.selectOntology = selectOntology;
          vm.showTree = showTree;
          vm.startSearch = startSearch;
          // vm.switchToCreate = switchToCreate;
          // vm.switchToSearch = switchToSearch;
          vm.switchToCreateValue = switchToCreateValue;
          vm.switchToCreateValueSet = switchToCreateValueSet;
          vm.endSearch = endSearch;
          vm.getLabels = getLabels;
          vm.allowsProperty = allowsProperty;
          vm.allowsField = allowsField;
          vm.allowsValue = allowsValue;



          vm.propertyLabel = '';
          vm.propertyDescription = '';



          function allowsProperty() {
            return vm.model.range && vm.model.range.includes("property");
          }

          function allowsField() {
            return vm.model.range && vm.model.range.includes("field");
          }

          function allowsValue() {
            return vm.model.range && vm.model.range.includes("value");

          }


          /**
           * Search-related functions
           */

          function search(event) {
            reset(true, true, true, true, true);
            if (isEmptySearchQuery() == false) {
              vm.showEmptyQueryMsg = false;
              var searchProperties = false;
              var searchClasses = true;
              var searchValues = true;
              var searchValueSets = false;
              if (isFieldPropertiesMode()) {
                searchProperties = true;
                searchClasses = false;
                searchValues = false;
                searchValueSets = false;
              }
              if (isFieldTypesMode()) {
                searchProperties = false;
                searchClasses = true;
                searchValues = false;
                searchValueSets = false;
              }
              else if ((isFieldValuesMode()) && (!isSearchingValueSets())) {
                searchProperties = false;
                searchClasses = true;
                searchValues = true;
                searchValueSets = false;
              }
              else if ((isFieldValuesMode()) && (isSearchingValueSets())) {
                searchProperties = false;
                searchClasses = false;
                searchValues = false;
                searchValueSets = true;
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
              bioportalSearch(vm.searchQuery, sources, maxResults, searchClasses, searchValues,
                  searchValueSets, searchProperties).then(function (response) {
                if (response.collection && response.collection.length > 0) {
                  var tArry = [], i;
                  for (var i = 0; i < response.collection.length; i += 1) {
                    var source = null;
                    if (isTypeClass(response.collection[i].type) || isTypeProperty(response.collection[i].type)) {
                      source = controlledTermDataService.getOntologyByLdId(response.collection[i].source);
                    }
                    else if (isTypeValue(response.collection[i].type) || isTypeValueSet(response.collection[i].type)) {
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
            vm.model.action = 'search';

          }

          function endSearch() {
            vm.searchFinished = true;
          }

          function getLabels(arr) {
            var result = '';
            for (var i = 0; i < arr.length; i++) {
              result += (arr[i] + ', ');
            }
            return result.trim().replace(/,\s*$/, "");
          }

          function bioportalSearch(query, sources, maxResults, searchClasses, searchValues, searchValueSets,
                                   searchProperties) {
            if ((searchProperties)) {
              return controlledTermDataService.searchProperties(query, sources, maxResults).then(function (response) {
                return response;
              });
            }
            if ((searchClasses) && (!searchValues) && (!searchValueSets)) {
              return controlledTermDataService.searchClasses(query, sources, maxResults).then(function (response) {
                return response;
              });
            }
            else if ((searchClasses) && (searchValues) && (!searchValueSets)) {
              return controlledTermDataService.searchClassesAndValues(query, sources, maxResults).then(function (response) {
                return response;
              });
            }
            else if ((!searchClasses) && (!searchValues) && (searchValueSets)) {
              return controlledTermDataService.searchValueSets(query, sources, maxResults).then(function (response) {
                return response;
              });
            }
          };

          function getDefaultSearchQuery() {
            return vm.model.salt;
          }

          function changeSearchScope() {
            reset(true, true, true, true, true);
            if (isSearchingOntologies()) {
              loadOntologies(vm.searchQuery);
            }
            else if (isSearchingProperties() || isSearchingClasses() || isSearchingValueSets()) {
              search();
            }
          }

          /**
           * Reset
           */


          function reset(keepSearchScope, keepCreationMode, keepSearchQuery, keepOntologies, keepSelectedOntologies) {
            console.log('reset');
            if (!keepSearchScope) {
              vm.model.scope = (vm.model.mode == 'property' ? "properties" : "classes");
              vm.searchOptionsVisible = false;
            }
            if (!keepCreationMode) {
              vm.isCreatingValue = true;
              vm.isCreatingValueSet = false;
              // Note that we don't want to re-initialize vm.isCreatingMappings to false here because its value is passed to the directive
            }
            if (!keepSearchQuery) {
              vm.searchQuery = '';
            }
            if (!keepOntologies) {
              vm.allOntologies = [];
              vm.ontologiesFound = [];
            }
            if (!keepSelectedOntologies) {
              vm.selectedOntologies = [];
            }
            //vm.action = 'search';
            vm.ontologySearchRegexp = null;
            vm.resultsFound = null;
            vm.searchResults = [];
            vm.searchFinished = null;
            vm.selectedResultId = null;
            vm.showEmptyQueryMsg = false;
            vm.showSearchPreloader = false;
            vm.treeVisible = false;
            vm.model.selectedClass = null;
            vm.isLoadingOntologyDetails = false;
            vm.loadingOntologies = false;

            if (typeof vm.resetCallback === "function") {
              vm.resetCallback();
            }

            vm.propertyLabel = '';
            vm.propertyDescription = '';
          }

          /**
           * Other useful functions
           */

          function isFieldPropertiesMode() {
            return vm.model.mode == 'property';
          }

          function isFieldTypesMode() {
            return vm.model.mode == 'field';
          }

          function isFieldValuesMode() {
            return vm.model.mode == 'value';
          }

          function setFieldPropertiesMode() {
            vm.model.mode = 'property';
            vm.model.scope = 'properties';
            //vm.action = 'search';
          }

          function setFieldTypesMode() {
            vm.model.mode = 'field';
            vm.model.scope = 'classes';
            //vm.action = 'search';
          }

          function setFieldValuesMode() {
            vm.model.mode = 'value';
            vm.model.scope = 'classes';
            //vm.action = 'search';
            console.log('setFIeldValuesMode', vm.model.action);
          }

          //setTab('values');

          function isSearching() {
            return (vm.model.action == 'search');
          }

          function isSearchingClasses() {
            return (vm.model.action == 'search' && vm.model.scope == 'classes');
          }

          function isSearchingOntologies() {
            return (vm.model.action == 'search' && vm.model.scope == 'ontologies');
          }

          function isSearchingValueSets() {
            return (vm.model.action == 'search' && vm.model.scope == 'value-sets');
          }

          function isSearchingProperties() {
            return (vm.model.action == 'search' && vm.model.scope == 'properties');
          }

          function isCreating() {
            return (vm.model.action == 'create');
          }

          function isEmptySearchQuery() {
            return (vm.searchQuery == '' || vm.searchQuery == null);
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


          function handleClose(close) {
            console.log('handleClose');
            if (close) {
              if (vm.isSearchingClasses()) {
                if (vm.isFieldTypesMode() && (typeof vm.addClassCallback === "function")) {
                  vm.addClassCallback(vm.model.selectedClass, vm.model.currentOntology);
                } else if (vm.isFieldValuesMode() && (typeof vm.addValueCallback === "function")) {
                  vm.addValueCallback();
                }
              }

              if (vm.isSearchingProperties() && (typeof vm.addPropertyCallback === "function")) {
                vm.addPropertyCallback(vm.model.selectedClass.id, vm.model.selectedClass.prefLabel,
                    vm.model.selectedClass.definition);
              }

              if (vm.isSearchingValueSets() && (typeof vm.addValueSetCallback === "function")) {
                vm.addValueSetCallback();
              }

              if (typeof vm.resetCallback === "function") {
                vm.resetCallback();
              }
            }
          }


          // select this thingy, then optionally close(clear) the dialog
          function selectResult(selection, resultId, close) {
            // Set the basic fields for the selected class and ontology in order to show the info of the selected class while the rest of details are being loaded
            vm.model.selectedClass = {};
            vm.model.currentOntology = {};
            vm.model.currentOntology.info = {};
            console.log('selectResult', vm.isSearchingProperties(), vm.isSearchingClasses(), vm.isSearchingValueSets());

            if (vm.isSearchingClasses()) {
              vm.model.selectedClass.prefLabel = selection.prefLabel;
              vm.model.currentOntology.info.id = selection.source.id;
              vm.selectedResultId = resultId;
              if (selection.details.type == 'OntologyClass') {
                controlledTermService.loadTreeOfClass(selection.details, vm);
                handleClose(close);
              } else if (selection.details.type == 'Value') {
                controlledTermService.loadTreeOfValue(selection.details, vm);
                handleClose(close);
              }
            }

            if (vm.isSearchingProperties()) {
              vm.model.selectedClass.id = selection.details.id;
              vm.model.selectedClass.prefLabel = selection.prefLabel;
              vm.model.selectedClass.definition = selection.details.definition;
              vm.model.currentOntology.info.id = selection.source.id;
              vm.selectedResultId = resultId;
              controlledTermService.loadTreeOfProperty(selection.details, vm);
              handleClose(close);
            }

            if (vm.isSearchingValueSets()) {
              vm.model.selectedClass.prefLabel = selection.prefLabel;
              vm.model.currentOntology.info.id = selection.source.id;
              vm.selectedResultId = resultId;
              if (selection.details.type == 'ValueSet') {
                controlledTermService.loadTreeOfValueSet(selection.details, vm);
                handleClose(close);
              }
            }
          }

          function selectOntology(selection) {
            vm.model.currentOntology = selection;
            vm.isLoadingOntologyDetails = true;
            vm.model.selectedClass = null;
            vm.classDetails = null;
            vm.treeVisible = true;
            if (!isFieldPropertiesMode()) {
              controlledTermService.loadOntologyRootClasses(selection, vm).then(function (response) {
                vm.isLoadingOntologyDetails = false;
              });
            }
            else {
              controlledTermService.loadOntologyRootProperties(selection, vm).then(function (response) {
                vm.isLoadingOntologyDetails = false;
              });
            }
          }

          function isCurrentOntology() {
            return vm.model.currentOntology && vm.model.currentOntology != '';
          }

          /* Used in ontology tree directive. */
          /* This function is passed as a callback down through class tree and child tree directives */
          function checkIfSelected(subtree) {
            if (!subtree) {
              return false;
            }
            var spl = subtree["@id"];
            var st;
            if (vm.smodel.electedClass && vm.model.selectedClass["@id"]) {
              st = vm.model.selectedClass["@id"];
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

          $scope.$on('cedar.templateEditor.controlledTerm.switchScope', function (event, args) {
                console.log('switchScope');
                var scope = args[0];
                var action = args[1];
                reset(false, false, false, false, true);
                // vm.action = action;
                vm.creatingObject = (action == 'search') ? null : 'value';
              }
          );

          // function switchToCreate(scope) {
          //   reset(false, false, false, false, true);
          //   vm.action = 'create';
          //   vm.searchScope = scope;
          // }
          //
          // function switchToSearch(scope) {
          //   reset(false, false, false, false, true);
          //   vm.action = 'search';
          //   vm.searchScope = scope;
          // }

          function switchToCreateValue() {

            vm.creatingObject = 'value';
            // vm.isCreatingValue = true;
            // vm.isCreatingValueSet = false;


          }

          function switchToCreateValueSet() {
            vm.creatingObject = 'value-set';
            // vm.isCreatingValue = false;
            // vm.isCreatingValueSet = true;

          }

          /* This function is passed as a callback down through class tree and child tree directives */
          function getClassDetails(subtree) {
            var acronym = controlledTermService.getAcronym(subtree);
            var classId = subtree['@id'];

            // Get selected class details from the links.self endpoint provided.
            vm.model.selectedClass = subtree;
            controlledTermDataService.getClassById(acronym, classId).then(function (response) {
              vm.classDetails = response;
            });
          }

          function getShortText(text, maxLength, finalString, emptyString) {
            return StringUtilsService.getShortText(text, maxLength, finalString, emptyString);
          }

          /* Hide Ontology Tree and Details */
          function hideTree() {
            vm.treeVisible = false;
            vm.model.currentOntology = '';
            vm.classDetails = '';
          }

          /* This function is passed as a callback down through class tree and child tree directives */
// TODO: update names to say 'property' instead of 'class'.
          function getPropertyDetails(subtree) {
            var acronym = controlledTermService.getAcronym(subtree);
            var classId = subtree['@id'];

            // Get selected class details from the links.self endpoint provided.
            // TODO: fix naming of variables. We are using class in some places where we should use property. An example is the following line
            vm.model.selectedClass = subtree;

            controlledTermDataService.getPropertyById(acronym, classId).then(function (response) {
              vm.classDetails = response;
            });
          }

          function getShortText(text, maxLength, finalString, emptyString) {
            return StringUtilsService.getShortText(text, maxLength, finalString, emptyString);
          }

          /* Hide Ontology Tree and Details */
          function hideTree() {
            vm.treeVisible = false;
            vm.model.currentOntology = '';
            vm.classDetails = '';
          }

          /**
           * Watch functions
           */

          /* Ensures that the fieldName search query is updated when the field name is updated */
          $scope.$watch(function () {
                return vm.model.salt;
              },
              function (value) {
                vm.model.salt = value;
                vm.searchQuery = value;
              });

          $scope.$watch(function () {
                return vm.searchQuery;
              },
              function () {
                if (isSearchingProperties() || isSearchingClasses() || isSearchingValueSets()) {
                  search();
                }
                else if (isSearchingOntologies()) {
                  reset(true, true, true, true, true);
                  loadOntologies(vm.searchQuery);
                  //searchRegexp(vm.searchQuery);
                }
              });

          /**
           * Util functions
           */

          function getShortId(uri, maxLength) {
            return StringUtilsService.getShortId(uri, maxLength);
          }

          function isTypeClass(type) {
            if (type == "OntologyClass") return true;
            else return false;
          }

          function isTypeValueSet(type) {
            if (type == "ValueSet") return true;
            else return false;
          }

          function isTypeValue(type) {
            if (type == "Value") return true;
            else return false;
          }

          function isTypeProperty(type) {
            if ((type == "ObjectProperty") || (type == "DatatypeProperty") || (type == "AnnotationProperty")) return true;
            else return false;
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
            else if (type == 'DatatypeProperty') {
              return ('Datatype Property');
            }
            else if (type == 'ObjectProperty') {
              return ('Object Property');
            }
            else if (type == 'AnnotationProperty') {
              return ('Annotation Property');
            }
          }

          function onTextClick(event) {
            event.target.select();
          }




        }
      }
    }
);

