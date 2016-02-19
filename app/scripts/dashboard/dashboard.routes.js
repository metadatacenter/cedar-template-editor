define([
  'angular'
], function(angular) {
  angular.module('cedar.templateEditor.dashboard.routes', [])
    .config(dashboardRoutes);

  dashboardRoutes.$inject = ['$routeProvider'];

  function dashboardRoutes($routeProvider) {
    $routeProvider
      .when('/', {
        controller: 'RoleSelectorController',
        templateUrl: 'scripts/dashboard/role-selector.html',
      })
      .when('/dashboard', {
        controller: 'DashboardController',
        templateUrl: 'scripts/dashboard/dashboard.html',
      })
      .when('/dashboard/:role*', {
        controller: 'DashboardController',
        templateUrl: 'scripts/dashboard/dashboard.html',
      })
      .when('/:type/list', {
        controller: 'DashboardListController',
        templateUrl: 'scripts/dashboard/dashboard-list.html',
      });
  }

});