'use strict';

define([
  'angular',
  'cedar/template-editor/form/form.module',
  'cedar/template-editor/template-field/cedar-template-field.directive',
  'cedar/template-editor/template-field/create-field.controller',
  'cedar/template-editor/template-field/template-field.routes',
  'cedar/template-editor/widget/cedar-resource-icon.directive',
], function(angular) {
  angular.module('cedar.templateEditor.templateField', [
    'cedar.templateEditor.form',
    'cedar.templateEditor.templateField.cedarTemplateFieldDirective',
    'cedar.templateEditor.templateField.createFieldController',
    'cedar.templateEditor.templateField.routes',
    'cedar.templateEditor.widget.cedarResourceIconDirective',
  ]);
});