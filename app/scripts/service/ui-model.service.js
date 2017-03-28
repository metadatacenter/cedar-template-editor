'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.service.uIModelService', [])
      .service('UIModelService', UIModelService);

  UIModelService.$inject = ['DataManipulationService'];

  /*
   * This service contains functions that are used to keep the data shown in the UI (e.g., checkbox values)
   * synchronized with the CEDAR Template Model
   */
  function UIModelService(DataManipulationService) {

    var service = {
      serviceId: "UIModelService"
    };

   // Service functions...

    return service;
  };

});
