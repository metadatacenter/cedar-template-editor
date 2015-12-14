/*jslint node: true */
/*global angularApp */
'use strict';

var angularConfig = function ($routeProvider, $locationProvider, $translateProvider) {

  //configure routes
  $routeProvider
    .when('/', {
      templateUrl: 'views/role-selector.html',
      controller: 'RoleSelectorController'
    })
    .when('/dashboard', {
      templateUrl: 'views/dashboard.html',
      controller: 'DashboardController'
    })
    .when('/dashboard/:role*', {
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
      templateUrl: 'views/create-instance.html',
      controller: 'CreateInstanceController'
    })
    .when('/instances/create/:template_id*?', {
      templateUrl: 'views/create-instance.html',
      controller: 'CreateInstanceController'
    })
    .when('/instances/edit/:id*', {
      templateUrl: 'views/create-instance.html',
      controller: 'CreateInstanceController'
    })
    .otherwise({
      redirectTo: '/'
    });

  // use the HTML5 History API
  //$locationProvider.html5Mode(true);

  // configure translations
  $translateProvider.useStaticFilesLoader({
    prefix: 'data/i18n/locale-',
    suffix: '.json'
  });
  $translateProvider.preferredLanguage('en');
  $translateProvider.useSanitizeValueStrategy('sanitize');
};

angularConfig.$inject = ['$routeProvider', '$locationProvider', '$translateProvider'];
angularApp.config(angularConfig);