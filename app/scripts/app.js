'use strict';

var angularApp = angular.module('angularJsCedarApplication', ['ui.bootstrap', 'ngRoute', 'ngAnimate', 'cedarFilters']);

angularApp.config(function ($routeProvider, $locationProvider) {

    $routeProvider
        .when('/', {
            templateUrl: 'views/dashboard.html',
            controller: 'DashboardController'
        })
        .when('/:type/list', {
            templateUrl: 'views/dashboard-list.html',
            controller: 'DashboardListController'
        })
        .when('/elements/create', {
            templateUrl: 'views/create-element.html',
            controller: 'CreateElementController'
        })
        .when('/elements/edit/:id*', {
            templateUrl: 'views/create-element.html',
            controller: 'CreateElementController'
        })
        .when('/templates/create', {
            templateUrl: 'views/create-template.html',
            controller: 'CreateTemplateController'
        })
        .when('/templates/edit/:id*', {
            templateUrl: 'views/create-template.html',
            controller: 'CreateTemplateController'
        })
        .when('/instances/create', {
            templateUrl: 'views/runtime.html',
            controller: 'RuntimeController'
        })
        .when('/instances/create/:template_id*?', {
            templateUrl: 'views/runtime.html',
            controller: 'RuntimeController'
        })
        .when('/instances/edit/:id*', {
            templateUrl: 'views/runtime.html',
            controller: 'RuntimeController'
        })
        //.when('/templates/runtime', {
        //    templateUrl: 'views/runtime.html',
        //    controller: 'RuntimeController'
        //})
        //.when('/templates/runtime/:id/:submission_id?', {
        //.when('/templates/runtime/:id*/submissions/:submission_id', {
        //    templateUrl: 'views/runtime.html',
        //    controller: 'RuntimeController'
        //})
        //.when('/templates/runtime/:id*', {
        //  templateUrl: 'views/runtime.html',
        //  controller: 'RuntimeController'
        //})
        .otherwise({
            redirectTo: '/'
        });

    // use the HTML5 History API
    //$locationProvider.html5Mode(true);

});


