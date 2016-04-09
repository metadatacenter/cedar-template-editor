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

    function getForms() {
      return resourceService.getResources(
        { resourceTypes: ['template'], sort: '-createdOn' },
        function(response) {
          vm.forms = response.resources;
        },
        function(error) { }
      );
    }

    $rootScope.pageTitle = 'Dashboard';    

  };

});