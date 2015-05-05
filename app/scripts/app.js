'use strict';

var angularApp = angular.module('angularjsFormBuilderApp', ['ui.bootstrap', 'ngRoute']);

angularApp.config(function ($routeProvider, $locationProvider) {

    $routeProvider
        .when('/', {
            templateUrl: 'views/dashboard.html',
            controller: 'DashboardController'
        })
        .when('/elements/create', {
            templateUrl: 'views/create-element.html',
            controller: 'CreateElementController'
        })
        .when('/templates/create', {
            templateUrl: 'views/create-template.html',
            controller: 'CreateTemplateController'
        })
        .when('/templates/:id/view', {
            templateUrl: 'views/view.html',
            controller: 'ViewCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });

    // use the HTML5 History API
    $locationProvider.html5Mode(true);

});


