'use strict';

define([
  'angular'
], function(angular) {
  angular.module('cedar.templateEditor.controlledTerm.provisionalClassController', [])
    .controller('provisionalClassController', provisionalClassController);

  provisionalClassController.$inject = ['$q', '$scope', '$timeout', 'provisionalClassService', 'controlledTermDataService', 'controlledTermService'];

  function provisionalClassController($q, $scope, $timeout, provisionalClassService, controlledTermDataService, controlledTermService) {
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
    vm.provisionalValueSetOntology = { details: { ontology: { name: 'Cedar Provisional Value Sets', acronym: 'CEDARVS' } } };
    vm.provisionalValueSetValues = [];
    vm.saveAsFieldItem = saveAsFieldItem;
    vm.saveAsOntologyClassValueConstraint = saveAsOntologyClassValueConstraint;
    vm.saveAsValueSetConstraint = saveAsValueSetConstraint;
    vm.searchMode = null;
    vm.startOverInner = startOverInner;
    vm.startOver = startOver;
    vm.showCreateVsLoader = false;

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
        var acronym = controlledTermService.getLastFragmentOfUri(newClass.ontology);
        controlledTermDataService.getClassById(acronym, newClass['@id']).then(function(details) {
          $scope.$emit(
            'cedar.templateEditor.controlledTerm.provisionalClassController.provisionalClassSaved', {
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
            'cedar.templateEditor.controlledTerm.provisionalClassController.provisionalClassSavedAsOntologyValueConstraint', {
              class: newClass,
              ontology: vm.provisionalClassOntology
            }
        );
      });
    }

    function saveAsValueSetConstraint(provisionalValueSet, provisionalValueSetValues) {
      vm.showCreateVsLoader = true;
      provisionalClassService.saveValueSet(provisionalValueSet, provisionalValueSetValues).then(function(newValueSet) {
        // Reload value sets cache
        controlledTermDataService.initValueSetsCache();
        // hack to add prefLabel
        if (newValueSet.label) {
          newValueSet.prefLabel = newValueSet.label;
        }
        $scope.$emit(
          'cedar.templateEditor.controlledTerm.provisionalClassController.provisionalValueSetSavedAsValueSetValueConstraint', {
            valueSet: newValueSet,
            ontology: vm.provisionalValueSetOntology
          }
        );
        vm.showCreateVsLoader = false;
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
