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
    var valueSetsCollectionsCache = {};
    var valueSetsCache = {};

    var service = {
      initValueSetsCache             : initValueSetsCache,
      getAllOntologies               : getAllOntologies,
      getOntologyById                : getOntologyById,
      getOntologyByLdId              : getOntologyByLdId,
      getVsCollectionById            : getVsCollectionById,
      getVsCollectionByLdId          : getVsCollectionByLdId,
      getAllValueSetCollections      : getAllValueSetCollections,
      getAllValuesInValueSetByValue  : getAllValuesInValueSetByValue,
      getAllValueSets                : getAllValueSets,
      getValueSetByLdId              : getValueSetByLdId,
      getValueTree                   : getValueTree,
      getRootClasses                 : getRootClasses,
      getClassChildren               : getClassChildren,
      getClassById                   : getClassById,
      getClassDescendants            : getClassDescendants,
      getClassParents                : getClassParents,
      getClassTree                   : getClassTree,
      getValuesInValueSet            : getValuesInValueSet,
      getValueById                   : getValueById,
      getAcronym                     : getAcronym,
      init                           : init,
      searchClasses                  : searchClasses,
      searchClassesAndValues         : searchClassesAndValues,
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
      initValueSetsCollectionsCache();
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
          if (((value.details.numberOfClasses > 0) || (value.id == 'CEDARPC')) && value.id != "NLMVS" && value.id != 'CEDARVS') {
            value.fullName = value.name + ' (' + value.id + ')';
            ontologiesCache[value.id] = value;
          }
        });
      }).catch(function (err) {
        if (err.status == 502) {
          UIMessageService.showBackendError($translate.instant("TERMINOLOGY.errorTerminology"), err);
        }
        else {
          UIMessageService.showBackendError($translate.instant("TERMINOLOGY.errorBioPortal"), err);
        }
        return err;
      });
    }

    function initValueSetsCollectionsCache() {
      var url = base + "/vs-collections";
      // Get vs collections
      $http.get(url, http_default_config).then(function (response) {
        var vscs = response.data;
        angular.forEach(vscs, function (vsc) {
          vsc.fullName = vsc.name + ' (' + vsc.id + ')';
          valueSetsCollectionsCache[vsc.id] = vsc;
        });
      }).catch(function (err) {
        if (err.status == 502) {
          UIMessageService.showBackendError($translate.instant("TERMINOLOGY.errorTerminology"), err);
        }
        else {
          UIMessageService.showBackendError($translate.instant("TERMINOLOGY.errorBioPortal"), err);
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
          valueSetsCache[element['@id']] = element;
        });
      }).catch(function (err) {
        if (err.status == 502) {
          UIMessageService.showBackendError($translate.instant("TERMINOLOGY.errorTerminology"), err);
        }
        else {
          UIMessageService.showBackendError($translate.instant("TERMINOLOGY.errorBioPortal"), err);
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

    function getAllValueSetCollections() {
      var valueSetCollections = [];
      for (var key in valueSetsCollectionsCache) {
        valueSetCollections.push(valueSetsCollectionsCache[key]);
      }
      return valueSetCollections;
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

    function getValueSetById(vsId) {
      return valueSetsCache[vsId];
    }

    function getValueSetByLdId(vsLdId) {
      var vsId = vsLdId.substr(vsLdId.lastIndexOf('/') + 1);
      return getValueSetById(vsId);
    }

    function getVsCollectionById(vscId) {
      return valueSetsCollectionsCache[vscId];
    }

    function getVsCollectionByLdId(vscLdId) {
      var vscId = vscLdId.substr(vscLdId.lastIndexOf('/') + 1);
      return getVsCollectionById(vscId);
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
          UIMessageService.showBackendError($translate.instant("TERMINOLOGY.errorBioPortal"), err);
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
          UIMessageService.showBackendError($translate.instant("TERMINOLOGY.errorBioPortal"), err);
        }
        return err;
      });
    }


    function getValueTree(valueId, vsCollection) {
      return $http.get(base + '/vs-collections/' + vsCollection + '/values/' + encodeURIComponent(valueId) + "/tree",
          http_default_config).then(function (response) {
            return response.data;
          }).catch(function (err) {
            if (err.status == 502) {
              UIMessageService.showBackendError($translate.instant("TERMINOLOGY.errorTerminology"), err);
            }
            else {
              UIMessageService.showBackendError($translate.instant("TERMINOLOGY.errorBioPortal"), err);
            }
            return err;
          });
    };

    function getAllValuesInValueSetByValue(valueId, vsCollection) {
      return $http.get(base + '/vs-collections/' + vsCollection + '/values/' + encodeURIComponent(valueId) + "/all-values?page=1&pageSize=1000",
          http_default_config).then(function (response) {
            return response.data.collection;
          }).catch(function (err) {
            if (err.status == 502) {
              UIMessageService.showBackendError($translate.instant("TERMINOLOGY.errorTerminology"), err);
            }
            else {
              UIMessageService.showBackendError($translate.instant("TERMINOLOGY.errorBioPortal"), err);
            }
            return err;
          });
    };

    function getClassChildren(acronym, classId) {
      return $http.get(base + '/ontologies/' + acronym + '/classes/' + encodeURIComponent(classId) + "/children?page=1&pageSize=1000",
          http_default_config).then(function (response) {
            return response.data.collection;
          }).catch(function (err) {
            if (err.status == 502) {
              UIMessageService.showBackendError($translate.instant("TERMINOLOGY.errorTerminology"), err);
            }
            else {
              UIMessageService.showBackendError($translate.instant("TERMINOLOGY.errorBioPortal"), err);
            }
            return err;
          });
    };

    function getClassDescendants(acronym, classId) {
      return $http.get(base + '/ontologies/' + acronym + '/classes/' + encodeURIComponent(classId) + "/descendants?page=1&pageSize=1000",
          http_default_config).then(function (response) {
            return response.data.collection;
          }).catch(function (err) {
            if (err.status == 502) {
              UIMessageService.showBackendError($translate.instant("TERMINOLOGY.errorTerminology"), err);
            }
            else {
              UIMessageService.showBackendError($translate.instant("TERMINOLOGY.errorBioPortal"), err);
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
          UIMessageService.showBackendError($translate.instant("TERMINOLOGY.errorBioPortal"), err);
        }
        return err;
      });
    }

    function getValueById(acronym, valueId) {
      var url = base + '/vs-collections/' + acronym + '/values/' + encodeURIComponent(valueId);
      return $http.get(url, http_default_config).then(function (response) {
        return response.data;
      }).catch(function (err) {
        if (err.status == 502) {
          UIMessageService.showBackendError($translate.instant("TERMINOLOGY.errorTerminology"), err);
        }
        else {
          UIMessageService.showBackendError($translate.instant("TERMINOLOGY.errorBioPortal"), err);
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
              UIMessageService.showBackendError($translate.instant("TERMINOLOGY.errorBioPortal"), err);
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
              UIMessageService.showBackendError($translate.instant("TERMINOLOGY.errorBioPortal"), err);
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
          UIMessageService.showBackendError($translate.instant("TERMINOLOGY.errorBioPortal"), err);
        }
        return err;
      });
    }

    function getAcronym(result) {
      var ontologyUri = '';
      if (result.type == 'Ontology' || result.type == 'OntologyClass') {
        if (result.ontology) {
          ontologyUri = result.ontology;
        }
        else {
          ontologyUri = result.source;
        }
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
          UIMessageService.showBackendError($translate.instant("TERMINOLOGY.errorBioPortal"), err);
        }
        return err;
      });
    };

    function searchClassesAndValues(query, sources, size) {
      var url = base + "/search?q=" + encodeURIComponent(query) + "&scope=classes,values" + "&page=1&page_size=" + size;
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
          UIMessageService.showBackendError($translate.instant("TERMINOLOGY.errorBioPortal"), err);
        }
        return err;
      });
    };


    function searchClassesValueSetsAndValues(query, sources, size) {
      var url = base + "/search?q=" + encodeURIComponent(query) + "&scope=all" + "&page=1&page_size=" + size;
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
          UIMessageService.showBackendError($translate.instant("TERMINOLOGY.errorBioPortal"), err);
        }
        return err;
      });
    };

    function searchValueSetsAndValues(query, sources, size) {
      var url = base + "/search?q=" + encodeURIComponent(query) + "&scope=value_sets,values" + "&page=1&page_size=" + size;
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
          UIMessageService.showBackendError($translate.instant("TERMINOLOGY.errorBioPortal"), err);
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
          UIMessageService.showBackendError($translate.instant("TERMINOLOGY.errorBioPortal"), err);
        }
        return err;
      });
    };

    function autocompleteOntologySubtree(query, acronym, subtree_root_id, max_depth) {
      var searchUrl = "";
      if (query == '*') {
        //if (max_depth == 1) {
        //  // direct children
        //  searchUrl += base + '/ontologies/' + acronym + '/classes/' + encodeURIComponent(subtree_root_id) + '/children?&page=1&page_size=300';
        //}
        //else {
          // use all descendants
          searchUrl += base + '/ontologies/' + acronym + '/classes/' + encodeURIComponent(subtree_root_id) + '/descendants?&page=1&page_size=300';
        //}
      } else {
        searchUrl = base + '/search?q=' + encodeURIComponent(query) + '&scope=classes' + '&source=' + acronym +
            '&subtree_root_id=' + encodeURIComponent(subtree_root_id) + '&max_depth=' + max_depth + "&suggest=true&page=1&page_size=300";
      }
      return $http.get(searchUrl, http_default_config).then(function (response) {
        return response.data;
      }).catch(function (err) {
        if (err.status == 502) {
          UIMessageService.showBackendError($translate.instant("TERMINOLOGY.errorTerminology"), err);
        }
        else {
          UIMessageService.showBackendError($translate.instant("TERMINOLOGY.errorBioPortal"), err);
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
          UIMessageService.showBackendError($translate.instant("TERMINOLOGY.errorBioPortal"), err);
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
