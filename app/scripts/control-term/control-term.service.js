'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.controlTerm.controlTermService', [])
      .factory('controlTermService', controlTermService);

  controlTermService.$inject = ['$q', '$rootScope', 'controlTermDataService'];

  function controlTermService($q, $rootScope, controlTermDataService) {

    var service = {
      getAcronym             : getAcronym,
      getSelfUrl             : getSelfUrl,
      loadOntologyRootClasses: loadOntologyRootClasses,
      loadTreeOfClass        : loadTreeOfClass,
      sortBrowseResults      : sortBrowseResults,
      sortOntologyTree       : sortOntologyTree,
      getLastFragmentOfUri   : getLastFragmentOfUri
    };

    return service;

    /**
     * Service methods.
     */

    function getAcronym(subtree) {
      return subtree.ontology.substr(subtree.ontology.lastIndexOf('/') + 1);
    }

    function getSelfUrl(resource) {
      var selfUrl;
      if (resource.links) {
        selfUrl = resource.links.self;
      }
      else {
        if (resource.type == 'ontology' ||  resource.type == 'Ontology') {
          var acronym = resource.ontology.substr(resource.ontology.lastIndexOf('/') + 1);
          selfUrl = "http://data.bioontology.org/ontologies/" + acronym + "/classes/" + encodeURIComponent(resource["@id"]);
        }
        else if (resource.type == 'ValueSet') {

          if (resource.provisional) {
            selfUrl = resource["@id"];
          }
          else {
            var acronym = resource.vsCollection.substr(resource.vsCollection.lastIndexOf('/') + 1);
            selfUrl = "http://data.bioontology.org/ontologies/" + acronym + "/classes/" + encodeURIComponent(resource["@id"]);
          }
        }


      }
      return selfUrl;
    }

    /**
     * Browse results sort.
     */
    function sortBrowseResults(a, b) {
      var aName = getValuesBrowseDisplayLabel(a);
      var bName = getValuesBrowseDisplayLabel(b);
      if (aName < bName) {
        return -1;
      } else if (aName == bName) {
        return 0;
      } else {
        return 1;
      }
    }

    /**
     * Ontology tree sort.
     */
    function sortOntologyTree(a, b) {
      if (a.prefLabel < b.prefLabel) {
        return -1;
      } else if (a.prefLabel == b.prefLabel) {
        return 0;
      } else {
        return 1;
      }
    }

    function getLastFragmentOfUri(uri) {
      return uri.substr(uri.lastIndexOf('/') + 1);
    }

    /**
     * Private functions.
     */

    /**
     * Helper function to get display label of values browse result.
     */
    function getValuesBrowseDisplayLabel(result) {
      if (result.type == 'Ontology') {
        return result.name.trim();
      } else if (result.type == 'ValueSet') {
        return result.prefLabel.trim();
      }
    }

    function loadOntologyRootClasses(ontology, $scope) {
      $scope.fieldTreeVisibility = true;
      $scope.searchPreloader = true;
      $q.all({
        info: ontology,
        tree: controlTermDataService.getRootClasses(ontology.id)
      }).then(function (values) {
        if ($scope.fieldTreeVisibility == true) {
          if (values.tree && angular.isArray(values.tree)) {
            values.tree.sort(controlTermService.sortOntologyTree);
            $scope.currentOntology = values;
          } else {
            // TODO: Handle error
            if (values.tree.status == 404) {
              alert("No submissions available");
            } else {
              alert(values.tree.statusText);
            }
          }
        }
        $scope.searchPreloader = false;
      });
    }

    /**
     * Show ontology tree and details screen.
     */
    function loadTreeOfClass(selection, $scope) {
      // TODO: try to remove this statement
      if (selection.sourceId) {
        var ontologyAcronym = getLastFragmentOfUri(selection.sourceId);
      }
      else {
        var ontologyAcronym = getLastFragmentOfUri(selection.source);
      }
      $scope.fieldTreeVisibility = true;
      $scope.searchPreloader = true;

      $scope.isLoadingClassDetails = true;

      controlTermDataService.getClassById(ontologyAcronym, selection["@id"]).then(function (response) {
        $scope.classDetails = response;
      });

      $scope.selectedClass1 = selection;

      $q.all({
        info: controlTermDataService.getOntologyById(ontologyAcronym),
        tree: controlTermDataService.getClassTree(ontologyAcronym, selection['@id']),
      }).then(function (values) {
        if ($scope.fieldTreeVisibility == true) {
          $scope.currentOntology = values;
          if ($scope.currentOntology.tree && angular.isArray($scope.currentOntology.tree)) {
            angular.forEach($scope.currentOntology.tree, function (node) {
              if (node["@type"].indexOf("Ontology") >= 0) {
                node.type = "Ontology";
              } else {
                node.type = "ValueSet";
              }
            })
          }
        }
        $scope.searchPreloader = false;
        $scope.isLoadingClassDetails = false;
      });
    }

  }
});
