define([
  'angular'
], function(angular) {
  angular.module('cedar.templateEditor.templateInstance.routes', [])
    .config(templateInstanceRoutes);

  templateInstanceRoutes.$inject = ['$routeProvider'];

  function templateInstanceRoutes($routeProvider) {
    $routeProvider
      .when('/instances/create', {
        templateUrl: 'scripts/template-instance/create-instance.html',
        controller: 'CreateInstanceController'
      })
      .when('/instances/create/:templateId*?', {
        templateUrl: 'scripts/template-instance/create-instance.html',
        controller: 'CreateInstanceController'
      })
      .when('/instances/edit/:id*', {
        templateUrl: 'scripts/template-instance/create-instance.html',
        controller: 'CreateInstanceController'
      });
  }

});