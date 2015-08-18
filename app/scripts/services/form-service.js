'use strict';

angularApp.service('FormService', function FormService($http) {

  return {
    // ELEMENTS OPERATIONS
    element: function(id) {
      //return $http.get('/static-data/elements/'+id+'.json').then(function(response) {
      return $http.get('http://localhost:9000/template_elements/' + encodeURIComponent(id)).then(function (response) {
        return response.data;
      }).catch(function(err) {
        console.log(err);
      });
    },
    saveElement: function(element) {
      return $http.post('http://localhost:9000/template_elements', angular.toJson(element));
    },
    elementList: function() {
      //return $http.get('/static-data/dashboard/template-elements.json').then(function(response) {
      return $http.get('http://localhost:9000/template_elements').then(function(response) {
        return response.data;
      }).catch(function(err) {
        console.log(err);
      });
    },
    updateElement: function(id, element) {
      return $http.put('http://localhost:9000/template_elements/' + encodeURIComponent(id), angular.toJson(element));
    },
    removeElement: function(id) {
      return $http.delete('http://localhost:9000/template_elements/' + encodeURIComponent(id));
    },
    // TEMPLATES OPERATIONS
    form: function (id) {
      // $http returns a promise, which has a then function, which also returns a promise
      //return $http.get('/static-data/forms/'+id+'.json').then(function (response) {
      return $http.get('http://localhost:9000/templates/' + encodeURIComponent(id)).then(function (response) {
        // The return value gets picked up by the then fn in the controller.
        return response.data;
      }).catch(function(err) {
        console.log(err);
      });
    },
    saveTemplate: function(template) {
      return $http.post('http://localhost:9000/templates', angular.toJson(template));
    },
    formList: function() {
      //return $http.get('/static-data/dashboard/metadata-templates.json').then(function(response) {
      return $http.get('http://localhost:9000/templates').then(function(response) {
        return response.data;
      }).catch(function(err) {
        console.log(err);
      });
    },
    updateTemplate: function(id, template) {
      return $http.put('http://localhost:9000/templates/'+ encodeURIComponent(id), angular.toJson(template));
    },
    removeTemplate: function(id) {
      return $http.delete('http://localhost:9000/templates/' + encodeURIComponent(id));
    },
    // POPULATED TEMPLATES OPERATIONS
    populatedTemplate: function (id) {
      return $http.get('http://localhost:9000/template_instances/' + encodeURIComponent(id)).then(function (response) {
        return response.data;
      }).catch(function(err) {
        console.log(err);
      });
    },
    savePopulatedTemplate: function(populatedTemplate) {
      return $http.post('http://localhost:9000/template_instances', angular.toJson(populatedTemplate));
    },
    populatedTemplatesList: function() {
      //return $http.get('/static-data/dashboard/metadata-templates.json').then(function(response) {
      return $http.get('http://localhost:9000/template_instances').then(function(response) {
        return response.data;
      }).catch(function(err) {
        console.log(err);
      });
    },
    updatePopulatedTemplate: function(id, populatedTemplate) {
      return $http.put('http://localhost:9000/template_instances/'+ encodeURIComponent(id), angular.toJson(populatedTemplate));
    },
    removePopulatedTemplate: function(id) {
      return $http.delete('http://localhost:9000/template_instances/' + encodeURIComponent(id));
    }
  };
});
