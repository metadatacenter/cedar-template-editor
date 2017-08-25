'use strict';

define([
  'angular',
  'cedar/template-editor/runtime/runtime.module',
  'cedar/template-editor/template-instance/template-instance.routes',
  'cedar/template-editor/template-instance/create-instance.controller',
], function(angular) {
  angular.module('cedar.templateEditor.templateInstance', [
    'cedar.templateEditor.runtime',
    'cedar.templateEditor.templateInstance.routes',
    'cedar.templateEditor.templateInstance.createInstanceController',
  ]);
});