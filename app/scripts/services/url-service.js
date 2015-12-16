'use strict';

var UrlService = function () {

  var hostname = window.location.hostname;
  var apiService = 'http://' + hostname + ':9000';

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

  service.getDefaultTemplatesSummary = function (count, page) {
    return apiService + '/templates?summary=true' + '&count=' + count + '&page=' + page;
  };

  service.getAllTemplatesSummary = function () {
    return apiService + '/templates?summary=true';
  };

  service.getDefaultTemplateElementsSummary = function (count, page) {
    return apiService + '/template_elements?summary=true' + '&count=' + count + '&page=' + page;
  };

  service.getAllTemplateElementsSummary = function () {
    return apiService + '/template_elements?summary=true';
  };

  service.getDefaultTemplateInstancesSummary = function (count, page) {
    return apiService + '/template_instances?summary=true' + '&count=' + count + '&page=' + page;
  };

  service.getAllTemplateInstancesSummary = function () {
    return apiService + '/template_instances?summary=true';
  };

  return service;
};

UrlService.$inject = [];
angularApp.service('UrlService', UrlService);