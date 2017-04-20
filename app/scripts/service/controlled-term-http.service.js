'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.service.controlledTermHttpService', [])
      .service('ControlledTermHttpService', ControlledTermHttpService);

  ControlledTermHttpService.$inject = ['HttpBuilderService', 'UrlService'];

  function ControlledTermHttpService(HttpBuilderService, UrlService) {

    var service = {
      serviceId: "ControlledTermHttpService"
    };

    service.getOntologies = function () {
      return HttpBuilderService.get(UrlService.getOntologies());
    };

    service.getValueSetsCollections = function () {
      return HttpBuilderService.get(UrlService.getValueSetsCollections());
    };

    service.getValueSetsCache = function () {
      return HttpBuilderService.get(UrlService.getValueSetsCache());
    };

    service.getRootClasses = function (ontology) {
      return HttpBuilderService.get(UrlService.getRootClasses(ontology));
    };

    service.createClass = function(newClass) {
      return HttpBuilderService.post(UrlService.createClass(), angular.toJson(newClass));
    };

    service.getClassById = function (acronym, classId) {
      return HttpBuilderService.get(UrlService.getClassById(acronym, classId));
    };

    service.createValue = function(vsId, value) {
      return HttpBuilderService.post(UrlService.createValue(vsId), angular.toJson(value));
    };

    service.createValueSet = function(valueSet) {
      return HttpBuilderService.post(UrlService.createValueSet(), angular.toJson(valueSet));
    };

    service.getValueSetById = function (vsId) {
      return HttpBuilderService.get(UrlService.getValueSetById(vsId));
    };

    service.getValueTree = function (vsId, vsCollection) {
      return HttpBuilderService.get(UrlService.getValueTree(vsId, vsCollection));
    };

    service.getValueSetTree = function (valueId, vsCollection) {
      return HttpBuilderService.get(UrlService.getValueSetTree(valueId, vsCollection));
    };

    service.getAllValuesInValueSetByValue = function (valueId, vsCollection) {
      return HttpBuilderService.get(UrlService.getAllValuesInValueSetByValue(valueId, vsCollection));
    };

    service.getClassChildren = function (acronym, classId) {
      return HttpBuilderService.get(UrlService.getClassChildren(acronym, classId));
    };

    service.getClassDescendants = function (acronym, classId) {
      return HttpBuilderService.get(UrlService.getClassDescendants(acronym, classId));
    };

    service.getClassById = function (acronym, classId) {
      return HttpBuilderService.get(UrlService.getClassById(acronym, classId));
    };

    service.getPropertyById = function (acronym, propertyId) {
      return HttpBuilderService.get(UrlService.getPropertyById(acronym, propertyId));
    };

    service.getValueById = function (acronym, valueId) {
      return HttpBuilderService.get(UrlService.getValueById(acronym, valueId));
    };

    service.getClassParents = function (acronym, classId) {
      return HttpBuilderService.get(UrlService.getClassParents(acronym, classId));
    };

    service.getClassTree = function (acronym, classId) {
      return HttpBuilderService.get(UrlService.getClassTree(acronym, classId));
    };

    service.getPropertyTree = function (acronym, propertyId) {
      return HttpBuilderService.get(UrlService.getPropertyTree(acronym, propertyId));
    };

    service.getValuesInValueSet = function (vsCollection, vsId) {
      return HttpBuilderService.get(UrlService.getValuesInValueSet(vsCollection, vsId));
    };

    service.searchClasses = function (query, sources, size) {
      return HttpBuilderService.get(UrlService.searchClasses(query, sources, size));
    };

    service.searchProperties = function (query, sources, size) {
      return HttpBuilderService.get(UrlService.searchProperties(query, sources, size));
    };

    service.searchClassesAndValues = function (query, sources, size) {
      return HttpBuilderService.get(UrlService.searchClassesAndValues(query, sources, size));
    };

    service.searchClassesValueSetsAndValues = function (query, sources, size) {
      return HttpBuilderService.get(UrlService.searchClassesValueSetsAndValues(query, sources, size));
    };

    service.searchValueSetsAndValues = function (query, sources, size) {
      return HttpBuilderService.get(UrlService.searchValueSetsAndValues(query, sources, size));
    };

    service.searchValueSets = function (query, sources, size) {
      return HttpBuilderService.get(UrlService.searchValueSets(query, sources, size));
    };

    service.autocompleteOntology = function (query, acronym) {
      return HttpBuilderService.get(UrlService.autocompleteOntology(query, acronym));
    };

    service.autocompleteOntologySubtree = function (query, acronym, subtree_root_id, max_depth) {
      return HttpBuilderService.get(UrlService.autocompleteOntologySubtree(query, acronym, subtree_root_id, max_depth));
    };

    return service;
  }

});
