'use strict';

define([
  'angular',
  'cedar/template-editor/controlled-term/cedar-child-tree.directive',
  'cedar/template-editor/controlled-term/cedar-class-tree.directive',
  'cedar/template-editor/controlled-term/cedar-controlled-term.directive',
  'cedar/template-editor/controlled-term/cedar-controlled-term-ontology-picker.directive',
  'cedar/template-editor/controlled-term/cedar-controlled-term-value-set-picker.directive',
  'cedar/template-editor/controlled-term/cedar-name-of-field.directive',
  'cedar/template-editor/controlled-term/provisional-class.service',
  'cedar/template-editor/controlled-term/controlled-term.service',
  'cedar/template-editor/controlled-term/controlled-term-data.service',
  'cedar/template-editor/controlled-term/html-to-plain-text.filter',
  'cedar/template-editor/controlled-term/return-null-if-empty.filter',
], function(angular) {
  angular.module('cedar.templateEditor.controlledTerm', [
    'cedar.templateEditor.controlledTerm.cedarChildTreeDirective',
    'cedar.templateEditor.controlledTerm.cedarClassTreeDirective',
    'cedar.templateEditor.controlledTerm.cedarControlledTermDirective',
    'cedar.templateEditor.controlledTerm.cedarControlledTermOntologyPickerDirective',
    'cedar.templateEditor.controlledTerm.cedarControlledTermValueSetPickerDirective',
    'cedar.templateEditor.controlledTerm.cedarNameOfFieldDirective',
    'cedar.templateEditor.controlledTerm.provisionalClassService',
    'cedar.templateEditor.controlledTerm.controlledTermService',
    'cedar.templateEditor.controlledTerm.controlledTermDataService',
    'cedar.templateEditor.controlledTerm.htmlToPlainTextFilter',
    'cedar.templateEditor.controlledTerm.returnNullIfEmptyFilter',
  ]);
});