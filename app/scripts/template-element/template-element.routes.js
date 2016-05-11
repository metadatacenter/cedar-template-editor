define([
  'angular'
], function(angular) {
  angular.module('cedar.templateEditor.templateElement.routes', [])
    .config(templateElementRoutes);

  templateElementRoutes.$inject = ['$routeProvider'];

  function templateElementRoutes($routeProvider) {
    $routeProvider
      .when('/elements/create', {
        // templateUrl: 'scripts/template-element/create-element.html',
        templateUrl: 'scripts/template-element/create-element.html',
        controller: 'CreateElementController'
      })
      .when('/elements/edit/:id*', {
        // templateUrl: 'scripts/template-element/create-element.html',
        templateUrl: 'scripts/template-element/create-element.html',
        controller: 'CreateElementController'
      });
  }

});