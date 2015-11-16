'use strict';

var UrlService = function () {

  var service = {
    serviceId: "UrlService"
  };

  service.getRoleSelector = function () {
    return "/role-selector/";
  };

  service.getTemplateEdit = function (id) {
    return "/templates/edit/" + id;
  };

  service.getElementEdit = function (id) {
    return "/elements/edit/" + id;
  };

  service.getInstanceEdit = function (id) {
    return "/instances/edit/" + id;
  };

  return service;
};

UrlService.$inject = [];
angularApp.service('UrlService', UrlService);