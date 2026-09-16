'use strict';

define([
  'angular',
  'cedar/template-editor/controlled-term/controlled-term.module',
  'cedar/template-editor/form/field.directive',
  'cedar/template-editor/form/form.directive',
  'cedar/template-editor/form/with-floating-label.directive',
  'cedar/template-editor/modal/cedar-finder.directive',
  'cedar/template-editor/modal/cedar-terms-modal.directive',
  'cedar/template-editor/form/auto-focus.directive',
  'cedar/template-editor/form/constrained-default.directive',
  'cedar/template-editor/search-browse/cedar-infinite-scroll.directive',
  'cedar/template-editor/search-browse/cedar-modal-show.directive',
  'cedar/template-editor/form/field-create/cardinality-selector.directive',
  'cedar/template-editor/modal/cedar-update-template-with-instances-modal.directive'


], function (angular) {
  angular.module('cedar.templateEditor.form', [
    'cedar.templateEditor.controlledTerm',
    'cedar.templateEditor.form.fieldDirective',
    'cedar.templateEditor.form.formDirective',
    'cedar.templateEditor.form.withFloatingLabelDirective',
    'cedar.templateEditor.modal.cedarFinderDirective',
    'cedar.templateEditor.modal.cedarTermsModalDirective',
    'cedar.templateEditor.form.autoFocusDirective',
    'cedar.templateEditor.form.constrainedDefault',
    'cedar.templateEditor.searchBrowse.cedarInfiniteScrollDirective',
    'cedar.templateEditor.searchBrowse.cedarModalShowDirective',
    'cedar.templateEditor.form.fieldCreate.cardinalitySelector',
    'cedar.templateEditor.modal.cedarUpdateTemplateWithInstancesModalDirective'


  ]);
});
