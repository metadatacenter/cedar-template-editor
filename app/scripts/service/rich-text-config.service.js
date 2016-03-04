'use strict';

var RichTextConfigService = function () {

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

RichTextConfigService.$inject = [];
angularApp.service('RichTextConfigService', RichTextConfigService);