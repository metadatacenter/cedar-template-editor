'use strict';

define([
  'angular',
  'cedar/template-editor/controlled-term/cedar-child-tree.directive',
  'cedar/template-editor/controlled-term/cedar-class-tree.directive',
  'cedar/template-editor/controlled-term/class-list.directive',
  'cedar/template-editor/controlled-term/property-list.directive',
  'cedar/template-editor/controlled-term/controlled-term.directive',
  'cedar/template-editor/controlled-term/controlled-term-search.directive',
  'cedar/template-editor/controlled-term/relation-type-selector.directive',
  'cedar/template-editor/controlled-term/provisional-class.service',
  'cedar/template-editor/controlled-term/controlled-term.service',
  'cedar/template-editor/controlled-term/controlled-term-data.service',
  'cedar/template-editor/controlled-term/autocomplete.service',
  'cedar/template-editor/controlled-term/html-to-plain-text.filter',
  'cedar/template-editor/controlled-term/return-null-if-empty.filter',
], function(angular) {
  angular.module('cedar.templateEditor.controlledTerm', [
    'cedar.templateEditor.controlledTerm.cedarChildTreeDirective',
    'cedar.templateEditor.controlledTerm.cedarClassTreeDirective',
    'cedar.templateEditor.controlledTerm.propertyListDirective',
    'cedar.templateEditor.controlledTerm.classListDirective',
    'cedar.templateEditor.controlledTerm.controlledTermDirective',
    'cedar.templateEditor.controlledTerm.controlledTermSearchDirective',
    'cedar.templateEditor.controlledTerm.relationTypeSelectorDirective',
    'cedar.templateEditor.controlledTerm.provisionalClassService',
    'cedar.templateEditor.controlledTerm.controlledTermService',
    'cedar.templateEditor.controlledTerm.autocompleteService',
    'cedar.templateEditor.controlledTerm.controlledTermDataService',
    'cedar.templateEditor.controlledTerm.htmlToPlainTextFilter',
    'cedar.templateEditor.controlledTerm.returnNullIfEmptyFilter'
  ]);
});
