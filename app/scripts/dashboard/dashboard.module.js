'use strict';

define([
  'angular',
  'cedar/template-editor/dashboard/dashboard.routes',
  'cedar/template-editor/dashboard/dashboard.controller',
  'cedar/template-editor/search-browse/cedar-search-browse-picker.directive',
  'cedar/template-editor/search-browse/cedar-infinite-scroll.directive',
], function(angular) {
  angular.module('cedar.templateEditor.dashboard', [
    'cedar.templateEditor.dashboard.routes',
    'cedar.templateEditor.dashboard.dashboardController',
    'cedar.templateEditor.searchBrowse.cedarSearchBrowsePickerDirective',
    'cedar.templateEditor.searchBrowse.cedarInfiniteScrollDirective'
  ]);
});