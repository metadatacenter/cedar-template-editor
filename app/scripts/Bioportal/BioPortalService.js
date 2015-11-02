'use strict';

bioPortalModule.service('BioPortalService', function BioPortalService($http, $q) {

  var http_default_config = {
    'headers': {
      'Authorization': 'apikey token=3bdf57dc-4d53-4ca1-b6c1-a1f1fe651ea9'
    }
  }

  // Defining baseurl form requests
  var base = 'http://data.bioontology.org/';

  // TODO: respect existing query strings
  function optimizeUri(uri) {
    uri += '?display_context=false&display_links=false';
    return uri;
  }

  return {

	getAllOntologies: function() {
	  return $http.get(base + 'ontologies/', http_default_config).then(function(response) {
		return response;
	  }).catch(function(err) {
		return err;
	  });
	},
	getOntologyDetails: function(acronym) {
	  return $http.get(base + 'ontologies/' + acronym + '/latest_submission', http_default_config).then(function(response) {
		return response.data;
	  }).catch(function(err) {
		return err;
	  });
	},
	getOntologySize: function(acronym, optimize) {
      var uri = base + 'ontologies/' + acronym + '/metrics';
      if (optimize) {
        uri = optimizeUri(uri);
      }
	  return $http.get(uri, http_default_config).then(function(response) {
		return response.data;
	  }).catch(function(err) {
		return err;
	  });
	},
	getOntologyCategories: function(acronym, optimize) {
      var uri = base + 'ontologies/' + acronym + '/categories';
      if (optimize) {
        uri = optimizeUri(uri);
      }
	  return $http.get(uri, http_default_config).then(function(response) {
		return response.data;
	  }).catch(function(err) {
		return err;
	  });
	},
	getGenericEndpoint: function(endpoint) {
	  // Some links within data returned from other requests have fully qualified endpoints so this is
	  // simply a generic helper request function
	  return $http.get(endpoint, http_default_config).then(function(response) {
		return response.data;
	  }).catch(function(err) {
		return err;
	  })
		},
	searchClass: function(query) {
	  // This searchClass() function will run for each additional page of data in the original request,
	  // subsequent requests are made the the full qualified endpoint therefore the request will NOT need
	  // to be sliced to properly format the request

	  //search?q={query}
	  // &require_exact_match will only match the phrase, not any word within the phrase (more accurate)
	  var request = base + 'search?q=' + query.replace(/[\s]+/g, '+') + '&require_exact_match=true';
	  if (query.slice(0, 27) == 'http://data.bioontology.org') {
		request = query;
	  }
      
      return $http.get(request, http_default_config).then(function(response) {
		return response.data;
	  }).catch(function(err) {
		return err;
	  });
	},
	getClassDetails: function(endpoint) {
	  // This function will return some more detailed information on a particular class
   	  return $http.get(endpoint, http_default_config).then(function(response) {
		return response.data;
	  }).catch(function(err) {
		return err;
	  });
	},
	getClassTree: function(acronym, classId ) {
	  //ontologies/{acronym}/classes/{id}/tree
	  return $http.get(base + 'ontologies/' + acronym + '/classes/' + encodeURIComponent(classId) + '/tree', http_default_config).then(function(response) {
		return response.data;
	  }).catch(function(err) {
		return err;
	  });
	},
	getClassChildren: function(acronym, classId) {
	  //ontologies/{acronym}/classes/{id}/children?include=hasChildren
  	  return $http.get(base + 'ontologies/' + acronym + '/classes/' + encodeURIComponent(classId) + '/children?include=hasChildren,prefLabel', http_default_config).then(function(response) {
		return response.data.collection;
	  }).catch(function(err) {
		return err;
	  });
	},
	getClassValueSet: function(acronym, classId) {
	  //ontologies/{acronym}/classes/{id}/children?pagesize={pagesize}
	  return $http.get(base + 'ontologies/' + acronym + '/classes/' + encodeURIComponent(classId) + '/children?pagesize=100', http_default_config).then(function(response) {
		return response.data.collection;
	  }).catch(function(err) {
		return err;
	  });
	},
	getOntologyTreeRoot: function(acronym){
	  //ontologies/{acronym}/classes/roots
	  return $http.get(base + 'ontologies/' + acronym + '/classes/roots', http_default_config).then(function(response) {
		return response.data;
	  }).catch(function(err) {
		return err;
	  });
	},
	searchValueSets: function(query) {
	  //search?q={query}&ontologies={acronym}&roots_only=true
	  // &require_exact_match will only match the phrase, not any word within the phrase (more accurate)
	  return $http.get(base + 'search?q=' + query.replace(/[\s]+/g, '+') + '&roots_only=true&require_exact_match=true', http_default_config).then(function(response) {
		//console.log(response);
		return response.data;
	  }).catch(function(err) {
		return err;
	  });
	},
	getValueSetDetails: function(acronym, classId) {
	  //ontologies/{acronym}/classes/{id}?include=prefLabel,definition,properties
	  var request = base + 'ontologies/' + acronym + '/classes/' + encodeURIComponent(classId) + '?include=prefLabel,definition,properties';
	  return $http.get(request, http_default_config).then(function(response) {
		return response.data;
	  }).catch(function(err) {
		return err;
	  });
	},
	getOntologyValueSets: function(acronym) {
	  //ontologies/NLMVS/classes/roots
	  // Get all value sets that belong to a specific Ontology
	  return $http.get(base + 'ontologies/' + acronym + '/classes/roots', http_default_config).then(function(response) {
		return response.data;
	  }).catch(function(err) {
		return err;
	  });
	},

	getOntologyClasses: function(endpointOrAcronym) {
	  var url = endpointOrAcronym;
	  if (!/\/classes$/i.test(url)) {
		url = base + "ontologies/" + url + "/classes";
	  }

	  return $http.get(url, http_default_config).then(function(response) {
		return response.data.collection;
	  }).catch(function(err) {
		return err;
	  });
	}
  }
});