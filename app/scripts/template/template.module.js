'use strict';

define([
  'angular',
  'cedar/template-editor/form/form.module',
  'cedar/template-editor/template/template.routes',
  'cedar/template-editor/template/create-template.controller',
], function(angular) {
  angular.module('cedar.templateEditor.template', [
    'cedar.templateEditor.template.routes',
    'cedar.templateEditor.template.createTemplateController',
  ]);
});