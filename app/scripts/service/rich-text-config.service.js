'use strict';


define([
  'angular',
  'json!config/rich-text-config-service.conf.json'
], function (angular, config) {
  angular.module('cedar.templateEditor.service.richTextConfigService', [])
      .service('RichTextConfigService', RichTextConfigService);

  RichTextConfigService.$inject = ['$rootScope'];

  function RichTextConfigService($rootScope) {

    var richTextConfigs = [];

    var service = {
      serviceId: "RichTextConfigService"
    };

    service.init = function () {
      richTextConfigs = config;
    };

    service.getConfig = function (configName) {
      return richTextConfigs[configName];
    };

    return service;
  };

});
