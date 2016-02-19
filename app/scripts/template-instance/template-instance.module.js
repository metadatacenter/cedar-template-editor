'use strict';

define([
  'angular',
  'cedar/template-editor/form/form.module',
  'cedar/template-editor/template-instance/template-instance.routes',
  'cedar/template-editor/template-instance/create-instance.controller',
], function(angular) {
  angular.module('cedar.templateEditor.templateInstance', [
    'cedar.templateEditor.form',
    'cedar.templateEditor.templateInstance.routes',
    'cedar.templateEditor.templateInstance.createInstanceController',
  ]);
});