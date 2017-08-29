'use strict';

define([
  'angular',
  'cedar/template-editor/runtime/runtime-form.directive',
  'cedar/template-editor/runtime/runtime-field.directive',
  'cedar/template-editor/runtime/field-toolbar.directive',
  'cedar/template-editor/runtime/cedar-pager.directive',
  'cedar/template-editor/runtime/spreadsheet.service',
  'cedar/template-editor/runtime/constrained-value.directive',
  'cedar/template-editor/runtime/recommended-value.directive',


], function(angular) {
  angular.module('cedar.templateEditor.runtime', [
    'cedar.templateEditor.runtime.runtimeFormDirective',
    'cedar.templateEditor.runtime.runtimeFieldDirective',
    'cedar.templateEditor.runtime.fieldToolbar',
    'cedar.templateEditor.runtime.cedarPager',
    'cedar.templateEditor.runtime.spreadsheetService',
    'cedar.templateEditor.runtime.constrainedValue',
    'cedar.templateEditor.runtime.recommendedValue',


  ]);
});