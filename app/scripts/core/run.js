/*jslint node: true */
/*global define */
'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.core.run', [])
      .run(cedarTemplateEditorCoreRun);

  cedarTemplateEditorCoreRun.$inject = ['$rootScope', '$window', '$sce', '$translate', 'DataTemplateService',
                                        'DataManipulationService', 'FieldTypeService', 'UrlService', 'UIUtilService',
                                        'UserService', 'RichTextConfigService', 'CONST', 'controlledTermService', 'controlledTermDataService',
                                        'provisionalClassService', 'CedarUser', 'UISettingsService',
                                        'ValueRecommenderService', 'DataUtilService', 'TrackingService',
                                        '$httpParamSerializer', '$location'];


  function cedarTemplateEditorCoreRun($rootScope, $window, $sce, $translate, DataTemplateService,
                                      DataManipulationService, FieldTypeService, UrlService, UIUtilService, UserService,
                                      RichTextConfigService, CONST, ControlledTermService, controlledTermDataService, provisionalClassService,
                                      CedarUser, UISettingsService, ValueRecommenderService, DataUtilService,
                                      TrackingService, $httpParamSerializer, $location) {

    $rootScope.isArray = angular.isArray;

    $rootScope.pageId = null;

    $rootScope.sortableOptions = {
      handle: ".sortable-handler"
    };

    // Global utility functions

    // Simple function to check if an object is empty
    $rootScope.isEmpty = function (obj) {
      return !obj || Object.keys(obj).length === 0;
    };

    $rootScope.propertiesOf = function (fieldOrElement) {
      return DataManipulationService.getFieldProperties(fieldOrElement);
    };

    $rootScope.schemaOf = function (fieldOrElement) {
      return DataManipulationService.getFieldSchema(fieldOrElement);
    };

    $rootScope.console = function (txt, label) {
      console.log(label + ' ' + JSON.stringify(txt, null, 2));
    };

    $rootScope.isRuntime = function () {
      return $rootScope.pageId == 'RUNTIME';
    };

    $rootScope.elementIsMultiInstance = DataManipulationService.elementIsMultiInstance;

    $rootScope.isElement = function (value) {
      if (value && value['@type'] && value['@type'] == "https://schema.metadatacenter.org/core/TemplateElement") {
        return true;
      }
      else {
        return false;
      }
    };

    // Used in cedar-template-element.directive.js, form.directive
    $rootScope.findChildren = function (iterator, parentModel, parentKey, level) {
      var ctx, min, type, i;
      angular.forEach(iterator, function (value, name) {
        // Add @context information to instance
        if (name == '@context') {
          ctx = DataManipulationService.generateInstanceContext(value);
        }
      });

      angular.forEach(iterator, function (value, name) {
        // Add @context information to instance
        if (name == '@context') {
          parentModel['@context'] = DataManipulationService.generateInstanceContext(value);
        }
        // Add @type information to instance
        else if (name == '@type') {
          type = DataManipulationService.generateInstanceType(value);
          if (type) {
            parentModel['@type'] = type;
          }
        }

        min = value.minItems || 0;

        if (!DataUtilService.isSpecialKey(name)) {
          // We can tell we've reached an element level by its '@type' property
          if ($rootScope.schemaOf(value)['@type'] == 'https://schema.metadatacenter.org/core/TemplateElement') {

            if (DataManipulationService.isCardinalElement(value)) {
              if (!parentModel[name] || angular.isObject(parentModel[name])) {
                parentModel[name] = [];
              }

              for (i = 0; i < min - parentModel[name].length; i++) {
                parentModel[name].push({});
              }

              parentModel[name].splice(min, parentModel[name].length);
            } else {
              if (!parentModel[name] || angular.isArray(parentModel[name])) {
                parentModel[name] = {};
              }
            }
          } else {

            // Assign empty field instance model to $scope.model only if it does not exist
            if (!parentModel[name]) {
              if (!DataManipulationService.isCardinalElement(value)) {
                parentModel[name] = {};
              } else {
                parentModel[name] = [];
                for (i = 0; i < min; i++) {
                  var obj = {};
                  parentModel[name].push(obj);
                }
              }
            }

            var p = $rootScope.propertiesOf(value);

            // Add @type information to instance at the field level
            if (p && !angular.isUndefined(p['@type'])) {
              type = DataManipulationService.generateInstanceType(p['@type']);

              if (type) {
                if (angular.isArray(parentModel[name])) {
                  for (i = 0; i < min; i++) {
                    parentModel[name][i]["@type"] = type || "";
                  }
                } else {
                  parentModel[name]["@type"] = type || "";
                }
              }
            }
          }
        }
      });
    };

    $rootScope.scrollToAnchor = UIUtilService.scrollToAnchor;
    $rootScope.scrollToDomId = UIUtilService.scrollToDomId;
    $rootScope.toggleElement = UIUtilService.toggleElement;
    $rootScope.getDomId = DataManipulationService.getDomId;
    $rootScope.minCardinalities = DataManipulationService.generateCardinalities(0, 8, false);
    $rootScope.maxCardinalities = DataManipulationService.generateCardinalities(1, 8, true);

    // BioPortal term selection integration code.
    // TODO: separate the calls, create a service for these
    $rootScope.isKeyVisible = function (keyCode) {
      if (keyCode > 45 && keyCode < 112 && [91, 92, 93].indexOf(keyCode) == -1 ||
          keyCode >= 186 && keyCode <= 222 ||
          [8, 32, 173].indexOf(keyCode) >= 0) {
        return true;
      } else {
        return false;
      }
    };

    // Used in field.directive.js and textfield.html
    $rootScope.hasValueConstraint = function (vcst) {
      var result = vcst && (vcst.ontologies && vcst.ontologies.length > 0 ||
          vcst.valueSets && vcst.valueSets.length > 0 ||
          vcst.classes && vcst.classes.length > 0 ||
          vcst.branches && vcst.branches.length > 0);

      return result;
    };

    $rootScope.autocompleteResultsCache = {};

    // Used here
    $rootScope.sortAutocompleteResults = function (field_id) {
      $rootScope.autocompleteResultsCache[field_id].results.sort(function (a, b) {
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

    // Used here
    $rootScope.removeAutocompleteResultsForSource = function (field_id, source_uri) {
      // remove results for this source
      for (var i = $rootScope.autocompleteResultsCache[field_id].results.length - 1; i >= 0; i--) {
        if ($rootScope.autocompleteResultsCache[field_id].results[i].sourceUri === source_uri) {
          $rootScope.autocompleteResultsCache[field_id].results.splice(i, 1);
        }
      }
    };

    // Used here
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

    // Used in textfield.html
    $rootScope.updateFieldAutocomplete = function (field, term) {
      // Only populate the field at runtime
      if ($rootScope.isRuntime()) {
        if (term === '') {
          term = '*';
        }
        var results = [];
        var vcst = $rootScope.schemaOf(field)._valueConstraints;
        var field_id = $rootScope.schemaOf(field)['@id'];

        if (angular.isUndefined($rootScope.autocompleteResultsCache[field_id])) {
          $rootScope.autocompleteResultsCache[field_id] = {
            'results': []
          };
        }

        if (vcst.classes && vcst.classes.length > 0) {
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

        if (vcst.valueSets && vcst.valueSets.length > 0) {
          angular.forEach(vcst.valueSets, function (valueSet) {
            if (term == '*') {
              $rootScope.removeAutocompleteResultsForSource(field_id, valueSet.uri);
            }
            controlledTermDataService.autocompleteValueSetClasses(term, valueSet.vsCollection,
                valueSet.uri).then(function (childResponse) {
                  $rootScope.processAutocompleteClassResults(field_id, 'Value Set Class', valueSet.uri, childResponse);
                });
          });
        }

        if (vcst.ontologies && vcst.ontologies.length > 0) {
          angular.forEach(vcst.ontologies, function (ontology) {
            if (term == '*') {
              $rootScope.removeAutocompleteResultsForSource(field_id, ontology.uri);
            }
            controlledTermDataService.autocompleteOntology(term, ontology.acronym).then(function (childResponse) {
              $rootScope.processAutocompleteClassResults(field_id, 'Ontology Class', ontology.uri, childResponse);
            });
          });
        }

        if (vcst.branches && vcst.branches.length > 0) {
          angular.forEach(vcst.branches, function (branch) {
            if (term == '*') {
              $rootScope.removeAutocompleteResultsForSource(field_id, branch.uri);
            }
            controlledTermDataService.autocompleteOntologySubtree(term, branch.acronym, branch.uri,
                branch.maxDepth).then(
                function (childResponse) {
                  $rootScope.processAutocompleteClassResults(field_id, 'Ontology Class', branch.uri, childResponse);
                }
            );
          });
        }
      }
    };

    // Used here by isValueConformedToConstraint
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

    // Used in field.directive
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
      return obj && obj["@type"] && obj["@type"].indexOf("Ontology") > 0;
    };

    // Used in controlled-term.directive
    $rootScope.lengthOfValueConstraint = function (valueConstraint) {
      return (valueConstraint.classes || []).length +
          (valueConstraint.valueSets || []).length +
          (valueConstraint.ontologies || []).length +
          (valueConstraint.branches || []).length;
    };

    // Used in richtext.html
    $rootScope.getUnescapedContent = function (field) {
      return $sce.trustAsHtml($rootScope.propertiesOf(field)._content);
    };

    CedarUser.init();
    // Make it available for everybody through rootScope
    $rootScope.cedarUser = CedarUser;

    // Inject user data:
    // read from Keycloak
    // read in Non-Angular way from user.... REST endpoint
    UserService.injectUserHandler($window.bootstrapUserHandler);


    // the below console.log statements break the karma tests
    // User data is available at this point:
    // console.log("Cedar service providing user data at this point:");
    // console.log(Cedar.getUserId());
    // console.log(Cedar.getScreenName());
    // console.log(Cedar.getHome());
    // console.log(CedarUser.getPermissions());

    // Init the services that have dependencies on configuration
    DataTemplateService.init();
    FieldTypeService.init();
    UrlService.init();
    provisionalClassService.init();
    controlledTermDataService.init();
    DataManipulationService.init();
    UISettingsService.init();
    TrackingService.init();

    // Make objects available through rootScope
    $rootScope.cts = ControlledTermService;
    $rootScope.vrs = ValueRecommenderService;
    $rootScope.editorOptions = RichTextConfigService.getConfig("default");

    $rootScope.util = {
      buildUrl: function (url, params) {
        var serializedParams = $httpParamSerializer(params);
        if (serializedParams.length > 0) {
          url += ((url.indexOf('?') === -1) ? '?' : '&') + serializedParams;
        }
        return url;
      }
    };

    //$rootScope.$on('$locationChangeStart', function (event) {
    //  $rootScope.setHeader();
    //});

    $rootScope.setHeader = function () {

      var e = jQuery("#top-navigation");
      e.removeClass('metadata').removeClass('template').removeClass('dashboard').removeClass('element');
      //jQuery("body").css('overflow:scroll');

      if ($location.path().startsWith("/dashboard")) {
        //jQuery("body").css('overflow:hidden');
        e.addClass('dashboard');
      } else if ($location.path().startsWith("/elements")) {
        e.addClass('element');

      } else if ($location.path().startsWith("/templates")) {
        e.addClass('template');

      } else if ($location.path().startsWith("/instances")) {
        e.addClass('metadata');
      }
    };

    // keeping track of dirty documents, i.e. with edits or not
    $rootScope.dirty = false;

    $rootScope.setDirty = function(value) {
      $rootScope.dirty = value;
    };

    $rootScope.isDirty = function() {
      return $rootScope.dirty;
    }

    $rootScope.useRunTimeCode = false ;


  };

});
