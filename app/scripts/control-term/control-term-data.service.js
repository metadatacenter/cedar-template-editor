'use strict';

define([
  'angular',
  'json!config/control-term-data-service.conf.json'
], function (angular, config) {
  angular.module('cedar.templateEditor.controlTerm.controlTermDataService', [])
      .service('controlTermDataService', controlTermDataService);

  controlTermDataService.$inject = ['$http', '$q', 'UrlService', 'UIMessageService'];

  function controlTermDataService($http, $q, UrlService, UIMessageService) {

    var apiKey = null;
    var base = null;
    var baseTerminology = null;
    var http_default_config = {};

    var ontologiesCache = {};
    var valueSetsCache = {};

    var service = {
      getAllOntologies               : getAllOntologies,
      getOntologyById                : getOntologyById,
      getOntologyByLdId              : getOntologyByLdId,
      getAllValueSets                : getAllValueSets,
      getValueSetByLdId              : getValueSetByLdId,
      getRootClasses                 : getRootClasses,
      getClassChildren               : getClassChildren,
      getClassById                   : getClassById,
      getClassParents                : getClassParents,
      getClassTree                   : getClassTree,
      getValuesInValueSet            : getValuesInValueSet,
      getAcronym                     : getAcronym,
      init                           : init,
      searchClasses                  : searchClasses,
      searchClassesValueSetsAndValues: searchClassesValueSetsAndValues,
      searchValueSetsAndValues       : searchValueSetsAndValues,
      serviceId                      : 'controlTermDataService'
    };

    return service;

    /**
     * Initialize service.
     */
    function init() {
      apiKey = config.apiKey;
      base = UrlService.bioontology();
      baseTerminology = "https://terminology.metadatacenter.orgx/bioportal/";
      http_default_config = {
        'headers': {
          'Authorization': 'apikey token=' + apiKey
        }
      };
      initOntologiesCache();
      initValueSetsCache();
    }

    /**
     * Initialize caches
     */

    function initOntologiesCache() {
      var url = baseTerminology + "ontologies";
      // Get ontologies
      $http.get(url, http_default_config).then(function (response) {
        var ontologies = response.data;
        angular.forEach(ontologies, function (value) {
          ontologiesCache[value.id] = value;
        });
      }).catch(function (err) {
        UIMessageService.showBackendError("Error retrieving ontologies from terminology service", err);
        return err;
      });
    }

    function initValueSetsCache() {
      var url = baseTerminology + "value-sets";
      // Get value sets
      return $http.get(url, http_default_config).then(function (response) {
        var valueSets = response.data;
        angular.forEach(valueSets, function (element) {
          valueSetsCache[element.id] = element;
        });
      }).catch(function (err) {
        UIMessageService.showBackendError("Error retrieving value sets from terminology service", err);
        return err;
      });
    }

    function getAllOntologies() {
      var ontologies = [];
      for (var key in ontologiesCache) {
        ontologies.push(ontologiesCache[key]);
      }
      return ontologies;
    };

    function getAllValueSets() {
      var valueSets = [];
      for (var key in valueSetsCache) {
        valueSets.push(valueSetsCache[key]);
      }
      return valueSets;
    };

    /**
     * Service methods.
     */

    function getOntologyById(ontologyId) {
      return ontologiesCache[ontologyId];
    }

    function getOntologyByLdId(ontologyLdId) {
      var ontologyId = ontologyLdId.substr(ontologyLdId.lastIndexOf('/') + 1);
      return getOntologyById(ontologyId);
    }

    function getRootClasses(ontology) {
      var url = baseTerminology + "ontologies/" + ontology + "/classes/roots"
      return $http.get(url, http_default_config).then(function (response) {
        return response.data;
      }).catch(function (err) {
        return err;
      });
    };

    // TODO: the value set cache keys should contain the vsCollection too, because there may be duplicates
    function getValueSetByLdId(valueSetLdId) {
      if ($.isEmptyObject(valueSetsCache)) {
        return getAllValueSets().then(function () {
          return valueSetsCache[valueSetLdId];
        });
      }
      else {
        return valueSetsCache[valueSetLdId];
      }
    }

    function getClassChildren(acronym, classId) {
      return $http.get(baseTerminology + 'ontologies/' + acronym + '/classes/' + encodeURIComponent(classId) + "/children?page=1&pageSize=1000",
          http_default_config).then(function (response) {
            return response.data.collection;
          }).catch(function (err) {
            return err;
          });
    };

    function getClassById(acronym, classId) {
      var url = baseTerminology + 'ontologies/' + acronym + '/classes/' + encodeURIComponent(classId);
      return $http.get(url, http_default_config).then(function (response) {
        return response.data;
      }).catch(function (err) {
        return err;
      });
    }

    function getClassParents(acronym, classId) {
      return $http.get(baseTerminology + 'ontologies/' + acronym + '/classes/' + encodeURIComponent(classId) + '/parents?include=hasChildren,prefLabel',
          http_default_config).then(function (response) {
            return response.data;
          }).catch(function (err) {
            return err;
          });
    };

    function getClassTree(acronym, classId) {
      return $http.get(baseTerminology + 'ontologies/' + acronym + '/classes/' + encodeURIComponent(classId) + '/tree',
          http_default_config).then(function (response) {
            return response.data;
          }).catch(function (err) {
            return err;
          });
    };

    function getValuesInValueSet(vsCollection, vsId) {
      var url = baseTerminology + 'vs-collections/' + vsCollection + '/value-sets/' + encodeURIComponent(vsId) + "/values";
      return $http.get(url, http_default_config).then(function (response) {
        return response.data.collection;
      }).catch(function (err) {
        return err;
      });
    }

    function getAcronym(result) {
      var ontologyUri;
      if (result.type == 'Ontology' || result.type == 'OntologyClass') {
        ontologyUri = result.ontology;
      }
      else if (result.type == 'ValueSet' || result.type == 'Value') {
        ontologyUri = result.vsCollection;
      }
      var acronym = ontologyUri.substr(ontologyUri.lastIndexOf('/') + 1);
      return acronym;
    }

    function searchClasses(query) {
      var url = baseTerminology + "search?q=" + encodeURIComponent(query) + "&scope=classes" + "&page=1&page_size=100";
      return $http.get(url, http_default_config).then(function (response) {
        return response.data;
      }).catch(function (err) {
        return err;
      });
    };

    function searchClassesValueSetsAndValues(query) {
      var url = baseTerminology + "search?q=" + encodeURIComponent(query) + "&scope=all" + "&page=1&page_size=100";
      return $http.get(url, http_default_config).then(function (response) {
        return response.data;
      }).catch(function (err) {
        return err;
      });
    };

    function searchValueSetsAndValues(query) {
      var url = baseTerminology + "search?q=" + encodeURIComponent(query) + "&scope=value_sets,values" + "&page=1&page_size=100";
      return $http.get(url, http_default_config).then(function (response) {
        return response.data;
      }).catch(function (err) {
        return err;
      });
    };

  }
});
