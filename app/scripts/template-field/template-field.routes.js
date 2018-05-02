define([
  'angular'
], function(angular) {
  angular.module('cedar.templateEditor.templateField.routes', [])
      .config(templateFieldRoutes);

  templateFieldRoutes.$inject = ['$routeProvider'];

  function templateFieldRoutes($routeProvider) {
    $routeProvider
        .when('/fields/create', {
          // templateUrl: 'scripts/template-field/create-field.html',
          templateUrl: 'scripts/template-field/create-field.html',
          controller: 'CreateFieldController'
        })
        .when('/fields/edit/:id*', {
          // templateUrl: 'scripts/template-element/create-element.html',
          templateUrl: 'scripts/template-field/create-field.html',
          controller: 'CreateFieldController'
        });
  }

});