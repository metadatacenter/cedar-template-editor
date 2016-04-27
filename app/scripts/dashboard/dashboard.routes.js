define([
  'angular'
], function(angular) {
  angular.module('cedar.templateEditor.dashboard.routes', [])
    .config(dashboardRoutes);

  dashboardRoutes.$inject = ['$routeProvider'];

  function dashboardRoutes($routeProvider) {
    $routeProvider
      .when('/', {
        controller: 'DashboardController',
        controllerAs: 'dc',
        templateUrl: 'scripts/dashboard/dashboard.html',
      })
      .when('/folder/:folderId*', {
        controller: 'DashboardController',
        controllerAs: 'dc',
        templateUrl: 'scripts/dashboard/dashboard.html',
      });
  }

});