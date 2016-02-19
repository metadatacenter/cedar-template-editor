/*jslint node: true */
'use strict';

define([
  'angular'
], function(angular) {
  angular.module('cedar.templateEditor.core.config', [])
    .config(cedarTemplateEditorCoreConfig);

  cedarTemplateEditorCoreConfig.$inject = ['$routeProvider', '$locationProvider', '$translateProvider', 'toastyConfigProvider'];

  function cedarTemplateEditorCoreConfig($routeProvider, $locationProvider, $translateProvider, toastyConfigProvider) {

    // configure routes
    $routeProvider
      .otherwise({
        redirectTo: '/'
      });
    
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
      sound: false,             // {bool} Whether to play a sound when a toast is added
      html: true,               // {bool} Whether HTML is allowed in toasts
      shake: false,             // {bool} Whether to shake the toasts
      theme: 'bootstrap'        // {string} What theme to use; default, material or bootstrap
    });
  };

});