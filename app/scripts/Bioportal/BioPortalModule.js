'use strict';

// Define our local application
var bioPortalModule = angular.module('bioPortal', ['angucomplete-alt']);

bioPortalModule
.filter('htmlToPlaintext', function() {
  return function(text) {
    return  text ? String(text).replace(/<[^>]+>/gm, '') : '';
  };
})
.filter('returnNullIfEmpty', function() {
  return function(text) {
    return text == undefined ? 0 : text;
  }
})
// This 'classTree' directive will call the 'childTree' directive for every child in the collection returned from the BioPortalService
.directive('classTree', function ($timeout) {
  return {
    restrict: 'E',
    scope: {
      tree: '=',
      term: '=',
      level: "=",
      selectedNode: "="
    },
    templateUrl: "./scripts/Bioportal/views/directives/class-tree.html",
    replace: true,
    link: function(scope, element, attrs) {
      $timeout(function() {

        if (scope.selectedNode) {
          var id = scope.selectedNode["@id"];
          var node = angular.element("[at_id='" + id + "']");

          if (node.length > 0) {
            var $container = element.parent();
            var containerHeight = $container.height();
            var containerWidth = $container.width();
            var containerOffset = $container.offset();
            var selectedNodeOffset = node.offset();

            var topScrollAmount = selectedNodeOffset.top - containerOffset.top - containerHeight/2;
            var leftScrollAmount = selectedNodeOffset.left - containerOffset.left - containerWidth/2;

            if (topScrollAmount > 0) {
              $container.scrollTop(topScrollAmount);
            }

            if (leftScrollAmount > 0) {
              $container.scrollLeft(leftScrollAmount);
            }
          }
        }
      });
    }
  };
})
// This directive will recursively call the parent 'classTree' directive for every child in the collection returned from the BioPortalService
// creating an infinite nesting tree if the data supports it
.directive('childTree', function (BioPortalService, $compile) {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      subtree: '=',
      term: '=',
      level: "="
    },
    templateUrl: "./scripts/Bioportal/views/directives/child-tree.html",
    link: function(scope, element, attrs) {
      // Recycle function to add nest children under parent element
      function nestChildren(children) {
    	element.addClass('expanded');

		var children = '<class-tree tree="' + children + '" term="term" level="' + (scope.level + 1) + '"></class-tree>';
		$compile(children)(scope, function(cloned, scope){
		  element.append(cloned);
		});

      }

      if (scope.subtree) {
        var acronym = scope.subtree.links.ontology.slice(39);
        if (scope.subtree["@type"].indexOf("Ontology") >= 0) {
          scope.subtree.resultType = "Ontology";
        } else if (acronym != 'NLMVS') {
          scope.subtree.resultType = 'Ontology Class';
        } else {
          scope.subtree.resultType = "Value Set";
        }
      }

      // Default Class nested tree expansion from BioPortalService.getClassTree() call
  	  if (scope.subtree && scope.subtree.children && scope.subtree.children.length) {
		nestChildren('subtree.children');
  	  }

  	  // Manual drilling down into Class children upon user interaction via BioPortalService.getClassChildren() call
  	  element.find('a').on('click', function(event) {
        if (element.hasClass('expanded')) {
          var childTree = element.find('ul.tree').empty();
          delete scope.children;
          delete scope.subtree.hasChildren;
          element.removeClass('expanded');
        }
  		else if (scope.subtree.hasChildren !== false && !scope.children) {
  		  BioPortalService.getClassChildren(scope.subtree.links.ontology.slice(39), scope.subtree['@id']).then(function(response) {
            if (!response || response.length == 0) {
              scope.subtree.hasChildren = false;
            }

  			scope.children = response;
  			nestChildren('children');
  		  });
  		}
  	  });
    }
  };
});

// Require local controllers
bioPortalModule.controller('BioPortalController', function($scope, BioPortalService, $routeParams, $q){

	// Get all BioPortal ontologies.
	$scope.getAllOntologies = function() {
		//console.log(sessionStorage);
		if (sessionStorage.ontologies) {
			return $q(function(resolve, reject) {
				resolve(JSON.parse(sessionStorage.getItem('ontologies')));
			});
		} else {
			return BioPortalService.getAllOntologies().then(function(response) {
				//console.log(response);
				sessionStorage.setItem('ontologies', JSON.stringify(response.data));
				return response.data;
			});
		}
	};

	// Get the details of a specific ontology.
	$scope.getOntology = function(ontology) {
		var acronym = ontology.originalObject ? ontology.originalObject.acronym : ontology.acronym;
		$scope.selectedOntology = null;

		$q.all({
	      details: 		BioPortalService.getOntologyDetails(acronym),
	      size: 			BioPortalService.getOntologySize(acronym),
	      categories: BioPortalService.getOntologyCategories(acronym)
	    }).then(function(values) {
	    	//console.log(values);
	    	$scope.currentOntology = values;
	    });
	};

	// Load Ontologies
	$scope.loadOntologies = function() {
		// First get all Ontologies to browse/search
		$scope.getAllOntologies().then(function(data) {
			// Assign data to local var on $scope
			$scope.ontologies = data;
		});
	};

	// Store classes returned from query into local array
	$scope.matchingClasses = [];
	// Query BioPortal api for a specific class input by user
	$scope.queryClasses = function(query) {
		//console.log(query);
		BioPortalService.searchClass(query).then(function(response) {
			//console.log(response);
			// If $scope.matchingClasses is a lengthy array, push next array of items into array, if not, create $scope.matchingClasses as array
			$scope.matchingClasses.length ? $scope.matchingClasses.push.apply($scope.matchingClasses, response.collection) : $scope.matchingClasses = response.collection;
			// If next class is available, load next page of results into $scope.matchingClasses automatically by recursively calling this function
			if (response.links.nextPage) { $scope.queryClasses(response.links.nextPage); }
		});
	};

	// Query BioPortal api for specific Class, Ontology, and Ontology Tree details
	$scope.selectClass = function(selection) {
		//console.log(selection);
		// This provides the Ontology acronym from the links.ontology string
		var acronym = selection.links.ontology.slice(39);

		// Get selected Class Details from the links.self endpoint provided
		BioPortalService.getClassDetails(selection.links.self).then(function(response) {
			$scope.classDetails = response;
		});

		$q.all({
	      details: 		BioPortalService.getOntologyDetails(acronym),
	      size: 			BioPortalService.getOntologySize(acronym),
	      tree:  			BioPortalService.getClassTree(acronym, selection['@id']),
	      root: 			BioPortalService.getOntologyTreeRoot(acronym),
	      valueSet: 	BioPortalService.getClassValueSet(acronym, selection['@id'])
	    }).then(function(values) {
	    	$scope.currentOntology = values;
	    	//console.log($scope.currentOntology.valueSet);
	    });
	};

	// Store value sets returned from query into local array
	$scope.valueSets = [];
	// Query BioPortal api for a specific value set input by the user
	$scope.queryValueSets = function(query) {
		//BioPortalService.searchValueSets(query);
		BioPortalService.searchValueSets(query).then(function(response) {
			// push returned array from BioPortalService.searchValueSets() function onto end of $scope.valueSets
			$scope.valueSets.push.apply($scope.valueSets, response.collection);
			// If next class is available, load next page of results into $scope.valueSets automatically by recursively calling this function
			if (response.links.nextPage) { $scope.queryValueSets(response.links.nextPage); }
		});
	};

	$scope.selectValueSet = function(set) {
		// This provides the Ontology acronym from the links.ontology string
		var acronym = set.links.ontology.slice(39);

		$q.all({
			details: BioPortalService.getValueSetDetails(acronym, set['@id']),
			rootSet: BioPortalService.getOntologyValueSets(acronym)
		}).then(function(values) {
			$scope.currentValueSet = values;
			//console.log($scope.currentValueSet.details);
		});
	};

	if($routeParams.type) {
		// Check :type param string in URL to route request to proper handler
		switch($routeParams.type) {
			case 'ontologies':
				$scope.loadOntologies();
				$scope.viewOntologies = true;
				break;
			case 'value-sets':
				$scope.viewValueSets = true;
				break;
			case 'classes':
				$scope.viewClasses = true;
				break;
		}
	}
});

