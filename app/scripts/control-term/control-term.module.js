'use strict';

define([
  'angular',
  'cedar/template-editor/control-term/child-tree.directive',
  'cedar/template-editor/control-term/class-tree.directive',
  'cedar/template-editor/control-term/control-term.directive',
  'cedar/template-editor/control-term/control-term.service',
  'cedar/template-editor/control-term/html-to-plain-text.filter',
  'cedar/template-editor/control-term/name-of-field.directive',
  'cedar/template-editor/control-term/return-null-if-empty.filter',
  'cedar/template-editor/control-term/control-term.controller',
], function(angular) {
  angular.module('cedar.templateEditor.controlTerm', [
    'cedar.templateEditor.controlTerm.childTreeDirective',
    'cedar.templateEditor.controlTerm.classTreeDirective',
    'cedar.templateEditor.controlTerm.controlTermDirective',
    'cedar.templateEditor.controlTerm.controlTermService',
    'cedar.templateEditor.controlTerm.htmlToPlainTextFilter',
    'cedar.templateEditor.controlTerm.nameOfFieldDirective',
    'cedar.templateEditor.controlTerm.returnNullIfEmptyFilter',
    'cedar.templateEditor.controlTerm.controlTermController',
  ]);
});