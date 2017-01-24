'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.controlledTerm.provisionalClassService', [])
      .factory('provisionalClassService', provisionalClassService);

  provisionalClassService.$inject = ['$http', '$q', 'UrlService', 'controlledTermDataService'];

  function provisionalClassService($http, $q, UrlService, controlledTermDataService) {
    var base = null;
    var http_default_config = {};

    var service = {
      getValueSet             : getValueSet,
      getValueSetValues       : getValueSetValues,
      init                    : init,
      saveClass               : saveClass,
      saveValue               : saveValue,
      saveValueSet            : saveValueSet,
      serviceId               : 'provisionalClassService'
    };

    return service;

    /**
     * Initialize service.
     */
    function init() {
      base = UrlService.terminology();
      http_default_config = {};
    }

    /**
     * Service methods.
     */

    function getValueSet(vsId) {
      return controlledTermDataService.getNotCachedValueSetById(vsId);
    }

    function getValueSetValues(vsId) {
      return controlledTermDataService.getValuesInValueSet("CEDARVS", vsId);
    }

    function saveClass(newClass, mappings) {
      var payload = {
        'prefLabel'  : newClass.prefLabel,
        'creator'    : 'http://data.bioontology.org/users/cedar-mjd',
        "definitions": [newClass.description],
        "synonyms"   : [],
        "subclassOf" : null,
        "relations"  : []
      };
      if (mappings.length) {
        for (var i = 0; i < mappings.length; i++) {
          payload['relations'].push({
            relationType       : mappings[i].mappingType['id'],
            targetClassId      : mappings[i].targetClass['@id'],
            targetClassOntology: mappings[i].targetOntology['@id']
          });
        }
      }
      return controlledTermDataService.createClass(payload);
    }

    function saveValue(vsId, newValue) {
      var payload = {
        'creator'    : 'http://data.bioontology.org/users/cedar-mjd',
        'definitions': newValue.definition,
        'prefLabel'  : newValue.prefLabel,
      };
      return controlledTermDataService.createValue(vsId, payload);
    }

    function saveValueSet(newValueSet, newValues) {
      var payload = {
        'creator'    : 'http://data.bioontology.org/users/cedar-mjd',
        'definitions': [newValueSet.description],
        'prefLabel'  : newValueSet.prefLabel,
      };
      return controlledTermDataService.createValueSet(payload).then(function (valueSetCreateResponse) {
        if (newValues && newValues.length > 0) {
          var promises = [];
          for (var i = 0; i < newValues.length; i++) {
            promises.push(saveValue(valueSetCreateResponse['@id'], newValues[i]));
          }
          return $q.all(promises).then(function (valueResponses) {
            return getValueSet(valueSetCreateResponse['id']);
          });
        } else {
          return valueSetCreateResponse;
        }
      }).catch(function (err) {
        return err;
      });
    }

  }

});