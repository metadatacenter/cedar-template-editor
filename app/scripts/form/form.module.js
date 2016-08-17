'use strict';

define([
  'angular',
  'cedar/template-editor/controlled-term/controlled-term.module',
  'cedar/template-editor/form/added-field-item.directive',
  'cedar/template-editor/form/date-time-picker.directive',
  'cedar/template-editor/form/field.directive',
  'cedar/template-editor/form/form.directive',
  'cedar/template-editor/form/select-picker.directive',
  'cedar/template-editor/form/spreadsheet.service',
  'cedar/template-editor/form/with-floating-label.directive',
  'cedar/template-editor/form/no-image.directive',
  'cedar/template-editor/form/right-click.directive',
  'cedar/template-editor/finder/cedar-finder.directive',
], function(angular) {
  angular.module('cedar.templateEditor.form', [
    'cedar.templateEditor.controlledTerm',
    'cedar.templateEditor.form.addedFieldItemDirective',
    'cedar.templateEditor.form.dateTimePickerDirective',
    'cedar.templateEditor.form.fieldDirective',
    'cedar.templateEditor.form.formDirective',
    'cedar.templateEditor.form.selectPickerDirective',
    'cedar.templateEditor.form.spreadsheetService',
    'cedar.templateEditor.form.withFloatingLabelDirective',
    'cedar.templateEditor.form.noImageDirective',
    'cedar.templateEditor.form.rightClickDirective',
    'cedar.templateEditor.finder.cedarFinderDirective',
  ]);
});