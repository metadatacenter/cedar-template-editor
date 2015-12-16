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

  return service;

};

TemplateInstanceService.$inject = ["$http", "UrlService"];
angularApp.service('TemplateInstanceService', TemplateInstanceService);