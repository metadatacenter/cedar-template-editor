'use strict';

define([
  'angular',
  'cedar/template-editor/form/form.module',
  'cedar/template-editor/template-element/template-element.routes',
  'cedar/template-editor/template-element/create-element.controller',
  'cedar/template-editor/template-element/element.directive',
  'cedar/template-editor/template-element/nested-element.directive',
], function(angular) {
  angular.module('cedar.templateEditor.templateElement', [
    'cedar.templateEditor.form',
    'cedar.templateEditor.templateElement.routes',
    'cedar.templateEditor.templateElement.createElementController',
    'cedar.templateEditor.templateElement.elementDirective',
    'cedar.templateEditor.templateElement.nestedElementDirective',
  ]);
});