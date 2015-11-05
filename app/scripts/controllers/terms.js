'use strict';

// Controller for the functionality of adding controlled terms to fields and elements
angularApp.controller('TermsController', function($rootScope, $scope, BioPortalService, $q, $timeout, $http) {

  $scope.enumTemp = [];

  /**
   * Cache entire list of ontologies on the client so we don't have to make
   * additional API calls for ontological information in things like search
   * results.
   */
  $scope.loadAllOntologies = function() {
    $rootScope.ontologies = $rootScope.ontologies || [];
    if ($rootScope.ontologies.length == 0) {
      $rootScope.ontologies = $http.get('/cache/ontologies.json').
        success(function(response) {
		  $rootScope.ontologies = response;
        }).
        error(function(response) {
          alert('There was an error loading the ontologies from cache.');
        });
	}
  }
  $scope.loadAllOntologies();

  /**
   * Cache entire list of value sets on the client for control
   * term browsing.
   */
  $scope.loadAllValueSets = function() {
    $rootScope.valueSets = $rootScope.valueSets || [];
    if ($rootScope.valueSets.length == 0) {
      $rootScope.valueSets = $http.get('/cache/value-sets.json').
        success(function(response) {
          $rootScope.valueSets = response;
        }).
        error(function(response) {
          alert('There was an error loading the value sets from cache.');
        });
    }
  };
  $scope.loadAllValueSets();

  /**
   * Find ontology from cache by acronym.
   */
  $scope.getOntologyByAcronym = function(acronym) {
    // TODO: Refresh cache in case it is empty?
    for (var i = 0; i < $rootScope.ontologies.length; i++) {
      if (angular.uppercase($rootScope.ontologies[i].acronym) == angular.uppercase(acronym)) {
        return $rootScope.ontologies[i];
      }
    };
  }

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

  // Values Search
  $scope.controlTerm.valuesSearchTerms = '';
  $scope.controlTerm.valuesTreeVisibility = false;


  // Field Details view
  $scope.controlTerm.classDetailsView = true;

  // Field Browse
  $scope.controlTerm.searchOntologies = "";

  // Values general
  $scope.controlTerm.bioportalOntologiesFilter = true;
  $scope.controlTerm.bioportalValueSetsFilter = true;
  $scope.controlTerm.addedValueItems = [];

  // Values constraint initial object
  $scope.controlTerm.valueConstraint = {
    'ontologies': [],
    'value_sets': [],
    'classes': [],
    'branches': [],
    'multiple_choice': false
  };

  $scope.controlTerm.valueConstraint.isEmpty = function() {
    if ($scope.controlTerm.valueConstraint.ontologies.length > 0 ||
        $scope.controlTerm.valueConstraint.value_sets.length > 0 ||
        $scope.controlTerm.valueConstraint.classes.length > 0 ||
        $scope.controlTerm.valueConstraint.branches.length > 0) {
      return false;
    }
    return true;
  };

  //Start Over: reset to the beginning where you select field or value filter
  $scope.controlTerm.startOver = function() {
    console.log('startOver');
    //Clear field/value filter
    $scope.controlTerm.filterSelection = "";
    $scope.controlTerm.fieldActionSelection = null;
    $scope.controlTerm.selectedFieldClass = null;
    //Reset bioportal filters
    $scope.controlTerm.bioportalOntologiesFilter = true;
    $scope.controlTerm.bioportalValueSetsFilter = true;
    //Clear search input
    $scope.controlTerm.fieldSearchTerms = "";
    $scope.controlTerm.searchOntologies = "";
    $scope.controlTerm.isSearchingOntologies = false;

    $scope.controlTerm.valuesSearchTerms = null;
    $scope.controlTerm.valuesActionSelection = null;
    $scope.controlTerm.valuesTreeVisibility = false;
    $scope.controlTerm.selectedValueResult = null;

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

    if($scope.controlTerm.fieldSearchTerms == '') {
      $scope.controlTerm.searchPreloader = false;
      return;
    } else {
      $scope.controlTerm.searchPreloader = true;
    }

    $scope.controlTerm.searchTimeout = setTimeout(function() {

      $scope.controlTerm.fieldSearchTerms = angular.element('#field-search-input').val();
      console.log('fieldSearch:'+$scope.controlTerm.fieldSearchTerms);

      BioPortalService.searchClass($scope.controlTerm.fieldSearchTerms).then(function(response) {
        var maxLen = response.collection.length;
        if (maxLen > 20) {
          maxLen = 20;
        }

        $scope.controlTerm.searchPreloader = false;

        if (maxLen > 0) {
          var tArry = [], i;
          for( i = 0; i < maxLen; i += 1 ) {
            tArry.push({class:response.collection[i].prefLabel,
                        ontology:response.collection[i].links.ontology,
                        collection:response.collection[i]});
          }
          $scope.controlTerm.searchResults = tArry;
        } else {
          $scope.controlTerm.searchNoResults = true;
        }
        $scope.controlTerm.searchResults = tArry;
      });
    });
  };

  // FIELD: Show ontology tree and details screen
  var loadTreeOfClass = function(selection) {
    console.log('selectFieldClass: ', selection);
    $scope.controlTerm.fieldTreeVisibility = true;
    $scope.controlTerm.searchPreloader = true;
    var acronym = getOntologyAcronym(selection);

    // Get selected Class Details from the links.self endpoint provided
    var selfUrl = selection.links.self;
    if (!selfUrl) {
      selfUrl = selection.links.ontology + "/classes/" + encodeURIComponent(selection["@id"]);
    }

    $scope.controlTerm.isLoadingClassDetails = true;
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
        if ($scope.controlTerm.currentOntology.tree && angular.isArray($scope.controlTerm.currentOntology.tree)) {
          angular.forEach($scope.controlTerm.currentOntology.tree, function(node) {
            if (node["@type"].indexOf("Ontology") >= 0) {
              node.resultType = "Ontology";
            } else {
              node.resultType = "Value Set";
            }
          })
        }
      }
      $scope.controlTerm.searchPreloader = false;
      $scope.controlTerm.isLoadingClassDetails = false;
    });
  };

  var loadOntologyRootClasses = function(ontology) {
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
          values.tree.sort(sortOntologyTree);

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
    });
  }

  $scope.controlTerm.selectFieldClass = function(selection) {
    // $scope.controlTerm.selectedFieldClass = selection
    loadTreeOfClass(selection);
  }

  $scope.controlTerm.selectFieldOntology = function(selection) {
    loadOntologyRootClasses(selection);
  }

  // Used in ontology tree directive
  $scope.controlTerm.checkIfSelected = function(subtree) {
    if (!subtree) {
      return false;
    }

    var spl = subtree["@id"];
    var st;

    if ($scope.controlTerm.filterSelection == "values") {
      st = $scope.controlTerm.selectedValueResult["@id"];
    } else {
      st = $scope.controlTerm.selectedClass1["@id"];
    }

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

    if ($scope.controlTerm.filterSelection == "values") {
      $scope.controlTerm.selectValueResult(subtree);
    }
  };

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

  var loadParentAndDetermineValueSetForValuesSearchResult = function(valueSet) {
    var acronym = valueSet.links.ontology.slice(39);
    BioPortalService.getClassParents(acronym, valueSet['@id']).then(function(response) {
      if (!(status in response)) {
        if (angular.isArray(response) && response.length > 0) {
          valueSet.resultType = 'Value Set Class';
          // take the first result assuming there will be only one parent for value sets
          valueSet.resultSource = response[0].prefLabel;
          valueSet.resultParentId = response[0]['@id'];
        }
      }
    });
  };

  $scope.controlTerm.fieldBrowse = function(event) {
    if (event) {
      event.preventDefault();
    }

    $scope.controlTerm.fieldActionSelection = 'browse';
    $scope.controlTerm.searchResults = $rootScope.ontologies;
  };

  $scope.controlTerm.prepareForOntologySearch = function(event) {
    if ($rootScope.isKeyVisible(event.keyCode)) {
      $scope.controlTerm.isSearchingOntologies = false;
    }

    event.keyCode == 13 && $scope.controlTerm.ontologySearch();
  }

  $scope.controlTerm.ontologySearch = function() {
    $scope.controlTerm.isSearchingOntologies = true;
  }

  $scope.controlTerm.isOntologyNameMatched = function(ontology) {
    if (!$scope.controlTerm.isSearchingOntologies) {
      return ontology;
    }

    if ($scope.controlTerm.ontologySearchRegexp) {
      return $scope.controlTerm.ontologySearchRegexp.test(ontology.name);
    } else {
      return ontology;
    }
  }

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
        prefLabel: selection.prefLabel,
        ontologyDescription: $scope.controlTerm.currentOntology.details.ontology.name+" ("+$scope.controlTerm.currentOntology.details.ontology.acronym+")",
        ontology: $scope.controlTerm.currentOntology,
        class: selection
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
    for (var i = 0, len = $scope.controlTerm.addedFieldItems.length; i < len; i+= 1) {
      if ($scope.controlTerm.addedFieldItems[i] == itemData) {
        $scope.controlTerm.addedFieldItems.splice(i,1);
        break;
      }
    }
  };

  $scope.controlTerm.deleteFieldAddedClass = function(ontologyClass) {
    for (var i = 0, len = $scope.controlTerm.valueConstraint.classes.length; i < len; i+= 1) {
      if ($scope.controlTerm.valueConstraint.classes[i] == ontologyClass) {
        $scope.controlTerm.valueConstraint.classes.splice(i,1);
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

  var getOntologyAcronym = function(result) {
    return result.links.ontology.slice(39);
  };

  $scope.controlTerm.valuesSearch = function() {
    $scope.controlTerm.searchResults = [];
    $scope.controlTerm.searchNoResults = false;
    $scope.controlTerm.valuesActionSelection = 'search';

    if($scope.controlTerm.valuesSearchTerms == '') {
      $scope.controlTerm.searchPreloader = false;
      return;
    } else {
      $scope.controlTerm.searchPreloader = true;
    }
    $scope.controlTerm.searchTimeout = setTimeout(function() {
      $scope.controlTerm.valuesSearchTerms = angular.element('#values-search-input').val();
      console.log('valuesSearch:' + $scope.controlTerm.valuesSearchTerms);

      // search all
      if ($scope.controlTerm.bioportalOntologiesFilter && $scope.controlTerm.bioportalValueSetsFilter) {
        BioPortalService.searchOntologyClassesValueSetsAndValueSetClasses($scope.controlTerm.valuesSearchTerms).then(function(response) {
          var maxLen = response.collection.length;

          $scope.controlTerm.searchPreloader = false;

          if(maxLen > 0) {
            var searchResults = [];
            for (var i = 0; i < maxLen; i++) {
              var result = response.collection[i];
              var acronym = getOntologyAcronym(result);
              if (acronym != 'NLMVS') {
                result.resultType = 'Ontology Class';
                // TODO: @acarlton needs to fix
                result.resultSource = acronym;
              } else {
                result.resultType = 'Value Set'; // default to value set
                result.resultSource = response.collection[i].prefLabel;
                loadParentAndDetermineValueSetForValuesSearchResult(result);
              }
              searchResults.push(result);
            }
            $scope.controlTerm.searchResults = searchResults;
          } else {
            $scope.controlTerm.searchNoResults = true;
          }
        });

      } else {
        // search ontologies
        if ($scope.controlTerm.bioportalOntologiesFilter) {
          BioPortalService.searchClass($scope.controlTerm.valuesSearchTerms).then(function(response) {
            var maxLen = response.collection.length;
            if (maxLen > 20) {
              maxLen = 20;
            }

            $scope.controlTerm.searchPreloader = false;

            if(maxLen > 0) {
              var searchResults = [];
              for(var i = 0; i < maxLen; i++) {
                var result = response.collection[i];
                result.resultType = 'Ontology Class';
                var acronym = result.links.ontology.slice(39);
                var ontology = $scope.getOntologyByAcronym(acronym);
                if (ontology) {
                  result.resultSource = ontology.name;
                }

                searchResults.push(result);
              }
              $scope.controlTerm.searchResults = searchResults;
            } else {
              $scope.controlTerm.searchNoResults = true;
            }
          });
        }
        // search value sets
        else if ($scope.controlTerm.bioportalValueSetsFilter) {
          BioPortalService.searchValueSetsAndValues($scope.controlTerm.valuesSearchTerms).then(function(response) {
            var maxLen = response.collection.length;
            if (maxLen > 20) {
              maxLen = 20;
            }

            $scope.controlTerm.searchPreloader = false;

            if(maxLen > 0) {
              var searchResults = [];
              for (var i = 0; i < maxLen; i++) {
                var result = response.collection[i];
                result.resultType = 'Value Set'; // default to value set
                result.resultSource = response.collection[i].prefLabel;
                loadParentAndDetermineValueSetForValuesSearchResult(result);
                searchResults.push(result);
              }
              $scope.controlTerm.searchResults = searchResults;
            } else {
              $scope.controlTerm.searchNoResults = true;
            }
          });
        }
      }

    });
  };

  /**
   * This function should select a value search or browse value result and populate
   * all the associated data necessary to display the class details and related info.
   *
   * TODO: at least that ^^ was the intent -- it's been misbehaving recently, but
   * should be working for ontology classes...
   */
  $scope.controlTerm.selectValueResult = function(result) {
    $scope.controlTerm.selectedValueResult = result;
    $scope.controlTerm.valuesTreeVisibility = true;

    if (result.resultType == 'Ontology' || result.resultType == 'Ontology Class') {
      $scope.assignOntologyTree(result);
    } else if (result.resultType == 'Value Set' || result.resultType == 'Value Set Class') {
      $scope.assignClassDetails(result);
      var acronym = getOntologyAcronym(result);
      var classId = result["@id"];
      if (result.resultType == 'Value Set Class') {
        classId = result.resultParentId;
      }
      BioPortalService.getClassValueSet(acronym, classId).then(function(children) {
        result.children = children;
      });
    }
    
    $scope.assignClassDetails(result);
  };

  $scope.controlTerm.valuesBrowse = function(event) {
    if (event) {
      event.preventDefault();
    }

    $scope.controlTerm.valuesActionSelection = "browse";
    var browseResults = [];
    angular.forEach($rootScope.valueSets, function(valueSet) {
      valueSet.resultType = valueSet.resultType || 'Value Set';
      // TODO: all the sources are obviously the same Ontology due to data organization;
      //   confirm with client where Source field should come from for value sets
      var valueSetOntology = $scope.getOntologyByAcronym(getOntologyAcronym(valueSet));
      valueSet.resultSource = valueSetOntology.name;
      browseResults.push(valueSet);
    });
    angular.forEach($rootScope.ontologies, function(ontology) {
      ontology.resultType = ontology.resultType || "Ontology";
      browseResults.push(ontology);
    });

    $scope.controlTerm.searchResults = browseResults;
  }

  /**
   * Lookup ontology class details and assign them as a property of the object.
   */
  $scope.assignClassDetails = function(ontologyClass) {
    if (!ontologyClass.classDetails) {
      var selfUrl = ontologyClass.links.self;
      if (!selfUrl) {
        selfUrl = ontologyClass.links.ontology + "/classes/" + encodeURIComponent(ontologyClass["@id"]);
      }

      BioPortalService.getClassDetails(selfUrl).then(function(response) {
        $scope.controlTerm.selectedValueResult.classDetails = response;
      });
    }
  };

  /**
   * Lookup ontology tree and assign it as a property of the object.
   */
  $scope.assignOntologyTree = function(ontologyOrOntologyClass) {
    if (!$scope.controlTerm.selectedValueResultOntologyTree) {
      if (ontologyOrOntologyClass["@type"].indexOf("Ontology") >= 0) {
        BioPortalService.getOntologyValueSets(ontologyOrOntologyClass.acronym).then(function(response) {
          if (response && angular.isArray(response)) {
            response.sort(sortOntologyTree);

            angular.forEach(response, function(ontologyClass) {
              ontologyClass.resultType = 'Value Set';
            });
            $scope.controlTerm.selectedValueResultOntologyTree = response;
          }
        });
      } else {
        var acronym = getOntologyAcronym(ontologyOrOntologyClass);
        BioPortalService.getClassTree(acronym, ontologyOrOntologyClass['@id']).then(function(response) {
          response.sort(sortOntologyTree);
          $scope.controlTerm.selectedValueResultOntologyTree = response;
        });
      }
    }
  }

  $scope.controlTerm.stagedOntologyClassValueConstraints = [];
  $scope.controlTerm.stagedOntologyClassValueConstraintData = [];
  $scope.controlTerm.stageOntologyClassValueConstraint = function(selection) {
    $scope.controlTerm.stagedOntologyClassValueConstraints.push({
      'uri': selection['@id'],
      'label': '',
      'default': false
    });
    $scope.controlTerm.stagedOntologyClassValueConstraintData.push({
      'label': selection.prefLabel
    });
  };

  $scope.controlTerm.stageOntologyClassChildrenValueConstraint = function(selection) {
    var acronym = getOntologyAcronym(selection);
    BioPortalService.getClassChildren(acronym, selection['@id']).then(function(response) {
      angular.forEach(response, function(child) {
        $scope.controlTerm.stageOntologyClassValueConstraint(child);
      });
    });
  }

  $scope.controlTerm.stageOntologyClassSiblingsValueConstraint = function(selection) {
    var acronym = getOntologyAcronym(selection);
    alert('TODO: lookup siblings and call stageOntologyClassValueConstraint on each');
  }

  /**
   * Add ontology class to value constraint to field values info definition.
   */
  $scope.controlTerm.addOntologyClassToValueConstraint = function() {
    var alreadyAdded, constraint, i, j;
    for (i = 0; i < $scope.controlTerm.stagedOntologyClassValueConstraints.length; i++) {
      constraint = $scope.controlTerm.stagedOntologyClassValueConstraints[i];
      alreadyAdded = false;
      for (j = 0; j < $scope.controlTerm.valueConstraint.classes.length; j++) {
        if ($scope.controlTerm.valueConstraint.classes[j]['uri'] == constraint['uri']) {
          alreadyAdded = true;
          break;
        }
      }
      if (!alreadyAdded) {
        if (constraint.label == '') {
          constraint.label = $scope.controlTerm.stagedOntologyClassValueConstraintData[i].label;
        }
        $scope.controlTerm.valueConstraint.classes.push(constraint);
      }
    }
    $scope.controlTerm.stagedOntologyClassValueConstraints = [];
    $scope.controlTerm.stagedOntologyClassValueConstraintData = [];
    assignValueConstraintToField();
  };

  var assignValueConstraintToField = function() {
    var fieldPropertiesInfo = $scope.$parent.$parent.$parent.field.properties.info;
    fieldPropertiesInfo.value_constraint = $scope.controlTerm.valueConstraint;
  }

  $scope.controlTerm.hideValuesTree = function() {
    console.log('hideValueTree');
    $scope.controlTerm.valuesTreeVisibility = false;
    $scope.controlTerm.selectedValueResult = null;
  };

  $scope.$watch("controlTerm.ontologySearchTerms", function() {
    if ($scope.controlTerm.ontologySearchTerms) {
      $scope.controlTerm.ontologySearchRegexp = new RegExp($scope.controlTerm.ontologySearchTerms, "i");
    } else {
      $scope.controlTerm.ontologySearchRegexp = null;
    }
  });

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

})
.directive('addedFieldItem', function () {
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
