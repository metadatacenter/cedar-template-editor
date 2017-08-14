'use strict';

define([
  'angular',
  'json!config/modal-service.conf.json'
], function (angular, config) {
  angular.module('cedar.templateEditor.service.modalService', [])
      .service('ModalService', ModalService);

  ModalService.$inject = ['HttpBuilderService', 'UrlService'];

  function ModalService(HttpBuilderService, UrlService) {

    var modalConfig = [];

    var service = {
      serviceId: 'ModalService'
    };

    service.init = function () {
      modalConfig = config;
    };

    service.getConfig = function (modalName) {
      return modalConfig[modalName];
    };

    return service;

  };

});