'use strict';

define([
  'angular'
], function(angular) {
  angular.module('cedar.templateEditor.controlTerm.controlTermService', [])
    .factory('controlTermService', controlTermService);

  controlTermService.$inject = ['$q', '$rootScope', 'controlTermDataService'];

  function controlTermService($q, $rootScope, controlTermDataService) {

    var service = {
      //getOntologyByAcronym: getOntologyByAcronym,
      getAcronym: getAcronym,
      getSelfUrl: getSelfUrl,
      loadOntologyRootClasses: loadOntologyRootClasses,
      loadTreeOfClass: loadTreeOfClass,
      sortBrowseResults: sortBrowseResults,
      sortOntologyTree: sortOntologyTree,
    };

    return service;

    /**
     * Service methods.
     */

    /**
     * Find ontology from cache by acronym.
     */
    //function getOntologyByAcronym(acronym) {
    //  // TODO: Refresh cache in case it is empty?
    //  for (var i = 0; i < $rootScope.ontologies.length; i++) {
    //    if (angular.uppercase($rootScope.ontologies[i].acronym) == angular.uppercase(acronym)) {
    //      return $rootScope.ontologies[i];
    //    }
    //  };
    //}

    function getAcronym(subtree) {
      if (subtree.ontology) {
        return subtree.ontology.substr(subtree.ontology.lastIndexOf('/') + 1);
      }
      else if (subtree.links.ontology) {
        return subtree.links.ontology.substr(subtree.links.ontology.lastIndexOf('/') + 1);
      }
    }

    function getSelfUrl(resource) {
      var selfUrl;
      if (resource.links) {
        selfUrl = resource.links.self;
      }
      else {
        if (resource.type == 'Ontology') {
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
      //var classesUrl = ontology.links.classes;
      console.log("ONTOLOGY");
      console.log(ontology);
      $scope.fieldTreeVisibility = true;
      $scope.searchPreloader = true;
      $q.all({
        //details:    controlTermDataService.getOntologyDetails(acronym),
        //size:       controlTermDataService.getOntologySize(acronym),
        //tree:       controlTermDataService.getOntologyValueSets(acronym),
        //details:    ontology.details,
        //size:       ontology.details.numberOfClasses,
        info:       ontology,
        tree:       controlTermDataService.getRootClasses(ontology.id)
      }).then(function(values) {
        if($scope.fieldTreeVisibility == true) {
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
      $scope.fieldTreeVisibility = true;
      $scope.searchPreloader = true;
      var acronym = controlTermDataService.getAcronym(selection);

      // Get selected class details from the links.self endpoint provided.
      //var selfUrl = selection.links.self;
      //if (!selfUrl) {
      //  selfUrl = selection.links.ontology + "/classes/" + encodeURIComponent(selection["@id"]);
      //}

      $scope.isLoadingClassDetails = true;

      controlTermDataService.getClassDetails(acronym, selection["@id"]).then(function(response) {
        $scope.classDetails = response;
      });

      $scope.selectedClass1 = selection;

      $q.all({
        //details:    controlTermDataService.getOntologyDetails(acronym),
        //size:       controlTermDataService.getOntologySize(acronym),
        info:       controlTermDataService.getOntologyById(acronym),
        tree:       controlTermDataService.getClassTree(acronym, selection['@id']),
      }).then(function(values) {
        if($scope.fieldTreeVisibility == true) {
          $scope.currentOntology = values;
          if ($scope.currentOntology.tree && angular.isArray($scope.currentOntology.tree)) {
            angular.forEach($scope.currentOntology.tree, function(node) {
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
