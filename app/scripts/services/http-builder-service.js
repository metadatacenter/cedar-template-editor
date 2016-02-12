'use strict';

var HttpBuilderService = function () {

  var service = {
    serviceId: "HttpBuilderService"
  };

  service.method = function (method, url, data) {
    return {
      "method": method,
      "url"   : url,
      "data"  : data
    };
  };

  service.get = function (url) {
    return this.method("GET", url, null);
  };

  service.delete = function (url) {
    return this.method("DELETE", url, null);
  };

  service.post = function (url, data) {
    return this.method("POST", url, data);
  };

  service.put = function (url, data) {
    return this.method("PUT", url, data);
  };

  return service;

};

HttpBuilderService.$inject = [];
angularApp.service('HttpBuilderService', HttpBuilderService);