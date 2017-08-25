'use strict';

define([
  'angular',
  'cedar/template-editor/controlled-term/controlled-term.module',
  'cedar/template-editor/runtime/spreadsheet.service',
  'cedar/template-editor/runtime/field.directive',
  'cedar/template-editor/runtime/cedar-runtime-nested-element.directive',
  'cedar/template-editor/runtime/cedar-runtime-element.directive',
  'cedar/template-editor/runtime/runtime-form.directive',
  'cedar/template-editor/runtime/cedar-pager.directive',
  'cedar/template-editor/runtime/field-toolbar.directive',
  'cedar/template-editor/runtime/constrained-value.directive',
  'cedar/template-editor/runtime/recommended-value.directive'


], function(angular) {
  angular.module('cedar.templateEditor.runtime', [
    'cedar.templateEditor.controlledTerm',
    'cedar.templateEditor.runtime.spreadsheetService',
    'cedar/templateEditor.runtime.fieldDirective',
    'cedar.templateEditor.runtime.cedarRuntimeNestedElementDirective',
    'cedar.templateEditor.runtime.cedarRuntimeElement',
    'cedar.templateEditor.runtime.runtimeFormDirective',
    'cedar.templateEditor.runtime.cedarPager',
    'cedar.templateEditor.runtime.fieldToolbar',
    'cedar.templateEditor.runtime.constrainedValue',
    'cedar.templateEditor.runtime.recommendedValue'

  ]);
});


//cedar.templateEditor.templateInstance cedar.templateEditor.runtime templateEditor.runtime.runtimeFieldDirective templateEditor.runtime.runtimeFieldDirective
//cedar.templateEditor.templateInstance cedar.templateEditor.runtime templateEditor.runtime.runtimeFieldDirective templateEditor.runtime.runtimeFieldDirective

