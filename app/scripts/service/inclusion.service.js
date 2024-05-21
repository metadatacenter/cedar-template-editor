'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.service.inclusionService', [])
      .service('InclusionService', InclusionService);

  InclusionService.$inject = ['HttpBuilderService', 'UrlService'];

  function InclusionService(HttpBuilderService, UrlService) {

    let service = {
      serviceId: "InclusionService"
    };

    service.getInclusions = function (inclusionsGraph) {
      return HttpBuilderService.post(UrlService.getInclusions(), angular.toJson(inclusionsGraph));
    };

    service.updateInclusions = function (inclusionsGraph) {
      return HttpBuilderService.post(UrlService.getInclusions(), angular.toJson(inclusionsGraph));
    };

    return service;

  }

});
