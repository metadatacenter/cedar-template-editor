'use strict';

define([
  'angular',
  'cedar/template-editor/dashboard/dashboard.routes',
  'cedar/template-editor/dashboard/dashboard.controller',
  'cedar/template-editor/dashboard/dashboard-list.controller',
  'cedar/template-editor/dashboard/role-selector.controller',
  'cedar/template-editor/dashboard/box.directive',
  'cedar/template-editor/dashboard/resize-square.directive',
], function(angular) {
  angular.module('cedar.templateEditor.dashboard', [
    'cedar.templateEditor.dashboard.routes',

    'cedar.templateEditor.dashboard.dashboardController',
    'cedar.templateEditor.dashboard.dashboardListController',
    'cedar.templateEditor.dashboard.roleSelectorController',

    'cedar.templateEditor.dashboard.boxDirective',
    'cedar.templateEditor.dashboard.resizeSquareDirective',
  ]);
});