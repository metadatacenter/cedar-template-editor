'use strict';

var TemplateElementService = function ($http, UrlService) {

  var service = {
    serviceId: "TemplateElementService"
  };

  service.getDefaultTemplateElementsSummary = function () {
    return $http.get(UrlService.getDefaultTemplateElementsSummary(3, 0)).then(function (response) {
      return response.data.data;
    }).catch(function (err) {
      console.log(err);
    });
  };

  service.getAllTemplateElementsSummary = function () {
    return $http.get(UrlService.getAllTemplateElementsSummary()).then(function (response) {
      return response.data.data;
    }).catch(function (err) {
      console.log(err);
    });
  };

  service.getTemplateElement = function (id) {
    return $http.get(UrlService.getTemplateElement(id)).then(function (response) {
      return response.data;
    }).catch(function (err) {
      console.log(err);
    });
  };

  service.removeTemplateElement = function (id) {
    return $http.delete(UrlService.getTemplateElement(id));
  };

  service.saveTemplateElement = function (element) {
    return $http.post(UrlService.templateElements(), angular.toJson(element));
  };

  service.updateTemplateElement = function (id, element) {
    return $http.put(UrlService.getTemplateElement(id), angular.toJson(element));
  };

  return service;

};

TemplateElementService.$inject = ["$http", "UrlService"];
angularApp.service('TemplateElementService', TemplateElementService);