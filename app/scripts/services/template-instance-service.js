'use strict';

var TemplateInstanceService = function ($http, UrlService) {

  var service = {
    serviceId: "TemplateInstanceService"
  };

  service.getDefaultTemplateInstancesSummary = function () {
    return $http.get(UrlService.getDefaultTemplateInstancesSummary(10, 0)).then(function (response) {
      return response.data.data;
    }).catch(function (err) {
      console.log(err);
    });
  };

  service.getAllTemplateInstancesSummary = function () {
    return $http.get(UrlService.getAllTemplateInstancesSummary()).then(function (response) {
      return response.data.data;
    }).catch(function (err) {
      console.log(err);
    });
  };

  service.getTemplateInstance = function (id) {
    return $http.get(UrlService.getTemplateInstance(id)).then(function (response) {
      return response.data;
    }).catch(function (err) {
      console.log(err);
    });
  };

  service.removeTemplateInstance = function (id) {
    return $http.delete(UrlService.getTemplateInstance(id));
  };

  service.saveTemplateInstance = function (instance) {
    return $http.post(UrlService.templateInstances(), angular.toJson(instance));
  };

  service.updateTemplateInstance = function (id, instance) {
    return $http.put(UrlService.getTemplateInstance(id), angular.toJson(instance));
  };

  return service;

};

TemplateInstanceService.$inject = ["$http", "UrlService"];
angularApp.service('TemplateInstanceService', TemplateInstanceService);