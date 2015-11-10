'use strict';

var UrlService = function () {
  return {
    serviceId: "UrlService",

    getTemplateEdit: function (id) {
      return "/templates/edit/" + id;
    },
    getElementEdit: function (id) {
      return "/elements/edit/" + id;
    },
    getInstanceEdit: function (id) {
      return "/instances/edit/" + id;
    }
  };
};

UrlService.$inject = [];
angularApp.service('UrlService', UrlService);