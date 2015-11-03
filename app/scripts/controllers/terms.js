'use strict';

// Controller for the functionality of adding controlled terms to fields and elements
angularApp.controller('TermsController', function($scope, BioPortalService, $q) {

    $scope.enumTemp = [];

    $scope.updateEnum = function(properties) {
      // Remove invalid values from the array
      for (var i = 0; i < $scope.enumTemp.length; i++) {
        if ($scope.enumTemp[i] == "" || $scope.enumTemp[i] == null) {
          // Remove value
          $scope.enumTemp.splice(i, 1);
        }
      }
      if ($scope.enumTemp.length > 0) {
        properties['@type'].oneOf[0].enum = $scope.enumTemp;
        properties['@type'].oneOf[1].items.enum = $scope.enumTemp;
      }
      else {
        delete properties['@type'].oneOf[0].enum
        delete properties['@type'].oneOf[1].items.enum
      }
    }


    ///////////////////////////////////////////////////////////////
    // Control Term: Add a Class or Value Set
    ///////////////////////////////////////////////////////////////

    $('body').on('click', '.detail-view-tab a', function (e) {
      e.preventDefault();
      $(this).tab('show');
    });

    //General
    $scope.controlTerm = {};
    $scope.controlTerm.emptyMessage = "You have not added any field or value classes";
    $scope.controlTerm.filterSelection = "";
    $scope.controlTerm.searchTimeout;
    $scope.controlTerm.currentOntology = "";
    $scope.controlTerm.classDetails = "";

    //Field Search
    $scope.controlTerm.fieldSearchTerms = "";
    $scope.controlTerm.searchResults = [];
    $scope.controlTerm.searchPreloader = false;
    $scope.controlTerm.searchNoResults = false;
    $scope.controlTerm.fieldTreeVisibility = false;
    $scope.controlTerm.selectedClass1 = {prefLabel:''};
    $scope.controlTerm.selectedClass2 = {prefLabel:''};
    $scope.controlTerm.addedFieldItems = [];

    //Field Details view
    $scope.controlTerm.classDetailsView = true;

    //Field Browse
    $scope.controlTerm.searchOntologies = "";

    //Values general
    $scope.controlTerm.bioportalOntoligiesFilter = true;
    $scope.controlTerm.bioportalValueSetsFilter = true;
    $scope.controlTerm.addedValueItems = [];

    //Start Over: reset to the beginning where you select field or value filter
    $scope.controlTerm.startOver = function() {

      console.log('startOver');
      //Clear field/value filter
      $scope.controlTerm.filterSelection = "";
      $scope.controlTerm.fieldActionSelection = null;
      $scope.controlTerm.selectedFieldClass = null;
      //Reset bioportal filters
      $scope.controlTerm.bioportalOntoligiesFilter = true;
      $scope.controlTerm.bioportalValueSetsFilter = true;
      //Clear search input
      $scope.controlTerm.fieldSearchTerms = "";
      $scope.controlTerm.searchOntologies = "";
      //Reset ontology detail/tree
      $scope.controlTerm.currentOntology = "";
      $scope.controlTerm.classDetails = "";
      $scope.controlTerm.selectedClass1 = {prefLabel:''};
      $scope.controlTerm.selectedClass2 = {prefLabel:''};
      $scope.controlTerm.fieldTreeVisibility = false;
      $scope.controlTerm.searchPreloader = false;
      $scope.controlTerm.searchResults = [];
      //Init field/value tooltip
      setTimeout(function() {
        angular.element('#field-value-tooltip').popover();
      }, 500);

    };

    $scope.controlTerm.collapseToggle = function() {

      if(angular.element('.controlled-term-options').hasClass('collapse in') == false) {
        $scope.controlTerm.startOver();
      }

    }

    // FIELD: Set field as primary search/browse parameter
    $scope.controlTerm.selectFieldFilter = function() {

      console.log('selectFieldFilter');
      angular.element('#field-value-tooltip').popover('hide');
      $scope.controlTerm.filterSelection = "field";

    };


    ////////////////////////////////////
    // FIELD: search results
    ////////////////////////////////////

    $scope.controlTerm.fieldSearch = function() {

      $scope.controlTerm.searchResults = [];
      $scope.controlTerm.searchNoResults = false;
      $scope.controlTerm.fieldActionSelection = "search";

      // clearTimeout($scope.controlTerm.searchTimeout);
      if($scope.controlTerm.fieldSearchTerms == '') {
        $scope.controlTerm.searchPreloader = false;
        return;
      } else {
        $scope.controlTerm.searchPreloader = true;
      }
      // $scope.controlTerm.searchTimeout = setTimeout( function(){

        //$scope.controlTerm.fieldSearchTerms = angular.element('#field-search-input').value;
        console.log('fieldSearch:'+$scope.controlTerm.fieldSearchTerms);

        BioPortalService.searchClass($scope.controlTerm.fieldSearchTerms).then(function(response) {
          //console.log(response);
          // If $scope.matchingClasses is a lengthy array, push next array of items into array, if not, create $scope.matchingClasses as array
         // $scope.matchingClasses.length ? $scope.matchingClasses.push.apply($scope.matchingClasses, response.collection) : $scope.matchingClasses = response.collection;
          // If next class is available, load next page of results into $scope.matchingClasses automatically by recursively calling this function
          //if (response.links.nextPage) { $scope.queryClasses(response.links.nextPage); }
          var maxLen = response.collection.length;
          if(maxLen > 20) {
            maxLen = 20;
          }

          $scope.controlTerm.searchPreloader = false;

          if(maxLen > 0) {

            var tArry = [], i;

            for( i = 0; i < maxLen; i += 1 ) {

              tArry.push({class:response.collection[i].prefLabel, ontology:response.collection[i].links.ontology, collection:response.collection[i]});

            }
            $scope.controlTerm.searchResults = tArry;

          } else {

            $scope.controlTerm.searchNoResults = true;

          }

        });

      // }, 2000);

    };

    // FIELD: Show ontology tree and details screen
    var loadTreeOfClass = function(selection) {
      console.log('selectFieldClass: ', selection);
      $scope.controlTerm.fieldTreeVisibility = true;
      $scope.controlTerm.searchPreloader = true;
      //console.log(selection);
      // This provides the Ontology acronym from the links.ontology string
      var acronym = selection.links.ontology.slice(39);

      // Get selected Class Details from the links.self endpoint provided
      var selfUrl = selection.links.self;
      if (!selfUrl) {
        selfUrl = selection.links.ontology + "/classes/" + encodeURIComponent(selection["@id"]);
      }

      BioPortalService.getClassDetails(selfUrl).then(function(response) {
        $scope.controlTerm.classDetails = response;
      });

      $scope.controlTerm.selectedClass1 = selection;

      $q.all({
          details:    BioPortalService.getOntologyDetails(acronym),
          size:       BioPortalService.getOntologySize(acronym),
          tree:       BioPortalService.getClassTree(acronym, selection['@id']),
         // root:       BioPortalService.getOntologyTreeRoot(acronym),
          //valueSet:   BioPortalService.getClassValueSet(acronym, selection['@id'])
        }).then(function(values) {

          if($scope.controlTerm.fieldTreeVisibility == true) {
            $scope.controlTerm.currentOntology = values;
          }
          $scope.controlTerm.searchPreloader = false;
          //console.log($scope.currentOntology.valueSet);

        });

    };

    var loadOntopologyRootClasses = function(ontology) {
      var acronym = ontology.acronym;
      var classesUrl = ontology.links.classes;

      $scope.controlTerm.fieldTreeVisibility = true;
      $q.all({
        details:    BioPortalService.getOntologyDetails(acronym),
        size:       BioPortalService.getOntologySize(acronym),
        tree:       BioPortalService.getOntologyValueSets(acronym),
       // root:       BioPortalService.getOntologyTreeRoot(acronym),
        //valueSet:   BioPortalService.getClassValueSet(acronym, selection['@id'])
      }).then(function(values) {

        if($scope.controlTerm.fieldTreeVisibility == true) {
          if (values.tree && angular.isArray(values.tree)) {
            values.tree.sort(function(a, b) {
              if (a.prefLabel < b.prefLabel) {
                return -1;
              } else if (a.prefLabel == b.prefLabel) {
                return 0;
              } else {
                return 1;
              }
            });

            $scope.controlTerm.currentOntology = values;
          } else {
            // TODO: Handle error
            if (values.tree.status == 404) {
              alert("No submissions available");
            } else {
              alert(values.tree.statusText);
            }
          }
        }
        $scope.controlTerm.searchPreloader = false;
        //console.log($scope.currentOntology.valueSet);

      });
    }

    $scope.controlTerm.selectFieldClass = function(selection) {
      // $scope.controlTerm.selectedFieldClass = selection
      loadTreeOfClass(selection);
    }

    $scope.controlTerm.selectFieldOntology = function(selection) {
        loadOntopologyRootClasses(selection);
    }

    // Used in ontology tree directive
    $scope.controlTerm.checkIfSelected = function(subtree) {
      if (!subtree) {
        return false;
      }

      var spl = subtree["@id"];
      var st = $scope.controlTerm.selectedClass1["@id"];

      if ($scope.controlTerm.selectedClass2["@id"]) {
        st = $scope.controlTerm.selectedClass2["@id"];
      }

      return spl == st;
    }

    // Used in ontology tree directive
    $scope.controlTerm.getClassDetails = function(subtree) {
      // $scope.controlTerm.selectedFieldClass = subtree;

      // Get selected Class Details from the links.self endpoint provided
      $scope.controlTerm.selectedClass2 = subtree;
      BioPortalService.getClassDetails(subtree.links.self).then(function(response) {
        $scope.controlTerm.classDetails = response;
      });

    }

    // FIELD: Hide ontology tree and details screen
    $scope.controlTerm.hideFieldTree = function() {

      console.log('hideFieldTree');
      $scope.controlTerm.fieldTreeVisibility = false;
      $scope.controlTerm.currentOntology = "";
      $scope.controlTerm.classDetails = "";

    };

    $scope.controlTerm.toggleFieldDetails = function(classView) {

      if(classView == 'true') {
        $scope.controlTerm.classDetailsView = true;
      } else {
        $scope.controlTerm.classDetailsView = false;
      }
    }


    ////////////////////////////////////
    // FIELD: Browse Ontologies
    ////////////////////////////////////

    var loadCategoriesForOntology = function(ontology) {
      BioPortalService.getOntologyCategories(ontology.acronym, true).then(function(response) {
        if (!(status in response)) {
          ontology.categories = response;
          var names = [];
          angular.forEach(response, function(c) {
            names.push(c.name);
          });

          ontology.categoriesNames = names.join(", ");
        }
      });
    }

    var loadMetricsForOntology = function(ontology) {
      BioPortalService.getOntologySize(ontology.acronym, true).then(function(response) {
        if (!(status in response)) {
          ontology.metrics = response;
        }
      });
    }

    $scope.controlTerm.fieldBrowse = function(event) {
      if (event) {
        event.preventDefault();
      }

      if ($scope.controlTerm.fieldActionSelection == 'browse' && $scope.controlTerm.searchResults.length > 0) {
        return;
      }

        $scope.controlTerm.searchResults = [];
        $scope.controlTerm.searchPreloader = true;
        $scope.controlTerm.fieldActionSelection = "browse";

        BioPortalService.getAllOntologies().then(function(response) {
          //console.log(response);
          // If $scope.matchingClasses is a lengthy array, push next array of items into array, if not, create $scope.matchingClasses as array
         // $scope.matchingClasses.length ? $scope.matchingClasses.push.apply($scope.matchingClasses, response.collection) : $scope.matchingClasses = response.collection;
          // If next class is available, load next page of results into $scope.matchingClasses automatically by recursively calling this function
          //if (response.links.nextPage) { $scope.queryClasses(response.links.nextPage); }
          var maxLen = 0;
          if(response.data.length) {
            maxLen = response.data.length;
          }
          if(maxLen > 10) {
            maxLen = 10;
          }

          $scope.controlTerm.searchPreloader = false;

          if(maxLen > 0) {

            var tArry = [], i;

            for( i = 0; i < maxLen; i += 1 ) {
              var obj = response.data[i];
              loadCategoriesForOntology(obj);
              loadMetricsForOntology(obj);

              tArry.push(obj);
            }
            $scope.controlTerm.searchResults = tArry;

          } else {

            $scope.controlTerm.searchNoResults = true;

          }
        });

    };

    ////////////////////////////////////
    // Add Class Meta Data
    ////////////////////////////////////

    $scope.controlTerm.addClass = function(selection) {
      console.log('selection.prefLabel: '+selection.prefLabel);
      console.log('selection.@id: '+selection['@id']);


      var alreadyAdded = false;

      for(var i = 0, len = $scope.controlTerm.addedFieldItems.length; i < len; i+= 1) {
        if($scope.controlTerm.addedFieldItems[i].prefLabel == selection.prefLabel) {
          alreadyAdded = true;
          break;
        }
      }

      if(alreadyAdded == false) {
        $scope.controlTerm.addedFieldItems.push({
          prefLabel:selection.prefLabel,
          ontologyDescription:$scope.controlTerm.currentOntology.details.ontology.name+" ("+$scope.controlTerm.currentOntology.details.ontology.acronym+")",
          ontology:$scope.controlTerm.currentOntology,
          class:selection
        });

        /**
         * Add ontology type to JSON.
         *
         * TODO: review data transfer mechanism?
         */
        var fieldType = $scope.$parent.$parent.$parent.field.properties['@type'].oneOf[0].enum;
        if (angular.isArray(fieldType)) {
          $scope.$parent.$parent.$parent.field.properties['@type'].oneOf[0].enum.push(selection['@id']);
          $scope.$parent.$parent.$parent.field.properties['@type'].oneOf[1].items.enum.push(selection['@id']);
        } else {
          $scope.$parent.$parent.$parent.field.properties['@type'].oneOf[0].enum = [selection['@id']];
          $scope.$parent.$parent.$parent.field.properties['@type'].oneOf[1].items.enum = [selection['@id']];
        }

        $scope.controlTerm.startOver();

      } else {

        alert(selection.prefLabel+' has already been added.');

      }
    }

    $scope.controlTerm.editFieldAddedItem = function(itemData) {

      console.log('editFieldAddedItem');

    };

    $scope.controlTerm.deleteFieldAddedItem = function(itemData) {

      console.log('deleteFieldAddedItem');

      for(var i = 0, len = $scope.controlTerm.addedFieldItems.length; i < len; i+= 1) {
        if($scope.controlTerm.addedFieldItems[i] == itemData) {
          $scope.controlTerm.addedFieldItems.splice(i,1);
          break;
        }
      }

    };




    ////////////////////////////////////////////////////////////////////////
    // VALUES: Set values as primary search/browse parameter
    ////////////////////////////////////////////////////////////////////////

    $scope.controlTerm.selectValueFilter = function() {

      console.log('selectValueFilter');
      angular.element('#field-value-tooltip').popover('hide');
      $scope.controlTerm.filterSelection = "values";

    };

    $scope.controlTerm.editValueAddedItem = function(itemData) {

      console.log('editValueAddedItem');

    };

    $scope.controlTerm.deleteValueAddedItem = function(itemData) {

      console.log('deleteValueAddedItem');

      for(var i = 0, len = $scope.controlTerm.addedValueItems.length; i < len; i+= 1) {
        if($scope.controlTerm.addedValueItems[i] == itemData) {
          $scope.controlTerm.addedValueItems.splice(i,1);
          break;
        }
      }

    };






  }
).directive('addedFieldItem', function () {
  return {
    restrict: 'E',
    scope: {
      term: '=',
      itemData: '='
    },
    template: '<li id="added-item-{{itemData.prefLabel}}" class="added-item"><span class="col-1">{{itemData.prefLabel}}</span><span class="col-2">{{itemData.ontologyDescription}}</span><span class="col-3"><!--<div class="item item-edit" ng-click="term.editFieldAddedItem(itemData)"><i class="fa fa-pencil"></i></div>--><div class="item item-delete" ng-click="term.deleteFieldAddedItem(itemData)"><i class="fa fa-close"></i></div></span></li>',
    replace: true
  };
}).directive('addedValueItem', function () {
  return {
    restrict: 'E',
    scope: {
      term: '=',
      itemData: '='
    },
    template: '<li id="added-item-{{itemData.prefLabel}}" class="added-item"><span class="col-1">{{itemData.prefLabel}}</span><span class="col-2">{{itemData.ontologyDescription}}</span><span class="col-3"><div class="item item-edit" ng-click="term.editValueAddedItem(itemData)"><i class="fa fa-pencil"></i></div><div class="item item-delete" ng-click="term.deleteValueAddedItem(itemData)"><i class="fa fa-close"></i></div></span></li>',
    replace: true
  };
});
