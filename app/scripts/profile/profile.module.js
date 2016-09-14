'use strict';

define([
  'angular',
  'cedar/template-editor/profile/profile.routes',
  'cedar/template-editor/profile/profile.controller',
  'cedar/template-editor/profile/logout.controller',
  'cedar/template-editor/profile/privacy.controller',
], function (angular) {
  angular.module('cedar.templateEditor.profile', [
    'cedar.templateEditor.profile.routes',
    'cedar.templateEditor.profile.profileController',
    'cedar.templateEditor.profile.logoutController',
    'cedar.templateEditor.profile.privacyController',
  ]);
});