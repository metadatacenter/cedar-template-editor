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
  'cedar/template-editor/form/cedar-runtime-field.directive',
  'cedar/template-editor/modal/cedar-finder.directive',
  'cedar/template-editor/form/auto-focus.directive',
  'cedar/template-editor/form/constrained-value.directive',
  'cedar/template-editor/form/recommended-value.directive',
  'cedar/template-editor/form/cedar-pager.directive',
  'cedar/template-editor/form/field-toolbar.directive',
  'cedar/template-editor/search-browse/cedar-infinite-scroll.directive',
  'cedar/template-editor/search-browse/cedar-modal-show.directive',
  'cedar/template-editor/form/airr-submission-modal.directive',
  'cedar/template-editor/form/file-upload.directive',
  'cedar/template-editor/form/field-create/cardinality-selector.directive',


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
    'cedar.templateEditor.form.cedarRuntimeField',
    'cedar.templateEditor.modal.cedarFinderDirective',
    'cedar.templateEditor.form.autoFocusDirective',
    'cedar.templateEditor.form.constrainedValue',
    'cedar.templateEditor.form.recommendedValue',
    'cedar.templateEditor.form.cedarPager',
    'cedar.templateEditor.form.fieldToolbar',
    'cedar.templateEditor.searchBrowse.cedarInfiniteScrollDirective',
    'cedar.templateEditor.searchBrowse.cedarModalShowDirective',
    'cedar.templateEditor.form.airrSubmissionModal',
    'cedar.templateEditor.form.fileUpload',
    'cedar.templateEditor.form.fieldCreate.cardinalitySelector'

  ]);
});