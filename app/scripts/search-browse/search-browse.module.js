'use strict';

define([
  'angular',
  'cedar/template-editor/service/cedar-user',
  'cedar/template-editor/search-browse/cedar-search-browse-picker.directive',
], function(angular) {
  angular.module('cedar.templateEditor.searchBrowse', [
    'cedar.templateEditor.searchBrowse.cedarSearchBrowsePickerDirective'
  ]);
});
