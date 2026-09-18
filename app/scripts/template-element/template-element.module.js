'use strict';

define([
  'angular',
  'cedar/template-editor/form/form.module',
  'cedar/template-editor/template-element/cedar-nested-template-element.directive',
  'cedar/template-editor/template-element/cedar-template-element.directive',
  'cedar/template-editor/widget/cedar-resource-icon.directive',
  'cedar/template-editor/template-element/create-element.controller',
  'cedar/template-editor/template-element/template-element.routes',
], function(angular) {
  angular.module('cedar.templateEditor.templateElement', [
    'cedar.templateEditor.form',
    'cedar.templateEditor.templateElement.cedarNestedTemplateElementDirective',
    'cedar.templateEditor.templateElement.cedarTemplateElementDirective',
    'cedar.templateEditor.widget.cedarResourceIconDirective',
    'cedar.templateEditor.templateElement.createElementController',
    'cedar.templateEditor.templateElement.routes',
  ]);
});