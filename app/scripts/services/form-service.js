'use strict';

angularApp.service('FormService', function FormService($http) {
  // uncomment next line to use hosted cedar-template-server, gulp-connect-proxy will proxy all calls behind route '/proxy'
  //var apiService = 'http://localhost:4200/proxy/cedar-dev1.stanford.edu:8888';
  //var apiService = 'http://localhost:9000';

  var service = {
    serviceId: "FormService"
  };

  var hostname = window.location.hostname;

  var apiService = 'http://' + hostname + ':9000';

  // ELEMENTS OPERATIONS
  service.element = function (id) {
    //return $http.get('/static-data/elements/'+id+'.json').then(function(response) {
    return $http.get(apiService + '/template_elements/' + encodeURIComponent(id)).then(function (response) {
      return response.data;
    }).catch(function (err) {
      console.log(err);
    });
  };

  service.saveElement = function (element) {
    return $http.post(apiService + '/template_elements', angular.toJson(element));
  };

  service.updateElement = function (id, element) {
    return $http.put(apiService + '/template_elements/' + encodeURIComponent(id), angular.toJson(element));
  };

  service.removeElement = function (id) {
    return $http.delete(apiService + '/template_elements/' + encodeURIComponent(id));
  };

  // TEMPLATES OPERATIONS
  service.form = function (id) {
    // $http returns a promise, which has a then function, which also returns a promise
    //return $http.get('/static-data/forms/'+id+'.json').then(function (response) {
    return $http.get(apiService + '/templates/' + encodeURIComponent(id)).then(function (response) {
      // The return value gets picked up by the then fn in the controller.
      return response.data;
    }).catch(function (err) {
      console.log(err);
    });
  };

  service.saveTemplate = function (template) {
    return $http.post(apiService + '/templates', angular.toJson(template));
  };

  service.updateTemplate = function (id, template) {
    return $http.put(apiService + '/templates/' + encodeURIComponent(id), angular.toJson(template));
  };

  service.removeTemplate = function (id) {
    return $http.delete(apiService + '/templates/' + encodeURIComponent(id));
  };

  // POPULATED TEMPLATES OPERATIONS
  service.populatedTemplate = function (id) {
    return $http.get(apiService + '/template_instances/' + encodeURIComponent(id)).then(function (response) {
      return response.data;
    }).catch(function (err) {
      console.log(err);
    });
  };

  service.savePopulatedTemplate = function (populatedTemplate) {
    return $http.post(apiService + '/template_instances', angular.toJson(populatedTemplate));
  };

  service.updatePopulatedTemplate = function (id, populatedTemplate) {
    return $http.put(apiService + '/template_instances/' + encodeURIComponent(id), angular.toJson(populatedTemplate));
  };

  service.removePopulatedTemplate = function (id) {
    return $http.delete(apiService + '/template_instances/' + encodeURIComponent(id));
  };

  return service;

});
