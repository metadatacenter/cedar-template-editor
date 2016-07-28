'use strict';

define([
  'angular'
], function(angular) {
  angular.module('cedar.templateEditor.controlTerm.provisionalClassController', [])
    .controller('provisionalClassController', provisionalClassController);

  provisionalClassController.$inject = ['$q', '$scope', '$timeout', 'provisionalClassService', 'controlTermDataService', 'controlTermService'];

  function provisionalClassController($q, $scope, $timeout, provisionalClassService, controlTermDataService, controlTermService) {
    var vm = this;

    vm.addValueToValueSet = addValueToValueSet;
    vm.createProvisionalClassMapping = createProvisionalClassMapping;
    vm.deleteProvisionalClassMapping = deleteProvisionalClassMapping;
    vm.deleteProvisionalValueSetValue = deleteProvisionalValueSetValue;
    vm.isMappingExistingClasses = false;
    vm.isValid = isValid;
    vm.provisionalClass = {};
    vm.provisionalClassOntology = { details: { ontology: { name: 'Cedar Provisional Classes', acronym: 'CEDARPC' } } };
    vm.provisionalClassMappings = [];
    vm.provisionalClassMappingTypes = [
      { id: 'http://www.w3.org/2004/02/skos/core#closeMatch', label: 'close match' },
      { id: 'http://www.w3.org/2004/02/skos/core#exactMatch', label: 'exact match' },
      { id: 'http://www.w3.org/2004/02/skos/core#broadMatch', label: 'broad match' },
      { id: 'http://www.w3.org/2004/02/skos/core#narrowMatch', label: 'narrow match' },
      { id: 'http://www.w3.org/2000/01/rdf-schema#subclassOf', label: 'subclass of' }
    ];
    vm.provisionalValueSetOntology = { details: { ontology: { name: 'Cedar Provisional Value Sets', acronym: 'CEDARVS' } } };
    vm.provisionalValueSetValues = [];
    vm.saveAsFieldItem = saveAsFieldItem;
    vm.saveAsOntologyClassValueConstraint = saveAsOntologyClassValueConstraint;
    vm.saveAsValueSetConstraint = saveAsValueSetConstraint;
    vm.startOverInner = startOverInner;
    vm.startOver = startOver;

    /**
     * Scope functions.
     */

    function addValueToValueSet(targetClass) {
      vm.provisionalValueSetValues.push(targetClass);
      // hack to reset inner picker
      $timeout(function() {
        $('div.add-values-to-value-set button.btn-start-over').click();
      });
    }

    function createProvisionalClassMapping(mappingType, targetClass, targetOntology) {
      vm.provisionalClassMappings.push({
        mappingType: mappingType,
        targetClass: targetClass,
        targetOntology: targetOntology.info
      });
      // hack to reset inner picker
      $timeout(function() {
        $('div.map-existing-classes button.btn-start-over').click();
      });
    }

    function deleteProvisionalValueSetValue(index) {
      vm.provisionalValueSetValues.splice(index, 1);
    }

    function deleteProvisionalClassMapping(index) {
      vm.provisionalClassMappings.splice(index, 1);
    }

    function isValid() {
      return vm.provisionalClass.prefLabel && vm.provisionalClass.description;
    }

    function saveAsFieldItem(provisionalClass) {
      provisionalClassService.saveClass(provisionalClass, vm.provisionalClassMappings).then(function(newClass) {
        var acronym = controlTermService.getLastFragmentOfUri(newClass.ontology);
        controlTermDataService.getClassById(acronym, newClass['@id']).then(function(details) {
          $scope.$emit(
            'cedar.templateEditor.controlTerm.provisionalClassController.provisionalClassSaved', {
              class: details,
              ontology: vm.provisionalClassOntology
            }
          );
        });
      });
    }

    function saveAsOntologyClassValueConstraint(provisionalClass) {
      provisionalClassService.saveClass(provisionalClass, vm.provisionalClassMappings).then(function(newClass) {
        $scope.$emit(
            'cedar.templateEditor.controlTerm.provisionalClassController.provisionalClassSavedAsOntologyValueConstraint', {
              class: newClass,
              ontology: vm.provisionalClassOntology
            }
        );
      });
    }

    function saveAsValueSetConstraint(provisionalValueSet, provisionalValueSetValues) {
      provisionalClassService.saveValueSet(provisionalValueSet, provisionalValueSetValues).then(function(newValueSet) {
        // Reload value sets cache
        console.log("Reloading value sets cache");
        controlTermDataService.initValueSetsCache();
        // hack to add prefLabel
        if (newValueSet.label) {
          newValueSet.prefLabel = newValueSet.label;
        }
        $scope.$emit(
          'cedar.templateEditor.controlTerm.provisionalClassController.provisionalValueSetSavedAsValueSetValueConstraint', {
            valueSet: newValueSet,
            ontology: vm.provisionalValueSetOntology
          }
        );
      });
    }

    function startOverInner() {
      vm.pickedOntologyClass = null;
      vm.provisionalClassMappingType = null;
    }

    function startOver() {
      vm.pickedOntologyClass = null;
      vm.provisionalClassMappings = [];
      vm.provisionalClassMappingType = null;
    }

  }

});
