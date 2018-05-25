'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.controlledTerm.autocompleteService', [])
      .factory('autocompleteService', autocompleteService);

  autocompleteService.$inject = ['$translate', 'controlledTermDataService', 'DataManipulationService'];

  function autocompleteService($translate, controlledTermDataService, DataManipulationService) {
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

    service.removeAutocompleteResultsForSource = function (id, query, source_uri) {
      // remove results for this source
      for (var i = service.autocompleteResultsCache[id][query].results.length - 1; i >= 0; i--) {
        if (service.autocompleteResultsCache[id][query].results[i].sourceUri === source_uri) {
          service.autocompleteResultsCache[id][query].results.splice(i, 1);
        }
      }
    };

    service.processAutocompleteClassResults = function (id, query, field_type, source_uri, response) {

      var i, j, found;
      // we do a complicated method to find the changed results to reduce flicker :-/
      for (j = service.autocompleteResultsCache[id][query].results.length - 1; j >= 0; j--) {
        if (service.autocompleteResultsCache[id][query].results[j].sourceUri != source_uri) {
          // we only care about the ones from this source
          continue;
        }
        found = false;
        if (angular.isDefined(response.collection)) {
          for (i = 0; i < response.collection.length; i++) {
            if (response.collection[i]['@id'] == service.autocompleteResultsCache[id][query].results[j]['@id']) {
              // this option still in the result set -- mark it
              response.collection[i].found = true;
              found = true;
            }
          }
        }
        if (!found) {
          // need to remove this option
          service.autocompleteResultsCache[id][query].results.splice(j, 1);
        }
      }
      if (angular.isDefined(response.collection)) {
        for (i = 0; i < response.collection.length; i++) {
          if (!response.collection[i].found) {
            service.autocompleteResultsCache[id][query].results.push(
                {
                  '@id'      : response.collection[i]['@id'],
                  'label'    : response.collection[i].prefLabel,
                  'type'     : field_type,
                  'sourceUri': source_uri
                }
            );
          }
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
        service.sortAutocompleteResults(id, query);
      }
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

    // Used in textfield.html
    service.updateFieldAutocomplete = function (field, term) {

      var query = term || '*';
      var results = [];
      var vcst = DataManipulationService.getValueConstraint(field);
      var id = DataManipulationService.getId(field);


      // initialize the results array
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

      // are we searching for classes?
      if (vcst.classes && vcst.classes.length > 0) {
        service.removeAutocompleteResultsForSource(id, query, 'template');
        angular.forEach(vcst.classes, function (klass) {
          if (query == '*') {
            service.autocompleteResultsCache[id][query].results.push(
                {
                  '@id'      : klass.uri,
                  'label'    : klass.label,
                  'type'     : 'Ontology Class',
                  'sourceUri': 'template'
                }
            );
          } else {
            if (klass && klass.label && klass.label.toLowerCase().indexOf(query.toLowerCase()) !== -1) {
              service.autocompleteResultsCache[id][query].results.push(
                  {
                    '@id'      : klass.uri,
                    'label'    : klass.label,
                    'type'     : 'Ontology Class',
                    'sourceUri': 'template'
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
          controlledTermDataService.autocompleteValueSetClasses(query, valueSet.vsCollection,
              valueSet.uri).then(function (childResponse) {
            service.processAutocompleteClassResults(id, query, 'Value Set Class', valueSet.uri, childResponse);
          });
        });
      }

      if (vcst.ontologies && vcst.ontologies.length > 0) {
        angular.forEach(vcst.ontologies, function (ontology) {
          if (query == '*') {
            service.removeAutocompleteResultsForSource(id, query, ontology.uri);
          }
          controlledTermDataService.autocompleteOntology(query, ontology.acronym).then(function (childResponse) {
            service.processAutocompleteClassResults(id, query, 'Ontology Class', ontology.uri, childResponse);
          });
        });
      }

      if (vcst.branches && vcst.branches.length > 0) {
        angular.forEach(vcst.branches, function (branch) {
          if (query == '*') {
            service.removeAutocompleteResultsForSource(id, query, branch.uri);
          }
          controlledTermDataService.autocompleteOntologySubtree(query, branch.acronym, branch.uri,
              branch.maxDepth).then(
              function (childResponse) {
                service.processAutocompleteClassResults(id, query, 'Ontology Class', branch.uri, childResponse);
              }
          );
        });
      }
    };

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
            result = result || (val.label == term);
          });
        });
      }
      service.updateFieldAutocomplete(schema, term);
      return result;
    };

    // // is this term in the the cache?
    // service.getTermDetails = function (id, term) {
    //   var result = null;
    //
    //   if (term && id && service.autocompleteResultsCache && service.autocompleteResultsCache[id]) {
    //     var values = Object.values(service.autocompleteResultsCache[id]);
    //     angular.forEach(values, function (obj) {
    //       angular.forEach(obj.results, function (val) {
    //         if (val.label == term) {
    //           result = val;
    //         }
    //       });
    //     });
    //   }
    //
    //   service.updateFieldAutocomplete(schema, term);
    //   return result;
    // };

    return service;
  }

});
