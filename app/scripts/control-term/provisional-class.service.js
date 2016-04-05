'use strict';

define([
  'angular',
  'json!config/provisional-class-service.conf.json'
], function(angular, config) {
  angular.module('cedar.templateEditor.controlTerm.provisionalClassService', [])
    .factory('provisionalClassService', provisionalClassService);

  provisionalClassService.$inject = ['$http', '$q', 'UrlService', 'controlTermDataService'];

  function provisionalClassService($http, $q, UrlService, controlTermDataService) {
    var apiKey              = null;
    var base                = null;
    var http_default_config = {};

    var service = {
      getAllProvisionalClasses: getAllProvisionalClasses,
      getValueSet: getValueSet,
      getValueSetValues: getValueSetValues,
      init: init,
      saveClass: saveClass,
      saveValue: saveValue,
      saveValueSet: saveValueSet,
      serviceId: 'provisionalClassService'
    };

    return service;

    /**
     * Initialize service.
     */
    function init() {
      apiKey = config.apiKey;
      base = UrlService.terminology();
      http_default_config = {
        'headers': {
          'Authorization': 'apikey=' + apiKey
        }
      }
    }

    /**
     * Service methods.
     */

    function getAllProvisionalClasses() {
      var endpoint = base + '/bioportal/classes/provisional';
      return $http.get(endpoint, http_default_config).then(function(response) {
        return response.data;
      }).catch(function(error) {
        return error;
      });
    }

    function getValueSet(valueSetId) {
      var endpoint = base + '/bioportal/vs-collections/CEDARVS/value-sets/' + encodeURIComponent(valueSetId);
      return $http.get(endpoint, http_default_config).then(function(response) {
        return response.data;
      }).catch(function(error) {
        return error;
      });
    }

    function getValueSetValues(valueSetId) {
      var endpoint = base + '/bioportal/vs-collections/CEDARVS/value-sets/' + encodeURIComponent(valueSetId) + '/values';
      return $http.get(endpoint, http_default_config).then(function(response) {
        return response.data;
      }).catch(function(error) {
        return error;
      });
    }

    function saveClass(newClass, mappings) {
      var endpoint = base + '/bioportal/ontologies/CEDARPC/classes';
      var payload = {
        'prefLabel': newClass.prefLabel,
        'creator': 'http://data.bioontology.org/users/cedar-mjd',
        "definitions": [newClass.description],
        "synonyms": [],
        "subclassOf": null,
        "relations": []
      };
      if (mappings.length) {
        for (var i = 0; i < mappings.length; i++) {
          payload['relations'].push({
            relationType: mappings[i].mappingType['id'],
            targetClassId: mappings[i].targetClass['@id'],
            targetClassOntology: mappings[i].targetOntology['@id']
          });
        }
      }
      return $http.post(endpoint, payload, http_default_config).then(function(response) {
        return response.data;
      }).catch(function(err) {
        return err;
      });
    }

    function saveValue(valueSetId, newValue) {
      var endpoint = base + '/bioportal/vs-collections/CEDARVS/value-sets/' + encodeURIComponent(valueSetId) + '/values';
      var payload = {
        'creator': 'http://data.bioontology.org/users/cedar-mjd',
        'definitions': newValue.definition,
        'prefLabel': newValue.prefLabel,
      };
      return $http.post(endpoint, payload, http_default_config).then(function(response) {
        return response.data;
      }).catch(function(err) {
        return err;
      });
    }

    function saveValueSet(newValueSet, newValues) {
      var endpoint = base + '/bioportal/vs-collections/CEDARVS/value-sets';
      var payload = {
        'creator': 'http://data.bioontology.org/users/cedar-mjd',
        'definitions': [newValueSet.description],
        'prefLabel': newValueSet.prefLabel,
      };
      return $http.post(endpoint, payload, http_default_config).then(function(valueSetCreateResponse) {
        if (newValues && newValues.length > 0) {
          var promises = [];
          for (var i = 0; i < newValues.length; i++) {
            promises.push(saveValue(valueSetCreateResponse.data['@id'], newValues[i]));
          }
          return $q.all(promises).then(function(valueResponses) {
            return getValueSet(valueSetCreateResponse.data['id']).then(function(valueSetGetResponse) {
              return valueSetGetResponse;
            });
          });
        } else {
          return response.data;
        }
      }).catch(function(err) {
        return err;
      });
    }

  }

});