'use strict';

// Controller for the functionality of adding controlled terms to fields and elements
angularApp.controller('TermsController', function($rootScope, $scope, $element, BioPortalService, $q, $timeout, $http) {

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

  $scope.getOntologySummary = function(ontologyUri) {
    var acronym = ontologyUri.slice(39);
    var ontology = $scope.getOntologyByAcronym(acronym);
    if (ontology) {
      return ontology.name + ' (' + acronym + ')';
    } else {
      return ontologyUri;
    }
  };

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
  $scope.controlTerm.filterSelection = $scope.options && $scope.options.filterSelection || "";
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

  $scope.$watch("field", function(newValue, oldValue) {
    var i, classId, acronym;
    if (oldValue === undefined && newValue !== undefined) {
      if ($scope.field && $scope.field.properties && $scope.field.properties['@type'] &&
          $scope.field.properties['@type']['oneOf'] && $scope.field.properties['@type']['oneOf'][0] &&
          $scope.field.properties['@type']['oneOf'][0]['enum']) {
        for (i = 0; i < $scope.field.properties['@type']['oneOf'][0]['enum'].length; i++) {
          classId = $scope.field.properties['@type']['oneOf'][0]['enum'][i];
          BioPortalService.getClassDetails(classId).then(function(response) {
            if (response) {
              // get ontology details
              acronym = getOntologyAcronym(response);
              BioPortalService.getOntologyDetails(acronym).then(function(ontologyResponse) {
                $scope.controlTerm.addedFieldItems.push({
                  prefLabel: response.prefLabel,
                  ontologyDescription: ontologyResponse.ontology.name + ' (' + acronym + ')',
                  '@id': classId
                });
              });
            }
          });
        }
      }
    }
  });

  // Values constraint initial object
  $scope.controlTerm.valueConstraint = {
    'ontologies': [],
    'valueSets': [],
    'classes': [],
    'branches': [],
    'multipleChoice': false
  };

  $scope.controlTerm.valueConstraint.isEmpty = function() {
    if ($scope.controlTerm.valueConstraint.ontologies.length > 0 ||
        $scope.controlTerm.valueConstraint.valueSets.length > 0 ||
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
    $scope.controlTerm.filterSelection = $scope.options && $scope.options.filterSelection || "";
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
    $scope.controlTerm.stageValueConstraintAction = null;

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
  $scope.controlTerm.selectFieldFilter = function(event) {
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

    // $scope.controlTerm.searchTimeout = setTimeout(function() {

      // $scope.controlTerm.fieldSearchTerms = angular.element('#field-search-input').val();
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
    // });
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
    $scope.controlTerm.searchPreloader = true;
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
    $scope.controlTerm.selectedValueResult = subtree;

    // Get selected Class Details from the links.self endpoint provided
    $scope.controlTerm.selectedClass2 = subtree;
    BioPortalService.getClassDetails(subtree.links.self).then(function(response) {
      $scope.controlTerm.classDetails = response;
    });

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
    var name;
    if (!$scope.controlTerm.bioportalValueSetsFilter && ontology.resultType == 'Value Set') {
      return false;
    }
    if (!$scope.controlTerm.bioportalOntologiesFilter && ontology.resultType == 'Ontology') {
      return false;
    }
    if (!$scope.controlTerm.isSearchingOntologies) {
      return ontology;
    }

    if ($scope.controlTerm.ontologySearchRegexp) {
      name = ontology.name;
      if (ontology.resultType == 'Value Set') {
        name = ontology.prefLabel;
      }
      return $scope.controlTerm.ontologySearchRegexp.test(name);
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
        class: selection,
        "@id": selection["@id"]
      });

      /**
       * Add ontology type to JSON.
       */
      if (angular.isArray($scope.field.properties['@type'].oneOf[0].enum)) {
        $scope.field.properties['@type'].oneOf[0].enum.push(selection.links.self);
        $scope.field.properties['@type'].oneOf[1].items.enum.push(selection.links.self);
      } else {
        $scope.field.properties['@type'].oneOf[0].enum = [selection.links.self];
        $scope.field.properties['@type'].oneOf[1].items.enum = [selection.links.self];
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
        var itemDataId = itemData["@id"];
        var idx = $scope.field.properties["@type"].oneOf[0].enum.indexOf(itemDataId);

        if (idx >= 0) {
          $scope.field.properties["@type"].oneOf[0].enum.splice(idx, 1);
          if ($scope.field.properties["@type"].oneOf[0].enum.length == 0) {
            delete $scope.field.properties["@type"].oneOf[0].enum;
          }
        }

        idx = $scope.field.properties['@type'].oneOf[1].items.enum.indexOf(itemDataId);

        if (idx >= 0) {
          $scope.field.properties['@type'].oneOf[1].items.enum.splice(idx, 1);
          if ($scope.field.properties["@type"].oneOf[1].items.enum.length == 0) {
            delete $scope.field.properties["@type"].oneOf[1].items.enum;
          }
        }

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

  $scope.controlTerm.deleteFieldAddedValueSet = function(valueSet) {
    for (var i = 0, len = $scope.controlTerm.valueConstraint.valueSets.length; i < len; i+= 1) {
      if ($scope.controlTerm.valueConstraint.valueSets[i]['uri'] == valueSet['uri']) {
        $scope.controlTerm.valueConstraint.valueSets.splice(i,1);
        break;
      }
    }
  };

  $scope.controlTerm.deleteFieldAddedOntology = function(ontology) {
    for (var i = 0, len = $scope.controlTerm.valueConstraint.ontologies.length; i < len; i+= 1) {
      if ($scope.controlTerm.valueConstraint.ontologies[i]['uri'] == ontology['uri']) {
        $scope.controlTerm.valueConstraint.ontologies.splice(i,1);
        break;
      }
    }
  };

  $scope.controlTerm.deleteFieldAddedBranch = function(branch) {
    for (var i = 0, len = $scope.controlTerm.valueConstraint.branches.length; i < len; i+= 1) {
      if ($scope.controlTerm.valueConstraint.branches[i]['uri'] == branch['uri']) {
        $scope.controlTerm.valueConstraint.branches.splice(i,1);
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
    // $scope.controlTerm.searchTimeout = setTimeout(function() {
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

    // });
  };

  /**
   * This function should select a value search or browse value result and populate
   * all the associated data necessary to display the class details and related info.
   *
   * TODO: at least that ^^ was the intent -- it's been misbehaving recently, but
   * should be working for ontology classes...
   */
  $scope.controlTerm.selectValueResult = function(result) {
    var acronym;

    $scope.controlTerm.selectedValueResult = result;
    $scope.controlTerm.valuesTreeVisibility = true;

    if (result.resultType == 'Ontology' || result.resultType == 'Ontology Class') {
      $scope.browsingSection = 'ontology';
      if (result.resultType == 'Ontology') {
        $scope.controlTerm.currentOntology = {
          'details': { 'ontology': result }
        };
      } else {
        $scope.controlTerm.currentOntology = {
          'details': { 'ontology': $scope.getOntologyByAcronym(getOntologyAcronym(result)) }
        };
      }
      loadOntologyRootClasses($scope.controlTerm.currentOntology.details.ontology);
    } else if (result.resultType == 'Value Set' || result.resultType == 'Value Set Class') {
      $scope.browsingSection = 'value_set';
      $scope.controlTerm.searchPreloader = true;
      $scope.assignClassDetails(result);
      acronym = getOntologyAcronym(result);

      if (result.resultType == 'Value Set') {
        $scope.controlTerm.currentValueSet = result;
      } else {
        // get the parent
        BioPortalService.getClassParents('NLMVS', result['@id']).then(function(response) {
          $scope.controlTerm.currentValueSet = response[0];
        });
      }

      $scope.currentValueSetId = result["@id"];
      if (result.resultType == 'Value Set Class') {
        $scope.currentValueSetId = result.resultParentId;
      }
      BioPortalService.getClassValueSet(acronym, $scope.currentValueSetId).then(function(valueSetClasses) {
        $scope.controlTerm.valueSetClasses = valueSetClasses;
        angular.forEach($scope.controlTerm.valueSetClasses, function(valueSetClass) {
          valueSetClass.resultType = 'Value Set Class';
        });
        $scope.controlTerm.searchPreloader = false;
      });
    }

    // TODO: is this needed?
    // $scope.assignClassDetails(result);
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
    if (!$scope.controlTerm.selectedValueResult.ontologyTree) {
      $scope.controlTerm.searchPreloader = true;
      if (ontologyOrOntologyClass["@type"].indexOf("Ontology") >= 0) {
        BioPortalService.getOntologyValueSets(ontologyOrOntologyClass.acronym).then(function(response) {
          if (response && angular.isArray(response)) {
            response.sort(sortOntologyTree);

            angular.forEach(response, function(ontologyClass) {
              ontologyClass.resultType = 'Value Set';
            });
            $scope.controlTerm.selectedValueResult.ontologyTree = response;
          }
          $scope.controlTerm.searchPreloader = false;
        });
      } else {
        var acronym = getOntologyAcronym(ontologyOrOntologyClass);
        BioPortalService.getClassTree(acronym, ontologyOrOntologyClass['@id']).then(function(response) {
          response.sort(sortOntologyTree);
          $scope.controlTerm.selectedValueResult.ontologyTree = response;
          $scope.controlTerm.searchPreloader = false;
        });
      }
    }
  }

  $scope.controlTerm.stagedOntologyValueConstraints = [];
  $scope.controlTerm.stagedOntologyClassValueConstraints = [];
  $scope.controlTerm.stagedOntologyClassValueConstraintData = [];
  $scope.controlTerm.stagedValueSetValueConstraints = [];
  $scope.controlTerm.stagedBranchesValueConstraints = [];

  $scope.controlTerm.stageOntologyClassValueConstraint = function(selection, type) {
    if (type === undefined) {
      type = 'Ontology Class';
    }
    var klass = {
      'uri': selection['@id'],
      'prefLabel': selection.prefLabel,
      'type': type,
      'label': '',
      'default': false
    };
    if (type == 'Ontology Class') {
      klass['source'] = $scope.controlTerm.currentOntology.details.ontology.name + ' (' + $scope.controlTerm.currentOntology.details.ontology.acronym + ')';
    } else {
      klass['source'] = $scope.controlTerm.currentValueSet.prefLabel;
    }
    $scope.controlTerm.stagedOntologyClassValueConstraints.push(klass);
    $scope.controlTerm.stagedOntologyClassValueConstraintData.push({
      'label': selection.prefLabel
    });

    $scope.controlTerm.stageValueConstraintAction = "add_class";
  };


  $scope.controlTerm.stageOntologyValueConstraint = function() {
    var existed = false;
    angular.forEach($scope.controlTerm.stagedOntologyValueConstraints, function(ontologyValueConstraint) {
      existed = existed || ontologyValueConstraint.uri == $scope.controlTerm.currentOntology.details.ontology["@id"];
    });

    if (!existed) {
      $scope.controlTerm.stagedOntologyValueConstraints.push({
        'numChildren': $scope.controlTerm.currentOntology.size.classes,
        'acronym': $scope.controlTerm.currentOntology.details.ontology.acronym,
        'name': $scope.controlTerm.currentOntology.details.ontology.name,
        'uri': $scope.controlTerm.currentOntology.details.ontology['@id']
      });
    }

    $scope.controlTerm.stageValueConstraintAction = "add_ontology";
  };

  $scope.controlTerm.stageValueSetValueConstraint = function(selection) {
    $scope.controlTerm.stagedValueSetValueConstraints.push({
      'numChildren': $scope.controlTerm.currentValueSet.numChildren,
      'name': $scope.controlTerm.currentValueSet.prefLabel,
      'uri': $scope.controlTerm.currentValueSet['@id']
    });

    $scope.controlTerm.stageValueConstraintAction = "add_entire_value_set";
  };

  $scope.controlTerm.stageBranchValueConstraint = function(selection) {
    var existed = false;
    angular.forEach($scope.controlTerm.stagedBranchesValueConstraints, function(branchValueConstraint) {
      existed = existed || branchValueConstraint && branchValueConstraint.uri == selection["@id"];
    });

    if (!existed) {
      $scope.controlTerm.stagedBranchesValueConstraints.push({
        'source': $scope.controlTerm.currentOntology.details.ontology.name + ' (' + $scope.controlTerm.currentOntology.details.ontology.acronym + ')',
        'acronym': $scope.controlTerm.currentOntology.details.ontology['acronym'],
        'uri': selection['@id'],
        'name': selection.prefLabel,
        'maxDepth': null
      });
    }

    $scope.controlTerm.stageValueConstraintAction = "add_children";
  }

  $scope.controlTerm.stageOntologyClassSiblingsValueConstraint = function(selection) {
    $scope.controlTerm.stagedOntologyClassValueConstraints = [];
    BioPortalService.getClassParents(getOntologyAcronym(selection), selection['@id']).then(function(response) {
      var acronym = $scope.controlTerm.currentOntology.details.ontology.acronym;
      if (response && angular.isArray(response) && response.length > 0) {
        BioPortalService.getClassChildren(acronym, response[0]['@id']).then(function(childResponse) {
          angular.forEach(childResponse, function(child) {
            $scope.controlTerm.stageOntologyClassValueConstraint(child);
          });
          $scope.controlTerm.stageValueConstraintAction = "add_siblings";
        });
      } else {
        BioPortalService.getOntologyTreeRoot(acronym).then(function(childResponse) {
          angular.forEach(childResponse, function(child) {
            $scope.controlTerm.stageOntologyClassValueConstraint(child);
          });
          $scope.controlTerm.stageValueConstraintAction = "add_siblings";
        });
      }
    });
    $scope.controlTerm.stageValueConstraintAction = "add_siblings";
  };

  $scope.bioportalFilterResultLabel = function() {
    if ($scope.controlTerm.bioportalValueSetsFilter && $scope.controlTerm.bioportalOntologiesFilter) {
      return 'ontologies and value sets';
    }
    if ($scope.controlTerm.bioportalValueSetsFilter) {
      return 'value sets';
    }
    return 'ontologies';
  };

  $scope.controlTerm.addOntologyToValueConstraint = function() {
    var alreadyAdded, constraint, i, j;
    for (i = 0; i < $scope.controlTerm.stagedOntologyValueConstraints.length; i++) {
      constraint = $scope.controlTerm.stagedOntologyValueConstraints[i];
      alreadyAdded = false;
      for (j = 0; j < $scope.controlTerm.valueConstraint.ontologies.length; j++) {
        if ($scope.controlTerm.valueConstraint.ontologies[j]['uri'] == constraint['uri']) {
          alreadyAdded = true;
          break;
        }
      }
      if (!alreadyAdded) {
        $scope.controlTerm.valueConstraint.ontologies.push(angular.copy(constraint));
      }
    }
    $scope.controlTerm.stagedOntologyValueConstraints = [];

    assignValueConstraintToField();
    $scope.controlTerm.startOver();
  };

  $scope.controlTerm.addBranchToValueConstraint = function() {
    var alreadyAdded, constraint, i, j;
    for (i = 0; i < $scope.controlTerm.stagedBranchesValueConstraints.length; i++) {
      constraint = $scope.controlTerm.stagedBranchesValueConstraints[i];
      alreadyAdded = false;
      for (j = 0; j < $scope.controlTerm.valueConstraint.branches.length; j++) {
        if ($scope.controlTerm.valueConstraint.branches[j]['uri'] == constraint['uri']) {
          alreadyAdded = true;
          break;
        }
      }
      if (!alreadyAdded) {
        var newConstraint = angular.copy(constraint);
        if (newConstraint.maxDepth) {
          newConstraint.maxDepth = parseInt(newConstraint.maxDepth);
        } else {
          newConstraint.maxDepth = 1;
        }
        $scope.controlTerm.valueConstraint.branches.push(newConstraint);
      }
    }
    $scope.controlTerm.stagedBranchesValueConstraints = [];

    assignValueConstraintToField();
    $scope.controlTerm.startOver();
  };

  $scope.controlTerm.addValueSetToValueConstraint = function() {
    var alreadyAdded, constraint, i, j;
    for (i = 0; i < $scope.controlTerm.stagedValueSetValueConstraints.length; i++) {
      constraint = $scope.controlTerm.stagedValueSetValueConstraints[i];
      alreadyAdded = false;
      for (j = 0; j < $scope.controlTerm.valueConstraint.valueSets.length; j++) {
        if ($scope.controlTerm.valueConstraint.valueSets[j]['uri'] == constraint['uri']) {
          alreadyAdded = true;
          break;
        }
      }
      if (!alreadyAdded) {
        $scope.controlTerm.valueConstraint.valueSets.push(angular.copy(constraint));
      }
    }
    $scope.controlTerm.stagedValueSetValueConstraints = [];

    assignValueConstraintToField();
    $scope.controlTerm.startOver();
  };

  /**
   * Add ontology class to value constraint to field values _ui definition.
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
        $scope.controlTerm.valueConstraint.classes.push(angular.copy(constraint));
      }
    }
    $scope.controlTerm.stagedOntologyClassValueConstraints = [];
    $scope.controlTerm.stagedOntologyClassValueConstraintData = [];
    assignValueConstraintToField();

    $scope.controlTerm.startOver();
  };

  var assignValueConstraintToField = function() {
    $scope.field.properties._valueConstraints = $scope.controlTerm.valueConstraint;
    delete $scope.controlTerm.stageValueConstraintAction;
    $scope.controlTerm.stagedOntologyValueConstraints = [];
    $scope.controlTerm.stagedOntologyClassValueConstraints = [];
    $scope.controlTerm.stagedOntologyClassValueConstraintData = [];
    $scope.controlTerm.stagedValueSetValueConstraints = [];
    $scope.controlTerm.stagedBranchesValueConstraints = [];
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

  $element.parents(".controlled-terms-modal").modal({show: false, backdrop: "static"});
  $element.parents(".controlled-terms-modal").on("hide.bs.modal", function() {
    $timeout(function() {
      $scope.$apply(function() {
        $scope.controlTerm.startOver();
      });
    });
  });

  $element.parents(".controlled-terms-modal").on("show.bs.modal", function() {
    $timeout(function() {
      jQuery(window).scrollTop(0);
    });
  });
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
