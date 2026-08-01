'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.controlledTerm.controlledTermDataService', [])
      .service('controlledTermDataService', controlledTermDataService);

  controlledTermDataService.$inject = ['UIMessageService', 'ControlledTermHttpService', 'AuthorizedBackendService', '$translate', '$q'];

  function controlledTermDataService(UIMessageService, ControlledTermHttpService, AuthorizedBackendService, $translate, $q) {

    var ontologiesCache = {};
    var valueSetsCollectionsCache = {};
    var valueSetsCache = {};

    // The ontology and value-set caches load once per page. The load can fail — most often just
    // after a redeploy, while the terminology server is cold and BioPortal adds seconds — and when
    // it does the empty cache must not be latched for the life of the page. These three fields
    // replace the old boolean `initialized`, which was set as soon as loading *began* and so
    // recorded that an attempt had started rather than that it had produced anything: once a failed
    // attempt set it, every later init() returned immediately and the picker stayed empty until a
    // full page reload.
    var loaded = false;             // true only once the caches actually populated (see init())
    var initPromise = null;         // the in-flight load, so concurrent callers share one attempt
    var lastFailedAttempt = 0;      // epoch ms of the last failed load, for the retry floor
    var RETRY_INTERVAL_MS = 30000;  // do not re-attempt a failed load more often than this

    var service = {
      initValueSetsCache             : initValueSetsCache,
      getAllOntologies               : getAllOntologies,
      getOntologyById                : getOntologyById,
      getOntologyByLdId              : getOntologyByLdId,
      getVsCollectionById            : getVsCollectionById,
      getVsCollectionByLdId          : getVsCollectionByLdId,
      getAllValueSetCollections      : getAllValueSetCollections,
      getAllValuesInValueSetByValue  : getAllValuesInValueSetByValue,
      createValueSet                 : createValueSet,
      getValueSetById                : getValueSetById,
      getNotCachedValueSetById       : getNotCachedValueSetById,
      getAllValueSets                : getAllValueSets,
      getValueSetByLdId              : getValueSetByLdId,
      createValue                    : createValue,
      getValueTree                   : getValueTree,
      getValueSetTree                : getValueSetTree,
      createClass                    : createClass,
      getRootClasses                 : getRootClasses,
      getRootProperties              : getRootProperties,
      getClassChildren               : getClassChildren,
      getClassById                   : getClassById,
      getPropertyChildren            : getPropertyChildren,
      getPropertyById                : getPropertyById,
      getClassDescendants            : getClassDescendants,
      getClassParents                : getClassParents,
      getClassTree                   : getClassTree,
      getPropertyTree                : getPropertyTree,
      getValuesInValueSet            : getValuesInValueSet,
      getValueById                   : getValueById,
      getValueTermById               : getValueTermById,
      getAcronym                     : getAcronym,
      init                           : init,
      searchClasses                  : searchClasses,
      searchProperties               : searchProperties,
      searchClassesAndValues         : searchClassesAndValues,
      searchClassesValueSetsAndValues: searchClassesValueSetsAndValues,
      searchValueSetsAndValues       : searchValueSetsAndValues,
      searchValueSets                : searchValueSets,
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
      // Already populated: nothing to do.
      if (loaded) {
        return $q.when(true);
      }
      // A load is already running: share it instead of starting a second. init() is called from
      // all ten getters, so without this guard a first paint would fire several parallel loads.
      if (initPromise) {
        return initPromise;
      }
      // A recent attempt failed: degrade to the (empty) cache until the retry floor passes, so the
      // getters cannot turn a persistent failure into a request storm.
      if (lastFailedAttempt && (Date.now() - lastFailedAttempt) < RETRY_INTERVAL_MS) {
        return $q.when(false);
      }

      initPromise = $q.all([
        initOntologiesCache(),
        initValueSetsCollectionsCache(),
        initValueSetsCache()
      ]).finally(function () {
        // Success cannot be read from the promises: AuthorizedBackendService.doCall routes failures
        // to its error callback and resolves, and handleServerError returns the error rather than
        // rethrowing, so $q.all resolves even on a total failure. The usable signal is whether the
        // ontologies cache ended up with entries — the same condition that otherwise produces the
        // empty "Add ontologies" box. Keying on the ontologies cache means a partial load (ontologies
        // succeed, value sets fail) counts as loaded and is not retried; that matches the symptom
        // this addresses and keeps the retry narrow.
        loaded = !isEmptyObject(ontologiesCache);
        lastFailedAttempt = loaded ? 0 : Date.now();
        initPromise = null;
      });

      return initPromise;
    }

    function isEmptyObject(obj) {
      for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
          return false;
        }
      }
      return true;
    }

    /**
     * Generic error handling
     */
    function handleServerError(err) {
      if (err.status === 502) {
        UIMessageService.showBackendError($translate.instant("TERMINOLOGY.errorTerminology"), err);
      } else {
        UIMessageService.flashWarning("TERMINOLOGY.errorBioPortal")
        //UIMessageService.showBackendError($translate.instant("TERMINOLOGY.errorBioPortal"), err);
      }
      return err;
    }

    /**
     * Initialize caches
     */
    function initOntologiesCache() {
      // Get ontologies
      return AuthorizedBackendService.doCall(
          ControlledTermHttpService.getOntologies(),
          function (response) {
            var ontologies = response.data;
            angular.forEach(ontologies, function (value) {
              // Ignore ontologies without submissions, except for CEDARPC
              if (value.details != null) {
                if ((value.details.hasSubmissions || (value.id === 'CEDARPC')) && value.id !== "NLMVS" && value.id !== 'CEDARVS' && value.id !== 'CADSR-VS') {
                  value.fullName = value.name + ' (' + value.id + ')';
                  ontologiesCache[value.id] = value;
                }
              }
            });
          },
          function (err) {
            return handleServerError(err);
          }
      );
    }

    function initValueSetsCollectionsCache() {
      // Get vs collections
      return AuthorizedBackendService.doCall(
          ControlledTermHttpService.getValueSetsCollections(),
          function (response) {
            var vscs = response.data;
            angular.forEach(vscs, function (vsc) {
              vsc.fullName = vsc.name + ' (' + vsc.id + ')';
              valueSetsCollectionsCache[vsc.id] = vsc;
            });
          },
          function (err) {
            return handleServerError(err);
          }
      );
    }

    function initValueSetsCache() {
      // Get value sets
      return AuthorizedBackendService.doCall(
          ControlledTermHttpService.getValueSetsCache(),
          function (response) {
            var valueSets = response.data;
            angular.forEach(valueSets, function (element) {
              valueSetsCache[element['@id']] = element;
            });
          },
          function (err) {
            return handleServerError(err);
          }
      );
    }

    /**
     * Service methods
     */

    function getAllOntologies() {
      init();
      var ontologies = [];
      for (var key in ontologiesCache) {
        ontologies.push(ontologiesCache[key]);
      }
      return ontologies;
    }

    function getAllValueSetCollections() {
      init();
      var valueSetCollections = [];
      for (var key in valueSetsCollectionsCache) {
        valueSetCollections.push(valueSetsCollectionsCache[key]);
      }
      return valueSetCollections;
    }

    function createValueSet(valueSet) {
      init();
      return AuthorizedBackendService.doCall(
          ControlledTermHttpService.createValueSet(valueSet),
          function (response) {
            return response.data;
          },
          function (err) {
            return handleServerError(err);
          }
      );
    }

    function getNotCachedValueSetById(vsId) {
      init();
      return AuthorizedBackendService.doCall(
          ControlledTermHttpService.getValueSetById(vsId),
          function (response) {
            return response.data;
          },
          function (err) {
            return handleServerError(err);
          }
      );
    }

    function getAllValueSets() {
      init();
      var valueSets = [];
      for (var key in valueSetsCache) {
        valueSets.push(valueSetsCache[key]);
      }
      return valueSets;
    }

    function getOntologyById(ontologyId) {
      init();
      return ontologiesCache[ontologyId];
    }

    function getOntologyByLdId(ontologyLdId) {
      init();
      if (!ontologyLdId) return undefined;
      var cleanLdId = ontologyLdId.replace(/\/$/, "");
      var ontologyId = cleanLdId.substr(cleanLdId.lastIndexOf('/') + 1);
      return getOntologyById(ontologyId);
    }

    function getValueSetById(vsId) {
      init();
      return valueSetsCache[vsId];
    }

    function getValueSetByLdId(vsLdId) {
      init();
      var vsId = vsLdId.substr(vsLdId.lastIndexOf('/') + 1);
      return getValueSetById(vsId);
    }

    function getVsCollectionById(vscId) {
      init();
      return valueSetsCollectionsCache[vscId];
    }

    function getVsCollectionByLdId(vscLdId) {
      init();
      if (!vscLdId) return undefined;
      var cleanLdId = vscLdId.replace(/\/$/, "");
      var vscId = cleanLdId.substr(cleanLdId.lastIndexOf('/') + 1);
      return getVsCollectionById(vscId);
    }

    function createClass(newClass) {
      init();
      return AuthorizedBackendService.doCall(
          ControlledTermHttpService.createClass(newClass),
          function (response) {
            return response.data;
          },
          function (err) {
            return handleServerError(err);
          }
      );
    }

    function getRootClasses(ontology) {
      init();
      return AuthorizedBackendService.doCall(
          ControlledTermHttpService.getRootClasses(ontology),
          function (response) {
            return response.data;
          },
          function (err) {
            return handleServerError(err);
          }
      );
    }

    function getRootProperties(ontology) {
      init();
      return AuthorizedBackendService.doCall(
          ControlledTermHttpService.getRootProperties(ontology),
          function (response) {
            return response.data;
          },
          function (err) {
            return handleServerError(err);
          }
      );
    }

    function getClassById(acronym, classId) {
      init();
      return AuthorizedBackendService.doCall(
          ControlledTermHttpService.getClassById(acronym, classId),
          function (response) {
            return response.data;
          },
          function (err) {
            return handleServerError(err);
          }
      );
    }

    function createValue(vsId, value) {
      init();
      return AuthorizedBackendService.doCall(
          ControlledTermHttpService.createValue(vsId, value),
          function (response) {
            return response.data;
          },
          function (err) {
            return handleServerError(err);
          }
      );
    }

    function getValueTree(vsId, vsCollection) {
      init();
      return AuthorizedBackendService.doCall(
          ControlledTermHttpService.getValueTree(vsId, vsCollection),
          function (response) {
            return response.data;
          },
          function (err) {
            return handleServerError(err);
          }
      );
    }

    function getValueSetTree(valueId, vsCollection) {
      init();
      return AuthorizedBackendService.doCall(
          ControlledTermHttpService.getValueSetTree(valueId, vsCollection),
          function (response) {
            return response.data;
          },
          function (err) {
            return handleServerError(err);
          }
      );
    }

    function getAllValuesInValueSetByValue(valueId, vsCollection) {
      init();
      return AuthorizedBackendService.doCall(
          ControlledTermHttpService.getAllValuesInValueSetByValue(valueId, vsCollection),
          function (response) {
            return response.data.collection;
          },
          function (err) {
            return handleServerError(err);
          }
      );
    }

    function getClassChildren(acronym, classId) {
      init();
      return AuthorizedBackendService.doCall(
          ControlledTermHttpService.getClassChildren(acronym, classId),
          function (response) {
            return response.data.collection;
          },
          function (err) {
            return handleServerError(err);
          }
      );
    }

    function getClassDescendants(acronym, classId) {
      init();
      return AuthorizedBackendService.doCall(
          ControlledTermHttpService.getClassDescendants(acronym, classId),
          function (response) {
            return response.data.collection;
          },
          function (err) {
            return handleServerError(err);
          }
      );
    }

    function getPropertyChildren(acronym, propertyId) {
      init();
      return AuthorizedBackendService.doCall(
          ControlledTermHttpService.getPropertyChildren(acronym, propertyId),
          function (response) {
            return response.data;
          },
          function (err) {
            return handleServerError(err);
          }
      );
    }

    function getPropertyById(acronym, propertyId) {
      init();
      return AuthorizedBackendService.doCall(
          ControlledTermHttpService.getPropertyById(acronym, propertyId),
          function (response) {
            return response.data;
          },
          function (err) {
            return handleServerError(err);
          }
      );
    }

    function getValueById(acronym, valueId) {
      init();
      return AuthorizedBackendService.doCall(
          ControlledTermHttpService.getValueById(acronym, valueId),
          function (response) {
            return response.data;
          },
          function (err) {
            return handleServerError(err);
          }
      );
    }

    function getValueTermById(acronym, valueSetId, valueId) {
      init();
      return AuthorizedBackendService.doCall(
          ControlledTermHttpService.getValueTermById(acronym, valueSetId, valueId),
          function (response) {
            return response.data;
          },
          function (err) {
            return handleServerError(err);
          }
      );
    }

    function getClassParents(acronym, classId) {
      init();
      return AuthorizedBackendService.doCall(
          ControlledTermHttpService.getClassParents(acronym, classId),
          function (response) {
            return response.data;
          },
          function (err) {
            return handleServerError(err);
          }
      );
    }

    function getClassTree(acronym, classId) {
      init();
      return AuthorizedBackendService.doCall(
          ControlledTermHttpService.getClassTree(acronym, classId),
          function (response) {
            return response.data;
          },
          function (err) {
            return handleServerError(err);
          }
      );
    }

    function getPropertyTree(acronym, propertyId) {
      init();
      return AuthorizedBackendService.doCall(
          ControlledTermHttpService.getPropertyTree(acronym, propertyId),
          function (response) {
            return response.data;
          },
          function (err) {
            return handleServerError(err);
          }
      );
    }

    function getValuesInValueSet(vsCollection, vsId, page, size) {
      init();
      return AuthorizedBackendService.doCall(
          ControlledTermHttpService.getValuesInValueSet(vsCollection, vsId, page, size),
          function (response) {
            return response.data.collection;
          },
          function (err) {
            return handleServerError(err);
          }
      );
    }

    function getAcronym(result) {
      var ontologyUri = '';
      if (result.type === 'Ontology' || result.type === 'OntologyClass') {
        if (result.ontology) {
          ontologyUri = result.ontology;
        }
        else {
          ontologyUri = result.source;
        }
      }
      else if (result.type === 'ValueSet' || result.type === 'Value') {
        ontologyUri = result.vsCollection;
      }
      return ontologyUri.substr(ontologyUri.lastIndexOf('/') + 1);
    }

    function searchProperties(query, sources, size) {
      init();
      return AuthorizedBackendService.doCall(
          ControlledTermHttpService.searchProperties(query, sources, size),
          function (response) {
            return response.data;
          },
          function (err) {
            return handleServerError(err);
          }
      );
    }

    function searchClasses(query, sources, size) {
      init();
      return AuthorizedBackendService.doCall(
          ControlledTermHttpService.searchClasses(query, sources, size),
          function (response) {
            return response.data;
          },
          function (err) {
            return handleServerError(err);
          }
      );
    }

    function searchClassesAndValues(query, sources, size) {
      init();
      return AuthorizedBackendService.doCall(
          ControlledTermHttpService.searchClassesAndValues(query, sources, size),
          function (response) {
            return response.data;
          },
          function (err) {
            return handleServerError(err);
          }
      );
    }

    function searchClassesValueSetsAndValues(query, sources, size) {
      init();
      return AuthorizedBackendService.doCall(
          ControlledTermHttpService.searchClassesValueSetsAndValues(query, sources, size),
          function (response) {
            return response.data;
          },
          function (err) {
            return handleServerError(err);
          }
      );
    }

    function searchValueSetsAndValues(query, sources, size) {
      init();
      return AuthorizedBackendService.doCall(
          ControlledTermHttpService.searchValueSetsAndValues(query, sources, size),
          function (response) {
            return response.data;
          },
          function (err) {
            return handleServerError(err);
          }
      );
    }

    function searchValueSets(query, sources, size) {
      init();
      return AuthorizedBackendService.doCall(
          ControlledTermHttpService.searchValueSets(query, sources, size),
          function (response) {
            return response.data;
          },
          function (err) {
            return handleServerError(err);
          }
      );
    }

    function autocompleteOntology(query, acronym, page, size) {
      init();
      return AuthorizedBackendService.doCall(
          ControlledTermHttpService.autocompleteOntology(query, acronym, page, size),
          function (response) {
            return response.data;
          },
          function (err) {
            return handleServerError(err);
          }
      );
    }

    function autocompleteOntologySubtree(query, acronym, subtree_root_id, max_depth, page, size) {
      init();
      return AuthorizedBackendService.doCall(
          ControlledTermHttpService.autocompleteOntologySubtree(query, acronym, subtree_root_id, max_depth, page, size),
          function (response) {
            return response.data;
          },
          function (err) {
            return handleServerError(err);
          }
      );
    }

    function autocompleteValueSetClasses(query, vsCollection, vsId, page, size) {
      init();
      var acronym = vsCollection.substr(vsCollection.lastIndexOf('/') + 1);
      // use descendants
      return AuthorizedBackendService.doCall(
          ControlledTermHttpService.getValuesInValueSet(acronym, vsId, page, size),
          function (response) {
            return response.data;
          },
          function (err) {
            return handleServerError(err);
          }
      );
    }

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
