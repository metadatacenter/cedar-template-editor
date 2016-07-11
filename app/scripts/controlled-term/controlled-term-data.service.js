'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.controlledTerm.controlledTermDataService', [])
      .service('controlledTermDataService', controlledTermDataService);

  controlledTermDataService.$inject = ['$http', '$q', 'UrlService', 'UIMessageService', '$translate'];

  function controlledTermDataService($http, $q, UrlService, UIMessageService, $translate) {

    var base = null;
    var http_default_config = {};

    var ontologiesCache = {};
    var valueSetsCache = {};

    var service = {
      initValueSetsCache             : initValueSetsCache,
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
      autocompleteOntology           : autocompleteOntology,
      autocompleteOntologySubtree    : autocompleteOntologySubtree,
      autocompleteValueSetClasses    : autocompleteValueSetClasses,
      serviceId                      : 'controlledTermDataService'
    };

    return service;

    /**
     * Initialize service.
     */
    function init() {
      base = UrlService.terminology() + "/bioportal";
      http_default_config = {};
      initOntologiesCache();
      initValueSetsCache();
    }

    /**
     * Initialize caches
     */

    function initOntologiesCache() {
      var url = base + "/ontologies";
      // Get ontologies
      $http.get(url, http_default_config).then(function (response) {
        var ontologies = response.data;
        angular.forEach(ontologies, function (value) {
          // Ignore empty ontologies (without submissions), except for CEDARPC
          if ((value.details.numberOfClasses > 0) || (value.id == 'CEDARPC')) {
            ontologiesCache[value.id] = value;
          }
          value.fullName = value.name + ' (' + value.id + ')';
        });
      }).catch(function (err) {
        if (err.status == 502) {
          UIMessageService.showBackendError($translate.instant("TERMINOLOGY.errorTerminology"), err);
        }
        else {
          //UIMessageService.showBackendError($translate.instant("TERMINOLOGY.errorBioPortal"), err);
        }
        return err;
      });
    }

    function initValueSetsCache() {
      var url = base + "/value-sets";
      // Get value sets
      return $http.get(url, http_default_config).then(function (response) {
        var valueSets = response.data;
        angular.forEach(valueSets, function (element) {
          valueSetsCache[element.id] = element;
        });
      }).catch(function (err) {
        if (err.status == 502) {
          UIMessageService.showBackendError($translate.instant("TERMINOLOGY.errorTerminology"), err);
        }
        else {
          //UIMessageService.showBackendError($translate.instant("TERMINOLOGY.errorBioPortal"), err);
        }
        return err;
      });
    }

    /**
     * Service methods
     */

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

    function getOntologyById(ontologyId) {
      return ontologiesCache[ontologyId];
    }

    function getOntologyByLdId(ontologyLdId) {
      var ontologyId = ontologyLdId.substr(ontologyLdId.lastIndexOf('/') + 1);
      return getOntologyById(ontologyId);
    }

    function getRootClasses(ontology) {
      var url = base + "/ontologies/" + ontology + "/classes/roots"
      return $http.get(url, http_default_config).then(function (response) {
        return response.data;
      }).catch(function (err) {
        if (err.status == 502) {
          UIMessageService.showBackendError($translate.instant("TERMINOLOGY.errorTerminology"), err);
        }
        else {
          //UIMessageService.showBackendError($translate.instant("TERMINOLOGY.errorBioPortal"), err);
        }
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
      return $http.get(base + '/ontologies/' + acronym + '/classes/' + encodeURIComponent(classId) + "/children?page=1&pageSize=1000",
          http_default_config).then(function (response) {
            return response.data.collection;
          }).catch(function (err) {
            if (err.status == 502) {
              UIMessageService.showBackendError($translate.instant("TERMINOLOGY.errorTerminology"), err);
            }
            else {
              //UIMessageService.showBackendError($translate.instant("TERMINOLOGY.errorBioPortal"), err);
            }
            return err;
          });
    };

    function getClassById(acronym, classId) {
      var url = base + '/ontologies/' + acronym + '/classes/' + encodeURIComponent(classId);
      return $http.get(url, http_default_config).then(function (response) {
        return response.data;
      }).catch(function (err) {
        if (err.status == 502) {
          UIMessageService.showBackendError($translate.instant("TERMINOLOGY.errorTerminology"), err);
        }
        else {
          //UIMessageService.showBackendError($translate.instant("TERMINOLOGY.errorBioPortal"), err);
        }
        return err;
      });
    }

    function getClassParents(acronym, classId) {
      return $http.get(base + '/ontologies/' + acronym + '/classes/' + encodeURIComponent(classId) + '/parents?include=hasChildren,prefLabel',
          http_default_config).then(function (response) {
            return response.data;
          }).catch(function (err) {
            if (err.status == 502) {
              UIMessageService.showBackendError($translate.instant("TERMINOLOGY.errorTerminology"), err);
            }
            else {
              //UIMessageService.showBackendError($translate.instant("TERMINOLOGY.errorBioPortal"), err);
            }
            return err;
          });
    };

    function getClassTree(acronym, classId) {
      return $http.get(base + '/ontologies/' + acronym + '/classes/' + encodeURIComponent(classId) + '/tree',
          http_default_config).then(function (response) {
            return response.data;
          }).catch(function (err) {
            if (err.status == 502) {
              UIMessageService.showBackendError($translate.instant("TERMINOLOGY.errorTerminology"), err);
            }
            else {
              //UIMessageService.showBackendError($translate.instant("TERMINOLOGY.errorBioPortal"), err);
            }
            return err;
          });
    };

    function getValuesInValueSet(vsCollection, vsId) {
      var url = base + '/vs-collections/' + vsCollection + '/value-sets/' + encodeURIComponent(vsId) + "/values";
      return $http.get(url, http_default_config).then(function (response) {
        return response.data.collection;
      }).catch(function (err) {
        if (err.status == 502) {
          UIMessageService.showBackendError($translate.instant("TERMINOLOGY.errorTerminology"), err);
        }
        else {
          //UIMessageService.showBackendError($translate.instant("TERMINOLOGY.errorBioPortal"), err);
        }
        return err;
      });
    }

    function getAcronym(result) {
      var ontologyUri = '';
      if (result.type == 'Ontology' || result.type == 'OntologyClass') {
        ontologyUri = result.ontology;
      }
      else if (result.type == 'ValueSet' || result.type == 'Value') {
        ontologyUri = result.vsCollection;
      }
      var acronym = ontologyUri.substr(ontologyUri.lastIndexOf('/') + 1);
      return acronym;
    }

    function searchClasses(query, sources, size) {
      var url = base + "/search?q=" + encodeURIComponent(query) + "&scope=classes" + "&page=1&page_size=" + size;
      if (sources) {
        url = url + "&sources=" + sources;
      }
      return $http.get(url, http_default_config).then(function (response) {
        return response.data;
      }).catch(function (err) {
        if (err.status == 502) {
          UIMessageService.showBackendError($translate.instant("TERMINOLOGY.errorTerminology"), err);
        }
        else {
          //UIMessageService.showBackendError($translate.instant("TERMINOLOGY.errorBioPortal"), err);
        }
        return err;
      });
    };

    function searchClassesValueSetsAndValues(query) {
      var url = base + "/search?q=" + encodeURIComponent(query) + "&scope=all" + "&page=1&page_size=100";
      return $http.get(url, http_default_config).then(function (response) {
        return response.data;
      }).catch(function (err) {
        if (err.status == 502) {
          UIMessageService.showBackendError($translate.instant("TERMINOLOGY.errorTerminology"), err);
        }
        else {
          //UIMessageService.showBackendError($translate.instant("TERMINOLOGY.errorBioPortal"), err);
        }
        return err;
      });
    };

    function searchValueSetsAndValues(query) {
      var url = base + "/search?q=" + encodeURIComponent(query) + "&scope=value_sets,values" + "&page=1&page_size=100";
      return $http.get(url, http_default_config).then(function (response) {
        return response.data;
      }).catch(function (err) {
        if (err.status == 502) {
          UIMessageService.showBackendError($translate.instant("TERMINOLOGY.errorTerminology"), err);
        }
        else {
          //UIMessageService.showBackendError($translate.instant("TERMINOLOGY.errorBioPortal"), err);
        }
        return err;
      });
    };

    function autocompleteOntology(query, acronym) {
      var url = base + "/search?q=" + encodeURIComponent(query) + "&scope=classes" +
          "&sources=" + acronym + "&suggest=true&page=1&page_size=50";
      return $http.get(url, http_default_config).then(function (response) {
        return response.data;
      }).catch(function (err) {
        if (err.status == 502) {
          UIMessageService.showBackendError($translate.instant("TERMINOLOGY.errorTerminology"), err);
        }
        else {
          //UIMessageService.showBackendError($translate.instant("TERMINOLOGY.errorBioPortal"), err);
        }
        return err;
      });
    };

    function autocompleteOntologySubtree(query, acronym, subtree_root_id, max_depth) {
      var searchUrl = "";
      if (query == '*') {
        // use descendants
        searchUrl += base + '/ontologies/' + acronym + '/classes/' + encodeURIComponent(subtree_root_id) + '/descendants?&page=1&page_size=100';
      } else {
        searchUrl = base + '/search?q=' + encodeURIComponent(query) + '&scope=classes' + '&sources=' + acronym +
            '&subtree_root_id=' + encodeURIComponent(subtree_root_id) + '&max_depth=' + max_depth + "&suggest=true&page=1&page_size=100";
      }
      return $http.get(searchUrl, http_default_config).then(function (response) {
        return response.data;
      }).catch(function (err) {
        if (err.status == 502) {
          UIMessageService.showBackendError($translate.instant("TERMINOLOGY.errorTerminology"), err);
        }
        else {
          //UIMessageService.showBackendError($translate.instant("TERMINOLOGY.errorBioPortal"), err);
        }
        return err;
      });
    };

    function autocompleteValueSetClasses(query, vsCollection, vsId) {
      var acronym = vsCollection.substr(vsCollection.lastIndexOf('/') + 1);
      // use descendants
      return getValuesInValueSet(acronym, vsId).then(function (r) {
        var response = {};
        response["collection"] = r;
        return response;
      }).catch(function (err) {
        if (err.status == 502) {
          UIMessageService.showBackendError($translate.instant("TERMINOLOGY.errorTerminology"), err);
        }
        else {
          //UIMessageService.showBackendError($translate.instant("TERMINOLOGY.errorBioPortal"), err);
        }
        return err;
      });
    };

    // This is a more complex version of the previous function. It uses BioPortal subtree search for autocomplete. This is not needed for a small amount of values.
    //function autocompleteValueSetClasses(query, vsCollection, vsId) {
    //  var searchUrl = base;
    //  var acronym = vsCollection.substr(vsCollection.lastIndexOf('/') + 1);
    //  // If the VS belongs to CEDARVS we return all values because the search subtree used below does not work for provisional value sets
    //  if ((query == '*') || (acronym == 'CEDARVS')) {
    //    // use descendants
    //    //searchUrl += 'ontologies/NLMVS/classes/' + encodeURIComponent(uri) + '/descendants?display_context=false&display_links=false';
    //    return getValuesInValueSet(acronym, vsId).then(function (r) {
    //      var response = {};
    //      response["collection"] = r;
    //      return response;
    //    }).catch(function (err) {
    //      UIMessageService.showBackendError("Error when calling terminology server to retrieve values in value set",
    //          err);
    //      return err;
    //    });
    //  } else {
    //    //searchUrl += 'search?q=' + query.replace(/[\s]+/g,
    //    //        '+') + '&ontology=NLMVS&suggest=true&display_context=false&display_links=false&subtree_root_id=' + encodeURIComponent(uri) + '&pagesize=20'
    //    var searchUrl = base + 'search?q=' + encodeURIComponent(query) + '&scope=classes' + '&sources=' + acronym +
    //        '&subtree_root_id=' + encodeURIComponent(vsId) + "&suggest=true&page=1&page_size=100";
    //    return $http.get(searchUrl, http_default_config).then(function (response) {
    //      return response.data;
    //    }).catch(function (err) {
    //      UIMessageService.showBackendError("Error when calling BioPortal to perform search", err);
    //      return err;
    //    });
    //  }
    //};

  }
});
