'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.service.inclusionService', [])
      .service('InclusionService', InclusionService);

  InclusionService.$inject = ['HttpBuilderService', 'UrlService', 'AuthorizedBackendService', 'resourceService', '$q'];

  function InclusionService(HttpBuilderService, UrlService, AuthorizedBackendService, resourceService, $q) {

    let service = {
      serviceId: "InclusionService"
    };

    service.getInclusions = function (inclusionsGraph) {
      return HttpBuilderService.post(UrlService.getInclusions(), angular.toJson(inclusionsGraph));
    };

    service.updateInclusions = function (inclusionsGraph) {
      return HttpBuilderService.post(UrlService.updateInclusions(), angular.toJson(inclusionsGraph));
    };

    // Count each readable containing template once, including indirect inclusion paths.
    service.getContainingInstanceCount = function (id) {
      var visited = new Set();
      var templates = new Set();
      function visit(artifactId) {
        if (visited.has(artifactId)) { return $q.resolve(); }
        visited.add(artifactId);
        return $q(function (resolve, reject) {
          AuthorizedBackendService.doCall(service.getInclusions({'@id': artifactId}),
              function (response) { resolve(response.data); }, reject);
        }).then(function (graph) {
          Object.keys(graph.templates || {}).forEach(function (key) { templates.add(key); });
          return $q.all(Object.keys(graph.elements || {}).map(visit));
        });
      }
      return visit(id).then(function () {
        return $q.all(Array.from(templates).map(function (templateId) {
          return $q(function (resolve, reject) {
            resourceService.getTemplateReport(templateId, function (report) {
              resolve(Number(report.numberOfInstances) || 0);
            }, reject);
          });
        }));
      }).then(function (counts) {
        return counts.reduce(function (total, count) { return total + count; }, 0);
      });
    };

    return service;

  }

});
