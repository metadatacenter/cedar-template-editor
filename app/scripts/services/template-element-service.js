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

  return service;

};

TemplateElementService.$inject = ["$http", "UrlService"];
angularApp.service('TemplateElementService', TemplateElementService);