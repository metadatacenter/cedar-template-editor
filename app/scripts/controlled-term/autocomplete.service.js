'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.controlledTerm.autocompleteService', [])
      .factory('autocompleteService', autocompleteService);

  autocompleteService.$inject = ['$rootScope', '$translate', 'controlledTermDataService'];

  function autocompleteService($rootScope, $translate, controlledTermDataService) {
    var service = {
      serviceId: "autocompleteService",
      autocompleteResultsCache : {}
    };

    service.sortAutocompleteResults = function (field_id) {
      service.autocompleteResultsCache[field_id].results.sort(function (a, b) {
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

    service.removeAutocompleteResultsForSource = function (field_id, source_uri) {
      // remove results for this source
      for (var i = service.autocompleteResultsCache[field_id].results.length - 1; i >= 0; i--) {
        if (service.autocompleteResultsCache[field_id].results[i].sourceUri === source_uri) {
          service.autocompleteResultsCache[field_id].results.splice(i, 1);
        }
      }
    };

    service.processAutocompleteClassResults = function (field_id, field_type, source_uri, response) {
      console.log('processAutocompleteClassResults ' + field_id);console.log(response);
      var i, j, found;
      // we do a complicated method to find the changed results to reduce flicker :-/
      for (j = service.autocompleteResultsCache[field_id].results.length - 1; j >= 0; j--) {
        if (service.autocompleteResultsCache[field_id].results[j].sourceUri != source_uri) {
          // we only care about the ones from this source
          continue;
        }
        found = false;
        if (angular.isDefined(response.collection)) {
          for (i = 0; i < response.collection.length; i++) {
            if (response.collection[i]['@id'] == service.autocompleteResultsCache[field_id].results[j]['@id']) {
              // this option still in the result set -- mark it
              response.collection[i].found = true;
              found = true;
            }
          }
        }
        if (!found) {
          // need to remove this option
          service.autocompleteResultsCache[field_id].results.splice(j, 1);
        }
      }
      if (angular.isDefined(response.collection)) {
        for (i = 0; i < response.collection.length; i++) {
          if (!response.collection[i].found) {
            service.autocompleteResultsCache[field_id].results.push(
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
      if (service.autocompleteResultsCache[field_id].results.length === 0) {
        service.autocompleteResultsCache[field_id].results.push({
          'label': $translate.instant('GENERIC.NoResults')
        });
      } else {
        for (i = 0; i < service.autocompleteResultsCache[field_id].results.length; i++) {
          if (service.autocompleteResultsCache[field_id].results[i].label == $translate.instant(
                  'GENERIC.NoResults')) {
            service.autocompleteResultsCache[field_id].results.splice(i, 1);
            break;
          }
        }
        service.sortAutocompleteResults(field_id);
      }
      console.log(service.autocompleteResultsCache[field_id]);
    };

    // Used in textfield.html
    service.updateFieldAutocomplete = function (field, term) {

        if (term === '') {
          term = '*';
        }
        var results = [];
        var vcst = $rootScope.schemaOf(field)._valueConstraints;
        var field_id = $rootScope.schemaOf(field)['@id'];

        if (angular.isUndefined(service.autocompleteResultsCache[field_id])) {
          service.autocompleteResultsCache[field_id] = {
            'results': []
          };
        }

        if (vcst.classes && vcst.classes.length > 0) {
          service.removeAutocompleteResultsForSource(field_id, 'template');
          angular.forEach(vcst.classes, function (klass) {
            if (term == '*') {
              service.autocompleteResultsCache[field_id].results.push(
                  {
                    '@id'      : klass.uri,
                    'label'    : klass.label,
                    'type'     : 'Ontology Class',
                    'sourceUri': 'template'
                  }
              );
            } else {
              if (klass && klass.label && klass.label.toLowerCase().indexOf(term.toLowerCase()) !== -1) {
                service.autocompleteResultsCache[field_id].results.push(
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
          if (term !== '*') {
            if (service.autocompleteResultsCache[field_id].results.length === 0) {
              service.autocompleteResultsCache[field_id].results.push({
                'label'    : $translate.instant('GENERIC.NoResults'),
                'sourceUri': 'template'
              });
            }
          }
        }

        if (vcst.valueSets && vcst.valueSets.length > 0) {
          angular.forEach(vcst.valueSets, function (valueSet) {
            if (term == '*') {
              service.removeAutocompleteResultsForSource(field_id, valueSet.uri);
            }
            controlledTermDataService.autocompleteValueSetClasses(term, valueSet.vsCollection,
                valueSet.uri).then(function (childResponse) {
              service.processAutocompleteClassResults(field_id, 'Value Set Class', valueSet.uri, childResponse);
            });
          });
        }

        if (vcst.ontologies && vcst.ontologies.length > 0) {
          angular.forEach(vcst.ontologies, function (ontology) {
            if (term == '*') {
              service.removeAutocompleteResultsForSource(field_id, ontology.uri);
            }
            controlledTermDataService.autocompleteOntology(term, ontology.acronym).then(function (childResponse) {
              service.processAutocompleteClassResults(field_id, 'Ontology Class', ontology.uri, childResponse);
            });
          });
        }

        if (vcst.branches && vcst.branches.length > 0) {
          angular.forEach(vcst.branches, function (branch) {
            if (term == '*') {
              service.removeAutocompleteResultsForSource(field_id, branch.uri);
            }
            controlledTermDataService.autocompleteOntologySubtree(term, branch.acronym, branch.uri,
                branch.maxDepth).then(
                function (childResponse) {
                  service.processAutocompleteClassResults(field_id, 'Ontology Class', branch.uri, childResponse);
                }
            );
          });
        }
    };


    return service;
  }

});
