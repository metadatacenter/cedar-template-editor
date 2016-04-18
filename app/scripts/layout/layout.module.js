'use strict';

define([
  'angular',
  'cedar/template-editor/layout/cedar-sticky-left-menu.directive',
  'cedar/template-editor/layout/close-navbar.directive',
  'cedar/template-editor/layout/header.controller',
  'cedar/template-editor/layout/header-mini.controller',
  'cedar/template-editor/layout/header.service',
  'cedar/template-editor/layout/switch-navbar.directive',
], function(angular) {
  angular.module('cedar.templateEditor.layout', [
    'cedar.templateEditor.layout.cedarStickyLeftMenuDirective',
    'cedar.templateEditor.layout.closeNavbarDirective',
    'cedar.templateEditor.layout.headerController',
    'cedar.templateEditor.layout.headerMiniController',
    'cedar.templateEditor.layout.headerService',
    'cedar.templateEditor.layout.switchNavbarDirective'
  ]);
});