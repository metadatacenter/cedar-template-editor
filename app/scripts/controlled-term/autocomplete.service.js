'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.controlledTerm.autocompleteService', [])
      .factory('autocompleteService', autocompleteService);

  autocompleteService.$inject = ['$translate', 'controlledTermDataService', 'DataManipulationService',
                                 'StringUtilsService'];

  function autocompleteService($translate, controlledTermDataService, DataManipulationService, StringUtilsService) {
    var service = {
      serviceId               : "autocompleteService",
      autocompleteResultsCache: {}
    };

    // read the autosuggest cache
    service.getAutocompleteResults = function (id, query) {
      if (angular.isUndefined(service.autocompleteResultsCache[id])) {
        service.autocompleteResultsCache[id] = [];
        service.autocompleteResultsCache[id][query] = {
          'results': []
        };
      }

      if (angular.isUndefined(service.autocompleteResultsCache[id][query])) {
        service.autocompleteResultsCache[id][query] = {
          'results': []
        };
      }

      return service.autocompleteResultsCache[id][query].results;
    };

    service.getAutocompleteResultsCache = function (id, query) {
      if (service.autocompleteResultsCache[id] && service.autocompleteResultsCache[id][query]) {
        return service.autocompleteResultsCache[id][query].results;
      }
    };

    service.sortAutocompleteResults = function (field_id, query) {
      service.autocompleteResultsCache[field_id][query].results.sort(function (a, b) {
        if (a.label && b.label) {
          var labelA = a.label.toLowerCase();
          var labelB = b.label.toLowerCase();
          if (labelA < labelB)
            return -1;
          if (labelA > labelB)
            return 1;
        }
        return 0;
      });
    };


    service.getPage = function (field_id, query, field_type, source_uri) {
      try {
        return service.autocompleteResultsCache[field_id][query].paging[field_type][source_uri].nextPage;
      }
      catch (error) {
        return 0;
      }
    };

    service.getSize = function (field_id, query, field_type, source_uri) {
      try {
        return service.autocompleteResultsCache[field_id][query].paging[field_type][source_uri].pageSize;
      }
      catch (error) {
        return 0;
      }
    };


    service.setAutocompleteResultsPaging = function (field_id, query, field_type, source_uri, response) {

      // page, pageCount, pageSize, prevPage, nextPage
      var cache = service.autocompleteResultsCache[field_id][query];
      cache.paging = cache.paging || {};
      cache.paging[field_type] = cache.paging[field_type] || {};
      cache.paging[field_type][source_uri] = cache.paging[field_type][source_uri] || {
        page     : 0,
        pageCount: 1,
        pageSize : 1,
        prevPage : 0,
        nextPage : 0
      };

      if (response.hasOwnProperty('page')) {
        cache.paging[field_type][source_uri] = {
          page     : response.page,
          pageCount: response.pageCount,
          pageSize : response.pageSize,
          prevPage : response.prevPage,
          nextPage : response.nextPage
        };
      }
    };


    service.removeAutocompleteResultsForSource = function (id, query, source_uri) {
      // remove results for this source
      if (service.autocompleteResultsCache[id][query]) {
        for (var i = service.autocompleteResultsCache[id][query].results.length - 1; i >= 0; i--) {
          if (service.autocompleteResultsCache[id][query].results[i].sourceUri === source_uri) {
            service.autocompleteResultsCache[id][query].results.splice(i, 1);
          }
        }
      }
    };


    // is this term in the the cache?
    service.hasTerm = function (id, query, source_uri, termId) {
      var source = service.autocompleteResultsCache[id][query].results[source_uri];
      return source && source['@id'] == termId;
    };


    service.processAutocompleteClassResults = function (id, query, field_type, source_uri, response) {

      // results could be a list or not, put all results into an array
      var collection = [];
      var result;
      if (angular.isDefined(response.collection)) {
        for (i = 0; i < response.collection.length; i++) {
          result = {
            '@id'      : response.collection[i]['@id'],
            'notation' : response.collection[i].notation,
            'label'    : response.collection[i].prefLabel,
            'type'     : response.collection[i].type,
            'sourceUri': source_uri,
          };
          collection.push(result);
        }
      } else {
        result = {
          '@id'      : response['@id'],
          'notation' : response.notation,
          'label'    : response.prefLabel,
          'type'     : response.type,
          'sourceUri': source_uri,

        };
        collection.push(result);
      }

      // mark the ones we already have to prevent flicker
      for (var i = 0; i < collection.length; i++) {
        let index = service.autocompleteResultsCache[id][query].results.findIndex(item => (item['sourceUri'] == source_uri &&  item['@id'] == collection[i]['@id']));
        collection[i].found = (index > -1);
      }

      // merge the results not previously found
      for (i = 0; i < collection.length; i++) {
        if (!collection[i].found) {
          delete collection[i].found;
          service.autocompleteResultsCache[id][query].results.push(collection[i]);
        }
      }

      if (service.autocompleteResultsCache[id][query].results.length === 0) {
        service.autocompleteResultsCache[id][query].results.push({
          'label': $translate.instant('GENERIC.NoResults')
        });
      } else {
        for (i = 0; i < service.autocompleteResultsCache[id][query].results.length; i++) {
          if (service.autocompleteResultsCache[id][query].results[i].label == $translate.instant(
              'GENERIC.NoResults')) {
            service.autocompleteResultsCache[id][query].results.splice(i, 1);
            break;
          }
        }
      }

      // save the paging
      service.setAutocompleteResultsPaging(id, query, field_type, source_uri, response);

      // finally sort the list
      service.sortAutocompleteResults(id, query);
    };

    service.clearResults = function (id, term) {
      service.autocompleteResultsCache[id] = [];
      service.autocompleteResultsCache[id][term] = {
        'results': []
      };
      return service.autocompleteResultsCache[id][term].results;
    };

    service.initResults = function (id, term) {
      // initialize the results array
      if (angular.isUndefined(service.autocompleteResultsCache[id])) {
        service.autocompleteResultsCache[id] = [];
        service.autocompleteResultsCache[id][term] = {
          'results': []
        };
      }
      if (angular.isUndefined(service.autocompleteResultsCache[id][term])) {
        service.autocompleteResultsCache[id][term] = {
          'results': []
        };
      }
      return service.autocompleteResultsCache[id][term].results;
    };

    // returns an array of promises
    service.updateFieldAutocomplete = function (field, term, next, index) {

      var query = term || '*';
      var results = [];
      var vcst = DataManipulationService.getValueConstraint(field);
      var id = DataManipulationService.getId(field);
      var promises = [];
      service.initResults(id, query);


      // are we searching for classes?
      if (vcst.classes && vcst.classes.length > 0) {
        service.removeAutocompleteResultsForSource(id, query, 'template');
        angular.forEach(vcst.classes, function (klass) {
          if (query == '*') {
            service.autocompleteResultsCache[id][query].results.push(
                {
                  '@id'       : klass.uri,
                  'label'     : klass.label,
                  'rdfs:label': klass.label,
                  'type'      : klass.type,
                  'sourceUri' : 'template',

                }
            );
          } else {
            if (klass && klass.label && klass.label.toLowerCase().indexOf(query.toLowerCase()) !== -1) {
              service.autocompleteResultsCache[id][query].results.push(
                  {
                    '@id'       : klass.uri,
                    'label'     : klass.label,
                    'rdfs:label': klass.label,
                    'type'      : klass.type,
                    'sourceUri' : 'template'
                  }
              );
            }
          }
        });
        if (query !== '*') {
          if (service.autocompleteResultsCache[id][query].results.length === 0) {
            service.autocompleteResultsCache[id][query].results.push({
              'label'    : $translate.instant('GENERIC.NoResults'),
              'sourceUri': 'template'
            });
          }
        }
      }

      if (vcst.valueSets && vcst.valueSets.length > 0) {
        angular.forEach(vcst.valueSets, function (valueSet) {
          if (query == '*') {
            service.removeAutocompleteResultsForSource(id, query, valueSet.uri);
          }

          let page = service.getPage(id, query, 'Value', valueSet.uri);
          if (!next || page) {

            let size = service.getSize(id, query, 'Value', valueSet.uri);
            var promise =
                controlledTermDataService.autocompleteValueSetClasses(query, valueSet.vsCollection,
                    valueSet.uri, page, size).then(function (childResponse) {
                  service.processAutocompleteClassResults(id, query, 'Value', valueSet.uri, childResponse);
                });
            promises.push(promise);
          }
        });
      }

      if (vcst.ontologies && vcst.ontologies.length > 0) {
        angular.forEach(vcst.ontologies, function (ontology) {
          if (query == '*') {
            service.removeAutocompleteResultsForSource(id, query, ontology.uri);
          }
          let page = service.getPage(id, query, 'OntologyClass', ontology.uri);
          if (!next || page) {

            let size = service.getSize(id, query, 'OntologyClass', ontology.uri);
            var promise = controlledTermDataService.autocompleteOntology(query, ontology.acronym, page, size).then(
                function (childResponse) {
                  service.processAutocompleteClassResults(id, query, 'OntologyClass', ontology.uri, childResponse);
                });
            promises.push(promise);
          }
        });
      }

      if (vcst.branches && vcst.branches.length > 0) {

        angular.forEach(vcst.branches, function (branch) {
          if (query == '*') {
            service.removeAutocompleteResultsForSource(id, query, branch.uri);
          }
          let page = service.getPage(id, query, branch.acronym, branch.uri);
          if (!next || page) {

            let size = service.getSize(id, query, branch.acronym, branch.uri);

            var promise = controlledTermDataService.autocompleteOntologySubtree(query, branch.acronym, branch.uri,
                branch.maxDepth, page, size).then(
                function (childResponse) {
                  service.processAutocompleteClassResults(id, query, 'OntologyClass', branch.uri, childResponse);
                }
            );

            promises.push(promise);
          }
        });
      }


      // only load the sorted move mods the first time, not on subsequent pages
      if (vcst.actions  && vcst.actions.length > 0 && !next) {


        angular.forEach(vcst.actions, function (action) {
          if (action.action == 'move') {

            if (!service.hasTerm(id, query, action.sourceUri, action['@id'])) {
              let uriArr = action.sourceUri.split('/');
              let classId = action['termUri'];

              if (action.type == "Value") {
                let vsCollection = uriArr[uriArr.length - 2];

                var promise =
                    controlledTermDataService.getValueTermById(vsCollection, action.sourceUri, classId).then(
                        function (childResponse) {
                          service.processAutocompleteClassResults(id, query, 'Value', action.sourceUri,
                              childResponse);
                        });
              }
              if (action.type == "OntologyClass") {
                let acronym = uriArr[uriArr.length - 1];

                var promise = controlledTermDataService.getClassById(acronym, classId).then(function (response) {
                  service.processAutocompleteClassResults(id, query, 'OntologyClass', action.sourceUri, response);
                });
              }
            }
            promises.push(promise);
          }

        });
      }

      return promises;
    };


    // Used in textfield.html
    // service.updateFieldAutocompleteOld = function (field, term) {
    //
    //   var query = term || '*';
    //   var results = [];
    //   var vcst = DataManipulationService.getValueConstraint(field);
    //   var id = DataManipulationService.getId(field);
    //
    //
    //   // initialize the results array
    //   if (angular.isUndefined(service.autocompleteResultsCache[id])) {
    //     service.autocompleteResultsCache[id] = [];
    //     service.autocompleteResultsCache[id][query] = {
    //       'results': []
    //     };
    //   }
    //   if (angular.isUndefined(service.autocompleteResultsCache[id][query])) {
    //     service.autocompleteResultsCache[id][query] = {
    //       'results': []
    //     };
    //   }
    //
    //   // are we searching for classes?
    //   if (vcst.classes && vcst.classes.length > 0) {
    //     service.removeAutocompleteResultsForSource(id, query, 'template');
    //     angular.forEach(vcst.classes, function (klass) {
    //       if (query == '*') {
    //         service.autocompleteResultsCache[id][query].results.push(
    //             {
    //               '@id'      : klass.uri,
    //               'label'    : klass.label,
    //               'type'     : 'Ontology Class',
    //               'sourceUri': 'template'
    //             }
    //         );
    //       } else {
    //         if (klass && klass.label && klass.label.toLowerCase().indexOf(query.toLowerCase()) !== -1) {
    //           service.autocompleteResultsCache[id][query].results.push(
    //               {
    //                 '@id'      : klass.uri,
    //                 'label'    : klass.label,
    //                 'type'     : 'Ontology Class',
    //                 'sourceUri': 'template'
    //               }
    //           );
    //         }
    //       }
    //     });
    //     if (query !== '*') {
    //       if (service.autocompleteResultsCache[id][query].results.length === 0) {
    //         service.autocompleteResultsCache[id][query].results.push({
    //           'label'    : $translate.instant('GENERIC.NoResults'),
    //           'sourceUri': 'template'
    //         });
    //       }
    //     }
    //   }
    //
    //   if (vcst.valueSets && vcst.valueSets.length > 0) {
    //     angular.forEach(vcst.valueSets, function (valueSet) {
    //       if (query == '*') {
    //         service.removeAutocompleteResultsForSource(id, query, valueSet.uri);
    //       }
    //       controlledTermDataService.autocompleteValueSetClasses(query, valueSet.vsCollection,
    //           valueSet.uri).then(function (childResponse) {
    //         service.processAutocompleteClassResults(id, query, 'Value Set Class', valueSet.uri, childResponse);
    //       });
    //     });
    //   }
    //
    //   if (vcst.ontologies && vcst.ontologies.length > 0) {
    //     angular.forEach(vcst.ontologies, function (ontology) {
    //       if (query == '*') {
    //         service.removeAutocompleteResultsForSource(id, query, ontology.uri);
    //       }
    //       controlledTermDataService.autocompleteOntology(query, ontology.acronym).then(function (childResponse) {
    //         service.processAutocompleteClassResults(id, query, 'Ontology Class', ontology.uri, childResponse);
    //       });
    //     });
    //   }
    //
    //   if (vcst.branches && vcst.branches.length > 0) {
    //     angular.forEach(vcst.branches, function (branch) {
    //       if (query == '*') {
    //         service.removeAutocompleteResultsForSource(id, query, branch.uri);
    //       }
    //       controlledTermDataService.autocompleteOntologySubtree(query, branch.acronym, branch.uri,
    //           branch.maxDepth).then(
    //           function (childResponse) {
    //             service.processAutocompleteClassResults(id, query, 'Ontology Class', branch.uri, childResponse);
    //           }
    //       );
    //     });
    //   }
    // };

    // Note that this only checks the values if the autocomplete cache has them and the cache
    // will be empty if the user didn't use autocomplete in this session for this field.
    service.isValueConformedToConstraint = function (value, location, id, vcst, query) {

      var isValid = true;
      if (value && service.autocompleteResultsCache && service.autocompleteResultsCache[id] && service.autocompleteResultsCache[id][query]) {
        var predefinedValues = service.autocompleteResultsCache[id][query].results;
        var isValid = false;

        angular.forEach(predefinedValues, function (val) {
          if (!isValid) {
            isValid = val[location] == value[location];
          }
        });
      }
      return isValid;
    };


    // is this term in the the cache?
    service.isCached = function (id, term, schema) {
      var result = false;

      if (term && id && service.autocompleteResultsCache && service.autocompleteResultsCache[id]) {
        var values = Object.values(service.autocompleteResultsCache[id]);
        angular.forEach(values, function (obj) {
          angular.forEach(obj.results, function (val) {
            if (val.label == term) {
              result = val;
            }
          });
        });
      }
      service.updateFieldAutocomplete(schema, term, false);
      return result;
    };

    return service;
  }

});
