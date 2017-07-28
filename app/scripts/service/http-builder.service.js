'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.service.httpBuilderService', [])
      .service('HttpBuilderService', HttpBuilderService);

  HttpBuilderService.$inject = [];


  function HttpBuilderService() {

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

    service.patch = function (url, data) {
      return this.method("PATCH", url, data);
    };

    service.patchMerge = function (url, data) {
      var m = this.method("PATCH", url, data);
      m.headers = {"Content-Type": "application/merge-patch+json"};
      return m;
    };

    return service;
  };

});
