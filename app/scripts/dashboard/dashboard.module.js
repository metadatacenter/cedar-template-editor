'use strict';

define([
  'angular',
  'cedar/template-editor/dashboard/dashboard.routes',
  'cedar/template-editor/dashboard/dashboard.controller',
], function(angular) {
  angular.module('cedar.templateEditor.dashboard', [
    'cedar.templateEditor.dashboard.routes',
    'cedar.templateEditor.dashboard.dashboardController',
  ]);
});