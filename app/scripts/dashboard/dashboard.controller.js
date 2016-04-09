'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.dashboard.dashboardController', [])
      .controller('DashboardController', DashboardController);

  DashboardController.$inject = [
    '$location',
    '$rootScope',
    '$routeParams',
    '$scope',
    'AuthorizedBackendService',
    'HeaderService',
    'resourceService',
    'TemplateElementService',
    'TemplateService',
    'TemplateInstanceService',
    'UIMessageService',
    'UrlService',
    'CONST'
  ];

  function DashboardController($location, $rootScope, $routeParams, $scope, AuthorizedBackendService, HeaderService, resourceService, TemplateElementService, TemplateService, TemplateInstanceService, UIMessageService, UrlService, CONST) {
    var vm = this;

    vm.forms = getForms();
    vm.getForms = getForms;
    vm.getWorkspace = getWorkspace;
    vm.resources = getWorkspace();

    $rootScope.pageTitle = 'Dashboard';    

    function getForms() {
      return resourceService.getResources(
        { resourceTypes: ['template'], sort: '-createdOn' },
        function(response) {
          vm.forms = response.resources;
        },
        function(error) { }
      );
    }

    function getWorkspace() {
      return resourceService.getResources(
        { resourceTypes: ['element', 'field', 'instance', 'template'], sort: '-createdOn' },
        function(response) {
          vm.resources = response.resources;
        },
        function(error) { }
      );
    }

  };

});