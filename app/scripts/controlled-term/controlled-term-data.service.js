'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.controlledTerm.controlledTermDataService', [])
      .service('controlledTermDataService', controlledTermDataService);

  controlledTermDataService.$inject = ['UIMessageService', 'ControlledTermHttpService', 'AuthorizedBackendService',
                                       '$translate'];

  function controlledTermDataService(UIMessageService, ControlledTermHttpService, AuthorizedBackendService,
                                     $translate) {

    var ontologiesCache = {};
    var valueSetsCollectionsCache = {};
    var valueSetsCache = {};
    var initialized = false;

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
      if (!initialized) {
        initOntologiesCache();
        initValueSetsCollectionsCache();
        initValueSetsCache();
        initialized = true;
      }
    }

    /**
     * Generic error handling
     */
    function handleServerError(err) {
      if (err.status == 502) {
        UIMessageService.showBackendError($translate.instant("TERMINOLOGY.errorTerminology"), err);
      } else {
        UIMessageService.showBackendError($translate.instant("TERMINOLOGY.errorBioPortal"), err);
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
              // Ignore empty ontologies (without submissions), except for CEDARPC
              if (((value.details.numberOfClasses > 0) || (value.id == 'CEDARPC')) && value.id != "NLMVS" && value.id != 'CEDARVS') {
                value.fullName = value.name + ' (' + value.id + ')';
                ontologiesCache[value.id] = value;
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
      var ontologyId = ontologyLdId.substr(ontologyLdId.lastIndexOf('/') + 1);
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
      var vscId = vscLdId.substr(vscLdId.lastIndexOf('/') + 1);
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

    function getValuesInValueSet(vsCollection, vsId) {
      init();
      return AuthorizedBackendService.doCall(
          ControlledTermHttpService.getValuesInValueSet(vsCollection, vsId),
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

    function autocompleteOntology(query, acronym) {
      init();
      return AuthorizedBackendService.doCall(
          ControlledTermHttpService.autocompleteOntology(query, acronym),
          function (response) {
            return response.data;
          },
          function (err) {
            return handleServerError(err);
          }
      );
    }

    function autocompleteOntologySubtree(query, acronym, subtree_root_id, max_depth) {
      init();
      return AuthorizedBackendService.doCall(
          ControlledTermHttpService.autocompleteOntologySubtree(query, acronym, subtree_root_id, max_depth),
          function (response) {
            return response.data;
          },
          function (err) {
            return handleServerError(err);
          }
      );
    }

    function autocompleteValueSetClasses(query, vsCollection, vsId) {
      init();
      var acronym = vsCollection.substr(vsCollection.lastIndexOf('/') + 1);
      // use descendants
      return AuthorizedBackendService.doCall(
          ControlledTermHttpService.getValuesInValueSet(acronym, vsId),
          function (r) {
            var response = {};
            response["collection"] = r;
            return response;
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
