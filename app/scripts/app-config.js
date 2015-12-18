/*jslint node: true */
/*global angularApp */
'use strict';

var angularConfig = function ($routeProvider, $locationProvider, $translateProvider, toastyConfigProvider) {

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
    prefix: 'resources/i18n/locale-',
    suffix: '.json'
  });
  $translateProvider.preferredLanguage('en');
  $translateProvider.useSanitizeValueStrategy('sanitize');

  // configure toasty messaging
  toastyConfigProvider.setConfig({
    limit: 10,                // {int} Maximum number of toasties to show at once
    clickToClose: false,      // {bool} Whether clicking the toasty closes it
    position: 'bottom-right', // {string:bottom-right,bottom-left,top-right,top-left} The window position where the toast pops up
    timeout: 5000,            // {int} How long (in miliseconds) the toasty shows before it's removed. Set to false to disable.
    sound: true,              // {bool} Whether to play a sound when a toast is added
    html: false,              // {bool} Whether HTML is allowed in toasts
    shake: false,             // {bool} Whether to shake the toasts
    theme: 'bootstrap'        // {string} What theme to use; default, material or bootstrap
  });
};

angularConfig.$inject = ['$routeProvider', '$locationProvider', '$translateProvider', 'toastyConfigProvider'];
angularApp.config(angularConfig);