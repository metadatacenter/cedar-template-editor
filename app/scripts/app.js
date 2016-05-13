/*jslint node: true */
/*global define */
'use strict';

define([
  // angular modules
  'angular',
  'lib/angucomplete-alt/angucomplete-alt',
  'lib/angular-animate/angular-animate',
  'lib/angular-bootstrap/ui-bootstrap',
  'lib/angular-bootstrap/ui-bootstrap-tpls',
  'lib/ngHandsontable/dist/ngHandsontable',
  'lib/angular-route/angular-route',
  'lib/angular-sanitize/angular-sanitize',
  'lib/angular-ui-select/dist/select',
  'lib/angular-ui-sortable/sortable',
  'lib/angular-translate/angular-translate',
  'lib/angular-translate-loader-static-files/angular-translate-loader-static-files',
  'lib/angular-toasty/dist/angular-toasty',


  // non-angular 3rd party libraries
  'lib/bootstrap/dist/js/bootstrap',
  'lib/bootstrap-select/dist/js/bootstrap-select.min',
  'lib/eonasdan-bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min',
  'lib/ng-ckeditor/ng-ckeditor',
  'ckeditor',
  'lib/handsontable/dist/handsontable.full',
  'jquery',
  'lib/jquery-ui/jquery-ui',
  'lib/perfnow-polyfill/perfnow-polyfill',
  'lib/sweetalert/dist/sweetalert.min',
  '3rdparty/angular-fitvids/angular-fitvids',
  'lib/angulartics/dist/angulartics.min',
  'lib/angulartics-google-analytics/dist/angulartics-google-analytics.min',

  // custom libraries
  'lib/custom/handsontable/SpreadsheetContext',
  'lib/custom/handsontable/MultiCheckboxEditor',

  // cedar template editor modules
  'cedar/template-editor/core/core.module',
  'cedar/template-editor/dashboard/dashboard.module',
  'cedar/template-editor/layout/layout.module',
  'cedar/template-editor/service/service.module',
  'cedar/template-editor/template/template.module',
  'cedar/template-editor/template-element/template-element.module',
  'cedar/template-editor/template-instance/template-instance.module',
  'cedar/template-editor/profile/profile.module',

  // search browse
  'cedar/template-editor/search-browse/search-browse.module',

  // classic javascript, app data
  'cedar/template-editor/classic/app-data'
], function(angular) {
  return angular.module('cedar.templateEditor', [
    'ui.bootstrap',
    'ngRoute',
    'ngAnimate',
    'ngSanitize',
    'ui.select',
    'ui.sortable',
    'pascalprecht.translate',
    'angular-toasty',
    'ngCkeditor',
    'fitVids',
    'angulartics',
    'angulartics.google.analytics',

    'cedar.templateEditor.core',
    'cedar.templateEditor.dashboard',
    'cedar.templateEditor.layout',
    'cedar.templateEditor.service',
    'cedar.templateEditor.template',
    'cedar.templateEditor.templateElement',
    'cedar.templateEditor.templateInstance',
    'cedar.templateEditor.profile'
  ]);
});