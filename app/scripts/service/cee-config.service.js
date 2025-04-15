define([
  'angular',
  'json!third_party_components/cedar-embeddable-editor/embeddable-editor-config.json'
], function (angular, config) {
  angular.module('cedar.templateEditor.service.ceeConfigService', [])
      .service('CeeConfigService', CeeConfigService);

  // CeeConfigService.$inject = ['$rootScope'];

  function CeeConfigService($rootScope) {

    let ceeConfig = config;

    let service = {
      serviceId: "CeeConfigService"
    };

    service.getConfig = function () {
      return ceeConfig;
    };

    return service;
  }
});
