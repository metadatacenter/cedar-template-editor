define([
  'angular'
], function(angular) {
  angular.module('cedar.templateEditor.template.routes', [])
    .config(templateRoutes);

  templateRoutes.$inject = ['$routeProvider'];

  function templateRoutes($routeProvider) {
    $routeProvider
      .when('/templates/create', {
        templateUrl: 'scripts/template/create-template.html',
        controller: 'CreateTemplateController'
      })
      .when('/templates/edit/:id*', {
        templateUrl: 'scripts/template/create-template.html',
        controller: 'CreateTemplateController'
      });
  }

});