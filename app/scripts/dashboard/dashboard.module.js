'use strict';

define([
  'angular',
  'cedar/template-editor/dashboard/dashboard.routes',
  'cedar/template-editor/dashboard/dashboard.controller',
  'cedar/template-editor/search-browse/cedar-search-browse-picker.directive',
  'cedar/template-editor/search-browse/cedar-infinite-scroll.directive',
  'cedar/template-editor/search-browse/cedar-dropdown-menu.directive',
  'cedar/template-editor/search-browse/cedar-modal-show.directive',
  'cedar/template-editor/search-browse/cedar-share-modal.directive',
  'cedar/template-editor/search-browse/cedar-move-modal.directive',
  'cedar/template-editor/search-browse/cedar-copy-modal.directive',
  'cedar/template-editor/search-browse/cedar-rename-modal.directive',
  'cedar/template-editor/search-browse/cedar-new-folder-modal.directive',
  'cedar/template-editor/search-browse/cedar-live-search.directive',
  'cedar/template-editor/form/auto-focus.directive',
  'cedar/template-editor/search-browse/flow-modal.directive'
], function(angular) {
  angular.module('cedar.templateEditor.dashboard', [
    'cedar.templateEditor.dashboard.routes',
    'cedar.templateEditor.dashboard.dashboardController',
    'cedar.templateEditor.searchBrowse.cedarSearchBrowsePickerDirective',
    'cedar.templateEditor.searchBrowse.cedarInfiniteScrollDirective',
    'cedar.templateEditor.searchBrowse.cedarDropdownMenuDirective',
    'cedar.templateEditor.searchBrowse.cedarModalShowDirective',
    'cedar.templateEditor.searchBrowse.cedarShareModalDirective',
    'cedar.templateEditor.searchBrowse.cedarMoveModalDirective',
    'cedar.templateEditor.searchBrowse.cedarCopyModalDirective',
    'cedar.templateEditor.searchBrowse.cedarRenameModalDirective',
    'cedar.templateEditor.searchBrowse.cedarNewFolderModalDirective',
    'cedar.templateEditor.searchBrowse.cedarLiveSearchDirective',
    'cedar.templateEditor.form.autoFocusDirective',
    'cedar.templateEditor.searchBrowse.flowModal'
  ]);
});