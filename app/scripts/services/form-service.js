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
  service.saveElement = function (element) {
    return $http.post(apiService + '/template_elements', angular.toJson(element));
  };

  service.updateElement = function (id, element) {
    return $http.put(apiService + '/template_elements/' + encodeURIComponent(id), angular.toJson(element));
  };

  // TEMPLATES OPERATIONS
  service.saveTemplate = function (template) {
    return $http.post(apiService + '/templates', angular.toJson(template));
  };

  service.updateTemplate = function (id, template) {
    return $http.put(apiService + '/templates/' + encodeURIComponent(id), angular.toJson(template));
  };

  // POPULATED TEMPLATES OPERATIONS
  service.savePopulatedTemplate = function (populatedTemplate) {
    return $http.post(apiService + '/template_instances', angular.toJson(populatedTemplate));
  };

  service.updatePopulatedTemplate = function (id, populatedTemplate) {
    return $http.put(apiService + '/template_instances/' + encodeURIComponent(id), angular.toJson(populatedTemplate));
  };

  return service;

});
