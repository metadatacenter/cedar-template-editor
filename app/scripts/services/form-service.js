'use strict';

angularApp.service('FormService', function FormService($http) {
  // uncomment next line to use hosted cedar-template-server, gulp-connect-proxy will proxy all calls behind route '/proxy'
  //var apiService = 'http://localhost:4200/proxy/cedar-dev1.stanford.edu:8888';
  //var apiService = 'http://localhost:9000';

  var hostname = window.location.hostname;

  var apiService = 'http://'+hostname+':9000';

  return {
    // ELEMENTS OPERATIONS
    element: function(id) {
      //return $http.get('/static-data/elements/'+id+'.json').then(function(response) {
      return $http.get(apiService + '/template_elements/' + encodeURIComponent(id)).then(function (response) {
        return response.data;
      }).catch(function(err) {
        console.log(err);
      });
    },
    saveElement: function(element) {
      return $http.post(apiService + '/template_elements', angular.toJson(element));
    },
    elementList: function() {
      //return $http.get('/static-data/dashboard/template-elements.json').then(function(response) {
      return $http.get(apiService + '/template_elements').then(function(response) {
        return response.data;
      }).catch(function(err) {
        console.log(err);
      });
    },
    updateElement: function(id, element) {
      return $http.put(apiService + '/template_elements/' + encodeURIComponent(id), angular.toJson(element));
    },
    removeElement: function(id) {
      return $http.delete(apiService + '/template_elements/' + encodeURIComponent(id));
    },
    // TEMPLATES OPERATIONS
    form: function (id) {
      // $http returns a promise, which has a then function, which also returns a promise
      //return $http.get('/static-data/forms/'+id+'.json').then(function (response) {
      return $http.get(apiService + '/templates/' + encodeURIComponent(id)).then(function (response) {
        // The return value gets picked up by the then fn in the controller.
        return response.data;
      }).catch(function(err) {
        console.log(err);
      });
    },
    saveTemplate: function(template) {
      return $http.post(apiService + '/templates', angular.toJson(template));
    },
    formList: function() {
      //return $http.get('/static-data/dashboard/metadata-templates.json').then(function(response) {
      return $http.get(apiService + '/templates').then(function(response) {
        return response.data;
      }).catch(function(err) {
        console.log(err);
      });
    },
    updateTemplate: function(id, template) {
      return $http.put(apiService + '/templates/'+ encodeURIComponent(id), angular.toJson(template));
    },
    removeTemplate: function(id) {
      return $http.delete(apiService + '/templates/' + encodeURIComponent(id));
    },
    // POPULATED TEMPLATES OPERATIONS
    populatedTemplate: function (id) {
      return $http.get(apiService + '/template_instances/' + encodeURIComponent(id)).then(function (response) {
        return response.data;
      }).catch(function(err) {
        console.log(err);
      });
    },
    savePopulatedTemplate: function(populatedTemplate) {
      return $http.post(apiService + '/template_instances', angular.toJson(populatedTemplate));
    },
    populatedTemplatesList: function() {
      //return $http.get('/static-data/dashboard/metadata-templates.json').then(function(response) {
      return $http.get(apiService + '/template_instances').then(function(response) {
        return response.data;
      }).catch(function(err) {
        console.log(err);
      });
    },
    updatePopulatedTemplate: function(id, populatedTemplate) {
      return $http.put(apiService + '/template_instances/'+ encodeURIComponent(id), angular.toJson(populatedTemplate));
    },
    removePopulatedTemplate: function(id) {
      return $http.delete(apiService + '/template_instances/' + encodeURIComponent(id));
    }
  };
});
