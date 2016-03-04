'use strict';


define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.service.richTextConfigService', [])
      .service('RichTextConfigService', RichTextConfigService);

  RichTextConfigService.$inject = ['$rootScope'];

  function RichTextConfigService($rootScope) {

    var config = null;
    var richTextConfigs = [];

    var service = {
      serviceId: "RichTextConfigService"
    };

    service.init = function () {
      config = cedarBootstrap.getBaseConfig(this.serviceId);
      richTextConfigs = config;
    };

    service.getConfig = function (configName) {
      return richTextConfigs[configName];
    };

    return service;
  };

});
