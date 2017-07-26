/*jslint node: true */
/*global define */
'use strict';

define([
  // angular modules
  'angular',
  'lib/angucomplete-alt/angucomplete-alt',
  'lib/angular-animate/angular-animate.min',
  'lib/angular-bootstrap/ui-bootstrap-tpls.min',
  // 'lib/ngHandsontable/dist/ngHandsontable.min',
  'lib/ng-tags-input/ng-tags-input.min',
  'lib/angular-route/angular-route.min',
  'lib/angular-sanitize/angular-sanitize.min',
  'lib/angular-ui-select/dist/select.min',
  'lib/angular-ui-sortable/sortable.min',
  'lib/angular-ui-switch/angular-ui-switch.min',
  'lib/angular-ui-keypress/keypress.min',
  'lib/angular-translate/angular-translate.min',
  'lib/angular-translate-loader-static-files/angular-translate-loader-static-files.min',
  'lib/angular-toasty/dist/angular-toasty.min',

  // non-angular 3rd party libraries
  'lib/bootstrap/dist/js/bootstrap.min',
  'lib/bootstrap-select/dist/js/bootstrap-select.min',
  'lib/eonasdan-bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min',
  'lib/ng-ckeditor/ng-ckeditor.min',
  'ckeditor',
  'lib/handsontable/dist/handsontable.full',
  'jquery',
  'lib/jquery-ui/jquery-ui.min',
  'lib/perfnow-polyfill/perfnow-polyfill',
  'lib/sweetalert/dist/sweetalert.min',
  '3rdparty/angular-fitvids/angular-fitvids',
  'lib/angulartics/dist/angulartics.min',
  'lib/angulartics-google-analytics/dist/angulartics-google-analytics.min',
  'lib/ngprogress/build/ngprogress.min',
  'jsonld',

  // custom libraries
  'cedar/template-editor/handsontable/SpreadsheetContext',
  'cedar/template-editor/handsontable/MultiCheckboxEditor',

  // cedar template editor modules
  'cedar/template-editor/core/core.module',
  'cedar/template-editor/dashboard/dashboard.module',
  'cedar/template-editor/layout/layout.module',
  'cedar/template-editor/service/service.module',
  'cedar/template-editor/template/template.module',
  'cedar/template-editor/template-element/template-element.module',
  'cedar/template-editor/template-instance/template-instance.module',
  'cedar/template-editor/profile/profile.module',
  'cedar/template-editor/messaging/messaging.module',

  // search browse
  //'cedar/template-editor/search-browse/search-browse.module',

  // classic javascript, app data
  'cedar/template-editor/classic/app-data'
], function (angular, jsonld) {
  return angular.module('cedar.templateEditor', [
    'ui.bootstrap',
    'ui.keypress',
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
    'ngProgress',

    'cedar.templateEditor.core',
    'cedar.templateEditor.dashboard',
    'cedar.templateEditor.layout',
    'cedar.templateEditor.service',
    'cedar.templateEditor.template',
    'cedar.templateEditor.templateElement',
    'cedar.templateEditor.templateInstance',
    'cedar.templateEditor.profile',
    'cedar.templateEditor.messaging'
  ]);
});