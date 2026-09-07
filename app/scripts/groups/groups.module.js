'use strict';

define([
  'angular',
  'cedar/template-editor/groups/groups.routes',
  'cedar/template-editor/groups/groups.controller'
], function (angular) {
  angular.module('cedar.templateEditor.groups', [
    'cedar.templateEditor.groups.routes',
    'cedar.templateEditor.groups.controller'
  ]);
});
