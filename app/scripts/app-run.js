/*jslint node: true */
/*global angularApp */
/*global angular */
/*global jQuery */
'use strict';

var angularRun = function ($rootScope, BioPortalService, $location, $timeout, $window, $translate,
                           DataTemplateService, DataManipulationService, FieldTypeService, UrlService, HeaderService, UIUtilService,
                           CONST) {

  $rootScope.isArray = angular.isArray;

  $rootScope.applicationMode = CONST.applicationMode.DEFAULT;
  $rootScope.applicationRole = 'instantiator';
  $rootScope.pageId = null;

  // Global utility functions

  // Simple function to check if an object is empty
  $rootScope.isEmpty = function (obj) {
    return Object.keys(obj).length === 0;
  };

  $rootScope.isRuntime = function () {
    return $rootScope.pageId == 'RUNTIME';
  };

  // ** Exposed functions from services
  $rootScope.scrollToAnchor = UIUtilService.scrollToAnchor;
  $rootScope.elementIsMultiInstance = DataManipulationService.elementIsMultiInstance;


  var minCardinalities = DataManipulationService.generateCardinalities(8);
  var maxCardinalities = DataManipulationService.generateCardinalities(8);
  maxCardinalities.push({value: 0, label: "N"});

  $rootScope.minCardinalities = minCardinalities;
  $rootScope.maxCardinalities = maxCardinalities;

  // BioPortal term selection integration code.
  // TODO: separate the calls, create a service for these

  $rootScope.isKeyVisible = function (keyCode) {
    if (keyCode > 45 && keyCode < 112 && [91, 92, 93].indexOf(
        keyCode) == -1 || keyCode >= 186 && keyCode <= 222 || [8, 32, 173].indexOf(keyCode) >= 0) {
      return true;
    } else {
      return false;
    }
  };

  $rootScope.hasValueConstraint = function (vcst) {
    var result = vcst && (vcst.ontologies && vcst.ontologies.length > 0 ||
      vcst.valueSets && vcst.valueSets.length > 0 ||
      vcst.classes && vcst.classes.length > 0 ||
      vcst.branches && vcst.branches.length > 0);

    return result;
  };

  $rootScope.autocompleteResultsCache = {};

  $rootScope.sortAutocompleteResults = function (field_id) {
    $rootScope.autocompleteResultsCache[field_id].results.sort(function (a, b) {
      var labelA = a.label.toLowerCase();
      var labelB = b.label.toLowerCase();
      if (labelA < labelB)
        return -1;
      if (labelA > labelB)
        return 1;
      return 0;
    });
  };

  $rootScope.removeAutocompleteResultsForSource = function (field_id, source_uri) {
    // remove results for this source
    for (var i = $rootScope.autocompleteResultsCache[field_id].results.length - 1; i >= 0; i--) {
      if ($rootScope.autocompleteResultsCache[field_id].results[i].sourceUri === source_uri) {
        $rootScope.autocompleteResultsCache[field_id].results.splice(i, 1);
      }
    }
  };

  $rootScope.processAutocompleteClassResults = function (field_id, field_type, source_uri, response) {
    var i, j, found;
    // we do a complicated method to find the changed results to reduce flicker :-/
    for (j = $rootScope.autocompleteResultsCache[field_id].results.length - 1; j >= 0; j--) {
      if ($rootScope.autocompleteResultsCache[field_id].results[j].sourceUri != source_uri) {
        // we only care about the ones from this source
        continue;
      }
      found = false;
      for (i = 0; i < response.collection.length; i++) {
        if (response.collection[i]['@id'] == $rootScope.autocompleteResultsCache[field_id].results[j]['@id']) {
          // this option still in the result set -- mark it
          response.collection[i].found = true;
          found = true;
        }
      }
      if (!found) {
        // need to remove this option
        $rootScope.autocompleteResultsCache[field_id].results.splice(j, 1);
      }
    }
    for (i = 0; i < response.collection.length; i++) {
      if (!response.collection[i].found) {
        $rootScope.autocompleteResultsCache[field_id].results.push(
          {
            '@id'      : response.collection[i]['@id'],
            'label'    : response.collection[i].prefLabel,
            'type'     : field_type,
            'sourceUri': source_uri
          }
        );
      }
    }
    if ($rootScope.autocompleteResultsCache[field_id].results.length === 0) {
      $rootScope.autocompleteResultsCache[field_id].results.push({
        'label': $translate.instant('GENERIC.NoResults')
      });
    } else {
      for (i = 0; i < $rootScope.autocompleteResultsCache[field_id].results.length; i++) {
        if ($rootScope.autocompleteResultsCache[field_id].results[i].label == $translate.instant('GENERIC.NoResults')) {
          $rootScope.autocompleteResultsCache[field_id].results.splice(i, 1);
          break;
        }
      }
      $rootScope.sortAutocompleteResults(field_id);
    }
  };

  $rootScope.updateFieldAutocomplete = function (field, term) {
    if (term === '') {
      term = '*';
    }
    var results = [];
    var vcst = field.properties._valueConstraints;
    var field_id = field['@id'];

    if (angular.isUndefined($rootScope.autocompleteResultsCache[field_id])) {
      $rootScope.autocompleteResultsCache[field_id] = {
        'results': []
      };
    }

    if (vcst.classes.length > 0) {
      $rootScope.removeAutocompleteResultsForSource(field_id, 'template');
      angular.forEach(vcst.classes, function (klass) {
        if (term == '*') {
          $rootScope.autocompleteResultsCache[field_id].results.push(
            {
              '@id'      : klass.uri,
              'label'    : klass.label,
              'type'     : 'Ontology Class',
              'sourceUri': 'template'
            }
          );
        } else {
          if (klass && klass.label && klass.label.toLowerCase().indexOf(term.toLowerCase()) !== -1) {
            $rootScope.autocompleteResultsCache[field_id].results.push(
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
        if ($rootScope.autocompleteResultsCache[field_id].results.length === 0) {
          $rootScope.autocompleteResultsCache[field_id].results.push({
            'label'    : $translate.instant('GENERIC.NoResults'),
            'sourceUri': 'template'
          });
        }
      }
    }

    if (vcst.valueSets.length > 0) {
      angular.forEach(vcst.valueSets, function (valueSet) {
        if (term == '*') {
          $rootScope.removeAutocompleteResultsForSource(field_id, valueSet.uri);
        }
        BioPortalService.autocompleteValueSetClasses(term, valueSet.uri).then(function (childResponse) {
          $rootScope.processAutocompleteClassResults(field_id, 'Value Set Class', valueSet.uri, childResponse);
        });
      });
    }

    if (vcst.ontologies.length > 0) {
      angular.forEach(vcst.ontologies, function (ontology) {
        if (term == '*') {
          $rootScope.removeAutocompleteResultsForSource(field_id, ontology.uri);
        }
        BioPortalService.autocompleteOntology(term, ontology.acronym).then(function (childResponse) {
          $rootScope.processAutocompleteClassResults(field_id, 'Ontology Class', ontology.uri, childResponse);
        });
      });
    }

    if (vcst.branches.length > 0) {
      angular.forEach(vcst.branches, function (branch) {
        if (term == '*') {
          $rootScope.removeAutocompleteResultsForSource(field_id, branch.uri);
        }
        BioPortalService.autocompleteOntologySubtree(term, branch.acronym, branch.uri, branch.maxDepth).then(
          function (childResponse) {
            $rootScope.processAutocompleteClassResults(field_id, 'Ontology Class', branch.uri, childResponse);
          });
      });
    }
  };

  $rootScope.excludedValueConstraint = function (id, vcst) {
    if ($rootScope.excludedValues && $rootScope.excludedValues[id]) {
      return $rootScope.excludedValues[id];
    }

    var results = [];

    if (vcst.classes.length > 0) {
      angular.forEach(vcst.classes, function (klass) {
        jQuery.merge(results, klass.exclusions || []);
      });
    }

    if (vcst.valueSets.length > 0) {
      angular.forEach(vcst.valueSets, function (klass) {
        jQuery.merge(results, klass.exclusions || []);
      });
    }

    if (vcst.ontologies.length > 0) {
      angular.forEach(vcst.ontologies, function (klass) {
        jQuery.merge(results, klass.exclusions || []);
      });
    }

    if (vcst.branches.length > 0) {
      angular.forEach(vcst.branches, function (klass) {
        jQuery.merge(results, klass.exclusions || []);
      });
    }

    $rootScope.excludedValues = $rootScope.excludedValues || {};
    $rootScope.excludedValues[id] = results;

    return results;
  };

  $rootScope.isValueConformedToConstraint = function (value, id, vcst) {
    var predefinedValues = $rootScope.autocompleteResultsCache[id].results;
    var excludedValues = $rootScope.excludedValueConstraint(id, vcst);
    var isValid = false;
    var jsonString = JSON.stringify(value);

    angular.forEach(predefinedValues, function (val) {
      if (!isValid) {
        // IMPORTANT: this compare only valid if the 2 objects are simple
        // and all properties are in the same order.
        isValid = JSON.stringify(val) == jsonString;
      }
    });

    isValid = excludedValues.indexOf(value.uri) == -1;

    return isValid;
  };

  $rootScope.isOntology = function (obj) {
    return obj["@type"] && obj["@type"].indexOf("Ontology") > 0;
  };

  $rootScope.lengthOfValueConstraint = function (valueConstraint) {
    return (valueConstraint.classes || []).length +
      (valueConstraint.valueSets || []).length +
      (valueConstraint.ontologies || []).length +
      (valueConstraint.branches || []).length;
  };

  DataTemplateService.init();
  FieldTypeService.init();
  UrlService.init();
  DataManipulationService.init();
  HeaderService.init();

  var pt = $window.keycloakBootstrap.getParsedToken();
  $rootScope.currentUser = {
    "name": pt.name,
    "id": pt.sub,
    "email": pt.email,
    "roles": pt.realm_access.roles
  };
  //console.log("angular currentUser");
  //console.log($rootScope.currentUser);
};

angularRun.$inject = ['$rootScope', 'BioPortalService', '$location', '$timeout', '$window', '$translate',
  'DataTemplateService', 'DataManipulationService', 'FieldTypeService', 'UrlService', 'HeaderService', 'UIUtilService',
  'CONST'];
angularApp.run(angularRun);